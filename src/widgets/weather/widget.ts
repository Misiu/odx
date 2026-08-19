import { html } from 'lit'
import { mdiWeatherPartlyCloudy } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configNumber, configText, renderIcon } from '../shared'
import { weatherStyles } from './styles'

export const weatherWidget: WidgetDefinition = {
  id: 'weather',
  version: 1,
  name: 'Weather',
  description: 'Current conditions and forecast.',
  icon: mdiWeatherPartlyCloudy,
  styles: weatherStyles,
  defaults: {
    entity: 'weather.home',
    title: 'Warsaw',
    forecastDays: 4,
    layout: 'forecast',
    showDetails: true,
  },
  options: [
    { key: 'entity', label: 'Weather entity', type: 'text' },
    { key: 'title', label: 'Location', type: 'text' },
    { key: 'forecastDays', label: 'Forecast days', type: 'number', min: 1, max: 7, step: 1 },
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      options: [
        { label: 'Current weather and forecast', value: 'forecast' },
        { label: 'Current weather only', value: 'current' },
        { label: 'Compact forecast', value: 'compact' },
      ],
    },
    { key: 'showDetails', label: 'Wind and precipitation', type: 'toggle' },
  ],
  render: (config, context) => {
    const days = Math.min(configNumber(config, 'forecastDays'), context.compact ? 3 : 7)
    const forecasts = [
      ['Today', '21°', '12°'],
      ['Thu', '19°', '11°'],
      ['Fri', '22°', '13°'],
      ['Sat', '24°', '14°'],
      ['Sun', '20°', '10°'],
      ['Mon', '18°', '9°'],
      ['Tue', '21°', '11°'],
    ].slice(0, days)
    return html`
      <div class="widget weather-widget ${context.compact ? 'compact' : ''}">
        <div class="widget-heading">
          <span>${renderIcon(mdiWeatherPartlyCloudy)}</span>
          <strong>${configText(config, 'title')}</strong>
          <span class="widget-kicker">Now</span>
        </div>
        <div class="weather-now">
          <span class="weather-temperature">21°</span>
          <span class="weather-condition">partly cloudy</span>
        </div>
        ${config.showDetails
          ? html`<div class="weather-details">Wind 12 km/h · rain 20%</div>`
          : ''}
        ${configText(config, 'layout') !== 'current'
          ? html`<div class="forecast-row">
              ${forecasts.map(
                ([day, high, low]) => html`
                  <div class="forecast-day">
                    <strong>${day}</strong>
                    <span>${high}</span>
                    <small>${low}</small>
                  </div>
                `,
              )}
            </div>`
          : ''}
      </div>
    `
  },
}
