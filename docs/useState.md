# useState — React-da holatni boshqarish

## useState nima?

`useState` — React-ning eng asosiy hook-i. Komponent ichida **o'zgaruvchan ma'lumot** saqlash uchun ishlatiladi.

Vue-dagi `ref()` ning to'g'ridan-to'g'ri analogi.

```tsx
import { useState } from 'react'

const [count, setCount] = useState(0)
//      ↑        ↑                 ↑
//   qiymat   o'zgartirish      boshlang'ich
//             funksiyasi         qiymat
```

## Vue bilan solishtirish

```js
// Vue
const count = ref(0)
count.value++
count.value = 5
```

```tsx
// React
const [count, setCount] = useState(0)
setCount(count + 1)
setCount(5)
```

**Asosiy farq:**
- Vue: `count.value` ni to'g'ridan-to'g'ri o'zgartirasiz — Proxy kuzatadi
- React: faqat `setCount()` orqali o'zgartirasiz — aks holda React bilmaydi

---

## Sintaksis — batafsil

### 1. Oddiy qiymat (string, number, boolean)

```tsx
const [name, setName] = useState('')           // string
const [age, setAge] = useState(0)              // number
const [isOpen, setIsOpen] = useState(false)     // boolean
```

Vue analogi:
```js
const name = ref('')
const age = ref(0)
const isOpen = ref(false)
```

### 2. Obyekt

```tsx
const [user, setUser] = useState({ name: 'Ali', age: 25 })

// O'zgartirish — YANGI obyekt yaratish kerak!
setUser({ ...user, name: 'Vali' })
```

```js
// Vue — to'g'ridan-to'g'ri o'zgartirish mumkin
const user = reactive({ name: 'Ali', age: 25 })
user.name = 'Vali'  // ishlaydi
```

> **MUHIM:** React-da `user.name = 'Vali'` **ISHLAMAYDI**. React eski va yangi obyektni `===` bilan solishtirad — bir xil reference bo'lsa, qayta render qilmaydi.

### 3. Massiv

```tsx
const [items, setItems] = useState<string[]>([])

// Element qo'shish
setItems([...items, 'yangi element'])

// Element o'chirish (id bo'yicha)
setItems(items.filter(item => item !== 'o\'chirmoqchi'))

// Element yangilash
setItems(items.map(item =>
    item === 'eski' ? 'yangi' : item
))
```

```js
// Vue
const items = ref([])
items.value.push('yangi element')              // ishlaydi
items.value.splice(index, 1)                   // ishlaydi
items.value[0] = 'yangi'                       // ishlaydi
```

### 4. TypeScript bilan

```tsx
// Tip avtomatik aniqlanadi
const [count, setCount] = useState(0)           // number
const [name, setName] = useState('Ali')         // string

// Aniq tip ko'rsatish — bo'sh massiv yoki null uchun kerak
const [items, setItems] = useState<string[]>([])
const [user, setUser] = useState<User | null>(null)

// Interfeys bilan
interface FormData {
    email: string
    password: string
}
const [form, setForm] = useState<FormData>({ email: '', password: '' })
```

---

## setState qanday ishlaydi — chuqur tushuntirish

### setState asinxron

`setState` chaqirilganda qiymat **darhol o'zgarmaydi**. React o'zgarishlarni to'playdi va bir marta qayta render qiladi:

```tsx
const [count, setCount] = useState(0)

function handleClick() {
    setCount(count + 1)
    console.log(count)  // 0! — hali o'zgarmagan
    // keyingi renderda count = 1 bo'ladi
}
```

```js
// Vue-da darhol o'zgaradi
const count = ref(0)
count.value++
console.log(count.value)  // 1 — darhol
```

### Batching — bir nechta setState birlashtiriladi

```tsx
function handleClick() {
    setCount(count + 1)    // render qilmaydi hali
    setName('Vali')        // render qilmaydi hali
    setAge(30)             // render qilmaydi hali
    // React UCHTA o'zgarishni birlashtiradi → BITTA qayta render
}
```

