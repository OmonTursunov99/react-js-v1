import type { Topic } from '../../types'

export const batching: Topic = {
    id: 'batching',
    title: 'State Batching',
    importance: 3,
    status: 'to-learn' as const,
    description: 'Bir nechta setState-ni birlashtirib bitta render qilish — performance uchun muhim',
    content: `Batching — React-ning bir nechta setState chaqiruvlarni BIRLASHTIRIB bitta render qilish mexanizmi.

═══════════════════════════════════════
  BATCHING NIMA
═══════════════════════════════════════

Tasavvur qiling: bitta funksiya ichida 3 ta setState chaqirdingiz.
Batching-SIZ: 3 ta render (sekin)
Batching BILAN: 1 ta render (tez)

setState(a)  // render YO'Q
setState(b)  // render YO'Q
setState(c)  // render YO'Q
// funksiya tugadi → BITTA render

═══════════════════════════════════════
  REACT 17 vs REACT 18 FARQI
═══════════════════════════════════════

REACT 17 — faqat event handler-larda batching:
✅ onClick ichida — batching ISHLAYDI
❌ setTimeout ichida — batching ISHLAMAYDI
❌ Promise.then ichida — batching ISHLAMAYDI
❌ Native event ichida — batching ISHLAMAYDI

REACT 18+ — AUTOMATIC BATCHING — HAMMASI:
✅ onClick ichida — batching ISHLAYDI
✅ setTimeout ichida — batching ISHLAYDI
✅ Promise.then ichida — batching ISHLAYDI
✅ Native event ichida — batching ISHLAYDI

Bu React 18-ning eng muhim yangiliklaridam biri — createRoot() orqali yoqiladi.

═══════════════════════════════════════
  flushSync — BATCHING-NI O'CHIRISH
═══════════════════════════════════════

import { flushSync } from 'react-dom'

flushSync(() => {
  setState(a) // DARHOL render
})
flushSync(() => {
  setState(b) // DARHOL render
})
// 2 ta alohida render bo'ladi

flushSync kamdan-kam kerak — faqat DOM o'lchamlarini o'qish kerak bo'lganda.

═══════════════════════════════════════
  NIMA UCHUN KERAK (PERFORMANCE)
═══════════════════════════════════════

Har bir render = Virtual DOM yaratish + diff + commit.
3 ta state o'zgarsa va 3 ta render bo'lsa — 3 MARTA bu jarayon.
Batching bilan 1 MARTA — 3x tezroq.`,
    codeExamples: [
        {
            title: '3 ta setState — 1 ta render',
            language: 'tsx' as const,
            code: `import { useState } from 'react'
import { flushSync } from 'react-dom'

function BatchingDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [flag, setFlag] = useState(false)

  let renderCount = 0
  renderCount++ // Har renderda oshadi
  console.log('Render #', renderCount)

  // ✅ BATCHING — 3 ta setState, lekin BITTA render
  const handleBatched = () => {
    setCount(c => c + 1)   // render yo'q
    setText('yangilandi')   // render yo'q
    setFlag(f => !f)        // render yo'q
    // funksiya tugadi → BITTA render
    console.log('3 ta setState — 1 render!')
  }

  // ✅ React 18: setTimeout ichida ham batching ishlaydi
  const handleAsync = () => {
    setTimeout(() => {
      setCount(c => c + 1)  // React 17: darhol render | React 18: batch
      setText('async')       // React 17: darhol render | React 18: batch
      // React 18: BITTA render
    }, 100)
  }

  // ❌ flushSync — batching-ni o'chirish (kamdan-kam kerak)
  const handleFlushSync = () => {
    flushSync(() => {
      setCount(c => c + 1) // DARHOL render (1-render)
    })
    // Shu yerda DOM yangilangan — o'lcham o'qish mumkin
    flushSync(() => {
      setText('flush')      // DARHOL render (2-render)
    })
    // 2 ta alohida render bo'ldi
  }

  return (
    <div>
      <p>Count: {count} | Text: {text} | Flag: {String(flag)}</p>
      <button onClick={handleBatched}>Batching (1 render)</button>
      <button onClick={handleAsync}>Async batching</button>
      <button onClick={handleFlushSync}>flushSync (2 render)</button>
    </div>
  )
}`,
            description: `React 18+ da barcha kontekstlarda automatic batching ishlaydi. 3 ta setState = 1 ta render. flushSync bilan batching-ni o'chirish mumkin (kamdan-kam kerak).`,
        },
    ],
    interviewQA: [
        {
            question: 'State batching nima?',
            answer: `Batching — React-ning bir nechta setState chaqiruvlarni birlashtirib BITTA render qilish mexanizmi. Masalan, 3 ta setState chaqirilsa — 3 ta render emas, 1 ta render bo'ladi. Bu performance uchun juda muhim — har render Virtual DOM yaratish + diff + commit degani.`,
        },
        {
            question: 'React 17 va React 18 da batching qanday farq qiladi?',
            answer: 'React 17 da batching FAQAT event handler-larda ishlardi. setTimeout, Promise.then, native event-larda har setState alohida render qilardi. React 18 da AUTOMATIC BATCHING joriy etildi — BARCHA kontekstlarda batching ishlaydi: event handler, setTimeout, Promise, native event. Bu createRoot() orqali yoqiladi (eski ReactDOM.render() bilan ishlamaydi).',
        },
        {
            question: 'flushSync nima va qachon ishlatiladi?',
            answer: `flushSync — batching-ni o'chirib, setState-ni darhol render qilish funksiyasi (react-dom dan import). Kamdan-kam kerak — faqat DOM o'zgarishini DARHOL ko'rish kerak bo'lganda. Masalan, setState-dan keyin element o'lchamini o'qish kerak bo'lsa. Oddiy hollarda ishlatish TAVSIYA ETILMAYDI — batching performance uchun yaxshi.`,
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'use-state', label: 'useState' },
        { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
        { sectionId: 'performance', topicId: 're-render-causes', label: 'Re-render sabablari' },
    ],
}
