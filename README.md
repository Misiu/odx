# OpenDisplay Studio

OpenDisplay Studio is a browser-based proof of concept for composing e-paper layouts. It adapts its grid to the selected display, lets users draw rectangular regions, assigns configurable widgets, saves projects locally, and exports device-sized PNG or JPG images.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`. The generated `dist/` directory is a self-contained static site that can be served by Netlify or any HTTP server.

## Current capabilities

- SOLUM Newton Pro display profiles from 1.6 to 12.2 inches, including freezer variants
- Seeed reTerminal, XIAO, and DIY OpenDisplay hardware profiles
- Custom Seeed EN04, EN05, EE04, and EE05 driver boards with connector-compatible verified panel presets
- Device-aware landscape and portrait grids
- Two-step workflow separating device/layout composition from widget configuration
- Two-corner region drawing with live hover preview and double-click removal
- Sensor history, weather, calendar, entity value, and text note widgets
- Widget-specific configuration with mock Home Assistant entities
- Browser-local persistence plus project JSON import/export
- Native-resolution PNG and JPG export with dimension and edge-completeness validation
- Home Assistant-compatible CSS theme variables and WebAwesome controls

## Editing workflow

1. Open **Device & layout** to choose the model, palette, orientation, and region composition. Changes remain a draft until **Apply layout** is selected.
2. Use **Widgets** to assign content and edit widget-specific options. Select **Edit device & layout** whenever the hardware setup or region structure needs to change.

The preview fits every device proportionally inside an 880 × 520 CSS-pixel canvas. Export still renders at the selected display's native pixel resolution.

## Architecture

The application uses Lit, TypeScript, Vite, and `@home-assistant/webawesome`. Device data, layout operations, persistence, and widgets are independent modules under `src/`.

Every widget lives in its own folder:

```text
src/widgets/<widget-name>/
├── widget.ts   # metadata, defaults, options, and Lit renderer
└── styles.ts   # styles owned by the widget
```

To add a widget, export a `WidgetDefinition` from a new folder and register it in `src/widgets/registry.ts`. Widget configuration stays serializable so projects can remain portable across local storage and the future Home Assistant integration.

## Validation

```bash
npm test
npm run build
```

## Data sources and next integration steps

Display profiles are based on the [SOLUM Newton Pro lineup](https://www.solum-group.com/esl-n-iot/product-lineup/professional-esl/newton-pro), [OpenDisplay hardware guidance](https://opendisplay.org/what-hardware-to-buy.html), and verified panel presets from the [OpenDisplay Toolbox](https://opendisplay.org/firmware/toolbox/index.html?driver=en04). The layout and rendering approach is informed by the [TRMNL Framework](https://trmnl.com/framework/docs/3.2), while keeping this POC self-contained.

The mock entity providers are intended to be replaced by a Home Assistant WebSocket/API adapter. A later delivery adapter can upload the rendered image through the OpenDisplay API without changing widget definitions.
