import { html, type TemplateResult } from 'lit'

export const configText = (
  config: Record<string, string | number | boolean>,
  key: string,
): string => String(config[key] ?? '')

export const configNumber = (
  config: Record<string, string | number | boolean>,
  key: string,
): number => Number(config[key] ?? 0)

export const renderIcon = (path: string, label = ''): TemplateResult => html`
  <svg class="widget-icon" viewBox="0 0 24 24" role="img" aria-label=${label}>
    <path d=${path}></path>
  </svg>
`

export const renderButtonIcon = (path: string): TemplateResult => html`
  <svg slot="start" class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d=${path}></path>
  </svg>
`
