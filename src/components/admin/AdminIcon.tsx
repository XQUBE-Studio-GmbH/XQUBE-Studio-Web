import Image from 'next/image'

export default function AdminIcon() {
  return (
    <Image
      src="/favicon.svg"
      alt="XQube Studio"
      width={32}
      height={32}
      priority
    />
  )
}
