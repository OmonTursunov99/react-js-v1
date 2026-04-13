import type { Topic } from '../../../types'

export const recursion: Topic = {
  id: 'recursion',
  title: 'Recursion',
  importance: 2,
  status: 'to-learn',
  description: 'Base case, call stack, tail recursion, tree traversal, deep clone',
  content: `Recursion — funksiya O'ZINI O'ZI chaqirishi. Murakkab muammolarni kichik qismlarga bo'lib yechish uchun ishlatiladi. Daraxt (tree) tuzilmalar, nested ma'lumotlar va matematikiy algoritmlar uchun juda mos.

═══════════════════════════════════════
  RECURSION ASOSLARI
═══════════════════════════════════════

Har bir recursive funksiyada IKKITA qism bo'lishi SHART:

1. BASE CASE (to'xtash sharti):
   Funksiya o'zini CHAQIRMAYDIGAN holat.
   Bu bo'lmasa — cheksiz chaqirish → Stack Overflow!

2. RECURSIVE CASE (qaytarish holati):
   Funksiya O'ZINI chaqiradi, lekin KICHIKROQ muammo bilan.
   Har bir chaqiruvda muammo base case-ga yaqinlashishi SHART.

  function countdown(n) {
    if (n <= 0) {              // BASE CASE
      console.log('Tayyor!')
      return
    }
    console.log(n)
    countdown(n - 1)           // RECURSIVE CASE (n kichiklashmoqda)
  }

  countdown(3)  // 3, 2, 1, 'Tayyor!'

═══════════════════════════════════════
  CALL STACK VA RECURSION
═══════════════════════════════════════

Har bir recursive chaqiruv Call Stack-ga yangi frame qo'shadi:

  factorial(4)
  ├── factorial(3)
  │   ├── factorial(2)
  │   │   ├── factorial(1)
  │   │   │   └── return 1         ← base case
  │   │   └── return 2 * 1 = 2
  │   └── return 3 * 2 = 6
  └── return 4 * 6 = 24

Call Stack LIFO — oxirgi qo'yilgan birinchi olinadi.
Har bir frame xotirada joy egallaydi.

MUHIM: JavaScript-da standart stack hajmi ~10,000-25,000 frame.
Bundan ko'p bo'lsa — "Maximum call stack size exceeded" xatosi (Stack Overflow).

═══════════════════════════════════════
  STACK OVERFLOW VA HIMOYA
═══════════════════════════════════════

  // XATO — base case yo'q:
  function infinite() {
    return infinite()  // CHEKSIZ → Stack Overflow!
  }

  // XATO — base case-ga yaqinlashmaydi:
  function bad(n) {
    if (n === 0) return 0
    return bad(n + 1)  // n KATTALASHMOQDA, 0 ga yetmaydi!
  }

Himoya usullari:
1. DOIM base case yozing
2. Har bir chaqiruvda muammo KICHIKLASHSIN
3. Chuqurlik chegarasi qo'ying:

  function safe(n, depth = 0) {
    if (depth > 1000) throw new Error('Too deep!')
    if (n <= 0) return 0
    return safe(n - 1, depth + 1)
  }

═══════════════════════════════════════
  TAIL RECURSION (TCO)
═══════════════════════════════════════

Tail recursion — recursive chaqiruv funksiyaning ENG OXIRGI amali bo'lganda.
Nazariy jihatdan engine stek frame-ni qayta ishlatishi mumkin (Tail Call Optimization):

  // Oddiy recursion — tail EMAS (return n * factorial(n-1)):
  function factorial(n) {
    if (n <= 1) return 1
    return n * factorial(n - 1)  // ko'paytirish KEYIN bajariladi
  }

  // Tail recursion — result accumulator bilan:
  function factorialTail(n, acc = 1) {
    if (n <= 1) return acc
    return factorialTail(n - 1, acc * n)  // ENG OXIRGI amal
  }

MUHIM: TCO faqat Safari (JavaScriptCore) da ishlaydi.
V8 (Chrome, Node.js) va SpiderMonkey (Firefox) TCO ni qo'llab-quvvatlaMAYDI.
Shuning uchun amalda chuqur recursion uchun iteratsiya ishlatish xavfsizroq.

═══════════════════════════════════════
  RECURSION VS ITERATION
═══════════════════════════════════════

RECURSION afzalliklari:
  ✅ Daraxt tuzilmalar uchun tabiiy va oson
  ✅ Kodni qisqa va tushunarli qiladi
  ✅ Divide and conquer algoritmlari uchun ideal
  ✅ Backtracking muammolari uchun zarur

ITERATION afzalliklari:
  ✅ Stack Overflow xavfi YO'Q
  ✅ Xotira kam sarflaydi (bitta frame)
  ✅ Odatda TEZROQ (function call overhead yo'q)
  ✅ Barcha engine-larda bir xil ishlaydi

Qoida:
- Daraxt (tree), graf, nested tuzilma → RECURSION
- Oddiy takrorlash, katta hajm → ITERATION
- Performance critical → ITERATION

Har qanday recursion-ni iteration-ga aylantirish MUMKIN
(stack ma'lumot tuzilmasi yordamida).

═══════════════════════════════════════
  AMALIY ISHLATISH HOLATLARI
═══════════════════════════════════════

1. TREE TRAVERSAL:
   DOM daraxt, fayl tizimi, JSON parsing

2. DEEP CLONE:
   Nested ob'ektlarni to'liq nusxalash

3. MATEMATIKA:
   Factorial, Fibonacci, exponent

4. SORTING:
   QuickSort, MergeSort — divide and conquer

5. BACKTRACKING:
   Sudoku solver, maze solver, permutations

6. REACT:
   Recursive komponentlar (tree view, nested menu)`,
  codeExamples: [
    {
      title: 'Klassik misollar — factorial va fibonacci',
      language: 'js',
      code: `// 1. Factorial — n! = n * (n-1) * ... * 1
function factorial(n) {
  if (n < 0) throw new Error('Manfiy son!')
  if (n <= 1) return 1              // base case: 0! = 1, 1! = 1
  return n * factorial(n - 1)       // recursive case
}

factorial(5)   // 5 * 4 * 3 * 2 * 1 = 120
factorial(0)   // 1

// Tail recursive versiyasi (accumulator bilan)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc
  return factorialTail(n - 1, acc * n)
}

// 2. Fibonacci — 0, 1, 1, 2, 3, 5, 8, 13, ...
// SEKIN versiya — O(2^n), chunki har chaqiruv ikkiga bo'linadi
function fibSlow(n) {
  if (n <= 0) return 0              // base case
  if (n === 1) return 1             // base case
  return fibSlow(n - 1) + fibSlow(n - 2)  // ikkita recursive chaqiruv!
}

// TEZKOR versiya — memoization bilan O(n)
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n]     // keshdan olish
  if (n <= 0) return 0
  if (n === 1) return 1
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
  return memo[n]
}

fibonacci(50)   // 12586269025 (darhol!)
// fibSlow(50) — soatlab kutasiz!

// Iterativ versiya — eng tezkor
function fibIterative(n) {
  if (n <= 0) return 0
  let prev = 0, curr = 1
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr]
  }
  return curr
}`,
      description: 'Factorial — oddiy recursion misoli. Fibonacci — naiv recursion O(2^n), memoization bilan O(n). fibSlow(50) soatlab ishlaydi, fibonacci(50) darhol. Amalda iterativ versiya eng yaxshi.',
    },
    {
      title: 'Tree traversal — DOM va ob\'ekt daraxti',
      language: 'js',
      code: `// 1. Nested ob'ektdan barcha qiymatlarni olish
function getAllValues(obj) {
  const values = []

  function traverse(current) {
    for (const key in current) {
      if (typeof current[key] === 'object' && current[key] !== null) {
        traverse(current[key])     // recursive: ichki ob'ektga kirish
      } else {
        values.push(current[key])  // base case: oddiy qiymat
      }
    }
  }

  traverse(obj)
  return values
}

const data = {
  a: 1,
  b: { c: 2, d: { e: 3, f: 4 } },
  g: [5, 6, { h: 7 }],
}
getAllValues(data)  // [1, 2, 3, 4, 5, 6, 7]

// 2. Fayl tizimi — papka hajmini hisoblash
function getFolderSize(folder) {
  let size = 0

  for (const item of folder.children) {
    if (item.type === 'file') {
      size += item.size             // base case
    } else if (item.type === 'folder') {
      size += getFolderSize(item)   // recursive case
    }
  }

  return size
}

const fileSystem = {
  name: 'root',
  type: 'folder',
  children: [
    { name: 'file1.txt', type: 'file', size: 100 },
    {
      name: 'docs',
      type: 'folder',
      children: [
        { name: 'doc1.pdf', type: 'file', size: 500 },
        { name: 'doc2.pdf', type: 'file', size: 300 },
      ],
    },
  ],
}
getFolderSize(fileSystem)  // 900

// 3. Nested menu/category rendering (React uchun mantiq)
function flattenMenu(items, depth = 0) {
  const result = []

  for (const item of items) {
    result.push({ ...item, depth })
    if (item.children) {
      result.push(...flattenMenu(item.children, depth + 1))
    }
  }

  return result
}`,
      description: 'Tree traversal — recursion ning eng kuchli qo\'llanish sohasi. Nested ob\'ektlar, fayl tizimi, menu daraxti — hammasi recursive algoritmlar bilan yechiladi. DOM traversal ham shu prinsipda ishlaydi.',
    },
    {
      title: 'Deep clone — to\'liq nusxalash',
      language: 'js',
      code: `// Shallow copy muammosi:
const original = { a: 1, b: { c: 2 } }
const shallow = { ...original }
shallow.b.c = 99
console.log(original.b.c)  // 99! — ichki ob'ekt hali ham bir xil

// Deep clone — recursive
function deepClone(obj) {
  // Base cases
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags)

  // Array
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))  // har bir elementni clone
  }

  // Object
  const cloned = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])  // har bir qiymatni clone
    }
  }
  return cloned
}

// Test
const data = {
  name: 'Ali',
  scores: [1, 2, 3],
  address: {
    city: 'Toshkent',
    coords: { lat: 41.3, lng: 69.3 },
  },
  created: new Date(),
}

const cloned = deepClone(data)
cloned.address.city = 'Samarqand'
cloned.scores.push(4)

console.log(data.address.city)  // 'Toshkent' — o'zgarmagan!
console.log(data.scores)        // [1, 2, 3] — o'zgarmagan!

// Zamonaviy alternativa (2022+):
const modern = structuredClone(data)
// structuredClone — native, tezkor, ko'p turlarni qo'llaydi
// Lekin: function, DOM element, Symbol clone qilmaydi`,
      description: 'Deep clone — nested ob\'ektlarni to\'liq nusxalash. Spread (...) faqat SHALLOW copy. Recursive deepClone har bir darajadagi ob\'ektni alohida nusxalaydi. Zamonaviy brauzerlar structuredClone() ni qo\'llab-quvvatlaydi.',
    },
    {
      title: 'Recursion-ni iteration-ga aylantirish',
      language: 'js',
      code: `// RECURSIVE versiya — tree traversal
function sumTreeRecursive(node) {
  if (!node) return 0
  return node.value
    + sumTreeRecursive(node.left)
    + sumTreeRecursive(node.right)
}

// ITERATIVE versiya — stack bilan
function sumTreeIterative(root) {
  if (!root) return 0
  let sum = 0
  const stack = [root]    // o'z stack-imiz

  while (stack.length > 0) {
    const node = stack.pop()
    sum += node.value

    if (node.right) stack.push(node.right)
    if (node.left) stack.push(node.left)
  }

  return sum
}

// Tree tuzilma
const tree = {
  value: 1,
  left: {
    value: 2,
    left: { value: 4, left: null, right: null },
    right: { value: 5, left: null, right: null },
  },
  right: {
    value: 3,
    left: null,
    right: { value: 6, left: null, right: null },
  },
}

sumTreeRecursive(tree)   // 1 + 2 + 4 + 5 + 3 + 6 = 21
sumTreeIterative(tree)   // 21

// Trampoline — tail recursion-ni iteration-ga aylantirish
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args)
    while (typeof result === 'function') {
      result = result()
    }
    return result
  }
}

// Trampoline bilan factorial
function factTrampoline(n, acc = 1) {
  if (n <= 1) return acc
  return () => factTrampoline(n - 1, acc * n)  // funksiya QAYTARADI
}

const factorial = trampoline(factTrampoline)
factorial(100000)  // Stack Overflow BO'LMAYDI!`,
      description: 'Har qanday recursion-ni iteration-ga aylantirish mumkin — o\'z stack ma\'lumot tuzilmamiz bilan. Trampoline pattern — tail recursion-ni iteration-ga aylantirish uchun elegant yechim, stack overflow muammosini hal qiladi.',
    },
    {
      title: 'React-da recursive komponent',
      language: 'js',
      code: `// Recursive komponent — nested menu
function TreeNode({ node, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div style={{ paddingLeft: depth * 20 }}>
      <div
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ cursor: hasChildren ? 'pointer' : 'default' }}
      >
        {hasChildren && (isOpen ? '📂' : '📁')}
        {!hasChildren && '📄'}
        {' '}{node.name}
      </div>

      {/* RECURSIVE: har bir child uchun TreeNode renderlanadi */}
      {isOpen && hasChildren && node.children.map(child => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}   // chuqurlik oshib boradi
        />
      ))}
    </div>
  )
}

// Ishlatish:
const fileTree = {
  id: 1, name: 'src',
  children: [
    { id: 2, name: 'components',
      children: [
        { id: 3, name: 'Button.tsx', children: [] },
        { id: 4, name: 'Card.tsx', children: [] },
      ],
    },
    { id: 5, name: 'App.tsx', children: [] },
    { id: 6, name: 'main.tsx', children: [] },
  ],
}

// <TreeNode node={fileTree} />

// Recursive komponent uchun DOIM:
// 1. Base case — children yo'q yoki bo'sh
// 2. key prop — React uchun
// 3. depth limiti — cheksiz nesting oldini olish`,
      description: 'React-da recursive komponent — tree view, nested comments, file explorer uchun ishlatiladi. Har bir komponent o\'z children-larini xuddi o\'zi kabi renderlayddi. depth prop bilan chuqurlikni kuzatish muhim.',
    },
  ],
  interviewQA: [
    {
      question: 'Recursion nima? Base case nima uchun muhim?',
      answer: 'Recursion — funksiya o\'zini o\'zi chaqirishi. Muammoni kichikroq qismlarga bo\'lib yechish uchun ishlatiladi. Har bir recursive funksiyada base case (to\'xtash sharti) bo\'lishi SHART — bu funksiya o\'zini chaqirMAYDIGAN holat. Base case bo\'lmasa — cheksiz chaqiruv → Call Stack to\'lib ketadi → "Maximum call stack size exceeded" xatosi (Stack Overflow). Har bir recursive chaqiruvda muammo base case-ga YAQINLASHISHI kerak.',
    },
    {
      question: 'Call Stack recursion bilan qanday bog\'liq? Stack Overflow nima?',
      answer: 'Har bir funksiya chaqiruvi Call Stack-ga yangi frame qo\'shadi. Recursive funksiya o\'zini chaqirganda har bir chaqiruv yangi frame — o\'zgaruvchilar, return manzili xotirada saqlanadi. JavaScript engine-da stack hajmi chegaralangan (~10,000-25,000 frame). Bu chegaradan oshsa — Stack Overflow. Shuning uchun chuqur recursion xavfli. Himoya: depth counter, iteratsiyaga aylantirish, yoki trampoline pattern.',
    },
    {
      question: 'Tail recursion nima? JavaScript-da ishlaydi mi?',
      answer: 'Tail recursion — recursive chaqiruv funksiyaning ENG OXIRGI amali bo\'lganda. return factorial(n-1) — tail. return n * factorial(n-1) — tail EMAS (ko\'paytirish keyin). Tail Call Optimization (TCO) da engine stek frame-ni qayta ishlatadi — Stack Overflow bo\'lmaydi. LEKIN: faqat Safari (JavaScriptCore) TCO ni qo\'llab-quvvatlaydi. V8 (Chrome/Node) va SpiderMonkey (Firefox) QILMAYDI. Shuning uchun amalda TCO ga tayanish xavfli.',
    },
    {
      question: 'Recursion va iteration farqi nima? Qachon qaysi biri yaxshi?',
      answer: 'Recursion: kodni qisqa va tushunarli qiladi, daraxt tuzilmalar uchun tabiiy, lekin Stack Overflow xavfi bor va ko\'proq xotira sarflaydi. Iteration: xavfsiz (stack overflow yo\'q), tezroq (function call overhead yo\'q), lekin daraxt uchun murakkab kod. Qoida: nested/tree ma\'lumotlar → recursion; oddiy takrorlash, katta hajm → iteration. Har qanday recursion-ni o\'z stack bilan iteratsiyaga aylantirish mumkin.',
    },
    {
      question: 'Deep clone-ni recursive qanday yozasiz?',
      answer: 'Base case: primitiv (number, string, boolean, null, undefined) — shu qiymatni qaytarish. Recursive case: ob\'ekt bo\'lsa — yangi ob\'ekt yaratib, har bir property-ni recursive clone qilish. Array bo\'lsa — map bilan har bir elementni clone. Date, RegExp kabi maxsus turlarni alohida handle qilish kerak. Circular reference muammosi uchun WeakMap cache ishlatish kerak. Zamonaviy alternativa: structuredClone() — native, tezkor, lekin function va DOM elementlarni clone qilmaydi.',
    },
    {
      question: 'Fibonacci-ni nima uchun naiv recursion bilan yozish yomon?',
      answer: 'Naiv fib(n) = fib(n-1) + fib(n-2) — O(2^n) murakkablik. Sabab: bir xil qiymatlar QAYTA-QAYTA hisoblanadi. fib(50) uchun milliardlab chaqiruv. Yechimlar: 1) Memoization — hisoblanganlarni keshga saqlash, O(n) ga tushadi. 2) Iterativ versiya — prev va curr o\'zgaruvchilar bilan, O(n) vaqt, O(1) xotira. 3) Bottom-up DP — massivda saqlash. Amalda iterativ versiya eng yaxshi — tez va xotira kam.',
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'call-stack', label: 'Call Stack' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'higher-order-functions', label: 'Higher-Order Functions' },
    { techId: 'javascript', sectionId: 'functions-closures', topicId: 'execution-context', label: 'Execution Context' },
    { techId: 'javascript', sectionId: 'advanced', topicId: 'algorithms', label: 'Algorithms' },
  ],
}
