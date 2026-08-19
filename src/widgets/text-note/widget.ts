import { html } from 'lit'
import { mdiFormatText } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configText } from '../shared'
import { textNoteStyles } from './styles'

export const textNoteWidget: WidgetDefinition = {
  id: 'text-note',
  version: 1,
  name: 'Text / note',
  description: 'A simple message or heading.',
  icon: mdiFormatText,
  styles: textNoteStyles,
  defaults: {
    eyebrow: 'HOME',
    text: 'Remember to water the plants',
    align: 'left',
    emphasis: 'normal',
  },
  options: [
    { key: 'eyebrow', label: 'Label', type: 'text' },
    { key: 'text', label: 'Content', type: 'text' },
    {
      key: 'align',
      label: 'Alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      key: 'emphasis',
      label: 'Emphasis',
      type: 'select',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Strong', value: 'strong' },
        { label: 'Color accent', value: 'accent' },
      ],
    },
  ],
  render: (config) => html`
    <div class="widget note-widget align-${configText(config, 'align')} emphasis-${configText(config, 'emphasis')}">
      <span class="note-eyebrow">${configText(config, 'eyebrow')}</span>
      <strong>${configText(config, 'text')}</strong>
    </div>
  `,
}
