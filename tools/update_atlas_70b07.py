from pathlib import Path
import urllib.request, json, base64, hashlib
blobs = ['e0f621189405e5b43b8ac614d0913ee4b237ca15', '144e3c048a7d1bfd52f1016538d822220b3a8502']
for n, sha in enumerate(blobs):
    req = urllib.request.Request('https://api.github.com/repos/mrwillystudio/war3ro/git/blobs/' + sha, headers={'Accept':'application/vnd.github+json','User-Agent':'atlas-transfer-verifier'})
    obj = json.load(urllib.request.urlopen(req))
    data = base64.b64decode(obj['content'])
    actual = hashlib.sha1(('blob %d\0' % len(data)).encode() + data).hexdigest()
    assert actual == sha
    Path('tools/transfer-%02d.bin' % n).write_bytes(data)
    print(n, sha, len(data))
