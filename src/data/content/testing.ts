import type { Topic } from '../types'

export const testingTopics: Topic[] = [
  {
    id: 'vitest-jest',
    title: 'Vitest / Jest',
    importance: 3,
    status: 'to-learn',
    description: 'Unit test yozish, test runner, assertion',
    content: `Vitest va Jest — JavaScript/TypeScript uchun test runner-lar. Vitest — Vite ekotizimi uchun (tez, ESM native), Jest — eng mashhur (katta ekotizim). API deyarli bir xil.

═══════════════════════════════════════
  VITEST vs JEST
═══════════════════════════════════════

Vitest afzalliklari:
  ✅ Vite bilan tezkor integratsiya (config alohida kerak emas)
  ✅ ESM native (import/export to'g'ridan-to'g'ri)
  ✅ Jest-compatible API (ko'chirish oson)
  ✅ HMR — o'zgargan testlar darhol qayta ishlaydi
  ✅ TypeScript — alohida sozlash kerak emas

Jest afzalliklari:
  ✅ Katta ekotizim va community
  ✅ Ko'p loyihalarda standart
  ✅ Snapshot testing kuchli
  ✅ Create React App da o'rnatilgan

Hozirgi tavsiya: Vite loyihalar uchun — Vitest, boshqalar uchun — Jest.

═══════════════════════════════════════
  TEST TUZILMASI
═══════════════════════════════════════

  describe('Calculator', () => {        // test guruhi
    it('should add two numbers', () => { // bitta test
      expect(add(2, 3)).toBe(5)         // assertion
    })

    it('should subtract', () => {
      expect(subtract(5, 3)).toBe(2)
    })
  })

describe — testlarni guruhlash (ixtiyoriy, lekin tavsiya)
it / test — bitta test case (ikkalasi bir xil)
expect — natijani tekshirish
toBe/toEqual/... — matcher (taqqoslash usuli)

═══════════════════════════════════════
  ASOSIY MATCHER-LAR
═══════════════════════════════════════

Tenglik:
  expect(a).toBe(b)          // === (primitiv uchun)
  expect(a).toEqual(b)       // deep equal (object/array uchun)
  expect(a).toStrictEqual(b) // strict deep equal (undefined property ham)

Truthiness:
  expect(a).toBeTruthy()     // truthy qiymat
  expect(a).toBeFalsy()      // falsy qiymat
  expect(a).toBeNull()       // === null
  expect(a).toBeUndefined()  // === undefined
  expect(a).toBeDefined()    // !== undefined

Raqamlar:
  expect(a).toBeGreaterThan(3)
  expect(a).toBeLessThanOrEqual(5)
  expect(a).toBeCloseTo(0.3, 5)  // float taqqoslash

String:
  expect(a).toMatch(/pattern/)    // regex
  expect(a).toContain('substr')   // substring

Array/Object:
  expect(arr).toContain(item)
  expect(arr).toHaveLength(3)
  expect(obj).toHaveProperty('key', 'value')

Xato:
  expect(() => fn()).toThrow()
  expect(() => fn()).toThrow('error message')

Inversion:
  expect(a).not.toBe(b)

═══════════════════════════════════════
  LIFECYCLE HOOKS
═══════════════════════════════════════

  beforeAll(() => { /* barcha testlardan OLDIN 1 marta */ })
  afterAll(() => { /* barcha testlardan KEYIN 1 marta */ })
  beforeEach(() => { /* HAR test dan OLDIN */ })
  afterEach(() => { /* HAR test dan KEYIN */ })

Ishlatish:
  - beforeEach: test state tozalash, mock reset
  - afterEach: cleanup (timer, DOM)
  - beforeAll: DB connection, server start
  - afterAll: DB disconnect, server stop

═══════════════════════════════════════
  TEST FAYL KONVENTSIYASI
═══════════════════════════════════════

  src/
  ├── utils/
  │   ├── math.ts
  │   └── math.test.ts          // yonida
  ├── components/
  │   ├── Button.tsx
  │   └── Button.test.tsx        // yonida
  └── __tests__/                 // yoki alohida papka
      └── integration.test.ts

Fayl nomi: *.test.ts, *.test.tsx, yoki *.spec.ts
Vitest/Jest avtomatik topadi.`,
    codeExamples: [
      {
        title: 'Vitest — unit test asoslari',
        language: 'ts',
        code: `import { describe, it, expect, beforeEach } from 'vitest'

// Funksiya
function calculateDiscount(price: number, percent: number): number {
  if (price < 0 || percent < 0 || percent > 100) {
    throw new Error('Noto\\'g\\'ri qiymat')
  }
  return price - (price * percent) / 100
}

describe('calculateDiscount', () => {
  it('should calculate 10% discount', () => {
    expect(calculateDiscount(100, 10)).toBe(90)
  })

  it('should calculate 50% discount', () => {
    expect(calculateDiscount(200, 50)).toBe(100)
  })

  it('should return same price for 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100)
  })

  it('should return 0 for 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0)
  })

  it('should handle decimal prices', () => {
    expect(calculateDiscount(99.99, 10)).toBeCloseTo(89.991, 2)
  })

  it('should throw for negative price', () => {
    expect(() => calculateDiscount(-10, 10)).toThrow('Noto\\'g\\'ri qiymat')
  })

  it('should throw for percent > 100', () => {
    expect(() => calculateDiscount(100, 150)).toThrow()
  })
})

// Array/Object test
describe('User utils', () => {
  const users = [
    { id: '1', name: 'Ali', role: 'admin' },
    { id: '2', name: 'Vali', role: 'user' },
  ]

  it('should find user by id', () => {
    const user = users.find(u => u.id === '1')
    expect(user).toEqual({ id: '1', name: 'Ali', role: 'admin' })
  })

  it('should return undefined for missing id', () => {
    const user = users.find(u => u.id === '999')
    expect(user).toBeUndefined()
  })

  it('should have correct length', () => {
    expect(users).toHaveLength(2)
  })
})`,
        description: 'Unit test asoslari: describe (guruhlash), it (test case), expect + matcher (assertion). toBe (primitiv), toEqual (object), toThrow (xato), toBeCloseTo (float).',
      },
      {
        title: 'Vitest — async test va setup',
        language: 'ts',
        code: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Async funksiya
async function fetchUser(id: string): Promise<{ id: string; name: string }> {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error('User not found')
  return res.json()
}

describe('fetchUser', () => {
  // Har testdan oldin fetch-ni mock qilish
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return user data', async () => {
    const mockUser = { id: '1', name: 'Ali' }

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    } as Response)

    const user = await fetchUser('1')
    expect(user).toEqual(mockUser)
    expect(fetch).toHaveBeenCalledWith('/api/users/1')
  })

  it('should throw on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(fetchUser('999')).rejects.toThrow('User not found')
  })
})

