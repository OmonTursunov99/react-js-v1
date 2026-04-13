import type { Topic } from '../../types'

export const useReducer: Topic = {
    id: 'use-reducer',
    title: 'useReducer',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Murakkab state logikasi action-lar bilan',
    content: `useReducer — murakkab state boshqaruvi uchun hook. Redux-ga o'xshash pattern — action dispatch qilasiz, reducer yangi state qaytaradi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const [state, dispatch] = useReducer(reducer, initialState)

- reducer — (state, action) => newState funksiya
- initialState — boshlang'ich state qiymati
- state — hozirgi state
- dispatch — action yuborish funksiyasi

Ixtiyoriy uchinchi argument — lazy initialization:
  const [state, dispatch] = useReducer(reducer, initialArg, init)
  // init(initialArg) — faqat birinchi renderda chaqiriladi

═══════════════════════════════════════
  REDUCER NIMA
═══════════════════════════════════════

Reducer — PURE FUNCTION:
- Kirish: (hozirgi state, action)
- Chiqish: yangi state
- State-ni TO'G'RIDAN-TO'G'RI o'zgartirmaydi
- DOIM yangi state QAYTARADI
- Side effect yo'q (API so'rov, console.log EMAS)

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, count: state.count + 1 }
      case 'DECREMENT':
        return { ...state, count: state.count - 1 }
      case 'RESET':
        return { ...state, count: 0 }
      default:
        return state
    }
  }

MUHIM: reducer KOMPONENTDAN TASHQARIDA joylashishi kerak.
Chunki u pure function — komponent state-ga bog'liq emas.

═══════════════════════════════════════
  useState vs useReducer
═══════════════════════════════════════

useState ishlatish kerak:
  ✅ Oddiy qiymatlar (string, number, boolean)
  ✅ Mustaqil state-lar (bir-biriga bog'liq emas)
  ✅ Oddiy yangilash logikasi (set, toggle)

useReducer ishlatish kerak:
  ✅ Murakkab object state (ko'p field)
  ✅ Bir-biriga BOG'LIQ state-lar
  ✅ Ko'p turdagi yangilanishlar (action-lar)
  ✅ Yangilash logikasi murakkab (if/else, switch)
  ✅ Keyingi state oldingi state-ga bog'liq

Misol — form validation:
  useState bilan — 5-6 ta alohida state + murakkab mantiq
  useReducer bilan — 1 ta state + aniq action-lar

═══════════════════════════════════════
  REDUX BILAN O'XSHASHLIK
═══════════════════════════════════════

useReducer = Redux-ning LOCAL versiyasi:

  Redux pattern:
    store → dispatch(action) → reducer → new state → UI

  useReducer pattern:
    state → dispatch(action) → reducer → new state → re-render

FARQLAR:
- Redux — GLOBAL (butun app uchun bitta store)
- useReducer — LOCAL (faqat shu komponent uchun)
- Redux — middleware bor (thunk, saga)
- useReducer — middleware YO'Q
- Redux — DevTools bor
- useReducer — DevTools YO'Q (lekin yozish mumkin)

═══════════════════════════════════════
  useReducer + useContext
═══════════════════════════════════════

useReducer + useContext = mini Redux:

  // 1. Reducer va Context yaratish
  const AppContext = createContext(...)

  function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <AppContext.Provider value={{ state, dispatch }}>
        {children}
      </AppContext.Provider>
    )
  }

  // 2. Istalgan child-da ishlatish
  const { state, dispatch } = useContext(AppContext)
  dispatch({ type: 'ADD_TODO', payload: { text: 'Yangi' } })

Bu pattern KICHIK loyihalar uchun Redux o'rniga ishlaydi.
Lekin KATTA loyihalarda Redux/Zustand yaxshiroq:
- Performance (Context re-render muammosi)
- DevTools
- Middleware
- Ecosystem

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

Discriminated union — eng kuchli TypeScript pattern:

  // Action tiplar — har biri aniq
  type Action =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_AGE'; payload: number }
    | { type: 'RESET' }

  // Reducer — TypeScript har case-ni tekshiradi
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'SET_NAME':
        // TypeScript biladi: action.payload — string
        return { ...state, name: action.payload }
      case 'SET_AGE':
        // TypeScript biladi: action.payload — number
        return { ...state, age: action.payload }
      case 'RESET':
        // TypeScript biladi: payload YO'Q
        return initialState
    }
  }

Discriminated union FOYDALARI:
- Har action uchun aniq payload tipi
- Noto'g'ri action type yozib bo'lmaydi
- IDE autocomplete ishlaydi
- switch exhaustive check mumkin`,
    codeExamples: [
      {
        title: 'Counter — INCREMENT, DECREMENT, RESET action-lar',
        language: 'tsx' as const,
        code: `import { useReducer } from 'react'

// 1. State va Action tiplari
interface CounterState {
  count: number
  step: number
}

type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'INCREMENT_BY'; payload: number }

// 2. Boshlang'ich state
const initialState: CounterState = { count: 0, step: 1 }

// 3. Reducer — pure function, komponentdan TASHQARIDA
function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + state.step }
    case 'DECREMENT':
      return { ...state, count: state.count - state.step }
    case 'RESET':
      return initialState
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'INCREMENT_BY':
      return { ...state, count: state.count + action.payload }
    default:
      return state
  }
}

// 4. Komponent
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState)

  return (
    <div>
      <p>Hisob: {state.count} (qadam: {state.step})</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'INCREMENT_BY', payload: 10 })}>
        +10
      </button>
      <input
        type="number"
        value={state.step}
        onChange={e => dispatch({ type: 'SET_STEP', payload: Number(e.target.value) })}
      />
    </div>
  )
}`,
        description: `Oddiy counter — lekin useReducer bilan. Ko'p action-lar bo'lganda useReducer aniqroq. dispatch({ type: 'INCREMENT' }) — nima bo'layotgani ANIQ ko'rinadi. TypeScript discriminated union — har action uchun to'g'ri payload tipi.`,
      },
      {
        title: 'Form state — murakkab form boshqaruvi (validation bilan)',
        language: 'tsx' as const,
        code: `import { useReducer } from 'react'

// State tipi
interface FormState {
  values: {
    name: string
    email: string
    password: string
  }
  errors: {
    name?: string
    email?: string
    password?: string
  }
  isSubmitting: boolean
  isValid: boolean
}

// Action tiplari
type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormState['values']; value: string }
  | { type: 'SET_ERROR'; field: keyof FormState['errors']; error: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; errors: FormState['errors'] }
  | { type: 'RESET' }

const initialState: FormState = {
  values: { name: '', email: '', password: '' },
  errors: {},
  isSubmitting: false,
  isValid: false,
}

function validate(values: FormState['values']): FormState['errors'] {
  const errors: FormState['errors'] = {}
  if (!values.name.trim()) errors.name = 'Ism kerak'
  if (!values.email.includes('@')) errors.email = 'Email noto'g'ri'
  if (values.password.length < 6) errors.password = 'Kamida 6 belgi'
  return errors
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD': {
      const newValues = { ...state.values, [action.field]: action.value }
      const errors = validate(newValues)
      return {
        ...state,
        values: newValues,
        errors,
        isValid: Object.keys(errors).length === 0,
      }
    }
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.error } }
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} }
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true }
    case 'SUBMIT_SUCCESS':
      return initialState
    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, errors: action.errors }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function RegistrationForm() {
  const [state, dispatch] = useReducer(formReducer, initialState)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!state.isValid) return

    dispatch({ type: 'SUBMIT_START' })
    try {
      await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(state.values),
      })
      dispatch({ type: 'SUBMIT_SUCCESS' })
    } catch {
      dispatch({ type: 'SUBMIT_ERROR', errors: { name: 'Server xatosi' } })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={state.values.name}
        onChange={e => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
        placeholder="Ism"
      />
      {state.errors.name && <span style={{ color: 'red' }}>{state.errors.name}</span>}

      <input
        value={state.values.email}
        onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
        placeholder="Email"
      />
      {state.errors.email && <span style={{ color: 'red' }}>{state.errors.email}</span>}

      <input
        type="password"
        value={state.values.password}
        onChange={e => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
        placeholder="Parol"
      />
      {state.errors.password && <span style={{ color: 'red' }}>{state.errors.password}</span>}

      <button type="submit" disabled={!state.isValid || state.isSubmitting}>
        {state.isSubmitting ? 'Yuborilmoqda...' : 'Ro'yxatdan o'tish'}
      </button>
      <button type="button" onClick={() => dispatch({ type: 'RESET' })}>
        Tozalash
      </button>
    </form>
  )
}`,
        description: `Murakkab form — useReducer ideal. values, errors, isSubmitting, isValid — barchasi bir state-da. Har bir action aniq: SET_FIELD, SUBMIT_START, SUBMIT_SUCCESS. useState bilan 6-7 ta alohida state kerak bo'lardi.`,
      },
      {
        title: 'useReducer + useContext — mini Redux',
        language: 'tsx' as const,
        code: `import { createContext, useContext, useReducer, type ReactNode } from 'react'

// ===== TIPLAR =====
interface Todo {
  id: number
  text: string
  done: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'done'
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: TodoState['filter'] }
  | { type: 'CLEAR_DONE' }

// ===== REDUCER =====
const initialState: TodoState = {
  todos: [],
  filter: 'all',
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          done: false,
        }],
      }
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      }
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload),
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'CLEAR_DONE':
      return { ...state, todos: state.todos.filter(t => !t.done) }
    default:
      return state
  }
}

// ===== CONTEXT =====
interface TodoContextType {
  state: TodoState
  dispatch: React.Dispatch<TodoAction>
}

const TodoContext = createContext<TodoContextType | null>(null)

function useTodos() {
  const context = useContext(TodoContext)
  if (!context) throw new Error('TodoProvider kerak!')
  return context
}

function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState)
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}

// ===== KOMPONENTLAR =====
function AddTodo() {
  const { dispatch } = useTodos()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('todo') as HTMLInputElement
    if (!input.value.trim()) return
    dispatch({ type: 'ADD_TODO', payload: input.value })
    input.value = ''
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="todo" placeholder="Yangi vazifa..." />
      <button type="submit">Qo'shish</button>
    </form>
  )
}

function TodoList() {
  const { state, dispatch } = useTodos()
  const filtered = state.todos.filter(t => {
    if (state.filter === 'active') return !t.done
    if (state.filter === 'done') return t.done
    return true
  })

  return (
    <div>
      <div>
        {(['all', 'active', 'done'] as const).map(f => (
          <button key={f} onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
            style={{ fontWeight: state.filter === f ? 'bold' : 'normal' }}>
            {f}
          </button>
        ))}
      </div>
      {filtered.map(todo => (
        <div key={todo.id}>
          <span
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
          >
            {todo.text}
          </span>
          <button onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}

// ===== APP =====
function App() {
  return (
    <TodoProvider>
      <h1>Vazifalar</h1>
      <AddTodo />
      <TodoList />
    </TodoProvider>
  )
}`,
        description: `useReducer + useContext = mini Redux. Global state — Context orqali uzatiladi, dispatch orqali boshqariladi. AddTodo va TodoList alohida komponentlar — lekin bir xil state-ga ega. Kichik-o'rta loyihalar uchun Redux o'rniga yetarli.`,
      },
    ],
    interviewQA: [
      {
        question: 'useState vs useReducer — qachon nima ishlatish kerak?',
        answer: `useState — oddiy, mustaqil qiymatlar: counter, toggle, input, boolean flag. useReducer — murakkab, bog'liq state: form (values + errors + isSubmitting), todo list (items + filter), wizard (step + data + validation). Qoida: agar bitta event handler ichida 2-3 ta setState chaqirsangiz — useReducer-ga o'tish vaqti kelgan. useReducer barcha logikani reducer-ga ajratadi — komponent toza qoladi, testing oson bo'ladi.`,
      },
      {
        question: `Reducer pure function bo'lishi nima uchun muhim?`,
        answer: `Pure function — bir xil kirish uchun DOIM bir xil natija qaytaradi va side effect yo'q. Bu muhim chunki: 1) Predictable — har bir action uchun natija aniq, debug oson, 2) Testable — faqat input-output tekshirish yetarli, mock kerak emas, 3) React StrictMode reducer-ni 2 marta chaqirishi mumkin — pure bo'lmasa natija buziladi, 4) Kelajakda React reducer-ni optimize qilishi mumkin (parallel execution). Side effect (API, console.log) reducer ICHIDA emas, useEffect yoki event handler-da bo'lishi kerak.`,
      },
      {
        question: 'useReducer + useContext vs Redux — farqi nima?',
        answer: `useReducer + useContext — kichik loyihalar uchun yetarli: oddiy setup, qo'shimcha kutubxona kerak emas. Lekin kamchiliklari: 1) Context re-render muammosi — value o'zgarganda BARCHA consumer-lar renderlanadi, 2) Middleware yo'q — async logic uchun qo'shimcha kod kerak, 3) DevTools yo'q — debug qiyinroq, 4) Selector yo'q — kerakli qismni ajratib olish imkoni yo'q. Redux/Zustand katta loyihalarda yaxshiroq: selector, middleware, DevTools, ecosystem. Qoida: 5-10 ta component — Context yetarli, 50+ component — Redux/Zustand.`,
      },
      {
        question: 'Lazy initialization — useReducer(reducer, arg, init) nima?',
        answer: `Uchinchi argument — init funksiya. useReducer(reducer, initialArg, init) bo'lsa, boshlang'ich state init(initialArg) natijasi bo'ladi. Faqat BIRINCHI renderda chaqiriladi (lazy). Bu useState(() => value) ga o'xshash. Qachon kerak: 1) Boshlang'ich state hisoblash qimmat bo'lsa (localStorage, complex calculation), 2) RESET action uchun — dispatch({ type: 'RESET' }) da init(initialArg) qayta chaqiriladi. Misol: useReducer(reducer, userId, (id) => loadFromStorage(id)) — faqat 1 marta localStorage o'qiladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'redux-toolkit', label: `Redux Toolkit (o'xshash pattern)` },
      { sectionId: 'state-management', topicId: 'when-to-use-what', label: 'useState vs useReducer' },
      { sectionId: 'react-core', topicId: 'use-context', label: 'useContext bilan birga' },
    ],
  }
