# Redux Toolkit — global state boshqarish

## Redux nima?

Redux — React ilovalarda **global state** boshqarish kutubxonasi. Redux Toolkit (RTK) — Redux-ning rasmiy, zamonaviy versiyasi. Eski "vanilla Redux" ga qaraganda ancha sodda.

Vue-dagi **Pinia** ning to'g'ridan-to'g'ri analogi.

## O'rnatish

```bash
yarn add @reduxjs/toolkit react-redux
```

---

## Pinia bilan solishtirish — umumiy

```js
// Vue — Pinia
export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    function increment() { count.value++ }
    function decrement() { count.value-- }
    return { count, increment, decrement }
})

// Komponentda:
const store = useCounterStore()
store.increment()
```

```tsx
// React — Redux Toolkit
const counterSlice = createSlice({
    name: 'counter',
    initialState: { count: 0 },
    reducers: {
        increment(state) { state.count++ },
        decrement(state) { state.count-- },
    },
})

// Komponentda:
const count = useAppSelector(state => state.counter.count)
const dispatch = useAppDispatch()
dispatch(increment())
```

| | Pinia (Vue) | Redux Toolkit (React) |
|---|---|---|
| Store yaratish | `defineStore()` | `createSlice()` + `configureStore()` |
| State o'qish | `store.count` | `useSelector(state => state.counter.count)` |
| State o'zgartirish | `store.increment()` | `dispatch(increment())` |
| Mutatsiya | To'g'ridan-to'g'ri | Immer orqali to'g'ridan-to'g'ri (ichida immutable) |
| Async | Action ichida | `createAsyncThunk` yoki middleware |
| DevTools | Vue DevTools | Redux DevTools |

---

## Asosiy tushunchalar

### 1. Slice — state bo'lagi

Slice — bitta feature uchun state + reducerlar. Pinia-ning bitta store-ga o'xshash:

```tsx
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: 'counter',          // Slice nomi (action prefix)
    initialState: { count: 0 }, // Boshlang'ich holat

    reducers: {
        // Har bir reducer — bitta action
        increment(state) {
            state.count++      // Immer tufayli to'g'ridan-to'g'ri o'zgartirish mumkin
        },
        decrement(state) {
            state.count--
        },
        incrementBy(state, action: PayloadAction<number>) {
            state.count += action.payload  // payload — tashqi ma'lumot
        },
        reset(state) {
            state.count = 0
        },
    },
})

// Action creatorlar avtomatik yaratiladi
export const { increment, decrement, incrementBy, reset } = counterSlice.actions

// Reducer — store-ga ulash uchun
export default counterSlice.reducer
```

### 2. Store — barcha slice-larni birlashtirish

```tsx
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import userReducer from './userSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,   // state.counter
        user: userReducer,         // state.user
    },
})

// TypeScript tipalari
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

Pinia analogi:
```js
// Pinia — har bir store alohida, birlashtirish kerak emas
const counterStore = useCounterStore()
const userStore = useUserStore()
```

### 3. Provider — ilovaga ulash

```tsx
import { Provider } from 'react-redux'
import { store } from './store'

function App() {
    return (
        <Provider store={store}>
            <RouterProvider />
        </Provider>
    )
}
```

Pinia analogi:
```js
// Vue
app.use(createPinia())
```

### 4. Typed hooklar

```tsx
import { useDispatch, useSelector } from 'react-redux'

// Har safar type yozmaslik uchun — typed versiyalar
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

---

## Loyihadagi misol — Internet paketlar

### Slice

```tsx
// src/app/store/internetPackagesSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface InternetPackage {
    id: number
    name: string
    gb: number
    price: number
    duration: string
    active: boolean
}

const initialState: InternetPackage[] = [
    { id: 1, name: 'Kunlik 1 GB', gb: 1, price: 3000, duration: '1 kun', active: false },
    { id: 2, name: 'Haftalik 5 GB', gb: 5, price: 12000, duration: '7 kun', active: false },
    // ...
]

const internetPackagesSlice = createSlice({
    name: 'internetPackages',
    initialState,
    reducers: {
        togglePackage(state, action: PayloadAction<number>) {
            const pkg = state.find(p => p.id === action.payload)
            if (pkg) pkg.active = !pkg.active
            // Immer — to'g'ridan-to'g'ri o'zgartirish mumkin!
            // Pinia ga o'xshash — lekin ichida immutable
        },
        deactivateAll(state) {
            state.forEach(p => p.active = false)
        },
    },
})

export const { togglePackage, deactivateAll } = internetPackagesSlice.actions
export default internetPackagesSlice.reducer
```

