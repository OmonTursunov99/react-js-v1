import type { Topic } from '../../types'

export const accessibility: Topic = {
    id: 'accessibility',
    title: 'Accessibility (a11y)',
    importance: 2,
    status: 'to-learn',
    description: 'ARIA attributes, semantic HTML, keyboard navigation',
    content: `Accessibility (a11y) — ilovani BARCHA foydalanuvchilar uchun qulay qilish. Ko'rish, eshitish, harakatlanish qiyinchiliklari bo'lgan kishilar uchun ham ishlashi kerak.

═══════════════════════════════════════
  NIMA UCHUN MUHIM
═══════════════════════════════════════

1. Foydalanuvchilar — 15% odamlar nogironlikka ega (WHO)
2. Qonun — ADA (AQSH), EAA (Yevropa) — majburiy
3. SEO — semantic HTML Google uchun yaxshi
4. UX — yaxshi a11y = yaxshi UX BARCHA foydalanuvchilar uchun
5. Testing — RTL getByRole a11y-ga asoslangan

═══════════════════════════════════════
  SEMANTIC HTML (ENG MUHIM)
═══════════════════════════════════════

  ❌ <div onClick={fn}>Click me</div>
  ✅ <button onClick={fn}>Click me</button>

Semantic elementlar:
  <button>    — click qilinadigan narsa
  <a href>    — navigatsiya
  <input>     — ma'lumot kiritish
  <form>      — forma
  <nav>       — navigatsiya bloki
  <main>      — asosiy kontent
  <header>    — sarlavha
  <footer>    — pastki qism
  <article>   — mustaqil kontent
  <section>   — bo'lim
  <h1>-<h6>   — sarlavhalar (tartibda!)
  <ul>/<ol>   — ro'yxat
  <label>     — input tavsifi

Semantic HTML beradi:
  ✅ Screen reader to'g'ri o'qiydi
  ✅ Keyboard navigatsiya ishlaydi
  ✅ Brauzer default xulq-atvor (form submit, focus)

═══════════════════════════════════════
  ARIA ATTRIBUTES
═══════════════════════════════════════

ARIA — semantic HTML YETARLI BO'LMAGAN holatlar uchun.
Qoida: AVVAL semantic HTML, KEYIN ARIA.

Asosiy ARIA atributlar:
  role="dialog"         — modal oynasi
  role="alert"          — muhim xabar (screen reader darhol o'qiydi)
  role="tab" / "tabpanel" — tab interfeys

  aria-label="Close"     — element tavsifi (matn yo'q bo'lsa)
  aria-labelledby="id"   — boshqa element bilan bog'lash
  aria-describedby="id"  — qo'shimcha tavsif

  aria-hidden="true"     — screen reader dan yashirish
  aria-expanded="true"   — ochilgan/yopilgan (accordion)
  aria-selected="true"   — tanlangan (tab)
  aria-disabled="true"   — o'chirilgan
  aria-live="polite"     — dinamik kontent yangilanishi

═══════════════════════════════════════
  KEYBOARD NAVIGATSIYA
═══════════════════════════════════════

Barcha interaktiv elementlar KLAVIATURA bilan ishlatilishi kerak:

  Tab — keyingi elementga o'tish
  Shift+Tab — oldingi elementga
  Enter/Space — button bosish
  Escape — modal yopish
  Arrow keys — ro'yxat/tab-larda navigatsiya

React-da:
  - tabIndex={0} — fokus qilinishi mumkin
  - tabIndex={-1} — faqat programmatik fokus
  - onKeyDown — keyboard event handling
  - autoFocus — sahifa ochilganda fokus

═══════════════════════════════════════
  FOCUS MANAGEMENT
═══════════════════════════════════════

Modal ochilganda:
  1. Fokus modal ichiga o'tadi
  2. Tab faqat modal ichida yuradi (focus trap)
  3. Escape bilan yopiladi
  4. Yopilganda fokus ESKI joyga qaytadi

React-da:
  useRef — focus qilish
  useEffect — mount/unmount da focus boshqarish
  useId — ARIA id-lar yaratish`,
    codeExamples: [
      {
        title: 'Accessible komponentlar',
        language: 'tsx',
        code: `import { useId, useRef, useEffect, useState } from 'react'

// ✅ Accessible Input
function AccessibleInput({
  label,
  error,
  ...props
}: {
  label: string
  error?: string
} & React.ComponentPropsWithoutRef<'input'>) {
  const id = useId()
  const errorId = useId()

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  )
}

// ✅ Accessible Modal
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  // Fokus modal ichiga
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  // Escape bilan yopish
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between">
          <h2 id={titleId}>{title}</h2>
          <button ref={closeRef} onClick={onClose} aria-label="Yopish">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ✅ Accessible Toggle
function Toggle({ label, checked, onChange }: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={e => { if (e.key === ' ') { e.preventDefault(); onChange(!checked) } }}
        className={\`w-10 h-6 rounded-full \${checked ? 'bg-blue-500' : 'bg-gray-300'}\`}
      >
        <div className={\`w-4 h-4 rounded-full bg-white transition \${checked ? 'translate-x-5' : 'translate-x-1'}\`} />
      </div>
      {label}
    </label>
  )
}`,
        description: 'A11y: useId (aria-describedby), role="dialog" (modal), aria-modal, aria-label, role="switch", focus management, Escape handler. Semantic HTML + ARIA = accessible.',
      },
    ],
    interviewQA: [
      {
        question: 'Web accessibility nima va nima uchun muhim?',
        answer: `Accessibility (a11y) — ilovani BARCHA foydalanuvchilar uchun ishlatilishi mumkin qilish: ko'rish, eshitish, harakatlanish qiyinchiliklari bo'lgan kishilar uchun ham. Nima uchun muhim: 1) 15% odamlar nogironlikka ega, 2) Qonun — ADA, EAA, 3) SEO — semantic HTML Google uchun yaxshi, 4) UX — yaxshi a11y = yaxshi UX hammaga, 5) Testing — RTL getByRole a11y-ga asoslangan. Asosiy: semantic HTML, ARIA, keyboard navigatsiya, focus management.`,
      },
      {
        question: 'Semantic HTML va ARIA farqi nima?',
        answer: `Semantic HTML — to'g'ri element ishlatish: <button> (div+onClick emas), <nav>, <main>, <h1>-<h6>, <label>. Brauzer avtomatik role, focus, keyboard beradi. ARIA — semantic HTML YETARLI BO'LMAGANDA qo'shimcha ma'lumot: role="dialog", aria-label, aria-expanded, aria-live. Qoida: AVVAL semantic HTML ishlatish, KEYIN ARIA. <button> ishlatsa — role="button" KERAK EMAS (allaqachon bor). ARIA faqat custom komponentlar uchun (tab, accordion, modal).`,
      },
      {
        question: 'React-da keyboard navigatsiya qanday qilinadi?',
        answer: `1) Semantic HTML ishlatish — button, a, input AVTOMATIK fokus va keyboard ishlaydi. 2) tabIndex — 0 (fokus mumkin), -1 (faqat programmatik fokus). 3) onKeyDown — custom keyboard: Enter/Space click, Escape yopish, Arrow navigatsiya. 4) Focus management — modal ochilganda fokus ichiga, yopilganda eski joyga. useRef + focus(). 5) Focus trap — modal ichida Tab faqat modal elementlari orasida yuradi. React-da useId — aria-labelledby/describedby uchun unique ID.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'rtl', label: 'RTL (getByRole)' },
      { sectionId: 'react-core', topicId: 'use-id', label: 'useId (aria-*)' },
    ],
  }
