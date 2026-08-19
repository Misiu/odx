import { css } from 'lit'

export const sensorHistoryStyles = css`
  .metric-row {
    display: flex;
    align-items: baseline;
    gap: 0.7em;
    margin-top: 0.45em;
  }

  .metric {
    font-size: clamp(16px, 20cqh, 48px);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  .metric-detail {
    font-size: clamp(6px, 5.5cqh, 12px);
    color: var(--screen-muted);
    font-weight: 700;
  }

  .history-chart {
    min-height: 0;
    flex: 1 1 auto;
    width: 100%;
    margin-top: 0.35em;
    overflow: visible;
  }

  .chart-grid {
    stroke: var(--screen-muted);
    stroke-width: 0.6;
    stroke-dasharray: 2 3;
    opacity: 0.5;
  }

  .chart-line {
    fill: none;
    stroke: var(--screen-accent);
    stroke-width: 3;
    vector-effect: non-scaling-stroke;
  }

  .chart-axis {
    stroke: var(--screen-ink);
    stroke-width: 1;
  }
`
