# useMemo — qimmat hisoblashlarni keshlash

## useMemo nima?

`useMemo` — React hook-i, **qimmat hisoblashni** keshlaydi (memoizatsiya). Dependency o'zgarmasa, avvalgi natijani qaytaradi — qaytadan hisoblaMaydi.

Vue-dagi `computed()` ning to'g'ridan-to'g'ri analogi.

```tsx
import { useMemo } from 'react'

const result = useMemo(() => {
    return qimmathisoblash(a, b)
}, [a, b])
//   ↑
// dependency array — shu qiymatlar o'zgargandagina qayta hisoblanadi
```

---

## Vue bilan solishtirish

```js
// Vue — computed avtomatik kuzatadi
const fullName = computed(() => {
    return `${user.value.firstName} ${user.value.lastName}`
})
// user.firstName yoki lastName o'zgarganda avtomatik yangilanadi
```

```tsx
// React — dependency qo'lda yoziladi
const fullName = useMemo(() => {
    return `${user.firstName} ${user.lastName}`
}, [user.firstName, user.lastName])
//  ↑ qaysi qiymatlar o'zgarganda qayta hisoblash kerakligini O'ZING yozasan
```

**Asosiy farq:**
- Vue `computed`: Proxy dependency-larni **avtomatik** aniqlaydi
- React `useMemo`: Dependency-larni **qo'lda** `[...]` ichiga yozasan

---

## Nega kerak? — Muammo va yechim

### Muammosiz holat

```tsx
function App() {
    const [count, setCount] = useState(0)
    const [name, setName] = useState('Ali')

    // Har renderda qayta hisoblanadi — lekin bu arzon, muammo yo'q
    const greeting = `Salom, ${name}!`

    return <p>{greeting}</p>
}
```

Bu yerda `useMemo` kerak **emas** — string yaratish juda tez.

### Muammoli holat

```tsx
function App() {
    const [query, setQuery] = useState('')
    const [items] = useState(juda_katta_massiv) // 10,000 ta element

    // MUAMMO: har renderda 10,000 ta elementni filtrlaydi
    // Hatto query O'ZGARMAGAN bo'lsa ham!
    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    )
}
```

### Yechim — useMemo

```tsx
function App() {
    const [query, setQuery] = useState('')
    const [items] = useState(juda_katta_massiv)

    // YAXSHI: faqat query YOKI items o'zgarganda qayta hisoblanadi
    const filtered = useMemo(() => {
        return items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        )
    }, [items, query])
}
```

---

## Sintaksis batafsil

### 1. Oddiy hisoblash

```tsx
const [price, setPrice] = useState(100)
const [quantity, setQuantity] = useState(3)
const [discount, setDiscount] = useState(10)

const total = useMemo(() => {
    const subtotal = price * quantity
    const discountAmount = subtotal * (discount / 100)
    return subtotal - discountAmount
}, [price, quantity, discount])
// price, quantity YOKI discount o'zgarganda qayta hisoblanadi
```

Vue analogi:
```js
const total = computed(() => {
    const subtotal = price.value * quantity.value
    const discountAmount = subtotal * (discount.value / 100)
    return subtotal - discountAmount
})
```

### 2. Massivni filtrlash/saralash

```tsx
const [users, setUsers] = useState<User[]>([])
const [sortBy, setSortBy] = useState<'name' | 'age'>('name')
const [searchQuery, setSearchQuery] = useState('')

const filteredAndSorted = useMemo(() => {
    return users
        .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            return a.age - b.age
        })
}, [users, sortBy, searchQuery])
```

### 3. Obyekt yaratish

```tsx
const [width, setWidth] = useState(100)
const [height, setHeight] = useState(200)

// Har renderda yangi obyekt yaratilmaydi — reference saqlanadi
const style = useMemo(() => ({
    width: `${width}px`,
    height: `${height}px`,
    border: '1px solid black',
}), [width, height])

return <div style={style} />
```

Bu muhim — chunki React `{}` === `{}` ni `false` deb hisoblaydi. useMemo reference-ni saqlaydi.

### 4. Loyihadagi misol — DashboardLayout

```tsx
// src/app/layouts/DashboardLayout.tsx
const fullName = useMemo(() => {
    return [userData.last_name, userData.first_name, userData.middle_name]
        .filter(Boolean)    // undefined/null larni olib tashlaydi
        .join(' ')
}, [userData.last_name, userData.first_name, userData.middle_name])

const formattedPhone = useMemo(() => {
    return formatPhone(userData.phone_number)
}, [userData.phone_number])
```

