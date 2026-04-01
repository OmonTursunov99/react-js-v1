# useDeferredValue — qiymatni kechiktirish

## useDeferredValue nima?

`useDeferredValue` — React 18 hook-i. U qiymatning **eski versiyasini** saqlab turadi, yangi versiyani past ustuvorlikda yangilaydi. Input tez bo'ladi, qimmat render keyinroq bo'ladi.

```tsx
import { useDeferredValue } from 'react'

const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
//    ↑                                  ↑
// kechiktirilgan versiya          haqiqiy qiymat
```

**Misol:** Input-ga "react" yozildi:
```
query:          "r" → "re" → "rea" → "reac" → "react"  (har tugma darhol)
deferredQuery:  ""  → "r"  → "re"  → "rea"  → "react"  (biroz kechikib)
```

Input tez ishlaydi (`query` darhol yangilanadi), qimmat ro'yxat esa kechikib yangilanadi (`deferredQuery` bilan).

---

## useTransition va useDeferredValue farqi

Ikkalasi ham past ustuvorlik uchun, lekin boshqa narsani boshqaradi:

```tsx
// useTransition — setState ni boshqarasan
const [isPending, startTransition] = useTransition()

function handleChange(value: string) {
    setInputValue(value)            // urgent — input darhol
    startTransition(() => {
        setFilteredList(filter(value))  // non-urgent — sen O'ZING ajratasan
    })
}

// useDeferredValue — QIYMAT ni boshqarasan
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)
// React O'ZI ajratadi — query urgent, deferredQuery non-urgent

<input onChange={e => setQuery(e.target.value)} />   // input tez
<HeavyList query={deferredQuery} />                  // ro'yxat kechikib
```

| | `useTransition` | `useDeferredValue` |
|---|---|---|
| Nima boshqaradi | `setState` ni | **Qiymatni** |
| Sen nima qilasan | `startTransition` ichiga o'rash | Qiymatni berish |
| isPending | `isPending` tayyor | Yo'q — `query !== deferredQuery` bilan tekshirish |
| Qachon ishlatiladi | setState ga kirish bor | setState ga kirish **yo'q** (props, tashqi qiymat) |
| Qo'shimcha state | `comparisonId` kabi alohida state kerak | **Kerak emas** — bitta state yetarli |

**Asosiy farq:** `useTransition` da **ikkita state** kerak edi (urgent va non-urgent). `useDeferredValue` da **bitta state** yetarli — React o'zi eski versiyani saqlab turadi.

---

## Muammo va yechim

### Muammo — input yozayotganda UI qotadi

```tsx
function Search() {
    const [query, setQuery] = useState('')

    // MUAMMO: har tugma bosilganda katta ro'yxat qayta render
    const filtered = hugeList.filter(item => item.includes(query))

    return (
        <>
            <input onChange={e => setQuery(e.target.value)} />
            {/* 10,000 ta element — har harf yozilganda qayta render */}
            {filtered.map(item => <p key={item}>{item}</p>)}
        </>
    )
}
// Input sekin — harf yozilganda 200ms kutadi
```

### Yechim — useDeferredValue

```tsx
function Search() {
    const [query, setQuery] = useState('')
    const deferredQuery = useDeferredValue(query)

    // deferredQuery bilan filtrlash — past ustuvorlikda
    const filtered = hugeList.filter(item => item.includes(deferredQuery))

    return (
        <>
            <input onChange={e => setQuery(e.target.value)} />
            {/* Input TEZ — chunki filtrlash deferredQuery bilan */}
            {filtered.map(item => <p key={item}>{item}</p>)}
        </>
    )
}
// Input tez — har harf darhol ko'rinadi
// Ro'yxat biroz kechikib yangilanadi
```

---

## Loyihadagi misol — TariffsPage qidiruv

```tsx
// src/pages/tariffs/TariffsPage.tsx

const [searchQuery, setSearchQuery] = useState('')
const deferredQuery = useDeferredValue(searchQuery)

// Eski va yangi qiymat farqi — loading indicator uchun
const isSearchStale = searchQuery !== deferredQuery
```

