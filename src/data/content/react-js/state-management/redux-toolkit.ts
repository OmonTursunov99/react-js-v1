import type { Topic } from '../../../types'

export const reduxToolkit: Topic = {
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
      { techId: 'react-js', sectionId: 'state-management', topicId: 'redux-middleware', label: 'Redux Middleware' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'rtk-query', label: 'RTK Query' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Qachon Redux ishlatish' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-sync-external-store', label: 'useSyncExternalStore' },
    ],
  }
