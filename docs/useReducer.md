# useReducer — murakkab state logikasini boshqarish

## useReducer nima?

`useReducer` — `useState` ning kuchliroq versiyasi. State o'zgartirish logikasi murakkab bo'lganda ishlatiladi — barcha o'zgarishlar **bitta funksiya** (reducer) ichida yoziladi.

Vue-dagi **Pinia store** ning action/mutation konsepsiyasiga o'xshaydi. Redux-ning kichik versiyasi.

```tsx
import { useReducer } from 'react'

const [state, dispatch] = useReducer(reducer, initialState)
//      ↑       ↑                      ↑          ↑
//   joriy    action                 logika     boshlang'ich
//   holat   yuboruvchi             funksiya      holat
```

---

## useState vs useReducer — qachon nimani ishlatish

```tsx
// useState — ODDIY state (1-2 ta mustaqil qiymat)
const [count, setCount] = useState(0)
const [name, setName] = useState('')

// useReducer — MURAKKAB state (ko'p bog'liq qiymatlar, ko'p amallar)
const [state, dispatch] = useReducer(reducer, initialState)
```

| | `useState` | `useReducer` |
|---|---|---|
| Qachon | 1-2 ta oddiy qiymat | 3+ bog'liq qiymatlar yoki ko'p amallar |
| O'zgartirish | `setState(newValue)` | `dispatch({ type: 'ACTION' })` |
| Logika qayerda | Komponent ichida tarqalgan | **Bitta reducer** ichida jamlangan |
| Testlash | Qiyin | Oson — reducer oddiy funksiya |
| Vue analogi | `ref()` | Pinia store |

---

## Vue (Pinia) bilan solishtirish

```js
// Vue — Pinia store
export const useServicesStore = defineStore('services', () => {
    const services = ref([
        { id: 1, name: 'SMS xabarnoma', price: 300, active: false },
        { id: 2, name: 'Kutish rejimi', price: 0, active: true },
    ])

    // Actions — o'zgartirish funksiyalari
    function toggle(id) {
        const service = services.value.find(s => s.id === id)
        if (service) service.active = !service.active
    }
    function activateAll() {
        services.value.forEach(s => s.active = true)
    }
    function deactivateAll() {
        services.value.forEach(s => s.active = false)
    }

    return { services, toggle, activateAll, deactivateAll }
})

// Komponentda:
const store = useServicesStore()
store.toggle(1)
store.activateAll()
```

```tsx
// React — useReducer
type Action =
    | { type: 'TOGGLE'; id: number }
    | { type: 'ACTIVATE_ALL' }
    | { type: 'DEACTIVATE_ALL' }

function reducer(state: Service[], action: Action): Service[] {
    switch (action.type) {
        case 'TOGGLE':
            return state.map(s =>
                s.id === action.id ? { ...s, active: !s.active } : s
            )
        case 'ACTIVATE_ALL':
            return state.map(s => ({ ...s, active: true }))
        case 'DEACTIVATE_ALL':
            return state.map(s => ({ ...s, active: false }))
    }
}

// Komponentda:
const [services, dispatch] = useReducer(reducer, initialServices)
dispatch({ type: 'TOGGLE', id: 1 })
dispatch({ type: 'ACTIVATE_ALL' })
```

**Asosiy farqlar:**
- Vue (Pinia): To'g'ridan-to'g'ri o'zgartirish — `service.active = true`
- React: Yangi obyekt qaytarish — `{ ...s, active: true }` (immutability)
- Vue: Funksiya nomi — `store.toggle(1)`
- React: Action obyekt — `dispatch({ type: 'TOGGLE', id: 1 })`

---

## Reducer nima? — tushuntirish

Reducer — **oddiy funksiya**. Eski state va action oladi, yangi state qaytaradi:

```tsx
function reducer(state, action) {
    // state — joriy holat
    // action — nima qilish kerak { type: '...', ...data }
    // return — YANGI holat (eski state O'ZGARTIRILMAYDI)
}
```

Nega "reducer" deyiladi? JavaScript-dagi `Array.reduce()` ga o'xshash — ko'p actionlarni bitta state-ga "kamaytiradi":

