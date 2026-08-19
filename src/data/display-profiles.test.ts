import { describe, expect, it } from 'vitest'
import {
  DISPLAY_PROFILES,
  getDisplayProfile,
  getPixelSize,
} from './display-profiles'
import {
  CUSTOM_DRIVERS,
  DEFAULT_CUSTOM_DRIVER_ID,
  DEFAULT_CUSTOM_PANEL_ID,
  isPanelCompatible,
} from './custom-hardware'

describe('display profiles', () => {
  it('contains the SOLUM Newton Pro lineup used by the POC', () => {
    const solumProfiles = DISPLAY_PROFILES.filter((profile) => profile.family === 'Newton Pro')

    expect(solumProfiles).toHaveLength(23)
    expect(solumProfiles.map((profile) => profile.diagonal)).toEqual(expect.arrayContaining([
      1.6, 2.2, 2.6, 2.7, 2.9, 3.45, 3.52, 4.2, 4.3, 4.5, 5.8, 6.1, 7.5, 9.7, 11.6, 12.2,
    ]))
  })

  it('uses a readable 4x2 landscape grid and a 2x4 portrait grid for Newton Pro 5.8', () => {
    const profile = getDisplayProfile('solum-newton-pro-5-8')

    expect(profile.grid.landscape).toEqual({ columns: 4, rows: 2 })
    expect(profile.grid.portrait).toEqual({ columns: 2, rows: 4 })
  })

  it('uses a 3x3 grid for Newton Pro 7.5 in both orientations', () => {
    const profile = getDisplayProfile('solum-newton-pro-7-5')

    expect(profile.grid.landscape).toEqual({ columns: 3, rows: 3 })
    expect(profile.grid.portrait).toEqual({ columns: 3, rows: 3 })
  })

  it('swaps native pixel dimensions when orientation changes', () => {
    const profile = getDisplayProfile('solum-newton-pro-7-5')

    expect(getPixelSize(profile, 'portrait')).toEqual({ width: 480, height: 800 })
    expect(getPixelSize(profile, 'landscape')).toEqual({ width: 800, height: 480 })
  })

  it('falls back to the default Newton Pro 5.8 profile', () => {
    expect(getDisplayProfile('missing').id).toBe('solum-newton-pro-5-8')
  })

  it('includes the supported Seeed ready-to-use devices', () => {
    const seeedIds = DISPLAY_PROFILES
      .filter((profile) => profile.manufacturer === 'Seeed Studio')
      .map((profile) => profile.id)

    expect(seeedIds).toEqual(expect.arrayContaining([
      'opendisplay-reterminal-sticky',
      'opendisplay-e1001',
      'opendisplay-e1002',
      'opendisplay-e1003',
      'opendisplay-e1004',
      'opendisplay-xiao-7-5',
      'opendisplay-seeed-7-5-diy',
    ]))
  })

  it('defaults custom hardware to EN04 with the 7.3-inch Spectra 6 panel', () => {
    const driver = CUSTOM_DRIVERS.find((item) => item.id === DEFAULT_CUSTOM_DRIVER_ID)
    const panel = getDisplayProfile(DEFAULT_CUSTOM_PANEL_ID)

    expect(driver?.name).toContain('EN04')
    expect(panel.name).toContain('7.3″ Spectra 6')
    expect(panel.defaultPalette).toBe('spectra6')
    expect(getPixelSize(panel, 'landscape')).toEqual({ width: 800, height: 480 })
    expect(panel.grid.landscape).toEqual({ columns: 3, rows: 3 })
  })

  it('filters verified panels by the driver connector', () => {
    const en04 = CUSTOM_DRIVERS.find((item) => item.id === 'en04')
    const en05 = CUSTOM_DRIVERS.find((item) => item.id === 'en05')
    const spectraPanel = getDisplayProfile(DEFAULT_CUSTOM_PANEL_ID)

    expect(en04 && isPanelCompatible(en04, spectraPanel)).toBe(true)
    expect(en05 && isPanelCompatible(en05, spectraPanel)).toBe(false)
  })
})