// Timer test
describe('delayed function', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call callback after delay', () => {
    const callback = vi.fn()

    setTimeout(callback, 1000)

    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledOnce()
  })
})`,
        description: 'Async test — await + rejects.toThrow. Mock fetch — vi.stubGlobal + vi.mocked. Fake timers — vi.useFakeTimers + vi.advanceTimersByTime. beforeEach/afterEach — har testda tozalash.',
      },
    ],
    interviewQA: [
      {
        question: 'Vitest va Jest farqi nima?',
        answer: `Vitest — Vite ekotizimi uchun: Vite config-dan foydalanadi, ESM native, TypeScript alohida sozlash kerak emas, HMR (o'zgargan test darhol ishlaydi), Jest-compatible API. Jest — universal: katta ekotizim, ko'p loyihalarda standart, CRA da o'rnatilgan, CommonJS default. API deyarli bir xil — vi.fn() vs jest.fn(). Vite loyihalar uchun Vitest tavsiya etiladi (tezroq, config sodda).`,
      },
      {
        question: 'toBe va toEqual farqi nima?',
        answer: `toBe — === (strict equality). Primitiv uchun qiymat, object uchun REFERENS taqqoslaydi. {a:1} toBe {a:1} — FALSE (farqli referens). toEqual — DEEP equality. Object/array ichidagi barcha qiymatlarni rekursiv taqqoslaydi. {a:1} toEqual {a:1} — TRUE. toStrictEqual — toEqual kabi, lekin undefined property-larni ham tekshiradi. Qoida: primitiv → toBe, object/array → toEqual.`,
      },
      {
        question: 'beforeEach va beforeAll farqi nima?',
        answer: `beforeEach — HAR TEST dan oldin ishlaydi. Ishlatish: mock reset, test state tozalash. Har test izolyatsiyalangan bo'lishi uchun muhim. beforeAll — BARCHA testlardan oldin FAQAT 1 MARTA ishlaydi. Ishlatish: DB connection, server start, qimmat setup. Agar testlar bir-biriga ta'sir qilsa — beforeEach ishlatish kerak. afterEach/afterAll — tozalash uchun (timer, mock, DOM).`,
      },
      {
        question: 'Test fayllarni qanday nomlash va joylashtirish kerak?',
        answer: `2 ta konventsiya: 1) Fayl yonida — Button.tsx va Button.test.tsx bir papkada. Afzallik: file navigator-da yonma-yon, import path qisqa. 2) __tests__ papka — alohida test katalog. Afzallik: src toza qoladi. Ko'p jamoalar 1-usulni afzal ko'radi. Fayl nomi: *.test.ts(x) yoki *.spec.ts(x). Vitest/Jest avtomatik topadi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'rtl', label: 'React Testing Library' },
      { sectionId: 'testing', topicId: 'mocking', label: 'Mock qilish' },
    ],
  },
  {
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
  },
  {
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
      { sectionId: 'testing', topicId: 'rtl', label: 'RTL (behavior testing)' },
      { sectionId: 'testing', topicId: 'mocking', label: 'Mock qilish' },
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks testing' },
    ],
  },
  {
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
      { sectionId: 'testing', topicId: 'vitest-jest', label: 'Vitest mock API' },
      { sectionId: 'testing', topicId: 'testing-patterns', label: 'Testing Patterns' },
    ],
  },
  {
    id: 'e2e',
    title: 'E2E Testing',
    importance: 1,
    status: 'to-learn',
    description: 'Playwright / Cypress asoslari',
    content: `E2E (End-to-End) testing — butun ilovani HAQIQIY BRAUZERDA test qilish. Foydalanuvchi tajribasini boshidan oxirigacha tekshirish.

═══════════════════════════════════════
  E2E vs UNIT/INTEGRATION
═══════════════════════════════════════

Unit/Integration (RTL):
  - jsdom (virtual DOM, brauzer emas)
  - Tez (millisekundlar)
  - Komponent darajasida
  - Network mock qilinadi

E2E (Playwright/Cypress):
  - HAQIQIY brauzer (Chrome, Firefox, Safari)
  - Sekin (sekundlar)
  - Butun ilova darajasida
  - Haqiqiy server bilan (yoki mock server)

E2E nima tekshiradi:
  ✅ Login flow boshidan oxirigacha
  ✅ Form submit → server → natija ko'rish
  ✅ Navigation (sahifalar orasida o'tish)
  ✅ Cross-browser muvofiqligi

═══════════════════════════════════════
  PLAYWRIGHT vs CYPRESS
═══════════════════════════════════════

Playwright (Microsoft):
  ✅ Multi-browser (Chrome, Firefox, Safari, mobile)
  ✅ Parallel test (tez)
  ✅ Auto-wait (element tayyor bo'lguncha kutadi)
  ✅ TypeScript native
  ✅ Network interception
  ✅ Codegen (brauzerda yozish)

Cypress:
  ✅ Developer UX yaxshi (time travel debugging)
  ✅ Katta ekotizim
  ✅ Dashboard (CI natijalarni ko'rish)
  ❌ Faqat Chrome-based (Firefox qisman)
  ❌ Multi-tab, multi-domain qiyin

Hozirgi tavsiya: PLAYWRIGHT — ko'p brauzer, tez, bepul.

═══════════════════════════════════════
  PLAYWRIGHT ASOSLARI
═══════════════════════════════════════

  import { test, expect } from '@playwright/test'

  test('login flow', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    await page.getByLabel('Email').fill('ali@test.com')
    await page.getByLabel('Parol').fill('123456')
    await page.getByRole('button', { name: 'Kirish' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

API: RTL-ga juda O'XSHASH:
  page.getByRole() — RTL kabi
  page.getByLabel() — RTL kabi
  page.getByText() — RTL kabi
  Lekin HAQIQIY brauzerda ishlaydi!

═══════════════════════════════════════
  QACHON E2E KERAK
═══════════════════════════════════════

E2E KERAK:
  ✅ Critical user flow (login, checkout, registration)
  ✅ Cross-browser tekshirish
  ✅ Multi-page flow (wizard, onboarding)
  ✅ Third-party integratsiya

E2E KERAK EMAS:
  ❌ Har bir komponent (unit/integration yetarli)
  ❌ Edge case-lar (unit test tezroq)
  ❌ Stil tekshirish (visual regression alohida)

Qoida: 5-10 ta CRITICAL flow uchun E2E, qolgani unit/integration.`,
    codeExamples: [
      {
        title: 'Playwright — asosiy test',
        language: 'ts',
        code: `import { test, expect } from '@playwright/test'

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should add and complete a todo', async ({ page }) => {
    // Todo qo'shish
    await page.getByPlaceholder('Yangi vazifa').fill('Playwright o\\'rganish')
    await page.getByRole('button', { name: 'Qo\\'shish' }).click()

    // Tekshirish
    const todo = page.getByText('Playwright o\\'rganish')
    await expect(todo).toBeVisible()

    // Bajarish
    await page.getByRole('checkbox').click()

    // Line-through stilni tekshirish
    await expect(todo).toHaveCSS('text-decoration-line', 'line-through')
  })

  test('should navigate between pages', async ({ page }) => {
    // Bosh sahifadan section-ga o'tish
    await page.getByText('React Core').click()

    await expect(page).toHaveURL(/\\/section\\/react-core/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('React Core')

    // Topic-ga o'tish
    await page.getByText('useState').click()

    await expect(page).toHaveURL(/\\/section\\/react-core\\/use-state/)
  })

  test('should toggle dark mode', async ({ page }) => {
    // Light mode default
    const html = page.locator('html')

    // Dark mode toggle
    await page.getByRole('button', { name: /🌙/ }).click()

    await expect(html).toHaveClass(/dark/)

    // Light mode qaytish
    await page.getByRole('button', { name: /☀️/ }).click()

    await expect(html).not.toHaveClass(/dark/)
  })
})`,
        description: 'Playwright — haqiqiy brauzerda test. API RTL-ga o\'xshash (getByRole, getByText). page.goto — sahifaga o\'tish. expect(page).toHaveURL — navigatsiya tekshirish.',
      },
      {
        title: 'Playwright — API mock va screenshot',
        language: 'ts',
        code: `import { test, expect } from '@playwright/test'

test.describe('User Dashboard', () => {
  test('should display users from API', async ({ page }) => {
    // API mock — network darajasida
    await page.route('/api/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Ali', role: 'admin' },
          { id: '2', name: 'Vali', role: 'user' },
        ]),
      })
    })

    await page.goto('http://localhost:5173/users')

    await expect(page.getByText('Ali')).toBeVisible()
    await expect(page.getByText('Vali')).toBeVisible()
  })

  test('should handle API error', async ({ page }) => {
    await page.route('/api/users', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('http://localhost:5173/users')

    await expect(page.getByText(/xato/i)).toBeVisible()

    // Screenshot — vizual tekshirish / debug
    await page.screenshot({ path: 'tests/screenshots/error-state.png' })
  })

  test('should be responsive', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:5173')

    // Sidebar yashirin bo'lishi kerak (mobile da)
    // await expect(page.getByRole('complementary')).not.toBeVisible()

    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })

    // Sidebar ko'rinadi
    // await expect(page.getByRole('complementary')).toBeVisible()
  })
})

