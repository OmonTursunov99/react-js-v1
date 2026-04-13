import type { Topic } from '../../../types'

export const dtdSchema: Topic = {
  id: 'dtd-schema',
  title: 'DTD va XML Schema',
  importance: 2,
  status: 'to-learn',
  description: 'DTD, XML Schema (XSD) va validatsiya',
  content: `XML hujjat tuzilmasini tekshirish uchun ikki asosiy texnologiya mavjud: DTD (Document Type Definition) va XML Schema (XSD). Ular XML hujjatning "qoidalarini" belgilaydi — qanday elementlar bo'lishi kerak, qanday tartibda, qanday qiymatlar.

═══════════════════════════════════════
  DTD (Document Type Definition)
═══════════════════════════════════════

DTD — XML tuzilmasini belgilaydigan eng oddiy usul.
Ichki (inline) yoki tashqi fayl sifatida bo'lishi mumkin.

Element deklaratsiyasi:
  <!ELEMENT kitob (sarlavha, muallif, yil)>
  <!ELEMENT sarlavha (#PCDATA)>   — faqat matn
  <!ELEMENT kutubxona (kitob+)>   — 1 yoki ko'p kitob

Mikdor belgilari:
  +  — 1 yoki undan ko'p
  *  — 0 yoki undan ko'p
  ?  — 0 yoki 1
  |  — tanlash (yoki)

Atribut deklaratsiyasi:
  <!ATTLIST kitob isbn CDATA #REQUIRED>
  <!ATTLIST kitob til CDATA "uz">  — default qiymat

Atribut turlari:
  CDATA     — oddiy matn
  ID        — noyob identifikator
  IDREF     — boshqa element ID siga reference
  NMTOKEN   — nom tokeni (bo'shliksiz)

═══════════════════════════════════════
  DTD CHEKLOVLARI
═══════════════════════════════════════

1. XML sintaksisida EMAS — alohida sintaksis
2. Namespace qo'llab-quvvatlamaydi
3. Ma'lumot turlari yo'q (raqam, sana, boolean)
4. Murakkab tuzilmalarni ifoda etish qiyin

═══════════════════════════════════════
  XML SCHEMA (XSD)
═══════════════════════════════════════

XSD — DTD ning kuchli muqobili:
  - O'zi XML formatida yoziladi
  - 44+ o'rnatilgan ma'lumot turi (string, integer, date, boolean...)
  - Namespace to'liq qo'llab-quvvatlaydi
  - Murakkab tip yaratish mumkin
  - Meros olish (inheritance) bor

Asosiy tushunchalar:
  xs:element     — element deklaratsiyasi
  xs:attribute   — atribut deklaratsiyasi
  xs:complexType — murakkab tip (ichki elementlar)
  xs:simpleType  — oddiy tip (faqat qiymat)
  xs:sequence    — tartibli ketma-ketlik
  xs:choice      — tanlash
  xs:all         — barcha (tartibsiz)

Ma'lumot turlari:
  xs:string, xs:integer, xs:decimal, xs:boolean,
  xs:date, xs:dateTime, xs:positiveInteger...

Cheklovlar (restrictions):
  minInclusive, maxInclusive — raqam chegaralari
  minLength, maxLength — matn uzunligi
  pattern — regex
  enumeration — ruxsat etilgan qiymatlar ro'yxati

═══════════════════════════════════════
  VALIDATSIYA
═══════════════════════════════════════

Well-formed — sintaktik to'g'ri XML
Valid — DTD/Schema ga mos keladi

Har bir valid XML well-formed, lekin har bir
well-formed XML valid emas.`,

  codeExamples: [
    {
      title: 'DTD namunasi',
      language: 'xml',
      description: 'Ichki va tashqi DTD bilan XML validatsiyasi',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Ichki DTD -->
<!DOCTYPE kutubxona [
  <!ELEMENT kutubxona (kitob+)>
  <!ELEMENT kitob (sarlavha, muallif, yil, narx?)>
  <!ELEMENT sarlavha (#PCDATA)>
  <!ELEMENT muallif (#PCDATA)>
  <!ELEMENT yil (#PCDATA)>
  <!ELEMENT narx (#PCDATA)>
  <!ATTLIST kitob isbn CDATA #REQUIRED>
  <!ATTLIST kitob til CDATA "uz">
  <!ATTLIST narx valyuta CDATA "UZS">
]>
<kutubxona>
  <kitob isbn="978-3-16-148410-0" til="uz">
    <sarlavha>Oltin baliq</sarlavha>
    <muallif>Xalq og'zaki ijodi</muallif>
    <yil>2020</yil>
    <narx valyuta="UZS">45000</narx>
  </kitob>
  <kitob isbn="978-0-13-468599-1" til="en">
    <sarlavha>Clean Code</sarlavha>
    <muallif>Robert Martin</muallif>
    <yil>2008</yil>
    <!-- narx ixtiyoriy (?) -->
  </kitob>
</kutubxona>`,
    },
    {
      title: 'XML Schema (XSD)',
      language: 'xml',
      description: 'Kutubxona uchun XSD schema',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">

  <!-- Oddiy tiplar -->
  <xs:simpleType name="yilTipi">
    <xs:restriction base="xs:integer">
      <xs:minInclusive value="1900"/>
      <xs:maxInclusive value="2100"/>
    </xs:restriction>
  </xs:simpleType>

  <xs:simpleType name="tilTipi">
    <xs:restriction base="xs:string">
      <xs:enumeration value="uz"/>
      <xs:enumeration value="en"/>
      <xs:enumeration value="ru"/>
    </xs:restriction>
  </xs:simpleType>

  <!-- Kitob elementi -->
  <xs:element name="kitob">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="sarlavha" type="xs:string"/>
        <xs:element name="muallif" type="xs:string"/>
        <xs:element name="yil" type="yilTipi"/>
        <xs:element name="narx" type="xs:decimal"
                    minOccurs="0"/>
      </xs:sequence>
      <xs:attribute name="isbn" type="xs:string"
                    use="required"/>
      <xs:attribute name="til" type="tilTipi"
                    default="uz"/>
    </xs:complexType>
  </xs:element>

  <!-- Root element -->
  <xs:element name="kutubxona">
    <xs:complexType>
      <xs:sequence>
        <xs:element ref="kitob"
                    maxOccurs="unbounded"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>

</xs:schema>`,
    },
  ],

  interviewQA: [
    {
      question: 'DTD va XML Schema (XSD) orasidagi farqlar nima?',
      answer: 'Asosiy farqlar: 1) XSD o\'zi XML formatida, DTD alohida sintaksis. 2) XSD da 44+ ma\'lumot turi (integer, date, boolean), DTD da faqat matn. 3) XSD namespace qo\'llab-quvvatlaydi, DTD qilmaydi. 4) XSD da meros olish va murakkab tiplar bor. 5) XSD da cheklovlar (min, max, pattern, enumeration) bor. XSD kuchli, lekin DTD oddiyroq va yozish oson.',
    },
    {
      question: 'Well-formed va valid XML farqi nima?',
      answer: 'Well-formed — XML sintaksis qoidalariga amal qiladi: teglar yopilgan, to\'g\'ri joylashtirilgan, bitta root element, atributlar qo\'shtirnoqda. Valid — well-formed PLUS DTD yoki Schema ga mos keladi (to\'g\'ri elementlar, to\'g\'ri tartib, to\'g\'ri turlar). Har bir valid XML well-formed, lekin har bir well-formed XML valid emas.',
    },
    {
      question: 'XML Schema da qanday ma\'lumot turlari mavjud?',
      answer: 'Asosiy turlar: xs:string, xs:integer, xs:decimal, xs:boolean, xs:date, xs:dateTime, xs:time, xs:positiveInteger, xs:nonNegativeInteger, xs:float, xs:double, xs:anyURI. Cheklovlar bilan maxsus turlar yaratish mumkin: minInclusive/maxInclusive (raqam chegaralari), minLength/maxLength (matn uzunligi), pattern (regex), enumeration (ruxsat etilgan qiymatlar).',
    },
  ],

  relatedTopics: [
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xml-syntax', label: 'XML Sintaksisi' },
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xml-vs-json', label: 'XML vs JSON' },
  ],
}
