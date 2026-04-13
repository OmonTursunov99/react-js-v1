import type { Topic } from '../../../types'

export const codeSplitting: Topic = {
    id: 'code-splitting',
    title: 'Code Splitting',
    importance: 3,
    status: 'to-learn',
    description: 'Dynamic import, lazy loading',
    content: `Code splitting — ilovani kichik bo'laklarga (chunk) ajratish. Foydalanuvchi faqat kerakli kodni yuklaydi. Initial load tezlashadi.

═══════════════════════════════════════
  MUAMMO: BITTA KATTA BUNDLE
═══════════════════════════════════════

Default-da bundler (Vite/Webpack) barcha kodni BITTA faylga qo'shadi:
  bundle.js — 800KB
  ├── React + ReactDOM — 130KB
  ├── Bosh sahifa — 20KB
  ├── Admin panel — 100KB (faqat admin ko'radi)
  ├── Chart kutubxona — 200KB (faqat analytics sahifada)
  └── Boshqa sahifalar — 350KB

Foydalanuvchi faqat bosh sahifani ko'rmoqchi — 800KB yuklaydi!

Code splitting bilan:
  main.js — 170KB (React + bosh sahifa)
  admin.js — 100KB (admin kirganda yuklanadi)
  analytics.js — 200KB (analytics ochganda yuklanadi)

═══════════════════════════════════════
  DYNAMIC IMPORT
═══════════════════════════════════════

  // Static import — bundle-ga qo'shiladi
  import { Chart } from 'chart-library'

  // Dynamic import — alohida chunk bo'ladi
  const module = await import('chart-library')
  const Chart = module.Chart

Vite/Webpack dynamic import-ni ko'rganda:
  1. Alohida .js fayl (chunk) yaratadi
  2. Runtime-da kerak bo'lganda network orqali yuklaydi
  3. Browser keshga saqlaydi

═══════════════════════════════════════
  CODE SPLITTING STRATEGIYALARI
═══════════════════════════════════════

1. Route-based (eng keng tarqalgan):
   Har sahifa alohida chunk
   React.lazy(() => import('./pages/Admin'))

2. Component-based:
   Og'ir komponentlar alohida chunk
   const Chart = lazy(() => import('./components/Chart'))

3. Library-based:
   Katta kutubxonalar alohida
   const { PDFViewer } = await import('pdf-library')

4. Feature-based:
   Feature flag bilan
   if (featureEnabled) {
     const module = await import('./features/newFeature')
   }

═══════════════════════════════════════
  React.lazy + Suspense
═══════════════════════════════════════

  const AdminPage = lazy(() => import('./pages/AdminPage'))

  <Suspense fallback={<Loading />}>
    <AdminPage />
  </Suspense>

Cheklovlar:
  - Faqat default export
  - Server-side rendering bilan murakkab
  - Error handling uchun ErrorBoundary kerak

═══════════════════════════════════════
  VITE CODE SPLITTING
═══════════════════════════════════════

Vite (Rollup/Rolldown) avtomatik:
  - dynamic import() → alohida chunk
  - node_modules → vendor chunk
  - CSS code splitting (har chunk o'z CSS-i)

Manual chunk-lar:
  // vite.config.ts
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
        title: 'Route-based code splitting',
        language: 'tsx',
        code: `import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

// Har sahifa — alohida chunk
const HomePage = lazy(() => import('./pages/HomePage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

// Loading komponent
function PageSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  )
}

function lazyPage(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: lazyPage(HomePage) },
      { path: 'products', element: lazyPage(ProductsPage) },
      { path: 'admin', element: lazyPage(AdminPage) },
      { path: 'analytics', element: lazyPage(AnalyticsPage) },
    ],
  },
])

// Build natijasi:
// main.js       — 170KB (React + layout)
// HomePage.js   — 20KB
// Products.js   — 35KB
// Admin.js      — 100KB (admin kirganda yuklaydi)
// Analytics.js  — 200KB (chart library bilan)`,
        description: 'Har sahifa alohida chunk. Foydalanuvchi faqat kiradigan sahifa kodini yuklaydi. Skeleton loading — UX uchun yaxshiroq (spinner o\'rniga).',
      },
      {
        title: 'Component-based code splitting',
        language: 'tsx',
        code: `import { lazy, Suspense, useState } from 'react'

// Og'ir komponent — faqat kerak bo'lganda yuklanadi
const MarkdownEditor = lazy(() => import('./components/MarkdownEditor'))
const PdfViewer = lazy(() => import('./components/PdfViewer'))
const ChartDashboard = lazy(() => import('./components/ChartDashboard'))

function DocumentPage() {
  const [view, setView] = useState<'preview' | 'edit' | 'chart'>('preview')

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('preview')}>Ko'rish</button>
        <button onClick={() => setView('edit')}>Tahrirlash</button>
        <button onClick={() => setView('chart')}>Grafik</button>
      </div>

      <Suspense fallback={<p>Komponent yuklanmoqda...</p>}>
        {view === 'edit' && <MarkdownEditor />}
        {view === 'chart' && <ChartDashboard />}
      </Suspense>

      {view === 'preview' && <PreviewContent />}
    </div>
  )
}

// Conditional import — feature flag
async function loadExperimentalFeature() {
  if (featureFlags.newDashboard) {
    const { NewDashboard } = await import('./features/NewDashboard')
    return NewDashboard
  }
  return null
}`,
        description: 'Component-level splitting — og\'ir editor/viewer faqat kerak bo\'lganda yuklanadi. Tab o\'zgarganda chunk yuklanadi. Feature flag bilan conditional import.',
      },
    ],
    interviewQA: [
      {
        question: 'Code splitting nima va qanday ishlaydi?',
        answer: `Code splitting — ilovani kichik chunk-larga ajratish. Dynamic import() bilan amalga oshiriladi. Bundler (Vite/Webpack) import() ko'rganda alohida .js fayl yaratadi. Runtime-da chunk kerak bo'lganda network orqali yuklanadi. React-da React.lazy() + Suspense bilan. Foyda: tezroq initial load, kamroq bandwidth, foydalanuvchi faqat kerakli kodni yuklaydi.`,
      },
      {
        question: 'Code splitting-ning turli strategiyalari qanday?',
        answer: `1) Route-based — har sahifa alohida chunk (eng keng tarqalgan, React.lazy bilan), 2) Component-based — og'ir komponentlar alohida (chart, editor, PDF viewer), 3) Library-based — katta kutubxonalar alohida chunk (moment.js, chart.js), 4) Feature-based — feature flag bilan conditional import. Amalda route-based + component-based birga ishlatiladi. Bundler vendor chunk-ni (react, react-dom) avtomatik ajratadi.`,
      },
      {
        question: 'Code splitting va tree shaking farqi nima?',
        answer: `Code splitting — kodni VAQT bo'yicha ajratish. Barcha kod saqlanadi, lekin alohida fayllarga bo'linadi va kerak bo'lganda yuklanadi. Tree shaking — ISHLATILMAGAN kodni O'CHIRISH. Build vaqtida bundler import qilinmagan export-larni olib tashlaydi. Ikkalasi birga ishlaydi: tree shaking keraksiz kodni o'chiradi, code splitting qolgan kodni chunk-larga ajratadi. Natija: kichikroq, tezroq yuklanadigan ilova.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'Suspense + React.lazy' },
      { techId: 'react-js', sectionId: 'routing', topicId: 'lazy-routes', label: 'Lazy Routes' },
      { techId: 'react-js', sectionId: 'performance', topicId: 'bundle-optimization', label: 'Bundle Optimization' },
    ],
  }
