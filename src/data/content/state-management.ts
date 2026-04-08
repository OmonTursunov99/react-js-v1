import type { Topic } from '../types'

export const stateManagementTopics: Topic[] = [
  {
    id: 'redux-toolkit',
    title: 'Redux Toolkit',
    importance: 3,
    status: 'to-learn',
    description: 'slice, configureStore, useSelector, useDispatch',
    content: `Redux Toolkit (RTK) — Redux-ning rasmiy, tavsiya etilgan usuli. Redux-ni soddaroq va xavfsizroq yozish uchun yaratilgan. Hozirda "Redux yozish" deganda RTK nazarda tutiladi.

═══════════════════════════════════════
  NIMA UCHUN REDUX TOOLKIT?
═══════════════════════════════════════

Eski Redux muammolari:
  - Juda ko'p boilerplate (action types, action creators, reducers alohida)
  - Immutability qo'lda boshqarish kerak edi
  - Store sozlash murakkab edi
  - Middleware qo'shish noqulay edi

RTK bularni hal qiladi:
  ✅ createSlice — action + reducer bitta joyda
  ✅ configureStore — middleware avtomatik sozlangan
  ✅ Immer ichiga o'rnatilgan — state-ni "mutatsiya" qilsa bo'ladi
  ✅ TypeScript bilan yaxshi integratsiya
  ✅ DevTools avtomatik ulangan

═══════════════════════════════════════
  ASOSIY TUSHUNCHALAR
═══════════════════════════════════════

1. Store — butun ilovaning global state-i
2. Slice — state-ning bir bo'lagi (feature slice)
3. Action — "nima bo'ldi" degan xabar { type, payload }
4. Reducer — action-ga javoban state-ni yangilovchi funksiya
5. Dispatch — action yuborish
6. Selector — store-dan ma'lumot olish

═══════════════════════════════════════
  createSlice
═══════════════════════════════════════

createSlice bitta joyda:
  - initialState belgilaydi
  - reducer funksiyalar yozadi
  - action creator-larni AVTOMATIK yaratadi

  const counterSlice = createSlice({
    name: 'counter',          // action type prefix
    initialState: { value: 0 },
    reducers: {
      increment(state) {
        state.value += 1      // Immer tufayli mutatsiya MUMKIN
      },
      add(state, action) {
        state.value += action.payload
      },
    },
  })

Immer ichida ishlaydi — state.value += 1 yozasiz,
lekin aslida yangi object yaratiladi. Bu FAQAT RTK reducer ichida mumkin!
Oddiy React state-da mutatsiya QILMANG.

═══════════════════════════════════════
  configureStore
═══════════════════════════════════════

  const store = configureStore({
    reducer: {
      counter: counterSlice.reducer,
      todos: todosSlice.reducer,
    },
  })

configureStore avtomatik qo'shadi:
  - redux-thunk middleware (async uchun)
  - Redux DevTools ulanishi
  - Development da serializability check
  - Development da immutability check

═══════════════════════════════════════
  useSelector va useDispatch
═══════════════════════════════════════

useSelector — store-dan ma'lumot o'qish:
  const count = useSelector((state: RootState) => state.counter.value)
  // Selector o'zgarsa komponent QAYTA renderlanadi
  // === bilan taqqoslaydi (referens equality)

useDispatch — action yuborish:
  const dispatch = useDispatch()
  dispatch(increment())
  dispatch(add(5))

═══════════════════════════════════════
  TYPESCRIPT BILAN ISHLATISH
═══════════════════════════════════════

Typed hooklar yaratish tavsiya etiladi:

  type RootState = ReturnType<typeof store.getState>
  type AppDispatch = typeof store.dispatch

  const useAppSelector = useSelector.withTypes<RootState>()
  const useAppDispatch = useDispatch.withTypes<AppDispatch>()

Shundan keyin komponentlarda:
  const count = useAppSelector(s => s.counter.value)  // tiplanmagan
  const dispatch = useAppDispatch()

═══════════════════════════════════════
  REDUX DEVTOOLS
═══════════════════════════════════════

configureStore avtomatik DevTools-ni ulaydi.
Browser extension orqali:
  - Har bir action-ni ko'rish mumkin
  - State diff ko'rish mumkin
  - Time-travel debugging (orqaga qaytarish)
  - Action-ni eksport/import qilish mumkin

═══════════════════════════════════════
  FLUX ARXITEKTURASI
═══════════════════════════════════════

Redux — Flux pattern asosida:

  UI → dispatch(action) → Reducer → New State → UI

  1. Foydalanuvchi button bosadi (UI)
  2. dispatch(action) chaqiriladi
  3. Reducer eski state + action → yangi state qaytaradi
  4. Store yangilanadi → useSelector orqali UI yangilanadi

Bu ONE-WAY DATA FLOW — ma'lumot FAQAT bitta yo'nalishda oqadi.
Debugging osonlashadi, chunki har bir o'zgarish kuzatiladi.`,
    codeExamples: [
      {
        title: 'createSlice — Counter slice',
        language: 'ts',
        code: `import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1  // Immer — mutatsiya xavfsiz
    },
    decrement(state) {
      state.value -= 1
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload
    },
    reset() {
      return initialState  // butunlay yangi state qaytarish
    },
  },
})

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions
export default counterSlice.reducer`,
        description: 'createSlice — reducer va action creatorlar bitta joyda. PayloadAction<T> action.payload tipini belgilaydi. Immer tufayli state.value += 1 yozish mumkin.',
      },
      {
        title: 'configureStore + Provider',
        language: 'tsx',
        code: `import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import counterReducer from './counterSlice'
import todosReducer from './todosSlice'

// Store yaratish
const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
})

// TypeScript tiplar
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooklar
import { useSelector, useDispatch } from 'react-redux'
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

// App wrapper
function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}`,
        description: 'configureStore avtomatik thunk middleware, DevTools, va development tekshiruvlarni qo\'shadi. Typed hooklar har safar tip yozishdan qutqaradi.',
      },
      {
        title: 'Komponentda ishlatish — useSelector + useDispatch',
        language: 'tsx',
        code: `import { useAppSelector, useAppDispatch } from './store'
import { increment, decrement, incrementByAmount, reset } from './counterSlice'

function Counter() {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()

  return (
    <div>
      <h2>Hisob: {count}</h2>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(10))}>+10</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  )
}`,
        description: 'useAppSelector — store-dan o\'qish (o\'zgarsa re-render). useAppDispatch — action yuborish. Komponent store tuzilmasini bilmaydi, faqat selector va action ishlatadi.',
      },
      {
        title: 'Todos slice — CRUD bilan',
        language: 'ts',
        code: `import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodosState {
  items: Todo[]
  filter: 'all' | 'active' | 'completed'
}

const initialState: TodosState = {
  items: [],
  filter: 'all',
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<string>) {
      state.items.push({
        id: crypto.randomUUID(),
        text: action.payload,
        completed: false,
      })
    },
    toggleTodo(state, action: PayloadAction<string>) {
      const todo = state.items.find(t => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed  // Immer bilan xavfsiz
      }
    },
    removeTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter(t => t.id !== action.payload)
    },
    setFilter(state, action: PayloadAction<TodosState['filter']>) {
      state.filter = action.payload
    },
  },
})

export const { addTodo, toggleTodo, removeTodo, setFilter } = todosSlice.actions
export default todosSlice.reducer

// Selector
export const selectFilteredTodos = (state: { todos: TodosState }) => {
  const { items, filter } = state.todos
  switch (filter) {
    case 'active': return items.filter(t => !t.completed)
    case 'completed': return items.filter(t => t.completed)
    default: return items
  }
}`,
        description: 'CRUD operatsiyalar Immer bilan — push, find+mutate, filter. Selector alohida eksport qilinadi — derived data hisoblash uchun.',
      },
    ],
    interviewQA: [
      {
        question: 'Redux Toolkit nima va nima uchun kerak?',
        answer: `Redux Toolkit — Redux-ning rasmiy, tavsiya etilgan usuli. Eski Redux-dagi boilerplate muammosini hal qiladi: action types, action creators, reducers alohida yozish kerak edi. RTK-da createSlice bularni birlashtirib, bitta joyda yozish imkonini beradi. Qo'shimcha: Immer o'rnatilgan (immutability oson), configureStore avtomatik thunk middleware va DevTools qo'shadi, TypeScript bilan yaxshi integratsiya.`,
      },
      {
        question: 'Redux-da Immer qanday ishlaydi? Mutatsiya xavfsizmi?',
        answer: `Immer — structural sharing bilan ishlaydigan kutubxona. createSlice reducer ichida state.value += 1 yozganingizda, Immer "draft" proxy object yaratadi. Siz draft-ni mutatsiya qilasiz, Immer esa oxirida yangi immutable object qaytaradi. Bu FAQAT RTK reducer ichida xavfsiz — oddiy React state-da mutatsiya QILMANG. Immer cheklovi: primitive qiymat qaytarmoqchi bo'lsangiz return ishlatish kerak, va Map/Set bilan ishlashda ehtiyot bo'lish kerak.`,
      },
      {
        question: 'useSelector qanday ishlaydi? Qachon re-render bo\'ladi?',
        answer: `useSelector store-dan ma'lumot o'qiydi. Har safar dispatch bo'lganda, useSelector BARCHA subscriber-larni tekshiradi. Agar selector qaytargan qiymat o'zgarmagan bo'lsa (=== bilan taqqoslaydi), re-render bo'lMAYDI. Muammo: agar selector har safar yangi object/array qaytarsa (masalan filter/map), har dispatch-da re-render bo'ladi. Yechim: createSelector (memoized selector) yoki selector-ni tuzatish.`,
      },
      {
        question: 'Redux-da one-way data flow nima?',
        answer: `Redux Flux arxitekturasiga asoslangan: UI → dispatch(action) → Reducer → New State → UI. Ma'lumot faqat BITTA yo'nalishda oqadi. Foydalanuvchi UI-da action trigger qiladi, action dispatch orqali reducer-ga boradi, reducer yangi state qaytaradi, UI yangilanadi. Bu predictable qiladi — har bir state o'zgarishi kuzatiladigan action orqali sodir bo'ladi. DevTools-da har bir action va state diff ko'rish mumkin — debugging osonlashadi.`,
      },
      {
        question: 'configureStore vs createStore farqi nima?',
        answer: `createStore — eski, deprecated usul. configureStore — RTK-ning zamonaviy usuli. Farqlari: configureStore avtomatik redux-thunk middleware qo'shadi (async operatsiyalar uchun), Redux DevTools-ni ulaydi, development-da serializability va immutability tekshiruvlarni qo'shadi, va reducer-larni combineReducers bilan birlashtiradi. createStore-da bularni qo'lda sozlash kerak edi. Hozirda DOIM configureStore ishlatish kerak.`,
      },
      {
        question: 'Redux qachon kerak, qachon kerak emas?',
        answer: `Redux kerak: ko'p komponentlar bitta state-ni ishlatganda, murakkab state logikasi bo'lganda (ko'p reducer, middleware), state o'zgarishlarini kuzatish kerak bo'lganda (DevTools), katta jamoada ishlayotganda (predictable pattern). Redux kerak EMAS: oddiy ilovalar uchun (useState/useContext yetarli), faqat server data uchun (TanStack Query yaxshiroq), faqat tema/auth uchun (Context yetarli). Qoida: agar Redux keraksiz deb hissangiz — kerak emas.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'redux-middleware', label: 'Redux Middleware' },
      { sectionId: 'state-management', topicId: 'rtk-query', label: 'RTK Query' },
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Qachon Redux ishlatish' },
      { sectionId: 'react-core', topicId: 'use-sync-external-store', label: 'useSyncExternalStore' },
    ],
  },
  {
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
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Redux vs Zustand' },
      { sectionId: 'react-core', topicId: 'use-sync-external-store', label: 'useSyncExternalStore' },
    ],
  },
  {
    id: 'tanstack-query',
    title: 'TanStack Query',
    importance: 3,
    status: 'to-learn',
    description: 'useQuery — server state boshqaruvi',
    content: `TanStack Query (eski nomi React Query) — server state boshqarish uchun eng yaxshi kutubxona. "Server state" va "client state" farqini tushunish — zamonaviy React ilovalar uchun KALIT tushuncha.

═══════════════════════════════════════
  SERVER STATE vs CLIENT STATE
═══════════════════════════════════════

Client state:
  - Foydalanuvchi interfeysi holati (modal ochiq/yopiq, tema, form input)
  - Faqat frontend-da yashaydi
  - Sinxronlash kerak emas
  - Boshqarish: useState, useReducer, Zustand, Redux

Server state:
  - Backend/API dan kelgan ma'lumotlar
  - Asl manbasi (source of truth) serverda
  - Keshlanishi kerak (har safar so'rov qilmaslik uchun)
  - Eskirishi mumkin (stale)
  - Boshqa foydalanuvchilar o'zgartirishi mumkin
  - Boshqarish: TanStack Query, RTK Query, SWR

═══════════════════════════════════════
  NIMA UCHUN TANSTACK QUERY?
═══════════════════════════════════════

useEffect + useState bilan API chaqirish muammolari:
  ❌ Loading/error state qo'lda boshqarish
  ❌ Keshlash yo'q — har safar yangi so'rov
  ❌ Race condition (eski so'rov kechroq kelsa)
  ❌ Refetch logikasi yo'q
  ❌ Pagination/infinite scroll murakkab
  ❌ Optimistic update murakkab

TanStack Query bularni hal qiladi:
  ✅ Avtomatik keshlash (staleTime, gcTime)
  ✅ Loading/error/success holatlari tayyor
  ✅ Background refetch (oyna fokusda, interval)
  ✅ Race condition yo'q
  ✅ Retry (xato bo'lsa qayta urinish)
  ✅ Deduplication (bir xil so'rovni birlashtirib yuborish)
  ✅ Pagination, infinite scroll tayyor
  ✅ Optimistic updates
  ✅ DevTools

═══════════════════════════════════════
  ASOSIY TUSHUNCHALAR
═══════════════════════════════════════

1. QueryClient — barcha kesh va sozlamalar markazi
2. QueryClientProvider — React tree-ga QueryClient beradi
3. Query Key — kesh kaliti, array bo'lishi kerak ['users', userId]
4. Query Function — ma'lumot olish funksiyasi (fetch/axios)
5. staleTime — ma'lumot qancha vaqt "yangi" hisoblanadi
6. gcTime — keshdan qachon o'chiriladi (garbage collection)

═══════════════════════════════════════
  useQuery
═══════════════════════════════════════

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],        // kesh kaliti
    queryFn: () => fetchUsers(), // ma'lumot olish
    staleTime: 5 * 60 * 1000,   // 5 daqiqa yangi hisoblanadi
  })

Qaytaradigan qiymatlar:
  - data — muvaffaqiyatli natija
  - isLoading — birinchi marta yuklanmoqda (kesh yo'q)
  - isFetching — background-da yangilanmoqda (kesh bor)
  - isError — xato bo'ldi
  - error — xato ob'ekti
  - refetch — qo'lda qayta so'rov

═══════════════════════════════════════
  QUERY KEY (KALIT TUSHUNCHA)
═══════════════════════════════════════

Query key = kesh kaliti. Array bo'lishi kerak:

  ['users']                    // barcha foydalanuvchilar
  ['users', userId]            // bitta foydalanuvchi
  ['users', { role: 'admin' }] // filtrlangan
  ['users', userId, 'posts']   // foydalanuvchi postlari

Qoidalar:
  - Key o'zgarsa → yangi so'rov yuboriladi
  - Bir xil key → keshdan olinadi
  - Key ierarxik — ['users'] invalidate qilsa, ['users', 1] ham invalidate bo'ladi

═══════════════════════════════════════
  KESH MEXANIZMI
═══════════════════════════════════════

  staleTime: 0 (default)
    Ma'lumot darhol "stale" (eskirgan) bo'ladi
    Har safar component mount bo'lganda refetch qiladi

  staleTime: 5 * 60 * 1000
    5 daqiqa ichida ma'lumot "fresh" — refetch qilMAYDI
    5 daqiqadan keyin — stale, refetch qiladi

  gcTime: 5 * 60 * 1000 (default)
    Komponent unmount bo'lgandan keyin kesh 5 daqiqa saqlanadi
    Qayta mount bo'lsa — keshdan oladi (instant) + background refetch

Stale ma'lumot AVTOMATIK refetch bo'ladi:
  - Komponent mount bo'lganda
  - Oyna fokusga qaytganda (refetchOnWindowFocus)
  - Internet qayta ulanganda (refetchOnReconnect)
  - Belgilangan intervalda (refetchInterval)`,
    codeExamples: [
      {
        title: 'QueryClient sozlash + useQuery',
        language: 'tsx',
        code: `import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

// QueryClient — barcha sozlamalar va kesh markazi
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 daqiqa fresh
      gcTime: 10 * 60 * 1000,     // 10 daqiqa keshda
      retry: 2,                    // xatoda 2 marta qayta urinish
      refetchOnWindowFocus: true,  // fokusda refetch
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  )
}

// API funksiya
async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Xatolik yuz berdi')
  return res.json()
}

// Komponent
function UserList() {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <p>Yuklanmoqda...</p>
  if (isError) return <p>Xato: {error.message}</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}`,
        description: 'QueryClientProvider — React tree-ga keshni beradi. useQuery — deklarativ data fetching: key + funksiya berish yetarli. Loading, error holatlari avtomatik.',
      },
      {
        title: 'Query Key — dinamik parametrlar',
        language: 'tsx',
        code: `import { useQuery } from '@tanstack/react-query'

// Bitta foydalanuvchi
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['users', userId],  // userId o'zgarsa → yangi so'rov
    queryFn: () => fetchUser(userId),
    enabled: !!userId,  // userId bo'sh bo'lsa so'rov yuborMA
  })

  if (isLoading) return <p>Yuklanmoqda...</p>
  return <h1>{user?.name}</h1>
}

