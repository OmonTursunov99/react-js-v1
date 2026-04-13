import type { Topic } from '../../../types'

export const controlledUncontrolledTheory: Topic = {
    id: 'controlled-uncontrolled-theory',
    title: 'Controlled vs Uncontrolled',
    importance: 3,
    status: 'to-learn',
    description: 'Farqi, qachon nima ishlatiladi',
    content: `Controlled va Uncontrolled — React-da form elementlarni boshqarishning 2 ta usuli. "Kim boshqaradi?" — React yoki DOM.

═══════════════════════════════════════
  CONTROLLED KOMPONENT
═══════════════════════════════════════

React STATE boshqaradi — "single source of truth":

  function ControlledInput() {
    const [value, setValue] = useState('')
    return <input value={value} onChange={e => setValue(e.target.value)} />
  }

  - value — React state-dan keladi
  - onChange — har o'zgarishda setState
  - React har lahzada qiymatni BILADI
  - Input React-siz o'zgarMAYDI

═══════════════════════════════════════
  UNCONTROLLED KOMPONENT
═══════════════════════════════════════

DOM O'ZI boshqaradi — ref bilan o'qiladi:

  function UncontrolledInput() {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleSubmit() {
      console.log(inputRef.current?.value)  // DOM-dan o'qish
    }

    return <input ref={inputRef} defaultValue="boshlangich" />
  }

  - defaultValue — boshlang'ich qiymat (keyin DOM boshqaradi)
  - ref — kerak bo'lganda DOM-dan o'qish
  - React har lahzadagi qiymatni BILMAYDI
  - Input DOM orqali erkin o'zgaradi

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

Controlled (ko'p hollarda):
  ✅ Real-time validatsiya
  ✅ Shartli submit button (disabled)
  ✅ Input format (masalan telefon raqam)
  ✅ Bir nechta input bog'liq (form state)
  ✅ Dynamic form

Uncontrolled (maxsus holatlar):
  ✅ File input (<input type="file"> — FAQAT uncontrolled)
  ✅ Oddiy form (submit-da o'qish yetarli)
  ✅ Third-party DOM kutubxonalari
  ✅ Performance (har keystroke-da setState yo'q)

═══════════════════════════════════════
  ANTI-PATTERN
═══════════════════════════════════════

  // ❌ Ikkalasini aralashtirish — value + defaultValue
  <input value={state} defaultValue="default" />
  // React ogohlantiradi!

  // ❌ value bersiz, onChange bermaslik
  <input value="fixed" />
  // Input o'zgarMAYDI — foydalanuvchi yoza OLMAYDI`,
    codeExamples: [
      {
        title: 'Controlled vs Uncontrolled — taqqoslash',
        language: 'tsx',
        code: `import { useState, useRef } from 'react'

// ✅ CONTROLLED — React boshqaradi
function ControlledForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isValid = email.includes('@') && password.length >= 8

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log({ email, password })  // state-dan
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email" />
      {email && !email.includes('@') && (
        <p className="text-red-500">Email noto'g'ri</p>  // Real-time validation
      )}

      <input type="password" value={password}
        onChange={e => setPassword(e.target.value)} placeholder="Parol" />
      {password && password.length < 8 && (
        <p className="text-red-500">Kamida 8 belgi</p>
      )}

      <button disabled={!isValid}>Kirish</button>  {/* Shartli disable */}
    </form>
  )
}

// ✅ UNCONTROLLED — DOM boshqaradi
function UncontrolledForm() {
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    console.log({
      email: formData.get('email'),      // DOM-dan o'qish
      password: formData.get('password'),
    })
  }

  function handleReset() {
    formRef.current?.reset()  // DOM method
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="email" defaultValue="" placeholder="Email" />
      <input name="password" type="password" placeholder="Parol" />
      <button type="submit">Kirish</button>
      <button type="button" onClick={handleReset}>Tozalash</button>
    </form>
  )
}

// File input — FAQAT uncontrolled
function FileUpload() {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleUpload() {
    const file = fileRef.current?.files?.[0]
    if (file) {
      console.log(file.name, file.size)
    }
  }

  return (
    <div>
      <input type="file" ref={fileRef} />
      <button onClick={handleUpload}>Yuklash</button>
    </div>
  )
}`,
        description: 'Controlled: value + onChange, real-time validatsiya, shartli disable. Uncontrolled: defaultValue + ref/FormData, submit-da o\'qish. File input — faqat uncontrolled.',
      },
    ],
    interviewQA: [
      {
        question: 'Controlled va uncontrolled komponent farqi nima?',
        answer: `Controlled — React STATE boshqaradi: value={state} + onChange={setState}. React har lahzada qiymatni biladi. Uncontrolled — DOM O'ZI boshqaradi: defaultValue + ref bilan kerak bo'lganda o'qish. React oraliq qiymatlarni bilMAYDI. Controlled afzalliklari: real-time validatsiya, format, shartli disable. Uncontrolled afzalliklari: kam kod, performance (har keystroke-da re-render yo'q). Ko'p hollarda Controlled tavsiya etiladi.`,
      },
      {
        question: 'Nima uchun file input faqat uncontrolled?',
        answer: `<input type="file"> — brauzer xavfsizligi tufayli JavaScript-dan value O'ZGARTIRIB BO'LMAYDI. Faqat foydalanuvchi tanlashi mumkin. Shuning uchun value prop berish mumkin emas — faqat ref bilan o'qish. fileRef.current.files — tanlangan fayllar ro'yxati. Bu brauzerning xavfsizlik cheklovi — script fayllarni o'zboshimchalik bilan tanlay olmasligi kerak.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Amaliy pattern' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-ref', label: 'useRef (uncontrolled)' },
    ],
  }
