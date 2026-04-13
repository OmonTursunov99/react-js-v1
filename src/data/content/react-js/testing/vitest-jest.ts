import type { Topic } from '../../../types'

export const vitestJest: Topic = {
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
      { techId: 'react-js', sectionId: 'testing', topicId: 'rtl', label: 'React Testing Library' },
      { techId: 'react-js', sectionId: 'testing', topicId: 'mocking', label: 'Mock qilish' },
    ],
  }
