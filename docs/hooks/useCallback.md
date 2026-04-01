# useCallback — funksiyalarni keshlash

## useCallback nima?

`useCallback` — React hook-i, **funksiyani** keshlaydi (memoizatsiya). Dependency o'zgarmasa, avvalgi funksiya reference-ni qaytaradi — yangi funksiya yaratMAYDI.

```tsx
import { useCallback } from 'react'

const handleClick = useCallback(() => {
    console.log('bosildi')
}, [])
//  ↑ dependency array — shu qiymatlar o'zgargandagina yangi funksiya yaratiladi
```

Vue-da to'g'ridan-to'g'ri analogi **yo'q** — chunki Vue-da bunga ehtiyoj yo'q. Vue Proxy orqali faqat o'zgargan qismni yangilaydi, React esa butun komponentni qayta render qiladi.

---

## Nega kerak? — Muammoni tushunish

React-da har qayta render bo'lganda **barcha funksiyalar qaytadan yaratiladi**:

```tsx
function App() {
    const [count, setCount] = useState(0)

    // Har renderda YANGI funksiya yaratiladi
    const handleClick = () => {
        console.log('bosildi')
    }
    // Oldingi handleClick !== yangi handleClick (boshqa reference)
}
```

Bu nega muammo?

### Muammo 1: Bola komponent keraksiz qayta render bo'ladi

```tsx
// React.memo — faqat proplar o'zgarganda qayta render
const ExpensiveList = React.memo(function ExpensiveList({ onClick }: { onClick: () => void }) {
    console.log('ExpensiveList qayta render bo'ldi') // har safar!
    return <div onClick={onClick}>Katta ro'yxat...</div>
})

function App() {
    const [count, setCount] = useState(0)

    // MUAMMO: har renderda yangi funksiya → ExpensiveList ham qayta render
    const handleClick = () => console.log('click')

    return (
        <>
            <button onClick={() => setCount(c => c + 1)}>+1</button>
            <ExpensiveList onClick={handleClick} />
            {/* count o'zgarganda ExpensiveList ham qayta render — KERAKSIZ */}
        </>
    )
}
```

### Yechim — useCallback

```tsx
function App() {
    const [count, setCount] = useState(0)

    // YAXSHI: reference saqlanadi → ExpensiveList qayta render bo'lMAYDI
    const handleClick = useCallback(() => {
        console.log('click')
    }, [])

    return (
        <>
            <button onClick={() => setCount(c => c + 1)}>+1</button>
            <ExpensiveList onClick={handleClick} />
            {/* count o'zgarganda ExpensiveList qayta render BO'LMAYDI ✅ */}
        </>
    )
}
```

### Muammo 2: useEffect keraksiz ishga tushadi

```tsx
function App() {
    const [count, setCount] = useState(0)

    // Har renderda yangi reference
    const fetchData = () => fetch('/api/data')

    // MUAMMO: fetchData reference o'zgargani uchun har renderda ishlaydi
    useEffect(() => {
        fetchData()
    }, [fetchData])
}
```

```tsx
// YECHIM:
const fetchData = useCallback(() => {
    return fetch('/api/data')
}, [])

useEffect(() => {
    fetchData()
}, [fetchData])  // reference saqlanadi → faqat 1 marta ishlaydi
```

---

## Vue bilan solishtirish — nega Vue-da kerak emas?

```html
<!-- Vue -->
<template>
  <button @click="count++">{{ count }}</button>
  <ExpensiveList @click="handleClick" />
</template>

<script setup>
const count = ref(0)

// Bu funksiya har renderda QAYTADAN YARATILMAYDI
// Vue faqat count ga bog'liq qismni yangilaydi
// ExpensiveList ga tegmaydi
function handleClick() {
    console.log('click')
}
</script>
```

**Asosiy farq:**
- Vue: Proxy qaysi komponent qaysi qiymatga bog'liqligini biladi → faqat kerakli joyni yangilaydi
- React: `setState` → butun komponent qayta render → barcha funksiyalar qaytadan yaratiladi → bola komponentlar ham qayta render

Shuning uchun React-da `useCallback` + `React.memo` kerak, Vue-da kerak emas.

---

## Loyihadagi misol — HomePage

```tsx
// src/pages/home/HomePage.tsx

// 1. Bo'sh dependency — hech qachon o'zgarmaydi
const openModal = useCallback(() => {
    setIsModalOpen(true)
}, [])

// 2. Bo'sh dependency — ichida faqat setState (stabil reference)
const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setAmount('')
}, [])

// 3. Bo'sh dependency — event obyektidan qiymat oladi
const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
}, [])

// 4. Dependency bor — amount va closeModal ishlatadi
const handlePayment = useCallback(() => {
    const value = parseFloat(amount)
    if (!value || value <= 0) return

    setBalance(prev => prev + value)
    closeModal()
}, [amount, closeModal])
//  ↑ amount o'zgarganda yangi funksiya yaratiladi
//         ↑ closeModal useCallback bilan o'ralgan — reference stabil
```