---

## Dependency array — qoidalar

### Bo'sh array `[]` — faqat birinchi renderda

```tsx
const value = useMemo(() => {
    return qimmathisoblash()
}, [])
// Faqat 1 marta hisoblanadi, keyin keshdan olinadi
```

Vue analogi yo'q — computed har doim dependency kuzatadi.

### Array yo'q — har renderda (useMemo-ning ma'nosi yo'q)

```tsx
// BU BEFOYDA — har renderda qayta hisoblanadi
const value = useMemo(() => {
    return qimmathisoblash(a, b)
})
```

### Dependency-lar to'g'ri yozilishi SHART

```tsx
// NOTO'G'RI ❌ — count dependency-da yo'q
const [count, setCount] = useState(0)
const doubled = useMemo(() => count * 2, [])
// doubled har doim 0 bo'lib qoladi!

// TO'G'RI ✅
const doubled = useMemo(() => count * 2, [count])
```

ESLint `react-hooks/exhaustive-deps` qoidasi — dependency-lar to'liq yozilganini tekshiradi. Bu loyihada yoqilgan.

### Dependency-da nima bo'lishi mumkin

```tsx
// Primitive (string, number, boolean) — qiymat bo'yicha solishtiriladi
useMemo(() => ..., [count, name, isOpen])  // ✅

// Obyekt/massiv — REFERENCE bo'yicha solishtiriladi
const [user, setUser] = useState({ name: 'Ali' })
useMemo(() => ..., [user])  // ⚠ user har setState da yangi obyekt

// Funksiya — har renderda yangi reference
useMemo(() => ..., [handleClick])  // ⚠ har renderda qayta ishlaydi
```

---

## useMemo vs boshqa hooklar

### useMemo vs useCallback

```tsx
// useMemo — QIYMAT keshlaydi
const sorted = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name))
}, [items])
// sorted = saralangan massiv

// useCallback — FUNKSIYA keshlaydi
const handleSort = useCallback(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name))
}, [items])
// handleSort = funksiya (hali chaqirilmagan)
```

Aslida `useCallback(fn, deps)` = `useMemo(() => fn, deps)` — bir xil narsa.

### useMemo vs useRef

```tsx
// useMemo — dependency o'zgarganda QAYTA hisoblanadi
const result = useMemo(() => heavyCalc(x), [x])

// useRef — HECH QACHON qayta hisoblanmaydi, o'zing o'zgartirasan
const ref = useRef(heavyCalc(x))
// x o'zgarganda ref.current eski qiymat qoladi!
```

### useMemo vs oddiy o'zgaruvchi

```tsx
// Oddiy — HAR RENDERDA qayta hisoblanadi
const sorted = items.sort(...)

// useMemo — faqat ITEMS O'ZGARGANDA qayta hisoblanadi
const sorted = useMemo(() => items.sort(...), [items])
```

---

## Qachon useMemo KERAK va KERAK EMAS

### KERAK ✅

```tsx
// 1. Qimmat hisoblash (filtrlash, saralash, katta massiv)
const filtered = useMemo(() => {
    return bigArray.filter(item => item.matches(query))
}, [bigArray, query])

// 2. Bola komponentga beriladigan obyekt/massiv (referential equality)
const config = useMemo(() => ({
    theme: 'dark',
    language: lang,
}), [lang])
return <ChildComponent config={config} />

// 3. Boshqa hook-ning dependency-si bo'lgan qiymat
const options = useMemo(() => ({ min, max }), [min, max])
useEffect(() => {
    fetchData(options)
}, [options])  // options reference saqlanadi
```

### KERAK EMAS ❌

```tsx
// 1. Arzon hisoblash
const fullName = useMemo(() => `${first} ${last}`, [first, last])
// ↑ Bu befoyda — string concatenation juda tez
// Oddiy yozish yaxshiroq:
const fullName = `${first} ${last}`

// 2. Primitive qiymat
const doubled = useMemo(() => count * 2, [count])
// ↑ Bu befoyda — ko'paytirish juda tez
const doubled = count * 2  // shunday yoz

// 3. Har renderda yangilanishi kerak bo'lgan qiymat
const now = useMemo(() => new Date(), [])
// ↑ Faqat 1 marta yaratiladi — sana eskiradi
```

**Qoida:** Avval `useMemo`-siz yoz. Agar sekinlik sezilsa — keyin qo'sh. **Premature optimization** — eng katta xato.

---

## React Compiler va useMemo

Bu loyihada **React Compiler** yoqilgan (`babel-plugin-react-compiler`).