### Sahifada ishlatish

```tsx
// src/pages/internet-packages/InternetPackagesPage.tsx
import { useAppSelector, useAppDispatch } from '../../app/store'
import { togglePackage, deactivateAll } from '../../app/store/internetPackagesSlice'

export default function InternetPackagesPage() {
    // useSelector — store-dan ma'lumot O'QISH (Pinia: store.packages)
    const packages = useAppSelector(state => state.internetPackages)

    // useDispatch — action YUBORISH (Pinia: store.toggle())
    const dispatch = useAppDispatch()

    return (
        <div>
            {packages.map(pkg => (
                <button
                    key={pkg.id}
                    onClick={() => dispatch(togglePackage(pkg.id))}
                >
                    {pkg.name} — {pkg.active ? 'Faol' : 'Ulash'}
                </button>
            ))}
            <button onClick={() => dispatch(deactivateAll())}>
                Hammasini o'chirish
            </button>
        </div>
    )
}
```

---

## Immer — Redux-ning "sehri"

### Immer nima?

Immer — JavaScript kutubxonasi, **immutable** yangilanishni **mutable** sintaksisda yozishga imkon beradi. Redux Toolkit ichida o'rnatilgan.

**Muammo — immutable yangilash qiyin:**

```tsx
// Immutable — qo'lda yangi obyekt yaratish (Immer-siz)
// 3 ta daraja ichidagi qiymatni o'zgartirish uchun:
const newState = {
    ...state,
    users: {
        ...state.users,
        list: state.users.list.map(user =>
            user.id === 1
                ? { ...user, address: { ...user.address, city: 'Toshkent' } }
                : user
        )
    }
}
// 8 qator — faqat bitta city o'zgartirish uchun!
```

**Yechim — Immer bilan:**

```tsx
// Mutable sintaksis — Immer ichida immutable qilib beradi
state.users.list.find(u => u.id === 1).address.city = 'Toshkent'
// 1 qator — bir xil natija
```

### Immer qanday ishlaydi?

```
1. Immer state-ning "draft" (qoralama) nusxasini yaratadi
2. Siz draft-ni to'g'ridan-to'g'ri o'zgartirasiz
3. Immer o'zgarishlarni kuzatib, YANGI immutable obyekt yaratadi
4. Eski state O'ZGARMAGAN qoladi
```

```tsx
import { produce } from 'immer'

const original = { name: 'Ali', age: 25 }

const updated = produce(original, draft => {
    draft.name = 'Vali'   // draft-ni o'zgartirish
})

console.log(original)  // { name: 'Ali', age: 25 }  — O'ZGARMAGAN
console.log(updated)   // { name: 'Vali', age: 25 } — YANGI obyekt
console.log(original === updated)  // false
```

### Redux Toolkit-da Immer

`createSlice` reducer-lari avtomatik Immer bilan o'ralgan:

```tsx
const slice = createSlice({
    name: 'users',
    initialState: {
        list: [
            { id: 1, name: 'Ali', address: { city: 'Samarqand' } },
            { id: 2, name: 'Vali', address: { city: 'Buxoro' } },
        ],
        selectedId: null as number | null,
    },
    reducers: {
        // VARIANT 1: To'g'ridan-to'g'ri o'zgartirish (Immer)
        // Immer yangi obyekt yaratib beradi
        updateCity(state, action: PayloadAction<{ id: number; city: string }>) {
            const user = state.list.find(u => u.id === action.payload.id)
            if (user) user.address.city = action.payload.city
        },

        // VARIANT 2: Yangi qiymat qaytarish (Immer-siz, oddiy Redux)
        // return yozsangiz — Immer ishlatilMAYDI
        resetUsers(state) {
            return { ...state, list: [], selectedId: null }
        },

        // Massiv operatsiyalari — Immer bilan oson
        addUser(state, action: PayloadAction<{ id: number; name: string }>) {
            state.list.push({
                ...action.payload,
                address: { city: 'Noma\'lum' },
            })
        },
        removeUser(state, action: PayloadAction<number>) {
            const index = state.list.findIndex(u => u.id === action.payload)
            if (index !== -1) state.list.splice(index, 1)
        },
    },
})
```

