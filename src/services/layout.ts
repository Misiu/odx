import type {
  CellCoordinate,
  DisplayProfile,
  GridRegion,
  GridSize,
  Orientation,
} from '../types'

export const createId = (): string => crypto.randomUUID()

export const createRegions = (grid: GridSize): GridRegion[] => {
  const regions: GridRegion[] = []
  for (let row = 1; row <= grid.rows; row += 1) {
    for (let column = 1; column <= grid.columns; column += 1) {
      regions.push({
        id: createId(),
        row,
        column,
        rowSpan: 1,
        columnSpan: 1,
      })
    }
  }
  return regions
}

export const regionContainsCell = (
  region: GridRegion,
  cell: CellCoordinate,
): boolean =>
  cell.row >= region.row &&
  cell.row < region.row + region.rowSpan &&
  cell.column >= region.column &&
  cell.column < region.column + region.columnSpan

export const mergeRegions = (
  regions: GridRegion[],
  first: CellCoordinate,
  second: CellCoordinate,
): GridRegion[] | null => {
  const row = Math.min(first.row, second.row)
  const column = Math.min(first.column, second.column)
  const rowEnd = Math.max(first.row, second.row)
  const columnEnd = Math.max(first.column, second.column)

  const inside = regions.filter(
    (region) =>
      region.row >= row &&
      region.column >= column &&
      region.row + region.rowSpan - 1 <= rowEnd &&
      region.column + region.columnSpan - 1 <= columnEnd,
  )

  const requestedArea = (rowEnd - row + 1) * (columnEnd - column + 1)
  const coveredArea = inside.reduce(
    (total, region) => total + region.rowSpan * region.columnSpan,
    0,
  )

  if (requestedArea !== coveredArea || inside.length === 0) return null

  const preservedWidget = inside.find((region) => region.widget)?.widget
  const insideIds = new Set(inside.map((region) => region.id))
  return [
    ...regions.filter((region) => !insideIds.has(region.id)),
    {
      id: createId(),
      row,
      column,
      rowSpan: rowEnd - row + 1,
      columnSpan: columnEnd - column + 1,
      widget: preservedWidget,
    },
  ]
}

export const splitRegion = (
  regions: GridRegion[],
  regionId: string,
): GridRegion[] => {
  const target = regions.find((region) => region.id === regionId)
  if (!target || (target.rowSpan === 1 && target.columnSpan === 1 && !target.label)) return regions

  if (target.rowSpan === 1 && target.columnSpan === 1) {
    return regions.map((region) => region.id === regionId
      ? {
          id: createId(),
          row: region.row,
          column: region.column,
          rowSpan: 1,
          columnSpan: 1,
        }
      : region)
  }

  const cells: GridRegion[] = []
  for (let row = target.row; row < target.row + target.rowSpan; row += 1) {
    for (
      let column = target.column;
      column < target.column + target.columnSpan;
      column += 1
    ) {
      cells.push({
        id: createId(),
        row,
        column,
        rowSpan: 1,
        columnSpan: 1,
      })
    }
  }

  return [...regions.filter((region) => region.id !== regionId), ...cells]
}

export const rotateRegions = (
  regions: GridRegion[],
  oldGrid: GridSize,
  newGrid: GridSize,
  direction: 'clockwise' | 'counterclockwise',
): GridRegion[] => {
  if (
    oldGrid.columns === newGrid.rows &&
    oldGrid.rows === newGrid.columns
  ) {
    return regions.map((region) => direction === 'clockwise'
      ? {
          ...region,
          row: region.column,
          column: oldGrid.rows - region.row - region.rowSpan + 2,
          rowSpan: region.columnSpan,
          columnSpan: region.rowSpan,
        }
      : {
          ...region,
          row: oldGrid.columns - region.column - region.columnSpan + 2,
          column: region.row,
          rowSpan: region.columnSpan,
          columnSpan: region.rowSpan,
        })
  }

  return createRegions(newGrid)
}

export const gridForOrientation = (
  profile: DisplayProfile,
  orientation: Orientation,
): GridSize => ({ ...profile.grid[orientation] })
