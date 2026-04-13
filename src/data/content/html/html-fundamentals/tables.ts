import type { Topic } from '../../../types'

export const tables: Topic = {
  id: 'tables',
  title: 'Jadvallar (Tables)',
  importance: 2,
  status: 'to-learn',
  description: 'Jadval tuzilmasi, accessibility, colspan va rowspan',
  content: `HTML jadvallar — ma'lumotlarni qator va ustunlarda tartibli ko'rsatish uchun ishlatiladi. Jadvallar FAQAT jadval ma'lumotlari uchun — layout uchun EMAS.

═══════════════════════════════════════
  JADVAL TUZILMASI
═══════════════════════════════════════

<table>    — jadval konteyner
<thead>    — sarlavha qismi
<tbody>    — asosiy qism
<tfoot>    — pastki qism (jami, xulosa)
<tr>       — qator (table row)
<th>       — sarlavha katagi (qalin, markazlashgan)
<td>       — ma'lumot katagi (table data)
<caption>  — jadval sarlavhasi (table ustida ko'rinadi)
<colgroup> — ustunlar guruhi
<col>      — bitta ustun sozlamasi

═══════════════════════════════════════
  COLSPAN VA ROWSPAN
═══════════════════════════════════════

colspan — katak bir nechta USTUNNI egallaydi
  <td colspan="3"> — 3 ta ustunni birlashtiradi

rowspan — katak bir nechta QATORNI egallaydi
  <td rowspan="2"> — 2 ta qatorni birlashtiradi

═══════════════════════════════════════
  ACCESSIBILITY
═══════════════════════════════════════

Jadvallar screen readerlar uchun tushunish qiyin.
Yaxshi accessibility uchun:

1. <caption> ishlatish — jadval maqsadini tushuntiradi
2. <th> da scope atributi — col yoki row
3. <thead>, <tbody>, <tfoot> — strukturali guruhlar
4. Murakkab jadvalda headers atributi — th id lari bilan bog'lash
5. summary atributi (eskirgan, caption ishlatish yaxshiroq)

═══════════════════════════════════════
  JADVAL STILIZATSIYASI
═══════════════════════════════════════

CSS bilan jadval ko'rinishini o'zgartirish:
  border-collapse: collapse — chegaralarni birlashtirish
  border-spacing — chegaralar orasidagi masofa
  text-align — matn joylashuvi
  vertical-align — vertikal joylashuv

═══════════════════════════════════════
  QACHON JADVAL ISHLATILADI?
═══════════════════════════════════════

HA: jadval ko'rinishidagi ma'lumotlar (narxlar, jadvallar, statistika)
YO'Q: sahifa layouti — buning uchun Flexbox/Grid ishlatiladi
YO'Q: oddiy ro'yxat — buning uchun <ul>/<ol> ishlatiladi`,

  codeExamples: [
    {
      title: 'Semantik jadval tuzilmasi',
      language: 'html',
      description: 'thead, tbody, tfoot va caption bilan to\'liq jadval',
      code: `<table>
  <caption>2026-yil 1-chorak sotuvlari</caption>

  <thead>
    <tr>
      <th scope="col">Mahsulot</th>
      <th scope="col">Yanvar</th>
      <th scope="col">Fevral</th>
      <th scope="col">Mart</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Noutbuk</th>
      <td>150</td>
      <td>180</td>
      <td>200</td>
    </tr>
    <tr>
      <th scope="row">Telefon</th>
      <td>300</td>
      <td>350</td>
      <td>400</td>
    </tr>
  </tbody>

  <tfoot>
    <tr>
      <th scope="row">Jami</th>
      <td>450</td>
      <td>530</td>
      <td>600</td>
    </tr>
  </tfoot>
</table>`,
    },
    {
      title: 'colspan va rowspan',
      language: 'html',
      description: 'Kataklar birlashtirish namunasi',
      code: `<table border="1">
  <tr>
    <th colspan="3">Talabalar jadvali</th>
  </tr>
  <tr>
    <th>Ism</th>
    <th>Fan</th>
    <th>Baho</th>
  </tr>
  <tr>
    <td rowspan="2">Ali Valiyev</td>
    <td>Matematika</td>
    <td>5</td>
  </tr>
  <tr>
    <!-- Ali uchun td kerak emas — rowspan=2 -->
    <td>Fizika</td>
    <td>4</td>
  </tr>
  <tr>
    <td>Vali Aliyev</td>
    <td>Matematika</td>
    <td>3</td>
  </tr>
</table>`,
    },
  ],

  interviewQA: [
    {
      question: 'HTML jadvallar layout uchun ishlatilishi kerakmi?',
      answer: 'YO\'Q. Jadvallar faqat jadval ko\'rinishidagi ma\'lumotlar (data tables) uchun ishlatiladi. Layout uchun CSS Flexbox yoki Grid ishlatish kerak. Jadval layout — 90-yillarning yondashuvi bo\'lib, accessibility muammolariga, responsive dizayn qiyinchiligiga va kodni tushunish murakkabligiga olib keladi.',
    },
    {
      question: 'Jadval accessibility uchun qanday qoidalar bor?',
      answer: 'Muhim qoidalar: 1) <caption> bilan jadval maqsadini tushuntiring. 2) <th> da scope="col" yoki scope="row" atributi qo\'ying. 3) <thead>, <tbody>, <tfoot> bilan tuzilmani belgilang. 4) Murakkab jadvalda headers atributi va th id larini bog\'lang. Screen readerlar bu ma\'lumotlardan foydalanib jadvalda navigatsiya qiladi.',
    },
    {
      question: 'colspan va rowspan nima qiladi?',
      answer: 'colspan — katak gorizontal ravishda bir nechta ustunni egallaydi (masalan, colspan="3" — 3 ustunni birlashtiradi). rowspan — katak vertikal ravishda bir nechta qatorni egallaydi. Ular birlashtirilib murakkab jadval tuzilmalari yaratiladi. Muhim: birlashtirish tufayli qatordagi td/th soni kamayadi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
    { techId: 'css', sectionId: 'css-layout', topicId: 'grid', label: 'CSS Grid' },
  ],
}
