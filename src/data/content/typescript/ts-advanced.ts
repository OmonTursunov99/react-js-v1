import type { Topic } from '../../types'

export const tsAdvancedTopics: Topic[] = [
  // ─── 1. Generics ───
  {
    id: 'generics',
    title: 'Generics',
    importance: 3,
    status: 'to-learn',
    description:
      'Generic funksiyalar, classlar, constraintlar, default tiplar va conditional inference.',
    content: `
# Generics

Generics — tiplarni parametr sifatida berish imkoniyati. Bu qayta ishlatiladigan, type-safe kod yozish uchun asosiy vosita.

## Nima uchun kerak?

any ishlatmasdan, turli tiplar bilan ishlaydigan funksiya yozish uchun:

\`\`\`ts
function identity<T>(value: T): T {
  return value
}
identity("hello")  // string qaytaradi
identity(42)       // number qaytaradi
\`\`\`

\`T\` — tip parametri. Funksiya chaqirilganda aniq tip o'rniga qo'yiladi.

## Generic Constraints

\`extends\` kalit so'zi bilan tip parametrini cheklash:

\`\`\`ts
function getLength<T extends { length: number }>(item: T): number {
  return item.length
}
\`\`\`

Bu \`T\` faqat \`length\` property bo'lgan tiplarni qabul qiladi (string, array, va h.k.).

## Default Type Parameters

Tip parametriga default qiymat berish mumkin:
\`\`\`ts
interface ApiResponse<T = unknown> {
  data: T
  status: number
}
\`\`\`

## keyof va Generic

\`keyof\` ob'ektning kalitlarini union sifatida oladi. Generic bilan birgalikda ob'ekt propertylariga type-safe murojaat qilish mumkin.

## Multiple Type Parameters

Bir nechta tip parametr ishlatish mumkin: \`<T, U>\`, \`<K, V>\`.

## Generic Classes

Classlar ham generic bo'lishi mumkin — masalan, \`Stack<T>\`, \`Queue<T>\`.

## Conditional Type Inference (infer)

\`infer\` kalit so'zi conditional type ichida tipni "chiqarib olish" uchun ishlatiladi.

> **Amaliy qoida:** Generic kerak bo'lganda: 1) Funksiya turli tiplar bilan ishlashi kerak. 2) Kirish va chiqish tiplari bog'liq. 3) any dan qochish kerak.
    `.trim(),
    codeExamples: [
      {
        title: 'Generic funksiyalar',
        language: 'ts',
        description: 'Tipni parametr sifatida berish — qayta ishlatiladigan, type-safe kod.',
        code: `// Oddiy generic funksiya
function identity<T>(value: T): T {
  return value
}

const str = identity("hello")  // string
const num = identity(42)       // number

// Array bilan ishlaydigan funksiya
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0]
}

const first = firstElement([1, 2, 3])     // number | undefined
const firstStr = firstElement(["a", "b"]) // string | undefined

// Ikki parametrli generic
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second]
}

const p = pair("name", 25)  // [string, number]

// Generic arrow function (TSX da <T,> kerak)
const toArray = <T,>(value: T): T[] => [value]`,
      },
      {
        title: 'Constraints va keyof',
        language: 'ts',
        description: 'extends bilan cheklash, keyof bilan ob\'ekt kalitlarini olish.',
        code: `// Constraint — T da length bo'lishi shart
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length)
}

logLength("hello")     // OK — string da length bor
logLength([1, 2, 3])   // OK — array da length bor
// logLength(42)        // XATO — number da length yo'q

// keyof constraint — type-safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: "Ali", age: 25 }
const name = getProperty(user, "name")  // string
const age = getProperty(user, "age")    // number
// getProperty(user, "email")            // XATO — "email" yo'q

// Multiple constraints
interface HasId { id: number }
interface HasName { name: string }

function displayEntity<T extends HasId & HasName>(entity: T): string {
  return \`#\${entity.id}: \${entity.name}\`
}`,
      },
      {
        title: 'Generic Interface va Class',
        language: 'ts',
        description: 'Interface va classlar ham generic bo\'lishi mumkin.',
        code: `// Generic interface
interface Repository<T> {
  findById(id: number): Promise<T>
  findAll(): Promise<T[]>
  create(item: Omit<T, "id">): Promise<T>
  update(id: number, item: Partial<T>): Promise<T>
  delete(id: number): Promise<void>
}

interface User {
  id: number
  name: string
  email: string
}

// Ishlatish
class UserRepository implements Repository<User> {
  async findById(id: number) { /* ... */ return {} as User }
  async findAll() { return [] as User[] }
  async create(item: Omit<User, "id">) { return {} as User }
  async update(id: number, item: Partial<User>) { return {} as User }
  async delete(id: number) { /* ... */ }
}

// Generic class — Stack
class Stack<T> {
  private items: T[] = []
  push(item: T): void { this.items.push(item) }
  pop(): T | undefined { return this.items.pop() }
  peek(): T | undefined { return this.items[this.items.length - 1] }
}

const numStack = new Stack<number>()
numStack.push(1)
numStack.push(2)`,
      },
      {
        title: 'Default tiplar va infer',
        language: 'ts',
        description: 'Default generic parametrlar va conditional type inference.',
        code: `// Default type parameter
interface ApiResponse<T = unknown> {
  data: T
  status: number
  message: string
}

// T ko'rsatilmasa — unknown
const res1: ApiResponse = { data: "...", status: 200, message: "OK" }
// T ko'rsatilsa — aniq tip
const res2: ApiResponse<string[]> = {
  data: ["a", "b"],
  status: 200,
  message: "OK"
}

// infer — tipni "chiqarib olish"
type UnpackPromise<T> = T extends Promise<infer U> ? U : T

type A = UnpackPromise<Promise<string>>  // string
type B = UnpackPromise<number>           // number

// Funksiya qaytarish tipini olish
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never

type C = GetReturn<() => string>           // string
type D = GetReturn<(x: number) => boolean> // boolean`,
      },
    ],
    interviewQA: [
      {
        question: 'Generic nima va nima uchun kerak?',
        answer:
          'Generic — tiplarni parametr sifatida berish. any ishlatmasdan turli tiplar bilan ishlaydigan qayta ishlatiladigan kod yozish imkonini beradi. Masalan, identity<T>(value: T): T — qanday tip kirsa, shunday tip chiqadi. Bu type safety va code reuse ni birgalikda ta\'minlaydi.',
      },
      {
        question: 'Generic constraint (extends) nima uchun ishlatiladi?',
        answer:
          'extends bilan tip parametrini cheklash mumkin. Masalan, <T extends { length: number }> — faqat length property bo\'lgan tiplarni qabul qiladi. Bu generic funksiya ichida T ning ma\'lum propertylarini ishlatish imkonini beradi. Constraintsiz TypeScript T haqida hech narsa bilmaydi.',
      },
      {
        question: 'infer kalit so\'zi nima qiladi?',
        answer:
          'infer conditional type ichida tipni "chiqarib olish" uchun ishlatiladi. Masalan, T extends Promise<infer U> ? U : T — agar T Promise bo\'lsa, ichidagi tipni U ga oladi. ReturnType, Parameters kabi utility tiplar infer asosida ishlaydi. infer faqat extends true branchida ishlatiladi.',
      },
      {
        question: 'keyof T nima qaytaradi?',
        answer:
          'keyof T — ob\'ekt tipining barcha kalitlarini union sifatida qaytaradi. Masalan, keyof { name: string; age: number } = "name" | "age". Generic bilan birgalikda type-safe property access ta\'minlaydi: function get<T, K extends keyof T>(obj: T, key: K): T[K].',
      },
      {
        question: 'TSX faylda generic arrow function qanday yoziladi?',
        answer:
          'TSX da <T> JSX tag deb o\'ylashi mumkin. Yechim: <T,> — trailing comma qo\'shish. Masalan: const fn = <T,>(value: T): T[] => [value]. Yoki extends ishlatish: <T extends unknown>. Oddiy .ts faylda bu muammo yo\'q.',
      },
    ],
  },

  // ─── 2. Utility Types ───
  {
    id: 'utility-types',
    title: 'Utility Types',
    importance: 3,
    status: 'to-learn',
    description:
      'Partial, Required, Pick, Omit, Record, Exclude, Extract, ReturnType, Parameters — tayyor tip transformatsiyalari.',
    content: `
# Utility Types

TypeScript o'z ichiga olgan tayyor tip transformatsiyalari. Ular mavjud tiplardan yangi tiplar yaratish uchun ishlatiladi.

## Ob'ekt tiplari

**Partial<T>** — barcha propertylarni optional qiladi. Form state, update funksiyalar uchun qulay.

**Required<T>** — barcha propertylarni majburiy qiladi. Partial ning teskarisi.

**Pick<T, Keys>** — faqat tanlangan propertylarni oladi.

**Omit<T, Keys>** — tanlangan propertylarni olib tashlaydi.

**Record<Keys, Type>** — kalitlar va qiymat tipini belgilaydi. Dictionary/map uchun qulay.

**Readonly<T>** — barcha propertylarni readonly qiladi.

## Union tiplari

**Exclude<Union, Excluded>** — uniondan ma'lum a'zolarni olib tashlaydi.

**Extract<Union, Extracted>** — uniondan faqat mos keladiganlarini oladi.

**NonNullable<T>** — null va undefined ni olib tashlaydi.

## Funksiya tiplari

**ReturnType<F>** — funksiya qaytarish tipini oladi.

**Parameters<F>** — funksiya parametrlari tipini tuple sifatida oladi.

**ConstructorParameters<C>** — constructor parametrlari tipini oladi.

**InstanceType<C>** — class instance tipini oladi.

## Amaliy foydalanish

Utility typlar **kompozitsiya** qilish mumkin — bir nechtasini birgalikda ishlatish:
\`\`\`ts
type UserFormData = Partial<Pick<User, "name" | "email">>
\`\`\`

> **Muhim:** Utility typlar yangi tip yaratadi, asl tipni o'zgartirmaydi. Ular generic va conditional types asosida qurilgan.
    `.trim(),
    codeExamples: [
      {
        title: 'Partial, Required, Readonly',
        language: 'ts',
        description: 'Ob\'ekt propertylarini optional, majburiy yoki readonly qilish.',
        code: `interface User {
  id: number
  name: string
  email: string
  age?: number
}

// Partial — barcha propertylar optional
type UserUpdate = Partial<User>
// { id?: number; name?: string; email?: string; age?: number }

function updateUser(id: number, data: Partial<User>): void {
  // Faqat berilgan fieldlarni yangilash
}
updateUser(1, { name: "Ali" })  // OK — faqat name

// Required — barcha propertylar majburiy
type StrictUser = Required<User>
// { id: number; name: string; email: string; age: number }

// Readonly — o'zgartirib bo'lmaydi
type FrozenUser = Readonly<User>
const user: FrozenUser = { id: 1, name: "Ali", email: "a@b.com" }
// user.name = "Vali"  // XATO: readonly`,
      },
      {
        title: 'Pick, Omit, Record',
        language: 'ts',
        description: 'Propertylarni tanlash, olib tashlash va yangi ob\'ekt tuzilmasi yaratish.',
        code: `interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
}

// Pick — faqat tanlangan propertylar
type UserPublic = Pick<User, "id" | "name" | "email">
// { id: number; name: string; email: string }

// Omit — tanlangan propertylarni olib tashlash
type UserWithoutPassword = Omit<User, "password">
// { id: number; name: string; email: string; createdAt: Date }

// Record — kalit-qiymat juftligi
type UserRoles = Record<string, "admin" | "editor" | "viewer">
const roles: UserRoles = {
  ali: "admin",
  vali: "editor"
}

// Record bilan aniq kalitlar
type PageVisits = Record<"home" | "about" | "contact", number>
const visits: PageVisits = { home: 100, about: 50, contact: 25 }

// Kompozitsiya
type CreateUserDTO = Omit<User, "id" | "createdAt">
type UpdateUserDTO = Partial<Omit<User, "id">>`,
      },
      {
        title: 'Exclude, Extract, NonNullable',
        language: 'ts',
        description: 'Union tiplarni filtrlash.',
        code: `// Exclude — uniondan olib tashlash
type Status = "idle" | "loading" | "success" | "error"
type ActiveStatus = Exclude<Status, "idle">
// "loading" | "success" | "error"

// Extract — faqat mos keladiganlarni olish
type StringOrNumber = Extract<string | number | boolean, string | number>
// string | number

// NonNullable — null/undefined ni olib tashlash
type MaybeString = string | null | undefined
type DefiniteString = NonNullable<MaybeString>
// string

// Amaliy misol — event handling
type Events = "click" | "hover" | "scroll" | "resize"
type MouseEvents = Extract<Events, "click" | "hover">
type NonMouseEvents = Exclude<Events, "click" | "hover">

// Filtratsiya bilan type guard
function filterNull<T>(arr: (T | null)[]): NonNullable<T>[] {
  return arr.filter((item): item is NonNullable<T> => item !== null)
}`,
      },
      {
        title: 'ReturnType, Parameters',
        language: 'ts',
        description: 'Funksiyaning qaytarish tipi va parametrlari tipini olish.',
        code: `// ReturnType — funksiya qaytarish tipini olish
function fetchUser() {
  return { id: 1, name: "Ali", email: "a@b.com" }
}

type User = ReturnType<typeof fetchUser>
// { id: number; name: string; email: string }

// Parameters — parametrlar tuple tipini olish
function createUser(name: string, age: number, active: boolean) {
  return { name, age, active }
}

type CreateUserParams = Parameters<typeof createUser>
// [string, number, boolean]

// Amaliy misol — wrapper funksiya
function withLogging<F extends (...args: any[]) => any>(fn: F) {
  return (...args: Parameters<F>): ReturnType<F> => {
    console.log("Calling with:", args)
    const result = fn(...args)
    console.log("Result:", result)
    return result
  }
}

const loggedFetch = withLogging(fetchUser)`,
      },
    ],
    interviewQA: [
      {
        question: 'Partial va Required ning farqi nima?',
        answer:
          'Partial<T> barcha propertylarni optional (?) qiladi — update funksiyalar, form state uchun qulay. Required<T> barcha propertylarni majburiy qiladi — optional propertylarni ham required qiladi. Ular bir-birining teskarisi. Partial ichida mapped type: { [K in keyof T]?: T[K] }.',
      },
      {
        question: 'Pick va Omit qanday ishlaydi?',
        answer:
          'Pick<T, Keys> — faqat ko\'rsatilgan propertylarni tanlaydi: Pick<User, "name" | "email">. Omit<T, Keys> — ko\'rsatilgan propertylarni olib tashlaydi: Omit<User, "password">. Amalda: API response uchun Pick (faqat keraklilarni), DTO uchun Omit (id, createdAt ni olib tashlash).',
      },
      {
        question: 'Record<K, V> nima uchun ishlatiladi?',
        answer:
          'Record<Keys, Type> — kalitlar va qiymat tipini belgilab, ob\'ekt tip yaratadi. Record<string, number> — har qanday string kalit, number qiymat (dictionary). Record<"home"|"about", PageData> — aniq kalitlar bilan. Object.fromEntries, reducer natijalari tipini belgilashda qulay.',
      },
      {
        question: 'ReturnType qanday ishlaydi va qachon foydali?',
        answer:
          'ReturnType<F> funksiya tipining qaytarish qiymatini oladi. typeof bilan birga: ReturnType<typeof fn>. Foydali holatlari: 1) Funksiya qaytarish tipini alohida yozmaslik. 2) Third-party funksiya tipi kerak bo\'lganda. 3) Wrapper funksiya yaratishda. Ichida conditional type va infer ishlatiladi: T extends (...args: any) => infer R ? R : any.',
      },
      {
        question: 'Utility typlarni qanday kompozitsiya qilish mumkin?',
        answer:
          'Utility typlarni ichma-ich ishlatish mumkin: Partial<Pick<User, "name" | "email">> — faqat name va email, ikkalasi optional. Omit<Required<User>, "id"> — barcha fieldlar majburiy, id siz. Bu kompozitsiya murakkab DTOlar yaratishda juda qulay.',
      },
    ],
  },

  // ─── 3. Conditional Types ───
  {
    id: 'conditional-types',
    title: 'Conditional Types',
    importance: 2,
    status: 'to-learn',
    description:
      'Conditional types, infer kalit so\'zi va distributive conditionals.',
    content: `
# Conditional Types

Conditional type — tiplar ustida "agar-unda" logikasi. Tip darajasida shart tekshirish imkonini beradi.

## Asosiy sintaksis

\`\`\`ts
T extends U ? X : Y
\`\`\`

Agar T tipi U ga mos kelsa — X, aks holda — Y qaytaradi.

## Oddiy misollar

\`\`\`ts
type IsString<T> = T extends string ? true : false
type A = IsString<"hello">  // true
type B = IsString<42>       // false
\`\`\`

## infer bilan tip chiqarish

\`infer\` conditional type ichida tipning bir qismini "chiqarib olish" uchun ishlatiladi:

\`\`\`ts
type UnpackArray<T> = T extends (infer U)[] ? U : T
type X = UnpackArray<string[]>  // string
\`\`\`

## Distributive Conditionals

**Muhim xususiyat:** Agar T **naked type parameter** bo'lsa va union berilsa, conditional type har bir a'zoga alohida qo'llanadi:

\`\`\`ts
type Filter<T> = T extends string ? T : never
type R = Filter<"a" | 1 | "b" | 2>  // "a" | "b"
\`\`\`

Bu Exclude va Extract utility typlar ishlash prinsipi.

## Distributive ni o'chirish

Agar distributive xatti-harakat kerak bo'lmasa, T ni tuple ga o'rash:
\`\`\`ts
type IsUnion<T> = [T] extends [string] ? true : false
\`\`\`

## Amaliy foydalanish

1. **Tip filtrlash** — uniondan ma'lum tiplarni ajratish
2. **Tip transformatsiya** — bir tipdan boshqasiga o'tkazish
3. **Recursive types** — ichma-ich tuzilmalarni boshqarish
4. **Overload simulyatsiya** — kirish tipiga qarab chiqish tipini o'zgartirish

> **Ogohlantirish:** Conditional types murakkablashganda o'qilishi qiyinlashadi. Oddiy hollarda ulardan qoching — faqat haqiqatan kerak bo'lganda ishlatilsin.
    `.trim(),
    codeExamples: [
      {
        title: 'Asosiy conditional types',
        language: 'ts',
        description: 'Tip darajasida shart tekshirish.',
        code: `// Oddiy conditional type
type IsString<T> = T extends string ? "ha" : "yo'q"

type A = IsString<string>   // "ha"
type B = IsString<number>   // "yo'q"

// Amaliy misol — API response tipi
type ApiResponse<T> = T extends undefined
  ? { success: boolean }
  : { success: boolean; data: T }

type WithData = ApiResponse<string[]>
// { success: boolean; data: string[] }

type WithoutData = ApiResponse<undefined>
// { success: boolean }

// Nested conditional
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends Function ? "function" :
  "object"

type T1 = TypeName<string>      // "string"
type T2 = TypeName<() => void>  // "function"`,
      },
      {
        title: 'infer bilan tip chiqarish',
        language: 'ts',
        description: 'Conditional type ichida tipning qismini "chiqarib olish".',
        code: `// Array ichidagi tipni olish
type UnpackArray<T> = T extends (infer U)[] ? U : T
type A = UnpackArray<string[]>   // string
type B = UnpackArray<number>     // number

// Promise ichidagi tipni olish
type UnpackPromise<T> = T extends Promise<infer U> ? U : T
type C = UnpackPromise<Promise<string>>  // string

// Funksiya parametrlarini olish
type FirstArg<T> = T extends (first: infer F, ...args: any[]) => any
  ? F
  : never

type D = FirstArg<(name: string, age: number) => void>  // string

// Deep unpack — recursive
type DeepUnpack<T> =
  T extends Promise<infer U> ? DeepUnpack<U> :
  T extends (infer U)[] ? U :
  T

type E = DeepUnpack<Promise<Promise<string[]>>>  // string`,
      },
      {
        title: 'Distributive conditionals',
        language: 'ts',
        description: 'Union har bir a\'zosiga alohida qo\'llanishi.',
        code: `// Distributive — har bir a'zo alohida tekshiriladi
type ToArray<T> = T extends any ? T[] : never

type A = ToArray<string | number>
// string[] | number[] (HAR BIR a'zo uchun alohida)
// EMAS: (string | number)[]

// Exclude ishlash prinsipi
type MyExclude<T, U> = T extends U ? never : T

type B = MyExclude<"a" | "b" | "c", "a" | "c">
// "b"
// Qanday ishlaydi:
// "a" extends "a"|"c" ? never : "a" → never
// "b" extends "a"|"c" ? never : "b" → "b"
// "c" extends "a"|"c" ? never : "c" → never
// Natija: never | "b" | never = "b"

// Distributive ni O'CHIRISH — tuple bilan
type NonDistributive<T> = [T] extends [string] ? "string" : "boshqa"

type C = NonDistributive<string | number>  // "boshqa"
// (union butunlay tekshiriladi, alohida-alohida emas)`,
      },
    ],
    interviewQA: [
      {
        question: 'Conditional type nima va qanday sintaksisi bor?',
        answer:
          'Conditional type — tip darajasida shart tekshirish: T extends U ? X : Y. Agar T tipi U ga assignable bo\'lsa X qaytaradi, aks holda Y. Bu ternary operator ga o\'xshash, lekin tiplar uchun. Utility types (Exclude, Extract, ReturnType) conditional types asosida qurilgan.',
      },
      {
        question: 'Distributive conditional types nima?',
        answer:
          'Agar conditional type da T naked type parameter bo\'lsa va union berilsa, har bir union a\'zosiga alohida qo\'llanadi. ToArray<string | number> = string[] | number[]. Bu Exclude, Extract ishlash prinsipi. O\'chirish uchun tuple bilan o\'rash: [T] extends [U]. Agar T naked bo\'lmasa (masalan, T[] extends ...) distributive ishlamaydi.',
      },
      {
        question: 'infer kalit so\'zi qanday ishlaydi?',
        answer:
          'infer conditional type ning extends qismida tipning bir bo\'lagini o\'zgaruvchiga olish uchun ishlatiladi. Faqat true branchida foydalanish mumkin. Masalan: T extends Promise<infer U> ? U : T — Promise ichidagi tipni U ga oladi. Funksiya parametrlari, qaytarish tipi, array element tipi va boshqalarni chiqarish mumkin.',
      },
    ],
  },

  // ─── 4. Mapped Types ───
  {
    id: 'mapped-types',
    title: 'Mapped Types',
    importance: 2,
    status: 'to-learn',
    description:
      'Mapped types, key remapping va template literal types bilan birga ishlatish.',
    content: `
# Mapped Types

Mapped type — mavjud tipning har bir propertysi ustidan iteratsiya qilib, yangi tip yaratish.

## Asosiy sintaksis

\`\`\`ts
type Mapped<T> = {
  [K in keyof T]: NewType
}
\`\`\`

\`K in keyof T\` — T ning har bir kaliti uchun yangi property yaratadi.

## Modifier lar

**readonly** va **optional (?)** modifierlarni qo'shish yoki olib tashlash:

\`\`\`ts
// Barcha propertylarni readonly qilish
type Readonly<T> = { readonly [K in keyof T]: T[K] }

// Barcha propertylarni optional qilish
type Partial<T> = { [K in keyof T]?: T[K] }

// readonly ni OLIB TASHLASH
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

// optional ni OLIB TASHLASH
type Required<T> = { [K in keyof T]-?: T[K] }
\`\`\`

## Key Remapping (as)

TypeScript 4.1+ da kalitlarni o'zgartirish mumkin:

\`\`\`ts
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<K & string>}\`]: () => T[K]
}
\`\`\`

## Filtrlash

\`as\` bilan \`never\` qaytarsa — bu kalit o'chiriladi:

\`\`\`ts
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
\`\`\`

## Partial, Required, Readonly — barchasi mapped types

TypeScript built-in utility typlarning ko'pchiligi mapped types asosida qurilgan. Mapped types bu utility typlarni tushunishning kaliti.

> **Muhim:** Mapped types faqat ob'ekt tiplari ustida ishlaydi. Union yoki primitiv tiplar uchun conditional types ishlatilsin.
    `.trim(),
    codeExamples: [
      {
        title: 'Asosiy mapped types',
        language: 'ts',
        description: 'Mavjud tipning har bir propertysini o\'zgartirish.',
        code: `// Barcha propertylarni optional qilish (Partial ning ishi)
type MyPartial<T> = {
  [K in keyof T]?: T[K]
}

// Barcha propertylarni readonly qilish
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Barcha qiymatlarni string ga aylantirish
type Stringify<T> = {
  [K in keyof T]: string
}

interface User {
  id: number
  name: string
  active: boolean
}

type StringUser = Stringify<User>
// { id: string; name: string; active: string }

// Modifier olib tashlash
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type RequiredUser = {
  [K in keyof User]-?: User[K]
}`,
      },
      {
        title: 'Key Remapping (as)',
        language: 'ts',
        description: 'Kalit nomlarini o\'zgartirish — getter, setter patternlar.',
        code: `interface User {
  name: string
  age: number
  email: string
}

// Getter funksiyalar yaratish
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<K & string>}\`]: () => T[K]
}

type UserGetters = Getters<User>
// {
//   getName: () => string
//   getAge: () => number
//   getEmail: () => string
// }

// Setter funksiyalar
type Setters<T> = {
  [K in keyof T as \`set\${Capitalize<K & string>}\`]: (value: T[K]) => void
}

// Event handler tiplar
type EventHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<K & string>}Change\`]: (
    newValue: T[K],
    oldValue: T[K]
  ) => void
}

type UserEvents = EventHandlers<User>
// {
//   onNameChange: (newValue: string, oldValue: string) => void
//   onAgeChange: (newValue: number, oldValue: number) => void
//   onEmailChange: (newValue: string, oldValue: string) => void
// }`,
      },
      {
        title: 'Filtrlash va murakkab transformatsiyalar',
        language: 'ts',
        description: 'never bilan propertylarni filtrlash, conditional bilan tip o\'zgartirish.',
        code: `interface Model {
  id: number
  name: string
  age: number
  email: string
  isActive: boolean
}

// Faqat string propertylarni olish
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}

type ModelStrings = StringProps<Model>
// { name: string; email: string }

// Faqat funksiya bo'lmagan propertylarni olish
type DataProps<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K]
}

// Nullable versiya
type NullableProps<T> = {
  [K in keyof T]: T[K] | null
}

// Promise bilan o'rash
type AsyncProps<T> = {
  [K in keyof T]: Promise<T[K]>
}

type AsyncModel = AsyncProps<Pick<Model, "name" | "email">>
// { name: Promise<string>; email: Promise<string> }`,
      },
    ],
    interviewQA: [
      {
        question: 'Mapped type nima va qanday ishlaydi?',
        answer:
          'Mapped type — mavjud tip propertylarini iteratsiya qilib yangi tip yaratish. Sintaksis: { [K in keyof T]: NewType }. K har bir property kaliti, T[K] uning qiymati. Partial, Required, Readonly kabi utility typlar mapped types asosida qurilgan.',
      },
      {
        question: 'Key remapping (as) nima?',
        answer:
          'TypeScript 4.1+ da as bilan kalit nomlarini o\'zgartirish mumkin: [K in keyof T as `get${Capitalize<K>}`]. Bu getter/setter, event handler tiplar yaratish uchun qulay. as never qaytarsa — property o\'chiriladi (filtrlash). Template literal types bilan birgalikda kuchli.',
      },
      {
        question: 'Modifier lar (+/-, readonly, ?) qanday ishlaydi?',
        answer:
          '+ modifier qo\'shadi (default), - olib tashlaydi. { readonly [K in keyof T]: T[K] } — readonly qo\'shadi. { -readonly [K in keyof T]: T[K] } — readonly ni olib tashlaydi. { [K in keyof T]-?: T[K] } — optional ni olib tashlaydi (Required). Bu Partial, Required, Readonly, Mutable tiplarning asosi.',
      },
    ],
  },

  // ─── 5. Template Literal Types ───
  {
    id: 'template-literal-types',
    title: 'Template Literal Types',
    importance: 2,
    status: 'to-learn',
    description:
      'Template literal types, intrinsic string types (Uppercase, Lowercase, Capitalize, Uncapitalize).',
    content: `
# Template Literal Types

TypeScript 4.1+ da string tiplarini template literal yordamida yaratish mumkin.

## Asosiy sintaksis

\`\`\`ts
type Greeting = \`Hello, \${string}\`
// "Hello, " bilan boshlanadigan har qanday string
\`\`\`

## Union bilan kombinatsiya

Eng kuchli xususiyat — union tiplar bilan birga ishlashi:

\`\`\`ts
type Color = "red" | "blue"
type Size = "sm" | "lg"
type ClassName = \`\${Color}-\${Size}\`
// "red-sm" | "red-lg" | "blue-sm" | "blue-lg"
\`\`\`

Har bir kombinatsiya uchun alohida literal yaratiladi — **kartezian ko'paytma**.

## Intrinsic String Types

TypeScript 4 ta o'rnatilgan string transformatsiya tipi bor:

- **Uppercase<S>** — barchasini KATTA HARFGA
- **Lowercase<S>** — barchasini kichik harfga
- **Capitalize<S>** — birinchi harfni katta
- **Uncapitalize<S>** — birinchi harfni kichik

## Amaliy foydalanish

1. **CSS class nomlari** — type-safe class generatsiya
2. **Event nomlari** — "onClick", "onChange" kabi
3. **API endpoint lari** — "/api/users", "/api/posts"
4. **Object key pattern** — getter/setter nomlari
5. **i18n kalitlari** — tarjima kalitlarini tekshirish

## Mapped types bilan birga

Key remapping (as) va template literal types birgalikda ishlatilsa, ob'ekt propertylarini nomlash patternlarini yaratish mumkin.

> **Eslatma:** Template literal types compile-time xususiyat — runtime da oddiy string bo'lib qoladi. Lekin IDE autocomplete va tip tekshiruvi uchun juda foydali.
    `.trim(),
    codeExamples: [
      {
        title: 'Asosiy template literal types',
        language: 'ts',
        description: 'String tiplarini template yordamida yaratish.',
        code: `// Oddiy template literal type
type Greeting = \`Hello, \${string}\`

const a: Greeting = "Hello, Ali"    // OK
// const b: Greeting = "Hi, Ali"    // XATO

// Union bilan — kartezian ko'paytma
type Color = "red" | "green" | "blue"
type Shade = "light" | "dark"

type ColorVariant = \`\${Shade}-\${Color}\`
// "light-red" | "light-green" | "light-blue"
// | "dark-red" | "dark-green" | "dark-blue"

// CSS spacing
type Side = "top" | "right" | "bottom" | "left"
type SpacingProp = \`margin-\${Side}\` | \`padding-\${Side}\`
// "margin-top" | "margin-right" | ... | "padding-left"

// Event names
type DomEvent = "click" | "focus" | "blur"
type EventHandler = \`on\${Capitalize<DomEvent>}\`
// "onClick" | "onFocus" | "onBlur"`,
      },
      {
        title: 'Intrinsic String Types',
        language: 'ts',
        description: 'Uppercase, Lowercase, Capitalize, Uncapitalize — o\'rnatilgan transformatsiyalar.',
        code: `// Uppercase — barchasini KATTA HARFGA
type Loud = Uppercase<"hello">  // "HELLO"

// Lowercase — barchasini kichik harfga
type Quiet = Lowercase<"HELLO">  // "hello"

// Capitalize — birinchi harfni katta
type Title = Capitalize<"hello">  // "Hello"

// Uncapitalize — birinchi harfni kichik
type Lower = Uncapitalize<"Hello">  // "hello"

// Union bilan
type Events = "click" | "hover" | "scroll"
type HandlerNames = \`on\${Capitalize<Events>}\`
// "onClick" | "onHover" | "onScroll"

// Amaliy misol — CSS variable tiplar
type CssVar<T extends string> = \`--\${T}\`
type ThemeVars = CssVar<"color-primary" | "color-secondary" | "font-size">
// "--color-primary" | "--color-secondary" | "--font-size"

// SCREAMING_SNAKE_CASE uchun
type HttpMethod = Uppercase<"get" | "post" | "put" | "delete">
// "GET" | "POST" | "PUT" | "DELETE"`,
      },
      {
        title: 'Amaliy pattern — type-safe event system',
        language: 'ts',
        description: 'Template literal types bilan event tizimi yaratish.',
        code: `// Type-safe event emitter
interface UserEvents {
  name: string
  age: number
  email: string
}

// Event handler tiplar avtomatik yaratish
type EventMap<T> = {
  [K in keyof T as \`on\${Capitalize<K & string>}Change\`]: (
    value: T[K]
  ) => void
}

type UserEventHandlers = EventMap<UserEvents>
// {
//   onNameChange: (value: string) => void
//   onAgeChange: (value: number) => void
//   onEmailChange: (value: string) => void
// }

// Type-safe path builder
type ApiVersion = "v1" | "v2"
type Resource = "users" | "posts" | "comments"
type ApiPath = \`/api/\${ApiVersion}/\${Resource}\`
// "/api/v1/users" | "/api/v1/posts" | ... (6 ta variant)

// Nested path
type UserAction = "list" | "create" | "update" | "delete"
type UserEndpoint = \`/api/v1/users/\${UserAction}\``,
      },
    ],
    interviewQA: [
      {
        question: 'Template literal type nima?',
        answer:
          'Template literal type — string tiplarini backtick va ${} yordamida yaratish. Union bilan birgalikda kartezian ko\'paytma hosil qiladi: `${A}-${B}` — A va B ning barcha kombinatsiyalari. CSS class nomlari, event handler nomlari, API path lar uchun type-safe tiplar yaratish imkonini beradi.',
      },
      {
        question: 'Intrinsic string types qaysilar va nima qiladi?',
        answer:
          '4 ta built-in string transformatsiya: Uppercase<S> — KATTA HARFGA, Lowercase<S> — kichik harfga, Capitalize<S> — birinchi harfni katta, Uncapitalize<S> — birinchi harfni kichik. Ular template literal types va mapped types bilan birgalikda ishlatiladi — masalan, `on${Capitalize<K>}` event handler nomlari yaratish uchun.',
      },
      {
        question: 'Template literal types qachon foydali?',
        answer:
          'Foydali holatlari: 1) Event handler nomlari — onClick, onChange. 2) CSS utility class nomlari — "mt-4", "text-red". 3) API endpoint tiplar — "/api/v1/users". 4) i18n kalit nomlari. 5) Key remapping da getter/setter nomlari. Ular compile-time type safety beradi — IDE autocomplete va xatolarni oldini olish.',
      },
    ],
  },
]
