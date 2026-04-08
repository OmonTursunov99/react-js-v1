import type { Topic } from '../types'

export const routingTopics: Topic[] = [
  {
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
      { sectionId: 'routing', topicId: 'navigation-hooks', label: 'Navigation Hooks' },
      { sectionId: 'routing', topicId: 'nested-layouts', label: 'Nested Layouts' },
    ],
  },
  {
    id: 'protected-routes',
    title: 'Protected Routes',
    importance: 3,
    status: 'to-learn',
    description: 'Auth guard qanday qilinadi',
    content: `Protected Routes — autentifikatsiya bo'lmagan foydalanuvchilarni maxfiy sahifalardan himoyalash. Login qilinmagan bo'lsa — login sahifasiga yo'naltirish.

═══════════════════════════════════════
  ASOSIY KONSEPT
═══════════════════════════════════════

Protected route oddiy:
  1. Foydalanuvchi login qilganmi? Tekshir.
  2. Ha → sahifani ko'rsat
  3. Yo'q → /login ga yo'naltir

Implementatsiya — wrapper komponent:

  function ProtectedRoute({ children }) {
    const { user } = useAuth()

    if (!user) {
      return <Navigate to="/login" replace />
    }

    return children
  }

replace prop — orqaga qaytganda login sahifasi ko'rinmasligi uchun.

═══════════════════════════════════════
  PATTERN-LAR
═══════════════════════════════════════

1. Wrapper komponent:
   <Route path="/dashboard" element={
     <ProtectedRoute>
       <Dashboard />
     </ProtectedRoute>
   } />

2. Layout route:
   <Route element={<ProtectedRoute />}>
     <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/profile" element={<Profile />} />
     <Route path="/settings" element={<Settings />} />
   </Route>
   // ProtectedRoute ichida <Outlet /> ishlatadi

3. HOC (Higher Order Component):
   const ProtectedDashboard = withAuth(Dashboard)

Layout route ENG YAXSHI — bir nechta route-ni bitta guard bilan himoyalash.

═══════════════════════════════════════
  REDIRECT BACK (Qaytish)
═══════════════════════════════════════

Foydalanuvchi /dashboard ga kirmoqchi → login ga yo'naltirildi →
login qildi → /dashboard ga QAYTISHI kerak.

Yechim — hozirgi URL-ni state bilan yuborish:

  <Navigate to="/login" state={{ from: location }} replace />

Login sahifasida:
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  // Login muvaffaqiyatli bo'lganda:
  navigate(from, { replace: true })

═══════════════════════════════════════
  ROLE-BASED ACCESS
═══════════════════════════════════════

Faqat auth emas, ROL ham tekshirish:

  function RoleRoute({ children, roles }) {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" replace />
    if (!roles.includes(user.role)) return <Navigate to="/403" replace />

    return children
  }

  <Route path="/admin" element={
    <RoleRoute roles={['admin']}>
      <AdminPanel />
    </RoleRoute>
  } />

═══════════════════════════════════════
  LOADING HOLATI
═══════════════════════════════════════

Auth tekshirish async bo'lishi mumkin (token validatsiya):

  function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth()

    if (isLoading) return <LoadingSpinner />
    if (!user) return <Navigate to="/login" replace />

    return children
  }

isLoading ni unutmang — aks holda login sahifasi flash qiladi.`,
    codeExamples: [
      {
        title: 'ProtectedRoute — Layout pattern',
        language: 'tsx',
        code: `import { Navigate, Outlet, useLocation } from 'react-router'

interface User {
  id: string
  name: string
  role: 'admin' | 'user'
}

// Auth hook (Context-dan oladi)
function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// Protected Route — layout sifatida
function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Auth tekshirilmoqda — spinner ko'rsat
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  // Login qilinmagan — redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Login qilingan — child route-larni ko'rsat
  return <Outlet />
}

// Router konfiguratsiya
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      // Himoyalangan route-lar
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])`,
        description: 'Layout pattern — ProtectedRoute Outlet bilan child route-larni render qiladi. Bitta guard bilan ko\'p route himoyalanadi. isLoading — auth tekshirilguncha spinner.',
      },
      {
        title: 'Role-based route + redirect back',
        language: 'tsx',
        code: `import { Navigate, Outlet, useLocation } from 'react-router'

interface RoleRouteProps {
  allowedRoles: string[]
}

function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <p>Yuklanmoqda...</p>

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'unauthorized', element: <UnauthorizedPage /> },

      // Faqat login qilinganlar
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
        ],
      },

      // Faqat adminlar
      {
        element: <RoleRoute allowedRoles={['admin']} />,
        children: [
          { path: 'admin', element: <AdminPanel /> },
          { path: 'admin/users', element: <UserManagement /> },
        ],
      },
    ],
  },
])

// LoginPage — redirect back
function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    navigate(from, { replace: true })  // oldingi sahifaga qaytish
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Parol" required />
      <button type="submit">Kirish</button>
    </form>
  )
}`,
        description: 'RoleRoute — rol tekshirish bilan. LoginPage — login muvaffaqiyatli bo\'lganda oldingi sahifaga qaytaradi (location.state.from). replace — orqaga qaytganda login ko\'rinmasligi uchun.',
      },
      {
        title: 'AuthProvider — to\'liq auth context',
        language: 'tsx',
        code: `import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Sahifa yuklanganda token tekshirish
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoading(false)
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: \`Bearer \${token}\` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    if (!res.ok) throw new Error('Login xatosi')
    const { user, token } = await res.json()
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}`,
        description: 'AuthProvider — to\'liq auth lifecycle: sahifa yuklanganda token tekshirish, login, logout. isLoading — token tekshirilguncha loading. ProtectedRoute shu hook-dan foydalanadi.',
      },
    ],
    interviewQA: [
      {
        question: 'Protected Route nima va qanday qilinadi?',
        answer: `Protected Route — autentifikatsiya bo'lmagan foydalanuvchilarni maxfiy sahifalardan himoyalash. Asosiy mantiq: 1) auth holatini tekshir (isLoading, user), 2) isLoading bo'lsa — spinner ko'rsat, 3) user yo'q — Navigate to="/login" replace bilan redirect, 4) user bor — sahifani ko'rsat. Eng yaxshi pattern — layout route: ProtectedRoute Outlet bilan child-larni render qiladi, bitta guard bilan ko'p route himoyalanadi.`,
      },
      {
        question: 'Protected route-da isLoading nima uchun muhim?',
        answer: `Auth tekshirish async bo'lishi mumkin — token validatsiya, API so'rov. isLoading bo'lmasda, sahifa birinchi renderda user=null bo'ladi → login-ga redirect → keyin user keladi → qayta redirect. Bu "flash" muammosi — foydalanuvchi login sahifasini bir lahza ko'radi. isLoading bilan: tekshirilguncha spinner ko'rsatiladi, faqat natija kelganda qaror qilinadi. Bu UX uchun juda muhim.`,
      },
      {
        question: 'Navigate-da replace prop nima qiladi?',
        answer: `replace — browser history-da hozirgi yozuvni ALMASHTIRADI (qo'shish o'rniga). Masalan: foydalanuvchi /dashboard → /login ga redirect bo'ldi. replace=false bo'lsa: back bosilganda /dashboard → yana /login → cheksiz loop. replace=true bo'lsa: /login /dashboard o'rniga yoziladi — back bosilganda oldingi sahifaga qaytadi, /dashboard-ga emas. Protected route redirect-larida DOIM replace ishlatish kerak.`,
      },
      {
        question: 'Login-dan keyin oldingi sahifaga qanday qaytariladi?',
        answer: `Navigate bilan redirect qilganda location-ni state-ga qo'shish: <Navigate to="/login" state={{ from: location }} replace />. LoginPage-da: const from = location.state?.from?.pathname || '/'. Login muvaffaqiyatli bo'lganda: navigate(from, { replace: true }). Bu UX uchun muhim — foydalanuvchi /settings ga kirishni xohladi, login qildi, va /settings ga qaytdi (/ ga emas). state — URL-da ko'rinmaydi, faqat xotirada saqlanadi.`,
      },
      {
        question: 'Frontend auth himoyasi yetarlimi?',
        answer: `YO'Q. Frontend auth — faqat UX uchun (foydalanuvchini to'g'ri sahifaga yo'naltirish). Haqiqiy himoya SERVERDA bo'lishi kerak — har bir API so'rov token/session bilan autentifikatsiya qilinishi, authorization tekshirilishi kerak. Frontend-da JavaScript konsolidan route-larni ko'rish, komponentlarni render qilish mumkin. Shuning uchun: frontend — navigatsiya qulayligi, backend — haqiqiy xavfsizlik.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'routing', topicId: 'navigation-hooks', label: 'useNavigate (redirect)' },
      { sectionId: 'component-patterns', topicId: 'hoc', label: 'HOC (withAuth)' },
    ],
  },
  {
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
  },
  {
    id: 'loaders-actions',
    title: 'Loaders / Actions',
    importance: 2,
    status: 'to-learn',
    description: 'React Router v6.4+ data loading pattern',
    content: `Loaders va Actions — React Router v6.4+ (va v7) ning data layer-i. Sahifa RENDERLANMASDAN OLDIN ma'lumotni yuklash imkonini beradi.

═══════════════════════════════════════
  LOADER NIMA?
═══════════════════════════════════════

Loader — route-ga kirilganda AVTOMATIK chaqiriladigan funksiya.
Komponent renderlanmasdan OLDIN ma'lumot yuklanadi.

  {
    path: 'users/:id',
    loader: async ({ params }) => {
      const res = await fetch('/api/users/' + params.id)
      return res.json()
    },
    element: <UserPage />,
  }

Komponentda useLoaderData bilan olish:
  function UserPage() {
    const user = useLoaderData()
    return <h1>{user.name}</h1>  // ma'lumot TAYYOR
  }

Afzalliklari:
  ✅ Komponent renderlanmasdan oldin data tayyor
  ✅ Loading holati route darajasida boshqariladi
  ✅ Parallel data fetching (bir nechta route loader bir vaqtda)
  ✅ Komponent ichida useEffect/useState kerak emas

═══════════════════════════════════════
  ACTION NIMA?
═══════════════════════════════════════

Action — form submit bo'lganda chaqiriladigan funksiya.
Mutation (POST/PUT/DELETE) uchun.

  {
    path: 'users/new',
    action: async ({ request }) => {
      const formData = await request.formData()
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
        }),
      })
      return redirect('/users')  // muvaffaqiyatli → redirect
    },
    element: <NewUserPage />,
  }

