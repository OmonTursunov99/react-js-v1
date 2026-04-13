import type { Topic } from '../../../types'

export const domManipulation: Topic = {
  id: 'dom-manipulation',
  title: 'DOM Manipulation',
  importance: 3,
  status: 'to-learn',
  description: 'createElement, append, remove, cloneNode, DocumentFragment',
  content: `
# DOM Manipulation

## Element yaratish va qo'shish

Brauzerda dinamik kontent yaratish uchun DOM manipulation ishlatiladi. Bu — React yoki Vue kabi framework-lar ichida nima sodir bo'layotganini tushunish uchun muhim.

## Element yaratish

- \`document.createElement(tag)\` — yangi element yaratadi (DOM ga qo'shilmaydi)
- \`document.createTextNode(text)\` — matn node yaratadi
- \`document.createDocumentFragment()\` — fragment yaratadi (virtual konteyner)

## Element qo'shish

| Metod | Tavsif |
|-------|--------|
| \`parent.appendChild(node)\` | Oxiriga qo'shadi, faqat node |
| \`parent.append(...nodes)\` | Oxiriga, matn ham, bir nechta |
| \`parent.prepend(...nodes)\` | Boshiga qo'shadi |
| \`node.before(...nodes)\` | Oldiga qo'shadi |
| \`node.after(...nodes)\` | Orqasiga qo'shadi |
| \`parent.insertBefore(new, ref)\` | Ref oldiga |

\`append()\` va \`appendChild()\` farqi: \`append()\` bir nechta argument va matnni qabul qiladi, \`appendChild()\` faqat bitta node.

## Element o'chirish va almashtirish

- \`node.remove()\` — elementni DOM dan olib tashlaydi
- \`parent.removeChild(child)\` — bolani olib tashlaydi va qaytaradi
- \`parent.replaceChild(new, old)\` — almashtirib beradi
- \`node.replaceWith(...nodes)\` — o'zini almashtirib beradi

## Element klonlash

\`node.cloneNode(deep)\` — element nusxasini yaratadi:
- \`cloneNode(false)\` — faqat elementning o'zi (shallow)
- \`cloneNode(true)\` — element va barcha bolalari (deep)

**Eslatma:** Klonlangan elementda event listenerlar **saqlanmaydi**! Faqat inline (\`onclick\` attribut) saqlanadi.

## DocumentFragment

\`DocumentFragment\` — bu **virtual konteyner**. Unga elementlarni qo'shsangiz, reflow/repaint bo'lmaydi. Fragment DOM ga qo'shilganda, faqat uning bolalari ko'chadi, fragment o'zi yo'qoladi.

## innerHTML vs textContent vs innerText

- \`innerHTML\` — HTML sifatida o'qiydi/yozadi (**XSS xavfi!**)
- \`textContent\` — barcha matnni qaytaradi (yashirin elementlar ham), HTML parse qilmaydi
- \`innerText\` — faqat ko'rinadigan matn (CSS ni hisobga oladi, **sekin**)

## insertAdjacentHTML / insertAdjacentElement

\`element.insertAdjacentHTML(position, html)\` — innerHTML dan xavfsizroq va samaraliroq:
- \`'beforebegin'\` — element oldiga
- \`'afterbegin'\` — element ichiga, boshiga
- \`'beforeend'\` — element ichiga, oxiriga
- \`'afterend'\` — element orqasiga

## Performance maslahatlar

1. Ko'p element qo'shayotganda **DocumentFragment** ishlating
2. \`innerHTML\` ni loop ichida ishlatmang — har safar parse va serialize qiladi
3. Layout thrashing-dan saqlaning — o'qish va yozishni ajrating
  `.trim(),
  codeExamples: [
    {
      title: 'Element yaratish va qo\'shish',
      language: 'js',
      description: 'DOM ga yangi elementlar qo\'shishning turli usullari',
      code: `// Element yaratish
const card = document.createElement('div');
card.className = 'card';
card.setAttribute('data-id', '1');

const title = document.createElement('h2');
title.textContent = 'Salom Dunyo';

const description = document.createElement('p');
description.textContent = 'Bu oddiy DOM misoli';

// Ichki elementlarni qo'shish
card.append(title, description); // bir nechta element bir vaqtda

// DOM ga qo'shish
document.getElementById('app').appendChild(card);

// append vs appendChild farqi
const container = document.querySelector('.container');
container.append('Matn ham qo\\'shiladi', document.createElement('br'));
// container.appendChild('matn') — XATO! Faqat node qabul qiladi

// before, after, prepend
const list = document.querySelector('ul');
const newItem = document.createElement('li');
newItem.textContent = 'Yangi element';

list.firstElementChild.before(newItem);   // Birinchi li oldiga
list.lastElementChild.after(newItem);     // Oxirgi li orqasiga
list.prepend(newItem);                     // List boshiga`,
    },
    {
      title: 'DocumentFragment bilan samarali DOM manipulation',
      language: 'js',
      description: 'Ko\'p elementni bir vaqtda qo\'shish uchun DocumentFragment',
      code: `// YOMON — har safar reflow/repaint
const list = document.getElementById('list');
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = \`Element \${i}\`;
  list.appendChild(li); // 1000 ta reflow!
}

// YAXSHI — DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = \`Element \${i}\`;
  fragment.appendChild(li); // fragment da — reflow yo'q
}
list.appendChild(fragment); // BITTA reflow!

// YAXSHI ALTERNATIVA — innerHTML (kichik ro'yxatlar uchun)
const html = Array.from({ length: 100 }, (_, i) =>
  \`<li>Element \${i}</li>\`
).join('');
list.innerHTML = html; // Bitta parse + bitta reflow

// insertAdjacentHTML — mavjud kontentni buzmasdan
list.insertAdjacentHTML('beforeend', '<li>Oxiriga qo\\'shildi</li>');
list.insertAdjacentHTML('afterbegin', '<li>Boshiga qo\\'shildi</li>');`,
    },
    {
      title: 'cloneNode va element o\'chirish',
      language: 'js',
      description: 'Elementlarni klonlash va o\'chirish usullari',
      code: `// cloneNode
const template = document.querySelector('.card-template');

// Shallow clone — faqat element o'zi
const shallow = template.cloneNode(false);
console.log(shallow.children.length); // 0

// Deep clone — barcha bolalari bilan
const deep = template.cloneNode(true);
console.log(deep.children.length); // template dagi barcha bolalar

// Event listenerlar klonlanMAYDI!
template.addEventListener('click', () => console.log('Bosildi'));
const clone = template.cloneNode(true);
// clone da click listener YO'Q

// Element o'chirish
const item = document.querySelector('.item');

// Zamonaviy usul
item.remove();

// Eski usul (IE uchun)
item.parentNode.removeChild(item);

// replaceWith
const oldElement = document.querySelector('.old');
const newElement = document.createElement('div');
newElement.className = 'new';
newElement.textContent = 'Yangi element';
oldElement.replaceWith(newElement);

// Barcha bolalarni tozalash
function clearChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  // yoki oddiyroq:
  // parent.innerHTML = '';
  // yoki:
  // parent.replaceChildren();
}`,
    },
  ],
  interviewQA: [
    {
      question: 'innerHTML ishlatishning xavfi nimada?',
      answer: '`innerHTML` ga foydalanuvchi kiritgan ma\'lumotni to\'g\'ridan-to\'g\'ri qo\'shish **XSS (Cross-Site Scripting)** hujumiga olib keladi. Masalan, `div.innerHTML = userInput` da agar `userInput` `<script>` yoki `<img onerror="...">` bo\'lsa, zararli kod bajariladi. Xavfsiz alternativalar: `textContent` (matn uchun) yoki `DOMPurify` kutubxonasi bilan sanitize qilish.',
    },
    {
      question: 'DocumentFragment nima va nega ishlatiladi?',
      answer: 'DocumentFragment — bu **virtual DOM konteyner**. U haqiqiy DOM da mavjud emas, shuning uchun unga element qo\'shish reflow/repaint chaqirmaydi. Ko\'p elementni qo\'shishda avval fragment ga yig\'ib, keyin bitta operatsiyada DOM ga qo\'shish performance ni sezilarli oshiradi. Fragment DOM ga qo\'shilganda, faqat uning bolalari ko\'chadi, fragment o\'zi yo\'qoladi.',
    },
    {
      question: 'append() va appendChild() farqi nimada?',
      answer: '`appendChild()` faqat **bitta Node** qabul qiladi va o\'sha node ni qaytaradi. `append()` bir vaqtda **bir nechta argument** qabul qiladi, ular orasida **matn** ham bo\'lishi mumkin (avtomatik TextNode ga aylanadi), va `undefined` qaytaradi. `append()` zamonaviyroq va ko\'proq imkoniyat beradi.',
    },
    {
      question: 'cloneNode(true) va cloneNode(false) farqi nimada? Event listenerlar nima bo\'ladi?',
      answer: '`cloneNode(false)` — **shallow clone**, faqat elementning o\'zi (attributlari bilan). `cloneNode(true)` — **deep clone**, element va barcha bolalari. Ikkala holatda ham `addEventListener` orqali qo\'shilgan **event listenerlar klonlanMAYDI**. Faqat HTML attribut sifatida yozilgan inline handlerlar (`onclick="..."`) saqlanadi.',
    },
    {
      question: 'textContent, innerText va innerHTML farqi nimada?',
      answer: '`textContent` — barcha matnni qaytaradi (yashirin elementlar ham), HTML parse qilmaydi, xavfsiz va tez. `innerText` — faqat ko\'rinadigan matnni qaytaradi (CSS `display:none` ni hisobga oladi), bu uchun layout hisoblash kerak, shuning uchun **sekin**. `innerHTML` — HTML sifatida o\'qiydi va yozadi, XSS xavfi bor.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'dom-tree',
      label: 'DOM Tree',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'events',
      label: 'Events',
    },
  ],
}
