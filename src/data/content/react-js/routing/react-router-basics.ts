import type { Topic } from '../../../types'

export const reactRouterBasics: Topic = {
    id: 'react-router-basics',
    title: 'React Router (asoslar)',
    importance: 3,
    status: 'to-learn',
    description: 'BrowserRouter, Routes, Route, NavLink',
    content: `React Router — React ilovalar uchun standart routing kutubxonasi. SPA (Single Page Application) da sahifalar orasida navigatsiya qilish imkonini beradi. Hozirgi versiya — React Router v7 (v6 bilan mos).

═══════════════════════════════════════
  SPA ROUTING NIMA?
═══════════════════════════════════════

Oddiy web saytlarda har sahifa alohida HTML fayl — server har safar yangi sahifa yuboradi. SPA-da BITTA HTML fayl bor — JavaScript URL-ni kuzatadi va kerakli komponentni ko'rsatadi. Sahifa QAYTA YUKLANMAYDI.

SPA routing afzalliklari:
  ✅ Tez navigatsiya (server so'rov yo'q)
  ✅ State saqlanadi (sahifa o'zgarganda form input yo'qolmaydi)
  ✅ Smooth transitions (animatsiya mumkin)

React Router ikkita asosiy API beradi:
  1. createBrowserRouter — zamonaviy, tavsiya etilgan (data API bilan)
  2. BrowserRouter + Routes — klassik usul

═══════════════════════════════════════
  createBrowserRouter (ZAMONAVIY)
═══════════════════════════════════════

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'about', element: <AboutPage /> },
        { path: 'users/:id', element: <UserPage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ])

  // App.tsx
  <RouterProvider router={router} />

Afzalliklari:
  ✅ Data loading (loader/action)
  ✅ Error boundaries per route
  ✅ Deferred data
  ✅ Ob'ekt konfiguratsiya (JSX emas)

═══════════════════════════════════════
  BrowserRouter + Routes (KLASSIK)
═══════════════════════════════════════

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="users/:id" element={<User />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>

═══════════════════════════════════════
  ROUTE MATCHING
═══════════════════════════════════════

React Router URL-ni route path-ga moslashtiradi:

  path: '/'          → faqat /
  path: 'about'      → /about
  path: 'users/:id'  → /users/123, /users/abc (dinamik segment)
  path: '*'          → hech narsa mos kelmasa (catch-all / 404)
  index: true        → ota route-ning default child-i

Dinamik segmentlar (:id) — useParams bilan olinadi:
  const { id } = useParams()

═══════════════════════════════════════
  Link va NavLink
═══════════════════════════════════════

Link — sahifalar orasida navigatsiya:
  <Link to="/about">Haqida</Link>
  // a tag yaratadi, lekin sahifani qayta yuklaMAYDI

NavLink — aktiv holat bilan:
  <NavLink
    to="/about"
    className={({ isActive }) =>
      isActive ? 'text-blue-500 font-bold' : 'text-gray-500'
    }
  >
    Haqida
  </NavLink>

NavLink isActive — hozirgi URL mos kelganda true.
end prop — to'liq mos kelish (/ barcha route-larga mos kelmasligi uchun).

═══════════════════════════════════════
  HISTORY API
═══════════════════════════════════════

React Router ichida browser-ning History API-sini ishlatadi:
  - window.history.pushState() — URL-ni o'zgartirish
  - window.onpopstate — orqaga/oldinga tugmasi

BrowserRouter — /about (clean URL, server sozlash kerak)
HashRouter — /#/about (server sozlash kerak emas, SEO yomon)
MemoryRouter — URL o'zgarmaydi (testlar uchun)`,
    codeExamples: [
      {
        title: 'createBrowserRouter — to\'liq sozlash',
        language: 'tsx',
        code: `import { createBrowserRouter, RouterProvider } from 'react-router'
import { lazy, Suspense } from 'react'

// Lazy loaded sahifalar
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const UserPage = lazy(() => import('./pages/UserPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

import RootLayout from './layouts/RootLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<p>Yuklanmoqda...</p>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<p>Yuklanmoqda...</p>}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'users/:userId',
        element: (
          <Suspense fallback={<p>Yuklanmoqda...</p>}>
            <UserPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<p>Yuklanmoqda...</p>}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}`,
        description: 'createBrowserRouter — ob\'ekt konfiguratsiya. Lazy loading + Suspense bilan har sahifa alohida chunk-ga bo\'linadi. RootLayout barcha sahifalar uchun umumiy layout.',
      },
      {
        title: 'NavLink — aktiv holat bilan navigatsiya',
        language: 'tsx',
        code: `import { NavLink, Outlet } from 'react-router'

function Navigation() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    \`px-4 py-2 rounded-lg transition-colors \${
      isActive
        ? 'bg-blue-500 text-white font-semibold'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
    }\`

  return (
    <nav className="flex gap-2 p-4 border-b">
      <NavLink to="/" end className={linkClass}>
        Bosh sahifa
      </NavLink>
      <NavLink to="/products" className={linkClass}>
        Mahsulotlar
      </NavLink>
      <NavLink to="/about" className={linkClass}>
        Biz haqimizda
      </NavLink>
    </nav>
  )
}

function RootLayout() {
  return (
    <div>
      <Navigation />
      <main className="p-6">
        <Outlet />  {/* Child route shu yerda renderlanadi */}
      </main>
    </div>
  )
}`,
        description: 'NavLink isActive prop bilan aktiv sahifani ajratib ko\'rsatish. end prop — to\'liq mos kelish (/ faqat bosh sahifada aktiv). Outlet — child route-lar shu joyda ko\'rinadi.',
      },
      {
        title: 'BrowserRouter — klassik usul',
        language: 'tsx',
        code: `import { BrowserRouter, Routes, Route, Link } from 'react-router'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Bosh sahifa</Link>
        <Link to="/products">Mahsulotlar</Link>
        <Link to="/products/123">Mahsulot #123</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function Layout() {
  return (
    <div>
      <header>Sayt sarlavhasi</header>
      <main>
        <Outlet />
      </main>
      <footer>Sayt pastki qismi</footer>
    </div>
  )
}`,
        description: 'Klassik JSX usul — BrowserRouter > Routes > Route. Oddiy ilovalar uchun yetarli. createBrowserRouter-ga o\'tish oson.',
      },
    ],
    interviewQA: [
      {
        question: 'React Router qanday ishlaydi? SPA routing oddiy routing-dan farqi nima?',
        answer: `Oddiy web saytlarda har navigatsiyada browser serverga yangi HTML so'raydi — sahifa qayta yuklanadi. SPA-da bitta HTML fayl bor — React Router URL-ni kuzatadi va kerakli komponentni JavaScript bilan renderlaydii. Browser-ning History API-si (pushState, popstate) ishlatiladi — URL o'zgaradi, lekin server so'rov yuborilMAYDI. Natija: tez navigatsiya, state saqlanadi, smooth transitions.`,
      },
      {
        question: 'createBrowserRouter va BrowserRouter farqi nima?',
        answer: `BrowserRouter — klassik, JSX-da Routes/Route bilan yoziladi. Oddiy rendering uchun yetarli. createBrowserRouter — zamonaviy, ob'ekt konfiguratsiya. Qo'shimcha imkoniyatlar: loader/action (data fetching), route-based error boundary, deferred data loading, form handling. Yangi loyihalar uchun createBrowserRouter tavsiya etiladi. createBrowserRouter RouterProvider bilan ishlatiladi, BrowserRouter esa to'g'ridan-to'g'ri JSX-da yoziladi.`,
      },
      {
        question: 'Link va a tag farqi nima?',
        answer: `<a href="/about"> — brauzer serverga yangi so'rov yuboradi, sahifa QAYTA YUKLANADI, React state yo'qoladi, butun ilova qayta renderlanadi. <Link to="/about"> — React Router History API orqali faqat URL-ni o'zgartiradi, sahifa qayta yuklanMAYDI, faqat mos Route komponent renderlanadi, state saqlanadi. NavLink — Link-ning kengaytmasi, isActive prop beradi — hozirgi URL-ga mos kelganda boshqacha stil berish mumkin.`,
      },
      {
        question: 'BrowserRouter, HashRouter, MemoryRouter farqi nima?',
        answer: `BrowserRouter — History API, clean URL (/about). Server sozlash kerak — barcha URL-lar index.html-ga yo'naltirilishi kerak. Production uchun standart. HashRouter — URL-da hash ishlatadi (/#/about). Server sozlash kerak emas — hash serverga yuborilmaydi. SEO uchun yomon, lekin static hosting uchun qulay. MemoryRouter — URL-ni o'zgartirMAYDI, xotirada saqlaydi. Testlar va React Native uchun ishlatiladi.`,
      },
      {
        question: 'React Router-da 404 sahifa qanday qilinadi?',
        answer: `Catch-all route — path="*" ishlatiladi. Bu barcha boshqa route-larga mos kelMAGAN URL-larni ushlaydi. Route tartibi muhim emas — React Router eng aniq mos kelishni tanlaydi, * eng past prioritet. Misol: <Route path="*" element={<NotFoundPage />} />. createBrowserRouter-da errorElement ham ishlatiladi — route topilmaganda yoki loader xato berganda ko'rsatiladi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'routing', topicId: 'navigation-hooks', label: 'Navigation Hooks' },
      { techId: 'react-js', sectionId: 'routing', topicId: 'nested-layouts', label: 'Nested Layouts' },
    ],
  }
