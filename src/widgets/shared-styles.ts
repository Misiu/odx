import { css } from 'lit'

export const sharedWidgetStyles = css`
  .widget {
    width: 100%;
    height: 100%;
    padding: clamp(5px, 2.4cqw, 18px);
    display: flex;
    flex-direction: column;
    color: var(--screen-ink);
    background: var(--screen-paper);
    overflow: hidden;
  }

  .widget-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.5em;
    align-items: center;
    border-bottom: max(1px, 0.12cqw) solid var(--screen-ink);
    padding-bottom: 0.42em;
    font-size: clamp(7px, 6.5cqh, 15px);
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .widget-heading strong {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .widget-icon {
    width: 1.2em;
    height: 1.2em;
    display: block;
    fill: currentColor;
  }

  .widget-kicker {
    color: var(--screen-accent);
    font-weight: 800;
  }
`
