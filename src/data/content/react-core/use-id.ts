import type { Topic } from '../../types'

export const useId: Topic = {
    id: 'use-id',
    title: 'useId',
    importance: 1,
    status: 'to-learn' as const,
    description: 'Unikal ID generatsiya qilish hooki — SSR va accessibility uchun',
    content: `useId — React 18+ da qo'shilgan hook bo'lib, komponent ichida unikal va barqaror ID yaratadi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const id = useId()
// Qaytaradi: ":r1:", ":r2:", ":r3:" kabi unikal string

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

1. SSR (Server-Side Rendering) da CLIENT va SERVER bir xil ID ishlatishi kerak.
   Math.random() yoki counter ishlatsa — server-da bitta, client-da boshqa ID bo'ladi = HYDRATION MISMATCH xato.
   useId esa server va client-da BIR XIL ID beradi.

2. ACCESSIBILITY uchun:
   - aria-describedby, aria-labelledby, htmlFor — bularga unikal ID kerak
   - Bir sahifada bir xil komponent bir nechta marta ishlatilsa — ID-lar TAKRORLANMASLIGI kerak

═══════════════════════════════════════
  MATH.RANDOM() NIMA UCHUN ISHLATIB BO'LMAYDI
═══════════════════════════════════════

- Server: id = "abc123"
- Client: id = "xyz789" (boshqa!)
- React: "Hydration mismatch!" ❌
- useId: server va client BIR XIL id beradi ✅

═══════════════════════════════════════
  MUHIM ESLATMA
═══════════════════════════════════════

- useId ro'yxat key-lari uchun ISHLATMANG! Key uchun ma'lumot ichidagi id ishlatiladi.
- useId faqat HTML atributlari (id, htmlFor, aria-*) uchun mo'ljallangan.`,
    codeExamples: [
        {
            title: 'Form label + input id — accessibility',
            language: 'tsx' as const,
            code: `import { useId } from 'react'

function FormField({ label, type = 'text' }: { label: string; type?: string }) {
  const id = useId()
  const hintId = \`\${id}-hint\`

  return (
    <div>
      {/* htmlFor va id bog'langan — label bosilsa input fokuslanadi */}
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} aria-describedby={hintId} />
      <p id={hintId} style={{ fontSize: '12px', color: 'gray' }}>
        {label} kiriting
      </p>
    </div>
  )
}

// Bir sahifada bir nechta marta ishlatish — ID-lar takrorlanMAYDI
function RegistrationForm() {
  return (
    <form>
      <FormField label="Ism" />        {/* id=":r1:", hint=":r1:-hint" */}
      <FormField label="Email" type="email" /> {/* id=":r2:", hint=":r2:-hint" */}
      <FormField label="Parol" type="password" /> {/* id=":r3:", hint=":r3:-hint" */}
    </form>
  )
}`,
            description: `useId har bir FormField uchun unikal ID yaratadi. Bir sahifada bir nechta marta ishlatilsa ham ID-lar hech qachon takrorlanmaydi. SSR da ham to'g'ri ishlaydi.`,
        },
    ],
    interviewQA: [
        {
            question: 'useId nima uchun kerak va Math.random() dan nima farqi?',
            answer: `useId unikal va barqaror ID yaratadi. Asosiy farq SSR-da ko'rinadi: Math.random() server-da bitta, client-da boshqa ID beradi — bu hydration mismatch xatosiga olib keladi. useId esa server va client-da BIR XIL ID kafolatlaydi. Shuningdek, useId bir komponent bir nechta marta ishlatilganda har biri uchun unikal ID beradi — accessibility (aria-describedby, htmlFor) uchun muhim.`,
        },
        {
            question: `useId ni ro'yxat key sifatida ishlatish mumkinmi?`,
            answer: `Yo'q! useId ro'yxat key-lari uchun ISHLATILMAYDI. Key uchun ma'lumot ichidagi unikal id (masalan, user.id, product.id) ishlatiladi. useId faqat HTML atributlari (id, htmlFor, aria-describedby) uchun mo'ljallangan. Key va HTML id — boshqa-boshqa narsalar.`,
        },
    ],
    relatedTopics: [
        { sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR va hydration' },
        { sectionId: 'architecture', topicId: 'accessibility', label: 'Accessibility (aria-*)' },
    ],
}
