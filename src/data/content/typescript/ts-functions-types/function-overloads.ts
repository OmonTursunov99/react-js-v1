import type { Topic } from '../../../types'

export const functionOverloads: Topic = {
  id: 'function-overloads',
  title: 'Function Overloads',
  importance: 3,
  status: 'to-learn',
  description:
    'Function overload signatures, implementation signature, method overloads va overload resolution tartibi.',
  content: `
# FUNCTION OVERLOADS
═══════════════════════════════════════

Function overload — bitta funksiya nomi bilan **bir nechta chaqiruv imzolari** (call signatures) e'lon qilish. TypeScript kompilyator chaqiruv vaqtida argumentlarga qarab to'g'ri tipni tanlaydi.

## OVERLOAD SIGNATURES VA IMPLEMENTATION

Overload yozish tartibi:
1. **Overload signatures** — faqat tip e'lonlari, tanasiz
2. **Implementation signature** — haqiqiy tanaga ega, barcha overloadlarni qamrab oladi
3. Implementation signature tashqaridan ko'rinMAYDI — faqat overloadlar ko'rinadi

MUHIM: Implementation signature barcha overload signaturelariga mos kelishi shart. Aks holda kompilyatsiya xatosi bo'ladi.

## METHOD OVERLOADS

Class va interface ichida ham overload yozish mumkin. Interface da faqat signaturelar yoziladi, class da implementation ham kerak.

## OVERLOAD VS UNION TYPE

Overload ishlatish kerak:
1. Argument tipiga qarab QAYTARISH tipi farq qilganda
2. Argumentlar soni farq qilganda
3. Argumentlar orasida bog'liqlik bo'lganda

Union yetarli:
1. Qaytarish tipi bir xil bo'lganda
2. Oddiy parametr variatsiyalari
3. Sodda holatlarda — union ancha oson

## OVERLOAD RESOLUTION TARTIBI

TypeScript overloadlarni **yuqoridan pastga** tekshiradi. Birinchi mos kelgan signaturani tanlaydi. Shuning uchun **eng aniq** signaturani birinchi yozing.

MUHIM: Agar umumiy (generic) overload pastda va aniq overload yuqorida bo'lsa — aniq overload tanlanaveradi. Tartib muhim!

## AMALIY PATTERNLAR

Ko'p ishlatiladigan overload patternlari:
1. createElement — tag nomiga qarab element tipi
2. addEventListener — event nomiga qarab callback tipi
3. API funksiyalar — parametrga qarab response tipi
4. Factory funksiyalar — konfiguratsiyaga qarab natija tipi
  `.trim(),
  codeExamples: [
    {
      title: 'Asosiy overload pattern',
      language: 'ts',
      description: 'Overload signatures + implementation signature.',
      code: `// Overload signatures (tana yo'q)
function format(value: string): string
function format(value: number): string
function format(value: Date): string

// Implementation signature (tashqaridan ko'rinmaydi)
function format(value: string | number | Date): string {
  if (typeof value === "string") return value.trim()
  if (typeof value === "number") return value.toFixed(2)
  return value.toISOString()
}

// Chaqiruv — TypeScript to'g'ri tipni tanlaydi
const s = format("  salom  ")   // string
const n = format(3.14159)        // string
const d = format(new Date())     // string

// XATO — boolean overload yo'q
// format(true)  // Error: No overload matches`,
    },
    {
      title: 'Qaytarish tipi argumentga bog\'liq',
      language: 'ts',
      description: 'Argument tipiga qarab turli natija tipi.',
      code: `// Overload — argument tipiga qarab turli return type
function parse(input: string): number
function parse(input: string[]): number[]
function parse(input: string | string[]): number | number[] {
  if (Array.isArray(input)) {
    return input.map(Number)
  }
  return Number(input)
}

const single = parse("42")         // number
const multi = parse(["1", "2"])    // number[]

// createElement pattern
function createElement(tag: "div"): HTMLDivElement
function createElement(tag: "span"): HTMLSpanElement
function createElement(tag: "input"): HTMLInputElement
function createElement(tag: string): HTMLElement
function createElement(tag: string): HTMLElement {
  return document.createElement(tag)
}

const div = createElement("div")     // HTMLDivElement
const span = createElement("span")   // HTMLSpanElement
const custom = createElement("my-el") // HTMLElement`,
    },
    {
      title: 'Class va interface overloads',
      language: 'ts',
      description: 'Method overloads class va interface ichida.',
      code: `// Interface da overload
interface StringDatabase {
  get(id: string): string
  get(ids: string[]): string[]
}

// Class da overload
class Database implements StringDatabase {
  private data = new Map<string, string>()

  // Method overloads
  get(id: string): string
  get(ids: string[]): string[]
  get(input: string | string[]): string | string[] {
    if (Array.isArray(input)) {
      return input.map(id => this.data.get(id) ?? "")
    }
    return this.data.get(input) ?? ""
  }

  // Set ham overload bo'lishi mumkin
  set(id: string, value: string): void
  set(entries: [string, string][]): void
  set(
    idOrEntries: string | [string, string][],
    value?: string
  ): void {
    if (Array.isArray(idOrEntries)) {
      idOrEntries.forEach(([k, v]) => this.data.set(k, v))
    } else {
      this.data.set(idOrEntries, value!)
    }
  }
}`,
    },
    {
      title: 'addEventListener pattern',
      language: 'ts',
      description: 'Event nomiga qarab callback tipi — real-world overload.',
      code: `// Simplified addEventListener overloads
interface MyEmitter {
  on(event: "click", handler: (x: number, y: number) => void): void
  on(event: "change", handler: (value: string) => void): void
  on(event: "error", handler: (err: Error) => void): void
  on(event: string, handler: (...args: unknown[]) => void): void
}

class Emitter implements MyEmitter {
  private handlers = new Map<string, Function[]>()

  on(event: "click", handler: (x: number, y: number) => void): void
  on(event: "change", handler: (value: string) => void): void
  on(event: "error", handler: (err: Error) => void): void
  on(event: string, handler: (...args: unknown[]) => void): void
  on(event: string, handler: Function): void {
    const list = this.handlers.get(event) ?? []
    list.push(handler)
    this.handlers.set(event, list)
  }
}

const emitter = new Emitter()

// TypeScript to'g'ri tiplarni taklif qiladi
emitter.on("click", (x, y) => {
  console.log(x + y)  // x: number, y: number
})

emitter.on("change", (value) => {
  console.log(value.toUpperCase())  // value: string
})`,
    },
    {
      title: 'Overload vs Union — taqqoslash',
      language: 'ts',
      description: 'Qachon overload, qachon union ishlatish kerak.',
      code: `// ❌ Keraksiz overload — union yetarli
function toStringBad(value: string): string
function toStringBad(value: number): string
function toStringBad(value: string | number): string {
  return String(value)
}

// ✅ Union bilan soddaroq
function toStringGood(value: string | number): string {
  return String(value)
}

// ✅ Overload kerak — qaytarish tipi farq qiladi
function process(input: string): string
function process(input: number): number
function process(input: string | number): string | number {
  if (typeof input === "string") return input.toUpperCase()
  return input * 2
}

const str = process("hello")  // string (union emas!)
const num = process(42)        // number (union emas!)

// Agar union bo'lsa edi:
function processUnion(input: string | number): string | number {
  if (typeof input === "string") return input.toUpperCase()
  return input * 2
}
// Har doim string | number qaytaradi — aniq emas`,
    },
  ],
  interviewQA: [
    {
      question: 'Function overload nima va qachon ishlatiladi?',
      answer:
        'Function overload — bitta funksiya uchun bir nechta chaqiruv imzolari (call signatures) e\'lon qilish. TypeScript chaqiruv vaqtida argumentlarga qarab to\'g\'ri tipni tanlaydi. Ishlatish kerak: 1) argument tipiga qarab qaytarish tipi farq qilganda, 2) argumentlar soni farq qilganda, 3) argumentlar orasida bog\'liqlik bo\'lganda. Agar qaytarish tipi bir xil bo\'lsa — oddiy union type yetarli.',
    },
    {
      question: 'Implementation signature nima uchun tashqaridan ko\'rinmaydi?',
      answer:
        'Implementation signature — faqat funksiya tanasini yozish uchun. Tashqi kod faqat overload signaturelarini ko\'radi. Bu type safety ni oshiradi: masalan, implementation da string | number qabul qilsa ham, tashqi kod faqat e\'lon qilingan overloadlarni chaqira oladi. Agar argument hech bir overloadga mos kelmasa — kompilyatsiya xatosi.',
    },
    {
      question: 'Overload resolution tartibi qanday ishlaydi?',
      answer:
        'TypeScript overloadlarni yuqoridan pastga tekshiradi va birinchi mos kelgan signaturani tanlaydi. Shuning uchun eng aniq (specific) signaturani yuqorida, eng umumiy (generic) signaturani pastda yozish kerak. Agar tartib noto\'g\'ri bo\'lsa, umumiy signature birinchi mos keladi va aniq tiplar ishlatilmaydi.',
    },
    {
      question: 'Overload va generic function — farqi nima?',
      answer:
        'Overload — cheklangan, aniq signaturelar to\'plami. Generic — cheksiz tiplar bilan ishlash. Masalan, identity<T>(x: T): T generic bilan bir funksiya, overload bilan cheksiz signatura yozish kerak bo\'lardi. Lekin generic bilan argument tipiga qarab turli qaytarish tipini ifodalash qiyin — bu holda overload qulay. Ko\'pincha ikkalasi birgalikda ishlatiladi.',
    },
    {
      question: 'Class da method overload qanday yoziladi?',
      answer:
        'Class da ham xuddi funksiya kabi: avval overload signaturelar (tanasiz), keyin implementation. Interface da faqat signaturelar yoziladi. Class interface ni implement qilganda, barcha overload signaturelarni takrorlashi va bitta implementation yozishi kerak. Constructor ham overload bo\'lishi mumkin.',
    },
  ],
}
