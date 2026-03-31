# useEffect — yon ta'sirlar (side effects) bilan ishlash

## useEffect nima?

`useEffect` — React hook-i, komponent renderdan **keyin** bajariladigan kodni yozish uchun ishlatiladi. Bu **side effect** — ya'ni komponentning o'zini render qilishdan tashqari narsalar:
- API so'rov yuborish
- Event listener qo'shish
- Timer yaratish
- DOM ni to'g'ridan-to'g'ri o'zgartirish
- localStorage bilan ishlash

Vue-dagi analoglari: `onMounted`, `onUpdated`, `onUnmounted`, `watch`, `watchEffect` — bularning barchasi React-da **bitta** `useEffect` orqali qilinadi.

```tsx
import { useEffect } from 'react'

useEffect(() => {
    // Side effect kodi — render tugagandan keyin ishlaydi

    return () => {
        // Cleanup funksiya — komponent unmount bo'lganda yoki
        // dependency o'zgarganda ishlaydi
    }
}, [dependency1, dependency2])
//  ↑ dependency array — qachon qayta ishlashni belgilaydi
```

---

## Vue bilan solishtirish — umumiy

| React `useEffect` | Vue analogi | Qachon ishlaydi |
|---|---|---|
| `useEffect(() => {}, [])` | `onMounted(() => {})` | Faqat 1 marta, komponent yaratilganda |
| `useEffect(() => { return () => {} }, [])` | `onUnmounted(() => {})` | Komponent yo'q bo'lganda (cleanup) |
| `useEffect(() => {}, [count])` | `watch(count, () => {})` | `count` o'zgarganda |
| `useEffect(() => {})` | `onUpdated(() => {})` | Har renderdan keyin |

**Katta farq:** Vue-da bu 4 ta alohida funksiya. React-da **hammasi bitta** `useEffect` ichida — dependency array bilan boshqariladi.

---

## Dependency array — 3 ta variant

### 1. Bo'sh array `[]` — faqat 1 marta (onMounted)

```tsx
useEffect(() => {
    console.log('Komponent yaratildi')
    fetchData()
}, [])
```

```js
// Vue analogi
onMounted(() => {
    console.log('Komponent yaratildi')
    fetchData()
})
```

**Qachon ishlatiladi:** API-dan data olish, event listener qo'shish, timer yaratish.

### 2. Dependency bilan `[a, b]` — qiymat o'zgarganda (watch)

```tsx
const [userId, setUserId] = useState(1)

useEffect(() => {
    fetch(`/api/users/${userId}`)
        .then(res => res.json())
        .then(data => setUser(data))
}, [userId])
// userId o'zgarganda qayta ishlaydi
```

```js
// Vue analogi
watch(userId, (newId) => {
    fetch(`/api/users/${newId}`)
        .then(res => res.json())
        .then(data => user.value = data)
})
```

**Qachon ishlatiladi:** Qiymat o'zgarganda API qayta chaqirish, hisoblashni yangilash.

### 3. Array yo'q — har renderda (onUpdated)

```tsx
useEffect(() => {
    console.log('Har renderdan keyin ishlaydi')
})
```

```js
// Vue analogi
onUpdated(() => {
    console.log('Har yangilanishdan keyin')
})
```

**Deyarli hech qachon ishlatilmaydi** — odatda bu xato. Dependency-larni to'g'ri yozish kerak.

---

## Cleanup funksiya — eng muhim tushuncha

Cleanup — `useEffect` ichidan **qaytariladigan funksiya**. U ikki holatda chaqiriladi:
1. Komponent **unmount** bo'lganda (DOM dan olib tashlanganda)
2. Dependency o'zgarib, effect **qayta ishga tushishidan oldin**

```tsx
useEffect(() => {
    // SETUP — effect kodi
    const timer = setInterval(() => {
        console.log('tick')
    }, 1000)

    // CLEANUP — tozalash
    return () => {
        clearInterval(timer)
    }
}, [])
```

### Nega cleanup kerak?

Agar cleanup yozilmasa — **memory leak** bo'ladi:

```tsx
// NOTO'G'RI ❌ — memory leak
useEffect(() => {
    window.addEventListener('resize', handleResize)
    // Komponent unmount bo'lganda listener qoladi!
    // Har navigatsiyada yangi listener qo'shiladi
}, [])

// TO'G'RI ✅ — cleanup bilan
useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
        window.removeEventListener('resize', handleResize)
    }
}, [])
```

### Vue bilan solishtirish — cleanup

```js
// Vue
onMounted(() => {
    window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

// React — ikkalasi BITTA useEffect ichida
useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}, [])
```

