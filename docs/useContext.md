# useContext — global ma'lumotlarni komponentlar orasida ulashish

## useContext nima?

`useContext` — React hook-i, **prop drilling** siz ma'lumotni istalgan chuqurlikdagi komponentga uzatadi.

Vue-dagi `provide / inject` ning to'g'ridan-to'g'ri analogi.

```tsx
import { createContext, useContext } from 'react'

// 1. Context yaratish
const MyContext = createContext(defaultValue)

// 2. Provider bilan o'rash (yuqorida)
<MyContext.Provider value={realValue}>
    <App />
</MyContext.Provider>

// 3. Istalgan joyda olish (pastda)
const value = useContext(MyContext)
```

---

## Muammo — Prop Drilling

Ma'lumotni chuqur komponentga uzatish uchun **har bir oraliq komponent** orqali prop berish kerak:

```tsx
// MUAMMO — theme 4 ta komponent orqali uzatiladi
function App() {
    const [theme, setTheme] = useState('light')
    return <Layout theme={theme} />           // 1. App → Layout
}
function Layout({ theme }) {
    return <Sidebar theme={theme} />           // 2. Layout → Sidebar
}
function Sidebar({ theme }) {
    return <NavItem theme={theme} />           // 3. Sidebar → NavItem
}
function NavItem({ theme }) {
    return <span className={theme}>Link</span> // 4. Faqat shu yerda kerak
}
```

Layout va Sidebar `theme` ni ishlatmaydi — faqat uzatadi. Bu **prop drilling**.

## Yechim — useContext

```tsx
// YAXSHI — faqat kerakli joyda olish
function App() {
    return (
        <ThemeProvider>       {/* Yuqorida beradi */}
            <Layout />
        </ThemeProvider>
    )
}
function Layout() {
    return <Sidebar />         // theme haqida bilmaydi
}
function Sidebar() {
    return <NavItem />         // theme haqida bilmaydi
}
function NavItem() {
    const { theme } = useTheme()  // Faqat kerakli joyda oladi
    return <span className={theme}>Link</span>
}
```

---

## Vue bilan solishtirish

```js
// Vue — provide (yuqorida)
const theme = ref('light')
provide('theme', theme)

// Vue — inject (pastda, istalgan chuqurlikda)
const theme = inject('theme')
```

```tsx
// React — createContext + Provider (yuqorida)
const ThemeContext = createContext('light')
<ThemeContext.Provider value={theme}>

// React — useContext (pastda, istalgan chuqurlikda)
const theme = useContext(ThemeContext)
```

| | React `useContext` | Vue `provide/inject` |
|---|---|---|
| Yaratish | `createContext(default)` | — |
| Berish | `<Context.Provider value={...}>` | `provide('key', value)` |
| Olish | `useContext(Context)` | `inject('key')` |
| Tipizatsiya | Context type-da | `InjectionKey<T>` bilan |
| Reactive | Ha (Provider qayta render → children yangilanadi) | Ha (ref/reactive bersa) |
| Default qiymat | `createContext(default)` | `inject('key', default)` |

---

## 3 ta bosqich — batafsil

### 1-bosqich: Context yaratish

```tsx
import { createContext } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

// null — default qiymat (Provider yo'q bo'lganda)
const ThemeContext = createContext<ThemeContextType | null>(null)
```

### 2-bosqich: Provider yaratish

Provider — context qiymatini beruvchi komponent:

```tsx
import { useState, useCallback } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
```

Vue analogi:
```js
// Vue — provide
const theme = ref('light')
const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
}
provide('theme', { theme, toggleTheme })
```

### 3-bosqich: Custom hook yaratish

Provider-dan qiymatni olish uchun custom hook yoziladi:

```tsx
export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
```

**Nega custom hook kerak?**
1. Har safar `useContext(ThemeContext)` yozmaslik uchun — faqat `useTheme()`
2. Provider yo'q bo'lganda **xato beradi** — debug oson
3. TypeScript `null` tekshirishdan xalos bo'ladi

