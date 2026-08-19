import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDefaultState, loadState } from './storage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('project storage', () => {
  it('starts with an empty display library', () => {
    expect(createDefaultState()).toEqual({
      schemaVersion: 1,
      activeProjectId: '',
      projects: [],
    })
  })

  it('keeps a persisted empty display library', () => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => JSON.stringify(createDefaultState())),
      setItem: vi.fn(),
    })

    expect(loadState()).toEqual(createDefaultState())
  })
})
