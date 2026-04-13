import type { Topic } from '../../types'

export const strictMode: Topic = {
    id: 'strict-mode',
    title: 'StrictMode',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Development rejimida xatolarni topish uchun React StrictMode',
    content: `StrictMode — React-ning development rejimida xatolarni topish vositasi. Production-da HECH NARSA qilmaydi.

═══════════════════════════════════════
  NIMA QILADI (FAQAT DEV MODE)
═══════════════════════════════════════

1. 2x RENDER: Har komponentni IKKI MARTA render qiladi
   - Nima uchun: Pure bo'lmagan komponentlarni topish (side-effect render ichida)

2. 2x EFFECT: useEffect setup+cleanup-ni IKKI MARTA ishlaydi
   - Nima uchun: Cleanup to'g'ri yozilganini tekshirish

3. DEPRECATED API WARNING: Eskirgan API ishlatilsa ogohlantiradi
   - componentWillMount, componentWillReceiveProps va boshqalar

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

- Render ichidagi side-effect-larni topadi
- Effect cleanup xatolarini topadi
- Eskirgan pattern-larni aniqlaydi
- Concurrent rendering uchun tayyorgarlik

═══════════════════════════════════════
  PRODUCTION-DA BO'LMAYDI
═══════════════════════════════════════

StrictMode faqat development build-da ishlaydi.
yarn build qilganda StrictMode kodi butunlay OLIB TASHLANADI.
Foydalanuvchilar hech qanday farqni sezmaydi.

═══════════════════════════════════════
  QANDAY YOQISH
═══════════════════════════════════════

// Butun ilova uchun (main.tsx da)
<StrictMode>
  <App />
</StrictMode>

// Faqat ma'lum qism uchun
<StrictMode>
  <ProblematicComponent />
</StrictMode>`,
    codeExamples: [
        {
            title: 'StrictMode — effect ikki marta ishlashi',
            language: 'tsx' as const,
            code: `import { StrictMode, useState, useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    console.log('Effect SETUP — timer boshlandi')
    const id = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // ✅ Cleanup TO'G'RI yozilgan — StrictMode buni tekshiradi
    return () => {
      console.log('Effect CLEANUP — timer to'xtatildi')
      clearInterval(id)
    }
  }, [])

  // StrictMode da console:
  // 1. "Effect SETUP — timer boshlandi"
  // 2. "Effect CLEANUP — timer to'xtatildi"  (darhol cleanup)
  // 3. "Effect SETUP — timer boshlandi"       (qayta setup)
  // Production da faqat 1-qadamni ko'rasiz

  return <p>Sekundlar: {seconds}</p>
}

// ❌ XATO: cleanup yo'q — StrictMode 2 ta timer yaratadi
function BadTimer() {
  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick')
    }, 1000)
    // cleanup YO'Q — StrictMode xatoni ko'rsatadi
    // 2 ta timer ishlaydi, lekin 1 ta tozalanmaydi!
  }, [])

  return <p>Buzilgan timer</p>
}

function App() {
  return (
    <StrictMode>
      <Timer />
    </StrictMode>
  )
}`,
            description: `StrictMode development-da effect-ni ikki marta ishlaydi (setup → cleanup → setup). Bu cleanup to'g'ri yozilganini tekshiradi. Cleanup bo'lmasa — xato aniqlanadi.`,
        },
    ],
    interviewQA: [
        {
            question: 'React StrictMode nima qiladi?',
            answer: `StrictMode faqat development rejimida ishlaydi va 3 ta narsa qiladi: 1) Har komponentni 2 marta render qiladi — pure bo'lmagan komponentlarni topish uchun, 2) useEffect setup+cleanup-ni 2 marta ishlaydi — cleanup to'g'ri yozilganini tekshirish uchun, 3) Eskirgan API ishlatilsa ogohlantiradi. Production-da StrictMode kodi butunlay olib tashlanadi.`,
        },
        {
            question: 'Nima uchun useEffect StrictMode da ikki marta ishlaydi?',
            answer: `StrictMode effect-ni ikki marta ishlatadi (setup → cleanup → setup) cleanup funksiyasi TO'G'RI yozilganini tekshirish uchun. Masalan, setInterval boshlasangiz lekin cleanup-da clearInterval qilmasangiz — StrictMode da 2 ta timer ishlaydi va xato aniq ko'rinadi. Bu concurrent rendering uchun tayyorgarlik ham — React istalgan vaqtda effect-ni qayta ishlashi mumkin.`,
        },
    ],
    relatedTopics: [
        { sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect (ikki marta chaqiriladi)' },
        { sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
    ],
}
