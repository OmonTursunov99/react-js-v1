import type { Topic } from '../../types'

export const renderingCycle: Topic = {
    id: 'rendering-cycle',
    title: 'React Rendering Cycle',
    importance: 3,
    status: 'to-learn' as const,
    description: 'React rendering jarayoni — Render fazasi, Commit fazasi, trigger sabablari',
    content: `React rendering — bu React komponentlarni chaqirib, Virtual DOM yaratish jarayoni. Bu haqiqiy DOM yangilanishi EMAS!

═══════════════════════════════════════
  2 TA FAZA
═══════════════════════════════════════

React rendering 2 fazadan iborat:

1. RENDER FAZASI (Render Phase):
   - React komponentni chaqiradi (funksiyani ishga tushiradi)
   - Virtual DOM yaratadi
   - Bu faza PURE bo'lishi kerak — side-effect yo'q!
   - DOM-ga TEGMAYDI

2. COMMIT FAZASI (Commit Phase):
   - React Virtual DOM farqlarni haqiqiy DOM-ga qo'llaydi
   - Bu faza haqiqiy DOM-ni o'zgartiradi

═══════════════════════════════════════
  RENDER FAZASI BATAFSIL
═══════════════════════════════════════

React tree-ni yuqoridan pastga yuradi:
1. "Dirty" (o'zgargan) komponentni topadi
2. Bu komponentni CHAQIRADI (funksiyani ishlatadi)
3. Barcha BOLALARINI ham render qiladi
4. Virtual DOM natijasini qaytaradi

MUHIM: "Rendering" = komponent funksiyasi chaqirildi.
Bu haqiqiy DOM yangilandi degani EMAS!

Komponent "render bo'ldi" deyilsa:
- Funksiya ishladi ✅
- DOM o'zgardi ❌ (balki o'zgarmagan — agar farq yo'q bo'lsa)

═══════════════════════════════════════
  COMMIT FAZASI BATAFSIL
═══════════════════════════════════════

Render fazasidan keyin React commit qiladi:

1. Virtual DOM farqlarni haqiqiy DOM-ga QOLLAYDI
2. useLayoutEffect ishlaydi (DOM tayyor, lekin brauzer chizmagan)
3. Brauzer PAINT qiladi (ekranga chizadi)
4. useEffect ishlaydi (paint-dan keyin)

Ketma-ketlik:
Render → DOM yangilanadi → useLayoutEffect → Paint → useEffect

═══════════════════════════════════════
  TRIGGER — RENDERING NIMA SABABDAN BOSHLANADI
═══════════════════════════════════════

Rendering 3 ta sababdan boshlanadi:

1. INITIAL RENDER — komponent birinchi marta DOM-ga qo'yilganda
2. setState CHAQIRILGANDA — state o'zgarganda
3. PARENT RE-RENDER — ota-komponent renderlaganda BARCHA bolalari ham renderlanadi

3-chi sabab eng muhimi:
- Parent renderlanadi → Child ham renderlanadi (props o'zgarmasam ham!)
- Bu React-ning default xatti-harakati
- React.memo bilan oldini olish mumkin

═══════════════════════════════════════
  BATCHING
═══════════════════════════════════════

Bir event ichidagi barcha setState-lar birlashtiriladi — BITTA render.

setState(a)  // render yo'q
setState(b)  // render yo'q
setState(c)  // render yo'q
// event tugadi → BITTA render

React 18+ dan boshlab BARCHA kontekstlarda batching ishlaydi:
- Event handler ✅
- setTimeout ✅
- Promise.then ✅
- Native event listener ✅

═══════════════════════════════════════
  BAIL OUT (RENDER QILMASLIK)
═══════════════════════════════════════

React ba'zi hollarda renderni O'TKAZIB YUBORADI:

1. setState eski qiymat bilan chaqirilsa:
   - Object.is(eskiQiymat, yangiQiymat) === true bo'lsa
   - React renderlaMAYDI

2. React.memo bilan:
   - Props o'zgarmasam — child renderlaMAYDI`,
    codeExamples: [
        {
            title: 'Render vs Commit — render sonini kuzatish',
            language: 'tsx' as const,
            code: `import { useState, useEffect, useRef } from 'react'

function RenderCounter() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const renderCount = useRef(0)

  // Har renderda oshadi
  renderCount.current += 1

  useEffect(() => {
    // Bu faqat COMMIT fazasidan keyin ishlaydi
    console.log('useEffect: DOM yangilandi, brauzer paint qildi')
  })

  console.log('Render fazasi: funksiya chaqirildi. Render #', renderCount.current)

  return (
    <div>
      <p>Render soni: {renderCount.current}</p>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Count oshirish (render bo'ladi)
      </button>

      <button onClick={() => setCount(count)}>
        Eski qiymat (render BO'LMAYDI — bail out)
      </button>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Har harf — yangi render"
      />
    </div>
  )
}`,
            description: `Har bir render fazasida console.log ishlaydi. useEffect faqat commit fazasidan keyin ishlaydi. setState eski qiymat bilan chaqirilsa — render bo'lmaydi (bail out).`,
        },
        {
            title: 'Bail out — setState eski qiymat bilan',
            language: 'tsx' as const,
            code: `import { useState } from 'react'

function BailOutDemo() {
  const [name, setName] = useState('Ali')

  console.log('Render bo'ldi!') // Bu chiqmasa = bail out ishladi

  return (
    <div>
      <p>Ism: {name}</p>

      {/* Bu render QILADI — yangi qiymat */}
      <button onClick={() => setName('Vali')}>
        Ismni o'zgartirish
      </button>

      {/* Bu render QILMAYDI — eski qiymat (Object.is) */}
      <button onClick={() => setName('Ali')}>
        Eski ismni qo'yish (bail out)
      </button>

      {/* ⚠️ EHTIYOT: object uchun ISHLAMAYDI! */}
      {/* Chunki {} !== {} (referens boshqa) */}
      {/* setUser({ name: 'Ali' }) — HAR DOIM render qiladi */}
    </div>
  )
}`,
            description: `setState eski qiymat bilan chaqirilganda React Object.is() bilan taqqoslaydi. Agar teng bo'lsa — render qilmaydi (bail out). Lekin object/array uchun bu ishlamaydi — chunki yangi object yaratiladi va referens boshqa bo'ladi.`,
        },
    ],
    interviewQA: [
        {
            question: 'Render va Commit fazasi orasidagi farq nima?',
            answer: `Render fazasida React komponent funksiyasini chaqiradi va Virtual DOM yaratadi — bu faza PURE bo'lishi kerak, hech qanday side-effect bo'lmasligi kerak, DOM-ga tegmaydi. Commit fazasida esa React Virtual DOM dagi farqlarni haqiqiy DOM-ga qo'llaydi, keyin useLayoutEffect ishlaydi, brauzer paint qiladi, va useEffect ishlaydi. Qisqasi: Render = hisoblash, Commit = DOM yangilash.`,
        },
        {
            question: 'Rendering deganda DOM yangilanadimi?',
            answer: `Yo'q! "Rendering" — bu faqat komponent funksiyasini chaqirish va Virtual DOM yaratish. DOM ga tegmaydi. DOM faqat Commit fazasida yangilanadi, va u ham faqat farq bo'lsa. Masalan, komponent render bo'lishi mumkin, lekin agar Virtual DOM-da farq yo'q bo'lsa — DOM umuman o'zgarmaydi.`,
        },
        {
            question: 'Qanday holatda komponent renderlanadi?',
            answer: `3 ta holat: 1) Initial render — komponent birinchi marta mount bo'lganda, 2) setState chaqirilganda — agar yangi qiymat eskisidan farq qilsa (Object.is bilan tekshiriladi), 3) Parent re-render — ota-komponent re-render bo'lganda BARCHA bolalari ham re-render bo'ladi (props o'zgarmasam ham!). 3-chi holatni React.memo bilan oldini olish mumkin.`,
        },
        {
            question: 'Batching qanday ishlaydi va nima uchun kerak?',
            answer: `Batching — bir event ichidagi barcha setState chaqiruvlarni birlashtirib bitta render qilish. Masalan, 3 ta setState chaqirilsa — 3 ta render emas, BITTA render bo'ladi. React 17 da faqat event handler-larda ishlardi. React 18+ dan boshlab BARCHA kontekstlarda ishlaydi: setTimeout, Promise.then, native eventlarda ham. Bu performance uchun juda muhim — keraksiz re-render-lar oldini oladi. flushSync() bilan batching-ni o'chirib, har bir setState-ni alohida render qilish mumkin.`,
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'batching', label: 'Batching' },
        { sectionId: 'react-core', topicId: 'virtual-dom', label: 'Virtual DOM' },
        { sectionId: 'theory-questions', topicId: 'react-lifecycle', label: 'React Lifecycle' },
        { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
    ],
}
