import { html } from 'lit'
import { mdiCalendarMonthOutline } from '@mdi/js'
import type { WidgetDefinition } from '../../types'
import { configNumber, configText, renderIcon } from '../shared'
import { calendarStyles } from './styles'

export const calendarWidget: WidgetDefinition = {
  id: 'calendar',
  version: 1,
  name: 'Calendar',
  description: 'An agenda from one or more calendar entities.',
  icon: mdiCalendarMonthOutline,
  styles: calendarStyles,
  defaults: {
    entity: 'calendar.family',
    title: 'Upcoming events',
    days: 5,
    maxEvents: 4,
    layout: 'agenda',
    showTime: true,
  },
  options: [
    { key: 'entity', label: 'Calendar entity', type: 'text' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'days', label: 'Day range', type: 'number', min: 1, max: 31, step: 1 },
    { key: 'maxEvents', label: 'Maximum events', type: 'number', min: 1, max: 10, step: 1 },
    {
      key: 'layout',
      label: 'Layout',
      type: 'select',
      options: [
        { label: 'Agenda', value: 'agenda' },
        { label: 'Compact', value: 'compact' },
        { label: 'Day list', value: 'days' },
      ],
    },
    { key: 'showTime', label: 'Show times', type: 'toggle' },
  ],
  render: (config, context) => {
    const count = Math.min(configNumber(config, 'maxEvents'), context.compact ? 2 : 5)
    const events = [
      ['TODAY', '09:30', 'Team stand-up'],
      ['TODAY', '14:00', 'Project review'],
      ['THU', '18:15', 'Training'],
      ['FRI', '08:00', 'Dentist'],
      ['SAT', '12:30', 'Family lunch'],
    ].slice(0, count)
    return html`
      <div class="widget calendar-widget ${context.compact ? 'compact' : ''}">
        <div class="widget-heading">
          <span>${renderIcon(mdiCalendarMonthOutline)}</span>
          <strong>${configText(config, 'title')}</strong>
          <span class="widget-kicker">${configNumber(config, 'days')} days</span>
        </div>
        <div class="event-list">
          ${events.map(
            ([day, time, title]) => html`
              <div class="event-row">
                <span class="event-day">${day}</span>
                ${config.showTime ? html`<span class="event-time">${time}</span>` : ''}
                <strong>${title}</strong>
              </div>
            `,
          )}
        </div>
      </div>
    `
  },
}
