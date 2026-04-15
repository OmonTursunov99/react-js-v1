import type { Topic } from '../../../types'

export const textLists: Topic = {
  id: 'text-lists',
  title: 'Matn va Ro\'yxatlar',
  importance: 2,
  status: 'to-learn',
  description: 'h1-h6, p, ul/ol/dl, blockquote, pre, code, inline elementlar',
  content: `Matn va ro'yxat elementlari — HTML kontentning asosi. To'g'ri teg tanlash SEO, accessibility va kodni o'qilishi uchun juda muhim.

═══════════════════════════════════════
  HEADING HIERARCHY (h1-h6)
═══════════════════════════════════════

Sarlavhalar ierarxiyasi — sahifa tuzilmasini belgilaydi:

  <h1> — sahifaning ASOSIY sarlavhasi (eng muhim)
  <h2> — bo'lim sarlavhasi
  <h3> — kichik bo'lim
  <h4>-<h6> — chuqurroq darajalar

Muhim qoidalar:
  1. h1 sahifada BITTA bo'lishi kerak (yoki har bir <section>/<article> da bitta)
  2. Darajalarni TASHLAB o'tish mumkin EMAS: h1 → h3 (h2 ni tashlab ketish)
  3. Sarlavha — tuzilma uchun, matn kattaligi uchun EMAS (buning uchun CSS bor)
  4. Screen readerlar sarlavhalar bo'yicha navigatsiya qiladi
  5. Google sarlavhalar orqali sahifa tuzilmasini tushunadi

═══════════════════════════════════════
  PARAGRAF VA LINE BREAK
═══════════════════════════════════════

<p> — paragraf (matn bloki). Brauzer avtomatik yuqori-pastdan margin qo'shadi.

<br> — majburiy qator uzilishi (line break).
  LEKIN: odatda oraliq uchun <br> ishlatish NOTO'G'RI.
  CSS margin yoki padding ishlatish kerak.

  NOTO'G'RI:  <p>Birinchi qator<br><br><br>Ikkinchi qator</p>
  TO'G'RI:    <p style="margin-bottom: 2rem">Birinchi qator</p>
              <p>Ikkinchi qator</p>

<br> qachon to'g'ri: she'r, manzil, formulalar — mantiqiy qator uzilishi kerak bo'lganda.

═══════════════════════════════════════
  RO'YXATLAR: ul, ol, dl
═══════════════════════════════════════

<ul> — tartibsiz ro'yxat (nuqtali: •)
  Qachon: elementlar tartibi muhim bo'lmagan holda
  Masalan: xususiyatlar ro'yxati, menyu bandlari

<ol> — tartibli ro'yxat (raqamli: 1, 2, 3...)
  Qachon: tartib muhim — qadamlar, reyting, ko'rsatmalar
  Atributlari:
    start="5"    — boshqa raqamdan boshlash
    reversed     — teskari sanash (5, 4, 3...)
    type="a"     — harfli (a, b, c) yoki type="I" (rim raqamlari)

<dl> — ta'rif ro'yxati (description list)
  <dt> — atama (term)
  <dd> — ta'rif (definition)
  Qachon: lug'at, FAQ, metadata (kalit-qiymat juftliklari)

Nested lists — ro'yxat ichida ro'yxat. <li> ichiga yangi <ul> yoki <ol> joylashtiriladi.

═══════════════════════════════════════
  BLOCKQUOTE VA CITE
═══════════════════════════════════════

<blockquote> — boshqa manbadan olingan iqtibos (blok darajasida).
  cite atributi — manba URL si.
<cite> — asar yoki manba nomi (inline element).
<q> — qisqa inline iqtibos (brauzer qo'shtirnoq qo'shadi).

═══════════════════════════════════════
  PRE VA CODE — KOD KO'RSATISH
═══════════════════════════════════════

<pre> — oldindan formatlangan matn (preformatted).
  Bo'sh joylar va qator uzilishlari SAQLANADI.
  Brauzer odatda monospace shrift ishlatadi.

<code> — inline kod (bir qator yoki so'z).

Odatda birgalikda ishlatiladi: <pre><code>...</code></pre> — kod bloki.

═══════════════════════════════════════
  INLINE ELEMENTLAR — SEMANTIK FARQLAR
═══════════════════════════════════════

strong vs b:
  <strong> — MUHIM matn (semantik: screen reader urg'u beradi)
  <b>      — faqat vizual qalin (semantik ma'nosi yo'q)

em vs i:
  <em> — ta'kidlangan matn (semantik: screen reader ohangni o'zgartiradi)
  <i>  — faqat vizual kursiv (texnik atama, boshqa tildagi so'z)

Boshqa muhim inline elementlar:
  <mark>   — belgilangan (highlighted) matn (sariq fon)
  <small>  — kichik shrift (huquqiy eslatma, copyright)
  <sub>    — pastki indeks: H₂O → H<sub>2</sub>O
  <sup>    — yuqori indeks: x² → x<sup>2</sup>
  <abbr>   — qisqartma: <abbr title="Hypertext Markup Language">HTML</abbr>
  <time>   — vaqt/sana: <time datetime="2026-04-15">15 Aprel</time>
  <del>    — o'chirilgan matn (ustidan chizilgan)
  <ins>    — qo'shilgan matn (tagidan chizilgan)

═══════════════════════════════════════
  WHITESPACE HANDLING
═══════════════════════════════════════

HTML da bo'sh joylar qoidasi:
  1. Ketma-ket bo'sh joylar BITTA bo'sh joyga aylanadi
  2. Qator uzilishlar (Enter) bo'sh joyga aylanadi
  3. Bosh va oxiridagi bo'sh joylar olib tashlanadi

Istisno: <pre> ichida barcha bo'sh joylar saqlanadi.
CSS bilan boshqarish: white-space: pre | pre-wrap | nowrap`.trim(),

  codeExamples: [
    {
      title: 'Heading hierarchy + paragraflar + inline elementlar',
      language: 'html',
      description: 'Sarlavhalar ierarxiyasi va semantik inline teglar namunasi',
      code: `<article>
  <!-- h1 — sahifada bitta asosiy sarlavha -->
  <h1>HTML Matn Elementlari</h1>

  <section>
    <!-- h2 — bo'lim sarlavhasi (h1 dan keyin h2, h3 ni tashlab o'tmaymiz) -->
    <h2>Sarlavhalar haqida</h2>
    <p>
      Sarlavhalar sahifa <strong>tuzilmasini</strong> belgilaydi.
      <em>Screen readerlar</em> sarlavhalar bo'yicha navigatsiya qiladi.
    </p>

    <h3>Qoidalar</h3>
    <p>
      <mark>h1 sahifada bitta</mark> bo'lishi kerak.
      <abbr title="Search Engine Optimization">SEO</abbr> uchun bu juda muhim.
    </p>
  </section>

  <section>
    <h2>Inline elementlar</h2>
    <p>
      <!-- strong = muhim, b = faqat qalin -->
      <strong>Muhim</strong> matn va <b>qalin</b> matn farqi bor.
    </p>
    <p>
      <!-- em = ta'kidlangan, i = faqat kursiv -->
      <em>Ta'kidlangan</em> matn va <i>texnik atama</i> farqi bor.
    </p>
    <p>
      Kimyoviy formula: H<sub>2</sub>O<br>
      Matematik ifoda: x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>
    </p>
    <p>
      <small>&copy; 2026 Barcha huquqlar himoyalangan</small>
    </p>
    <p>
      Nashr sanasi: <time datetime="2026-04-15">15 Aprel, 2026</time>
    </p>
  </section>
</article>`,
    },
    {
      title: 'Barcha ro\'yxat turlari: ul, ol, dl',
      language: 'html',
      description: 'Tartibsiz, tartibli va ta\'rif ro\'yxatlari — barcha atributlar bilan',
      code: `<!-- 1. Tartibsiz ro'yxat (ul) — tartib muhim emas -->
<h3>Frontend texnologiyalari</h3>
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript
    <!-- Nested list — ro'yxat ichida ro'yxat -->
    <ul>
      <li>React</li>
      <li>Vue</li>
      <li>Angular</li>
    </ul>
  </li>
</ul>

<!-- 2. Tartibli ro'yxat (ol) — tartib muhim -->
<h3>Loyiha yaratish qadamlari</h3>
<ol>
  <li>npm init</li>
  <li>Dependencylarni o'rnatish</li>
  <li>Loyiha tuzilmasini yaratish</li>
  <li>Kodni yozish</li>
</ol>

<!-- ol maxsus atributlari -->
<h3>Top 3 framework (teskari tartibda)</h3>
<ol reversed start="3">
  <li>Angular</li>    <!-- 3 -->
  <li>Vue</li>        <!-- 2 -->
  <li>React</li>      <!-- 1 -->
</ol>

<!-- Harfli ro'yxat -->
<h3>Javob variantlari</h3>
<ol type="a">
  <li>HTML — dasturlash tili</li>
  <li>HTML — belgilash tili</li>  <!-- to'g'ri -->
  <li>HTML — framework</li>
</ol>

<!-- 3. Ta'rif ro'yxati (dl) — kalit-qiymat juftliklari -->
<h3>HTML atamalari</h3>
<dl>
  <dt>DOCTYPE</dt>
  <dd>Brauzerga hujjat turini bildiruvchi ko'rsatma</dd>

  <dt>Semantik teg</dt>
  <dd>Ma'noli HTML tegi (masalan: header, nav, main)</dd>

  <dt>Atribut</dt>
  <dd>HTML tegiga qo'shimcha ma'lumot beruvchi xususiyat</dd>
</dl>`,
    },
    {
      title: 'blockquote, pre/code, abbr, time, mark',
      language: 'html',
      description: 'Semantik inline va blok elementlar — amaliy misollar',
      code: `<!-- blockquote — boshqa manbadan iqtibos -->
<blockquote cite="https://developer.mozilla.org">
  <p>
    HTML (HyperText Markup Language) — veb-kontentning
    tuzilmasi va ma'nosini belgilaydigan til.
  </p>
  <footer>
    — <cite>MDN Web Docs</cite>
  </footer>
</blockquote>

<!-- q — qisqa inline iqtibos (brauzer qo'shtirnoq qo'shadi) -->
<p>Tim Berners-Lee aytganidek, <q>Web hammaga ochiq bo'lishi kerak</q>.</p>

<!-- pre + code — kod bloki (bo'sh joylar saqlanadi) -->
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="uz"&gt;
  &lt;head&gt;
    &lt;title&gt;Salom&lt;/title&gt;
  &lt;/head&gt;
&lt;/html&gt;</code></pre>

<!-- Inline code — matn ichida kod -->
<p>
  Elementni tanlash uchun <code>document.querySelector()</code> ishlatiladi.
</p>

<!-- abbr — qisqartma (hover qilganda to'liq nomi ko'rinadi) -->
<p>
  <abbr title="HyperText Markup Language">HTML</abbr> va
  <abbr title="Cascading Style Sheets">CSS</abbr> —
  veb-sahifalar asosi.
</p>

<!-- time — mashina o'qiy oladigan sana/vaqt -->
<p>
  Maqola <time datetime="2026-04-15T10:30:00">15 Aprel, soat 10:30 da</time>
  nashr etildi.
</p>

<!-- mark — belgilangan matn (qidiruv natijasi, muhim qism) -->
<p>
  JavaScript da <mark>closure</mark> — eng muhim tushunchalardan biri.
</p>

<!-- del + ins — o'zgarishlar ko'rsatish -->
<p>
  Narxi: <del>100 000 so'm</del> <ins>79 000 so'm</ins>
</p>`,
    },
  ],

  interviewQA: [
    {
      question: '<strong> va <b> farqi nima? <em> va <i> chi?',
      answer: '<strong> va <b> ikkalasi ham matnni qalin ko\'rsatadi, lekin semantik farqi bor. <strong> — "bu matn MUHIM" degan ma\'noni beradi, screen readerlar uni urg\'u bilan o\'qiydi. <b> esa faqat vizual qalin qiladi, hech qanday semantik ma\'no bermaydi. Xuddi shunday, <em> matnni ta\'kidlaydi (screen reader ohangni o\'zgartiradi), <i> esa faqat kursiv qiladi (texnik atamalar, boshqa tildagi so\'zlar uchun). Accessibility va SEO uchun <strong> va <em> ishlatish to\'g\'ri.',
    },
    {
      question: 'Sahifada h1 nechta bo\'lishi kerak va nega?',
      answer: 'An\'anaviy qoida bo\'yicha sahifada h1 BITTA bo\'lishi kerak — bu sahifaning asosiy mavzusini bildiradi. Google va screen readerlar h1 ni sahifaning eng muhim sarlavhasi deb tushunadi. HTML5 spetsifikatsiyasi har bir <section> yoki <article> ichida alohida h1 ishlatishga ruxsat beradi (document outline algorithm), lekin amalda brauzerlar bu algoritmni to\'liq qo\'llab-quvvatlamaydi. Shuning uchun eng yaxshi amaliyot: sahifada bitta h1, bo\'limlar uchun h2-h6 ishlatish va darajalarni tashlab o\'tmaslik (h1 → h3 — noto\'g\'ri, h1 → h2 → h3 — to\'g\'ri).',
    },
    {
      question: '<dl> (description list) nima va qachon ishlatiladi?',
      answer: '<dl> — ta\'rif ro\'yxati, <dt> (term/atama) va <dd> (definition/ta\'rif) juftliklaridan tuziladi. Kalit-qiymat juftliklari uchun ishlatiladi: lug\'at (atama + ta\'rif), FAQ (savol + javob), metadata (xususiyat + qiymat), glossariy. Masalan, mahsulot xususiyatlari: <dt>Rang</dt><dd>Qora</dd>. <ul>/<ol> dan farqi — <dl> mantiqiy bog\'langan juftliklar uchun mo\'ljallangan. Screen readerlar ham <dl> ni maxsus tarzda e\'lon qiladi.',
    },
    {
      question: '<br> tegi va CSS margin/padding farqi nima? <br> qachon ishlatish to\'g\'ri?',
      answer: '<br> — majburiy qator uzilishi (line break), CSS margin/padding — elementlar orasidagi masofa. <br> ni faqat kontent ichidagi mantiqiy qator uzilishi uchun ishlatish kerak: she\'r (har bir satr alohida), pochta manzili, formulalar. <br> ni paragraflar orasiga oraliq yaratish uchun ishlatish NOTO\'G\'RI: <br><br><br> o\'rniga CSS margin-bottom ishlatish kerak. Sababi: <br> — kontent tuzilmasi (semantik), margin/padding — vizual ko\'rinish (styling). Ularni aralashtirish kodni boshqarish va responsive dizaynni qiyinlashtiradi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'semantic-html', label: 'Semantik HTML' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
  ],
}