### Immer bilan vs Immer-siz

```tsx
// Immer BILAN (Redux Toolkit) — oddiy, o'qish oson
addItem(state, action) {
    state.items.push(action.payload)
}
removeItem(state, action) {
    const i = state.items.findIndex(x => x.id === action.payload)
    if (i !== -1) state.items.splice(i, 1)
}
updateItem(state, action) {
    const item = state.items.find(x => x.id === action.payload.id)
    if (item) item.name = action.payload.name
}

// Immer-SIZ (eski Redux) — murakkab, xatoga moyil
addItem(state, action) {
    return { ...state, items: [...state.items, action.payload] }
}
removeItem(state, action) {
    return { ...state, items: state.items.filter(x => x.id !== action.payload) }
}
updateItem(state, action) {
    return {
        ...state,
        items: state.items.map(x =>
            x.id === action.payload.id ? { ...x, name: action.payload.name } : x
        ),
    }
}
```

### Immer qoidalari

```tsx
reducers: {
    // ✅ TO'G'RI — state-ni o'zgartirish (Immer boshqaradi)
    good1(state) {
        state.count++
    },

    // ✅ TO'G'RI — yangi state qaytarish (Immer ishlatilmaydi)
    good2(state) {
        return { ...state, count: 0 }
    },

    // ❌ NOTO'G'RI — ikkalasi birga bo'lMASligi kerak!
    bad(state) {
        state.count++           // o'zgartirish
        return { count: 0 }    // qaytarish — XATO!
    },
}
```

**Vue Pinia bilan solishtirish:**
- Pinia: Proxy bilan **haqiqiy** to'g'ridan-to'g'ri o'zgartirish
- Redux + Immer: **Ko'rinishda** to'g'ridan-to'g'ri, aslida yangi obyekt yaratiladi
- Natija bir xil — lekin mexanizm boshqa

---

## Redux + TanStack Query — birga ishlash

