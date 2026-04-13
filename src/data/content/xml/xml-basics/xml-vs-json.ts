import type { Topic } from '../../../types'

export const xmlVsJson: Topic = {
  id: 'xml-vs-json',
  title: 'XML vs JSON',
  importance: 2,
  status: 'to-learn',
  description: 'XML va JSON taqqoslash, qachon qaysinisini ishlatish',
  content: `XML va JSON — ikkalasi ham ma'lumotlarni tuzilmali saqlash va uzatish uchun formatlar. Zamonaviy veb-da JSON ko'proq mashhur, lekin XML hali ham muhim sohalarda keng qo'llaniladi.

═══════════════════════════════════════
  JSON (JavaScript Object Notation)
═══════════════════════════════════════

Oddiy, yengil format:
  {"ism": "Ali", "yosh": 25, "talaba": true}

Ma'lumot turlari:
  string, number, boolean, null, array, object

Afzalliklari:
  + Yengil va ixcham (kamroq belgilar)
  + JavaScript bilan tabiiy ishlaydi
  + Parse qilish tez
  + O'qish oson
  + API larda standart

Kamchiliklari:
  - Izoh (comment) yo'q
  - Namespace yo'q
  - Schema validatsiya zaif (JSON Schema bor, lekin keng tarqalmagan)
  - Faqat matn, raqam, boolean, null, array, object

═══════════════════════════════════════
  XML (eXtensible Markup Language)
═══════════════════════════════════════

Kuchli, kengaytiriladigan format:
  <talaba><ism>Ali</ism><yosh>25</yosh></talaba>

Afzalliklari:
  + Kuchli validatsiya (DTD, XSD)
  + Namespace — nom to'qnashishini oldini oladi
  + Izoh qo'yish mumkin
  + XSLT bilan transformatsiya
  + XPath bilan qidiruv
  + Mixed content (matn + teglar)

Kamchiliklari:
  - Og'ir va ko'p belgilar (verbose)
  - Parse qilish sekinroq
  - Ma'lumot turlari yo'q (hammasi matn)
  - O'qish qiyin

═══════════════════════════════════════
  TAQQOSLASH JADVALI
═══════════════════════════════════════

Mezon          | JSON          | XML
──────────────────────────────────────────
Hajm           | Kichik        | Katta
Tezlik         | Tez           | Sekinroq
O'qilishi      | Oson          | Qiyin
Validatsiya    | Zaif          | Kuchli (XSD)
Namespace      | Yo'q          | Bor
Izoh           | Yo'q          | Bor
Transformatsiya| Yo'q          | XSLT
Ma'lumot turi  | 6 ta          | Faqat matn
Massiv         | Tabiiy        | Qiyin

═══════════════════════════════════════
  QACHON NIMANI ISHLATISH?
═══════════════════════════════════════

JSON ishlatish:
  - REST API lar
  - Veb-ilovalar (frontend ↔ backend)
  - Konfiguratsiya fayllari
  - NoSQL ma'lumotlar bazalari
  - Mobil ilovalar

XML ishlatish:
  - Enterprise integratsiya (SOAP)
  - Hujjat formatlari (DOCX, SVG, XHTML)
  - Konfiguratsiya (Android, Maven, Spring)
  - RSS/Atom feedlar
  - Qattiq validatsiya kerak bo'lganda
  - Davlat va bank tizimlari

═══════════════════════════════════════
  AMALDA
═══════════════════════════════════════

Ko'pchilik zamonaviy API lar JSON qaytaradi.
XML uchun SOAP, RSS va legacy tizimlar qoldi.
Yangi loyiha boshlayotgan bo'lsangiz — JSON tanlang.`,

  codeExamples: [
    {
      title: 'Bir xil ma\'lumot JSON va XML da',
      language: 'json',
      description: 'JSON formati — ixcham va yengil',
      code: `{
  "kutubxona": {
    "kitoblar": [
      {
        "isbn": "978-3-16-148410-0",
        "til": "uz",
        "sarlavha": "Oltin baliq",
        "muallif": "Xalq og'zaki ijodi",
        "yil": 2020,
        "narx": {
          "qiymat": 45000,
          "valyuta": "UZS"
        },
        "mavjud": true
      },
      {
        "isbn": "978-0-13-468599-1",
        "til": "en",
        "sarlavha": "Clean Code",
        "muallif": "Robert C. Martin",
        "yil": 2008,
        "narx": {
          "qiymat": 35,
          "valyuta": "USD"
        },
        "mavjud": true
      }
    ]
  }
}`,
    },
    {
      title: 'Xuddi shu ma\'lumot XML da',
      language: 'xml',
      description: 'XML formati — batafsil va qattiq tuzilmali',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<kutubxona>
  <kitoblar>
    <kitob isbn="978-3-16-148410-0" til="uz">
      <sarlavha>Oltin baliq</sarlavha>
      <muallif>Xalq og'zaki ijodi</muallif>
      <yil>2020</yil>
      <narx valyuta="UZS">45000</narx>
      <mavjud>true</mavjud>
    </kitob>
    <kitob isbn="978-0-13-468599-1" til="en">
      <sarlavha>Clean Code</sarlavha>
      <muallif>Robert C. Martin</muallif>
      <yil>2008</yil>
      <narx valyuta="USD">35</narx>
      <mavjud>true</mavjud>
    </kitob>
  </kitoblar>
</kutubxona>

<!-- JSON: 350 belgi, XML: 550 belgi — XML ~57% katta -->`,
    },
    {
      title: 'JavaScript da JSON va XML parse',
      language: 'js',
      description: 'JSON parse oddiy, XML parse murakkabroq',
      code: `// === JSON parse — ODDIY ===
const jsonStr = '{"ism": "Ali", "yosh": 25}'
const data = JSON.parse(jsonStr)
console.log(data.ism)  // "Ali"
console.log(data.yosh) // 25 (number!)

// JSON yaratish
const json = JSON.stringify({ ism: 'Ali', yosh: 25 })

// === XML parse — MURAKKABROQ ===
const xmlStr = '<talaba><ism>Ali</ism><yosh>25</yosh></talaba>'
const parser = new DOMParser()
const xml = parser.parseFromString(xmlStr, 'text/xml')

const ism = xml.querySelector('ism').textContent
console.log(ism)  // "Ali"

const yosh = xml.querySelector('yosh').textContent
console.log(yosh) // "25" (string! raqam emas)

// XML yaratish
const serializer = new XMLSerializer()
const xmlOutput = serializer.serializeToString(xml)`,
    },
  ],

  interviewQA: [
    {
      question: 'JSON va XML orasidagi asosiy farqlar nima?',
      answer: 'Asosiy farqlar: 1) Hajm — JSON ixchamroq, XML verbose. 2) Ma\'lumot turlari — JSON da number, boolean, null bor, XML da hammasi matn. 3) Massiv — JSON da tabiiy [], XML da qiyin. 4) Validatsiya — XML da kuchli XSD, JSON da zaif. 5) Namespace — XML da bor, JSON da yo\'q. 6) Parse tezligi — JSON tezroq (JSON.parse). 7) Transformatsiya — XML da XSLT, JSON da yo\'q.',
    },
    {
      question: 'Qachon JSON, qachon XML ishlatish kerak?',
      answer: 'JSON — REST API, veb-ilovalar, konfiguratsiya, NoSQL, mobil ilovalar uchun. XML — enterprise integratsiya (SOAP), hujjat formatlari (DOCX, SVG), qattiq validatsiya kerak holatlarda, RSS/Atom, davlat/bank tizimlari. Umumiy qoida: yangi loyihada JSON, mavjud enterprise tizim bilan integratsiyada XML.',
    },
    {
      question: 'JSON Schema va XML Schema farqi nima?',
      answer: 'XML Schema (XSD) — 44+ o\'rnatilgan tur, murakkab tip yaratish, namespace qo\'llab-quvvatlash, meros olish, qattiq validatsiya. JSON Schema — oddiyroq, string/number/boolean/array/object turlari, pattern va enum cheklovlar. XSD ancha kuchli va batafsil, lekin murakkab. JSON Schema yetarli darajada yaxshi, lekin XSD darajasida emas. Zamonaviy API larda ko\'pincha OpenAPI/Swagger (JSON Schema asosida) ishlatiladi.',
    },
  ],

  relatedTopics: [
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xml-syntax', label: 'XML Sintaksisi' },
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'dtd-schema', label: 'DTD va Schema' },
  ],
}
