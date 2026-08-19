import { css } from 'lit'

export const appStyles = css`
  :host {
    --odx-blue: var(--primary-color, #03a9f4);
    --odx-blue-strong: #0086c5;
    --odx-ink: var(--primary-text-color, #182026);
    --odx-muted: var(--secondary-text-color, #66727a);
    --odx-canvas: var(--primary-background-color, #f4f6f7);
    --odx-surface: var(--card-background-color, #ffffff);
    --odx-line: var(--divider-color, #dfe4e7);
    --odx-warning: var(--warning-color, #f4a000);
    --odx-danger: var(--error-color, #db4437);
    --odx-radius: var(--ha-card-border-radius, 14px);
    --odx-canvas-max-width: 880px;
    --odx-canvas-max-height: 520px;
    display: block;
    min-width: 320px;
    min-height: 100svh;
    color: var(--odx-ink);
    background: var(--odx-canvas);
    font-family: Roboto, 'Segoe UI', system-ui, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    color: inherit;
  }

  .app-shell {
    height: 100svh;
    min-height: 100svh;
    display: grid;
    grid-template-rows: 64px minmax(0, 1fr);
  }

  .topbar {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr) auto;
    align-items: center;
    gap: 20px;
    padding: 0 20px 0 14px;
    border-bottom: 1px solid var(--odx-line);
    background: color-mix(in srgb, var(--odx-surface) 96%, transparent);
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    background: var(--odx-ink);
    color: var(--odx-surface);
    border-radius: 10px 10px 10px 2px;
    font: 800 12px/1 ui-monospace, SFMono-Regular, Consolas, monospace;
    letter-spacing: -0.04em;
  }

  .brand-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .brand-copy strong {
    font-size: 14px;
    letter-spacing: -0.01em;
  }

  .brand-copy span {
    font-size: 10px;
    color: var(--odx-muted);
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .project-title {
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .project-context {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-4, 16px);
  }

  .workflow {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    color: var(--odx-muted);
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  .workflow span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .workflow b {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border: 1px solid var(--odx-line);
    border-radius: 50%;
    background: var(--odx-surface);
    font: 800 10px/1 ui-monospace, Consolas, monospace;
  }

  .workflow .active {
    color: var(--odx-blue-strong);
  }

  .workflow .active b,
  .workflow .complete b {
    border-color: var(--odx-blue);
    background: color-mix(in srgb, var(--odx-blue) 13%, var(--odx-surface));
  }

  .workflow i {
    width: 22px;
    height: 1px;
    background: var(--odx-line);
  }

  .project-title strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 16px;
  }

  .autosave-state {
    color: var(--odx-muted);
    font-size: 12px;
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .workspace {
    min-height: 0;
    display: grid;
    grid-template-columns: 220px minmax(480px, 1fr) 328px;
  }

  .welcome-topbar {
    grid-template-columns: 220px minmax(0, 1fr) auto;
  }

  .welcome-topline {
    color: var(--odx-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .workspace.welcome-workspace {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  .empty-rail {
    min-height: 0;
  }

  .empty-library {
    min-height: 0;
    flex: 1 1 auto;
    display: grid;
    place-content: center;
    justify-items: center;
    padding: var(--ha-space-6, 24px) var(--ha-space-2, 8px);
    color: var(--odx-muted);
    text-align: center;
  }

  .empty-library-count {
    width: 46px;
    height: 30px;
    margin-block-end: var(--ha-space-3, 12px);
    display: grid;
    place-items: center;
    border: 2px solid var(--odx-ink);
    background: var(--odx-surface);
    color: var(--odx-ink);
    font: 800 10px/1 ui-monospace, Consolas, monospace;
  }

  .empty-library strong {
    color: var(--odx-ink);
    font-size: 13px;
  }

  .empty-library p {
    max-width: 150px;
    margin: 5px 0 0;
    font-size: 11px;
    line-height: 1.45;
  }

  .import-empty {
    width: 100%;
    justify-content: center;
  }

  .welcome-main {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(360px, 1fr) minmax(380px, 1fr);
    align-items: center;
    gap: clamp(28px, 4vw, 56px);
    overflow: auto;
    padding: clamp(28px, 4vw, 64px);
    background-color: var(--odx-canvas);
    background-image: radial-gradient(circle, color-mix(in srgb, var(--odx-muted) 24%, transparent) 1px, transparent 1px);
    background-size: 18px 18px;
  }

  .welcome-copy {
    max-width: 560px;
  }

  .welcome-copy h1 {
    max-width: 640px;
    margin: var(--ha-space-3, 12px) 0 var(--ha-space-4, 16px);
    color: var(--odx-ink);
    font-size: clamp(34px, 4vw, 54px);
    line-height: 0.98;
    letter-spacing: -0.055em;
  }

  .welcome-copy > p {
    max-width: 540px;
    margin: 0;
    color: var(--odx-muted);
    font-size: 15px;
    line-height: 1.65;
  }

  .welcome-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-3, 12px);
    margin-block: var(--ha-space-5, 20px) var(--ha-space-6, 24px);
  }

  .welcome-facts {
    margin: 0;
    display: grid;
    gap: 0;
    border-block: 1px solid var(--odx-line);
  }

  .welcome-facts div {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: var(--ha-space-3, 12px);
    padding-block: var(--ha-space-3, 12px);
    border-bottom: 1px solid var(--odx-line);
  }

  .welcome-facts div:last-child {
    border-bottom: 0;
  }

  .welcome-facts dt {
    color: var(--odx-blue-strong);
    font: 800 11px/1.4 ui-monospace, Consolas, monospace;
  }

  .welcome-facts dd {
    margin: 0;
  }

  .welcome-facts strong,
  .welcome-facts span {
    display: block;
  }

  .welcome-facts strong {
    font-size: 12px;
  }

  .welcome-facts span {
    margin-block-start: 3px;
    color: var(--odx-muted);
    font-size: 11px;
  }

  .welcome-visual {
    width: min(100%, 720px);
    justify-self: center;
  }

  .welcome-device-meta {
    display: flex;
    justify-content: space-between;
    margin-block-end: var(--ha-space-3, 12px);
    color: var(--odx-muted);
    font: 700 10px/1 ui-monospace, Consolas, monospace;
    letter-spacing: 0.08em;
  }

  .welcome-device {
    padding: clamp(10px, 1.6vw, 16px);
    border-radius: clamp(14px, 2vw, 26px);
    background: #25292c;
    box-shadow: 0 24px 70px rgba(31, 43, 50, 0.24), 0 3px 9px rgba(31, 43, 50, 0.24);
  }

  .welcome-screen {
    aspect-ratio: 5 / 3;
    padding: 6px;
    display: grid;
    grid-template-columns: 1.4fr 0.6fr;
    grid-template-rows: 1fr 0.62fr;
    gap: 5px;
    background: #fffdf4;
  }

  .welcome-region {
    position: relative;
    overflow: hidden;
    border: 2px solid #111;
    color: #111;
    background: #fffdf4;
  }

  .welcome-region > span {
    position: absolute;
    inset-block-start: 7px;
    inset-inline-start: 9px;
    color: #c82723;
    font: 800 10px/1 ui-monospace, Consolas, monospace;
  }

  .welcome-region-a {
    padding: 22% 10px 10px;
  }

  .welcome-region-a i {
    display: block;
    height: 3px;
    margin-block-start: 12%;
    background: #c82723;
    transform: rotate(-5deg);
  }

  .welcome-region-a i:last-child {
    width: 68%;
    margin-inline-start: 20%;
    background: #285995;
    transform: rotate(7deg);
  }

  .welcome-region-b {
    display: grid;
    place-content: center;
    text-align: center;
  }

  .welcome-region-b b {
    font-size: clamp(28px, 5vw, 58px);
    letter-spacing: -0.08em;
  }

  .welcome-region-b small {
    color: #285995;
    font-size: 8px;
    font-weight: 800;
  }

  .welcome-region-c {
    grid-column: 1 / -1;
    display: grid;
    align-content: center;
    gap: 10%;
    padding: 8% 12px 8px;
  }

  .welcome-region-c em {
    height: 2px;
    background: #111;
  }

  .welcome-palette {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    margin-block-start: var(--ha-space-3, 12px);
  }

  .welcome-palette i {
    width: 11px;
    height: 11px;
    border: 1px solid color-mix(in srgb, var(--odx-ink) 35%, transparent);
    border-radius: 50%;
  }

  .welcome-palette i:nth-child(1) { background: #fff; }
  .welcome-palette i:nth-child(2) { background: #111; }
  .welcome-palette i:nth-child(3) { background: #c82723; }
  .welcome-palette i:nth-child(4) { background: #e5b600; }
  .welcome-palette i:nth-child(5) { background: #285995; }
  .welcome-palette i:nth-child(6) { background: #72a85a; }

  .welcome-palette span {
    margin-inline-start: 5px;
    color: var(--odx-muted);
    font: 700 9px/1 ui-monospace, Consolas, monospace;
    letter-spacing: 0.06em;
  }

  .project-rail,
  .inspector {
    min-height: 0;
    background: var(--odx-surface);
  }

  .project-rail {
    overflow: hidden;
    border-right: 1px solid var(--odx-line);
    padding: 18px 12px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .rail-heading,
  .inspector-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .rail-heading h2,
  .inspector-heading h2 {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .text-button {
    appearance: none;
    border: 0;
    background: transparent;
    padding: 5px;
    color: var(--odx-blue-strong);
    font-weight: 700;
    cursor: pointer;
    border-radius: 6px;
  }

  .text-button:hover,
  .text-button:focus-visible {
    background: color-mix(in srgb, var(--odx-blue) 12%, transparent);
    outline: none;
  }

  .project-list {
    min-height: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: auto;
  }

  .project-card {
    width: 100%;
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 10px;
    background: transparent;
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    text-align: left;
    cursor: pointer;
  }

  .project-card:hover {
    background: var(--odx-canvas);
  }

  .project-card.active {
    background: color-mix(in srgb, var(--odx-blue) 10%, var(--odx-surface));
    border-color: color-mix(in srgb, var(--odx-blue) 38%, var(--odx-line));
  }

  .mini-screen {
    width: 42px;
    aspect-ratio: var(--mini-aspect, 1.6);
    border: 2px solid var(--odx-ink);
    background: #fefefe;
    display: grid;
    place-items: center;
    font: 700 8px/1 ui-monospace, Consolas, monospace;
  }

  .project-card-copy {
    min-width: 0;
  }

  .project-card-copy strong,
  .project-card-copy span {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .project-card-copy strong {
    font-size: 13px;
  }

  .project-card-copy span {
    margin-top: 3px;
    color: var(--odx-muted);
    font-size: 11px;
  }

  .rail-footer {
    padding: 12px 8px 2px;
    border-top: 1px solid var(--odx-line);
    color: var(--odx-muted);
    font-size: 11px;
    line-height: 1.5;
  }

  .rail-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .rail-action {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
    border: 1px solid var(--odx-line);
    border-radius: 8px;
    background: var(--odx-surface);
    color: var(--odx-muted);
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .rail-action:hover,
  .rail-action:focus-visible {
    border-color: var(--odx-blue);
    color: var(--odx-blue-strong);
    outline: none;
  }

  .rail-action:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .rail-action:disabled:hover,
  .rail-action:disabled:focus-visible {
    border-color: var(--odx-line);
    color: var(--odx-muted);
  }

  .rail-action.danger:hover,
  .rail-action.danger:focus-visible {
    border-color: var(--odx-danger);
    color: var(--odx-danger);
  }

  .rail-action svg {
    width: 15px;
    height: 15px;
    flex: none;
    fill: currentColor;
  }

  .editor {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .device-toolbar {
    padding: 12px 16px;
    border-bottom: 1px solid var(--odx-line);
    background: color-mix(in srgb, var(--odx-surface) 85%, var(--odx-canvas));
    display: flex;
    align-items: end;
    gap: 10px;
    flex-wrap: wrap;
  }

  .widget-toolbar {
    align-items: center;
    justify-content: space-between;
    min-height: 72px;
  }

  .device-summary {
    min-width: 0;
    display: grid;
    gap: 2px;
  }

  .step-kicker {
    color: var(--odx-blue-strong);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .device-summary strong {
    font-size: 13px;
  }

  .device-summary > span:last-child {
    overflow: hidden;
    color: var(--odx-muted);
    font-size: 11px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .control {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .control.grow {
    min-width: 240px;
    flex: 1 1 300px;
  }

  .custom-control {
    min-width: 210px;
    flex: 1 1 220px;
  }

  .panel-control {
    min-width: 260px;
    flex-basis: 300px;
  }

  .control label,
  .field-label {
    color: var(--odx-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  select,
  input[type='text'],
  input[type='number'] {
    width: 100%;
    min-height: 38px;
    border: 1px solid var(--odx-line);
    border-radius: 9px;
    background: var(--odx-surface);
    color: var(--odx-ink);
    padding: 0 10px;
  }

  select:focus,
  input:focus {
    outline: 2px solid color-mix(in srgb, var(--odx-blue) 45%, transparent);
    outline-offset: 1px;
    border-color: var(--odx-blue);
  }

  .segment {
    display: inline-flex;
    padding: 3px;
    border: 1px solid var(--odx-line);
    border-radius: 10px;
    background: var(--odx-surface);
  }

  .segment button {
    border: 0;
    background: transparent;
    border-radius: 7px;
    min-height: 30px;
    padding: 0 10px;
    color: var(--odx-muted);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .segment button.active {
    color: var(--odx-ink);
    background: color-mix(in srgb, var(--odx-blue) 15%, var(--odx-surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--odx-blue) 34%, transparent);
  }

  .grid-badge {
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 10px;
    border-left: 1px solid var(--odx-line);
    color: var(--odx-muted);
    font: 600 11px/1 ui-monospace, Consolas, monospace;
  }

  .canvas-area {
    min-height: 0;
    overflow: hidden;
    container-type: size;
    padding: 28px;
    background-color: var(--odx-canvas);
    background-image: radial-gradient(circle, color-mix(in srgb, var(--odx-muted) 23%, transparent) 0.8px, transparent 0.9px);
    background-size: 18px 18px;
  }

  .canvas-stage {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .screen-meta {
    width: min(100%, var(--odx-canvas-max-width));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: var(--odx-muted);
    font-size: 11px;
    font-weight: 600;
  }

  .screen-meta code {
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    color: var(--odx-ink);
  }

  .preview-boundary {
    width: min(100%, var(--odx-canvas-max-width));
    height: min(var(--odx-canvas-max-height), calc(100cqh - 110px));
    min-height: 180px;
    display: grid;
    place-items: center;
    container-type: size;
  }

  .screen-fit {
    position: relative;
    flex: none;
  }

  .screen-bezel {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    padding: 12px;
    border-radius: clamp(12px, 2vw, 24px);
    background: #25292c;
    box-shadow: 0 16px 42px rgba(31, 43, 50, 0.18), 0 2px 7px rgba(31, 43, 50, 0.22);
    transform-origin: top left;
  }

  .screen-bezel::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    right: 7px;
    top: 50%;
    background: #62696d;
  }

  .display-screen {
    aspect-ratio: auto;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    grid-template-rows: repeat(var(--grid-rows), minmax(0, 1fr));
    gap: clamp(2px, 0.36cqw, 5px);
    padding: clamp(3px, 0.5cqw, 7px);
    color: var(--screen-ink);
    background: var(--screen-paper);
    container-type: inline-size;
    font-family: 'Arial Narrow', Roboto, Arial, sans-serif;
    filter: contrast(0.98);
  }

  .display-screen[data-palette='bw'] {
    --screen-paper: #fff;
    --screen-ink: #080808;
    --screen-muted: #080808;
    --screen-accent: #080808;
    --screen-accent-2: #fff;
    --screen-soft: repeating-linear-gradient(45deg, #fff 0 2px, #111 2px 3px);
  }

  .display-screen[data-palette='gray4'] {
    --screen-paper: #f7f7f4;
    --screen-ink: #10110f;
    --screen-muted: #777872;
    --screen-accent: #363733;
    --screen-accent-2: #a9aaa4;
    --screen-soft: #d0d1cc;
  }

  .display-screen[data-palette='gray16'] {
    --screen-paper: #fafaf7;
    --screen-ink: #111210;
    --screen-muted: #686963;
    --screen-accent: #30312d;
    --screen-accent-2: #9b9c96;
    --screen-soft: #dedfd9;
  }

  .display-screen[data-palette='bwr'] {
    --screen-paper: #fffdf8;
    --screen-ink: #101010;
    --screen-muted: #444;
    --screen-accent: #c81e1e;
    --screen-accent-2: #c81e1e;
    --screen-soft: #f4d9d2;
  }

  .display-screen[data-palette='bwy'] {
    --screen-paper: #fffdf7;
    --screen-ink: #111;
    --screen-muted: #444;
    --screen-accent: #e4b800;
    --screen-accent-2: #111;
    --screen-soft: #f6e699;
  }

  .display-screen[data-palette='bwry'] {
    --screen-paper: #fffdf7;
    --screen-ink: #111;
    --screen-muted: #464646;
    --screen-accent: #d22626;
    --screen-accent-2: #e5b800;
    --screen-soft: #f3e3a6;
  }

  .display-screen[data-palette='spectra6'] {
    --screen-paper: #fffef5;
    --screen-ink: #101010;
    --screen-muted: #285995;
    --screen-accent: #c82723;
    --screen-accent-2: #e5b600;
    --screen-soft: #72a85a;
  }

  .screen-region {
    min-width: 0;
    min-height: 0;
    position: relative;
    overflow: hidden;
    container-type: size;
    border: max(1px, 0.14cqw) solid var(--screen-ink);
    background: var(--screen-paper);
    cursor: pointer;
    isolation: isolate;
  }

  .screen-region:hover,
  .screen-region.selected {
    outline: max(2px, 0.3cqw) solid var(--screen-accent);
    outline-offset: calc(max(2px, 0.3cqw) * -1);
    z-index: 2;
  }

  .screen-region.empty {
    display: grid;
    place-items: center;
    border-style: dashed;
    color: var(--screen-muted);
  }

  .screen-region.layout-region {
    display: grid;
    place-items: center;
    border-style: solid;
    background: color-mix(in srgb, var(--screen-accent) 7%, var(--screen-paper));
  }

  .layout-region-copy {
    display: grid;
    place-items: center;
    gap: 0.25em;
    text-align: center;
  }

  .layout-region-copy strong {
    font-size: clamp(14px, 22cqh, 44px);
    line-height: 1;
  }

  .layout-region-copy span {
    color: var(--screen-muted);
    font: 700 clamp(6px, 6cqh, 11px)/1 ui-monospace, Consolas, monospace;
  }

  .empty-region-copy {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35em;
    font-size: clamp(7px, 5cqh, 14px);
    text-align: center;
  }

  .empty-region-copy strong {
    color: var(--screen-ink);
  }

  .empty-region-copy span {
    opacity: 0.7;
    font-size: 0.78em;
  }

  .merge-layer {
    position: absolute;
    inset: clamp(3px, 0.5cqw, 7px);
    z-index: 8;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    grid-template-rows: repeat(var(--grid-rows), minmax(0, 1fr));
    gap: clamp(2px, 0.36cqw, 5px);
    pointer-events: none;
  }

  .merge-layer.active {
    pointer-events: auto;
  }

  .merge-cell {
    appearance: none;
    border: max(1px, 0.15cqw) dashed color-mix(in srgb, var(--screen-ink) 50%, transparent);
    background: color-mix(in srgb, var(--screen-paper) 76%, transparent);
    cursor: crosshair;
    color: var(--screen-muted);
    font: 700 clamp(7px, 1.5cqw, 12px)/1 ui-monospace, Consolas, monospace;
    transition: background 90ms ease, border-color 90ms ease;
  }

  .merge-cell:hover,
  .merge-cell:focus-visible {
    border-style: solid;
    border-color: var(--screen-accent);
    background: color-mix(in srgb, var(--screen-accent) 12%, var(--screen-paper));
    outline: none;
  }

  .merge-cell.preview {
    border-style: solid;
    border-color: var(--screen-accent);
    background: color-mix(in srgb, var(--screen-accent) 22%, var(--screen-paper));
    color: var(--screen-ink);
  }

  .merge-cell.preview.invalid {
    border-color: var(--odx-danger);
    background: color-mix(in srgb, var(--odx-danger) 20%, var(--screen-paper));
  }

  .merge-cell.anchor {
    color: var(--screen-paper);
    background: var(--screen-accent);
  }

  .merge-cell.occupied {
    border: 0;
    background: transparent;
    cursor: zoom-out;
  }

  .merge-cell.occupied:hover,
  .merge-cell.occupied:focus-visible {
    background: transparent;
    outline: none;
  }

  .inspector {
    border-left: 1px solid var(--odx-line);
    padding: 18px;
    overflow: auto;
  }

  .layout-guide {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
  }

  .layout-guide h2 {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.03em;
  }

  .layout-guide > p {
    margin: 0;
    color: var(--odx-muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .device-facts {
    margin: var(--ha-space-2, 8px) 0 0;
    border-block: 1px solid var(--odx-line);
  }

  .device-facts div {
    display: grid;
    grid-template-columns: 74px minmax(0, 1fr);
    gap: var(--ha-space-2, 8px);
    padding-block: 9px;
    border-bottom: 1px solid var(--odx-line);
  }

  .device-facts div:last-child {
    border-bottom: 0;
  }

  .device-facts dt {
    color: var(--odx-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .device-facts dd {
    min-width: 0;
    margin: 0;
    font-size: 12px;
    font-weight: 700;
  }

  .layout-instructions {
    margin: 0;
    padding-inline-start: 20px;
    color: var(--odx-muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .layout-instructions li + li {
    margin-block-start: var(--ha-space-2, 8px);
  }

  .layout-instructions strong {
    color: var(--odx-ink);
  }

  .layout-guide-actions {
    margin-block-start: auto;
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 8px);
    padding-block-start: var(--ha-space-4, 16px);
    border-top: 1px solid var(--odx-line);
  }

  .layout-guide-actions wa-button {
    width: 100%;
  }

  .inspector-heading {
    margin-bottom: 16px;
  }

  .region-address {
    color: var(--odx-muted);
    font: 600 11px/1 ui-monospace, Consolas, monospace;
  }

  .inspector-empty {
    min-height: 260px;
    display: grid;
    place-items: center;
    text-align: center;
    color: var(--odx-muted);
  }

  .inspector-empty strong {
    display: block;
    margin-bottom: 7px;
    color: var(--odx-ink);
    font-size: 14px;
  }

  .inspector-empty p {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
  }

  .widget-picker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 18px;
  }

  .widget-choice {
    min-height: 90px;
    padding: 10px;
    border: 1px solid var(--odx-line);
    border-radius: 10px;
    background: var(--odx-surface);
    text-align: left;
    cursor: pointer;
  }

  .widget-choice:hover,
  .widget-choice.active {
    border-color: var(--odx-blue);
    background: color-mix(in srgb, var(--odx-blue) 8%, var(--odx-surface));
  }

  .widget-choice svg {
    width: 22px;
    height: 22px;
    fill: var(--odx-blue-strong);
  }

  .widget-choice strong,
  .widget-choice span {
    display: block;
  }

  .widget-choice strong {
    margin-top: 7px;
    font-size: 12px;
  }

  .widget-choice span {
    margin-top: 3px;
    color: var(--odx-muted);
    font-size: 10px;
    line-height: 1.35;
  }

  .option-form {
    display: flex;
    flex-direction: column;
    gap: 13px;
    padding-top: 16px;
    border-top: 1px solid var(--odx-line);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .toggle-field {
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .toggle-field label {
    font-size: 12px;
    font-weight: 600;
  }

  .toggle {
    appearance: none;
    width: 38px;
    height: 22px;
    border: 0;
    border-radius: 20px;
    background: #aeb7bc;
    padding: 3px;
    cursor: pointer;
  }

  .toggle::before {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform 120ms ease;
  }

  .toggle:checked {
    background: var(--odx-blue-strong);
  }

  .toggle:checked::before {
    transform: translateX(16px);
  }

  .danger-zone {
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid var(--odx-line);
  }

  .merge-help {
    width: min(100%, 900px);
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid color-mix(in srgb, var(--odx-blue) 34%, var(--odx-line));
    border-radius: 9px;
    color: var(--odx-blue-strong);
    background: color-mix(in srgb, var(--odx-blue) 7%, var(--odx-surface));
    font-size: 12px;
    font-weight: 600;
  }

  .merge-help strong {
    color: var(--odx-ink);
  }

  dialog {
    width: min(92vw, 440px);
    border: 1px solid var(--odx-line);
    border-radius: 16px;
    padding: 0;
    color: var(--odx-ink);
    background: var(--odx-surface);
    box-shadow: 0 24px 80px rgba(20, 32, 40, 0.28);
  }

  dialog::backdrop {
    background: rgba(15, 24, 30, 0.42);
  }

  .dialog-body {
    padding: 22px;
  }

  .dialog-body h2 {
    margin: 0 0 6px;
    font-size: 19px;
  }

  .dialog-body p {
    margin: 0 0 18px;
    color: var(--odx-muted);
    font-size: 12px;
    line-height: 1.5;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
  }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    z-index: 100;
    transform: translateX(-50%);
    padding: 10px 14px;
    border-radius: 9px;
    color: white;
    background: #20282d;
    box-shadow: 0 8px 24px rgba(20, 32, 40, 0.24);
    font-size: 12px;
    font-weight: 600;
  }

  .exporting .screen-region:hover,
  .exporting .screen-region.selected {
    outline: none;
  }

  @media (max-width: 1180px) {
    .workspace {
      grid-template-columns: 188px minmax(420px, 1fr) 290px;
    }

    .topbar {
      grid-template-columns: 188px minmax(0, 1fr) auto;
    }

    .workspace.welcome-workspace {
      grid-template-columns: 188px minmax(0, 1fr);
    }

    .welcome-main {
      gap: clamp(24px, 3vw, 40px);
      padding: clamp(24px, 3vw, 40px);
    }

    .project-rail {
      padding-inline: 8px;
    }

    .inspector {
      padding: 14px;
    }
  }

  @media (max-width: 900px) {
    .app-shell {
      height: auto;
    }

    .topbar {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .project-context {
      display: none;
    }

    .welcome-topline {
      display: none;
    }

    .workspace {
      grid-template-columns: 1fr;
    }

    .workspace.welcome-workspace {
      grid-template-columns: 1fr;
    }

    .project-rail {
      display: none;
    }

    .inspector {
      border-left: 0;
      border-top: 1px solid var(--odx-line);
      min-height: 420px;
    }

    .welcome-main {
      grid-template-columns: minmax(0, 1fr);
      align-content: start;
      padding: clamp(28px, 7vw, 56px);
    }

    .welcome-copy {
      max-width: 680px;
    }

    .welcome-visual {
      width: min(100%, 620px);
    }

    .canvas-area {
      min-height: 520px;
      overflow: hidden;
      padding: 20px 14px;
    }

    .preview-boundary {
      height: min(var(--odx-canvas-max-height), calc(100cqh - 94px));
    }
  }

  @media (max-width: 560px) {
    .app-shell {
      grid-template-rows: 56px minmax(0, 1fr);
    }

    .topbar {
      padding-inline: 10px;
    }

    .brand-copy span,
    .top-actions .secondary-action {
      display: none;
    }

    .welcome-main {
      gap: var(--ha-space-8, 32px);
      padding: var(--ha-space-6, 24px) var(--ha-space-4, 16px) var(--ha-space-10, 40px);
    }

    .welcome-copy h1 {
      font-size: clamp(34px, 12vw, 48px);
    }

    .welcome-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .welcome-actions wa-button {
      width: 100%;
    }

    .device-toolbar {
      align-items: stretch;
    }

    .widget-toolbar {
      align-items: center;
    }

    .control.grow {
      min-width: 100%;
    }

    .custom-control,
    .panel-control {
      min-width: 100%;
    }

    .grid-badge {
      border-left: 0;
    }

    .canvas-area {
      min-height: 440px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`
