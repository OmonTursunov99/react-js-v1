import type { Topic } from '../../../types'

export const linksNavigation: Topic = {
  id: 'links-navigation',
  title: 'Havolalar va Navigatsiya',
  importance: 3,
  status: 'to-learn',
  description: 'a, href, target, rel, nav, anchor links, download',
  content: `<a> tegi — HTML-dagi eng asosiy navigatsiya elementi. U foydalanuvchini boshqa sahifalarga, fayllarga, email manzillarga yoki sahifa ichidagi bo'limlarga yo'naltiradi.

═══════════════════════════════════════
  HREF TURLARI
═══════════════════════════════════════

1. Absolute URL — to'liq manzil:
   <a href="https://example.com/page">Sahifa</a>

2. Relative URL — joriy saytga nisbatan:
   <a href="/about">Biz haqimizda</a>
   <a href="../contact">Aloqa</a>

3. Anchor link — sahifa ichida navigatsiya:
   <a href="#bo'lim-2">2-bo'limga o'tish</a>
   <h2 id="bo'lim-2">Ikkinchi bo'lim</h2>

4. mailto: — email dasturini ochish:
   <a href="mailto:info@misol.uz">Email yuborish</a>
   <a href="mailto:info@misol.uz?subject=Salom&body=Matn">Mavzuli email</a>

5. tel: — telefon raqamga qo'ng'iroq:
   <a href="tel:+998901234567">Qo'ng'iroq qilish</a>

6. javascript:void(0) — hech narsa qilmaydigan havola:
   <a href="javascript:void(0)">Hech narsa</a>
   ESLATMA: bu anti-pattern — buning o'rniga <button> ishlatish kerak!

═══════════════════════════════════════
  TARGET ATRIBUTI
═══════════════════════════════════════

target — havola qayerda ochilishini belgilaydi:

  _self   — shu oynada (standart)
  _blank  — yangi tab/oynada
  _parent — parent frame-da (iframe ichidan)
  _top    — eng yuqori oynada (barcha framelardan chiqib)

XAVFSIZLIK OGOHLANTIRISH:
target="_blank" ishlatganda DOIM rel="noopener noreferrer" qo'shing!
Aks holda yangi oyna window.opener orqali eski sahifani boshqarishi mumkin.

═══════════════════════════════════════
  REL ATRIBUTI
═══════════════════════════════════════

rel — havola va hozirgi sahifa orasidagi munosabatni bildiradi:

  noopener    — yangi oynaga window.opener berilmaydi (xavfsizlik)
  noreferrer  — referrer header yuborilmaydi (maxfiylik)
  nofollow    — qidiruv tizimlariga: bu havolaga "ishonmang"
  external    — tashqi havola ekanligi belgilanadi
  sponsored   — reklama/sponsorlik havolasi
  ugc         — foydalanuvchi yaratgan kontent (user generated content)

Zamonaviy brauzerlar target="_blank" uchun avtomatik noopener qo'shadi,
lekin eski brauzerlarni qo'llab-quvvatlash uchun yozish tavsiya etiladi.

═══════════════════════════════════════
  NAV TEGI — NAVIGATSIYA SEMANTIKASI
═══════════════════════════════════════

<nav> — sahifadagi asosiy navigatsiya bloklarini belgilaydi.
Screen readerlar <nav> ni navigatsiya sifatida taniydi.

  <nav aria-label="Asosiy menyu">
    <ul>
      <li><a href="/">Bosh sahifa</a></li>
      <li><a href="/about">Biz haqimizda</a></li>
    </ul>
  </nav>

Qoidalar:
- Har bir navigatsiya bloki <nav> ichida bo'lsin
- Bir nechta <nav> bo'lsa — aria-label bilan farqlang
- Har qanday havolalar ro'yxati <nav> emas — faqat ASOSIY navigatsiya

═══════════════════════════════════════
  DOWNLOAD ATRIBUTI
═══════════════════════════════════════

download — fayl brauzerda ochilmasdan yuklab olinadi:

  <a href="/file.pdf" download>PDF yuklab olish</a>
  <a href="/image.png" download="rasm.png">Rasm saqlash</a>

ESLATMA: faqat same-origin fayllarga ishlaydi (cross-origin uchun server
Content-Disposition header yuborishi kerak).

═══════════════════════════════════════
  LINK vs BUTTON — QACHON QAYSI BIRI?
═══════════════════════════════════════

<a> (Link) ishlatish — NAVIGATSIYA uchun:
  ✅ Boshqa sahifaga o'tish
  ✅ URL o'zgarishi kerak bo'lganda
  ✅ Foydalanuvchi yangi tabda ochishi mumkin bo'lganda

<button> ishlatish — AMAL (action) uchun:
  ✅ Formani yuborish
  ✅ Modalni ochish/yopish
  ✅ Ma'lumotni o'chirish
  ✅ UI ni o'zgartirish (filter, sort)

NOTO'G'RI: <a href="#" onclick="deleteItem()"> — bu navigatsiya emas!
TO'G'RI: <button onclick="deleteItem()">O'chirish</button>

═══════════════════════════════════════
  SKIP NAVIGATION — ACCESSIBILITY PATTERN
═══════════════════════════════════════

Screen reader va klaviatura foydalanuvchilari uchun navigatsiyani
o'tkazib yuborib, to'g'ridan-to'g'ri asosiy kontentga o'tish imkoniyati:

  <a href="#main-content" class="skip-link">
    Asosiy kontentga o'tish
  </a>
  ...
  <main id="main-content">...</main>

skip-link odatda ko'rinmaydi, faqat focus bo'lganda ko'rinadi.

═══════════════════════════════════════
  ARIA-CURRENT — HOZIRGI SAHIFA
═══════════════════════════════════════

Navigatsiyada hozirgi sahifani belgilash:
  <nav>
    <a href="/" aria-current="page">Bosh sahifa</a>
    <a href="/about">Biz haqimizda</a>
  </nav>

aria-current="page" — screen readerga "siz shu sahifadasiz" deb aytadi.
CSS da ham styling uchun ishlatish mumkin:
  a[aria-current="page"] { font-weight: bold; }`.trim(),

  codeExamples: [
    {
      title: 'Barcha href turlari + target + rel atributlari',
      language: 'html',
      description: 'Havolaning barcha turlari va xavfsizlik atributlari',
      code: `<!-- 1. Absolute URL -->
<a href="https://developer.mozilla.org">MDN Web Docs</a>

<!-- 2. Relative URL -->
<a href="/about">Biz haqimizda</a>
<a href="../services">Xizmatlar</a>

<!-- 3. Anchor link — sahifa ichida o'tish -->
<a href="#aloqa">Aloqa bo'limiga o'tish</a>

<!-- 4. Email havola (mavzu va matn bilan) -->
<a href="mailto:info@misol.uz?subject=Savol&body=Salom%2C%20savolim%20bor">
  Email yuborish
</a>

<!-- 5. Telefon raqam -->
<a href="tel:+998901234567">+998 90 123 45 67</a>

<!-- 6. Tashqi havola — xavfsizlik bilan -->
<a
  href="https://tashqi-sayt.com"
  target="_blank"
  rel="noopener noreferrer"
>
  Tashqi saytga o'tish ↗
</a>

<!-- 7. Nofollow — SEO uchun, ishonchsiz havolalarga -->
<a
  href="https://reklama.com"
  rel="nofollow sponsored"
  target="_blank"
>
  Reklama
</a>

<!-- 8. Target turlari -->
<a href="/page" target="_self">Shu oynada (standart)</a>
<a href="/page" target="_blank" rel="noopener noreferrer">Yangi tabda</a>
<a href="/page" target="_parent">Parent frame-da</a>
<a href="/page" target="_top">Eng yuqori oynada</a>

<!-- XAVFSIZLIK ESLATMA: -->
<!-- target="_blank" + rel="noopener noreferrer" har doim birga! -->
<!-- Aks holda yangi tab window.opener orqali eski sahifani o'zgartirishi mumkin -->`,
    },
    {
      title: 'Navigatsiya: nav + skip link + aria-current + responsive',
      language: 'html',
      description: 'To\'liq accessible navigatsiya tuzilmasi',
      code: `<!-- Skip navigation — klaviatura foydalanuvchilari uchun -->
<a href="#main-content" class="skip-link">
  Asosiy kontentga o'tish
</a>

<!-- Asosiy navigatsiya -->
<header>
  <nav aria-label="Asosiy navigatsiya">
    <a href="/" class="logo">Sayt nomi</a>

    <!-- Mobil menyu tugmasi -->
    <button
      class="menu-toggle"
      aria-expanded="false"
      aria-controls="main-menu"
      aria-label="Menyuni ochish"
    >
      <span class="hamburger-icon" aria-hidden="true"></span>
    </button>

    <!-- Navigatsiya ro'yxati -->
    <ul id="main-menu" role="list">
      <li><a href="/" aria-current="page">Bosh sahifa</a></li>
      <li><a href="/about">Biz haqimizda</a></li>
      <li><a href="/services">Xizmatlar</a></li>
      <li><a href="/contact">Aloqa</a></li>
    </ul>
  </nav>
</header>

<!-- Ikkinchi navigatsiya — breadcrumb -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Bosh sahifa</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="/blog/html" aria-current="page">HTML asoslari</a></li>
  </ol>
</nav>

<!-- Asosiy kontent — skip link shu yerga olib keladi -->
<main id="main-content">
  <h1>Sahifa sarlavhasi</h1>
  <p>Asosiy kontent...</p>
</main>

<!-- Footer navigatsiya -->
<footer>
  <nav aria-label="Footer navigatsiya">
    <a href="/privacy">Maxfiylik siyosati</a>
    <a href="/terms">Foydalanish shartlari</a>
  </nav>
</footer>

<style>
  /* Skip link — odatda ko'rinmaydi, focus bo'lganda paydo bo'ladi */
  .skip-link {
    position: absolute;
    top: -100%;
    left: 0;
    padding: 0.5rem 1rem;
    background: #1a1a2e;
    color: #fff;
    z-index: 1000;
    text-decoration: none;
  }
  .skip-link:focus {
    top: 0;
  }

  /* Hozirgi sahifa stili */
  a[aria-current="page"] {
    font-weight: bold;
    color: #2563eb;
    border-bottom: 2px solid currentColor;
  }
</style>`,
    },
    {
      title: 'Anchor links (smooth scroll), download, link vs button',
      language: 'html',
      description: 'Sahifa ichida navigatsiya, fayl yuklash va link/button farqi',
      code: `<!-- ═══ ANCHOR LINKS — sahifa ichida navigatsiya ═══ -->

<!-- Mundarija — anchor linklar bilan -->
<nav aria-label="Sahifa mundarijasi">
  <h2>Mundarija</h2>
  <ul>
    <li><a href="#kirish">Kirish</a></li>
    <li><a href="#asosiy">Asosiy qism</a></li>
    <li><a href="#xulosa">Xulosa</a></li>
  </ul>
</nav>

<!-- Maqsadli bo'limlar — id bilan belgilangan -->
<section id="kirish">
  <h2>Kirish</h2>
  <p>Bu bo'lim haqida...</p>
</section>

<section id="asosiy">
  <h2>Asosiy qism</h2>
  <p>Batafsil ma'lumot...</p>
</section>

<section id="xulosa">
  <h2>Xulosa</h2>
  <p>Yakuniy fikrlar...</p>
</section>

<!-- Sahifa tepasiga qaytish -->
<a href="#top">↑ Tepaga qaytish</a>

<!-- Smooth scroll — CSS bilan -->
<style>
  html {
    scroll-behavior: smooth; /* Barcha anchor linklar smooth bo'ladi */
  }

  /* Anchor ga o'tganda sarlavha ko'rinishi uchun offset */
  section[id] {
    scroll-margin-top: 80px; /* header balandligi qadar */
  }
</style>


<!-- ═══ DOWNLOAD ATRIBUTI — faylni yuklab olish ═══ -->

<!-- Oddiy yuklab olish -->
<a href="/files/hisobot.pdf" download>
  📄 Hisobotni yuklab olish (PDF)
</a>

<!-- Fayl nomini o'zgartirish -->
<a href="/files/img_2024.jpg" download="profil-rasm.jpg">
  🖼️ Rasmni saqlash
</a>

<!-- JavaScript orqali dinamik yuklab olish -->
<script>
  function downloadCSV(data, filename) {
    // Ma'lumotdan blob yaratish
    const blob = new Blob([data], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)

    // Vaqtinchalik havola yaratib bosish
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()

    // Xotirani tozalash
    URL.revokeObjectURL(url)
  }
</script>


<!-- ═══ LINK vs BUTTON — TO'G'RI ISHLATISH ═══ -->

<!-- TO'G'RI: Link — navigatsiya uchun -->
<a href="/products/123">Mahsulot sahifasi</a>
<a href="/settings">Sozlamalar</a>

<!-- TO'G'RI: Button — amal (action) uchun -->
<button onclick="addToCart(123)">Savatga qo'shish</button>
<button onclick="toggleTheme()">Temani o'zgartirish</button>
<button onclick="deleteItem(5)">O'chirish</button>

<!-- NOTO'G'RI: Havolani tugma sifatida ishlatish -->
<!-- <a href="#" onclick="deleteItem(5)">O'chirish</a> -->
<!-- <a href="javascript:void(0)" onclick="openModal()">Ochish</a> -->

<!-- NOTO'G'RI: Tugmani havola sifatida ishlatish -->
<!-- <button onclick="location.href='/about'">Biz haqimizda</button> -->`,
    },
  ],

  interviewQA: [
    {
      question: 'target="_blank" xavfsizlik muammosi nima?',
      answer: 'target="_blank" bilan ochilgan yangi tab window.opener orqali eski sahifaga kirish imkoniyatiga ega bo\'ladi. Zararli sayt window.opener.location ni o\'zgartirib, foydalanuvchini phishing sahifaga yo\'naltirishishi mumkin (reverse tabnabbing hujumi). Masalan, foydalanuvchi bankining login sahifasiga o\'xshash sahifaga redirect qilinishi mumkin. Yechim: DOIM rel="noopener noreferrer" qo\'shish. Zamonaviy brauzerlar (Chrome 88+) target="_blank" uchun avtomatik noopener qo\'shadi, lekin eski brauzerlarni qo\'llab-quvvatlash uchun yozish tavsiya etiladi.',
    },
    {
      question: 'rel="noopener noreferrer" nima uchun kerak?',
      answer: 'rel="noopener" — yangi oynaga window.opener berilmaydi, shuning uchun yangi tab eski sahifani boshqara olmaydi (reverse tabnabbing dan himoya). Bundan tashqari, yangi sahifa eski sahifaning JS kontekstida ishlaMAYDI — performance ham yaxshilanadi. rel="noreferrer" — so\'rov yuborilganda Referer HTTP header qo\'shilmaydi, ya\'ni yangi sayt foydalanuvchi qaysi sahifadan kelganini bilmaydi (maxfiylik himoyasi). noreferrer o\'z ichiga noopener ni ham oladi, lekin ikkalasini birga yozish aniq va barcha brauzerlarda ishlaydi.',
    },
    {
      question: 'Link va Button farqi? Qachon qaysi biri ishlatiladi?',
      answer: '<a> (link) — NAVIGATSIYA uchun: boshqa sahifaga yoki resursga o\'tish. URL o\'zgarishi kerak, foydalanuvchi o\'ng tugma bilan yangi tabda ochishi mumkin, screen reader "havola" deb e\'lon qiladi. <button> — AMAL (action) uchun: formani yuborish, modalni ochish, ma\'lumotni o\'chirish, UI o\'zgartirish. URL o\'zgarmaydi, Enter va Space bilan ishlaydi. Anti-pattern: <a href="#" onclick="delete()"> — bu navigatsiya emas, button bo\'lishi kerak. <div onclick="..."> ham noto\'g\'ri — accessibility yo\'qoladi. Qoida: "Bu yerga bosilsa, URL o\'zgaradimi?" Ha — link, Yo\'q — button.',
    },
    {
      question: 'Skip navigation nima va nega kerak?',
      answer: 'Skip navigation — sahifadagi asosiy kontentga to\'g\'ridan-to\'g\'ri o\'tish imkonini beradigan yashirin havola. Klaviatura foydalanuvchilari va screen reader ishlatuvchilar har bir sahifada navigatsiya linklar orqali Tab bosib o\'tishi kerak bo\'ladi — bu 20-30 ta Tab bosish bo\'lishi mumkin. Skip link bu muammoni hal qiladi: sahifa tepasida yashirin <a href="#main-content"> bo\'ladi, foydalanuvchi birinchi Tab bosishda uni ko\'radi va Enter bilan asosiy kontentga o\'tadi. CSS bilan odatda ekrandan tashqarida yashiriladi va faqat :focus holatida ko\'rinadi. Bu WCAG 2.1 talabi (2.4.1 — "Bypass Blocks").',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'semantic-html', label: 'Semantik HTML' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'forms', label: 'Formalar' },
  ],
}
