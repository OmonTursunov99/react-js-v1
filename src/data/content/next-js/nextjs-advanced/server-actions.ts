import type { Topic } from '../../../types'

export const serverActions: Topic = {
  id: 'server-actions',
  title: 'Server Actions',
  importance: 3,
  status: 'to-learn',
  description: 'Server Actions — formalar, revalidation, optimistic updates',
  content: `Server Actions — serverda ishlaydigan async funksiyalar. Ular form submission va data mutation uchun ishlatiladi. API endpoint yaratish SHART EMAS.

═══════════════════════════════════════
  ASOSIY TUSHUNCHA
═══════════════════════════════════════

Server Action — 'use server' direktivasi bilan belgilangan async funksiya.
U serverda ishlaydi, lekin clientdan form yoki funksiya sifatida chaqiriladi.

  'use server'
  export async function createPost(formData: FormData) {
    const title = formData.get('title') as string
    await db.post.create({ data: { title } })
    revalidatePath('/posts')
  }

═══════════════════════════════════════
  QAYERDA ANIQLASH MUMKIN
═══════════════════════════════════════

1. Alohida faylda (tavsiya etiladi):
   // app/actions.ts
   'use server'   ← fayl boshida
   export async function action() { ... }

2. Server Component ichida (inline):
   export default async function Page() {
     async function submit() {
       'use server'   ← funksiya ichida
       // server kodi
     }
     return <form action={submit}>...</form>
   }

═══════════════════════════════════════
  FORM BILAN ISHLATISH
═══════════════════════════════════════

HTML form ning action atributi Server Action qabul qiladi:

  <form action={createPost}>
    <input name="title" />
    <button type="submit">Yaratish</button>
  </form>

JavaScript o'chiq bo'lsa ham ishlaydi (progressive enhancement)!

═══════════════════════════════════════
  REVALIDATION
═══════════════════════════════════════

Server Action ichida cache tozalash:

  import { revalidatePath, revalidateTag } from 'next/cache'

  revalidatePath('/posts')      // sahifa cache tozalash
  revalidateTag('posts')        // tag asosida tozalash
  redirect('/posts')            // sahifaga yo'naltirish

═══════════════════════════════════════
  USE ACTION STATE
═══════════════════════════════════════

React 19 ning useActionState hooki — form holati boshqarish:
- loading holati
- xatolik xabarlari
- oldingi holat

  const [state, formAction, isPending] = useActionState(action, initialState)

═══════════════════════════════════════
  OPTIMISTIC UPDATES
═══════════════════════════════════════

useOptimistic — server javobini kutmasdan UI yangilash:

  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state, newPost) => [...state, newPost]
  )

Foydalanuvchi natijani darhol ko'radi.
Agar server xato bersa — UI avvalgi holatga qaytadi.

═══════════════════════════════════════
  XAVFSIZLIK
═══════════════════════════════════════

Server Actions public HTTP endpoint yaratadi!
Shuning uchun:
- INPUT validatsiya qilish MAJBURIY (zod ishlatish tavsiya)
- Autentifikatsiya tekshirish kerak
- Rate limiting o'rnatish kerak`,
  codeExamples: [
    {
      title: 'Server Action bilan form',
      code: `// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(3, "Kamida 3 belgi"),
  content: z.string().min(10, "Kamida 10 belgi"),
})

export async function createPost(formData: FormData) {
  const raw = {
    title: formData.get('title'),
    content: formData.get('content'),
  }

  // Validatsiya
  const result = PostSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Ma'lumotlar bazasiga saqlash
  await db.post.create({ data: result.data })

  // Cache tozalash va redirect
  revalidatePath('/posts')
  redirect('/posts')
}

// app/posts/new/page.tsx
import { createPost } from '@/app/actions'

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" placeholder="Sarlavha" />
      <textarea name="content" placeholder="Mazmun" />
      <button type="submit">Yaratish</button>
    </form>
  )
}`,
      language: 'ts',
      description: 'Zod validatsiya bilan Server Action',
    },
    {
      title: 'useActionState bilan form holati',
      code: `// app/actions.ts
'use server'

interface FormState {
  message: string
  errors?: { email?: string[]; password?: string[] }
}

export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email.includes('@')) {
    return { message: '', errors: { email: ["Noto'g'ri email"] } }
  }

  const user = await authenticate(email, password)
  if (!user) {
    return { message: "Email yoki parol noto'g'ri" }
  }

  redirect('/dashboard')
}

// app/login/page.tsx
'use client'
import { useActionState } from 'react'
import { login } from '@/app/actions'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, {
    message: '',
  })

  return (
    <form action={formAction}>
      <input name="email" type="email" placeholder="Email" />
      {state.errors?.email && <p className="text-red-500">{state.errors.email[0]}</p>}

      <input name="password" type="password" placeholder="Parol" />

      <button type="submit" disabled={isPending}>
        {isPending ? 'Kirish...' : 'Kirish'}
      </button>

      {state.message && <p className="text-red-500">{state.message}</p>}
    </form>
  )
}`,
      language: 'tsx',
      description: 'useActionState — loading holati va xatolik boshqarish',
    },
    {
      title: 'Optimistic Update',
      code: `'use client'
import { useOptimistic } from 'react'
import { addTodo } from '@/app/actions'

interface Todo {
  id: number
  text: string
  sending?: boolean
}

export function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: Todo[], newTodo: string) => [
      ...state,
      { id: Date.now(), text: newTodo, sending: true },
    ]
  )

  async function handleSubmit(formData: FormData) {
    const text = formData.get('text') as string
    addOptimisticTodo(text) // Darhol UI yangilash
    await addTodo(formData) // Server ga yuborish
  }

  return (
    <div>
      {optimisticTodos.map(todo => (
        <div key={todo.id} style={{ opacity: todo.sending ? 0.5 : 1 }}>
          {todo.text}
        </div>
      ))}
      <form action={handleSubmit}>
        <input name="text" placeholder="Yangi vazifa" />
        <button type="submit">Qo'shish</button>
      </form>
    </div>
  )
}`,
      language: 'tsx',
      description: 'useOptimistic — server javobini kutmasdan UI yangilash',
    },
  ],
  interviewQA: [
    {
      question: "Server Actions nima va nima uchun kerak?",
      answer: "Server Actions — 'use server' direktivasi bilan belgilangan async funksiyalar. Ular form submission va data mutation uchun API endpoint yaratmasdan ishlatiladi. Afzalliklari: progressive enhancement (JS o'chiq bo'lsa ham ishlaydi), avtomatik form serialization, revalidation integratsiyasi, type safety.",
    },
    {
      question: "Server Actions xavfsizlik muammolari qanday?",
      answer: "Har bir Server Action public HTTP POST endpoint yaratadi — har kim chaqirishi mumkin! Shuning uchun: 1) Input validatsiya (zod/yup) MAJBURIY. 2) Autentifikatsiya tekshirish — session/token tekshirish. 3) Avtorizatsiya — foydalanuvchining ruxsati borligini tekshirish. 4) Rate limiting. FormData ga ishonib bo'lmaydi — doim serverda validatsiya qilish kerak.",
    },
    {
      question: "useActionState va oddiy form action orasidagi farq nima?",
      answer: "Oddiy form action — faqat submit va redirect. useActionState esa: 1) loading holati (isPending) — button disable qilish. 2) Oldingi holat (prevState) — xatolik xabarlarini saqlash. 3) Server dan qaytgan natija (state) — validatsiya xatolari ko'rsatish. Bu interaktiv formlar uchun zarur.",
    },
    {
      question: "Optimistic update nima va qachon ishlatiladi?",
      answer: "Optimistic update — server javobini KUTMASDAN UI ni darhol yangilash. useOptimistic hook ishlatiladi. Agar server xato bersa — UI avvalgi holatga qaytadi. Like tugmasi, todo qo'shish, xabar yuborish kabi tez feedback kerak bo'lgan joylarda ishlatiladi. Foydalanuvchi tajribasini sezilarli yaxshilaydi.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'data-fetching', label: 'Data Fetching' },
    { techId: 'next-js', sectionId: 'nextjs-advanced', topicId: 'api-routes', label: 'API Routes' },
  ],
}
