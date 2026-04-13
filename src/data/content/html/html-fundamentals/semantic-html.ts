import type { Topic } from '../../../types'

export const semanticHtml: Topic = {
  id: 'semantic-html',
  title: 'Semantik HTML',
  importance: 3,
  status: 'to-learn',
  description: 'Semantik teglar: header, main, nav, article, section, aside va ularning ahamiyati',
  content: `Semantik HTML — bu sahifa tuzilmasini ma'noli teglar yordamida ifodalashdir. Brauzer, qidiruv tizimlari va ekran o'quvchilar (screen reader) uchun sahifa mazmunini tushunishni osonlashtiradi.

═══════════════════════════════════════
  NIMA UCHUN SEMANTIKA MUHIM?
═══════════════════════════════════════

1. SEO — Google semantik teglar orqali kontentni yaxshiroq indekslaydi
2. Accessibility — screen readerlar <nav>, <main> kabi teglarni tushunadi
3. O'qilishi oson — boshqa dasturchilar kodni tezroq tushunadi
4. Brauzer optimizatsiyasi — brauzer semantik teglarni maxsus qayta ishlaydi

═══════════════════════════════════════
  ASOSIY SEMANTIK TEGLAR
═══════════════════════════════════════

<header>  — sahifa yoki bo'lim sarlavhasi (logo, navigatsiya)
<nav>     — asosiy navigatsiya havolalari
<main>    — sahifaning asosiy kontenti (faqat BIR MARTA ishlatiladi)
<article> — mustaqil kontent (yangilik, blog post, forum xabar)
<section> — mavzuiy guruh (sarlavha bilan)
<aside>   — yon panel, qo'shimcha ma'lumot
<footer>  — sahifa yoki bo'lim pastki qismi
<figure>  — rasm yoki diagramma + <figcaption>

═══════════════════════════════════════
  SEMANTIK VA NOSEMANTIK FARQI
═══════════════════════════════════════

Nosemantik teglar: <div>, <span> — hech qanday ma'no bermaydi
Semantik teglar: <header>, <nav>, <main> — ma'no va rol beradi

  NOTO'G'RI:
  <div class="header">...</div>
  <div class="navigation">...</div>

  TO'G'RI:
  <header>...</header>
  <nav>...</nav>

═══════════════════════════════════════
  SAHIFA TUZILMASI NAMUNASI
═══════════════════════════════════════

Tipik sahifa tuzilmasi:
  <header>    — sarlavha + logo
    <nav>     — menyu
  <main>      — asosiy kontent
    <article> — maqola
      <section> — bo'lim
    <aside>   — yon panel
  <footer>    — pastki qism

═══════════════════════════════════════
  MUHIM QOIDALAR
═══════════════════════════════════════

1. <main> sahifada faqat BIR MARTA bo'lishi kerak
2. <article> mustaqil bo'lishi kerak — boshqa kontekstsiz tushunilishi lozim
3. <section> har doim sarlavha (<h2>-<h6>) bilan boshlanishi KERAK
4. <nav> faqat ASOSIY navigatsiya uchun — har qanday havola <nav> emas
5. <header> va <footer> bir nechta bo'lishi mumkin (har bir article/section ichida)`,

  codeExamples: [
    {
      title: 'Semantik sahifa tuzilmasi',
      language: 'html',
      description: 'To\'liq semantik HTML sahifa namunasi',
      code: `<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Mening saytim</title>
</head>
<body>
  <header>
    <h1>Sayt nomi</h1>
    <nav>
      <ul>
        <li><a href="/">Bosh sahifa</a></li>
        <li><a href="/about">Biz haqimizda</a></li>
        <li><a href="/contact">Aloqa</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Maqola sarlavhasi</h2>
        <time datetime="2026-04-13">13 Aprel, 2026</time>
      </header>
      <section>
        <h3>Kirish</h3>
        <p>Maqola matni...</p>
      </section>
      <section>
        <h3>Asosiy qism</h3>
        <p>Batafsil ma'lumot...</p>
      </section>
      <footer>
        <p>Muallif: Ali Valiyev</p>
      </footer>
    </article>

    <aside>
      <h3>Ommabop maqolalar</h3>
      <ul>
        <li><a href="/post/1">Birinchi maqola</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Barcha huquqlar himoyalangan</p>
  </footer>
</body>
</html>`,
    },
    {
      title: 'article vs section farqi',
      language: 'html',
      description: 'article mustaqil, section mavzuiy guruh',
      code: `<!-- article — mustaqil kontent -->
<article>
  <h2>React 19 yangiliklari</h2>
  <p>React 19 da yangi hooklar qo'shildi...</p>
</article>

<!-- section — sahifaning mavzuiy bo'limi -->
<section>
  <h2>Xizmatlarimiz</h2>
  <p>Biz quyidagi xizmatlarni taklif qilamiz...</p>
</section>

<!-- figure — rasm + izoh -->
<figure>
  <img src="diagram.png" alt="Arxitektura diagrammasi">
  <figcaption>1-rasm: Ilova arxitekturasi</figcaption>
</figure>`,
    },
    {
      title: 'Noto\'g\'ri va to\'g\'ri yondashuvlar',
      language: 'html',
      description: 'Div-soup vs semantik HTML',
      code: `<!-- NOTO'G'RI: "div soup" -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Bosh sahifa</div>
  </div>
</div>
<div class="main-content">
  <div class="article">
    <div class="article-header">Sarlavha</div>
  </div>
</div>

<!-- TO'G'RI: semantik HTML -->
<header>
  <nav>
    <a href="/">Bosh sahifa</a>
  </nav>
</header>
<main>
  <article>
    <h2>Sarlavha</h2>
  </article>
</main>`,
    },
  ],

  interviewQA: [
    {
      question: 'Semantik HTML nima va nima uchun muhim?',
      answer: 'Semantik HTML — sahifa tuzilmasini ma\'noli teglar bilan ifodalash. <div> o\'rniga <header>, <nav>, <main>, <article> ishlatiladi. Bu SEO ni yaxshilaydi (Google kontentni yaxshiroq tushunadi), accessibility ni oshiradi (screen readerlar navigatsiya qila oladi), kodni o\'qilishi osonlashtiradi va brauzer optimizatsiyalaridan foydalanish imkonini beradi.',
    },
    {
      question: '<article> va <section> orasidagi farq nima?',
      answer: '<article> — mustaqil, o\'z-o\'zidan tushunilishi mumkin bo\'lgan kontent (blog post, yangilik, forum xabar). <section> — sahifaning mavzuiy guruhi, har doim sarlavha bilan boshlanishi kerak. Asosiy farq: article ni boshqa sahifaga olib o\'tish mumkin va u hali ham tushunarli bo\'ladi; section esa sahifa kontekstisiz ma\'nosiz bo\'lishi mumkin.',
    },
    {
      question: '<div> va semantik teglar qachon ishlatiladi?',
      answer: '<div> faqat styling/layout maqsadida ishlatiladi — u hech qanday semantik ma\'no bermaydi. Agar element mazmuniy rol o\'ynasa (navigatsiya, asosiy kontent, maqola) — semantik teg ishlatish kerak. Masalan, grid layout uchun <div>, lekin navigatsiya uchun <nav> ishlatiladi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'meta-seo', label: 'Meta va SEO' },
  ],
}
