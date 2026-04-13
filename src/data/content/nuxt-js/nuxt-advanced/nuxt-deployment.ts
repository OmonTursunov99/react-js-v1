import type { Topic } from '../../../types'

export const nuxtDeployment: Topic = {
  id: 'nuxt-deployment',
  title: 'Deployment',
  importance: 2,
  status: 'to-learn',
  description: 'Nitro engine, deployment presetlari, Docker, edge deployment',
  content: `DEPLOYMENT — NUXT ILOVANI ISHGA TUSHIRISH
═══════════════════════════════════════

Nuxt 3 Nitro server engine ustiga qurilgan.
Nitro bir xil kodni turli platformalarga deploy qilish imkonini beradi:
Node.js server, Vercel, Netlify, Cloudflare Workers, Docker va boshqalar.

MUHIM: Bitta kod bazasi — ko"plab deploy maqsadlar.
Faqat preset o"zgartirish yetarli.

═══════════════════════════════════════
1. NITRO — NUXT SERVER ENGINE
═══════════════════════════════════════

Nitro — universal server engine:
- Har qanday platformaga deploy qilish (preset orqali)
- Hot module replacement (development)
- Auto-import (server/utils, server/api)
- File-based routing (server/api/)
- Built-in caching va storage
- Tree-shaking — faqat kerakli kod bundle ga tushadi

Nitro mustaqil ham ishlatilishi mumkin (Nuxt siz),
lekin Nuxt 3 da default server engine.

═══════════════════════════════════════
2. PRESETS — DEPLOY MAQSADLARI
═══════════════════════════════════════

Nuxt build vaqtida preset tanlash:

  NITRO_PRESET=vercel nuxt build
  # yoki nuxt.config.ts da:
  nitro: { preset: "vercel" }

Asosiy presetlar:
- node-server — Node.js server (default, standalone)
- vercel — Vercel serverless functions
- netlify — Netlify functions + edge
- cloudflare-pages — Cloudflare Pages + Workers
- cloudflare-module — Cloudflare Workers module format
- deno-server — Deno runtime
- bun — Bun runtime
- static — Static hosting (SSG, pre-rendered)
- aws-lambda — AWS Lambda

MUHIM: Preset o"zgartirish kod o"zgartirishni talab qilmaydi.
Nitro platformaga mos output yaratadi.

═══════════════════════════════════════
3. NUXT GENERATE VS NUXT BUILD
═══════════════════════════════════════

nuxt build:
- SSR server yaratadi
- Runtime da sahifalar render qilinadi
- Server kerak (Node.js yoki serverless)
- Dynamic content uchun ideal

nuxt generate:
- Barcha sahifalarni oldindan HTML ga aylantiradi
- Static fayllar — server kerak emas
- CDN dan xizmat ko"rsatish mumkin
- Tez, arzon, lekin dynamic content cheklangan

Hybrid rendering (Nuxt 3):
- Ba"zi sahifalar SSR, ba"zilari SSG, ba"zilari CSR
- routeRules orqali har bir route uchun alohida strategy

═══════════════════════════════════════
4. DOCKER DEPLOYMENT
═══════════════════════════════════════

Production uchun Docker — eng ishonchli yondashuv:
- Multi-stage build — kichik image
- node:alpine — minimal base image
- .output/ papka — Nitro build natijasi
- PORT environment variable bilan boshqarish

Docker afzalliklari:
- Bir xil muhit: development = staging = production
- Kubernetes, Docker Swarm bilan scaling
- CI/CD pipeline larga oson integratsiya

═══════════════════════════════════════
5. EDGE DEPLOYMENT
═══════════════════════════════════════

Edge — foydalanuvchiga eng yaqin server da ishlash:
- Cloudflare Workers — 300+ lokatsiyada
- Vercel Edge Functions
- Netlify Edge Functions (Deno runtime)

Afzallik: past latency (foydalanuvchiga yaqin)
Cheklov: Node.js API lari to"liq mavjud emas,
fs, child_process, native modullar ishlamaydi.

MUHIM: Edge da database ulanish alohida — connection pooling
(PlanetScale, Neon, Turso kabi edge-compatible DB kerak).

═══════════════════════════════════════
6. ENVIRONMENT VARIABLES — PRODUCTION
═══════════════════════════════════════

Development: .env fayldan o"qiladi
Production: hosting platform UI yoki CLI orqali o"rnatiladi

Platformalarga qarab:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Docker: -e flag yoki docker-compose.yml
- Cloudflare: wrangler secret yoki Dashboard

MUHIM: .env faylni HECH QACHON git ga push qilmang.
.env.example — namuna fayl, haqiqiy qiymatlar siz.`,
  codeExamples: [
    {
      title: 'nuxt.config.ts — deployment sozlamalari',
      language: 'ts',
      code: `// nuxt.config.ts
export default defineNuxtConfig({
  // Nitro server engine sozlamalari
  nitro: {
    // Deploy preset (yoki NITRO_PRESET env orqali)
    preset: "node-server",

    // Route qoidalar — hybrid rendering
    routeRules: {
      // SSG — build vaqtida generate qilinadi
      "/": { prerender: true },
      "/about": { prerender: true },

      // SSR — har safar server da render
      "/dashboard/**": { ssr: true },

      // SWR — 1 soat cache, background revalidate
      "/blog/**": { swr: 3600 },

      // CSR — faqat client da render (SPA)
      "/admin/**": { ssr: false },

      // ISR — 10 daqiqa cache, keyin regenerate
      "/products/**": { isr: 600 },

      // CORS headers
      "/api/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },

    // Compression
    compressPublicAssets: true,
  },

  // Pre-render sahifalar
  routeRules: {
    "/sitemap.xml": { prerender: true },
  },
})`,
      description: 'routeRules — har bir route uchun alohida rendering strategy: SSR, SSG, SWR, ISR, CSR',
    },
    {
      title: 'Dockerfile — multi-stage build',
      language: 'ts',
      code: `# Dockerfile
# ═══ Stage 1: Build ═══
FROM node:20-alpine AS builder

WORKDIR /app

# Dependency cache layer
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Source code va build
COPY . .
RUN yarn build

# ═══ Stage 2: Production ═══
FROM node:20-alpine AS runner

WORKDIR /app

# Faqat build natijasi — minimal image
COPY --from=builder /app/.output ./.output

# Environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Nitro server ishga tushirish
CMD ["node", ".output/server/index.mjs"]

# ═══ docker-compose.yml ═══
# version: "3.8"
# services:
#   app:
#     build: .
#     ports:
#       - "3000:3000"
#     environment:
#       - NUXT_DATABASE_URL=postgresql://db:5432/mydb
#       - NUXT_JWT_SECRET=production-secret
#     depends_on:
#       - db
#   db:
#     image: postgres:16-alpine
#     environment:
#       - POSTGRES_DB=mydb
#       - POSTGRES_PASSWORD=secret`,
      description: 'Multi-stage build — builder stage katta, runner stage faqat .output bilan minimal',
    },
    {
      title: 'Vercel deployment',
      language: 'ts',
      code: `// nuxt.config.ts — Vercel uchun
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
    // Vercel serverless function sozlamalari
    vercel: {
      functions: {
        maxDuration: 30, // sekundlarda (Pro plan: 60s)
      },
    },
  },
})

// vercel.json — qo"shimcha konfiguratsiya
// {
//   "buildCommand": "nuxt build",
//   "outputDirectory": ".vercel/output",
//   "framework": "nuxtjs",
//   "regions": ["iad1"],
//   "env": {
//     "NUXT_PUBLIC_API_BASE": "https://api.example.com"
//   }
// }

// CLI orqali deploy:
// npx vercel --prod

// Yoki GitHub integratsiya:
// 1. Vercel Dashboard → Import Project
// 2. GitHub repo tanlash
// 3. Environment variables o"rnatish
// 4. Har bir push avtomatik deploy`,
      description: 'Vercel — eng oson deploy. GitHub push = avtomatik deploy. Serverless functions bilan SSR.',
    },
    {
      title: 'Cloudflare Workers — edge deployment',
      language: 'ts',
      code: `// nuxt.config.ts — Cloudflare Pages
export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare-pages",
  },
})

// wrangler.toml — Cloudflare konfiguratsiya
// name = "ketmonjon"
// compatibility_date = "2024-01-01"
// pages_build_output_dir = ".output/public"

// Deploy:
// npx wrangler pages deploy .output/public

// Edge-compatible database (D1):
// server/utils/db.ts
export function useDB() {
  // Cloudflare D1 — edge SQLite
  const db = hubDatabase()
  return db
}

// server/api/users.ts
export default defineEventHandler(async (event) => {
  const db = useDB()
  const users = await db
    .prepare("SELECT * FROM users LIMIT 10")
    .all()
  return users.results
})

// MUHIM: Edge da cheklovlar:
// - fs, child_process ishlamaydi
// - Native Node.js modullar yo"q
// - Execution time: 30s (Workers), 50ms CPU (free plan)
// - Memory: 128MB
// - Edge-compatible ORM kerak (Drizzle + D1/Turso)`,
      description: 'Cloudflare Workers — 300+ lokatsiyada, past latency. Lekin Node.js API cheklangan.',
    },
    {
      title: 'nuxt generate — static site generation',
      language: 'ts',
      code: `// nuxt.config.ts — SSG konfiguratsiya
export default defineNuxtConfig({
  // Barcha sahifalarni pre-render qilish
  nitro: {
    prerender: {
      // Avtomatik topilgan route lar
      crawlLinks: true,

      // Qo"shimcha route lar (dynamic)
      routes: [
        "/",
        "/about",
        "/blog/post-1",
        "/blog/post-2",
      ],

      // Ignore patterns
      ignore: ["/admin", "/api"],
    },
  },
})

// package.json scripts:
// "generate": "nuxt generate"
// "preview": "npx serve .output/public"

// CLI:
// yarn generate
// # .output/public/ — tayyor static fayllar

// Deploy static hostinglarga:
// - Netlify: Build command: "nuxt generate", Dir: ".output/public"
// - GitHub Pages: .output/public ni deploy qilish
// - Vercel: Framework preset "Nuxt" tanlash

// Hybrid — ba"zi sahifalar SSG, ba"zilari SSR:
// nitro.routeRules da sahifama-sahifa belgilash
// { "/blog/**": { prerender: true } }
// { "/dashboard/**": { ssr: true } }`,
      description: 'nuxt generate — barcha sahifalar HTML ga. Server kerak emas, CDN dan xizmat ko"rsatiladi.',
    },
  ],
  interviewQA: [
    {
      question: 'Nitro nima va u qanday ishlaydi?',
      answer: 'Nitro — Nuxt 3 ning universal server engine. U bitta kod bazasidan turli platformalarga deploy qilish imkonini beradi: Node.js, Vercel, Netlify, Cloudflare, Docker. Preset orqali maqsadli platforma tanlanadi va Nitro mos output yaratadi. Nitro file-based routing (server/api/), auto-import (server/utils/), built-in caching va tree-shaking beradi. Kod o"zgartirish kerak emas — faqat preset almashtirish yetarli.',
    },
    {
      question: 'nuxt build va nuxt generate farqi nima?',
      answer: 'nuxt build — SSR server yaratadi, sahifalar runtime da render qilinadi, Node.js yoki serverless kerak. nuxt generate — barcha sahifalarni build vaqtida HTML ga aylantiradi (SSG), server kerak emas, CDN dan xizmat ko"rsatiladi. Build — dynamic content uchun (auth, dashboard), generate — statik saytlar uchun (blog, docs). Nuxt 3 da hybrid ham mumkin — routeRules bilan sahifama-sahifa tanlash.',
    },
    {
      question: 'routeRules bilan hybrid rendering qanday ishlaydi?',
      answer: 'nuxt.config.ts da nitro.routeRules orqali har bir route uchun alohida rendering strategy belgilanadi. prerender: true — SSG (build da HTML), ssr: true — SSR (server da render), ssr: false — CSR (SPA rejim), swr: 3600 — stale-while-revalidate (1 soat cache), isr: 600 — incremental static regeneration (10 daqiqa). Glob pattern ishlatiladi: "/blog/**", "/api/**".',
    },
    {
      question: 'Docker bilan Nuxt deploy qanday qilinadi?',
      answer: 'Multi-stage Dockerfile: birinchi stage da yarn install va nuxt build, ikkinchi stage da faqat .output papka ko"chiriladi — image kichik. node:20-alpine base image. Nitro build natijasi .output/server/index.mjs — oddiy Node.js fayl sifatida ishga tushadi. PORT va HOST env orqali boshqariladi. docker-compose bilan database va boshqa servislar birga orchestrate qilinadi.',
    },
    {
      question: 'Edge deployment ning afzalligi va cheklovi nima?',
      answer: 'Afzallik — past latency, chunki kod foydalanuvchiga eng yaqin server da ishlaydi (Cloudflare 300+ lokatsiya). Cheklov — Node.js API lari to"liq mavjud emas: fs, child_process, native modullar ishlamaydi. Database ulanish alohida — an"anaviy PostgreSQL/MySQL bilan connection pooling kerak yoki edge-compatible DB ishlatiladi (PlanetScale, Neon, Turso, Cloudflare D1). Execution time va memory ham cheklangan.',
    },
    {
      question: 'Production da environment variables qanday boshqariladi?',
      answer: 'Development da .env fayldan o"qiladi. Production da hosting platform orqali: Vercel — Project Settings UI, Netlify — Site Settings, Docker — -e flag yoki compose.yml, Cloudflare — wrangler secret. NUXT_ prefiksi runtimeConfig ga avtomatik map bo"ladi. NUXT_PUBLIC_ — client da ham mavjud. .env ni git ga push qilmaslik kerak — .gitignore da bo"lishi shart. .env.example namuna sifatida commit qilinadi.',
    },
  ],
}
