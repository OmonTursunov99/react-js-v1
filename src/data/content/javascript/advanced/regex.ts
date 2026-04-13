import type { Topic } from '../../../types'

export const regex: Topic = {
  id: 'regex',
  title: 'Regular Expressions',
  importance: 2,
  status: 'to-learn',
  description: 'RegExp, patternlar, grouplar, lookahead',
  content: `═══════════════════════════════════════
  REGEXP — MUNTAZAM IFODALAR
═══════════════════════════════════════

Regular Expression (RegExp) — matn ichida pattern (naqsh) asosida
qidirish, tekshirish va almashtirish uchun ishlatiladigan vosita.
JavaScript da RegExp alohida tip bo'lib, maxsus sintaksisga ega.

═══════════════════════════════════════
  REGEXP YARATISH USULLARI
═══════════════════════════════════════

1. LITERAL — /pattern/flags
   const re = /hello/gi
   Afzalligi: qisqa, o'qishga oson, tezroq (kompilyatsiya paytida)

2. CONSTRUCTOR — new RegExp(pattern, flags)
   const re = new RegExp('hello', 'gi')
   Afzalligi: dinamik pattern yaratish mumkin (o'zgaruvchidan)

MUHIM: Literal da backslash bir marta yoziladi: /\\d+/
Constructor da ikki marta: new RegExp('\\\\d+')

═══════════════════════════════════════
  FLAGS (BAYROQLAR)
═══════════════════════════════════════

1. g (global) — barcha mosliklarni topish (faqat birinchi emas)
2. i (ignoreCase) — katta/kichik harfni farqlamaslik
3. m (multiline) — ^ va $ har bir satr boshi/oxiriga mos keladi
4. s (dotAll) — . belgi \\n ga ham mos keladi
5. u (unicode) — to'liq Unicode qo'llab-quvvatlash (surrogate pairs)
6. d (hasIndices) — moslik pozitsiyalari indekslarini qaytaradi
7. v (unicodeSets) — kengaytirilgan unicode va set belgilari (ES2024)

═══════════════════════════════════════
  BELGI KLASSLARI
═══════════════════════════════════════

\\d  — raqam [0-9]
\\D  — raqam EMAS
\\w  — so'z belgisi [a-zA-Z0-9_]
\\W  — so'z belgisi EMAS
\\s  — bo'sh joy (space, tab, newline)
\\S  — bo'sh joy EMAS
.   — har qanday belgi (\\n dan tashqari, s flag bilan hammasi)
\\b  — so'z chegarasi (word boundary)
\\B  — so'z chegarasi EMAS

═══════════════════════════════════════
  KVANTIFIKATORLAR (QUANTIFIERS)
═══════════════════════════════════════

*     — 0 yoki undan ko'p
+     — 1 yoki undan ko'p
?     — 0 yoki 1 (ixtiyoriy)
{n}   — aniq n marta
{n,}  — kamida n marta
{n,m} — n dan m gacha

MUHIM: Odatda kvantifikatorlar GREEDY (ochko'z) — iloji boricha
ko'proq belgini oladi. Lazy (dangasa) qilish uchun ? qo'shiladi:
*? +? ?? {n,m}? — iloji boricha kamroq belgini oladi.

═══════════════════════════════════════
  ANCHORS (LANGARLAR)
═══════════════════════════════════════

^  — satr/matn boshida (m flag bilan har bir satr)
$  — satr/matn oxirida (m flag bilan har bir satr)
\\b — so'z chegarasi

Misol: /^\\d{4}$/ — aniq 4 ta raqamdan iborat satr

═══════════════════════════════════════
  GRUPLAR
═══════════════════════════════════════

1. Capturing group: (pattern)
   - Moslikni "eslab qoladi", natijada alohida ko'rinadi
   - Backreference: \\1, \\2 (yoki replace da $1, $2)

2. Non-capturing group: (?:pattern)
   - Guruhlash, lekin eslamas — ishlash tezroq

3. Named group: (?<name>pattern)
   - Nomli guruh — result.groups.name orqali olish mumkin

═══════════════════════════════════════
  LOOKAHEAD VA LOOKBEHIND
═══════════════════════════════════════

Bu assertionlar moslikni ISTE'MOL QILMAYDI — faqat tekshiradi:

1. Positive lookahead:  (?=pattern) — oldinda bor
2. Negative lookahead:  (?!pattern) — oldinda yo'q
3. Positive lookbehind: (?<=pattern) — orqada bor
4. Negative lookbehind: (?<!pattern) — orqada yo'q

Misol: /\\d+(?= so'm)/ — "1500 so'm" dan "1500" ni topadi
(raqamlar, ulardan keyin " so'm" bo'lsa, lekin " so'm" ni olmaydi)

═══════════════════════════════════════
  REGEXP METODLARI
═══════════════════════════════════════

RegExp metodlari:
1. test(str) — moslik bormi (boolean)
2. exec(str) — birinchi moslik + groups (yoki null)

String metodlari:
3. match(re) — barcha mosliklar (g flag bilan) yoki birinchi
4. matchAll(re) — iterator, barcha mosliklar + groups (g kerak)
5. search(re) — birinchi moslik indeksi (yoki -1)
6. replace(re, str|fn) — almashtirish
7. replaceAll(re, str|fn) — barchasini almashtirish
8. split(re) — bo'lish`,
  codeExamples: [
    {
      title: 'RegExp yaratish va asosiy metodlar',
      language: 'js',
      code: `// Literal va constructor
const re1 = /hello/gi                       // Literal
const re2 = new RegExp('hello', 'gi')       // Constructor

// Dinamik pattern
const searchTerm = 'react'
const dynamic = new RegExp(searchTerm, 'gi')

// test() — boolean
console.log(/\\d+/.test('abc123'))   // true
console.log(/\\d+/.test('abcdef'))   // false

// exec() — batafsil ma'lumot
const result = /(?<year>\\d{4})-(?<month>\\d{2})/.exec('2024-03-15')
console.log(result[0])             // '2024-03'
console.log(result.groups.year)    // '2024'
console.log(result.groups.month)   // '03'
console.log(result.index)          // 0

// match() — g flag bilan barcha mosliklar
const text = 'ali@mail.com va vali@inbox.uz'
console.log(text.match(/\\w+@\\w+\\.\\w+/g))
// ['ali@mail.com', 'vali@inbox.uz']

// matchAll() — batafsil iterator
for (const m of text.matchAll(/(?<user>\\w+)@(?<domain>[\\w.]+)/g)) {
  console.log(m.groups.user, '→', m.groups.domain)
}
// ali → mail.com
// vali → inbox.uz`,
      description: 'RegExp yaratish va asosiy qidirish metodlari',
    },
    {
      title: 'Belgi klasslari va kvantifikatorlar',
      language: 'js',
      code: `// Belgi klasslari
console.log(/\\d/.test('abc3'))      // true — raqam bor
console.log(/\\w+/.test('hello'))    // true — so'z belgilari
console.log(/\\s/.test('a b'))       // true — bo'sh joy bor

// Custom belgi klassi [...]
console.log(/[aeiou]/i.test('Hello'))  // true — unli harf bor
console.log(/[^0-9]/.test('123'))      // false — faqat raqamlar

// Kvantifikatorlar
console.log('aabbb'.match(/a+/g))     // ['aa']
console.log('aabbb'.match(/b{2,3}/g)) // ['bbb']
console.log('color colour'.match(/colou?r/g))  // ['color', 'colour']

// Greedy vs Lazy
const html = '<b>bold</b> va <i>italic</i>'

// Greedy — iloji boricha ko'p oladi
console.log(html.match(/<.+>/g))
// ['<b>bold</b> va <i>italic</i>'] — barchasi bitta moslik!

// Lazy — iloji boricha kam oladi
console.log(html.match(/<.+?>/g))
// ['<b>', '</b>', '<i>', '</i>'] — har bir tag alohida

// Word boundary
const text = 'cat concatenate catfish'
console.log(text.match(/\\bcat\\b/g))  // ['cat'] — faqat alohida so'z
console.log(text.match(/cat/g))       // ['cat', 'cat', 'cat'] — hammasi`,
      description: 'Belgi klasslari, kvantifikatorlar, greedy vs lazy',
    },
    {
      title: 'Gruplar va backreference',
      language: 'js',
      code: `// Capturing groups
const date = '2024-03-15'
const match = date.match(/(\\d{4})-(\\d{2})-(\\d{2})/)
console.log(match[1])  // '2024' — 1-guruh
console.log(match[2])  // '03'   — 2-guruh
console.log(match[3])  // '15'   — 3-guruh

// Named groups — o'qishga oson
const namedMatch = date.match(/(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/)
const { year, month, day } = namedMatch.groups
console.log(\`\${day}/\${month}/\${year}\`)  // '15/03/2024'

// Non-capturing group — (?:...)
// Faqat guruhlash, ushlab qolmaydi
const re = /(?:http|https):\\/\\/(\\w+)/
const m = 'https://example'.match(re)
console.log(m[1])  // 'example' — 1-guruh (http/https emas)

// Backreference — takroriy teg topish
const htmlTag = /<(\\w+)>.*?<\\/\\1>/g
const html = '<div>hello</div> <span>world</span>'
console.log(html.match(htmlTag))
// ['<div>hello</div>', '<span>world</span>']

// Replace bilan gruplar
const name = 'Ali Valiyev'
console.log(name.replace(/(\\w+) (\\w+)/, '$2, $1'))
// 'Valiyev, Ali'`,
      description: 'Capturing, non-capturing, named gruplar va backreference',
    },
    {
      title: 'Lookahead va Lookbehind',
      language: 'js',
      code: `// Positive lookahead (?=...)
// Raqamlar, ulardan keyin "kg" bo'lsa
const weights = '5kg 10kg 3m 7kg'
console.log(weights.match(/\\d+(?=kg)/g))
// ['5', '10', '7'] — faqat raqamlar (kg olinmaydi)

// Negative lookahead (?!...)
// Raqamlar, ulardan keyin "kg" BO'LMASA
console.log(weights.match(/\\d+(?!kg)/g))
// ['3'] — faqat "3" (metr)

// Positive lookbehind (?<=...)
// Narx — dollar belgisidan keyin
const prices = '$100 va €200 va $350'
console.log(prices.match(/(?<=\\$)\\d+/g))
// ['100', '350'] — faqat dollar narxlari

// Negative lookbehind (?<!...)
// So'z, oldida "Mr." BO'LMASA
const text = 'Mr. Ali va Vali keldi'
console.log(text.match(/(?<!Mr\\. )\\b[A-Z]\\w+/g))
// ['Mr', 'Vali'] — Ali olinmadi (Mr. dan keyin)

// Password validation — lookahead kombinatsiyasi
const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%]).{8,}$/
// Kamida: 1 kichik harf, 1 katta harf, 1 raqam, 1 maxsus belgi, 8+ uzunlik

console.log(passwordRe.test('Parol123!'))  // true
console.log(passwordRe.test('parol123'))   // false — katta harf yo'q
console.log(passwordRe.test('Short1!'))    // false — 8 dan kam`,
      description: 'Lookahead va lookbehind assertion lar',
    },
    {
      title: 'Amaliy patternlar',
      language: 'js',
      code: `// Email tekshiruvi (soddalashtirilgan)
const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/
console.log(emailRe.test('user@example.com'))   // true
console.log(emailRe.test('invalid@.com'))        // false

// Telefon raqami (O'zbekiston)
const phoneRe = /^\\+998[- ]?(\\d{2})[- ]?(\\d{3})[- ]?(\\d{2})[- ]?(\\d{2})$/
const phone = '+998 90 123 45 67'
const pm = phone.match(phoneRe)
console.log(pm?.[0])  // '+998 90 123 45 67'

// URL parsing
const urlRe = /^(?<protocol>https?):\\/\\/(?<host>[\\w.-]+)(?::(?<port>\\d+))?(?<path>\\/[^?#]*)?/
const url = 'https://api.example.com:8080/users/123'
const { protocol, host, port, path } = url.match(urlRe).groups
console.log({ protocol, host, port, path })
// { protocol: 'https', host: 'api.example.com', port: '8080', path: '/users/123' }

// Matnni tozalash va formatlash
const messy = '  ko\\'p   bo\\'sh   joylar  '
const clean = messy.trim().replace(/\\s+/g, ' ')
console.log(clean)  // "ko'p bo'sh joylar"

// Template o'zgaruvchilarni almashtirish
const template = 'Salom, {{name}}! Yosh: {{age}}'
const data = { name: 'Ali', age: 25 }
const result = template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => data[key])
console.log(result)  // "Salom, Ali! Yosh: 25"`,
      description: 'Email, telefon, URL tekshiruvi va matn formatlash',
    },
  ],
  interviewQA: [
    {
      question: 'RegExp literal va constructor ning farqi nima?',
      answer: 'Literal /pattern/flags — statik, kompilyatsiya paytida yaratiladi, backslash bir marta yoziladi (/\\d+/). Afzalligi: qisqa va o\'qishga oson. Constructor new RegExp(pattern, flags) — runtime da yaratiladi, backslash ikki marta yoziladi ("\\\\d+"). Afzalligi: dinamik pattern yaratish mumkin — masalan, foydalanuvchi kiritgan qidirish so\'zidan RegExp yasash. Agar pattern oldindan ma\'lum bo\'lsa — literal, dinamik bo\'lsa — constructor ishlating.',
    },
    {
      question: 'Greedy va lazy kvantifikatorlarning farqi nima?',
      answer: 'Greedy (ochko\'z) — standart xatti-harakat. Kvantifikator iloji boricha KO\'PROQ belgini olishga harakat qiladi, keyin kerak bo\'lsa orqaga qaytadi (backtracking). Masalan: /<.+>/ "<b>bold</b>" da barchasini oladi. Lazy (dangasa) — kvantifikatordan keyin ? qo\'shiladi (*?, +?, ??). Iloji boricha KAMROQ belgini oladi. /<.+?>/ har bir tagni alohida topadi. Greedy katta matnlarda sekinroq bo\'lishi mumkin (ko\'p backtracking), lazy esa aniqroq natija beradi.',
    },
    {
      question: 'Lookahead va lookbehind nima va qanday ishlaydi?',
      answer: 'Bu zero-width assertion lar — pattern ni TEKSHIRADI lekin ISTE\'MOL QILMAYDI (natijaga qo\'shmaydi). Positive lookahead (?=X) — oldinda X bor. Negative lookahead (?!X) — oldinda X yo\'q. Positive lookbehind (?<=X) — orqada X bor. Negative lookbehind (?<!X) — orqada X yo\'q. Misol: /\\d+(?=\\$)/ "50$ va 30€" da faqat "50" ni topadi ($ oldidagi raqam). Parol validatsiyasida ko\'p ishlatiladi — bir vaqtda bir nechta shartni tekshirish uchun.',
    },
    {
      question: 'Named capture groups qanday ishlaydi?',
      answer: '(?<name>pattern) sintaksisi bilan guruhga nom berish mumkin. Natijada match.groups.name orqali qiymatni olish mumkin — raqamli indeks o\'rniga nom ishlatish kodni o\'qishga osonroq qiladi. Replace da $<name> sintaksisi bilan foydalanish mumkin. matchAll() da ham har bir moslik uchun groups mavjud. Destructuring bilan qo\'llash qulay: const { year, month } = str.match(/(?<year>\\d{4})-(?<month>\\d{2})/).groups.',
    },
    {
      question: 'exec() va match() ning farqi nima?',
      answer: 'exec() RegExp metodi — bitta moslikni batafsil qaytaradi (groups, index, input). g flag bilan har safar chaqirganda keyingi moslikni topadi (lastIndex ni yangilaydi). match() String metodi — g flag BILAN barcha mosliklarni oddiy array sifatida qaytaradi (groups yo\'q). g flag SISAN birinchi moslikni exec() ga o\'xshash batafsil qaytaradi. Batafsil ma\'lumot kerak bo\'lsa — matchAll() eng yaxshi tanlov: g flag bilan iterator qaytaradi, har bir moslik uchun groups va index mavjud.',
    },
    {
      question: 'RegExp bilan bog\'liq performance muammolari bormi?',
      answer: 'Ha. 1) Catastrophic backtracking — noto\'g\'ri yozilgan nested kvantifikatorlar (/a*a*b/ kabi) eksponensial sekinlashishga olib keladi. Yechim: atomik gruplar yoki aniqroq patternlar yozish. 2) g flag bilan exec() — lastIndex saqlanadi, agar regex qayta ishlatilsa kutilmagan natija beradi. 3) Constructor loop ichida — har iteratsiyada new RegExp yaratish o\'rniga, bir marta yaratib qayta ishlatish kerak. 4) Katta matnlarda .* kabi greedy patternlar sekin — aniqroq belgi klasslari ([^<]* kabi) ishlatish tezroq.',
    },
  ],
}