```tsx
// Array.reduce
[1, 2, 3].reduce((sum, num) => sum + num, 0)
// 0 → 1 → 3 → 6

// useReducer — actionlar ketma-ketligi
// initialState → TOGGLE → ACTIVATE_ALL → RESET → ...
```

---

## Sintaksis batafsil

### 1. Action type-larni aniqlash

```tsx
// TypeScript discriminated union — har bir action turi
type Action =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'SET'; value: number }       // payload bilan
    | { type: 'RESET' }
```

### 2. Reducer funksiya yozish

```tsx
interface State {
    count: number
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: state.count + 1 }
        case 'DECREMENT':
            return { ...state, count: state.count - 1 }
        case 'SET':
            return { ...state, count: action.value }
        case 'RESET':
            return { count: 0 }
    }
}
```

**Muhim qoidalar:**
1. State ni **o'zgartirMA** — yangi obyekt **qaytar**
2. Har bir case yangi state qaytarishi **shart**
3. Default case kerak emas — TypeScript exhaustive check qiladi

### 3. Komponentda ishlatish

```tsx
function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 })

    return (
        <div>
            <p>{state.count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
            <button onClick={() => dispatch({ type: 'SET', value: 100 })}>100 ga</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
        </div>
    )
}
```

---

## Loyihadagi misol — Xizmatlar sahifasi

```tsx
// src/pages/about/AboutPage.tsx

interface Service {
    id: number
    name: string
    price: number
    active: boolean
}

// 1. Action turlari
type ServiceAction =
    | { type: 'TOGGLE'; id: number }    // bitta xizmatni yoqish/o'chirish
    | { type: 'ACTIVATE_ALL' }          // hammasini yoqish
    | { type: 'DEACTIVATE_ALL' }        // hammasini o'chirish
    | { type: 'RESET' }                 // boshlang'ich holatga qaytarish

// 2. Reducer — BARCHA logika bir joyda
function servicesReducer(state: Service[], action: ServiceAction): Service[] {
    switch (action.type) {
        case 'TOGGLE':
            return state.map(s =>
                s.id === action.id ? { ...s, active: !s.active } : s
            )
        case 'ACTIVATE_ALL':
            return state.map(s => ({ ...s, active: true }))
        case 'DEACTIVATE_ALL':
            return state.map(s => ({ ...s, active: false }))
        case 'RESET':
            return initialServices
    }
}

// 3. Komponentda ishlatish
export default function AboutPage() {
    const [services, dispatch] = useReducer(servicesReducer, initialServices)

    // Hisoblangan qiymatlar (Vue-dagi computed ga o'xshash)
    const activeCount = services.filter(s => s.active).length
    const totalPrice = services.filter(s => s.active).reduce((sum, s) => sum + s.price, 0)

    return (
        <div>
            {/* Amallar — dispatch orqali */}
            <button onClick={() => dispatch({ type: 'ACTIVATE_ALL' })}>
                Hammasini yoqish
            </button>
            <button onClick={() => dispatch({ type: 'DEACTIVATE_ALL' })}>
                Hammasini o'chirish
            </button>
            <button onClick={() => dispatch({ type: 'RESET' })}>
                Qaytarish
            </button>

            {/* Ro'yxat */}
            {services.map(service => (
                <div key={service.id}>
                    <span>{service.name}</span>
                    <button onClick={() => dispatch({ type: 'TOGGLE', id: service.id })}>
                        {service.active ? 'Yoqilgan' : 'Yoqish'}
                    </button>
                </div>
            ))}
        </div>
    )
}
```

---

## useReducer + useContext — global state

`useReducer` faqat bitta komponent ichida ishlaydi. Butun ilovada ishlatish uchun `useContext` bilan birlashtiriladi:

```tsx
// 1. Context yaratish
const ServicesContext = createContext<{
    services: Service[]
    dispatch: React.Dispatch<ServiceAction>
} | null>(null)

// 2. Provider
function ServicesProvider({ children }: { children: React.ReactNode }) {
    const [services, dispatch] = useReducer(servicesReducer, initialServices)

    const value = useMemo(() => ({ services, dispatch }), [services])

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    )
}

// 3. Custom hook
function useServices() {
    const context = useContext(ServicesContext)
    if (!context) throw new Error('useServices must be used within ServicesProvider')
    return context
}

// 4. Istalgan komponentda
function AnyComponent() {
    const { services, dispatch } = useServices()
    dispatch({ type: 'TOGGLE', id: 1 })
}
```

