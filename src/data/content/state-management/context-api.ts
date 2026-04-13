import type { Topic } from '../../types'

export const contextApi: Topic = {
    id: 'context-api',
    title: 'Context API',
    importance: 3,
    status: 'to-learn',
    description: 'createContext, Provider, useContext pattern',
    content: `Context API — React-ning o'rnatilgan state sharing mexanizmi. Props drilling muammosini hal qiladi. Lekin CHEKLOVLARI bor — to'g'ri ishlatish juda muhim.

═══════════════════════════════════════
  PROPS DRILLING MUAMMOSI
═══════════════════════════════════════

Props drilling — ma'lumotni chuqur komponentga yetkazish uchun
oraliq komponentlardan o'tkazish:

  App → Header → Nav → UserMenu → UserAvatar
  (user prop 4 ta komponentdan o'tadi, lekin faqat UserAvatar ishlatadi)

Muammolari:
  ❌ Oraliq komponentlar keraksiz props oladi
  ❌ Refactoring qiyin — bitta prop o'zgarsa, butun zanjir o'zgaradi
  ❌ Kodni o'qish qiyin

Context bu muammoni hal qiladi — ma'lumotni TO'G'RIDAN-TO'G'RI
kerakli komponentga yetkazadi.

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

3 qadam:
  1. createContext() — Context ob'ekti yaratish
  2. <Provider value={...}> — ma'lumotni berish
  3. useContext(ctx) — ma'lumotni olish

  const ThemeContext = createContext('light')

  function App() {
    return (
      <ThemeContext.Provider value="dark">
        <Page />          {/* Page tema bilmaydi */}
          <Sidebar />     {/* Sidebar tema bilmaydi */}
            <Button />    {/* Button useContext bilan oladi */}
      </ThemeContext.Provider>
    )
  }

  function Button() {
    const theme = useContext(ThemeContext)  // 'dark'
  }

═══════════════════════════════════════
  RE-RENDER MUAMMOSI (MUHIM!)
═══════════════════════════════════════

Context value o'zgarganda — UShBU CONTEXT-ni useContext bilan
ishlatgan BARCHA komponentlar re-render bo'ladi.

MUAMMO:
  function App() {
    const [user, setUser] = useState(...)
    const [theme, setTheme] = useState(...)

    // user YOKI theme o'zgarsa — BARCHA consumer-lar re-render
    return (
      <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
        <Page />
      </AppContext.Provider>
    )
  }

YECHIM — Context-ni ajratish:
  <UserContext.Provider value={{ user, setUser }}>
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  </UserContext.Provider>

Endi user o'zgarsa — faqat UserContext consumer-lari re-render bo'ladi.

═══════════════════════════════════════
  PROVIDER PATTERN (Best Practice)
═══════════════════════════════════════

Context + Provider + custom hook = to'liq pattern:

  1. Context yaratish (alohida fayl)
  2. Provider komponent yaratish (logika shu yerda)
  3. Custom hook yaratish (useContext wrapper)
  4. Komponentlarda faqat hook ishlatish

Bu pattern afzalliklari:
  ✅ Context implementatsiyasi yashirilgan
  ✅ Provider yo'qligida aniq xato beradi
  ✅ Oson test qilish mumkin
  ✅ Refactoring oson — hook interfeysi o'zgarMASA

═══════════════════════════════════════
  QACHON CONTEXT, QACHON REDUX/ZUSTAND
═══════════════════════════════════════

Context TO'G'RI:
  ✅ Kamdan-kam o'zgaradigan ma'lumotlar (tema, til, auth)
  ✅ Kichik-o'rta ilova
  ✅ Dependency injection (service berish)

Context NOTO'G'RI:
  ❌ Tez-tez o'zgaradigan ma'lumotlar (har 100ms)
  ❌ Ko'p komponent subscribe bo'lganda (re-render muammosi)
  ❌ Murakkab state logikasi (reducer/middleware kerak)
  ❌ DevTools kerak bo'lganda

Context — STATE MANAGEMENT EMAS, u DATA PASSING mexanizmi.
Har bir value o'zgarishda barcha consumer-lar re-render bo'ladi.
Bu kamdan-kam o'zgaradigan ma'lumotlar uchun OK,
lekin tez-tez o'zgaradigan data uchun muammo.`,
    codeExamples: [
      {
        title: 'To\'liq Provider pattern — Theme',
        language: 'tsx',
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// 1. Context yaratish
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// 2. Custom hook — null tekshirish bilan
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// 3. Provider komponent — logika shu yerda
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 4. Ishlatish — komponentda faqat hook
function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      <button onClick={toggleTheme}>
        {theme === 'light' ? 'Qorongu' : 'Yorug'} rejim
      </button>
    </header>
  )
}`,
        description: 'To\'liq pattern: Context + Provider + custom hook. null check bilan Provider yo\'qligida aniq xato beradi. Logika Provider ichida, komponentlar faqat hook ishlatadi.',
      },
      {
        title: 'Context ajratish — re-render optimizatsiya',
        language: 'tsx',
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// YOMON — bitta katta Context
// user O'ZGARSA theme consumer-lar ham re-render bo'ladi
const BadContext = createContext<{
  user: User | null
  theme: string
  setUser: (u: User) => void
  setTheme: (t: string) => void
} | null>(null)

// YAXSHI — alohida Context-lar
interface AuthContextType {
  user: User | null
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
}

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)
const ThemeContext = createContext<ThemeContextType | null>(null)

// Har biri uchun alohida Provider
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (creds: Credentials) => {
    const user = await api.login(creds)
    setUser(user)
  }
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// App-da birlashtirish
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </AuthProvider>
  )
}

// Komponent faqat kerakli Context-ni ishlatadi
function UserMenu() {
  const { user, logout } = useAuth()  // faqat auth o'zgarsa re-render
  return <button onClick={logout}>{user?.name}</button>
}`,
        description: 'Bitta katta Context o\'rniga kichik, mustaqil Context-lar yarating. Har bir Context o\'zgarsa faqat O\'ZINING consumer-larini re-render qiladi.',
      },
      {
        title: 'Context + useReducer — murakkab state',
        language: 'tsx',
        code: `import { createContext, useContext, useReducer, type ReactNode } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'qty'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; qty: number } }
  | { type: 'CLEAR' }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.payload.id)
      if (existing) {
        return state.map(i =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...state, { ...action.payload, qty: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload)
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
      )
    case 'CLEAR':
      return []
  }
}

const CartContext = createContext<{
  items: CartItem[]
  dispatch: React.Dispatch<CartAction>
  total: number
} | null>(null)

function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [])
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, dispatch, total }}>
      {children}
    </CartContext.Provider>
  )
}`,
        description: 'Murakkab state uchun Context + useReducer kombinatsiyasi. Reducer action pattern beradi — Redux-ga o\'xshash, lekin global emas.',
      },
    ],
    interviewQA: [
      {
        question: 'Context API nima va qanday ishlaydi?',
        answer: `Context API — React-ning o'rnatilgan data passing mexanizmi. Props drilling muammosini hal qiladi — ma'lumotni oraliq komponentlardan o'tkazmasdan to'g'ridan-to'g'ri kerakli komponentga yetkazadi. 3 qadam: 1) createContext() — Context ob'ekti yaratish, 2) Provider value={...} — ma'lumotni tree-ga berish, 3) useContext(ctx) — kerakli joyda olish. Provider ichidagi HAR QANDAY chuqurlikdagi komponent useContext bilan qiymatni olishi mumkin.`,
      },
      {
        question: 'Context API-ning re-render muammosi nima?',
        answer: `Context value o'zgarganda useContext ishlatgan BARCHA komponentlar re-render bo'ladi — React.memo ham YORDAM BERMAYDI. Masalan: bitta Context-da user va theme bo'lsa, user o'zgarsa theme ishlatgan komponentlar HAM re-render bo'ladi. Yechimlar: 1) Context-ni ajratish — har bir concern uchun alohida Context, 2) value-ni memoizatsiya qilish (useMemo), 3) Tez-tez o'zgaradigan data uchun Context o'rniga Zustand/Redux ishlatish. Context — state management emas, data passing mexanizmi.`,
      },
      {
        question: 'Context va Redux/Zustand farqi nima? Qachon nima ishlatiladi?',
        answer: `Context — React-ning o'rnatilgan data passing mexanizmi. U state management EMAS. Har value o'zgarishda barcha consumer-lar re-render bo'ladi. Redux/Zustand — external store, selector orqali faqat kerakli qism o'zgarsa re-render. Context ishlatish: kamdan-kam o'zgaradigan data (tema, til, auth), dependency injection, kichik ilovalar. Redux/Zustand ishlatish: tez-tez o'zgaradigan data, ko'p consumer, murakkab state logikasi, DevTools kerak bo'lganda.`,
      },
      {
        question: 'Provider pattern nima va nima uchun ishlatiladi?',
        answer: `Provider pattern — Context + Provider komponent + custom hook = to'liq encapsulation. Qadamlar: 1) createContext(null), 2) Provider komponent (logika shu yerda — useState, useEffect), 3) useMyContext() custom hook (null tekshirish + xato berish), 4) Komponentlarda faqat hook ishlatish. Afzalliklari: Context implementatsiyasi yashirilgan, Provider yo'qligida aniq xato beradi ("must be used within Provider"), oson test qilish mumkin, refactoring oson.`,
      },
      {
        question: 'Props drilling yomonmi? Doim Context ishlatish kerakmi?',
        answer: `Yo'q! Props drilling — 1-2 daraja bo'lsa umuman muammo emas, bu React-ning normal ishlash usuli. Props explicit va kuzatish oson. Context kerak bo'ladigan holatlar: 3+ daraja props o'tkazish, ko'p komponentlar bitta ma'lumotni ishlatganda, global ma'lumotlar (tema, til, auth). Context keraksiz alternativalar: component composition (children prop), render props. Ortiqcha Context ishlatish kodning murakkabligini oshiradi va re-render muammolarini keltirib chiqaradi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-context', label: 'useContext hook' },
      { sectionId: 'component-patterns', topicId: 'provider-pattern', label: 'Provider Pattern' },
      { sectionId: 'theory-questions', topicId: 'props-drilling', label: 'Props Drilling yechimi' },
      { sectionId: 'performance', topicId: 're-render-causes', label: 'Context re-render muammosi' },
    ],
  }
