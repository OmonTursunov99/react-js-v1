import type { Topic } from '../../../types'

export const useImperativeHandle: Topic = {
    id: 'use-imperative-handle',
    title: 'useImperativeHandle',
    importance: 2,
    status: 'to-learn' as const,
    description: 'Parent komponentga child-ning custom API-sini ochish uchun hook — forwardRef bilan birga ishlatiladi',
    content: `useImperativeHandle — parent komponentga child komponentning ichki funksiyalarini (API) ochish uchun ishlatiladi. forwardRef bilan birga keladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

  useImperativeHandle(ref, () => ({
    // parent ko'ra oladigan metodlar
    focus() { ... },
    clear() { ... },
    scrollTo(pos: number) { ... },
  }), [dependencies])

  - ref — forwardRef orqali olingan ref
  - createHandle — parent-ga beriladigan API object
  - dependencies — qachon API yangilanishi kerak (ixtiyoriy)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Odatda React-da ma'lumot YUQORIDAN PASTGA oqadi (props).
Lekin ba'zan parent child-ning ICHKI funksiyalarini chaqirishi kerak:

  - Input-ga focus berish
  - Modal-ni ochish/yopish
  - Scroll pozitsiyani o'zgartirish
  - Form-ni reset qilish
  - Animatsiyani boshlash

Bu holatlarda parent ref orqali child-ga murojaat qiladi.
useImperativeHandle esa child-ning QAYSI funksiyalarini
parent ko'rishini NAZORAT QILADI.

═══════════════════════════════════════
  forwardRef BILAN BIRGA
═══════════════════════════════════════

React 19 da ref oddiy prop sifatida keladi,
lekin oldingi versiyalarda forwardRef SHART edi:

  // React 19+ — ref oddiy prop:
  function MyInput({ ref, ...props }) {
    useImperativeHandle(ref, () => ({
      focus() { inputRef.current?.focus() },
    }))
    // ...
  }

  // React 18 va oldin — forwardRef kerak:
  const MyInput = forwardRef(function MyInput(props, ref) {
    useImperativeHandle(ref, () => ({
      focus() { inputRef.current?.focus() },
    }))
    // ...
  })

═══════════════════════════════════════
  QACHON ISHLATILADI
═══════════════════════════════════════

1. Custom input komponent — focus(), clear(), select()
2. Modal komponent — open(), close()
3. Scroll container — scrollTo(), scrollToTop()
4. Video/Audio player — play(), pause(), seek()
5. Form komponent — reset(), validate(), submit()

═══════════════════════════════════════
  OGOHLANTIRISH
═══════════════════════════════════════

useImperativeHandle-ni ko'p ishlatMANG:
- React-da asosiy pattern: PROPS orqali boshqarish
- ref + useImperativeHandle — faqat IMPERATIVE amallar uchun
  (focus, scroll, animatsiya)
- Agar props bilan qilib bo'lsa — props ishlatish yaxshiroq
- Bu hook "escape hatch" — oddiy emas, MAXSUS holat uchun`,
    codeExamples: [
      {
        title: 'Custom input — focus/clear metodlarini parent-ga ochish',
        language: 'tsx' as const,
        code: `import { useState, useRef, useImperativeHandle, forwardRef } from 'react'

// Custom input API turi
interface CustomInputHandle {
  focus: () => void
  clear: () => void
  getValue: () => string
  select: () => void
}

// Custom input komponenti
const CustomInput = forwardRef<CustomInputHandle, { placeholder?: string }>(
  function CustomInput({ placeholder }, ref) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [value, setValue] = useState('')

    // Parent-ga faqat KERAKLI metodlarni ochamiz
    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus()
      },
      clear() {
        setValue('')
        inputRef.current?.focus()
      },
      getValue() {
        return value
      },
      select() {
        inputRef.current?.select()
      },
    }), [value]) // value o'zgarganda API yangilanadi

    return (
      <input
        ref={inputRef}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '8px 12px',
          border: '2px solid #d1d5db',
          borderRadius: 8,
          fontSize: 16,
          outline: 'none',
        }}
      />
    )
  }
)

// Parent komponent — child-ning API-sini ishlatadi
function SearchForm() {
  const inputRef = useRef<CustomInputHandle>(null)

  function handleSearch() {
    const value = inputRef.current?.getValue()
    if (value) {
      alert(\`Qidirilmoqda: \${value}\`)
    } else {
      inputRef.current?.focus()
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <CustomInput ref={inputRef} placeholder="Qidirish..." />
      <button onClick={handleSearch}>Qidirish</button>
      <button onClick={() => inputRef.current?.clear()}>Tozalash</button>
      <button onClick={() => inputRef.current?.select()}>Tanlash</button>
    </div>
  )
}`,
        description: `CustomInput komponenti useImperativeHandle orqali parent-ga focus, clear, getValue, select metodlarini ochadi. Parent bu metodlarni ref orqali chaqiradi. Ichki input ref va state parent-ga ko'rinMAYDI — faqat ochilgan API ko'rinadi.`,
      },
    ],
    interviewQA: [
      {
        question: 'useImperativeHandle nima uchun kerak? Qachon ishlatiladi?',
        answer: `useImperativeHandle parent komponentga child-ning ichki funksiyalarini (API) ochish uchun kerak. React-da asosan ma'lumot yuqoridan pastga oqadi (props), lekin ba'zan parent child-ning IMPERATIVE amallarini chaqirishi kerak: input-ga focus berish, modal ochish/yopish, scroll pozitsiya o'zgartirish. Bu holatlarda child useImperativeHandle bilan maxsus API ochadi va parent ref orqali bu API-ga murojaat qiladi. Bu hook forwardRef bilan birga ishlatiladi (React 19-da ref oddiy prop bo'lishi ham mumkin).`,
      },
      {
        question: `useImperativeHandle va oddiy ref forwarding o'rtasidagi farq nima?`,
        answer: `Oddiy ref forwarding-da parent child-ning DOM elementiga TO'LIQDAN-TO'LIQ kirish oladi — barcha DOM metodlari va xossalari ochiq. Bu xavfli bo'lishi mumkin chunki parent child-ning ichki DOM-ini o'zgartirishi mumkin. useImperativeHandle esa parent-ga faqat SIZ tanlagan metodlarni ochadi — bu "controlled API" yaratadi. Masalan input uchun faqat focus() va clear() ochib, boshqa hamma narsani yashirish mumkin. Bu encapsulation printsipi — child o'z ichki implementatsiyasini himoya qiladi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'react-memo', label: 'forwardRef' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-ref', label: 'useRef' },
    ],
}
