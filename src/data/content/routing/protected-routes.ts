import type { Topic } from '../../types'

export const protectedRoutes: Topic = {
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
  }