Vue analogi — aynan Pinia:
```js
// Pinia — global, istalgan komponentda
const store = useServicesStore()
store.toggle(1)
```

---

## Lazy initialization — qimmat boshlang'ich holat

Agar boshlang'ich holat hisoblashni talab qilsa:

```tsx
// ODDIY — har renderda hisoblanmaydi (faqat birinchisida)
const [state, dispatch] = useReducer(reducer, initialState)

// LAZY — funksiya bilan (qimmat hisoblash uchun)
function init(initialCount: number) {
    // localStorage dan o'qish, hisoblash va h.k.
    return { count: initialCount, history: [] }
}

const [state, dispatch] = useReducer(reducer, 0, init)
//                                           ↑    ↑
//                                     argument  init funksiya
// init(0) faqat birinchi renderda chaqiriladi
```

---

## dispatch xususiyatlari

### dispatch stabil reference

```tsx
const [state, dispatch] = useReducer(reducer, initialState)
// dispatch HECH QACHON o'zgarmaydi — useCallback kerak emas

// Bola komponentga berishda React.memo ishlaydi
<ChildComponent onAction={dispatch} />
// dispatch stabil → ChildComponent keraksiz qayta render bo'lMaydi
```

Bu `useState`-dan farqi — `setState` ham stabil, lekin ko'pincha `() => setState(...)` wrapper yoziladi (yangi reference).

### dispatch sinxron emas

```tsx
dispatch({ type: 'INCREMENT' })
console.log(state.count)  // ESKI qiymat! (useState bilan bir xil)
// Yangi qiymat keyingi renderda ko'rinadi
```

---

## useState bilan bir xil natija

Har qanday `useReducer` ni `useState` bilan yozish mumkin va aksincha:

```tsx
// useReducer bilan
function reducer(state, action) {
    switch (action.type) {
        case 'TOGGLE': return state.map(s => s.id === action.id ? { ...s, active: !s.active } : s)
        case 'ACTIVATE_ALL': return state.map(s => ({ ...s, active: true }))
    }
}
const [services, dispatch] = useReducer(reducer, initialServices)
dispatch({ type: 'TOGGLE', id: 1 })
```

```tsx
// useState bilan — logika tarqalgan
const [services, setServices] = useState(initialServices)

function toggle(id) {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s))
}
function activateAll() {
    setServices(prev => prev.map(s => ({ ...s, active: true })))
}
toggle(1)
```

**Farq:** `useReducer` da logika **bitta joyda** (reducer ichida). `useState` da logika **tarqalgan** (har bir funksiyada).

---

## Qachon useReducer KERAK

### KERAK ✅

```tsx
// 1. Ko'p amallar — TOGGLE, ADD, REMOVE, RESET, SORT, FILTER...
// Reducer ichida barcha logika jamlangan, topish oson

// 2. Bog'liq state — bitta action bir nechta qiymatni o'zgartiradi
case 'SUBMIT_FORM':
    return { ...state, loading: true, error: null, submitted: true }

// 3. Oldingi state-ga bog'liq murakkab yangilanish
case 'TOGGLE':
    return state.map(item =>
        item.id === action.id ? { ...item, active: !item.active } : item
    )

// 4. Testlash kerak — reducer oddiy funksiya, import qilib test qilish oson
expect(reducer({ count: 0 }, { type: 'INCREMENT' })).toEqual({ count: 1 })
```

### KERAK EMAS ❌

```tsx
// 1. Oddiy toggle
const [isOpen, setIsOpen] = useState(false)
// useReducer ortiqcha

// 2. Oddiy input
const [name, setName] = useState('')
// useReducer ortiqcha

// 3. 1-2 ta mustaqil qiymat
const [count, setCount] = useState(0)
const [name, setName] = useState('')
// Bir-biriga bog'liq emas — useState yetarli
```

