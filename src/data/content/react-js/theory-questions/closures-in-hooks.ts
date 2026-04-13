import type { Topic } from '../../../types'

export const closuresInHooks: Topic = {
    id: 'closures-in-hooks',
    title: 'Closures in Hooks (Stale Closures)',
    importance: 3,
    status: 'to-learn',
    description: 'Eskirgan closure muammosi — useEffect, useCallback, setTimeout ichida',
    content: `Stale closure — hook-lar ichida ESKI render-dagi qiymatni ishlatish muammosi. React-ning eng ko'p uchraydigan bug-laridan biri.

═══════════════════════════════════════
  CLOSURE NIMA
═══════════════════════════════════════

Closure — funksiya yaratilgan scope-dagi o'zgaruvchilarni "eslab qolishi".

  function outer() {
    const x = 10
    function inner() {
      console.log(x)  // x ni "eslab qoladi"
    }
    return inner
  }

React-da HAR RENDER yangi closure yaratadi:
  function Counter() {
    const [count, setCount] = useState(0)
    // count — SHU render-dagi qiymat (closure)
    // Keyingi render-da YANGI count, YANGI closure
  }

═══════════════════════════════════════
  STALE CLOSURE MUAMMOSI
═══════════════════════════════════════

  function Counter() {
    const [count, setCount] = useState(0)

    useEffect(() => {
      const timer = setInterval(() => {
        console.log(count)  // DOIM 0! (birinchi render-dagi closure)
      }, 1000)
      return () => clearInterval(timer)
    }, [])  // ← bo'sh deps! Effect faqat mount-da ishlaydi

    return <p>{count}</p>
  }

Muammo: useEffect faqat mount-da yaratiladi ([] deps).
Ichidagi closure birinchi render-dagi count=0 ni "eslab qoladi".
count o'zgarsa ham — closure ESKi qiymatni ko'radi.

═══════════════════════════════════════
  YECHIMLAR
═══════════════════════════════════════

1. TO'G'RI DEPENDENCY:
   useEffect(() => {
     const timer = setInterval(() => console.log(count), 1000)
     return () => clearInterval(timer)
   }, [count])  // count o'zgarsa effect qayta yaratiladi

2. UPDATER FUNCTION:
   setCount(prev => prev + 1)  // prev DOIM eng yangi

3. useRef (mutable reference):
   const countRef = useRef(count)
   countRef.current = count  // har renderda yangilanadi

   useEffect(() => {
     const timer = setInterval(() => {
       console.log(countRef.current)  // DOIM yangi qiymat
     }, 1000)
     return () => clearInterval(timer)
   }, [])`,
    codeExamples: [
      {
        title: 'Stale closure muammosi va yechimlari',
        language: 'tsx',
        code: `import { useState, useEffect, useRef, useCallback } from 'react'

// ❌ STALE CLOSURE
function BadTimer() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(\`3 sekund oldin count = \${count}\`)
      // count DOIM boshlang'ich qiymati (stale!)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])  // ← bo'sh deps

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <p>{message}</p>
    </div>
  )
}

// ✅ YECHIM 1: to'g'ri dependency
function GoodTimer1() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(\`3 sekund oldin count = \${count}\`)
    }, 3000)
    return () => clearTimeout(timer)
  }, [count])  // ← count deps-da — har o'zgarishda yangi timer

  return <div>...</div>
}

// ✅ YECHIM 2: useRef (timer o'zgarmasligi kerak bo'lganda)
function GoodTimer2() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)

  // Har renderda ref yangilanadi
  countRef.current = count

  useEffect(() => {
    const timer = setInterval(() => {
      // ref.current DOIM eng yangi qiymat
      console.log('Hozirgi count:', countRef.current)
    }, 1000)
    return () => clearInterval(timer)
  }, [])  // Effect faqat 1 marta, lekin ref yangi

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}

// ✅ YECHIM 3: updater function (setState uchun)
function GoodCounter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1)  // prev DOIM eng yangi
      // setCount(count + 1) ← XATO! count stale bo'ladi
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return <p>Count: {count}</p>
}`,
        description: 'Stale closure: bo\'sh deps bilan effect eski qiymatni ko\'radi. Yechimlar: 1) to\'g\'ri deps, 2) useRef (mutable), 3) updater function (prev => prev + 1).',
      },
    ],
    interviewQA: [
      {
        question: 'Stale closure nima?',
        answer: `Stale closure — hook ichidagi funksiya ESKI render-dagi qiymatni ishlatishi. Sabab: React har renderda yangi closure yaratadi. Agar useEffect/useCallback/setTimeout bo'sh dependency bilan yaratilsa — birinchi render-dagi qiymatni "eslab qoladi". count o'zgarsa ham closure ESKi count ko'radi. Yechimlar: 1) dependency-ga qo'shish, 2) useRef (mutable reference), 3) updater function (prev => prev + 1).`,
      },
      {
        question: 'useRef stale closure-ni qanday hal qiladi?',
        answer: `useRef — renderlar orasida MUTABLE reference saqlaydi. ref.current o'zgarganda re-render bo'lMAYDI. Pattern: const countRef = useRef(count); countRef.current = count (har renderda yangilanadi). Effect ichida: countRef.current — DOIM eng yangi qiymat. Chunki ref ob'ekt referensi O'ZGARMAYDI, faqat .current o'zgaradi. Effect closure eski ref ni ko'rsa ham — ref.current yangi qiymat.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect dependencies' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-callback', label: 'useCallback dependencies' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-ref', label: 'useRef (yechim)' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'rules-of-hooks', label: 'Rules of Hooks' },
    ],
  }
