import type { Topic } from '../../../types'

export const imageFonts: Topic = {
  id: 'image-fonts',
  title: 'Image & Font Optimization',
  importance: 2,
  status: 'to-learn',
  description: 'next/image va next/font bilan optimallashtirish',
  content: `Next.js rasmlar va shriftlarni avtomatik optimallashtirish uchun maxsus komponentlar taqdim etadi. Bu Core Web Vitals ko'rsatkichlarini yaxshilaydi.

═══════════════════════════════════════
  NEXT/IMAGE
═══════════════════════════════════════

next/image — HTML <img> ni kengaytirgan komponent:

Avtomatik optimizatsiya:
- Format o'zgartirish (WebP/AVIF ga)
- Lazy loading (standart)
- Responsive o'lchamlar
- CLS (Cumulative Layout Shift) oldini olish
- Placeholder blur effekti

═══════════════════════════════════════
  IMAGE ASOSIY PROPLARI
═══════════════════════════════════════

  <Image
    src="/hero.jpg"          // Rasm manzili
    alt="Tavsif"             // Alt text (majburiy!)
    width={800}              // Piksel kengligi
    height={600}             // Piksel balandligi
    priority                 // LCP rasm uchun (lazy loading O'CHIRISH)
    placeholder="blur"       // Yuklanish vaqtida blur effekt
    quality={75}             // Sifat (1-100, standart: 75)
  />

═══════════════════════════════════════
  FILL REJIMI
═══════════════════════════════════════

Agar rasm o'lchami noma'lum bo'lsa — fill ishlatish:

  <div style={{ position: 'relative', width: '100%', height: 300 }}>
    <Image
      src="/photo.jpg"
      alt="Rasm"
      fill                        // Konteyner to'ldiradi
      style={{ objectFit: 'cover' }}
    />
  </div>

fill ishlatganda width/height KERAK EMAS, lekin
ota element position: relative bo'lishi SHART.

═══════════════════════════════════════
  TASHQI RASMLAR
═══════════════════════════════════════

Tashqi domenlardan rasm ishlatish uchun next.config.ts da ruxsat berish kerak:

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'example.com' },
    ],
  }

═══════════════════════════════════════
  NEXT/FONT
═══════════════════════════════════════

next/font shriftlarni build vaqtida yuklab oladi va self-host qiladi.
Google Fonts yoki local shriftlar ishlatish mumkin.

Afzalliklari:
- Tashqi so'rov yo'q (Google ga)
- Layout shift yo'q (font-display: swap)
- Avtomatik subset (faqat kerakli belgilar)

═══════════════════════════════════════
  GOOGLE FONTS
═══════════════════════════════════════

  import { Inter, Roboto } from 'next/font/google'

  const inter = Inter({ subsets: ['latin', 'cyrillic'] })

  export default function Layout({ children }) {
    return <body className={inter.className}>{children}</body>
  }

═══════════════════════════════════════
  LOCAL FONTS
═══════════════════════════════════════

  import localFont from 'next/font/local'

  const myFont = localFont({
    src: './fonts/MyFont.woff2',
    display: 'swap',
  })`,
  codeExamples: [
    {
      title: 'next/image turli holatlar',
      code: `import Image from 'next/image'

// 1. Lokal rasm (statik import — avtomatik width/height)
import heroImage from '@/public/hero.jpg'

export function Hero() {
  return (
    <Image
      src={heroImage}
      alt="Bosh sahifa rasmi"
      placeholder="blur"  // avtomatik blur placeholder
      priority             // LCP uchun — lazy loading o'chirish
    />
  )
}

// 2. Tashqi rasm (width/height majburiy)
export function Avatar({ url }: { url: string }) {
  return (
    <Image
      src={url}
      alt="Foydalanuvchi rasmi"
      width={64}
      height={64}
      className="rounded-full"
    />
  )
}

// 3. Fill rejimi (responsive)
export function Banner() {
  return (
    <div className="relative w-full h-64">
      <Image
        src="/banner.jpg"
        alt="Banner"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}`,
      language: 'tsx',
      description: 'next/image — lokal, tashqi va fill rejimlar',
    },
    {
      title: 'next/font sozlash',
      code: `// app/layout.tsx
import { Inter, Noto_Sans } from 'next/font/google'
import localFont from 'next/font/local'

// Google Font
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',  // CSS variable sifatida
})

// Ikkinchi Google Font
const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '700'],
  variable: '--font-noto',
})

// Lokal font
const customFont = localFont({
  src: [
    { path: './fonts/Custom-Regular.woff2', weight: '400' },
    { path: './fonts/Custom-Bold.woff2', weight: '700' },
  ],
  variable: '--font-custom',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz" className={\`\${inter.variable} \${notoSans.variable}\`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}`,
      language: 'tsx',
      description: 'Google va lokal shriftlarni CSS variable sifatida ishlatish',
    },
    {
      title: 'next.config.ts rasm sozlamalari',
      code: `// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Tashqi domenlar uchun ruxsat
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
    // Rasm formatlari
    formats: ['image/avif', 'image/webp'],
    // Device sizes (responsive breakpoints)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Image sizes (thumbnail va kichik rasmlar)
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
}

export default nextConfig`,
      language: 'ts',
      description: 'next.config.ts da rasm optimizatsiya sozlamalari',
    },
  ],
  interviewQA: [
    {
      question: 'next/image oddiy <img> dan qanday farq qiladi?',
      answer: "next/image avtomatik: 1) Format o'zgartirish — WebP/AVIF. 2) Lazy loading — viewport da ko'rinmaganda yuklanmaydi. 3) Responsive — sizes prop bilan turli ekranlar uchun turli o'lcham. 4) CLS prevention — width/height majburiy, joy band qilinadi. 5) Blur placeholder. 6) Server-side optimization — rasm serverda resize/compress qilinadi.",
    },
    {
      question: "next/font nima afzallik beradi?",
      answer: "next/font shriftlarni build vaqtida yuklab self-host qiladi. Afzalliklari: 1) Tashqi so'rov yo'q — Google Fonts ga murojaat kerak emas. 2) Layout shift yo'q — shrift oldindan tayyorlanadi. 3) Avtomatik subset — faqat kerakli belgilar yuklanadi. 4) CSS variable sifatida ishlatish mumkin — Tailwind bilan oson integratsiya.",
    },
    {
      question: "priority prop qachon ishlatiladi?",
      answer: "priority — LCP (Largest Contentful Paint) rasm uchun ishlatiladi. Bu lazy loading ni O'CHIRADI va rasmni darhol yuklaydi. Sahifaning yuqori qismida ko'rinadigan eng katta rasm (hero image, banner) uchun priority qo'yish kerak. Faqat 1-2 rasmga priority berish tavsiya etiladi — ko'p qo'yilsa samarasi yo'qoladi.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'app-router', label: 'App Router' },
    { techId: 'next-js', sectionId: 'nextjs-advanced', topicId: 'deployment', label: 'Deployment' },
  ],
}
