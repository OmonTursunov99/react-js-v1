# useRef — DOM elementga murojaat va doimiy qiymat saqlash

## useRef nima?

`useRef` — React hook-i, **ikki maqsad** uchun ishlatiladi:

1. **DOM elementga to'g'ridan-to'g'ri murojaat** (Vue-dagi `ref="myEl"` + `template ref` analogi)
2. **Qayta render qilmasdan qiymat saqlash** (Vue-da analogi yo'q — oddiy `let` o'zgaruvchiga yaqin)

```tsx
import { useRef } from 'react'

const myRef = useRef(initialValue)
//    ↑                    ↑
//  { current: value }   boshlang'ich qiymat
```

`useRef` har doim **`{ current: ... }`** obyekt qaytaradi. Bu obyekt komponent hayoti davomida o'zgarmaydi — faqat `current` ichidagi qiymat o'zgaradi.

---

## 1-maqsad: DOM elementga murojaat

### React vs Vue

```html
<!-- Vue -->
<template>
  <input ref="inputRef" />
  <button @click="inputRef.focus()">Fokus</button>
</template>

<script setup>
const inputRef = ref(null)
</script>
```

```tsx
// React
import { useRef } from 'react'

function MyComponent() {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <input ref={inputRef} />
            <button onClick={() => inputRef.current?.focus()}>
                Fokus
            </button>
        </>
    )
}
```

**Asosiy farq:**
- Vue: `inputRef.value.focus()` — `.value` orqali
- React: `inputRef.current.focus()` — `.current` orqali

### TypeScript bilan DOM ref

Har bir HTML element o'z tipiga ega:

```tsx
const inputRef = useRef<HTMLInputElement>(null)      // <input>
const divRef = useRef<HTMLDivElement>(null)           // <div>
const buttonRef = useRef<HTMLButtonElement>(null)     // <button>
const dialogRef = useRef<HTMLDialogElement>(null)     // <dialog>
const formRef = useRef<HTMLFormElement>(null)          // <form>
const videoRef = useRef<HTMLVideoElement>(null)        // <video>
const canvasRef = useRef<HTMLCanvasElement>(null)      // <canvas>
```

`null` berish kerak — chunki birinchi renderda element hali DOM-da yo'q.

---

## Amaliy misol: Modal komponenti

Bu loyihadagi `shared/ui/modal/Modal.tsx` — `useRef` ning eng yaxshi misoli:

```tsx
import { useRef, useEffect } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // 1. DOM elementlarga ref
    const dialogRef = useRef<HTMLDialogElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)

    // 2. isOpen o'zgarganda dialog-ni boshqarish
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (isOpen) {
            dialog.showModal()   // DOM API — dialog-ni ochadi
        } else {
            dialog.close()       // DOM API — dialog-ni yopadi
        }
    }, [isOpen])

    // 3. Tashqi qismga bosganda yopish
    function handleBackdropClick(e: React.MouseEvent) {
        // e.target — bosilgan element
        // backdropRef.current — backdrop div
        // Agar bir xil bo'lsa — tashqariga bosildi
        if (e.target === backdropRef.current) {
            onClose()
        }
    }

    return (
        <dialog ref={dialogRef}>
            <div ref={backdropRef} onClick={handleBackdropClick}>
                <div>
                    <h2>{title}</h2>
                    {children}
                </div>
            </div>
        </dialog>
    )
}
```

### Nega bu yerda useRef kerak?

`<dialog>` — brauzerning native HTML elementi. Uni ochish/yopish uchun JavaScript **DOM API** kerak:
- `dialog.showModal()` — modalni ochadi + backdrop qo'shadi + ESC bilan yopish
- `dialog.close()` — modalni yopadi

React bu DOM metodlarni o'zi bermaydi — `useRef` orqali elementga to'g'ridan-to'g'ri murojaat qilamiz.

### Vue bilan solishtirish — Modal

```html
<!-- Vue -->
<template>
  <dialog ref="dialogRef">
    <div ref="backdropRef" @click="handleBackdropClick">
      <div>
        <h2>{{ title }}</h2>
        <slot />
      </div>
    </div>
  </dialog>
</template>

<script setup>
const props = defineProps<{ isOpen: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const backdropRef = ref<HTMLDivElement | null>(null)

watch(() => props.isOpen, (val) => {
    if (val) dialogRef.value?.showModal()
    else dialogRef.value?.close()
})
</script>
```

