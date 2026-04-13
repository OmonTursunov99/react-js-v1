import type { Topic } from '../../../types'

export const testingPatterns: Topic = {
    id: 'testing-patterns',
    title: 'Testing Patterns',
    importance: 3,
    status: 'to-learn',
    description: 'Behavior test, not implementation — nima va qanday test qilinadi',
    content: `Testing patterns — qaysi testlar yozish kerak, qanday yozish kerak, va nimani test qilMASLIK kerak. Senior developer uchun muhim — vaqtni to'g'ri sarflash.

═══════════════════════════════════════
  TESTING PIRAMIDASI
═══════════════════════════════════════

         /\\
        /E2E\\        — kam, qimmat, sekin
       /------\\
      / Integ  \\     — o'rtacha
     /----------\\
    /   Unit     \\   — ko'p, arzon, tez
   /--------------\\

Unit test — bitta funksiya/komponent, izolyatsiyalangan
Integration test — bir nechta komponent birgalikda
E2E test — butun ilova, brauzerda

KO'P loyihalarda Integration eng foydali:
  - Komponentlar birgalikda ishlashini tekshiradi
  - Refactoring-ga chidamli
  - Haqiqiy foydalanuvchi harakatiga yaqin

═══════════════════════════════════════
  NIMA TEST QILISH KERAK
═══════════════════════════════════════

✅ Test qilish KERAK:
  - Foydalanuvchi harakatlari (click, type, submit)
  - Shartli rendering (loading, error, empty state)
  - Form validatsiya
  - Callback-lar to'g'ri chaqirilishi
  - Edge case-lar (bo'sh array, null, chegaraviy qiymatlar)
  - Business logika (hisoblash, filterlash, transformatsiya)

❌ Test qilish KERAK EMAS:
  - Implementatsiya detallari (state qiymati, ichki funksiya)
  - Uchinchi tomon kutubxonalar (React, Router, Redux)
  - Stil/CSS (vizual regression test alohida vosita bilan)
  - Trivial kod (constant, type, simple pass-through)

═══════════════════════════════════════
  BEHAVIOR vs IMPLEMENTATION
═══════════════════════════════════════

❌ IMPLEMENTATION TEST (yomon):
  // Komponent ichki state-ni tekshirish
  expect(component.state.count).toBe(5)
  // Ichki metodni chaqirish
  component.instance().handleClick()

✅ BEHAVIOR TEST (yaxshi):
  // Foydalanuvchi nima ko'radi va qiladi
  await userEvent.click(screen.getByRole('button', { name: '+' }))
  expect(screen.getByText('Hisob: 5')).toBeInTheDocument()

Afzallik: behavior test REFACTORING-ga chidamli.
useState → useReducer o'zgarsa — behavior test buzilMAYDI.

═══════════════════════════════════════
  AAA PATTERN
═══════════════════════════════════════

Har test 3 qismdan iborat:

  it('should show error on invalid email', async () => {
    // Arrange — tayyorlash
    render(<LoginForm onSubmit={vi.fn()} />)

    // Act — harakat qilish
    await userEvent.type(screen.getByLabelText('Email'), 'invalid')
    await userEvent.click(screen.getByRole('button', { name: 'Kirish' }))

    // Assert — natijani tekshirish
    expect(screen.getByText('Email noto\\'g\\'ri')).toBeInTheDocument()
  })

═══════════════════════════════════════
  TEST ISOLATION
═══════════════════════════════════════

Har test MUSTAQIL bo'lishi kerak:
  - Boshqa testga bog'liq emas
  - Tartib o'zgarsa ham ishlaydi
  - Parallel ishga tushsa ham ishlaydi

beforeEach da tozalash:
  - DOM tozalanadi (RTL avtomatik)
  - Mock-lar reset qilinadi
  - Timer-lar qaytariladi`,
    codeExamples: [
      {
        title: 'Behavior test — Todo list',
        language: 'tsx',
        code: `import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'

// Komponent
function TodoApp() {
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([])
  const [input, setInput] = useState('')

  function addTodo() {
    if (!input.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), text: input, done: false }])
    setInput('')
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Yangi vazifa" />
      <button onClick={addTodo}>Qo'shish</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <label>
              <input type="checkbox" checked={todo.done}
                onChange={() => setTodos(prev => prev.map(t =>
                  t.id === todo.id ? { ...t, done: !t.done } : t
                ))}
              />
              <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                {todo.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {todos.length > 0 && (
        <p>{todos.filter(t => t.done).length}/{todos.length} bajarildi</p>
      )}
    </div>
  )
}

describe('TodoApp', () => {
  it('should add a new todo', async () => {
    render(<TodoApp />)

    await userEvent.type(screen.getByPlaceholderText('Yangi vazifa'), 'React o\\'rganish')
    await userEvent.click(screen.getByRole('button', { name: 'Qo\\'shish' }))

    expect(screen.getByText('React o\\'rganish')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Yangi vazifa')).toHaveValue('')
  })

  it('should not add empty todo', async () => {
    render(<TodoApp />)

    await userEvent.click(screen.getByRole('button', { name: 'Qo\\'shish' }))

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('should toggle todo completion', async () => {
    render(<TodoApp />)

    // Todo qo'shish
    await userEvent.type(screen.getByPlaceholderText('Yangi vazifa'), 'Test yozish')
    await userEvent.click(screen.getByRole('button', { name: 'Qo\\'shish' }))

    // Toggle
    const checkbox = screen.getByRole('checkbox')
    await userEvent.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(screen.getByText('1/1 bajarildi')).toBeInTheDocument()
  })

  it('should show correct count', async () => {
    render(<TodoApp />)

    // 2 ta todo qo'shish
    const input = screen.getByPlaceholderText('Yangi vazifa')

    await userEvent.type(input, 'Birinchi')
    await userEvent.click(screen.getByRole('button', { name: 'Qo\\'shish' }))

    await userEvent.type(input, 'Ikkinchi')
    await userEvent.click(screen.getByRole('button', { name: 'Qo\\'shish' }))

    // 1 tasini bajarish
    const checkboxes = screen.getAllByRole('checkbox')
    await userEvent.click(checkboxes[0])

    expect(screen.getByText('1/2 bajarildi')).toBeInTheDocument()
  })
})`,
        description: 'Behavior test: foydalanuvchi nima qiladi (type, click) va nima ko\'radi (getByText, queryByRole). Ichki state tekshirilMAYDI — faqat UI natijasi. AAA pattern: Arrange, Act, Assert.',
      },
      {
        title: 'Custom hook test — renderHook',
        language: 'tsx',
        code: `import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

// Custom hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount(c => c + 1), [])
  const decrement = useCallback(() => setCount(c => c - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])

  return { count, increment, decrement, reset }
}

describe('useCounter', () => {
  it('should start with initial value', () => {
    const { result } = renderHook(() => useCounter(10))
    expect(result.current.count).toBe(10)
  })

  it('should start with 0 by default', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('should increment', () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })

  it('should decrement', () => {
    const { result } = renderHook(() => useCounter(5))

    act(() => {
      result.current.decrement()
    })

    expect(result.current.count).toBe(4)
  })

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(10))

    act(() => {
      result.current.increment()
      result.current.increment()
      result.current.increment()
    })

    expect(result.current.count).toBe(13)

    act(() => {
      result.current.reset()
    })

    expect(result.current.count).toBe(10)
  })
})`,
        description: 'renderHook — custom hook-ni komponentsiz test qilish. act() — state o\'zgarishlarini wrap qilish (React rendering cycle). result.current — hook-ning hozirgi natijasi.',
      },
    ],
    interviewQA: [
      {
        question: 'Testing piramidasi nima?',
        answer: `Unit test (pastda) — ko'p, tez, arzon. Bitta funksiya/komponent. Integration test (o'rtada) — o'rtacha. Komponentlar birgalikda. E2E test (tepada) — kam, sekin, qimmat. Butun ilova brauzerda. Ko'p React loyihalarda INTEGRATION eng foydali: RTL bilan komponentlar birgalikda test qilinadi, refactoring-ga chidamli, foydalanuvchi harakatiga yaqin. Unit — utility funksiyalar uchun. E2E — critical flow uchun (login, checkout).`,
      },
      {
        question: 'Behavior test va implementation test farqi nima?',
        answer: `Implementation test — QANDAY ishlashini tekshiradi: state qiymati, ichki metod, component instance. Muammo: refactoring buzadi (useState → useReducer o'zgarsa test sinadi). Behavior test — NIMA qilishini tekshiradi: foydalanuvchi click qiladi → ekranda X ko'rinadi. Afzallik: refactoring-ga chidamli, haqiqiy bug topadi, foydalanuvchi tajribasiga yaqin. RTL behavior test uchun yaratilgan — getByRole, userEvent.`,
      },
      {
        question: 'Nimani test qilish kerak, nimani kerak emas?',
        answer: `TEST KERAK: foydalanuvchi harakatlari (click, type, submit), shartli rendering (loading, error, empty), form validatsiya, callback chaqirilishi, edge case-lar (null, bo'sh array), business logika. TEST KERAK EMAS: implementatsiya (state, ichki funksiya), uchinchi tomon kutubxonalar (React, Router), stillar/CSS, trivial kod (constant, type). Qoida: test bug OLDINI OLISH uchun — trivial test bug topmaydi.`,
      },
      {
        question: 'AAA pattern nima?',
        answer: `Arrange-Act-Assert — har test 3 qismdan iborat: 1) Arrange (tayyorlash) — render, mock sozlash, test data yaratish. 2) Act (harakat) — userEvent.click, userEvent.type — foydalanuvchi harakati. 3) Assert (tekshirish) — expect, toBeInTheDocument — natija to'g'rimi? Har test BITTA behavior tekshiradi. Test nomi nima tekshirilayotganini aniq aytishi kerak: "should show error on invalid email".`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'testing', topicId: 'rtl', label: 'RTL (behavior testing)' },
      { techId: 'react-js', sectionId: 'testing', topicId: 'mocking', label: 'Mock qilish' },
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks testing' },
    ],
  }
