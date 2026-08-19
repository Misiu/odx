import { css } from 'lit'

export const entityValueStyles = css`
  .entity-widget {
    align-items: flex-start;
    justify-content: space-between;
  }

  .entity-widget > .widget-icon {
    width: clamp(18px, 18cqh, 44px);
    height: clamp(18px, 18cqh, 44px);
    color: var(--screen-accent);
  }

  .entity-label {
    font-size: clamp(7px, 7cqh, 15px);
    font-weight: 800;
    text-transform: uppercase;
  }

  .entity-value {
    align-self: flex-end;
    font-size: clamp(22px, 35cqh, 74px);
    line-height: 0.85;
    letter-spacing: -0.07em;
  }

  .entity-value small {
    margin-left: 0.15em;
    color: var(--screen-accent);
    font-size: 0.32em;
    letter-spacing: 0;
  }
`