**Farqlar:**
- Vue: `ref()` — reactive ham, DOM ref ham (ikki maqsad)
- React: `useState` — reactive, `useRef` — DOM ref (ajratilgan)
- Vue: `watch()` — o'zgarishni kuzatish
- React: `useEffect()` — o'zgarishni kuzatish
- Vue: `<slot />` — bola elementlar uchun
- React: `{children}` — bola elementlar uchun
- Vue: `emit('close')` — ota komponentga signal
- React: `onClose()` — prop sifatida funksiya

---

## 2-maqsad: Qayta render qilmasdan qiymat saqlash

Bu `useRef` ning ikkinchi muhim vazifasi — ko'p odamlar buni bilmaydi.

### useState vs useRef — asosiy farq

```tsx
// useState — o'zgarganda komponent QAYTA RENDER bo'ladi
const [count, setCount] = useState(0)
setCount(1)  // → qayta render ✅

// useRef — o'zgarganda komponent QAYTA RENDER BO'LMAYDI
const countRef = useRef(0)
countRef.current = 1  // → hech narsa bo'lmaydi ❌ ekranda o'zgarmaydi
```

### Qachon useRef qiymat saqlash uchun kerak?

**1. Timer ID saqlash:**

```tsx
function Timer() {
    const intervalRef = useRef<number | null>(null)
    const [seconds, setSeconds] = useState(0)

    function start() {
        // Avvalgisini tozalash
        if (intervalRef.current) clearInterval(intervalRef.current)

        intervalRef.current = window.setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
    }

    function stop() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }

    return (
        <div>
            <p>{seconds} sekund</p>
            <button onClick={start}>Boshlash</button>
            <button onClick={stop}>To'xtatish</button>
        </div>
    )
}
```

Nega `useState` emas? Chunki timer ID ni ekranda ko'rsatish kerak emas. `useState` ishlatilsa — har `setIntervalId(...)` da keraksiz qayta render bo'ladi.

**2. Oldingi qiymatni saqlash:**

```tsx
function Counter() {
    const [count, setCount] = useState(0)
    const prevCountRef = useRef(0)

    useEffect(() => {
        prevCountRef.current = count  // har renderdan keyin yangilanadi
    })

    return (
        <div>
            <p>Hozirgi: {count}</p>
            <p>Oldingi: {prevCountRef.current}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
    )
}
```

**3. Birinchi rendermi yoki yo'qligini aniqlash:**

```tsx
function MyComponent() {
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return  // birinchi renderda hech narsa qilma
        }
        // faqat keyingi renderlarda ishlaydi
        console.log('Yangilandi!')
    })
}
```

---

## useRef ning muhim xususiyatlari

### 1. current o'zgarganda qayta render YO'Q

```tsx
const ref = useRef(0)
ref.current = 100  // komponent qayta render bo'lMAYDI
// Ekranda hech narsa o'zgarmaydi
```

Bu useState-dan eng katta farq. Shuning uchun ekranda ko'rsatiladigan ma'lumot uchun useRef ISHLATILMASLIGI kerak.

### 2. Renderlar orasida qiymat saqlanadi

Oddiy `let` o'zgaruvchi har renderda qaytadan yaratiladi:

```tsx
function Counter() {
    let count = 0          // har renderda 0 ga qaytadi!
    count++                // 1 bo'ladi, lekin keyingi renderda yana 0

    const countRef = useRef(0)
    countRef.current++     // 1, 2, 3... — saqlanib qoladi
}
```

### 3. ref qiymati sinxron o'zgaradi

```tsx
// useState — asinxron (keyingi renderda yangilanadi)
setCount(5)
console.log(count)  // eski qiymat!

// useRef — sinxron (darhol yangilanadi)
countRef.current = 5
console.log(countRef.current)  // 5 ✅
```

---

## useRef vs useState — qachon nimani ishlatish

| Savol | useState | useRef |
|---|---|---|
| Ekranda ko'rsatish kerakmi? | **Ha** → useState | Yo'q → useRef |
| O'zgarganda qayta render kerakmi? | **Ha** → useState | Yo'q → useRef |
| DOM elementga murojaat? | — | **Ha** → useRef |
| Timer/interval ID? | — | **Ha** → useRef |
| Oldingi qiymat? | — | **Ha** → useRef |

**Qoida: Agar qiymat UI ga ta'sir qilsa → useState. Aks holda → useRef.**

---

## Vue bilan yakuniy solishtirish

| Xususiyat | React `useRef` | Vue `ref()` |
|---|---|---|
| DOM ga murojaat | `useRef<HTMLDivElement>(null)` | `ref<HTMLDivElement>()` |
| DOM ga yozish | `ref={myRef}` (JSX prop) | `ref="myRef"` (template attribute) |
| Qiymatga murojaat | `myRef.current` | `myRef.value` |
| O'zgarganda render | **Yo'q** | **Ha** (chunki Vue ref reactive) |
| Reactive mi? | **Yo'q** | **Ha** |