```tsx
{/* Input — searchQuery bilan, DARHOL yangilanadi */}
<input
    value={searchQuery}
    onChange={e => setSearchQuery(e.target.value)}
    placeholder="Tarif qidirish..."
/>

{/* Natijalar — deferredQuery bilan, KECHIKIB yangilanadi */}
<div className={isSearchStale ? 'opacity-50' : 'opacity-100'}>
    <TariffSearchResults query={deferredQuery} />
</div>
```

```tsx
// TariffSearchResults — deferredQuery asosida filtrlaydi
function TariffSearchResults({ query }: { query: string }) {
    const filtered = useMemo(() => {
        if (!query) return tariffs
        const q = query.toLowerCase()
        return tariffs.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.features.some(f => f.toLowerCase().includes(q))
        )
    }, [query])

    return filtered.map(t => <div key={t.id}>{t.name}</div>)
}
```

**Nima bo'ladi:**
1. "tel" yozildi → `searchQuery = "tel"` darhol → input yangilandi
2. `deferredQuery` hali `"te"` — ro'yxat eski natijani ko'rsatadi, `isSearchStale = true` → xira
3. React bo'sh vaqtda `deferredQuery = "tel"` → ro'yxat yangilandi, `isSearchStale = false`

---

## Vue bilan solishtirish

Vue-da `useDeferredValue` ga ehtiyoj yo'q. Sabab:
1. Vue Proxy faqat o'zgargan qismni yangilaydi — butun ro'yxat qayta render bo'lmaydi
2. Agar qimmat hisoblash bo'lsa — Vue-da oddiy `debounce` yoki `watchDebounced` ishlatiladi

```html
<!-- Vue — debounce bilan -->
<template>
    <input v-model="query" />
    <div v-for="item in filtered" :key="item.id">{{ item.name }}</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const query = ref('')
const debouncedQuery = ref('')

const onInput = useDebounceFn((val) => {
    debouncedQuery.value = val
}, 300)

watch(query, (val) => onInput(val))

const filtered = computed(() => {
    return items.filter(i => i.includes(debouncedQuery.value))
})
</script>
```

**Muhim farq — debounce vs useDeferredValue:**

| | `debounce` (Vue) | `useDeferredValue` (React) |
|---|---|---|
| Kutish vaqti | Aniq belgilangan (300ms) | React o'zi hal qiladi |
| Moslashuvchan | Yo'q — har doim 300ms | Ha — tez qurilmada tez, sekin qurilmada sekin |
| Oraliq holatlar | Yo'qoladi | Bor — React render-ni to'xtatib, yangi qiymatga o'tadi |

`useDeferredValue` — aqlli debounce. React qurilma tezligiga qarab o'zi kutish vaqtini tanlaydi.

---

## isPending yo'q — qanday tekshirish

`useTransition` da `isPending` tayyor. `useDeferredValue` da yo'q — o'zing solishtirasiz:

```tsx
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)

// Agar farq bo'lsa — hali yangilanmagan
const isStale = query !== deferredQuery

<div className={isStale ? 'opacity-50' : 'opacity-100'}>
    <Results query={deferredQuery} />
</div>
```

---

## Qachon useDeferredValue KERAK

### KERAK ✅

```tsx
// 1. Qidiruv input — input tez, natijalar kechikib
const deferredQuery = useDeferredValue(query)
<SearchResults query={deferredQuery} />

// 2. Props orqali kelgan qiymat — setState ga kirish yo'q
function ChildComponent({ filter }: { filter: string }) {
    const deferredFilter = useDeferredValue(filter)
    const filtered = useMemo(() => heavyFilter(deferredFilter), [deferredFilter])
}

// 3. Katta ro'yxat filtrlash
const deferredSearch = useDeferredValue(search)
const items = useMemo(() => bigList.filter(..., deferredSearch), [deferredSearch])
```

### KERAK EMAS ❌

```tsx
// 1. Kichik ro'yxat — 50 ta element filtrlash tez
const deferredQuery = useDeferredValue(query)  // befoyda

// 2. API so'rov — network kechikishni tezlashtirmaydi
const deferredQuery = useDeferredValue(query)
useEffect(() => { fetch(`/api?q=${deferredQuery}`) }, [deferredQuery])
// ↑ ishlaydi, lekin useTransition yoki debounce yaxshiroq

// 3. setState ga kirish bor — useTransition ishlat
// useDeferredValue o'rniga useTransition soddaroq
```

