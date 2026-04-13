import type { Topic } from '../../../types'

export const useActionState: Topic = {
    id: 'use-action-state',
    title: 'useActionState',
    importance: 2,
    status: 'to-learn' as const,
    description: 'React 19 — form action-larni boshqarish (state + pending + progressive enhancement)',
    content: `useActionState — React 19 da qo'shilgan hook. Form action-larni boshqarish uchun ishlatiladi.

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const [state, formAction, isPending] = useActionState(
  actionFn,      // async (prevState, formData) => newState
  initialState   // boshlang'ich state
)

- state — hozirgi holat (success, error, data)
- formAction — <form action={formAction}> ga berish
- isPending — form submit bo'lyaptimi (loading holat)

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

Oddiy form boshqaruvi murakkab:
- loading state uchun useState
- error state uchun useState
- success state uchun useState
- preventDefault, fetch, try/catch...

useActionState HAMMASINI BITTA hook-da hal qiladi.

═══════════════════════════════════════
  PROGRESSIVE ENHANCEMENT
═══════════════════════════════════════

<form action={formAction}> — brauzer native submit.
JavaScript yuklanmasdan HAM ishlaydi (SSR/Next.js da).
Bu "progressive enhancement" deyiladi.

═══════════════════════════════════════
  SERVER ACTIONS BILAN
═══════════════════════════════════════

Next.js da Server Actions bilan bevosita ishlaydi:
- action funksiya server-da ishlaydi
- Client-da faqat form ko'rsatiladi
- JavaScript yo'q bo'lsa ham form ishlaydi`,
    codeExamples: [
        {
            title: 'Form submit — loading + error + success',
            language: 'tsx' as const,
            code: `import { useActionState } from 'react'

type FormState = {
  message: string
  status: 'idle' | 'success' | 'error'
}

async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Validatsiya
  if (!name || !email) {
    return { message: 'Barcha maydonlarni to'ldiring!', status: 'error' }
  }

  // Server-ga yuborish simulyatsiyasi
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Tasodifiy xato simulyatsiyasi
  if (Math.random() > 0.7) {
    return { message: 'Server xatosi! Qayta urinib ko'ring.', status: 'error' }
  }

  return { message: \`Rahmat, \${name}! Ma'lumot saqlandi.\`, status: 'success' }
}

function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitForm, {
    message: '',
    status: 'idle' as const,
  })

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Ism:</label>
        <input id="name" name="name" type="text" disabled={isPending} />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" disabled={isPending} />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Yuborilmoqda...' : 'Yuborish'}
      </button>

      {state.status === 'error' && (
        <p style={{ color: 'red' }}>{state.message}</p>
      )}
      {state.status === 'success' && (
        <p style={{ color: 'green' }}>{state.message}</p>
      )}
    </form>
  )
}`,
            description: 'useActionState form submit-ni boshqaradi: loading (isPending), error va success holatlari bitta hook-da. form action orqali progressive enhancement ham ishlaydi.',
        },
    ],
    interviewQA: [
        {
            question: 'useActionState nima va qanday ishlaydi?',
            answer: `useActionState — React 19 dagi hook, form action-larni boshqarish uchun. U 3 ta narsa beradi: state (hozirgi holat — success/error/data), formAction (form action-ga berish), isPending (loading holat). Oddiy useState + fetch + try/catch o'rniga BITTA hook ishlatiladi. Progressive enhancement — JS yo'q bo'lsa ham form ishlaydi.`,
        },
        {
            question: 'useActionState va oddiy onSubmit handler farqi nima?',
            answer: `Oddiy onSubmit bilan: preventDefault, useState(loading), useState(error), fetch, try/catch — ko'p boilerplate. useActionState bularni HAMMASINI bitta hook-da hal qiladi. Yana muhim farq: form action={formAction} — bu native HTML form submit, JS yuklanmasdan ham ishlaydi (progressive enhancement). Next.js da Server Actions bilan bevosita integratsiya ham bor.`,
        },
    ],
    relatedTopics: [
        { techId: 'react-js', sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
        { techId: 'react-js', sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
        { techId: 'react-js', sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Form boshqaruvi' },
    ],
}
