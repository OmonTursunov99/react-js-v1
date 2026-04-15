import type { Topic } from '../../../types'

export const dialogDetails: Topic = {
  id: 'dialog-details',
  title: 'Dialog va Details/Summary',
  importance: 2,
  status: 'to-learn',
  description: 'Native modal (dialog), accordion (details/summary), popover',
  content: `HTML da modal oynalar, accordion va popover uchun tayyor native elementlar mavjud. Ular JS kutubxonalarsiz ishlaydi, accessibility o'rnatilgan, bundle size ga ta'sir qilmaydi.

═══════════════════════════════════════
  DIALOG ELEMENTI — NATIVE MODAL
═══════════════════════════════════════

<dialog> — brauzerning o'rnatilgan modal/dialog elementi.

Ikki xil ochish usuli:
  dialog.show()      — oddiy dialog (sahifa ustida, lekin modal EMAS)
  dialog.showModal() — haqiqiy modal:
    - ::backdrop qo'shiladi (orqa fon)
    - Escape tugmasi bilan yopiladi
    - Focus trap — Tab faqat dialog ichida yuradi
    - Tashqi elementlar inert bo'ladi

dialog.close(returnValue) — dialogni yopish.
  returnValue — ixtiyoriy qiymat (form natijasi).

Eventlar:
  close  — dialog yopilganda
  cancel — Escape bosilganda (faqat showModal)

═══════════════════════════════════════
  FORM METHOD="DIALOG"
═══════════════════════════════════════

<form method="dialog"> — form submit qilganda dialog avtomatik yopiladi.
  Submit tugmaning value si → dialog.returnValue ga yoziladi.

Bu usul confirmation dialog lar uchun juda qulay:
  "Ha" / "Yo'q" tugmalar — har birining value si bor.

═══════════════════════════════════════
  ::BACKDROP PSEUDO-ELEMENT
═══════════════════════════════════════

showModal() chaqirilganda ::backdrop avtomatik paydo bo'ladi.
CSS bilan to'liq styling mumkin:

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

Diqqat: show() da ::backdrop YO'Q — faqat showModal() da.

═══════════════════════════════════════
  ACCESSIBILITY (DIALOG)
═══════════════════════════════════════

Native dialog avzalliklari:
  - Focus avtomatik dialog ichiga o'tadi
  - Escape bilan yopish ishlaydi
  - Screen reader dialog rolini tushunadi
  - aria-label yoki aria-labelledby qo'shish tavsiya
  - Yopilganda focus qaytishi kerak (JS bilan boshqarish)

═══════════════════════════════════════
  DETAILS / SUMMARY — NATIVE ACCORDION
═══════════════════════════════════════

<details> + <summary> — JS siz accordion yaratadi.

  <details>
    <summary>Sarlavha (bosiladi)</summary>
    <p>Yashirin kontent — ochiladi/yopiladi</p>
  </details>

Xususiyatlari:
  open atributi       — ochiq holatda bo'lsa mavjud
  toggle event        — ochilish/yopilishda ishga tushadi
  ::marker            — uchburchak belgisini styling

Nested details ham ishlaydi — details ichida details.

Accessibility:
  - Screen reader uchun tayyor (expanded/collapsed holat)
  - Klaviatura bilan ishlaydi (Enter/Space)
  - Qo'shimcha ARIA kerak EMAS

═══════════════════════════════════════
  POPOVER API (YANGI)
═══════════════════════════════════════

Popover API — elementni sahifa ustida ko'rsatish uchun yangi HTML API.
Modal emas — tashqi kontent bilan ishlash mumkin.

Ikki xil rejim:
  popover="auto"    — tashqariga bosganda yopiladi (default)
  popover="manual"  — faqat JS yoki tugma bilan yopiladi

Boshqarish:
  popovertarget="popover-id"            — qaysi popover ni ochish
  popovertargetaction="show|hide|toggle" — harakat turi

CSS:
  :popover-open — ochiq holatdagi popover ni styling
  ::backdrop    — popover uchun ham ishlaydi (auto rejimda)

Foydalanish: dropdown menu, tooltip, notification, picker.

Kelajak: CSS Anchor Positioning — popover ni trigger elementga "bog'lash".

═══════════════════════════════════════
  NIMA UCHUN NATIVE ELEMENTLAR YAXSHI
═══════════════════════════════════════

1. Bundle size — 0 KB (brauzerda tayyor)
2. Accessibility — o'rnatilgan (ARIA, focus, keyboard)
3. Performance — brauzer optimallashtirilgan
4. Standart — barcha zamonaviy brauzerlarda ishlaydi
5. Kam kod — JS kutubxona kerak emas`.trim(),

  codeExamples: [
    {
      title: 'Dialog — showModal(), close(), ::backdrop',
      language: 'html',
      description: 'Native modal dialog — form method="dialog" bilan confirmation',
      code: `<!-- Dialog elementi -->
<dialog id="confirm-dialog">
  <h2>Ishonchingiz komilmi?</h2>
  <p>Bu amalni ortga qaytarib bo'lmaydi.</p>

  <!-- form method="dialog" — submit = dialog yopiladi -->
  <form method="dialog">
    <!-- value → dialog.returnValue ga yoziladi -->
    <button value="cancel" type="submit">Bekor qilish</button>
    <button value="confirm" type="submit">Ha, o'chirish</button>
  </form>
</dialog>

<!-- Trigger tugma -->
<button id="open-btn">O'chirish</button>

<style>
  /* Modal orqa foni */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  /* Dialog stili */
  dialog {
    border: none;
    border-radius: 12px;
    padding: 24px;
    max-width: 400px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  }

  /* Animatsiya */
  dialog[open] {
    animation: fade-in 0.2s ease-out;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
</style>

<script>
  const dialog = document.getElementById('confirm-dialog')
  const openBtn = document.getElementById('open-btn')

  // Modal ochish (backdrop + Escape + focus trap)
  openBtn.addEventListener('click', () => {
    dialog.showModal()
  })

  // Dialog yopilganda natijani tekshirish
  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm') {
      console.log('Foydalanuvchi tasdiqladi!')
    } else {
      console.log('Foydalanuvchi bekor qildi')
    }
  })
</script>`,
    },
    {
      title: 'Details/Summary — accordion',
      language: 'html',
      description: 'Native accordion — styled, nested, toggle event bilan',
      code: `<!-- Oddiy details/summary -->
<details>
  <summary>React nima?</summary>
  <p>React — UI kutubxonasi, komponent asosida ishlaydi.</p>
</details>

<!-- open atributi — dastlab ochiq -->
<details open>
  <summary>useState qanday ishlaydi?</summary>
  <p>Komponent holatini boshqaradi, o'zgarganda qayta render.</p>
</details>

<!-- Nested (ichma-ich) details -->
<details>
  <summary>React Hooks</summary>
  <p>Hooklar funksional komponentlarga state va lifecycle beradi.</p>

  <details>
    <summary>useState</summary>
    <p>Mahalliy holat uchun hook.</p>
  </details>

  <details>
    <summary>useEffect</summary>
    <p>Side effectlar uchun hook.</p>
  </details>
</details>

<style>
  details {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 8px;
  }

  /* Uchburchak marker ni almashtirish */
  summary {
    cursor: pointer;
    font-weight: 600;
    list-style: none;  /* default marker olib tashlash */
  }

  summary::before {
    content: '▸ ';
  }

  details[open] > summary::before {
    content: '▾ ';
  }

  /* Kontent animatsiya */
  details[open] > :not(summary) {
    animation: slide-down 0.2s ease-out;
  }

  @keyframes slide-down {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>

<script>
  // toggle event — ochilish/yopilishni kuzatish
  document.querySelectorAll('details').forEach(el => {
    el.addEventListener('toggle', () => {
      console.log(el.open ? 'Ochildi' : 'Yopildi')
    })
  })

  // Faqat bitta ochiq bo'lsin (exclusive accordion)
  const allDetails = document.querySelectorAll('details')
  allDetails.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        allDetails.forEach(other => {
          if (other !== detail) other.open = false
        })
      }
    })
  })
</script>`,
    },
    {
      title: 'Popover API — auto/manual rejimlar',
      language: 'html',
      description: 'Popover — dropdown menu va tooltip patternlari',
      code: `<!-- ═══ AUTO POPOVER (tashqariga bosganda yopiladi) ═══ -->
<button popovertarget="menu-popover">Menu</button>

<div id="menu-popover" popover="auto">
  <nav>
    <a href="#profile">Profil</a>
    <a href="#settings">Sozlamalar</a>
    <a href="#logout">Chiqish</a>
  </nav>
</div>

<!-- ═══ MANUAL POPOVER (faqat tugma bilan yopiladi) ═══ -->
<button popovertarget="notification" popovertargetaction="show">
  Bildirishnomani ko'rsatish
</button>
<button popovertarget="notification" popovertargetaction="hide">
  Yopish
</button>

<div id="notification" popover="manual">
  <p>Yangi xabar keldi!</p>
</div>

<!-- ═══ TOOLTIP PATTERN ═══ -->
<span class="tooltip-trigger" popovertarget="tooltip-1">
  Hover qiling ⓘ
</span>

<div id="tooltip-1" popover="auto" class="tooltip">
  Bu elementning tavsifi shu yerda ko'rinadi.
</div>

<style>
  /* Popover asosiy stil */
  [popover] {
    border: none;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  }

  /* Ochiq holatdagi popover */
  :popover-open {
    animation: popover-show 0.2s ease-out;
  }

  @keyframes popover-show {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Menu stili */
  #menu-popover nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  #menu-popover nav a {
    display: block;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 6px;
    color: inherit;
  }

  #menu-popover nav a:hover {
    background: #f3f4f6;
  }

  /* Tooltip stili */
  .tooltip {
    font-size: 0.85em;
    max-width: 240px;
    padding: 8px 12px;
    background: #1f2937;
    color: white;
    border-radius: 6px;
  }
</style>

<script>
  // JS bilan ham boshqarish mumkin
  const popover = document.getElementById('menu-popover')

  popover.showPopover()       // ochish
  popover.hidePopover()       // yopish
  popover.togglePopover()     // almashtirish

  // toggle eventi
  popover.addEventListener('toggle', (e) => {
    // e.newState: 'open' yoki 'closed'
    console.log('Popover holati:', e.newState)
  })
</script>`,
    },
  ],

  interviewQA: [
    {
      question: 'dialog.show() va dialog.showModal() farqi nima?',
      answer: 'show() oddiy dialog ochadi — sahifada boshqa elementlar bilan birga ko\'rinadi, backdrop yo\'q, Escape bilan yopilmaydi, focus trap yo\'q. showModal() esa haqiqiy modal ochadi — ::backdrop qo\'shiladi, Escape tugmasi bilan yopiladi, focus faqat dialog ichida yuradi (focus trap), tashqi elementlar inert bo\'ladi. Shuning uchun modal kerak bo\'lsa DOIM showModal() ishlatiladi.',
    },
    {
      question: 'details/summary qanday ishlaydi? JS kerakmi?',
      answer: 'details va summary — native HTML accordion. summary bosilganda details ichidagi kontent ochiladi/yopiladi. JS umuman kerak EMAS — brauzer o\'zi boshqaradi. open atributi ochiq holatni ko\'rsatadi. toggle event bilan JS da kuzatish mumkin. Accessibility tayyor — screen reader expanded/collapsed holatni aytadi, Enter/Space bilan ishlaydi. CSS bilan ::marker yoki list-style orqali uchburchak belgisini o\'zgartirish mumkin.',
    },
    {
      question: 'Native dialog vs custom modal — qanday afzalliklari bor?',
      answer: 'Native dialog afzalliklari: 1) Accessibility tayyor — focus trap, Escape, screen reader support o\'rnatilgan. 2) ::backdrop pseudo-element — CSS bilan styling. 3) form method="dialog" — forma bilan integratsiya. 4) 0 KB bundle — kutubxona kerak emas. 5) Top layer — z-index muammosi yo\'q, dialog doim eng tepada. Custom modal da bularning barchasini qo\'lda yozish kerak va ko\'pincha accessibility kamchiliklar bo\'ladi.',
    },
    {
      question: 'Popover API nima va qachon ishlatiladi?',
      answer: 'Popover API — elementni sahifa ustida (top layer) ko\'rsatish uchun HTML API. Dialog dan farqi — modal EMAS, sahifa bilan ishlash mumkin. Ikki rejim bor: auto (tashqariga bosganda yopiladi) va manual (faqat JS/tugma bilan yopiladi). Ishlatilishi: dropdown menu, tooltip, notification, date picker. popover atributi, popovertarget va popovertargetaction bilan deklarativ boshqariladi. :popover-open pseudo-class bilan CSS styling. z-index bilan kurashish kerak emas — top layer da ishlaydi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-advanced', topicId: 'web-components', label: 'Web Components' },
    { techId: 'html', sectionId: 'html-advanced', topicId: 'canvas', label: 'Canvas API' },
  ],
}
