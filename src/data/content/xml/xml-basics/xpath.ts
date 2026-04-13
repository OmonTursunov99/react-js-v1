import type { Topic } from '../../../types'

export const xpath: Topic = {
  id: 'xpath',
  title: 'XPath',
  importance: 2,
  status: 'to-learn',
  description: 'XPath ifodalar, o\'qlar (axes) va predikatlar',
  content: `XPath (XML Path Language) — XML hujjatda elementlarni topish va navigatsiya qilish uchun so'rov tili. CSS selektorlarga o'xshash, lekin XML uchun va ancha kuchli.

═══════════════════════════════════════
  ASOSIY YO'L IFODALAR
═══════════════════════════════════════

/kutubxona/kitob        — root dan to'g'ri yo'l
//kitob                 — hujjat ichidagi barcha kitob
/kutubxona/kitob[1]     — birinchi kitob
/kutubxona/kitob[last()] — oxirgi kitob
//kitob/@isbn           — isbn atributi
//kitob/sarlavha/text() — sarlavha matni

Belgilar:
  /   — boladan tanlash (child)
  //  — barcha avlodlardan tanlash (descendant)
  .   — hozirgi tugun (node)
  ..  — ota tugun (parent)
  @   — atribut
  *   — barcha elementlar
  @*  — barcha atributlar

═══════════════════════════════════════
  PREDIKATLAR (FILTRLASH)
═══════════════════════════════════════

Kvadrat qavslar [] ichida shart yoziladi:

  //kitob[@til='uz']           — til="uz" bo'lgan kitoblar
  //kitob[narx > 50000]        — narxi 50000 dan katta
  //kitob[position() <= 3]     — birinchi 3 ta
  //kitob[contains(sarlavha, 'React')]  — sarlavhasida React bor
  //kitob[starts-with(@isbn, '978')]    — isbn 978 bilan boshlanadi
  //kitob[not(@til)]           — til atributi yo'q kitoblar

═══════════════════════════════════════
  O'QLAR (AXES)
═══════════════════════════════════════

XPath da tugun atrofidagi turli yo'nalishlarda qidirish:

  child::       — bolalar (sukut bo'yicha)
  parent::      — ota
  ancestor::    — barcha ajdodlar
  descendant::  — barcha avlodlar
  self::        — o'zi
  following::   — keyingi barcha tugunlar
  preceding::   — oldingi barcha tugunlar
  following-sibling:: — keyingi aka-ukalar
  preceding-sibling:: — oldingi aka-ukalar
  attribute::   — atributlar (@)

Misol: //kitob/ancestor::kutubxona

═══════════════════════════════════════
  FUNKSIYALAR
═══════════════════════════════════════

Matn:
  text()        — tugun matni
  contains(s,t) — s ichida t bormi
  starts-with() — boshlanishi
  string-length() — uzunlik
  normalize-space() — bo'shliklarni tozalash
  concat()      — birlashtirish
  substring()   — qism matn

Raqam:
  count()       — soni
  sum()         — yig'indi
  number()      — raqamga aylantirish

Pozitsiya:
  position()    — hozirgi pozitsiya
  last()        — oxirgi pozitsiya

Mantiqiy:
  not()         — inkor
  and, or       — mantiqiy operatorlar

═══════════════════════════════════════
  JAVASCRIPT DA XPATH
═══════════════════════════════════════

document.evaluate() — brauzerda XPath ishlatish:
  const result = document.evaluate(
    '//div[@class="item"]',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )`,

  codeExamples: [
    {
      title: 'XPath ifodalar namunalari',
      language: 'xml',
      description: 'Turli XPath so\'rovlar kutubxona XML da',
      code: `<!-- Ma'lumot bazasi -->
<?xml version="1.0" encoding="UTF-8"?>
<kutubxona>
  <kitob isbn="001" til="uz" janr="ertak">
    <sarlavha>Oltin baliq</sarlavha>
    <muallif>Xalq ijodi</muallif>
    <yil>2020</yil>
    <narx>45000</narx>
  </kitob>
  <kitob isbn="002" til="en" janr="dasturlash">
    <sarlavha>Clean Code</sarlavha>
    <muallif>Robert Martin</muallif>
    <yil>2008</yil>
    <narx>150000</narx>
  </kitob>
  <kitob isbn="003" til="uz" janr="dasturlash">
    <sarlavha>React o'rganamiz</sarlavha>
    <muallif>Ali Valiyev</muallif>
    <yil>2025</yil>
    <narx>80000</narx>
  </kitob>
</kutubxona>

<!--
XPath so'rovlar:

/kutubxona/kitob
  → barcha kitoblar (3 ta)

//kitob[@til='uz']
  → o'zbek tilidagi kitoblar (2 ta)

//kitob[narx > 50000]/sarlavha
  → narxi 50000 dan katta: "Clean Code", "React o'rganamiz"

//kitob[last()]
  → oxirgi kitob: "React o'rganamiz"

//kitob[contains(sarlavha, 'React')]
  → sarlavhasida "React" bo'lgan kitob

//kitob[@janr='dasturlash' and @til='uz']
  → o'zbek tilidagi dasturlash kitobi

count(//kitob)
  → 3

sum(//kitob/narx)
  → 275000
-->`,
    },
    {
      title: 'JavaScript da XPath',
      language: 'js',
      description: 'document.evaluate bilan XPath so\'rovlar',
      code: `// XML ni parse qilish
const parser = new DOMParser()
const xmlStr = \`<?xml version="1.0"?>
<mahsulotlar>
  <mahsulot id="1" kategoriya="elektronika">
    <nomi>Noutbuk</nomi>
    <narx>5000000</narx>
  </mahsulot>
  <mahsulot id="2" kategoriya="kiyim">
    <nomi>Ko'ylak</nomi>
    <narx>200000</narx>
  </mahsulot>
  <mahsulot id="3" kategoriya="elektronika">
    <nomi>Telefon</nomi>
    <narx>3000000</narx>
  </mahsulot>
</mahsulotlar>\`

const xml = parser.parseFromString(xmlStr, 'text/xml')

// Barcha elektronika mahsulotlarini topish
const result = xml.evaluate(
  '//mahsulot[@kategoriya="elektronika"]/nomi',
  xml,
  null,
  XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
  null
)

for (let i = 0; i < result.snapshotLength; i++) {
  console.log(result.snapshotItem(i).textContent)
}
// "Noutbuk"
// "Telefon"`,
    },
  ],

  interviewQA: [
    {
      question: 'XPath nima va CSS selektorlardan qanday farq qiladi?',
      answer: 'XPath — XML/HTML hujjatda tugunlarni topish uchun so\'rov tili. CSS selektorlardan farqi: 1) XPath yuqoriga ham navigatsiya qiladi (parent::, ancestor::), CSS faqat pastga. 2) XPath da funksiyalar bor (contains, count, sum). 3) XPath matn bo\'yicha filtrlaydi. 4) XPath murakkabroq so\'rovlar yozish imkonini beradi. CSS selektorlar oddiyroq va tezroq.',
    },
    {
      question: 'XPath da predikatlar qanday ishlaydi?',
      answer: 'Predikatlar [] ichida filtrlash shartlari. Misol: //kitob[@til="uz"] — til atributi uz bo\'lganlar. //kitob[narx > 50000] — narxi 50000 dan katta. //kitob[position()<=3] — birinchi 3 ta. //kitob[contains(sarlavha,"React")] — sarlavhasida React bor. Predikatlar zanjirlanishi mumkin: //kitob[@til="uz"][narx > 30000].',
    },
    {
      question: 'XPath axes (o\'qlar) nima?',
      answer: 'Axes — XPath da tugun atrofidagi turli yo\'nalishlar. Asosiy o\'qlar: child:: (bolalar), parent:: (ota), ancestor:: (barcha ajdodlar), descendant:: (barcha avlodlar), self:: (o\'zi), following-sibling:: (keyingi aka-ukalar), preceding-sibling:: (oldingi aka-ukalar). Qisqa yozuv: / = child::, // = descendant-or-self::, .. = parent::, @ = attribute::.',
    },
  ],

  relatedTopics: [
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xml-syntax', label: 'XML Sintaksisi' },
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xslt', label: 'XSLT' },
    { techId: 'css', sectionId: 'css-fundamentals', topicId: 'selectors', label: 'CSS Selektorlar' },
  ],
}
