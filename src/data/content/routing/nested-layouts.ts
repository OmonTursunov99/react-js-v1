import type { Topic } from '../../types'

export const nestedLayouts: Topic = {
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
  }