// Filtrlangan ro'yxat
function FilteredUsers() {
  const [role, setRole] = useState<string>('all')
  const [page, setPage] = useState(1)

  const { data } = useQuery({
    queryKey: ['users', { role, page }],  // filter o'zgarsa → yangi so'rov
    queryFn: () => fetchUsers({ role, page }),
  })

  return (
    <div>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="all">Hammasi</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      {data?.users.map(u => <p key={u.id}>{u.name}</p>)}
      <button onClick={() => setPage(p => p + 1)}>Keyingi</button>
    </div>
  )
}`,
        description: 'Query key array-dagi har qanday element o\'zgarsa yangi so\'rov yuboriladi. enabled — shart bajarilmaguncha so\'rov yubormaslik (conditional fetching).',
      },
      {
        title: 'Dependent queries — ketma-ket so\'rovlar',
        language: 'tsx',
        code: `import { useQuery } from '@tanstack/react-query'

function UserPosts({ userId }: { userId: string }) {
  // 1-so'rov: foydalanuvchini olish
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })

  // 2-so'rov: foydalanuvchi postlarini olish
  // user yuklangunga qadar KUTADI (enabled)
  const { data: posts, isLoading } = useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetchPostsByUser(user!.id),
    enabled: !!user,  // user bo'lmaguncha so'rov YUBORMA
  })

  if (isLoading) return <p>Yuklanmoqda...</p>

  return (
    <div>
      <h1>{user?.name} postlari</h1>
      {posts?.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  )
}`,
        description: 'enabled bilan ketma-ket so\'rovlar — birinchi so\'rov tugaguncha ikkinchisi kutadi. Waterfall pattern — kerak bo\'lganda ishlatiladi.',
      },
    ],
    interviewQA: [
      {
        question: 'TanStack Query nima va nima muammoni hal qiladi?',
        answer: `TanStack Query — server state management kutubxonasi. Asosiy muammo: useEffect + useState bilan API chaqirishda keshlash yo'q, loading/error qo'lda boshqariladi, race condition bo'lishi mumkin, refetch logikasi yo'q. TanStack Query bularni hal qiladi: avtomatik keshlash (staleTime/gcTime), deklarativ loading/error holatlari, background refetch, retry, deduplication (bir xil so'rovni birlashtirib yuborish), pagination/infinite scroll, optimistic updates.`,
      },
      {
        question: 'Server state va client state farqi nima?',
        answer: `Client state — faqat frontendda yashaydi (modal holati, tema, form input). Source of truth clientda. Sinxronlash kerak emas. Boshqarish: useState, Zustand, Redux. Server state — backend/API dan kelgan ma'lumotlar. Source of truth serverda. Eskirishi mumkin (stale), boshqa foydalanuvchilar o'zgartirishi mumkin, keshlanishi kerak. Boshqarish: TanStack Query, RTK Query. Bu farqni tushunish — zamonaviy arxitektura uchun kalit. Ko'p ilovalar Redux-ga hamma narsani qo'yadi, aslida server state alohida boshqarilishi kerak.`,
      },
      {
        question: 'staleTime va gcTime farqi nima?',
        answer: `staleTime — ma'lumot qancha vaqt "yangi" (fresh) hisoblanadi. Default: 0 (darhol stale). Fresh ma'lumot refetch qilinMAYDI, stale ma'lumot trigger bo'lganda (mount, focus, reconnect) avtomatik refetch bo'ladi. gcTime (garbage collection time) — komponent unmount bo'lgandan keyin kesh qancha vaqt saqlanadi. Default: 5 daqiqa. Misol: staleTime=5min, gcTime=10min — ma'lumot 5 daqiqa fresh, unmount-dan keyin 10 daqiqa keshda qoladi. Qayta mount-da keshdan oladi (instant) + background refetch.`,
      },
      {
        question: 'Query key nima uchun muhim?',
        answer: `Query key — TanStack Query-ning kesh tizimining asosi. Har bir unique key uchun alohida kesh yozuvi bo'ladi. Key array bo'lishi kerak: ['users'], ['users', userId], ['users', {role: 'admin'}]. Key o'zgarsa — yangi so'rov yuboriladi. Bir xil key — keshdan olinadi. Key ierarxik: queryClient.invalidateQueries({queryKey: ['users']}) barcha ['users', ...] kalitlarni invalidate qiladi. Dependency array kabi ishlaydi — queryFn ichida ishlatilgan barcha parametrlar key-ga qo'shilishi kerak.`,
      },
      {
        question: 'isLoading va isFetching farqi nima?',
        answer: `isLoading — birinchi marta yuklanmoqda, keshda ma'lumot YO'Q. Foydalanuvchi loading spinner ko'radi. isFetching — background-da yangilanmoqda, lekin keshda ESKi ma'lumot BOR. Foydalanuvchi eski ma'lumotni ko'radi + background-da yangilanadi. Misol: sahifa birinchi ochilganda isLoading=true, isFetching=true. Qayta ochilganda (kesh bor) isLoading=false, isFetching=true — foydalanuvchi darhol eski ma'lumotni ko'radi, background-da yangilanadi. Bu UX uchun juda muhim — instant navigation.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'tanstack-query-deep', label: 'TanStack Query (chuqur)' },
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Server vs Client state' },
    ],
  },
  {
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
        {theme === 'light' ? 'Qorong\'u' : 'Yorug\\'} rejim
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
  },
  {
    id: 'redux-middleware',
    title: 'Redux Middleware',
    importance: 3,
    status: 'to-learn',
    description: 'thunk, saga — async logika qanday ishlaydi',
    content: `Redux Middleware — action dispatch bo'lganda va reducer-ga yetib borguncha oradagi INTERCEPTOR. Async operatsiyalar, logging, error handling uchun ishlatiladi.

═══════════════════════════════════════
  MIDDLEWARE NIMA?
═══════════════════════════════════════

Oddiy Redux flow:
  dispatch(action) → reducer → new state

Middleware bilan:
  dispatch(action) → MIDDLEWARE → reducer → new state

Middleware action-ni:
  - O'tkazib yuborishi mumkin (next)
  - O'zgartirishi mumkin
  - To'xtatishi mumkin
  - Yangi action dispatch qilishi mumkin
  - Side effect bajarishi mumkin (API call, logging)

═══════════════════════════════════════
  MIDDLEWARE TUZILISHI
═══════════════════════════════════════

Redux middleware — "curried" funksiya (3 ta ichma-ich):

  const myMiddleware = (store) => (next) => (action) => {
    // action reducer-ga borISHIDAN OLDIN
    console.log('Action:', action.type)

    const result = next(action)  // keyingi middleware yoki reducer

    // action reducer-ga borgandan KEYIN
    console.log('New state:', store.getState())

    return result
  }

store — { getState, dispatch }
next — keyingi middleware yoki reducer
action — dispatch qilingan action

═══════════════════════════════════════
  REDUX THUNK
═══════════════════════════════════════

Thunk — eng oddiy async middleware (RTK-da o'rnatilgan).
Oddiy action = object: { type, payload }
Thunk action = FUNKSIYA: (dispatch, getState) => { ... }

  // Thunk middleware ichida:
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  return next(action)

Thunk orqali:
  ✅ API so'rovlar (fetch, axios)
  ✅ Conditional dispatch (getState tekshirib)
  ✅ Multiple dispatch (loading → success/error)

═══════════════════════════════════════
  createAsyncThunk (RTK)
═══════════════════════════════════════

RTK-ning rasmiy async pattern:

  const fetchUsers = createAsyncThunk(
    'users/fetch',               // action type prefix
    async (_, { rejectWithValue }) => {
      try {
        const res = await fetch('/api/users')
        return await res.json()  // fulfilled payload
      } catch (err) {
        return rejectWithValue(err.message)
      }
    }
  )

Avtomatik 3 ta action yaratadi:
  - users/fetch/pending    → loading holati
  - users/fetch/fulfilled  → muvaffaqiyat
  - users/fetch/rejected   → xato

extraReducers-da ishlov berish:

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }

═══════════════════════════════════════
  REDUX SAGA (QISQACHA)
═══════════════════════════════════════

Redux Saga — Generator funksiyalarga asoslangan middleware.
Thunk-dan kuchliroq, lekin murakkab.

  function* fetchUsersSaga() {
    try {
      yield put({ type: 'LOADING' })
      const users = yield call(api.getUsers)
      yield put({ type: 'SUCCESS', payload: users })
    } catch (err) {
      yield put({ type: 'ERROR', payload: err })
    }
  }

Saga afzalliklari:
  ✅ Murakkab async flow (debounce, throttle, race, parallel)
  ✅ Oson test qilish (generator step-by-step)
  ✅ Cancellation (takeLatest — oxirgi so'rovni olish)

Saga kamchiliklari:
  ❌ O'rganish qiyin (Generator syntax)
  ❌ Boilerplate ko'p
  ❌ Ko'p hollarda createAsyncThunk yetarli

═══════════════════════════════════════
  THUNK vs SAGA vs RTK QUERY
═══════════════════════════════════════

createAsyncThunk (Thunk):
  ✅ Oddiy async operatsiyalar
  ✅ RTK-da o'rnatilgan
  ✅ O'rganish oson
  ❌ Murakkab flow uchun yetarli emas

Redux Saga:
  ✅ Murakkab async flow
  ✅ Debounce, race, parallel
  ✅ Test qilish oson
  ❌ O'rganish qiyin, boilerplate ko'p

RTK Query:
  ✅ CRUD API uchun eng yaxshi
  ✅ Keshlash, refetch avtomatik
  ✅ Boilerplate minimal
  ❌ Faqat data fetching uchun (murakkab logika emas)`,
    codeExamples: [
      {
        title: 'createAsyncThunk — API so\'rov',
        language: 'ts',
        code: `import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  name: string
  email: string
}

interface UsersState {
  items: User[]
  loading: boolean
  error: string | null
}

// Async thunk
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Server xatosi')
      return await res.json()
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Xatolik')
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Noma\\'lum xato'
      })
  },
})

