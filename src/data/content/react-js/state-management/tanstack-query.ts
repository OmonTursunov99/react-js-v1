import type { Topic } from '../../../types'

export const tanstackQuery: Topic = {
    id: 'tanstack-query',
    title: 'TanStack Query',
    importance: 3,
    status: 'to-learn',
    description: 'useQuery — server state boshqaruvi',
    content: `TanStack Query (eski nomi React Query) — server state boshqarish uchun eng yaxshi kutubxona. "Server state" va "client state" farqini tushunish — zamonaviy React ilovalar uchun KALIT tushuncha.

═══════════════════════════════════════
  SERVER STATE vs CLIENT STATE
═══════════════════════════════════════

Client state:
  - Foydalanuvchi interfeysi holati (modal ochiq/yopiq, tema, form input)
  - Faqat frontend-da yashaydi
  - Sinxronlash kerak emas
  - Boshqarish: useState, useReducer, Zustand, Redux

Server state:
  - Backend/API dan kelgan ma'lumotlar
  - Asl manbasi (source of truth) serverda
  - Keshlanishi kerak (har safar so'rov qilmaslik uchun)
  - Eskirishi mumkin (stale)
  - Boshqa foydalanuvchilar o'zgartirishi mumkin
  - Boshqarish: TanStack Query, RTK Query, SWR

═══════════════════════════════════════
  NIMA UCHUN TANSTACK QUERY?
═══════════════════════════════════════

useEffect + useState bilan API chaqirish muammolari:
  ❌ Loading/error state qo'lda boshqarish
  ❌ Keshlash yo'q — har safar yangi so'rov
  ❌ Race condition (eski so'rov kechroq kelsa)
  ❌ Refetch logikasi yo'q
  ❌ Pagination/infinite scroll murakkab
  ❌ Optimistic update murakkab

TanStack Query bularni hal qiladi:
  ✅ Avtomatik keshlash (staleTime, gcTime)
  ✅ Loading/error/success holatlari tayyor
  ✅ Background refetch (oyna fokusda, interval)
  ✅ Race condition yo'q
  ✅ Retry (xato bo'lsa qayta urinish)
  ✅ Deduplication (bir xil so'rovni birlashtirib yuborish)
  ✅ Pagination, infinite scroll tayyor
  ✅ Optimistic updates
  ✅ DevTools

═══════════════════════════════════════
  ASOSIY TUSHUNCHALAR
═══════════════════════════════════════

1. QueryClient — barcha kesh va sozlamalar markazi
2. QueryClientProvider — React tree-ga QueryClient beradi
3. Query Key — kesh kaliti, array bo'lishi kerak ['users', userId]
4. Query Function — ma'lumot olish funksiyasi (fetch/axios)
5. staleTime — ma'lumot qancha vaqt "yangi" hisoblanadi
6. gcTime — keshdan qachon o'chiriladi (garbage collection)

═══════════════════════════════════════
  useQuery
═══════════════════════════════════════

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users'],        // kesh kaliti
    queryFn: () => fetchUsers(), // ma'lumot olish
    staleTime: 5 * 60 * 1000,   // 5 daqiqa yangi hisoblanadi
  })

Qaytaradigan qiymatlar:
  - data — muvaffaqiyatli natija
  - isLoading — birinchi marta yuklanmoqda (kesh yo'q)
  - isFetching — background-da yangilanmoqda (kesh bor)
  - isError — xato bo'ldi
  - error — xato ob'ekti
  - refetch — qo'lda qayta so'rov

═══════════════════════════════════════
  QUERY KEY (KALIT TUSHUNCHA)
═══════════════════════════════════════

Query key = kesh kaliti. Array bo'lishi kerak:

  ['users']                    // barcha foydalanuvchilar
  ['users', userId]            // bitta foydalanuvchi
  ['users', { role: 'admin' }] // filtrlangan
  ['users', userId, 'posts']   // foydalanuvchi postlari

Qoidalar:
  - Key o'zgarsa → yangi so'rov yuboriladi
  - Bir xil key → keshdan olinadi
  - Key ierarxik — ['users'] invalidate qilsa, ['users', 1] ham invalidate bo'ladi

═══════════════════════════════════════
  KESH MEXANIZMI
═══════════════════════════════════════

  staleTime: 0 (default)
    Ma'lumot darhol "stale" (eskirgan) bo'ladi
    Har safar component mount bo'lganda refetch qiladi

  staleTime: 5 * 60 * 1000
    5 daqiqa ichida ma'lumot "fresh" — refetch qilMAYDI
    5 daqiqadan keyin — stale, refetch qiladi

  gcTime: 5 * 60 * 1000 (default)
    Komponent unmount bo'lgandan keyin kesh 5 daqiqa saqlanadi
    Qayta mount bo'lsa — keshdan oladi (instant) + background refetch

Stale ma'lumot AVTOMATIK refetch bo'ladi:
  - Komponent mount bo'lganda
  - Oyna fokusga qaytganda (refetchOnWindowFocus)
  - Internet qayta ulanganda (refetchOnReconnect)
  - Belgilangan intervalda (refetchInterval)`,
    codeExamples: [
      {
        title: 'QueryClient sozlash + useQuery',
        language: 'tsx',
        code: `import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

// QueryClient — barcha sozlamalar va kesh markazi
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 daqiqa fresh
      gcTime: 10 * 60 * 1000,     // 10 daqiqa keshda
      retry: 2,                    // xatoda 2 marta qayta urinish
      refetchOnWindowFocus: true,  // fokusda refetch
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  )
}

// API funksiya
async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Xatolik yuz berdi')
  return res.json()
}

// Komponent
function UserList() {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <p>Yuklanmoqda...</p>
  if (isError) return <p>Xato: {error.message}</p>

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}`,
        description: 'QueryClientProvider — React tree-ga keshni beradi. useQuery — deklarativ data fetching: key + funksiya berish yetarli. Loading, error holatlari avtomatik.',
      },
      {
        title: 'Query Key — dinamik parametrlar',
        language: 'tsx',
        code: `import { useQuery } from '@tanstack/react-query'

// Bitta foydalanuvchi
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ['users', userId],  // userId o'zgarsa → yangi so'rov
    queryFn: () => fetchUser(userId),
    enabled: !!userId,  // userId bo'sh bo'lsa so'rov yuborMA
  })

  if (isLoading) return <p>Yuklanmoqda...</p>
  return <h1>{user?.name}</h1>
}

// Filtrlangan ro'yxat
function FilteredUsers() {
  const [role, setRole] = useState<string>('all')
  const [page, setPage] = useState(1)

  const { data } = useQuery({
    queryKey: ['users', { role, page }],  // filter o'zgarsa → yangi so'rov
    queryFn: () => fetchUsers({ role, page }),
  })

  return (
    <div>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="all">Hammasi</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      {data?.users.map(u => <p key={u.id}>{u.name}</p>)}
      <button onClick={() => setPage(p => p + 1)}>Keyingi</button>
    </div>
  )
}`,
        description: 'Query key array-dagi har qanday element o\'zgarsa yangi so\'rov yuboriladi. enabled — shart bajarilmaguncha so\'rov yubormaslik (conditional fetching).',
      },
      {
        title: 'Dependent queries — ketma-ket so\'rovlar',
        language: 'tsx',
        code: `import { useQuery } from '@tanstack/react-query'

function UserPosts({ userId }: { userId: string }) {
  // 1-so'rov: foydalanuvchini olish
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })

  // 2-so'rov: foydalanuvchi postlarini olish
  // user yuklangunga qadar KUTADI (enabled)
  const { data: posts, isLoading } = useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetchPostsByUser(user!.id),
    enabled: !!user,  // user bo'lmaguncha so'rov YUBORMA
  })

  if (isLoading) return <p>Yuklanmoqda...</p>

  return (
    <div>
      <h1>{user?.name} postlari</h1>
      {posts?.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  )
}`,
        description: 'enabled bilan ketma-ket so\'rovlar — birinchi so\'rov tugaguncha ikkinchisi kutadi. Waterfall pattern — kerak bo\'lganda ishlatiladi.',
      },
    ],
    interviewQA: [
      {
        question: 'TanStack Query nima va nima muammoni hal qiladi?',
        answer: `TanStack Query — server state management kutubxonasi. Asosiy muammo: useEffect + useState bilan API chaqirishda keshlash yo'q, loading/error qo'lda boshqariladi, race condition bo'lishi mumkin, refetch logikasi yo'q. TanStack Query bularni hal qiladi: avtomatik keshlash (staleTime/gcTime), deklarativ loading/error holatlari, background refetch, retry, deduplication (bir xil so'rovni birlashtirib yuborish), pagination/infinite scroll, optimistic updates.`,
      },
      {
        question: 'Server state va client state farqi nima?',
        answer: `Client state — faqat frontendda yashaydi (modal holati, tema, form input). Source of truth clientda. Sinxronlash kerak emas. Boshqarish: useState, Zustand, Redux. Server state — backend/API dan kelgan ma'lumotlar. Source of truth serverda. Eskirishi mumkin (stale), boshqa foydalanuvchilar o'zgartirishi mumkin, keshlanishi kerak. Boshqarish: TanStack Query, RTK Query. Bu farqni tushunish — zamonaviy arxitektura uchun kalit. Ko'p ilovalar Redux-ga hamma narsani qo'yadi, aslida server state alohida boshqarilishi kerak.`,
      },
      {
        question: 'staleTime va gcTime farqi nima?',
        answer: `staleTime — ma'lumot qancha vaqt "yangi" (fresh) hisoblanadi. Default: 0 (darhol stale). Fresh ma'lumot refetch qilinMAYDI, stale ma'lumot trigger bo'lganda (mount, focus, reconnect) avtomatik refetch bo'ladi. gcTime (garbage collection time) — komponent unmount bo'lgandan keyin kesh qancha vaqt saqlanadi. Default: 5 daqiqa. Misol: staleTime=5min, gcTime=10min — ma'lumot 5 daqiqa fresh, unmount-dan keyin 10 daqiqa keshda qoladi. Qayta mount-da keshdan oladi (instant) + background refetch.`,
      },
      {
        question: 'Query key nima uchun muhim?',
        answer: `Query key — TanStack Query-ning kesh tizimining asosi. Har bir unique key uchun alohida kesh yozuvi bo'ladi. Key array bo'lishi kerak: ['users'], ['users', userId], ['users', {role: 'admin'}]. Key o'zgarsa — yangi so'rov yuboriladi. Bir xil key — keshdan olinadi. Key ierarxik: queryClient.invalidateQueries({queryKey: ['users']}) barcha ['users', ...] kalitlarni invalidate qiladi. Dependency array kabi ishlaydi — queryFn ichida ishlatilgan barcha parametrlar key-ga qo'shilishi kerak.`,
      },
      {
        question: 'isLoading va isFetching farqi nima?',
        answer: `isLoading — birinchi marta yuklanmoqda, keshda ma'lumot YO'Q. Foydalanuvchi loading spinner ko'radi. isFetching — background-da yangilanmoqda, lekin keshda ESKi ma'lumot BOR. Foydalanuvchi eski ma'lumotni ko'radi + background-da yangilanadi. Misol: sahifa birinchi ochilganda isLoading=true, isFetching=true. Qayta ochilganda (kesh bor) isLoading=false, isFetching=true — foydalanuvchi darhol eski ma'lumotni ko'radi, background-da yangilanadi. Bu UX uchun juda muhim — instant navigation.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'state-management', topicId: 'tanstack-query-deep', label: 'TanStack Query (chuqur)' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'when-to-use-what', label: 'Server vs Client state' },
    ],
  }
