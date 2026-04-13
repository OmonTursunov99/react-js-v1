import type { Topic } from '../../../types'

export const xmlSyntax: Topic = {
  id: 'xml-syntax',
  title: 'XML Sintaksisi',
  importance: 2,
  status: 'to-learn',
  description: 'XML deklaratsiyasi, elementlar, atributlar va nomlar fazosi',
  content: `XML (eXtensible Markup Language) — ma'lumotlarni tuzilmali saqlash va uzatish uchun belgilash tili. HTML dan farqli o'laroq, XML da teglarni O'ZI yaratish mumkin — bu "kengaytiriladigan" degan ma'noni beradi.

═══════════════════════════════════════
  XML DEKLARATSIYASI
═══════════════════════════════════════

Har bir XML hujjat deklaratsiya bilan boshlanadi:
  <?xml version="1.0" encoding="UTF-8"?>

Atributlari:
  version  — XML versiyasi (1.0 yoki 1.1)
  encoding — kodlash (UTF-8, ISO-8859-1)
  standalone — tashqi DTD kerakmi (yes/no)

═══════════════════════════════════════
  ELEMENTLAR
═══════════════════════════════════════

Element — XML ning asosiy tarkibiy qismi:
  <teg>qiymat</teg>         — ochuvchi va yopuvchi teg
  <teg />                   — bo'sh element (self-closing)

Qoidalar:
  1. Har bir ochuvchi tegning yopuvchi tegi BO'LISHI KERAK
  2. Teglar KATTA-KICHIK HARFGA SEZGIR: <Ism> != <ism>
  3. Elementlar to'g'ri joylashtirilishi kerak (proper nesting)
  4. FAQAT BITTA root element bo'lishi kerak
  5. Teg nomi raqam bilan boshlanmasin

═══════════════════════════════════════
  ATRIBUTLAR
═══════════════════════════════════════

Elementlarga qo'shimcha ma'lumot berish:
  <kitob isbn="978-3-16-148410-0">...</kitob>

Qoidalar:
  - Atribut qiymati DOIM qo'shtirnoq ichida
  - Bitta elementda takroriy atribut BO'LMASIN
  - Atribut nomi raqam bilan boshlanmasin

Atribut yoki element? Umumiy qoida:
  - Oddiy, qisqa qiymat → atribut
  - Murakkab, ichki tuzilmali ma'lumot → element

═══════════════════════════════════════
  NOMLAR FAZOSI (NAMESPACE)
═══════════════════════════════════════

Turli manbalardan kelgan element nomlari to'qnashmasligi uchun:
  xmlns — namespace deklaratsiyasi
  prefix:element — prefiks bilan foydalanish

  <root xmlns:lib="http://kutubxona.uz"
        xmlns:mag="http://magazin.uz">
    <lib:kitob>Oltin baliq</lib:kitob>
    <mag:kitob>Elektronika</mag:kitob>
  </root>

Bu yerda lib:kitob va mag:kitob turli narsa — to'qnashmaydi.

═══════════════════════════════════════
  MAXSUS BELGILAR
═══════════════════════════════════════

XML da 5 ta maxsus belgi entity sifatida yoziladi:
  &lt;    → <
  &gt;    → >
  &amp;   → &
  &quot;  → "
  &apos;  → '

CDATA bo'limi — maxsus belgilarni qochirmasdan yozish:
  <![CDATA[ bu yerda <teglar> & belgilar xavfsiz ]]>

═══════════════════════════════════════
  IZOHLAR VA PI
═══════════════════════════════════════

Izoh: <!-- bu izoh -->
Processing Instruction: <?target data?>`,

  codeExamples: [
    {
      title: 'XML hujjat namunasi',
      language: 'xml',
      description: 'To\'liq XML hujjat tuzilmasi',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Kutubxona ma'lumotlari -->
<kutubxona>
  <kitob isbn="978-3-16-148410-0" til="uz">
    <sarlavha>Oltin baliq ertagi</sarlavha>
    <muallif>Xalq og'zaki ijodi</muallif>
    <yil>2020</yil>
    <narx valyuta="UZS">45000</narx>
    <janr>Ertak</janr>
  </kitob>

  <kitob isbn="978-0-13-468599-1" til="en">
    <sarlavha>Clean Code</sarlavha>
    <muallif>Robert C. Martin</muallif>
    <yil>2008</yil>
    <narx valyuta="USD">35</narx>
    <janr>Dasturlash</janr>
  </kitob>

  <!-- Bo'sh element -->
  <kitob isbn="978-0-00-000000-0" holat="kutilmoqda" />
</kutubxona>`,
    },
    {
      title: 'Namespace ishlatish',
      language: 'xml',
      description: 'Turli nomlar fazosi bilan element ajratish',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<buyurtma
  xmlns:mijoz="http://misol.uz/mijoz"
  xmlns:mahsulot="http://misol.uz/mahsulot"
>
  <mijoz:malumot>
    <mijoz:ism>Ali Valiyev</mijoz:ism>
    <mijoz:telefon>+998901234567</mijoz:telefon>
    <mijoz:manzil>
      <mijoz:shahar>Toshkent</mijoz:shahar>
      <mijoz:kocha>Amir Temur ko'chasi, 15</mijoz:kocha>
    </mijoz:manzil>
  </mijoz:malumot>

  <mahsulot:royxat>
    <mahsulot:element id="1">
      <mahsulot:nomi>Noutbuk</mahsulot:nomi>
      <mahsulot:soni>2</mahsulot:soni>
      <mahsulot:narxi>5000000</mahsulot:narxi>
    </mahsulot:element>
  </mahsulot:royxat>
</buyurtma>`,
    },
    {
      title: 'CDATA va maxsus belgilar',
      language: 'xml',
      description: 'Maxsus belgilarni xavfsiz yozish usullari',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<darslar>
  <!-- Entity bilan maxsus belgilar -->
  <dars>
    <sarlavha>HTML &amp; CSS asoslari</sarlavha>
    <tavsif>5 &lt; x &lt; 10 sharti</tavsif>
  </dars>

  <!-- CDATA bilan kod saqlash -->
  <dars>
    <sarlavha>JavaScript misol</sarlavha>
    <kod><![CDATA[
      function compare(a, b) {
        if (a < b && b > 0) {
          return a & b;
        }
        return "<natija yo'q>";
      }
    ]]></kod>
  </dars>
</darslar>`,
    },
  ],

  interviewQA: [
    {
      question: 'XML va HTML orasidagi asosiy farqlar nima?',
      answer: 'Asosiy farqlar: 1) XML da teglar o\'zi yaratiladi, HTML da faqat belgilangan teglar. 2) XML QATTIQ sintaksis — har bir teg yopilishi kerak, HTML ba\'zi teglarni yopmasa ham ishlaydi. 3) XML katta-kichik harfga sezgir, HTML emas. 4) XML — ma\'lumot saqlash/uzatish, HTML — ko\'rsatish uchun. 5) XML faqat bitta root element talab qiladi.',
    },
    {
      question: 'XML namespace nima uchun kerak?',
      answer: 'Namespace — turli manbalardan kelgan element nomlari to\'qnashmasligini ta\'minlaydi. Masalan, <kitob> kutubxona kontekstida va <kitob> do\'kon kontekstida turli narsa. xmlns atributi bilan namespace deklaratsiya qilinadi va prefix:element shaklida ishlatiladi. URI sifatida beriladi, lekin bu haqiqiy URL emas — faqat noyob identifikator.',
    },
    {
      question: 'CDATA bo\'limi nima?',
      answer: 'CDATA (Character Data) — XML parser tomonidan tahlil qilinmaydigan matn bloki. <![CDATA[ ... ]]> ichidagi barcha belgilar (<, >, &) oddiy matn sifatida qabul qilinadi, entity ga aylantirilmaydi. Asosan kod parchalari yoki maxsus belgilar ko\'p bo\'lgan matn saqlash uchun ishlatiladi.',
    },
  ],

  relatedTopics: [
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'dtd-schema', label: 'DTD va Schema' },
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xml-vs-json', label: 'XML vs JSON' },
    { techId: 'html', sectionId: 'html-fundamentals', topicId: 'semantic-html', label: 'Semantik HTML' },
  ],
}
