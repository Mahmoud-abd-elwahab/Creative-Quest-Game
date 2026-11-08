#!/usr/bin/env python3
"""Character-owned QC for *approved* strip SpriteManifestV1 exports.

Authoring tool only; not an Engine importer. A concept poster and any
unapproved manifest must fail release validation.
Dependency: Pillow>=10 (authoring only, not bundled with game runtime).
"""
from __future__ import annotations
import argparse
import json
import math
from pathlib import Path
from PIL import Image

DIRECTIONS = ('down', 'left', 'right', 'up')
ALLOWED_ACTIONS = ('idle', 'walk', 'inspect', 'reason', 'reveal', 'hit')


def finite_positive(n):
    return type(n) in (int, float) and math.isfinite(n) and n > 0


def _int_positive(n):
    return type(n) is int and n > 0


def audit(manifest_path: Path, assets_root: Path, *, require_approval=True,
          margin=2, foot_drift=2, centre_drift=8):
    errors, warnings, samples = [], [], []
    try:
        m = json.loads(manifest_path.read_text(encoding='utf8'))
    except (OSError, ValueError) as exc:
        return {'passed': False, 'errors': [f'manifest read/parse failed: {exc}'],
                'warnings': [], 'frames': []}
    if m.get('schemaVersion') != 1:
        errors.append('schemaVersion must be 1 (SpriteManifestV1)')
    if not isinstance(m.get('characterId'), str) or not m['characterId']:
        errors.append('characterId missing/invalid')
    if require_approval and m.get('sourceApproved') is not True:
        errors.append('sourceApproved must be true for release QA')
    if not finite_positive(m.get('displayScale')):
        errors.append('displayScale must be finite positive number')
    hb = m.get('hitbox')
    if not isinstance(hb, dict) or any(type(hb.get(k)) not in (int, float)
            or not math.isfinite(hb[k]) for k in ('x','y','width','height')):
        errors.append('hitbox must have finite x/y/width/height world pixel values')
    elif hb['width'] <= 0 or hb['height'] <= 0:
        errors.append('hitbox width and height must be > 0')
    animations = m.get('animations')
    if not isinstance(animations, list) or not animations:
        errors.append('animations must be non-empty array')
        return {'passed':False,'errors':errors,'warnings':warnings,'frames':[]}
    ids=set()
    pairs=set()
    root=assets_root.resolve()
    for i,a in enumerate(animations):
        label=f'animation[{i}]'
        if not isinstance(a,dict):
            errors.append(f'{label}: must be object')
            continue
        name=a.get('id')
        if not isinstance(name,str) or not name:
            errors.append(f'{label}: id missing')
            continue
        if name in ids:
            errors.append(f'{name}: duplicate animation id')
        ids.add(name)
        action=a.get('action')
        direction=a.get('facing')
        if action not in ALLOWED_ACTIONS:
            errors.append(f'{name}: invalid action {action}')
        if direction not in DIRECTIONS:
            errors.append(f'{name}: invalid facing {direction}')
        if (action,direction) in pairs:
            errors.append(f'{name}: duplicate action+facing')
        pairs.add((action,direction))
        w,h,count,fps=[a.get(k) for k in ('frameWidth','frameHeight','frameCount','fps')]
        if not all(_int_positive(v) for v in (w,h,count)) or not finite_positive(fps):
            errors.append(f'{name}: frameWidth/Height/Count positive ints and fps positive finite required')
            continue
        pivot=a.get('pivot')
        if not isinstance(pivot,dict) or any(type(pivot.get(k)) not in (int,float)
                or not math.isfinite(pivot[k]) or not 0<=pivot[k]<=1 for k in ('x','y')):
            errors.append(f'{name}: pivot must be normalized 0..1 point')
            continue
        file=a.get('file')
        if not isinstance(file,str) or not file.endswith('.png'):
            errors.append(f'{name}: .png file required')
            continue
        path=(root / file).resolve()
        if not path.is_relative_to(root):
            errors.append(f'{name}: path escapes asset root')
            continue
        if not path.is_file():
            errors.append(f'{name}: missing file {file}')
            continue
        try:
            with Image.open(path) as im:
                im.load()
                if im.format!='PNG' or im.mode not in ('RGBA','LA'):
                    errors.append(f'{name}: must be PNG with alpha channel, got {im.mode}')
                    continue
                if im.size!=(w*count,h):
                    errors.append(f'{name}: PNG {im.size} != expected {(w*count,h)}')
                    continue
                alpha=im.getchannel('A')
                feet=[]
                cx=[]
                frame_data=[]
                for j in range(count):
                    frame=alpha.crop((w*j,0,w*(j+1),h))
                    box=frame.getbbox()
                    if box is None:
                        errors.append(f'{name}[{j}]: no visible pixels')
                        continue
                    l,t,r,b=box
                    feet.append(b)
                    cx.append((l+r)*0.5)
                    if l<margin or t<margin or r>w-margin or b>h-margin:
                        warnings.append(f'{name}[{j}]: alpha touches or nears {margin}px frame margin bbox={box}')
                    if frame.getextrema()[0]>0:
                        errors.append(f'{name}[{j}]: opaque/nontransparent cell background')
                    frame_data.append(bytes(im.crop((w*j,0,w*(j+1),h)).tobytes()))
                    samples.append({'animation':name,'index':j,'bbox':list(box),
                                    'footBottom':b,'centerX':(l+r)*0.5,'pivot':pivot})
                if feet and max(feet)-min(feet)>foot_drift:
                    warnings.append(f'{name}: sprite alpha bottom varies {max(feet)-min(feet)}px; inspect planted-foot jitter manually')
                if cx and max(cx)-min(cx)>centre_drift:
                    warnings.append(f'{name}: bounding center changes {max(cx)-min(cx):.2f}px; inspect silhouette jitter')
                if len(frame_data)>1 and len(set(frame_data))==1 and action=='walk':
                    warnings.append(f'{name}: all walk frames identical (no observed motion)')
        except (OSError,ValueError) as exc:
            errors.append(f'{name}: cannot decode PNG: {exc}')
    for action in ('idle','walk'):
        for facing in DIRECTIONS:
            if (action,facing) not in pairs:
                errors.append(f'missing required {action}/{facing}')
    return {'passed':not errors,'errors':errors,'warnings':warnings,
            'frames':samples,'summary':{'animations':len(animations),
            'framesExamined':len(samples),
            'coverage':{a:{d:(a,d) in pairs for d in DIRECTIONS} for a in ('idle','walk')}}}


def main():
    p=argparse.ArgumentParser(description='SpriteManifestV1 PNG QC; production-ready only after approvals')
    p.add_argument('manifest',type=Path)
    p.add_argument('--assets-root',type=Path,default=Path('public/assets/characters'))
    p.add_argument('--report',type=Path)
    args=p.parse_args()
    report=audit(args.manifest,args.assets_root)
    s=json.dumps(report,indent=2,ensure_ascii=False)
    print(s)
    if args.report:
        args.report.parent.mkdir(parents=True,exist_ok=True)
        args.report.write_text(s+'\n',encoding='utf8')
    raise SystemExit(0 if report['passed'] else 1)


if __name__=='__main__':
    main()
