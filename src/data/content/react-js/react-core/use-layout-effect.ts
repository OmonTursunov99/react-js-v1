import type { Topic } from '../../../types'

export const useLayoutEffect: Topic = {
    id: 'use-layout-effect',
    title: 'useLayoutEffect',
    importance: 2,
    status: 'to-learn' as const,
    description: `DOM paint-dan OLDIN sinxron bajariladigan effect hook — o'lcham hisoblash va miltillashsiz DOM o'zgartirishlar uchun`,
    content: `useLayoutEffect — useEffect bilan deyarli bir xil sintaksisga ega, lekin TIMING (bajarilish vaqti) butunlay boshqa. Bu hook DOM-ga yozilgandan keyin, lekin brauzer ekranga chizishdan (paint) OLDIN ishlaydi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  useLayoutEffect(() => {
    // DOM bilan ishlash kodi
    return () => {
      // cleanup (ixtiyoriy)
    }
  }, [dependencies])

Sintaksis useEffect bilan 100% bir xil.
Farq faqat QACHON ishlashida.

═══════════════════════════════════════
  useEffect vs useLayoutEffect TIMING
═══════════════════════════════════════

  React RENDER SIKLI:
  1. React komponentni chaqiradi (render)
  2. React DOM-ni yangilaydi (commit)
  3. ▶ useLayoutEffect ISHLAYDI (sinxron)
  4. Brauzer ekranga chizadi (paint)
  5. ▶ useEffect ISHLAYDI (asinxron)

  useEffect — paint KEYIN (asinxron):
    Foydalanuvchi avval ESKi holatni ko'radi,
    keyin useEffect ishlaydi va yangi holat ko'rinadi.

  useLayoutEffect — paint OLDIDAN (sinxron):
    Foydalanuvchi FAQAT YANGI holatni ko'radi.
    DOM commit-dan keyin, paint-dan oldin ishlaydi.

═══════════════════════════════════════
  QACHON ISHLATISH
═══════════════════════════════════════

1. DOM o'lcham o'lchash (getBoundingClientRect)
   — element kengligi, balandligi, pozitsiyasini bilish

2. Scroll pozitsiya boshqarish
   — scroll-ni ma'lum joyga o'rnatish

3. Tooltip / Popover pozitsiya hisoblash
   — target elementga qarab tooltip qo'yish

4. Animatsiya boshlang'ich holati
   — animatsiya boshlanishidan oldin CSS qiymatlarini o'rnatish

═══════════════════════════════════════
  NIMA UCHUN ODDIY useEffect YETARLI EMAS
═══════════════════════════════════════

useEffect-da DOM o'zgartirsangiz "miltillash" (flicker) ko'rinadi:

  // useEffect bilan — MILTILLASH bor:
  useEffect(() => {
    ref.current.style.left = \`\${position}px\`
  }, [position])
  // Foydalanuvchi: eski pozitsiya -> paint -> yangi pozitsiya

  // useLayoutEffect bilan — MILTILLASH yo'q:
  useLayoutEffect(() => {
    ref.current.style.left = \`\${position}px\`
  }, [position])
  // Foydalanuvchi: faqat yangi pozitsiya ko'radi

Sabab: useEffect paint-dan KEYIN ishlaydi, shuning uchun
brauzer avval eski holatni chizib, keyin yangilaydi.
useLayoutEffect paint-dan OLDIN ishlaydi — faqat to'g'ri holat chiziladi.

═══════════════════════════════════════
  OGOHLANTIRISH
═══════════════════════════════════════

useLayoutEffect SINXRON ishlaydi:
- Agar sekin kod yozsangiz, paint BLOKLANADI
- Foydalanuvchi interfeysning "qotib qolganini" ko'radi
- Faqat DOM o'lchash/o'zgartirish uchun ishlatish kerak

NOTO'G'RI ishlatish:
  useLayoutEffect(() => {
    fetch('/api/data')  // ❌ Fetch — useEffect-da bo'lishi kerak
    setTimeout(...)      // ❌ Timer — useEffect-da bo'lishi kerak
  }, [])

TO'G'RI ishlatish:
  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect()  // ✅ DOM o'lchash
    setWidth(rect.width)
  }, [dependency])`,
    codeExamples: [
      {
        title: 'Tooltip pozitsiya hisoblash',
        language: 'tsx' as const,
        code: `import { useState, useRef, useLayoutEffect } from 'react'

interface TooltipProps {
  targetRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
}

function Tooltip({ targetRef, children }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!targetRef.current || !tooltipRef.current) return

    const targetRect = targetRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()

    // Tooltip-ni target USTIGA joylash
    setPosition({
      top: targetRect.top - tooltipRect.height - 8,
      left: targetRect.left + (targetRect.width - tooltipRect.width) / 2,
    })
    // useLayoutEffect-da qilganimiz uchun
    // foydalanuvchi noto'g'ri pozitsiyani KO'RMAYDI
  }, [targetRef])

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        background: '#333',
        color: 'white',
        padding: '4px 8px',
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  )
}

// Ishlatish:
function App() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div>
      <button
        ref={buttonRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        Hover qiling
      </button>
      {showTooltip && (
        <Tooltip targetRef={buttonRef}>
          Bu tooltip matni
        </Tooltip>
      )}
    </div>
  )
}`,
        description: `Tooltip pozitsiyasini target elementga qarab hisoblash. useLayoutEffect ishlatiladi chunki avval noto'g'ri pozitsiyada paydo bo'lib, keyin sakrashi mumkin (flicker). useLayoutEffect bilan foydalanuvchi faqat to'g'ri pozitsiyani ko'radi.`,
      },
      {
        title: `Element kengligi o'lchash`,
        language: 'tsx' as const,
        code: `import { useState, useRef, useLayoutEffect } from 'react'

function MeasuredBox() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    if (!boxRef.current) return

    const rect = boxRef.current.getBoundingClientRect()
    setDimensions({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    })
  }) // dependency yo'q — har renderda o'lchaydi

  return (
    <div>
      <div
        ref={boxRef}
        style={{
          padding: '20px',
          background: '#e0e7ff',
          borderRadius: 8,
          resize: 'both',       // foydalanuvchi o'lchamini o'zgartirishi mumkin
          overflow: 'auto',
        }}
      >
        Bu qutini o'lchamini o'zgartiring!
        <br />
        Kenglik: {dimensions.width}px
        <br />
        Balandlik: {dimensions.height}px
      </div>
    </div>
  )
}

// Custom hook versiya:
function useElementSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      })
    })

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return size
}`,
        description: `Element o'lchamlarini o'lchab state-ga saqlash. useLayoutEffect paint-dan oldin ishlaydi, shuning uchun foydalanuvchi 0 qiymatlarni ko'rmaydi. ResizeObserver bilan custom hook versiya ham ko'rsatilgan.`,
      },
    ],
    interviewQA: [
      {
        question: `useEffect va useLayoutEffect o'rtasidagi asosiy farq nima? Timing qanday?`,
        answer: `Asosiy farq BAJARILISH VAQTIDA. useEffect brauzer ekranga chizgandan (paint) KEYIN asinxron ishlaydi. useLayoutEffect esa DOM yangilangandan keyin, lekin paint-dan OLDIN sinxron ishlaydi. Siklda ko'rsak: render -> DOM commit -> useLayoutEffect -> paint -> useEffect. Bu farq muhim chunki useLayoutEffect-da DOM o'zgartirish qilsangiz foydalanuvchi faqat yakuniy natijani ko'radi, useEffect-da esa avval eski holat ko'rinib keyin yangilanadi (flicker/miltillash).`,
      },
      {
        question: `Qachon useLayoutEffect ishlatish SHART bo'ladi? Misol bering.`,
        answer: `useLayoutEffect ishlatish SHART bo'ladigan holatlar: 1) DOM element o'lchamlarini o'lchash (getBoundingClientRect) — masalan tooltip yoki dropdown pozitsiya hisoblash. 2) Scroll pozitsiyani o'zgartirish — masalan yangi xabar kelganda pastga scroll qilish. 3) DOM-ni vizual o'zgartirish — masalan element pozitsiyasi yoki o'lchamini dinamik o'rnatish. Bu holatlarda useEffect ishlatilsa "miltillash" ko'rinadi, chunki brauzer avval eski holatni chizadi. useLayoutEffect esa paint-dan oldin o'zgartiradi — foydalanuvchi faqat to'g'ri holatni ko'radi.`,
      },
      {
        question: 'SSR (Server-Side Rendering) da useLayoutEffect bilan qanday muammo bor?',
        answer: `SSR da useLayoutEffect WARNING beradi chunki serverda brauzer DOM yo'q — paint tushunchasi umuman mavjud emas. useLayoutEffect faqat client-da ishlaydi, serverda esa hech narsa qilmaydi va React console-da ogohlantirish chiqaradi. Yechim: SSR loyihalarda useLayoutEffect o'rniga useEffect ishlatish kerak, yoki typeof window tekshiruvi qo'yish. Next.js yoki Remix kabi SSR framework-larda bu ayniqsa muhim. Agar useLayoutEffect SHART bo'lsa, uni faqat client-da ishlaydigan komponentga joylashtirish kerak ("use client" direktivasi bilan).`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-effect', label: 'useEffect farqi' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'effect-vs-layout-effect', label: 'Nazariy taqqoslash' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'rendering-cycle', label: 'Rendering Cycle' },
    ],
}