// playwright.config.ts
// export default defineConfig({
//   testDir: './e2e',
//   use: { baseURL: 'http://localhost:5173' },
//   webServer: {
//     command: 'npm run dev',
//     port: 5173,
//   },
//   projects: [
//     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
//     { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
//     { name: 'mobile', use: { ...devices['iPhone 13'] } },
//   ],
// })`,
        description: 'page.route — API mock (network intercept). Screenshot — debug va vizual test. setViewportSize — responsive test. Config: multi-browser, webServer avtomatik start.',
      },
    ],
    interviewQA: [
      {
        question: 'E2E testing nima va qachon kerak?',
        answer: `E2E — butun ilovani haqiqiy brauzerda boshidan oxirigacha test qilish. Unit/integration jsdom-da (virtual DOM), E2E haqiqiy Chrome/Firefox-da. Qachon kerak: critical user flow (login, checkout, registration), multi-page navigation, cross-browser tekshirish, third-party integratsiya. Qachon kerak emas: har bir komponent (unit yetarli), edge case-lar (unit tezroq). Qoida: 5-10 ta critical flow uchun E2E, qolgani unit/integration.`,
      },
      {
        question: 'Playwright va Cypress farqi nima?',
        answer: `Playwright (Microsoft): multi-browser (Chrome, Firefox, Safari, mobile), parallel test, auto-wait, TypeScript native, bepul. Cypress: yaxshi DX (time-travel debugging), katta ekotizim, dashboard. Kamchiliklari: faqat Chrome-based (Firefox qisman), multi-tab qiyin, parallel uchun to'lov. Hozirgi tavsiya: PLAYWRIGHT — ko'proq brauzer, tezroq (parallel), bepul. Cypress — agar jamoa allaqachon ishlatayotgan bo'lsa.`,
      },
      {
        question: 'E2E testda API qanday mock qilinadi?',
        answer: `Playwright: page.route("/api/users", (route) => route.fulfill({body: JSON.stringify(data)})) — network darajasida intercept. Cypress: cy.intercept("GET", "/api/users", {body: data}). Alternativa: mock server (MSW, json-server) — haqiqiy HTTP server, lekin soxta data. Afzallik: haqiqiy network behavior test qilinadi. Yechim tanlash: oddiy mock → page.route, murakkab scenario → mock server.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'rtl', label: 'RTL (unit/integration)' },
      { sectionId: 'architecture', topicId: 'ci-cd', label: 'CI/CD (E2E pipeline)' },
    ],
  },
]
