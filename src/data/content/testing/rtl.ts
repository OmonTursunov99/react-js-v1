import type { Topic } from '../../types'

export const rtl: Topic = {
    id: 'rtl',
    title: 'React Testing Library (RTL)',
    importance: 3,
    status: 'to-learn',
    description: 'render, screen, userEvent, waitFor',
    content: `React Testing Library (RTL) — React komponentlarni FOYDALANUVCHI NUQTAI NAZARIDAN test qilish. Implementatsiya emas, XATTI-HARAKAT (behavior) test qilinadi.

═══════════════════════════════════════
  ASOSIY PRINTSIP
═══════════════════════════════════════

"Test qanday ishlashini emas, NIMA qilishini test qiling"

  ❌ Yomon: state qiymatini tekshirish
  ❌ Yomon: komponent instance-ga kirish
  ❌ Yomon: ichki funksiyani chaqirish

  ✅ Yaxshi: foydalanuvchi nima ko'radi?
  ✅ Yaxshi: foydalanuvchi nima qiladi (click, type)?
  ✅ Yaxshi: natija nima bo'ladi (ekranda nima o'zgaradi)?

═══════════════════════════════════════
  ASOSIY API
═══════════════════════════════════════

render — komponentni virtual DOM-ga qo'yish:
  render(<Button label="OK" onClick={fn} />)

screen — renderlanmagan elementlarni topish:
  screen.getByText('OK')
  screen.getByRole('button')
  screen.getByPlaceholderText('Ism...')

userEvent — foydalanuvchi harakatlarini simulyatsiya:
  await userEvent.click(button)
  await userEvent.type(input, 'Ali')
  await userEvent.clear(input)

waitFor — async natijani kutish:
  await waitFor(() => {
    expect(screen.getByText('Yuklandi')).toBeInTheDocument()
  })

═══════════════════════════════════════
  QUERY TIPLARI
═══════════════════════════════════════

getBy — element BORLIGINI tekshirish (topilmasa XATO):
  screen.getByText('Salom')       // matn bo'yicha
  screen.getByRole('button')      // role bo'yicha (a11y)
  screen.getByLabelText('Email')  // label bo'yicha
  screen.getByPlaceholderText('Ism') // placeholder
  screen.getByTestId('submit-btn')   // data-testid

queryBy — element YO'QLIGINI tekshirish (topilmasa NULL):
  expect(screen.queryByText('Xato')).not.toBeInTheDocument()

findBy — ASYNC element kutish (topilguncha kutadi):
  const element = await screen.findByText('Yuklandi')

PRIORITY (qaysi birini ishlatish):
  1. getByRole — ENG YAXSHI (a11y, semantic)
  2. getByLabelText — form elementlar uchun
  3. getByPlaceholderText — input uchun
  4. getByText — matn uchun
  5. getByTestId — OXIRGI VARIANT (boshqasi ishlamasa)

═══════════════════════════════════════
  userEvent vs fireEvent
═══════════════════════════════════════

fireEvent — past darajadagi event trigger:
  fireEvent.click(button)  // faqat click event

userEvent — haqiqiy foydalanuvchi harakati:
  await userEvent.click(button)
  // pointerdown → mousedown → pointerup → mouseup → click
  // Haqiqiy brauzerdagi kabi event ketma-ketligi

userEvent DOIM afzalroq — haqiqiy foydalanuvchi tajribasiga yaqin.
fireEvent — maxsus holatlarda (keyboard shortcut, custom event).

═══════════════════════════════════════
  ACCESSIBILITY TESTING
═══════════════════════════════════════

RTL-ning getByRole prinsipi — ACCESSIBILITY-ni majburlaydi:

  // Agar getByRole('button') ishlamasa — HTML semantikasi noto'g'ri
  // <div onClick={fn}> emas → <button onClick={fn}> bo'lishi kerak

  getByRole('heading', { level: 2 })  // <h2>
  getByRole('textbox')                // <input>
  getByRole('checkbox')               // <input type="checkbox">
  getByRole('link')                   // <a>
  getByRole('list')                   // <ul> / <ol>
  getByRole('listitem')               // <li>`,
    codeExamples: [
      {
        title: 'Komponent test — render, query, event',
        language: 'tsx',
        code: `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// Komponent
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Hisob: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Oshirish</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

describe('Counter', () => {
  it('should render initial count', () => {
    render(<Counter />)
    expect(screen.getByText('Hisob: 0')).toBeInTheDocument()
  })

  it('should increment on click', async () => {
    render(<Counter />)
    const button = screen.getByRole('button', { name: 'Oshirish' })

    await userEvent.click(button)
    expect(screen.getByText('Hisob: 1')).toBeInTheDocument()

    await userEvent.click(button)
    expect(screen.getByText('Hisob: 2')).toBeInTheDocument()
  })

  it('should reset count', async () => {
    render(<Counter />)

    // Avval oshirish
    await userEvent.click(screen.getByRole('button', { name: 'Oshirish' }))
    await userEvent.click(screen.getByRole('button', { name: 'Oshirish' }))
    expect(screen.getByText('Hisob: 2')).toBeInTheDocument()

    // Reset
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByText('Hisob: 0')).toBeInTheDocument()
  })
})

// Form test
function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  return (
    <form onSubmit={e => {
      e.preventDefault()
      const fd = new FormData(e.currentTarget)
      onSubmit({ email: fd.get('email') as string, password: fd.get('password') as string })
    }}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" />
      <label htmlFor="password">Parol</label>
      <input id="password" name="password" type="password" />
      <button type="submit">Kirish</button>
    </form>
  )
}

describe('LoginForm', () => {
  it('should submit with entered data', async () => {
    const handleSubmit = vi.fn()
    render(<LoginForm onSubmit={handleSubmit} />)

    await userEvent.type(screen.getByLabelText('Email'), 'ali@test.com')
    await userEvent.type(screen.getByLabelText('Parol'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Kirish' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'ali@test.com',
      password: '123456',
    })
  })
})`,
        description: 'RTL test: render → screen.getByRole/getByText → userEvent.click/type → expect. Foydalanuvchi nuqtai nazaridan: nima ko\'radi, nima qiladi, natija nima.',
      },
      {
        title: 'Async komponent test — waitFor, findBy',
        language: 'tsx',
        code: `import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Async komponent
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => {
        if (!res.ok) throw new Error('Topilmadi')
        return res.json()
      })
      .then(setUser)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) return <p>Yuklanmoqda...</p>
  if (error) return <p role="alert">Xato: {error}</p>
  return <h1>{user?.name}</h1>
}

describe('UserProfile', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('should show loading then user name', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'Ali' }),
    } as Response)

    render(<UserProfile userId="1" />)

    // Loading holati
    expect(screen.getByText('Yuklanmoqda...')).toBeInTheDocument()

    // Data yuklangandan keyin
    const heading = await screen.findByRole('heading', { name: 'Ali' })
    expect(heading).toBeInTheDocument()

    // Loading yo'q
    expect(screen.queryByText('Yuklanmoqda...')).not.toBeInTheDocument()
  })

  it('should show error on failure', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    render(<UserProfile userId="999" />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Xato: Topilmadi')
  })
})`,
        description: 'Async test: findBy — element paydo bo\'lguncha kutadi. queryBy — element YO\'QLIGINI tekshirish. Mock fetch — vi.stubGlobal. Loading → data/error holatlarni tekshirish.',
      },
    ],
    interviewQA: [
      {
        question: 'React Testing Library nima va nima uchun kerak?',
        answer: `RTL — React komponentlarni foydalanuvchi nuqtai nazaridan test qilish kutubxonasi. Prinsipi: "Test nima qilishini, qanday ishlashini emas". Implementatsiya detallarini (state, props, instance) test qilMASLIK — foydalanuvchi nima ko'radi va nima qiladi. Foyda: testlar refactoring-ga chidamli (ichki tuzilma o'zgarsa test buzilMAYDI), accessibility-ni majburlaydi (getByRole), haqiqiy foydalanuvchi tajribasiga yaqin.`,
      },
      {
        question: 'getBy, queryBy, findBy farqi nima?',
        answer: `getBy — element BORLIGINI tekshirish. Topilmasa darhol XATO tashlaydi. Ishlatish: element albatta bo'lishi kerak bo'lganda. queryBy — element YO'QLIGINI tekshirish. Topilmasa NULL qaytaradi (xato emas). Ishlatish: expect(queryByText("Xato")).not.toBeInTheDocument(). findBy — ASYNC kutish. Element paydo bo'lguncha kutadi (default 1s). Promise qaytaradi. Ishlatish: API javobidan keyin ko'rinadigan element.`,
      },
      {
        question: 'userEvent va fireEvent farqi nima?',
        answer: `fireEvent — past darajadagi event dispatch. fireEvent.click(btn) — faqat click event trigger qiladi. userEvent — haqiqiy foydalanuvchi harakatini simulyatsiya qiladi. userEvent.click(btn) — pointerdown, mousedown, pointerup, mouseup, click — butun event ketma-ketligi. userEvent.type(input, "Ali") — har harf uchun keydown, keypress, input, keyup. userEvent DOIM afzalroq — haqiqiy brauzerdagi kabi ishlaydi, ko'proq bug topadi.`,
      },
      {
        question: 'RTL da qaysi query ishlatish kerak (priority)?',
        answer: `1) getByRole — ENG YAXSHI. Semantic HTML va a11y-ga asoslangan: getByRole("button", {name: "Yuborish"}). 2) getByLabelText — form input uchun: getByLabelText("Email"). 3) getByPlaceholderText — label yo'q bo'lsa. 4) getByText — matn uchun. 5) getByDisplayValue — input qiymati. 6) getByAltText — rasm uchun. 7) getByTestId — OXIRGI variant, faqat boshqasi ishlamasa data-testid. getByRole a11y-ni majburlaydi — agar ishlamasa HTML semantikasi noto'g'ri.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'vitest-jest', label: 'Vitest / Jest' },
      { sectionId: 'testing', topicId: 'testing-patterns', label: 'Testing Patterns' },
      { sectionId: 'architecture', topicId: 'accessibility', label: 'a11y (getByRole)' },
    ],
  }
