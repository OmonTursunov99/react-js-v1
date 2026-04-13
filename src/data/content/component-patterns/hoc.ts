import type { Topic } from '../../types'

export const hoc: Topic = {
    id: `hoc`,
    title: `Higher-Order Components (HOC)`,
    importance: 2,
    status: `to-learn`,
    description: `withAuth(Component) pattern, qachon ishlatiladi`,
    content: `Higher-Order Component (HOC) — funksiya bo'lib, komponentni oladi va YANGI komponent qaytaradi. Komponentga qo'shimcha funksionallik beradi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

HOC — funksiya bo'lib, komponentni oladi va
YANGI komponent qaytaradi:

  const EnhancedComponent = withSomething(OriginalComponent)

Masalan:
  const ProtectedDashboard = withAuth(Dashboard)
  // Dashboard — oddiy komponent
  // ProtectedDashboard — auth tekshiruvi bor

HOC komponentni "o'ramaydi" (wrap) —
qo'shimcha logika qo'shadi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  function withAuth<P>(Component: React.ComponentType<P>) {
    return function AuthComponent(props: P) {
      const isAuthenticated = useAuth()

      if (!isAuthenticated) {
        return <Navigate to="/login" />
      }

      return <Component {...props} />
    }
  }

  // Ishlatish:
  const ProtectedDashboard = withAuth(Dashboard)

HOC — oddiy funksiya:
  Kirish: Component
  Chiqish: Yangi Component (qo'shimcha logika bilan)

═══════════════════════════════════════
  REAL MISOLLAR
═══════════════════════════════════════

1. withAuth — autentifikatsiya tekshirish
2. withTheme — tema berish (dark/light)
3. withLoading — loading holat qo'shish
4. withErrorBoundary — xato ushlash
5. withLogger — render log qilish (debugging)
6. React.memo — ham HOC! Memoizatsiya qo'shadi

═══════════════════════════════════════
  QOIDALAR
═══════════════════════════════════════

1) Original komponentni o'zgartirMANG:
   // NOTO'G'RI:
   Component.prototype.render = ...

   // TO'G'RI:
   return <Component {...props} />

2) Props-ni pass through qiling:
   // Barcha props-ni original komponentga uzating
   return <Component {...props} extraProp={value} />

3) Display name bering (debugging uchun):
   AuthComponent.displayName =
     \`withAuth(\${Component.displayName || Component.name})\`

4) Render ichida HOC yaratMANG:
   // NOTO'G'RI — har renderda yangi komponent!
   function App() {
     const Enhanced = withAuth(Dashboard) // ← har render!
     return <Enhanced />
   }

   // TO'G'RI — tashqarida yaratish:
   const Enhanced = withAuth(Dashboard)
   function App() {
     return <Enhanced />
   }

═══════════════════════════════════════
  MUAMMOLARI
═══════════════════════════════════════

1) Wrapper hell — ko'p HOC qo'yilsa:
   withAuth(withTheme(withLoading(withLogger(Component))))

2) Props conflict — HOC-lar bir xil nom bilan prop bersa

3) Ref forward qilinmaydi — forwardRef kerak

4) Static methods yo'qoladi — hoist-non-react-statics kerak

═══════════════════════════════════════
  CUSTOM HOOKS ALMASHTIRDI
═══════════════════════════════════════

Ko'p HOC-lar endi custom hook bilan oddiyroq qilinadi:

  // HOC:
  const ProtectedPage = withAuth(Dashboard)

  // Hook (oddiyroq):
  function Dashboard() {
    const { user, isAuthenticated } = useAuth()
    if (!isAuthenticated) return <Navigate to="/login" />
    return <div>Salom, {user.name}</div>
  }

Lekin HOC hali ham kerak bo'ladigan holatlar bor:
  - Cross-cutting concerns (logging, error boundary)
  - Har bir sahifaga bir xil logika qo'shish
  - 3rd party kutubxonalar bilan integratsiya`,
    codeExamples: [
      {
        title: `withAuth — autentifikatsiya HOC`,
        language: `tsx`,
        code: `import { type ComponentType } from 'react'

// Sodda auth hook (misol uchun)
function useAuth() {
  // Real ilovada Context yoki state management-dan keladi
  return {
    isAuthenticated: true,
    user: { name: 'Ali', role: 'admin' },
  }
}

// HOC — komponentni oladi, yangi komponent qaytaradi
function withAuth<P extends object>(Component: ComponentType<P>) {
  function AuthenticatedComponent(props: P) {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated) {
      return (
        <div className="text-center p-8">
          <h2>Ruxsat yo'q!</h2>
          <p>Iltimos, tizimga kiring</p>
          <a href="/login" className="text-blue-500">Kirish</a>
        </div>
      )
    }

    // Barcha props + user props uzatish
    return <Component {...props} user={user} />
  }

  // Debug uchun nom berish (React DevTools-da ko'rinadi)
  AuthenticatedComponent.displayName =
    \`withAuth(\${Component.displayName || Component.name || 'Component'})\`

  return AuthenticatedComponent
}

// Oddiy komponent
interface DashboardProps {
  user?: { name: string; role: string }
}

function Dashboard({ user }: DashboardProps) {
  return (
    <div>
      <h1>Boshqaruv paneli</h1>
      <p>Xush kelibsiz, {user?.name}!</p>
      <p>Rolingiz: {user?.role}</p>
    </div>
  )
}

// HOC bilan o'rash
const ProtectedDashboard = withAuth(Dashboard)

// Ishlatish
function App() {
  return <ProtectedDashboard />
  // Agar auth bo'lmasa — "Ruxsat yo'q" ko'rsatadi
  // Agar auth bo'lsa — Dashboard + user props beradi
}`,
        description: `withAuth — eng keng tarqalgan HOC. Komponent render bo'lishdan OLDIN autentifikatsiyani tekshiradi. Auth bo'lmasa fallback ko'rsatadi, bo'lsa original komponentni user bilan renderlayd.`,
      },
      {
        title: `withLoading — loading state HOC`,
        language: `tsx`,
        code: `import { type ComponentType } from 'react'

// Loading spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="ml-2">Yuklanmoqda...</span>
    </div>
  )
}

// withLoading HOC
interface WithLoadingProps {
  isLoading: boolean
}

function withLoading<P extends object>(Component: ComponentType<P>) {
  function LoadingComponent(props: P & WithLoadingProps) {
    const { isLoading, ...rest } = props

    if (isLoading) {
      return <LoadingSpinner />
    }

    return <Component {...(rest as P)} />
  }

  LoadingComponent.displayName =
    \`withLoading(\${Component.displayName || Component.name || 'Component'})\`

  return LoadingComponent
}

// Oddiy komponent
interface UserListProps {
  users: Array<{ id: number; name: string }>
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

// HOC bilan
const UserListWithLoading = withLoading(UserList)

// Ishlatish
function App() {
  const isLoading = false
  const users = [
    { id: 1, name: 'Ali' },
    { id: 2, name: 'Vali' },
  ]

  return (
    <UserListWithLoading
      isLoading={isLoading}  // true bo'lsa — spinner
      users={users}           // false bo'lsa — ro'yxat
    />
  )
}`,
        description: `withLoading — isLoading prop qo'shadi. true bo'lganda spinner ko'rsatadi, false bo'lganda original komponentni renderlaydi. Har qanday komponentga loading holat qo'shish mumkin.`,
      },
    ],
    interviewQA: [
      {
        question: `HOC nima va qanday ishlaydi?`,
        answer: `Higher-Order Component — funksiya bo'lib, komponentni argument sifatida oladi va YANGI komponent qaytaradi. const Enhanced = withAuth(Dashboard). Yangi komponent original komponentni o'z ichiga oladi va qo'shimcha logika qo'shadi (auth tekshirish, loading state, tema berish). HOC original komponentni O'ZGARTIRMAYDI — uni "o'raydi". Bu funksional dasturlashdagi function composition-ga o'xshaydi. React.memo ham HOC — memoizatsiya qo'shadi.`,
      },
      {
        question: `HOC muammolari nimada?`,
        answer: `HOC ning asosiy muammolari: 1) Wrapper hell — ko'p HOC qo'yilsa withAuth(withTheme(withLoading(Component))) — debug qiyin, DevTools-da ko'p nesting. 2) Props collision — ikki HOC bir xil nomli prop bersa, biri yutiladi. 3) Ref forwarding — HOC ref-ni to'xtatadi, forwardRef kerak. 4) Static methods yo'qoladi — wrapper komponentda original component-ning static method-lari bo'lmaydi. 5) Render ichida yaratilsa har safar yangi komponent hosil bo'ladi — state yo'qoladi.`,
      },
      {
        question: `HOC vs Custom Hooks vs Render Props — qaysi qachon?`,
        answer: `Custom Hooks — KO'P HOLLARDA eng yaxshi tanlov. Oddiy, toza, TypeScript bilan yaxshi, nesting yo'q. 90% logika qayta ishlatish hook bilan qilinadi. HOC — cross-cutting concerns uchun: auth wrapper, error boundary, logging, permission check — komponentni "o'rash" kerak bo'lganda. Render Props — runtime-da render logikasini o'zgartirish kerak bo'lganda, headless komponentlar. Zamonaviy React-da: avval hook, kerak bo'lsa HOC, oxirgi chora render props.`,
      },
    ],
    relatedTopics: [
      { sectionId: `component-patterns`, topicId: `render-props`, label: `Render Props (alternativa)` },
      { sectionId: `component-patterns`, topicId: `custom-hooks`, label: `Custom Hooks (zamonaviy alternativa)` },
      { sectionId: `react-core`, topicId: `react-memo`, label: `React.memo (HOC misoli)` },
    ],
  }
