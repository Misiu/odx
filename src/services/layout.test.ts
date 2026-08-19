import { describe, expect, it } from 'vitest'
import type { GridRegion } from '../types'
import {
  createRegions,
  mergeRegions,
  rotateRegions,
  splitRegion,
} from './layout'

describe('layout service', () => {
  it('creates one region for every grid cell', () => {
    const regions = createRegions({ columns: 5, rows: 2 })

    expect(regions).toHaveLength(10)
    expect(regions[0]).toMatchObject({ row: 1, column: 1, rowSpan: 1, columnSpan: 1 })
    expect(regions[9]).toMatchObject({ row: 2, column: 5, rowSpan: 1, columnSpan: 1 })
  })

  it('merges only a completely covered rectangle', () => {
    const regions = createRegions({ columns: 3, rows: 3 })
    const merged = mergeRegions(regions, { row: 1, column: 1 }, { row: 1, column: 3 })

    expect(merged).not.toBeNull()
    expect(merged).toHaveLength(7)
    expect(merged).toContainEqual(expect.objectContaining({
      row: 1,
      column: 1,
      rowSpan: 1,
      columnSpan: 3,
    }))
  })

  it('creates a distinct region from a single selected cell', () => {
    const regions = createRegions({ columns: 3, rows: 3 })
    const original = regions.find((region) => region.row === 3 && region.column === 3)!
    const composed = mergeRegions(regions, { row: 3, column: 3 }, { row: 3, column: 3 })

    expect(composed).not.toBeNull()
    expect(composed).toHaveLength(9)
    expect(composed).toContainEqual(expect.objectContaining({
      row: 3,
      column: 3,
      rowSpan: 1,
      columnSpan: 1,
    }))
    expect(composed!.find((region) => region.row === 3 && region.column === 3)?.id).not.toBe(original.id)
  })

  it('rejects a selection that cuts through a merged region', () => {
    const regions: GridRegion[] = [
      { id: 'wide', row: 1, column: 1, rowSpan: 1, columnSpan: 2 },
      { id: 'cell', row: 1, column: 3, rowSpan: 1, columnSpan: 1 },
    ]

    expect(mergeRegions(regions, { row: 1, column: 2 }, { row: 1, column: 3 })).toBeNull()
  })

  it('splits a merged region back into cells', () => {
    const split = splitRegion(
      [{ id: 'wide', row: 1, column: 1, rowSpan: 2, columnSpan: 3 }],
      'wide',
    )

    expect(split).toHaveLength(6)
    expect(split.every((region) => region.rowSpan === 1 && region.columnSpan === 1)).toBe(true)
  })

  it('removes the composed state from a labeled 1x1 region', () => {
    const split = splitRegion(
      [{ id: 'single', label: 'C', row: 3, column: 3, rowSpan: 1, columnSpan: 1 }],
      'single',
    )

    expect(split).toHaveLength(1)
    expect(split[0]).toMatchObject({ row: 3, column: 3, rowSpan: 1, columnSpan: 1 })
    expect(split[0].id).not.toBe('single')
    expect(split[0].label).toBeUndefined()
  })

  it('composes and removes the requested 3x3 corner-based regions', () => {
    const cells = createRegions({ columns: 3, rows: 3 })
    const withRegionA = mergeRegions(cells, { row: 1, column: 1 }, { row: 2, column: 2 })
    expect(withRegionA).not.toBeNull()

    const withRegionB = mergeRegions(withRegionA!, { row: 1, column: 3 }, { row: 3, column: 3 })
    expect(withRegionB).not.toBeNull()
    expect(withRegionB).toEqual(expect.arrayContaining([
      expect.objectContaining({ row: 1, column: 1, rowSpan: 2, columnSpan: 2 }),
      expect.objectContaining({ row: 1, column: 3, rowSpan: 3, columnSpan: 1 }),
    ]))

    const rightRegion = withRegionB!.find((region) => region.column === 3 && region.rowSpan === 3)
    const restored = splitRegion(withRegionB!, rightRegion!.id)
    expect(restored).toEqual(expect.arrayContaining([
      expect.objectContaining({ row: 1, column: 3, rowSpan: 1, columnSpan: 1 }),
      expect.objectContaining({ row: 2, column: 3, rowSpan: 1, columnSpan: 1 }),
      expect.objectContaining({ row: 3, column: 3, rowSpan: 1, columnSpan: 1 }),
    ]))
  })

  it('rotates region geometry when orientation transposes the grid', () => {
    const rotated = rotateRegions(
      [{ id: 'wide', row: 1, column: 1, rowSpan: 1, columnSpan: 3 }],
      { columns: 5, rows: 2 },
      { columns: 2, rows: 5 },
      'clockwise',
    )

    expect(rotated[0]).toMatchObject({ row: 1, column: 2, rowSpan: 3, columnSpan: 1 })
  })

  it('restores region geometry after a landscape and portrait round trip', () => {
    const original: GridRegion[] = [
      { id: 'a', row: 1, column: 1, rowSpan: 1, columnSpan: 2 },
      { id: 'b', row: 2, column: 1, rowSpan: 1, columnSpan: 4 },
    ]
    const portrait = rotateRegions(
      original,
      { columns: 4, rows: 2 },
      { columns: 2, rows: 4 },
      'clockwise',
    )
    const restored = rotateRegions(
      portrait,
      { columns: 2, rows: 4 },
      { columns: 4, rows: 2 },
      'counterclockwise',
    )

    expect(restored).toEqual(original)
    expect(restored[0]).toMatchObject({ id: 'a', row: 1, column: 1 })
  })

  it('keeps a top region at the top after a portrait and landscape round trip', () => {
    const original: GridRegion[] = [
      { id: 'a', row: 1, column: 1, rowSpan: 1, columnSpan: 2 },
      { id: 'b', row: 2, column: 1, rowSpan: 3, columnSpan: 2 },
    ]
    const landscape = rotateRegions(
      original,
      { columns: 2, rows: 4 },
      { columns: 4, rows: 2 },
      'counterclockwise',
    )
    const restored = rotateRegions(
      landscape,
      { columns: 4, rows: 2 },
      { columns: 2, rows: 4 },
      'clockwise',
    )

    expect(restored).toEqual(original)
    expect(restored[0]).toMatchObject({ id: 'a', row: 1, column: 1 })
  })
})