Vue-da ham `nextTick` bilan shunga o'xshash batching bor.

### Functional update — avvalgi qiymatdan foydalanish

Agar yangi qiymat avvalgi qiymatga bog'liq bo'lsa, **funksiya** bering:

```tsx
// NOTO'G'RI — agar tez-tez bosilsa, ba'zilari yo'qolishi mumkin
setCount(count + 1)
setCount(count + 1)
setCount(count + 1)
// Natija: 1 (3 emas!) — chunki count hali 0

// TO'G'RI — prev har doim eng oxirgi qiymatni oladi
setCount(prev => prev + 1)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
// Natija: 3 ✓
```

**Qachon functional update ishlatish kerak:**
- Avvalgi qiymatga bog'liq hisoblash: `setCount(prev => prev + 1)`
- Massivga element qo'shish: `setItems(prev => [...prev, newItem])`
- Obyektni yangilash: `setUser(prev => ({ ...prev, name: 'Vali' }))`

**Qachon oddiy qiymat berish mumkin:**
- Avvalgi qiymatga bog'liq emas: `setName('Vali')`, `setIsOpen(true)`

---

## Noto'g'ri ishlatish — ko'p uchraydigan xatolar

### Xato 1: To'g'ridan-to'g'ri o'zgartirish (mutatsiya)

```tsx
// NOTO'G'RI ❌
const [user, setUser] = useState({ name: 'Ali', age: 25 })
user.name = 'Vali'          // React buni sezmaydi — qayta render YO'Q
setUser(user)                // reference bir xil — React o'zgarmadi deb o'ylaydi

// TO'G'RI ✅
setUser({ ...user, name: 'Vali' })   // yangi obyekt — React farqni ko'radi
```

Vue-da bu muammo yo'q — Proxy har qanday o'zgarishni kuzatadi.

### Xato 2: setState natijasini darhol ishlatish

```tsx
// NOTO'G'RI ❌
setCount(count + 1)
console.log(count)     // eski qiymat!
fetch(`/api?page=${count}`)  // eski qiymat bilan so'rov!

// TO'G'RI ✅ — yangi qiymatni o'zgaruvchiga saqlab ishlatish
const newCount = count + 1
setCount(newCount)
fetch(`/api?page=${newCount}`)
```

### Xato 3: Shart ichida useState

```tsx
// NOTO'G'RI ❌ — React hooklarni tartib bo'yicha kuzatadi
if (isLoggedIn) {
    const [name, setName] = useState('')  // Error!
}

// TO'G'RI ✅ — har doim komponentning yuqori qismida
const [name, setName] = useState('')
```

**Hook qoidalari (Rules of Hooks):**
1. Faqat komponent yoki boshqa hook ichida chaqirish
2. Faqat eng yuqori darajada — `if`, `for`, `while` ichida EMAS
3. Oddiy funksiyalarda ishlatish MUMKIN EMAS

Vue-da bu cheklov yo'q — `ref()` istalgan joyda ishlaydi.

### Xato 4: Har bir qiymat uchun alohida useState

```tsx
// YOMON — juda ko'p state
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [email, setEmail] = useState('')
const [phone, setPhone] = useState('')
const [address, setAddress] = useState('')

// YAXSHI — bog'liq ma'lumotlarni bitta obyektga
const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
})

// O'zgartirish:
setForm(prev => ({ ...prev, email: 'ali@mail.com' }))
```

---

## useState vs useRef

Suhbatda tez-tez so'raladigan savol:

| | `useState` | `useRef` |
|---|---|---|
| O'zgarganda qayta render | **Ha** | **Yo'q** |
| Qiymatga murojaat | `count` | `countRef.current` |
| Qachon ishlatiladi | UI ko'rsatish kerak bo'lgan ma'lumot | DOM element yoki ichki qiymat (timer id, oldingi qiymat) |

