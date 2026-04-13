import type { Topic } from '../../../types'

export const dragDrop: Topic = {
  id: 'drag-drop',
  title: 'Drag and Drop API',
  importance: 1,
  status: 'to-learn',
  description: 'Drag and Drop API va dataTransfer',
  content: `HTML5 Drag and Drop API — elementlarni sichqoncha bilan sudrab olib tashlash imkonini beradi. Fayl yuklash, ro'yxat tartiblash, Kanban board kabi interfeyslar uchun ishlatiladi.

═══════════════════════════════════════
  DRAGGABLE QILISH
═══════════════════════════════════════

Har qanday elementni draggable qilish:
  <div draggable="true">Meni sudra</div>

Rasmlar va havolalar sukut bo'yicha draggable.

═══════════════════════════════════════
  DRAG EVENTLARI
═══════════════════════════════════════

Sudralayotgan elementda (drag source):
  dragstart  — sudrash boshlanganda
  drag       — sudrash davomida (takrorlanadi)
  dragend    — sudrash tugaganda

Qo'yish joyida (drop target):
  dragenter  — element ustiga kirganda
  dragover   — element ustida turganida (takrorlanadi)
  dragleave  — element ustidan chiqqanda
  drop       — element tashlanganda

MUHIM: drop ishlashi uchun dragover da
  e.preventDefault() CHAQIRISH KERAK!
  (Chunki sukut bo'yicha drop taqiqlangan)

═══════════════════════════════════════
  DATATRANSFER
═══════════════════════════════════════

e.dataTransfer — sudrash paytida ma'lumot uzatish uchun:

  // dragstart da ma'lumot saqlash
  e.dataTransfer.setData('text/plain', 'qiymat')
  e.dataTransfer.setData('application/json', JSON.stringify(data))

  // drop da ma'lumot olish
  const data = e.dataTransfer.getData('text/plain')

dataTransfer atributlari:
  dropEffect   — ko'rinadigan effekt: copy, move, link, none
  effectAllowed — ruxsat berilgan effektlar
  files        — sudrab tashlangan fayllar (FileList)
  items        — DataTransferItemList
  types        — saqlangan ma'lumot turlari

═══════════════════════════════════════
  FAYL YUKLASH (FILE DROP)
═══════════════════════════════════════

Foydalanuvchi faylni brauzerga sudrab tashlashi mumkin:

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    // files[0].name, files[0].size, files[0].type
  })

MUHIM: dragover va drop da e.preventDefault() kerak,
  aks holda brauzer faylni ochishga harakat qiladi.

═══════════════════════════════════════
  ACCESSIBILITY ESLATMASI
═══════════════════════════════════════

Drag and Drop klaviatura foydalanuvchilari uchun ishlamaydi.
Har doim muqobil usul bering:
  - Tugmalar bilan tartiblash
  - Select/dropdown bilan tanlash
  - ARIA live regionlar bilan holat e'lon qilish`,

  codeExamples: [
    {
      title: 'Oddiy Drag and Drop',
      language: 'html',
      description: 'Element sudrab boshqa joyga tashlash',
      code: `<div id="item"
     draggable="true"
     style="padding:16px; background:#3b82f6; color:white; cursor:grab; display:inline-block">
  Meni sudra
</div>

<div id="dropzone"
     style="width:300px; height:200px; border:2px dashed #9ca3af; margin-top:20px; display:flex; align-items:center; justify-content:center">
  Bu yerga tashlang
</div>

<script>
const item = document.getElementById('item')
const dropzone = document.getElementById('dropzone')

// Sudrash boshlanishi
item.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', item.id)
  e.dataTransfer.effectAllowed = 'move'
  item.style.opacity = '0.5'
})

item.addEventListener('dragend', () => {
  item.style.opacity = '1'
})

// Drop zonasi
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault() // MUHIM: drop ga ruxsat
  e.dataTransfer.dropEffect = 'move'
  dropzone.style.borderColor = '#3b82f6'
})

dropzone.addEventListener('dragleave', () => {
  dropzone.style.borderColor = '#9ca3af'
})

dropzone.addEventListener('drop', (e) => {
  e.preventDefault()
  const id = e.dataTransfer.getData('text/plain')
  const el = document.getElementById(id)
  dropzone.appendChild(el)
  dropzone.style.borderColor = '#9ca3af'
})
</script>`,
    },
    {
      title: 'Fayl yuklash (File Drop)',
      language: 'js',
      description: 'Drag and Drop bilan fayl qabul qilish',
      code: `const dropZone = document.getElementById('file-drop')

// Brauzerning default xatti-harakatini to'xtatish
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
  dropZone.addEventListener(event, (e) => {
    e.preventDefault()
    e.stopPropagation()
  })
})

// Visual feedback
dropZone.addEventListener('dragenter', () => {
  dropZone.classList.add('highlight')
})
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('highlight')
})

// Fayllarni qabul qilish
dropZone.addEventListener('drop', (e) => {
  dropZone.classList.remove('highlight')
  const files = e.dataTransfer.files

  Array.from(files).forEach(file => {
    console.log(\`Fayl: \${file.name}\`)
    console.log(\`Hajmi: \${(file.size / 1024).toFixed(1)} KB\`)
    console.log(\`Turi: \${file.type}\`)

    // Rasmni ko'rsatish
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img')
        img.src = e.target.result
        img.style.maxWidth = '200px'
        dropZone.appendChild(img)
      }
      reader.readAsDataURL(file)
    }
  })
})`,
    },
  ],

  interviewQA: [
    {
      question: 'HTML5 Drag and Drop API qanday ishlaydi?',
      answer: 'Asosiy jarayon: 1) Element ga draggable="true" qo\'yiladi. 2) dragstart eventida dataTransfer.setData() bilan ma\'lumot saqlanadi. 3) Drop target da dragover eventida e.preventDefault() chaqiriladi (ruxsat berish). 4) drop eventida dataTransfer.getData() bilan ma\'lumot olinadi. Muhim: dragover da preventDefault() bo\'lmasa drop ishlamaydi.',
    },
    {
      question: 'dataTransfer nima va qanday ishlatiladi?',
      answer: 'dataTransfer — drag operatsiyasi davomida ma\'lumot tashish uchun obyekt. setData(type, value) bilan ma\'lumot saqlanadi, getData(type) bilan olinadi. Turlar: "text/plain", "text/html", "application/json". Qo\'shimcha: files xususiyati sudrab tashlangan fayllarni oladi (FileList), dropEffect ko\'rinadigan kursor effektini boshqaradi (copy, move, link).',
    },
    {
      question: 'Drag and Drop ning accessibility muammolari qanday hal qilinadi?',
      answer: 'Drag and Drop sichqonchaga bog\'liq — klaviatura va screen reader foydalanuvchilari ishlatmaydi. Yechimlar: 1) Muqobil interface — tugmalar bilan yuqoriga/pastga ko\'chirish. 2) ARIA atributlari — aria-grabbed, aria-dropeffect. 3) aria-live region — holat o\'zgarishini e\'lon qilish. 4) Keyboard eventlar — Enter/Space bilan tanlash, Arrow kalitlari bilan ko\'chirish.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
  ],
}
