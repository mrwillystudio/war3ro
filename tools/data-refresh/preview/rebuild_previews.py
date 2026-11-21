"""Reproduce the pinned preview set from a separately supplied source map.

The repository contains code and hashes only. Source MDX/BLP files stay in the
chosen work directory. A native dependency may be supplied locally or fetched
explicitly from the pinned public source; every dependency must match its hash.
"""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request

import numpy as np

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parent / 'extract'))
from mpq_read import Archive
from render_static import render


def sha(data):
    return hashlib.sha256(data).hexdigest()


def canonical(path, model=False):
    result = path.replace('\\', '/').lower()
    if model:
        if result.endswith('.mdl'):
            result = result[:-4] + '.mdx'
        elif not result.endswith('.mdx'):
            result += '.mdx'
    assert not result.startswith('/') and '..' not in result.split('/'), result
    return result


class Sources:
    def __init__(self, map_path, native_root, target, plan, fetch_native):
        self.archive = Archive(map_path)
        self.target = target
        self.plan = plan
        self.fetch_native = fetch_native
        self.cached = {}
        self.native = {str(p.relative_to(native_root)).lower(): p
                       for p in native_root.rglob('*') if p.is_file()} if native_root else {}

    def get(self, path, expected_sha, model=False):
        key = canonical(path, model)
        if key in self.cached:
            result, digest = self.cached[key]
            assert digest == expected_sha, (key, 'conflicting expected hashes')
            return result
        data = self.archive.read_file(key.replace('/', '\\'))
        if data is None:
            local = self.native.get(key)
            if local:
                data = local.read_bytes()
            elif self.fetch_native:
                url = ('https://raw.githubusercontent.com/' + self.plan['nativeSourceRepo'] + '/'
                       + self.plan['nativeSourceCommit'] + '/lowercase/' + urllib.parse.quote(key))
                data = urllib.request.urlopen(url, timeout=60).read()
            else:
                raise FileNotFoundError('Missing native dependency: ' + key)
        digest = sha(data)
        assert digest == expected_sha, (key, 'source hash mismatch', digest, expected_sha)
        result = self.target / key
        result.parent.mkdir(parents=True, exist_ok=True)
        result.write_bytes(data)
        self.cached[key] = result, digest
        return result


def sample(path, output, frame, camera):
    subprocess.run(['node', str(ROOT / 'sample_render.cjs'), str(path), str(output),
                    str(frame), str(camera['yaw']), str(camera['pitch'])],
                   check=True, stdout=subprocess.DEVNULL)
    return json.loads(output.read_text())


def merge_attachment(parent, child, spec):
    if not child['geosets']:
        return
    tokens = [x for x in re.split(r'[^a-z0-9]+', spec['point'].lower()) if x]
    node = next((node for node in parent['attachments']
                 if all(token in re.split(r'[^a-z0-9]+', node['name'].lower()) for token in tokens)), None)
    if node is None:
        raise ValueError('Missing attachment node: ' + spec['point'])
    transform = np.array(node['worldMatrix']).reshape(4, 4).T
    transform[:3, 3] = node['worldLocation']
    linear = transform[:3, :3]
    normal = np.linalg.inv(linear).T
    texture_base = len(parent['textures'])
    material_base = len(parent['materials'])
    geoset_base = len(parent['geosets'])
    parent['textures'].extend(child['textures'])
    for material in child['materials']:
        for layer in material['layers']:
            layer['textureId'] += texture_base
        parent['materials'].append(material)
    for index, geoset in enumerate(child['geosets']):
        vertices = np.array(geoset['vertices'])
        geoset['vertices'] = (vertices @ linear.T + transform[:3, 3]).tolist()
        normals = np.array(geoset['normals']) @ normal.T
        normals /= np.maximum(np.linalg.norm(normals, axis=1)[:, None], 1e-20)
        geoset['normals'] = normals.tolist()
        geoset['id'] = geoset_base + index
        geoset['materialId'] += material_base
        parent['geosets'].append(geoset)


def rebuild(row, sources, output):
    sid = row['id']
    camera = row['camera']
    scene_path = output / (sid + '.scene.json')
    model = sources.get(row['model'], row['modelSha256'], model=True)
    scene = sample(model, scene_path, row['frame'], camera)
    assert scene['sequence'] == row['sequence'], (sid, 'sequence mismatch')
    for index, spec in enumerate(row['attachments']):
        model = sources.get(spec['path'], spec['modelSha256'], model=True)
        child = sample(model, output / (sid + '.attachment-' + str(index) + '.json'),
                       spec['frame'], camera)
        merge_attachment(scene, child, spec)
    rgba = row.get('previewRGBA', [*row['modelColor'], 255])
    if rgba[3] != 255:
        for geoset in scene['geosets']:
            geoset['alpha'] *= rgba[3] / 255
    if 'framingMinZ' in row:
        scene['framingMinZ'] = row['framingMinZ']
        scene['framingException'] = row.get('framingException')
    for texture in scene['textures']:
        if texture['replaceableId'] in (1, 2):
            kind = 'teamcolor' if texture['replaceableId'] == 1 else 'teamglow'
            texture['originalPath'] = texture['path']
            texture['path'] = 'ReplaceableTextures\\' + kind + '\\' + kind + f"{row['teamColor']:02}.blp"
    for texture in row['textureSources']:
        if texture['found']:
            sources.get(texture['path'], texture['sha256'])
    scene_path.write_text(json.dumps(scene, separators=(',', ':')))
    report = render(scene_path, sources.target, output / (sid + '.webp'),
                    yaw=camera['yaw'], pitch=camera['pitch'], size=512, unit_color=rgba[:3])
    report['expectedPreviewSha256'] = row['previewSha256']
    report['imageHashMatches'] = report['previewSha256'] == row['previewSha256']
    report['runtimeColorSource'] = row.get('runtimeColorSource')
    report['previewRGBA'] = rgba
    (output / (sid + '.webp.json')).write_text(json.dumps(report, ensure_ascii=False, indent=2))
    return {'id': sid, 'imageHashMatches': report['imageHashMatches'],
            'previewSha256': report['previewSha256'], 'alphaBounds': report['alphaBounds']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--map', required=True, type=Path)
    parser.add_argument('--work-dir', required=True, type=Path)
    parser.add_argument('--native-root', type=Path)
    parser.add_argument('--fetch-native', action='store_true', help='Download verified pinned native dependencies')
    parser.add_argument('--plan', type=Path, default=ROOT / 'render-plan-70c08.json')
    parser.add_argument('--only', nargs='+', help='Selected Rawcodes; default is the complete fresh-render set')
    parser.add_argument('--allow-image-hash-difference', action='store_true',
                        help='Keep source verification strict, but allow output codec/runtime differences')
    args = parser.parse_args()
    plan = json.loads(args.plan.read_text())
    assert sha(args.map.read_bytes()) == plan['sourceMapSha256'], 'Wrong source map'
    output = args.work_dir.resolve()
    output.mkdir(parents=True, exist_ok=True)
    sources = Sources(args.map, args.native_root, output / 'source-assets', plan, args.fetch_native)
    selected = args.only or list(plan['renders'])
    reports = []
    for sid in selected:
        report = rebuild(plan['renders'][sid], sources, output)
        reports.append(report)
        print(json.dumps(report), flush=True)
    (output / 'reproduction-report.json').write_text(json.dumps(reports, indent=2))
    if not args.allow_image_hash_difference:
        assert all(row['imageHashMatches'] for row in reports), 'Output hash difference; inspect the reproduction report'
