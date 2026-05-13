import { generateOGImage, ogSize, ogContentType } from '@/lib/og'

export const size        = ogSize
export const contentType = ogContentType

export default function Image() {
  return generateOGImage('Production-Grade Services', 'Game Art · VR · Interactive Dev · Staff Aug')
}
