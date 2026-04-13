import type { Topic } from '../../types'

export const providerPattern: Topic = {
    id: `provider-pattern`,
    title: `Provider Pattern`,
    importance: 2,
    status: `to-learn`,
    description: `Context + Provider — global ma'lumot ulashish pattern`,
    content: `Provider Pattern — Context + Provider + custom hook orqali global ma'lumotni komponentlar daraxtida ulashish. Bu React-dagi eng keng tarqalgan state sharing pattern.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Context + Provider + custom hook — global ma'lumot ulashish:

  1. createContext — context yaratish
  2. Provider component — state + logic saqlash
  3. Custom hook — useContext wrapper + null check

Bu pattern barcha katta React ilovalarida ishlatiladi:
  - Auth (foydalanuvchi ma'lumotlari)
  - Theme (dark/light rejim)
  - Toast/Notification
  - Language/i18n
  - Shopping Cart

═══════════════════════════════════════
  PATTERN
═══════════════════════════════════════

1) Context yaratish:
   const MyContext = createContext<MyContextType | null>(null)

2) Provider component (state + logic):
   function MyProvider({ children }) {
     const [state, setState] = useState(...)
     // Logic funksiyalar
     const value = { state, action1, action2 }
     return (
       <MyContext.Provider value={value}>
         {children}
       </MyContext.Provider>
     )
   }

3) Custom hook (useContext wrapper + null check):
   function useMyContext() {
     const ctx = useContext(MyContext)
     if (!ctx) {
       throw new Error('useMyContext must be used within MyProvider')
     }
     return ctx
   }

Bu 3 qadam DOIM birga ishlatiladi. Custom hook null
check qiladi — Provider yo'q bo'lsa, tushunarli xato
beradi (runtime-da debug oson).

═══════════════════════════════════════
  MULTIPLE PROVIDERS
═══════════════════════════════════════

Har bir concern uchun alohida Provider:
  ThemeProvider — tema
  AuthProvider — autentifikatsiya
  ToastProvider — bildirishnomalar
  CartProvider — savdo savati

App-da nesting:
  <ThemeProvider>
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  </ThemeProvider>

Bu "Provider hell" deyiladi — ko'p nesting.
Yechimlar:
  1. composeProviders utility funksiya
  2. Zustand/Jotai ishlatish (Context emas)
  3. Har bir Provider faqat kerakli joyda`,
    codeExamples: [
      {
        title: `ToastProvider — toast notification context + provider + hook`,
        language: `tsx`,
        code: `import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// 1. Tiplar
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: number) => void
}

// 2. Context yaratish (null — Provider yo'q bo'lganda)
const ToastContext = createContext<ToastContextType | null>(null)

// 3. Custom hook — null check bilan
function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within <ToastProvider>')
  }
  return context
}

// 4. Provider component — state + logic
let toastId = 0

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])

    // 3 sekunddan keyin avtomatik o'chirish
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast UI — portal bilan qilish ham mumkin */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={\`px-4 py-3 rounded shadow-lg text-white flex justify-between items-center min-w-[300px] \${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }\`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 text-white/70 hover:text-white"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// 5. Ishlatish
function SaveButton() {
  const { addToast } = useToast()

  const handleSave = () => {
    // ... save logic
    addToast('Muvaffaqiyatli saqlandi!', 'success')
  }

  const handleError = () => {
    addToast('Xatolik yuz berdi!', 'error')
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
        Saqlash
      </button>
      <button onClick={handleError} className="bg-red-500 text-white px-4 py-2 rounded">
        Xato test
      </button>
    </div>
  )
}

// App-da Provider o'rash
function App() {
  return (
    <ToastProvider>
      <div className="p-8">
        <h1>Mening ilovam</h1>
        <SaveButton />
        {/* Istalgan nested komponent useToast() chaqira oladi */}
      </div>
    </ToastProvider>
  )
}

export { ToastProvider, useToast }`,
        description: `To'liq Provider pattern: 1) Context yaratish, 2) Provider component (state + auto-dismiss logic), 3) Custom hook (null check). Har qanday nested komponent useToast() bilan toast chiqara oladi — prop drilling yo'q.`,
      },
    ],
    interviewQA: [
      {
        question: `Provider pattern nima?`,
        answer: `Provider pattern — Context API asosidagi ma'lumot ulashish pattern. Uch qismdan iborat: 1) createContext — context yaratish. 2) Provider component — state va logic saqlaydi, children-ni Context.Provider bilan o'raydi. 3) Custom hook — useContext wrapper + null check (Provider yo'q bo'lsa tushunarli xato beradi). Bu pattern prop drilling muammosini hal qiladi — har qanday darajadagi komponent to'g'ridan-to'g'ri ma'lumotga kiradi. Auth, Theme, Toast, Cart kabi global state uchun ishlatiladi.`,
      },
      {
        question: `Ko'p Provider nesting muammosi va yechimi nima?`,
        answer: `Ko'p Provider "Provider hell" yaratadi: <ThemeProvider><AuthProvider><ToastProvider><CartProvider><App/></...>. Muammolar: 1) O'qish qiyin, 2) Har bir Provider re-render qilishi mumkin, 3) Provider tartib muhim bo'lishi mumkin. Yechimlar: 1) composeProviders utility: function composeProviders(...providers) — flatten qiladi. 2) Provider-larni faqat KERAKLI joyda qo'yish — CartProvider faqat shop sahifasida. 3) Zustand/Jotai ishlatish — Context-siz global state, Provider kerak emas. 4) Single AppProvider — barcha context-larni birlashtirish.`,
      },
    ],
    relatedTopics: [
      { sectionId: `react-core`, topicId: `use-context`, label: `useContext` },
      { sectionId: `state-management`, topicId: `context-api`, label: `Context API` },
      { sectionId: `component-patterns`, topicId: `compound-components`, label: `Compound Components` },
    ],
  }