```tsx
// useState — UI yangilanadi
const [count, setCount] = useState(0)
setCount(1)  // komponent qayta render bo'ladi → ekranda 1 ko'rinadi

// useRef — UI yangilanMAYDI
const countRef = useRef(0)
countRef.current = 1  // hech narsa o'zgarmaydi ekranda
```

Vue analogi: `useRef` ≈ oddiy `let` o'zgaruvchi (reaktiv emas).

---

## Lazy initialization — qimmat boshlang'ich qiymat

Agar boshlang'ich qiymatni hisoblash qimmat bo'lsa, **funksiya** bering:

```tsx
// YOMON — har renderda localStorage o'qiladi (lekin faqat birinchisi ishlatiladi)
const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light')

// YAXSHI — faqat birinchi renderda chaqiriladi
const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') ?? 'light'
})
```

Vue-da ham ref ichida computed yoki funksiya ishlatilsa, shunday optimallashtirish mumkin.

---

## Amaliy misollar

### 1. Toggle (yoqish/o'chirish)

```tsx
// React
const [isOpen, setIsOpen] = useState(false)
<button onClick={() => setIsOpen(prev => !prev)}>
    {isOpen ? 'Yopish' : 'Ochish'}
</button>
{isOpen && <div>Modal kontent</div>}
```

```js
// Vue
const isOpen = ref(false)
// <button @click="isOpen = !isOpen">{{ isOpen ? 'Yopish' : 'Ochish' }}</button>
// <div v-if="isOpen">Modal kontent</div>
```

### 2. Form bilan ishlash

```tsx
// React — controlled input
const [email, setEmail] = useState('')

<input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>
<p>Kiritildi: {email}</p>
```

```js
// Vue — v-model
const email = ref('')
// <input type="email" v-model="email" />
// <p>Kiritildi: {{ email }}</p>
```

React-da `v-model` yo'q — `value` + `onChange` qo'lda yoziladi.

### 3. Massiv bilan CRUD

```tsx
const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([])
const [input, setInput] = useState('')

// Create
function addTodo() {
    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }])
    setInput('')
}

// Update
function toggleTodo(id: number) {
    setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
}

// Delete
function removeTodo(id: number) {
    setTodos(prev => prev.filter(todo => todo.id !== id))
}
```

### 4. Tabs komponenti (loyihadagi misol)

```tsx
// shared/ui/tabs/Tabs.tsx
import { useState } from 'react'

interface Tab {
    id: string
    label: string
    content: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
    defaultActiveId?: string
}

export default function Tabs({ tabs, defaultActiveId }: TabsProps) {
    // activeId — qaysi tab tanlangani
    const [activeId, setActiveId] = useState(defaultActiveId ?? tabs[0]?.id ?? '')

    const activeTab = tabs.find(tab => tab.id === activeId)

    return (
        <div>
            <div className="flex gap-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveId(tab.id)}
                        className={activeId === tab.id ? 'active' : ''}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{activeTab?.content}</div>
        </div>
    )
}
```

---

## Suhbatda so'raladigan savollar va javoblar

### 1. "useState va useReducer farqi nima?"

| | `useState` | `useReducer` |
|---|---|---|
| Qachon | Oddiy state (1-3 ta qiymat) | Murakkab state (ko'p qiymatlar, bog'liq logika) |
| Yangilash | `setState(newValue)` | `dispatch({ type: 'ACTION' })` |
| Vue analogi | `ref()` | Pinia store |

```tsx
// useState — oddiy
const [count, setCount] = useState(0)

// useReducer — murakkab state logikasi
const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })
dispatch({ type: 'increment' })
```

### 2. "Nima uchun useState massiv qaytaradi, obyekt emas?"

```tsx
// Massiv — istalgan nom berishingiz mumkin:
const [count, setCount] = useState(0)
const [name, setName] = useState('')
const [items, setItems] = useState([])

// Agar obyekt bo'lganida — har safar destructure qilish kerak edi:
const { state: count, setState: setCount } = useState(0)       // noqulay
const { state: name, setState: setName } = useState('')         // takroriy
```

