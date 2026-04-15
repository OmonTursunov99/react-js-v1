import type { Topic } from '../../../types'

export const searchingAlgorithms: Topic = {
    id: 'searching-algorithms',
    title: 'Searching Algorithms (Qidirish)',
    importance: 2,
    status: 'to-learn',
    description: 'Linear Search, Binary Search, klassik variations',
    content: `Searching — ma'lumotlar ichidan kerakli elementni topish. Ikki asosiy yondashuv bor: Linear Search (ketma-ket qidirish) va Binary Search (ikkilik qidirish). Binary Search — intervyuda eng ko'p so'raladigan algoritmlardan biri.

═══════════════════════════════════════
  LINEAR SEARCH — O(n)
═══════════════════════════════════════

Eng sodda qidirish — arrayni boshidan oxirigacha ketma-ket tekshirish.

Xususiyatlari:
- Time: O(n) worst/average, O(1) best (birinchi element)
- Space: O(1)
- Array SORTED bo'lishi SHART EMAS
- Har qanday ma'lumot strukturasida ishlaydi

JavaScript da:
- Array.indexOf(value) — index qaytaradi, topilmasa -1
- Array.includes(value) — true/false
- Array.find(callback) — birinchi mos element
- Array.findIndex(callback) — birinchi mos element indeksi

Bularning HAMMASI linear search — O(n).

Qachon ishlatiladi:
- Array kichik bo'lganda (n < 100)
- Array sorted EMAS
- Faqat bir marta qidirish kerak
- Linked list yoki boshqa sequential data

═══════════════════════════════════════
  BINARY SEARCH — O(log n)
═══════════════════════════════════════

FAQAT SORTED array da ishlaydi. Har qadamda qidirish maydonini YARMIGA kamaytiradi.

Qanday ishlaydi:
1. left = 0, right = n - 1 (yoki n)
2. mid = Math.floor((left + right) / 2)
3. Agar arr[mid] === target → TOPILDI
4. Agar arr[mid] < target → left = mid + 1 (o'ng yarmida qidirish)
5. Agar arr[mid] > target → right = mid - 1 (chap yarmida qidirish)
6. left > right bo'lguncha takrorlash

Xususiyatlari:
- Time: O(log n) — har qadamda yarmi kesiladi
- Space: O(1) iterativ, O(log n) rekursiv
- FAQAT sorted array da ishlaydi

Nima uchun O(log n)?
- n elementli array → log₂(n) marta ikkiga bo'lish mumkin
- 1,000,000 element → faqat ~20 qadam!
- 1,000,000,000 element → faqat ~30 qadam!

═══════════════════════════════════════
  BINARY SEARCH PATTERN
═══════════════════════════════════════

Binary Search ni yozishda ENG KO'P uchraydigan xatolar:

1. left va right boshlang'ich qiymati:
   - left = 0, right = arr.length - 1 → while (left <= right)
   - left = 0, right = arr.length → while (left < right)

2. mid hisoblash:
   - mid = Math.floor((left + right) / 2) — JavaScript da xavfsiz
   - Boshqa tillarda: mid = left + Math.floor((right - left) / 2) — overflow oldini olish

3. left va right yangilash:
   - left = mid + 1 (mid allaqachon tekshirilgan)
   - right = mid - 1 yoki right = mid (variation ga bog'liq)

4. Infinite loop — eng keng tarqalgan xato:
   - left va right to'g'ri yangilanmasa, loop tugamaydi
   - DOIM qidirish maydoni KAMAYISHINI ta'minlash kerak

═══════════════════════════════════════
  BINARY SEARCH VARIATIONS
═══════════════════════════════════════

1. FIRST OCCURRENCE (birinchi uchragan)
   - Target topilganda TO'XTAMANG — chapga davom eting
   - right = mid (mid ham javob bo'lishi mumkin)

2. LAST OCCURRENCE (oxirgi uchragan)
   - Target topilganda TO'XTAMANG — o'ngga davom eting
   - left = mid (mid ham javob bo'lishi mumkin)

3. LOWER BOUND (target dan katta yoki teng birinchi element)
   - C++ da lower_bound() — sorted array ga insert qilish joyi
   - Bisect left deyiladi

4. UPPER BOUND (target dan KATTA birinchi element)
   - C++ da upper_bound()
   - Bisect right deyiladi

5. SEARCH IN ROTATED SORTED ARRAY
   - [4,5,6,7,0,1,2] — sorted array aylantirilgan
   - Avval qaysi yarmi sorted ekanini aniqlash
   - Keyin sorted yarmida target bor-yo'qligini tekshirish

6. PEAK ELEMENT
   - arr[i] > arr[i-1] va arr[i] > arr[i+1]
   - O(log n) da topish mumkin — binary search bilan

═══════════════════════════════════════
  REAL-WORLD QOLLASH
═══════════════════════════════════════

1. Autocomplete / Search Suggestions:
   - Sorted so'zlar ro'yxatida prefix bo'yicha qidirish
   - Lower bound — prefix boshlanishi, upper bound — tugashi

2. Pagination:
   - Sorted ma'lumotlarda ma'lum sahifani topish
   - Offset hisoblash binary search bilan

3. Database Indexing:
   - B-Tree — Binary Search ning generalizatsiyasi
   - Indeksli so'rovlar O(log n) da ishlaydi

4. Git Bisect:
   - Bug qaysi commit da kiritilganini topish
   - Binary search — O(log n) commit tekshirish

5. IP Address Lookup:
   - Sorted IP diapazonlarida qidirish
   - GeoIP, firewall rules

6. Version Compatibility:
   - Sorted versiyalar orasidan mos versiyani topish
   - semver range matching`.trim(),
    codeExamples: [
      {
        title: 'Linear vs Binary Search — asosiy implementatsiya',
        language: 'js' as const,
        description: 'Ikki fundamental qidirish algoritmi — O(n) va O(log n). Binary Search faqat sorted arrayda ishlaydi.',
        code: `// ═══════════════════════════════════
// LINEAR SEARCH — O(n)
// ═══════════════════════════════════

function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i; // Topildi
  }
  return -1; // Topilmadi
}

// JavaScript built-in metodlar (hammasi linear — O(n)):
const arr = [5, 3, 8, 1, 9, 2, 7];

arr.indexOf(8);          // 2
arr.includes(8);         // true
arr.find(x => x > 6);   // 8 (birinchi mos element)
arr.findIndex(x => x > 6); // 2


// ═══════════════════════════════════
// BINARY SEARCH — O(log n)
// ═══════════════════════════════════

// ITERATIV versiya (tavsiya etiladi — O(1) space)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // TOPILDI!
    } else if (arr[mid] < target) {
      left = mid + 1; // O'ng yarmida qidirish
    } else {
      right = mid - 1; // Chap yarmida qidirish
    }
  }

  return -1; // Topilmadi
}

// REKURSIV versiya (O(log n) stack space)
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  // Base case
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// Test
const sorted = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log(binarySearch(sorted, 7));   // 3
console.log(binarySearch(sorted, 12));  // -1
console.log(binarySearchRecursive(sorted, 15)); // 7

// TEZLIK FARQI:
// 1,000,000 elementli sorted array:
// Linear Search: ~500,000 taqqoslash (average)
// Binary Search: ~20 taqqoslash (log₂(1,000,000) ≈ 20)`,
      },
      {
        title: 'Binary Search variations: firstOccurrence, lastOccurrence, lowerBound',
        language: 'js' as const,
        description: 'Intervyuda eng ko\'p so\'raladigan Binary Search variatsiyalari — dublikatlar bilan ishlash.',
        code: `// ═══════════════════════════════════
// FIRST OCCURRENCE — birinchi uchragan
// ═══════════════════════════════════

function firstOccurrence(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;       // Javobni saqlash
      right = mid - 1;    // CHAPGA davom etish — oldinroq bor bo'lishi mumkin
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

// ═══════════════════════════════════
// LAST OCCURRENCE — oxirgi uchragan
// ═══════════════════════════════════

function lastOccurrence(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;      // Javobni saqlash
      left = mid + 1;    // O'NGGA davom etish — keyinroq ham bor bo'lishi mumkin
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

// ═══════════════════════════════════
// LOWER BOUND — target >= bo'lgan birinchi element
// (bisect_left — Python dagi)
// ═══════════════════════════════════

function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length; // right = length (element mavjud bo'lmasligi mumkin)

  while (left < right) { // < (not <=)
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid; // mid ham javob bo'lishi mumkin
    }
  }

  return left; // Insert position
}

// ═══════════════════════════════════
// UPPER BOUND — target > bo'lgan birinchi element
// (bisect_right — Python dagi)
// ═══════════════════════════════════

function upperBound(arr, target) {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] <= target) {
      left = mid + 1;    // <= — teng bo'lsa ham o'ngga
    } else {
      right = mid;
    }
  }

  return left;
}

// ═══════════════════════════════════
// COUNT OCCURRENCES — necha marta uchragan
// ═══════════════════════════════════

function countOccurrences(arr, target) {
  const first = lowerBound(arr, target);
  const last = upperBound(arr, target);

  // Agar target mavjud bo'lmasa
  if (first >= arr.length || arr[first] !== target) return 0;

  return last - first; // O(log n) — ikki binary search
}

// Test
const arr = [1, 2, 2, 2, 3, 3, 5, 5, 5, 5, 8];

console.log(firstOccurrence(arr, 2));  // 1
console.log(lastOccurrence(arr, 2));   // 3
console.log(firstOccurrence(arr, 5));  // 6
console.log(lastOccurrence(arr, 5));   // 9

console.log(lowerBound(arr, 3));       // 4 (birinchi 3 ning indeksi)
console.log(upperBound(arr, 3));       // 6 (3 dan keyingi birinchi element)
console.log(lowerBound(arr, 4));       // 6 (4 bo'lmaganda — insert joyi)

console.log(countOccurrences(arr, 5)); // 4
console.log(countOccurrences(arr, 4)); // 0
console.log(countOccurrences(arr, 2)); // 3`,
      },
      {
        title: 'Search in Rotated Sorted Array + Find Peak Element',
        language: 'js' as const,
        description: 'Klassik intervyu masalalari — binary search ni nostandard holatlarda qo\'llash.',
        code: `// ═══════════════════════════════════
// SEARCH IN ROTATED SORTED ARRAY
// LeetCode #33 — Medium
// ═══════════════════════════════════
//
// [0,1,2,4,5,6,7] → rotate 3 → [4,5,6,7,0,1,2]
// Target: 0 → return 4

function searchRotated(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;

    // CHAP yarmi SORTED mi?
    if (arr[left] <= arr[mid]) {
      // Target chap sorted qismda bormi?
      if (arr[left] <= target && target < arr[mid]) {
        right = mid - 1; // Chapga qidirish
      } else {
        left = mid + 1;  // O'ngga qidirish
      }
    }
    // O'NG yarmi SORTED
    else {
      // Target o'ng sorted qismda bormi?
      if (arr[mid] < target && target <= arr[right]) {
        left = mid + 1;  // O'ngga qidirish
      } else {
        right = mid - 1; // Chapga qidirish
      }
    }
  }

  return -1;
}

// Test
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 5)); // 1
console.log(searchRotated([1], 1));                      // 0


// ═══════════════════════════════════
// FIND MINIMUM IN ROTATED SORTED ARRAY
// LeetCode #153 — Medium
// ═══════════════════════════════════

function findMin(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] > arr[right]) {
      // Minimum o'ng tomonda
      left = mid + 1;
    } else {
      // Minimum chap tomonda (mid ham bo'lishi mumkin)
      right = mid;
    }
  }

  return arr[left]; // left === right — minimum
}

console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 0
console.log(findMin([3, 4, 5, 1, 2]));         // 1
console.log(findMin([1, 2, 3, 4, 5]));         // 1 (rotate qilinmagan)


// ═══════════════════════════════════
// FIND PEAK ELEMENT
// LeetCode #162 — Medium
// ═══════════════════════════════════
//
// Peak: arr[i] > arr[i-1] AND arr[i] > arr[i+1]
// arr[-1] = arr[n] = -Infinity deb hisoblanadi

function findPeakElement(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] > arr[mid + 1]) {
      // Peak chap tomonda (mid ham bo'lishi mumkin)
      right = mid;
    } else {
      // Peak o'ng tomonda
      left = mid + 1;
    }
  }

  return left; // Peak element indeksi
}

console.log(findPeakElement([1, 2, 3, 1]));       // 2 (element 3)
console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 5 (element 6)
// Izoh: bir nechta peak bo'lishi mumkin, HAR QANDAY birini qaytarish kifoya


// ═══════════════════════════════════
// SQRT(X) — Binary Search bilan
// LeetCode #69 — Easy
// ═══════════════════════════════════

function mySqrt(x) {
  if (x < 2) return x;

  let left = 1;
  let right = Math.floor(x / 2); // sqrt(x) doim x/2 dan kichik

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const square = mid * mid;

    if (square === x) return mid;
    if (square < x) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return right; // Floor qiymat
}

console.log(mySqrt(8));  // 2 (2.828... → 2)
console.log(mySqrt(16)); // 4
console.log(mySqrt(1));  // 1`,
      },
    ],
    interviewQA: [
      {
        question: 'Binary Search qanday ishlaydi? Asosiy sharti nima?',
        answer: `Binary Search — sorted array da har qadamda qidirish maydonini YARMIGA kamaytiradi. Asosiy shart — array SORTED bo'lishi kerak. Ishlash: left=0, right=n-1, mid hisoblash, arr[mid] ni target bilan taqqoslash. Agar teng — topildi. Agar kichik — left=mid+1 (o'ng yarmida). Agar katta — right=mid-1 (chap yarmida). left > right bo'lganda to'xtash — topilmadi. Time: O(log n), Space: O(1) iterativ versiyada.`,
      },
      {
        question: 'O(log n) qanday hosil bo\'ladi? Misol bilan tushuntiring.',
        answer: `O(log n) — har qadamda muammo hajmi YARMIGA kamayadi. 16 elementli array: 1-qadam → 8, 2-qadam → 4, 3-qadam → 2, 4-qadam → 1. Jami 4 qadam = log₂(16). 1,000,000 element uchun faqat ~20 qadam (log₂(1,000,000) ≈ 20). Har safar 2 ga bo'lganimiz uchun log₂ bo'ladi. Bu eksponensial teskari — 2²⁰ = 1,048,576, shuning uchun 20 qadamda million elementdan qidirish mumkin. Shu sababli Binary Search juda samarali — Linear Search 500,000 taqqoslash qiladigan joyda Binary Search 20 ta qiladi.`,
      },
      {
        question: 'Rotated sorted array da qanday qidirish mumkin? (LeetCode #33)',
        answer: `[4,5,6,7,0,1,2] — sorted array aylantirilgan. Oddiy binary search ishlamaydi, lekin modified binary search O(log n) da ishlaydi. Kalit g'oya: har doim BIR yarmi SORTED bo'ladi. mid topgandan keyin: 1) arr[left] <= arr[mid] bo'lsa — CHAP yarmi sorted; 2) aks holda — O'NG yarmi sorted. Sorted yarmida target bor-yo'qligini tekshirish oson (diapazon tekshirish). Agar bor — o'sha tomonga, aks holda — boshqa tomonga. Har qadamda yarmi kesiladi → O(log n). Bu pattern da asosiy xato — chegaraviy holatlarni (edge case) to'g'ri boshqarish, ayniqsa arr[left] === arr[mid] holati.`,
      },
      {
        question: 'Binary Search ni iterativ va rekursiv yozing — farqi nima?',
        answer: `Iterativ: while(left <= right) loop, left/right/mid o'zgaruvchilar. Space O(1). Rekursiv: base case (left > right → -1), har chaqiruvda left yoki right o'zgaradi. Space O(log n) — rekursiya stack. Farqlari: 1) Space — iterativ O(1), rekursiv O(log n) stack frame. 2) Performance — iterativ tezroq, chunki function call overhead yo'q. 3) O'qilishi — rekursiv ba'zan tushunarli, lekin binary search uchun iterativ oddiyroq. 4) Stack overflow — juda katta array da rekursiv versiya stack overflow berishi mumkin (amalda kam uchraydi, chunki log n kichik). TAVSIYA: intervyuda iterativ yozing — sodda, xavfsiz, samaraliroq.`,
      },
    ],
    relatedTopics: [
      { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'big-o', label: 'Big O Notation' },
      { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'sorting-algorithms', label: 'Sorting Algorithms' },
      { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'array-string-patterns', label: 'Array & String Patterns' },
    ],
  }
