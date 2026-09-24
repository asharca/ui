"""Apply the reviewed, hash-checked text edits to the isolated feature branch.
No upstream build scripts are executed. This one-time helper removes itself.
"""
import hashlib
import json
import lzma
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import sys

ROOT = Path.cwd().resolve()
UPSTREAM = Path(sys.argv[1]).resolve()
PIN = '1e23f4b10a404c17d9649086cf561e152527e2de'
DIGEST = 'f503108a107b58961eee7dcba0a88ff466b85ad9af09cb6fa14d8112e74de0a5'
assert subprocess.check_output(['git', '-C', str(UPSTREAM), 'rev-parse', 'HEAD'], text=True).strip() == PIN
payload = b''.join((ROOT / '.beui-migration' / f'part-{index}.xz').read_bytes() for index in range(3))
assert hashlib.sha256(payload).hexdigest() == DIGEST, 'Migration payload changed'
entries = json.loads(lzma.decompress(payload))
assert isinstance(entries, list) and len(entries) == 94
allowed_dirs = {'docs', 'examples', 'registry', 'scripts', 'site', 'tests'}
allowed_files = {'README.md', 'THIRD_PARTY_NOTICES.md', 'package.json', 'pnpm-lock.yaml'}

def safe_path(base, name):
    path = PurePosixPath(name)
    assert not path.is_absolute() and path.parts and '..' not in path.parts and '.git' not in path.parts
    resolved = (base / path).resolve()
    assert resolved.is_relative_to(base)
    return resolved

outputs = {}
for entry in entries:
    name = entry['path']
    assert name in allowed_files or PurePosixPath(name).parts[0] in allowed_dirs
    target = safe_path(ROOT, name)
    assert target not in outputs, 'Duplicate target'
    if entry['source']:
        assert not target.exists(), 'New upstream target already exists'
        original = safe_path(UPSTREAM, entry['source']).read_text(encoding='utf-8')
    else:
        original = target.read_text(encoding='utf-8') if target.exists() else ''
    assert hashlib.sha256(original.encode()).hexdigest() == entry['before'], f'Original changed: {name}'
    lines = original.splitlines(keepends=True)
    previous_end = 0
    for start, end, replacement in entry['edits']:
        assert isinstance(replacement, str) and previous_end <= start <= end <= len(lines)
        previous_end = end
    for start, end, replacement in reversed(entry['edits']):
        lines[start:end] = replacement.splitlines(keepends=True)
    content = ''.join(lines)
    assert hashlib.sha256(content.encode()).hexdigest() == entry['after'], f'Reconstruction mismatch: {name}'
    outputs[target] = content

# Validate every output first, then apply the reviewed set together.
for target, content in outputs.items():
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding='utf-8')
shutil.rmtree(ROOT / '.beui-migration')
for name in ['.github/workflows/prepare-beui-agents.yml', '.github/workflows/complete-beui-agents.yml', 'scripts/complete-beui-agents.py']:
    (ROOT / name).unlink(missing_ok=True)
print(f'Applied {len(outputs)} reviewed files from pinned upstream {PIN}; temporary helpers removed.')
