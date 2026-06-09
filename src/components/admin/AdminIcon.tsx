import Image from 'next/image'

export default function AdminIcon() {
  return (
    <Image
      src="/favicon.svg"
      alt="XQUBE Studio"
      width={24}
      height={24}
      priority
    />
  )
}
