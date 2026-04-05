# Zustand — yengil global state boshqarish

## Zustand nima?

Zustand — **juda yengil** (1kb) global state boshqarish kutubxonasi. React dunyosida **Pinia-ga eng yaqin** alternativa — oddiy, tushunishi oson, boilerplate yo'q.

```bash
yarn add zustand
```

---

## Pinia bilan solishtirish — deyarli bir xil

```js
// Vue — Pinia
export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)
    function increment() { count.value++ }
    function reset() { count.value = 0 }
    return { count, increment, reset }
})

// Komponentda:
const store = useCounterStore()
store.increment()
```

```tsx
// React — Zustand
import { create } from 'zustand'

export const useCounterStore = create<CounterState>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
}))

// Komponentda:
const count = useCounterStore((s) => s.count)
const increment = useCounterStore((s) => s.increment)
increment()
```

| | Pinia (Vue) | Zustand (React) |
|---|---|---|
| Yaratish | `defineStore('name', () => {})` | `create((set) => ({}))` |
| State o'qish | `store.count` | `useStore((s) => s.count)` |
| O'zgartirish | `store.increment()` yoki `count.value++` | `store.increment()` |
| Provider kerak | `app.use(pinia)` | **Kerak emas!** |
| Hajmi | ~1.5kb | **~1kb** |
| DevTools | Vue DevTools | Redux DevTools bilan |
| Boilerplate | Kam | **Juda kam** |

---

## Nega Zustand Redux-dan yaxshi (ko'p hollarda)?

```tsx
// Redux — KO'P BOILERPLATE
// 1. Slice yozish (createSlice)
// 2. Store yaratish (configureStore)
// 3. Provider o'rash (<Provider store={store}>)
// 4. Typed hooklar yozish (useAppSelector, useAppDispatch)
// 5. dispatch(actionCreator(payload))

// Zustand — MINIMAL
// 1. Store yaratish (create)
// 2. Ishlatish (useStore)
// Tamom!
```

| | Redux Toolkit | Zustand |
|---|---|---|
| Fayllar soni | 3-4 ta (slice, store, provider, types) | **1 ta** |
| Provider | **Kerak** | Kerak emas |
| Dispatch | `dispatch(action())` | `store.action()` — oddiy funksiya |
| Immer | Bor (ichida) | Yo'q (lekin middleware bilan qo'shish mumkin) |
| Hajmi | ~12kb | **~1kb** |
| DevTools | Bor | Bor (middleware bilan) |
| Middleware | Ko'p | Bor |
| Qachon | Katta loyiha, katta jamoa | Kichik-o'rta loyiha |

---

## Asosiy sintaksis

### 1. Store yaratish

```tsx
import { create } from 'zustand'

interface BearState {
    bears: number
    fish: number
    addBear: () => void
    removeBear: () => void
    addFish: (count: number) => void
    reset: () => void
}

const useBearStore = create<BearState>((set) => ({
    // State
    bears: 0,
    fish: 0,

    // Actions — set() bilan state o'zgartirish
    addBear: () => set((state) => ({ bears: state.bears + 1 })),
    removeBear: () => set((state) => ({ bears: Math.max(0, state.bears - 1) })),
    addFish: (count) => set((state) => ({ fish: state.fish + count })),
    reset: () => set({ bears: 0, fish: 0 }),
}))
```

### 2. Komponentda ishlatish — selector bilan

```tsx
function BearCounter() {
    // Faqat bears o'zgarganda qayta render (selector)
    const bears = useBearStore((state) => state.bears)
    const addBear = useBearStore((state) => state.addBear)

    return (
        <div>
            <h1>{bears} ta ayiq</h1>
            <button onClick={addBear}>Qo'shish</button>
        </div>
    )
}

function FishCounter() {
    // Faqat fish o'zgarganda qayta render
    const fish = useBearStore((state) => state.fish)
    return <p>{fish} ta baliq</p>
}
```

**Muhim — Selector:** `useStore((s) => s.bears)` — faqat `bears` o'zgarganda komponent qayta render bo'ladi. Bu Redux-ning `useSelector` ga va Pinia-ning `storeToRefs` ga o'xshash.

### 3. Butun store olish (selector-siz)

```tsx
// ⚠ Har qanday state o'zgarganda qayta render
const store = useBearStore()
store.bears
store.addBear()

// ✅ Yaxshiroq — kerakli qismni tanlash
const bears = useBearStore((s) => s.bears)
```

---

## set() — state o'zgartirish usullari

### Qisman yangilash (partial)

```tsx
// set() avtomatik merge qiladi — faqat o'zgargan qismni yozing
set({ bears: 5 })
// { bears: 5, fish: 10 } — fish o'zgarmadi ✅
```

