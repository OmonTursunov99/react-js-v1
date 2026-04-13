import type { Topic } from '../../types'

export const useContext: Topic = {
    id: 'use-context',
    title: 'useContext',
    importance: 3,
    status: 'to-learn' as const,
    description: 'Global state props drilling-siz',
    content: `useContext — React Context API bilan ishlash uchun hook. Props drilling muammosini hal qiladi — chuqur nested komponentlarga ma'lumotni bevosita yetkazadi.

═══════════════════════════════════════
  SINTAKSIS: createContext -> Provider -> useContext
═══════════════════════════════════════

  // 1-qadam: Context yaratish
  const MyContext = createContext(defaultValue)

  // 2-qadam: Provider bilan o'rash
  <MyContext.Provider value={actualValue}>
    <App />
  </MyContext.Provider>

  // 3-qadam: Istalgan child-da ishlatish
  const value = useContext(MyContext)

═══════════════════════════════════════
  3 QADAM BATAFSIL
═══════════════════════════════════════

1. createContext(defaultValue):
   - Context object yaratadi
   - defaultValue — Provider TOPILMAGANDA ishlatiladigan qiymat
   - Odatda null yoki sensible default berish

2. <Context.Provider value={...}>:
   - Barcha children-larga value yetkazadi
   - value o'zgarganda — barcha consumer-lar RE-RENDER bo'ladi
   - Bir nechta Provider nesting mumkin

3. useContext(Context):
   - Eng yaqin Provider-dan value oladi
   - Provider yo'q bo'lsa — defaultValue qaytaradi
   - Context value o'zgarganda — komponent RE-RENDER bo'ladi

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Props drilling muammosi:

  <App>                    // theme state
    <Layout theme={theme}> // faqat pastga uzatadi
      <Sidebar theme={theme}> // faqat pastga uzatadi
        <Menu theme={theme}> // faqat pastga uzatadi
          <MenuItem theme={theme}> // ASLIDA faqat SHU kerak
          </MenuItem>
        </Menu>
      </Sidebar>
    </Layout>
  </App>

Context bilan:

  <ThemeContext.Provider value={theme}>
    <App>
      <Layout>
        <Sidebar>
          <Menu>
            <MenuItem /> // useContext(ThemeContext) — TO'G'RIDAN-TO'G'RI
          </Menu>
        </Sidebar>
      </Layout>
    </App>
  </ThemeContext.Provider>

Props drilling yo'q — MenuItem to'g'ridan-to'g'ri theme oladi!

═══════════════════════════════════════
  PERFORMANCE MUAMMOSI
═══════════════════════════════════════

Context value o'zgarganda BARCHA consumer-lar re-render bo'ladi.
Bu katta muammo bo'lishi mumkin:

  // MUAMMO: user O'ZGARGANDA barcha consumer-lar renderlanadi
  <AppContext.Provider value={{ user, theme, settings, notifications }}>

YECHIMLAR:

1. CONTEXT-NI BO'LISH (eng yaxshi):
   <UserContext.Provider value={user}>
   <ThemeContext.Provider value={theme}>
   <SettingsContext.Provider value={settings}>
   // Endi user o'zgarsa — faqat UserContext consumer-lari renderlanadi

2. VALUE-NI useMemo BILAN O'RASH:
   const value = useMemo(() => ({ user, theme }), [user, theme])
   <AppContext.Provider value={value}>
   // Object referens saqlanadi — keraksiz render kamayadi

3. ZUSTAND/REDUX ISHLATISH:
   Tez-tez o'zgaradigan ma'lumot uchun Context EMAS,
   Zustand yoki Redux ishlatish kerak — ular selector orqali
   faqat KERAKLI qismni kuzatadi.

═══════════════════════════════════════
  PATTERN: Custom Hook Yaratish
═══════════════════════════════════════

Context-ni to'g'ridan-to'g'ri ishlatish o'rniga,
custom hook yaratish BEST PRACTICE:

  // context.ts
  const ThemeContext = createContext<ThemeContextType | null>(null)

  function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
      throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
  }

  // Ishlatish:
  const { theme, setTheme } = useTheme()

Foydalari:
- Null check avtomatik
- Import qilish oson
- TypeScript tiplar aniq
- Provider yo'q bo'lsa — aniq xato xabari

═══════════════════════════════════════
  QACHON ISHLATISH, QACHON ISHLATMASLIK
═══════════════════════════════════════

ISHLATISH KERAK:
  ✅ Tema (light/dark) — kam o'zgaradi
  ✅ Til (locale) — kam o'zgaradi
  ✅ Autentifikatsiya (user, login/logout) — kam o'zgaradi
  ✅ Feature flags
  ✅ Router ma'lumotlari

ISHLATMASLIK KERAK:
  ❌ Tez-tez o'zgaradigan ma'lumot (input value, mouse position)
  ❌ Server state (API dan kelgan data) — TanStack Query ishlatish
  ❌ Global state manager o'rniga — Zustand/Redux yaxshiroq
  ❌ Props drilling MUAMMO BO'LMASA — oddiy props yetarli

Qoida: Context = kam o'zgaradigan, ko'p joyda kerak bo'lgan ma'lumot uchun.`,
    codeExamples: [
      {
        title: 'Theme context — createContext + Provider + useContext',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// 1. Tip va Context yaratish
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// 2. Custom hook — null check bilan
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme ThemeProvider ichida ishlatilishi kerak!')
  }
  return context
}

// 3. Provider komponent
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 4. Ishlatish — istalgan chuqurlikda
function Header() {
  const { theme, toggleTheme } = useTheme()
  return (
    <header style={{
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
    }}>
      <h1>Saytim</h1>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? 'Yorug' rejim' : 'Qorong'u rejim'}
      </button>
    </header>
  )
}

