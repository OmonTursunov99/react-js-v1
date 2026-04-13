import type { Topic } from '../../../types'

export const zustand: Topic = {
    id: 'zustand',
    title: 'Zustand',
    importance: 2,
    status: 'to-learn',
    description: 'create, selector pattern, persist middleware',
    content: `Zustand — minimalistik, tez va sodda state management kutubxonasi. Redux-ga alternativa sifatida mashxur. Bundle hajmi ~1KB (gzipped). Provider/wrapper KERAK EMAS.

═══════════════════════════════════════
  NIMA UCHUN ZUSTAND?
═══════════════════════════════════════

Redux bilan taqqoslash:
  Redux:   configureStore + createSlice + Provider + useSelector + dispatch
  Zustand: create + hook = tamom

Afzalliklari:
  ✅ Minimal boilerplate — store = hook
  ✅ Provider kerak emas (React tree dan tashqarida ishlaydi)
  ✅ Bundle hajmi kichik (~1KB vs Redux ~11KB)
  ✅ TypeScript bilan yaxshi integratsiya
  ✅ Middleware tizimi (persist, devtools, immer)
  ✅ React tashqarisida ham ishlatish mumkin (vanilla JS)

═══════════════════════════════════════
  ASOSIY TUSHUNCHALAR
═══════════════════════════════════════

Zustand store — bu oddiy hook:

  const useStore = create((set, get) => ({
    count: 0,
    increment: () => set(state => ({ count: state.count + 1 })),
  }))

- create() — store yaratadi, hook qaytaradi
- set() — state yangilash (shallow merge)
- get() — hozirgi state-ni o'qish (action ichida)

═══════════════════════════════════════
  set() QANDAY ISHLAYDI
═══════════════════════════════════════

set() SHALLOW MERGE qiladi (spread kabi):

  set({ count: 5 })
  // { count: 5, name: 'Ali' } — name saqlanadi

Agar nested object bo'lsa, o'zingiz spread qilishingiz kerak:

  set(state => ({
    user: { ...state.user, name: 'Ali' }
  }))

Yoki immer middleware ishlatish mumkin.

═══════════════════════════════════════
  SELECTOR PATTERN (MUHIM!)
═══════════════════════════════════════

NOTO'G'RI — butun store subscribe bo'ladi:
  const store = useStore()  // HAR BIR o'zgarishda re-render

TO'G'RI — faqat kerakli qismni olish:
  const count = useStore(s => s.count)  // faqat count o'zgarganda

Bu performance uchun juda muhim!
Zustand selector-ni === bilan taqqoslaydi.

Object qaytarsa:
  // Har safar yangi object — har doim re-render
  const { name, age } = useStore(s => ({ name: s.name, age: s.age }))

  // Yechim — shallow equality:
  import { useShallow } from 'zustand/react/shallow'
  const { name, age } = useStore(useShallow(s => ({ name: s.name, age: s.age })))

═══════════════════════════════════════
  ICHKI MEXANIZM
═══════════════════════════════════════

Zustand ichida useSyncExternalStore ishlatadi (React 18+):
  1. Store — React tashqarisidagi oddiy object
  2. set() chaqirilganda barcha subscriber-lar tekshiriladi
  3. Selector natijasi o'zgargan subscriber-lar re-render bo'ladi
  4. useSyncExternalStore concurrent mode bilan mos ishlashni ta'minlaydi

Provider kerak emas, chunki store React tree-dan tashqarida yashaydi.

═══════════════════════════════════════
  MIDDLEWARE
═══════════════════════════════════════

persist — localStorage/sessionStorage ga saqlash:
  create(persist((set) => ({...}), { name: 'store-key' }))

devtools — Redux DevTools bilan ulash:
  create(devtools((set) => ({...}), { name: 'MyStore' }))

immer — mutatsiya stili bilan yozish:
  create(immer((set) => ({
    nested: { value: 0 },
    update: () => set(state => { state.nested.value += 1 }),
  })))

Middleware-larni birlashtirish mumkin:
  create(devtools(persist(immer((set) => ({...})))))`,
    codeExamples: [
      {
        title: 'Asosiy store — Counter',
        language: 'ts',
        code: `import { create } from 'zustand'

interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  incrementBy: (amount: number) => void
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  incrementBy: (amount) => set(state => ({ count: state.count + amount })),
}))

// Komponentda ishlatish
function Counter() {
  const count = useCounterStore(s => s.count)  // faqat count
  const increment = useCounterStore(s => s.increment)

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
    </div>
  )
}`,
        description: 'Zustand store = hook. create<Type>() bilan tiplanadi. Selector pattern — faqat kerakli qismni subscribe qilish (performance).',
      },
      {
        title: 'persist middleware — localStorage',
        language: 'ts',
        code: `import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  theme: 'light' | 'dark'
  language: string
  toggleTheme: () => void
  setLanguage: (lang: string) => void
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'uz',
      toggleTheme: () => set(state => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
      })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'settings-storage',  // localStorage key
      // partialize: (state) => ({ theme: state.theme }), // faqat theme saqlash
    }
  )
)`,
        description: 'persist middleware — store-ni localStorage-ga avtomatik saqlaydi va sahifa yangilanganda qayta yuklaydi. partialize bilan faqat kerakli qismni saqlash mumkin.',
      },
      {
        title: 'useShallow — ko\'p qiymat olish',
        language: 'tsx',
        code: `import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface UserStore {
  name: string
  age: number
  email: string
  updateName: (name: string) => void
  updateAge: (age: number) => void
}

const useUserStore = create<UserStore>((set) => ({
  name: 'Ali',
  age: 25,
  email: 'ali@example.com',
  updateName: (name) => set({ name }),
  updateAge: (age) => set({ age }),
}))

// NOTO'G'RI — har safar yangi object, har doim re-render
function BadProfile() {
  const { name, age } = useUserStore(s => ({ name: s.name, age: s.age }))
  return <p>{name}, {age}</p>
}

// TO'G'RI — useShallow bilan shallow comparison
function GoodProfile() {
  const { name, age } = useUserStore(
    useShallow(s => ({ name: s.name, age: s.age }))
  )
  return <p>{name}, {age}</p>
}

// ALTERNATIVA — alohida selector
function AlsoGoodProfile() {
  const name = useUserStore(s => s.name)
  const age = useUserStore(s => s.age)
  return <p>{name}, {age}</p>
}`,
        description: 'Bir nechta qiymat olishda useShallow ishlatish yoki har bir qiymatni alohida selector bilan olish kerak — aks holda keraksiz re-renderlar bo\'ladi.',
      },
      {
        title: 'get() — action ichida state o\'qish',
        language: 'ts',
        code: `import { create } from 'zustand'

interface CartStore {
  items: { id: string; name: string; price: number; qty: number }[]
  addItem: (item: { id: string; name: string; price: number }) => void
  removeItem: (id: string) => void
  getTotal: () => number
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => set(state => {
    const existing = state.items.find(i => i.id === item.id)
    if (existing) {
      return {
        items: state.items.map(i =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        ),
      }
    }
    return { items: [...state.items, { ...item, qty: 1 }] }
  }),

  removeItem: (id) => set(state => ({
    items: state.items.filter(i => i.id !== id),
  })),

  // get() — hozirgi state-ni sinxron o'qish
  getTotal: () => {
    const { items } = get()
    return items.reduce((sum, i) => sum + i.price * i.qty, 0)
  },
}))`,
        description: 'get() — action ichida hozirgi state-ni o\'qish uchun. MUHIM: getTotal() kabi get() ishlatgan metodlar reaktiv EMAS — komponentda chaqirilsa re-render bermaydi. Derived data-ni hook/komponent ichida hisoblash kerak.',
      },
    ],
    interviewQA: [
      {
        question: 'Zustand nima va Redux-dan qanday farqi bor?',
        answer: `Zustand — minimalistik state management kutubxonasi (~1KB). Redux-dan asosiy farqlari: 1) Provider kerak emas — store React tree-dan tashqarida yashaydi, 2) Boilerplate kam — store yaratish bitta funksiya bilan, 3) Action type/creator kerak emas — to'g'ridan-to'g'ri funksiya yoziladi, 4) Bundle hajmi kichikroq (~1KB vs ~11KB). Kamchiligi: Redux DevTools kabi kuchli debugging yo'q (middleware bilan qo'shsa bo'ladi), katta jamoalar uchun Redux-ning strict pattern-lari afzalroq.`,
      },
      {
        question: 'Zustand-da selector pattern nima uchun muhim?',
        answer: `Zustand store-dan ma'lumot olishda selector bilan faqat kerakli qismni subscribe qilish kerak. useStore() (selector-siz) — butun store-ga subscribe bo'ladi, HAR QANDAY o'zgarishda re-render bo'ladi. useStore(s => s.count) — faqat count o'zgarganda re-render. Zustand selector natijasini === bilan taqqoslaydi. Agar selector object qaytarsa, har safar yangi referens bo'ladi — useShallow ishlatish yoki har qiymatni alohida selector bilan olish kerak.`,
      },
      {
        question: 'Zustand ichida qanday ishlaydi (ichki mexanizm)?',
        answer: `Zustand React 18-ning useSyncExternalStore hook-idan foydalanadi. Store — React tashqarisidagi oddiy JavaScript object. set() chaqirilganda: 1) yangi state hisoblanadi (shallow merge), 2) barcha subscriber-lar notify qilinadi, 3) har bir subscriber-da selector qayta ishga tushadi, 4) natija o'zgargan subscriber-lar re-render bo'ladi. useSyncExternalStore concurrent mode bilan mos ishlashni ta'minlaydi (tearing muammosini oldini oladi).`,
      },
      {
        question: 'Zustand-da get() ishlatish xavfsizmi?',
        answer: `get() — hozirgi state-ni sinxron olish uchun, faqat ACTION ICHIDA ishlatiladi. LEKIN get() reaktiv emas — komponentda const total = useStore(s => s.getTotal()) desangiz, items o'zgarganda re-render bo'lMAYDI. Chunki getTotal har safar hisoblaydi, lekin Zustand uni subscribe qilmaydi. Derived data-ni komponent/hook ichida hisoblash kerak: const items = useStore(s => s.items); const total = items.reduce(...).`,
      },
      {
        question: 'Zustand-da persist middleware qanday ishlaydi?',
        answer: `persist middleware store-ni avtomatik localStorage-ga (yoki boshqa storage-ga) saqlaydi. Har safar set() chaqirilganda yangilangan state serialize qilinib saqlanadi. Sahifa yangilanganda storage-dan o'qiladi va store-ni hydrate qiladi. Sozlash mumkin: name (storage key), partialize (faqat kerakli qismni saqlash), storage (sessionStorage, AsyncStorage), version (migratsiya uchun). Hydration asinxron bo'lgani uchun, boshlang'ich renderda eski qiymat ko'rinishi mumkin — onRehydrateStorage callback bilan boshqarish mumkin.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Redux vs Zustand' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-sync-external-store', label: 'useSyncExternalStore' },
    ],
  }