Redux — **client state** (UI holat, paketlar, savat).
TanStack Query — **server state** (API dan keladigan ma'lumotlar).

Loyihadagi misol — ob-havo:

```tsx
// features/weather/useWeather.ts — TanStack Query bilan API
import { useQuery } from '@tanstack/react-query'

export function useWeather() {
    return useQuery({
        queryKey: ['weather', 'tashkent'],
        queryFn: async () => {
            const res = await fetch('https://wttr.in/Tashkent?format=j1')
            const data = await res.json()
            return {
                temp: data.current_condition[0].temp_C,
                description: data.current_condition[0].weatherDesc[0].value,
                humidity: data.current_condition[0].humidity,
                wind: data.current_condition[0].windspeedKmph,
            }
        },
        staleTime: 30 * 60 * 1000,
    })
}

// Header-da ishlatish:
const { data: weather, isLoading, error } = useWeather()
```

**Qachon nimani ishlatish:**

| Ma'lumot turi | Vosita | Misol |
|---|---|---|
| Client state | **Redux** | Internet paketlar, savat, filtrlar, UI holat |
| Server state | **TanStack Query** | Ob-havo API, foydalanuvchilar, mahsulotlar |

Redux-da API natijalarni saqlash **kerak emas** — TanStack Query o'zi keshlaydi.

---

## Middleware — dispatch va reducer orasidagi "o'rtachi"

### Middleware nima?

Middleware — action dispatch bo'lgandan keyin, reducer-ga yetib borishdan **oldin** ishlaydi. U action-ni kuzatish, o'zgartirish, bloklash yoki qo'shimcha logika qilish uchun ishlatiladi.

```
dispatch(action) → [Middleware 1] → [Middleware 2] → [Middleware 3] → Reducer → Yangi state
```

Vue-da analogi — **Pinia plugins** yoki **Axios interceptors** ga o'xshash.

### Redux Toolkit default middleware-lari

`configureStore` avtomatik 3 ta middleware qo'shadi:

```tsx
const store = configureStore({
    reducer: { ... },
    // Bu avtomatik qo'shiladi:
    // middleware: [thunk, immutableCheck, serializableCheck]
})
```

| Middleware | Nima qiladi |
|---|---|
| `thunk` | Funksiya dispatch qilishga ruxsat beradi (async uchun) |
| `immutableCheck` | State to'g'ridan-to'g'ri o'zgartirilganini tekshiradi (dev only) |
| `serializableCheck` | State-da serialize bo'lmaydigan qiymatlar borligini tekshiradi (dev only) |

### Custom middleware yozish

```tsx
import type { Middleware } from '@reduxjs/toolkit'

// 1. Logger middleware — har bir action-ni konsolga yozadi
const loggerMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    console.log('Action:', action)
    console.log('Oldingi state:', storeAPI.getState())

    const result = next(action)  // action-ni reducer-ga uzatadi

    console.log('Yangi state:', storeAPI.getState())
    return result
}

// 2. Analytics middleware — ba'zi actionlarni tracking qiladi
const analyticsMiddleware: Middleware = () => (next) => (action) => {
    if (typeof action === 'object' && action !== null && 'type' in action) {
        const typedAction = action as { type: string }
        if (typedAction.type === 'internetPackages/togglePackage') {
            console.log('Analytics: paket ulandi/o\'chirildi')
            // analytics.track('package_toggled', action.payload)
        }
    }
    return next(action)
}

// 3. Store-ga ulash
const store = configureStore({
    reducer: { ... },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(loggerMiddleware)
            .concat(analyticsMiddleware),
})
```

### Middleware oqimi — batafsil

```tsx
// dispatch(togglePackage(1)) chaqirilganda:

// 1. thunk middleware — funksiya emasligini tekshiradi → o'tkazadi
// 2. loggerMiddleware — "Action: togglePackage(1)" konsolga yozadi
// 3. analyticsMiddleware — "package_toggled" tracking qiladi
// 4. immutableCheck — oldingi state-ni eslab oladi
// 5. Reducer — yangi state hisoblaydi
// 6. immutableCheck — eski state o'zgarmaganini tekshiradi
// 7. serializableCheck — yangi state serialize bo'lishini tekshiradi
// 8. useSelector — o'zgargan komponentlarni qayta render qiladi
```

### Thunk middleware — async dispatch

Thunk — eng muhim middleware. Oddiy action obyekt o'rniga **funksiya** dispatch qilishga ruxsat beradi:

```tsx
// Oddiy action — obyekt
dispatch({ type: 'increment' })

// Thunk action — funksiya (async mumkin)
dispatch(async (dispatch, getState) => {
    const state = getState()
    const data = await fetch('/api/users')
    dispatch(setUsers(await data.json()))
})
```

Thunk `configureStore` da avtomatik yoqilgan — alohida o'rnatish kerak emas.

### Pinia bilan solishtirish

```js
// Vue — Pinia plugin (middleware analogi)
const myPlugin = ({ store }) => {
    store.$onAction(({ name, args, after }) => {
        console.log(`Action: ${name}`, args)
        after(() => {
            console.log('Action tugadi, yangi state:', store.$state)
        })
    })
}

const pinia = createPinia()
pinia.use(myPlugin)
```

---

## createAsyncThunk — Redux bilan async (to'liq)

### createAsyncThunk nima?

`createAsyncThunk` — API so'rov kabi asinxron operatsiyalar uchun. U avtomatik 3 ta action yaratadi:
- `pending` — so'rov boshlandi (loading: true)
- `fulfilled` — muvaffaqiyatli (data keldi)
- `rejected` — xato (error)

### Oddiy misol

```tsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// 1. Async thunk yaratish
export const fetchPackages = createAsyncThunk(
    'packages/fetch',     // Action type prefix
    async () => {
        const res = await fetch('/api/packages')
        if (!res.ok) throw new Error('Server xatosi')
        return res.json() // Bu fulfilled action-ning payload-i bo'ladi
    }
)

// 2. Slice-da extraReducers bilan ulash
interface PackagesState {
    items: Package[]
    loading: boolean
    error: string | null
}

const initialState: PackagesState = {
    items: [],
    loading: false,
    error: null,
}

const packagesSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // So'rov boshlandi
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true
                state.error = null
            })
            // Muvaffaqiyatli
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            // Xato
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? 'Noma\'lum xato'
            })
    },
})

// 3. Komponentda dispatch
export default function PackagesPage() {
    const { items, loading, error } = useAppSelector(state => state.packages)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchPackages())
    }, [dispatch])

    if (loading) return <p>Yuklanmoqda...</p>
    if (error) return <p>Xato: {error}</p>

    return items.map(pkg => <div key={pkg.id}>{pkg.name}</div>)
}
```

### Parametr bilan

```tsx
// Argument berish
export const fetchUserById = createAsyncThunk(
    'users/fetchById',
    async (userId: number) => {    // ← argument
        const res = await fetch(`/api/users/${userId}`)
        return res.json()
    }
)

// Dispatch
dispatch(fetchUserById(42))
// → fetchUserById.pending  { payload: undefined }
// → fetchUserById.fulfilled { payload: { id: 42, name: 'Ali' } }
```

### Xatoni boshqarish — rejectWithValue

```tsx
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            })

            if (!res.ok) {
                const error = await res.json()
                // rejectWithValue — o'z xato ma'lumotingizni uzatish
                return rejectWithValue(error.message)
            }

            return res.json()
        } catch (err) {
            return rejectWithValue('Tarmoq xatosi')
        }
    }
)

// Slice-da
.addCase(loginUser.rejected, (state, action) => {
    state.loading = false
    // action.payload — rejectWithValue dan kelgan ma'lumot
    state.error = (action.payload as string) ?? action.error.message ?? 'Xato'
})
```

### thunkAPI — to'liq imkoniyatlar

```tsx
export const complexAction = createAsyncThunk(
    'complex/action',
    async (arg: string, thunkAPI) => {
        // thunkAPI ichida:
        const state = thunkAPI.getState() as RootState  // Joriy state
        const dispatch = thunkAPI.dispatch               // Boshqa action dispatch
        const signal = thunkAPI.signal                   // AbortController signal

        // Boshqa action dispatch qilish
        dispatch(setLoading(true))

        // State-dan o'qish
        const token = state.auth.token

        // So'rov (abort qilish mumkin)
        const res = await fetch(`/api/data?q=${arg}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal, // Abort uchun
        })

        return res.json()
    }
)

