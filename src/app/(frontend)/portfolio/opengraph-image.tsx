import { generateOGImage, ogSize, ogContentType } from '@/lib/og'

export const size        = ogSize
export const contentType = ogContentType

export default function Image() {
  return generateOGImage('Our Work', 'AAA Game Art Portfolio')
}
