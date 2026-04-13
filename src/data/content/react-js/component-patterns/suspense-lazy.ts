import type { Topic } from '../../../types'

export const suspenseLazy: Topic = {
    id: `suspense-lazy`,
    title: `Suspense + React.lazy`,
    importance: 3,
    status: `to-learn`,
    description: `Code splitting, lazy loading`,
    content: `React.lazy va Suspense — ilovani bo'laklarga bo'lish (code splitting) va lazy loading qilish uchun. Foydalanuvchi boshida BUTUN ilovani yuklamaydi — faqat kerakli qismni yuklaydi.

═══════════════════════════════════════
  React.lazy
═══════════════════════════════════════

Dynamic import — komponent faqat KERAK BO'LGANDA
yuklanadi. Bundle-ni bo'lish (code splitting):

  // Oddiy import — bundlega kiradi:
  import Dashboard from './Dashboard'

  // Lazy import — alohida chunk:
  const Dashboard = React.lazy(() => import('./Dashboard'))

Dashboard faqat render qilinganDA yuklanadi.
Bundler (Vite/Webpack) uni alohida .js faylga chiqaradi.

═══════════════════════════════════════
  Suspense
═══════════════════════════════════════

Lazy component yuklanayotganda fallback UI ko'rsatish:

  <Suspense fallback={<Loading />}>
    <Dashboard />     ← yuklanayotganda Loading ko'rinadi
  </Suspense>

fallback — istalgan React element:
  - <p>Yuklanmoqda...</p>
  - <Spinner />
  - <Skeleton /> (placeholder UI)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Bundle hajmini kamaytirish:

  Kod splitting YO'Q:
    app.js — 500KB (BUTUN ilova)
    Foydalanuvchi 500KB yuklab kutadi

  Kod splitting BILAN:
    app.js — 100KB (asosiy qism)
    dashboard.js — 150KB (faqat kerak bo'lganda)
    settings.js — 50KB (faqat kerak bo'lganda)
    Foydalanuvchi 100KB yuklab boshlaydi

  Birinchi yuklash tezroq!

═══════════════════════════════════════
  ROUTE BASED SPLITTING
═══════════════════════════════════════

Har bir sahifani lazy import — eng keng tarqalgan pattern:

  const Home = lazy(() => import('./pages/Home'))
  const Dashboard = lazy(() => import('./pages/Dashboard'))
  const Settings = lazy(() => import('./pages/Settings'))

Bu eng samarali chunki:
  - Foydalanuvchi har doim bitta sahifada
  - Boshqa sahifalar kerak emas
  - Sahifalar odatda katta komponentlar

═══════════════════════════════════════
  DATA FETCHING BILAN
═══════════════════════════════════════

React 19 — Suspense data fetching bilan ham ishlaydi.
use() hook + Promise:

  function UserProfile({ userId }) {
    const user = use(fetchUser(userId))  // Promise!
    return <p>{user.name}</p>
  }

  <Suspense fallback={<Loading />}>
    <UserProfile userId={1} />
  </Suspense>

use() hook Promise resolve bo'lguncha Suspense
fallback ko'rsatadi. Bu YANGI React 19 xususiyati.

═══════════════════════════════════════
  NAMED EXPORTS
═══════════════════════════════════════

React.lazy faqat DEFAULT EXPORT bilan ishlaydi:

  // TO'G'RI — default export:
  const Dashboard = lazy(() => import('./Dashboard'))

  // Named export uchun wrapper kerak:
  const Dashboard = lazy(() =>
    import('./Dashboard').then(module => ({
      default: module.Dashboard
    }))
  )

Shuning uchun lazy qilinadigan komponentlarni
default export qilish tavsiya etiladi.`,
    codeExamples: [
      {
        title: `Route-based code splitting — React.lazy + Suspense`,
        language: `tsx`,
        code: `import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

// Lazy import — har biri alohida chunk bo'ladi
const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const Profile = lazy(() => import('./pages/Profile'))

// Loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500">Sahifa yuklanmoqda...</p>
      </div>
    </div>
  )
}

// Navigation
function Nav() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-4">
      <Link to="/">Asosiy</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/settings">Sozlamalar</Link>
      <Link to="/profile">Profil</Link>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Nav />

      {/* Suspense BARCHA lazy komponentlarni o'raydi */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

// pages/Home.tsx — DOIM default export!
// export default function Home() {
//   return <h1>Asosiy sahifa</h1>
// }`,
        description: `Route-based code splitting — eng keng tarqalgan pattern. Har bir sahifa alohida chunk. Foydalanuvchi /dashboard ga o'tganda Dashboard chunk yuklana boshlaydi, shu vaqt PageLoader ko'rinadi.`,
      },
      {
        title: `Component-level lazy — og'ir komponentni lazy yuklash`,
        language: `tsx`,
        code: `import { lazy, Suspense, useState } from 'react'

// Og'ir komponent — faqat kerak bo'lganda yuklanadi
// (masalan: chart kutubxonasi, rich text editor, 3D viewer)
const HeavyChart = lazy(() => import('./components/HeavyChart'))
const RichTextEditor = lazy(() => import('./components/RichTextEditor'))

// Skeleton loader
function ChartSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg h-64 flex items-center justify-center">
      <p className="text-gray-400">Grafik yuklanmoqda...</p>
    </div>
  )
}

function EditorSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-10 rounded mb-2" />
      <div className="bg-gray-200 h-40 rounded" />
    </div>
  )
}

function Dashboard() {
  const [showChart, setShowChart] = useState(false)
  const [showEditor, setShowEditor] = useState(false)

  return (
    <div className="p-6">
      <h1>Boshqaruv paneli</h1>

      {/* Grafik — tugma bosilganda yuklanadi */}
      <button
        onClick={() => setShowChart(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Grafikni ko'rsatish
      </button>

      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart data={[10, 20, 30, 40, 50]} />
        </Suspense>
      )}

      {/* Editor — tugma bosilganda yuklanadi */}
      <button
        onClick={() => setShowEditor(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Muharrirni ochish
      </button>

      {showEditor && (
        <Suspense fallback={<EditorSkeleton />}>
          <RichTextEditor />
        </Suspense>
      )}
    </div>
  )
}`,
        description: `Component-level lazy loading — og'ir komponentlar (chart, editor, 3D) faqat tugma bosilganda yuklanadi. Skeleton loader professional ko'rinish beradi. Bu initial bundle hajmini sezilarli kamaytiradi.`,
      },
    ],
    interviewQA: [
      {
        question: `React.lazy va Suspense nima?`,
        answer: `React.lazy — dynamic import orqali komponentni faqat KERAK BO'LGANDA yuklash. const Page = lazy(() => import('./Page')). Bundler (Vite/Webpack) bu komponentni alohida chunk (.js fayl) sifatida chiqaradi. Suspense — lazy component yuklanayotganda fallback UI (spinner, skeleton) ko'rsatadi: <Suspense fallback={<Loading />}><Page /></Suspense>. Birgalikda ular code splitting amalga oshiradi — ilova bir katta fayl emas, bir nechta kichik bo'laklar bo'ladi.`,
      },
      {
        question: `Code splitting nima uchun kerak?`,
        answer: `Code splitting — ilovani kichik bo'laklarga (chunk) bo'lish. Sabablar: 1) Birinchi yuklash tezligi — 500KB bitta fayl o'rniga 100KB asosiy + kerakli chunk-lar. 2) Foydalanuvchi ishlatmaydigan kodni yuklamaslik — Settings sahifasiga hech kirmasa, u yuklanmaydi. 3) Caching — bitta chunk o'zgarsa, boshqalari cache-dan keladi. Eng samarali usul — route-based splitting: har bir sahifa alohida chunk. Component-level splitting ham mumkin — og'ir komponentlar (chart, editor) uchun.`,
      },
      {
        question: `Suspense data fetching bilan ishlaydi mi?`,
        answer: `Ha! React 19 da use() hook bilan Suspense data fetching uchun ishlaydi. use() hook Promise qabul qiladi — resolve bo'lguncha Suspense fallback ko'rsatadi: const user = use(fetchUser(id)). Bu "render-as-you-fetch" pattern — komponent render bo'lishga URINADI, ma'lumot tayyor bo'lmasa Suspense ushlaydi. Oldingi versiyalarda bu faqat React Server Components va kutubxonalar (Relay, SWR) orqali mumkin edi. React 19 buni rasmiy API qildi.`,
      },
    ],
    relatedTopics: [
      { techId: `react-js`, sectionId: `performance`, topicId: `code-splitting`, label: `Code Splitting` },
      { techId: `react-js`, sectionId: `routing`, topicId: `lazy-routes`, label: `Lazy Routes` },
      { techId: `react-js`, sectionId: `component-patterns`, topicId: `error-boundaries`, label: `Error Boundaries` },
      { techId: `react-js`, sectionId: `theory-questions`, topicId: `server-components`, label: `Server Components` },
    ],
  }
