import type { Topic } from '../../types'

export const webVitals: Topic = {
    id: 'web-vitals',
    title: 'Core Web Vitals',
    importance: 2,
    status: 'to-learn',
    description: 'LCP, FID, CLS — Google performance metrikalari',
    content: `Core Web Vitals — Google-ning web sahifa sifatini o'lchaydigan 3 ta asosiy metrika. SEO reytingiga ta'sir qiladi. Real foydalanuvchi tajribasini o'lchaydi.

═══════════════════════════════════════
  3 TA ASOSIY METRIKA
═══════════════════════════════════════

1. LCP (Largest Contentful Paint) — eng katta element qachon ko'rinadi
   YAXSHI: < 2.5s
   O'RTA: 2.5-4s
   YOMON: > 4s

   Eng katta element: rasm, video, katta matn bloki
   Optimizatsiya: lazy loading, image optimization, code splitting, SSR

2. INP (Interaction to Next Paint) — FID o'rniga (2024+)
   Foydalanuvchi click/tap/keypress qilgandan UI javob berguncha vaqt
   YAXSHI: < 200ms
   O'RTA: 200-500ms
   YOMON: > 500ms

   Optimizatsiya: heavy JS tasks bo'lish, Web Worker, React concurrent features

3. CLS (Cumulative Layout Shift) — sahifa "sakrashi"
   YAXSHI: < 0.1
   O'RTA: 0.1-0.25
   YOMON: > 0.25

   Sabab: rasm/shrift yuklanguncha joy egallaMASLIK
   Optimizatsiya: width/height berish, font-display: swap, skeleton

═══════════════════════════════════════
  REACT-GA TA'SIRI
═══════════════════════════════════════

LCP — React SPA da muammo:
  ❌ Butun JS yuklanguncha sahifa BO'SH
  ✅ Code splitting — faqat kerakli kodni yuklash
  ✅ SSR/SSG — server-da HTML yaratish
  ✅ Streaming — bosqichma-bosqich yuborish

INP — React re-render muammosi:
  ❌ Og'ir re-render UI-ni bloklaydi
  ✅ useDeferredValue, useTransition
  ✅ Virtualization (katta ro'yxatlar)
  ✅ React Compiler (avtomatik memoization)

CLS — Dynamic content:
  ❌ Skeleton-siz loading
  ✅ Placeholder/skeleton ko'rsatish
  ✅ Rasm hajmini oldindan belgilash

═══════════════════════════════════════
  O'LCHASH VOSITALARI
═══════════════════════════════════════

Lab (development):
  - Chrome DevTools → Lighthouse
  - Chrome DevTools → Performance tab
  - PageSpeed Insights (web.dev/measure)

Field (real users):
  - Chrome User Experience Report (CrUX)
  - web-vitals kutubxonasi (npm)
  - Google Search Console

web-vitals kutubxonasi:
  import { onLCP, onINP, onCLS } from 'web-vitals'
  onLCP(console.log)
  onINP(console.log)
  onCLS(console.log)`,
    codeExamples: [
      {
        title: 'web-vitals — metrikalarni o\'lchash',
        language: 'tsx',
        code: `import { onLCP, onINP, onCLS, type Metric } from 'web-vitals'

// Metrikalarni analytics-ga yuborish
function sendToAnalytics(metric: Metric) {
  const body = {
    name: metric.name,          // 'LCP', 'INP', 'CLS'
    value: metric.value,        // millisekund yoki score
    rating: metric.rating,      // 'good', 'needs-improvement', 'poor'
    id: metric.id,              // unique ID
    navigationType: metric.navigationType,
  }

  // Beacon API — sahifa yopilayotganda ham yuboradi
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', JSON.stringify(body))
  }
}

// Barcha Core Web Vitals-ni kuzatish
onLCP(sendToAnalytics)   // Largest Contentful Paint
onINP(sendToAnalytics)   // Interaction to Next Paint
onCLS(sendToAnalytics)   // Cumulative Layout Shift

// Console-da ko'rish (development)
if (import.meta.env.DEV) {
  onLCP(metric => {
    console.log(\`LCP: \${metric.value.toFixed(0)}ms [\${metric.rating}]\`)
  })
  onINP(metric => {
    console.log(\`INP: \${metric.value.toFixed(0)}ms [\${metric.rating}]\`)
  })
  onCLS(metric => {
    console.log(\`CLS: \${metric.value.toFixed(3)} [\${metric.rating}]\`)
  })
}`,
        description: 'web-vitals kutubxonasi — real user metrikalari. sendBeacon — sahifa yopilayotganda ham yuboradi. rating: good/needs-improvement/poor — avtomatik baholash.',
      },
      {
        title: 'CLS optimizatsiya — rasm va skeleton',
        language: 'tsx',
        code: `// ❌ CLS MUAMMO — rasm yuklanguncha joy yo'q
function BadImage() {
  return <img src="/hero.jpg" alt="Hero" />
  // Rasm yuklanguncha 0px — keyin 400px — sahifa SAKRAYDI
}

// ✅ CLS YECHIM — hajm oldindan belgilangan
function GoodImage() {
  return (
    <img
      src="/hero.jpg"
      alt="Hero"
      width={800}
      height={400}
      className="w-full h-auto"  // responsive, lekin aspect ratio saqlanadi
      loading="lazy"              // viewport-dan tashqarida yuklanMAYDI
    />
  )
}

// ✅ Skeleton — loading vaqtida joy egallash
function ProductCard({ product }: { product?: Product }) {
  if (!product) {
    return (
      <div className="animate-pulse border rounded p-4">
        <div className="bg-gray-200 h-48 rounded mb-4" />  {/* rasm joyi */}
        <div className="bg-gray-200 h-6 rounded w-3/4 mb-2" />  {/* title */}
        <div className="bg-gray-200 h-4 rounded w-1/2" />  {/* price */}
      </div>
    )
  }

  return (
    <div className="border rounded p-4">
      <img src={product.image} alt={product.name}
        width={400} height={192} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-gray-500">{product.price} so'm</p>
    </div>
  )
}`,
        description: 'CLS oldini olish: 1) Rasm width/height berish (aspect ratio saqlanadi), 2) Skeleton loading (joy egallash), 3) loading="lazy" (offscreen rasmlarni kechiktirish).',
      },
    ],
    interviewQA: [
      {
        question: 'Core Web Vitals nima?',
        answer: `Google-ning 3 ta asosiy web performance metrikasi: 1) LCP (Largest Contentful Paint) — eng katta element qachon ko'rinadi, yaxshi <2.5s. 2) INP (Interaction to Next Paint) — foydalanuvchi interaksiyasiga javob vaqti, yaxshi <200ms. 3) CLS (Cumulative Layout Shift) — sahifa layout "sakrashi", yaxshi <0.1. SEO reytingiga ta'sir qiladi. Real foydalanuvchi tajribasini o'lchaydi (lab emas, field metrikalari).`,
      },
      {
        question: 'React SPA-da LCP muammosi nima va qanday hal qilinadi?',
        answer: `SPA-da muammo: butun JS bundle yuklanguncha sahifa BO'SH — LCP juda katta. Yechimlar: 1) Code splitting — faqat kerakli sahifa kodini yuklash (React.lazy), 2) SSR — server-da HTML yaratish (Next.js), foydalanuvchi JS yuklanmasdan oldin kontentni ko'radi, 3) Streaming SSR — bosqichma-bosqich HTML yuborish, 4) Critical CSS inline — birinchi paint tezroq, 5) Rasm optimization — WebP, lazy loading, preload hero image.`,
      },
      {
        question: 'CLS nima va React-da qanday oldini olinadi?',
        answer: `CLS — sahifa elementlarining kutilmagan siljishi (layout shift). Sabablari: 1) Rasm/video hajmi belgilanmagan — yuklanguncha 0px, keyin kengayadi, 2) Font yuklanishi — matn o'lchami o'zgaradi, 3) Dynamic content — yuqoridan element qo'shilsa pastdagilar siljiydi. React-da yechim: rasm-ga width/height berish, Skeleton component (loading vaqtida joy egallash), font-display: swap, dynamic content uchun min-height, Suspense fallback to'g'ri o'lchamda.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'performance', topicId: 'profiler-devtools', label: 'React Profiler' },
      { sectionId: 'performance', topicId: 'code-splitting', label: 'Code Splitting (LCP)' },
      { sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR (performance)' },
    ],
  }
