# useQuery (TanStack Query) — API bilan ishlashning to'g'ri usuli

## TanStack Query nima?

TanStack Query (eski nomi: React Query) — **server state** boshqarish kutubxonasi. U `useEffect` + `useState` bilan qo'lda yoziladigan API logikani avtomatik qiladi: keshlash, loading, error, retry, refetch — hammasi tayyor.

Vue uchun ham bor: `@tanstack/vue-query` — bir xil API.

## O'rnatish

```bash
yarn add @tanstack/react-query
```

---

## useEffect bilan muammo

Har bir API so'rov uchun bir xil boilerplate takrorlanadi:

```tsx
// Har sahifa uchun shu 15+ qator takror-takror yoziladi
const [users, setUsers] = useState<User[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
    const controller = new AbortController()
    async function load() {
        try {
            setLoading(true)
            const res = await fetch('/api/users', { signal: controller.signal })
            if (!res.ok) throw new Error('Xato')
            setUsers(await res.json())
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }
    load()
    return () => controller.abort()
}, [])
```

---

## useQuery bilan yechim

```tsx
import { useQuery } from '@tanstack/react-query'

const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
})
```

4 qator. Tamom. Loading, error, cache, retry — hammasi avtomatik.

---

## Asosiy tushunchalar

### queryKey — kesh kaliti

Har bir so'rov unikal `queryKey` ga ega. TanStack Query shu kalit bo'yicha natijani **keshlaydi**:

```tsx
// Barcha userlar — ['users'] kaliti bilan keshlanadi
useQuery({ queryKey: ['users'], queryFn: fetchUsers })

// Bitta user — ['users', 42] kaliti bilan keshlanadi
useQuery({ queryKey: ['users', userId], queryFn: () => fetchUser(userId) })

// Filtrli — ['users', { role: 'admin' }]
useQuery({ queryKey: ['users', { role }], queryFn: () => fetchUsers(role) })
```

**Muhim:** `queryKey` o'zgarganda — yangi so'rov yuboriladi. Bu `useEffect`-ning dependency array-ga o'xshaydi.

```tsx
// userId o'zgarganda avtomatik qayta fetch
const { data } = useQuery({
    queryKey: ['users', userId],  // userId = 1 → 2 bo'lganda yangi so'rov
    queryFn: () => fetchUser(userId),
})
```

Vue `watch` bilan solishtirish:
```js
// Vue — qo'lda watch yozish kerak
watch(userId, async (newId) => {
    user.value = await fetchUser(newId)
})

// useQuery — queryKey o'zgarganda avtomatik
```

### queryFn — so'rov funksiyasi

Promise qaytaruvchi har qanday funksiya:

```tsx
// fetch bilan
queryFn: () => fetch('/api/users').then(r => r.json())

// axios bilan
queryFn: () => axios.get('/api/users').then(r => r.data)

// Parametrli
queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json())
```

---

## Qaytariladigan qiymatlar

```tsx
const {
    data,           // API javob ma'lumoti (undefined bo'lishi mumkin)
    isLoading,      // Birinchi marta yuklanmoqda (kesh yo'q)
    isFetching,     // Istalgan vaqtda yuklanmoqda (kesh bor ham bo'lishi mumkin)
    isError,        // Xato bormi
    error,          // Xato obyekti
    isSuccess,      // Muvaffaqiyatlimi
    refetch,        // Qo'lda qayta so'rov yuborish
    status,         // 'pending' | 'error' | 'success'
} = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
})
```

### isLoading vs isFetching

```tsx
// isLoading — BIRINCHI marta yuklash (kesh bo'sh)
// Ekranda spinner ko'rsatish uchun
if (isLoading) return <p>Yuklanmoqda...</p>

// isFetching — ISTALGAN yuklash (background refetch ham)
// Kesh bor, lekin yangilanmoqda
// Kichik indicator uchun (masalan, spinner burchakda)
```

---

## Amaliy misollar

### 1. Oddiy ro'yxat

```tsx
function UsersPage() {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: () => fetch('/api/users').then(r => r.json()),
    })

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error) return <p>Xato: {error.message}</p>

    return (
        <ul>
            {users.map((user: User) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    )
}
```

