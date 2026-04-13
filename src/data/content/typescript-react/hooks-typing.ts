import type { Topic } from '../../types'

export const hooksTyping: Topic = {
    id: 'hooks-typing',
    title: 'Hooks Typing',
    importance: 3,
    status: 'to-learn',
    description: 'useRef, useState, custom hook return type tipizatsiyasi',
    content: `React hook-larini TypeScript bilan to'g'ri tiplashtirish — har kunlik ish. Har bir hook o'ziga xos tipizatsiya pattern-iga ega.

═══════════════════════════════════════
  useState TIPIZATSIYA
═══════════════════════════════════════

Oddiy qiymatlar — avtomatik inference:
  const [count, setCount] = useState(0)        // number
  const [name, setName] = useState('')          // string
  const [active, setActive] = useState(false)   // boolean

Generic kerak bo'lganda:
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

Qoida: boshlang'ich qiymat tipni aniqlay olsa — generic KERAK EMAS.
null yoki bo'sh array bo'lsa — generic KERAK.

═══════════════════════════════════════
  useRef TIPIZATSIYA
═══════════════════════════════════════

2 xil useRef bor:

1. DOM element ref:
   const inputRef = useRef<HTMLInputElement>(null)
   // inputRef.current: HTMLInputElement | null
   // null bilan boshlanadi — element mount bo'lganda to'ladi

2. Mutable value ref (instance variable):
   const timerRef = useRef<number>(0)
   // timerRef.current: number
   // DOIM qiymatga ega — null EMAS

Farq: DOM ref — null bilan, mutable ref — qiymat bilan.

DOM element tiplari:
  useRef<HTMLInputElement>(null)
  useRef<HTMLDivElement>(null)
  useRef<HTMLButtonElement>(null)
  useRef<HTMLFormElement>(null)
  useRef<HTMLCanvasElement>(null)

═══════════════════════════════════════
  useReducer TIPIZATSIYA
═══════════════════════════════════════

  // Action tipini discriminated union bilan
  type Action =
    | { type: 'increment' }
    | { type: 'decrement' }
    | { type: 'set'; payload: number }

  interface State {
    count: number
  }

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'increment': return { count: state.count + 1 }
      case 'decrement': return { count: state.count - 1 }
      case 'set': return { count: action.payload }
    }
  }

  const [state, dispatch] = useReducer(reducer, { count: 0 })
  dispatch({ type: 'set', payload: 10 })  // ✅
  dispatch({ type: 'reset' })              // ❌ 'reset' yo'q!

═══════════════════════════════════════
  CUSTOM HOOK RETURN TYPE
═══════════════════════════════════════

Tuple qaytarish (useState kabi):
  function useToggle(initial = false): [boolean, () => void] {
    const [value, setValue] = useState(initial)
    const toggle = useCallback(() => setValue(v => !v), [])
    return [value, toggle]
  }
  const [isOpen, toggleOpen] = useToggle()

Object qaytarish (ko'p qiymat):
  function useAuth() {
    // ...
    return { user, isLoading, login, logout }
  }
  const { user, login } = useAuth()

Qoida:
  2 ta qiymat → tuple: [value, setter]
  3+ ta qiymat → object: { value, setter, helper }

═══════════════════════════════════════
  useCallback va useMemo TIPIZATSIYA
═══════════════════════════════════════

Ko'pincha avtomatik inference yetarli:
  const memoized = useMemo(() => items.filter(i => i.active), [items])
  // tip: Item[] (avtomatik)

  const handler = useCallback((id: string) => {
    deleteItem(id)
  }, [])
  // tip: (id: string) => void (avtomatik)

Generic kerak bo'lganda:
  const data = useMemo<ProcessedData>(() => {
    return processData(rawData)
  }, [rawData])`,
    codeExamples: [
      {
        title: 'Hook-lar tipizatsiyasi — barcha pattern-lar',
        language: 'tsx',
        code: `import { useState, useRef, useReducer, useCallback, useEffect } from 'react'

// === useState ===
// Avtomatik inference
const [count, setCount] = useState(0)             // number
const [name, setName] = useState('Ali')            // string

// Generic kerak
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Item[]>([])
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

// === useRef ===
// DOM ref — null bilan boshlash
const inputRef = useRef<HTMLInputElement>(null)
const divRef = useRef<HTMLDivElement>(null)

// Ishlatish
function focusInput() {
  inputRef.current?.focus()  // null check kerak (?)
}

// Mutable ref — qiymat bilan boshlash
const renderCount = useRef(0)
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

useEffect(() => {
  renderCount.current += 1  // null check KERAK EMAS
})

// === useReducer ===
type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number }

interface CounterState {
  count: number
  history: number[]
}

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1, history: [...state.history, state.count + 1] }
    case 'decrement':
      return { ...state, count: state.count - 1, history: [...state.history, state.count - 1] }
    case 'reset':
      return { count: 0, history: [] }
    case 'set':
      return { ...state, count: action.payload, history: [...state.history, action.payload] }
  }
}

const [state, dispatch] = useReducer(counterReducer, { count: 0, history: [] })`,
        description: 'useState — oddiy qiymatlar avtomatik, null/union uchun generic. useRef — DOM ref null bilan, mutable ref qiymat bilan. useReducer — discriminated union action.',
      },
      {
        title: 'Custom hook — to\'g\'ri tipizatsiya',
        language: 'tsx',
        code: `import { useState, useEffect, useCallback } from 'react'

// 1. Tuple return — useState kabi
function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle]  // tuple
}

const [isOpen, toggleOpen] = useToggle()
// isOpen: boolean, toggleOpen: () => void

// 2. Object return — ko'p qiymat
interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xatolik')
    } finally {
      setIsLoading(false)
    }
  }, [url])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

// Generic avtomatik aniqlanadi
const { data: users, isLoading } = useFetch<User[]>('/api/users')
// users: User[] | null

// 3. as const tuple (aniq tiplar uchun)
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  const setAndSave = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      localStorage.setItem(key, JSON.stringify(resolved))
      return resolved
    })
  }, [key])

  return [value, setAndSave] as const
  // as const — tuple sifatida qaytaradi (array emas)
}

const [theme, setTheme] = useLocalStorage('theme', 'light')
// theme: string, setTheme: (v: string | (prev: string) => string) => void`,
        description: 'Custom hook return: tuple ([value, setter] — 2 ta qiymat uchun, as const bilan), object ({data, isLoading} — ko\'p qiymat uchun). Generic <T> — turli tiplar bilan ishlash.',
      },
    ],
    interviewQA: [
      {
        question: 'useState-da qachon generic kerak, qachon kerak emas?',
        answer: `Generic KERAK EMAS: boshlang'ich qiymat tipni aniqlay olsa — useState(0), useState(""), useState(false). TypeScript avtomatik inference qiladi. Generic KERAK: null bo'lishi mumkin — useState<User | null>(null), bo'sh array — useState<Item[]>([]), union literal — useState<"idle" | "loading">("idle"). Qoida: TypeScript o'zi to'g'ri tip chiqara olmasa — generic yozing.`,
      },
      {
        question: 'useRef-da DOM ref va mutable ref farqi nima?',
        answer: `DOM ref: useRef<HTMLInputElement>(null) — null bilan boshlanadi, element mount bo'lganda React o'zi to'ldiradi. current: HTMLInputElement | null — DOIM null check kerak (?. yoki if). Mutable ref: useRef<number>(0) — qiymat bilan boshlanadi, current: number — null check kerak EMAS. TypeScript farqlaydi: null bilan boshlansa — RefObject (readonly current), qiymat bilan boshlansa — MutableRefObject (writable current).`,
      },
      {
        question: 'Custom hook-dan tuple va object qaytarish farqi nima?',
        answer: `Tuple: [value, setter] — 2 ta qiymat uchun yaxshi, useState kabi. Destructuring da nom o'zgartirish oson: [isOpen, toggle]. as const kerak — aks holda TypeScript (boolean | () => void)[] deb o'ylaydi. Object: {data, isLoading, error} — 3+ qiymat uchun, nom aniq. Destructuring da nom o'zgartirish uchun : kerak: {data: users}. Qoida: 2 ta → tuple, 3+ → object.`,
      },
      {
        question: 'useReducer-da action tipini qanday yozish kerak?',
        answer: `Discriminated union — eng yaxshi pattern: type Action = | {type: "increment"} | {type: "set"; payload: number}. Har action-ning payload-i aniq tiplanadi. switch-da TypeScript auto-complete beradi, exhaustiveness check mumkin. Reducer funksiya: (state: State, action: Action): State — qaytarish tipini aniq yozish xavfsizroq. dispatch({type: "unknown"}) — TypeScript XATO beradi. Enum o'rniga string literal union tavsiya etiladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks' },
      { sectionId: 'react-core', topicId: 'use-ref', label: 'useRef tiplar' },
      { sectionId: 'react-core', topicId: 'use-state', label: 'useState tiplar' },
    ],
  }