// So'rovni bekor qilish
const promise = dispatch(complexAction('test'))
promise.abort()  // So'rov bekor bo'ladi → rejected action
```

### createAsyncThunk lifecycle

```
dispatch(fetchPackages())
    │
    ├── fetchPackages.pending   → { loading: true, error: null }
    │
    ├── API so'rov...
    │
    ├── Muvaffaqiyat:
    │   └── fetchPackages.fulfilled → { loading: false, items: [...] }
    │
    └── Xato:
        └── fetchPackages.rejected  → { loading: false, error: 'Xato' }
```

### Pinia bilan solishtirish — async

```js
// Vue — Pinia (SODDA)
const store = defineStore('packages', () => {
    const items = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchPackages() {
        loading.value = true
        error.value = null
        try {
            const res = await fetch('/api/packages')
            items.value = await res.json()
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return { items, loading, error, fetchPackages }
})

// Komponentda:
const store = usePackagesStore()
store.fetchPackages()
```

```tsx
// React — Redux createAsyncThunk (KO'P BOILERPLATE)
// 1. createAsyncThunk yozish
// 2. extraReducers-da 3 ta case yozish (pending, fulfilled, rejected)
// 3. dispatch(fetchPackages()) chaqirish
```

**Xulosa:** Pinia-da async — oddiy `async function`. Redux-da — `createAsyncThunk` + `extraReducers` + 3 ta case. Shuning uchun ko'p React dasturchilari API uchun **TanStack Query** ishlatadi — `createAsyncThunk` kerak emas.

### createAsyncThunk vs TanStack Query

| | `createAsyncThunk` | TanStack Query |
|---|---|---|
| Keshlash | Yo'q — qo'lda qilish kerak | Avtomatik `queryKey` bo'yicha |
| Loading/error | Qo'lda 3 ta case (pending/fulfilled/rejected) | Avtomatik `isLoading`, `error` |
| Retry | Yo'q | Avtomatik 3 marta |
| Refetch | Qo'lda | Tab focus, reconnect avtomatik |
| Boilerplate | Ko'p | Kam |
| Qachon ishlatish | API natijasi Redux state-ga kerak bo'lganda | Ko'p hollarda yaxshiroq |

---

## useReducer vs Redux — farq

| | `useReducer` | Redux Toolkit |
|---|---|---|
| Scope | Bitta komponent | **Butun ilova** (global) |
| DevTools | Yo'q | **Redux DevTools** |
| Middleware | Yo'q | Bor (thunk, listener) |
| Immer | Yo'q — qo'lda immutable | **Bor** — to'g'ridan-to'g'ri o'zgartirish |
| Async | Tashqarida | `createAsyncThunk` |
| Boilerplate | Kam | Biroz ko'proq |
| Qachon | Bitta sahifa ichida | Bir nechta sahifa/komponent ulashadi |

---

## FSD-da Redux qayerga qo'yiladi

```
src/
  app/
    store/
      index.ts                    ← configureStore + typed hooklar
      internetPackagesSlice.ts    ← Internet paketlar slice
      userSlice.ts                ← User slice (kerak bo'lsa)
    providers/
      StoreProvider.tsx           ← <Provider store={store}>
```

---

## Suhbatda so'raladigan savollar

### 1. "Redux nima va nega kerak?"

Global state boshqarish kutubxonasi. Kerak chunki React-da komponentlar orasida ma'lumot ulashish qiyin (prop drilling). Redux barcha state-ni bitta store-da saqlaydi, istalgan komponent olishi mumkin.

### 2. "Redux Toolkit va eski Redux farqi?"

| | Eski Redux | Redux Toolkit (RTK) |
|---|---|---|
| Boilerplate | Juda ko'p (action types, action creators, reducers alohida) | Kam — `createSlice` hammani birlashtiradi |
| Immer | Yo'q — qo'lda immutable | Bor — to'g'ridan-to'g'ri o'zgartirish |
| Store setup | `createStore` + middleware qo'lda | `configureStore` — hammasi tayyor |
| Async | redux-thunk qo'lda o'rnatish | `createAsyncThunk` tayyor |

RTK — Redux-ning rasmiy, zamonaviy versiyasi. Eski Redux ishlatish tavsiya qilinmaydi.

### 3. "Redux va Zustand farqi?"

| | Redux Toolkit | Zustand |
|---|---|---|
| Hajmi | ~12kb | ~1kb |
| Boilerplate | O'rtacha | Juda kam |
| DevTools | Bor | Bor |
| Middleware | Ko'p | Kam |
| Pinia-ga o'xshash | Yo'q | **Ha** — juda o'xshash |
| Qachon | Katta loyihalar, jamoa | Kichik-o'rta loyihalar |

### 4. "useSelector qanday ishlaydi?"

`useSelector(fn)` — store-dan ma'lumot tanlaydi. Store o'zgarganda React solishtiriladi — agar tanlangan qism o'zgargan bo'lsa, komponent qayta render bo'ladi. O'zgarmagan bo'lsa — qayta render yo'q.

```tsx
// Faqat internetPackages o'zgarganda qayta render
const packages = useAppSelector(state => state.internetPackages)
```

### 5. "dispatch nima?"

Action-ni store-ga yuboradi. Store reducer-ni chaqiradi, yangi state hisoblaydi, tegishli komponentlarni qayta render qiladi.

```tsx
dispatch(togglePackage(1))
// → { type: 'internetPackages/togglePackage', payload: 1 }
// → reducer ishlaydi → yangi state → komponent yangilanadi
```

### 6. "Redux va Context + useReducer farqi?"

Context + useReducer — "kambag'al Redux". Farq:
- Context: qiymat o'zgarganda **BARCHA** subscriber qayta render
- Redux: faqat `useSelector` tanlagan qism o'zgargan komponentlar qayta render
- Redux: DevTools, middleware, Immer bor
- Context: hech qanday qo'shimcha paket kerak emas

### 7. "Pinia va Redux farqi? Qaysi biri yaxshi?"

Pinia ancha sodda — to'g'ridan-to'g'ri o'zgartirish, oddiy funksiyalar, async oson. Redux ko'proq boilerplate, lekin katta jamoalarda predictability yaxshi. Zustand — React dunyosida Pinia-ga eng yaqin alternativa.