### Avvalgi state-ga bog'liq

```tsx
// Funksiya bering — prev state olasiz
set((state) => ({ bears: state.bears + 1 }))
```

### To'liq almashtirish (replace)

```tsx
// Ikkinchi argument true — butun state almashadi
set({ bears: 0 }, true)
// { bears: 0 } — fish YO'QOLDI!
// Odatda kerak emas — ehtiyot bo'ling
```

---

## get() — action ichida state o'qish

```tsx
const useStore = create<State>((set, get) => ({
    items: [],
    selectedId: null,

    // get() — joriy state-ni o'qish
    getSelectedItem: () => {
        const { items, selectedId } = get()
        return items.find((i) => i.id === selectedId) ?? null
    },

    addItem: (item) => {
        const { items } = get()
        // Duplikat tekshirish
        if (items.some((i) => i.id === item.id)) return
        set({ items: [...items, item] })
    },
}))
```

---

## Async actions — oddiy async function

Redux-da `createAsyncThunk` kerak. Zustand-da **oddiy async funksiya**:

```tsx
const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: false,
    error: null,

    // Async — oddiy async function! Hech qanday thunk kerak emas
    fetchUser: async (id: number) => {
        set({ loading: true, error: null })
        try {
            const res = await fetch(`/api/users/${id}`)
            const user = await res.json()
            set({ user, loading: false })
        } catch (err) {
            set({ error: (err as Error).message, loading: false })
        }
    },

    logout: () => set({ user: null }),
}))
```

Pinia bilan **deyarli bir xil**:
```js
// Pinia
const fetchUser = async (id) => {
    loading.value = true
    try {
        user.value = await fetch(`/api/users/${id}`).then(r => r.json())
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}
```

Redux bilan **katta farq**:
```tsx
// Redux — createAsyncThunk + extraReducers + 3 ta case
// Zustand — oddiy async function
// Pinia — oddiy async function
// Zustand va Pinia bu yerda BIR XIL
```

---

## Loyihadagi misol — Bildirishnomalar

### Store

```tsx
// src/entities/notification/store.ts
import { create } from 'zustand'

interface NotificationState {
    notifications: Notification[]
    filter: 'all' | 'unread' | 'read'

    addNotification: (n: Omit<Notification, 'id' | 'read' | 'date'>) => void
    markAsRead: (id: number) => void
    markAllAsRead: () => void
    removeNotification: (id: number) => void
    clearAll: () => void
    setFilter: (filter: NotificationState['filter']) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [...],
    filter: 'all',

    addNotification: (n) =>
        set((state) => ({
            notifications: [
                { ...n, id: Date.now(), read: false, date: '2026-04-02' },
                ...state.notifications,
            ],
        })),

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearAll: () => set({ notifications: [] }),

    setFilter: (filter) => set({ filter }),
}))
```

### Sahifada ishlatish

```tsx
// src/pages/settings/SettingsPage.tsx
import { useNotificationStore } from '../../entities/notification'

export default function SettingsPage() {
    // Selector — faqat kerakli qism
    const notifications = useNotificationStore((s) => s.notifications)
    const filter = useNotificationStore((s) => s.filter)
    const markAsRead = useNotificationStore((s) => s.markAsRead)
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <div>
            <button onClick={markAllAsRead}>Hammasini o'qish</button>
            {notifications.map((n) => (
                <div key={n.id}>
                    {n.title}
                    <button onClick={() => markAsRead(n.id)}>O'qish</button>
                </div>
            ))}
        </div>
    )
}
```

---

## Middleware — qo'shimcha imkoniyatlar

### devtools — Redux DevTools ulash

```tsx
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create<State>()(
    devtools(
        (set) => ({
            count: 0,
            increment: () => set(
                (state) => ({ count: state.count + 1 }),
                undefined,
                'increment'  // DevTools-da action nomi
            ),
        }),
        { name: 'CounterStore' }  // DevTools-da store nomi
    )
)
```