// 5. App — Provider bilan o'rash
function App() {
  return (
    <ThemeProvider>
      <Header />
      {/* Boshqa komponentlar ham useTheme() ishlatishi mumkin */}
    </ThemeProvider>
  )
}`,
        description: `To'liq Theme Context pattern: createContext → Provider → useContext. Custom hook (useTheme) — null check va yaxshi xato xabari bilan. Bu pattern haqiqiy loyihalarda standart hisoblanadi.`,
      },
      {
        title: 'Auth context — user, login, logout',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak!')
  }
  return context
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  async function login(email: string, password: string) {
    // API ga so'rov
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setUser(data.user)
  }

  function logout() {
    setUser(null)
    // Token tozalash, redirect va boshqalar
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Ishlatish:
function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) return <a href="/login">Kirish</a>

  return (
    <nav>
      <span>Salom, {user?.name}!</span>
      <button onClick={logout}>Chiqish</button>
    </nav>
  )
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* Barcha child-lar useAuth() ishlatishi mumkin */}
    </AuthProvider>
  )
}`,
        description: `Auth context — login/logout boshqaruvi. user null bo'lsa — kirish tugmasi, bo'lmasa — foydalanuvchi ismi va chiqish. Haqiqiy loyihada token boshqaruvi, localStorage va redirect ham qo'shiladi.`,
      },
      {
        title: 'Multi-context — ikki alohida context',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useState, type ReactNode } from 'react'

// ===== THEME CONTEXT =====
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)
const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('ThemeProvider kerak')
  return ctx
}

// ===== LANGUAGE CONTEXT =====
interface LangContextType {
  lang: 'uz' | 'en' | 'ru'
  setLang: (lang: 'uz' | 'en' | 'ru') => void
  t: (key: string) => string
}

const translations: Record<string, Record<string, string>> = {
  uz: { greeting: 'Salom', goodbye: 'Xayr' },
  en: { greeting: 'Hello', goodbye: 'Goodbye' },
  ru: { greeting: 'Privet', goodbye: 'Poka' },
}

const LangContext = createContext<LangContextType | null>(null)
const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('LangProvider kerak')
  return ctx
}