**Muhim:** `setState` funksiyalari (`setIsModalOpen`, `setAmount`, `setBalance`) har doim stabil reference — ularni dependency-ga qo'shish **shart emas**.

---

## Dependency array qoidalari

### setState — dependency-ga KERAK EMAS

```tsx
// setState har doim bir xil reference — dependency-ga qo'shish shart emas
const increment = useCallback(() => {
    setCount(prev => prev + 1)  // setCount stabil
}, [])  // [] bo'sh — to'g'ri ✅
```

### Tashqi qiymat — dependency-ga KERAK

```tsx
const [multiplier, setMultiplier] = useState(2)

const multiply = useCallback((value: number) => {
    return value * multiplier  // multiplier tashqi qiymat
}, [multiplier])  // multiplier o'zgarganda yangi funksiya
```

### Boshqa useCallback — dependency-ga KERAK

```tsx
const closeModal = useCallback(() => {
    setIsModalOpen(false)
}, [])

// closeModal dependency-da — lekin u useCallback bilan stabil
const handlePayment = useCallback(() => {
    // ...logika
    closeModal()
}, [closeModal])
```

---

## useCallback vs useMemo

```tsx
// useCallback — FUNKSIYA keshlaydi
const handleClick = useCallback(() => {
    console.log(count)
}, [count])
// qaytaradi: () => console.log(count)

// useMemo — QIYMAT keshlaydi (hisoblash natijasi)
const doubled = useMemo(() => {
    return count * 2
}, [count])
// qaytaradi: 6 (raqam)
```

**Aslida bir xil narsa:**
```tsx
useCallback(fn, deps)
// teng
useMemo(() => fn, deps)
```

| | `useCallback` | `useMemo` |
|---|---|---|
| Nima keshlaydi | Funksiya reference | Hisoblash natijasi (qiymat) |
| Qaytaradi | Funksiya | Istalgan qiymat |
| Qachon ishlatiladi | Bola komponentga callback berish | Qimmat hisoblash |

---

## Qachon useCallback KERAK va KERAK EMAS

### KERAK ✅

```tsx
// 1. React.memo bilan o'ralgan bola komponentga prop sifatida
const handleClick = useCallback(() => { ... }, [])
<MemoizedChild onClick={handleClick} />

// 2. useEffect dependency-sida
const fetchData = useCallback(() => { ... }, [url])
useEffect(() => { fetchData() }, [fetchData])

// 3. Boshqa hook dependency-sida
const handler = useCallback(() => { ... }, [])
useMemo(() => createConfig(handler), [handler])

// 4. Custom hook-dan qaytariladigan funksiya
function useCounter() {
    const [count, setCount] = useState(0)
    const increment = useCallback(() => setCount(c => c + 1), [])
    return { count, increment }
}
```

### KERAK EMAS ❌

```tsx
// 1. DOM elementga to'g'ridan-to'g'ri berilsa (React.memo yo'q)
<button onClick={useCallback(() => setCount(c => c + 1), [])}>
    +1
</button>
// ↑ Befoyda — <button> React.memo bilan o'ralmagan

// Oddiy yoz:
<button onClick={() => setCount(c => c + 1)}>+1</button>

// 2. Komponent ichida chaqirilsa (prop sifatida berilMAsa)
const calculate = useCallback(() => {
    return a + b
}, [a, b])
const result = calculate()  // ↑ Befoyda — useMemo ishlat

// 3. Dependency har renderda o'zgarsa
const handler = useCallback(() => {
    console.log(obj)
}, [obj])  // obj har renderda yangi → useCallback befoyda
```

---

## React.memo bilan birga ishlash

`useCallback` ko'pincha `React.memo` bilan birga ishlatiladi:

```tsx
import { memo, useCallback, useState } from 'react'

// React.memo — props o'zgarmasa qayta render qilMAYDI
// Vue-da bunga ehtiyoj yo'q — Vue o'zi hal qiladi
const TodoItem = memo(function TodoItem({
    todo,
    onToggle,
    onDelete,
}: {
    todo: { id: number; text: string; done: boolean }
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}) {
    console.log(`TodoItem ${todo.id} render`)
    return (
        <li>
            <span onClick={() => onToggle(todo.id)}>
                {todo.done ? '✓' : '○'} {todo.text}
            </span>
            <button onClick={() => onDelete(todo.id)}>O'chirish</button>
        </li>
    )
})

function TodoList() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'React o\'rganish', done: false },
        { id: 2, text: 'Loyiha qilish', done: false },
    ])

    // useCallback — reference saqlanadi → TodoItem qayta render bo'lMAYDI
    const handleToggle = useCallback((id: number) => {
        setTodos(prev => prev.map(t =>
            t.id === id ? { ...t, done: !t.done } : t
        ))
    }, [])

    const handleDelete = useCallback((id: number) => {
        setTodos(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ul>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            ))}
        </ul>
    )
}
```

