import type { Topic } from '../../../types'

export const deployment: Topic = {
  id: 'deployment',
  title: 'Deployment',
  importance: 2,
  status: 'to-learn',
  description: 'Vercel, self-hosting, Docker, output konfiguratsiyalari',
  content: `Next.js ni turli platformalarda deploy qilish mumkin. Vercel — rasmiy platforma, lekin self-hosting ham to'liq qo'llab-quvvatlanadi.

═══════════════════════════════════════
  VERCEL DEPLOYMENT
═══════════════════════════════════════

Vercel — Next.js yaratuvchilari platformasi. Eng oson deploy:

1. GitHub repo ni Vercel ga ulash
2. Avtomatik build va deploy
3. Har bir PR uchun preview deployment
4. Edge Network (global CDN)
5. Serverless Functions avtomatik

Vercel qo'shimcha imkoniyatlar:
- Analytics (Web Vitals)
- Edge Middleware
- ISR revalidation
- Image Optimization API

═══════════════════════════════════════
  SELF-HOSTING (NODE.JS)
═══════════════════════════════════════

Standart Node.js server sifatida deploy:

  next build    // .next/ papkasi yaratiladi
  next start    // Node.js server ishga tushadi (port 3000)

Bu holatda BARCHA funksiyalar ishlaydi:
SSR, ISR, API Routes, Middleware, Image Optimization

═══════════════════════════════════════
  DOCKER
═══════════════════════════════════════

Docker bilan containerized deployment:

  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY . .
  RUN npm ci && npm run build

  FROM node:20-alpine AS runner
  WORKDIR /app
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  COPY --from=builder /app/public ./public

  EXPOSE 3000
  CMD ["node", "server.js"]

═══════════════════════════════════════
  OUTPUT KONFIGURATSIYASI
═══════════════════════════════════════

next.config.ts da output sozlash:

1. output: 'standalone' — minimal Node.js server
   - Docker uchun ideal
   - Faqat kerakli fayllar ko'chiriladi
   - node_modules dan faqat zaruriy modullar

2. output: 'export' — to'liq statik export
   - HTML/CSS/JS fayllar (server kerak EMAS)
   - SSR, API Routes, Middleware ISHLAMAYDI
   - Nginx, Apache, S3, GitHub Pages da deploy

═══════════════════════════════════════
  MUHIT O'ZGARUVCHILARI
═══════════════════════════════════════

  .env.local         — lokal development (gitignore)
  .env.development   — development rejimi
  .env.production    — production rejimi
  .env               — barcha rejimlarda

NEXT_PUBLIC_ prefiksi bilan client da ham ko'rinadi:
  NEXT_PUBLIC_API_URL=https://api.example.com

Prefikssiz o'zgaruvchilar FAQAT serverda:
  DATABASE_URL=postgresql://...

═══════════════════════════════════════
  PERFORMANCE TEKSHIRISH
═══════════════════════════════════════

Deploy dan oldin tekshirish kerak:
- next build log lari (statik/dinamik sahifalar)
- Bundle Analyzer (paket hajmi)
- Lighthouse (Core Web Vitals)
- next.config.ts optimizatsiyalar`,
  codeExamples: [
    {
      title: 'Docker bilan Next.js deploy',
      code: `# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Muhit o'zgaruvchilari
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Xavfsizlik — root bo'lmagan foydalanuvchi
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]`,
      language: 'ts',
      description: 'Multi-stage Docker build — minimal image hajmi',
    },
    {
      title: 'next.config.ts deploy sozlamalari',
      code: `// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Docker uchun standalone output
  output: 'standalone',

  // Rasmlar domenli
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.IMAGE_HOST || 'images.example.com',
      },
    ],
  },

  // Custom headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true, // 301
      },
    ]
  },
}

export default nextConfig`,
      language: 'ts',
      description: 'Production uchun next.config.ts sozlamalari',
    },
  ],
  interviewQA: [
    {
      question: "Next.js ni Vercel dan tashqari qayerda deploy qilish mumkin?",
      answer: "Next.js ni istalgan Node.js server da deploy qilish mumkin: AWS (EC2, ECS, Lambda), Google Cloud Run, DigitalOcean, Railway, Fly.io, va boshqalar. Docker bilan containerized deploy qilish eng universal usul. output: 'export' bilan to'liq statik sayt sifatida Nginx, S3, GitHub Pages da ham deploy mumkin (lekin SSR ishlamaydi).",
    },
    {
      question: "output: 'standalone' va output: 'export' orasidagi farq nima?",
      answer: "standalone — minimal Node.js server yaratadi. Barcha funksiyalar ishlaydi (SSR, ISR, API, Middleware). Docker uchun ideal — faqat zaruriy fayllar ko'chiriladi. export — to'liq statik HTML/CSS/JS fayllar. Server KERAK EMAS, lekin SSR, API Routes, Middleware, ISR ISHLAMAYDI. Faqat statik saytlar uchun mos.",
    },
    {
      question: "NEXT_PUBLIC_ prefiksi nima uchun kerak?",
      answer: "NEXT_PUBLIC_ prefiksi bilan muhit o'zgaruvchilari client bundle ga kiradi — brauzerda ko'rinadi. Prefikssiz o'zgaruvchilar FAQAT serverda (Server Components, API Routes, middleware). HECH QACHON maxfiy ma'lumotlarni (API key, DB URL) NEXT_PUBLIC_ bilan eksport qilmang — u build vaqtida JS faylga yoziladi va hamma ko'radi!",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-advanced', topicId: 'image-fonts', label: 'Image & Font Optimization' },
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'middleware', label: 'Middleware' },
  ],
}