// ===== PROVIDERLAR =====
function AppProviders({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [lang, setLang] = useState<'uz' | 'en' | 'ru'>('uz')

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const t = (key: string) => translations[lang][key] ?? key

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LangContext.Provider value={{ lang, setLang, t }}>
        {children}
      </LangContext.Provider>
    </ThemeContext.Provider>
  )
}

// ===== ISHLATISH =====
function Settings() {
  const { theme, toggleTheme } = useTheme()  // faqat tema
  const { lang, setLang, t } = useLang()     // faqat til

  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff' }}>
      <p>{t('greeting')}!</p>
      <button onClick={toggleTheme}>Tema: {theme}</button>
      <select value={lang} onChange={e => setLang(e.target.value as 'uz' | 'en' | 'ru')}>
        <option value="uz">O'zbekcha</option>
        <option value="en">English</option>
        <option value="ru">Russkiy</option>
      </select>
    </div>
  )
}`,
        description: `Multi-context pattern — har bir concern alohida context. Foyda: til o'zgarganda faqat useLang consumer-lari renderlanadi, tema consumer-lari RENDERLANMAYDI. Context-ni bo'lish — performance uchun eng yaxshi yechim.`,
      },
    ],
    interviewQA: [
      {
        question: 'Context vs Redux/Zustand — qachon nima ishlatish kerak?',
        answer: `Context — kam o'zgaradigan, keng tarqalgan ma'lumot uchun (tema, til, auth). Redux/Zustand — tez-tez o'zgaradigan, murakkab state uchun (server data, form state, UI state). Asosiy farq: Context value o'zgarganda BARCHA consumer-lar renderlanadi, Redux/Zustand esa selector orqali faqat KERAKLI qismni kuzatadi. Shuning uchun input value yoki mouse position uchun Context ishlatish — performance muammo. Zustand bunday holatlarda 10x tezroq.`,
      },
      {
        question: 'Context performance muammosi nima va qanday hal qilinadi?',
        answer: `Muammo: Provider value o'zgarganda BARCHA useContext(MyContext) ishlatgan komponentlar re-render bo'ladi — hatto ular faqat value ning bir qismini ishlatsa ham. Yechimlar: 1) Context-ni bo'lish — UserContext, ThemeContext alohida (eng samarali), 2) Provider value-ni useMemo bilan o'rash — keraksiz re-render oldini olish, 3) memo bilan child-larni o'rash — lekin Context o'zgarsa memo yordam bermaydi, 4) Zustand/Redux-ga o'tish — selector pattern bilan faqat kerakli qism kuzatiladi.`,
      },
      {
        question: 'createContext defaultValue qachon ishlatiladi?',
        answer: `defaultValue faqat bitta holatda ishlatiladi: komponent HECH QANDAY Provider ichida bo'lmaganda. Ya'ni Provider yo'q bo'lsa — defaultValue qaytariladi. Amalda bu juda kam bo'ladi chunki odatda Provider App darajasida qo'yiladi. Ko'p dasturchilar defaultValue ga null beradi va custom hook ichida null check qiladi — Provider yo'q bo'lsa aniq xato xabari chiqaradi. Bu yondoshuv yaxshiroq chunki xato tezda topiladi.`,
      },
      {
        question: 'Context nesting tartib muhimmi?',
        answer: `Ha, nesting tartibi muhim. Ichki Provider tashqi Provider-ni override qiladi. Masalan: <ThemeContext.Provider value="dark"> ichida <ThemeContext.Provider value="light"> bo'lsa — ichidagi komponentlar "light" oladi. Bu feature — tree ning bir qismi uchun boshqa qiymat berish mumkin. Lekin turli context-lar (ThemeContext, AuthContext) tartibi muhim emas — ular mustaqil. Faqat BIR XIL context nesting qilganda tartib ahamiyatli.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'context-api', label: 'Context API pattern' },
      { sectionId: 'theory-questions', topicId: 'props-drilling', label: 'Props Drilling muammosi' },
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Qachon nima ishlatish' },
      { sectionId: 'component-patterns', topicId: 'provider-pattern', label: 'Provider Pattern' },
    ],
  }
