import type { Topic } from '../../../types'

export const brandedTypes: Topic = {
  id: 'branded-types',
  title: 'Branded Types',
  importance: 2,
  status: 'to-learn',
  description:
    'Nominal typing TypeScript da, brand pattern, runtime validation va Zod bilan branded types.',
  content: `
# BRANDED TYPES
═══════════════════════════════════════

TypeScript **structural typing** ishlatadi — ikki tip strukturasi bir xil bo'lsa, ular bir-biriga assign bo'ladi. Lekin ba'zan semantik farq muhim: UserId va PostId ikkalasi ham string, lekin aralashtirib yuborish xato.

## STRUCTURAL TYPING MUAMMOSI

TypeScript da ikki tip bir xil strukturada bo'lsa — ular teng hisoblanadi:

\`\`\`
type UserId = string
type PostId = string
\`\`\`

Bu ikki tip o'zaro almashtiriladi — funksiya UserId kutsa, PostId ham qabul qiladi. Bu runtime xatolarga olib keladi.

## BRAND PATTERN

Brand — tipga yashirin "belgi" qo'shish orqali NOMINAL typing simulyatsiya qilish:

\`\`\`
type UserId = string & { __brand: "UserId" }
type PostId = string & { __brand: "PostId" }
\`\`\`

Endi UserId va PostId turli tiplar — bir-biriga assign bo'lmaydi. \`__brand\` faqat tip sistemasida mavjud, runtime da ob'ektda bu property yo'q.

MUHIM: Brand property runtime da mavjud emas. Bu "phantom type" — faqat kompilyatsiya vaqtida tekshiriladi.

## RUNTIME VALIDATION + BRAND

Brand tipni yaratish uchun "constructor" funksiya kerak — validatsiya qilib, branded tip qaytaradi:

\`\`\`
function createUserId(id: string): UserId {
  if (!id.startsWith("u_")) throw new Error("Invalid UserId")
  return id as UserId
}
\`\`\`

## AMALIY MISOLLAR

1. **UserId vs PostId** — ID larni aralashtirib yubormaslik
2. **Email** — validatsiya qilingan email string
3. **PositiveNumber** — faqat musbat sonlar
4. **NonEmptyString** — bo'sh bo'lmagan string
5. **URL, Slug, HexColor** — format validatsiya

## ZOD BILAN BRANDED TYPES

Zod kutubxonasi \`.brand()\` methodi bilan branded type yaratishni soddalashtiradi. Schema validatsiya va brand bir joyda.
  `.trim(),
  codeExamples: [
    {
      title: 'Structural typing muammosi',
      language: 'ts',
      description: 'Nima uchun oddiy type alias yetarli emas.',
      code: `// Muammo — ikkala tip ham string
type UserId = string
type PostId = string

function getUser(id: UserId): void {
  console.log("Fetching user:", id)
}

function getPost(id: PostId): void {
  console.log("Fetching post:", id)
}

const userId: UserId = "u_123"
const postId: PostId = "p_456"

// XATO lekin TypeScript xato BERMAYDI!
getUser(postId)  // PostId -> UserId — OK (structural typing)
getPost(userId)  // UserId -> PostId — OK

// Bu runtime da noto'g'ri ma'lumot olishga olib keladi
// getUser("p_456") — user topilmaydi yoki noto'g'ri user

// Hatto shunchaki string ham qabul qilinadi
getUser("random-string")  // TypeScript xato bermaydi`,
    },
    {
      title: 'Brand pattern — yechim',
      language: 'ts',
      description: 'Branded type yaratish va ishlatish.',
      code: `// Brand type — intersection bilan phantom property
type Brand<T, B extends string> = T & { readonly __brand: B }

// Aniq branded tiplar
type UserId = Brand<string, "UserId">
type PostId = Brand<string, "PostId">
type Email = Brand<string, "Email">

// Constructor funksiyalar — validatsiya + brand
function createUserId(id: string): UserId {
  if (!id.startsWith("u_")) {
    throw new Error("UserId must start with u_")
  }
  return id as UserId
}

function createPostId(id: string): PostId {
  if (!id.startsWith("p_")) {
    throw new Error("PostId must start with p_")
  }
  return id as PostId
}

function createEmail(value: string): Email {
  if (!value.includes("@")) {
    throw new Error("Invalid email format")
  }
  return value as Email
}

// Endi TypeScript himoya qiladi
function getUser(id: UserId): void {
  console.log("Fetching user:", id)
}

const userId = createUserId("u_123")
const postId = createPostId("p_456")

getUser(userId)    // OK
// getUser(postId) // XATO: PostId !== UserId
// getUser("abc")  // XATO: string !== UserId`,
    },
    {
      title: 'Amaliy branded types',
      language: 'ts',
      description: 'PositiveNumber, NonEmptyString va boshqa amaliy misollar.',
      code: `// Reusable Brand utility
type Brand<T, B extends string> = T & { readonly __brand: B }

// PositiveNumber — faqat musbat sonlar
type PositiveNumber = Brand<number, "Positive">

function toPositive(n: number): PositiveNumber {
  if (n <= 0) throw new RangeError("Must be positive")
  return n as PositiveNumber
}

// NonEmptyString — bo'sh bo'lmagan string
type NonEmptyString = Brand<string, "NonEmpty">

function nonEmpty(s: string): NonEmptyString {
  if (s.trim().length === 0) {
    throw new Error("String must not be empty")
  }
  return s as NonEmptyString
}

// Amaliy ishlatish
interface Product {
  id: Brand<string, "ProductId">
  name: NonEmptyString
  price: PositiveNumber
  stock: PositiveNumber
}

function createProduct(
  name: string,
  price: number,
  stock: number
): Product {
  return {
    id: crypto.randomUUID() as Brand<string, "ProductId">,
    name: nonEmpty(name),
    price: toPositive(price),
    stock: toPositive(stock),
  }
}

// Narx hisoblash — faqat PositiveNumber qabul qiladi
function calculateDiscount(
  price: PositiveNumber,
  percent: PositiveNumber
): PositiveNumber {
  const result = price * (1 - percent / 100)
  return toPositive(result)
}`,
    },
    {
      title: 'Zod bilan branded types',
      language: 'ts',
      description: 'Zod .brand() bilan validatsiya va branded type birga.',
      code: `import { z } from "zod"

// Zod schema + .brand()
const UserIdSchema = z
  .string()
  .startsWith("u_")
  .brand<"UserId">()

const EmailSchema = z
  .string()
  .email()
  .brand<"Email">()

const PositiveSchema = z
  .number()
  .positive()
  .brand<"Positive">()

// Tipni ajratib olish
type UserId = z.infer<typeof UserIdSchema>
type Email = z.infer<typeof EmailSchema>
type Positive = z.infer<typeof PositiveSchema>

// Validatsiya + branded type avtomatik
const userId = UserIdSchema.parse("u_123")  // UserId tipi
const email = EmailSchema.parse("ali@test.com")  // Email tipi

// Xato bo'lsa throw qiladi
// UserIdSchema.parse("invalid")  // ZodError

// safeParse — throw qilmaydi
const result = EmailSchema.safeParse("not-email")
if (result.success) {
  const validEmail: Email = result.data
} else {
  console.error(result.error.issues)
}

// API da ishlatish
interface CreateUserDTO {
  name: string
  email: Email
  age: Positive
}

function createUser(dto: CreateUserDTO) {
  // email va age allaqachon validatsiya qilingan
  console.log(dto.email, dto.age)
}`,
    },
  ],
  interviewQA: [
    {
      question: 'Branded type nima va nima uchun kerak?',
      answer:
        'Branded type — TypeScript ning structural typing da nominal typing simulyatsiya qilish usuli. type UserId = string & { __brand: "UserId" } — string ga phantom property qo\'shiladi. Runtime da bu property yo\'q, faqat tip sistemasida mavjud. Kerak: bir xil primitiv tipdagi qiymatlarni aralashtirib yubormaslik uchun — UserId va PostId, Email va oddiy string.',
    },
    {
      question: 'Structural typing va nominal typing farqi nima?',
      answer:
        'Structural typing (TypeScript, Go) — tiplar tuzilmasi bir xil bo\'lsa, ular teng. { name: string } va { name: string } har doim mos keladi. Nominal typing (Java, C#) — tiplar nomi muhim, tuzilmasi bir xil bo\'lsa ham turli tiplar. TypeScript da branded types nominal typing ni simulyatsiya qiladi — phantom property orqali strukturani farqlaydi.',
    },
    {
      question: 'Brand pattern qanday ishlaydi — runtime da __brand property bormi?',
      answer:
        'Yo\'q, __brand faqat TypeScript tip sistemasida mavjud. string & { __brand: "UserId" } intersection type. Runtime da qiymat oddiy string bo\'lib qoladi. as UserId assertion faqat kompilyatsiya vaqtida ishlaydi. Shuning uchun constructor funksiya (createUserId) kerak — validatsiya runtime da bo\'ladi, brand faqat tip uchun.',
    },
    {
      question: 'Branded type bilan Zod qanday birgalikda ishlaydi?',
      answer:
        'Zod .brand() methodi schema ga branded type qo\'shadi. z.string().email().brand<"Email">() — parse qilganda Email branded tipi qaytaradi. Afzalligi: validatsiya va branding bir joyda, alohida constructor funksiya kerak emas. z.infer<typeof schema> bilan tipni ajratib olish mumkin. safeParse xato tashlamaydi — Result pattern.',
    },
    {
      question: 'Qanday hollarda branded types ishlatish ortiqcha (overkill)?',
      answer:
        'Kichik loyihalarda yoki ID lar faqat bitta kontekstda ishlatiladigan bo\'lsa — ortiqcha. Kerak bo\'ladigan holatlar: 1) katta loyiha, ko\'p ID turlari (UserId, PostId, OrderId), 2) domenga xos validatsiya (Email, Phone), 3) matematik cheklovlar (PositiveNumber, Percentage), 4) API boundary — tashqi ma\'lumotni ichki tipga aylantirish. Qoida: xato narxi yuqori bo\'lsa — brand ishlat.',
    },
  ],
}
