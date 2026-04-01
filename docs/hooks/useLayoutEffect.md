# useLayoutEffect — DOM o'lchamlarini brauzer chizishdan OLDIN hisoblash

## useLayoutEffect nima?

`useLayoutEffect` — `useEffect` bilan **deyarli bir xil**, bitta katta farqi bor:

| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Qachon ishlaydi | DOM yangilangandan keyin, brauzer **chizgandan KEYIN** | DOM yangilangandan keyin, brauzer **chizishdan OLDIN** |
| Foydalanuvchi ko'radi | Avval eski holat, keyin yangi | Faqat yangi holat (miltillash yo'q) |
| Sinxron/asinxron | Asinxron | **Sinxron** — brauzer kutadi |

```
Render → DOM yangilanadi → useLayoutEffect → Brauzer chizadi → useEffect
                              ↑                                    ↑
                        chizishdan OLDIN                  chizgandan KEYIN
```

---

## Muammo — useEffect bilan miltillash (flicker)

Agar `useEffect` ichida DOM elementning pozitsiyasi yoki o'lchamini o'qib, state o'zgartirsa — foydalanuvchi **miltillashni ko'radi**:

```
1. React DOM ni yangilaydi
2. Brauzer CHIZADI — foydalanuvchi eski holatni ko'radi (1 kadr)
3. useEffect ishlaydi — yangi pozitsiya hisoblanadi
4. setState → qayta render
5. Brauzer QAYTA CHIZADI — foydalanuvchi yangi holatni ko'radi
```

Natija: element avval eski joyda paydo bo'lib, keyin yangi joyga **sakraydi**.

## Yechim — useLayoutEffect

```
1. React DOM ni yangilaydi
2. useLayoutEffect ishlaydi — yangi pozitsiya hisoblanadi
3. setState → qayta render (brauzer hali chizMAGAN)
4. Brauzer CHIZADI — foydalanuvchi FAQAT yangi holatni ko'radi
```

Natija: element to'g'ridan-to'g'ri to'g'ri joyda paydo bo'ladi. Miltillash yo'q.

---

## Loyihadagi misol — TariffsPage

Tariffs sahifasida tablar bor. Aktiv tab ostida **ko'k chiziq** (highlight) animatsiya bilan siljiydi. Buning uchun aktiv buttonning `offsetLeft` va `offsetWidth` ini hisoblash kerak:

```tsx
// src/pages/tariffs/TariffsPage.tsx

const [selectedId, setSelectedId] = useState(1)
const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 })
const tabsRef = useRef<HTMLDivElement>(null)

useLayoutEffect(() => {
    const container = tabsRef.current
    if (!container) return

    // DOM dan aktiv button elementini topish
    const activeButton = container.querySelector(
        `[data-id="${selectedId}"]`
    ) as HTMLElement | null
    if (!activeButton) return

    // Pozitsiya va kenglikni o'qish
    setHighlightStyle({
        left: activeButton.offsetLeft,   // chapdan masofa
        width: activeButton.offsetWidth, // kenglik
    })
}, [selectedId])
```

```tsx
{/* Animated highlight — pozitsiyasi useLayoutEffect bilan hisoblanadi */}
<div
    className="absolute bottom-1 h-1 bg-blue-500 rounded transition-all duration-300"
    style={{ left: highlightStyle.left, width: highlightStyle.width }}
/>
```

### Nega bu yerda useEffect emas?

Agar `useEffect` ishlatilsa:
1. Tab bosildi → React render qildi → brauzer eski pozitsiyada highlight chizdi
2. useEffect ishladi → yangi pozitsiya hisoblandi → setState
3. Qayta render → brauzer yangi pozitsiyada chizdi

**Natija:** highlight 1 kadr davomida **eski joyda** ko'rinadi, keyin yangi joyga sakraydi. Animatsiya buziladi.

`useLayoutEffect` bilan brauzer chizishdan **oldin** pozitsiya hisoblanadi — foydalanuvchi faqat to'g'ri holatni ko'radi.

---

## Vue bilan solishtirish

