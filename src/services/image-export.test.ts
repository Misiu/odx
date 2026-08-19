import { describe, expect, it } from 'vitest'
import { findMissingInkEdges } from './image-export'

const whiteImage = (width: number, height: number): Uint8ClampedArray => {
  const pixels = new Uint8ClampedArray(width * height * 4)
  pixels.fill(255)
  return pixels
}

const drawInkPixel = (
  pixels: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): void => {
  const offset = (y * width + x) * 4
  pixels[offset] = 0
  pixels[offset + 1] = 0
  pixels[offset + 2] = 0
  pixels[offset + 3] = 255
}

const drawThreeInkPixels = (
  pixels: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): void => {
  for (let offset = 0; offset < 3; offset += 1) drawInkPixel(pixels, width, x + offset, y)
}

describe('export image edge validation', () => {
  it('accepts content that reaches all four output edges', () => {
    const size = { width: 120, height: 80 }
    const pixels = whiteImage(size.width, size.height)
    drawThreeInkPixels(pixels, size.width, 50, 4)
    drawThreeInkPixels(pixels, size.width, 50, 75)
    drawThreeInkPixels(pixels, size.width, 4, 40)
    drawThreeInkPixels(pixels, size.width, 113, 40)

    expect(findMissingInkEdges(pixels, size)).toEqual([])
  })

  it('detects the right and bottom clipping seen in scaled previews', () => {
    const size = { width: 120, height: 80 }
    const pixels = whiteImage(size.width, size.height)
    drawThreeInkPixels(pixels, size.width, 50, 4)
    drawThreeInkPixels(pixels, size.width, 4, 40)

    expect(findMissingInkEdges(pixels, size)).toEqual(['bottom', 'right'])
  })
})
