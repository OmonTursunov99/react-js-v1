import type { Topic } from '../../types'

export const customHooks: Topic = {
    id: `custom-hooks`,
    title: `Custom Hooks`,
    importance: 3,
    status: `to-learn`,
    description: `O'z hooklarini yozish, logikani ajratish`,
    content: `Custom Hooks — React-da logikani qayta ishlatishning eng zamonaviy va ENG KO'P ishlatiladigan usuli. "use" bilan boshlanadigan oddiy JavaScript funksiya bo'lib, ichida boshqa hook-lar chaqiriladi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Custom Hook — "use" bilan boshlanadigan oddiy
JavaScript funksiya. Ichida useState, useEffect va
boshqa hook-lar ishlatiladi:

  function useToggle(initial = false) {
    const [value, setValue] = useState(initial)
    const toggle = () => setValue(v => !v)
    return [value, toggle] as const
  }

Bu oddiy funksiya — lekin ichida hook-lar bor,
shuning uchun u "custom hook".

═══════════════════════════════════════
  QOIDALAR
═══════════════════════════════════════

1) Nomi "use" bilan boshlaSIN:
   useToggle, useFetch, useLocalStorage
   React "use" prefiksini ko'rsa, hook qoidalarini
   tekshiradi (eslint-plugin-react-hooks)

2) Ichida boshqa hook-lar chaqirish mumkin:
   useState, useEffect, useRef, boshqa custom hook-lar

3) Top level-da chaqirish:
   // TO'G'RI:
   function Component() {
     const [value, toggle] = useToggle()
   }

   // NOTO'G'RI:
   function Component() {
     if (condition) {
       const [value, toggle] = useToggle() // ← XATO!
     }
   }

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

1) Logikani qayta ishlatish (DRY):
   useLocalStorage — har qanday komponentda
   localStorage bilan ishlash

2) Komponentni soddalashtirish:
   Murakkab logikani hook-ga chiqarib, komponentni
   faqat UI ga aylantirish

3) Testing osonlashadi:
   Hook-ni alohida test qilish mumkin
   (renderHook utility)

4) Separation of concerns:
   UI logikasi — komponentda
   Business logikasi — hook-da

═══════════════════════════════════════
  POPULAR CUSTOM HOOKS
═══════════════════════════════════════

  useLocalStorage  — localStorage bilan sinxron state
  useDebounce      — qiymatni kechiktirish (search input)
  useFetch         — API so'rov (loading, error, data)
  useMediaQuery    — ekran o'lchamini kuzatish
  useOnClickOutside — tashqi click-ni ushlash (dropdown)
  usePrevious      — oldingi render qiymatini saqlash
  useToggle        — boolean toggle (modal ochish/yopish)
  useInterval      — setInterval hook versiyasi
  useEventListener — event listener hook versiyasi

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

Return type annotatsiya:
  function useToggle(initial: boolean): [boolean, () => void]

Generics:
  function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void]

as const:
  return [value, toggle] as const
  // [boolean, () => void] emas, [false, () => void] qaytaradi

═══════════════════════════════════════
  COMPOSITION
═══════════════════════════════════════

Custom hook ichida boshqa custom hook chaqirish:

  function useAuth() {
    const user = useFetch('/api/me')        // boshqa custom hook
    const [token] = useLocalStorage('token') // yana boshqa
    return { user, token, isLoggedIn: !!token }
  }

Hook-lar COMPOSITION orqali murakkab logika yaratadi —
xuddi komponentlar composition orqali murakkab UI yasagandek.`,
    codeExamples: [
      {
        title: `useToggle — oddiy toggle hook`,
        language: `tsx`,
        code: `import { useState, useCallback } from 'react'

// Custom hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse }
}

// Ishlatish — Modal
function ModalExample() {
  const modal = useToggle()

  return (
    <div>
      <button onClick={modal.setTrue}>Modalni ochish</button>

      {modal.value && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2>Modal oynasi</h2>
            <p>Bu modal kontent</p>
            <button onClick={modal.setFalse}>Yopish</button>
          </div>
        </div>
      )}
    </div>
  )
}

// Ishlatish — Dark mode toggle
function ThemeToggle() {
  const darkMode = useToggle(false)

  return (
    <div className={darkMode.value ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <button onClick={darkMode.toggle}>
        {darkMode.value ? '☀️ Yorug' : '🌙 Qorong\\'u'} rejim
      </button>
    </div>
  )
}`,
        description: `useToggle — eng oddiy custom hook. Boolean state + toggle/setTrue/setFalse funksiyalari. Modal, dropdown, dark mode — har qanday ochish/yopish logikasida qayta ishlatiladi.`,
      },
      {
        title: `useLocalStorage — localStorage bilan sinxron state`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. Lazy initialization — localStorage-dan o'qish
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  // 2. State o'zgarganda localStorage-ga yozish
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('localStorage yozishda xato:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
}

// Ishlatish
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'uz')
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16)

  return (
    <div>
      <h2>Sozlamalar</h2>

      <label>
        Tema:
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="light">Yorug'</option>
          <option value="dark">Qorong'u</option>
        </select>
      </label>

      <label>
        Til:
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="uz">O'zbekcha</option>
          <option value="en">Inglizcha</option>
        </select>
      </label>

      <label>
        Shrift hajmi: {fontSize}px
        <input
          type="range"
          min={12}
          max={24}
          value={fontSize}
          onChange={e => setFontSize(Number(e.target.value))}
        />
      </label>

      <p>Sahifani yangilang — sozlamalar saqlanadi!</p>
    </div>
  )
}`,
        description: `useLocalStorage — useState + localStorage sinxronizatsiyasi. Generic tip <T> bilan har qanday qiymatni saqlash mumkin. Sahifa yangilanganda state tiklanadi.`,
      },
      {
        title: `useDebounce — qiymatni kechiktirish`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Delay vaqtdan keyin yangilash
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Har safar value o'zgarganda oldingi timer-ni tozalash
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Ishlatish — qidiruv input
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500) // 500ms kechiktirish
  const [results, setResults] = useState<string[]>([])

  // API so'rov faqat debouncedQuery o'zgarganda
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    // Fetch simulation
    const fetchResults = async () => {
      const response = await fetch(
        \`/api/search?q=\${encodeURIComponent(debouncedQuery)}\`
      )
      const data = await response.json()
      setResults(data)
    }

    fetchResults()
  }, [debouncedQuery]) // query emas, debouncedQuery!

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Qidiruv..."
      />
      <p>Qidirilmoqda: {debouncedQuery || '...'}</p>
      <ul>
        {results.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  )
}`,
        description: `useDebounce — har harf bosilganda API so'rov jo'natish o'rniga, foydalanuvchi yozishni TO'XTATGANDAN keyin (500ms) bitta so'rov jo'natadi. Performance uchun muhim.`,
      },
      {
        title: `useFetch — API fetch hook`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchIndex, setFetchIndex] = useState(0)

  const refetch = () => setFetchIndex(i => i + 1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        return res.json()
      })
      .then((json: T) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    // Cleanup — unmount bo'lsa state yangilamaslik
    return () => { cancelled = true }
  }, [url, fetchIndex])

  return { data, loading, error, refetch }
}

