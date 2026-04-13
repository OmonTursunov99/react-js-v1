import type { Topic } from '../../types'

export const controlledVsUncontrolled: Topic = {
    id: `controlled-vs-uncontrolled`,
    title: `Controlled vs Uncontrolled`,
    importance: 3,
    status: `to-learn`,
    description: `Input/form boshqaruvi farqi`,
    content: `React-da form elementlarini boshqarishning ikki usuli bor: Controlled (React boshqaradi) va Uncontrolled (DOM boshqaradi). Bu React-dagi eng muhim tushunchalardan biri.

═══════════════════════════════════════
  CONTROLLED
═══════════════════════════════════════

React state boshqaradi. Har bir o'zgarish React orqali:

  const [name, setName] = useState('')
  <input value={name} onChange={e => setName(e.target.value)} />

Qanday ishlaydi:
  1. Foydalanuvchi harf yozadi
  2. onChange chaqiriladi
  3. setName yangi qiymatni saqlaydi
  4. React qayta renderlaydi
  5. input yangi value ko'rsatadi

React — "single source of truth".
Input qiymati DOIM state-ga teng.

Afzalliklari:
  ✅ Real-time validation
  ✅ Conditional disable (submit tugmasini boshqarish)
  ✅ Format input (telefon raqam, karta raqam)
  ✅ Bir nechta input-ni bir joydan boshqarish

═══════════════════════════════════════
  UNCONTROLLED
═══════════════════════════════════════

DOM o'zi boshqaradi. React aralashmaydi:

  const inputRef = useRef<HTMLInputElement>(null)
  <input defaultValue="" ref={inputRef} />

  // Qiymatni olish:
  const value = inputRef.current?.value

Qanday ishlaydi:
  1. Foydalanuvchi harf yozadi
  2. DOM o'zi yangilaydi (React bilmaydi!)
  3. Kerak bo'lganda ref orqali qiymat olinadi

Afzalliklari:
  ✅ Oddiyroq kod (state va onChange shart emas)
  ✅ Kamroq re-render (har harf uchun render yo'q)
  ✅ 3rd party kutubxonalar bilan integratsiya oson

═══════════════════════════════════════
  FARQLARI JADVAL
═══════════════════════════════════════

  Controlled:
    - React boshqaradi (value + onChange)
    - Har o'zgarishda re-render
    - Real-time validation mumkin
    - Format input mumkin
    - Ko'proq kod

  Uncontrolled:
    - DOM boshqaradi (defaultValue + ref)
    - Re-render yo'q
    - Submit-da validation
    - Format qiyin
    - Kamroq kod

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

Controlled ishlatish kerak (KO'P HOLLARDA):
  ✅ Form validation (real-time xato ko'rsatish)
  ✅ Dynamic form (bir input boshqasiga bog'liq)
  ✅ Format input (telefon: +998 XX XXX-XX-XX)
  ✅ Submit tugmasini enable/disable

Uncontrolled ishlatish kerak:
  ✅ Oddiy form (login, ro'yxatdan o'tish)
  ✅ File input (FAQAT uncontrolled!)
  ✅ 3rd party DOM kutubxonalari
  ✅ Performance-critical (juda ko'p inputlar)

═══════════════════════════════════════
  FILE INPUT
═══════════════════════════════════════

File input DOIM uncontrolled — React value bera olmaydi:

  // NOTO'G'RI — ishlamaydi:
  <input type="file" value={file} />

  // TO'G'RI — faqat ref yoki onChange:
  <input type="file" onChange={e => setFile(e.target.files?.[0])} />
  <input type="file" ref={fileRef} />

Nima uchun? Browser security — JavaScript faylni
to'g'ridan-to'g'ri input-ga set qila olmaydi.

═══════════════════════════════════════
  REACT HOOK FORM
═══════════════════════════════════════

React Hook Form — uncontrolled approach ishlatadi:
  register + ref bilan input-larni kuzatadi

Performance yaxshi — har harf uchun re-render yo'q.
Ko'p inputli formlar uchun juda samarali.

Lekin React rasmiy jamoasi CONTROLLED tavsiya qiladi —
chunki u React falsafasiga mos keladi
(React — single source of truth).`,
    codeExamples: [
      {
        title: `Controlled form — login form (validation bilan)`,
        language: `tsx`,
        code: `import { useState, type FormEvent } from 'react'

interface FormErrors {
  email?: string
  password?: string
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  // Real-time validation
  function validate(): FormErrors {
    const newErrors: FormErrors = {}

    if (!email) {
      newErrors.email = 'Email kiritish shart'
    } else if (!/\\S+@\\S+\\.\\S+/.test(email)) {
      newErrors.email = 'Email formati noto\\'g\\'ri'
    }

    if (!password) {
      newErrors.password = 'Parol kiritish shart'
    } else if (password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgi'
    }

    return newErrors
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
      console.log('Yuborildi:', { email, password })
    }
  }

  // Submit tugmasi faqat ikkala maydon to'ldirilganda aktiv
  const isFormValid = email.length > 0 && password.length >= 6

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2>Tizimga kirish</h2>

      <div className="mb-4">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}                           // React boshqaradi
          onChange={e => setEmail(e.target.value)} // Har o'zgarishda
          className={errors.email ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="password">Parol:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={errors.password ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={!isFormValid}   // Dynamic disable — controlled afzalligi
        className={isFormValid ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}
      >
        Kirish
      </button>

      {submitted && <p className="text-green-500 mt-2">Muvaffaqiyatli!</p>}
    </form>
  )
}`,
        description: `Controlled form — React barcha input qiymatlarini boshqaradi. Real-time validation, dynamic disable, xato ko'rsatish — barchasi controlled approach afzalliklari.`,
      },
      {
        title: `Uncontrolled form — useRef bilan`,
        language: `tsx`,
        code: `import { useRef, type FormEvent } from 'react'

function UncontrolledForm() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Qiymatlarni ref orqali olish — faqat submit-da
    const data = {
      name: nameRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      message: messageRef.current?.value ?? '',
    }

    console.log('Forma ma\\'lumotlari:', data)

    // Formani tozalash
    if (nameRef.current) nameRef.current.value = ''
    if (emailRef.current) emailRef.current.value = ''
    if (messageRef.current) messageRef.current.value = ''
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2>Aloqa formasi (Uncontrolled)</h2>

      <div className="mb-4">
        <label htmlFor="name">Ism:</label>
        <input
          id="name"
          ref={nameRef}
          defaultValue=""     // value EMAS, defaultValue!
        />
      </div>

      <div className="mb-4">
        <label htmlFor="uc-email">Email:</label>
        <input
          id="uc-email"
          type="email"
          ref={emailRef}
          defaultValue=""
        />
      </div>

      <div className="mb-4">
        <label htmlFor="message">Xabar:</label>
        <textarea
          id="message"
          ref={messageRef}
          defaultValue=""
          rows={4}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Yuborish
      </button>

      {/* Bu formada re-render BO'LMAYDI — har harf uchun render yo'q */}
    </form>
  )
}`,
        description: `Uncontrolled form — DOM o'zi input qiymatlarini boshqaradi. React aralashmaydi — re-render yo'q. Qiymat faqat submit-da ref orqali olinadi. Oddiy formalar uchun mos.`,
      },
      {
        title: `Mixed — controlled inputs + uncontrolled file upload`,
        language: `tsx`,
        code: `import { useState, type FormEvent, type ChangeEvent } from 'react'

function ProfileForm() {
  // Controlled — text input-lar
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  // File — doim uncontrolled (browser security)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setAvatar(file)

    // Preview yaratish
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('bio', bio)
    if (avatar) formData.append('avatar', avatar)

    console.log('Yuborilmoqda:', { name, bio, avatar: avatar?.name })
    // fetch('/api/profile', { method: 'POST', body: formData })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2>Profil tahrirlash</h2>

      {/* Controlled — real-time ko'rish */}
      <div className="mb-4">
        <label>Ism:</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        {name && <p>Salom, {name}!</p>}
      </div>

      <div className="mb-4">
        <label>Bio:</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} />
        <p className="text-sm text-gray-500">{bio.length}/200 belgi</p>
      </div>

      {/* Uncontrolled — file input */}
      <div className="mb-4">
        <label>Avatar:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          // value={...} BERA OLMAYSIZ — browser security!
        />
        {preview && (
          <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mt-2" />
        )}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Saqlash
      </button>
    </form>
  )
}`,
        description: `Amaliy misol — text input-lar controlled (real-time preview), file input uncontrolled (browser cheklovi). Ko'p real ilovalarda aynan shunday mix ishlatiladi.`,
      },
    ],
    interviewQA: [
      {
        question: `Controlled va uncontrolled component farqi nima?`,
        answer: `Controlled component — React state boshqaradi: value={state} + onChange={setState}. Har bir o'zgarish React orqali — React "single source of truth". Re-render har o'zgarishda. Uncontrolled component — DOM o'zi boshqaradi: defaultValue + ref. React aralashmaydi — qiymat faqat kerak bo'lganda ref.current.value orqali olinadi. Re-render yo'q. Controlled ko'proq nazorat beradi (validation, format), uncontrolled oddiyroq va tezroq.`,
      },
      {
        question: `Qachon controlled, qachon uncontrolled ishlatiladi?`,
        answer: `Controlled — KO'P HOLLARDA: real-time validation kerak bo'lganda, input formatini o'zgartirish kerak bo'lganda (telefon, karta raqam), submit tugmasini dynamic enable/disable qilish kerak bo'lganda, bir input boshqasiga bog'liq bo'lganda. Uncontrolled — oddiy formalar, file input (DOIM uncontrolled), 3rd party DOM kutubxonalari bilan integratsiya, va juda ko'p inputli formalar (performance). React rasmiy jamoasi CONTROLLED tavsiya qiladi.`,
      },
      {
        question: `File input nima uchun doim uncontrolled?`,
        answer: `Browser security sababli JavaScript file input-ning value-sini set qila OLMAYDI. <input type="file" value={file} /> ISHLAMAYDI. Bu browser cheklovi — aks holda JavaScript foydalanuvchi kompyuteridan ixtiyoriy faylni o'qiy olardi. Shuning uchun file input faqat onChange event orqali (e.target.files) yoki ref orqali boshqariladi. Bu barcha framework-larda bir xil — Vue, Angular, React — hammasi file input-ni uncontrolled sifatida ishlatadi.`,
      },
      {
        question: `React Hook Form qaysi approach ishlatadi?`,
        answer: `React Hook Form UNCONTROLLED approach ishlatadi — register funksiyasi input-ga ref beradi va DOM-da to'g'ridan-to'g'ri kuzatadi. Bu sabab bilan u juda tez — har harf uchun re-render BO'LMAYDI. Ko'p inputli murakkab formalar uchun ideal. Lekin zarur bo'lganda controlled rejimga o'tish mumkin (Controller component orqali). React rasmiy jamoasi controlled tavsiya qilsa ham, real loyihalarda React Hook Form ko'p ishlatiladi — chunki performance va DX (developer experience) yaxshi.`,
      },
    ],
    relatedTopics: [
      { sectionId: `react-core`, topicId: `use-state`, label: `useState (controlled)` },
      { sectionId: `react-core`, topicId: `use-ref`, label: `useRef (uncontrolled)` },
      { sectionId: `react-core`, topicId: `event-system`, label: `Event System` },
      { sectionId: `theory-questions`, topicId: `controlled-uncontrolled-theory`, label: `Nazariy savol` },
    ],
  }