---

## Suhbatda so'raladigan savollar

### 1. "useReducer nima va useState dan farqi?"

useReducer — murakkab state logikasini bitta reducer funksiyaga jamlaydi. useState da logika komponent ichida tarqaladi. useReducer ko'p amallar (TOGGLE, ADD, REMOVE) va bog'liq state uchun yaxshi. useState oddiy, mustaqil qiymatlar uchun.

### 2. "Reducer nima?"

Pure function — eski state va action oladi, yangi state qaytaradi. Hech qanday side effect yo'q (API, localStorage, random). Faqat hisoblash.

```tsx
// Pure ✅
function reducer(state, action) {
    return { ...state, count: state.count + 1 }
}

// Impure ❌
function reducer(state, action) {
    localStorage.setItem('count', state.count)  // side effect!
    return { ...state, count: Math.random() }   // random!
}
```

### 3. "useReducer va Redux farqi?"

| | `useReducer` | Redux / Zustand |
|---|---|---|
| Scope | Bitta komponent (+ useContext bilan global) | Global |
| Middleware | Yo'q | Bor (thunk, saga, persist) |
| DevTools | Yo'q | Bor |
| Boilerplate | Kam | Ko'proq (Redux), kam (Zustand) |
| Qachon | Bitta sahifa state | Butun ilova state |

### 4. "dispatch qanday ishlaydi?"

`dispatch({ type: 'ACTION' })` chaqirilganda React:
1. Reducer-ni chaqiradi: `reducer(currentState, action)`
2. Yangi state-ni oladi
3. Eski va yangi state-ni `Object.is()` bilan solishtiradi
4. Farq bo'lsa — komponent qayta render bo'ladi

### 5. "Nega action obyekt, funksiya emas?"

Action obyekt bo'lgani uchun:
1. **Serializatsiya** mumkin — JSON ga aylantirish, logging
2. **Replay** mumkin — actionlarni qayta ijro etish (time-travel debugging)
3. **Testlash** oson — reducer(state, action) = expected
4. Redux DevTools ishlaydi

### 6. "useReducer da asinxron amallar qanday qilinadi?"

Reducer ichida async bo'la olmaydi. Dispatch-dan oldin yoki keyin:

```tsx
async function handleSubmit() {
    dispatch({ type: 'LOADING' })
    try {
        const data = await fetchData()
        dispatch({ type: 'SUCCESS', data })
    } catch (error) {
        dispatch({ type: 'ERROR', error: error.message })
    }
}
```

Vue (Pinia) da action ichida async yozish mumkin — React-da reducer **pure** bo'lishi kerak.

### 7. "Vue Pinia va React useReducer + useContext farqi?"

| | Pinia | useReducer + useContext |
|---|---|---|
| Setup | `defineStore()` — oddiy | Context + Reducer + Provider — ko'p boilerplate |
| Mutatsiya | To'g'ridan-to'g'ri `state.value = x` | Yangi obyekt qaytarish (immutable) |
| Action | Oddiy funksiya — `store.toggle()` | Dispatch — `dispatch({ type: 'TOGGLE' })` |
| Async | Action ichida | Reducer **tashqarisida** |
| DevTools | Vue DevTools | Yo'q (Redux DevTools faqat Redux uchun) |
| Performance | Proxy — faqat o'zgargan qism | Context — barcha subscriber qayta render |

Pinia ancha sodda va qulay. React-da shu sabab ko'p odamlar **Zustand** ishlatadi — u Pinia-ga juda o'xshash.

---

## Xulosa

| Xususiyat | React `useReducer` | Vue analogi |
|---|---|---|
| Maqsad | Murakkab state logikasi | Pinia store |
| O'zgartirish | `dispatch({ type, ...payload })` | `store.action()` |
| Logika | Reducer funksiya (switch/case) | Store actions |
| Immutability | Ha — yangi obyekt qaytarish | Yo'q — to'g'ridan-to'g'ri |
| Pure | Ha — side effect yo'q | Yo'q — async mumkin |
| Global | useContext bilan | Avtomatik global |
| Testlash | `reducer(state, action) === expected` | Store test |