React-da setup va cleanup **birga** yozilishi — Vue-dan yaxshiroq taraf. Ularni bir-biridan ajratib qo'ymaslik xatolarni kamaytiradi.

### Cleanup qachon chaqiriladi — batafsil

```tsx
const [userId, setUserId] = useState(1)

useEffect(() => {
    console.log(`Fetch user ${userId}`)         // SETUP
    const controller = new AbortController()
    fetch(`/api/users/${userId}`, { signal: controller.signal })

    return () => {
        console.log(`Cleanup user ${userId}`)   // CLEANUP
        controller.abort()                       // Oldingi so'rovni bekor qilish
    }
}, [userId])

// userId: 1 → 2 → 3 bo'lganda:
// 1. "Fetch user 1"
// 2. userId = 2 bo'ldi:
//    "Cleanup user 1"  ← oldingi effect tozalanadi
//    "Fetch user 2"    ← yangi effect ishlaydi
// 3. userId = 3 bo'ldi:
//    "Cleanup user 2"
//    "Fetch user 3"
// 4. Komponent unmount:
//    "Cleanup user 3"
```

---

## Loyihadagi misollar

### 1. API-dan data olish (setTimeout bilan simulyatsiya)

```tsx
// src/pages/home/HomePage.tsx
const [notifications, setNotifications] = useState<string[]>([])

useEffect(() => {
    // API simulyatsiya — 1 soniyadan keyin data keladi
    const timer = setTimeout(() => {
        setNotifications(['Balans kam qoldi', 'Yangi tarif mavjud'])
    }, 1000)

    // Cleanup — agar komponent 1 soniya ichida unmount bo'lsa,
    // timer tozalanadi, setState chaqirilmaydi
    return () => clearTimeout(timer)
}, [])  // [] — faqat birinchi renderda
```

Vue analogi:
```js
const notifications = ref([])

onMounted(() => {
    setTimeout(() => {
        notifications.value = ['Balans kam qoldi', 'Yangi tarif mavjud']
    }, 1000)
})
```

### 2. Online/offline kuzatish (event listener)

```tsx
// src/pages/home/HomePage.tsx
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // SETUP — event listenerlar qo'shiladi
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // CLEANUP — event listenerlar olib tashlanadi
    return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
    }
}, [])
```

Vue analogi:
```js
const isOnline = ref(navigator.onLine)

onMounted(() => {
    window.addEventListener('online', () => isOnline.value = true)
    window.addEventListener('offline', () => isOnline.value = false)
})
onUnmounted(() => {
    // listenerlarni olib tashlash...
})
```

---

## Haqiqiy API bilan ishlash

### Fetch bilan

```tsx
const [users, setUsers] = useState<User[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
    const controller = new AbortController()

    async function fetchUsers() {
        try {
            setLoading(true)
            const res = await fetch('/api/users', { signal: controller.signal })
            if (!res.ok) throw new Error('Xato yuz berdi')
            const data = await res.json()
            setUsers(data)
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    fetchUsers()

    return () => controller.abort()  // Oldingi so'rovni bekor qilish
}, [])
```

Vue analogi:
```js
const users = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    try {
        loading.value = true
        const res = await fetch('/api/users')
        users.value = await res.json()
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
})
```

### Dependency o'zgarganda qayta fetch

```tsx
const [page, setPage] = useState(1)
const [users, setUsers] = useState<User[]>([])

useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/users?page=${page}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => setUsers(data))

    return () => controller.abort()
}, [page])  // page o'zgarganda qayta fetch
```

Vue analogi:
```js
const page = ref(1)
const users = ref([])

watch(page, async (newPage) => {
    const res = await fetch(`/api/users?page=${newPage}`)
    users.value = await res.json()
})
```

---

## Ko'p uchraydigan xatolar

### Xato 1: Cleanup yo'q — memory leak

```tsx
// NOTO'G'RI ❌
useEffect(() => {
    const interval = setInterval(() => setCount(c => c + 1), 1000)
    // Komponent unmount bo'lganda interval ishlashda davom etadi!
}, [])

// TO'G'RI ✅
useEffect(() => {
    const interval = setInterval(() => setCount(c => c + 1), 1000)
    return () => clearInterval(interval)
}, [])
```

### Xato 2: Cheksiz loop — dependency o'zi o'zgaradi

