import type { Topic } from '../../../types'

export const typeAssertions: Topic = {
  id: 'type-assertions',
  title: 'Type Assertions',
  importance: 3,
  status: 'to-learn',
  description:
    'as keyword, double assertion, non-null assertion, as const va type guard bilan farqi.',
  content: `
# TYPE ASSERTIONS
═══════════════════════════════════════

Type assertion — TypeScript ga "men bu qiymatning tipini bilaman" deb aytish. Kompilyator tekshiruvini chetlab o'tish usuli. Runtime da HECH NARSA o'zgarmaydi — faqat kompilyatsiya vaqtida tip o'zgaradi.

## AS KEYWORD

\`value as Type\` — eng ko'p ishlatiladigan assertion sintaksisi. JSX bilan ziddiyat bo'lmasligi uchun angle-bracket (\`<Type>value\`) o'rniga \`as\` tavsiya etiladi.

MUHIM: Assertion faqat "bog'liq" tiplar orasida ishlaydi. \`string as number\` — XATO. TypeScript tiplar orasida hech bo'lmaganda bitta yo'nalishda munosabat bo'lishini talab qiladi.

## DOUBLE ASSERTION

\`value as unknown as TargetType\` — ikki bosqichli assertion. Avval \`unknown\` ga, keyin maqsad tipga. Bu xavfli va faqat alohida hollarda ishlatiladi:
1. Test yozishda mock ob'ektlar
2. Legacy kod bilan ishlashda
3. Kutubxona tipi noto'g'ri bo'lganda

## NON-NULL ASSERTION (!)

\`value!\` — postfix operator. TypeScript ga "bu qiymat null yoki undefined EMAS" deb aytadi. Optional chaining (\`?.\`) dan farqli — runtime tekshiruv yo'q.

MUHIM: Non-null assertion runtime da hech narsa qilmaydi. Agar qiymat haqiqatda null bo'lsa — runtime xato bo'ladi.

## AS CONST

\`as const\` — literal type assertion. Barcha qiymatlarni \`readonly\` va eng tor (literal) tipga aylantiradi:
- \`"hello"\` string emas, \`"hello"\` literal bo'ladi
- Array \`readonly tuple\` bo'ladi
- Object propertylari \`readonly\` bo'ladi

## TYPE ASSERTION VS TYPE GUARD

- **Assertion** — kompilyatorni majburlash, runtime tekshiruv yo'q
- **Guard** — runtime tekshiruv, xavfsiz type narrowing
- Doim guard afzal. Assertion faqat guard imkoni bo'lmaganda ishlatilsin

## QACHON ASSERTION KERAK?

1. DOM elementlar bilan ishlash: \`getElementById\` natijasi
2. Third-party kutubxona tipi noto'g'ri bo'lganda
3. Test yozishda partial mock ob'ektlar
4. JSON.parse natijasi bilan ishlashda
5. Event target tipini aniqlashtirish
  `.trim(),
  codeExamples: [
    {
      title: 'as keyword — asosiy assertion',
      language: 'ts',
      description: 'Type assertion asosiy sintaksisi va ishlatilishi.',
      code: `// DOM bilan ishlash — eng ko'p ishlatiladigan holat
const input = document.getElementById("email") as HTMLInputElement
console.log(input.value)  // HTMLInputElement deb biladi

// querySelector bilan
const canvas = document.querySelector("canvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d")

// Event target
function handleClick(e: Event) {
  const button = e.target as HTMLButtonElement
  console.log(button.textContent)
}

// API javob — JSON tipini belgilash
interface User {
  id: number
  name: string
  email: string
}

const response = await fetch("/api/user")
const user = (await response.json()) as User
console.log(user.name)

// XATO — bog'liq bo'lmagan tiplar
// const num = "hello" as number  // Error!`,
    },
    {
      title: 'Double assertion va non-null',
      language: 'ts',
      description: 'Xavfli holatlar — double assertion va ! operatori.',
      code: `// Double assertion — ikki bosqichli
// Faqat alohida hollarda!
const value = "hello" as unknown as number
// TypeScript xato bermaydi, lekin runtime da string

// Test mock uchun qulay
interface ComplexService {
  fetchUser(id: string): Promise<User>
  fetchPosts(userId: string): Promise<Post[]>
  cache: Map<string, unknown>
}

// Test da faqat kerakli methodlarni mock qilish
const mockService = {
  fetchUser: jest.fn(),
} as unknown as ComplexService

// Non-null assertion (!)
function getLength(arr: string[] | null) {
  // Xavfli — agar arr null bo'lsa, runtime xato
  return arr!.length

  // Xavfsiz alternativa
  // return arr?.length ?? 0
}

// DOM da ko'p ishlatiladi
const el = document.getElementById("app")!
el.innerHTML = "Hello"

// MUHIM: ! runtime da hech narsa qilmaydi
// Agar el null bo'lsa — TypeError: Cannot set innerHTML of null`,
    },
    {
      title: 'as const — literal assertion',
      language: 'ts',
      description: 'as const bilan immutable literal tiplar yaratish.',
      code: `// Oddiy va as const farqi
const color1 = "red"          // tip: string
const color2 = "red" as const // tip: "red"

// Object bilan
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
} as const
// Tip: { readonly host: "localhost"; readonly port: 3000; readonly debug: true }

// config.port = 8080  // XATO: readonly

// Array bilan — tuple bo'ladi
const coords = [10, 20] as const
// Tip: readonly [10, 20]

// Enum o'rniga
const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  CLOSED: "closed",
} as const

type Status = typeof STATUS[keyof typeof STATUS]
// "pending" | "active" | "closed"

// Function argument sifatida
function setPosition(pos: readonly [number, number]) {
  console.log(pos[0], pos[1])
}

setPosition([10, 20] as const)  // OK
// setPosition([10, 20])        // XATO: number[] !== readonly [number, number]`,
    },
    {
      title: 'Assertion vs Guard — taqqoslash',
      language: 'ts',
      description: 'Xavfsiz guard va xavfli assertion — qachon nimani tanlash.',
      code: `// ❌ Assertion — xavfli, runtime tekshiruv yo'q
function processInput(input: unknown) {
  const user = input as User
  console.log(user.name)  // Runtime xato agar input User emas
}

// ✅ Type guard — xavfsiz, runtime tekshiruv bor
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value
  )
}

function processInputSafe(input: unknown) {
  if (isUser(input)) {
    console.log(input.name)  // Xavfsiz
  }
}

// ❌ Non-null assertion — xavfli
const el1 = document.getElementById("app")!

// ✅ Null check — xavfsiz
const el2 = document.getElementById("app")
if (el2) {
  el2.innerHTML = "Hello"
}

// Qoida: assertion faqat SEN 100% ishonchli bo'lsang
// Aks holda DOIM guard yoki null check ishlat`,
    },
  ],
  interviewQA: [
    {
      question: 'Type assertion nima va runtime da nima bo\'ladi?',
      answer:
        'Type assertion — TypeScript kompilyatoriga "men bu qiymatning tipini bilaman" deb aytish. as keyword bilan yoziladi: value as Type. Runtime da HECH NARSA o\'zgarmaydi — assertion faqat kompilyatsiya vaqtida ishlaydi, JavaScript ga hech qanday kod qo\'shilmaydi. Agar assertion noto\'g\'ri bo\'lsa — runtime xato bo\'ladi.',
    },
    {
      question: 'as unknown as T — bu nima va qachon ishlatiladi?',
      answer:
        'Double assertion — ikki bosqichli tip o\'zgartirish. Avval unknown ga, keyin maqsad tipga. Kerak bo\'ladigan holatlar: 1) test mock — partial ob\'ektni to\'liq interface sifatida berish, 2) kutubxona tipi noto\'g\'ri bo\'lganda, 3) legacy kod migration. Bu XAVFLI — TypeScript himoyasini to\'liq o\'chiradi. Ishlab chiqarishda iloji boricha qochish kerak.',
    },
    {
      question: 'as const nima qiladi va qachon ishlatiladi?',
      answer:
        'as const barcha qiymatlarni eng tor literal tipga va readonly ga aylantiradi. string o\'rniga "hello", number[] o\'rniga readonly [1, 2, 3]. Ishlatiladi: 1) enum o\'rniga const object, 2) tuple yaratish, 3) discriminated union uchun aniq qiymatlar, 4) config ob\'ektlar. Deep readonly effekti bor — nested ob\'ektlar ham readonly bo\'ladi.',
    },
    {
      question: 'Non-null assertion (!) va optional chaining (?.) farqi nima?',
      answer:
        '! — faqat TypeScript uchun, runtime da yo\'qoladi. null/undefined bo\'lsa runtime xato. ?. — runtime da ishlaydi, null/undefined bo\'lsa undefined qaytaradi. ! — "bu hech qachon null bo\'lmaydi" degan da\'vo. ?. — "null bo\'lishi mumkin, xavfsiz tekshir". Production kodda doim ?. afzal, ! faqat 100% ishonchli bo\'lganda.',
    },
    {
      question: 'Qachon type assertion ishlatish kerak, qachon type guard?',
      answer:
        'Type guard — doim afzal, chunki runtime da ham tekshiradi. Assertion kerak bo\'ladigan holatlar: 1) DOM getElementById — qaytarish tipi HTMLElement | null, lekin biz aniq bilamiz. 2) JSON.parse — unknown qaytaradi, lekin schema ma\'lum. 3) Test mock. 4) Kutubxona tipi noto\'g\'ri. Qoida: assertion faqat runtime tekshiruv imkonsiz yoki keraksiz bo\'lganda.',
    },
  ],
}
