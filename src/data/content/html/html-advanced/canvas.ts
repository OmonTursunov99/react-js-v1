import type { Topic } from '../../../types'

export const canvas: Topic = {
  id: 'canvas',
  title: 'Canvas API',
  importance: 2,
  status: 'to-learn',
  description: 'Canvas API, 2D kontekst, chizish va animatsiya asoslari',
  content: `<canvas> — HTML5 da piksel darajasida grafika chizish uchun element. O'yin, grafik, diagramma, rasm tahrirlash va animatsiyalar yaratish mumkin.

═══════════════════════════════════════
  CANVAS ASOSLARI
═══════════════════════════════════════

<canvas> — faqat chizish maydoni. Chizish JavaScript orqali bajariladi.

  <canvas id="myCanvas" width="600" height="400"></canvas>

MUHIM:
  - width/height ATRIBUT sifatida bering (CSS emas!)
  - CSS bilan o'lcham berish rasmni cho'zadi/siqadi
  - Canvas kontenti screen readerlar uchun ko'rinmaydi
  - Fallback kontent <canvas>...bu yerda</canvas> ichiga yoziladi

═══════════════════════════════════════
  2D KONTEKST
═══════════════════════════════════════

  const canvas = document.getElementById('myCanvas')
  const ctx = canvas.getContext('2d')

getContext('2d') — 2D chizish uchun kontekst olish.
(WebGL uchun 'webgl' yoki 'webgl2' ishlatiladi)

═══════════════════════════════════════
  ASOSIY CHIZISH METODLARI
═══════════════════════════════════════

To'rtburchak:
  ctx.fillRect(x, y, width, height)    — to'ldirilgan
  ctx.strokeRect(x, y, width, height)  — chegarali
  ctx.clearRect(x, y, width, height)   — tozalash

Yo'l (Path):
  ctx.beginPath()     — yangi yo'l boshlash
  ctx.moveTo(x, y)    — qalam ko'chirish
  ctx.lineTo(x, y)    — chiziq tortish
  ctx.arc(x, y, r, start, end) — aylana
  ctx.closePath()     — yo'lni yopish
  ctx.fill()          — to'ldirish
  ctx.stroke()        — chiziq chizish

Stil:
  ctx.fillStyle = 'red'      — to'ldirish rangi
  ctx.strokeStyle = '#00f'   — chiziq rangi
  ctx.lineWidth = 2          — chiziq qalinligi
  ctx.font = '20px Arial'    — shrift
  ctx.fillText('Salom', x, y) — matn yozish

═══════════════════════════════════════
  ANIMATSIYA
═══════════════════════════════════════

Canvas animatsiya — har kadrda tozalab qaytadan chizish:
  1. clearRect() bilan tozalash
  2. Yangi holatni chizish
  3. requestAnimationFrame() bilan takrorlash

requestAnimationFrame — brauzer bilan sinxron (~60fps)
setInterval/setTimeout dan YAXSHIROQ — brauzer optimizatsiya qiladi

═══════════════════════════════════════
  CANVAS VA SVG FARQI
═══════════════════════════════════════

Canvas: piksel asosli, katta grafik uchun tez, event handling qiyin
SVG: vektor asosli, DOM da, style/event oson, ko'p element = sekin`,

  codeExamples: [
    {
      title: 'Canvas da shakllar chizish',
      language: 'js',
      description: 'To\'rtburchak, doira va chiziqlar',
      code: `const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

// To'ldirilgan to'rtburchak
ctx.fillStyle = '#3b82f6'
ctx.fillRect(10, 10, 150, 100)

// Chegarali to'rtburchak
ctx.strokeStyle = '#ef4444'
ctx.lineWidth = 3
ctx.strokeRect(180, 10, 150, 100)

// Doira chizish
ctx.beginPath()
ctx.arc(100, 200, 50, 0, Math.PI * 2)
ctx.fillStyle = '#10b981'
ctx.fill()

// Chiziq
ctx.beginPath()
ctx.moveTo(200, 150)
ctx.lineTo(350, 250)
ctx.lineTo(200, 250)
ctx.closePath()
ctx.strokeStyle = '#f59e0b'
ctx.lineWidth = 2
ctx.stroke()

// Matn
ctx.font = 'bold 24px Arial'
ctx.fillStyle = '#1f2937'
ctx.fillText("Salom, Canvas!", 10, 320)`,
    },
    {
      title: 'Oddiy animatsiya',
      language: 'js',
      description: 'requestAnimationFrame bilan harakatlanuvchi doira',
      code: `const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

let x = 50
let y = 200
let dx = 3 // x tezligi
let dy = 2 // y tezligi
const radius = 20

function animate() {
  // Tozalash
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Doira chizish
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = '#8b5cf6'
  ctx.fill()

  // Chegaradan qaytish
  if (x + radius > canvas.width || x - radius < 0) dx = -dx
  if (y + radius > canvas.height || y - radius < 0) dy = -dy

  // Pozitsiyani yangilash
  x += dx
  y += dy

  // Keyingi kadr
  requestAnimationFrame(animate)
}

animate()`,
    },
  ],

  interviewQA: [
    {
      question: 'Canvas va SVG orasidagi farq nima? Qachon qaysinisini ishlatish kerak?',
      answer: 'Canvas — piksel (raster) asosli, JavaScript bilan chiziladi, DOM da alohida elementlar yo\'q, ko\'p piksel uchun tez. O\'yinlar, grafik tahrirlovchi, katta diagrammalar uchun. SVG — vektor asosli, DOM da har bir element alohida, CSS va event listener qo\'shish oson, kichik/interaktiv grafik uchun. Qoida: ko\'p element + interaktivlik = SVG, ko\'p piksel + tezlik = Canvas.',
    },
    {
      question: 'requestAnimationFrame nima va nima uchun setInterval dan yaxshiroq?',
      answer: 'requestAnimationFrame — brauzer keyingi repaint oldidan callback ni chaqiradi (~60fps). setInterval dan afzalliklari: 1) Brauzer bilan sinxron — janjanlanish yo\'q. 2) Tab ko\'rinmasa to\'xtaydi — resurs tejaydi. 3) Brauzer optimizatsiya qiladi. setInterval esa aniq vaqtda ishlaydi, brauzer repaint bilan mos kelmasa jank bo\'ladi.',
    },
  ],

  relatedTopics: [
    { techId: 'css', sectionId: 'css-advanced', topicId: 'animations', label: 'CSS Animatsiyalar' },
  ],
}
