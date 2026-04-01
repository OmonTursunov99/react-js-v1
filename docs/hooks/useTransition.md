# useTransition — past ustuvorlikdagi yangilanishlar

## useTransition nima?

`useTransition` — React 18 da qo'shilgan hook. U state yangilanishlarni **ikki guruhga** bo'ladi:

1. **Urgent (shoshilinch)** — darhol bo'lishi kerak (input yozish, tab bosish, tugma)
2. **Non-urgent (shoshilinch emas)** — biroz kechiksa bo'ladi (jadval, grafik, ro'yxat yangilash)

```tsx
import { useTransition } from 'react'

const [isPending, startTransition] = useTransition()
//      ↑                ↑
//  true/false         non-urgent yangilanish
//  yuklanmoqdami?     shu funksiya ichiga o'rash
```

Vue-da to'g'ridan-to'g'ri analogi **yo'q**. Vue Proxy bilan faqat o'zgargan qismni yangilaydi, shuning uchun bunday ustuvorlik ajratish kerak emas.

---

## Muammo — hammasi urgent bo'lganda

Tasavvur qiling: tab bosilganda **ikkita** narsa yangilanishi kerak:
1. Tab — darhol o'zgarishi **kerak** (foydalanuvchi kutmasligi kerak)
2. Katta jadval — biroz kechiksa **bo'ladi**

```tsx
// MUAMMO — ikkalasi bir xil ustuvorlikda
function handleTabClick(id: number) {
    setSelectedId(id)      // tab o'zgaradi
    setComparisonId(id)    // KATTA jadval qayta render — sekin
}
// Natija: tab ham kechikadi, chunki React ikkalasini birga render qiladi
```

Foydalanuvchi tab bosdi → 200ms hech narsa bo'lmadi → keyin barchasi bir vaqtda yangilandi. Tab **sustlashib** ko'rinadi.

## Yechim — useTransition

```tsx
function handleTabClick(id: number) {
    // Urgent — DARHOL render bo'ladi
    setSelectedId(id)

    // Non-urgent — React bo'sh vaqtda render qiladi
    startTransition(() => {
        setComparisonId(id)
    })
}
// Natija: tab DARHOL o'zgaradi, jadval keyinroq yangilanadi
```

Foydalanuvchi tab bosdi → tab darhol o'zgardi → jadval 100ms keyin yangilandi. **Tab tez**, jadval biroz kechikdi — lekin foydalanuvchi buni sezmaydi.

---

## Qanday ishlaydi?

```
Odatiy setState:
  Tab bosish → [tab + jadval] birga render → 200ms kutish → hammasi yangilanadi

useTransition bilan:
  Tab bosish → [tab] darhol render → tab yangilandi (10ms)
            → [jadval] past ustuvorlikda → jadval yangilandi (190ms keyin)
```

React **urgent** yangilanishni avval qiladi. Agar bu vaqtda yangi urgent kelsa — **non-urgent** ni to'xtatib, avval yangi urgent-ni bajaradi.

---

## isPending — yuklanish holati

```tsx
const [isPending, startTransition] = useTransition()

// isPending = true — non-urgent yangilanish hali tugamagan
// isPending = false — hammasi tayyor
```

Buni UI da ko'rsatish mumkin — masalan, jadval biroz xira bo'ladi:

```tsx
<div className={isPending ? 'opacity-50' : 'opacity-100'}>
    <HeavyComponent />
</div>
```

---

## Loyihadagi misol — TariffsPage

```tsx
// src/pages/tariffs/TariffsPage.tsx

export default function TariffsPage() {
    const [selectedId, setSelectedId] = useState(1)        // Tab uchun — urgent
    const [comparisonId, setComparisonId] = useState(1)    // Jadval uchun — non-urgent
    const [isPending, startTransition] = useTransition()

    function handleTabClick(id: number) {
        // 1. Tab DARHOL o'zgaradi — foydalanuvchi kutmaydi
        setSelectedId(id)

        // 2. Jadval PAST ustuvorlikda — biroz kechiksa bo'ladi
        startTransition(() => {
            setComparisonId(id)
        })
    }

    return (
        <div>
            {/* Tab — selectedId bilan, darhol yangilanadi */}
            <button onClick={() => handleTabClick(2)}>Silver</button>

            {/* Tarif ma'lumoti — selectedId bilan, darhol yangilanadi */}
            <TariffInfo tariff={tariffs.find(t => t.id === selectedId)} />

            {/* Jadval — comparisonId bilan, past ustuvorlikda yangilanadi */}
            <div className={isPending ? 'opacity-50' : 'opacity-100'}>
                <TariffComparison selectedId={comparisonId} />
            </div>
        </div>
    )
}
```