### 2. Parametrli so'rov (userId bo'yicha)

```tsx
function UserProfile({ userId }: { userId: number }) {
    const { data: user, isLoading } = useQuery({
        queryKey: ['users', userId],  // userId o'zgarganda qayta fetch
        queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
    })

    if (isLoading) return <p>Yuklanmoqda...</p>

    return <h1>{user.name}</h1>
}
```

### 3. Qidiruv bilan (debounce)

```tsx
function SearchUsers() {
    const [query, setQuery] = useState('')

    const { data: results, isFetching } = useQuery({
        queryKey: ['users', 'search', query],
        queryFn: () => fetch(`/api/users?q=${query}`).then(r => r.json()),
        enabled: query.length > 2,  // 3 ta harfdan keyin izlaydi
    })

    return (
        <div>
            <input value={query} onChange={e => setQuery(e.target.value)} />
            {isFetching && <p>Qidirilmoqda...</p>}
            {results?.map((user: User) => <p key={user.id}>{user.name}</p>)}
        </div>
    )
}
```

### 4. Pagination

```tsx
function UsersList() {
    const [page, setPage] = useState(1)

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['users', page],
        queryFn: () => fetch(`/api/users?page=${page}`).then(r => r.json()),
        placeholderData: (prev) => prev,  // Yangi sahifa yuklanguncha eskisini ko'rsatadi
    })

    return (
        <div>
            {isLoading ? <p>Yuklanmoqda...</p> : (
                <ul>
                    {data.users.map((user: User) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            )}
            <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
                <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                    Oldingi
                </button>
                <span>Sahifa: {page}</span>
                <button onClick={() => setPage(p => p + 1)}>
                    Keyingi
                </button>
            </div>
        </div>
    )
}
```

---

## Konfiguratsiya sozlamalari

```tsx
useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,

    // Qachon keshdan qayta fetch qilish
    staleTime: 5 * 60 * 1000,     // 5 daqiqa — shu vaqt ichida kesh "yangi" hisoblanadi
    gcTime: 10 * 60 * 1000,       // 10 daqiqa — kesh xotiradan o'chiriladi

    // Qayta urinish
    retry: 3,                      // Xato bo'lsa 3 marta qayta urinish (default)
    retryDelay: 1000,              // Har urinishdan keyin 1 soniya kutish

    // Avtomatik refetch
    refetchOnWindowFocus: true,    // Tab-ga qaytganda yangilash (default: true)
    refetchOnReconnect: true,      // Internet qaytganda yangilash (default: true)
    refetchInterval: 30000,        // Har 30 soniyada yangilash (polling)

    // Boshqarish
    enabled: isLoggedIn,           // false bo'lsa so'rov yuborilmaydi
    select: (data) => data.users,  // Javobdan kerakli qismni olish
})
```

### staleTime — eng muhim sozlama

```
staleTime: 0 (default)
→ Data darhol "eskirgan" — har tab focus, component mount da qayta fetch

staleTime: 5 * 60 * 1000 (5 min)
→ 5 daqiqa ichida keshdan olinadi, qayta fetch yo'q

staleTime: Infinity
→ Hech qachon avtomatik qayta fetch bo'lmaydi
```

---

## useMutation — ma'lumot o'zgartirish (POST, PUT, DELETE)

`useQuery` — faqat **o'qish** uchun. Yozish uchun `useMutation`:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddUserForm() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (newUser: { name: string }) =>
            fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(newUser),
            }).then(r => r.json()),

        onSuccess: () => {
            // POST muvaffaqiyatli — userlar ro'yxatini yangilash
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        mutation.mutate({ name: 'Yangi user' })
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saqlanmoqda...' : 'Qo\'shish'}
            </button>
            {mutation.isError && <p>Xato: {mutation.error.message}</p>}
        </form>
    )
}
```

Vue analogi xuddi shunday — `useMutation` bir xil ishlaydi.

---

## QueryClientProvider — ilovaga ulash

TanStack Query ishlatish uchun ilova `QueryClientProvider` bilan o'ralishi kerak:

```tsx
// src/app/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,  // Global: 5 daqiqa kesh
            retry: 2,                   // Global: 2 marta retry
        },
    },
})

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
```

```tsx
// src/app/App.tsx
import QueryProvider from './providers/QueryProvider'
import RouterProvider from './providers/RouterProvider'

