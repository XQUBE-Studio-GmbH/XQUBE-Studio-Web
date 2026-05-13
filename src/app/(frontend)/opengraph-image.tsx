import { generateOGImage, ogSize, ogContentType } from '@/lib/og'

export const size        = ogSize
export const contentType = ogContentType

export default function Image() {
  return generateOGImage('Where Art Meets Precision', 'AAA Game Art & XR Production')
}