### persist — localStorage-ga saqlash

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            theme: 'light',
            language: 'uz',
            setTheme: (theme: string) => set({ theme }),
            setLanguage: (lang: string) => set({ language: lang }),
        }),
        {
            name: 'settings-storage',  // localStorage kalit
            // Brauzer yopilsa ham saqlanadi!
        }
    )
)
```

Vue/Pinia analogi: `pinia-plugin-persistedstate`

### immer — to'g'ridan-to'g'ri o'zgartirish

```tsx
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useStore = create<State>()(
    immer((set) => ({
        users: [{ id: 1, name: 'Ali', address: { city: 'Toshkent' } }],

        // Immer bilan — to'g'ridan-to'g'ri o'zgartirish (Redux Toolkit kabi)
        updateCity: (id: number, city: string) =>
            set((state) => {
                const user = state.users.find((u) => u.id === id)
                if (user) user.address.city = city  // mutatsiya — Immer boshqaradi
            }),
    }))
)
```

### Bir nechta middleware birga

```tsx
const useStore = create<State>()(
    devtools(
        persist(
            immer((set) => ({
                // ... state va actions
            })),
            { name: 'my-store' }
        ),
        { name: 'MyStore' }
    )
)
```

---

## Zustand vs Redux vs Context — yakuniy solishtirish

| | Context | Redux Toolkit | **Zustand** |
|---|---|---|---|
| Hajmi | 0 (React ichida) | ~12kb | **~1kb** |
| Provider | Kerak | Kerak | **Kerak emas** |
| Boilerplate | O'rtacha | Ko'p | **Juda kam** |
| DevTools | Yo'q | Bor | Bor (middleware) |
| Selector | Yo'q — hammasi qayta render | Bor | **Bor** |
| Async | Tashqarida | createAsyncThunk | **Oddiy async** |
| Persist | Qo'lda | Middleware | **Middleware** |
| Immer | Yo'q | Bor | Middleware |
| Pinia-ga o'xshash | Yo'q | Yo'q | **Juda o'xshash** |
| Qachon | Kam o'zgaradigan (theme) | Katta loyiha | **Ko'p holatlarda eng yaxshi** |

---

## Store-ni komponent tashqarisida ishlatish

Zustand-ning yana bir afzalligi — store-ni **React komponent tashqarisida** ham ishlatish mumkin:

```tsx
// Istalgan .ts faylda (komponent emas!)
import { useNotificationStore } from './store'

// State o'qish
const notifications = useNotificationStore.getState().notifications

// State o'zgartirish
useNotificationStore.getState().addNotification({ title: 'Test', message: '...', type: 'info' })

// Subscribe — state o'zgarganda chaqiriladi
const unsubscribe = useNotificationStore.subscribe((state) => {
    console.log('State o'zgardi:', state.notifications.length)
})
```

Bu Redux-da ham mumkin (`store.getState()`, `store.dispatch()`), lekin Pinia-da qiyinroq (component context kerak).

---

## FSD-da Zustand qayerga qo'yiladi

```
src/
  entities/
    notification/
      store.ts          ← Zustand store (entity bilan bog'liq)
      index.ts
    user/
      store.ts
  features/
    cart/
      store.ts          ← Feature store
  shared/
    store/
      settingsStore.ts  ← Global settings (theme, language)
```

Pinia-da ham xuddi shunday — store feature yoki entity bilan birga joylashadi.

---

## Suhbatda so'raladigan savollar

### 1. "Zustand nima va nega Redux o'rniga?"

1kb yengil state manager. Redux-ga qaraganda 10x kam boilerplate, Provider kerak emas, async oddiy funksiya. Ko'p hollarda Redux ortiqcha — Zustand yetarli.

### 2. "Zustand qanday ishlaydi?"

`create()` global store yaratadi. Komponentlar `useStore((s) => s.field)` bilan subscribe bo'ladi. `set()` state o'zgartiradi. Faqat selector tanlagan qism o'zgarganda komponent qayta render bo'ladi.

### 3. "Zustand-da selector nega muhim?"

Selector-siz butun store o'zgarganda **barcha** komponentlar qayta render. Selector bilan — faqat tanlangan qism o'zgargan komponent qayta render. Performance uchun juda muhim.

### 4. "Zustand va Pinia farqi?"

Deyarli bir xil. Ikkalasi ham yengil, oddiy, async oson. Farq: Pinia — Vue Proxy bilan reaktiv, Zustand — React subscription model. Pinia — Vue rasmiy, Zustand — community lekin eng populyar.

### 5. "Provider nega kerak emas?"

Zustand module-level store yaratadi — JavaScript module scope-da global. React tree-ga bog'liq emas. Redux va Context React component tree ichida ishlaydi — shuning uchun Provider kerak.

### 6. "Zustand va Jotai farqi?"

Zustand — **bitta store** (top-down). Jotai — **atomlar** (bottom-up, har bir qiymat alohida atom). Zustand — Pinia/Redux mentalitetiga yaqin. Jotai — Vue Composition API-dagi alohida `ref()` larga yaqin.

### 7. "Qachon Redux, qachon Zustand?"

- **Zustand:** Ko'p loyihalar, tez prototip, kichik-o'rta jamoa
- **Redux:** Katta korporativ loyiha, katta jamoa (50+ dev), murakkab middleware, eski loyihalar
