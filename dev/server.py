"""Loopback-only development harness. Not an alternative public deployment."""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path
from dashboard import plugin_api
from dashboard.plugin_api import router
# Harness persistence is isolated from real user decks, even on a Hermes machine.
def dev_storage():
    path = Path(os.environ.get('SLIDE_STUDIO_DEV_DATA', '.dev-data'))
    path.mkdir(mode=0o700, parents=True, exist_ok=True)
    return path
plugin_api.storage = dev_storage
app = FastAPI()
app.include_router(router, prefix='/api')
app.mount('/', StaticFiles(directory='dev/public', html=True), name='ui')
