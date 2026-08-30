# BLMatrixServer

A Node.js emulator for the web server that runs on the **BrightLink BL-8X8-HDBT-HD20** HDMI matrix switcher, plus three web interfaces for driving it. It exists so controller software can be developed and tested without physical hardware — and, via the built-in hardware proxy, the same interfaces can drive a real unit when one is available.

The device is an 8×8 matrix: 8 HDMI inputs routed to 8 HDMI outputs and 8 HDBaseT outputs. HDMI output N and HDBT output N always switch together.

Implemented: video routing, scene save/recall, port renaming, audio input/output settings, EDID assignment, and user credentials. See [Emulator conformance](API_SPEC.md#8-emulator-conformance-serverjs) for what is stubbed.

## Running

```bash
npm install
npm start

> start
> node server.js

Example app listening on port 3000. Open on http://localhost:3000
```

That starts an Express server on port 3000. Point a controller under development at `<local_ip>:3000` and it should behave like the real unit.

## Interfaces

Three UIs ship in `public/`, each on its own URL. All three talk to the same API, so any of them can drive the emulator or — through the hardware proxy — a real matrix.

| URL | Interface | Best for |
|---|---|---|
| `/` and `/index.html` | **Visualiser / controller** | Watching state and patching on a desktop |
| `/simple.html` | **Tile UI** | Touch control on a tablet or wall panel |
| `/original.html` | **Captured firmware UI** | Comparing against what the real device serves |

### Visualiser / controller — `/`

![Screenshot of the visualisation dashboard.](/resources/visualiser.png)

Built for this project. Shows every input and output at a glance, with live patch lines between them, per-port signal and display-connected indicators, and a mock front panel.

- The mock front panel works like the real device's: tap an input then an output to route it, or start with the output and pick the input.
- The scene store/recall buttons work as expected.
- The routing matrix lets you queue several input→output changes and commit them in one request — considerably faster on real hardware than a full scene recall.
- The **Device IP** box in the header points the page at a real unit (leave it blank for the local emulator).

### Tile UI — `/simple.html`

![Screenshot of the tile interface.](/resources/simple-ui.png)

A port of the interface used by the two companion projects — the [Laravel/Inertia build](https://github.com/ntbutler87/BLMatrixServer-Laravel) and the [React Native iPad app](https://github.com/ntbutler87/BLMatrix) — so that look is available here without running either of those. Styling and layout are ported from their `components2/CommonStyles.tsx` and `Pages/Tabs/*.tsx`; the tile icons in `public/assets/` are those projects' PNGs, chosen automatically from each port's name exactly as their `AppSettings.getImage()` does.

Three tabs:

- **Scenes** — tap a scene to recall it (with the same confirmation prompt the other builds use)
- **Inputs** — tap an input to pick which outputs it feeds, several at once
- **Outputs** — tap an output to pick its input

Big touch targets and no hover states, so it suits a tablet. Configure the matrix address and any custom port names under **Settings**; these are stored server-side in `controller.db`, so every device opening the page shares them.

One deliberate difference from the projects it copies: those render port connection state from the `sig` field, which reports "Disconnected" on outputs that are working normally. This page uses `sig` for inputs and `hpd` for outputs — see [API_SPEC.md §4](API_SPEC.md#4-detecting-what-is-actually-plugged-in).

### Captured firmware UI — `/original.html`

The real device's own web page, captured verbatim from a live unit. Kept as the reference the API specification was derived from, and useful for checking emulator behaviour against the interface the hardware actually ships. Its Network tab stays blank against the emulator, which does not implement `/ip.get`.

## Controlling real hardware

The browser can't call a matrix directly — the device sends no CORS headers — so the server proxies:

```
GET  /hw-proxy/all_dat.get?target=http://192.168.1.100
POST /hw-proxy/video.set?target=http://192.168.1.100
```

Both interfaces use this automatically once you give them a device address. The emulator and a real unit are interchangeable from the UI's point of view.

## API specification

**[API_SPEC.md](API_SPEC.md)** documents the device's HTTP interface in full — reverse-engineered from the captured firmware UI and verified against a live-unit capture in `all_dat.get.sample`.

It covers:

- [**Transport**](API_SPEC.md#1-transport) — the two endpoints, the polling model, and why the cache-buster is glued to the path with no `?`
- [**Control commands**](API_SPEC.md#2-control-commands-post-videoset) — the `#`-delimited command format and every command, with ranges
- [**State response**](API_SPEC.md#3-state-response-get-all_datget) — the 160-segment map and what every block and field means
- [**Detecting what is actually plugged in**](API_SPEC.md#4-detecting-what-is-actually-plugged-in) — which fields report a connected source or display, and which look like they should but don't
- [**Parsing recipes**](API_SPEC.md#5-parsing-recipes), a [**gotchas checklist**](API_SPEC.md#6-gotchas-checklist), and a [**decoder for the firmware UI's own source**](API_SPEC.md#7-reading-the-stock-uis-source-publicoriginalhtml), whose element IDs invert what they name

Two findings worth knowing before writing any controller for this hardware:

- **Connection detection.** An input has a source when `sig=1`; `pw5v` reads 1 even on empty ports. An output has a display when `hpd=1` (or its `oed_*` EDID isn't `Unplug`); output `sig` reads 0 on ports that are driving a display perfectly well. Reading `sig` on outputs is what makes a controller report "nothing connected" while the projector is visibly showing.
- **No access control.** The device serves every username and password in plaintext to any unauthenticated client that can reach `GET /all_dat.get`; its login screen is browser JavaScript checked against that list. Put these units on a management VLAN and don't reuse their credentials.

## Project layout

```
server.js             Emulator, hardware proxy, and controller settings API
API_SPEC.md           Device HTTP API specification
CLAUDE.md             Notes for working on this codebase
all_dat.get.sample    Real state response captured from a live unit
public/
  index.html          Visualiser / controller
  simple.html         Tile UI
  original.html       Captured device web UI
  assets/             Tile icons
saveState.json        Emulated device state      (created on first run)
scenes.json           Emulated scene memory      (created on first run)
controller.db         Tile UI settings, SQLite   (created on first run)
```

Delete `saveState.json` and `scenes.json` to reset the emulated device to factory defaults.