Vue-da `onMounted` va `watch` ichida DOM o'lchamlarini o'qish xavfsiz — chunki Vue DOM yangilangandan **keyin**, lekin brauzer chizishdan **oldin** chaqiradi (React-ning `useLayoutEffect` ga o'xshash):

```html
<!-- Vue -->
<template>
    <div ref="tabsRef">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            :ref="el => { if (tab.id === selectedId) activeRef = el }"
            @click="selectedId = tab.id"
        >
            {{ tab.name }}
        </button>
        <div class="highlight" :style="highlightStyle" />
    </div>
</template>

<script setup>
const selectedId = ref(1)
const activeRef = ref(null)

const highlightStyle = computed(() => {
    if (!activeRef.value) return {}
    return {
        left: `${activeRef.value.offsetLeft}px`,
        width: `${activeRef.value.offsetWidth}px`,
    }
})
</script>
```

Vue-da `useLayoutEffect` ga ehtiyoj yo'q — `onMounted` / `watch` allaqachon DOM tayyor bo'lganda ishlaydi.

---

## Qachon useLayoutEffect ishlatish kerak

### KERAK ✅

```tsx
// 1. DOM element o'lchamini o'qish va state ga yozish
useLayoutEffect(() => {
    const { width, height } = elementRef.current.getBoundingClientRect()
    setSize({ width, height })
}, [])

// 2. Element pozitsiyasini hisoblash (tooltip, dropdown, highlight)
useLayoutEffect(() => {
    const rect = targetRef.current.getBoundingClientRect()
    setTooltipPos({ top: rect.bottom, left: rect.left })
}, [isOpen])

// 3. Scroll pozitsiyasini tiklash
useLayoutEffect(() => {
    window.scrollTo(0, savedScrollPos)
}, [page])

// 4. Element fokusi
useLayoutEffect(() => {
    inputRef.current?.focus()
}, [isEditing])
```

### KERAK EMAS ❌ — useEffect ishlating

```tsx
// 1. API so'rov
useEffect(() => { fetchData() }, [])

// 2. Event listener
useEffect(() => {
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
}, [])

// 3. Timer
useEffect(() => {
    const timer = setTimeout(() => { ... }, 1000)
    return () => clearTimeout(timer)
}, [])

// 4. localStorage
useEffect(() => {
    localStorage.setItem('theme', theme)
}, [theme])
```

**Qoida:** DOM o'lchamlari kerak va miltillash muammo bo'lsa → `useLayoutEffect`. Qolgan hamma narsa → `useEffect`.

---

## useLayoutEffect xavfi — performance

`useLayoutEffect` **sinxron** — brauzer kutadi. Agar ichida qimmat hisoblash bo'lsa, sahifa "qotib" qolishi mumkin:

```tsx
// YOMON ❌ — brauzer 500ms kutadi, sahifa qotadi
useLayoutEffect(() => {
    const result = juda_qimmat_hisoblash()  // 500ms
    setState(result)
}, [])

// YAXSHI ✅ — faqat DOM o'qish (tez, 1ms dan kam)
useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect()  // tez
    setPos({ x: rect.left, y: rect.top })
}, [])
```

---

## SSR (Server Side Rendering) bilan muammo

`useLayoutEffect` **serverda ishlamaydi** — chunki serverda DOM yo'q. Next.js yoki SSR ishlatilsa ogohlantirish beradi:

```
Warning: useLayoutEffect does nothing on the server
```

Yechim:
```tsx
// SSR xavfsiz variant
import { useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect
```

---

## Suhbatda so'raladigan savollar

### 1. "useEffect va useLayoutEffect farqi nima?"

useEffect brauzer chizgandan **keyin** ishlaydi (asinxron). useLayoutEffect DOM yangilangandan keyin, brauzer chizishdan **oldin** ishlaydi (sinxron). useLayoutEffect-da state o'zgartirsa — foydalanuvchi miltillash ko'rmaydi.

### 2. "Qachon useLayoutEffect ishlatish kerak?"

DOM elementning o'lchamlari, pozitsiyasi kerak bo'lganda va bu qiymat asosida UI yangilanishi kerak bo'lganda. Masalan: tooltip pozitsiyasi, animated highlight, element o'lchami, scroll tiklash.

### 3. "useLayoutEffect serverda ishlaydi mi?"

Yo'q. SSR da DOM yo'q. Next.js ogohlantirish beradi. Yechim: `typeof window !== 'undefined'` tekshirish yoki `useIsomorphicLayoutEffect` pattern ishlatish.

### 4. "useLayoutEffect performance ga ta'sir qiladimi?"

Ha. U sinxron — brauzer kutadi. Agar ichida qimmat hisoblash bo'lsa, sahifa qotadi. Shuning uchun faqat tez DOM o'qish operatsiyalari uchun ishlatiladi.

### 5. "Vue da useLayoutEffect analogi bormi?"

Vue-da alohida kerak emas. `onMounted` va `watch` o'zi DOM tayyor bo'lganda ishlaydi. Vue-da `nextTick()` ham bor — DOM yangilanishini kutish uchun:
```js
await nextTick()
const rect = el.value.getBoundingClientRect()
```

---

## Xulosa

```
99% hollarda → useEffect
 1% hollarda → useLayoutEffect (faqat DOM o'lchamlari + miltillash muammo)
```

| | `useEffect` | `useLayoutEffect` |
|---|---|---|
| Qachon | Brauzer chizgandan keyin | Brauzer chizishdan oldin |
| Sinxron | Yo'q | Ha |
| Miltillash | Bo'lishi mumkin | Yo'q |
| Performance | Yaxshi | Ehtiyot bo'lish kerak |
| SSR | Ishlaydi | Ishlamaydi |
| Ishlatish | API, timer, listener | DOM o'lcham, pozitsiya |
| Vue analogi | — | `onMounted` / `nextTick` |
