import type { Topic } from '../../../types'

export const sortingAlgorithms: Topic = {
    id: 'sorting-algorithms',
    title: 'Sorting Algorithms (Saralash)',
    importance: 3,
    status: 'to-learn',
    description: 'Bubble, Selection, Insertion, Merge, Quick Sort — complexity taqqoslash',
    content: `Sorting — dasturlashda eng ko'p uchraydigan masalalardan biri. Intervyuda deyarli har doim sorting haqida so'rashadi: algoritmlarni bilish, complexity tahlil qilish, va real-world trade-off larni tushunish kerak.

═══════════════════════════════════════
  NEGA SORTING MUHIM?
═══════════════════════════════════════

1. Intervyu klassikasi — FAANG/Big Tech kompaniyalarda deyarli har doim so'raladi
2. Algoritmik fikrlashni namoyon qiladi
3. Time/Space complexity tahlilini yaxshi o'rgatadi
4. Binary Search kabi algoritmlar SORTED array talab qiladi
5. Real-world: database indexing, UI rendering, data processing

═══════════════════════════════════════
  BUBBLE SORT — O(n²)
═══════════════════════════════════════

Eng sodda sorting algoritm. Qo'shni elementlarni taqqoslab, kattasini o'ngga suradi.
Har bir "pass" da eng katta element oxiriga "bubble" qiladi (ko'pikday ko'tariladi).

Xususiyatlari:
- Time: O(n²) average/worst, O(n) best (agar array allaqachon sorted)
- Space: O(1) — in-place, qo'shimcha xotira kerak emas
- Stable: Ha — teng elementlar tartibini saqlaydi
- Adaptive: Ha — deyarli sorted array uchun tez ishlaydi (optimized versiya)

Qachon ishlatiladi:
- O'quv maqsadida — tushunish uchun eng oson
- Juda kichik datasetlar (n < 20)
- Production da ISHLATILMAYDI

═══════════════════════════════════════
  SELECTION SORT — O(n²)
═══════════════════════════════════════

Har bir qadamda eng kichik elementni topib, uni joy almashadi.

Xususiyatlari:
- Time: O(n²) — best, average va worst HAMMASI bir xil
- Space: O(1) — in-place
- Stable: YO'Q — teng elementlar tartibini buzishi mumkin
- Adaptive: Yo'q — sorted array uchun ham O(n²)
- Swap soni minimal: har qadamda faqat 1 ta swap

Qachon ishlatiladi:
- Swap operatsiyasi qimmat bo'lganda (memory write kam)
- Production da ISHLATILMAYDI

═══════════════════════════════════════
  INSERTION SORT — O(n²)
═══════════════════════════════════════

Har bir elementni o'z joyiga "qistiradi" — xuddi qo'ldagi kartalarni saralash kabi.
Chapdan o'ngga yuradi, har bir yangi elementni sorted qismdagi to'g'ri joyga qo'yadi.

Xususiyatlari:
- Time: O(n²) average/worst, O(n) best (deyarli sorted array)
- Space: O(1) — in-place
- Stable: Ha
- Adaptive: Ha — deyarli sorted array uchun juda tez
- Online: Ha — elementlar kelganda saralash mumkin (stream)

Qachon ishlatiladi:
- Kichik datasetlar (n < 50)
- Deyarli tartiblangan ma'lumotlar
- TimSort ichida kichik qismlar uchun ishlatiladi
- Real-world da aslida foydali — kichik arraylar uchun Merge/Quick dan tezroq

═══════════════════════════════════════
  MERGE SORT — O(n log n)
═══════════════════════════════════════

Divide and Conquer strategiyasi:
1. Array ni ikkiga BO'L (divide)
2. Har bir yarmini rekursiv saralash (conquer)
3. Ikki sorted yarmini BIRLASHTIR (merge)

Xususiyatlari:
- Time: O(n log n) — best, average, worst HAMMASI
- Space: O(n) — qo'shimcha array kerak (NOT in-place)
- Stable: Ha
- Adaptive: Yo'q (doim O(n log n))
- Parallelizable: Ha — divide qismini parallel qilish mumkin

Nima uchun O(n log n)?
- Array har safar 2 ga bo'linadi → log n daraja
- Har bir darajada n ta element merge qilinadi
- Jami: n × log n

Qachon ishlatiladi:
- Stability kerak bo'lganda (teng elementlar tartibini saqlash)
- Guaranteed O(n log n) kerak bo'lganda
- Linked list sorting (extra space kerak emas)
- External sorting (disk-based data)

═══════════════════════════════════════
  QUICK SORT — O(n log n) average
═══════════════════════════════════════

Divide and Conquer, lekin Merge Sort dan farqli:
1. PIVOT tanlash
2. Elementlarni pivot atrofida PARTITION qilish (kichiklar chapga, kattalar o'ngga)
3. Chap va o'ng qismlarni rekursiv saralash

Xususiyatlari:
- Time: O(n log n) average, O(n²) worst case (yomon pivot)
- Space: O(log n) — rekursiya stack uchun
- Stable: YO'Q
- In-place: Ha (Merge Sort dan farqli — extra array KERAK EMAS)
- Cache-friendly: Ha — ketma-ket xotira bilan ishlaydi

Worst case qachon bo'ladi?
- Allaqachon sorted array + birinchi/oxirgi element pivot bo'lsa
- Barcha elementlar bir xil bo'lsa
- Yechim: Random pivot yoki Median-of-three

Qachon ishlatiladi:
- General-purpose sorting — eng ko'p ishlatiladigan
- In-place sorting kerak bo'lganda
- Average case performance muhim bo'lganda
- Ko'pchilik tillarning standard sort() implementatsiyasi

═══════════════════════════════════════
  COUNTING SORT — O(n + k)
═══════════════════════════════════════

Comparison-based EMAS — elementlarni sanaydi.
Faqat INTEGER va CHEKLANGAN DIAPAZON uchun ishlaydi.

Qanday ishlaydi:
1. Har bir qiymat necha marta uchrashini sanash
2. Kumulyativ sum hisoblash
3. Elementlarni to'g'ri joyga qo'yish

Xususiyatlari:
- Time: O(n + k), k = qiymatlar diapazoni
- Space: O(n + k)
- Stable: Ha
- Comparison-based emas → O(n log n) chegarasini buzadi

Qachon ishlatiladi:
- Qiymatlar diapazoni kichik bo'lganda (masalan, yoshlar 0-150)
- Faqat integer/enum uchun
- Radix Sort ning ichki qismi sifatida

═══════════════════════════════════════
  COMPARISON TABLE
═══════════════════════════════════════

  Algoritm        Best       Average     Worst       Space    Stable
  ─────────────────────────────────────────────────────────────────────
  Bubble Sort     O(n)       O(n²)       O(n²)       O(1)     Ha
  Selection Sort  O(n²)      O(n²)       O(n²)       O(1)     Yo'q
  Insertion Sort  O(n)       O(n²)       O(n²)       O(1)     Ha
  Merge Sort      O(n log n) O(n log n)  O(n log n)  O(n)     Ha
  Quick Sort      O(n log n) O(n log n)  O(n²)       O(log n) Yo'q
  Counting Sort   O(n+k)     O(n+k)      O(n+k)      O(n+k)   Ha

═══════════════════════════════════════
  JAVASCRIPT Array.sort()
═══════════════════════════════════════

JavaScript ning Array.prototype.sort() metodi TimSort algoritmini ishlatadi.
TimSort — Merge Sort va Insertion Sort ning GIBRIDI:

1. Array ni kichik "run" larga bo'ladi (32-64 element)
2. Har bir run ni Insertion Sort bilan saralaydi (kichik array uchun tez)
3. Run larni Merge Sort bilan birlashtiradi

Xususiyatlari:
- Time: O(n log n) worst, O(n) best (allaqachon sorted)
- Space: O(n)
- Stable: Ha (ECMAScript 2019 dan boshlab barcha brauzerlarda)
- Adaptive: Ha — deyarli sorted data uchun juda tez

MUHIM GOTCHA:
sort() default bo'yicha STRINGGA aylantiradi!
[10, 9, 2, 1].sort() → [1, 10, 2, 9] — NOTO'G'RI!
[10, 9, 2, 1].sort((a, b) => a - b) → [1, 2, 9, 10] — TO'G'RI

Comparator qoidasi:
- Manfiy qaytarsa → a birinchi
- 0 qaytarsa → tartib o'zgarmaydi
- Musbat qaytarsa → b birinchi`.trim(),
    codeExamples: [
      {
        title: 'Bubble Sort + Insertion Sort implementatsiya',
        language: 'js' as const,
        description: 'Ikki sodda O(n²) sorting algoritm — to\'liq implementatsiya va optimizatsiya bilan.',
        code: `// ═══════════════════════════════════
// BUBBLE SORT — O(n²)
// ═══════════════════════════════════

function bubbleSort(arr) {
  const n = arr.length;
  // Tashqi loop — har bir pass da eng katta element oxiriga boradi
  for (let i = 0; i < n - 1; i++) {
    let swapped = false; // Optimizatsiya: swap bo'lmasa — allaqachon sorted

    // Ichki loop — qo'shni elementlarni taqqoslash
    for (let j = 0; j < n - 1 - i; j++) {
      //                    ^^^ -i chunki oxirgi i ta element allaqachon joyida
      if (arr[j] > arr[j + 1]) {
        // Swap — kattasi o'ngga surish
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // Agar birorta ham swap bo'lmasa — array sorted
    if (!swapped) break; // Best case O(n) — deyarli sorted array uchun
  }
  return arr;
}

// ═══════════════════════════════════
// INSERTION SORT — O(n²)
// ═══════════════════════════════════

function insertionSort(arr) {
  const n = arr.length;
  // 0-indeks allaqachon "sorted" — 1 dan boshlaymiz
  for (let i = 1; i < n; i++) {
    const key = arr[i]; // Hozirgi element — "karta"
    let j = i - 1;

    // key dan katta elementlarni o'ngga surish
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j]; // O'ngga surish
      j--;
    }

    // key ni to'g'ri joyga qo'yish
    arr[j + 1] = key;
  }
  return arr;
}

// Test
const arr1 = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort([...arr1]));    // [11, 12, 22, 25, 34, 64, 90]
console.log(insertionSort([...arr1])); // [11, 12, 22, 25, 34, 64, 90]

// Best case test — deyarli sorted
const sorted = [1, 2, 3, 4, 6, 5, 7, 8]; // faqat 5 va 6 o'rni noto'g'ri
console.log(bubbleSort([...sorted]));    // 1 pass da topadi
console.log(insertionSort([...sorted])); // faqat 1 ta shift kerak`,
      },
      {
        title: 'Merge Sort — recursive, to\'liq implementatsiya',
        language: 'js' as const,
        description: 'Divide and Conquer — array ni ikkiga bo\'lib, rekursiv saralab, merge qilish. O(n log n) guaranteed.',
        code: `// ═══════════════════════════════════
// MERGE SORT — O(n log n), Stable
// ═══════════════════════════════════

function mergeSort(arr) {
  // Base case — 1 yoki 0 element allaqachon sorted
  if (arr.length <= 1) return arr;

  // 1. DIVIDE — ikkiga bo'lish
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // 2. CONQUER — rekursiv saralash
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  // 3. MERGE — ikki sorted array ni birlashtirish
  return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
  const result = [];
  let i = 0; // left pointer
  let j = 0; // right pointer

  // Ikki sorted array ni taqqoslab birlashtirish
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      //      ^^ <= stable qiladi (teng bo'lsa chapdan oladi)
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Qolgan elementlarni qo'shish
  // Faqat bittasi qolgan bo'ladi
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

// Test
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]

// Stability test — teng elementlar tartibini saqlaydi
const students = [
  { name: 'Ali', grade: 90 },
  { name: 'Vali', grade: 85 },
  { name: 'Soli', grade: 90 },
  { name: 'Gani', grade: 85 },
];

function mergeSortBy(arr, compareFn) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortBy(arr.slice(0, mid), compareFn);
  const right = mergeSortBy(arr.slice(mid), compareFn);

  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

const sorted = mergeSortBy(students, (a, b) => b.grade - a.grade);
console.log(sorted);
// Ali(90) → Soli(90) → Vali(85) → Gani(85)
// Teng grade-lar ichida ASL TARTIB saqlanadi (stable!)`,
      },
      {
        title: 'Quick Sort — Lomuto partition, to\'liq implementatsiya',
        language: 'js' as const,
        description: 'In-place sorting — Lomuto partition sxemasi bilan. O(n log n) average, random pivot bilan worst case oldini olish.',
        code: `// ═══════════════════════════════════
// QUICK SORT — O(n log n) average
// ═══════════════════════════════════

function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition — pivot ni to'g'ri joyga qo'yish
    const pivotIndex = partition(arr, low, high);

    // Chap va o'ng qismlarni rekursiv saralash
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

// LOMUTO PARTITION SXEMASI
function partition(arr, low, high) {
  // Random pivot — worst case oldini olish
  const randomIndex = low + Math.floor(Math.random() * (high - low + 1));
  [arr[randomIndex], arr[high]] = [arr[high], arr[randomIndex]];

  const pivot = arr[high]; // Oxirgi element = pivot
  let i = low - 1; // Kichik elementlar chegarasi

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Kichik elementni chapga surish
    }
  }

  // Pivot ni to'g'ri joyga qo'yish
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1; // Pivot ning final indeksi
}

// Test
const arr = [10, 80, 30, 90, 40, 50, 70];
console.log(quickSort([...arr]));
// [10, 30, 40, 50, 70, 80, 90]

// ═══════════════════════════════════
// QUICK SORT — 3-Way Partition
// (Ko'p dublikat bo'lganda optimal)
// ═══════════════════════════════════

function quickSort3Way(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return arr;

  let lt = low;      // pivot dan kichiklar chegarasi
  let gt = high;     // pivot dan kattalar chegarasi
  let i = low + 1;   // hozirgi element
  const pivot = arr[low];

  while (i <= gt) {
    if (arr[i] < pivot) {
      [arr[lt], arr[i]] = [arr[i], arr[lt]];
      lt++;
      i++;
    } else if (arr[i] > pivot) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
      // i o'zgarmaydi — almashtirilgan elementni tekshirish kerak
    } else {
      i++; // pivot ga teng — joyida qoladi
    }
  }

  // Endi: [low..lt-1] < pivot, [lt..gt] == pivot, [gt+1..high] > pivot
  quickSort3Way(arr, low, lt - 1);
  quickSort3Way(arr, gt + 1, high);
  return arr;
}

// Dublikat test
const dupes = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
console.log(quickSort3Way([...dupes]));
// [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]`,
      },
      {
        title: 'Array.sort() — comparator misollari va gotchas',
        language: 'js' as const,
        description: 'JavaScript ning built-in sort() — TimSort, comparator funksiyasi va eng keng tarqalgan xatolar.',
        code: `// ═══════════════════════════════════
// GOTCHA #1: Default sort STRING ga aylantiradi!
// ═══════════════════════════════════

const numbers = [10, 9, 2, 1, 100, 21];

// NOTO'G'RI — string sifatida saralaydi
console.log(numbers.sort());
// [1, 10, 100, 2, 21, 9] — "10" < "2" chunki "1" < "2"

// TO'G'RI — comparator bilan
console.log([...numbers].sort((a, b) => a - b));
// [1, 2, 9, 10, 21, 100]

// Kamayish tartibida
console.log([...numbers].sort((a, b) => b - a));
// [100, 21, 10, 9, 2, 1]


// ═══════════════════════════════════
// GOTCHA #2: sort() ORIGINAL array ni o'zgartiradi!
// ═══════════════════════════════════

const original = [3, 1, 2];
const sorted = original.sort((a, b) => a - b);

console.log(original); // [1, 2, 3] — O'ZGARGAN!
console.log(sorted === original); // true — bir xil referens!

// Yechim — nusxa qilish:
const safe = [...original].sort((a, b) => a - b);
// yoki: original.slice().sort(...)
// yoki: Array.from(original).sort(...)
// yoki: original.toSorted((a, b) => a - b) — ES2023, yangi array qaytaradi


// ═══════════════════════════════════
// Object array saralash
// ═══════════════════════════════════

const users = [
  { name: 'Vali', age: 30 },
  { name: 'Ali', age: 25 },
  { name: 'Soli', age: 35 },
  { name: 'Ali', age: 20 },
];

// Yosh bo'yicha
users.sort((a, b) => a.age - b.age);
// [{Ali,20}, {Ali,25}, {Vali,30}, {Soli,35}]

// Ism bo'yicha (string)
users.sort((a, b) => a.name.localeCompare(b.name));
// [{Ali,25}, {Ali,20}, {Soli,35}, {Vali,30}]

// Multi-sort: avval ism, keyin yosh
users.sort((a, b) => {
  const nameCompare = a.name.localeCompare(b.name);
  if (nameCompare !== 0) return nameCompare;
  return a.age - b.age; // Ism bir xil bo'lsa — yosh bo'yicha
});
// [{Ali,20}, {Ali,25}, {Soli,35}, {Vali,30}]


// ═══════════════════════════════════
// toSorted() — ES2023 (immutable)
// ═══════════════════════════════════

const arr = [3, 1, 4, 1, 5];
const sorted2 = arr.toSorted((a, b) => a - b);

console.log(arr);     // [3, 1, 4, 1, 5] — o'zgarmagan!
console.log(sorted2); // [1, 1, 3, 4, 5] — yangi array


// ═══════════════════════════════════
// Comparator qoidasi xulosa
// ═══════════════════════════════════

// compareFn(a, b):
//   < 0  → a birinchi (a chapda)
//   = 0  → tartib o'zgarmaydi (stable)
//   > 0  → b birinchi (b chapda)

// O'sish:  (a, b) => a - b
// Kamayish: (a, b) => b - a
// String:  (a, b) => a.localeCompare(b)
// Boolean: (a, b) => Number(a.active) - Number(b.active)`,
      },
    ],
    interviewQA: [
      {
        question: 'Merge Sort va Quick Sort farqi nima? Qaysi biri yaxshiroq?',
        answer: `Merge Sort — DOIM O(n log n), stable, lekin O(n) extra space kerak. Quick Sort — O(n log n) average, lekin worst case O(n²), in-place (O(log n) stack), unstable. Amalda Quick Sort tezroq — cache-friendly (ketma-ket xotira bilan ishlaydi), constant factor kichikroq. Shuning uchun ko'p tillar Quick Sort ni standard qilgan. Lekin stability kerak bo'lsa yoki guaranteed O(n log n) kerak bo'lsa — Merge Sort. JavaScript ning sort() esa TimSort ishlatadi — Merge + Insertion gibrid, stable va adaptive.`,
      },
      {
        question: 'Array.sort() qanday algoritm ishlatadi? Comparator bersangiz nima bo\'ladi?',
        answer: `JavaScript Array.sort() TimSort algoritmini ishlatadi — Merge Sort va Insertion Sort gibridi. Array ni kichik "run" larga bo'ladi (odatda 32-64), har birini Insertion Sort bilan saralaydi, keyin Merge Sort bilan birlashtiradi. O(n log n) worst, O(n) best (sorted data uchun), stable. MUHIM: comparator bermasangiz, sort() elementlarni STRING ga aylantiradi va Unicode bo'yicha saralaydi. [10, 2, 1].sort() → [1, 10, 2]. Raqamlar uchun DOIM (a, b) => a - b berish kerak. Comparator manfiy qaytarsa a birinchi, musbat qaytarsa b birinchi, 0 bo'lsa tartib o'zgarmaydi.`,
      },
      {
        question: 'Stable sort nima va nega muhim?',
        answer: `Stable sort — teng qiymatli elementlarning ASLIY TARTIBINI saqlaydi. Masalan: [{Ali, 90}, {Vali, 85}, {Soli, 90}] ni grade bo'yicha saralaganada, stable sort Ali ni doim Soli dan OLDIN qo'yadi (chunki aslida ham shunday edi). Unstable sort bu tartibni buzishi mumkin. Nega muhim: 1) Multi-level sort — avval ism, keyin yosh bo'yicha saralaganda, birinchi saralash natijasi saqlanishi kerak; 2) UI consistency — foydalanuvchi sortlaganda elementlar "sakrab" o'rnini almashtirmasligi kerak; 3) Database natijalarini qayta saralashda kutilgan tartibni saqlash. Bubble Sort, Insertion Sort, Merge Sort, TimSort — stable. Selection Sort, Quick Sort — unstable.`,
      },
      {
        question: 'Qaysi sorting O(n) da ishlaydi? Qachon ishlatish mumkin?',
        answer: `Counting Sort, Radix Sort, Bucket Sort — bular O(n) da ishlaydi, lekin COMPARISON-BASED EMAS. Comparison-based sorting algoritmlar O(n log n) dan tez bo'la OLMAYDI — bu matematik jihatdan isbotlangan (decision tree model). Counting Sort O(n+k) — k qiymatlar diapazoni. Faqat INTEGER va CHEKLANGAN diapazon uchun ishlaydi. Masalan, yoshlarni saralash (0-150) — O(n+150) ≈ O(n). Lekin agar k >> n bo'lsa (masalan, 100 ta element, qiymat 0 dan 1 milliongacha), O(n+k) ≈ O(k) bo'lib, samarasiz. Radix Sort — har bir razryadni Counting Sort bilan saralaydi, O(d*(n+k)), d=razryadlar soni. Katta integer yoki string uchun foydali.`,
      },
    ],
    relatedTopics: [
      { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'big-o', label: 'Big O Notation' },
      { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'array-string-patterns', label: 'Array & String Patterns' },
      { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'searching-algorithms', label: 'Searching Algorithms' },
    ],
  }