Vue-da `ref()` **ikkala** vazifani bajaradi — DOM ref ham, reactive qiymat ham. React-da bular ajratilgan:
- Reactive qiymat → `useState`
- DOM ref + non-reactive qiymat → `useRef`

---

## Suhbatda so'raladigan savollar

### 1. "useRef va useState farqi nima?"

useState o'zgarganda komponent qayta render bo'ladi. useRef o'zgarganda — bo'lmaydi. useState — UI uchun, useRef — DOM yoki ichki qiymatlar uchun.

### 2. "useRef va createRef farqi nima?"

```tsx
// useRef — hook, renderlar orasida BIR XiL obyekt
const ref = useRef(null)  // har renderda aynan shu obyekt

// createRef — har renderda YANGI obyekt yaratadi
const ref = createRef()   // har renderda yangi { current: null }
```

`createRef` — class komponentlar uchun eski usul. Funksional komponentlarda faqat `useRef` ishlatiladi.

### 3. "useRef bilan state saqlash mumkinmi?"

Texnik jihatdan ha, lekin noto'g'ri. useRef o'zgarganda React bilmaydi — ekranda eski ma'lumot qoladi. Faqat ekranda ko'rsatish kerak BO'LMAGAN qiymatlar uchun useRef ishlatiladi.

### 4. "Callback ref nima?"

`useRef` o'rniga funksiya berish mumkin — element yaratilganda chaqiriladi:

```tsx
// Oddiy ref
const inputRef = useRef<HTMLInputElement>(null)
<input ref={inputRef} />

// Callback ref — element paydo bo'lganda darhol fokus
<input ref={(el) => el?.focus()} />

// Callback ref — o'lchamni bilish uchun
function MeasuredComponent() {
    const [height, setHeight] = useState(0)

    const measuredRef = (node: HTMLDivElement | null) => {
        if (node) {
            setHeight(node.getBoundingClientRect().height)
        }
    }

    return <div ref={measuredRef}>Balandlik: {height}px</div>
}
```

Vue-da analogi: `:ref="(el) => ..."` — funksional ref.

### 5. "useRef render paytida o'qish/yozish mumkinmi?"

```tsx
// NOTO'G'RI ❌ — render paytida ref.current yozish
function Bad() {
    const ref = useRef(0)
    ref.current++           // render paytida! Bug yuzaga keladi
    return <p>{ref.current}</p>
}

// TO'G'RI ✅ — event yoki useEffect ichida
function Good() {
    const ref = useRef(0)

    useEffect(() => {
        ref.current++       // effect ichida — to'g'ri
    })

    function handleClick() {
        ref.current++       // event ichida — to'g'ri
    }
}
```

React StrictMode-da render ikki marta chaqiriladi. Agar render paytida `ref.current` yozilsa — qiymat ikki marta o'zgaradi va bug bo'ladi.

### 6. "forwardRef nima va qachon kerak?"

Agar siz **bola komponentga** ref bermoqchi bo'lsangiz, bola komponent `forwardRef` ishlatishi kerak:

```tsx
// Oddiy komponent — ref qabul qila olmaydi
function Input() {
    return <input />
}
// <Input ref={myRef} /> — ISHLAMAYDI! ❌

// forwardRef bilan — ref qabul qiladi
import { forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement>((props, ref) => {
    return <input ref={ref} {...props} />
})
// <Input ref={myRef} /> — ISHLAYDI ✅
```

Vue-da bu muammo yo'q — bola komponentga `ref` qo'ysangiz, u avtomatik komponent instance-ni beradi. `defineExpose()` bilan qaysi metodlarni ko'rsatishni tanlash mumkin.

### 7. "useImperativeHandle nima?"

`forwardRef` bilan birga ishlatiladi — ota komponentga faqat kerakli metodlarni ochish:

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react'

interface InputHandle {
    focus: () => void
    clear: () => void
}

const FancyInput = forwardRef<InputHandle>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        clear: () => {
            if (inputRef.current) inputRef.current.value = ''
        },
    }))

    return <input ref={inputRef} {...props} />
})

// Ota komponentda:
const inputRef = useRef<InputHandle>(null)
inputRef.current?.focus()
inputRef.current?.clear()
```

Vue analogi: `defineExpose({ focus, clear })` — aynan bir xil maqsad.
