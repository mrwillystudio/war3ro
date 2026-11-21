# Reproducing the 7.0c08 model previews

These tools sample the map's actual classic MDX models and BLP textures. They
never modify the supplied map, models, textures, animation tracks, or game data.
Only code, source identifiers, dependency hashes, render parameters, verification
records, and final WebP images belong in this repository. Supply the map and
native game dependencies separately; keep extracted assets in a work directory
outside the repository.

## Recorded release

`render-plan-70c08.json` records all 189 freshly rendered previews: 186 existing
monsters and 3 newly cataloged monsters. It pins the supplied map's SHA-256,
every model/texture dependency, fixed attachments, sampled frames, camera and
color parameters, expected output hashes, and the native dependency source.
Every native preview was also rendered again with the required 12° left offset;
no previous-version image is retained. `preview-records-70c08.json` is the
portable catalog-assembly snapshot. Future catalogs must derive their count
from their records rather than hard-code these counts.

`team-color-evidence-70c08.json` records current script evidence for encounter
owners and explicit unit-color overrides. The preview uses the actual encounter
owner where it is established, including later ownership changes with
`RescueUnitBJ(..., true)`. For `nslv` and `nrdk`, the current spawn owner could not
be established: their existing reference palette is retained and a public
`teamColorNote` explicitly states that the in-game team color remains unverified.
This does not reuse their old images; both models were freshly rendered at 12°.

Native binary dependencies are pinned to `WarRaft/War3.mpq` commit
`842b1f155a4a0869783ac4bfc551b588ff9e8368`. The source assets are not distributed
here. The exact source map SHA-256 is
`0be2938f1e367bd8d560799d925694adda359421eecb08f77805dbb506683cf4`.

## Requirements and commands

The recorded environment uses Python 3.12.14, Node 24.22.3, NumPy 2.3.5,
Pillow 13.0.0, and a C compiler supporting shared libraries. The JavaScript
parser is bundled; no npm installation is needed. The compiled `.so` is local
and ignored by Git.

```sh
python -m pip install -r tools/data-refresh/preview/requirements.txt
python tools/data-refresh/preview/build_raster.py
python tools/data-refresh/extract/extract_map.py /path/to/source.w3x /tmp/ro-source
python tools/data-refresh/extract/fetch_native_defaults.py /tmp/ro-source
python tools/data-refresh/preview/rebuild_previews.py \
  --map /path/to/source.w3x \
  --native-root /path/to/extracted-native-assets \
  --work-dir /tmp/ro-previews
```

Alternatively replace `--native-root` with `--fetch-native` to retrieve only
needed dependencies from the pinned public source. Downloads are checked against
the exact SHA-256 values in the render plan. `--only Ulic UNMR O0NT` narrows a
reproduction run. Source-map and source-dependency hashes are always mandatory.
Output hashes are checked by default. A different image-library version can
change encoded bytes; `--allow-image-hash-difference` records those differences
without weakening source verification, and requires a separate visual review.

After assembling the uncompressed final catalog JSON, validate all referenced
images with the dynamic record count:

```sh
python tools/data-refresh/preview/validate_previews.py \
  /tmp/final_rodb.json /path/to/war3ro --output /tmp/preview-validation.json
```

The validator checks content hashes, image decode, 512×512 dimensions,
transparent background, a nonempty body, and transparent outer edges. It does
not replace visual inspection of faces, silhouettes, weapons, and attachments.

## Rendering behavior and limits

The sampler preserves source geometry and evaluates skinning, typed animated
track defaults, quaternion interpolation, global sequences, billboard transforms,
texture animation, and attachment-node transforms. Static GEOA colors are RGB;
animated KGAC values are BGR. The sampler normalizes these before the renderer
applies the MDX shader color order. BLP1 JPEG alpha is decoded before any Pillow
fallback so transparent clothing and effects retain their original alpha.

Images use a 12° left offset from the checked front baseline, 16° pitch,
orthographic framing, transparent 512×512 lossless WebP, and 2× supersampling.
The render plan stores per-model parameters, rather than relying on file names.
Only foot-level hero/team glow is omitted. Udth's clock ring, ghost bodies,
weapon effects, fixed equipment, and visible attachments remain. Additive black
contributes no transparent-image coverage. This is a static preview, without
particle emitters, ribbons, sound, or complete spell playback.

Uwar's Stand animation intentionally moves auxiliary pieces underground with
approximately 0.05 scale. Its documented `framingMinZ` excludes those points
from camera fitting only; rendering geometry is unchanged. UNMR uses the
current `NMR_Summon` RGBA `[85,110,230,217]`. O00C uses the initialization
trigger's 10% transparency, converted by Blizzard.j to alpha 229. These preview
overrides are separate from canonical object-editor color fields.

`verification-70c08-existing.json` records decode, dimensions, alpha bounds,
transparent-edge checks, and the visual review of all 186 existing monsters.
The native `uktg` ghost is intentionally faint: its visible materials use source
additive filter modes 3/4 with geoset alpha 1, rather than an absent body or an
animation-default failure. All 189 release images are also checked against the
assembled catalog by `validate_previews.py`.

## Source and license provenance

`tool-provenance.json` records the tool hashes and known source identifiers.
The existing `viewer_parser.cjs` bundle contains `gl-matrix` and
`package/src/parsers/mdlx` / `skeletalnode` modules corresponding to
`flowtsohg/mdx-m3-viewer`. Its exact original npm version and build repository
have not been recovered. The prior local provenance mentions source commit
`21a59211e9ca8adcd1fbfcdc739ce6fffb43387c`; this is **not asserted to be an
official mdx-m3-viewer commit**. The preserved bundle SHA-256 is
`90bc64581a8cfaee4e13c99349701f0682cb4cf18f7735e867199281ae53a54d`.
The MIT notices for the identifiable upstream modules are in `licenses/`.

The extraction directory preserves mpyq 0.2.5 under its BSD-2-Clause license.
Its sector count uses ceiling division, and decompression compares a sector's
stored length to that sector's expected remaining size. `mpq_read.py` adds the
read-only encrypted-sector and map-header handling used for this source map.
The native object defaults are separately pinned to `sumneko/w3x2lni` commit
`82916514a12b7edb15252d42225cd8cc8ce61cfd`, `enUS-1.27.1/prebuilt/Custom`.
Custom objects inherit this native baseline, not a map-modified original object.