```tsx
// NOTO'G'RI ❌ — cheksiz loop!
const [data, setData] = useState([])

useEffect(() => {
    fetch('/api/data')
        .then(res => res.json())
        .then(d => setData(d))  // setData → render → useEffect → setData → ...
}, [data])  // ← data o'zgaradi → effect qayta ishlaydi → data yana o'zgaradi

// TO'G'RI ✅
useEffect(() => {
    fetch('/api/data')
        .then(res => res.json())
        .then(d => setData(d))
}, [])  // Bo'sh array — faqat 1 marta
```

### Xato 3: async to'g'ridan-to'g'ri useEffect-ga

```tsx
// NOTO'G'RI ❌ — useEffect async bo'la olmaydi
useEffect(async () => {
    const data = await fetchData()  // Error!
    setData(data)
}, [])

// TO'G'RI ✅ — ichida async funksiya yaratib chaqirish
useEffect(() => {
    async function loadData() {
        const data = await fetchData()
        setData(data)
    }
    loadData()
}, [])
```

**Nega?** useEffect cleanup funksiya qaytarishi kerak (yoki undefined). async funksiya Promise qaytaradi — React buni cleanup deb o'ylamaydi.

### Xato 4: Dependency kam yozilgan — stale closure

```tsx
const [count, setCount] = useState(0)

// NOTO'G'RI ❌
useEffect(() => {
    const interval = setInterval(() => {
        console.log(count)  // Har doim 0!
    }, 1000)
    return () => clearInterval(interval)
}, [])  // count dependency-da yo'q

// TO'G'RI ✅ — variant 1: dependency qo'shish
useEffect(() => {
    const interval = setInterval(() => {
        console.log(count)
    }, 1000)
    return () => clearInterval(interval)
}, [count])

// TO'G'RI ✅ — variant 2: functional update
useEffect(() => {
    const interval = setInterval(() => {
        setCount(prev => prev + 1)  // prev har doim yangi qiymat
    }, 1000)
    return () => clearInterval(interval)
}, [])
```

### Xato 5: Obyekt/massiv dependency — har renderda o'zgaradi

```tsx
// NOTO'G'RI ❌ — har renderda yangi obyekt = har renderda effect ishlaydi
useEffect(() => {
    fetchData(options)
}, [{ page: 1, limit: 10 }])
// ↑ {} === {} → false — har doim "o'zgardi" deb hisoblaydi

// TO'G'RI ✅ — primitiv qiymatlarni dependency qilish
const [page, setPage] = useState(1)
const [limit, setLimit] = useState(10)

useEffect(() => {
    fetchData({ page, limit })
}, [page, limit])
```

---

## useEffect vs Vue lifecycle

### Birinchi render

```
React:                              Vue:
1. Komponent chaqiriladi            1. setup() ishlaydi
2. JSX qaytariladi                  2. onBeforeMount
3. DOM yangilanadi                  3. DOM yangilanadi
4. useEffect ishlaydi ←             4. onMounted ishlaydi ←
```

### Yangilanish (state o'zgarganda)

```
React:                              Vue:
1. setState chaqiriladi             1. ref.value o'zgaradi
2. Komponent qayta render           2. onBeforeUpdate
3. DOM yangilanadi                  3. DOM yangilanadi
4. Cleanup (oldingi effect)         4. onUpdated
5. useEffect ishlaydi
```

### Unmount (komponent yo'q bo'lganda)

```
React:                              Vue:
1. Cleanup funksiya ishlaydi ←      1. onBeforeUnmount
                                    2. onUnmounted ←
```

---

## StrictMode va useEffect

React `StrictMode`-da (bu loyihada yoqilgan) development-da **useEffect ikki marta** chaqiriladi:

```
1. Setup → Cleanup → Setup
```

Bu ataylab qilingan — cleanup to'g'ri yozilganini tekshirish uchun. Produksiyada faqat 1 marta ishlaydi.

```tsx
useEffect(() => {
    console.log('setup')   // Dev: 2 marta | Prod: 1 marta
    return () => {
        console.log('cleanup') // Dev: 1 marta | Prod: unmount-da
    }
}, [])
```

Agar StrictMode-da muammo chiqsa — cleanup noto'g'ri yozilgan.

---

## useEffect vs useLayoutEffect

```tsx
// useEffect — DOM yangilangandan KEYIN, brauzer chizgandan KEYIN
useEffect(() => {
    // Ko'p hollarda shu ishlatiladi
}, [])

// useLayoutEffect — DOM yangilangandan KEYIN, brauzer chizishdan OLDIN
useLayoutEffect(() => {
    // DOM o'lchamlari kerak bo'lganda (getBoundingClientRect)
    // Vizual "miltillash" oldini olish uchun
}, [])
```

Vue-da `onMounted` `useLayoutEffect`-ga yaqinroq — DOM tayyor, lekin brauzer hali chizmagan bo'lishi mumkin.

