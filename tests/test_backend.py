import unittest
from unittest.mock import patch
from tempfile import TemporaryDirectory
from pathlib import Path
from fastapi import HTTPException
from dashboard import plugin_api as api


def deck():
    return {'id':'test','revision':0,'theme':'ink','slides':[{'id':'s1','layout':'hero','headline':'Title','body':'Body','kicker':'TEST'}]}


class BackendTests(unittest.TestCase):
    def test_atomic_cas(self):
        with TemporaryDirectory() as root, patch.object(api,'storage',return_value=Path(root)):
            saved=api.put_deck(api.Save(document=deck()))
            self.assertEqual(saved['revision'],1)
            self.assertEqual(api.get_deck(),saved)
            with self.assertRaises(HTTPException) as ctx:
                api.put_deck(api.Save(document=deck()))
            self.assertEqual(ctx.exception.status_code,409)

    def test_malformed_saved_shapes_are_preserved(self):
        for raw in ('[]', 'null', '"text"', '42', '{}', '{"revision": 0}'):
            with self.subTest(raw=raw), TemporaryDirectory() as root, patch.object(api, 'storage', return_value=Path(root)):
                file = Path(root) / 'deck.json'
                file.write_text(raw)
                with self.assertRaises(HTTPException) as ctx:
                    api.put_deck(api.Save(document=deck()))
                self.assertEqual(ctx.exception.status_code, 409)
                self.assertEqual(file.read_text(), raw)

    def test_duplicate_ids(self):
        doc=deck();doc['slides']*=2
        with self.assertRaises(ValueError): api.validate(doc)

    def test_extra_fields(self):
        doc=deck();doc['slides'][0]['html']='<script/>'
        with self.assertRaises(ValueError): api.validate(doc)

    def test_bad_model_output(self):
        with patch.object(api,'infer',return_value={'slides':[]}):
            with self.assertRaises(HTTPException): api.generate(api.Generate(topic='test'))
        with patch.object(api,'infer',return_value={'text':{'html':'unsafe'}}):
            with self.assertRaises(HTTPException): api.improve(api.Improve(text='hi',instruction='shorter'))

    def test_corrupt_save_is_preserved(self):
        with TemporaryDirectory() as root, patch.object(api,'storage',return_value=Path(root)):
            file=Path(root)/'deck.json';file.write_text('not json')
            with self.assertRaises(HTTPException): api.put_deck(api.Save(document=deck()))
            self.assertEqual(file.read_text(),'not json')

if __name__=='__main__': unittest.main()
