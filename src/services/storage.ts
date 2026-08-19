import type { PersistedState, ScreenProject } from '../types'
import { createId, createRegions, gridForOrientation } from './layout'
import { getDisplayProfile } from '../data/display-profiles'

const STORAGE_KEY = 'odx.projects.v1'
const DEFAULT_DISPLAY = 'solum-newton-pro-5-8'

const labelRegions = (regions: ScreenProject['regions']): ScreenProject['regions'] => {
  const merged = regions
    .filter((region) => region.rowSpan > 1 || region.columnSpan > 1)
    .sort((first, second) => first.row - second.row || first.column - second.column)
  const used = new Set(merged.flatMap((region) => region.label ? [region.label] : []))
  let labelCode = 65
  return regions.map((region) => {
    if (region.rowSpan === 1 && region.columnSpan === 1 || region.label) return region
    while (used.has(String.fromCharCode(labelCode))) labelCode += 1
    const label = String.fromCharCode(labelCode)
    used.add(label)
    labelCode += 1
    return { ...region, label }
  })
}

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
        label: 'A',
        row: 1,
        column: 1,
        rowSpan: 1,
        columnSpan: 2,
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
        label: 'B',
        row: 1,
        column: 3,
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
        label: 'C',
        row: 2,
        column: 1,
        rowSpan: 1,
        columnSpan: 4,
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
    const projects = parsed.projects.map((project) => {
      const profile = getDisplayProfile(project.displayId)
      const expectedGrid = gridForOrientation(profile, project.orientation)
      if (
        project.grid.columns === expectedGrid.columns &&
        project.grid.rows === expectedGrid.rows
      ) return { ...project, regions: labelRegions(project.regions) }

      const widgets = project.regions.flatMap((region) => region.widget ? [region.widget] : [])
      return {
        ...project,
        grid: expectedGrid,
        regions: labelRegions(createRegions(expectedGrid).map((region, index) => ({
          ...region,
          widget: widgets[index],
        }))),
      }
    })
    return { ...parsed, projects }
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
