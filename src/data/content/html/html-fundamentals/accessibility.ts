import type { Topic } from '../../../types'

export const accessibility: Topic = {
  id: 'accessibility',
  title: 'Accessibility (A11y)',
  importance: 3,
  status: 'to-learn',
  description: 'ARIA rollari, labellar, klaviatura navigatsiyasi va screen readerlar',
  content: `Web Accessibility (a11y) — veb-saytlarni BARCHA foydalanuvchilar uchun qulay qilish: ko'rish qobiliyati cheklangan, eshitish qiyin, harakatlanishi cheklangan va boshqa nogironligi bo'lgan odamlar uchun.

═══════════════════════════════════════
  NIMA UCHUN ACCESSIBILITY MUHIM?
═══════════════════════════════════════

1. Huquqiy talab — ko'p davlatlarda qonun bilan belgilangan
2. SEO — Google accessible saytlarni yuqori baholaydi
3. UX — BARCHA foydalanuvchilar uchun qulay
4. Bozor — dunyoda ~1 milliard nogiron odam bor
5. Texnik sifat — accessible kod = yaxshi kod

═══════════════════════════════════════
  ARIA (Accessible Rich Internet Applications)
═══════════════════════════════════════

ARIA atributlari — HTML elementlarga accessibility ma'lumot qo'shadi.

ARIA rollari (role):
  role="navigation" — navigatsiya (yoki <nav> ishlatish)
  role="main"       — asosiy kontent (yoki <main>)
  role="button"     — tugma (yoki <button>)
  role="alert"      — muhim xabar
  role="dialog"     — modal oyna
  role="tab"        — tab panel

ARIA atributlari:
  aria-label      — ko'rinmas yorliq ("Yopish" tugmasi uchun)
  aria-labelledby — boshqa element ID siga reference
  aria-describedby — qo'shimcha tavsif
  aria-hidden     — screen readerdan yashirish
  aria-expanded   — ochiq/yopiq holat (accordion)
  aria-required   — majburiy maydon
  aria-live       — dinamik kontent yangilanganda e'lon qilish

MUHIM QOIDA: "No ARIA is better than bad ARIA"
  Semantik HTML teg mavjud bo'lsa — ARIA ISHLATMANG:
  <button> > <div role="button">
  <nav> > <div role="navigation">

═══════════════════════════════════════
  KLAVIATURA NAVIGATSIYASI
═══════════════════════════════════════

Ko'p foydalanuvchilar sichqonsiz ishlaydi:
  Tab       — elementlar orasida harakatlanish
  Enter     — tugmani bosish, havolaga kirish
  Space     — checkbox toggle, tugma bosish
  Escape    — modalni yopish
  Arrow keys — menyu, tab, slider navigatsiyasi

tabindex atributi:
  tabindex="0"  — tabiiy tartibda focuslanadi
  tabindex="-1" — faqat JavaScript bilan focuslanadi
  tabindex="1+" — ISHLATMANG (tartib buzadi)

═══════════════════════════════════════
  SCREEN READER QOIDALARI
═══════════════════════════════════════

1. Har bir img da alt bo'lsin
2. Forma elementlari <label> bilan bog'lansin
3. Sarlavha ierarxiyasi (h1→h6) buzilmasin
4. Rang YAGONA farqlash vositasi bo'lmasin
5. Focus ko'rinadigan bo'lsin (outline o'chirmang)
6. Yetarli rang kontrasti bo'lsin (4.5:1 minimum)`,

  codeExamples: [
    {
      title: 'ARIA atributlari bilan komponentlar',
      language: 'html',
      description: 'Accessible modal, tugma va navigatsiya',
      code: `<!-- Accessible tugma -->
<button
  aria-label="Menyuni yopish"
  aria-expanded="false"
  onclick="toggleMenu()"
>
  <svg aria-hidden="true"><!-- hamburger icon --></svg>
</button>

<!-- Accessible modal -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
>
  <h2 id="modal-title">O'chirishni tasdiqlang</h2>
  <p id="modal-desc">
    Bu amalni qaytarib bo'lmaydi. Davom etasizmi?
  </p>
  <button>Ha, o'chirish</button>
  <button autofocus>Bekor qilish</button>
</div>

<!-- aria-live — dinamik kontent uchun -->
<div aria-live="polite" aria-atomic="true">
  <!-- Bu yerga qo'shilgan matn screen reader tomonidan o'qiladi -->
  3 ta natija topildi
</div>

<!-- Skip navigation link -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Asosiy kontentga o'tish
</a>`,
    },
    {
      title: 'Accessible forma',
      language: 'html',
      description: 'Label, xatolik xabarlari va validatsiya holati',
      code: `<form>
  <!-- Label va input bog'lanishi -->
  <div>
    <label for="user-email">Email manzil:</label>
    <input
      type="email"
      id="user-email"
      name="email"
      required
      aria-required="true"
      aria-invalid="true"
      aria-describedby="email-error email-hint"
    >
    <span id="email-hint" class="hint">
      Masalan: ali@misol.uz
    </span>
    <span id="email-error" class="error" role="alert">
      To'g'ri email format kiriting
    </span>
  </div>

  <!-- Fieldset bilan guruhlar -->
  <fieldset>
    <legend>Bildirishnoma usuli:</legend>
    <label>
      <input type="radio" name="notify" value="email">
      Email orqali
    </label>
    <label>
      <input type="radio" name="notify" value="sms">
      SMS orqali
    </label>
  </fieldset>

  <button type="submit">Yuborish</button>
</form>`,
    },
    {
      title: 'Screen reader uchun yashirin matn',
      language: 'css',
      description: 'Vizual yashirin, lekin screen reader o\'qiydigan class',
      code: `/* sr-only — faqat screen reader uchun ko'rinadigan */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus holatida ko'rsatish (skip link uchun) */
.sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}`,
    },
  ],

  interviewQA: [
    {
      question: 'ARIA nima va qachon ishlatiladi?',
      answer: 'ARIA (Accessible Rich Internet Applications) — HTML elementlarga accessibility ma\'lumot qo\'shuvchi atributlar. role, aria-label, aria-hidden, aria-expanded kabilar. LEKIN asosiy qoida: "No ARIA is better than bad ARIA". Agar semantik HTML teg mavjud bo\'lsa (<button>, <nav>, <main>), ARIA kerak emas. ARIA faqat semantik HTML imkoniyati bo\'lmaganda ishlatiladi.',
    },
    {
      question: 'Klaviatura accessibility qanday ta\'minlanadi?',
      answer: 'Asosiy qoidalar: 1) Barcha interactive elementlar Tab bilan yetib boriladigan bo\'lsin. 2) <button> va <a> teglar tabiiy ravishda focuslanadi — <div onclick> emas. 3) Focus ko\'rinadigan bo\'lsin (outline o\'chirmang). 4) tabindex="0" maxsus elementlarni focuslaydigan qiladi. 5) Modal ochilganda focus modal ichida qolsin (focus trap). 6) Escape bilan yopish mumkin bo\'lsin.',
    },
    {
      question: 'Web accessibility uchun eng muhim WCAG mezonlari qaysilar?',
      answer: 'WCAG (Web Content Accessibility Guidelines) 4 printsip: 1) Perceivable — kontent sezilishi kerak (alt, kontrast 4.5:1). 2) Operable — boshqarish mumkin (klaviatura, yetarli vaqt). 3) Understandable — tushunilishi oson (aniq til, izchil navigatsiya). 4) Robust — turli texnologiyalar bilan ishlaydi. A, AA, AAA darajalari bor — ko\'p saytlar AA ga intiladi.',
    },
    {
      question: 'aria-live nima qiladi?',
      answer: 'aria-live — dinamik o\'zgaradigan kontent uchun. Screen reader bu hududdagi o\'zgarishlarni avtomatik e\'lon qiladi. Qiymatlari: "polite" — hozirgi o\'qishni tugatgandan keyin e\'lon qiladi, "assertive" — darhol e\'lon qiladi (muhim xatoliklar uchun), "off" — e\'lon qilmaydi. Masalan: qidiruv natijalari soni, forma xatoliklari, chat xabarlari.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'semantic-html', label: 'Semantik HTML' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'forms', label: 'Formalar' },
  ],
}
