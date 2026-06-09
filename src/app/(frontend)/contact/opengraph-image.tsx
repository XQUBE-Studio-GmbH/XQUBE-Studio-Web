import { generateOGImage, ogSize, ogContentType } from '@/lib/og'

export const dynamic     = 'force-static'
export const size        = ogSize
export const contentType = ogContentType

export default function Image() {
  return generateOGImage("Let's Talk About Your Project", 'Get in Touch')
}
