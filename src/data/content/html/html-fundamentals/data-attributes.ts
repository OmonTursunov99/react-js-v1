import type { Topic } from '../../../types'

export const dataAttributes: Topic = {
  id: 'data-attributes',
  title: 'Data Attributes',
  importance: 2,
  status: 'to-learn',
  description: 'data-* atributlari, dataset API, CSS selectors bilan ishlash',
  content: `data-* atributlari — HTML elementlarga maxsus (custom) ma'lumot saqlash uchun mo'ljallangan standart mexanizm. Har qanday atribut nomi "data-" bilan boshlansa, u data atribut hisoblanadi.

═══════════════════════════════════════
  DATA ATRIBUT NIMA?
═══════════════════════════════════════

HTML standartida o'zingizning atributlaringizni qo'shish mumkin emas —
FAQAT "data-" prefiksi bilan boshlansa to'g'ri hisoblanadi:

  <div data-user-id="42" data-role="admin">Ali</div>
  <button data-action="delete" data-item-id="7">O'chirish</button>

Qoidalar:
  - Nomi faqat kichik harflar va defis (-)
  - Qiymat har doim STRING (raqam ham string sifatida saqlanadi)
  - Brauzer va validator xato bermaydi
  - Screen readerlar va qidiruv tizimlari e'tibor bermaydi

═══════════════════════════════════════
  NAMING CONVENTION — camelCase KONVERSIYA
═══════════════════════════════════════

HTML da defis, JavaScript da camelCase:

  data-user-id      → dataset.userId
  data-product-name → dataset.productName
  data-is-active    → dataset.isActive
  data-x            → dataset.x

Qoida: har bir defisdan keyingi harf katta bo'ladi.

═══════════════════════════════════════
  JAVASCRIPT DA O'QISH VA YOZISH
═══════════════════════════════════════

1. dataset API (zamonaviy usul):
   const el = document.querySelector('[data-user-id]')
   el.dataset.userId        // "42" — o'qish
   el.dataset.userId = "99" // yozish
   delete el.dataset.userId // o'chirish

2. getAttribute/setAttribute (universal usul):
   el.getAttribute('data-user-id')        // "42"
   el.setAttribute('data-user-id', '99')  // yozish
   el.removeAttribute('data-user-id')     // o'chirish

Farqi:
  - dataset — faqat data-* atributlar bilan ishlaydi, camelCase
  - getAttribute — BARCHA atributlar bilan ishlaydi, HTML nomi bilan

═══════════════════════════════════════
  CSS DA DATA ATRIBUTLAR BILAN ISHLASH
═══════════════════════════════════════

1. Atribut selektori:
   [data-theme="dark"]   { background: #1a1a2e; }
   [data-status="error"] { border-color: red; }
   [data-size]           { font-size: 1.2rem; } /* mavjud bo'lsa *)

2. attr() funksiyasi (content ichida):
   [data-tooltip]::after {
     content: attr(data-tooltip);
   }

3. Murakkab selektorlar:
   [data-theme="dark"] [data-status] — ichma-ich
   button[data-variant="primary"]    — tegma + atribut

═══════════════════════════════════════
  USE CASES — QACHON ISHLATILADI?
═══════════════════════════════════════

1. Testing — data-testid:
   <button data-testid="submit-btn">Yuborish</button>
   Testda: screen.getByTestId('submit-btn')
   Class nomiga bog'liq emas — styling o'zgarsa test sinmaydi

2. Analytics — data-analytics:
   <a href="/pricing" data-analytics="cta-pricing">Narxlar</a>
   Analytics script barcha [data-analytics] elementlarni kuzatadi

3. UI holati — data-state, data-active:
   <div data-state="open">Ochiq panel</div>
   CSS: [data-state="open"] { display: block; }

4. Metadata — data-id, data-type:
   <tr data-id="42" data-type="premium">...</tr>
   JS: row.dataset.id ga qarab amal qilish

5. Tooltip, tab, accordion:
   <span data-tooltip="Bu yerga bosing">Yordam</span>

═══════════════════════════════════════
  PERFORMANCE VA BEST PRACTICES
═══════════════════════════════════════

data-* atributlar vs class vs id:
  - ID — sahifada yagona element topish uchun (tez)
  - Class — styling va guruhli tanlash uchun (tez)
  - data-* — metadata saqlash uchun (bir oz sekinroq)

Best practices:
  ✅ Faqat metadata uchun ishlatish (kichik qiymatlar)
  ✅ data-testid — testlar uchun ajoyib
  ✅ CSS bilan UI holat boshqaruvi uchun qulay
  ❌ Katta ma'lumot saqlash (JSON, uzun matnlar) — NOTO'G'RI
  ❌ Ma'lumot bazasi o'rniga ishlatish — NOTO'G'RI
  ❌ Maxfiy ma'lumot saqlash — foydalanuvchi ko'rishi mumkin!

═══════════════════════════════════════
  MODERN FRAMEWORKLARDA DATA ATRIBUTLAR
═══════════════════════════════════════

React, Vue kabi frameworklarda state komponent ichida saqlanadi,
DOM ga data atribut sifatida yozish kamdan-kam kerak bo'ladi.

Lekin quyidagi holatlarda hali ham foydali:
  - data-testid — testlar uchun (React Testing Library)
  - data-theme — global CSS tema uchun
  - data-analytics — tracking uchun
  - Server-rendered HTML ga JavaScript bog'lash uchun`.trim(),

  codeExamples: [
    {
      title: 'Data atributlar — yaratish, o\'qish, o\'zgartirish',
      language: 'html',
      description: 'HTML da belgilash va JavaScript da dataset API bilan ishlash',
      code: `<!-- HTML da data atributlar -->
<div
  id="user-card"
  data-user-id="42"
  data-user-name="Ali Valiyev"
  data-role="admin"
  data-is-active="true"
  data-login-count="156"
>
  <h3>Foydalanuvchi kartochkasi</h3>
</div>

<ul id="product-list">
  <li data-id="1" data-price="25000" data-category="electronics">Telefon</li>
  <li data-id="2" data-price="5000" data-category="books">Kitob</li>
  <li data-id="3" data-price="15000" data-category="electronics">Quloqchin</li>
</ul>

<script>
  // ═══ dataset API bilan o'qish ═══
  const card = document.getElementById('user-card')

  console.log(card.dataset.userId)     // "42" (data-user-id → camelCase)
  console.log(card.dataset.userName)   // "Ali Valiyev"
  console.log(card.dataset.role)       // "admin"
  console.log(card.dataset.isActive)   // "true" (STRING, boolean emas!)

  // Raqamga aylantirish kerak
  const loginCount = Number(card.dataset.loginCount) // 156

  // Boolean tekshirish
  const isActive = card.dataset.isActive === 'true'  // true

  // ═══ dataset API bilan yozish ═══
  card.dataset.role = 'moderator'     // data-role="moderator" bo'ladi
  card.dataset.lastVisit = '2026-04-15' // yangi data-last-visit qo'shiladi

  // ═══ getAttribute/setAttribute — alternativ usul ═══
  const role = card.getAttribute('data-role')      // "moderator"
  card.setAttribute('data-role', 'user')           // yozish
  card.removeAttribute('data-is-active')           // o'chirish

  // ═══ Barcha data atributlarni ko'rish ═══
  console.log(card.dataset) // DOMStringMap { userId: "42", ... }

  // ═══ Data atribut bo'yicha elementlarni topish ═══
  const electronics = document.querySelectorAll('[data-category="electronics"]')
  electronics.forEach(item => {
    const price = Number(item.dataset.price)
    console.log(item.textContent, '—', price, "so'm")
  })
  // Telefon — 25000 so'm
  // Quloqchin — 15000 so'm

  // ═══ O'chirish ═══
  delete card.dataset.userId // data-user-id o'chiriladi
</script>`,
    },
    {
      title: 'CSS bilan data atributlar',
      language: 'html',
      description: 'Atribut selektorlari, attr() funksiyasi, tema va holat boshqaruvi',
      code: `<!-- Tema boshqaruvi — data-theme bilan -->
<html data-theme="light">
<body>
  <!-- Status badges -->
  <span class="badge" data-status="success">Tasdiqlangan</span>
  <span class="badge" data-status="error">Xatolik</span>
  <span class="badge" data-status="warning">Ogohlantirish</span>

  <!-- Tooltip — data atribut orqali -->
  <button data-tooltip="Bu tugma formani yuboradi">
    Yuborish
  </button>

  <!-- Hajm tanlash -->
  <button data-size="sm">Kichik</button>
  <button data-size="md">O'rta</button>
  <button data-size="lg">Katta</button>

  <!-- Raqamli ko'rsatkich -->
  <div class="progress" data-percent="75"></div>
</body>
</html>

<style>
  /* ═══ Tema — data-theme bilan ═══ */
  [data-theme="light"] {
    --bg: #ffffff;
    --text: #1a1a2e;
  }
  [data-theme="dark"] {
    --bg: #1a1a2e;
    --text: #e0e0e0;
  }
  body {
    background: var(--bg);
    color: var(--text);
  }

  /* ═══ Status badge — data-status selektori ═══ */
  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
  }
  .badge[data-status="success"] { background: #d1fae5; color: #065f46; }
  .badge[data-status="error"]   { background: #fee2e2; color: #991b1b; }
  .badge[data-status="warning"] { background: #fef3c7; color: #92400e; }

  /* ═══ Tooltip — attr() funksiyasi bilan ═══ */
  [data-tooltip] {
    position: relative;
    cursor: help;
  }
  [data-tooltip]:hover::after {
    content: attr(data-tooltip); /* data-tooltip qiymatini ko'rsatadi */
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem;
    background: #333;
    color: #fff;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  /* ═══ Hajm — data-size selektori ═══ */
  [data-size="sm"] { padding: 0.25rem 0.5rem; font-size: 0.75rem; }
  [data-size="md"] { padding: 0.5rem 1rem;    font-size: 1rem; }
  [data-size="lg"] { padding: 0.75rem 1.5rem; font-size: 1.25rem; }

  /* ═══ Progress bar — attr() bilan foiz ═══ */
  .progress {
    width: 100%;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
  }
  .progress::after {
    content: '';
    display: block;
    height: 100%;
    width: attr(data-percent %); /* hali barcha brauzerlarda ishlamaydi */
    background: #3b82f6;
    border-radius: 4px;
  }
</style>

<script>
  // Temani almashtirish
  function toggleTheme() {
    const html = document.documentElement
    const current = html.dataset.theme
    html.dataset.theme = current === 'light' ? 'dark' : 'light'
  }
</script>`,
    },
    {
      title: 'Real-world: data-testid, analytics, tooltip, tabs',
      language: 'html',
      description: 'Amaliy loyihalarda data atributlarning haqiqiy ishlatilishi',
      code: `<!-- ═══ 1. TESTING — data-testid ═══ -->
<!-- Class va ID o'zgarishi mumkin, data-testid o'zgarmaydi -->
<form data-testid="login-form">
  <input
    type="email"
    data-testid="email-input"
    placeholder="Email"
  >
  <input
    type="password"
    data-testid="password-input"
    placeholder="Parol"
  >
  <button data-testid="submit-button" type="submit">
    Kirish
  </button>
  <span data-testid="error-message" class="hidden">
    Email yoki parol noto'g'ri
  </span>
</form>

<!--
  Test kodida (React Testing Library / Playwright):
  screen.getByTestId('login-form')
  screen.getByTestId('email-input')
  page.locator('[data-testid="submit-button"]')
-->


<!-- ═══ 2. ANALYTICS TRACKING ═══ -->
<nav>
  <a href="/pricing" data-analytics="nav-pricing" data-analytics-section="header">
    Narxlar
  </a>
  <a href="/demo" data-analytics="nav-demo" data-analytics-section="header">
    Demo
  </a>
</nav>

<button data-analytics="cta-signup" data-analytics-section="hero">
  Ro'yxatdan o'tish
</button>

<script>
  // Barcha analytics elementlarni avtomatik kuzatish
  document.querySelectorAll('[data-analytics]').forEach(el => {
    el.addEventListener('click', () => {
      const event = el.dataset.analytics
      const section = el.dataset.analyticsSection || 'unknown'

      // Analytics tizimiga yuborish
      console.log('Analytics:', { event, section })
      // analyticsService.track(event, { section })
    })
  })
</script>


<!-- ═══ 3. TAB COMPONENT — data atributlar bilan ═══ -->
<div class="tabs">
  <!-- Tab tugmalari -->
  <div role="tablist">
    <button
      role="tab"
      data-tab="info"
      aria-selected="true"
      aria-controls="panel-info"
    >
      Ma'lumot
    </button>
    <button
      role="tab"
      data-tab="code"
      aria-selected="false"
      aria-controls="panel-code"
    >
      Kod
    </button>
    <button
      role="tab"
      data-tab="qa"
      aria-selected="false"
      aria-controls="panel-qa"
    >
      Savollar
    </button>
  </div>

  <!-- Tab panellari -->
  <div id="panel-info" role="tabpanel" data-tab-panel="info">
    Ma'lumot kontenti...
  </div>
  <div id="panel-code" role="tabpanel" data-tab-panel="code" hidden>
    Kod misollari...
  </div>
  <div id="panel-qa" role="tabpanel" data-tab-panel="qa" hidden>
    Savol-javoblar...
  </div>
</div>

<script>
  // Tab almashtirishni data atributlar orqali boshqarish
  document.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab

      // Barcha tablarni o'chirish
      document.querySelectorAll('[role="tab"]').forEach(t => {
        t.setAttribute('aria-selected', 'false')
      })
      document.querySelectorAll('[role="tabpanel"]').forEach(p => {
        p.hidden = true
      })

      // Tanlangan tabni yoqish
      tab.setAttribute('aria-selected', 'true')
      document.querySelector(\`[data-tab-panel="\${targetTab}"]\`).hidden = false
    })
  })
</script>`,
    },
  ],

  interviewQA: [
    {
      question: 'data-* atributlari nima va qachon ishlatiladi?',
      answer: 'data-* atributlari — HTML elementlarga custom metadata saqlash uchun standart mexanizm. Har qanday "data-" bilan boshlanadigan atribut yaroqli. Ishlatish holatlari: 1) data-testid — testlarda element topish uchun (class/ID ga bog\'lanmaslik). 2) data-analytics — analytics tracking uchun. 3) data-theme, data-state — CSS bilan UI holat boshqaruvi. 4) data-id, data-type — JavaScript uchun metadata. Lekin katta ma\'lumot (JSON) yoki maxfiy ma\'lumot saqlash NOTO\'G\'RI — foydalanuvchi DevTools da ko\'rishi mumkin.',
    },
    {
      question: 'dataset API qanday ishlaydi? Naming convention qanday?',
      answer: 'element.dataset — DOMStringMap qaytaradi, barcha data-* atributlarni o\'z ichiga oladi. Naming convention: HTML dagi defis JavaScript da camelCase ga aylanadi: data-user-id → dataset.userId, data-is-active → dataset.isActive. Teskari yo\'nalishda ham ishlaydi: dataset.firstName yozsangiz, HTML da data-first-name paydo bo\'ladi. Barcha qiymatlar STRING sifatida saqlanadi — raqamni Number() bilan, booleanni === "true" bilan aylantirish kerak. O\'chirish uchun delete dataset.propertyName ishlatiladi.',
    },
    {
      question: 'data atributlarda katta ma\'lumot saqlash to\'g\'rimi?',
      answer: 'Yo\'q, noto\'g\'ri. Sabablar: 1) Performance — DOM atributlari har safar string sifatida parse qilinadi, katta JSON sekin ishlaydi. 2) Xotira — DOM elementlarga biriktirilgan ma\'lumot brauzer xotirasini ko\'p egallaydi. 3) Xavfsizlik — har qanday foydalanuvchi DevTools da ko\'rishi mumkin. 4) SEO — qidiruv tizimlari data atributlarni indekslamaydi. To\'g\'ri alternativlar: JavaScript o\'zgaruvchilari, Map/WeakMap, framework state (React useState, Vuex), yoki localStorage. data-* faqat kichik metadata uchun — id, status, type kabi.',
    },
    {
      question: 'data-testid nima uchun kerak?',
      answer: 'data-testid — testlarda DOM elementlarni topish uchun maxsus atribut. Afzalliklari: 1) Class yoki ID o\'zgarsa test sinmaydi — data-testid mustaqil. 2) Maqsadi aniq — boshqa dasturchilar bu atribut test uchun ekanini tushunadi. 3) Production da olib tashlash mumkin — babel plugin bilan. React Testing Library da screen.getByTestId(), Playwright da page.locator(\'[data-testid="..."]\') ishlatiladi. LEKIN birinchi navbatda accessible selektorlar (getByRole, getByLabelText) ishlatish kerak — data-testid faqat boshqa usul bo\'lmaganda.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'semantic-html', label: 'Semantik HTML' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'forms', label: 'Formalar' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
  ],
}
