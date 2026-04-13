import type { Topic } from '../../../types'

export const events: Topic = {
  id: 'events',
  title: 'Events va Event Handling',
  importance: 3,
  status: 'to-learn',
  description: 'addEventListener, event object, bubbling, capturing, delegation',
  content: `
# Events va Event Handling

## Event nima?

**Event** — brauzerda sodir bo'ladigan voqea: klik, klaviatura bosish, sahifa yuklash, scroll va h.k. JavaScript bu voqealarni ushlab (listen), ularga javob bera oladi.

## Event qo'shish usullari

1. **HTML attribut** (tavsiya etilMAYDI): \`<button onclick="handleClick()">\`
2. **DOM property**: \`btn.onclick = function() {}\` — faqat bitta handler
3. **addEventListener** (eng yaxshi): \`btn.addEventListener('click', handler)\` — bir nechta handler, boshqaruv imkoniyati

## addEventListener sintaksisi

\`\`\`
element.addEventListener(type, listener, options)
\`\`\`

**options** — boolean yoki obyekt:
- \`capture: true\` — capturing fazasida ushlash
- \`once: true\` — faqat bir marta ishlaydi
- \`passive: true\` — \`preventDefault()\` chaqirilmasligini kafolatlaydi (scroll performance)
- \`signal: AbortSignal\` — AbortController orqali bekor qilish

## Event Object

Har bir handler \`event\` (yoki \`e\`) obyektini oladi:
- \`e.type\` — event turi ('click', 'keydown')
- \`e.target\` — event sodir bo'lgan element
- \`e.currentTarget\` — handler ulangan element
- \`e.preventDefault()\` — standart xatti-harakatni bekor qilish
- \`e.stopPropagation()\` — bubbling ni to'xtatish
- \`e.stopImmediatePropagation()\` — shu elementdagi boshqa handlerlarni ham to'xtatish

## Event Propagation (tarqalish)

Event uch fazada tarqaladi:
1. **Capturing** (ushlash) — \`document\` dan \`target\` ga tushadi
2. **Target** — maqsadli elementda ishga tushadi
3. **Bubbling** (ko'piklanish) — \`target\` dan \`document\` ga ko'tariladi

Odatda handlerlar **bubbling** fazasida ishlaydi. \`addEventListener\` ning uchinchi argumenti \`true\` yoki \`{ capture: true }\` bo'lsa, capturing fazasida ishlaydi.

## Event Delegation

**Event delegation** — har bir bolaga handler qo'yish o'rniga, **ota elementga bitta handler** qo'yish va \`e.target\` orqali qaysi bola bosilganini aniqlash.

**Afzalliklari:**
- Kamroq event listener = kamroq xotira
- Dinamik qo'shilgan elementlar uchun ham ishlaydi
- Kod soddalashadi

## Custom Events

\`CustomEvent\` konstruktori bilan o'z eventlaringizni yaratishingiz mumkin. Bu component-lar orasida muloqot uchun ishlatiladi.

## Passive Event Listeners

\`{ passive: true }\` — brauzerga \`preventDefault()\` chaqirilmasligini bildiradi. Bu scroll va touch eventlarda **performance** ni oshiradi, chunki brauzer \`preventDefault()\` ni kutmasdan scrollni boshlaydi.
  `.trim(),
  codeExamples: [
    {
      title: 'Event Propagation — Bubbling va Capturing',
      language: 'js',
      description: 'Event tarqalish fazalarini tushunish',
      code: `// HTML: <div id="outer"><div id="inner"><button id="btn">Click</button></div></div>

const outer = document.getElementById('outer');
const inner = document.getElementById('inner');
const btn = document.getElementById('btn');

// Capturing fazasi (yuqoridan pastga)
outer.addEventListener('click', () => console.log('outer — capturing'), true);
inner.addEventListener('click', () => console.log('inner — capturing'), true);

// Bubbling fazasi (pastdan yuqoriga)
outer.addEventListener('click', () => console.log('outer — bubbling'));
inner.addEventListener('click', () => console.log('inner — bubbling'));
btn.addEventListener('click', () => console.log('btn — target'));

// Tugma bosilganda chiqish tartibi:
// 1. outer — capturing
// 2. inner — capturing
// 3. btn — target
// 4. inner — bubbling
// 5. outer — bubbling

// Propagation ni to'xtatish
btn.addEventListener('click', (e) => {
  e.stopPropagation(); // bubbling to'xtaydi
  console.log('Faqat btn ishlaydi');
});`,
    },
    {
      title: 'Event Delegation pattern',
      language: 'js',
      description: 'Bitta handler bilan ko\'p elementni boshqarish',
      code: `// YOMON — har bir tugmaga alohida handler
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    deleteItem(id);
  });
});
// Muammo: yangi qo'shilgan tugmalar uchun handler yo'q!

// YAXSHI — Event Delegation
const list = document.getElementById('todo-list');

list.addEventListener('click', (e) => {
  const target = e.target;

  // Delete tugmasi bosildi
  if (target.matches('.delete-btn')) {
    const id = target.dataset.id;
    deleteItem(id);
    return;
  }

  // Edit tugmasi bosildi
  if (target.matches('.edit-btn')) {
    const id = target.closest('[data-id]').dataset.id;
    editItem(id);
    return;
  }

  // Item o'zi bosildi
  const item = target.closest('.todo-item');
  if (item) {
    toggleItem(item.dataset.id);
  }
});

// Yangi elementlar qo'shilsa ham ishlaydi!
function addTodo(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = Date.now().toString();
  li.innerHTML = \`
    <span>\${text}</span>
    <button class="edit-btn">✏️</button>
    <button class="delete-btn" data-id="\${li.dataset.id}">🗑️</button>
  \`;
  list.appendChild(li);
}`,
    },
    {
      title: 'addEventListener options va Custom Events',
      language: 'js',
      description: 'Once, passive, signal va CustomEvent',
      code: `// once — faqat bir marta ishlaydi
const btn = document.getElementById('submit');
btn.addEventListener('click', () => {
  console.log('Bir marta bosildi');
}, { once: true });

// AbortController bilan event listener o'chirish
const controller = new AbortController();

document.addEventListener('mousemove', (e) => {
  console.log(e.clientX, e.clientY);
}, { signal: controller.signal });

// Kerak bo'lmaganda barcha listenerlarni bekor qilish
setTimeout(() => controller.abort(), 5000);

// passive — scroll performance uchun
document.addEventListener('touchmove', (e) => {
  // e.preventDefault() — CHAQIRIB BO'LMAYDI
  console.log('touch move');
}, { passive: true });

// Custom Events
const userEvent = new CustomEvent('user:login', {
  detail: { userId: 1, name: 'Ali' },
  bubbles: true,     // bubbling yoqilsin
  cancelable: true,  // preventDefault() ishlaydi
});

document.addEventListener('user:login', (e) => {
  console.log('Foydalanuvchi kirdi:', e.detail.name);
});

document.dispatchEvent(userEvent);

// preventDefault() bilan custom event
document.addEventListener('user:delete', (e) => {
  if (!confirm('Rostdan o\\'chirilsinmi?')) {
    e.preventDefault();
  }
});

const deleteEvent = new CustomEvent('user:delete', { cancelable: true });
const allowed = document.dispatchEvent(deleteEvent);
if (allowed) {
  console.log('O\\'chirish tasdiqlandi');
}`,
    },
  ],
  interviewQA: [
    {
      question: 'Event bubbling va capturing farqi nimada?',
      answer: 'Event propagation uch fazada ishlaydi. **Capturing** — event `document` dan target elementga tushadi (yuqoridan pastga). **Target** — event maqsadli elementga yetadi. **Bubbling** — event target dan `document` ga ko\'tariladi (pastdan yuqoriga). Odatda handlerlar bubbling fazasida ishlaydi. `addEventListener` ga `{ capture: true }` berish capturing fazasida ushlashni yoqadi.',
    },
    {
      question: 'Event delegation nima va nega ishlatiladi?',
      answer: 'Event delegation — har bir child elementga alohida handler qo\'yish o\'rniga, **ota elementga bitta handler** qo\'yish va `e.target` (yoki `e.target.closest()`) orqali qaysi child bosganini aniqlash. Afzalliklari: 1) Kamroq event listener = kamroq xotira. 2) Dinamik qo\'shilgan elementlar uchun ham avtomatik ishlaydi. 3) Kod soddalashadi.',
    },
    {
      question: 'e.target va e.currentTarget farqi nimada?',
      answer: '`e.target` — event **aslida sodir bo\'lgan** element (masalan, bosilgan tugma). `e.currentTarget` — event handler **ulangan** element (masalan, ota `div`). Event delegation da bu farq muhim: `target` — bosilgan child element, `currentTarget` — listener o\'rnatilgan ota element.',
    },
    {
      question: 'preventDefault() va stopPropagation() farqi nimada?',
      answer: '`preventDefault()` — brauzerning **standart xatti-harakatini** bekor qiladi (masalan, link ochilishi, form submit). Event hali ham propagate bo\'ladi. `stopPropagation()` — eventni **boshqa elementlarga tarqalishini** to\'xtatadi, lekin standart xatti-harakat saqlanadi. Ikkalasi ham kerak bo\'lsa, ikkalasini ham chaqirish kerak.',
    },
    {
      question: 'Passive event listener nima?',
      answer: '`{ passive: true }` — brauzerga bu handler ichida `preventDefault()` chaqirilmasligini kafolatlaydi. Bu `touchmove` va `wheel` eventlarda **scroll performance** ni oshiradi, chunki brauzer handler natijasini kutmasdan scrollni boshlaydi. Chrome da `touchmove` va `wheel` default `passive: true`.',
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
      topicId: 'observers',
      label: 'Observers',
    },
  ],
}
