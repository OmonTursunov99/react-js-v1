import type { Topic } from '../../types'

export const bundleOptimization: Topic = {
    id: 'bundle-optimization',
    title: 'Bundle Optimization',
    importance: 2,
    status: 'to-learn',
    description: 'Tree shaking, bundle analysis, dynamic imports',
    content: `Bundle optimization — production build hajmini kamaytirish. Kichikroq bundle = tezroq yuklash = yaxshiroq UX va SEO.

═══════════════════════════════════════
  BUNDLE HAJMI NIMA UCHUN MUHIM
═══════════════════════════════════════

Har 100KB JS:
  - ~300ms parse/compile vaqti (o'rtacha mobil qurilma)
  - Network yuklash vaqti (3G: ~3s, 4G: ~0.5s)
  - TTI (Time to Interactive) kechikishi

Target bundle hajmlari:
  Kichik ilova: <200KB (gzipped)
  O'rta ilova: 200-500KB
  Katta ilova: 500KB+ (code splitting SHART)

═══════════════════════════════════════
  TREE SHAKING
═══════════════════════════════════════

Tree shaking — ishlatilMAGAN kodni OLIB TASHLASH.
ES modules (import/export) bilan ishlaydi:

  // lodash — butun kutubxona (70KB)
  import _ from 'lodash'
  _.debounce(fn, 300)

  // lodash-es — faqat kerakli funksiya (2KB)
  import { debounce } from 'lodash-es'
  debounce(fn, 300)

  // Eng yaxshi — alohida import
  import debounce from 'lodash/debounce'

Tree shaking ishlashi uchun:
  ✅ ES modules (import/export) ishlatish
  ✅ Side effect-siz modullar ("sideEffects": false)
  ❌ CommonJS (require) — tree shake bo'lMAYDI

═══════════════════════════════════════
  BUNDLE ANALYSIS
═══════════════════════════════════════

Bundle tarkibini vizual ko'rish:

Vite:
  npx vite-bundle-visualizer
  // Interactive treemap — har chunk va modul hajmi

Webpack:
  npx webpack-bundle-analyzer

Ko'rish kerak:
  - Eng katta dependency-lar
  - Duplicate dependency-lar
  - Ishlatilmagan kutubxonalar

═══════════════════════════════════════
  OPTIMIZATSIYA STRATEGIYALARI
═══════════════════════════════════════

1. Katta kutubxonalarni almashtirish:
   moment.js (300KB) → date-fns (tree-shakeable)
   lodash (70KB) → lodash-es yoki native JS
   axios (13KB) → fetch API (built-in)

2. Dynamic import:
   const Chart = lazy(() => import('chart-library'))
   // Faqat kerak bo'lganda yuklanadi

3. Vendor splitting:
   React, ReactDOM — alohida chunk (kamdan-kam o'zgaradi, keshlanadi)

4. Image optimization:
   WebP format, lazy loading, srcset

5. Compression:
   gzip yoki brotli — 60-80% hajm kamaytirish

═══════════════════════════════════════
  VITE OPTIMIZATSIYA
═══════════════════════════════════════

Vite avtomatik:
  ✅ Tree shaking (Rollup/Rolldown)
  ✅ Code splitting (dynamic import)
  ✅ CSS code splitting
  ✅ Asset hashing (cache busting)
  ✅ Minification (esbuild/terser)

Manual sozlash:
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router'],
        }
      }
    }
  }`,
    codeExamples: [
      {
        title: 'Bundle analysis va optimization',
        language: 'ts',
        code: `// 1. BUNDLE ANALYSIS — hajmni ko'rish
// Terminal: npx vite-bundle-visualizer

// 2. KATTA DEPENDENCY-LARNI ALMASHTIRISH

// ❌ Butun lodash (70KB)
import _ from 'lodash'
_.debounce(fn, 300)
_.throttle(fn, 100)

// ✅ Faqat kerakli funksiyalar (2-3KB)
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

// ✅✅ Native JS (0KB qo'shimcha)
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ❌ moment.js (300KB!)
import moment from 'moment'
moment().format('YYYY-MM-DD')

// ✅ date-fns (tree-shakeable, faqat kerakli funksiya)
import { format } from 'date-fns'
format(new Date(), 'yyyy-MM-dd')

// ✅✅ Intl API (built-in, 0KB)
new Intl.DateTimeFormat('uz', { dateStyle: 'medium' }).format(new Date())`,
        description: 'Bundle hajmini kamaytirish: katta kutubxonalarni kichikroq alternativalar yoki native JS bilan almashtirish. lodash → lodash/specific yoki native, moment → date-fns yoki Intl.',
      },
      {
        title: 'Vite — manual chunks va optimization',
        language: 'ts',
        code: `// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Chunk hajm ogohlantirish chegarasi
    chunkSizeWarningLimit: 500, // KB

    rollupOptions: {
      output: {
        // Vendor chunk-larni ajratish
        manualChunks(id) {
          // React core — alohida chunk (kamdan-kam o'zgaradi)
          if (id.includes('node_modules/react')) {
            return 'react-vendor'
          }
          // Router — alohida
          if (id.includes('node_modules/react-router')) {
            return 'router'
          }
          // UI kutubxonalar — alohida
          if (id.includes('node_modules/@tanstack')) {
            return 'tanstack'
          }
        },
      },
    },

    // Source map production-da yo'q
    sourcemap: false,

    // Minification
    minify: 'esbuild', // tezroq, yoki 'terser' (kichikroq)
  },
})

// Natija:
// react-vendor.js   — 130KB (React + ReactDOM, kamdan-kam o'zgaradi → cache)
// router.js         — 20KB  (React Router)
// tanstack.js       — 30KB  (TanStack Query)
// index.js          — 50KB  (bizning kod)
// DashboardPage.js  — 15KB  (lazy loaded)`,
        description: 'manualChunks — vendor kutubxonalarni alohida chunk-ga ajratish. Afzallik: ular kamdan-kam o\'zgaradi, browser keshda saqlaydi. Bizning kod o\'zgarsa — vendor qayta yuklanMAYDI.',
      },
    ],
    interviewQA: [
      {
        question: 'Tree shaking nima va qanday ishlaydi?',
        answer: `Tree shaking — build vaqtida ishlatilMAGAN kodni olib tashlash. ES modules (import/export) bilan ishlaydi — bundler statik tahlil qiladi va import qilinmagan export-larni olib tashlaydi. Misol: lodash-es dan faqat debounce import qilsangiz — qolgan 200+ funksiya bundle-ga qo'shilMAYDI. Ishlashi uchun: ES modules ishlatish (CommonJS require emas), sideEffects: false package.json-da, production build (development-da o'chirilgan).`,
      },
      {
        question: 'Bundle hajmini qanday kamaytirish mumkin?',
        answer: `1) Bundle analysis — vite-bundle-visualizer bilan katta dependency-larni topish. 2) Tree shaking — faqat kerakli funksiyalarni import qilish (lodash → lodash/debounce). 3) Katta kutubxonalarni almashtirish (moment→date-fns, axios→fetch). 4) Code splitting — dynamic import bilan alohida chunk. 5) Vendor splitting — react, react-dom alohida chunk (cache). 6) Compression — gzip/brotli (60-80% kamaytirish). 7) Lazy loading — og'ir komponentlar kerak bo'lganda. Qoida: avval o'lchang (analysis), keyin optimizatsiya.`,
      },
      {
        question: 'Vendor chunk nima uchun ajratiladi?',
        answer: `Vendor chunk — node_modules (react, react-dom, router) alohida fayl. Sabab: vendor kod kamdan-kam o'zgaradi (faqat dependency yangilanganda), bizning kod tez-tez o'zgaradi. Ajratilsa: vendor chunk browser keshda UZOQ saqlanadi (months), deploy qilganda faqat o'zgargan chunk qayta yuklanadi (bizning kod). Natija: qayta tashrif buyuruvchilar uchun tezroq yuklash — faqat o'zgargan kichik chunk yuklanadi, 130KB React qayta yuklanMAYDI.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'code-splitting', label: 'Code Splitting' },
      { sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'Lazy Loading' },
    ],
  }
