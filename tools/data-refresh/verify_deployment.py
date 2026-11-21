"""Verify production HTML, every data script, and all catalog model images."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--site', default='https://war3ro.mrwillytw.workers.dev/')
parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[2])
parser.add_argument('--catalog', type=Path, required=True)
parser.add_argument('--output', type=Path)
args = parser.parse_args()
repo = args.repo.resolve()
catalog = json.loads(args.catalog.read_text())
html = (repo / 'index.html').read_text()
files = {'index.html': ''}
for src in re.findall(r'<script\s+src="([^"]+)"', html):
    assert src.startswith('./atlas-data/'), ('unexpected script source', src)
    rel, _, query = src.removeprefix('./').partition('?')
    files[rel] = ('?' + query) if query else ''
models = {catalog['assets'][m['portrait']].removeprefix('./') for m in catalog['monsters']}
for rel in models:
    assert rel.startswith('atlas-models/'), rel
    files[rel] = ''

def check(entry):
    rel, query = entry
    url = args.site.rstrip('/') + '/' + ('' if rel == 'index.html' else rel) + query
    expected = hashlib.sha256((repo / rel).read_bytes()).hexdigest()
    try:
        response = subprocess.run(['curl', '--fail', '--silent', '--show-error',
                                   '--location', '--max-time', '45', '--write-out',
                                   '\n%{http_code}', url], capture_output=True)
        if response.returncode:
            raise RuntimeError(response.stderr.decode(errors='replace')[:500])
        body, raw_status = response.stdout.rsplit(b'\n', 1)
        status = int(raw_status)
        actual = hashlib.sha256(body).hexdigest()
        return {'path': rel, 'status': status, 'bytes': len(body),
                'expectedSha256': expected, 'actualSha256': actual,
                'passed': status == 200 and actual == expected}
    except Exception as error:
        return {'path': rel, 'passed': False, 'error': str(error)}

with ThreadPoolExecutor(max_workers=8) as pool:
    records = list(pool.map(check, files.items()))
report = {'site': args.site, 'version': catalog['meta']['version'],
          'modelImages': len(models), 'checkedFiles': len(records),
          'passed': all(r['passed'] for r in records), 'files': records}
if args.output:
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: v for k, v in report.items() if k != 'files'}, ensure_ascii=False))
for row in records:
    if not row['passed']:
        print(json.dumps(row, ensure_ascii=False))
raise SystemExit(0 if report['passed'] else 1)
