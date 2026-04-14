import type { Topic } from '../../../types'

export const inferDeep: Topic = {
  id: 'infer-deep',
  title: 'Infer Deep',
  importance: 2,
  status: 'to-learn',
  description:
    'infer keyword, return type ajratish, array/promise unwrap, tuple manipulation va string manipulation.',
  content: `
# INFER DEEP
═══════════════════════════════════════

\`infer\` — conditional type ichida **tipni "tutib olish"** uchun kalit so'z. Pattern matching kabi ishlaydi: tip strukturasidan kerakli qismni ajratib oladi.

## ASOSIY SINTAKSIS

\`\`\`
T extends SomePattern<infer U> ? U : Fallback
\`\`\`

Agar T pattern ga mos kelsa — U shu pattern ichidagi tipni "ushlaydi". Mos kelmasa — Fallback qaytadi.

MUHIM: infer FAQAT conditional type ning \`extends\` qismida ishlatiladi. Boshqa joyda ishlatib bo'lmaydi.

## RETURN TYPE AJRATIB OLISH

Funksiya tipidan qaytarish tipini olish:
\`T extends (...args: any[]) => infer R ? R : never\`

Bu aslida TypeScript ning built-in \`ReturnType<T>\` utility type shu pattern asosida yaratilgan.

## ARRAY ELEMENT TYPE

Massiv element tipini olish:
\`T extends (infer U)[] ? U : never\`

## PROMISE UNWRAP

Promise ichidagi tipni olish — recursive bo'lishi mumkin:
\`T extends Promise<infer U> ? U : T\`

Nested Promise (Promise<Promise<string>>) uchun recursive variant kerak.

## TUPLE MANIPULATION

Tuple elementlarini ajratib olish:
- First: \`T extends [infer F, ...any[]] ? F : never\`
- Last: \`T extends [...any[], infer L] ? L : never\`
- Rest: \`T extends [any, ...infer R] ? R : never\`

## STRING MANIPULATION

Template literal tiplar bilan string ni parchalash:
- Split: \`S extends \\\`\${infer Head}\${Delimiter}\${infer Tail}\\\`\`
- Replace: birinchi mos kelgan qismni almashtirish
- Trim: bosh va oxiridagi bo'shliqlarni olib tashlash

MUHIM: String manipulation tiplari FAQAT literal string bilan ishlaydi. Umumiy string tipi bilan natija bermaydi.
  `.trim(),
  codeExamples: [
    {
      title: 'Asosiy infer pattern',
      language: 'ts',
      description: 'Return type va argument type ajratib olish.',
      code: `// Return type ajratib olish
type MyReturnType<T> =
  T extends (...args: any[]) => infer R ? R : never

function getUser() {
  return { id: 1, name: "Ali", email: "ali@test.com" }
}

type UserResult = MyReturnType<typeof getUser>
// { id: number; name: string; email: string }

// Parametr tiplarini ajratib olish
type MyParameters<T> =
  T extends (...args: infer P) => any ? P : never

type Params = MyParameters<typeof getUser>
// [] — parametrsiz

function add(a: number, b: number): number { return a + b }
type AddParams = MyParameters<typeof add>
// [a: number, b: number]

// Birinchi parametr
type FirstParam<T> =
  T extends (first: infer F, ...rest: any[]) => any ? F : never

type First = FirstParam<typeof add>  // number

// Constructor tipini ajratib olish
type InstanceOf<T> =
  T extends new (...args: any[]) => infer I ? I : never

class User { name = "Ali" }
type UserInstance = InstanceOf<typeof User>  // User`,
    },
    {
      title: 'Array va Promise unwrap',
      language: 'ts',
      description: 'Massiv elementi va Promise ichidagi tipni olish.',
      code: `// Array element type
type ElementOf<T> = T extends (infer U)[] ? U : never

type StrEl = ElementOf<string[]>     // string
type NumEl = ElementOf<number[]>     // number
type Mixed = ElementOf<(string | number)[]>  // string | number

// Promise unwrap — bir daraja
type Awaited1<T> = T extends Promise<infer U> ? U : T

type A = Awaited1<Promise<string>>           // string
type B = Awaited1<Promise<Promise<number>>>  // Promise<number> — faqat 1 daraja!

// Recursive Promise unwrap (built-in Awaited shunga o'xshash)
type DeepAwaited<T> =
  T extends Promise<infer U> ? DeepAwaited<U> : T

type C = DeepAwaited<Promise<string>>           // string
type D = DeepAwaited<Promise<Promise<number>>>  // number
type E = DeepAwaited<string>                    // string (Promise emas)

// Amaliy misol — API response tipini olish
async function fetchUsers(): Promise<{ id: number; name: string }[]> {
  return [{ id: 1, name: "Ali" }]
}

type Users = DeepAwaited<ReturnType<typeof fetchUsers>>
// { id: number; name: string }[]

// Arrayni ham ochish
type FlatElement = ElementOf<Users>
// { id: number; name: string }`,
    },
    {
      title: 'Tuple manipulation',
      language: 'ts',
      description: 'Tuple dan element ajratish — first, last, rest.',
      code: `// First — birinchi element
type First<T extends any[]> =
  T extends [infer F, ...any[]] ? F : never

type F1 = First<[string, number, boolean]>  // string
type F2 = First<[42, "hello"]>              // 42
type F3 = First<[]>                         // never

// Last — oxirgi element
type Last<T extends any[]> =
  T extends [...any[], infer L] ? L : never

type L1 = Last<[string, number, boolean]>  // boolean
type L2 = Last<[42]>                       // 42

// Rest — birinchidan tashqari hammasi
type Tail<T extends any[]> =
  T extends [any, ...infer R] ? R : never

type T1 = Tail<[string, number, boolean]>  // [number, boolean]
type T2 = Tail<[string]>                   // []

// Init — oxirgidan tashqari hammasi
type Init<T extends any[]> =
  T extends [...infer I, any] ? I : never

type I1 = Init<[string, number, boolean]>  // [string, number]

// Length
type Length<T extends any[]> = T["length"]

type Len = Length<[1, 2, 3]>  // 3

// Push va Unshift
type Push<T extends any[], V> = [...T, V]
type Unshift<T extends any[], V> = [V, ...T]

type P = Push<[1, 2], 3>      // [1, 2, 3]
type U = Unshift<[2, 3], 1>   // [1, 2, 3]`,
    },
    {
      title: 'String manipulation types',
      language: 'ts',
      description: 'Template literal bilan string parchalash va o\'zgartirish.',
      code: `// Split — stringni ajratish
type Split<
  S extends string,
  D extends string
> = S extends \`\${infer Head}\${D}\${infer Tail}\`
  ? [Head, ...Split<Tail, D>]
  : [S]

type Parts = Split<"a.b.c", ".">
// ["a", "b", "c"]

// Replace — birinchi mos kelganini almashtirish
type Replace<
  S extends string,
  From extends string,
  To extends string
> = S extends \`\${infer Head}\${From}\${infer Tail}\`
  ? \`\${Head}\${To}\${Tail}\`
  : S

type R = Replace<"hello world", "world", "TS">
// "hello TS"

// ReplaceAll — hammasini almashtirish
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = S extends \`\${infer Head}\${From}\${infer Tail}\`
  ? ReplaceAll<\`\${Head}\${To}\${Tail}\`, From, To>
  : S

type RA = ReplaceAll<"a-b-c", "-", "_">
// "a_b_c"

// TrimLeft — bosh bo'shliqni olib tashlash
type TrimLeft<S extends string> =
  S extends \`\${" " | "\\n" | "\\t"}\${infer Rest}\`
    ? TrimLeft<Rest>
    : S

type TL = TrimLeft<"  hello">  // "hello"

// CamelCase oddiy misol
type CamelCase<S extends string> =
  S extends \`\${infer Head}_\${infer Tail}\`
    ? \`\${Head}\${Capitalize<CamelCase<Tail>>}\`
    : S

type CC = CamelCase<"user_first_name">
// "userFirstName"`,
    },
    {
      title: 'Murakkab infer patternlari',
      language: 'ts',
      description: 'Amaliy loyihalarda infer ishlatish.',
      code: `// Event handler tipini ajratib olish
type EventMap = {
  click: { x: number; y: number }
  change: { value: string }
  submit: { data: FormData }
}

type EventHandler<K extends keyof EventMap> =
  (event: EventMap[K]) => void

type ExtractEventData<T> =
  T extends (event: infer E) => void ? E : never

type ClickData = ExtractEventData<EventHandler<"click">>
// { x: number; y: number }

// React component props ajratib olish
type ComponentProps<T> =
  T extends React.ComponentType<infer P> ? P : never

// Funksiyadan this tipini olish
type ThisType<T> =
  T extends (this: infer U, ...args: any[]) => any ? U : never

function greet(this: { name: string }) {
  return this.name
}

type GreetThis = ThisType<typeof greet>
// { name: string }

// Union dan tuple (tartibi kafolatlanmaydi)
// Murakkab, lekin bilish foydali
type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends
  (x: infer I) => void ? I : never

type UI = UnionToIntersection<{ a: 1 } | { b: 2 }>
// { a: 1 } & { b: 2 }`,
    },
  ],
  interviewQA: [
    {
      question: 'infer kalit so\'zi nima qiladi?',
      answer:
        'infer — conditional type ichida tipni "tutib olish" (capture) uchun ishlatiladi. T extends Pattern<infer U> ? U : Fallback — agar T pattern ga mos kelsa, U shu pattern ichidagi tipni ushlaydi. Masalan, T extends Promise<infer U> ? U : T — Promise ichidagi tipni oladi. infer faqat extends dan keyin ishlatiladi.',
    },
    {
      question: 'ReturnType<T> qanday ishlaydi — ichki implementatsiyasi?',
      answer:
        'ReturnType<T> = T extends (...args: any[]) => infer R ? R : never. Funksiya tipidan qaytarish tipini infer bilan ushlaydi. Agar T funksiya tipiga mos kelsa — R qaytarish tipi, aks holda never. Xuddi shu pattern bilan Parameters<T>, ConstructorParameters<T>, InstanceType<T> ham ishlaydi.',
    },
    {
      question: 'Recursive conditional type bilan Promise unwrap qanday ishlaydi?',
      answer:
        'DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T. Agar T Promise bo\'lsa — ichidagi U ni oladi va yana tekshiradi (recursive). Promise<Promise<string>> -> DeepAwaited<string> -> string. TypeScript built-in Awaited tipi ham shunga o\'xshash, lekin PromiseLike ni ham qo\'llab-quvvatlaydi.',
    },
    {
      question: 'Tuple dan first va last elementni qanday olish mumkin?',
      answer:
        'First: T extends [infer F, ...any[]] ? F : never — birinchi elementni infer bilan ushlaydi. Last: T extends [...any[], infer L] ? L : never — rest operatorni boshiga qo\'yib, oxirgi elementni ushlaydi. Bu variadic tuple types (TS 4.0+) asosida ishlaydi. Bo\'sh tuple uchun never qaytaradi.',
    },
    {
      question: 'Template literal type bilan string manipulation qanday ishlaydi?',
      answer:
        'Template literal bilan string ni parchalash mumkin: S extends `${infer Head}.${infer Tail}` — nuqtadan oldingi va keyingi qismlarni oladi. Recursive Split tipi yozish mumkin. Replace, Trim, CamelCase kabi utilitylar shu pattern asosida. MUHIM: faqat literal string tiplar bilan ishlaydi, umumiy string tipi bilan natija bermaydi.',
    },
    {
      question: 'UnionToIntersection qanday ishlaydi?',
      answer:
        'Ikki bosqich: 1) (U extends any ? (x: U) => void : never) — union distributive bo\'ladi, har bir a\'zo funksiya parametriga aylanadi. 2) ...extends (x: infer I) => void ? I : never — contravariant pozitsiyada infer union ni intersection ga aylantiradi. Bu TypeScript ning contravariance xususiyati — funksiya parametrlari contravariant, shuning uchun union intersection bo\'ladi.',
    },
  ],
}
