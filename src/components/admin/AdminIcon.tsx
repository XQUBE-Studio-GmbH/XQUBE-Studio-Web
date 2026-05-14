import Image from 'next/image'

export default function AdminIcon() {
  return (
    <Image
      src="/favicon.svg"
      alt="XQube Studio"
      width={24}
      height={24}
      priority
    />
  )
}
