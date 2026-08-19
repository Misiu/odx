import type {
  CustomDriverProfile,
  DisplayProfile,
  GridSize,
  PaletteId,
} from '../types'

const TOOLBOX_SOURCE = 'https://opendisplay.org/firmware/toolbox/index.html'

export const CUSTOM_DRIVERS: CustomDriverProfile[] = [
  { id: 'en04', name: 'Seeed EN04 · nRF52840', connectorPins: [24, 50], source: `${TOOLBOX_SOURCE}?driver=en04` },
  { id: 'en05', name: 'Seeed EN05 · nRF52840', connectorPins: [24], source: `${TOOLBOX_SOURCE}?driver=en05` },
  { id: 'ee04', name: 'Seeed EE04 · ESP32-S3', connectorPins: [24, 50], source: `${TOOLBOX_SOURCE}?driver=ee04` },
  { id: 'ee05', name: 'Seeed EE05 · ESP32-S3', connectorPins: [24], source: `${TOOLBOX_SOURCE}?driver=ee05` },
]

const adaptiveGrid = (diagonal: number): Record<'landscape' | 'portrait', GridSize> => {
  if (diagonal <= 1.6) return { landscape: { columns: 1, rows: 1 }, portrait: { columns: 1, rows: 1 } }
  if (diagonal <= 2.2) return { landscape: { columns: 2, rows: 1 }, portrait: { columns: 1, rows: 2 } }
  if (diagonal <= 3.6) return { landscape: { columns: 3, rows: 1 }, portrait: { columns: 1, rows: 3 } }
  if (diagonal <= 4.3) return { landscape: { columns: 2, rows: 2 }, portrait: { columns: 2, rows: 2 } }
  if (diagonal <= 6) return { landscape: { columns: 3, rows: 2 }, portrait: { columns: 2, rows: 3 } }
  return { landscape: { columns: 3, rows: 3 }, portrait: { columns: 3, rows: 3 } }
}

const customPanel = (
  toolboxId: string,
  name: string,
  diagonal: number,
  width: number,
  height: number,
  palette: PaletteId,
  connectorPins: number[],
): DisplayProfile => ({
  id: `custom-${toolboxId}`,
  manufacturer: 'Custom',
  family: 'Custom',
  name,
  diagonal,
  nativeWidth: width,
  nativeHeight: height,
  nativeOrientation: width >= height ? 'landscape' : 'portrait',
  palettes: palette === 'bw' ? ['bw'] : ['bw', palette],
  defaultPalette: palette,
  grid: adaptiveGrid(diagonal),
  source: TOOLBOX_SOURCE,
  connectorPins,
  toolboxId,
})

// OpenDisplay Toolbox panel presets compatible with Seeed EN04/EN05/EE04/EE05.
export const CUSTOM_PANEL_PROFILES: DisplayProfile[] = [
  customPanel('ep154-200x200', '1.54″ Monochrome · 200×200', 1.54, 200, 200, 'bw', [24]),
  customPanel('ep154-152x152', '1.54″ B/W/R · 152×152', 1.54, 152, 152, 'bwr', [24]),
  customPanel('ep154yr-200x200', '1.54″ B/W/R/Y · 200×200', 1.54, 200, 200, 'bwry', [24]),
  customPanel('ep213-122x250', '2.13″ Monochrome · 122×250', 2.13, 122, 250, 'bw', [24]),
  customPanel('ep213r-122x250', '2.13″ B/W/R/Y · 122×250', 2.13, 122, 250, 'bwry', [24]),
  customPanel('ep266yr-184x360', '2.66″ B/W/R/Y · 184×360', 2.66, 184, 360, 'bwry', [24]),
  customPanel('ep29-128x296', '2.9″ Flexible monochrome · 128×296', 2.9, 128, 296, 'bw', [24]),
  customPanel('ep29r-128x296', '2.9″ B/W/R/Y · 128×296', 2.9, 128, 296, 'bwry', [24]),
  customPanel('ep29yr-168x384', '2.9″ B/W/R/Y · 168×384', 2.9, 168, 384, 'bwry', [24]),
  customPanel('ep35yr-184x384', '3.5″ B/W/R/Y · 184×384', 3.5, 184, 384, 'bwry', [24]),
  customPanel('ep397-800x480', '3.97″ Monochrome · 800×480', 3.97, 800, 480, 'bw', [24]),
  customPanel('ep397-800x480-4gray', '3.97″ 4-level grayscale · 800×480', 3.97, 800, 480, 'gray4', [24]),
  customPanel('ep397yr-800x480', '3.97″ B/W/R/Y · 800×480', 3.97, 800, 480, 'bwry', [24]),
  customPanel('ep42-400x300', '4.2″ Monochrome · 400×300', 4.2, 400, 300, 'bw', [24]),
  customPanel('ep42yr-400x300', '4.2″ B/W/R/Y · 400×300', 4.2, 400, 300, 'bwry', [24]),
  customPanel('ep426-800x480', '4.26″ Monochrome · 800×480', 4.26, 800, 480, 'bw', [24]),
  customPanel('ep426-800x480-4g', '4.26″ 4-level grayscale · 800×480', 4.26, 800, 480, 'gray4', [24]),
  customPanel('ep583-648x480', '5.83″ Monochrome · 648×480', 5.83, 648, 480, 'bw', [24]),
  customPanel('ep75-800x480', '7.5″ Monochrome · 800×480', 7.5, 800, 480, 'bw', [24]),
  customPanel('ep75-800x480-4gray', '7.5″ 4-level grayscale · 800×480', 7.5, 800, 480, 'gray4', [24]),
  customPanel('ep73-spectra-800x480', '7.3″ Spectra 6 · 800×480', 7.3, 800, 480, 'spectra6', [50]),
  customPanel('ep75-bwry-800x480', '7.5″ B/W/R/Y · 800×480', 7.5, 800, 480, 'bwry', [24]),
]

export const isPanelCompatible = (
  driver: CustomDriverProfile,
  panel: DisplayProfile,
): boolean => Boolean(panel.connectorPins?.some((pins) => driver.connectorPins.includes(pins)))

export const DEFAULT_CUSTOM_DRIVER_ID = 'en04'
export const DEFAULT_CUSTOM_PANEL_ID = 'custom-ep73-spectra-800x480'
