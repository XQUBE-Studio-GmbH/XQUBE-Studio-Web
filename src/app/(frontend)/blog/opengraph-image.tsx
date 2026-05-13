import { generateOGImage, ogSize, ogContentType } from '@/lib/og'

export const size        = ogSize
export const contentType = ogContentType

export default function Image() {
  return generateOGImage('Blog & Insights', 'Game Art · XR · Studio Operations')
}