**Vue-da bu qanday ko'rinadi:**
```html
<template>
  <ul>
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="handleToggle"
      @delete="handleDelete"
    />
  </ul>
</template>

<script setup>
const todos = ref([...])

// useCallback kerak EMAS — Vue o'zi optimallashtirilgan
function handleToggle(id) { ... }
function handleDelete(id) { ... }
</script>
```

---

## React Compiler va useCallback

Bu loyihada **React Compiler** yoqilgan. U avtomatik:
- Funksiyalarni `useCallback` bilan o'raydi
- Komponentlarni `React.memo` bilan o'raydi

```tsx
// Sen yozasan:
function App() {
    const handleClick = () => console.log('click')
    return <Child onClick={handleClick} />
}

// React Compiler avtomatik o'zgartiradi:
function App() {
    const handleClick = useCallback(() => console.log('click'), [])
    return <Child onClick={handleClick} />
}
```

Shuning uchun React Compiler yoqilgan loyihada `useCallback` qo'lda yozish ko'p hollarda **shart emas**. Lekin suhbatda bilish KERAK.

---

## Suhbatda so'raladigan savollar

### 1. "useCallback nima va nega kerak?"

Funksiya reference-ni keshlaydi. Kerak chunki React har renderda barcha funksiyalarni qaytadan yaratadi. Agar bola komponent `React.memo` bilan o'ralgan bo'lsa, yangi reference → keraksiz qayta render. `useCallback` reference-ni saqlaydi → bola komponent qayta render bo'lmaydi.

### 2. "useCallback va useMemo farqi?"

`useCallback(fn, deps)` = `useMemo(() => fn, deps)`. useCallback funksiya keshlaydi, useMemo qiymat keshlaydi. Mohiyatan bir xil, faqat qulaylik uchun ajratilgan.

### 3. "Har bir funksiyani useCallback bilan o'rash kerakmi?"

**Yo'q.** Faqat:
- `React.memo` komponentga prop sifatida berilsa
- `useEffect` / `useMemo` dependency-da bo'lsa
- Custom hook-dan qaytarilsa

DOM elementga (`<button>`, `<input>`) to'g'ridan-to'g'ri berilsa — befoyda.

### 4. "useCallback o'zi performance muammosi bo'lishi mumkinmi?"

Ha. useCallback o'zi:
- Dependency array yaratadi
- Har renderda dependency-larni solishtiriladi
- Closure-ni xotirada saqlaydi

Agar funksiya oddiy va bola komponent `React.memo` bilan o'ralmagan bo'lsa — `useCallback` foyda emas, zarar.

### 5. "setState ni dependency-ga qo'shish kerakmi?"

```tsx
// Kerak EMAS — setState har doim stabil reference
const increment = useCallback(() => {
    setCount(prev => prev + 1)
}, [])  // ✅ bo'sh array
```

React kafolatlaydi — `useState` dan qaytgan `setState` hech qachon o'zgarmaydi.

### 6. "Vue-da nega useCallback kerak emas?"

Vue Proxy asosida ishlaydi — qaysi komponent qaysi qiymatga bog'liqligini avtomatik biladi. React bilmaydi — butun komponentni qayta render qiladi. Shuning uchun React-da qo'lda optimallashtirish (useCallback + React.memo) kerak, Vue-da kerak emas.

### 7. "Closure trap (stale closure) nima?"

```tsx
const [count, setCount] = useState(0)

// NOTO'G'RI — [] bo'sh, count har doim 0
const logCount = useCallback(() => {
    console.log(count)  // har doim 0!
}, [])

// TO'G'RI — count dependency-da
const logCount = useCallback(() => {
    console.log(count)
}, [count])
```

`[]` bo'sh qoldirilsa — funksiya birinchi renderdagi qiymatni "eslab qoladi" (closure). Bu stale closure — eskirgan qiymat.

---

## Xulosa jadvali

| Xususiyat | React `useCallback` | Vue |
|---|---|---|
| Maqsad | Funksiya reference keshlash | Kerak emas |
| Nega kerak | React har renderda funksiya qaytadan yaratadi | Vue Proxy faqat kerakli qismni yangilaydi |
| Birga ishlatiladi | `React.memo`, `useEffect`, `useMemo` | — |
| Dependency | Qo'lda `[a, b]` | — |
| React Compiler | Avtomatik qo'shadi | — |
| Shart ichida | **MUMKIN EMAS** | — |
