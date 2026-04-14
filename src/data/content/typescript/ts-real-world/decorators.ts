import type { Topic } from '../../../types'

export const decorators: Topic = {
  id: 'decorators',
  title: 'Decorators',
  importance: 2,
  status: 'to-learn',
  description:
    'TC39 Stage 3 decorators, class/method/field decorators, legacy vs yangi standart, Angular va NestJS patternlari.',
  content: `
# DECORATORS
═══════════════════════════════════════

Decorator — class, method yoki field ga **meta-ma'lumot qo'shish** yoki **xatti-harakatini o'zgartirish** uchun maxsus funksiya. @ belgisi bilan yoziladi.

## TC39 STAGE 3 — YANGI STANDART

2023 yilda TC39 Stage 3 ga chiqqan yangi decorator standart. TypeScript 5.0+ da qo'llab-quvvatlanadi. Yangi standart eskisidan tubdan farq qiladi.

MUHIM: Yangi standart \`experimentalDecorators: false\` (default) bilan ishlaydi. Agar \`experimentalDecorators: true\` bo'lsa — eski (legacy) decorator ishlatiladi.

## DECORATOR TURLARI

1. **Class decorator** — class ga qo'shimcha funksionallik
2. **Method decorator** — method xatti-harakatini o'zgartirish
3. **Field decorator** — property uchun accessor qo'shish
4. **Getter/Setter decorator** — accessor ni bezash
5. **Auto-accessor decorator** — \`accessor\` kalit so'zi bilan

## LEGACY VS STAGE 3

Legacy (\`experimentalDecorators: true\`):
- Angular, NestJS hozir shu ishlatadi
- \`reflect-metadata\` kutubxonasi kerak
- Parametr decoratorlari bor

Stage 3 (yangi standart):
- Parametr decoratorlari YO'Q
- Auto-accessor — yangi tushuncha
- Context ob'ekti bilan ishlash
- Runtime da ishlaydi, metadata API alohida

## ANGULAR VA NESTJS PATTERNLARI

Angular: \`@Component\`, \`@Injectable\`, \`@Input\`, \`@Output\` — komponent metadata va DI tizimi.

NestJS: \`@Controller\`, \`@Get\`, \`@Post\`, \`@Injectable\` — HTTP routing va dependency injection.

MUHIM: Angular va NestJS hozir legacy decoratorlar ishlatadi. Keyinchalik Stage 3 ga o'tishi kutilmoqda.

## CUSTOM DECORATOR YARATISH

Decorator — oddiy funksiya. Class decorator class ni qabul qiladi va o'zgartirilgan class yoki void qaytaradi. Method decorator — method descriptor bilan ishlaydi.
  `.trim(),
  codeExamples: [
    {
      title: 'Stage 3 Class Decorator',
      language: 'ts',
      description: 'Yangi standart bo\'yicha class decorator.',
      code: `// Stage 3 Class Decorator (TS 5.0+)
// experimentalDecorators: false (default)

// Class decorator — class ni qabul qilib, yangi class qaytaradi
function sealed(target: Function, context: ClassDecoratorContext) {
  Object.seal(target)
  Object.seal(target.prototype)
  console.log("Sealed:", context.name)
}

@sealed
class User {
  name: string
  constructor(name: string) {
    this.name = name
  }
}

// Logger decorator — class ga method qo'shadi
function withLogger<T extends new (...args: any[]) => any>(
  target: T,
  context: ClassDecoratorContext
) {
  return class extends target {
    constructor(...args: any[]) {
      super(...args)
      console.log(\`Created \${context.name} with args:\`, args)
    }
  }
}

@withLogger
class Service {
  constructor(public name: string) {}
}

const svc = new Service("api")
// Console: "Created Service with args: ['api']"`,
    },
    {
      title: 'Method va Field Decorators',
      language: 'ts',
      description: 'Method xatti-harakatini o\'zgartirish va field decorator.',
      code: `// Method decorator — log qo'shish
function log(
  target: Function,
  context: ClassMethodDecoratorContext
) {
  return function (this: any, ...args: any[]) {
    console.log(\`Calling \${String(context.name)} with:\`, args)
    const result = target.apply(this, args)
    console.log(\`Result:\`, result)
    return result
  }
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}

const calc = new Calculator()
calc.add(2, 3)
// Console: "Calling add with: [2, 3]"
// Console: "Result: 5"

// Auto-accessor decorator
function clamp(min: number, max: number) {
  return function (
    target: ClassAccessorDecoratorTarget<any, number>,
    context: ClassAccessorDecoratorContext
  ): ClassAccessorDecoratorResult<any, number> {
    return {
      set(value: number) {
        target.set.call(this, Math.min(max, Math.max(min, value)))
      },
      get() {
        return target.get.call(this)
      },
    }
  }
}

class Slider {
  @clamp(0, 100)
  accessor value = 50
}`,
    },
    {
      title: 'Legacy Decorators — Angular pattern',
      language: 'ts',
      description: 'experimentalDecorators: true bilan Angular uslubidagi decoratorlar.',
      code: `// Legacy decorator (experimentalDecorators: true)
// Angular @Component simulyatsiyasi

// Decorator factory — parametr qabul qiladi
function Component(config: {
  selector: string
  template: string
}) {
  return function (target: Function) {
    // Metadata qo'shish
    Object.defineProperty(target, "__component", {
      value: config,
      writable: false,
    })
  }
}

function Injectable() {
  return function (target: Function) {
    Object.defineProperty(target, "__injectable", {
      value: true,
    })
  }
}

// Angular-style ishlatish
@Component({
  selector: "app-hello",
  template: "<h1>Hello</h1>",
})
class HelloComponent {
  title = "Hello World"
}

@Injectable()
class UserService {
  getUsers() {
    return ["Ali", "Vali"]
  }
}

// NestJS-style
function Controller(path: string) {
  return function (target: Function) {
    Object.defineProperty(target, "__path", { value: path })
  }
}

function Get(route: string) {
  return function (target: any, key: string) {
    const routes = target.__routes || []
    routes.push({ method: "GET", route, handler: key })
    target.__routes = routes
  }
}`,
    },
    {
      title: 'Amaliy decorator patternlari',
      language: 'ts',
      description: 'Memoize, validate, debounce kabi amaliy decoratorlar.',
      code: `// Memoize decorator (Stage 3)
function memoize(
  target: Function,
  context: ClassMethodDecoratorContext
) {
  const cache = new Map<string, unknown>()

  return function (this: any, ...args: any[]) {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = target.apply(this, args)
    cache.set(key, result)
    return result
  }
}

// Debounce decorator
function debounce(ms: number) {
  return function (
    target: Function,
    context: ClassMethodDecoratorContext
  ) {
    let timer: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
      clearTimeout(timer)
      timer = setTimeout(() => target.apply(this, args), ms)
    }
  }
}

class SearchService {
  @memoize
  expensiveCalculation(input: string): number {
    console.log("Computing...")
    return input.length * 42
  }

  @debounce(300)
  search(query: string) {
    console.log("Searching:", query)
  }
}

const svc = new SearchService()
svc.expensiveCalculation("hello")  // Computing...
svc.expensiveCalculation("hello")  // Cache dan — Computing chaqirilmaydi`,
    },
  ],
  interviewQA: [
    {
      question: 'Decorator nima va TypeScript da qanday ishlaydi?',
      answer:
        'Decorator — class, method yoki field ga meta-ma\'lumot qo\'shish yoki xatti-harakatini o\'zgartirish uchun @ bilan yoziladigan funksiya. TypeScript 5.0+ da TC39 Stage 3 standart qo\'llab-quvvatlanadi. Class decorator class ni qabul qilib yangi class qaytaradi. Method decorator funksiyani wrap qiladi. Runtime da ishlaydi — kompilyatsiyadan keyin JavaScript da ham mavjud.',
    },
    {
      question: 'Legacy (experimental) va Stage 3 decoratorlar farqi nima?',
      answer:
        'Legacy: experimentalDecorators: true, reflect-metadata kerak, parametr decoratorlari bor, Angular/NestJS ishlatadi. Stage 3: standart TC39, parametr decorator yo\'q, auto-accessor yangi tushuncha, context ob\'ekti bilan ishlash. Ikkalasi bir-biriga mos emas — bir loyihada faqat bittasi. Angular keyinchalik Stage 3 ga o\'tadi.',
    },
    {
      question: 'Decorator factory nima va oddiy decoratordan farqi?',
      answer:
        'Decorator factory — parametr qabul qilib DECORATOR QAYTARUVCHI funksiya. Oddiy: @sealed — to\'g\'ridan-to\'g\'ri decorator. Factory: @Component({selector: "app"}) — avval Component({...}) chaqiriladi, qaytgan funksiya decorator bo\'ladi. Factory konfiguratsiya berish uchun kerak — masalan, @debounce(300), @clamp(0, 100).',
    },
    {
      question: 'Angular da decoratorlar qanday rol o\'ynaydi?',
      answer:
        '@Component — komponent metadata (selector, template, styles). @Injectable — DI tizimida foydalanish. @Input/@Output — komponentlar orasida ma\'lumot almashish. @NgModule — modul konfiguratsiyasi. Bular legacy decoratorlar asosida, reflect-metadata bilan ishlaydi. Angular kompilyator (ngc) decoratorlarni o\'qib, kerakli kodni generatsiya qiladi.',
    },
    {
      question: 'Custom decorator yozishda nimaga e\'tibor berish kerak?',
      answer:
        '1) this kontekstini to\'g\'ri saqlash — apply/call ishlatish. 2) Return type — method decorator o\'rab qaytarishi, class decorator yangi class qaytarishi yoki void. 3) Side effectlar — decorator funksiya sof bo\'lishi kerak, global stateni o\'zgartirmasligi. 4) Stacking — bir necha decorator tartibda qo\'llaniladi (pastdan yuqoriga). 5) TypeScript tipi — decorator qaytarish tipini to\'g\'ri e\'lon qilish.',
    },
  ],
}
