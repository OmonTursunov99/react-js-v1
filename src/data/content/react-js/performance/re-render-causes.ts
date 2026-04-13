import type { Topic } from '../../../types'

export const reRenderCauses: Topic = {
    id: 're-render-causes',
    title: 'Re-render sabablari',
    importance: 3,
    status: 'to-learn',
    description: 'Props, state, context, parent re-render',
    content: `Re-render — React komponentning qayta chaqirilishi va virtual DOM-ni qayta hisoblashi. Re-render o'zi yomon EMAS — React tez. Lekin ortiqcha re-render KATTA ro'yxatlar yoki qimmat hisoblashlar bilan muammo bo'ladi.

═══════════════════════════════════════
  RENDER vs RE-RENDER
═══════════════════════════════════════

Initial render — komponent birinchi marta ekranga chiqishi.
Re-render — komponent qayta chaqirilishi (yangi JSX hisoblash).

MUHIM: re-render ≠ DOM yangilash!
  1. Re-render → yangi Virtual DOM hisoblanadi
  2. Diffing → eski va yangi VDOM taqqoslanadi
  3. Faqat FARQLAR haqiqiy DOM-ga yoziladi

Agar re-render natijasi eski bilan bir xil bo'lsa — DOM umuman o'zgarMAYDI.

═══════════════════════════════════════
  RE-RENDER SABABLARI (4 TA)
═══════════════════════════════════════

1. STATE O'ZGARISHI
   setState chaqirilsa — komponent re-render bo'ladi.
   Bu eng asosiy va TO'G'RI sabab.

   const [count, setCount] = useState(0)
   setCount(1) // → re-render

2. PROPS O'ZGARISHI
   Ota komponent yangi props bersa — bola re-render bo'ladi.
   LEKIN aslida bu 3-sabab (parent re-render) tufayli bo'ladi.

3. PARENT RE-RENDER (eng ko'p muammo!)
   Ota komponent re-render bo'lsa — BARCHA bolalar ham re-render bo'ladi.
   Hatto props o'zgarMAGAN bo'lsa ham!

   function Parent() {
     const [count, setCount] = useState(0)
     return (
       <div>
         <p>{count}</p>
         <Child />  {/* count bilan ishi YO'Q, lekin re-render bo'ladi! */}
       </div>
     )
   }

4. CONTEXT O'ZGARISHI
   useContext ishlatgan komponent — context value o'zgarsa re-render.
   React.memo ham YORDAM BERMAYDI.

═══════════════════════════════════════
  PARENT RE-RENDER MUAMMOSI
═══════════════════════════════════════

Ota re-render bo'lganda React JSX-ni qayta baholaydi:

  <Child name="Ali" />

Bu ASLIDA:
  React.createElement(Child, { name: "Ali" })

Har re-render-da YANGI props object yaratiladi:
  { name: "Ali" } !== { name: "Ali" }  // referens farq!

Shuning uchun React bola komponentni ham re-render qiladi.

YECHIMLAR:
  1. React.memo — props o'zgarmasa re-render qilMAYDI
  2. Composition — bolani yuqoriga ko'tarish (children prop)
  3. State-ni pastga tushirish — state kerakli joyda

═══════════════════════════════════════
  COMPOSITION BILAN OPTIMIZATSIYA
═══════════════════════════════════════

React.memo-siz ham optimizatsiya mumkin:

  // MUAMMO: HeavyList har click-da re-render
  function Page() {
    const [count, setCount] = useState(0)
    return (
      <div>
        <button onClick={() => setCount(c => c + 1)}>{count}</button>
        <HeavyList />  {/* keraksiz re-render! */}
      </div>
    )
  }

  // YECHIM 1: state-ni pastga tushirish
  function Page() {
    return (
      <div>
        <Counter />        {/* state shu ichida */}
        <HeavyList />      {/* re-render BO'LMAYDI */}
      </div>
    )
  }

  // YECHIM 2: children pattern
  function CounterWrapper({ children }) {
    const [count, setCount] = useState(0)
    return (
      <div>
        <button onClick={() => setCount(c => c + 1)}>{count}</button>
        {children}  {/* children QAYTA YARATILMAYDI */}
      </div>
    )
  }

  <CounterWrapper>
    <HeavyList />  {/* re-render BO'LMAYDI */}
  </CounterWrapper>

═══════════════════════════════════════
  RE-RENDER EMAS — HAQIQIY MUAMMO
═══════════════════════════════════════

Re-render o'zi tez — oddiy funksiya chaqirish.
Haqiqiy muammo — QIMMAT re-render:
  ❌ Katta ro'yxat (1000+ element) qayta renderlanishi
  ❌ Murakkab hisoblash har render-da ishlashi
  ❌ Qimmat DOM operatsiyalar

Agar re-render tez bo'lsa — optimizatsiya KERAK EMAS.
Premature optimization — vaqt isrof qilish.
Avval PROFILER bilan o'lchang, keyin optimizatsiya qiling.`,
    codeExamples: [
      {
        title: 'Re-render sabablari — demo',
        language: 'tsx',
        code: `import { useState, memo } from 'react'

// Re-render kuzatish uchun
function logRender(name: string) {
  console.log(\`\${name} rendered at \${Date.now()}\`)
}

// 1. PARENT RE-RENDER — bolalar ham re-render bo'ladi
function Parent() {
  const [count, setCount] = useState(0)
  logRender('Parent')

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ChildA />      {/* props yo'q, lekin re-render bo'ladi! */}
      <ChildB name="Ali" />  {/* props o'zgarmagan, lekin re-render! */}
    </div>
  )
}

function ChildA() {
  logRender('ChildA')  // har click-da chaqiriladi
  return <p>Child A</p>
}

function ChildB({ name }: { name: string }) {
  logRender('ChildB')  // har click-da chaqiriladi
  return <p>Child B: {name}</p>
}

// 2. YECHIM — React.memo
const MemoChildA = memo(function MemoChildA() {
  logRender('MemoChildA')  // faqat 1 marta
  return <p>Memo Child A</p>
})

const MemoChildB = memo(function MemoChildB({ name }: { name: string }) {
  logRender('MemoChildB')  // name o'zgarmasa — re-render YO'Q
  return <p>Memo Child B: {name}</p>
})`,
        description: 'Parent re-render — barcha bolalar ham re-render. React.memo bilan props o\'zgarmasa re-render to\'xtatiladi. Console.log bilan re-render-larni kuzatish.',
      },
      {
        title: 'Composition pattern — memo-siz optimizatsiya',
        language: 'tsx',
        code: `import { useState, type ReactNode } from 'react'

// ❌ MUAMMO: HeavyComponent har click-da re-render
function BadPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <HeavyComponent />  {/* 1000 element — har click-da re-render! */}
    </div>
  )
}

// ✅ YECHIM 1: State-ni pastga tushirish
function GoodPage() {
  return (
    <div>
      <Counter />          {/* state shu ichida */}
      <HeavyComponent />   {/* re-render BO'LMAYDI */}
    </div>
  )
}

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
}

// ✅ YECHIM 2: Children pattern
function CounterLayout({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {children}  {/* ota tomondan yaratilgan — qayta YARATILMAYDI */}
    </div>
  )
}

function BestPage() {
  return (
    <CounterLayout>
      <HeavyComponent />  {/* re-render BO'LMAYDI */}
    </CounterLayout>
  )
}

function HeavyComponent() {
  console.log('HeavyComponent rendered')
  return (
    <ul>
      {Array.from({ length: 1000 }, (_, i) => (
        <li key={i}>Element {i}</li>
      ))}
    </ul>
  )
}`,
        description: 'Memo-siz optimizatsiya: 1) State-ni pastga tushirish — faqat kerakli komponent re-render, 2) Children pattern — children ota tomonidan yaratilgan, qayta yaratilmaydi.',
      },
      {
        title: 'Context re-render muammosi va yechimi',
        language: 'tsx',
        code: `import { createContext, useContext, useState, memo, type ReactNode } from 'react'

// ❌ MUAMMO: bitta katta context — hamma re-render bo'ladi
const AppContext = createContext<{
  user: string
  theme: string
  setUser: (u: string) => void
  setTheme: (t: string) => void
} | null>(null)

function BadProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState('Ali')
  const [theme, setTheme] = useState('light')

  // user O'ZGARSA — theme ishlatgan komponentlar HAM re-render!
  return (
    <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
      {children}
    </AppContext.Provider>
  )
}

// ✅ YECHIM: Context ajratish
const UserContext = createContext<{
  user: string
  setUser: (u: string) => void
} | null>(null)

const ThemeContext = createContext<{
  theme: string
  setTheme: (t: string) => void
} | null>(null)

// user o'zgarsa — faqat UserContext ishlatganlar re-render
// theme o'zgarsa — faqat ThemeContext ishlatganlar re-render

// MUHIM: React.memo Context re-render-dan HIMOYA QILMAYDI!
const MemoChild = memo(function MemoChild() {
  const { theme } = useContext(ThemeContext)!
  // theme o'zgarsa — memo bo'lsa ham RE-RENDER BO'LADI
  return <p>{theme}</p>
})`,
        description: 'Context value o\'zgarsa — useContext ishlatgan BARCHA komponentlar re-render, React.memo ham yordam BERMAYDI. Yechim: context-ni kichik, mustaqil qismlarga ajratish.',
      },
    ],
    interviewQA: [
      {
        question: 'React-da re-render qachon bo\'ladi?',
        answer: `4 ta sabab: 1) State o'zgarishi — setState chaqirilsa, 2) Parent re-render — ota re-render bo'lsa BARCHA bolalar ham re-render (hatto props o'zgarmasa ham), 3) Context o'zgarishi — useContext ishlatgan komponentlar, React.memo ham yordam bermaydi, 4) forceUpdate (class komponent). Eng ko'p muammo — parent re-render: ota-da state o'zgarsa barcha bolalar qayta chaqiriladi. Yechim: React.memo, composition pattern, state-ni pastga tushirish.`,
      },
      {
        question: 'Re-render va DOM yangilash bir xil narsami?',
        answer: `Yo'q! Re-render — komponent funksiyasining qayta chaqirilishi va yangi Virtual DOM hisoblash. DOM yangilash — haqiqiy DOM-ga o'zgarish yozish. Jarayon: re-render → yangi VDOM → diffing (eski vs yangi taqqoslash) → faqat FARQLAR DOM-ga yoziladi. Agar re-render natijasi eski bilan bir xil bo'lsa — DOM umuman o'zgarMAYDI. Shuning uchun re-render o'zi tez — muammo faqat juda ko'p yoki juda qimmat re-render-larda.`,
      },
      {
        question: 'Composition pattern bilan re-render-ni qanday kamaytirish mumkin?',
        answer: `2 ta usul: 1) State-ni pastga tushirish — state kerakli komponent ichiga ko'chirish. Shunda faqat shu komponent re-render bo'ladi, boshqa bolalar ta'sirlanmaydi. 2) Children pattern — children prop ota komponent tomonidan yaratiladi, shuning uchun ichki state o'zgarsa ham children qayta yaratilMAYDI. Bu React.memo-ga qaraganda yaxshiroq — qo'shimcha abstraction qo'shmaydi, kodni osonroq tushunish mumkin.`,
      },
      {
        question: 'Context re-render muammosi nima va qanday hal qilinadi?',
        answer: `Context value o'zgarsa — useContext ishlatgan BARCHA komponentlar re-render bo'ladi. React.memo ham YORDAM BERMAYDI — chunki context ichki subscription orqali ishlaydi. Yechimlar: 1) Context ajratish — har bir concern (user, theme, settings) uchun alohida context, 2) useMemo bilan value memoization — keraksiz value o'zgarishini oldini olish, 3) Tez-tez o'zgaradigan data uchun Zustand/Redux ishlatish — ular selector pattern bilan faqat kerakli qism o'zgarganda re-render qiladi.`,
      },
      {
        question: 'Qachon re-render optimizatsiya qilish kerak, qachon kerak emas?',
        answer: `KERAK EMAS: oddiy komponentlar (tugma, input, karta), kichik ro'yxatlar (<100), tez hisoblashlar. Re-render o'zi tez — premature optimization vaqt isrof. KERAK: katta ro'yxatlar (1000+ element), qimmat hisoblashlar (filtering, sorting), tez-tez o'zgaradigan state (typing, scrolling), Profiler ko'rsatsa. Qoida: AVVAL Profiler bilan o'lchang, muammo BORLIGINI aniqlang, KEYIN optimizatsiya qiling. "O'lchang, keyin optimizatsiya" — boshqacha emas.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'batching', label: 'Batching' },
      { techId: 'react-js', sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'Memoization' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'context-api', label: 'Context re-render' },
    ],
  }