**Qoida:** Deyarli har doim `useEffect` ishlat. `useLayoutEffect` faqat DOM o'lchamlari kerak bo'lganda yoki vizual "miltillash" bo'lganda.

---

## Suhbatda so'raladigan savollar

### 1. "useEffect nima va qachon ishlaydi?"

useEffect — side effect hook. Komponent render bo'lib, DOM yangilangandan **keyin** ishlaydi. Dependency array bilan boshqariladi: `[]` — 1 marta, `[dep]` — dep o'zgarganda, array yo'q — har renderda.

### 2. "useEffect va Vue watch farqi?"

| | `useEffect` | Vue `watch` |
|---|---|---|
| Birinchi render | Ha, ishlaydi | Yo'q (immediate: true bo'lmasa) |
| Cleanup | return () => {} | `onCleanup()` yoki stop() |
| Dependency | Qo'lda yoziladi | Avtomatik (yoki aniq ko'rsatiladi) |
| Lifecycle | onMounted + watch + onUnmounted birga | Har biri alohida |

### 3. "Cleanup funksiya qachon chaqiriladi?"

Ikki holatda:
1. Komponent **unmount** bo'lganda
2. Dependency o'zgarib, **keyingi effect ishga tushishidan oldin** (oldingi effectni tozalaydi)

### 4. "useEffect ichida async ishlatish mumkinmi?"

To'g'ridan-to'g'ri yo'q — useEffect async bo'la olmaydi. Ichida async funksiya yaratib chaqirish kerak:
```tsx
useEffect(() => {
    async function load() { await fetchData() }
    load()
}, [])
```

### 5. "Cheksiz loop qanday bo'ladi va qanday oldini olish mumkin?"

Effect ichida state o'zgartirilsa va shu state dependency-da bo'lsa:
```tsx
useEffect(() => { setData(newData) }, [data]) // LOOP!
```
Yechim: dependency-ni to'g'ri yozish, kerak bo'lmagan dependency-ni olib tashlash.

### 6. "useEffect va useLayoutEffect farqi?"

`useEffect` — brauzer ekranga chizgandan **keyin** (asinxron). `useLayoutEffect` — DOM tayyor, lekin brauzer chizishdan **oldin** (sinxron). useLayoutEffect DOM o'lchamlari kerak bo'lganda ishlatiladi, "miltillash" (flicker) oldini oladi.

### 7. "useEffect-ni shart ichida ishlatish mumkinmi?"

```tsx
// NOTO'G'RI ❌
if (isLoggedIn) {
    useEffect(() => { ... }, [])
}

// TO'G'RI ✅ — useEffect ichida shart
useEffect(() => {
    if (isLoggedIn) {
        fetchProfile()
    }
}, [isLoggedIn])
```

Hooklar shart ichida bo'la olmaydi — bu **Rules of Hooks** qoidasi.

### 8. "useEffect bilan data fetch qilish to'g'rimi?"

Kichik loyihalarda — ha. Katta loyihalarda — **React Query (TanStack Query)** yoki **SWR** ishlatish yaxshiroq. Ular keshlash, retry, loading/error holatlarni avtomatik boshqaradi.

```tsx
// useEffect bilan — ko'p boilerplate
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => { ... }, [])

// React Query bilan — sodda
const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
})
```

Vue analogi: Vue Query (TanStack Query for Vue) — bir xil kutubxona.

### 9. "StrictMode-da useEffect nega 2 marta ishlaydi?"

React development-da ataylab Setup → Cleanup → Setup qiladi — cleanup to'g'ri yozilganini tekshirish uchun. Agar ikkinchi Setup-da muammo bo'lsa — cleanup noto'g'ri. Produksiyada faqat 1 marta ishlaydi.

---

## Xulosa jadvali

| Xususiyat | React `useEffect` | Vue |
|---|---|---|
| Yaratilganda | `useEffect(() => {}, [])` | `onMounted(() => {})` |
| Yo'q bo'lganda | `return () => {}` (cleanup) | `onUnmounted(() => {})` |
| Qiymat kuzatish | `useEffect(() => {}, [val])` | `watch(val, () => {})` |
| Har yangilanishda | `useEffect(() => {})` | `onUpdated(() => {})` |
| Cleanup | Effect ichida `return` | `onUnmounted` alohida |
| Dependency | Qo'lda `[a, b]` | Avtomatik (Proxy) yoki aniq |
| async | Ichida alohida funksiya | To'g'ridan-to'g'ri mumkin |
| StrictMode | 2 marta ishlaydi (dev) | Yo'q |
