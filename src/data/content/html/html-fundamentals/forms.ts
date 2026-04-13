import type { Topic } from '../../../types'

export const forms: Topic = {
  id: 'forms',
  title: 'Formalar',
  importance: 3,
  status: 'to-learn',
  description: 'Form elementlari, validatsiya, input turlari va FormData API',
  content: `HTML formalar — foydalanuvchidan ma'lumot olishning asosiy usuli. Login, ro'yxatdan o'tish, qidiruv, sharh yozish — barchasi formalar orqali ishlaydi.

═══════════════════════════════════════
  FORM ELEMENTI
═══════════════════════════════════════

<form> — barcha form elementlarini o'rab turuvchi teg.
Atributlari:
  action  — ma'lumot yuboriladigan URL
  method  — HTTP metod (GET yoki POST)
  enctype — ma'lumot kodlash turi (file yuklash uchun multipart/form-data)
  novalidate — brauzer validatsiyasini o'chirish

═══════════════════════════════════════
  INPUT TURLARI
═══════════════════════════════════════

text     — oddiy matn
email    — email (avtomatik validatsiya)
password — parol (yashirin)
number   — raqam (min/max/step)
tel      — telefon raqam
url      — URL manzil
date     — sana tanlash
time     — vaqt tanlash
file     — fayl yuklash
checkbox — belgilash katagi
radio    — tanlov tugmasi
range    — slider
color    — rang tanlash
search   — qidiruv
hidden   — yashirin maydon

═══════════════════════════════════════
  VALIDATSIYA
═══════════════════════════════════════

HTML5 da o'rnatilgan validatsiya atributlari:
  required    — bo'sh bo'lishi mumkin emas
  minlength   — minimal belgilar soni
  maxlength   — maksimal belgilar soni
  min / max   — raqam uchun chegaralar
  pattern     — regex bilan tekshirish
  type="email"— avtomatik email formati tekshirish

Brauzer avtomatik xatolik xabarini ko'rsatadi.
Maxsus xabar uchun: setCustomValidity() ishlatiladi.

═══════════════════════════════════════
  FORMDATA API
═══════════════════════════════════════

FormData — forma ma'lumotlarini JavaScript da olish uchun:
  const form = document.querySelector('form')
  const data = new FormData(form)
  data.get('username')  // maydon qiymati
  data.getAll('hobbies') // bir nechta qiymat
  data.append('key', 'value') // qo'shish
  data.entries() // barcha juftliklar

═══════════════════════════════════════
  BOSHQA FORM ELEMENTLARI
═══════════════════════════════════════

<textarea>  — ko'p qatorli matn
<select>    — tanlash ro'yxati (dropdown)
<option>    — select ichidagi variant
<optgroup>  — option guruhi
<label>     — maydon yorlig'i (accessibility uchun MUHIM)
<fieldset>  — guruh chegarasi
<legend>    — guruh sarlavhasi
<button>    — tugma (type: submit/reset/button)
<datalist>  — avtomatik to'ldirish variantlari
<output>    — hisoblash natijasi`,

  codeExamples: [
    {
      title: 'To\'liq forma namunasi',
      language: 'html',
      description: 'Validatsiya va turli input turlari bilan forma',
      code: `<form action="/register" method="POST">
  <fieldset>
    <legend>Ro'yxatdan o'tish</legend>

    <label for="name">Ism:</label>
    <input type="text" id="name" name="name"
           required minlength="2" maxlength="50"
           placeholder="Ismingizni kiriting">

    <label for="email">Email:</label>
    <input type="email" id="email" name="email"
           required placeholder="email@misol.uz">

    <label for="password">Parol:</label>
    <input type="password" id="password" name="password"
           required minlength="8"
           pattern="(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
           title="Kamida 8 belgi, katta/kichik harf va raqam">

    <label for="age">Yosh:</label>
    <input type="number" id="age" name="age"
           min="16" max="100" step="1">

    <label for="birth">Tug'ilgan sana:</label>
    <input type="date" id="birth" name="birth">

    <label for="bio">Qisqacha haqingizda:</label>
    <textarea id="bio" name="bio" rows="4"
              maxlength="500"></textarea>

    <label for="role">Rol:</label>
    <select id="role" name="role" required>
      <option value="">Tanlang...</option>
      <option value="developer">Dasturchi</option>
      <option value="designer">Dizayner</option>
      <option value="manager">Menejer</option>
    </select>

    <label>
      <input type="checkbox" name="terms" required>
      Shartlarga roziman
    </label>

    <button type="submit">Ro'yxatdan o'tish</button>
  </fieldset>
</form>`,
    },
    {
      title: 'FormData API bilan ishlash',
      language: 'js',
      description: 'JavaScript da forma ma\'lumotlarini olish',
      code: `const form = document.querySelector('#myForm')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(form)

  // Bitta qiymat olish
  const name = formData.get('name')
  const email = formData.get('email')

  // Barcha qiymatlarni object qilish
  const data = Object.fromEntries(formData.entries())
  console.log(data)
  // { name: "Ali", email: "ali@misol.uz", role: "developer" }

  // Fetch bilan yuborish
  fetch('/api/register', {
    method: 'POST',
    body: formData, // yoki JSON.stringify(data)
  })
})`,
    },
    {
      title: 'Maxsus validatsiya xabarlari',
      language: 'js',
      description: 'setCustomValidity bilan o\'zbek tilida xabar',
      code: `const emailInput = document.querySelector('#email')

emailInput.addEventListener('invalid', (e) => {
  if (emailInput.validity.valueMissing) {
    emailInput.setCustomValidity('Email kiritish majburiy!')
  } else if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('To\\'g\\'ri email format kiriting!')
  }
})

// Har bir input da xabarni tozalash
emailInput.addEventListener('input', () => {
  emailInput.setCustomValidity('')
})`,
    },
  ],

  interviewQA: [
    {
      question: 'GET va POST metodlari orasidagi farq nima?',
      answer: 'GET — ma\'lumotlar URL query string da ko\'rinadi (?name=Ali&age=25), keshlanadi, uzunlik cheklangan (~2048 belgi), xavfsiz emas (parol uchun ishlatilmasin). POST — ma\'lumotlar request body da yuboriladi, URL da ko\'rinmaydi, uzunlik cheklanmagan, fayl yuklash mumkin. Qoida: ma\'lumot olish uchun GET, yuborish/o\'zgartirish uchun POST.',
    },
    {
      question: 'FormData API nima va qachon ishlatiladi?',
      answer: 'FormData — JavaScript da forma ma\'lumotlarini to\'plash va yuborish uchun API. new FormData(formElement) bilan forma elementlarini avtomatik to\'playdi. get(), getAll(), append(), delete(), entries() metodlari bor. Ayniqsa fayl yuklash uchun muhim — fetch bilan multipart/form-data sifatida yuboriladi.',
    },
    {
      question: '<label> nima uchun muhim?',
      answer: '<label> input bilan bog\'lanadi (for atributi orqali yoki input ni o\'rab). 1) Accessibility: screen reader label matnini o\'qiydi. 2) UX: label ni bosish input ga focus beradi. 3) Checkbox/radio uchun bosish maydonini kengaytiradi. <label> siz forma accessibility standartlariga mos kelmaydi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
    { techId: 'css', sectionId: 'css-fundamentals', topicId: 'selectors', label: 'CSS Selektorlar' },
  ],
}
