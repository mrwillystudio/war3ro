from pathlib import Path
import json,ast,hashlib
REV='82916514a12b7edb15252d42225cd8cc8ce61cfd'
def parse(path):
 data={};cur=None
 for line in path.read_text('utf-8-sig').splitlines():
  if not line.strip():continue
  if line.startswith('['):cur=line[1:-1];data[cur]={};continue
  k,v=line.split('=',1)
  if v.startswith('{') and v.endswith('}'):v='['+v[1:-1]+']'
  try:v=ast.literal_eval(v)
  except Exception:raise ValueError((path,k,v))
  data[cur][k]=v
 return data
