# Slide Studio

A structured slide editor for Hermes Desktop: edit slide text, choose a palette,
reorder slides, save a deck, and print slides to PDF. Hermes can propose five
slides from a topic or a replacement for selected text. Proposals require explicit
acceptance; stale proposals are rejected and edits can be undone.

This is an independent plugin, not an official Hermes release. It is not yet
published to a plugin catalog. Browser harness tests do not establish packaged
Desktop compatibility. Native Desktop installation, profile switching, and native
print dialogs still need end-to-end verification.

## Install in Hermes Desktop

Use a current Hermes Agent and Desktop that support bundled Agent + Desktop
plugins. The Python backend requires Python 3.10+, FastAPI and Pydantic 2; these
are declared in `pyproject.toml` so Hermes's package manager can prepare them.
The backend uses POSIX `fcntl` locking: Linux and macOS are intended targets;
native Windows is not supported.

1. Open Desktop's **Capabilities**, then **Plugins**, then **Install from Git**.
2. Paste `https://github.com/marcwestermann/hermes-slide-studio`.
   Review the resolved commit before approving installation.
3. Inspect the commit and permissions. The package should be detected as
   **Agent + Desktop**. Keep both targets checked and select the intended Agent
   profile/connection. The Agent half supplies persistence and inference; the
   Desktop half alone cannot provide these APIs.
4. Approve installation and any dependency preparation only after reviewing the
   source. Enable the Agent plugin for that profile and enable the Desktop plugin
   if it remains off (its default is disabled). Follow any restart/reload prompt.
5. Open **Slide Studio** in the sidebar. Configure a working Hermes model before
   using Generate or Improve selection.

The Desktop UI is app-wide while the Agent backend is profile-scoped. For a remote
backend, both targets are still needed: Agent on the selected backend and Desktop
on the local app. Do not assume a copied desktop file installs the backend.

These instructions follow the current upstream installer (`detectPluginComponents`
and `findDesktopEntry` in `apps/desktop/electron/desktop-plugin-install.ts`) and the
Install from Git review UI (`apps/desktop/src/app/settings/plugin-install-modal.tsx`).
The package ships `plugin.yaml`, `__init__.py`, `dashboard/plugin_api.py`, and
`desktop/plugin.js`, which are the supported bundled layout. See the official
[plugin documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
and [plugin catalog guide](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugin-catalog).
Installation instructions describe the supported flow, not a claim that this
snapshot has already passed a real Desktop installation.

## Data, costs, and limitations

- Save stores one deck in the active Hermes home's `slide-studio/deck.json`.
  Revision checks reject conflicting writes; invalid existing files are preserved.
- Generate sends your topic; Improve sends the selected text and instruction to
  the configured Hermes model. Provider data policies and inference charges apply.
  Model failures are reported rather than silently replaced with sample output.
- No collaboration, cloud sync, arbitrary HTML, or presentation-file import.
  Long text may clip on slides; review every PDF before sharing.
- The backend relies on the Hermes host's authentication boundary. Its routes do
  not independently authenticate callers, enforce origin checks, or budget model
  calls. Do not mount them on a public unauthenticated server.
- Multi-profile inference context isolation has not been verified. Avoid concurrent
  profile registrations until that lifecycle is tested.

## Local development

Node.js 22 and a Python environment with FastAPI, Pydantic 2, Uvicorn and HTTPX
are required. Use an isolated virtual environment for Python dependencies.

```sh
python -m venv .venv
. .venv/bin/activate
python -m pip install -e . uvicorn httpx
npm ci
npm run build
python -m unittest discover -s tests -p 'test_*.py'
npx playwright install chromium
python -m uvicorn dev.server:app --host 127.0.0.1 --port 18765
```

In a second terminal in the same checkout, run `npm test`. Browser tests require
that loopback server and use mocked model responses for interaction contracts;
they do not verify a real provider. Screenshots/PDFs are test outputs, not shipped
examples. The development harness uses `.dev-data`, not your Hermes deck. It does
not register an inference context: Generate/Improve return an error without test
mocks. Never bind it to a public interface. Loopback binding alone is not DNS
rebinding protection; run only in a trusted local development environment.

```sh
hermes plugins validate . --json
hermes plugins doctor . --ci
```

`dev/sample-extract.mjs` is an optional browser sample helper.
The editable sample document is `samples/focused-work.json`.

## License

MIT; see `LICENSE` for the retained copyright attribution.
