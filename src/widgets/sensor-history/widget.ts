import { html } from 'lit'
import { mdiChartLine } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configNumber, configText, renderIcon } from '../shared'
import { sensorHistoryStyles } from './styles'

const chartPoints = (hours: number): string => {
  const count = Math.max(8, Math.min(28, Math.round(hours / 2)))
  return Array.from({ length: count }, (_, index) => {
    const x = (index / (count - 1)) * 240
    const y = 53 - Math.sin(index * 0.74) * 18 - Math.cos(index * 0.31) * 8
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

export const sensorHistoryWidget: WidgetDefinition = {
  id: 'sensor-history',
  version: 1,
  name: 'Sensor history',
  description: 'A historical chart for a Home Assistant entity.',
  icon: mdiChartLine,
  styles: sensorHistoryStyles,
  defaults: {
    entity: 'sensor.living_room_temperature',
    title: 'Living room',
    hours: 24,
    details: 'min-max',
    showGrid: true,
  },
  options: [
    { key: 'entity', label: 'Sensor entity', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'hours', label: 'History (hours)', type: 'number', min: 1, max: 168, step: 1 },
    {
      key: 'details',
      label: 'Details',
      type: 'select',
      options: [
        { label: 'Value, minimum and maximum', value: 'min-max' },
        { label: 'Current value only', value: 'value' },
        { label: 'Chart only', value: 'chart' },
      ],
    },
    { key: 'showGrid', label: 'Show chart grid', type: 'toggle' },
  ],
  render: (config, context) => {
    const hours = configNumber(config, 'hours')
    const details = configText(config, 'details')
    return html`
      <div class="widget sensor-widget ${context.compact ? 'compact' : ''}">
        <div class="widget-heading">
          <span>${renderIcon(mdiChartLine)}</span>
          <strong>${configText(config, 'title')}</strong>
          <span class="widget-kicker">${hours} h</span>
        </div>
        ${details !== 'chart'
          ? html`<div class="metric-row">
              <span class="metric">21.8°</span>
              ${details === 'min-max'
                ? html`<span class="metric-detail">18.4° min · 23.1° max</span>`
                : ''}
            </div>`
          : ''}
        <svg class="history-chart" viewBox="0 0 240 90" preserveAspectRatio="none" aria-label="Mock temperature history chart">
          ${config.showGrid
            ? html`<path class="chart-grid" d="M0 22.5H240 M0 45H240 M0 67.5H240"></path>`
            : ''}
          <polyline class="chart-line" points=${chartPoints(hours)}></polyline>
          <path class="chart-axis" d="M0 89.5H240"></path>
        </svg>
      </div>
    `
  },
}