// Ishlatish
interface User {
  id: number
  name: string
  email: string
}

function UserProfile({ userId }: { userId: number }) {
  const { data: user, loading, error, refetch } = useFetch<User>(
    \`https://jsonplaceholder.typicode.com/users/\${userId}\`
  )

  if (loading) return <p>Yuklanmoqda...</p>
  if (error) return (
    <div>
      <p>Xato: {error}</p>
      <button onClick={refetch}>Qayta urinish</button>
    </div>
  )
  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={refetch}>Yangilash</button>
    </div>
  )
}`,
        description: `useFetch — loading, error, data, refetch bilan to'liq API hook. cancelled flag race condition-ni oldini oladi. Generic <T> bilan har qanday API javobini tipizatsiya qilish mumkin.`,
      },
    ],
    interviewQA: [
      {
        question: `Custom hook nima va qanday yaratiladi?`,
        answer: `Custom hook — "use" prefiksi bilan boshlanadigan oddiy JavaScript funksiya bo'lib, ichida boshqa React hook-lar (useState, useEffect, useRef va boshqa custom hook-lar) chaqiriladi. Yaratish uchun: 1) Funksiya nomi "use" bilan boshlansIN — useToggle, useFetch. 2) Ichida hook-lar chaqiring. 3) Kerakli qiymat va funksiyalarni return qiling. Custom hook logikani komponentdan AJRATADI — komponent faqat UI bilan shug'ullanadi, business logika hook-da.`,
      },
      {
        question: `Nima uchun "use" prefiksi kerak?`,
        answer: `"use" prefiksi ikki sabab uchun kerak: 1) React va ESLint uchun signal — eslint-plugin-react-hooks "use" bilan boshlangan funksiyani hook deb biladi va Rules of Hooks-ni tekshiradi (shart ichida chaqirmaslik, loop ichida chaqirmaslik). "use" siz bu tekshiruvlar ishlamaydi. 2) Dasturchilar uchun signal — kod o'qiyotgan kishi "use" ko'rsa, bu funksiya ichida hook-lar borligini va uni faqat komponent yoki boshqa hook ichida chaqirish kerakligini biladi.`,
      },
      {
        question: `Custom hook vs utility function farqi nima?`,
        answer: `Custom hook ichida React hook-lar (useState, useEffect, useRef) chaqiriladi — shuning uchun u React lifecycle-ga BOG'LIQ va faqat komponent yoki boshqa hook ichida chaqirilishi mumkin. Utility function — oddiy funksiya, hook chaqirmaydi, istalgan joyda chaqirish mumkin. Masalan: formatDate() — utility, useDebounce() — custom hook. Agar funksiya ichida hech qanday React hook bo'lmasa, "use" prefiks qo'yish SHART EMAS va u utility function bo'ladi.`,
      },
      {
        question: `Custom hook-larni qanday test qilish mumkin?`,
        answer: `Custom hook-lar @testing-library/react dan renderHook utility bilan test qilinadi. renderHook(() => useToggle()) — hook-ni alohida render qiladi. result.current — hozirgi hook qiymati. act(() => { result.current.toggle() }) — hook funksiyalarini chaqirish. Hook-larni test qilish komponentni test qilishdan OSONROQ — UI yo'q, faqat logika. Shuning uchun logikani hook-ga chiqarish testing uchun ham foydali. Integration test uchun hook-ni ishlatadigan oddiy komponent yozish ham mumkin.`,
      },
    ],
    relatedTopics: [
      { sectionId: `theory-questions`, topicId: `rules-of-hooks`, label: `Rules of Hooks` },
      { sectionId: `typescript-react`, topicId: `hooks-typing`, label: `Hook tipizatsiyasi` },
      { sectionId: `component-patterns`, topicId: `render-props`, label: `Render Props (eski usul)` },
    ],
  }