React Compiler nima qiladi?
- Komponentlarni avtomatik `React.memo` bilan o'raydi
- Qiymatlarni avtomatik `useMemo` bilan keshlaydi
- Funksiyalarni avtomatik `useCallback` bilan keshlaydi

```tsx
// Sen yozasan:
function App() {
    const sorted = items.sort(...)
    return <List items={sorted} />
}

// React Compiler avtomatik o'zgartiradi:
function App() {
    const sorted = useMemo(() => items.sort(...), [items])
    return <List items={sorted} />
}
```

**Xulosa:** React Compiler yoqilgan loyihada `useMemo` qo'lda yozish ko'p hollarda **kerak emas** — compiler o'zi qo'shadi. Lekin suhbatda bilish SHART.

Vue-da bu muammo umuman yo'q — Proxy avtomatik kuzatadi, keraksiz qayta hisoblash bo'lmaydi.

---

## Suhbatda so'raladigan savollar

### 1. "useMemo va computed (Vue) farqi nima?"

| | React `useMemo` | Vue `computed` |
|---|---|---|
| Dependency | **Qo'lda** yoziladi `[a, b]` | **Avtomatik** — Proxy kuzatadi |
| Lazy | Ha — faqat kerak bo'lganda | Ha — faqat kerak bo'lganda |
| Kesh | Ha — dep o'zgarmasa eski natija | Ha — dep o'zgarmasa eski natija |
| Yozish | Read-only | `computed({ get, set })` bilan yozish mumkin |

### 2. "useMemo qachon qayta hisoblanadi?"

Dependency array ichidagi qiymatlardan **birortasi** `Object.is()` bilan solishtirilganda farq qilsa. Primitiv uchun `===`, obyekt uchun reference equality.

### 3. "Dependency array bo'sh bo'lsa nima bo'ladi?"

Faqat **birinchi renderda** hisoblanadi, keyin hech qachon yangilanmaydi. `useState(() => ...)` lazy init-ga o'xshash.

### 4. "useMemo kafolatlanganmi?"

**Yo'q!** React keshni istalgan vaqtda tashlab yuborishi mumkin (masalan, memory pressure). Shuning uchun useMemo faqat **optimallashtirish** uchun ishlatiladi — **to'g'ri ishlash** uchun emas. Agar useMemo olib tashlansa ham kod to'g'ri ishlashi kerak.

### 5. "useMemo ichida side effect qilish mumkinmi?"

```tsx
// NOTO'G'RI ❌
const data = useMemo(() => {
    fetch('/api/users')       // side effect!
    localStorage.setItem()    // side effect!
    console.log('hello')      // side effect!
}, [])

// Side effectlar uchun useEffect ishlatiladi
useEffect(() => {
    fetch('/api/users')
}, [])
```

`useMemo` — faqat **hisoblash** uchun. Side effectlar (API, localStorage, DOM) — `useEffect` uchun.

### 6. "useCallback ishlatmasdan useMemo bilan funksiya keshlash mumkinmi?"

```tsx
// useCallback
const handleClick = useCallback(() => {
    console.log(count)
}, [count])

// useMemo bilan bir xil natija
const handleClick = useMemo(() => {
    return () => console.log(count)
}, [count])
```

Ha, bir xil. `useCallback(fn, deps)` aslida `useMemo(() => fn, deps)` ning qisqartmasi.

### 7. "Noto'g'ri dependency yozilsa nima bo'ladi?"

```tsx
const [count, setCount] = useState(0)

// Kam yozilsa — stale closure (eskirgan qiymat)
const doubled = useMemo(() => count * 2, [])
// doubled har doim 0 — count yangilanmaydi

// Ortiqcha yozilsa — keraksiz qayta hisoblash
const doubled = useMemo(() => count * 2, [count, name, age])
// name yoki age o'zgarganda ham qayta hisoblanadi — befoyda
```

---

## Xulosa jadvali

| Xususiyat | `useMemo` | Vue `computed` |
|---|---|---|
| Import | `import { useMemo } from 'react'` | `import { computed } from 'vue'` |
| Yaratish | `useMemo(() => calc(), [deps])` | `computed(() => calc())` |
| Dependency | Qo'lda yoziladi | Avtomatik |
| Kesh | Ha, lekin kafolatlanmagan | Ha, kafolatlanadi |
| Yozish | Read-only | get/set mumkin |
| Shart ichida | **MUMKIN EMAS** | Mumkin |
| React Compiler | Avtomatik qo'shadi | Kerak emas |
