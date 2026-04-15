import type { Topic } from '../../../types'

export const documentStructure: Topic = {
  id: 'document-structure',
  title: 'HTML Hujjat Tuzilmasi',
  importance: 3,
  status: 'to-learn',
  description: 'DOCTYPE, html, head, body, charset, viewport, lang',
  content: `HTML hujjat tuzilmasi — bu har bir veb-sahifaning asosi. Brauzer HTML faylni yuqoridan pastga qarab o'qiydi va har bir element aniq vazifaga ega.

═══════════════════════════════════════
  DOCTYPE — HUJJAT TURI E'LONI
═══════════════════════════════════════

<!DOCTYPE html> — brauzerga "bu HTML5 hujjat" deb aytadi.

Agar DOCTYPE yozilmasa:
  → Brauzer "quirks mode" ga o'tadi
  → Eski IE-ga mos rendering ishlatiladi
  → CSS box model noto'g'ri ishlaydi (IE box model)
  → Zamonaviy CSS xususiyatlari kutilganidek ishlamasligi mumkin

DOCTYPE yozilsa:
  → Brauzer "standards mode" da ishlaydi
  → W3C standartlariga mos rendering
  → Barcha zamonaviy CSS/JS to'g'ri ishlaydi

DOCTYPE — bu teg EMAS, bu brauzerga ko'rsatma. U <html> tegidan OLDIN yoziladi.

═══════════════════════════════════════
  <html> TEGI — ILDIZ ELEMENT
═══════════════════════════════════════

<html lang="uz"> — hujjatning ildiz elementi.

lang atributi nima uchun kerak:
  1. Screen readerlar to'g'ri tilni tanlaydi (talaffuz)
  2. Google qaysi tilda ekanligini biladi (SEO)
  3. Brauzer tarjima taklif qila oladi
  4. CSS :lang() selektori ishlaydi

lang qiymatlari: "uz", "en", "ru", "ja", "ar" va boshqalar (BCP 47 standarti).

═══════════════════════════════════════
  <head> — METADATA BO'LIMI
═══════════════════════════════════════

<head> ichida sahifa haqida MA'LUMOT bo'ladi (foydalanuvchiga ko'rinmaydi):

  <meta charset="UTF-8">       — belgilar kodlashi
  <meta name="viewport" ...>   — mobil moslashuvchanlik
  <title>...</title>           — sahifa sarlavhasi (tab, SEO)
  <meta name="description">    — SEO tavsifi
  <link rel="stylesheet">      — CSS fayllari
  <link rel="icon">            — favicon
  <link rel="preconnect">      — tashqi resursga oldindan ulanish
  <script>...</script>         — JavaScript (odatda body oxirida yoki defer bilan)

Tartib muhim: charset BIRINCHI bo'lishi kerak (title dan oldin),
chunki brauzer charset ni bilmasa, sarlavhani noto'g'ri ko'rsatishi mumkin.

═══════════════════════════════════════
  <body> — ASOSIY KONTENT
═══════════════════════════════════════

<body> — foydalanuvchi ko'radigan barcha kontent shu yerda.
Semantik teglar bilan tuziladi: <header>, <main>, <footer>, va boshqalar.

═══════════════════════════════════════
  charset="UTF-8" NIMA UCHUN MUHIM?
═══════════════════════════════════════

UTF-8 — universal belgilar kodlashi:
  → Lotin, kirill, arab, xitoy — barcha alifbolarni qo'llab-quvvatlaydi
  → O'zbek harflari: o', g', sh — to'g'ri ko'rinadi
  → Emoji ham ishlaydi: 🎉

Agar charset noto'g'ri bo'lsa:
  → "Krakozjabrlar" — belgilar buziladi
  → O'zbek tilidagi maxsus harflar noto'g'ri chiqadi
  → Xavfsizlik muammolari: UTF-7 XSS hujumlari

═══════════════════════════════════════
  VIEWPORT META — MOBIL RESPONSIVENESS
═══════════════════════════════════════

<meta name="viewport" content="width=device-width, initial-scale=1.0">

Bu teg nima qiladi:
  width=device-width  — sahifa kengligi = qurilma kengligi
  initial-scale=1.0   — dastlabki zoom darajasi = 100%

Agar viewport meta bo'lmasa:
  → Mobil brauzer sahifani 980px deb hisoblaydi
  → Sahifa juda kichik ko'rinadi
  → Foydalanuvchi zoom qilishi kerak

═══════════════════════════════════════
  HTML RENDERING PIPELINE
═══════════════════════════════════════

Brauzer HTML ni qanday qayta ishlaydi:

  1. Parsing    — HTML matnni tokenlar ga ajratadi
  2. DOM        — tokenlardan DOM daraxti quriladi
  3. CSSOM      — CSS dan CSSOM daraxti quriladi
  4. Render Tree — DOM + CSSOM birlashtiriladi (display:none elementlarsiz)
  5. Layout     — har bir element o'lchami va joylashuvi hisoblanadi
  6. Paint      — piksellar ekranga chiziladi
  7. Composite  — qatlamlar birlashtiriladi

Muhim: <script> tegi DOM parsing ni TO'XTATADI (render-blocking).
Shuning uchun script ni body oxiriga qo'yish yoki defer/async ishlatish tavsiya etiladi.

═══════════════════════════════════════
  HTML vs XHTML FARQI
═══════════════════════════════════════

HTML:
  → Kechiruvchi parser (tag yopilmasa ham ishlaydi)
  → <br>, <img> — yopish shart emas
  → Atributlar qo'shtirnoqsiz bo'lishi mumkin
  → Katta-kichik harfga e'tibor bermaydi

XHTML:
  → XML qoidalariga bo'ysunadi (qat'iy)
  → Barcha teglar yopilishi SHART: <br />
  → Atributlar ALBATTA qo'shtirnoqda: class="name"
  → Teglar faqat kichik harfda: <Div> → xato
  → Bitta xato — butun sahifa ko'rinmaydi

Hozirgi amaliyot: HTML5 ishlatiladi, lekin XHTML tartibida yozish tavsiya etiladi
(teglarni yopish, kichik harf, qo'shtirnoq) — bu kodni toza va izchil qiladi.`.trim(),

  codeExamples: [
    {
      title: 'To\'liq HTML5 boilerplate',
      language: 'html',
      description: 'Har bir HTML5 hujjatning asosiy tuzilmasi — DOCTYPE, html lang, head, body',
      code: `<!DOCTYPE html>
<!-- DOCTYPE — brauzerga HTML5 standards mode ishlatishni aytadi -->
<html lang="uz">
<head>
  <!-- charset birinchi — brauzer kodlashni bilishi kerak -->
  <meta charset="UTF-8">

  <!-- viewport — mobil qurilmalarda to'g'ri ko'rinish uchun -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Sahifa sarlavhasi — brauzer tab va SEO uchun -->
  <title>Mening veb-sahifam</title>
</head>
<body>
  <header>
    <h1>Sahifaga xush kelibsiz!</h1>
  </header>

  <main>
    <p>Asosiy kontent shu yerda.</p>
  </main>

  <footer>
    <p>&copy; 2026 Barcha huquqlar himoyalangan</p>
  </footer>
</body>
</html>`,
    },
    {
      title: '<head> tegida nima bo\'lishi kerak',
      language: 'html',
      description: 'To\'liq head bo\'limi — meta, title, link, favicon, preconnect',
      code: `<head>
  <!-- 1. Belgilar kodlashi — BIRINCHI bo'lishi kerak -->
  <meta charset="UTF-8">

  <!-- 2. Viewport — mobil responsiveness -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 3. SEO meta teglar -->
  <title>React Interview Tayyorgarlik | Ketmonjon</title>
  <meta name="description" content="Senior React Frontend suhbatiga tayyorgarlik platformasi">
  <meta name="keywords" content="react, frontend, interview, uzbek">

  <!-- 4. Open Graph — ijtimoiy tarmoqlarda ko'rinish -->
  <meta property="og:title" content="Ketmonjon — React O'quv Platformasi">
  <meta property="og:description" content="90+ mavzu bilan React suhbatiga tayyorlaning">
  <meta property="og:image" content="https://example.com/og-image.jpg">
  <meta property="og:type" content="website">

  <!-- 5. Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- 6. Preconnect — tashqi resursga oldindan ulanish (tezlik uchun) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <!-- 7. Shriftlar -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">

  <!-- 8. CSS fayllar -->
  <link rel="stylesheet" href="/styles/main.css">

  <!-- 9. JavaScript — defer bilan (DOM parse to'xtatmaydi) -->
  <script src="/scripts/app.js" defer></script>
</head>`,
    },
    {
      title: 'Noto\'g\'ri va to\'g\'ri hujjat tuzilmasi',
      language: 'html',
      description: 'HTML validatsiya xatolari va ularni tuzatish',
      code: `<!-- ❌ NOTO'G'RI: DOCTYPE yo'q — quirks mode -->
<html>
<head>
  <title>Sahifa</title>
  <!-- charset yo'q — belgilar buzilishi mumkin -->
  <!-- viewport yo'q — mobilda kichik ko'rinadi -->
</head>
<body>
  <!-- lang atributi yo'q — screen reader tilni bilmaydi -->
  <h1>Salom dunyo</h1>
</body>
</html>


<!-- ✅ TO'G'RI: to'liq va standartga mos -->
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sahifa</title>
  <meta name="description" content="Sahifa tavsifi">
</head>
<body>
  <header>
    <h1>Salom dunyo</h1>
  </header>
  <main>
    <p>Kontent bu yerda.</p>
  </main>
</body>
</html>`,
    },
  ],

  interviewQA: [
    {
      question: 'DOCTYPE nima va uni tashlab qo\'ysak nima bo\'ladi?',
      answer: '<!DOCTYPE html> — brauzerga hujjat turini bildiruvchi ko\'rsatma. U HTML tegi emas, balki brauzerga "HTML5 standartlarida renderla" degan buyruq. Agar DOCTYPE yozilmasa, brauzer "quirks mode" ga o\'tadi — bu eski IE davridan qolgan rendering rejimi. Quirks mode da CSS box model noto\'g\'ri ishlaydi (width ichiga padding va border kiritiladi), ba\'zi zamonaviy CSS xususiyatlari kutilganidek ishlamaydi. Standards mode da esa W3C standartlariga mos rendering bo\'ladi.',
    },
    {
      question: 'charset="UTF-8" nega kerak?',
      answer: 'charset="UTF-8" brauzerga matnni qanday dekodlash kerakligini aytadi. UTF-8 universal kodlash bo\'lib, dunyo barcha tillaridagi belgilarni qo\'llab-quvvatlaydi — lotin, kirill, arab, xitoy va boshqalar. O\'zbek tilidagi o\', g\' kabi harflar ham to\'g\'ri ko\'rinadi. Agar charset noto\'g\'ri yoki ko\'rsatilmagan bo\'lsa, maxsus belgilar buziladi (krakozjabrlar), ba\'zi hollarda esa UTF-7 orqali XSS hujumlari amalga oshirilishi mumkin. charset meta tegi <head> da birinchi bo\'lishi kerak — title dan ham oldin.',
    },
    {
      question: 'viewport meta tegi nima uchun ishlatiladi?',
      answer: '<meta name="viewport" content="width=device-width, initial-scale=1.0"> — mobil qurilmalarda sahifani to\'g\'ri ko\'rsatish uchun zarur. width=device-width sahifa kengligini qurilma ekrani kengligiga tenglashtiradi, initial-scale=1.0 esa dastlabki zoom darajasini 100% qiladi. Bu teg bo\'lmasa, mobil brauzer sahifani desktop uchun mo\'ljallangan deb hisoblaydi (odatda 980px) va uni kichikroq ko\'rsatadi — foydalanuvchi qo\'lda zoom qilishi kerak bo\'ladi. Bu teg responsive dizaynning asosiy talabi.',
    },
    {
      question: 'HTML va XHTML orasidagi farq nima?',
      answer: 'HTML kechiruvchi parserga ega — teglar yopilmasa ham brauzer xatoni tuzatishga harakat qiladi. Atributlar qo\'shtirnoqsiz, teglar katta harfda bo\'lishi mumkin. XHTML esa XML qoidalariga asoslangan: barcha teglar yopilishi shart (<br />), atributlar albatta qo\'shtirnoqda, teglar faqat kichik harfda, bitta sintaksis xato butun sahifani buzadi. Hozirda HTML5 standarti ishlatiladi, lekin XHTML tartib-qoidalarida yozish (teglarni yopish, kichik harf, qo\'shtirnoq) eng yaxshi amaliyot hisoblanadi — bu kodni toza va izchil saqlaydi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'semantic-html', label: 'Semantik HTML' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'meta-seo', label: 'Meta va SEO' },
  ],
}