**Nima bo'ladi:**
1. Tab bosildi → `setSelectedId(2)` — tab va tarif ma'lumoti **darhol** yangilanadi
2. `startTransition(() => setComparisonId(2))` — jadval **keyinroq** yangilanadi
3. Jadval yangilanayotganda `isPending = true` → jadval xira ko'rinadi
4. Jadval tayyor → `isPending = false` → normal ko'rinadi

---

## Vue bilan solishtirish

Vue-da useTransition-ga ehtiyoj yo'q. Sabab:

```html
<!-- Vue -->
<template>
    <button @click="selectedId = 2">Silver</button>
    <TariffInfo :tariff="selectedTariff" />
    <TariffComparison :selectedId="selectedId" />
</template>

<script setup>
const selectedId = ref(1)
const selectedTariff = computed(() => tariffs.find(t => t.id === selectedId.value))
</script>
```

Vue Proxy faqat `selectedId` ga bog'liq komponentlarni yangilaydi. Katta jadval bo'lsa ham — Vue faqat o'zgargan qatorlarni yangilaydi, butun jadvalni qayta render qilmaydi.

React-da esa `setState` → **butun komponent daraxt** qayta render. Shuning uchun React-da ustuvorlik ajratish kerak.

| | React | Vue |
|---|---|---|
| Tab + jadval yangilanishi | Ikkalasi birga render → sekin | Faqat o'zgargan qism → tez |
| Yechim | `useTransition` bilan ajratish | Kerak emas |
| Yuklanish indikatori | `isPending` | Kerak emas |

---

## startTransition (hook-siz variant)

Agar `isPending` kerak bo'lmasa — `startTransition` ni to'g'ridan-to'g'ri import qilish mumkin:

```tsx
import { startTransition } from 'react'

function handleClick() {
    // isPending yo'q — faqat ustuvorlikni pasaytirish
    startTransition(() => {
        setHeavyState(newValue)
    })
}
```

| | `useTransition` | `startTransition` |
|---|---|---|
| Import | `import { useTransition }` | `import { startTransition }` |
| isPending | **Bor** | **Yo'q** |
| Hook | Ha — faqat komponent ichida | Yo'q — istalgan joyda |

---

## useTransition vs useDeferredValue

Ikkalasi ham past ustuvorlik uchun, lekin boshqa narsani boshqaradi:

```tsx
// useTransition — setState ni past ustuvorlikka tushiradi
const [isPending, startTransition] = useTransition()
startTransition(() => {
    setQuery(input)  // ← shu setState past ustuvorlik
})

// useDeferredValue — QIYMAT ni past ustuvorlikka tushiradi
const deferredQuery = useDeferredValue(query)
// deferredQuery biroz kechikib yangilanadi
<HeavyList query={deferredQuery} />
```

