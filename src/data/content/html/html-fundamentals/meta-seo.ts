import type { Topic } from '../../../types'

export const metaSeo: Topic = {
  id: 'meta-seo',
  title: 'Meta teglar va SEO',
  importance: 2,
  status: 'to-learn',
  description: 'Meta teglar, Open Graph, structured data va SEO asoslari',
  content: `Meta teglar — HTML <head> ichida joylashib, sahifa haqida brauzer, qidiruv tizimlari va ijtimoiy tarmoqlarga ma'lumot beradi. SEO (Search Engine Optimization) — saytni qidiruv natijalarida yuqori ko'rsatish texnikasi.

═══════════════════════════════════════
  ASOSIY META TEGLAR
═══════════════════════════════════════

<meta charset="UTF-8">
  — sahifa kodlash formati (har doim birinchi bo'lsin)

<meta name="viewport" content="width=device-width, initial-scale=1.0">
  — mobil qurilmalar uchun MAJBURIY

<meta name="description" content="Sahifa tavsifi">
  — qidiruv natijasida ko'rsatiladi (150-160 belgi)

<meta name="robots" content="index, follow">
  — qidiruv botlari uchun ko'rsatma

<meta name="author" content="Muallif ismi">

<title>Sahifa sarlavhasi</title>
  — brauzer tab va qidiruv natijasida ko'rinadi

═══════════════════════════════════════
  OPEN GRAPH (OG) TEGLAR
═══════════════════════════════════════

Ijtimoiy tarmoqlarda sahifa ulashilganda ko'rinadigan ma'lumot:

<meta property="og:title" content="Sarlavha">
<meta property="og:description" content="Tavsif">
<meta property="og:image" content="https://sayt.uz/rasm.jpg">
<meta property="og:url" content="https://sayt.uz/sahifa">
<meta property="og:type" content="website">

Twitter uchun maxsus:
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Sarlavha">

═══════════════════════════════════════
  SEO ASOSLARI
═══════════════════════════════════════

1. Sarlavha ierarxiyasi:
   - <h1> sahifada faqat BIR MARTA (asosiy mavzu)
   - <h2> bo'limlar, <h3> kichik bo'limlar
   - Tartibni buzmang: h1 → h3 NOTO'G'RI

2. Semantik HTML — Google semantik teglarni tushunadi
3. Alt atributlari — rasmlar uchun
4. URL tuzilmasi — tushunilishi oson bo'lsin
5. Mobile-friendly — responsive dizayn
6. Tezlik — Core Web Vitals

═══════════════════════════════════════
  STRUCTURED DATA (Schema.org)
═══════════════════════════════════════

JSON-LD formatida qo'shimcha ma'lumot berish.
Google qidiruv natijalarida rich snippets ko'rsatadi:
  - Reyting yulduzlari
  - Narx
  - FAQ
  - Breadcrumb navigatsiya

═══════════════════════════════════════
  CANONICAL VA BOSHQA LINK TEGLAR
═══════════════════════════════════════

<link rel="canonical" href="https://sayt.uz/sahifa">
  — dublikat sahifalarning asosiy versiyasi

<link rel="icon" href="/favicon.ico">
  — brauzer tab ikonka

<link rel="preconnect" href="https://fonts.googleapis.com">
  — tezlik uchun oldindan ulanish`,

  codeExamples: [
    {
      title: 'To\'liq <head> namunasi',
      language: 'html',
      description: 'SEO va ijtimoiy tarmoqlar uchun optimal head tuzilmasi',
      code: `<!DOCTYPE html>
<html lang="uz">
<head>
  <!-- Asosiy meta teglar -->
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <title>React o'rganish | Ketmonjon platformasi</title>
  <meta name="description"
        content="React, TypeScript va zamonaviy frontend texnologiyalarini o'rganing. 90+ mavzu, kod misollari va intervyu savollari.">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:title" content="React o'rganish">
  <meta property="og:description"
        content="Frontend suxbatiga tayyorgarlik platformasi">
  <meta property="og:image"
        content="https://ketmonjon.uz/og-image.jpg">
  <meta property="og:url"
        content="https://ketmonjon.uz">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="uz_UZ">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="React o'rganish">

  <!-- Canonical va favicon -->
  <link rel="canonical" href="https://ketmonjon.uz">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">

  <!-- Performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://api.ketmonjon.uz">
</head>
</html>`,
    },
    {
      title: 'Structured Data — JSON-LD',
      language: 'html',
      description: 'Schema.org bilan FAQ rich snippet',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "React nima?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "React — Facebook tomonidan yaratilgan JavaScript kutubxonasi bo'lib, foydalanuvchi interfeyslarini yaratish uchun ishlatiladi."
      }
    },
    {
      "@type": "Question",
      "name": "Virtual DOM nima?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Virtual DOM — haqiqiy DOM ning JavaScript dagi yengil nusxasi. React avval Virtual DOM ni yangilaydi, keyin farqlarni haqiqiy DOM ga qo'llaydi."
      }
    }
  ]
}
</script>`,
    },
  ],

  interviewQA: [
    {
      question: 'SEO uchun eng muhim HTML elementlari qaysilar?',
      answer: '1) <title> — qidiruv natijasining sarlavhasi, 60 belgigacha. 2) <meta name="description"> — tavsif, 150-160 belgi. 3) Sarlavha ierarxiyasi h1→h6 — sahifa tuzilmasi. 4) Semantik HTML — header, main, article. 5) Alt atributlari — rasmlar uchun. 6) Canonical URL — dublikat oldini olish. 7) Structured data — rich snippets uchun.',
    },
    {
      question: 'Open Graph teglar nima uchun kerak?',
      answer: 'Open Graph teglar — sahifa ijtimoiy tarmoqlarda (Facebook, LinkedIn, Telegram) ulashilganda ko\'rinadigan sarlavha, tavsif va rasmni boshqaradi. og:title, og:description, og:image, og:url asosiy teglar. Bu bo\'lmasa, ijtimoiy tarmoq o\'zi avtomatik tanlab oladi va natija yomon ko\'rinishi mumkin.',
    },
    {
      question: 'Canonical URL nima va nima uchun kerak?',
      answer: 'Canonical URL — dublikat sahifalarning "asosiy" versiyasini ko\'rsatadi. Masalan, sayt.uz/sahifa va sayt.uz/sahifa?ref=google bitta sahifa, lekin Google ularni ikki sahifa deb o\'ylashi mumkin. <link rel="canonical" href="sayt.uz/sahifa"> bilan asosiy versiyani belgilasangiz, SEO kuchi bir sahifaga to\'planadi.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'semantic-html', label: 'Semantik HTML' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'accessibility', label: 'Accessibility' },
  ],
}
