# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

This is a Node.js server that emulates the HTTP API of a **BrightLink BL-8X8-HDBT-HD20** HDMI matrix switcher. The real hardware device exposes an HTTP API used by AV control systems; this server mimics that API so control software can be developed and tested without physical hardware.

The device is an 8×8 matrix: 8 HDMI inputs can be routed to 8 HDMI outputs and 8 HDBaseT (HDBT) outputs. HDMI and HDBT outputs are always switched in sync — changing an output's source changes both its HDMI and HDBT ports together.

## Running

```bash
npm start        # node server.js — serves on port 3000
```

No build step. The project uses ES modules (`"type": "module"` in package.json), so top-level `await` works and imports use `import`/`export` syntax.

## Architecture

Everything lives in `server.js` (single file). State is persisted to two JSON files in the project root:

- `saveState.json` — full device state (inputs, outputs, names, users, EDID config)
- `scenes.json` — 8 saved scenes (snapshots of output→input mappings)

Both files are created automatically on first run using default values if missing.

### HTTP API (emulating the real device)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `GET /all_dat.get*` | GET | Returns the full device state as a semicolon-delimited custom text string. See `all_dat.get.sample` for a real response example. |
| `POST /video.set` | POST | Accepts one or more `#`-delimited commands as plain text body. Routes to handlers based on command prefix. |
| `GET /ip.get` | GET | Returns empty string (stub) |
| `GET /` | GET | Serves `public/index.html` (the visualiser) — see Front ends below |

Static files in `public/` are served directly.

### Front ends

Three UIs ship in `public/`, all talking to the same API (directly, or through `/hw-proxy/*` for real hardware). Each has an explicit route in `server.js`, declared before `express.static`:

- `index.html` — the dark visualiser/controller built for this project; served at both `/` and `/index.html`
- `simple.html` — tile UI matching the [Laravel](https://github.com/ntbutler87/BLMatrixServer-Laravel) and [React Native](https://github.com/ntbutler87/BLMatrix) builds of this controller. Styles are ported from their `components2/CommonStyles.tsx`, `Pages/Matrix.tsx` and `Pages/Tabs/*.tsx`; `public/assets/*.png` are those projects' tile icons, and icon choice follows their `AppSettings.getImage()` automatic rules (icon picked from the port name).
- `original.html` — the real device's own web UI, captured; served at `/original.html`

Note both other projects render port connection state from `sig`, which is why they report "Disconnected" on working ports. `simple.html` uses `sig` for inputs and `hpd`/sink EDID for outputs instead — see `API_SPEC.md` §4.

### Command parsing (`POST /video.set`)

Commands arrive space-separated, multiple per request separated by `#`. The first token determines the handler:

- `video_*` → `handleVideoCommand` — routes video output to an input source
- `audio_*` → `handleAudioCommand` — sets audio input encoding or output IIS/SPDIF
- `edid_*` → `handleEdidCommand` — assigns an EDID to an input, or copies an output's EDID into a user slot
- `group*` → `handleSceneCommand` — save/recall/clear scenes (`exe=1/2/0`)
- `port` → `handlePortRename` — renames an input, HDMI output, or HDBT output port
- `register*` → `handleRegisterCommand` — sets a user's credentials (**0-based** slot index)
- `lcd`, `login`, `power`, `ip`, `system`, `factory` → stubs (not yet implemented)

The last character of the command token indicates the operation type: `d` = data/change, `l` = lock, `s` = save.

### State string format (`GET /all_dat.get`)

`generateStateStatusString()` produces the semicolon-delimited response. Key segments:

- `VO:NIN:M` — video output N is sourcing input M
- `E:NM:xD:y` — input N's EDID assignment (mode 0=Default, 1=User, 2=HDMI out, 3=HDBT out; slot 1-8)
- `AI:NM:X` — audio input N mode (0=mute, 1=HDMI, 2=analog)
- `AO:NHDMI/iis/spdif:X` — audio output settings (`iis` = analog/I²S out)
- `ded/ued/ied/oed_hdim/oed_hdbt` — EDID configuration blocks
- `port_i/port_ohdmi/port_ohdbt` — port name blocks
- `grp` — scene names
- `lod` — user credentials (username then password, both on separate `lodN:` lines)
- `INPORT:`, `OUTHDMIPORT:`, `OUTHDBTPORT:` — signal status blocks (comma-delimited per port, semicolon between ports)

Note: the `oed_hdim` key is a misspelling present in the real device firmware — preserve it exactly.
The response has no trailing `;` — it splits into exactly 160 segments.

**Full protocol reference: `API_SPEC.md`.** Read it before changing anything that parses or
emits the state string. In particular: an input has a source when `INPORT` `sig=1` (not
`pw5v`, which is always 1), and an output has a display when `OUTHDMIPORT`/`OUTHDBTPORT`
`hpd=1` or the matching `oed_*` EDID is not `Unplug` (not `sig`, which is 0 on working ports).