---

## useDeferredValue + useMemo — birga ishlashi

`useDeferredValue` foyda berishi uchun qimmat hisoblash `useMemo` bilan o'ralishi kerak:

```tsx
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)

// YAXSHI — useMemo bilan, faqat deferredQuery o'zgarganda qayta hisoblanadi
const filtered = useMemo(() => {
    return bigList.filter(item => item.includes(deferredQuery))
}, [deferredQuery])

// YOMON — useMemo yo'q, har renderda qayta hisoblanadi (useDeferredValue befoyda)
const filtered = bigList.filter(item => item.includes(deferredQuery))
```

---

## useTransition bilan bir sahifada — TariffsPage

Bu loyihada TariffsPage-da **ikkalasi** ham ishlatilgan:

```tsx
// useTransition — tab bosganda jadval kechikib yangilanadi
const [isPending, startTransition] = useTransition()
startTransition(() => setComparisonId(id))

// useDeferredValue — qidiruv natijalar kechikib yangilanadi
const deferredQuery = useDeferredValue(searchQuery)
<TariffSearchResults query={deferredQuery} />
```

Nima uchun ikkalasi? Chunki bular **turli muammolarni** hal qiladi:
- `useTransition` — tab bosish uchun (setState ga kirish bor)
- `useDeferredValue` — input yozish uchun (soddaroq, alohida state kerak emas)

---

## Suhbatda so'raladigan savollar

### 1. "useDeferredValue nima?"

Qiymatning eski versiyasini saqlab turuvchi hook. Input tez bo'ladi, qimmat render past ustuvorlikda kechikib yangilanadi. React Concurrent Rendering ga asoslangan.

### 2. "useDeferredValue va debounce farqi?"

Debounce — aniq vaqt kutadi (300ms). useDeferredValue — React qurilma tezligiga qarab o'zi hal qiladi. Tez qurilmada deyarli darhol, sekin qurilmada ko'proq kutadi. Va debounce oraliq qiymatlarni yo'qotadi, useDeferredValue esa React render-ni to'xtatib yangi qiymatga o'tadi.

### 3. "useDeferredValue va useTransition farqi?"

`useTransition` — **setState** ni past ustuvorlikka tushiradi, isPending beradi, alohida state kerak. `useDeferredValue` — **qiymatni** past ustuvorlikka tushiradi, alohida state kerak emas, isPending yo'q (o'zing solishtirasan).

### 4. "useDeferredValue qachon yangilanadi?"

React urgent ishlar tugagandan keyin, bo'sh vaqtda yangilaydi. Aniq vaqt yo'q — qurilma tezligiga bog'liq. Agar yangi urgent kelsa — deferred yangilanishni to'xtatib, urgent-ni avval bajaradi.

### 5. "Vue-da nima ishlatiladi?"

Vue-da Proxy tufayli bunday muammo kam uchraydi. Kerak bo'lsa — `debounce` yoki `@vueuse/core` dan `useDebounceFn` / `watchDebounced` ishlatiladi. React-dagi `useDeferredValue` Vue-ga qaraganda moslashuvchanroq — qurilma tezligiga moslanadi.

### 6. "useDeferredValue bo'sh vaqtda nima qaytaradi?"

Birinchi renderda `useDeferredValue(value)` aynan `value` ni qaytaradi — hech qanday kechikish yo'q. Faqat keyingi renderlarda eski qiymatni saqlab, yangi qiymatga past ustuvorlikda o'tadi.

---

## Xulosa

```
Input: "r" → "re" → "rea" → "react"

useDeferredValue bilan:
  Input (query):          r → re → rea → react     ← HAR tugma DARHOL
  Ro'yxat (deferredQuery): → r  → re  → react      ← KECHIKIB, ba'zilari o'tkazib yuboriladi
```

| Xususiyat | React `useDeferredValue` | Vue |
|---|---|---|
| Maqsad | Qiymatni past ustuvorlikka tushirish | Kerak emas (Proxy) |
| Muqobil | — | `debounce` / `watchDebounced` |
| Moslashuvchan | Ha — qurilma tezligiga qarab | Yo'q — aniq vaqt |
| isPending | Yo'q (`a !== b` bilan) | — |
| Qachon kerak | Input + qimmat render | Kam holatlarda |
