import type { PersistedState, ScreenProject } from '../types'
import { createId, createRegions, gridForOrientation } from './layout'
import { getDisplayProfile } from '../data/display-profiles'

const STORAGE_KEY = 'odx.projects.v1'
const DEFAULT_DISPLAY = 'solum-newton-pro-5-8'

export const createProject = (name = 'Kitchen display', includeDemo = false): ScreenProject => {
  const display = getDisplayProfile(DEFAULT_DISPLAY)
  const orientation = 'landscape' as const
  const grid = gridForOrientation(display, orientation)
  const now = new Date().toISOString()
  return {
    id: createId(),
    schemaVersion: 1,
    name,
    displayId: display.id,
    orientation,
    palette: display.defaultPalette,
    grid,
    regions: includeDemo ? [
      {
        id: createId(),
        row: 1,
        column: 1,
        rowSpan: 1,
        columnSpan: 3,
        widget: {
          type: 'sensor-history',
          version: 1,
          config: {
            entity: 'sensor.living_room_temperature',
            title: 'Living room',
            hours: 24,
            details: 'min-max',
            showGrid: true,
          },
        },
      },
      {
        id: createId(),
        row: 1,
        column: 4,
        rowSpan: 1,
        columnSpan: 2,
        widget: {
          type: 'weather',
          version: 1,
          config: {
            entity: 'weather.home',
            title: 'Warsaw',
            forecastDays: 3,
            layout: 'forecast',
            showDetails: false,
          },
        },
      },
      {
        id: createId(),
        row: 2,
        column: 1,
        rowSpan: 1,
        columnSpan: 5,
        widget: {
          type: 'calendar',
          version: 1,
          config: {
            entity: 'calendar.family',
            title: 'Upcoming events',
            days: 5,
            maxEvents: 3,
            layout: 'agenda',
            showTime: true,
          },
        },
      },
    ] : createRegions(grid),
    createdAt: now,
    updatedAt: now,
  }
}

export const createDefaultState = (): PersistedState => {
  const project = createProject('Kitchen display', true)
  return {
    schemaVersion: 1,
    activeProjectId: project.id,
    projects: [project],
  }
}

export const loadState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()
    const parsed = JSON.parse(raw) as PersistedState
    if (
      parsed.schemaVersion !== 1 ||
      !Array.isArray(parsed.projects) ||
      parsed.projects.length === 0
    ) {
      return createDefaultState()
    }
    return parsed
  } catch {
    return createDefaultState()
  }
}

export const saveState = (state: PersistedState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const downloadJson = (project: ScreenProject): void => {
  const blob = new Blob([JSON.stringify(project, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.odx.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