export default usersSlice.reducer`,
        description: 'createAsyncThunk avtomatik 3 ta action yaratadi: pending, fulfilled, rejected. extraReducers-da har bir holatga javob yoziladi. TypeScript generic-lar: <ReturnType, ArgType, ThunkConfig>.',
      },
      {
        title: 'Custom middleware — Logger',
        language: 'ts',
        code: `import type { Middleware } from '@reduxjs/toolkit'

// Logger middleware
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.group(action.type)
  console.log('Oldingi state:', store.getState())
  console.log('Action:', action)

  const result = next(action)  // reducer-ga yuborish

  console.log('Yangi state:', store.getState())
  console.groupEnd()

  return result
}

// Error reporter middleware
const errorMiddleware: Middleware = () => (next) => (action) => {
  try {
    return next(action)
  } catch (err) {
    console.error('Redux error:', err)
    // Sentry.captureException(err)
    throw err
  }
}

// configureStore-ga qo'shish
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: { users: usersReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware, errorMiddleware),
})`,
        description: 'Custom middleware — (store) => (next) => (action) pattern. getDefaultMiddleware() mavjud middleware-larni (thunk, serializable check) saqlaydi, concat bilan yangi qo\'shiladi.',
      },
      {
        title: 'Thunk — conditional va chained dispatch',
        language: 'ts',
        code: `import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Conditional dispatch — getState bilan tekshirish
