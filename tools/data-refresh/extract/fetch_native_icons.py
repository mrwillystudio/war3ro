"""Download the nine missing native icons from pinned, hash-checked sources."""
from pathlib import Path
import argparse
import hashlib
import json
import urllib.request

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('output', type=Path, help='Native asset root, usually WORK/map_extract/native_assets')
args = parser.parse_args()
plan = json.loads((Path(__file__).parent / 'native_icon_sources.json').read_text())
for row in plan['files']:
    target = args.output / row['path']
    if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest() == row['sha256']:
        continue
    data = urllib.request.urlopen(row['sourceUrl'], timeout=40).read()
    assert hashlib.sha256(data).hexdigest() == row['sha256'], row['path']
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
print(json.dumps({'verifiedNativeIcons': len(plan['files']), 'commit': plan['commit']}))
