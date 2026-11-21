"""Compile the local C rasterizer without changing any game asset."""
from pathlib import Path
import argparse
import subprocess

ROOT = Path(__file__).resolve().parent

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cc', default='cc')
    args = parser.parse_args()
    subprocess.run([args.cc, '-O3', '-shared', '-fPIC', str(ROOT / 'raster_rgba.c'),
                    '-o', str(ROOT / 'raster_rgba.so'), '-lm'], check=True)
    print(ROOT / 'raster_rgba.so')
