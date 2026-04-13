import type { Topic } from '../../../types'

export const reactMemo: Topic = {
    id: 'react-memo',
    title: 'React.memo / forwardRef',
    importance: 3,
    status: 'to-learn' as const,
    description: 'React.memo bilan keraksiz re-render oldini olish, forwardRef bilan ref uzatish',
    content: `React.memo — Higher Order Component (HOC) bo'lib, props o'zgarmaganda komponentni re-render qilmaydi.
forwardRef — parent-dan child-ga ref uzatish imkonini beradi.

═══════════════════════════════════════
  React.memo SINTAKSIS
═══════════════════════════════════════

const MemoComponent = React.memo(Component)

// yoki inline
const MemoComponent = React.memo(function MyComponent(props) {
  return <div>{props.name}</div>
})

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

React.memo SHALLOW COMPARISON qiladi:
- Oldingi props bilan yangi props-ni taqqoslaydi
- Agar TENG bo'lsa — render qilMAYDI
- Agar FARQ bo'lsa — render QILADI

Shallow comparison qoidalari:
- Primitive (string, number, boolean): QIYMAT taqqoslanadi
  "hello" === "hello" → teng → render yo'q ✅

- Object/Array/Function: REFERENS taqqoslanadi
  { name: "Ali" } !== { name: "Ali" } → teng EMAS → render bo'ladi ❌

Shu sababli object/function prop bilan React.memo yolg'iz ISHLAMAYDI!
useMemo/useCallback kerak.

═══════════════════════════════════════
  CUSTOM COMPARATOR
═══════════════════════════════════════

O'zingiz taqqoslash funksiyasini berishingiz mumkin:

React.memo(Component, (prevProps, nextProps) => {
  // true qaytarsa = RENDER QILMA (teng)
  // false qaytarsa = RENDER QIL (farq bor)
  return prevProps.id === nextProps.id
})

═══════════════════════════════════════
  QACHON ISHLATISH KERAK
═══════════════════════════════════════

✅ Ishlatish kerak:
1. Komponent og'ir — ko'p elementli ro'yxat, murakkab hisoblashlar
2. Tez-tez re-render bo'ladigan parent ichida
3. Props kamdan-kam o'zgaradi

❌ Ishlatish KERAK EMAS:
1. Props har renderda o'zgarsa — memo foydasiz
2. Juda yengil komponentlarda — memo xarajati > render xarajati
3. Object/function prop bilan (useCallback/useMemo kerak, aks holda referens o'zgaradi)

═══════════════════════════════════════
  forwardRef
═══════════════════════════════════════

Oddiy holatda parent child-ning DOM elementiga to'g'ridan-to'g'ri kira olmaydi.
forwardRef bu imkonni beradi:

// React 18 va oldingi
const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />
})

// React 19 DA YANGI — ref oddiy prop sifatida keladi
function MyInput({ ref, ...props }) {
  return <input ref={ref} {...props} />
}

React 19 da forwardRef KERAK EMAS — ref to'g'ridan-to'g'ri props ichida keladi.

═══════════════════════════════════════
  TO'LIQ OPTIMIZATION PATTERN
═══════════════════════════════════════

React.memo + useCallback + useMemo — uchala birga to'liq optimization:

1. React.memo — child re-render oldini oladi
2. useCallback — function prop referensini saqlaydi
3. useMemo — object prop referensini saqlaydi

Bu uchtasi BIRGA ishlatilishi kerak, biri yolg'iz foyda bermaydi.`,
    codeExamples: [
        {
            title: 'React.memo — child re-render oldini olish',
            language: 'tsx' as const,
            code: `import { useState, memo } from 'react'

// ❌ MEMO-SIZ: Parent har render bo'lganda Child ham renderlanadi
function SlowChild({ name }: { name: string }) {
  console.log('SlowChild render bo'ldi!') // Har safar chiqadi
  // Og'ir hisoblash simulyatsiyasi
  const items = Array.from({ length: 1000 }, (_, i) => (
    <div key={i}>{name} - element {i}</div>
  ))
  return <div>{items}</div>
}

// ✅ MEMO BILAN: Props o'zgarmasam render BO'LMAYDI
const MemoSlowChild = memo(function SlowChild({ name }: { name: string }) {
  console.log('MemoSlowChild render bo'ldi!') // Faqat name o'zgarganda
  const items = Array.from({ length: 1000 }, (_, i) => (
    <div key={i}>{name} - element {i}</div>
  ))
  return <div>{items}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [name] = useState('Ali')

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>

      {/* count o'zgarganda Parent renderlanadi,
          lekin name o'zgarmagan — MemoSlowChild renderlanMAYDI */}
      <MemoSlowChild name={name} />
    </div>
  )
}`,
            description: `React.memo bilan o'ralgan komponent props o'zgarmaganda re-render bo'lmaydi. Bu ayniqsa og'ir komponentlarda juda foydali.`,
        },
        {
            title: 'React.memo + useCallback — function prop bilan',
            language: 'tsx' as const,
            code: `import { useState, memo, useCallback } from 'react'

const Button = memo(function Button({
  onClick,
  label,
}: {
  onClick: () => void
  label: string
}) {
  console.log(\`Button "\${label}" render bo'ldi\`)
  return <button onClick={onClick}>{label}</button>
})

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // ❌ XATO: har renderda yangi funksiya = memo ishlamaydi
  // const handleClick = () => setCount(c => c + 1)

  // ✅ TO'G'RI: useCallback referensni saqlaydi = memo ishlaydi
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, []) // Bo'sh dependency = funksiya hech qachon o'zgarmaydi

  return (
    <div>
      <p>Count: {count}</p>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Yozing... Button renderlanmaydi"
      />
      {/* text o'zgarsa ham Button renderlanMAYDI
          chunki handleClick referensi o'zgarmagan */}
      <Button onClick={handleClick} label="Oshirish" />
    </div>
  )
}`,
            description: `React.memo yolg'iz function prop bilan ishlamaydi — chunki har renderda yangi funksiya yaratiladi. useCallback bilan funksiya referensini saqlab, memo to'g'ri ishlashini ta'minlash kerak.`,
        },
        {
            title: 'forwardRef — parent-dan child input-ga focus',
            language: 'tsx' as const,
            code: `import { useRef, forwardRef } from 'react'

// React 18: forwardRef ishlatish kerak
const CustomInput18 = forwardRef<HTMLInputElement, { label: string }>(
  function CustomInput({ label }, ref) {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} type="text" />
      </div>
    )
  }
)

// React 19: ref oddiy prop — forwardRef kerak emas!
function CustomInput19({
  label,
  ref,
}: {
  label: string
  ref?: React.Ref<HTMLInputElement>
}) {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} type="text" />
    </div>
  )
}

function Form() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    // Parent child-ning input-iga to'g'ridan-to'g'ri kira oladi
    inputRef.current?.focus()
  }

  return (
    <div>
      <CustomInput19 ref={inputRef} label="Ism:" />
      <button onClick={handleFocus}>Input-ga focus</button>
    </div>
  )
}`,
            description: `forwardRef orqali parent child ichidagi DOM elementiga ref uzatishi mumkin. React 19 da ref oddiy prop bo'lib keladi — forwardRef kerak emas.`,
        },
    ],
    interviewQA: [
        {
            question: 'React.memo nima va qanday ishlaydi?',
            answer: `React.memo — Higher Order Component (HOC) bo'lib, komponentni props o'zgarmaganda re-render qilmaydi. U shallow comparison qiladi: oldingi va yangi props-ni taqqoslaydi. Primitive (string, number) uchun qiymat taqqoslanadi, object/array/function uchun referens taqqoslanadi. Agar props teng bo'lsa — render o'tkazib yuboriladi. Custom comparator funksiya ham berish mumkin.`,
        },
        {
            question: 'Shallow comparison nima degani?',
            answer: `Shallow comparison — props-ni faqat "birinchi daraja"da taqqoslash. Primitive qiymatlar uchun: "hello" === "hello" — teng. Object uchun faqat REFERENS tekshiriladi: { name: "Ali" } !== { name: "Ali" } — teng EMAS, chunki 2 ta boshqa object. Nested object-lar ichiga KIRMAYDI. Shu sababli React.memo object prop bilan yolg'iz ishlamaydi — useMemo kerak.`,
        },
        {
            question: 'React.memo + useCallback nima uchun birga kerak?',
            answer: `React.memo yolg'iz function prop bilan ishlamaydi. Sabab: har render-da komponent ichida yaratilgan funksiya YANGI referensga ega bo'ladi (const fn = () => {} har safar yangi object). Shallow comparison: eskiFn !== yangiFn — render bo'ladi. useCallback funksiya referensini dependency o'zgarmaguncha SAQLAYDI. Shunda React.memo shallow comparison-da eskiFn === yangiFn ko'radi va render qilmaydi.`,
        },
        {
            question: `forwardRef nima uchun kerak va React 19 da qanday o'zgardi?`,
            answer: `forwardRef — parent-dan child komponent ichidagi DOM elementiga ref uzatish uchun kerak. Masalan, parent child ichidagi input-ga focus berishi kerak. Oddiy holda ref child-ga prop sifatida kelmaydi (React uni maxsus prop deb hisoblaydi). forwardRef bu muammoni hal qiladi. React 19 da esa ref oddiy prop bo'lib keladi — forwardRef wrapper kerak emas, to'g'ridan-to'g'ri destructuring qilish mumkin: function Child({ ref }) { ... }.`,
        },
    ],
    relatedTopics: [
        { techId: 'react-js', sectionId: 'performance', topicId: 'memo-usememo-usecallback', label: 'memo vs useMemo vs useCallback' },
        { techId: 'react-js', sectionId: 'react-core', topicId: 'use-imperative-handle', label: 'useImperativeHandle' },
        { techId: 'react-js', sectionId: 'react-core', topicId: 'use-ref', label: 'useRef' },
    ],
}
