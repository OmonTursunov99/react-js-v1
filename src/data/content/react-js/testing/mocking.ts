import type { Topic } from '../../../types'

export const mocking: Topic = {
    id: 'mocking',
    title: 'Mock',
    importance: 2,
    status: 'to-learn',
    description: 'API mock, module mock, hook mock, vi.fn()',
    content: `Mocking — test qilish uchun haqiqiy dependency-larni SOXTA (mock) versiyalar bilan almashtirish. API, timer, modul, funksiya — barchasini mock qilish mumkin.

═══════════════════════════════════════
  NIMA UCHUN MOCK KERAK
═══════════════════════════════════════

Testda HAQIQIY API chaqirmaslik kerak:
  ❌ Sekin (network so'rov)
  ❌ Ishonchsiz (server ishlamasa test sinadi)
  ❌ Side effect (haqiqiy data o'zgarishi)
  ❌ Izolyatsiya yo'q (boshqa servisga bog'liq)

Mock bilan:
  ✅ Tez (network yo'q)
  ✅ Ishonchli (doim bir xil natija)
  ✅ Izolyatsiyalangan
  ✅ Edge case-larni simulyatsiya qilish oson

═══════════════════════════════════════
  vi.fn() — MOCK FUNKSIYA
═══════════════════════════════════════

  const mockFn = vi.fn()

  mockFn('hello')  // chaqirish

  // Tekshirish
  expect(mockFn).toHaveBeenCalled()
  expect(mockFn).toHaveBeenCalledTimes(1)
  expect(mockFn).toHaveBeenCalledWith('hello')

  // Qaytarish qiymatini belgilash
  mockFn.mockReturnValue(42)
  mockFn.mockResolvedValue({ data: 'test' })  // async

  // Reset
  mockFn.mockClear()   // chaqirish tarixini tozalash
  mockFn.mockReset()   // clear + implementation tozalash
  mockFn.mockRestore()  // original funksiyani qaytarish

═══════════════════════════════════════
  vi.mock() — MODUL MOCK
═══════════════════════════════════════

Butun modulni mock qilish:

  vi.mock('./api', () => ({
    fetchUsers: vi.fn().mockResolvedValue([{ id: '1', name: 'Ali' }]),
    createUser: vi.fn().mockResolvedValue({ id: '2', name: 'Vali' }),
  }))

Qisman mock (ba'zi export-larni saqlash):

  vi.mock('./utils', async () => {
    const actual = await vi.importActual('./utils')
    return {
      ...actual,
      generateId: vi.fn().mockReturnValue('test-id'),  // faqat shu mock
    }
  })

═══════════════════════════════════════
  MSW — API MOCK (ENG YAXSHI USUL)
═══════════════════════════════════════

MSW (Mock Service Worker) — network darajasida mock:

  import { http, HttpResponse } from 'msw'
  import { setupServer } from 'msw/node'

  const server = setupServer(
    http.get('/api/users', () => {
      return HttpResponse.json([
        { id: '1', name: 'Ali' },
      ])
    }),
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

Afzalliklari:
  ✅ fetch/axios/boshqa — farqi yo'q (network darajasi)
  ✅ Haqiqiy so'rov kabi ishlaydi
  ✅ Handler-larni test ichida override mumkin

═══════════════════════════════════════
  MOCK BEST PRACTICES
═══════════════════════════════════════

1. Minimal mock — faqat kerakli narsani mock qiling
2. afterEach da tozalang — mockRestore/resetHandlers
3. MSW afzal — vi.mock(fetch) emas
4. Mock qaytarish qiymati REALISTIK bo'lsin
5. Ko'p mock kerak bo'lsa — arxitektura muammo`,
    codeExamples: [
      {
        title: 'vi.fn() va module mock',
        language: 'tsx',
        code: `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// API module mock
vi.mock('./api', () => ({
  createTodo: vi.fn(),
}))

import { createTodo } from './api'

// Komponent
function AddTodo({ onAdded }: { onAdded: () => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createTodo(text)
      setText('')
      onAdded()
    } catch {
      setError('Xatolik yuz berdi')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p role="alert">{error}</p>}
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Vazifa..." />
      <button type="submit">Qo'shish</button>
    </form>
  )
}

describe('AddTodo', () => {
  const mockOnAdded = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call createTodo and onAdded on success', async () => {
    vi.mocked(createTodo).mockResolvedValueOnce({ id: '1', text: 'Test' })

    render(<AddTodo onAdded={mockOnAdded} />)

    await userEvent.type(screen.getByPlaceholderText('Vazifa...'), 'Yangi vazifa')
    await userEvent.click(screen.getByRole('button', { name: 'Qo\\'shish' }))

    expect(createTodo).toHaveBeenCalledWith('Yangi vazifa')
    expect(mockOnAdded).toHaveBeenCalledOnce()
    expect(screen.getByPlaceholderText('Vazifa...')).toHaveValue('')
  })

  it('should show error on failure', async () => {
    vi.mocked(createTodo).mockRejectedValueOnce(new Error('Server xatosi'))

    render(<AddTodo onAdded={mockOnAdded} />)

    await userEvent.type(screen.getByPlaceholderText('Vazifa...'), 'Test')
    await userEvent.click(screen.getByRole('button', { name: 'Qo\\'shish' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Xatolik yuz berdi')
    expect(mockOnAdded).not.toHaveBeenCalled()
  })
})`,
        description: 'vi.mock — modul mock. vi.mocked() — TypeScript bilan. mockResolvedValue (success), mockRejectedValue (error). vi.fn() — callback mock (toHaveBeenCalledWith tekshirish).',
      },
      {
        title: 'MSW — network darajasida mock',
        language: 'tsx',
        code: `import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'

// MSW server sozlash
const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'Ali', role: 'admin' },
      { id: '2', name: 'Vali', role: 'user' },
    ])
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as { name: string }
    return HttpResponse.json(
      { id: '3', name: body.name, role: 'user' },
      { status: 201 }
    )
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())  // handler-larni reset
afterAll(() => server.close())

describe('UserList with MSW', () => {
  it('should load and display users', async () => {
    render(<UserList />)

    expect(screen.getByText('Yuklanmoqda...')).toBeInTheDocument()

    // MSW handler avtomatik javob beradi
    expect(await screen.findByText('Ali')).toBeInTheDocument()
    expect(screen.getByText('Vali')).toBeInTheDocument()
  })

  it('should handle server error', async () => {
    // BU TEST UCHUN handler-ni override
    server.use(
      http.get('/api/users', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<UserList />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Xatolik')
  })
})`,
        description: 'MSW — network darajasida mock. setupServer — test server. handler — URL va method bo\'yicha javob. server.use() — bitta test uchun override. Fetch/axios — farqi yo\'q.',
      },
    ],
    interviewQA: [
      {
        question: 'Mocking nima va nima uchun kerak?',
        answer: `Mocking — haqiqiy dependency-larni soxta versiyalar bilan almashtirish. Nima uchun: 1) Tezlik — network so'rov yo'q, 2) Ishonchlilik — server holatiga bog'liq emas, 3) Izolyatsiya — test faqat o'z komponentini tekshiradi, 4) Edge case — xato, timeout, bo'sh javob simulyatsiya qilish oson. Mock turlari: vi.fn() (funksiya), vi.mock() (modul), MSW (network), vi.useFakeTimers() (timer).`,
      },
      {
        question: 'vi.fn() bilan nima qilish mumkin?',
        answer: `vi.fn() — mock funksiya yaratadi. Imkoniyatlar: 1) Chaqirilganini tekshirish: toHaveBeenCalled(), toHaveBeenCalledTimes(2), toHaveBeenCalledWith("arg"), 2) Qaytarish qiymatini belgilash: mockReturnValue(42), mockResolvedValue({data}), mockRejectedValue(error), 3) Implementation berish: mockImplementation((x) => x * 2). Callback props test qilish uchun ideal: const onSubmit = vi.fn(); render(<Form onSubmit={onSubmit} />).`,
      },
      {
        question: 'MSW va vi.mock(fetch) farqi nima?',
        answer: `vi.mock(fetch) — fetch funksiyasini mock qiladi. Muammo: faqat fetch bilan ishlaydi (axios boshqa), implementatsiya detallariga bog'liq, test kodi murakkab. MSW — network DARAJASIDA mock (Service Worker). Afzalliklari: 1) Har qanday HTTP client bilan ishlaydi (fetch, axios, ky), 2) Haqiqiy network behavior (header, status code), 3) Handler-larni test ichida override oson, 4) Development-da ham ishlatish mumkin (browser). MSW tavsiya etiladi.`,
      },
      {
        question: 'Mock qilishda qanday xatolar ko\'p uchraydi?',
        answer: `1) Ortiqcha mock — hamma narsani mock qilish, haqiqiy integratsiyani tekshirmaslik. 2) afterEach da tozalamaslik — bir test boshqasiga ta'sir qiladi. 3) Norealistik mock data — haqiqiy API javobiga o'xshamagan data. 4) Mock qaytarish qiymatini test qilish — "mock to'g'ri ishlayaptimi" emas, "komponent to'g'ri ishlayaptimi" tekshiring. 5) Ko'p mock kerak = arxitektura muammo — dependency injection va separation of concerns yaxshilash kerak.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'testing', topicId: 'vitest-jest', label: 'Vitest mock API' },
      { techId: 'react-js', sectionId: 'testing', topicId: 'testing-patterns', label: 'Testing Patterns' },
    ],
  }
