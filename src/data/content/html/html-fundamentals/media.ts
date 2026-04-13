import type { Topic } from '../../../types'

export const media: Topic = {
  id: 'media',
  title: 'Media elementlari',
  importance: 2,
  status: 'to-learn',
  description: 'img, video, audio, picture, srcset va lazy loading',
  content: `HTML5 da turli media kontentni sahifaga joylashtirish uchun maxsus teglar mavjud: rasmlar, video, audio va ularning adaptive variantlari.

═══════════════════════════════════════
  RASMLAR — <img>
═══════════════════════════════════════

<img> — eng ko'p ishlatiladigan media teg.
Asosiy atributlari:
  src     — rasm manzili (URL yoki path)
  alt     — muqobil matn (accessibility uchun MAJBURIY)
  width   — kenglik
  height  — balandlik (CLS oldini olish uchun DOIM ko'rsating)
  loading — "lazy" yoki "eager" (lazy loading)
  decoding — "async" yoki "sync"

ALT atributi nima uchun muhim:
  1. Rasm yuklanmasa — alt matni ko'rsatiladi
  2. Screen readerlar alt matnini o'qiydi
  3. SEO — qidiruv tizimlari alt ni indekslaydi

═══════════════════════════════════════
  RESPONSIVE RASMLAR
═══════════════════════════════════════

srcset — turli o'lchamdagi rasmlarni taklif qilish:
  <img srcset="kichik.jpg 480w,
               o'rta.jpg 800w,
               katta.jpg 1200w"
       sizes="(max-width: 600px) 480px, 800px"
       src="o'rta.jpg" alt="Rasm">

Brauzer ekran o'lchamiga qarab eng mos rasmni tanlaydi.

<picture> — turli formatlar va media querylar uchun:
  WebP qo'llab-quvvatlanmasa fallback sifatida JPEG berish
  Mobil uchun boshqa rasm (crop), desktop uchun boshqa

═══════════════════════════════════════
  VIDEO — <video>
═══════════════════════════════════════

<video> atributlari:
  src       — video fayl manzili
  controls  — o'ynatish paneli ko'rsatish
  autoplay  — avtomatik o'ynatish (muted kerak)
  muted     — tovushsiz
  loop      — takrorlash
  poster    — oldindan ko'rish rasmi
  preload   — "auto" | "metadata" | "none"

<source> bilan bir nechta format berish mumkin.

═══════════════════════════════════════
  AUDIO — <audio>
═══════════════════════════════════════

<audio> — video ga o'xshash, lekin faqat ovoz.
  controls — boshqaruv paneli
  Bir nechta format: MP3, OGG, WAV

═══════════════════════════════════════
  LAZY LOADING
═══════════════════════════════════════

loading="lazy" — rasm/iframe ekranga yaqinlashganda yuklanadi.
  Afzalliklari:
  - Sahifa tezroq yuklanadi
  - Trafik tejaladi
  - Core Web Vitals yaxshilanadi

  MUHIM: "Above the fold" (birinchi ekranda ko'rinadigan)
  rasmlarga loading="lazy" QOYMANG — LCP yomonlashadi.`,

  codeExamples: [
    {
      title: 'Responsive rasm — picture va srcset',
      language: 'html',
      description: 'Turli ekran o\'lchamlari va formatlar uchun optimallashtirilgan rasmlar',
      code: `<!-- srcset bilan responsive rasm -->
<img
  srcset="photo-small.jpg 480w,
          photo-medium.jpg 800w,
          photo-large.jpg 1200w"
  sizes="(max-width: 600px) 480px,
         (max-width: 1000px) 800px,
         1200px"
  src="photo-medium.jpg"
  alt="Tabiat manzarasi"
  width="800" height="600"
  loading="lazy"
>

<!-- picture bilan format va art direction -->
<picture>
  <!-- WebP formati (zamonaviy brauzerlar) -->
  <source
    type="image/webp"
    srcset="photo.webp"
  >
  <!-- Mobil uchun boshqa crop -->
  <source
    media="(max-width: 600px)"
    srcset="photo-mobile.jpg"
  >
  <!-- Fallback -->
  <img src="photo.jpg" alt="Tabiat" width="800" height="600">
</picture>`,
    },
    {
      title: 'Video va audio',
      language: 'html',
      description: 'Video va audio elementlari bilan ishlash',
      code: `<!-- Video bir nechta format bilan -->
<video
  controls
  width="640"
  height="360"
  poster="preview.jpg"
  preload="metadata"
>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  <!-- Subtitr -->
  <track
    kind="subtitles"
    src="subtitles-uz.vtt"
    srclang="uz"
    label="O'zbekcha"
    default
  >
  Brauzeringiz video ni qo'llab-quvvatlamaydi.
</video>

<!-- Audio -->
<audio controls preload="metadata">
  <source src="music.mp3" type="audio/mpeg">
  <source src="music.ogg" type="audio/ogg">
  Brauzeringiz audio ni qo'llab-quvvatlamaydi.
</audio>`,
    },
    {
      title: 'Lazy loading va figure',
      language: 'html',
      description: 'Lazy loading va figure/figcaption bilan semantik rasm',
      code: `<!-- Lazy loading — pastdagi rasmlar uchun -->
<figure>
  <img
    src="chart.png"
    alt="2026-yil sotuvlar grafigi"
    width="600"
    height="400"
    loading="lazy"
    decoding="async"
  >
  <figcaption>
    1-rasm: 2026-yil birinchi chorak sotuvlari
  </figcaption>
</figure>

<!-- Birinchi ekrandagi rasm — lazy QOYMANG -->
<img
  src="hero-banner.jpg"
  alt="Bosh sahifa banneri"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
>`,
    },
  ],

  interviewQA: [
    {
      question: 'srcset va sizes atributlari nima qiladi?',
      answer: 'srcset — brauzerga turli o\'lchamdagi rasm variantlarini taklif qiladi (masalan, 480w, 800w, 1200w). sizes — brauzerga qaysi ekran o\'lchamida qanday kenglikdagi rasm kerakligini aytadi. Brauzer ekran o\'lchami, piksel zichligi (DPR) va tarmoq tezligiga qarab eng mos rasmni avtomatik tanlaydi. Bu trafik tejaydi va sahifa tezligini oshiradi.',
    },
    {
      question: 'img da alt atributi nima uchun muhim?',
      answer: 'alt atributi 3 ta sababga muhim: 1) Accessibility — screen readerlar alt matnini ko\'r foydalanuvchilarga o\'qib beradi. 2) Rasm yuklanmasa — alt matni ko\'rsatiladi. 3) SEO — qidiruv tizimlari rasm mazmunini alt orqali tushunadi. Dekorativ rasmlar uchun bo\'sh alt="" qo\'yiladi (screen reader o\'tkazib yuboradi).',
    },
    {
      question: '<picture> va srcset farqi nima?',
      answer: '<picture> — to\'liq boshqaruv beradi: turli formatlar (WebP, AVIF), media querylar, art direction (mobilda boshqa crop). Brauzer birinchi mos <source> ni tanlaydi. srcset — faqat o\'lcham bo\'yicha variant beradi, brauzer o\'zi tanlaydi. Qisqa qilib: srcset — o\'lcham bo\'yicha optimallashtirish, picture — format va dizayn bo\'yicha boshqarish.',
    },
  ],

  relatedTopics: [
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'meta-seo', label: 'Meta va SEO' },
    { techId: 'css', sectionId: 'css-layout', topicId: 'responsive', label: 'Responsive dizayn' },
  ],
}
