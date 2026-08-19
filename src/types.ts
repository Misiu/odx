import type { CSSResult, TemplateResult } from 'lit'

export type Orientation = 'landscape' | 'portrait'

export type PaletteId =
  | 'bw'
  | 'gray4'
  | 'gray16'
  | 'bwr'
  | 'bwy'
  | 'bwry'
  | 'spectra6'

export interface GridSize {
  columns: number
  rows: number
}

export interface DisplayProfile {
  id: string
  manufacturer: string
  family: string
  name: string
  diagonal: number
  nativeWidth: number
  nativeHeight: number
  nativeOrientation: Orientation
  palettes: PaletteId[]
  defaultPalette: PaletteId
  grid: Record<Orientation, GridSize>
  freezer?: boolean
  source?: string
}

export interface WidgetInstance {
  type: string
  version: number
  config: Record<string, string | number | boolean>
}

export interface GridRegion {
  id: string
  label?: string
  row: number
  column: number
  rowSpan: number
  columnSpan: number
  widget?: WidgetInstance
}

export interface ScreenProject {
  id: string
  schemaVersion: 1
  name: string
  displayId: string
  orientation: Orientation
  palette: PaletteId
  grid: GridSize
  regions: GridRegion[]
  createdAt: string
  updatedAt: string
}

export interface PersistedState {
  schemaVersion: 1
  activeProjectId: string
  projects: ScreenProject[]
}

export type WidgetFieldType = 'text' | 'number' | 'select' | 'toggle'

export interface WidgetOption {
  key: string
  label: string
  type: WidgetFieldType
  min?: number
  max?: number
  step?: number
  options?: Array<{ label: string; value: string }>
  help?: string
}

export interface WidgetRenderContext {
  compact: boolean
  palette: PaletteId
}

export interface WidgetDefinition {
  id: string
  version: number
  name: string
  description: string
  icon: string
  defaults: Record<string, string | number | boolean>
  options: WidgetOption[]
  styles: CSSResult
  render: (
    config: Record<string, string | number | boolean>,
    context: WidgetRenderContext,
  ) => TemplateResult
}

export interface CellCoordinate {
  row: number
  column: number
}
