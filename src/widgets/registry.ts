import { calendarWidget } from './calendar/widget'
import { entityValueWidget } from './entity-value/widget'
import { sensorHistoryWidget } from './sensor-history/widget'
import { textNoteWidget } from './text-note/widget'
import { weatherWidget } from './weather/widget'

export const WIDGETS = [
  sensorHistoryWidget,
  weatherWidget,
  calendarWidget,
  entityValueWidget,
  textNoteWidget,
]

export const getWidgetDefinition = (id: string) =>
  WIDGETS.find((widget) => widget.id === id)

export const widgetStyles = WIDGETS.map((widget) => widget.styles)