Vue analogi:
```js
// Vue — composable
export function useTheme() {
    const theme = inject('theme')
    if (!theme) throw new Error('...')
    return theme
}
```

---

## Loyihadagi misol — ThemeProvider

### Provider fayli

```tsx
// src/app/providers/ThemeProvider.tsx
import { createContext, useContext, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// Custom hook — istalgan komponentda ishlatish uchun
export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }, [])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}
```

### App-da o'rash

```tsx
// src/app/App.tsx
import ThemeProvider from './providers/ThemeProvider'
import RouterProvider from './providers/RouterProvider'

function App() {
    return (
        <ThemeProvider>
            <RouterProvider />
        </ThemeProvider>
    )
}
```

### Istalgan komponentda ishlatish

```tsx
// src/widgets/header/Header.tsx
import { useTheme } from '../../app/providers/ThemeProvider'

export default function Header() {
    const { theme, toggleTheme } = useTheme()

    return (
        <header>
            <button onClick={toggleTheme}>
                {theme === 'light' ? 'Dark' : 'Light'}
            </button>
        </header>
    )
}
```

**Muhim:** Header `theme` va `toggleTheme` ni **prop orqali olmaydi** — context orqali oladi. App → Layout → Header orasida hech qanday prop uzatish yo'q.

---

## Bir nechta Context — Provider nesting

Katta ilovalarda bir nechta context bo'ladi:

```tsx
// src/app/App.tsx
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <QueryProvider>
                    <RouterProvider />
                </QueryProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
```

Vue-da ham xuddi shunday:
```js
// Vue main.ts
app.use(pinia)           // state
app.use(router)          // routing
app.provide('theme', theme)  // theme
```

---

## Context + useReducer — murakkab state

Oddiy qiymatlar uchun `useState` yetarli. Murakkab state uchun `useReducer` bilan birga ishlatiladi:

```tsx
// Auth context — login, logout, user ma'lumoti

interface AuthState {
    user: User | null
    isAuthenticated: boolean
}

type AuthAction =
    | { type: 'LOGIN'; user: User }
    | { type: 'LOGOUT' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.user, isAuthenticated: true }
        case 'LOGOUT':
            return { user: null, isAuthenticated: false }
    }
}

const AuthContext = createContext<{
    state: AuthState
    dispatch: React.Dispatch<AuthAction>
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
    })

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

// Ishlatish:
const { state, dispatch } = useAuth()
dispatch({ type: 'LOGIN', user: { name: 'Ali' } })
dispatch({ type: 'LOGOUT' })
```

Vue analogi: Bu Pinia store-ga o'xshaydi:
```js
// Vue — Pinia
export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const isAuthenticated = computed(() => !!user.value)

    function login(userData) { user.value = userData }
    function logout() { user.value = null }

    return { user, isAuthenticated, login, logout }
})
```

---

## Context performance muammosi

**MUHIM:** Context qiymati o'zgarganda — **barcha** `useContext` ishlatgan komponentlar qayta render bo'ladi.

```tsx
// MUAMMO — theme o'zgarganda BARCHA komponentlar qayta render
const AppContext = createContext({
    theme: 'light',
    user: null,
    language: 'uz',
    notifications: [],
})

// theme o'zgardi → user, language, notifications ishlatgan komponentlar HAM qayta render!
```

### Yechim 1: Context-ni ajratish

```tsx
// YAXSHI — har biri alohida
const ThemeContext = createContext(...)
const AuthContext = createContext(...)
const LanguageContext = createContext(...)

// theme o'zgardi → faqat ThemeContext ishlatganlar qayta render
```

### Yechim 2: useMemo bilan value keshlash

```tsx
// NOTO'G'RI ❌ — har renderda yangi obyekt
<ThemeContext.Provider value={{ theme, toggleTheme }}>
// { theme, toggleTheme } har renderda yangi reference → barcha children qayta render

// TO'G'RI ✅ — useMemo bilan
const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
<ThemeContext.Provider value={value}>
```

---

## Context vs Global State (Zustand/Redux)

