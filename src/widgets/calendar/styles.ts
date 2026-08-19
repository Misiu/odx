import { css } from 'lit'

export const calendarStyles = css`
  .event-list {
    min-height: 0;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .event-row {
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(38px, 0.7fr) minmax(36px, 0.5fr) minmax(0, 3fr);
    gap: 0.6em;
    align-items: center;
    padding: 0.32em 0;
    border-bottom: 1px solid var(--screen-muted);
    font-size: clamp(6px, 5.6cqh, 13px);
  }

  .event-row:last-child {
    border-bottom: 0;
  }

  .event-day {
    color: var(--screen-accent);
    font-weight: 900;
    font-size: 0.82em;
  }

  .event-time {
    font-variant-numeric: tabular-nums;
  }

  .event-row strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`
