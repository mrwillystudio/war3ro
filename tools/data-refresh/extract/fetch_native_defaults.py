"""Fetch the pinned Warcraft 1.27.1 Custom baseline and verify every file hash."""
from pathlib import Path
import argparse
import hashlib
import json
import urllib.request

from parse_native import parse

ROOT = Path(__file__).resolve().parent

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    plan = json.loads((ROOT / 'native_defaults_sources.json').read_text())
    out = args.output.resolve()
    (out / 'native').mkdir(parents=True, exist_ok=True)
    for row in plan['sources']:
        kind = row['kind']
        url = ('https://raw.githubusercontent.com/sumneko/w3x2lni/' + plan['commit']
               + '/data/enUS-1.27.1/prebuilt/Custom/' + kind + '.ini')
        source = out / 'native' / (kind + '-1.27.1.ini')
        data = urllib.request.urlopen(url, timeout=60).read()
        assert hashlib.sha256(data).hexdigest() == row['sha256'], (kind, 'source hash mismatch')
        source.write_bytes(data)
        parsed = parse(source)
        assert len(parsed) == row['count'], (kind, 'record count mismatch')
        (out / ('native_' + kind + '_127.json')).write_text(json.dumps(parsed, ensure_ascii=False, indent=2))
        print(kind, len(parsed))
    (out / 'native_provenance.json').write_text(json.dumps(plan, ensure_ascii=False, indent=2))