| | Context | Zustand / Redux |
|---|---|---|
| O'rnatish | React ichida, kutubxona kerak emas | Qo'shimcha paket |
| Performance | O'zgarganda **barcha** subscriber qayta render | Faqat **ishlatilgan** qism qayta render |
| DevTools | Yo'q | Bor (Redux DevTools) |
| Murakkab state | useReducer bilan mumkin lekin ko'p boilerplate | Tayyor |
| Middleware | Yo'q | Bor (thunk, saga, persist) |
| Qachon ishlatish | Kam o'zgaradigan: theme, locale, auth | Tez-tez o'zgaradigan: cart, filters, form |

Vue analogi: Context ≈ provide/inject, Zustand ≈ Pinia

**Qoida:** Kam o'zgaradigan, oddiy qiymatlar → Context. Tez-tez o'zgaradigan, murakkab state → Zustand/Redux.

---

## FSD-da Context qayerga qo'yiladi

```
src/
  app/
    providers/
      ThemeProvider.tsx    ← Context + Provider + useTheme hook
      AuthProvider.tsx     ← Auth context
      index.ts
    App.tsx                ← Providerlar bilan o'raladi
```

Context provider **app** qatlamida yaratiladi, custom hook istalgan joyda import qilinadi.

---

## Suhbatda so'raladigan savollar

### 1. "useContext nima va qanday ishlaydi?"

Context — komponentlar daraxtida ma'lumotni prop-siz uzatish mexanizmi. `createContext` → `Provider` bilan berish → `useContext` bilan olish. Eng yaqin Provider-dan qiymatni oladi.

### 2. "useContext va prop drilling farqi?"

Prop drilling — har oraliq komponent orqali prop uzatish. useContext — Provider-dan to'g'ridan-to'g'ri olish, oraliq komponentlar haqida bilmaydi. 2-3 daraja bo'lsa props yetarli, 3+ bo'lsa context ishlatish kerak.

### 3. "Context va Redux/Zustand farqi?"

Context qiymat o'zgarganda barcha subscriber qayta render bo'ladi — performance muammo. Redux/Zustand faqat ishlatilgan qismni yangilaydi. Context kam o'zgaradigan narsalar uchun (theme, auth), Redux/Zustand tez-tez o'zgaradigan narsalar uchun (cart, filters).

### 4. "Nega custom hook yozish kerak?"

3 sabab: 1) Har safar `useContext(MyContext)` yozmaslik. 2) Provider yo'q bo'lganda aniq xato beradi. 3) TypeScript null tekshirishdan xalos qiladi.

### 5. "Context qiymati qachon yangilanadi?"

Provider-ning `value` prop-i o'zgarganda. Value o'zgardi → barcha `useContext` ishlatgan komponentlar qayta render bo'ladi. Shuning uchun value-ni `useMemo` bilan keshlash muhim.

### 6. "Vue provide/inject dan farqi?"

Vue-da `provide` funksiya, `inject` funksiya — string kalit bilan. React-da `createContext` obyekt yaratadi, `Provider` komponent. Vue-da reactive ref bersa avtomatik yangilanadi. React-da Provider qayta render bo'lganda yangilanadi.

### 7. "Bir nechta context qanday tashkil qilinadi?"

Provider-larni nesting qilish:
```tsx
<ThemeProvider>
    <AuthProvider>
        <App />
    </AuthProvider>
</ThemeProvider>
```
Har bir context alohida fayl, alohida custom hook. Katta loyihalarda provider-larni birlashtiruvchi `AppProviders` komponent yoziladi.

---

## Xulosa

| Xususiyat | React `useContext` | Vue `provide/inject` |
|---|---|---|
| Yaratish | `createContext(default)` | — |
| Berish | `<Context.Provider value={}>` | `provide('key', value)` |
| Olish | `useContext(Context)` | `inject('key')` |
| Kalit | Context obyekt | String yoki InjectionKey |
| Custom hook | `useTheme()` — qo'lda yoziladi | `useTheme()` — composable |
| Performance | Barcha subscriber qayta render | Faqat bog'liq qism |
| FSD joylashuvi | `app/providers/` | `app/providers/` |
