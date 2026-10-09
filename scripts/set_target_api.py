#!/usr/bin/env python3
"""Set Android SDK target for 2026 Google Play policy; fail on unknown template."""
from pathlib import Path
import re, sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path('android')
paths=[root/'variables.gradle',root/'app/build.gradle']
found=False
for path in paths:
    if not path.exists(): continue
    raw=path.read_text()
    edited=raw
    for name in ('targetSdkVersion','compileSdkVersion','targetSdk','compileSdk'):
        edited,n=re.subn(r'(?m)(\b'+name+r'\s*(?:=\s*|\s+))\d+',lambda m:m.group(1)+'36',edited)
        if name in ('targetSdkVersion','targetSdk') and n:found=True
    if edited!=raw:path.write_text(edited)
if not found:raise SystemExit('ERROR: Unable to locate targetSdk; inspect generated Gradle files.')
print('Target Android API 36 configured.')
