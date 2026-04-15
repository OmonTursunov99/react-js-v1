import type { Topic } from '../../../types'

export const arrayStringPatterns: Topic = {
  id: 'array-string-patterns',
  title: 'Array va String Patterns',
  importance: 3,
  status: 'to-learn',
  description: 'Two pointers, sliding window, frequency counter, prefix sum',
  content: `
═══════════════════════════════════════
  ARRAY VA STRING PATTERNS — KIRISH
═══════════════════════════════════════

Frontend intervyularda array va string bilan bog'liq masalalar ENG
KO'P uchraydi. Ularni yechish uchun 4 ta asosiy pattern mavjud:

1. Two Pointers — ikki ko'rsatkich
2. Sliding Window — siljuvchi oyna
3. Frequency Counter — chastota hisoblagich (Hash Map)
4. Prefix Sum — prefiks yig'indisi

Har bir pattern ma'lum turdagi masalalarni O(n²) dan O(n) ga
tushiradi. Patternni taniy olish — masalaning yarmini yechish demak.

═══════════════════════════════════════
  TWO POINTERS — IKKI KO'RSATKICH
═══════════════════════════════════════

G'oya: Array yoki string ning ikki tomonidan (yoki ichidan) ikki
ko'rsatkich qo'yib, ularni bir-biriga qarab siljitish.

Qachon ishlatiladi:
1. TARTIBLANGAN array da juftlik qidirish (twoSum sorted)
2. Palindrome tekshirish
3. Array ni in-place o'zgartirish (dublikatlar olib tashlash)
4. Ikki tartiblangan arrayni birlashtirish (merge)

Afzalligi:
- Vaqt: O(n) — bir marta o'tish
- Xotira: O(1) — qo'shimcha array kerak emas

Ikki turi:
a) QARAMA-QARSHI — left va right ikki uchdan markazga
   Misol: isPalindrome, twoSum (sorted)

b) TEZ VA SEKIN — ikkalasi bir tomondan, lekin tezligi farq
   Misol: linked list cycle detection, remove duplicates

═══════════════════════════════════════
  SLIDING WINDOW — SILJUVCHI OYNA
═══════════════════════════════════════

G'oya: Array/string ustida belgilangan yoki o'zgaruvchan
uzunlikdagi "oyna" ni siljitib, har qadamda oyna ichidagi
ma'lumotni yangilash.

Qachon ishlatiladi:
1. Maksimal/minimal SUBARRAY yig'indisi (uzunlik berilgan)
2. Eng uzun SUBSTRING (shart bilan — masalan, takrorsiz)
3. Anagram/permutatsiya qidirish string ichida
4. Ketma-ket elementlar bilan bog'liq masalalar

Afzalligi:
- Brute force O(n × k) o'rniga O(n)
- Har qadamda faqat bitta element QOSHILADI va bitta OLIB TASHLANADI

Ikki turi:
a) FIXED SIZE — oyna uzunligi doimiy (k)
   Misol: k uzunlikdagi subarray ning max yig'indisi

b) VARIABLE SIZE — oyna uzunligi shartga qarab o'zgaradi
   Misol: yig'indisi >= target bo'lgan eng qisqa subarray

═══════════════════════════════════════
  FREQUENCY COUNTER — CHASTOTA HISOBLAGICH
═══════════════════════════════════════

G'oya: Hash Map (yoki oddiy object) yordamida elementlar
CHASTOTASINI hisoblash. Ikki arrayni solishtirish yoki
elementni tezkor qidirish uchun.

Qachon ishlatiladi:
1. Anagram tekshirish — ikki so'zda harflar bir xilmi
2. Birinchi takrorlanMAS element topish
3. Dublikatlar topish
4. Elementlar CHASTOTASI bilan bog'liq masalalar
5. "Contains" tekshiruvlarni O(1) ga tushirish

Afzalligi:
- Nested loop O(n²) o'rniga O(n)
- Qo'shimcha xotira: O(k) — k = noyob elementlar soni

Asosiy strategiya:
1. Birinchi o'tishda — chastotani hisoblash (Map ga yozish)
2. Ikkinchi o'tishda — natijani tekshirish

═══════════════════════════════════════
  PREFIX SUM — PREFIKS YIG'INDISI
═══════════════════════════════════════

G'oya: Avvaldan yig'indi array hisoblash, keyin HAR QANDAY
oraliq yig'indini O(1) da olish.

Qachon ishlatiladi:
1. Ko'p marta RANGE SUM so'ralganda
2. Subarray yig'indisi bilan bog'liq masalalar
3. 2D matritsa range query (2D prefix sum)

Qanday ishlaydi:
  arr     = [2, 4, 1, 3, 5]
  prefix  = [0, 2, 6, 7, 10, 15]
  prefix[i] = arr[0] + arr[1] + ... + arr[i-1]

  [l, r] oraliq yig'indisi = prefix[r+1] - prefix[l]
  arr[1..3] yig'indisi = prefix[4] - prefix[1] = 10 - 2 = 8
  Tekshiruv: 4 + 1 + 3 = 8 ✓

Afzalligi:
- Oldindan hisoblash: O(n)
- Har bir so'rov: O(1) — qancha marta so'ralsa ham
- m ta so'rov uchun: O(n + m) vs brute force O(n × m)

═══════════════════════════════════════
  PATTERN TANLASH — QISQA QOIDA
═══════════════════════════════════════

Masala turi                        | Pattern
──────────────────────────────────┼──────────────────
Tartiblangan array, juftlik      | Two Pointers
Palindrome tekshirish             | Two Pointers
Subarray/substring (ketma-ket)   | Sliding Window
Max/min uzunlik (shart bilan)    | Sliding Window
Anagram, dublikat, chastota      | Frequency Counter
"Mavjud" tekshiruvni tezlashtir  | Frequency Counter
Oraliq yig'indi, range query     | Prefix Sum
Subarray yig'indisi = target     | Prefix Sum + Hash Map`.trim(),
  codeExamples: [
    {
      title: 'Two Pointers — twoSum va isPalindrome',
      language: 'js',
      description: 'Tartiblangan arrayda juftlik qidirish va palindrome tekshirish',
      code: `// ═══ Two Sum — tartiblangan array ═══
// Masala: tartiblangan arrayda yig'indisi target ga teng juftlik toping
// Brute force: O(n²) — har bir juftlikni tekshirish
// Two Pointers: O(n) — ikki uchdan markazga

function twoSumSorted(arr, target) {
  let left = 0
  let right = arr.length - 1

  while (left < right) {
    const sum = arr[left] + arr[right]

    if (sum === target) {
      return [left, right]  // Topildi!
    } else if (sum < target) {
      left++   // Yig'indi kichik — kattaroq element kerak
    } else {
      right--  // Yig'indi katta — kichikroq element kerak
    }
  }

  return null  // Topilmadi
}

console.log(twoSumSorted([1, 3, 5, 7, 11, 15], 16))  // [2, 4] → 5+11=16
console.log(twoSumSorted([2, 4, 6, 8, 10], 12))       // [1, 3] → 4+8=12

// ═══ Palindrome tekshirish ═══
// "racecar" → true, "hello" → false
// Ikki uchdan markazga qarab solishtirish

function isPalindrome(str) {
  // Faqat harflar va raqamlar, kichik harfga o'tkazish
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '')
  let left = 0
  let right = cleaned.length - 1

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false  // Mos kelmadi
    }
    left++
    right--
  }

  return true
}

console.log(isPalindrome('racecar'))              // true
console.log(isPalindrome('A man, a plan, a canal: Panama'))  // true
console.log(isPalindrome('hello'))                // false

// ═══ Dublikatlarni olib tashlash (in-place) ═══
// Tartiblangan arraydan dublikatlarni O(1) xotira bilan olib tashlash
// Sekin pointer — noyob elementlar pozitsiyasi
// Tez pointer — barcha elementlarni ko'rib chiqish

function removeDuplicates(arr) {
  if (arr.length === 0) return 0

  let slow = 0  // Noyob elementlar uchun pozitsiya

  for (let fast = 1; fast < arr.length; fast++) {
    if (arr[fast] !== arr[slow]) {
      slow++
      arr[slow] = arr[fast]  // Noyob elementni joylashtirish
    }
  }

  return slow + 1  // Noyob elementlar soni
}

const nums = [1, 1, 2, 2, 3, 4, 4, 5]
const length = removeDuplicates(nums)
console.log(nums.slice(0, length))  // [1, 2, 3, 4, 5]`,
    },
    {
      title: 'Sliding Window — maxSubarraySum va longest unique substring',
      language: 'js',
      description: 'Fixed size va variable size oyna misollari',
      code: `// ═══ Fixed Size Window — max subarray sum ═══
// k uzunlikdagi subarray ning maksimal yig'indisini toping
// Brute force: O(n × k) — har bir pozitsiyada k element yig'ish
// Sliding Window: O(n) — bitta qo'sh, bitta ol

function maxSubarraySum(arr, k) {
  if (arr.length < k) return null

  // Birinchi oynani hisoblash
  let windowSum = 0
  for (let i = 0; i < k; i++) {
    windowSum += arr[i]
  }

  let maxSum = windowSum

  // Oynani siljitish — o'ngdan qo'shish, chapdan olish
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i]       // Yangi element qo'shish
    windowSum -= arr[i - k]   // Eski element olib tashlash
    maxSum = Math.max(maxSum, windowSum)
  }

  return maxSum
}

console.log(maxSubarraySum([2, 1, 5, 1, 3, 2], 3))  // 9 → [5, 1, 3]
console.log(maxSubarraySum([4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3))  // 16 → [7, 8, 1]

// ═══ Variable Size Window — eng uzun takrorsiz substring ═══
// "abcabcbb" → 3 ("abc")
// Oyna hajmi shartga qarab o'sadi yoki qisqaradi

function lengthOfLongestSubstring(s) {
  const charIndex = new Map()  // Harfning oxirgi pozitsiyasi
  let maxLength = 0
  let left = 0

  for (let right = 0; right < s.length; right++) {
    const char = s[right]

    // Agar harf oyna ichida mavjud bo'lsa — left ni siljitish
    if (charIndex.has(char) && charIndex.get(char) >= left) {
      left = charIndex.get(char) + 1  // Takrordan keyingi pozitsiya
    }

    charIndex.set(char, right)  // Harfning pozitsiyasini yangilash
    maxLength = Math.max(maxLength, right - left + 1)
  }

  return maxLength
}

console.log(lengthOfLongestSubstring('abcabcbb'))  // 3 → "abc"
console.log(lengthOfLongestSubstring('bbbbb'))     // 1 → "b"
console.log(lengthOfLongestSubstring('pwwkew'))    // 3 → "wke"

// ═══ Variable Size — minimal subarray sum ═══
// Yig'indisi >= target bo'lgan ENG QISQA subarray uzunligi

function minSubarrayLen(target, arr) {
  let minLength = Infinity
  let windowSum = 0
  let left = 0

  for (let right = 0; right < arr.length; right++) {
    windowSum += arr[right]

    // Shart bajarilsa — oynani qisqartirish
    while (windowSum >= target) {
      minLength = Math.min(minLength, right - left + 1)
      windowSum -= arr[left]
      left++
    }
  }

  return minLength === Infinity ? 0 : minLength
}

console.log(minSubarrayLen(7, [2, 3, 1, 2, 4, 3]))  // 2 → [4, 3]
console.log(minSubarrayLen(11, [1, 1, 1, 1, 1]))     // 0 → mumkin emas`,
    },
    {
      title: 'Frequency Counter — isAnagram va firstNonRepeating',
      language: 'js',
      description: 'Hash Map bilan chastota hisoblash va taqqoslash',
      code: `// ═══ Anagram tekshirish ═══
// "listen" va "silent" — anagrammi? → true
// Brute force: sort qilib solishtirish — O(n log n)
// Frequency Counter: O(n) — har bir harfni hisoblash

function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false

  const freq = new Map()

  // Birinchi so'z — harflarni hisoblash
  for (const char of s1) {
    freq.set(char, (freq.get(char) || 0) + 1)
  }

  // Ikkinchi so'z — harflarni ayirish
  for (const char of s2) {
    if (!freq.has(char) || freq.get(char) === 0) {
      return false  // Harf yo'q yoki ko'p ishlatilgan
    }
    freq.set(char, freq.get(char) - 1)
  }

  return true
}

console.log(isAnagram('listen', 'silent'))    // true
console.log(isAnagram('hello', 'world'))      // false
console.log(isAnagram('anagram', 'nagaram'))  // true

// ═══ Birinchi takrorlanmaydigan harf ═══
// "aabbccdde" → "e"
// "aabbc" → "c"

function firstNonRepeating(str) {
  const freq = new Map()

  // 1-o'tish: chastotani hisoblash
  for (const char of str) {
    freq.set(char, (freq.get(char) || 0) + 1)
  }

  // 2-o'tish: birinchi 1 marta uchragan harfni topish
  for (const char of str) {
    if (freq.get(char) === 1) return char
  }

  return null  // Hammasi takrorlangan
}

console.log(firstNonRepeating('aabbccdde'))     // 'e'
console.log(firstNonRepeating('abcabc'))         // null
console.log(firstNonRepeating('javascript'))     // 'j'

// ═══ Eng ko'p uchraydigan element ═══
function mostFrequent(arr) {
  const freq = new Map()
  let maxCount = 0
  let maxItem = null

  for (const item of arr) {
    const count = (freq.get(item) || 0) + 1
    freq.set(item, count)

    if (count > maxCount) {
      maxCount = count
      maxItem = item
    }
  }

  return maxItem
}

console.log(mostFrequent([1, 3, 2, 1, 4, 1, 3, 3, 3]))  // 3

// ═══ Ikki array ning kesishmasi ═══
// [1, 2, 2, 1] va [2, 2, 3] → [2, 2]
function intersection(arr1, arr2) {
  const freq = new Map()
  const result = []

  for (const num of arr1) {
    freq.set(num, (freq.get(num) || 0) + 1)
  }

  for (const num of arr2) {
    if (freq.has(num) && freq.get(num) > 0) {
      result.push(num)
      freq.set(num, freq.get(num) - 1)
    }
  }

  return result
}

console.log(intersection([1, 2, 2, 1], [2, 2, 3]))  // [2, 2]

// ═══ Group Anagrams ═══
// ["eat","tea","tan","ate","nat","bat"] → [["eat","tea","ate"],["tan","nat"],["bat"]]
function groupAnagrams(words) {
  const groups = new Map()

  for (const word of words) {
    // Harflarni tartiblash — anagramlar bir xil kalit beradi
    const key = [...word].sort().join('')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(word)
  }

  return [...groups.values()]
}

console.log(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']))
// [["eat","tea","ate"], ["tan","nat"], ["bat"]]`,
    },
    {
      title: 'Prefix Sum — range sum query',
      language: 'js',
      description: 'Prefiks yig\'indisi bilan tezkor oraliq so\'rovlar',
      code: `// ═══ Prefix Sum — asosiy tushuncha ═══
// Masala: arrayning [l, r] oralig'idagi yig'indini ko'p marta so'rash
// Brute force: har safar O(n) — l dan r gacha yig'ish
// Prefix Sum: O(1) har bir so'rov, O(n) oldindan hisoblash

class RangeSum {
  #prefix

  constructor(nums) {
    // prefix[i] = nums[0] + nums[1] + ... + nums[i-1]
    this.#prefix = new Array(nums.length + 1).fill(0)

    for (let i = 0; i < nums.length; i++) {
      this.#prefix[i + 1] = this.#prefix[i] + nums[i]
    }
  }

  // [left, right] oraliq yig'indisi — O(1)
  query(left, right) {
    return this.#prefix[right + 1] - this.#prefix[left]
  }
}

const rs = new RangeSum([2, 4, 1, 3, 5, 2, 8])
//                        0  1  2  3  4  5  6

console.log(rs.query(1, 3))  // 4 + 1 + 3 = 8
console.log(rs.query(0, 6))  // 2+4+1+3+5+2+8 = 25
console.log(rs.query(4, 5))  // 5 + 2 = 7

// 1000 marta so'ralsaham O(1) — brute force da O(1000 × n) bo'lardi

// ═══ Subarray yig'indisi = target ═══
// Masala: yig'indisi k ga teng bo'lgan subarray lar sonini toping
// Prefix Sum + Hash Map — O(n)
// G'oya: prefix[j] - prefix[i] = k → prefix[i] = prefix[j] - k

function subarraySum(nums, k) {
  const prefixCount = new Map()
  prefixCount.set(0, 1)  // Bo'sh prefix — yig'indi 0

  let sum = 0
  let count = 0

  for (const num of nums) {
    sum += num  // Joriy prefix sum

    // sum - k oldin uchraganmi?
    if (prefixCount.has(sum - k)) {
      count += prefixCount.get(sum - k)
    }

    // Joriy prefix sum ni hisoblash
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1)
  }

  return count
}

console.log(subarraySum([1, 1, 1], 2))       // 2 → [1,1] va [1,1]
console.log(subarraySum([1, 2, 3, -1, 2], 4)) // 3 → [1,2,3-1+2=4? ...]

// ═══ Amaliy misol: oylik xarajatlar tahlili ═══
const dailyExpenses = [50, 30, 45, 20, 60, 15, 80, 25, 40, 35]
//                      0    1   2   3   4   5   6   7   8   9

const expenses = new RangeSum(dailyExpenses)

// 1-hafta (0-6 kunlar) yig'indisi
console.log(expenses.query(0, 6))  // 300

// 2-3 kunlar orasidagi xarajat
console.log(expenses.query(1, 3))  // 30 + 45 + 20 = 95

// ═══ Running Average (sliding average) ═══
function movingAverage(arr, windowSize) {
  const prefix = [0]
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i])
  }

  const result = []
  for (let i = windowSize; i <= arr.length; i++) {
    const sum = prefix[i] - prefix[i - windowSize]
    result.push(sum / windowSize)
  }

  return result
}

const prices = [10, 20, 30, 40, 50]
console.log(movingAverage(prices, 3))  // [20, 30, 40] — 3 kunlik o'rtacha`,
    },
  ],
  interviewQA: [
    {
      question: 'Two Pointers pattern qachon ishlatiladi?',
      answer: 'Two Pointers asosan quyidagi holatlarda ishlatiladi: 1) TARTIBLANGAN array da juftlik qidirish — twoSum, threeSum masalalari. Ikki uchdan markazga qarab harakatlanib, O(n²) ni O(n) ga tushirish mumkin. 2) PALINDROME tekshirish — string ning boshi va oxiridan markazga qarab solishtirish. 3) IN-PLACE o\'zgartirish — tartiblangan arraydan dublikatlarni olib tashlash (slow/fast pointer). 4) IKKI tartiblangan arrayni birlashtirish (merge) — har birida pointer, kichigini olish. 5) Linked list da TSIKL aniqlash (Floyd\'s algorithm) — tez va sekin pointer. Asosiy shart: array tartiblangan bo\'lishi YOKI elementlarni qandaydir tartibda ko\'rib chiqish imkoni bo\'lishi kerak. Afzalligi: O(1) qo\'shimcha xotira, O(n) vaqt.',
    },
    {
      question: 'Sliding Window va brute force farqi nimada?',
      answer: 'Brute force da har bir pozitsiyada oyna ichidagi BARCHA elementlarni qayta hisoblaysiz — O(n × k). Sliding Window da esa faqat oynaga KIRGAN yangi element qo\'shiladi va CHIQQAN eski element olib tashlanadi — O(n). Misol: 3 uzunlikdagi max subarray sum. Brute force: [2,1,5], [1,5,1], [5,1,3] — har birida 3 ta yig\'ish = 4×3=12 operatsiya. Sliding Window: boshlang\'ich oyna 2+1+5=8, keyin +1-2=7, +3-5=9 — faqat 6 operatsiya. n=1,000,000 va k=1000 bo\'lsa farq KATTA: brute force 1 milliard operatsiya, sliding window 1 million. Variable size window da esa left va right ikkalasi ham faqat oldinga harakatlanadi — umumiy O(2n) = O(n). While tsikli ichida left siljitish O(n²) ga olib kelmaydi chunki left HECH QACHON orqaga qaytmaydi.',
    },
    {
      question: 'Frequency counter bilan anagram tekshirish — O(n) ga qanday erishiladi?',
      answer: 'Anagram — ikki so\'zda AYNAN bir xil harflar, bir xil miqdorda. Oddiy yondashuv: har ikki so\'zni sort qilib solishtirish — O(n log n). Frequency counter bilan O(n): 1) Birinchi so\'zdagi har bir harfning chastotasini Map ga yozing — O(n). 2) Ikkinchi so\'zdagi har bir harfni Map dan ayiring — O(n). 3) Agar biror harf Map da yo\'q yoki chastota 0 ga tushsa — anagram EMAS. Jami: O(n) + O(n) = O(n) vaqt, O(k) xotira (k = noyob harflar soni, max 26 lotin harf = O(1)). Kodni optimallashtirish: Map o\'rniga 26 uzunlikdagi array ham ishlatish mumkin — const freq = new Array(26).fill(0), indeks = charCodeAt(0) - 97. Bu Map dan biroz tezroq chunki hash hisoblash yo\'q. Real loyihada: so\'rovlarni solishtirish, teglarni tekshirish, dublikat kontentni aniqlash.',
    },
    {
      question: 'Prefix Sum qanday ishlaydi va qachon kerak bo\'ladi?',
      answer: 'Prefix Sum — array ning har bir pozitsiyagacha bo\'lgan kumulyativ yig\'indisini oldindan hisoblash. prefix[i] = arr[0] + arr[1] + ... + arr[i-1]. Keyin istalgan [l, r] oraliq yig\'indisi = prefix[r+1] - prefix[l] — O(1) da. Qachon kerak: 1) KO\'P MARTA range sum so\'ralganda — masalan, jadvalda har xil sanalar oralig\'idagi yig\'indini hisoblash. 2) Subarray yig\'indisi = k bo\'lgan holatlar soni — prefix sum + hash map bilan O(n). 3) Moving average hisoblash — birjadagi narx o\'rtachasi. 4) 2D matritsa range query — 2D prefix sum bilan O(1). MUHIM nuans: prefix sum STATIK array uchun ishlaydi. Array tez-tez o\'zgarsa (element qo\'shish/o\'chirish), Segment Tree yoki Fenwick Tree kerak bo\'ladi. Frontend da amaliy misol: analytics dashboard da turli sanalar oralig\'idagi ma\'lumotlarni hisoblash — prefix sum bilan har bir so\'rov O(1).',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'big-o',
      label: 'Big O — Vaqt va Xotira Murakkabligi',
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'hash-table',
      label: 'Hash Table',
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'sorting-algorithms',
      label: 'Sorting Algorithms',
    },
  ],
}
