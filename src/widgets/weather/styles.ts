import { css } from 'lit'

export const weatherStyles = css`
  .weather-now {
    display: flex;
    align-items: baseline;
    gap: 0.55em;
    margin: 0.42em 0 0.12em;
  }

  .weather-temperature {
    font-size: clamp(15px, min(24cqh, 28cqw), 52px);
    font-weight: 900;
    line-height: 0.9;
    letter-spacing: -0.08em;
  }

  .weather-condition,
  .weather-details {
    font-size: clamp(6px, 5.4cqh, 12px);
    line-height: 1.15;
  }

  .weather-condition {
    font-weight: 800;
    text-transform: uppercase;
  }

  .weather-details {
    color: var(--screen-muted);
  }

  .forecast-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
    margin-top: auto;
    border-top: max(1px, 0.12cqw) solid var(--screen-ink);
  }

  .forecast-day {
    min-width: 0;
    padding: 0.4em 0.25em 0;
    text-align: center;
    border-right: 1px solid var(--screen-muted);
    font-size: clamp(6px, 5.2cqh, 11px);
  }

  .forecast-day:last-child {
    border-right: 0;
  }

  .forecast-day strong,
  .forecast-day span,
  .forecast-day small {
    display: block;
  }

  .forecast-day span {
    margin-top: 0.18em;
    color: var(--screen-accent);
    font-size: 1.25em;
    font-weight: 900;
  }

  .forecast-day small {
    color: var(--screen-muted);
  }
`
