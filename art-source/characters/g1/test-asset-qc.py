#!/usr/bin/env python3
"""Self-contained temp-fixture tests. No synthetic sprites shipped."""
import json
import tempfile
import unittest
from pathlib import Path
from PIL import Image, ImageDraw
from importlib.machinery import SourceFileLoader
qc=SourceFileLoader('asset_qc',str(Path(__file__).with_name('asset-qc.py'))).load_module()

class SpriteQCTests(unittest.TestCase):
    def setUp(self):
        self.t=tempfile.TemporaryDirectory()
        self.addCleanup(self.t.cleanup)
        self.root=Path(self.t.name)
        self.manifest=self.root/'manifest.json'
        self.data={'schemaVersion':1,'characterId':'test-fixture','sourceApproved':True,
                   'displayScale':0.5,'hitbox':{'x':-4,'y':-6,'width':8,'height':6},'animations':[]}
        for action in ('idle','walk'):
            for direction in qc.DIRECTIONS:
                filename=f'{action}-{direction}.png'
                im=Image.new('RGBA',(96,40),(0,0,0,0))
                p=ImageDraw.Draw(im)
                for j in range(3):
                    shift=0 if action=='idle' else (j%2)
                    p.rectangle((j*32+10+shift,8,j*32+20+shift,36),fill=(39,100,86,255))
                im.save(self.root/filename)
                self.data['animations'].append({'id':f'{action}-{direction}',
                    'action':action,'facing':direction,'file':filename,'frameWidth':32,
                    'frameHeight':40,'frameCount':3,'fps':6,'pivot':{'x':0.5,'y':0.93}})
        self._save()
    def _save(self):self.manifest.write_text(json.dumps(self.data))
    def run_qc(self):return qc.audit(self.manifest,self.root)
    def test_synthetic_8_action_pack_passes(self):
        r=self.run_qc()
        self.assertTrue(r['passed'],r['errors'])
        self.assertEqual(r['summary']['framesExamined'],24)
    def test_missing_direction_fails(self):
        self.data['animations'].pop()
        self._save()
        self.assertIn('missing required walk/up',self.run_qc()['errors'])
    def test_unapproved_source_rejected(self):
        self.data['sourceApproved']=False
        self._save()
        self.assertTrue(any('sourceApproved' in e for e in self.run_qc()['errors']))
    def test_out_of_bounds_strip_fails(self):
        self.data['animations'][0]['frameCount']=4
        self._save()
        self.assertTrue(any('PNG' in e and 'expected' in e for e in self.run_qc()['errors']))
    def test_opaque_background_fails(self):
        p=self.root/'idle-down.png'
        im=Image.new('RGBA',(96,40),(20,20,20,255))
        im.save(p)
        self.assertTrue(any('background' in e for e in self.run_qc()['errors']))
    def test_path_escape_rejected(self):
        self.data['animations'][0]['file']='../../private.png'
        self._save()
        self.assertTrue(any('path escapes' in e for e in self.run_qc()['errors']))
    def test_bad_pivot_rejected(self):
        self.data['animations'][0]['pivot']['y']=1.6
        self._save()
        self.assertTrue(any('pivot' in e for e in self.run_qc()['errors']))

if __name__=='__main__':unittest.main(verbosity=2)
