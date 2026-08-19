import type { DisplayProfile, GridSize, Orientation, PaletteId } from '../types'
import { CUSTOM_PANEL_PROFILES } from './custom-hardware'

export const PALETTE_LABELS: Record<PaletteId, string> = {
  bw: 'Monochrome · black / white',
  gray4: 'Grayscale · 4 levels',
  gray16: 'Grayscale · 16 levels',
  bwr: 'Black / white / red',
  bwy: 'Black / white / yellow',
  bwry: 'Black / white / red / yellow',
  spectra6: 'Spectra 6 · B/W/R/Y/B/G',
}

const SOLUM_SOURCE =
  'https://www.solum-group.com/esl-n-iot/product-lineup/professional-esl/newton-pro'
const OPENDISPLAY_HARDWARE_SOURCE = 'https://opendisplay.org/what-hardware-to-buy.html'

const readyHardware = (
  id: string,
  manufacturer: string,
  name: string,
  diagonal: number,
  nativeWidth: number,
  nativeHeight: number,
  palettes: PaletteId[],
  defaultPalette: PaletteId,
  landscape: GridSize,
  portrait: GridSize,
): DisplayProfile => ({
  id,
  manufacturer,
  family: 'OpenDisplay',
  name,
  diagonal,
  nativeWidth,
  nativeHeight,
  nativeOrientation: nativeWidth >= nativeHeight ? 'landscape' : 'portrait',
  palettes,
  defaultPalette,
  grid: { landscape, portrait },
  source: OPENDISPLAY_HARDWARE_SOURCE,
})

const solum = (
  id: string,
  name: string,
  diagonal: number,
  nativeWidth: number,
  nativeHeight: number,
  landscape: GridSize,
  portrait: GridSize,
  freezer = false,
): DisplayProfile => ({
  id,
  manufacturer: 'SOLUM',
  family: 'Newton Pro',
  name,
  diagonal,
  nativeWidth,
  nativeHeight,
  nativeOrientation: nativeWidth >= nativeHeight ? 'landscape' : 'portrait',
  palettes: freezer ? ['bw'] : ['bw', 'bwry'],
  defaultPalette: freezer ? 'bw' : 'bwry',
  grid: { landscape, portrait },
  freezer,
  source: SOLUM_SOURCE,
})

