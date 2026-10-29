from pathlib import Path
import urllib.request, json, base64, hashlib
blobs = ['c93151d337becb8c88259191d050c1ee7082a2fc', '3c035b69170976e7e370b30aee526c116a2d860d']
for n, sha in enumerate(blobs):
    req = urllib.request.Request('https://api.github.com/repos/mrwillystudio/war3ro/git/blobs/' + sha, headers={'Accept':'application/vnd.github+json','User-Agent':'atlas-transfer-verifier'})
    obj = json.load(urllib.request.urlopen(req))
    data = base64.b64decode(obj['content'])
    actual = hashlib.sha1(('blob %d\0' % len(data)).encode() + data).hexdigest()
    assert actual == sha
    Path('tools/transfer-%02d.bin' % n).write_bytes(data)
    print(n, sha, len(data))