function App() {
    return (
        <QueryProvider>
            <RouterProvider />
        </QueryProvider>
    )
}
```

Vue-da ham xuddi shunday — `VueQueryPlugin` sifatida `app.use()` bilan ulanadi.

---

## useQuery vs useEffect — solishtirish

| Xususiyat | `useEffect` + `useState` | `useQuery` |
|---|---|---|
| Kod hajmi | 15-20 qator har API uchun | 4-5 qator |
| Loading holat | Qo'lda `useState` | Avtomatik `isLoading` |
| Xato ushlash | Qo'lda `try/catch` | Avtomatik `error` |
| Keshlash | Yo'q | Avtomatik `queryKey` bo'yicha |
| Qayta urinish | Qo'lda yozish kerak | Avtomatik 3 marta |
| Tab-ga qaytganda | Yo'q | Avtomatik refetch |
| AbortController | Qo'lda | Avtomatik |
| Deduplication | Yo'q | Bir xil so'rov birlashtiriladi |
| DevTools | Yo'q | `@tanstack/react-query-devtools` |
| Race condition | Qo'lda hal qilish kerak | Avtomatik hal qilinadi |
| Optimistic update | Qo'lda | Tayyor API |

---

## Suhbatda so'raladigan savollar

### 1. "TanStack Query nima va nega kerak?"

Server state boshqarish kutubxonasi. Kerak chunki `useEffect` bilan API ishlash ko'p boilerplate, xatolar (race condition, memory leak), va kesh yo'q. TanStack Query bularning hammasini avtomatik hal qiladi.

### 2. "queryKey nima uchun kerak?"

Kesh kaliti. Bir xil `queryKey` bilan chaqirilgan so'rov keshdan olinadi — qayta fetch qilmaydi. Key o'zgarganda avtomatik yangi so'rov yuboriladi. Bu `useEffect`-ning dependency array-ga o'xshaydi.

### 3. "staleTime va gcTime farqi?"

- `staleTime` — data qancha vaqt "yangi" hisoblanadi. Shu vaqt ichida qayta fetch yo'q.
- `gcTime` (garbage collection time) — data keshdan qachon o'chiriladi. Komponent unmount bo'lgandan keyin.

```
staleTime: 5 min — 5 daqiqa ichida keshdan olinadi
gcTime: 10 min — unmount-dan 10 daqiqa keyin keshdan o'chadi
```

### 4. "useQuery va useMutation farqi?"

- `useQuery` — **GET** (o'qish). Avtomatik ishlaydi, kesh bor.
- `useMutation` — **POST/PUT/DELETE** (yozish). Qo'lda `.mutate()` chaqirish kerak, keyin `invalidateQueries` bilan keshni yangilash.

### 5. "invalidateQueries nima qiladi?"

```tsx
queryClient.invalidateQueries({ queryKey: ['users'] })
```
Shu `queryKey` bilan keshlangan ma'lumotni "eskirgan" deb belgilaydi va qayta fetch qiladi. Odatda `useMutation` muvaffaqiyatli bo'lgandan keyin chaqiriladi — ro'yxat yangilanadi.

### 6. "enabled nima uchun kerak?"

So'rovni **shart bilan** boshqarish:
```tsx
// Token bo'lmaganda so'rov yuborilmaydi
useQuery({ queryKey: ['profile'], queryFn: fetchProfile, enabled: !!token })

// Input 3 ta harfdan kam bo'lsa qidirmaydi
useQuery({ queryKey: ['search', q], queryFn: search, enabled: q.length > 2 })
```

### 7. "Vue Query bilan farqi bormi?"

Deyarli yo'q. TanStack Query framework-agnostic yadro ishlatadi. API bir xil:
```tsx
// React
import { useQuery } from '@tanstack/react-query'
```
```js
// Vue
import { useQuery } from '@tanstack/vue-query'
```
Farq faqat Provider-da: React — `QueryClientProvider`, Vue — `VueQueryPlugin`.
