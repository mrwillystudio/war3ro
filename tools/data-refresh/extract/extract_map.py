"""Extract and parse Warcraft III source data read-only into a separate workspace."""
from pathlib import Path
import argparse
import hashlib
import json

from mpq_read import Archive
from parse_objects import parse, parse_wts

FILES = ['war3map.j', 'war3map.wts', 'war3mapMisc.txt', 'war3mapSkin.txt',
         'war3mapUnits.doo', 'war3map.doo'] + ['war3map.' + suffix for suffix in
         ('w3t', 'w3u', 'w3a', 'w3b', 'w3d', 'w3h', 'w3q', 'w3i', 'w3e',
          'w3r', 'w3c', 'w3s', 'wpm', 'shd', 'wct', 'imp', 'mmp', 'wtg')]

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('map', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    out = args.output.resolve()
    extracted = out / 'extracted'
    extracted.mkdir(parents=True, exist_ok=True)
    archive = Archive(args.map)
    records = []
    for name in FILES:
        data = archive.read_file(name)
        if data is None:
            continue
        (extracted / name).write_bytes(data)
        records.append({'name': name, 'size': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
    wts = parse_wts(extracted / 'war3map.wts')
    (out / 'strings.json').write_text(json.dumps(wts, ensure_ascii=False, indent=2))
    for suffix in ('w3t', 'w3u', 'w3a', 'w3b', 'w3d', 'w3h', 'w3q'):
        source = extracted / ('war3map.' + suffix)
        if source.exists():
            data = parse(source, wts)
            (out / ('objects_' + suffix + '.json')).write_text(json.dumps(data, ensure_ascii=False, indent=2))
    report = {'sourceMapName': args.map.name,
              'sourceMapSha256': hashlib.sha256(args.map.read_bytes()).hexdigest(), 'files': records}
    (out / 'extraction_provenance.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({'sourceMapSha256': report['sourceMapSha256'], 'files': len(records)}))