export const DISPLAY_PROFILES: DisplayProfile[] = [
  solum('solum-newton-pro-1-6-v', 'Newton Pro 1.6″ V', 1.6, 200, 200, { columns: 1, rows: 1 }, { columns: 1, rows: 1 }),
  solum('solum-newton-pro-1-6-h', 'Newton Pro 1.6″ H', 1.6, 200, 200, { columns: 1, rows: 1 }, { columns: 1, rows: 1 }),
  solum('solum-newton-pro-2-2', 'Newton Pro 2.2″', 2.2, 296, 160, { columns: 2, rows: 1 }, { columns: 1, rows: 2 }),
  solum('solum-newton-pro-2-2-f', 'Newton Pro 2.2″ Freezer', 2.2, 296, 160, { columns: 2, rows: 1 }, { columns: 1, rows: 2 }, true),
  solum('solum-newton-pro-2-6', 'Newton Pro 2.6″', 2.6, 360, 184, { columns: 2, rows: 1 }, { columns: 1, rows: 2 }),
  solum('solum-newton-pro-2-6-f', 'Newton Pro 2.6″ Freezer', 2.6, 360, 184, { columns: 2, rows: 1 }, { columns: 1, rows: 2 }, true),
  solum('solum-newton-pro-2-7', 'Newton Pro 2.7″', 2.7, 300, 200, { columns: 2, rows: 1 }, { columns: 1, rows: 2 }),
  solum('solum-newton-pro-2-9', 'Newton Pro 2.9″', 2.9, 384, 168, { columns: 3, rows: 1 }, { columns: 1, rows: 3 }),
  solum('solum-newton-pro-2-9-f', 'Newton Pro 2.9″ Freezer', 2.9, 384, 168, { columns: 3, rows: 1 }, { columns: 1, rows: 3 }, true),
  solum('solum-newton-pro-3-45', 'Newton Pro 3.5″ · 3.45 panel', 3.45, 480, 224, { columns: 3, rows: 1 }, { columns: 1, rows: 3 }),
  solum('solum-newton-pro-3-45-f', 'Newton Pro 3.5″ Freezer · 3.45 panel', 3.45, 480, 224, { columns: 3, rows: 1 }, { columns: 1, rows: 3 }, true),
  solum('solum-newton-pro-3-52', 'Newton Pro 3.5″ · 3.52 panel', 3.52, 384, 180, { columns: 3, rows: 1 }, { columns: 1, rows: 3 }),
  solum('solum-newton-pro-3-52-f', 'Newton Pro 3.5″ Freezer · 3.52 panel', 3.52, 384, 180, { columns: 3, rows: 1 }, { columns: 1, rows: 3 }, true),
  solum('solum-newton-pro-4-2', 'Newton Pro 4.2″', 4.2, 400, 300, { columns: 2, rows: 2 }, { columns: 2, rows: 2 }),
  solum('solum-newton-pro-4-3', 'Newton Pro 4.3″', 4.3, 522, 152, { columns: 4, rows: 1 }, { columns: 1, rows: 4 }),
  solum('solum-newton-pro-4-5', 'Newton Pro 4.5″', 4.5, 480, 176, { columns: 4, rows: 1 }, { columns: 1, rows: 4 }),
  solum('solum-newton-pro-5-8', 'Newton Pro 5.8″', 5.8, 792, 272, { columns: 4, rows: 2 }, { columns: 2, rows: 4 }),
  solum('solum-newton-pro-5-8-f', 'Newton Pro 5.8″ Freezer', 5.8, 792, 272, { columns: 4, rows: 2 }, { columns: 2, rows: 4 }, true),
  solum('solum-newton-pro-6-1', 'Newton Pro 6.1″', 6.1, 648, 480, { columns: 3, rows: 3 }, { columns: 3, rows: 3 }),
  solum('solum-newton-pro-7-5', 'Newton Pro 7.5″', 7.5, 480, 800, { columns: 3, rows: 3 }, { columns: 3, rows: 3 }),
  solum('solum-newton-pro-9-7', 'Newton Pro 9.7″', 9.7, 672, 960, { columns: 4, rows: 3 }, { columns: 3, rows: 4 }),
  solum('solum-newton-pro-11-6', 'Newton Pro 11.6″', 11.6, 640, 960, { columns: 4, rows: 3 }, { columns: 3, rows: 4 }),
  solum('solum-newton-pro-12-2', 'Newton Pro 12.2″', 12.2, 768, 960, { columns: 4, rows: 4 }, { columns: 4, rows: 4 }),
  readyHardware('opendisplay-e1001', 'Seeed Studio', 'reTerminal E1001 7.5″', 7.5, 800, 480, ['bw'], 'bw', { columns: 3, rows: 3 }, { columns: 3, rows: 3 }),
  {
    id: 'opendisplay-reterminal-sticky',
    manufacturer: 'Seeed Studio',
    family: 'OpenDisplay',
    name: 'reTerminal sticky 3.97″',
    diagonal: 3.97,
    nativeWidth: 800,
    nativeHeight: 480,
    nativeOrientation: 'landscape',
    palettes: ['bw'],
    defaultPalette: 'bw',
    grid: {
      landscape: { columns: 3, rows: 2 },
      portrait: { columns: 2, rows: 3 },
    },
    source: OPENDISPLAY_HARDWARE_SOURCE,
  },
  {
    id: 'opendisplay-e1002',
    manufacturer: 'Seeed Studio',
    family: 'OpenDisplay',
    name: 'reTerminal E1002 7.3″ Spectra 6',
    diagonal: 7.3,
    nativeWidth: 800,
    nativeHeight: 480,
    nativeOrientation: 'landscape',
    palettes: ['bw', 'spectra6'],
    defaultPalette: 'spectra6',
    grid: {
      landscape: { columns: 3, rows: 3 },
      portrait: { columns: 3, rows: 3 },
    },
    source: OPENDISPLAY_HARDWARE_SOURCE,
  },
  {
    id: 'opendisplay-e1003',
    manufacturer: 'Seeed Studio',
    family: 'OpenDisplay',
    name: 'reTerminal E1003 10.3″',
    diagonal: 10.3,
    nativeWidth: 1404,
    nativeHeight: 1872,
    nativeOrientation: 'portrait',
    palettes: ['bw', 'gray4', 'gray16'],
    defaultPalette: 'gray16',
    grid: {
      landscape: { columns: 4, rows: 3 },
      portrait: { columns: 3, rows: 4 },
    },
    source: OPENDISPLAY_HARDWARE_SOURCE,
  },
  readyHardware('opendisplay-e1004', 'Seeed Studio', 'reTerminal E1004 13.3″ Spectra 6', 13.3, 1200, 1600, ['bw', 'spectra6'], 'spectra6', { columns: 4, rows: 3 }, { columns: 3, rows: 4 }),
  readyHardware('opendisplay-xiao-7-5', 'Seeed Studio', 'XIAO 7.5″ ePaper kit', 7.5, 800, 480, ['bw'], 'bw', { columns: 3, rows: 3 }, { columns: 3, rows: 3 }),
  readyHardware('opendisplay-seeed-7-5-diy', 'Seeed Studio', '7.5″ DIY · EE04', 7.5, 800, 480, ['bw'], 'bw', { columns: 3, rows: 3 }, { columns: 3, rows: 3 }),
  readyHardware('opendisplay-4-26-mono-kit', 'OpenDisplay', 'OpenDisplay 4.26″ Mono Kit', 4.26, 800, 480, ['bw'], 'bw', { columns: 2, rows: 2 }, { columns: 2, rows: 2 }),
  readyHardware('opendisplay-7-3-color-kit', 'OpenDisplay', 'OpenDisplay 7.3″ Color Kit', 7.3, 800, 480, ['bw', 'spectra6'], 'spectra6', { columns: 3, rows: 3 }, { columns: 3, rows: 3 }),
  readyHardware('opendisplay-waveshare-photopainter', 'Waveshare', 'ESP32-S3 PhotoPainter 7.3″', 7.3, 800, 480, ['bw', 'spectra6'], 'spectra6', { columns: 3, rows: 3 }, { columns: 3, rows: 3 }),
  ...CUSTOM_PANEL_PROFILES,
]

export const getDisplayProfile = (id: string): DisplayProfile =>
  DISPLAY_PROFILES.find((profile) => profile.id === id) ??
  DISPLAY_PROFILES.find((profile) => profile.id === 'solum-newton-pro-5-8') ??
  DISPLAY_PROFILES[0]

export const getPixelSize = (
  profile: DisplayProfile,
  orientation: Orientation,
): { width: number; height: number } => {
  const isNative = profile.nativeOrientation === orientation
  return isNative
    ? { width: profile.nativeWidth, height: profile.nativeHeight }
    : { width: profile.nativeHeight, height: profile.nativeWidth }
}
