import { html } from 'lit'
import { mdiHomeThermometerOutline, mdiThermometer } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText, renderIcon } from '../shared'
import { entityValueStyles } from './styles'

export const entityValueWidget: WidgetDefinition = {
  id: 'entity-value',
  version: 1,
  name: 'Entity value',
  description: 'A prominent value from a single entity.',
  icon: mdiHomeThermometerOutline,
  styles: entityValueStyles,
  defaults: {
    entity: 'sensor.outdoor_temperature',
    title: 'Outdoor temperature',
    unit: '°C',
    value: '18.6',
    showIcon: true,
  },
  options: [
    { key: 'entity', label: 'Entity', type: 'text' },
    { key: 'title', label: 'Name', type: 'text' },
    { key: 'value', label: 'Mock value', type: 'text' },
    { key: 'unit', label: 'Unit', type: 'text' },
    { key: 'showIcon', label: 'Show icon', type: 'toggle' },
  ],
  render: (config) => html`
    <div class="widget entity-widget">
      ${config.showIcon ? renderIcon(mdiThermometer, 'Temperature') : ''}
      <span class="entity-label">${configText(config, 'title')}</span>
      <strong class="entity-value">${configText(config, 'value')}<small>${configText(config, 'unit')}</small></strong>
    </div>
  `,
}
