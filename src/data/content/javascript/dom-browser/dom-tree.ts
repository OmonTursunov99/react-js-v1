import type { Topic } from '../../../types'

export const domTree: Topic = {
  id: 'dom-tree',
  title: 'DOM Tree va Nodes',
  importance: 3,
  status: 'to-learn',
  description: 'DOM daraxti tuzilmasi, node turlari, traversal usullari',
  content: `
# DOM Tree va Nodes

## DOM nima?

**DOM (Document Object Model)** — bu HTML hujjatni daraxt (tree) ko'rinishida ifodalovchi API. Brauzer HTML ni parse qilganda, har bir element, matn, izoh — hammasi **node** (tugun) bo'ladi.

## Node turlari (nodeType)

| nodeType | Qiymati | Misol |
|----------|---------|-------|
| \`ELEMENT_NODE\` | 1 | \`<div>\`, \`<p>\` |
| \`TEXT_NODE\` | 3 | \`"Hello"\` |
| \`COMMENT_NODE\` | 8 | \`<!-- izoh -->\` |
| \`DOCUMENT_NODE\` | 9 | \`document\` |
| \`DOCUMENT_FRAGMENT_NODE\` | 11 | \`DocumentFragment\` |

## DOM daraxti strukturasi

\`\`\`
document
└── html (ELEMENT_NODE)
    ├── head
    │   └── title
    │       └── "Sahifa nomi" (TEXT_NODE)
    └── body
        ├── h1
        │   └── "Salom" (TEXT_NODE)
        └── p
            └── "Matn" (TEXT_NODE)
\`\`\`

## Element tanlash usullari

- \`getElementById(id)\` — ID bo'yicha bitta element
- \`querySelector(selector)\` — CSS selector bo'yicha birinchi element
- \`querySelectorAll(selector)\` — barcha mos elementlar (NodeList)
- \`getElementsByClassName()\` — live HTMLCollection qaytaradi
- \`getElementsByTagName()\` — live HTMLCollection qaytaradi

**Muhim farq:** \`querySelectorAll\` **statik** NodeList qaytaradi, \`getElementsBy*\` esa **live** HTMLCollection qaytaradi. Live collection DOM o'zgarganda avtomatik yangilanadi.

## DOM Traversal (harakatlanish)

**Barcha node turlari uchun:**
- \`parentNode\` — ota node
- \`childNodes\` — barcha bolalar (NodeList, matn va izohlar ham)
- \`firstChild\`, \`lastChild\` — birinchi/oxirgi bola
- \`nextSibling\`, \`previousSibling\` — qo'shni node

**Faqat elementlar uchun:**
- \`parentElement\` — ota element
- \`children\` — faqat element bolalar (HTMLCollection)
- \`firstElementChild\`, \`lastElementChild\`
- \`nextElementSibling\`, \`previousElementSibling\`

## NodeList vs HTMLCollection

\`NodeList\` — \`forEach()\` bor, \`querySelectorAll\` dan qaytadi.
\`HTMLCollection\` — \`forEach()\` **yo'q**, \`Array.from()\` bilan convert qilish kerak.

## closest() va matches()

- \`element.closest(selector)\` — eng yaqin ota elementni topadi (o'zini ham tekshiradi)
- \`element.matches(selector)\` — element selectorga mos kelishini tekshiradi

Bu ikki metod **event delegation** da juda ko'p ishlatiladi.
  `.trim(),
  codeExamples: [
    {
      title: 'Node turlari va traversal',
      language: 'js',
      description: 'DOM daraxtida harakatlanish va node turini aniqlash',
      code: `// Element tanlash
const container = document.getElementById('app');
const items = document.querySelectorAll('.item');
const firstItem = document.querySelector('.item:first-child');

// nodeType tekshirish
console.log(document.nodeType);         // 9 (DOCUMENT_NODE)
console.log(container.nodeType);        // 1 (ELEMENT_NODE)
console.log(container.firstChild?.nodeType); // 3 (TEXT_NODE) yoki 1

// Traversal — barcha node turlari
const parent = container.parentNode;
const allChildren = container.childNodes; // matn, izoh ham kiradi

// Traversal — faqat elementlar
const elementChildren = container.children;       // HTMLCollection
const first = container.firstElementChild;
const last = container.lastElementChild;
const next = first?.nextElementSibling;

// NodeList vs HTMLCollection
items.forEach(item => console.log(item.textContent)); // OK
// container.children.forEach(...) — XATO! HTMLCollection da forEach yo'q
Array.from(container.children).forEach(child => {
  console.log(child.tagName);
});`,
    },
    {
      title: 'querySelector vs getElementsBy* farqi',
      language: 'js',
      description: 'Static vs live collection farqini ko\'rsatish',
      code: `// Static NodeList — DOM o'zgarganda o'zgarmaydi
const staticList = document.querySelectorAll('.item');
console.log(staticList.length); // 3

// Live HTMLCollection — DOM bilan sinxron
const liveList = document.getElementsByClassName('item');
console.log(liveList.length); // 3

// Yangi element qo'shamiz
const newItem = document.createElement('div');
newItem.className = 'item';
document.body.appendChild(newItem);

console.log(staticList.length); // 3  — O'ZGARMADI!
console.log(liveList.length);   // 4  — Avtomatik yangilandi!

// closest() va matches()
document.addEventListener('click', (e) => {
  const target = e.target;

  // Bu element .card ichidami?
  const card = target.closest('.card');
  if (card) {
    console.log('Card ichida bosildi:', card);
  }

  // Element .btn klassiga egami?
  if (target.matches('.btn')) {
    console.log('Tugma bosildi');
  }
});`,
    },
    {
      title: 'DOM daraxtini rekursiv traversal',
      language: 'js',
      description: 'Daraxtni to\'liq aylanib chiqish',
      code: `// Barcha elementlarni rekursiv chiqarish
function walkDOM(node, callback, depth = 0) {
  callback(node, depth);

  let child = node.firstChild;
  while (child) {
    walkDOM(child, callback, depth + 1);
    child = child.nextSibling;
  }
}

walkDOM(document.body, (node, depth) => {
  const indent = '  '.repeat(depth);
  if (node.nodeType === Node.ELEMENT_NODE) {
    console.log(\`\${indent}<\${node.tagName.toLowerCase()}>\`);
  } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    console.log(\`\${indent}"\${node.textContent.trim()}"\`);
  }
});

// TreeWalker API — brauzerning built-in traversal
const walker = document.createTreeWalker(
  document.body,
  NodeFilter.SHOW_ELEMENT, // faqat elementlar
  {
    acceptNode(node) {
      return node.classList.contains('hidden')
        ? NodeFilter.FILTER_REJECT  // bu va bolalarini o'tkazib yuborish
        : NodeFilter.FILTER_ACCEPT;
    }
  }
);

while (walker.nextNode()) {
  console.log(walker.currentNode.tagName);
}`,
    },
  ],
  interviewQA: [
    {
      question: 'NodeList va HTMLCollection o\'rtasida qanday farq bor?',
      answer: 'NodeList — `querySelectorAll` qaytaradigan **statik** (snapshot) to\'plam, `forEach()` metodiga ega. HTMLCollection — `getElementsBy*` qaytaradigan **live** to\'plam, DOM o\'zgarganda avtomatik yangilanadi, lekin `forEach()` metodi yo\'q — `Array.from()` bilan convert qilish kerak.',
    },
    {
      question: 'document.querySelector va document.getElementById farqi nimada?',
      answer: '`getElementById` faqat ID bo\'yicha qidiradi va juda tez ishlaydi (ichki hash map orqali). `querySelector` ixtiyoriy CSS selectorni qabul qiladi (`.class`, `[attr]`, `:nth-child` va h.k.), lekin biroz sekinroq. `getElementById` null qaytaradi agar topilmasa, `querySelector` ham null qaytaradi.',
    },
    {
      question: 'closest() metodi nima va qachon ishlatiladi?',
      answer: '`element.closest(selector)` — elementning o\'zidan boshlab, DOM daraxtida yuqoriga qarab CSS selectorga mos keladigan eng yaqin ota elementni topadi. Asosan **event delegation** da ishlatiladi — masalan, `e.target.closest(\'.card\')` orqali bosilgan element qaysi card ichida ekanligini aniqlash.',
    },
    {
      question: 'DOM daraxtida harakatlanishning qanday usullari bor?',
      answer: 'Ikki guruh: 1) **Barcha node uchun:** `parentNode`, `childNodes`, `firstChild`, `lastChild`, `nextSibling`, `previousSibling` — matn va izoh nodelarni ham qaytaradi. 2) **Faqat elementlar uchun:** `parentElement`, `children`, `firstElementChild`, `lastElementChild`, `nextElementSibling`, `previousElementSibling`. Shuningdek, `TreeWalker` API murakkab traversal uchun ishlatiladi.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'dom-manipulation',
      label: 'DOM Manipulation',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'events',
      label: 'Events',
    },
  ],
}
