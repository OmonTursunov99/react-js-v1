import type { Topic } from '../../types'

export const lazyRoutes: Topic = {
    id: 'lazy-routes',
    title: 'Lazy Routes',
    importance: 3,
    status: 'to-learn',
    description: 'React.lazy + Suspense bilan route code-splitting',
    content: `Lazy Routes — sahifalarni kerak bo'lganda yuklash (code splitting). Dastlabki bundle hajmini kamaytiradi — foydalanuvchi faqat ko'rayotgan sahifa kodini yuklaydi.

═══════════════════════════════════════
  MUAMMO: KATTA BUNDLE
═══════════════════════════════════════

Default-da Vite/Webpack barcha kodni BITTA faylga birlashtiradi:
  bundle.js — 500KB (barcha sahifalar, komponentlar)

Foydalanuvchi faqat bosh sahifani ko'rmoqchi — lekin 500KB yuklaydi.
AdminPanel, Settings, va boshqa sahifalar kerak emas, lekin yuklanadi.

Yechim — code splitting:
  main.js — 50KB (umumiy kod + bosh sahifa)
  AdminPanel.js — 30KB (faqat admin sahifaga kirganda yuklanadi)
  Settings.js — 20KB (faqat settings ochganda yuklanadi)

═══════════════════════════════════════
  React.lazy()
═══════════════════════════════════════

React.lazy — komponentni dinamik import bilan yuklash:

  // ODDIY import — bundle-ga qo'shiladi:
  import AdminPage from './pages/AdminPage'

  // LAZY import — alohida chunk bo'ladi:
  const AdminPage = lazy(() => import('./pages/AdminPage'))

Qanday ishlaydi:
  1. Build vaqtida Vite/Webpack lazy import-ni alohida chunk-ga ajratadi
  2. Runtime-da komponent kerak bo'lganda chunk yuklanadi (network request)
  3. Yuklanguncha Suspense fallback ko'rsatiladi

MUHIM: lazy faqat DEFAULT EXPORT bilan ishlaydi:
  // pages/AdminPage.tsx
  export default function AdminPage() { ... }

═══════════════════════════════════════
  Suspense
═══════════════════════════════════════

Suspense — lazy komponent yuklanguncha fallback ko'rsatish:

  <Suspense fallback={<LoadingSpinner />}>
    <AdminPage />
  </Suspense>

Suspense-siz lazy komponent ishlatish — xato beradi!

Suspense joylashuvi muhim:
  - Har route uchun alohida Suspense → faqat shu sahifa loading
  - Bitta yuqorida Suspense → butun sahifa loading (yomon UX)

═══════════════════════════════════════
  ROUTE-BASED CODE SPLITTING
═══════════════════════════════════════

Eng effektiv code splitting — route darajasida:

  const HomePage = lazy(() => import('./pages/HomePage'))
  const ProductsPage = lazy(() => import('./pages/ProductsPage'))
  const AdminPage = lazy(() => import('./pages/AdminPage'))

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Suspense fallback={<Loading />}><HomePage /></Suspense>,
        },
        {
          path: 'products',
          element: <Suspense fallback={<Loading />}><ProductsPage /></Suspense>,
        },
        {
          path: 'admin',
          element: <Suspense fallback={<Loading />}><AdminPage /></Suspense>,
        },
      ],
    },
  ])

Har sahifa alohida chunk — foydalanuvchi faqat kerakli kodni yuklaydi.

═══════════════════════════════════════
  PREFETCH (Oldindan yuklash)
═══════════════════════════════════════

Foydalanuvchi link ustiga hover qilganda — sahifani oldindan yuklash:

  // Vite-ning dynamic import-i
  function prefetchPage(importFn: () => Promise<any>) {
    importFn() // chunk-ni yuklaydi
  }

  <Link
    to="/admin"
    onMouseEnter={() => prefetchPage(() => import('./pages/AdminPage'))}
  >
    Admin
  </Link>

Yoki router darajasida lazy + prefetch.`,
    codeExamples: [
      {
        title: 'Route-based lazy loading',
        language: 'tsx',
        code: `import { createBrowserRouter, RouterProvider } from 'react-router'
import { lazy, Suspense } from 'react'
import RootLayout from './layouts/RootLayout'

// Lazy sahifalar — har biri alohida chunk
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SectionPage = lazy(() => import('./pages/SectionPage'))
const TopicPage = lazy(() => import('./pages/TopicPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Loading komponent
function PageLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  )
}

// Helper — lazy page wrapper
function lazyPage(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: lazyPage(DashboardPage) },
      { path: 'section/:sectionId', element: lazyPage(SectionPage) },
      { path: 'section/:sectionId/:topicId', element: lazyPage(TopicPage) },
      { path: '*', element: lazyPage(NotFoundPage) },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}`,
        description: 'Har sahifa lazy() bilan alohida chunk. lazyPage helper — Suspense wrapper-ni takrorlamaslik uchun. Foydalanuvchi sahifaga kirganda chunk yuklanadi.',
      },
      {
        title: 'Prefetch — hover qilganda oldindan yuklash',
        language: 'tsx',
        code: `import { Link } from 'react-router'

// Sahifa importlarini saqlab qo'yish
const pageImports = {
  dashboard: () => import('./pages/DashboardPage'),
  products: () => import('./pages/ProductsPage'),
  admin: () => import('./pages/AdminPage'),
} as const

// Prefetch — chunk-ni oldindan yuklash
function prefetch(page: keyof typeof pageImports) {
  pageImports[page]()
}

function Navigation() {
  return (
    <nav className="flex gap-4">
      <Link
        to="/"
        onMouseEnter={() => prefetch('dashboard')}
      >
        Dashboard
      </Link>
      <Link
        to="/products"
        onMouseEnter={() => prefetch('products')}
      >
        Mahsulotlar
      </Link>
      <Link
        to="/admin"
        onMouseEnter={() => prefetch('admin')}
      >
        Admin
      </Link>
    </nav>
  )
}

// Natija:
// 1. Foydalanuvchi "Admin" ustiga hover qiladi
// 2. AdminPage chunk-i background-da yuklanadi
// 3. Foydalanuvchi bosadi — chunk ALLAQACHON yuklangan
// 4. Sahifa DARHOL ochiladi (loading yo'q)`,
        description: 'Hover prefetch — foydalanuvchi bosishidan oldin chunk-ni yuklash. Import funksiyasini chaqirish yetarli — browser keshga saqlaydi. Instant navigation ta\'siri.',
      },
      {
        title: 'Named export bilan lazy loading',
        language: 'tsx',
        code: `// MUAMMO: lazy faqat default export bilan ishlaydi
// Agar komponent named export bo'lsa:
// export function AdminPage() { ... }

// YECHIM: import-ni wrapper bilan o'rash
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then(module => ({
    default: module.AdminPage,  // named → default
  }))
)

// YECHIM 2: barrel file
// pages/AdminPage/index.ts
// export { AdminPage as default } from './AdminPage'

// YECHIM 3: re-export
// pages/lazy-exports.ts
// export { AdminPage as default } from './AdminPage'
// Keyin: lazy(() => import('./pages/lazy-exports'))

// LOADING ERROR HANDLING
import { Component, type ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
}

class LazyErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Ishlatish
function App() {
  return (
    <LazyErrorBoundary fallback={<p>Sahifa yuklanmadi. Qayta urinib ko'ring.</p>}>
      <Suspense fallback={<p>Yuklanmoqda...</p>}>
        <AdminPage />
      </Suspense>
    </LazyErrorBoundary>
  )
}`,
        description: 'Named export muammosi va yechimlari. ErrorBoundary — chunk yuklanmasa (network xato) xato sahifasi ko\'rsatish. Production da muhim — internet tez-tez uzilishi mumkin.',
      },
    ],
    interviewQA: [
      {
        question: 'Code splitting nima va nima uchun kerak?',
        answer: `Code splitting — kodni kichik bo'laklarga (chunk) ajratish. Default-da bundler barcha kodni bitta faylga birlashtiradi. Foydalanuvchi faqat bosh sahifani ko'rmoqchi, lekin barcha sahifalar yuklanadi. Code splitting bilan har sahifa alohida chunk — faqat kerakli kod yuklanadi. Natija: tezroq initial load, kamroq bandwidth, yaxshiroq UX. React.lazy() + dynamic import() bilan amalga oshiriladi. Vite/Webpack avtomatik import() ni alohida chunk-ga ajratadi.`,
      },
      {
        question: 'React.lazy qanday ishlaydi?',
        answer: `React.lazy(() => import('./Page')) — komponentni dinamik import bilan yuklash. Build vaqtida bundler bu import-ni alohida chunk-ga ajratadi. Runtime-da: 1) komponent birinchi marta render bo'lganda import() chaqiriladi, 2) chunk network orqali yuklanadi, 3) yuklanguncha Suspense fallback ko'rsatiladi, 4) yuklangandan keyin komponent renderlanadi. Cheklov: faqat default export bilan ishlaydi. Named export-lar uchun .then(m => ({default: m.MyComponent})) wrapper kerak.`,
      },
      {
        question: 'Suspense nima va qanday ishlaydi?',
        answer: `Suspense — React-ning async operatsiyalar uchun "kutish" mexanizmi. Lazy komponent yuklanguncha (yoki React 18+ da data fetching) fallback ko'rsatadi. Ichki mexanizm: lazy komponent yuklanganda maxsus Promise throw qiladi. Eng yaqin Suspense buni ushlaydi va fallback ko'rsatadi. Promise resolve bo'lganda — haqiqiy komponent renderlanadi. Suspense joylashuvi muhim: har route uchun alohida Suspense — faqat shu sahifa loading ko'rsatadi, boshqa sahifalar ta'sirlanmaydi.`,
      },
      {
        question: 'Lazy loading da xatoni qanday handle qilish kerak?',
        answer: `Network xato bo'lsa (chunk yuklanmasa) — ErrorBoundary bilan ushlash kerak. Suspense faqat loading uchun, xato uchun ErrorBoundary kerak. ErrorBoundary — class component, getDerivedStateFromError bilan xatoni ushlaydi, fallback ko'rsatadi. Best practice: retry button qo'yish — foydalanuvchi qayta yuklay olsin. React 19-da use() hook bilan Error Boundary + Suspense birga ishlatish yanada osonlashdi.`,
      },
      {
        question: 'Prefetching nima va qanday qilinadi?',
        answer: `Prefetching — foydalanuvchi so'ramasdan oldin chunk-ni yuklash. Usullari: 1) onMouseEnter — link hover-da import() chaqirish, 2) Idle vaqtda — requestIdleCallback bilan bo'sh vaqtda yuklash, 3) Route-based — keyingi ehtimoliy sahifani oldindan yuklash. import() chaqirilsa — browser chunk-ni yuklaydi va keshga saqlaydi. Foydalanuvchi sahifaga kirganda chunk allaqachon tayyor — instant navigation. Bu UX uchun juda muhim.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'suspense-lazy', label: 'Suspense + React.lazy' },
      { sectionId: 'performance', topicId: 'code-splitting', label: 'Code Splitting' },
    ],
  }
