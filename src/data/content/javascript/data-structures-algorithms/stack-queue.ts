import type { Topic } from '../../../types'

export const stackQueue: Topic = {
  id: 'stack-queue',
  title: 'Stack va Queue',
  importance: 3,
  status: 'to-learn',
  description: 'LIFO, FIFO, call stack, BFS, bracket matching',
  content: `
=======================================
  STACK — LIFO (Last In First Out)
=======================================

Stack — bu ma'lumotlar tuzilmasi bo'lib, oxirgi qo'shilgan element
birinchi bo'lib chiqariladi. Kitoblar to'plami kabi — faqat tepadan
qo'yish va tepadan olish mumkin.

Asosiy operatsiyalar:
1. push(element)  — tepaga qo'shish          O(1)
2. pop()          — tepadan olish (o'chirish) O(1)
3. peek() / top() — tepadagini ko'rish        O(1)
4. isEmpty()      — bo'shligini tekshirish    O(1)
5. size           — elementlar soni           O(1)

JavaScript da Array as Stack:
  const stack = []
  stack.push(1)    // [1]
  stack.push(2)    // [1, 2]
  stack.push(3)    // [1, 2, 3]
  stack.pop()      // 3 qaytadi, stack = [1, 2]

Array.push() va Array.pop() — ikkalasi ham O(1).
Stack uchun Array mukammal ishlaydi!

=======================================
  QUEUE — FIFO (First In First Out)
=======================================

Queue — bu ma'lumotlar tuzilmasi bo'lib, birinchi qo'shilgan element
birinchi bo'lib chiqariladi. Navbat kabi — oxiridan kiradi, boshidan
chiqadi.

Asosiy operatsiyalar:
1. enqueue(element) — oxiriga qo'shish      O(1)
2. dequeue()        — boshidan olish         O(1)*
3. front() / peek() — boshdagini ko'rish     O(1)
4. isEmpty()        — bo'shligini tekshirish O(1)
5. size             — elementlar soni        O(1)

* O(1) faqat optimal implementatsiyada!

JavaScript da Array as Queue — MUAMMO:
  const queue = []
  queue.push(1)     // enqueue — O(1) ✓
  queue.shift()     // dequeue — O(n) ✗ !!!

Array.shift() O(n) chunki barcha elementlarni bitta chapga suradi!
1000 ta element bo'lsa — 999 ta element surish kerak.
Bu intervyuda bilish JUDA muhim!

=======================================
  OPTIMAL QUEUE — OBJECT ASOSIDA
=======================================

Array.shift() muammosini hal qilish uchun Object-based Queue
ishlatiladi. Ikki pointer: head va tail. O'chirilgan elementlar
o'rniga bo'sh joy qoladi, lekin har ikki operatsiya O(1).

Tuzilmasi:
  { 0: 'a', 1: 'b', 2: 'c' }  head=0, tail=3
  dequeue() -> 'a', head=1
  { 1: 'b', 2: 'c' }  head=1, tail=3

Xotira tozalash kerak bo'lganda — delete operator bilan
o'chirilgan elementlarni xotiradan olib tashlash mumkin.

=======================================
  REAL-WORLD QO'LLANILISH
=======================================

STACK ishlatiladi:
1. Call Stack — JavaScript funksiya chaqiruvlari
2. Undo/Redo — matn muharrirlarida
3. Browser history — back/forward
4. Bracket matching — ({[]}) tekshirish
5. Expression evaluation — postfix/infix
6. DFS (Depth-First Search) — grafik bo'ylab chuqur qidirish
7. Recursion — har bir recursive call stack frame

QUEUE ishlatiladi:
1. BFS (Breadth-First Search) — grafik bo'ylab keng qidirish
2. Task/Job queue — background vazifalar navbati
3. Print queue — printer navbati
4. Message queue — RabbitMQ, Kafka
5. Event loop — microtask va macrotask navbatlari
6. Rate limiting — so'rovlar navbati
7. Cache eviction — LRU/FIFO strategiyalari

=======================================
  PRIORITY QUEUE
=======================================

Priority Queue — har bir element ustuvorlik (priority) bilan
qo'shiladi. Eng yuqori prioritetli element birinchi chiqadi.

Oddiy implementatsiya — sorted array:
  enqueue: O(n) — to'g'ri joyga qo'shish
  dequeue: O(1) — boshidan olish

Optimal implementatsiya — Binary Heap:
  enqueue: O(log n)
  dequeue: O(log n)

Real-world: Dijkstra's algorithm, task scheduler, emergency room.

=======================================
  DEQUE (Double-Ended Queue)
=======================================

Deque — ikki tomondan ham qo'shish va olish mumkin bo'lgan
tuzilma. Stack va Queue ning umumlashmasi.

Operatsiyalar:
  addFront() / removeFront()   — old tomondan
  addBack() / removeBack()     — orqa tomondan

JavaScript da Array Deque sifatida:
  unshift/shift  — old tomon (lekin shift O(n)!)
  push/pop       — orqa tomon

Deque ishlatiladi:
- Sliding window masalalarida
- Palindrome tekshiruvida
- Work-stealing algoritmlarida

=======================================
  CALL STACK VA STACK OVERFLOW
=======================================

JavaScript Engine (V8) har bir funksiya chaqiruvini Call Stack ga
push qiladi, funksiya tugaganda pop qiladi.

function a() { b() }
function b() { c() }
function c() { console.log('hello') }
a()

Call Stack holati:
  | c()  |  <- top
  | b()  |
  | a()  |
  | main |  <- bottom

Stack Overflow — rekursiya cheksiz davom etganda yoki
juda chuqur bo'lganda stack hajmi yetmay qoladi.

function infinite() { infinite() }
infinite()
// RangeError: Maximum call stack size exceeded

Yechim: tail recursion, iteratsiya, yoki trampolining texnikasi.`.trim(),
  codeExamples: [
    {
      title: 'Stack class va Array orqali Stack',
      language: 'js',
      description: 'Stack implementatsiyasi: class-based va array-based',
      code: `// ═══ CLASS-BASED STACK ═══
class Stack {
  #items = []

  // Tepaga qo'shish — O(1)
  push(item) {
    this.#items.push(item)
    return this
  }

  // Tepadan olish — O(1)
  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty')
    }
    return this.#items.pop()
  }

  // Tepadagini ko'rish (o'chirmasdan) — O(1)
  peek() {
    if (this.isEmpty()) return undefined
    return this.#items[this.#items.length - 1]
  }

  isEmpty() {
    return this.#items.length === 0
  }

  get size() {
    return this.#items.length
  }

  clear() {
    this.#items = []
  }

  // Iteratsiya uchun (tepadan pastga)
  *[Symbol.iterator]() {
    for (let i = this.#items.length - 1; i >= 0; i--) {
      yield this.#items[i]
    }
  }

  toString() {
    return [...this].join(' <- ')
  }
}

// ═══ Ishlatish ═══
const stack = new Stack()
stack.push(10).push(20).push(30)

console.log(stack.peek())     // 30
console.log(stack.size)       // 3
console.log(stack.toString()) // "30 <- 20 <- 10"

console.log(stack.pop())      // 30
console.log(stack.pop())      // 20
console.log(stack.peek())     // 10

// ═══ ARRAY AS STACK — eng oddiy usul ═══
const simpleStack = []
simpleStack.push('a')  // ['a']
simpleStack.push('b')  // ['a', 'b']
simpleStack.push('c')  // ['a', 'b', 'c']

console.log(simpleStack.pop())                 // 'c'
console.log(simpleStack[simpleStack.length - 1]) // 'b' (peek)
console.log(simpleStack.length === 0)           // false (isEmpty)

// ═══ Undo/Redo misoli ═══
class UndoRedo {
  #undoStack = []
  #redoStack = []
  #current

  constructor(initialState) {
    this.#current = initialState
  }

  execute(newState) {
    this.#undoStack.push(this.#current)
    this.#current = newState
    this.#redoStack = []  // redo tarixni tozalash
    return this.#current
  }

  undo() {
    if (this.#undoStack.length === 0) return this.#current
    this.#redoStack.push(this.#current)
    this.#current = this.#undoStack.pop()
    return this.#current
  }

  redo() {
    if (this.#redoStack.length === 0) return this.#current
    this.#undoStack.push(this.#current)
    this.#current = this.#redoStack.pop()
    return this.#current
  }

  get state() { return this.#current }
}

const editor = new UndoRedo('Hello')
editor.execute('Hello World')
editor.execute('Hello World!')
console.log(editor.state)   // "Hello World!"
console.log(editor.undo())  // "Hello World"
console.log(editor.undo())  // "Hello"
console.log(editor.redo())  // "Hello World"`,
    },
    {
      title: 'Optimal Queue — Object-based O(1) dequeue',
      language: 'js',
      description: 'Array.shift() O(n) muammosini hal qiluvchi Queue implementatsiya',
      code: `// ═══ MUAMMO: Array.shift() = O(n) ═══
// shift() barcha elementlarni bitta chapga suradi
// 10,000 elementli array da shift() — 9,999 element surish!

// Benchmark: Array vs Object Queue
function benchmarkArray(n) {
  const queue = []
  for (let i = 0; i < n; i++) queue.push(i)

  const start = performance.now()
  while (queue.length) queue.shift()  // O(n) har safar!
  return performance.now() - start
}
// 100,000 element: ~2000ms (juda sekin!)

// ═══ OPTIMAL QUEUE — Object-based ═══
class Queue {
  #items = {}
  #head = 0
  #tail = 0

  // Oxiriga qo'shish — O(1)
  enqueue(item) {
    this.#items[this.#tail] = item
    this.#tail++
    return this
  }

  // Boshidan olish — O(1) !!!
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty')
    }
    const item = this.#items[this.#head]
    delete this.#items[this.#head]  // xotirani tozalash
    this.#head++
    return item
  }

  // Boshdagini ko'rish — O(1)
  front() {
    return this.#items[this.#head]
  }

  // Oxiridagini ko'rish — O(1)
  rear() {
    return this.#items[this.#tail - 1]
  }

  isEmpty() {
    return this.#tail - this.#head === 0
  }

  get size() {
    return this.#tail - this.#head
  }

  clear() {
    this.#items = {}
    this.#head = 0
    this.#tail = 0
  }

  *[Symbol.iterator]() {
    for (let i = this.#head; i < this.#tail; i++) {
      yield this.#items[i]
    }
  }

  toString() {
    return [...this].join(' <- ')
  }
}

// ═══ Ishlatish ═══
const queue = new Queue()
queue.enqueue('Ali').enqueue('Vali').enqueue('Jasur')

console.log(queue.front())     // 'Ali'
console.log(queue.rear())      // 'Jasur'
console.log(queue.size)        // 3
console.log(queue.toString())  // 'Ali <- Vali <- Jasur'

console.log(queue.dequeue())   // 'Ali'   — O(1)!
console.log(queue.dequeue())   // 'Vali'  — O(1)!
console.log(queue.front())     // 'Jasur'

// ═══ CIRCULAR QUEUE (Fixed Size) ═══
class CircularQueue {
  #items
  #head = 0
  #tail = 0
  #count = 0
  #capacity

  constructor(capacity) {
    this.#capacity = capacity
    this.#items = new Array(capacity)
  }

  enqueue(item) {
    if (this.isFull()) throw new Error('Queue is full')
    this.#items[this.#tail] = item
    this.#tail = (this.#tail + 1) % this.#capacity
    this.#count++
    return true
  }

  dequeue() {
    if (this.isEmpty()) throw new Error('Queue is empty')
    const item = this.#items[this.#head]
    this.#head = (this.#head + 1) % this.#capacity
    this.#count--
    return item
  }

  isEmpty() { return this.#count === 0 }
  isFull() { return this.#count === this.#capacity }
  get size() { return this.#count }
}

const ring = new CircularQueue(3)
ring.enqueue('a')
ring.enqueue('b')
ring.enqueue('c')
// ring.enqueue('d')  // Error: Queue is full
ring.dequeue()        // 'a' — joy ochildi
ring.enqueue('d')     // endi sig'adi!`,
    },
    {
      title: 'Bracket Matching — Valid Parentheses',
      language: 'js',
      description: 'Stack yordamida qavslar to\'g\'riligini tekshirish (LeetCode #20)',
      code: `// ═══ VALID PARENTHESES ═══
// Berilgan: string faqat '(){}[]' belgilardan iborat
// Tekshirish: har bir ochilgan qavs to'g'ri yopilganmi?
//
// "({[]})" -> true
// "({[}])" -> false (noto'g'ri tartib)
// "((("    -> false (yopilmagan)
// ")"      -> false (ortiqcha yopuvchi)

function isValid(s) {
  const stack = []
  const pairs = {
    ')': '(',
    '}': '{',
    ']': '['
  }

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      // Ochiluvchi qavs — stack ga push
      stack.push(char)
    } else {
      // Yopiluvchi qavs — stack dan pop va tekshirish
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false
      }
    }
  }

  // Stack bo'sh bo'lishi kerak (barcha qavslar yopilgan)
  return stack.length === 0
}

// Test
console.log(isValid('()'))        // true
console.log(isValid('()[]{}'))    // true
console.log(isValid('({[]})'))    // true
console.log(isValid('(]'))        // false
console.log(isValid('({[}])'))    // false
console.log(isValid('(('))        // false

// ═══ KENGAYTIRILGAN VERSIYA ═══
// Boshqa belgilarni e'tiborsiz qoldirib, faqat qavslarni tekshirish
// Masalan: "function test() { if (a[0]) { return true } }"

function isValidCode(code) {
  const stack = []
  const openers = new Set(['(', '{', '['])
  const closers = { ')': '(', '}': '{', ']': '[' }

  for (const char of code) {
    if (openers.has(char)) {
      stack.push(char)
    } else if (char in closers) {
      if (stack.length === 0 || stack.pop() !== closers[char]) {
        return false
      }
    }
    // Boshqa belgilar — skip
  }

  return stack.length === 0
}

console.log(isValidCode('function test() { return [1, 2] }'))  // true
console.log(isValidCode('if (a { b) }'))                        // false

// ═══ MINIMUM QAVSLAR O'CHIRISH ═══
// Noto'g'ri qavslarni olib tashlab, valid qilish
function minRemoveToMakeValid(s) {
  const chars = [...s]
  const stack = []  // indekslar stack-i

  // 1-pass: ortiqcha yopuvchilarni belgilash
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === '(') {
      stack.push(i)
    } else if (chars[i] === ')') {
      if (stack.length > 0) {
        stack.pop()  // juftlandi
      } else {
        chars[i] = ''  // ortiqcha yopuvchi — o'chirish
      }
    }
  }

  // 2-pass: yopilmagan ochuvchilarni o'chirish
  for (const idx of stack) {
    chars[idx] = ''
  }

  return chars.join('')
}

console.log(minRemoveToMakeValid('a(b(c)d'))     // "a(b(c)d)" -> "ab(c)d"
console.log(minRemoveToMakeValid('))(('))         // ""
console.log(minRemoveToMakeValid('(a(b(c)d)'))    // "a(b(c)d)"`,
    },
    {
      title: 'Min Stack implementatsiya',
      language: 'js',
      description: 'O(1) da minimum element qaytaruvchi Stack (LeetCode #155)',
      code: `// ═══ MIN STACK ═══
// Oddiy Stack operatsiyalari + getMin() O(1) da
// Muammo: push/pop da minimum o'zgarishi mumkin
// Yechim: har bir qadamda shu paytdagi min ni saqlash

class MinStack {
  #stack = []     // asosiy stack
  #minStack = []  // har bir bosqichdagi min qiymat

  // O(1)
  push(val) {
    this.#stack.push(val)

    // minStack ga shu paytdagi minimum ni push qilamiz
    const currentMin = this.#minStack.length === 0
      ? val
      : Math.min(val, this.#minStack[this.#minStack.length - 1])

    this.#minStack.push(currentMin)
  }

  // O(1)
  pop() {
    this.#minStack.pop()
    return this.#stack.pop()
  }

  // O(1)
  top() {
    return this.#stack[this.#stack.length - 1]
  }

  // O(1) — asosiy feature!
  getMin() {
    return this.#minStack[this.#minStack.length - 1]
  }

  get size() {
    return this.#stack.length
  }

  isEmpty() {
    return this.#stack.length === 0
  }
}

// ═══ Ishlatish ═══
const ms = new MinStack()
ms.push(5)
ms.push(3)
ms.push(7)
ms.push(1)
ms.push(4)

console.log(ms.getMin())  // 1
ms.pop()  // 4 chiqdi
console.log(ms.getMin())  // 1 (hali bor)
ms.pop()  // 1 chiqdi
console.log(ms.getMin())  // 3 (1 ketdi, endi 3 min)
ms.pop()  // 7 chiqdi
console.log(ms.getMin())  // 3

// ═══ OPTIMALLASHTIRILGAN MIN STACK ═══
// Xotirani tejash — minStack ga faqat min o'zgarganda push
class MinStackOptimized {
  #stack = []
  #minStack = []

  push(val) {
    this.#stack.push(val)
    // Faqat yangi min yoki teng bo'lganda push
    if (
      this.#minStack.length === 0 ||
      val <= this.#minStack[this.#minStack.length - 1]
    ) {
      this.#minStack.push(val)
    }
  }

  pop() {
    const val = this.#stack.pop()
    // Agar pop qilingan qiymat min bo'lsa — minStack dan ham pop
    if (val === this.#minStack[this.#minStack.length - 1]) {
      this.#minStack.pop()
    }
    return val
  }

  top() {
    return this.#stack[this.#stack.length - 1]
  }

  getMin() {
    return this.#minStack[this.#minStack.length - 1]
  }
}

// ═══ MAX STACK (bonus) ═══
// Xuddi MinStack, lekin Math.max ishlatiladi
class MaxStack {
  #stack = []
  #maxStack = []

  push(val) {
    this.#stack.push(val)
    const currentMax = this.#maxStack.length === 0
      ? val
      : Math.max(val, this.#maxStack[this.#maxStack.length - 1])
    this.#maxStack.push(currentMax)
  }

  pop() {
    this.#maxStack.pop()
    return this.#stack.pop()
  }

  top() { return this.#stack[this.#stack.length - 1] }
  getMax() { return this.#maxStack[this.#maxStack.length - 1] }
}

const maxS = new MaxStack()
maxS.push(2)
maxS.push(5)
maxS.push(1)
console.log(maxS.getMax())  // 5
maxS.pop()
console.log(maxS.getMax())  // 5 (hali bor)`,
    },
  ],
  interviewQA: [
    {
      question: 'Stack va Queue farqi? Real-world misollari?',
      answer: 'Stack — LIFO (Last In First Out): oxirgi qo\'shilgan birinchi chiqadi. Queue — FIFO (First In First Out): birinchi qo\'shilgan birinchi chiqadi. Stack misollari: Call Stack (funksiya chaqiruvlari), Undo/Redo (Ctrl+Z), browser back button, bracket matching, DFS algoritmi. Queue misollari: BFS algoritmi, printer navbati, task queue (setTimeout/setInterval), message queue (Kafka, RabbitMQ), event loop microtask/macrotask navbatlari. Asosiy farq — element qaysi uchidan olinadi: Stack tepadan (oxiridan), Queue boshidan (birinchisidan).',
    },
    {
      question: 'Array.shift() nega O(n)? Qanday optimallashtirish mumkin?',
      answer: 'Array.shift() birinchi elementni olib tashlaganda, qolgan BARCHA elementlarni bitta chapga (index-1 ga) surishi kerak. 10,000 elementli array da shift() — 9,999 ta element ko\'chirish. Bu O(n) operatsiya. Optimallashtirish: Object-based Queue ishlatish — head va tail indekslari bilan. enqueue: items[tail++] = element, dequeue: item = items[head]; delete items[head++]. Ikkalasi ham O(1). Yana bir variant: Circular Buffer — fixed-size array da head/tail modular arifmetika bilan. Katta hajmdagi ma\'lumotlarda bu farq juda sezilarli — 100,000 elementda Array.shift() sekundlar oladi, Object Queue millisekundlarda tugaydi.',
    },
    {
      question: 'Valid Parentheses masalasini qanday yechish kerak?',
      answer: 'Stack ishlatiladi. String bo\'ylab yurib: 1) Ochiluvchi qavs uchrasangiz — stack ga push qiling. 2) Yopiluvchi qavs uchrasangiz — stack dan pop qilib, juftligini tekshiring. Agar stack bo\'sh yoki juftlik mos kelmasa — false. 3) String tugaganda stack bo\'sh bo\'lishi kerak (barcha qavslar yopilgan). Pairs mapping: ) -> (, } -> {, ] -> [. Complexity: O(n) vaqt, O(n) xotira. Kengaytirilgan variant: boshqa belgilarni skip qilish (kod tekshirish), minimum qavslar o\'chirish (noto\'g\'ri qavslarni olib tashlab valid qilish). Bu masala Stack ning klassik qo\'llanilishi va intervyuda juda tez-tez so\'raladi.',
    },
    {
      question: 'Call Stack nima va Stack Overflow qanday bo\'ladi?',
      answer: 'Call Stack — JavaScript engine (V8) dagi stack tuzilmasi bo\'lib, funksiya chaqiruvlarini kuzatadi. Har bir funksiya chaqirilganda stack ga frame push qilinadi (funksiya, argumentlar, local variables), funksiya tugaganda pop qilinadi. JavaScript single-threaded — bitta Call Stack bor. Stack Overflow — rekursiya cheksiz davom etganda yoki juda chuqur bo\'lganda stack hajmi yetmay qoladi: "RangeError: Maximum call stack size exceeded". Chrome da ~10,000-15,000 frame limit. Yechimlar: 1) Rekursiyani iteratsiyaga aylantirish. 2) Tail Call Optimization (faqat Safari da ishlaydi). 3) Trampolining — rekursiv funksiyani thunk qaytaruvchi qilib, while loop bilan chaqirish. 4) Katta ma\'lumotlarni bo\'laklarga ajratib, setTimeout/requestAnimationFrame bilan qayta ishlash.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'big-o',
      label: 'Big O Notation',
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'linked-list',
      label: 'LinkedList',
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'graph-basics',
      label: 'Graph Basics',
    },
  ],
}