export const fetchUsersIfNeeded = createAsyncThunk<
  User[],
  void,
  { state: RootState; rejectValue: string }
>(
  'users/fetchIfNeeded',
  async (_, { getState, rejectWithValue }) => {
    // Allaqachon yuklangan bo'lsa — so'rov yuborMA
    const { users } = getState()
    if (users.items.length > 0) {
      // Thunk-ni bekor qilish
      return users.items
    }

    const res = await fetch('/api/users')
    if (!res.ok) return rejectWithValue('Xato')
    return res.json()
  },
  {
    // Agar allaqachon loading bo'lsa — qayta so'rov yuborMA
    condition: (_, { getState }) => {
      const { users } = getState() as RootState
      return !users.loading
    },
  }
)

// Chained thunk — ketma-ket operatsiyalar
export const createUserAndRefresh = createAsyncThunk(
  'users/createAndRefresh',
  async (userData: CreateUserDTO, { dispatch }) => {
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    // User yaratilgandan keyin ro'yxatni yangilash
    dispatch(fetchUsers())
  }
)`,
        description: 'condition — thunk-ni bekor qilish uchun (loading davomida qayta so\'rov oldini olish). Chained thunk — dispatch bilan boshqa thunk chaqirish.',
      },
    ],
    interviewQA: [
      {
        question: 'Redux middleware nima va qanday ishlaydi?',
        answer: `Redux middleware — dispatch(action) va reducer orasidagi interceptor. Tuzilishi: (store) => (next) => (action) => { ... }. Middleware action-ni o'tkazishi, o'zgartirishi, to'xtatishi, yoki yangi action dispatch qilishi mumkin. Asosiy maqsad: side effectlar (API call, logging), async operatsiyalar. configureStore-da getDefaultMiddleware().concat(myMiddleware) bilan qo'shiladi. RTK default thunk middleware o'rnatadi.`,
      },
      {
        question: 'Redux Thunk nima? Qanday ishlaydi?',
        answer: `Thunk — funksiya dispatch qilish imkonini beruvchi middleware. Oddiy action = object {type, payload}. Thunk action = funksiya (dispatch, getState) => {...}. Thunk middleware action tipini tekshiradi: agar funksiya bo'lsa — chaqiradi va dispatch/getState beradi, agar object bo'lsa — next() bilan reducer-ga o'tkazadi. RTK-da createAsyncThunk bilan ishlatiladi — avtomatik pending/fulfilled/rejected action-lar yaratadi.`,
      },
      {
        question: 'createAsyncThunk qanday ishlaydi?',
        answer: `createAsyncThunk(typePrefix, payloadCreator, options) — async thunk yaratadi. typePrefix (masalan "users/fetch") asosida 3 ta action avtomatik yaratiladi: pending, fulfilled, rejected. payloadCreator — async funksiya, (arg, thunkAPI) oladi. thunkAPI ichida: dispatch, getState, rejectWithValue, signal (abort). extraReducers builder pattern bilan har bir holatga javob yoziladi. condition option bilan thunk-ni bekor qilish mumkin (masalan allaqachon loading bo'lsa).`,
      },
      {
        question: 'Thunk va Saga farqi nima? Qachon qaysi birini ishlatish kerak?',
        answer: `Thunk — oddiy async uchun (API call, conditional dispatch). Promise-based, o'rganish oson, RTK-da o'rnatilgan. Saga — murakkab async flow uchun (debounce, throttle, race condition, parallel tasks, cancellation). Generator-based, o'rganish qiyinroq, boilerplate ko'proq. Hozirgi tavsiya: 90% holatlar uchun createAsyncThunk yetarli. CRUD operatsiyalar uchun RTK Query eng yaxshi. Saga faqat murakkab business logika (real-time, WebSocket, complex workflows) uchun kerak.`,
      },
      {
        question: 'extraReducers va reducers farqi nima?',
        answer: `reducers — slice O'ZINING action-lari uchun. createSlice avtomatik action creator yaratadi. extraReducers — BOSHQA joyda yaratilgan action-larga javob berish uchun. Asosan createAsyncThunk action-lari uchun ishlatiladi (pending/fulfilled/rejected). Shuningdek, boshqa slice-ning action-lariga ham javob berish mumkin. builder pattern bilan yoziladi: builder.addCase(action, reducer). extraReducers-da action creator YARATILMAYDI — faqat mavjud action-larga reaksiya.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux Toolkit' },
      { sectionId: 'state-management', topicId: 'rtk-query', label: 'RTK Query (thunk o\'rniga)' },
    ],
  },
  {
    id: 'rtk-query',
    title: 'RTK Query',
    importance: 2,
    status: 'to-learn',
    description: 'Redux Toolkit ichidagi data fetching',
    content: `RTK Query — Redux Toolkit ichiga o'rnatilgan data fetching va keshlash yechimi. TanStack Query-ga alternativa, lekin Redux ekosistemi ichida ishlaydi.

═══════════════════════════════════════
  NIMA UCHUN RTK QUERY?
═══════════════════════════════════════

createAsyncThunk bilan API chaqirish muammolari:
  ❌ Har bir endpoint uchun slice, thunk, loading/error state yozish kerak
  ❌ Keshlash yo'q — har safar yangi so'rov
  ❌ Loading/error state qo'lda boshqarish
  ❌ Juda ko'p boilerplate

RTK Query bularni hal qiladi:
  ✅ Bitta createApi bilan BARCHA endpoint-larni aniqlash
  ✅ Avtomatik keshlash va invalidation
  ✅ Loading/error/success holatlari tayyor
  ✅ Auto-generated React hooklar
  ✅ Cache tag tizimi bilan aqlli refetch
  ✅ Optimistic updates

═══════════════════════════════════════
  ASOSIY TUSHUNCHALAR
═══════════════════════════════════════

1. createApi — API konfiguratsiyasi
2. baseQuery — barcha so'rovlar uchun umumiy sozlama
3. endpoints — query (GET) va mutation (POST/PUT/DELETE)
4. Tags — kesh invalidation uchun
5. Auto-generated hooks — useGetUsersQuery, useAddUserMutation

═══════════════════════════════════════
  createApi
═══════════════════════════════════════

  const api = createApi({
    reducerPath: 'api',                    // store-dagi kalit
    baseQuery: fetchBaseQuery({
      baseUrl: '/api',                     // barcha so'rovlar uchun prefix
    }),
    tagTypes: ['Users', 'Posts'],           // kesh tag-lari
    endpoints: (builder) => ({
      getUsers: builder.query({            // GET so'rov
        query: () => '/users',
        providesTags: ['Users'],
      }),
      addUser: builder.mutation({          // POST so'rov
        query: (newUser) => ({
          url: '/users',
          method: 'POST',
          body: newUser,
        }),
        invalidatesTags: ['Users'],        // Users keshini yangilaydi
      }),
    }),
  })

  // Avtomatik hook-lar eksport
  export const { useGetUsersQuery, useAddUserMutation } = api

═══════════════════════════════════════
  CACHE TAGS TIZIMI
═══════════════════════════════════════

Tags — keshni aqlli invalidate qilish mexanizmi:

  providesTags: ['Users']
    — bu query 'Users' tag-ini beradi

  invalidatesTags: ['Users']
    — bu mutation 'Users' tag-li barcha keshlarni invalidate qiladi
    — invalidate qilingan query-lar avtomatik REFETCH bo'ladi

Tag-lar aniqroq bo'lishi mumkin:
  providesTags: (result) =>
    result
      ? [...result.map(({ id }) => ({ type: 'Users', id })), 'Users']
      : ['Users']

  // Bitta user o'zgarsa — faqat shu user refetch bo'ladi
  invalidatesTags: (result, error, id) => [{ type: 'Users', id }]

═══════════════════════════════════════
  RTK QUERY vs TANSTACK QUERY
═══════════════════════════════════════

RTK Query afzalliklari:
  ✅ Redux ekosistemi ichida (DevTools, middleware)
  ✅ Redux store bilan integratsiya (state-ga kirish)
  ✅ Code generation (OpenAPI dan avtomatik API yaratish)

TanStack Query afzalliklari:
  ✅ Redux-ga bog'liq emas (mustaqil)
  ✅ Kuchliroq kesh boshqaruvi
  ✅ Infinite queries, paginated queries
  ✅ Kichikroq bundle
  ✅ Katta ekotizim va jamoat

Qoida: agar loyihada Redux bor — RTK Query.
Agar Redux yo'q yoki kerak emas — TanStack Query.`,
    codeExamples: [
      {
        title: 'createApi — to\'liq CRUD',
        language: 'ts',
        code: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface User {
  id: string
  name: string
  email: string
}

type CreateUserDTO = Omit<User, 'id'>

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // GET /api/users
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Users' as const, id })), 'Users']
          : ['Users'],
    }),

    // GET /api/users/:id
    getUserById: builder.query<User, string>({
      query: (id) => \`/users/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // POST /api/users
    addUser: builder.mutation<User, CreateUserDTO>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],  // ro'yxatni yangilash
    }),

    // PUT /api/users/:id
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...body }) => ({
        url: \`/users/\${id}\`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    // DELETE /api/users/:id
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: \`/users/\${id}\`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi`,
        description: 'To\'liq CRUD API — query (GET) va mutation (POST/PUT/DELETE). providesTags/invalidatesTags orqali aqlli kesh invalidation. Hook-lar avtomatik yaratiladi.',
      },
      {
        title: 'Store-ga ulash va komponentda ishlatish',
        language: 'tsx',
        code: `// store.ts
import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from './usersApi'

const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,  // API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),  // kesh, polling uchun
})

// UserList.tsx
import { useGetUsersQuery, useDeleteUserMutation } from './usersApi'

function UserList() {
  const { data: users, isLoading, error } = useGetUsersQuery()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  if (isLoading) return <p>Yuklanmoqda...</p>
  if (error) return <p>Xatolik!</p>

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>
          {user.name}
          <button
            onClick={() => deleteUser(user.id)}
            disabled={isDeleting}
          >
            O'chirish
          </button>
        </li>
      ))}
    </ul>
  )
}

// AddUser.tsx
import { useAddUserMutation } from './usersApi'

function AddUser() {
  const [addUser, { isLoading }] = useAddUserMutation()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await addUser({
      name: form.get('name') as string,
      email: form.get('email') as string,
    })
    // Kesh avtomatik yangilanadi (invalidatesTags)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Ism" required />
      <input name="email" placeholder="Email" required />
      <button disabled={isLoading}>Qo'shish</button>
    </form>
  )
}`,
        description: 'API reducer va middleware store-ga qo\'shiladi. Query hook — data/isLoading/error qaytaradi. Mutation hook — [triggerFn, result] qaytaradi. invalidatesTags orqali kesh avtomatik yangilanadi.',
      },
      {
        title: 'baseQuery — auth token va error handling',
        language: 'ts',
        code: `import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'

// Auth token bilan baseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', \`Bearer \${token}\`)
    }
    return headers
  },
})

// Token eskirsa qayta login qilish (re-auth)
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Token yangilash
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult.data) {
      api.dispatch(setToken(refreshResult.data as string))
      // Asl so'rovni qayta yuborish
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // ...
  }),
})`,
        description: 'prepareHeaders — har so\'rovga auth token qo\'shish. baseQueryWithReauth — 401 xatoda avtomatik token yangilash va so\'rovni qayta yuborish pattern.',
      },
    ],
    interviewQA: [
      {
        question: 'RTK Query nima va createAsyncThunk-dan nima farqi?',
        answer: `RTK Query — RTK ichiga o'rnatilgan data fetching va keshlash yechimi. createAsyncThunk bilan har endpoint uchun slice, thunk, loading/error state qo'lda yozish kerak. RTK Query-da bitta createApi bilan barcha endpoint-larni aniqlaysiz — avtomatik keshlash, loading/error holatlari, React hooklar, kesh invalidation. RTK Query "deklarativ" — nima olish kerakligini yozasiz, qanday boshqarishni kutubxona o'zi hal qiladi.`,
      },
      {
        question: 'RTK Query-da cache tags qanday ishlaydi?',
        answer: `Tags — keshni aqlli invalidate qilish mexanizmi. Query endpoint-larga providesTags beriladi — bu query qaysi tag-larni "beradi". Mutation endpoint-larga invalidatesTags beriladi — qaysi tag-larni invalidate qiladi. Mutation bajarilganda — invalidate qilingan tag-li barcha query-lar avtomatik REFETCH bo'ladi. Tag-lar umumiy ('Users') yoki aniq ({type: 'Users', id: '123'}) bo'lishi mumkin — aniq tag faqat bitta entity-ni refetch qiladi.`,
      },
      {
        question: 'RTK Query va TanStack Query farqi nima?',
        answer: `RTK Query — Redux ekosistemi ichida ishlaydi, DevTools bilan integratsiya, store state-ga kirish mumkin, OpenAPI code generation. TanStack Query — mustaqil, Redux-ga bog'liq emas, kuchliroq kesh boshqaruvi (staleTime, gcTime), infinite/paginated queries yaxshiroq, kichikroq bundle, kattaroq ekotizim. Qoida: loyihada Redux bor — RTK Query. Redux yo'q — TanStack Query. Ikkalasini birgalikda ishlatish ham mumkin (Redux client state uchun, TanStack Query server state uchun).`,
      },
      {
        question: 'RTK Query-da query va mutation farqi nima?',
        answer: `Query — GET so'rovlar, ma'lumot OLISH uchun. Avtomatik keshlanadi, component mount-da avtomatik chaqiriladi, stale bo'lganda refetch qiladi. Hook: useGetUsersQuery() — darhol so'rov yuboradi, data/isLoading/error qaytaradi. Mutation — POST/PUT/DELETE so'rovlar, ma'lumot O'ZGARTIRISH uchun. Keshlanmaydi, qo'lda chaqiriladi, invalidatesTags bilan keshni yangilaydi. Hook: useAddUserMutation() — [triggerFn, result] qaytaradi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux Toolkit' },
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query (alternativa)' },
    ],
  },
  {
    id: 'tanstack-query-deep',
    title: 'TanStack Query (chuqur)',
    importance: 3,
    status: 'to-learn',
    description: 'mutations, invalidation, optimistic updates, cache',
    content: `TanStack Query-ning ilg'or xususiyatlari — mutations, cache invalidation, optimistic updates, infinite queries, prefetching.

═══════════════════════════════════════
  useMutation
═══════════════════════════════════════

useMutation — ma'lumot O'ZGARTIRISH uchun (POST, PUT, DELETE):

  const mutation = useMutation({
    mutationFn: (newUser) => axios.post('/api/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  mutation.mutate({ name: 'Ali', email: 'ali@test.com' })

Qaytaradigan qiymatlar:
  - mutate(data) — mutation chaqirish (fire-and-forget)
  - mutateAsync(data) — Promise qaytaradi (await mumkin)
  - isPending — yuklanmoqda
  - isSuccess — muvaffaqiyat
  - isError — xato
  - reset() — holatni tozalash

═══════════════════════════════════════
  CACHE INVALIDATION
═══════════════════════════════════════

Mutation-dan keyin keshni yangilash strategiyalari:

1. invalidateQueries — keshni eskirgan deb belgilash va refetch:
   queryClient.invalidateQueries({ queryKey: ['users'] })
   // ['users'], ['users', 1], ['users', {role: 'admin'}] — HAMMASI

2. setQueryData — keshni qo'lda yangilash (so'rovsiz):
   queryClient.setQueryData(['users', newUser.id], newUser)

3. Ikkalasi — optimistic update + background refetch:
   onMutate → keshni yangilash → onSettled → refetch

Invalidation ierarxik ishlaydi:
  invalidateQueries(['users'])     // BARCHA users query-larni
  invalidateQueries(['users', 1])  // faqat user 1 ni

═══════════════════════════════════════
  OPTIMISTIC UPDATES
═══════════════════════════════════════

Optimistic update — server javobini KUTMASDAN UI-ni yangilash.
Agar xato bo'lsa — eski holatga qaytarish (rollback).

Afzalliklari:
  ✅ UI darhol yangilanadi — foydalanuvchi kutMAYDI
  ✅ Tez va responsive UX

Xatarlari:
  ⚠️ Server rad etsa — rollback kerak
  ⚠️ Murakkab logika

Qadamlar:
  1. onMutate — eski keshni saqlash + yangi qiymat qo'yish
  2. onError — xato bo'lsa eski keshni qaytarish
  3. onSettled — har doim refetch (server bilan sinxronlash)

═══════════════════════════════════════
  INFINITE QUERIES
═══════════════════════════════════════

useInfiniteQuery — pagination/infinite scroll uchun:

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: ({ pageParam }) => fetchPosts(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    })

  data.pages — barcha yuklangan sahifalar massivi
  fetchNextPage() — keyingi sahifani yuklash
  hasNextPage — yana sahifa bormi
  isFetchingNextPage — keyingi sahifa yuklanmoqda

═══════════════════════════════════════
  PREFETCHING
═══════════════════════════════════════

Foydalanuvchi bosishidan OLDIN ma'lumotni yuklash:

  // Hover qilganda prefetch
  function UserLink({ userId }: { userId: string }) {
    const queryClient = useQueryClient()

    function handleMouseEnter() {
      queryClient.prefetchQuery({
        queryKey: ['users', userId],
        queryFn: () => fetchUser(userId),
        staleTime: 5 * 60 * 1000,
      })
    }

    return <Link onMouseEnter={handleMouseEnter} to={'/users/' + userId}>
      Ko'rish
    </Link>
  }

Bu instant navigation ta'sirini beradi — sahifa ochilganda
ma'lumot ALLAQACHON keshda bo'ladi.

═══════════════════════════════════════
  PARALLEL va DEPENDENT QUERIES
═══════════════════════════════════════

Parallel — bir vaqtda bir nechta query:
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const postsQuery = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
  // Ikkalasi PARALLEL ishlaydi

useQueries — dinamik parallel:
  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['users', id],
      queryFn: () => fetchUser(id),
    }))
  })

