import type { Topic } from '../../../types'

export const useOptimistic: Topic = {
    id: 'use-optimistic',
    title: 'useOptimistic',
    importance: 2,
    status: 'to-learn' as const,
    description: 'React 19 — server javob bermay turib UI-ni optimistik yangilash',
    content: `useOptimistic — React 19 da qo'shilgan hook. Optimistic UI pattern-ni amalga oshirish uchun ishlatiladi.

═══════════════════════════════════════
  OPTIMISTIC UI NIMA
═══════════════════════════════════════

Optimistic UI — server javob qaytarmasdan OLDIN UI-ni yangilash.
Foydalanuvchi harakatni darhol ko'radi, server javob kelganda tasdiqlanadi.

Masalan:
- Like bosish → darhol +1 ko'rinadi → server javob kelganda tasdiqlaydi
- Xabar yuborish → darhol ro'yxatda ko'rinadi → server saqlaydi

Agar xato bo'lsa — eski holatga qaytadi (rollback).

═══════════════════════════════════════
  SINTAKSIS
═══════════════════════════════════════

const [optimisticState, addOptimistic] = useOptimistic(
  actualState,          // haqiqiy state (server-dan)
  updateFn              // (currentState, optimisticValue) => newState
)

- optimisticState — ko'rsatiladigan qiymat (optimistik yoki haqiqiy)
- addOptimistic — optimistik yangilanishni qo'shish
- async action tugaganda avtomatik haqiqiy state-ga qaytadi

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

1. Foydalanuvchi harakat qiladi (like bosadi)
2. addOptimistic chaqiriladi → UI darhol yangilanadi
3. Server-ga so'rov yuboriladi (async)
4. Server javob beradi → haqiqiy state yangilanadi
5. Agar xato bo'lsa → optimistik qiymat bekor, eski state qaytadi`,
    codeExamples: [
        {
            title: 'Like button — optimistik yangilash',
            language: 'tsx' as const,
            code: `import { useOptimistic, useState, useTransition } from 'react'

// Server-ga like yuborish simulyatsiyasi
async function sendLike(postId: number): Promise<{ likes: number }> {
  const res = await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' })
  return res.json()
}

function LikeButton({ postId, initialLikes }: { postId: number; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()

  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes: number, _newLike: number) => currentLikes + 1
  )

  const handleLike = () => {
    startTransition(async () => {
      // 1. Darhol UI-ni yangilash (optimistik)
      addOptimisticLike(1)

      // 2. Server-ga yuborish
      try {
        const result = await sendLike(postId)
        // 3. Haqiqiy state yangilash
        setLikes(result.likes)
      } catch {
        // 4. Xato bo'lsa — optimistik qiymat avtomatik bekor bo'ladi
        console.error('Like yuborishda xato!')
      }
    })
  }

  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤️ {optimisticLikes} {isPending && '(yuborilmoqda...)'}
    </button>
  )
}`,
            description: `Like bosilganda darhol +1 ko'rsatiladi (optimistic). Server javob qaytarganda haqiqiy qiymatga almashadi. Xato bo'lsa — eski qiymatga qaytadi.`,
        },
    ],
    interviewQA: [
        {
            question: 'useOptimistic nima va qachon ishlatiladi?',
            answer: `useOptimistic — React 19 dagi hook. Optimistic UI pattern uchun: server javob bermay turib UI-ni darhol yangilash. Like bosish, xabar yuborish, forma submit kabi holatlarda ishlatiladi. Foydalanuvchi kutmasdan natijani ko'radi. Xato bo'lsa avtomatik eski holatga qaytadi (rollback).`,
        },
        {
            question: 'useOptimistic va oddiy setState dan farqi nima?',
            answer: `setState bilan qiymatni o'zgartirsangiz — u doimiy. Xato bo'lsa o'zingiz qo'lda qaytarishingiz kerak. useOptimistic VAQTINCHALIK o'zgartiradi — async action tugaguncha optimistik qiymat ko'rsatadi, keyin haqiqiy state-ga avtomatik qaytadi. Server xato qaytarsa, rollback avtomatik ishlaydi. Shuningdek, useOptimistic useTransition bilan birga ishlaydi.`,
        },
    ],
    relatedTopics: [
        { techId: 'react-js', sectionId: 'state-management', topicId: 'tanstack-query-deep', label: 'TanStack Optimistic Updates' },
        { techId: 'react-js', sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
    ],
}
