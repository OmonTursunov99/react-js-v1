import type { Topic } from '../../../types'

export const reduxMiddleware: Topic = {
    id: 'redux-middleware',
    title: 'Redux Middleware',
    importance: 3,
    status: 'to-learn',
    description: 'thunk, saga — async logika qanday ishlaydi',
    content: `Redux Middleware — action dispatch bo'lganda va reducer-ga yetib borguncha oradagi INTERCEPTOR. Async operatsiyalar, logging, error handling uchun ishlatiladi.

═══════════════════════════════════════
  MIDDLEWARE NIMA?
═══════════════════════════════════════

Oddiy Redux flow:
  dispatch(action) → reducer → new state

Middleware bilan:
  dispatch(action) → MIDDLEWARE → reducer → new state

Middleware action-ni:
  - O'tkazib yuborishi mumkin (next)
  - O'zgartirishi mumkin
  - To'xtatishi mumkin
  - Yangi action dispatch qilishi mumkin
  - Side effect bajarishi mumkin (API call, logging)

═══════════════════════════════════════
  MIDDLEWARE TUZILISHI
═══════════════════════════════════════

Redux middleware — "curried" funksiya (3 ta ichma-ich):

  const myMiddleware = (store) => (next) => (action) => {
    // action reducer-ga borISHIDAN OLDIN
    console.log('Action:', action.type)

    const result = next(action)  // keyingi middleware yoki reducer

    // action reducer-ga borgandan KEYIN
    console.log('New state:', store.getState())

    return result
  }

store — { getState, dispatch }
next — keyingi middleware yoki reducer
action — dispatch qilingan action

═══════════════════════════════════════
  REDUX THUNK
═══════════════════════════════════════

Thunk — eng oddiy async middleware (RTK-da o'rnatilgan).
Oddiy action = object: { type, payload }
Thunk action = FUNKSIYA: (dispatch, getState) => { ... }

  // Thunk middleware ichida:
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  return next(action)

Thunk orqali:
  ✅ API so'rovlar (fetch, axios)
  ✅ Conditional dispatch (getState tekshirib)
  ✅ Multiple dispatch (loading → success/error)

═══════════════════════════════════════
  createAsyncThunk (RTK)
═══════════════════════════════════════

RTK-ning rasmiy async pattern:

  const fetchUsers = createAsyncThunk(
    'users/fetch',               // action type prefix
    async (_, { rejectWithValue }) => {
      try {
        const res = await fetch('/api/users')
        return await res.json()  // fulfilled payload
      } catch (err) {
        return rejectWithValue(err.message)
      }
    }
  )

Avtomatik 3 ta action yaratadi:
  - users/fetch/pending    → loading holati
  - users/fetch/fulfilled  → muvaffaqiyat
  - users/fetch/rejected   → xato

extraReducers-da ishlov berish:

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }

═══════════════════════════════════════
  REDUX SAGA (QISQACHA)
═══════════════════════════════════════

Redux Saga — Generator funksiyalarga asoslangan middleware.
Thunk-dan kuchliroq, lekin murakkab.

  function* fetchUsersSaga() {
    try {
      yield put({ type: 'LOADING' })
      const users = yield call(api.getUsers)
      yield put({ type: 'SUCCESS', payload: users })
    } catch (err) {
      yield put({ type: 'ERROR', payload: err })
    }
  }

Saga afzalliklari:
  ✅ Murakkab async flow (debounce, throttle, race, parallel)
  ✅ Oson test qilish (generator step-by-step)
  ✅ Cancellation (takeLatest — oxirgi so'rovni olish)

Saga kamchiliklari:
  ❌ O'rganish qiyin (Generator syntax)
  ❌ Boilerplate ko'p
  ❌ Ko'p hollarda createAsyncThunk yetarli

═══════════════════════════════════════
  THUNK vs SAGA vs RTK QUERY
═══════════════════════════════════════

createAsyncThunk (Thunk):
  ✅ Oddiy async operatsiyalar
  ✅ RTK-da o'rnatilgan
  ✅ O'rganish oson
  ❌ Murakkab flow uchun yetarli emas

Redux Saga:
  ✅ Murakkab async flow
  ✅ Debounce, race, parallel
  ✅ Test qilish oson
  ❌ O'rganish qiyin, boilerplate ko'p

RTK Query:
  ✅ CRUD API uchun eng yaxshi
  ✅ Keshlash, refetch avtomatik
  ✅ Boilerplate minimal
  ❌ Faqat data fetching uchun (murakkab logika emas)`,
    codeExamples: [
      {
        title: 'createAsyncThunk — API so\'rov',
        language: 'ts',
        code: `import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  name: string
  email: string
}

interface UsersState {
  items: User[]
  loading: boolean
  error: string | null
}

// Async thunk
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Server xatosi')
      return await res.json()
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Xatolik')
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], loading: false, error: null } as UsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Noma\\'lum xato'
      })
  },
})

export default usersSlice.reducer`,
        description: 'createAsyncThunk avtomatik 3 ta action yaratadi: pending, fulfilled, rejected. extraReducers-da har bir holatga javob yoziladi. TypeScript generic-lar: <ReturnType, ArgType, ThunkConfig>.',
      },
      {
        title: 'Custom middleware — Logger',
        language: 'ts',
        code: `import type { Middleware } from '@reduxjs/toolkit'

// Logger middleware
const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  console.group(action.type)
  console.log('Oldingi state:', store.getState())
  console.log('Action:', action)

  const result = next(action)  // reducer-ga yuborish

  console.log('Yangi state:', store.getState())
  console.groupEnd()

  return result
}

// Error reporter middleware
const errorMiddleware: Middleware = () => (next) => (action) => {
  try {
    return next(action)
  } catch (err) {
    console.error('Redux error:', err)
    // Sentry.captureException(err)
    throw err
  }
}

// configureStore-ga qo'shish
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: { users: usersReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware, errorMiddleware),
})`,
        description: 'Custom middleware — (store) => (next) => (action) pattern. getDefaultMiddleware() mavjud middleware-larni (thunk, serializable check) saqlaydi, concat bilan yangi qo\'shiladi.',
      },
      {
        title: 'Thunk — conditional va chained dispatch',
        language: 'ts',
        code: `import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Conditional dispatch — getState bilan tekshirish
export const fetchUsersIfNeeded = createAsyncThunk<
  User[],
  void,
  { state: RootState; rejectValue: string }
>(
  'users/fetchIfNeeded',
  async (_, { getState, rejectWithValue }) => {
    // Allaqachon yuklangan bo'lsa — so'rov yuborMA
    const { users } = getState()
    if (users.items.length > 0) {
      // Thunk-ni bekor qilish
      return users.items
    }

    const res = await fetch('/api/users')
    if (!res.ok) return rejectWithValue('Xato')
    return res.json()
  },
  {
    // Agar allaqachon loading bo'lsa — qayta so'rov yuborMA
    condition: (_, { getState }) => {
      const { users } = getState() as RootState
      return !users.loading
    },
  }
)

// Chained thunk — ketma-ket operatsiyalar
export const createUserAndRefresh = createAsyncThunk(
  'users/createAndRefresh',
  async (userData: CreateUserDTO, { dispatch }) => {
    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    // User yaratilgandan keyin ro'yxatni yangilash
    dispatch(fetchUsers())
  }
)`,
        description: 'condition — thunk-ni bekor qilish uchun (loading davomida qayta so\'rov oldini olish). Chained thunk — dispatch bilan boshqa thunk chaqirish.',
      },
    ],
    interviewQA: [
      {
        question: 'Redux middleware nima va qanday ishlaydi?',
        answer: `Redux middleware — dispatch(action) va reducer orasidagi interceptor. Tuzilishi: (store) => (next) => (action) => { ... }. Middleware action-ni o'tkazishi, o'zgartirishi, to'xtatishi, yoki yangi action dispatch qilishi mumkin. Asosiy maqsad: side effectlar (API call, logging), async operatsiyalar. configureStore-da getDefaultMiddleware().concat(myMiddleware) bilan qo'shiladi. RTK default thunk middleware o'rnatadi.`,
      },
      {
        question: 'Redux Thunk nima? Qanday ishlaydi?',
        answer: `Thunk — funksiya dispatch qilish imkonini beruvchi middleware. Oddiy action = object {type, payload}. Thunk action = funksiya (dispatch, getState) => {...}. Thunk middleware action tipini tekshiradi: agar funksiya bo'lsa — chaqiradi va dispatch/getState beradi, agar object bo'lsa — next() bilan reducer-ga o'tkazadi. RTK-da createAsyncThunk bilan ishlatiladi — avtomatik pending/fulfilled/rejected action-lar yaratadi.`,
      },
      {
        question: 'createAsyncThunk qanday ishlaydi?',
        answer: `createAsyncThunk(typePrefix, payloadCreator, options) — async thunk yaratadi. typePrefix (masalan "users/fetch") asosida 3 ta action avtomatik yaratiladi: pending, fulfilled, rejected. payloadCreator — async funksiya, (arg, thunkAPI) oladi. thunkAPI ichida: dispatch, getState, rejectWithValue, signal (abort). extraReducers builder pattern bilan har bir holatga javob yoziladi. condition option bilan thunk-ni bekor qilish mumkin (masalan allaqachon loading bo'lsa).`,
      },
      {
        question: 'Thunk va Saga farqi nima? Qachon qaysi birini ishlatish kerak?',
        answer: `Thunk — oddiy async uchun (API call, conditional dispatch). Promise-based, o'rganish oson, RTK-da o'rnatilgan. Saga — murakkab async flow uchun (debounce, throttle, race condition, parallel tasks, cancellation). Generator-based, o'rganish qiyinroq, boilerplate ko'proq. Hozirgi tavsiya: 90% holatlar uchun createAsyncThunk yetarli. CRUD operatsiyalar uchun RTK Query eng yaxshi. Saga faqat murakkab business logika (real-time, WebSocket, complex workflows) uchun kerak.`,
      },
      {
        question: 'extraReducers va reducers farqi nima?',
        answer: `reducers — slice O'ZINING action-lari uchun. createSlice avtomatik action creator yaratadi. extraReducers — BOSHQA joyda yaratilgan action-larga javob berish uchun. Asosan createAsyncThunk action-lari uchun ishlatiladi (pending/fulfilled/rejected). Shuningdek, boshqa slice-ning action-lariga ham javob berish mumkin. builder pattern bilan yoziladi: builder.addCase(action, reducer). extraReducers-da action creator YARATILMAYDI — faqat mavjud action-larga reaksiya.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'state-management', topicId: 'redux-toolkit', label: 'Redux Toolkit' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'rtk-query', label: 'RTK Query (thunk o\'rniga)' },
    ],
  }
