import type { Topic } from '../../../types'

export const renderProps: Topic = {
    id: `render-props`,
    title: `Render Props`,
    importance: 2,
    status: `to-learn`,
    description: `Funksiya orqali child render qilish`,
    content: `Render Props — komponentga funksiya prop berish, u funksiya JSX qaytaradi. Komponent logikani boshqaradi, render qilishni tashqi kodga topshiradi.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

Komponentga funksiya prop beriladi — u funksiya JSX qaytaradi.
Komponent logikani beradi, render qilishni tashqariga chiqaradi:

  <DataFetcher
    url="/api/users"
    render={({ data, loading }) => (
      loading ? <Spinner /> : <UserList users={data} />
    )}
  />

DataFetcher — fetch logikasini boshqaradi
render prop — natijani QANDAY ko'rsatishni belgilaydi

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

Ikki usul bor:

1. render prop:
   <Mouse render={({ x, y }) => <p>Pozitsiya: {x}, {y}</p>} />

2. children as function:
   <Mouse>
     {({ x, y }) => <p>Pozitsiya: {x}, {y}</p>}
   </Mouse>

Ikkalasi bir xil ishlaydi. children as function
ko'proq tarqalgan.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Logikani qayta ishlatish — bir xil logika, turli UI:

  // Mouse tracking — xar xil joyda boshqacha ko'rsatish
  <MouseTracker>
    {({ x, y }) => <Tooltip x={x} y={y} />}
  </MouseTracker>

  <MouseTracker>
    {({ x, y }) => <Cursor x={x} y={y} />}
  </MouseTracker>

Bir xil logika (mouse kuzatish), turli UI (Tooltip va Cursor).
Logika bir marta yoziladi, UI moslashtiriladi.

═══════════════════════════════════════
  CUSTOM HOOKS ALMASHTIRDI
═══════════════════════════════════════

React 16.8 dan hook-lar paydo bo'ldi — render props
KAMROQ kerak bo'lib qoldi:

  // Render props (eski):
  <MouseTracker>
    {({ x, y }) => <p>{x}, {y}</p>}
  </MouseTracker>

  // Custom hook (yangi, oddiyroq):
  function MyComponent() {
    const { x, y } = useMousePosition()
    return <p>{x}, {y}</p>
  }

Hook — toza, o'qish oson, nesting yo'q.
Lekin render props hali ham ba'zi kutubxonalarda
ishlatiladi (Formik eski versiya, React Router <Route>).

═══════════════════════════════════════
  MUAMMO
═══════════════════════════════════════

Wrapper hell — ko'p render props = chuqur nesting:

  <ThemeConsumer>
    {theme => (
      <AuthConsumer>
        {user => (
          <LanguageConsumer>
            {lang => (
              <MyComponent theme={theme} user={user} lang={lang} />
            )}
          </LanguageConsumer>
        )}
      </AuthConsumer>
    )}
  </ThemeConsumer>

Bu o'qish va boshqarish juda qiyin.
Hook-lar bu muammoni to'liq hal qiladi.`,
    codeExamples: [
      {
        title: `Mouse tracker — render prop bilan`,
        language: `tsx`,
        code: `import { useState, useEffect, type ReactNode } from 'react'

// 1. Render prop komponent — logikani boshqaradi
interface MousePosition {
  x: number
  y: number
}

interface MouseTrackerProps {
  children: (pos: MousePosition) => ReactNode
}

function MouseTracker({ children }: MouseTrackerProps) {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // children FUNKSIYA — uni chaqiramiz va natijani renderlaydi
  return <>{children(position)}</>
}

// 2. Ishlatish — bir xil logika, turli UI
function App() {
  return (
    <div>
      {/* Matn ko'rinishda */}
      <MouseTracker>
        {({ x, y }) => (
          <p>Mouse pozitsiyasi: {x}, {y}</p>
        )}
      </MouseTracker>

      {/* Kursor izlash */}
      <MouseTracker>
        {({ x, y }) => (
          <div
            style={{
              position: 'fixed',
              left: x - 10,
              top: y - 10,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'red',
              pointerEvents: 'none',
            }}
          />
        )}
      </MouseTracker>
    </div>
  )
}`,
        description: `MouseTracker logikani boshqaradi (mouse pozitsiyasini kuzatadi), lekin uni QANDAY ko'rsatishni bilmaydi. children funksiyasi render qilishni belgilaydi. Bir xil logika — turli UI.`,
      },
      {
        title: `Custom hook alternativa — xuddi shu logika`,
        language: `tsx`,
        code: `import { useState, useEffect } from 'react'

// Custom hook — render props O'RNIGA
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

// Ishlatish — ancha oddiy va toza
function MouseDisplay() {
  const { x, y } = useMousePosition()

  return <p>Mouse: {x}, {y}</p>
}

function CustomCursor() {
  const { x, y } = useMousePosition()

  return (
    <div
      style={{
        position: 'fixed',
        left: x - 10,
        top: y - 10,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'blue',
        pointerEvents: 'none',
      }}
    />
  )
}

// Farqni solishtiring:
// Render props: <MouseTracker>{({x,y}) => ...}</MouseTracker>
// Custom hook:  const {x, y} = useMousePosition()
//
// Hook — toza, o'qish oson, nesting yo'q.
// Shuning uchun zamonaviy React-da hook afzal.`,
        description: `Xuddi shu mouse tracking logikasi, lekin custom hook bilan. Hook-lar render props-ni ko'p hollarda ALMASHTIRDI — oddiyroq, nesting yo'q, TypeScript bilan yaxshiroq ishlaydi.`,
      },
    ],
    interviewQA: [
      {
        question: `Render props nima?`,
        answer: `Render props — komponentga funksiya prop berish pattern-i. Bu funksiya JSX qaytaradi. Komponent logikani boshqaradi (masalan, mouse pozitsiyasi, form holati), lekin natijani QANDAY render qilishni tashqi kodga qoldiradi. Ikki sintaksis bor: render prop (<Mouse render={fn} />) va children as function (<Mouse>{fn}</Mouse>). Bu pattern logikani qayta ishlatish imkonini beradi — bir xil logika, turli UI.`,
      },
      {
        question: `Render props vs Custom Hooks — qaysi yaxshiroq?`,
        answer: `Custom hooks ko'p hollarda yaxshiroq: 1) Oddiyroq sintaksis — const {x,y} = useMousePosition() vs <MouseTracker>{({x,y}) => ...}</MouseTracker>. 2) Nesting muammosi yo'q — ko'p render props "wrapper hell" yaratadi. 3) TypeScript tipizatsiyasi toza. 4) Composition oson — hook ichida boshqa hook chaqirish mumkin. Lekin render props hali ham kerak: dynamik render logikasi (runtime-da boshqa komponent berish), ba'zi kutubxonalar (React Router v5), va inversion of control pattern-larda.`,
      },
      {
        question: `Qachon render props hali ham kerak?`,
        answer: `Render props hali ham kerak bo'ladigan holatlar: 1) Runtime-da render logikasini o'zgartirish kerak bo'lganda — hook-lar compile-time, render props runtime. 2) Headless komponentlar — logika beradi, UI tashqarida (Downshift kutubxonasi). 3) Inversion of control — komponent ichki holatini tashqariga chiqaradi, lekin render nazoratini bermaydi. 4) Legacy kodda — eski kutubxonalar bilan ishlashda. Yangi kod uchun avval hook, kerak bo'lsa render props.`,
      },
    ],
    relatedTopics: [
      { techId: `react-js`, sectionId: `component-patterns`, topicId: `hoc`, label: `HOC (alternativa)` },
      { techId: `react-js`, sectionId: `component-patterns`, topicId: `custom-hooks`, label: `Custom Hooks (zamonaviy alternativa)` },
    ],
  }
