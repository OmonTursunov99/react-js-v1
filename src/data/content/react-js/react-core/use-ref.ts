import type { Topic } from '../../../types'

export const useRef: Topic = {
    id: 'use-ref',
    title: 'useRef',
    importance: 3,
    status: 'to-learn' as const,
    description: `DOM elementga murojaat va o'zgarmas qiymat saqlash`,
    content: `useRef — React-da ikki xil maqsadda ishlatiladigan hook: 1) DOM elementga to'g'ridan-to'g'ri murojaat qilish, 2) Renderlar orasida qiymat saqlash (lekin render QILMAYDI).

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  const ref = useRef(initialValue)

- ref — { current: initialValue } shaklidagi object qaytaradi
- ref.current — hozirgi qiymatni o'qish/yozish
- initialValue — boshlang'ich qiymat (faqat birinchi renderda o'rnatiladi)
- useRef HAR RENDERDA BIR XIL object qaytaradi (yangi yaratmaydi)

═══════════════════════════════════════
  2 TA ASOSIY VAZIFASI
═══════════════════════════════════════

1) DOM ELEMENTGA MUROJAAT:
   Input-ga focus qilish, scroll qilish, video play/pause,
   canvas bilan ishlash — bular uchun real DOM element kerak.

   const inputRef = useRef<HTMLInputElement>(null)
   // ...
   <input ref={inputRef} />
   // Keyin:
   inputRef.current?.focus()

2) RENDER-LAR ORASIDA QIYMAT SAQLASH:
   Timer ID, oldingi state qiymati, WebSocket instance,
   flag-lar — bularni saqlash kerak lekin o'zgarganda
   RENDER BO'LMASLIGI kerak.

   const timerRef = useRef<number | null>(null)
   timerRef.current = setInterval(...)
   // timerRef.current o'zgarsa — RENDER YO'Q!

═══════════════════════════════════════
  useState vs useRef FARQI
═══════════════════════════════════════

  useState:
  - O'zgarganda komponent QAYTA RENDERLANADI
  - Qiymat keyingi renderda yangilanadi
  - Immutable — setState orqali o'zgartirish kerak

  useRef:
  - O'zgarganda komponent RENDERLANNMAYDI
  - Qiymat DARHOL yangilanadi (sinxron)
  - Mutable — ref.current = newValue to'g'ridan-to'g'ri

  Qoida: Agar qiymat EKRANDA ko'rinishi kerak — useState.
  Agar faqat SAQLASH kerak — useRef.

═══════════════════════════════════════
  DOM REF PATTERN
═══════════════════════════════════════

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Mount bo'lgandan KEYIN ref.current tayyor
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} />

MUHIM: ref.current RENDER VAQTIDA null bo'lishi mumkin.
DOM ref faqat komponent mount bo'lgandan keyin tayyor bo'ladi.
Shuning uchun useEffect ichida ishlatish kerak.

═══════════════════════════════════════
  CALLBACK REF
═══════════════════════════════════════

Oddiy ref={myRef} o'rniga FUNKSIYA berish mumkin:

  function MyComponent() {
    const handleRef = (node: HTMLDivElement | null) => {
      if (node) {
        // Element DOM-ga qo'shildi (mount)
        console.log('Element balandligi:', node.offsetHeight)
      } else {
        // Element DOM-dan o'chirildi (unmount)
      }
    }

    return <div ref={handleRef}>Salom</div>
  }

Callback ref QACHON KERAK:
- Dynamic element-lar (conditional rendering, list)
- Element o'lchamini mount vaqtida bilish kerak
- Bir nechta ref-ni birlashtirib ishlatish

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

DOM ref uchun HTML element tiplarini ishlatish kerak:

  useRef<HTMLInputElement>(null)    // <input>
  useRef<HTMLDivElement>(null)      // <div>
  useRef<HTMLButtonElement>(null)   // <button>
  useRef<HTMLFormElement>(null)     // <form>
  useRef<HTMLCanvasElement>(null)   // <canvas>
  useRef<HTMLVideoElement>(null)    // <video>

Qiymat saqlash uchun:

  useRef<number>(0)                 // oddiy son
  useRef<NodeJS.Timeout | null>(null) // timer ID
  useRef<boolean>(false)            // flag

MUHIM TypeScript farq:
  useRef<HTMLInputElement>(null)  // tip: RefObject — readonly current
  useRef<number>(0)               // tip: MutableRefObject — yozish mumkin

═══════════════════════════════════════
  ANTI-PATTERNS
═══════════════════════════════════════

1. RENDER VAQTIDA ref.current O'QISH/YOZISH:

   // NOTO'G'RI — concurrent mode-da xavfli:
   function MyComponent() {
     const ref = useRef(0)
     ref.current += 1  // RENDER VAQTIDA yozish!
     return <p>{ref.current}</p>  // RENDER VAQTIDA o'qish!
   }

   // TO'G'RI — useEffect yoki event handler ichida:
   useEffect(() => {
     ref.current += 1
   })

2. ref.current NI DEPENDENCY ARRAY-GA QO'YISH:

   // FOYDASIZ — ref.current o'zgarsa trigger bo'lmaydi:
   useEffect(() => {
     console.log(ref.current)
   }, [ref.current])  // ESLint warning!

3. DOM ref-ni RENDER VAQTIDA ishlatish:

   // NOTO'G'RI — mount bo'lmagan, null bo'ladi:
   function MyComponent() {
     const ref = useRef<HTMLInputElement>(null)
     ref.current?.focus()  // Bu yerda hali null!
     return <input ref={ref} />
   }`,
    codeExamples: [
      {
        title: 'Input focus — button bosilganda focus',
        language: 'tsx' as const,
        code: `import { useRef } from 'react'

function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleClick() {
    // DOM elementga to'g'ridan-to'g'ri murojaat
    inputRef.current?.focus()
  }

  return (
    <div>
      <input ref={inputRef} placeholder="Yozing..." />
      <button onClick={handleClick}>Focus qilish</button>
    </div>
  )
}`,
        description: `Eng ko'p ishlatiladigan useRef pattern. inputRef.current input DOM elementiga teng. .focus() — brauzer API. ref={inputRef} orqali React DOM elementni ref.current ga yozadi.`,
      },
      {
        title: 'Oldingi qiymatni eslab qolish (previous value)',
        language: 'tsx' as const,
        code: `import { useState, useRef, useEffect } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef<number>(0)

  useEffect(() => {
    // Har renderdan KEYIN oldingi qiymatni saqlash
    prevCountRef.current = count
  }) // dependency yo'q — har renderda ishlaydi

  return (
    <div>
      <p>Hozirgi: {count}</p>
      <p>Oldingi: {prevCountRef.current}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}

// Custom hook sifatida:
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}`,
        description: 'useRef render qilmaydi, shuning uchun oldingi qiymatni saqlash uchun ideal. useEffect har renderdan keyin ishlaydi va hozirgi qiymatni ref-ga yozadi. Keyingi renderda ref.current ESKI qiymatni qaytaradi.',
      },
      {
        title: 'Timer ID saqlash — setInterval bilan',
        language: 'tsx' as const,
        code: `import { useState, useRef } from 'react'

function Stopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function start() {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)
  }

  function stop() {
    if (!isRunning) return
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function reset() {
    stop()
    setSeconds(0)
  }

  return (
    <div>
      <p>{seconds} soniya</p>
      <button onClick={start}>Boshlash</button>
      <button onClick={stop}>To'xtatish</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}`,
        description: `Timer ID ni useRef da saqlash — eng to'g'ri pattern. useState da saqlash NOTO'G'RI chunki clearInterval uchun render kerak emas. intervalRef.current o'zgarganda qayta render bo'lmaydi — bu to'g'ri xulq.`,
      },
      {
        title: 'Scroll to element',
        language: 'tsx' as const,
        code: `import { useRef } from 'react'

function ScrollDemo() {
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div>
      <nav>
        <button onClick={() => scrollTo(section1Ref)}>Bo'lim 1</button>
        <button onClick={() => scrollTo(section2Ref)}>Bo'lim 2</button>
        <button onClick={() => scrollTo(section3Ref)}>Bo'lim 3</button>
      </nav>

      <div ref={section1Ref} style={{ height: '100vh', background: '#f0f0f0' }}>
        <h2>Bo'lim 1</h2>
      </div>
      <div ref={section2Ref} style={{ height: '100vh', background: '#e0e0e0' }}>
        <h2>Bo'lim 2</h2>
      </div>
      <div ref={section3Ref} style={{ height: '100vh', background: '#d0d0d0' }}>
        <h2>Bo'lim 3</h2>
      </div>
    </div>
  )
}`,
        description: `scrollIntoView — brauzer API. useRef orqali har bir section-ga ref berib, button bosilganda o'sha joyga smooth scroll qilish. Navigation komponentlarida ko'p ishlatiladi.`,
      },
    ],
    interviewQA: [
      {
        question: 'useRef vs useState farqi nima?',
        answer: `useState qiymat o'zgarganda komponentni QAYTA RENDERLAYDI va yangi qiymat keyingi renderda ko'rinadi. useRef qiymat o'zgarganda render BO'LMAYDI va qiymat DARHOL (sinxron) yangilanadi. useState immutable — faqat setState orqali o'zgartirish mumkin. useRef mutable — ref.current = newValue to'g'ridan-to'g'ri yozish mumkin. Qoida: ekranda ko'rsatish kerak bo'lsa useState, faqat saqlash kerak bo'lsa useRef.`,
      },
      {
        question: `Nima uchun ref.current o'zgarganda render bo'lmaydi?`,
        answer: `Chunki useRef oddiy JavaScript object qaytaradi: { current: value }. React bu object-ni kuzatmaydi (track qilmaydi). ref.current = newValue — bu oddiy JS property assignment, React buni bilmaydi. useState esa React-ning ichki tizimi orqali ishlaydi — setState chaqirilganda React maxsus navbatga qo'yadi va render rejalashtiradi. Ref esa React rendering tizimidan TASHQARIDA ishlaydi.`,
      },
      {
        question: `DOM ref qachon null bo'ladi?`,
        answer: `DOM ref boshlang'ich qiymati null. Komponent mount bo'lgandan KEYIN React DOM elementni ref.current ga yozadi. Komponent unmount bo'lganda yana null bo'ladi. Shuning uchun render vaqtida ref.current null bo'lishi mumkin — DOM hali tayyor emas. Xavfsiz ishlatish uchun useEffect ichida yoki event handler ichida murojaat qilish kerak. TypeScript-da ref.current?.focus() deb optional chaining ishlatish tavsiya etiladi.`,
      },
      {
        question: 'Callback ref nima va oddiy ref-dan farqi?',
        answer: `Callback ref — ref prop-ga object o'rniga FUNKSIYA berish. React element mount bo'lganda bu funksiyani DOM node bilan chaqiradi, unmount bo'lganda null bilan chaqiradi. Oddiy ref={myRef} static element-lar uchun yaxshi. Callback ref dynamic element-lar uchun kerak: conditional rendering, list item-lar, element o'lchami kerak bo'lganda. Callback ref har render-da chaqirilishi mumkin, shuning uchun useCallback bilan o'rash tavsiya etiladi.`,
      },
      {
        question: `Nima uchun render vaqtida ref.current o'qish/yozish noto'g'ri?`,
        answer: `React Concurrent Mode-da render bir necha marta ishga tushishi, to'xtatilishi yoki bekor qilinishi mumkin. Agar render vaqtida ref.current ga yozsangiz, React renderni bekor qilsa — noto'g'ri qiymat yoziladi. O'qish ham xavfli — boshqa renderlar ref-ni o'zgartirgan bo'lishi mumkin. Shuning uchun ref.current ni faqat useEffect, useLayoutEffect yoki event handler-lar ichida o'qish/yozish kerak. Bu React-ning "pure rendering" tamoyiliga mos keladi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-imperative-handle', label: 'useImperativeHandle' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'react-memo', label: 'forwardRef' },
      { techId: 'react-js', sectionId: 'typescript-react', topicId: 'hooks-typing', label: 'Ref tipizatsiyasi' },
    ],
  }
