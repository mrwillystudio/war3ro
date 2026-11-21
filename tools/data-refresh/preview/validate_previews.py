"""Validate every catalog preview: hash, dimensions, transparency, and clipping."""
from pathlib import Path
import argparse
import hashlib
import json

import numpy as np
from PIL import Image


def validate(catalog, repo):
    rows = []
    for monster in catalog['monsters']:
        sid = monster['id']
        asset = catalog['assets'][monster['portrait']]
        path = Path(repo) / asset.removeprefix('./')
        source = monster['portraitSource']
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        assert actual == source['previewSha256'], (sid, 'image hash mismatch')
        with Image.open(path) as image:
            image.load()
            assert image.size == (512, 512), (sid, 'wrong dimensions')
            alpha = np.asarray(image.convert('RGBA'))[:, :, 3]
        assert alpha.min() == 0 and alpha.max() > 0, (sid, 'not transparent or empty')
        edge = max(int(alpha[0].max()), int(alpha[-1].max()),
                   int(alpha[:, 0].max()), int(alpha[:, -1].max()))
        assert edge == 0, (sid, 'edge clipping')
        yy, xx = np.where(alpha > 0)
        rows.append({'id': sid, 'imageSha256': actual, 'size': [512, 512],
                     'alphaBounds': [int(xx.min()), int(yy.min()), int(xx.max()), int(yy.max())],
                     'edgeAlphaMax': edge})
    return {'count': len(rows), 'allPassed': True, 'images': rows}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('catalog', type=Path, help='Uncompressed catalog JSON')
    parser.add_argument('repo', type=Path)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    report = validate(json.loads(args.catalog.read_text()), args.repo)
    if args.output:
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({'count': report['count'], 'allPassed': report['allPassed']}))
