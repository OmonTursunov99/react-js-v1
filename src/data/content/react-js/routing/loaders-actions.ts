import type { Topic } from '../../../types'

export const loadersActions: Topic = {
    id: 'loaders-actions',
    title: 'Loaders / Actions',
    importance: 2,
    status: 'to-learn',
    description: 'React Router v6.4+ data loading pattern',
    content: `Loaders va Actions — React Router v6.4+ (va v7) ning data layer-i. Sahifa RENDERLANMASDAN OLDIN ma'lumotni yuklash imkonini beradi.

═══════════════════════════════════════
  LOADER NIMA?
═══════════════════════════════════════

Loader — route-ga kirilganda AVTOMATIK chaqiriladigan funksiya.
Komponent renderlanmasdan OLDIN ma'lumot yuklanadi.

  {
    path: 'users/:id',
    loader: async ({ params }) => {
      const res = await fetch('/api/users/' + params.id)
      return res.json()
    },
    element: <UserPage />,
  }

Komponentda useLoaderData bilan olish:
  function UserPage() {
    const user = useLoaderData()
    return <h1>{user.name}</h1>  // ma'lumot TAYYOR
  }

Afzalliklari:
  ✅ Komponent renderlanmasdan oldin data tayyor
  ✅ Loading holati route darajasida boshqariladi
  ✅ Parallel data fetching (bir nechta route loader bir vaqtda)
  ✅ Komponent ichida useEffect/useState kerak emas

═══════════════════════════════════════
  ACTION NIMA?
═══════════════════════════════════════

Action — form submit bo'lganda chaqiriladigan funksiya.
Mutation (POST/PUT/DELETE) uchun.

  {
    path: 'users/new',
    action: async ({ request }) => {
      const formData = await request.formData()
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
        }),
      })
      return redirect('/users')  // muvaffaqiyatli → redirect
    },
    element: <NewUserPage />,
  }

Komponentda <Form> (katta F) ishlatish:
  function NewUserPage() {
    return (
      <Form method="post">
        <input name="name" />
        <input name="email" />
        <button type="submit">Yaratish</button>
      </Form>
    )
  }

Form submit → action chaqiriladi → loader qayta ishlaydi (revalidation).

═══════════════════════════════════════
  LOADER vs useEffect + useState
═══════════════════════════════════════

Oddiy usul (useEffect):
  1. Komponent renderlanadi (bo'sh)
  2. useEffect ishlaydi → fetch boshlanadi
  3. Loading spinner ko'rsatiladi
  4. Data keladi → qayta render
  Muammo: render → fetch → render → fetch (waterfall)

Loader:
  1. Route-ga kirilganda loader ishlaydi
  2. Data tayyor bo'lganda komponent renderlanadi (data bilan)
  Afzallik: fetch → render (bitta qadam)

Nested route-larda farq katta:
  useEffect: Parent render → parent fetch → child render → child fetch (4 qadam)
  Loader: parent fetch + child fetch PARALLEL → render (2 qadam)

═══════════════════════════════════════
  REVALIDATION
═══════════════════════════════════════

Action bajargandan keyin React Router avtomatik
barcha aktiv route loader-larni qayta chaqiradi.

Form submit → action → revalidation (loader qayta ishlaydi) → UI yangilanadi

Bu TanStack Query-ning invalidateQueries-ga o'xshash — lekin avtomatik.

═══════════════════════════════════════
  LOADER vs TANSTACK QUERY
═══════════════════════════════════════

Loader afzalliklari:
  ✅ Route-ga o'rnatilgan — alohida kutubxona kerak emas
  ✅ Parallel loading (nested routes)
  ✅ Server-side rendering bilan yaxshi integratsiya
  ✅ Form + action + revalidation = to'liq cycle

TanStack Query afzalliklari:
  ✅ Kuchliroq kesh (staleTime, gcTime)
  ✅ Background refetch, retry
  ✅ Optimistic updates
  ✅ DevTools
  ✅ Route-dan tashqarida ham ishlatish mumkin

Amalda ko'p loyihalar IKKALASINI birlashtiradi:
  Loader ichida TanStack Query-ni prefetch qilish.`,
    codeExamples: [
      {
        title: 'Loader — ma\'lumotni oldindan yuklash',
        language: 'tsx',
        code: `import {
  createBrowserRouter,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router'

interface User {
  id: string
  name: string
  email: string
}

// Loader — route-ga kirilganda avtomatik chaqiriladi
async function userLoader({ params }: LoaderFunctionArgs): Promise<User> {
  const res = await fetch(\`/api/users/\${params.userId}\`)
  if (!res.ok) throw new Response('Foydalanuvchi topilmadi', { status: 404 })
  return res.json()
}

async function usersLoader(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Response('Xatolik', { status: 500 })
  return res.json()
}

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'users',
        loader: usersLoader,
        element: <UsersPage />,
      },
      {
        path: 'users/:userId',
        loader: userLoader,
        element: <UserDetailPage />,
      },
    ],
  },
])

// Komponent — data TAYYOR keladi
function UsersPage() {
  const users = useLoaderData() as User[]

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <Link to={user.id}>{user.name}</Link>
        </li>
      ))}
    </ul>
  )
}

function UserDetailPage() {
  const user = useLoaderData() as User
  return <h1>{user.name} — {user.email}</h1>
}`,
        description: 'Loader — komponent renderlanmasdan OLDIN data yuklanadi. throw Response — errorElement ko\'rsatiladi. useLoaderData — tayyor data olish (loading state kerak emas).',
      },
      {
        title: 'Action + Form — mutation',
        language: 'tsx',
        code: `import {
  Form,
  redirect,
  useActionData,
  useNavigation,
  type ActionFunctionArgs,
} from 'react-router'

interface ActionError {
  message: string
  fields?: Record<string, string>
}

// Action — form submit bo'lganda chaqiriladi
async function createUserAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // Validatsiya
  if (!name || !email) {
    return { message: 'Barcha maydonlarni to\\'ldiring' } satisfies ActionError
  }

  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })

  if (!res.ok) {
    return { message: 'Server xatosi' } satisfies ActionError
  }

  // Muvaffaqiyat → redirect (loader qayta ishlaydi)
  return redirect('/users')
}

// Router
{
  path: 'users/new',
  action: createUserAction,
  element: <NewUserPage />,
}

// Komponent
function NewUserPage() {
  const error = useActionData() as ActionError | undefined
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <Form method="post">
      {error?.message && (
        <p className="text-red-500">{error.message}</p>
      )}
      <input name="name" placeholder="Ism" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saqlanmoqda...' : 'Yaratish'}
      </button>
    </Form>
  )
}`,
        description: 'Form (katta F) submit → action chaqiriladi. useActionData — action qaytargan xato. useNavigation — submitting holati. redirect — muvaffaqiyatli action keyin loader qayta ishlaydi.',
      },
      {
        title: 'Loader + TanStack Query birlashtirib ishlatish',
        language: 'tsx',
        code: `import { useLoaderData } from 'react-router'
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'

// Query konfiguratsiyasi
function usersQuery() {
  return {
    queryKey: ['users'] as const,
    queryFn: async (): Promise<User[]> => {
      const res = await fetch('/api/users')
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  }
}

// Loader — TanStack Query keshini prefetch qiladi
function usersLoader(queryClient: QueryClient) {
  return async () => {
    const query = usersQuery()
    // Keshda bo'lsa — so'rov yuborMA, keshdan oladi
    return queryClient.ensureQueryData(query)
  }
}

// Router yaratish
function createRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: 'users',
      loader: usersLoader(queryClient),
      element: <UsersPage />,
    },
  ])
}

// Komponent — TanStack Query hook ishlatadi (kesh tayyor)
function UsersPage() {
  const initialData = useLoaderData() as User[]

  const { data: users } = useQuery({
    ...usersQuery(),
    initialData,  // loader-dan kelgan data
  })

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}`,
        description: 'Eng yaxshi kombinatsiya: loader keshni prefetch qiladi (ensureQueryData), komponent useQuery bilan ishlatadi. Loader instant navigation beradi, TanStack Query kesh + refetch beradi.',
      },
    ],
    interviewQA: [
      {
        question: 'React Router loader nima va qanday ishlaydi?',
        answer: `Loader — route-ga kirilganda komponent renderlanmasdan OLDIN chaqiriladigan async funksiya. Ma'lumotni oldindan yuklaydi. Komponentda useLoaderData() bilan tayyor data olinadi — loading state kerak emas. Loader {params, request} argumentlari oladi. Xato bo'lsa throw new Response() — errorElement ko'rsatiladi. Nested route-larda barcha loader-lar PARALLEL ishlaydi — waterfall muammosi yo'q.`,
      },
      {
        question: 'Loader va useEffect bilan data fetching farqi nima?',
        answer: `useEffect: komponent render → mount → fetch → loading → data → qayta render. Nested route-da: parent render → parent fetch → child render → child fetch (waterfall). Loader: route-ga kirilganda fetch → data tayyor → komponent render. Nested route-da: parent loader + child loader PARALLEL → render. Loader afzalligi: kamroq render, parallel loading, loading holati route darajasida. useEffect afzalligi: kuchliroq kesh boshqaruvi (TanStack Query bilan).`,
      },
      {
        question: 'React Router action nima?',
        answer: `Action — Form submit (POST/PUT/DELETE) bo'lganda chaqiriladigan funksiya. <Form method="post"> bilan ishlatiladi (katta F — React Router-ning Form-i). Action bajarilgandan keyin barcha aktiv route loader-lari avtomatik qayta ishlaydi (revalidation) — UI yangilanadi. Validatsiya xatosini return qilsa — useActionData() bilan komponentda ko'rsatiladi. Muvaffaqiyatli bo'lsa — redirect() bilan boshqa sahifaga yo'naltirish.`,
      },
      {
        question: 'Loader va TanStack Query-ni birgalikda ishlatish mumkinmi?',
        answer: `Ha, bu eng yaxshi kombinatsiya. Loader ichida queryClient.ensureQueryData() — keshda bo'lsa so'rov yuborMAYDI, yo'q bo'lsa yuklaydi. Komponentda useQuery({initialData}) bilan ishlaydi — loader-dan kelgan datani boshlang'ich qiymat sifatida. Natija: loader instant navigation beradi (data render-dan oldin tayyor), TanStack Query kesh + background refetch + retry beradi. Har biri o'z kuchli tomonini qo'shadi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query (alternativa)' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'server-components', label: 'Server Components' },
    ],
  }
