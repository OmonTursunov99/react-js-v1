import type { Topic } from '../../types'

export const rtkQuery: Topic = {
    id: 'rtk-query',
    title: 'RTK Query',
    importance: 2,
    status: 'to-learn',
    description: 'Redux Toolkit ichidagi data fetching',
    content: `RTK Query — Redux Toolkit ichiga o'rnatilgan data fetching va keshlash yechimi. TanStack Query-ga alternativa, lekin Redux ekosistemi ichida ishlaydi.

═══════════════════════════════════════
  NIMA UCHUN RTK QUERY?
═══════════════════════════════════════

createAsyncThunk bilan API chaqirish muammolari:
  ❌ Har bir endpoint uchun slice, thunk, loading/error state yozish kerak
  ❌ Keshlash yo'q — har safar yangi so'rov
  ❌ Loading/error state qo'lda boshqarish
  ❌ Juda ko'p boilerplate

RTK Query bularni hal qiladi:
  ✅ Bitta createApi bilan BARCHA endpoint-larni aniqlash
  ✅ Avtomatik keshlash va invalidation
  ✅ Loading/error/success holatlari tayyor
  ✅ Auto-generated React hooklar
  ✅ Cache tag tizimi bilan aqlli refetch
  ✅ Optimistic updates

═══════════════════════════════════════
  ASOSIY TUSHUNCHALAR
═══════════════════════════════════════

1. createApi — API konfiguratsiyasi
2. baseQuery — barcha so'rovlar uchun umumiy sozlama
3. endpoints — query (GET) va mutation (POST/PUT/DELETE)
4. Tags — kesh invalidation uchun
5. Auto-generated hooks — useGetUsersQuery, useAddUserMutation

═══════════════════════════════════════
  createApi
═══════════════════════════════════════

  const api = createApi({
    reducerPath: 'api',                    // store-dagi kalit
    baseQuery: fetchBaseQuery({
      baseUrl: '/api',                     // barcha so'rovlar uchun prefix
    }),
    tagTypes: ['Users', 'Posts'],           // kesh tag-lari
    endpoints: (builder) => ({
      getUsers: builder.query({            // GET so'rov
        query: () => '/users',
        providesTags: ['Users'],
      }),
      addUser: builder.mutation({          // POST so'rov
        query: (newUser) => ({
          url: '/users',
          method: 'POST',
          body: newUser,
        }),
        invalidatesTags: ['Users'],        // Users keshini yangilaydi
      }),
    }),
  })

  // Avtomatik hook-lar eksport
  export const { useGetUsersQuery, useAddUserMutation } = api

═══════════════════════════════════════
  CACHE TAGS TIZIMI
═══════════════════════════════════════

Tags — keshni aqlli invalidate qilish mexanizmi:

  providesTags: ['Users']
    — bu query 'Users' tag-ini beradi

  invalidatesTags: ['Users']
    — bu mutation 'Users' tag-li barcha keshlarni invalidate qiladi
    — invalidate qilingan query-lar avtomatik REFETCH bo'ladi

Tag-lar aniqroq bo'lishi mumkin:
  providesTags: (result) =>
    result
      ? [...result.map(({ id }) => ({ type: 'Users', id })), 'Users']
      : ['Users']

  // Bitta user o'zgarsa — faqat shu user refetch bo'ladi
  invalidatesTags: (result, error, id) => [{ type: 'Users', id }]

═══════════════════════════════════════
  RTK QUERY vs TANSTACK QUERY
═══════════════════════════════════════

RTK Query afzalliklari:
  ✅ Redux ekosistemi ichida (DevTools, middleware)
  ✅ Redux store bilan integratsiya (state-ga kirish)
  ✅ Code generation (OpenAPI dan avtomatik API yaratish)

TanStack Query afzalliklari:
  ✅ Redux-ga bog'liq emas (mustaqil)
  ✅ Kuchliroq kesh boshqaruvi
  ✅ Infinite queries, paginated queries
  ✅ Kichikroq bundle
  ✅ Katta ekotizim va jamoat

Qoida: agar loyihada Redux bor — RTK Query.
Agar Redux yo'q yoki kerak emas — TanStack Query.`,
    codeExamples: [
      {
        title: 'createApi — to\'liq CRUD',
        language: 'ts',
        code: `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface User {
  id: string
  name: string
  email: string
}

type CreateUserDTO = Omit<User, 'id'>

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // GET /api/users
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Users' as const, id })), 'Users']
          : ['Users'],
    }),

    // GET /api/users/:id
    getUserById: builder.query<User, string>({
      query: (id) => \`/users/\${id}\`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    // POST /api/users
    addUser: builder.mutation<User, CreateUserDTO>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],  // ro'yxatni yangilash
    }),

    // PUT /api/users/:id
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...body }) => ({
        url: \`/users/\${id}\`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    // DELETE /api/users/:id
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: \`/users/\${id}\`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi`,
        description: 'To\'liq CRUD API — query (GET) va mutation (POST/PUT/DELETE). providesTags/invalidatesTags orqali aqlli kesh invalidation. Hook-lar avtomatik yaratiladi.',
      },
      {
        title: 'Store-ga ulash va komponentda ishlatish',
        language: 'tsx',
        code: `// store.ts
import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from './usersApi'

const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,  // API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),  // kesh, polling uchun
})

// UserList.tsx
import { useGetUsersQuery, useDeleteUserMutation } from './usersApi'

function UserList() {
  const { data: users, isLoading, error } = useGetUsersQuery()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  if (isLoading) return <p>Yuklanmoqda...</p>
  if (error) return <p>Xatolik!</p>

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>
          {user.name}
          <button
            onClick={() => deleteUser(user.id)}
            disabled={isDeleting}
          >
            O'chirish
          </button>
        </li>
      ))}
    </ul>
  )
}

// AddUser.tsx
import { useAddUserMutation } from './usersApi'

function AddUser() {
  const [addUser, { isLoading }] = useAddUserMutation()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await addUser({
      name: form.get('name') as string,
      email: form.get('email') as string,
    })
    // Kesh avtomatik yangilanadi (invalidatesTags)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Ism" required />
      <input name="email" placeholder="Email" required />
      <button disabled={isLoading}>Qo'shish</button>
    </form>
  )
}`,
        description: 'API reducer va middleware store-ga qo\'shiladi. Query hook — data/isLoading/error qaytaradi. Mutation hook — [triggerFn, result] qaytaradi. invalidatesTags orqali kesh avtomatik yangilanadi.',
      },
      {
        title: 'baseQuery — auth token va error handling',
        language: 'ts',
        code: `import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'

// Auth token bilan baseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('Authorization', \`Bearer \${token}\`)
    }
    return headers
  },
})

// Token eskirsa qayta login qilish (re-auth)
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Token yangilash
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult.data) {
      api.dispatch(setToken(refreshResult.data as string))
      // Asl so'rovni qayta yuborish
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // ...
  }),
})`,
        description: 'prepareHeaders — har so\'rovga auth token qo\'shish. baseQueryWithReauth — 401 xatoda avtomatik token yangilash va so\'rovni qayta yuborish pattern.',
      },
    ],
    interviewQA: [
      {
        question: 'RTK Query nima va createAsyncThunk-dan nima farqi?',
        answer: `RTK Query — RTK ichiga o'rnatilgan data fetching va keshlash yechimi. createAsyncThunk bilan har endpoint uchun slice, thunk, loading/error state qo'lda yozish kerak. RTK Query-da bitta createApi bilan barcha endpoint-larni aniqlaysiz — avtomatik keshlash, loading/error holatlari, React hooklar, kesh invalidation. RTK Query "deklarativ" — nima olish kerakligini yozasiz, qanday boshqarishni kutubxona o'zi hal qiladi.`,
      },
      {
        question: 'RTK Query-da cache tags qanday ishlaydi?',
        answer: `Tags — keshni aqlli invalidate qilish mexanizmi. Query endpoint-larga providesTags beriladi — bu query qaysi tag-larni "beradi". Mutation endpoint-larga invalidatesTags beriladi — qaysi tag-larni invalidate qiladi. Mutation bajarilganda — invalidate qilingan tag-li barcha query-lar avtomatik REFETCH bo'ladi. Tag-lar umumiy ('Users') yoki aniq ({type: 'Users', id: '123'}) bo'lishi mumkin — aniq tag faqat bitta entity-ni refetch qiladi.`,
      },
      {
        question: 'RTK Query va TanStack Query farqi nima?',
        answer: `RTK Query — Redux ekosistemi ichida ishlaydi, DevTools bilan integratsiya, store state-ga kirish mumkin, OpenAPI code generation. TanStack Query — mustaqil, Redux-ga bog'liq emas, kuchliroq kesh boshqaruvi (staleTime, gcTime), infinite/paginated queries yaxshiroq, kichikroq bundle, kattaroq ekotizim. Qoida: loyihada Redux bor — RTK Query. Redux yo'q — TanStack Query. Ikkalasini birgalikda ishlatish ham mumkin (Redux client state uchun, TanStack Query server state uchun).`,
      },
      {
        question: 'RTK Query-da query va mutation farqi nima?',
        answer: `Query — GET so'rovlar, ma'lumot OLISH uchun. Avtomatik keshlanadi, component mount-da avtomatik chaqiriladi, stale bo'lganda refetch qiladi. Hook: useGetUsersQuery() — darhol so'rov yuboradi, data/isLoading/error qaytaradi. Mutation — POST/PUT/DELETE so'rovlar, ma'lumot O'ZGARTIRISH uchun. Keshlanmaydi, qo'lda chaqiriladi, invalidatesTags bilan keshni yangilaydi. Hook: useAddUserMutation() — [triggerFn, result] qaytaradi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux Toolkit' },
      { sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query (alternativa)' },
    ],
  }