Dependent — ketma-ket (enabled bilan):
  const { data: user } = useQuery({...})
  const { data: posts } = useQuery({
    ...
    enabled: !!user,  // user bo'lmaguncha KUTADI
  })`,
    codeExamples: [
      {
        title: 'useMutation + invalidation',
        language: 'tsx',
        code: `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface Todo {
  id: string
  title: string
  completed: boolean
}

function TodoApp() {
  const queryClient = useQueryClient()

  // Ro'yxatni olish
  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(r => r.json()) as Promise<Todo[]>,
  })

  // Qo'shish
  const addMutation = useMutation({
    mutationFn: (title: string) =>
      fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title, completed: false }),
        headers: { 'Content-Type': 'application/json' },
      }).then(r => r.json()),
    onSuccess: () => {
      // Keshni invalidate — avtomatik refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  // O'chirish
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(\`/api/todos/\${id}\`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <button
        onClick={() => addMutation.mutate('Yangi vazifa')}
        disabled={addMutation.isPending}
      >
        {addMutation.isPending ? 'Qo\\'shilmoqda...' : 'Qo\\'shish'}
      </button>

      {todos.map(todo => (
        <div key={todo.id}>
          <span>{todo.title}</span>
          <button onClick={() => deleteMutation.mutate(todo.id)}>
            O'chirish
          </button>
        </div>
      ))}
    </div>
  )
}`,
        description: 'useMutation — POST/DELETE so\'rovlar. onSuccess-da invalidateQueries — keshni yangilash. isPending — loading holati.',
      },
      {
        title: 'Optimistic update — Todo toggle',
        language: 'tsx',
        code: `import { useMutation, useQueryClient } from '@tanstack/react-query'

function useTodoToggle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todo: Todo) =>
      fetch(\`/api/todos/\${todo.id}\`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed }),
        headers: { 'Content-Type': 'application/json' },
      }).then(r => r.json()),

    // 1. OLDIN — eski keshni saqlash + yangilash
    onMutate: async (updatedTodo) => {
      // Davom etayotgan refetch-larni bekor qilish
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // Eski keshni saqlash (rollback uchun)
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      // Keshni DARHOL yangilash (UI instant yangilanadi)
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map(t =>
          t.id === updatedTodo.id
            ? { ...t, completed: !t.completed }
            : t
        )
      )

      return { previousTodos }  // context — onError-da ishlatiladi
    },

    // 2. XATO — eski keshni qaytarish
    onError: (err, todo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },

    // 3. DOIM — server bilan sinxronlash
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}`,
        description: 'Optimistic update 3 qadam: onMutate (eski keshni saqlash + darhol yangilash), onError (rollback), onSettled (server bilan sinxron). UI darhol javob beradi.',
      },
      {
        title: 'useInfiniteQuery — Infinite scroll',
        language: 'tsx',
        code: `import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

interface PostsResponse {
  posts: Post[]
  nextPage: number | null
  totalPages: number
}

function InfinitePostList() {
  const observerRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }): Promise<PostsResponse> => {
      const res = await fetch(\`/api/posts?page=\${pageParam}&limit=10\`)
      return res.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  // Intersection Observer — pastga scroll qilganda avtomatik yuklash
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) return <p>Yuklanmoqda...</p>

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <article key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </article>
          ))}
        </div>
      ))}

      <div ref={observerRef}>
        {isFetchingNextPage && <p>Yana yuklanmoqda...</p>}
      </div>
    </div>
  )
}`,
        description: 'useInfiniteQuery + IntersectionObserver = infinite scroll. data.pages — barcha sahifalar massivi. getNextPageParam — keyingi sahifa raqami yoki undefined (tugadi).',
      },
    ],
    interviewQA: [
      {
        question: 'useMutation nima va useQuery-dan farqi?',
        answer: `useQuery — ma'lumot OLISH (GET), avtomatik chaqiriladi, keshlanadi, stale bo'lganda refetch qiladi. useMutation — ma'lumot O'ZGARTIRISH (POST/PUT/DELETE), qo'lda chaqiriladi (mutate()), keshlanMAYDI. useMutation lifecycle callback-lari bor: onMutate (mutation boshlanganda), onSuccess (muvaffaqiyat), onError (xato), onSettled (har doim). Asosan invalidateQueries bilan birgalikda ishlatiladi — mutation-dan keyin keshni yangilash uchun.`,
      },
      {
        question: 'Optimistic update nima? Qanday amalga oshiriladi?',
        answer: `Optimistic update — server javobini kutmasdan UI-ni darhol yangilash. 3 qadam: 1) onMutate — cancelQueries (concurrent refetch-ni bekor qilish), eski keshni saqlash (rollback uchun), setQueryData bilan keshni darhol yangilash, 2) onError — xato bo'lsa eski keshni qaytarish (rollback), 3) onSettled — har doim invalidateQueries (server bilan sinxronlash). Foydalanuvchi kutmasligi uchun UX yaxshilanadi, lekin server rad etsa rollback bo'lishi kerak.`,
      },
      {
        question: 'invalidateQueries vs setQueryData farqi nima?',
        answer: `invalidateQueries — keshni "stale" (eskirgan) deb belgilaydi va REFETCH qiladi. Server-dan yangi ma'lumot olinadi. Ishonchli, lekin network so'rov kerak. setQueryData — keshni to'g'ridan-to'g'ri yangilaydi, SO'ROV YO'Q. Darhol, lekin server-dan farqli bo'lishi mumkin. Best practice: optimistic update-da setQueryData + onSettled-da invalidateQueries. Oddiy holatda faqat invalidateQueries yetarli. invalidateQueries ierarxik: ['users'] — barcha users query-larni invalidate qiladi.`,
      },
      {
        question: 'useInfiniteQuery qanday ishlaydi?',
        answer: `useInfiniteQuery — pagination va infinite scroll uchun. Oddiy useQuery-dan farqi: ma'lumot pages massivida saqlanadi (har bir sahifa alohida), getNextPageParam — keyingi sahifa parametrini aniqlaydi (null/undefined bo'lsa tugagan). fetchNextPage() — keyingi sahifani yuklaydi. hasNextPage — yana sahifa bormi. data.pages — barcha yuklangan sahifalar massivi. Har bir sahifa alohida keshlanadi. IntersectionObserver bilan "infinite scroll" yoki "Load more" button bilan ishlatiladi.`,
      },
      {
        question: 'Prefetching nima va qachon ishlatiladi?',
        answer: `Prefetching — foydalanuvchi so'ramasdan OLDIN ma'lumotni keshga yuklash. queryClient.prefetchQuery() bilan amalga oshiriladi. Masalan: hover qilganda link-ning ma'lumotini oldindan yuklash — foydalanuvchi bosganda ma'lumot ALLAQACHON keshda. Route o'zgarishida keyingi sahifa ma'lumotini prefetch qilish. staleTime bilan boshqariladi — agar ma'lumot fresh bo'lsa prefetch qilMAYDI. Bu "instant navigation" ta'sirini beradi — UX sezilarli yaxshilanadi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query asoslari' },
      { sectionId: 'react-core', topicId: 'use-optimistic', label: 'useOptimistic (React 19)' },
    ],
  },
  {
    id: 'when-to-use-what',
    title: 'Qachon nima ishlatish',
    importance: 3,
    status: 'to-learn',
    description: 'Local vs Context vs Redux vs Zustand vs Server state',
    content: `State management tanlash — Senior React developer uchun eng muhim arxitektura qarori. Noto'g'ri tanlov — ortiqcha murakkablik yoki yetishmovchilik olib keladi.

═══════════════════════════════════════
  STATE TURLARI
═══════════════════════════════════════

1. LOCAL STATE — bitta komponent ichida
   useState, useReducer
   Misol: form input, modal ochiq/yopiq, toggle

2. LIFTED STATE — bir necha yaqin komponent orasida
   Ota komponentda state, props orqali pastga
   Misol: filter + ro'yxat, form + preview

3. SHARED/GLOBAL STATE — ko'p komponentlar orasida
   Context, Redux, Zustand
   Misol: auth user, tema, savat (cart)

4. SERVER STATE — backenddan kelgan ma'lumotlar
   TanStack Query, RTK Query
   Misol: foydalanuvchilar ro'yxati, mahsulotlar, postlar

5. URL STATE — URL-da saqlanadigan holat
   React Router (useSearchParams, useParams)
   Misol: filtr, sahifa raqami, tab, qidiruv so'zi

6. FORM STATE — forma holati
   React Hook Form, Formik, yoki useState
   Misol: murakkab validatsiya, multi-step formalar

═══════════════════════════════════════
  QAROR DARAXTI (Decision Tree)
═══════════════════════════════════════

State kerakmi?
  ├── Yo'q → oddiy o'zgaruvchi yoki computed value
  └── Ha
      ├── Faqat bitta komponent uchunmi?
      │   └── Ha → useState / useReducer
      ├── URL-da ko'rinishi kerakmi?
      │   └── Ha → useSearchParams / useParams
      ├── Serverdan kelgan datami?
      │   └── Ha → TanStack Query / RTK Query
      ├── Forma datami?
      │   └── Ha → React Hook Form / useState
      ├── 2-3 ta yaqin komponent orasimi?
      │   └── Ha → lift state up (ota komponentga)
      ├── Ko'p komponentlar, kamdan-kam o'zgaradimi?
      │   └── Ha → Context API
      └── Ko'p komponentlar, tez-tez o'zgaradimi?
          ├── Kichik/o'rta ilova → Zustand
          └── Katta ilova, strict pattern kerak → Redux Toolkit

═══════════════════════════════════════
  HAR BIR YECHIMNING KUCHI VA CHEKLOVI
═══════════════════════════════════════

useState / useReducer:
  ✅ Eng oddiy, React built-in
  ✅ Hech narsa o'rnatish kerak emas
  ❌ Komponentlar orasida sharing qiyin
  ❌ Props drilling muammosi

Context API:
  ✅ React built-in, qo'shimcha kutubxona kerak emas
  ✅ Props drilling hal qiladi
  ❌ Re-render muammosi (value o'zgarsa HAR consumer re-render)
  ❌ State management emas — data passing mexanizmi
  ❌ DevTools yo'q

Redux Toolkit:
  ✅ Predictable (one-way data flow)
  ✅ DevTools (time-travel debugging)
  ✅ Katta jamoalarda yaxshi (strict pattern)
  ✅ Middleware tizimi (async, logging)
  ❌ Boilerplate (Zustand-dan ko'p)
  ❌ Bundle kattaroq (~11KB)
  ❌ Kichik ilovalar uchun ortiqcha

Zustand:
  ✅ Minimal boilerplate
  ✅ Kichik bundle (~1KB)
  ✅ Provider kerak emas
  ✅ Selector pattern (performance)
  ❌ DevTools cheklangan (middleware kerak)
  ❌ Strict pattern yo'q (katta jamoalarda tartib qiyin)

TanStack Query:
  ✅ Server state uchun eng yaxshi
  ✅ Keshlash, refetch, retry, pagination
  ✅ Loading/error holatlari tayyor
  ❌ Faqat server state uchun (client state emas)
  ❌ O'rganish egri chizig'i bor

═══════════════════════════════════════
  REAL-WORLD KOMBINATSIYALAR
═══════════════════════════════════════

Kichik ilova (blog, portfolio):
  - useState + useContext(tema) + fetch/useEffect
  - Yoki: useState + TanStack Query

O'rta ilova (dashboard, e-commerce):
  - Zustand (client state) + TanStack Query (server state)
  - Yoki: Redux Toolkit + RTK Query

Katta ilova (enterprise, katta jamoa):
  - Redux Toolkit (client state) + RTK Query (server state)
  - Yoki: Redux Toolkit + TanStack Query

═══════════════════════════════════════
  ENG KO'P XATOLAR
═══════════════════════════════════════

1. Hamma narsani Redux-ga qo'yish
   ❌ Form input, modal holati — bu LOKAL state
   ❌ API data — bu SERVER state (TanStack Query bilan)
   ✅ Redux faqat haqiqiy GLOBAL client state uchun

2. Context-ni state management deb o'ylash
   ❌ Context tez-tez o'zgaradigan data uchun emas
   ✅ Context = kamdan-kam o'zgaradigan data passing

3. Server state-ni client store-da saqlash
   ❌ Redux-da users[] saqlash va qo'lda sync qilish
   ✅ TanStack Query-ga berish — kesh, refetch avtomatik

4. State kerak emas joyda state ishlatish
   ❌ const [fullName, setFullName] = useState(first + last)
   ✅ const fullName = first + ' ' + last (computed value)`,
    codeExamples: [
      {
        title: 'Zamonaviy stack — Zustand + TanStack Query',
        language: 'tsx',
        code: `// ===== CLIENT STATE — Zustand =====
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppStore {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  toggleTheme: () => void
  toggleSidebar: () => void
}

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: true,
      toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'app-settings' }
  )
)

// ===== SERVER STATE — TanStack Query =====
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function ProductList() {
  // Server state — TanStack Query boshqaradi
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Client state — Zustand boshqaradi
  const sidebarOpen = useAppStore(s => s.sidebarOpen)

  if (isLoading) return <p>Yuklanmoqda...</p>

  return (
    <div className={sidebarOpen ? 'with-sidebar' : 'full-width'}>
      {products?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}`,
        description: 'Eng mashhur zamonaviy stack: Zustand — client state (tema, sidebar, UI holati), TanStack Query — server state (API data, kesh). Har biri o\'z ishini qiladi.',
      },
      {
        title: 'State turlari — bir sahifada hammasi',
        language: 'tsx',
        code: `import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { create } from 'zustand'

// 1. URL STATE — filter va sahifa raqami
function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'
  const page = Number(searchParams.get('page') ?? '1')

  // 2. SERVER STATE — TanStack Query
  const { data, isLoading } = useQuery({
    queryKey: ['products', { category, page }],
    queryFn: () => fetchProducts({ category, page }),
  })

  // 3. LOCAL STATE — faqat bu komponent uchun
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 4. GLOBAL STATE — Zustand
  const addToCart = useCartStore(s => s.addItem)

  // Filter o'zgartirish — URL yangilanadi
  function handleCategoryChange(cat: string) {
    setSearchParams({ category: cat, page: '1' })
  }

  // Sahifa o'zgartirish
  function handlePageChange(p: number) {
    setSearchParams({ category, page: String(p) })
  }

  return (
    <div>
      <CategoryFilter value={category} onChange={handleCategoryChange} />
      <ProductGrid
        products={data?.items ?? []}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onAddToCart={addToCart}
      />
      <Pagination page={page} total={data?.totalPages ?? 0} onChange={handlePageChange} />
    </div>
  )
}`,
        description: 'Bitta sahifada 4 xil state turi: URL (filter/page), Server (products), Local (selectedId), Global (cart). Har biri o\'z joyida — bu to\'g\'ri arxitektura.',
      },
      {
        title: 'Anti-pattern va to\'g\'ri yechim',
        language: 'tsx',
        code: `// ❌ ANTI-PATTERN 1: Hamma narsani Redux-ga qo'yish
const badSlice = createSlice({
  name: 'everything',
  initialState: {
    modalOpen: false,        // ❌ LOCAL state bo'lishi kerak
    formData: {},            // ❌ LOCAL state bo'lishi kerak
    users: [],               // ❌ SERVER state — TanStack Query bilan
    searchQuery: '',         // ❌ URL state — useSearchParams bilan
    theme: 'light',          // ✅ Bu global state — Redux/Zustand to'g'ri
  },
  reducers: { /* ... */ },
})

// ✅ TO'G'RI: har bir state o'z joyida
function CorrectComponent() {
  // LOCAL — faqat bu komponent uchun
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({})

  // URL — bookmark/share qilinishi kerak
  const [searchParams] = useSearchParams()
  const search = searchParams.get('q') ?? ''

  // SERVER — kesh + refetch kerak
  const { data: users } = useQuery({
    queryKey: ['users', { search }],
    queryFn: () => fetchUsers(search),
  })

  // GLOBAL — ko'p komponentlar ishlatadi
  const theme = useAppStore(s => s.theme)

  return <div>...</div>
}

// ❌ ANTI-PATTERN 2: Derived state-ni saqlash
function BadComponent() {
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState(0)  // ❌ computed bo'lishi kerak

  function addItem(item: Item) {
    setItems(prev => [...prev, item])
    setTotal(prev => prev + item.price)  // ❌ sinxronizatsiya muammosi
  }
}

// ✅ TO'G'RI: computed value
function GoodComponent() {
  const [items, setItems] = useState<Item[]>([])
  const total = items.reduce((sum, i) => sum + i.price, 0)  // ✅ har doim to'g'ri
}`,
        description: 'Anti-patternlar: 1) Hamma narsani global store-ga qo\'yish, 2) Computed (derived) qiymatni state-da saqlash. Har bir state turi o\'z joyida bo\'lishi kerak.',
      },
    ],
    interviewQA: [
      {
        question: 'React ilovada state management qanday tanlaysiz?',
        answer: `Avval state turini aniqlayman: 1) Local (bitta komponent) → useState/useReducer, 2) URL (bookmark/share kerak) → useSearchParams, 3) Server (API data) → TanStack Query, 4) Form (murakkab validatsiya) → React Hook Form, 5) Shared (2-3 yaqin komponent) → lift state up, 6) Global client (ko'p komponent, kamdan-kam o'zgaradi) → Context, 7) Global client (tez-tez o'zgaradi) → Zustand/Redux. Asosiy printsip: har bir state turini o'z vositasi bilan boshqarish, hamma narsani bitta store-ga qo'yMASLIK.`,
      },
      {
        question: 'Redux vs Zustand vs Context — qachon nima ishlatiladi?',
        answer: `Context — kamdan-kam o'zgaradigan data uchun (tema, til, auth). Har value o'zgarishda barcha consumer-lar re-render. State management emas, data passing. Zustand — kichik-o'rta ilovalar uchun. Minimal boilerplate (~1KB), Provider kerak emas, selector performance. Katta jamoalarda strict pattern yo'qligi muammo. Redux — katta ilovalar va jamoalar uchun. Predictable pattern, DevTools (time-travel), middleware tizimi, strict convention. Boilerplate ko'proq, bundle kattaroq. Qoida: agar Redux keraksiz deb hissangiz — kerak emas. Zustand yetarli.`,
      },
      {
        question: 'Server state va client state ni nima uchun ajratish kerak?',
        answer: `Server state xususiyatlari: source of truth serverda, eskirishi mumkin, boshqa foydalanuvchilar o'zgartirishi mumkin, keshlanishi kerak. Client state xususiyatlari: faqat frontendda, foydalanuvchi boshqaradi, sinxronlash kerak emas. Agar server state-ni Redux-da saqlasangiz: keshni qo'lda boshqarish, stale data muammosi, loading/error state yozish, refetch logikasi — bularni o'zingiz yozishingiz kerak. TanStack Query bularni AVTOMATIK hal qiladi. Ajratish = kam kod, kam xato, yaxshiroq UX.`,
      },
      {
        question: 'URL state nima va qachon ishlatiladi?',
        answer: `URL state — URL-da saqlanadigan holat (query params, path params). Qachon ishlatish kerak: foydalanuvchi bookmark qilishi mumkin bo'lsa (filtr, qidiruv), share qilishi mumkin bo'lsa (link bilan), browser back/forward ishlashi kerak bo'lsa. Masalan: ?category=phones&page=2&sort=price. useSearchParams (React Router) bilan boshqariladi. Bu state React state-ga NUSXALANMASLIGI kerak — URL-dan to'g'ridan-to'g'ri o'qish kerak. URL o'zgarsa — TanStack Query queryKey o'zgaradi — avtomatik refetch.`,
      },
      {
        question: 'Eng ko\'p uchraydigan state management xatolari qanday?',
        answer: `1) Hamma narsani Redux-ga qo'yish — modal holati, form input, API data Redux-da. Aslida: modal = local state, API = TanStack Query. 2) Context-ni state management deb ishlatish — tez-tez o'zgaradigan data Context-da re-render muammosi. 3) Derived state saqlash — total = items.reduce(...) bo'lishi kerak, alohida useState emas. 4) Server state-ni sync qilish — Redux-da users[] saqlash va qo'lda refetch. 5) State kerak emas joyda state — computed value-ni state qilish. Qoida: eng kam state, eng to'g'ri joyda.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'react-core', topicId: 'use-state', label: 'useState (local)' },
      { sectionId: 'react-core', topicId: 'use-reducer', label: 'useReducer (complex local)' },
      { sectionId: 'state-management', topicId: 'context-api', label: 'Context (shared)' },
      { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux (global)' },
      { sectionId: 'state-management', topicId: 'zustand', label: 'Zustand (lightweight global)' },
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query (server)' },
    ],
  },
]
