import { toJpeg, toPng } from 'html-to-image'

export type ImageExportFormat = 'png' | 'jpeg'

interface ImageSize {
  width: number
  height: number
}

export type ImageEdge = 'top' | 'bottom' | 'left' | 'right'

const waitForLayout = async (): Promise<void> => {
  await document.fonts?.ready
  await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
}

const loadImage = async (dataUrl: string): Promise<HTMLImageElement> => {
  const image = new Image()
  image.src = dataUrl
  await image.decode()
  return image
}

export const findMissingInkEdges = (
  pixels: Uint8ClampedArray,
  size: ImageSize,
): ImageEdge[] => {
  const band = Math.min(24, Math.max(10, Math.ceil(Math.min(size.width, size.height) * 0.05)))

  const hasInk = (xStart: number, yStart: number, xEnd: number, yEnd: number): boolean => {
    let inkPixels = 0
    for (let y = yStart; y < yEnd; y += 1) {
      for (let x = xStart; x < xEnd; x += 1) {
        const offset = (y * size.width + x) * 4
        const luminance = pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722
        if (pixels[offset + 3] > 200 && luminance < 110) {
          inkPixels += 1
          if (inkPixels >= 3) return true
        }
      }
    }
    return false
  }

  const edges: Record<ImageEdge, boolean> = {
    top: hasInk(0, 0, size.width, band),
    bottom: hasInk(0, size.height - band, size.width, size.height),
    left: hasInk(0, 0, band, size.height),
    right: hasInk(size.width - band, 0, size.width, size.height),
  }
  return (Object.entries(edges) as Array<[ImageEdge, boolean]>)
    .filter(([, present]) => !present)
    .map(([edge]) => edge)
}

const validateRenderedImage = async (dataUrl: string, size: ImageSize): Promise<void> => {
  const image = await loadImage(dataUrl)
  if (image.naturalWidth !== size.width || image.naturalHeight !== size.height) {
    throw new Error(`Rendered image is ${image.naturalWidth}×${image.naturalHeight}; expected ${size.width}×${size.height}`)
  }

  const canvas = document.createElement('canvas')
  canvas.width = size.width
  canvas.height = size.height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Image validation canvas is unavailable')
  context.drawImage(image, 0, 0)
  const pixels = context.getImageData(0, 0, size.width, size.height).data
  const missingEdges = findMissingInkEdges(pixels, size)
  if (missingEdges.length > 0) {
    throw new Error(`Rendered content is incomplete at the ${missingEdges.join(', ')} edge${missingEdges.length === 1 ? '' : 's'}`)
  }
}

/**
 * Renders after the live element has been laid out at the device's native size.
 * html-to-image copies computed child sizes, so resizing only its cloned root
 * produces a cropped or partially filled bitmap when the preview is scaled.
 */
export const renderDeviceImage = async (
  element: HTMLElement,
  size: ImageSize,
  format: ImageExportFormat,
): Promise<string> => {
  const originalStyle = element.getAttribute('style')
  const host = element.parentElement
  const originalHostStyle = host?.getAttribute('style') ?? null

  Object.assign(element.style, {
    width: `${size.width}px`,
    height: `${size.height}px`,
    maxWidth: 'none',
    maxHeight: 'none',
    aspectRatio: 'auto',
  })
  if (host) Object.assign(host.style, {
    position: 'fixed',
    left: '-100000px',
    top: '0',
    opacity: '0',
    pointerEvents: 'none',
    transform: 'none',
  })

  try {
    await waitForLayout()
    const bounds = element.getBoundingClientRect()
    if (Math.round(bounds.width) !== size.width || Math.round(bounds.height) !== size.height) {
      throw new Error(`Export surface is ${bounds.width}×${bounds.height}; expected ${size.width}×${size.height}`)
    }

    const options = {
      cacheBust: true,
      pixelRatio: 1,
      width: size.width,
      height: size.height,
      canvasWidth: size.width,
      canvasHeight: size.height,
      skipAutoScale: true,
      style: {
        position: 'relative',
        width: `${size.width}px`,
        height: `${size.height}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        aspectRatio: 'auto',
      },
    }

    const dataUrl = format === 'png'
      ? await toPng(element, options)
      : await toJpeg(element, { ...options, quality: 0.96 })
    await validateRenderedImage(dataUrl, size)
    return dataUrl
  } finally {
    if (originalStyle === null) element.removeAttribute('style')
    else element.setAttribute('style', originalStyle)
    if (host) {
      if (originalHostStyle === null) host.removeAttribute('style')
      else host.setAttribute('style', originalHostStyle)
    }
  }
}
