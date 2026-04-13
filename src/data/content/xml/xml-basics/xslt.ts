import type { Topic } from '../../../types'

export const xslt: Topic = {
  id: 'xslt',
  title: 'XSLT',
  importance: 1,
  status: 'to-learn',
  description: 'XSLT transformatsiyalari va shablonlar',
  content: `XSLT (eXtensible Stylesheet Language Transformations) — XML hujjatni boshqa formatga (HTML, boshqa XML, matn) aylantirish uchun til. XML ma'lumotlarni ko'rsatish uchun ishlatiladi.

═══════════════════════════════════════
  XSLT QANDAY ISHLAYDI?
═══════════════════════════════════════

1. Manba XML hujjat beriladi
2. XSLT stylesheet transformatsiya qoidalarini belgilaydi
3. XSLT protsessor ularni birlashtiradi
4. Natija: HTML, boshqa XML yoki oddiy matn

  XML + XSLT → XSLT Processor → Natija

═══════════════════════════════════════
  ASOSIY ELEMENTLAR
═══════════════════════════════════════

<xsl:stylesheet>  — root element, version va namespace
<xsl:template>    — shablon qoidasi (match atributi)
<xsl:apply-templates> — shablonlarni qo'llash
<xsl:value-of>    — qiymatni chiqarish (select = XPath)
<xsl:for-each>    — takrorlash (loop)
<xsl:if>          — shart
<xsl:choose>      — ko'p shartli tanlash (switch)
  <xsl:when>      — shart
  <xsl:otherwise>  — default
<xsl:sort>        — tartiblash
<xsl:variable>    — o'zgaruvchi
<xsl:param>       — parametr

═══════════════════════════════════════
  TEMPLATE MATCHING
═══════════════════════════════════════

XSLT asosiy prinsipi — shablon moslash:
  <xsl:template match="kitob">
    <!-- bu yerda kitob uchun HTML yaratiladi -->
  </xsl:template>

match atributi XPath ifoda qabul qiladi.
/ — root, * — barcha elementlar, //kitob — barcha kitoblar

═══════════════════════════════════════
  BRAUZERDA XSLT
═══════════════════════════════════════

XML faylda XSLT ga havola qo'yish:
  <?xml-stylesheet type="text/xsl" href="style.xsl"?>
Brauzer avtomatik transformatsiya qiladi.

JavaScript da: XSLTProcessor API mavjud.

═══════════════════════════════════════
  HOZIRGI HOLAT
═══════════════════════════════════════

XSLT 1.0 — barcha brauzerlar qo'llab-quvvatlaydi
XSLT 2.0/3.0 — faqat server tomonda (Saxon)

Zamonaviy veb-da XSLT kam ishlatiladi:
  - JSON + JavaScript ko'proq mashhur
  - Lekin enterprise va hukumat tizimlarida XML/XSLT hali ham keng tarqalgan`,

  codeExamples: [
    {
      title: 'XSLT bilan XML ni HTML ga aylantirish',
      language: 'xml',
      description: 'Kutubxona XML ni HTML jadvalga transformatsiya',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- Root template -->
  <xsl:template match="/">
    <html>
      <head><title>Kutubxona</title></head>
      <body>
        <h1>Kitoblar ro'yxati</h1>
        <table border="1">
          <tr>
            <th>Sarlavha</th>
            <th>Muallif</th>
            <th>Yil</th>
            <th>Narx</th>
          </tr>
          <!-- Har bir kitob uchun -->
          <xsl:for-each select="kutubxona/kitob">
            <xsl:sort select="yil" order="descending"/>
            <tr>
              <td><xsl:value-of select="sarlavha"/></td>
              <td><xsl:value-of select="muallif"/></td>
              <td><xsl:value-of select="yil"/></td>
              <td>
                <xsl:value-of select="narx"/>
                <xsl:text> </xsl:text>
                <xsl:value-of select="narx/@valyuta"/>
              </td>
            </tr>
          </xsl:for-each>
        </table>

        <!-- Jami kitoblar soni -->
        <p>
          Jami: <xsl:value-of
            select="count(kutubxona/kitob)"/> ta kitob
        </p>
      </body>
    </html>
  </xsl:template>

</xsl:stylesheet>`,
    },
    {
      title: 'Shartli transformatsiya',
      language: 'xml',
      description: 'xsl:if va xsl:choose bilan shartli ko\'rsatish',
      code: `<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="kutubxona">
    <div>
      <xsl:apply-templates select="kitob"/>
    </div>
  </xsl:template>

  <xsl:template match="kitob">
    <div class="kitob">
      <h2><xsl:value-of select="sarlavha"/></h2>
      <p>Muallif: <xsl:value-of select="muallif"/></p>

      <!-- xsl:if — oddiy shart -->
      <xsl:if test="narx > 100000">
        <span class="qimmat">Qimmat kitob!</span>
      </xsl:if>

      <!-- xsl:choose — ko'p shartli -->
      <xsl:choose>
        <xsl:when test="@til = 'uz'">
          <span class="til">O'zbek tilida</span>
        </xsl:when>
        <xsl:when test="@til = 'en'">
          <span class="til">Ingliz tilida</span>
        </xsl:when>
        <xsl:otherwise>
          <span class="til">Boshqa til</span>
        </xsl:otherwise>
      </xsl:choose>
    </div>
  </xsl:template>

</xsl:stylesheet>`,
    },
  ],

  interviewQA: [
    {
      question: 'XSLT nima va qanday ishlaydi?',
      answer: 'XSLT (eXtensible Stylesheet Language Transformations) — XML ni boshqa formatga (HTML, boshqa XML, matn) aylantirish texnologiyasi. Ishlash jarayoni: 1) Manba XML beriladi. 2) XSLT stylesheet transformatsiya qoidalarini belgilaydi. 3) XSLT protsessor template matching qiladi — har bir XML element uchun mos shablonni topadi va natijani yaratadi.',
    },
    {
      question: 'Zamonaviy veb-da XSLT ishlatiladi mi?',
      answer: 'Kamroq ishlatiladi. Sabablari: JSON + JavaScript kombinatsiyasi oddiyroq va keng tarqalgan, SPA framework lar (React, Vue) ma\'lumotni o\'zlari render qiladi. LEKIN XSLT hali ham ishlatiladi: enterprise tizimlar (bank, davlat), eski tizimlar integratsiyasi, XML asosli hujjat tizimlarida (DocBook, DITA), PDF generatsiya (XSL-FO), RSS/Atom feed lar.',
    },
  ],

  relatedTopics: [
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xpath', label: 'XPath' },
    { techId: 'xml', sectionId: 'xml-basics', topicId: 'xml-syntax', label: 'XML Sintaksisi' },
  ],
}
