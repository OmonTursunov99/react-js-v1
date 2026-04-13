import type { Topic } from '../../types'

export const tanstackQueryDeep: Topic = {
    id: 'tanstack-query-deep',
    title: 'TanStack Query (chuqur)',
    importance: 3,
    status: 'to-learn',
    description: 'mutations, invalidation, optimistic updates, cache',
    content: `TanStack Query-ning ilg'or xususiyatlari — mutations, cache invalidation, optimistic updates, infinite queries, prefetching.

═══════════════════════════════════════
  useMutation
═══════════════════════════════════════

useMutation — ma'lumot O'ZGARTIRISH uchun (POST, PUT, DELETE):

  const mutation = useMutation({
    mutationFn: (newUser) => axios.post('/api/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  mutation.mutate({ name: 'Ali', email: 'ali@test.com' })

Qaytaradigan qiymatlar:
  - mutate(data) — mutation chaqirish (fire-and-forget)
  - mutateAsync(data) — Promise qaytaradi (await mumkin)
  - isPending — yuklanmoqda
  - isSuccess — muvaffaqiyat
  - isError — xato
  - reset() — holatni tozalash

═══════════════════════════════════════
  CACHE INVALIDATION
═══════════════════════════════════════

Mutation-dan keyin keshni yangilash strategiyalari:

1. invalidateQueries — keshni eskirgan deb belgilash va refetch:
   queryClient.invalidateQueries({ queryKey: ['users'] })
   // ['users'], ['users', 1], ['users', {role: 'admin'}] — HAMMASI

2. setQueryData — keshni qo'lda yangilash (so'rovsiz):
   queryClient.setQueryData(['users', newUser.id], newUser)

3. Ikkalasi — optimistic update + background refetch:
   onMutate → keshni yangilash → onSettled → refetch

Invalidation ierarxik ishlaydi:
  invalidateQueries(['users'])     // BARCHA users query-larni
  invalidateQueries(['users', 1])  // faqat user 1 ni

═══════════════════════════════════════
  OPTIMISTIC UPDATES
═══════════════════════════════════════

Optimistic update — server javobini KUTMASDAN UI-ni yangilash.
Agar xato bo'lsa — eski holatga qaytarish (rollback).

Afzalliklari:
  ✅ UI darhol yangilanadi — foydalanuvchi kutMAYDI
  ✅ Tez va responsive UX

Xatarlari:
  ⚠️ Server rad etsa — rollback kerak
  ⚠️ Murakkab logika

Qadamlar:
  1. onMutate — eski keshni saqlash + yangi qiymat qo'yish
  2. onError — xato bo'lsa eski keshni qaytarish
  3. onSettled — har doim refetch (server bilan sinxronlash)

═══════════════════════════════════════
  INFINITE QUERIES
═══════════════════════════════════════

useInfiniteQuery — pagination/infinite scroll uchun:

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: ({ pageParam }) => fetchPosts(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    })

  data.pages — barcha yuklangan sahifalar massivi
  fetchNextPage() — keyingi sahifani yuklash
  hasNextPage — yana sahifa bormi
  isFetchingNextPage — keyingi sahifa yuklanmoqda

═══════════════════════════════════════
  PREFETCHING
═══════════════════════════════════════

Foydalanuvchi bosishidan OLDIN ma'lumotni yuklash:

  // Hover qilganda prefetch
  function UserLink({ userId }: { userId: string }) {
    const queryClient = useQueryClient()

    function handleMouseEnter() {
      queryClient.prefetchQuery({
        queryKey: ['users', userId],
        queryFn: () => fetchUser(userId),
        staleTime: 5 * 60 * 1000,
      })
    }

    return <Link onMouseEnter={handleMouseEnter} to={'/users/' + userId}>
      Ko'rish
    </Link>
  }

Bu instant navigation ta'sirini beradi — sahifa ochilganda
ma'lumot ALLAQACHON keshda bo'ladi.

═══════════════════════════════════════
  PARALLEL va DEPENDENT QUERIES
═══════════════════════════════════════

Parallel — bir vaqtda bir nechta query:
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const postsQuery = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
  // Ikkalasi PARALLEL ishlaydi

useQueries — dinamik parallel:
  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['users', id],
      queryFn: () => fetchUser(id),
    }))
  })

Dependent — ketma-ket (enabled bilan):
  const { data: user } = useQuery({...})
  const { data: posts } = useQuery({
    ...
    enabled: !!user,  // user bo'lmaguncha KUTADI
  })`,
    codeExamples: [
      {
        title: 'useMutation + invalidation',
        language: 'tsx',
        code: `import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface Todo {
  id: string
  title: string
  completed: boolean
}

function TodoApp() {
  const queryClient = useQueryClient()

  // Ro'yxatni olish
  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(r => r.json()) as Promise<Todo[]>,
  })

  // Qo'shish
  const addMutation = useMutation({
    mutationFn: (title: string) =>
      fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title, completed: false }),
        headers: { 'Content-Type': 'application/json' },
      }).then(r => r.json()),
    onSuccess: () => {
      // Keshni invalidate — avtomatik refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  // O'chirish
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(\`/api/todos/\${id}\`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <button
        onClick={() => addMutation.mutate('Yangi vazifa')}
        disabled={addMutation.isPending}
      >
        {addMutation.isPending ? 'Qo\\'shilmoqda...' : 'Qo\\'shish'}
      </button>

      {todos.map(todo => (
        <div key={todo.id}>
          <span>{todo.title}</span>
          <button onClick={() => deleteMutation.mutate(todo.id)}>
            O'chirish
          </button>
        </div>
      ))}
    </div>
  )
}`,
        description: 'useMutation — POST/DELETE so\'rovlar. onSuccess-da invalidateQueries — keshni yangilash. isPending — loading holati.',
      },
      {
        title: 'Optimistic update — Todo toggle',
        language: 'tsx',
        code: `import { useMutation, useQueryClient } from '@tanstack/react-query'

function useTodoToggle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todo: Todo) =>
      fetch(\`/api/todos/\${todo.id}\`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed }),
        headers: { 'Content-Type': 'application/json' },
      }).then(r => r.json()),

    // 1. OLDIN — eski keshni saqlash + yangilash
    onMutate: async (updatedTodo) => {
      // Davom etayotgan refetch-larni bekor qilish
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // Eski keshni saqlash (rollback uchun)
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      // Keshni DARHOL yangilash (UI instant yangilanadi)
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map(t =>
          t.id === updatedTodo.id
            ? { ...t, completed: !t.completed }
            : t
        )
      )

      return { previousTodos }  // context — onError-da ishlatiladi
    },

    // 2. XATO — eski keshni qaytarish
    onError: (err, todo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },

    // 3. DOIM — server bilan sinxronlash
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}`,
        description: 'Optimistic update 3 qadam: onMutate (eski keshni saqlash + darhol yangilash), onError (rollback), onSettled (server bilan sinxron). UI darhol javob beradi.',
      },
      {
        title: 'useInfiniteQuery — Infinite scroll',
        language: 'tsx',
        code: `import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

interface PostsResponse {
  posts: Post[]
  nextPage: number | null
  totalPages: number
}

function InfinitePostList() {
  const observerRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }): Promise<PostsResponse> => {
      const res = await fetch(\`/api/posts?page=\${pageParam}&limit=10\`)
      return res.json()
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  // Intersection Observer — pastga scroll qilganda avtomatik yuklash
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (observerRef.current) observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isLoading) return <p>Yuklanmoqda...</p>

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <article key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </article>
          ))}
        </div>
      ))}

      <div ref={observerRef}>
        {isFetchingNextPage && <p>Yana yuklanmoqda...</p>}
      </div>
    </div>
  )
}`,
        description: 'useInfiniteQuery + IntersectionObserver = infinite scroll. data.pages — barcha sahifalar massivi. getNextPageParam — keyingi sahifa raqami yoki undefined (tugadi).',
      },
    ],
    interviewQA: [
      {
        question: 'useMutation nima va useQuery-dan farqi?',
        answer: `useQuery — ma'lumot OLISH (GET), avtomatik chaqiriladi, keshlanadi, stale bo'lganda refetch qiladi. useMutation — ma'lumot O'ZGARTIRISH (POST/PUT/DELETE), qo'lda chaqiriladi (mutate()), keshlanMAYDI. useMutation lifecycle callback-lari bor: onMutate (mutation boshlanganda), onSuccess (muvaffaqiyat), onError (xato), onSettled (har doim). Asosan invalidateQueries bilan birgalikda ishlatiladi — mutation-dan keyin keshni yangilash uchun.`,
      },
      {
        question: 'Optimistic update nima? Qanday amalga oshiriladi?',
        answer: `Optimistic update — server javobini kutmasdan UI-ni darhol yangilash. 3 qadam: 1) onMutate — cancelQueries (concurrent refetch-ni bekor qilish), eski keshni saqlash (rollback uchun), setQueryData bilan keshni darhol yangilash, 2) onError — xato bo'lsa eski keshni qaytarish (rollback), 3) onSettled — har doim invalidateQueries (server bilan sinxronlash). Foydalanuvchi kutmasligi uchun UX yaxshilanadi, lekin server rad etsa rollback bo'lishi kerak.`,
      },
      {
        question: 'invalidateQueries vs setQueryData farqi nima?',
        answer: `invalidateQueries — keshni "stale" (eskirgan) deb belgilaydi va REFETCH qiladi. Server-dan yangi ma'lumot olinadi. Ishonchli, lekin network so'rov kerak. setQueryData — keshni to'g'ridan-to'g'ri yangilaydi, SO'ROV YO'Q. Darhol, lekin server-dan farqli bo'lishi mumkin. Best practice: optimistic update-da setQueryData + onSettled-da invalidateQueries. Oddiy holatda faqat invalidateQueries yetarli. invalidateQueries ierarxik: ['users'] — barcha users query-larni invalidate qiladi.`,
      },
      {
        question: 'useInfiniteQuery qanday ishlaydi?',
        answer: `useInfiniteQuery — pagination va infinite scroll uchun. Oddiy useQuery-dan farqi: ma'lumot pages massivida saqlanadi (har bir sahifa alohida), getNextPageParam — keyingi sahifa parametrini aniqlaydi (null/undefined bo'lsa tugagan). fetchNextPage() — keyingi sahifani yuklaydi. hasNextPage — yana sahifa bormi. data.pages — barcha yuklangan sahifalar massivi. Har bir sahifa alohida keshlanadi. IntersectionObserver bilan "infinite scroll" yoki "Load more" button bilan ishlatiladi.`,
      },
      {
        question: 'Prefetching nima va qachon ishlatiladi?',
        answer: `Prefetching — foydalanuvchi so'ramasdan OLDIN ma'lumotni keshga yuklash. queryClient.prefetchQuery() bilan amalga oshiriladi. Masalan: hover qilganda link-ning ma'lumotini oldindan yuklash — foydalanuvchi bosganda ma'lumot ALLAQACHON keshda. Route o'zgarishida keyingi sahifa ma'lumotini prefetch qilish. staleTime bilan boshqariladi — agar ma'lumot fresh bo'lsa prefetch qilMAYDI. Bu "instant navigation" ta'sirini beradi — UX sezilarli yaxshilanadi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query asoslari' },
      { sectionId: 'react-core', topicId: 'use-optimistic', label: 'useOptimistic (React 19)' },
    ],
  }