Komponentda <Form> (katta F) ishlatish:
  function NewUserPage() {
    return (
      <Form method="post">
        <input name="name" />
        <input name="email" />
        <button type="submit">Yaratish</button>
      </Form>
    )
  }

Form submit → action chaqiriladi → loader qayta ishlaydi (revalidation).

═══════════════════════════════════════
  LOADER vs useEffect + useState
═══════════════════════════════════════

Oddiy usul (useEffect):
  1. Komponent renderlanadi (bo'sh)
  2. useEffect ishlaydi → fetch boshlanadi
  3. Loading spinner ko'rsatiladi
  4. Data keladi → qayta render
  Muammo: render → fetch → render → fetch (waterfall)

Loader:
  1. Route-ga kirilganda loader ishlaydi
  2. Data tayyor bo'lganda komponent renderlanadi (data bilan)
  Afzallik: fetch → render (bitta qadam)

Nested route-larda farq katta:
  useEffect: Parent render → parent fetch → child render → child fetch (4 qadam)
  Loader: parent fetch + child fetch PARALLEL → render (2 qadam)

═══════════════════════════════════════
  REVALIDATION
═══════════════════════════════════════

Action bajargandan keyin React Router avtomatik
barcha aktiv route loader-larni qayta chaqiradi.

Form submit → action → revalidation (loader qayta ishlaydi) → UI yangilanadi

Bu TanStack Query-ning invalidateQueries-ga o'xshash — lekin avtomatik.

═══════════════════════════════════════
  LOADER vs TANSTACK QUERY
═══════════════════════════════════════

Loader afzalliklari:
  ✅ Route-ga o'rnatilgan — alohida kutubxona kerak emas
  ✅ Parallel loading (nested routes)
  ✅ Server-side rendering bilan yaxshi integratsiya
  ✅ Form + action + revalidation = to'liq cycle

TanStack Query afzalliklari:
  ✅ Kuchliroq kesh (staleTime, gcTime)
  ✅ Background refetch, retry
  ✅ Optimistic updates
  ✅ DevTools
  ✅ Route-dan tashqarida ham ishlatish mumkin

Amalda ko'p loyihalar IKKALASINI birlashtiradi:
  Loader ichida TanStack Query-ni prefetch qilish.`,
    codeExamples: [
      {
        title: 'Loader — ma\'lumotni oldindan yuklash',
        language: 'tsx',
        code: `import {
  createBrowserRouter,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router'

interface User {
  id: string
  name: string
  email: string
}

// Loader — route-ga kirilganda avtomatik chaqiriladi
async function userLoader({ params }: LoaderFunctionArgs): Promise<User> {
  const res = await fetch(\`/api/users/\${params.userId}\`)
  if (!res.ok) throw new Response('Foydalanuvchi topilmadi', { status: 404 })
  return res.json()
}

async function usersLoader(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Response('Xatolik', { status: 500 })
  return res.json()
}

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'users',
        loader: usersLoader,
        element: <UsersPage />,
      },
      {
        path: 'users/:userId',
        loader: userLoader,
        element: <UserDetailPage />,
      },
    ],
  },
])

// Komponent — data TAYYOR keladi
function UsersPage() {
  const users = useLoaderData() as User[]

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <Link to={user.id}>{user.name}</Link>
        </li>
      ))}
    </ul>
  )
}

function UserDetailPage() {
  const user = useLoaderData() as User
  return <h1>{user.name} — {user.email}</h1>
}`,
        description: 'Loader — komponent renderlanmasdan OLDIN data yuklanadi. throw Response — errorElement ko\'rsatiladi. useLoaderData — tayyor data olish (loading state kerak emas).',
      },
      {
        title: 'Action + Form — mutation',
        language: 'tsx',
        code: `import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from 'react-router'

interface ActionError {
  message: string
  fields?: Record<string, string>
}

// Action — form submit bo'lganda chaqiriladi
async function createUserAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Validatsiya
  if (!name || !email) {
    return { message: 'Barcha maydonlarni to\\'ldiring' } satisfies ActionError
  }

  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })

  if (!res.ok) {
    return { message: 'Server xatosi' } satisfies ActionError
  }

  // Muvaffaqiyat → redirect (loader qayta ishlaydi)
  return redirect('/users')
}

// Router
{
  path: 'users/new',
  action: createUserAction,
  element: <NewUserPage />,
}

// Komponent
function NewUserPage() {
  const error = useActionData() as ActionError | undefined
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <Form method="post">
      {error?.message && (
        <p className="text-red-500">{error.message}</p>
      )}
      <input name="name" placeholder="Ism" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saqlanmoqda...' : 'Yaratish'}
      </button>
    </Form>
  )
}`,
        description: 'Form (katta F) submit → action chaqiriladi. useActionData — action qaytargan xato. useNavigation — submitting holati. redirect — muvaffaqiyatli action keyin loader qayta ishlaydi.',
      },
      {
        title: 'Loader + TanStack Query birlashtirib ishlatish',
        language: 'tsx',
        code: `import { useLoaderData } from 'react-router'
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'

// Query konfiguratsiyasi
function usersQuery() {
  return {
    queryKey: ['users'] as const,
    queryFn: async (): Promise<User[]> => {
      const res = await fetch('/api/users')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  }
}

// Loader — TanStack Query keshini prefetch qiladi
function usersLoader(queryClient: QueryClient) {
  return async () => {
    const query = usersQuery()
    // Keshda bo'lsa — so'rov yuborMA, keshdan oladi
    return queryClient.ensureQueryData(query)
  }
}

// Router yaratish
function createRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: 'users',
      loader: usersLoader(queryClient),
      element: <UsersPage />,
    },
  ])
}

// Komponent — TanStack Query hook ishlatadi (kesh tayyor)
function UsersPage() {
  const initialData = useLoaderData() as User[]

  const { data: users } = useQuery({
    ...usersQuery(),
    initialData,  // loader-dan kelgan data
  })

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}`,
        description: 'Eng yaxshi kombinatsiya: loader keshni prefetch qiladi (ensureQueryData), komponent useQuery bilan ishlatadi. Loader instant navigation beradi, TanStack Query kesh + refetch beradi.',
      },
    ],
    interviewQA: [
      {
        question: 'React Router loader nima va qanday ishlaydi?',
        answer: `Loader — route-ga kirilganda komponent renderlanmasdan OLDIN chaqiriladigan async funksiya. Ma'lumotni oldindan yuklaydi. Komponentda useLoaderData() bilan tayyor data olinadi — loading state kerak emas. Loader {params, request} argumentlari oladi. Xato bo'lsa throw new Response() — errorElement ko'rsatiladi. Nested route-larda barcha loader-lar PARALLEL ishlaydi — waterfall muammosi yo'q.`,
      },
      {
        question: 'Loader va useEffect bilan data fetching farqi nima?',
        answer: `useEffect: komponent render → mount → fetch → loading → data → qayta render. Nested route-da: parent render → parent fetch → child render → child fetch (waterfall). Loader: route-ga kirilganda fetch → data tayyor → komponent render. Nested route-da: parent loader + child loader PARALLEL → render. Loader afzalligi: kamroq render, parallel loading, loading holati route darajasida. useEffect afzalligi: kuchliroq kesh boshqaruvi (TanStack Query bilan).`,
      },
      {
        question: 'React Router action nima?',
        answer: `Action — Form submit (POST/PUT/DELETE) bo'lganda chaqiriladigan funksiya. <Form method="post"> bilan ishlatiladi (katta F — React Router-ning Form-i). Action bajarilgandan keyin barcha aktiv route loader-lari avtomatik qayta ishlaydi (revalidation) — UI yangilanadi. Validatsiya xatosini return qilsa — useActionData() bilan komponentda ko'rsatiladi. Muvaffaqiyatli bo'lsa — redirect() bilan boshqa sahifaga yo'naltirish.`,
      },
      {
        question: 'Loader va TanStack Query-ni birgalikda ishlatish mumkinmi?',
        answer: `Ha, bu eng yaxshi kombinatsiya. Loader ichida queryClient.ensureQueryData() — keshda bo'lsa so'rov yuborMAYDI, yo'q bo'lsa yuklaydi. Komponentda useQuery({initialData}) bilan ishlaydi — loader-dan kelgan datani boshlang'ich qiymat sifatida. Natija: loader instant navigation beradi (data render-dan oldin tayyor), TanStack Query kesh + background refetch + retry beradi. Har biri o'z kuchli tomonini qo'shadi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query (alternativa)' },
      { sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
    ],
  },
  {
    id: 'navigation-hooks',
    title: 'useNavigate, useParams, useSearchParams',
    importance: 3,
    status: 'to-learn',
    description: 'Programmatic navigation, URL params',
    content: `React Router-ning asosiy hook-lari — URL bilan ishlash, programmatic navigatsiya, va URL parametrlarini olish uchun.

═══════════════════════════════════════
  useNavigate — PROGRAMMATIC NAVIGATSIYA
═══════════════════════════════════════

Link — foydalanuvchi bosish uchun.
useNavigate — KOD ichidan navigatsiya uchun:

  const navigate = useNavigate()

  // Oddiy navigatsiya
  navigate('/dashboard')

  // Parametrlar bilan
  navigate('/users/123')

  // Replace (orqaga qaytganda bu sahifa ko'rinmasin)
  navigate('/login', { replace: true })

  // State bilan (URL-da ko'rinmaydi)
  navigate('/success', { state: { orderId: '456' } })

  // Relative — orqaga/oldinga
  navigate(-1)   // orqaga (browser back tugmasi kabi)
  navigate(1)    // oldinga
  navigate(-2)   // 2 qadam orqaga

Qachon ishlatiladi:
  ✅ Form submit-dan keyin redirect
  ✅ Login/logout-dan keyin
  ✅ Conditional redirect (if/else asosida)
  ✅ Timer tugagandan keyin

═══════════════════════════════════════
  useParams — DINAMIK URL SEGMENTLARI
═══════════════════════════════════════

Route path-dagi :param segmentlarini olish:

  // Route: path: 'users/:userId'
  // URL:   /users/123

  function UserPage() {
    const { userId } = useParams()
    // userId = '123' (DOIM string!)
  }

  // Bir nechta param:
  // Route: path: 'shop/:category/:productId'
  // URL:   /shop/electronics/456

  const { category, productId } = useParams()
  // category = 'electronics', productId = '456'

MUHIM: useParams DOIM string qaytaradi.
Agar number kerak bo'lsa — o'zingiz convert qiling:
  const id = Number(params.userId)

═══════════════════════════════════════
  useSearchParams — QUERY STRING
═══════════════════════════════════════

URL-dagi ?key=value parametrlari bilan ishlash:

  // URL: /products?category=phones&page=2&sort=price

  const [searchParams, setSearchParams] = useSearchParams()

  // O'qish
  searchParams.get('category')  // 'phones'
  searchParams.get('page')      // '2' (string!)
  searchParams.get('missing')   // null

  // Yangilash
  setSearchParams({ category: 'phones', page: '3' })
  // URL: /products?category=phones&page=3

  // Qisman yangilash (mavjudlarni saqlash)
  setSearchParams(prev => {
    prev.set('page', '3')       // faqat page o'zgaradi
    return prev
  })

useState vs useSearchParams:
  useState — sahifa yangilansa yo'qoladi, bookmark mumkin emas
  useSearchParams — URL-da saqlanadi, bookmark/share mumkin

═══════════════════════════════════════
  useLocation — HOZIRGI URL MA'LUMOTLARI
═══════════════════════════════════════

  const location = useLocation()

  location.pathname   // '/users/123'
  location.search     // '?tab=posts'
  location.hash       // '#section-2'
  location.state      // navigate-dan yuborilgan state
  location.key        // unique key (har navigatsiyada o'zgaradi)

Ishlatish:
  ✅ Aktiv sahifani aniqlash
  ✅ Navigatsiya state-ni olish (redirect back)
  ✅ Analytics (sahifa ko'rishlarni kuzatish)

═══════════════════════════════════════
  useNavigation — NAVIGATSIYA HOLATI
═══════════════════════════════════════

  const navigation = useNavigation()

  navigation.state
    'idle'        — hech narsa yuklanmayapti
    'loading'     — yangi sahifa yuklanmoqda (loader ishlayapti)
    'submitting'  — form submit bo'lmoqda (action ishlayapti)

  // Global loading indicator
  {navigation.state === 'loading' && <ProgressBar />}`,
    codeExamples: [
      {
        title: 'useNavigate — turli xil navigatsiya',
        language: 'tsx',
        code: `import { useNavigate } from 'react-router'

function LoginPage() {
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      await api.login({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      })

      // Muvaffaqiyatli → dashboard-ga
      navigate('/dashboard', { replace: true })
    } catch {
      // Xato → shu yerda qolish (navigate QILMA)
    }
  }

  return <form onSubmit={handleLogin}>...</form>
}

function ProductCard({ id, name }: { id: string; name: string }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(\`/products/\${id}\`)}
      className="cursor-pointer hover:shadow-lg"
    >
      <h3>{name}</h3>
      <button onClick={(e) => {
        e.stopPropagation()  // card click-ni to'xtatish
        navigate(\`/products/\${id}/edit\`)
      }}>
        Tahrirlash
      </button>
    </div>
  )
}

function BackButton() {
  const navigate = useNavigate()
  return <button onClick={() => navigate(-1)}>← Orqaga</button>
}`,
        description: 'useNavigate — login redirect (replace), card click navigatsiya, orqaga qaytish (-1). replace: true — login sahifasi history-da qolmasligi uchun.',
      },
      {
        title: 'useParams + useSearchParams — filtrlangan ro\'yxat',
        language: 'tsx',
        code: `import { useParams, useSearchParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'

// Route: /shop/:category
// URL:   /shop/electronics?page=2&sort=price&q=laptop

function ShopPage() {
  // URL path dan
  const { category } = useParams<{ category: string }>()

  // Query string dan
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')
  const sort = searchParams.get('sort') ?? 'newest'
  const query = searchParams.get('q') ?? ''

  // TanStack Query — params o'zgarsa avtomatik refetch
  const { data, isLoading } = useQuery({
    queryKey: ['products', category, { page, sort, query }],
    queryFn: () => fetchProducts({ category: category!, page, sort, query }),
  })

  // Filter o'zgartirish
  function handleSortChange(newSort: string) {
    setSearchParams(prev => {
      prev.set('sort', newSort)
      prev.set('page', '1')  // sort o'zgarsa 1-sahifaga qaytish
      return prev
    })
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setSearchParams(prev => {
      prev.set('q', formData.get('search') as string)
      prev.set('page', '1')
      return prev
    })
  }

  function handlePageChange(newPage: number) {
    setSearchParams(prev => {
      prev.set('page', String(newPage))
      return prev
    })
  }

  return (
    <div>
      <h1>{category} mahsulotlari</h1>

      <form onSubmit={handleSearch}>
        <input name="search" defaultValue={query} placeholder="Qidirish..." />
      </form>

      <select value={sort} onChange={e => handleSortChange(e.target.value)}>
        <option value="newest">Eng yangi</option>
        <option value="price">Narx bo'yicha</option>
        <option value="popular">Mashhur</option>
      </select>

      {data?.products.map(p => <ProductCard key={p.id} product={p} />)}

      <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
        Oldingi
      </button>
      <span>Sahifa {page} / {data?.totalPages}</span>
      <button onClick={() => handlePageChange(page + 1)}>
        Keyingi
      </button>
    </div>
  )
}`,
        description: 'useParams — URL path (:category). useSearchParams — query string (page, sort, q). setSearchParams(prev => ...) — mavjud parametrlarni saqlash. TanStack Query key-ga params qo\'shish — avtomatik refetch.',
      },
      {
        title: 'useLocation — analytics va state',
        language: 'tsx',
        code: `import { useLocation, useNavigate } from 'react-router'
import { useEffect } from 'react'

// Sahifa ko'rishlarni kuzatish
function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    // Har sahifa o'zgarganda analytics yuborish
    analytics.pageView(location.pathname + location.search)
  }, [location.pathname, location.search])
}

// Scroll to top — sahifa o'zgarganda tepaga qaytish
function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}

// Navigate state bilan ishlash
function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // navigate('/success', { state: { orderId: '123' } })
  const orderId = location.state?.orderId

  // State yo'q bo'lsa — bu sahifaga to'g'ridan-to'g'ri kirilgan
  if (!orderId) {
    return (
      <div>
        <p>Buyurtma topilmadi</p>
        <button onClick={() => navigate('/')}>Bosh sahifaga</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Buyurtma qabul qilindi!</h1>
      <p>Buyurtma raqami: {orderId}</p>
    </div>
  )
}`,
        description: 'useLocation — sahifa kuzatish (analytics), scroll to top, navigate state. State URL-da ko\'rinmaydi — bir martalik ma\'lumot uchun (order ID, redirect info).',
      },
    ],
    interviewQA: [
      {
        question: 'useNavigate va Link farqi nima? Qachon qaysi birini ishlatish kerak?',
        answer: `Link — deklarativ, JSX-da foydalanuvchi bosish uchun. <a> tag yaratadi — accessibility va SEO uchun yaxshi. Doim Link ishlatish kerak, agar foydalanuvchi ko'rishi va bosishi mumkin bo'lsa. useNavigate — imperativ, kod ichidan navigatsiya. Form submit, login, timer, conditional redirect uchun. navigate() funksiyasi — UI element yaratMAYDI. Qoida: foydalanuvchi bosadigan narsa = Link/NavLink. Kod logikasi natijasida navigatsiya = useNavigate.`,
      },
      {
        question: 'useParams nima qaytaradi? Tipizatsiya qanday?',
        answer: `useParams() — URL path-dagi dinamik segmentlarni object sifatida qaytaradi. DOIM string yoki undefined qaytaradi. Route: "users/:userId" → {userId: "123"}. TypeScript-da: useParams<{userId: string}>() — tip berish mumkin, lekin runtime-da hali ham string | undefined. Number kerak bo'lsa — Number(params.userId) bilan convert. Optional params uchun: "users/:userId?" — userId undefined bo'lishi mumkin.`,
      },
      {
        question: 'useSearchParams va useState farqi nima?',
        answer: `useState — xotirada saqlanadi, sahifa yangilansa yo'qoladi, bookmark/share mumkin emas, URL-da ko'rinmaydi. useSearchParams — URL-da saqlanadi (?key=value), sahifa yangilansa saqlanadi, bookmark/share mumkin, browser history-da kuzatiladi. Qachon useSearchParams: filter, sort, sahifa raqami, qidiruv so'zi — foydalanuvchi bookmark qilishi yoki link share qilishi kerak bo'lgan holatlar. Qachon useState: modal ochiq/yopiq, tooltip — URL-da ko'rinishi kerak bo'lmagan holatlar.`,
      },
      {
        question: 'useLocation.state nima uchun ishlatiladi?',
        answer: `navigate('/path', { state: {...} }) bilan yuborilgan ma'lumot. URL-da ko'rinMAYDI, faqat xotirada saqlanadi. Ishlatish holatlari: 1) redirect back — oldingi URL-ni saqlash (from: location), 2) bir martalik ma'lumot — orderId, success message, 3) sahifalar orasida vaqtinchalik data uzatish. Cheklovlar: sahifa qayta yuklansa — state yo'qoladi, bookmark bilan saqlab bo'lmaydi. Doimiy ma'lumot uchun URL params yoki store ishlatish kerak.`,
      },
      {
        question: 'navigate(-1) va navigate("/") farqi nima?',
        answer: `navigate(-1) — browser history-da bitta qadam ORQAGA. Oldingi sahifa qaysi bo'lsa — shunga qaytadi. Agar history bo'sh bo'lsa — hech narsa qilmaydi. navigate("/") — DOIM bosh sahifaga boradi, history-dan qat'iy nazar. navigate(-1) = browser-ning back tugmasi. navigate("/") = to'g'ridan-to'g'ri manzil. Qoida: "orqaga" tugmasi uchun navigate(-1), aniq sahifaga yo'naltirish uchun navigate("/path").`,
      },
    ],
    relatedTopics: [
      { sectionId: 'routing', topicId: 'react-router-basics', label: 'Router asoslari' },
      { sectionId: 'routing', topicId: 'protected-routes', label: 'Protected Routes' },
    ],
  },
  {
    id: 'nested-layouts',
    title: 'Nested Layouts',
    importance: 2,
    status: 'to-learn',
    description: 'Outlet pattern — ichma-ich layout',
    content: `Nested Layouts — ichma-ich joylashgan layout tuzilmasi. Ota layout o'zgarmaydi, faqat ichki qism (Outlet) yangilanadi. Real ilovalarning asosiy arxitektura patterni.

═══════════════════════════════════════
  OUTLET NIMA?
═══════════════════════════════════════

Outlet — child route-ning renderlanadigan joyi.
Vue Router-dagi <router-view /> ga to'g'ri keladi.

  function RootLayout() {
    return (
      <div>
        <Header />         {/* doim ko'rinadi */}
        <Sidebar />        {/* doim ko'rinadi */}
        <main>
          <Outlet />       {/* child route shu yerda */}
        </main>
        <Footer />         {/* doim ko'rinadi */}
      </div>
    )
  }

URL o'zgarsa — faqat Outlet ichidagi komponent o'zgaradi.
Header, Sidebar, Footer qayta renderlanMAYDI.

═══════════════════════════════════════
  NESTED ROUTE TUZILMASI
═══════════════════════════════════════

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,      // Header + Sidebar + Outlet
      children: [
        { index: true, element: <Home /> },
        {
          path: 'dashboard',
          element: <DashboardLayout />,  // Tabs + Outlet
          children: [
            { index: true, element: <Overview /> },
            { path: 'analytics', element: <Analytics /> },
            { path: 'settings', element: <Settings /> },
          ],
        },
      ],
    },
  ])

URL: /dashboard/analytics
  RootLayout (Header + Sidebar)
    └── DashboardLayout (Tabs)
          └── Analytics (kontent)

3 ta daraja — har birida Outlet bor.

═══════════════════════════════════════
  LAYOUT ROUTE (element-siz)
═══════════════════════════════════════

Layout route — path-siz, faqat layout beruvchi route:

  {
    element: <AdminLayout />,    // path YO'Q
    children: [
      { path: 'admin', element: <AdminHome /> },
      { path: 'admin/users', element: <AdminUsers /> },
    ],
  }

Bu ProtectedRoute uchun ham ishlatiladi:
  {
    element: <ProtectedRoute />,  // auth tekshirish
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
    ],
  }

═══════════════════════════════════════
  OUTLET CONTEXT
═══════════════════════════════════════

Ota layout-dan child-larga ma'lumot berish:

  function DashboardLayout() {
    const [period, setPeriod] = useState('week')

    return (
      <div>
        <PeriodSelector value={period} onChange={setPeriod} />
        <Outlet context={{ period }} />
      </div>
    )
  }

  // Child komponentda olish:
  function Analytics() {
    const { period } = useOutletContext<{ period: string }>()
    return <Chart period={period} />
  }

Context API-ga o'xshash, lekin faqat Outlet ichidagi child-lar oladi.

═══════════════════════════════════════
  REAL-WORLD LAYOUT TUZILMASI
═══════════════════════════════════════

Tipik SPA tuzilmasi:

  RootLayout
  ├── / → HomePage
  ├── /auth → AuthLayout (header-siz)
  │   ├── /login → LoginPage
  │   └── /register → RegisterPage
  ├── /dashboard → DashboardLayout (sidebar bilan)
  │   ├── / → Overview
  │   ├── /analytics → Analytics
  │   └── /settings → SettingsLayout (tab-lar bilan)
  │       ├── /profile → ProfileSettings
  │       └── /security → SecuritySettings
  └── /admin → AdminLayout (admin sidebar)
      ├── / → AdminHome
      └── /users → AdminUsers

Har bir layout O'ZINING Header/Sidebar/Footer-iga ega bo'lishi mumkin.
Masalan: AuthLayout — header yo'q, DashboardLayout — sidebar bor.`,
    codeExamples: [
      {
        title: 'Nested layouts — to\'liq tuzilma',
        language: 'tsx',
        code: `import { createBrowserRouter, Outlet, NavLink } from 'react-router'

// 1-daraja: Root Layout (Header + Sidebar)
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />  {/* 2-daraja shu yerda */}
        </main>
      </div>
    </div>
  )
}

// 2-daraja: Dashboard Layout (Tab-lar)
function DashboardLayout() {
  return (
    <div>
      <nav className="flex gap-2 border-b pb-4 mb-6">
        <NavLink to="/dashboard" end
          className={({ isActive }) => isActive ? 'font-bold text-blue-500' : ''}
        >
          Umumiy
        </NavLink>
        <NavLink to="/dashboard/analytics"
          className={({ isActive }) => isActive ? 'font-bold text-blue-500' : ''}
        >
          Analitika
        </NavLink>
        <NavLink to="/dashboard/settings"
          className={({ isActive }) => isActive ? 'font-bold text-blue-500' : ''}
        >
          Sozlamalar
        </NavLink>
      </nav>
      <Outlet />  {/* 3-daraja shu yerda */}
    </div>
  )
}

// Auth Layout — header va sidebar YO'Q
function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <Outlet />
      </div>
    </div>
  )
}

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: 'analytics', element: <Analytics /> },
          { path: 'settings', element: <Settings /> },
        ],
      },
    ],
  },
  // Auth sahifalari — boshqa layout
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
])`,
        description: 'Nested layouts: RootLayout (header+sidebar) > DashboardLayout (tabs) > sahifa. AuthLayout — alohida layout (header/sidebar yo\'q). Har daraja Outlet bilan child-larni ko\'rsatadi.',
      },
      {
        title: 'Outlet context — ota-bola ma\'lumot uzatish',
        language: 'tsx',
        code: `import { Outlet, useOutletContext } from 'react-router'
import { useState } from 'react'

interface DashboardContext {
  dateRange: { from: Date; to: Date }
  setDateRange: (range: { from: Date; to: Date }) => void
  currency: string
}

function DashboardLayout() {
  const [dateRange, setDateRange] = useState({
    from: new Date('2024-01-01'),
    to: new Date(),
  })
  const currency = 'UZS'

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Context barcha child route-larga uzatiladi */}
      <Outlet context={{ dateRange, setDateRange, currency } satisfies DashboardContext} />
    </div>
  )
}

// Typed hook — child-larda ishlatish uchun
function useDashboardContext() {
  return useOutletContext<DashboardContext>()
}

// Child sahifalar
function RevenueChart() {
  const { dateRange, currency } = useDashboardContext()

  return (
    <div>
      <h2>Daromad ({currency})</h2>
      <p>{dateRange.from.toLocaleDateString()} — {dateRange.to.toLocaleDateString()}</p>
      <Chart data={useRevenueData(dateRange)} />
    </div>
  )
}

function OrdersTable() {
  const { dateRange } = useDashboardContext()

  return (
    <div>
      <h2>Buyurtmalar</h2>
      <Table data={useOrdersData(dateRange)} />
    </div>
  )
}`,
        description: 'Outlet context — DashboardLayout-dan barcha child route-larga dateRange va currency uzatiladi. Typed hook (useDashboardContext) — TypeScript bilan xavfsiz olish.',
      },
      {
        title: 'Error boundary per route',
        language: 'tsx',
        code: `import {
  createBrowserRouter,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router'

// Route-level error boundary
function RouteErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    // throw new Response() bilan tashlangan xato
    if (error.status === 404) {
      return (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-gray-500 mt-2">Sahifa topilmadi</p>
        </div>
      )
    }
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Xato {error.status}</h1>
        <p className="text-gray-500 mt-2">{error.statusText}</p>
      </div>
    )
  }

  // Kutilmagan xato
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-red-500">Kutilmagan xato</h1>
      <p className="text-gray-500 mt-2">Iltimos, sahifani yangilang</p>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,  // global error
    children: [
      { index: true, element: <Home /> },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        errorElement: <RouteErrorBoundary />,  // faqat dashboard uchun
        children: [
          { index: true, element: <Overview /> },
          {
            path: 'analytics',
            element: <Analytics />,
            errorElement: <RouteErrorBoundary />,  // faqat analytics uchun
          },
        ],
      },
    ],
  },
])

// Natija: Analytics xato bersa — faqat analytics joyi error ko'rsatadi
// DashboardLayout (tabs) va RootLayout (header/sidebar) SAQLANADI`,
        description: 'errorElement — har route uchun alohida error boundary. Xato faqat shu route joyida ko\'rsatiladi — qolgan layout saqlanadi. isRouteErrorResponse — HTTP xato yoki kutilmagan xato farqlash.',
      },
    ],
    interviewQA: [
      {
        question: 'Outlet nima va qanday ishlaydi?',
        answer: `Outlet — React Router-ning child route renderlanadigan joyi. Vue-dagi <router-view/> ga to'g'ri keladi. Ota route element ichida <Outlet/> qo'yiladi — URL o'zgarsa faqat Outlet ichidagi komponent o'zgaradi, layout (Header, Sidebar, Footer) qayta renderlanMAYDI. Bu SPA-ning asosiy afzalligi — faqat kerakli qism yangilanadi. Outlet context prop bilan child-larga ma'lumot uzatish ham mumkin.`,
      },
      {
        question: 'Nested layouts nima uchun kerak?',
        answer: `Real ilovada turli sahifalar turli layout talab qiladi. Masalan: auth sahifalari — header yo'q, dashboard — sidebar bor, admin — admin sidebar. Nested layouts bilan: 1) Har sahifa uchun mos layout, 2) Layout o'zgarmaydi, faqat kontent o'zgaradi, 3) Header/Sidebar qayta renderlanmaydi (performance), 4) Kod takrorlanmaydi (DRY). Layoutlar 3-4 darajagacha ichma-ich bo'lishi mumkin: Root → Dashboard → Settings → child.`,
      },
      {
        question: 'Layout route nima? Path-siz route nima uchun kerak?',
        answer: `Layout route — path-siz, faqat element beradigan route. Maqsad: bir guruh route-larga umumiy wrapper berish. 2 ta asosiy ishlatish: 1) Layout — DashboardLayout ichida sidebar/tabs, child-lar Outlet-da renderlanadi. 2) Guard — ProtectedRoute ichida auth tekshirish, muvaffaqiyatli bo'lsa Outlet-ni ko'rsatish. Path-siz route URL-ga ta'sir qilMAYDI — faqat komponent tuzilmasiga ta'sir qiladi.`,
      },
      {
        question: 'useOutletContext nima va Context API dan farqi?',
        answer: `useOutletContext — Outlet orqali child route-larga ma'lumot uzatish. <Outlet context={value} /> bilan beriladi, child-da useOutletContext() bilan olinadi. Context API-dan farqi: 1) faqat bitta daraja pastga ishlaydi (bevosita child route), 2) Provider kerak emas, 3) Outlet-ga bog'liq. Context API esa: 1) chuqur darajadagi komponentlarga yetadi, 2) Provider kerak, 3) Route-dan mustaqil. Oddiy layout data uchun useOutletContext, global data uchun Context API.`,
      },
      {
        question: 'React Router-da errorElement qanday ishlaydi?',
        answer: `errorElement — route darajasida error boundary. Loader, action, yoki render paytida xato bo'lsa ko'rsatiladi. Xato eng yaqin errorElement-ga "ko'tariladi" (bubble). Agar child route-da errorElement bo'lsa — faqat shu joy xato ko'rsatadi, ota layout SAQLANADI. useRouteError() — xatoni olish hook. isRouteErrorResponse() — HTTP xato (throw new Response) yoki JS xato (throw new Error) farqlash. Bu class ErrorBoundary-ga qaraganda osonroq va route-tizimi bilan integratsiyalangan.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'routing', topicId: 'react-router-basics', label: 'Router asoslari' },
      { sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition' },
    ],
  },
]
