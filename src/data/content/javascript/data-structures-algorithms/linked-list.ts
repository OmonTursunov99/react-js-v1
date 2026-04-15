import type { Topic } from '../../../types'

export const linkedList: Topic = {
  id: 'linked-list',
  title: 'LinkedList (Bog\'langan Ro\'yxat)',
  importance: 3,
  status: 'to-learn',
  description: 'ListNode, Singly/Doubly LinkedList, klassik masalalar',
  content: `
=======================================
  LINKED LIST NIMA?
=======================================

Linked List — bu ma'lumotlar tuzilmasi bo'lib, elementlar (node-lar)
bir-biriga ko'rsatgich (pointer) orqali bog'langan. Har bir node
ikkita qismdan iborat: qiymat (val) va keyingi node ga havola (next).

Array dan farqli, Linked List elementlari xotirada ketma-ket
joylashmaydi — har bir node xotiraning ixtiyoriy joyida bo'lishi
mumkin, ular faqat havolalar orqali bog'langan.

Node tuzilmasi:
  node = { val: 42, next: -> keyingi node }

HEAD — ro'yxatning birinchi node-i
TAIL — ro'yxatning oxirgi node-i (next = null)

=======================================
  SINGLY VS DOUBLY LINKED LIST
=======================================

SINGLY LINKED LIST:
- Har bir node faqat NEXT ga ko'rsatgichga ega
- Faqat old -> orqa yo'nalishda o'tish mumkin
- Kamroq xotira ishlatadi (har node da 1 ta pointer)
- Tuzilmasi: HEAD -> [A|->] -> [B|->] -> [C|null]

DOUBLY LINKED LIST:
- Har bir node NEXT va PREV ko'rsatgichlariga ega
- Ikki yo'nalishda ham o'tish mumkin
- Ko'proq xotira ishlatadi (har node da 2 ta pointer)
- Tuzilmasi: HEAD <-> [A] <-> [B] <-> [C] <-> TAIL

Qachon Doubly kerak:
- Orqaga o'tish kerak bo'lganda (browser history)
- O'chirish operatsiyasi tez bo'lishi kerak (O(1))
- LRU Cache implementatsiyasida

=======================================
  ARRAY VS LINKED LIST
=======================================

| Operatsiya         | Array     | LinkedList |
|--------------------|-----------|------------|
| Index bo'yicha o'qish | O(1)   | O(n)       |
| Boshiga qo'shish   | O(n)      | O(1)       |
| Oxiriga qo'shish   | O(1)*     | O(1)**     |
| O'rtaga qo'shish   | O(n)      | O(1)***    |
| Qidirish           | O(n)      | O(n)       |
| O'chirish (boshidan)| O(n)     | O(1)       |

* Array — amortized O(1), resize bo'lganda O(n)
** Tail pointer bo'lsa
*** Node topilgan bo'lsa; topish O(n)

ARRAY tanlang:
- Random access kerak (index bo'yicha tez o'qish)
- Cache-friendly (xotirada ketma-ket joylashgan)
- Kichik hajmdagi ma'lumotlar

LINKED LIST tanlang:
- Boshiga tez-tez qo'shish/o'chirish
- O'lcham oldindan noma'lum
- O'rtadan tez o'chirish kerak (node havolasi bor bo'lsa)

=======================================
  ASOSIY OPERATSIYALAR VA COMPLEXITY
=======================================

1. APPEND (oxiriga qo'shish) — O(1) tail bilan, O(n) tailsiz
   - Yangi node yaratish
   - Tail.next = yangi node
   - Tail = yangi node

2. PREPEND (boshiga qo'shish) — O(1)
   - Yangi node yaratish
   - Yangi node.next = head
   - Head = yangi node

3. INSERT (o'rtaga qo'shish) — O(n) topish + O(1) qo'shish
   - Kerakli pozitsiyagacha o'tish
   - Yangi node.next = current.next
   - Current.next = yangi node

4. DELETE — O(n) topish + O(1) o'chirish
   - O'chirilayotgan node dan oldingi node ni topish
   - Prev.next = current.next

5. SEARCH — O(n)
   - Head dan boshlab har bir node ni tekshirish

=======================================
  KLASSIK MASALALAR
=======================================

1. REVERSE LINKED LIST
   Eng ko'p so'raladigan masala! Ikki usul bor:
   - Iterativ: uchta pointer (prev, current, next)
   - Rekursiv: oxiridan boshlab havolalarni o'zgartirish
   Complexity: O(n) vaqt, O(1) xotira (iterativ)

2. DETECT CYCLE (Floyd's Algorithm)
   Slow pointer (1 qadam) va fast pointer (2 qadam).
   Agar cycle bo'lsa — ular albatta uchrashadi.
   Agar fast null ga yetsa — cycle yo'q.
   Cycle boshi: slow ni head ga qaytarib, ikkalasi 1 qadam.

3. MERGE TWO SORTED LISTS
   Ikki sorted list ni bitta sorted list ga birlashtirish.
   Dummy node yaratib, kichikroq elementni qo'shib borish.
   Complexity: O(n + m) vaqt, O(1) xotira

4. FIND MIDDLE NODE
   Slow (1 qadam) va fast (2 qadam) pointer.
   Fast oxiriga yetganda — slow o'rtada turadi.
   Complexity: O(n) vaqt, O(1) xotira

=======================================
  JAVASCRIPT DA LINKED LIST
=======================================

JavaScript da built-in LinkedList yo'q (Array bor). Lekin bilish
SHART chunki:

1. INTERVYU — eng ko'p so'raladigan mavzulardan biri
2. Algoritmik fikrlash — pointer manipulation tushunchasi
3. Real-world — DOM (childNodes), blockchain, undo/redo
4. Boshqa tuzilmalar asosi — Stack, Queue, Graph, Hash Table
   ichida Linked List ishlatiladi
5. LRU Cache — Doubly Linked List + Hash Map kombinatsiyasi`.trim(),
  codeExamples: [
    {
      title: 'ListNode va LinkedList implementatsiya',
      language: 'js',
      description: 'Asosiy LinkedList class: append, prepend, delete, find, print',
      code: `// ═══ ListNode — asosiy qurilish bloki ═══
class ListNode {
  constructor(val) {
    this.val = val
    this.next = null
  }
}

// ═══ Singly Linked List ═══
class LinkedList {
  constructor() {
    this.head = null
    this.tail = null
    this.size = 0
  }

  // Oxiriga qo'shish — O(1)
  append(val) {
    const node = new ListNode(val)
    if (!this.head) {
      this.head = node
      this.tail = node
    } else {
      this.tail.next = node
      this.tail = node
    }
    this.size++
    return this
  }

  // Boshiga qo'shish — O(1)
  prepend(val) {
    const node = new ListNode(val)
    node.next = this.head
    this.head = node
    if (!this.tail) this.tail = node
    this.size++
    return this
  }

  // Index bo'yicha qo'shish — O(n)
  insertAt(index, val) {
    if (index <= 0) return this.prepend(val)
    if (index >= this.size) return this.append(val)

    const node = new ListNode(val)
    let prev = this.head
    for (let i = 0; i < index - 1; i++) {
      prev = prev.next
    }
    node.next = prev.next
    prev.next = node
    this.size++
    return this
  }

  // Qiymat bo'yicha o'chirish — O(n)
  delete(val) {
    if (!this.head) return null

    // Head ni o'chirish
    if (this.head.val === val) {
      const removed = this.head
      this.head = this.head.next
      if (!this.head) this.tail = null
      this.size--
      return removed
    }

    // O'rtadan yoki oxiridan o'chirish
    let current = this.head
    while (current.next) {
      if (current.next.val === val) {
        const removed = current.next
        current.next = current.next.next
        if (!current.next) this.tail = current
        this.size--
        return removed
      }
      current = current.next
    }
    return null
  }

  // Qidirish — O(n)
  find(val) {
    let current = this.head
    while (current) {
      if (current.val === val) return current
      current = current.next
    }
    return null
  }

  // Array ga aylantirish
  toArray() {
    const result = []
    let current = this.head
    while (current) {
      result.push(current.val)
      current = current.next
    }
    return result
  }

  // Chiroyli ko'rsatish
  print() {
    console.log(this.toArray().join(' -> ') + ' -> null')
  }
}

// ═══ Ishlatish ═══
const list = new LinkedList()
list.append(10).append(20).append(30)
list.prepend(5)
list.insertAt(2, 15)
list.print()        // 5 -> 10 -> 15 -> 20 -> 30 -> null

list.delete(15)
list.print()        // 5 -> 10 -> 20 -> 30 -> null

console.log(list.find(20))    // ListNode { val: 20, next: ... }
console.log(list.size)        // 4`,
    },
    {
      title: 'Reverse Linked List — iterativ va rekursiv',
      language: 'js',
      description: 'Eng ko\'p so\'raladigan intervyu masalasi: ro\'yxatni teskari aylantirish',
      code: `class ListNode {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

// Yordamchi funksiya: array dan list yaratish
function createList(arr) {
  const dummy = new ListNode(0)
  let current = dummy
  for (const val of arr) {
    current.next = new ListNode(val)
    current = current.next
  }
  return dummy.next
}

// List ni array ga aylantirish
function toArray(head) {
  const result = []
  while (head) {
    result.push(head.val)
    head = head.next
  }
  return result
}

// ═══ ITERATIV REVERSE — O(n) vaqt, O(1) xotira ═══
// Eng optimal usul! Uchta pointer ishlatiladi.
function reverseIterative(head) {
  let prev = null
  let current = head

  while (current) {
    const next = current.next  // keyingisini saqlab qo'yamiz
    current.next = prev        // yo'nalishni o'zgartiramiz
    prev = current             // prev ni oldinga suramiz
    current = next             // current ni oldinga suramiz
  }

  return prev  // prev — yangi head
}

// Qadamlar vizualizatsiyasi:
// Boshlang'ich: 1 -> 2 -> 3 -> 4 -> null
//
// Qadam 1: null <- 1    2 -> 3 -> 4 -> null
//          prev  curr  next
//
// Qadam 2: null <- 1 <- 2    3 -> 4 -> null
//                 prev  curr  next
//
// Qadam 3: null <- 1 <- 2 <- 3    4 -> null
//                       prev  curr  next
//
// Qadam 4: null <- 1 <- 2 <- 3 <- 4
//                             prev  curr=null
//
// Natija: 4 -> 3 -> 2 -> 1 -> null

// ═══ REKURSIV REVERSE — O(n) vaqt, O(n) xotira ═══
// Stack frame lar tufayli xotira O(n)
function reverseRecursive(head) {
  // Base case
  if (!head || !head.next) return head

  // Oxirigacha borish
  const newHead = reverseRecursive(head.next)

  // Orqaga qaytayotganda havolani o'zgartirish
  head.next.next = head  // keyingi node bizga ko'rsatsin
  head.next = null        // bizning ko'rsatgichni o'chiramiz

  return newHead
}

// ═══ Test ═══
const list1 = createList([1, 2, 3, 4, 5])
console.log(toArray(reverseIterative(list1)))
// [5, 4, 3, 2, 1]

const list2 = createList([1, 2, 3, 4, 5])
console.log(toArray(reverseRecursive(list2)))
// [5, 4, 3, 2, 1]

// Bo'sh va bitta elementli list
console.log(reverseIterative(null))             // null
console.log(toArray(reverseIterative(
  createList([42])
)))                                              // [42]`,
    },
    {
      title: 'Floyd\'s Cycle Detection — hasCycle va findCycleStart',
      language: 'js',
      description: 'Ikki pointer (tortoise & hare) algoritmi bilan cycle aniqlash',
      code: `class ListNode {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

// ═══ CYCLE BORMI? — Floyd's Algorithm ═══
// Slow pointer — 1 qadam, Fast pointer — 2 qadam
// Agar cycle bo'lsa — ular albatta uchrashadi
// Agar fast null ga yetsa — cycle yo'q
//
// Nima uchun ishlaydi?
// Fast har qadamda slow ga 1 qadam yaqinlashadi.
// Agar cycle bo'lsa, fast cycle ichida "aylanib" slow ni quvib yetadi.

function hasCycle(head) {
  let slow = head
  let fast = head

  while (fast && fast.next) {
    slow = slow.next        // 1 qadam
    fast = fast.next.next   // 2 qadam

    if (slow === fast) return true  // uchrashdi = cycle bor
  }

  return false  // fast null ga yetdi = cycle yo'q
}

// ═══ CYCLE BOSHINI TOPISH ═══
// 1-qadam: slow va fast uchrashish nuqtasini topish
// 2-qadam: slow ni HEAD ga qaytarish
// 3-qadam: ikkalasi 1 qadam bilan yurishda — cycle boshida uchrashadi
//
// Matematik isboti:
// Head dan cycle boshigacha masofa = a
// Cycle boshidan uchrashish nuqtasigacha = b
// Cycle uzunligi = c
// slow bosgan yo'l: a + b
// fast bosgan yo'l: a + b + n*c (n - necha marta aylanib o'tgan)
// fast = 2 * slow => a + b + n*c = 2(a + b) => a = n*c - b
// Demak a qadam HEAD dan = c - b qadam uchrashish nuqtasidan
// Ikkalasi ham cycle boshida uchrashadi!

function findCycleStart(head) {
  let slow = head
  let fast = head
  let hasCycle = false

  // 1-qadam: uchrashish nuqtasini topish
  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
    if (slow === fast) {
      hasCycle = true
      break
    }
  }

  if (!hasCycle) return null

  // 2-qadam: slow ni head ga qaytarish
  slow = head

  // 3-qadam: ikkalasi 1 qadam bilan yurish
  while (slow !== fast) {
    slow = slow.next
    fast = fast.next
  }

  return slow  // cycle boshi
}

// ═══ Test ═══
// Cycle yaratish: 1 -> 2 -> 3 -> 4 -> 5 -> 3 (cycle)
const node1 = new ListNode(1)
const node2 = new ListNode(2)
const node3 = new ListNode(3)
const node4 = new ListNode(4)
const node5 = new ListNode(5)
node1.next = node2
node2.next = node3
node3.next = node4
node4.next = node5
node5.next = node3  // cycle! 5 -> 3

console.log(hasCycle(node1))           // true
console.log(findCycleStart(node1).val) // 3

// Cycle yo'q
const normal = new ListNode(1, new ListNode(2, new ListNode(3)))
console.log(hasCycle(normal))          // false
console.log(findCycleStart(normal))    // null`,
    },
    {
      title: 'Merge Two Sorted Lists va Find Middle',
      language: 'js',
      description: 'Ikkita tartiblangan list ni birlashtirish va o\'rta node ni topish',
      code: `class ListNode {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

function createList(arr) {
  const dummy = new ListNode(0)
  let current = dummy
  for (const val of arr) {
    current.next = new ListNode(val)
    current = current.next
  }
  return dummy.next
}

function toArray(head) {
  const result = []
  while (head) {
    result.push(head.val)
    head = head.next
  }
  return result
}

// ═══ MERGE TWO SORTED LISTS ═══
// Ikki sorted list ni bitta sorted list ga birlashtirish
// Dummy node texnikasi — boshi bilan o'ynashmaslik uchun
// Complexity: O(n + m) vaqt, O(1) xotira (yangi node yaratmaymiz)

function mergeTwoSorted(l1, l2) {
  const dummy = new ListNode(0)
  let current = dummy

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1
      l1 = l1.next
    } else {
      current.next = l2
      l2 = l2.next
    }
    current = current.next
  }

  // Qolgan elementlarni qo'shish
  current.next = l1 || l2

  return dummy.next
}

// Rekursiv variant
function mergeTwoSortedRecursive(l1, l2) {
  if (!l1) return l2
  if (!l2) return l1

  if (l1.val <= l2.val) {
    l1.next = mergeTwoSortedRecursive(l1.next, l2)
    return l1
  } else {
    l2.next = mergeTwoSortedRecursive(l1, l2.next)
    return l2
  }
}

// ═══ FIND MIDDLE NODE ═══
// Slow/Fast pointer texnikasi
// Fast 2 qadam, slow 1 qadam — fast oxiriga yetganda slow o'rtada

function findMiddle(head) {
  let slow = head
  let fast = head

  while (fast && fast.next) {
    slow = slow.next
    fast = fast.next.next
  }

  return slow
}

// Juft elementlarda ikkinchi o'rta elementni qaytaradi:
// [1, 2, 3, 4] -> 3 (ikkinchi o'rta)
// Agar birinchi o'rta kerak bo'lsa:
function findMiddleFirst(head) {
  let slow = head
  let fast = head

  while (fast.next && fast.next.next) {
    slow = slow.next
    fast = fast.next.next
  }

  return slow
}

// ═══ Test: Merge ═══
const list1 = createList([1, 3, 5, 7])
const list2 = createList([2, 4, 6, 8])
console.log(toArray(mergeTwoSorted(list1, list2)))
// [1, 2, 3, 4, 5, 6, 7, 8]

const list3 = createList([1, 1, 3])
const list4 = createList([1, 2, 4])
console.log(toArray(mergeTwoSortedRecursive(list3, list4)))
// [1, 1, 1, 2, 3, 4]

// ═══ Test: Middle ═══
const odd = createList([1, 2, 3, 4, 5])
console.log(findMiddle(odd).val)   // 3

const even = createList([1, 2, 3, 4])
console.log(findMiddle(even).val)       // 3 (ikkinchi o'rta)
console.log(findMiddleFirst(even).val)  // 2 (birinchi o'rta)`,
    },
  ],
  interviewQA: [
    {
      question: 'Array va LinkedList farqi? Qachon LinkedList yaxshiroq?',
      answer: 'Array elementlari xotirada ketma-ket joylashgan, index bo\'yicha O(1) da o\'qiladi, lekin boshiga qo\'shish O(n) chunki barcha elementlar suriladi. LinkedList node-lari xotirada tarqoq, havolalar bilan bog\'langan — boshiga qo\'shish O(1), lekin index bo\'yicha o\'qish O(n). LinkedList yaxshiroq: 1) Boshiga tez-tez qo\'shish/o\'chirish kerak bo\'lganda (playlist, undo history). 2) O\'lcham oldindan noma\'lum va tez-tez o\'zgaradi. 3) O\'rtadan o\'chirish kerak va node havolasi mavjud. Array yaxshiroq: random access kerak, cache-friendly bo\'lishi kerak, kichik hajmdagi ma\'lumotlar bilan ishlash.',
    },
    {
      question: 'Linked List ni reverse qilish — iterativ usul qanday ishlaydi?',
      answer: 'Uchta pointer ishlatiladi: prev (dastlab null), current (dastlab head), next (vaqtinchalik). Har bir qadamda: 1) next = current.next — keyingi node ni saqlaymiz. 2) current.next = prev — yo\'nalishni teskariga o\'zgartiramiz. 3) prev = current — prev ni oldinga suramiz. 4) current = next — current ni oldinga suramiz. Sikl current null bo\'lganda tugaydi va prev yangi head bo\'ladi. Complexity: O(n) vaqt, O(1) xotira. Rekursiv usul ham bor lekin O(n) qo\'shimcha xotira ishlatadi (call stack). Intervyuda iterativ usulni yozish va qadamlarni vizual tushuntirish muhim.',
    },
    {
      question: 'Floyd\'s Algorithm nima? Cycle ni qanday aniqlash mumkin?',
      answer: 'Floyd\'s Tortoise and Hare algoritmi — ikki pointer texnikasi. Slow pointer 1 qadam, fast pointer 2 qadam bosadi. Agar cycle bo\'lsa — fast slow ni quvib yetadi (uchrashadi), chunki har qadamda oradagi masofa 1 ga kamayadi. Agar cycle yo\'q bo\'lsa — fast null ga yetadi. Cycle boshini topish: uchrashish nuqtasidan keyin slow ni head ga qaytaramiz, keyin ikkalasi 1 qadam bilan yurishadi — ular cycle boshida uchrashadi. Bu matematik jihatdan isbot qilingan: head dan cycle boshigacha masofa = uchrashish nuqtasidan cycle boshigacha masofa. Complexity: O(n) vaqt, O(1) xotira — Set/Map ishlatmasdan!',
    },
    {
      question: 'Ikki tartiblangan linked list ni qanday merge qilasiz?',
      answer: 'Dummy node texnikasi ishlatiladi. Dummy = new ListNode(0) — natija list boshi. current = dummy pointer orqali natijaga element qo\'shamiz. Ikki list ning joriy elementlarini solishtramiz: kichigini current.next ga ulaymiz va o\'sha list pointerini oldinga suramiz. Biror list tugaganda, qolganini to\'g\'ridan-to\'g\'ri ulaymiz (current.next = l1 || l2). Natija dummy.next dan boshlanadi. Complexity: O(n + m) vaqt, O(1) xotira — yangi node yaratilmaydi, mavjud node lar qayta ulanadi. Bu texnika Merge Sort da ham ishlatiladi. Rekursiv variant ham bor lekin O(n + m) stack xotira ishlatadi.',
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
      topicId: 'stack-queue',
      label: 'Stack va Queue',
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'array-string-patterns',
      label: 'Array va String Patterns',
    },
  ],
}