### 3. "setState asinxronmi?"

To'g'rirog'i — **batchlanadi**. setState chaqirilganda React darhol qayta render qilmaydi, barcha o'zgarishlarni yig'adi va bitta renderda qo'llaydi. Bu **performance** uchun qilingan — 5 ta setState = 1 ta render, 5 ta render emas.

### 4. "Qachon useState, qachon global state (Zustand/Redux) ishlatish kerak?"

| | useState | Global state (Zustand/Redux/Pinia) |
|---|---|---|
| Scope | Faqat shu komponent va bolalari | Butun ilova |
| Qachon | Form input, modal, local UI | Auth, cart, user data |
| Vue analogi | `ref()` komponent ichida | Pinia store |

**Qoida:** Agar ma'lumot faqat 1-2 ta komponentda kerak → `useState`. Agar 3+ joyda kerak → global state.

### 5. "useState ichida funksiya saqlash mumkinmi?"

```tsx
// Ha, lekin lazy initialization bilan adashtirmaslik kerak:
const [callback, setCallback] = useState(() => () => console.log('salom'))
//                                        ↑ tashqi funksiya — lazy init
//                                             ↑ ichki funksiya — haqiqiy qiymat

// O'zgartirish:
setCallback(() => () => console.log('yangi'))
//           ↑ setState-ga funksiya bersangiz, React uni updater deb o'ylaydi
//              shuning uchun ikki qavat funksiya kerak
```

### 6. "useState chaqirganda React ichida nima bo'ladi?"

```
1. useState(0) chaqirildi
2. React bu komponent uchun "fiber" node-da state saqlanadi
3. Birinchi renderda: qiymat = 0, setState funksiyasi yaratiladi
4. setState(1) chaqirildi
5. React bu komponentni "dirty" deb belgilaydi
6. Keyingi renderda: qiymat = 1
7. React eski va yangi virtual DOM-ni solishtiradi (reconciliation)
8. Faqat farqlarni haqiqiy DOM-ga qo'llaydi
```

### 7. "Nega Vue-dagi kabi to'g'ridan-to'g'ri o'zgartirish React-da ishlamaydi?"

React **immutability** printsipiga asoslangan:
- Eski qiymat va yangi qiymat `===` bilan solishtiriladi
- `user.name = 'Vali'` — reference o'zgarmaydi → `oldUser === newUser` → `true` → React: "o'zgarish yo'q"
- `{ ...user, name: 'Vali' }` — yangi obyekt → `oldUser === newUser` → `false` → React: "o'zgarish bor!"

Vue Proxy ishlatgani uchun to'g'ridan-to'g'ri o'zgartirish kuzatiladi. React ataylab Proxy ishlatmaydi — soddalik va oldindan aytish mumkinligi uchun.

---

## useState vs Vue ref/reactive — yakuniy solishtirish

| Xususiyat | React `useState` | Vue `ref()` / `reactive()` |
|---|---|---|
| Import | `import { useState } from 'react'` | `import { ref } from 'vue'` |
| Yaratish | `const [x, setX] = useState(0)` | `const x = ref(0)` |
| O'qish | `count` | `count.value` (template-da `.value` siz) |
| O'zgartirish | `setCount(1)` | `count.value = 1` |
| Obyekt o'zgartirish | `setUser({...user, name: 'X'})` — yangi obyekt | `user.name = 'X'` — to'g'ridan-to'g'ri |
| Massivga qo'shish | `setItems([...items, x])` — yangi massiv | `items.value.push(x)` |
| Qayta render | Butun komponent + bolalar | Faqat bog'liq qism |
| Shart ichida | **MUMKIN EMAS** | Mumkin |
| Avvalgi qiymat | `setX(prev => prev + 1)` | `x.value++` |
| Kuzatish | Yo'q — qo'lda `setState` | Avtomatik — Proxy |
| Qoida | Komponent yuqorisida, tartib o'zgarmasin | Cheklov yo'q |
