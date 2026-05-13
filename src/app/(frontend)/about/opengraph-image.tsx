import { generateOGImage, ogSize, ogContentType } from '@/lib/og'

export const size        = ogSize
export const contentType = ogContentType

export default function Image() {
  return generateOGImage('A Studio Built for Precision', 'About XQube Studio')
}