| | `useTransition` | `useDeferredValue` |
|---|---|---|
| Nima boshqaradi | **setState** ni | **Qiymat** ni |
| isPending | Bor | Yo'q (`query !== deferredQuery` bilan tekshirish mumkin) |
| Qachon ishlatiladi | setState ga kirish imkoni bor | Props yoki tashqi qiymat (setState ga kirish yo'q) |

---

## Qachon useTransition KERAK va KERAK EMAS

### KERAK ✅

```tsx
// 1. Tab o'zgarganda qimmat jadval/grafik yangilanadi
startTransition(() => setChartData(newData))

// 2. Qidiruv — input tez, natijalar kechiksa bo'ladi
function handleSearch(value: string) {
    setInputValue(value)           // input darhol yangilanadi
    startTransition(() => {
        setSearchResults(filter(value))  // natijalar keyinroq
    })
}

// 3. Sahifalar orasida o'tish (React Router lazy bilan)
startTransition(() => {
    navigate('/heavy-page')
})

// 4. Katta ro'yxat filtrlash
startTransition(() => {
    setFilteredItems(items.filter(...))
})
```

### KERAK EMAS ❌

```tsx
// 1. Oddiy, tez yangilanish
setIsOpen(true)          // modal ochish — useTransition kerak emas
setCount(c => c + 1)     // counter — tez

// 2. API so'rov — useTransition API kutishni tezlashtirmaydi
startTransition(() => {
    fetchData()  // ❌ bu network so'rov, React uni tezlashtira olmaydi
})

// 3. Input typing — inputning o'zi urgent bo'lishi KERAK
startTransition(() => {
    setInputValue(value)  // ❌ input sekinlashadi
})
```

**Qoida:** `startTransition` faqat **render** ni kechiktiradi. Network so'rov, timer kabi narsalarga ta'sir qilmaydi.

---

## Suhbatda so'raladigan savollar

### 1. "useTransition nima?"

React 18 hook-i. State yangilanishlarni ikki guruhga bo'ladi: urgent (darhol) va non-urgent (kechiksa bo'ladi). Non-urgent `startTransition` ichiga o'raladi. React avval urgent-ni render qiladi, keyin non-urgent-ni.

### 2. "isPending nima?"

`startTransition` ichidagi yangilanish hali tugamaganligini bildiruvchi boolean. `true` — hali render qilinmoqda, `false` — tayyor. Loading indicator ko'rsatish uchun ishlatiladi.

### 3. "useTransition va Suspense farqi?"

- `useTransition` — state yangilanish **ustuvorligini** boshqaradi
- `Suspense` — asinxron komponent **yuklanishini** boshqaradi (lazy, data fetching)

Birga ishlatilishi mumkin:
```tsx
startTransition(() => {
    navigate('/page')  // lazy loaded sahifa
})
// Suspense fallback o'rniga eski sahifa ko'rsatiladi
```

### 4. "Vue-da nega kerak emas?"

Vue Proxy faqat o'zgargan qismni yangilaydi — butun komponent daraxtni qayta render qilmaydi. React-da `setState` → butun daraxt qayta render → shuning uchun ustuvorlik ajratish kerak.

### 5. "startTransition ichida async bo'lishi mumkinmi?"

React 19-da ha:
```tsx
startTransition(async () => {
    const data = await fetchData()
    setData(data)
})
```

React 18-da yo'q edi — faqat sinxron setState.

### 6. "useTransition va setTimeout farqi?"

```tsx
// setTimeout — React bilmaydi, UI qotadi, isPending yo'q
setTimeout(() => setHeavyState(val), 0)

// useTransition — React biladi, urgent-ni avval qiladi, isPending bor
startTransition(() => setHeavyState(val))
```

`setTimeout` shunchaki kechiktiradi. `useTransition` React-ga ustuvorlik **beradi** — React o'zi qachon qilishni hal qiladi, va agar yangi urgent kelsa — non-urgent-ni to'xtatib, urgent-ni avval bajaradi.

### 7. "Concurrent rendering nima?"

React 18-dan boshlab React render jarayonini **to'xtata oladi**. Oldin: render boshlandi → tugaguncha hech narsa qilolmaydi. Endi: render boshlanadi → urgent keldi → to'xtatadi → urgent-ni qiladi → davom etadi.

`useTransition` aynan shu **concurrent rendering** ga asoslangan.

---

## Xulosa

```
Oddiy setState:       Tab bosish → [tab + jadval birga] → 200ms → hammasi yangilandi
useTransition bilan:  Tab bosish → [tab] → 10ms → tab yangilandi
                                 → [jadval] → 190ms → jadval yangilandi
```

| Xususiyat | React `useTransition` | Vue |
|---|---|---|
| Maqsad | Urgent vs non-urgent ajratish | Kerak emas |
| Nega kerak | React butun daraxtni qayta render qiladi | Vue faqat o'zgargan qismni yangilaydi |
| isPending | Bor — loading indicator uchun | Kerak emas |
| Concurrent | Ha — React render-ni to'xtata oladi | Vue-da bu arxitektura yo'q |
| Qachon ishlatiladi | Qimmat render + tez UI kerak | — |
