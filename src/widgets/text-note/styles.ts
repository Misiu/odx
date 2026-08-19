import { css } from 'lit'

export const textNoteStyles = css`
  .note-widget {
    justify-content: center;
    gap: 0.45em;
  }

  .note-widget.align-center {
    text-align: center;
    align-items: center;
  }

  .note-widget.align-right {
    text-align: right;
    align-items: flex-end;
  }

  .note-eyebrow {
    color: var(--screen-accent);
    font-size: clamp(6px, min(7cqh, 8cqw), 16px);
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .note-widget strong {
    max-width: 95%;
    font-size: clamp(9px, min(17cqh, 15cqw), 42px);
    line-height: 0.98;
    letter-spacing: -0.04em;
  }

  .note-widget.emphasis-strong strong {
    text-transform: uppercase;
  }

  .note-widget.emphasis-accent {
    background: var(--screen-accent);
    color: var(--screen-paper);
  }

  .note-widget.emphasis-accent .note-eyebrow {
    color: var(--screen-accent-2);
  }
`
