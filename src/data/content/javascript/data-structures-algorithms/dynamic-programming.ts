import type { Topic } from '../../../types'

export const dynamicProgramming: Topic = {
  id: 'dynamic-programming',
  title: 'Dynamic Programming (DP)',
  importance: 2,
  status: 'to-learn',
  description: 'Memoization, tabulation, overlapping subproblems, optimal substructure',
  content: `
Dynamic Programming (DP) — murakkab masalani kichik qismlarga bo'lib, har bir qism natijasini ESLAB QOLISH orqali qayta hisoblashdan qochish texnikasi. Oddiy qilib aytganda: "Bir marta hisoblagan narsani ikkinchi marta hisoblama — eslab qol!"

═══════════════════════════════════════
  DP NING IKKI SHARTI
═══════════════════════════════════════

Masalani DP bilan yechish uchun ikkita shart bajarilishi kerak:

1. Overlapping Subproblems (Takrorlanuvchi kichik masalalar)
   — Bir xil kichik masala bir necha marta uchraydi
   — Misol: Fibonacci(5) ni hisoblashda Fibonacci(3) ikki marta kerak

2. Optimal Substructure (Optimal quyi tuzilma)
   — Katta masalaning optimal yechimi kichik masalalarning optimal yechimlaridan tuziladi
   — Misol: A → C eng qisqa yo'l = A → B eng qisqa + B → C eng qisqa

Agar ikkala shart bajarilmasa — DP ishlamaydi.

═══════════════════════════════════════
  TOP-DOWN vs BOTTOM-UP
═══════════════════════════════════════

1. Top-Down (Memoization) — "Yuqoridan pastga"

  — Rekursiv yondashuv + cache (eslab qolish)
  — Katta masaladan boshlab, kichik masalalarga bo'lish
  — Faqat KERAKLI kichik masalalar hisoblanadi (lazy)
  — Rekursiya stack limit muammosi bo'lishi mumkin

  function fib(n, memo = {}) {
    if (n in memo) return memo[n];  // Cache dan
    if (n <= 1) return n;
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
  }

2. Bottom-Up (Tabulation) — "Pastdan yuqoriga"

  — Iterativ yondashuv + jadval (table/array)
  — Eng kichik masaladan boshlab, kattaga qarab to'ldirish
  — BARCHA kichik masalalar hisoblanadi (eager)
  — Rekursiya yo'q — stack overflow muammosi yo'q

  function fib(n) {
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
  }

═══════════════════════════════════════
  TOP-DOWN vs BOTTOM-UP TAQQOSLASH
═══════════════════════════════════════

  Xususiyat        | Top-Down (Memo)     | Bottom-Up (Tab)
  ————————————————|————————————————————|———————————————————
  Yondashuv       | Rekursiv + cache    | Iterativ + jadval
  Tartib          | Kattadan kichikka   | Kichikdan kattaga
  Hisoblash       | Lazy (faqat kerak)  | Eager (hammasi)
  Stack overflow  | Mumkin              | Yo'q
  Tushunish       | Osonroq             | Biroz qiyinroq
  Optimallashtirish| Qiyin              | Space optimization oson

═══════════════════════════════════════
  KLASSIK DP MASALALARI
═══════════════════════════════════════

1. Fibonacci — DP ni tushunish uchun eng oddiy misol
   Naive: O(2^n) → Memo: O(n) → Tab: O(n) → Space O(1)

2. Climbing Stairs — n ta zinapoyani 1 yoki 2 qadam bilan necha xil usulda chiqish mumkin?
   dp[i] = dp[i-1] + dp[i-2] (Fibonacci bilan bir xil formula!)

3. Coin Change — berilgan tangalar bilan summani hosil qilish uchun eng kam tangalar soni
   dp[amount] = min(dp[amount], dp[amount - coin] + 1) har bir tanga uchun

4. Longest Common Subsequence (LCS) — ikki string ning eng uzun umumiy ketma-ketligi
   2D DP jadval: dp[i][j] = str1[0..i] va str2[0..j] ning LCS uzunligi

5. 0/1 Knapsack — cheklangan sig'imli sumkaga eng qimmat narsalarni joylashtirish
   dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])

═══════════════════════════════════════
  DP MASALANI ANIQLASH USULLARI
═══════════════════════════════════════

Quyidagi so'zlar masalada DP ehtimolini ko'rsatadi:

— "Necha xil usul bor?" (How many ways?)
— "Eng kam/eng ko'p" (Minimum/Maximum)
— "Mumkinmi?" (Can you reach/achieve?)
— "Eng uzun/eng qisqa" (Longest/Shortest)
— "Sanash" (Count)

Yechish bosqichlari:
1. STATE aniqlash — dp[i] nima anglatadi?
2. TRANSITION (o'tish) — dp[i] ni oldingi qiymatlardan qanday hisoblash?
3. BASE CASE — boshlang'ich qiymatlar (dp[0], dp[1])
4. TARTIB — qaysi tartibda to'ldirish?
5. JAVOB — dp ning qaysi elementi javob?

═══════════════════════════════════════
  FRONTEND DA DP
═══════════════════════════════════════

1. React Virtual DOM Diff Algorithm
   — Ikki daraxtni taqqoslash — LCS ga o'xshash DP
   — O(n) euristik yondashuv ishlatadi (to'liq DP O(n³) bo'lardi)

2. Layout Calculation
   — CSS Flexbox/Grid — bo'sh joyni taqsimlash DP ga o'xshaydi
   — Text wrapping — Knuth-Plass algoritmi (DP asosida)

3. Autocomplete / Search
   — Edit distance (Levenshtein) — ikki so'z orasidagi o'xshashlik
   — Fuzzy matching — DP bilan optimal moslik topish

4. Animation Frame Scheduling
   — Resource allocation — Knapsack ga o'xshash masala
   — Frame budget optimization

═══════════════════════════════════════
  MURAKKABLIK
═══════════════════════════════════════

  Masala               | Vaqt        | Xotira
  ————————————————————|————————————|—————————
  Fibonacci (naive)    | O(2^n)      | O(n) stack
  Fibonacci (memo)     | O(n)        | O(n)
  Fibonacci (tab)      | O(n)        | O(n)
  Fibonacci (space opt)| O(n)        | O(1)
  Climbing Stairs      | O(n)        | O(1)
  Coin Change          | O(n × m)    | O(n)
  LCS                  | O(n × m)    | O(n × m)
  0/1 Knapsack         | O(n × W)    | O(n × W)

  n = input size, m = tangalar/string uzunligi, W = sumka sig'imi
`.trim(),

  codeExamples: [
    {
      title: 'Fibonacci — 4 usul (naive → memo → tab → O(1))',
      language: 'js',
      description: 'Fibonacci sonini hisoblashning 4 usuli — murakkablikni bosqichma-bosqich kamaytirish',
      code: `
// ═══ 1. NAIVE RECURSION — O(2^n) vaqt, O(n) xotira ═══
// Eng yomon usul — har bir qiymat qayta-qayta hisoblanadi

function fibNaive(n) {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// fibNaive(5) daraxt:
//                    fib(5)
//                 /         \\
//            fib(4)          fib(3)
//           /     \\         /     \\
//       fib(3)   fib(2)  fib(2)  fib(1)
//       /   \\    /   \\    /   \\
//   fib(2) fib(1) ...  ...  ...
// fib(3) 2 marta, fib(2) 3 marta hisoblanadi!

console.log(fibNaive(10)); // 55
// fibNaive(40) — bir necha soniya kutish kerak
// fibNaive(50) — deyarli abadiy!


// ═══ 2. MEMOIZATION (Top-Down) — O(n) vaqt, O(n) xotira ═══
// Har bir natija cache da saqlanadi

function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n]; // Cache dan olish
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Yoki Map bilan:
function fibMemoMap(n, memo = new Map()) {
  if (memo.has(n)) return memo.get(n);
  if (n <= 1) return n;

  const result = fibMemoMap(n - 1, memo) + fibMemoMap(n - 2, memo);
  memo.set(n, result);
  return result;
}

console.log(fibMemo(50));  // 12586269025 — bir zumda!
console.log(fibMemo(100)); // 354224848179261915000


// ═══ 3. TABULATION (Bottom-Up) — O(n) vaqt, O(n) xotira ═══
// Iterativ — stack overflow muammosi yo'q

function fibTab(n) {
  if (n <= 1) return n;

  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp[n];
}

console.log(fibTab(50)); // 12586269025


// ═══ 4. SPACE OPTIMIZED — O(n) vaqt, O(1) xotira ═══
// Faqat oxirgi 2 ta qiymat kerak — butun massiv shart emas

function fibOptimal(n) {
  if (n <= 1) return n;

  let prev2 = 0; // fib(i-2)
  let prev1 = 1; // fib(i-1)

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

console.log(fibOptimal(50)); // 12586269025

// ═══ TAQQOSLASH ═══
//
// Usul          | Vaqt   | Xotira | Stack Overflow
// ————————————|———————|———————|———————————————
// Naive         | O(2^n) | O(n)   | Ha (katta n)
// Memoization   | O(n)   | O(n)   | Ha (katta n)
// Tabulation    | O(n)   | O(n)   | Yo'q
// Space Optimal | O(n)   | O(1)   | Yo'q    ← ENG YAXSHI
`.trim()
    },
    {
      title: 'Climbing Stairs + Coin Change',
      language: 'js',
      description: 'Klassik DP masalalari — zinapoya va tanga masalalari',
      code: `
// ═══ CLIMBING STAIRS ═══
// n ta zinani 1 yoki 2 qadam bilan necha xil usulda chiqish mumkin?
//
// Misol: n = 4
// 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2 = 5 usul
//
// Formula: dp[i] = dp[i-1] + dp[i-2]  (Fibonacci!)
// Chunki: i-zinaga yetish = (i-1) dan 1 qadam YOKI (i-2) dan 2 qadam

// Tabulation usuli
function climbStairs(n) {
  if (n <= 2) return n;

  let prev2 = 1; // 1 zina = 1 usul
  let prev1 = 2; // 2 zina = 2 usul

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

console.log(climbStairs(4));  // 5
console.log(climbStairs(10)); // 89

// Agar 1, 2 yoki 3 qadam bo'lsa:
function climbStairsK(n, steps = [1, 2, 3]) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; // 0 zinada turish = 1 usul (hech narsa qilmaslik)

  for (let i = 1; i <= n; i++) {
    for (const step of steps) {
      if (i >= step) {
        dp[i] += dp[i - step];
      }
    }
  }

  return dp[n];
}

console.log(climbStairsK(4, [1, 2]));    // 5
console.log(climbStairsK(4, [1, 2, 3])); // 7


// ═══ COIN CHANGE — Minimum tangalar soni ═══
// Berilgan tangalar bilan summani hosil qilish uchun ENG KAM tangalar
//
// Misol: coins = [1, 5, 10, 25], amount = 30
// Javob: 2 (25 + 5)
//
// dp[i] = i summani hosil qilish uchun eng kam tangalar soni

function coinChange(coins, amount) {
  // dp[i] = i summaga kerak bo'lgan eng kam tangalar
  // Boshlang'ich: Infinity (hali yechim topilmagan)
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 0 summa = 0 tanga

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 5, 10, 25], 30)); // 2 (25 + 5)
console.log(coinChange([1, 5, 10, 25], 11)); // 2 (10 + 1)
console.log(coinChange([2], 3));              // -1 (imkonsiz)
console.log(coinChange([1, 2, 5], 11));       // 3 (5 + 5 + 1)


// ═══ COIN CHANGE 2 — Necha xil usul bor? ═══
// Summani hosil qilishning NECHA XIL usuli bor?
//
// Misol: coins = [1, 2, 5], amount = 5
// 5, 2+2+1, 2+1+1+1, 1+1+1+1+1, 5 = 4 usul

function coinChangeWays(coins, amount) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1; // 0 summa = 1 usul (hech narsa tanlamaslik)

  // Muhim: avval coins, keyin amounts (takrorlanishni oldini olish)
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }

  return dp[amount];
}

console.log(coinChangeWays([1, 2, 5], 5));     // 4
console.log(coinChangeWays([1, 5, 10, 25], 30)); // 18
`.trim()
    },
    {
      title: 'Longest Common Subsequence (LCS) — 2D DP',
      language: 'js',
      description: 'Ikki string ning eng uzun umumiy ketma-ketligini topish — 2D DP jadval bilan',
      code: `
// ═══ LONGEST COMMON SUBSEQUENCE (LCS) ═══
//
// Ikki stringning eng uzun UMUMIY KETMA-KETLIGI
// Subsequence = ketma-ket bo'lishi shart emas, lekin TARTIB saqlanadi
//
// Misol: "ABCBDAB" va "BDCAB"
// LCS = "BCAB" (uzunlik 4)
//
// 2D DP jadval:
// dp[i][j] = text1[0..i-1] va text2[0..j-1] ning LCS uzunligi
//
// Agar text1[i-1] === text2[j-1]:
//   dp[i][j] = dp[i-1][j-1] + 1  (mos keldi — qo'shish)
// Aks holda:
//   dp[i][j] = max(dp[i-1][j], dp[i][j-1])  (eng yaxshisini olish)

function lcsLength(text1, text2) {
  const m = text1.length;
  const n = text2.length;

  // (m+1) × (n+1) jadval yaratish (0-qator va 0-ustun = 0)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}

console.log(lcsLength('ABCBDAB', 'BDCAB')); // 4
console.log(lcsLength('abc', 'abc'));         // 3
console.log(lcsLength('abc', 'def'));         // 0


// ═══ LCS NI QAYTA TIKLASH (Backtrack) ═══

function lcs(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Jadval to'ldirish
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Natijani qayta tiklash — oxiridan boshiga
  let result = '';
  let i = m, j = n;

  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      result = text1[i - 1] + result; // Mos belgi
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--; // Yuqoriga
    } else {
      j--; // Chapga
    }
  }

  return result;
}

console.log(lcs('ABCBDAB', 'BDCAB')); // "BCAB"

// ═══ DP JADVAL VIZUALIZATSIYA ═══
//
//     ""  B  D  C  A  B
// ""   0  0  0  0  0  0
//  A   0  0  0  0  1  1
//  B   0  1  1  1  1  2
//  C   0  1  1  2  2  2
//  B   0  1  1  2  2  3
//  D   0  1  2  2  2  3
//  A   0  1  2  2  3  3
//  B   0  1  2  2  3  4  ← javob: 4


// ═══ EDIT DISTANCE (Levenshtein) — Bonus ═══
// Ikki so'zni bir-biriga aylantirish uchun eng kam operatsiyalar
// Operatsiyalar: insert, delete, replace

function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i; // barcha harfni o'chirish
  for (let j = 0; j <= n; j++) dp[0][j] = j; // barcha harfni qo'shish

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // Hech narsa qilish kerak emas
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // delete
          dp[i][j - 1],     // insert
          dp[i - 1][j - 1]  // replace
        );
      }
    }
  }

  return dp[m][n];
}

console.log(editDistance('kitten', 'sitting')); // 3
console.log(editDistance('horse', 'ros'));       // 3
// Autocomplete va fuzzy search da ishlatiladi
`.trim()
    },
    {
      title: '0/1 Knapsack Problem',
      language: 'js',
      description: 'Klassik 0/1 Knapsack — cheklangan sig\'imli sumkaga eng qimmat narsalarni joylashtirish',
      code: `
// ═══ 0/1 KNAPSACK PROBLEM ═══
//
// Masala: W sig'imli sumka bor. N ta narsa, har birining og'irligi va qiymati bor.
// Har bir narsani OLISH yoki OLMASLIK mumkin (0/1 — bo'lib bo'lmaydi).
// Sumkaga sig'adigan eng QIMMAT to'plamni topish kerak.
//
// Misol:
// Sumka sig'imi: 7 kg
// Narsalar: [{og'irlik: 1, qiymat: 1}, {3, 4}, {4, 5}, {5, 7}]
// Javob: 9 (3kg+4kg narsalar = 4+5 qiymat)
//
// dp[i][w] = dastlabki i ta narsa bilan w sig'imda eng yuqori qiymat
//
// Agar narsa sig'masa (weight[i] > w):
//   dp[i][w] = dp[i-1][w]  (oldingi natija)
// Agar sig'sa:
//   dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
//   (olmaslik yoki olish — qaysi biri yaxshiroq?)

function knapsack(weights, values, capacity) {
  const n = weights.length;

  // (n+1) × (capacity+1) jadval
  const dp = Array.from(
    { length: n + 1 },
    () => new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Narsa sig'maydi
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        // Olmaslik vs olish — eng yaxshisini tanlash
        dp[i][w] = Math.max(
          dp[i - 1][w],                              // Olmaslik
          dp[i - 1][w - weights[i - 1]] + values[i - 1] // Olish
        );
      }
    }
  }

  return dp[n][capacity];
}

const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
const capacity = 7;

console.log(knapsack(weights, values, capacity)); // 9


// ═══ TANLANGAN NARSALARNI ANIQLASH (Backtrack) ═══

function knapsackWithItems(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from(
    { length: n + 1 },
    () => new Array(capacity + 1).fill(0)
  );

  // Jadval to'ldirish
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      }
    }
  }

  // Qaysi narsalar tanlangan — backtrack
  const selectedItems = [];
  let w = capacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      // Bu narsa tanlangan!
      selectedItems.push({
        index: i - 1,
        weight: weights[i - 1],
        value: values[i - 1]
      });
      w -= weights[i - 1];
    }
  }

  return {
    maxValue: dp[n][capacity],
    items: selectedItems.reverse()
  };
}

const result = knapsackWithItems(weights, values, capacity);
console.log(result);
// {
//   maxValue: 9,
//   items: [
//     { index: 1, weight: 3, value: 4 },
//     { index: 2, weight: 4, value: 5 }
//   ]
// }


// ═══ SPACE OPTIMIZED KNAPSACK — O(W) xotira ═══
// Faqat bitta qator yetarli (oldingi qatorni qayta ishlatish)

function knapsackOptimized(weights, values, capacity) {
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    // MUHIM: teskari tartibda! (chapdan o'ngga emas)
    // Chunki har bir narsani faqat 1 marta olish kerak
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }

  return dp[capacity];
}

console.log(knapsackOptimized(weights, values, capacity)); // 9

// ═══ DP JADVAL VIZUALIZATSIYA ═══
//
// weights = [1, 3, 4, 5], values = [1, 4, 5, 7]
//
//         w=0  w=1  w=2  w=3  w=4  w=5  w=6  w=7
// i=0      0    0    0    0    0    0    0    0
// i=1(1,1) 0    1    1    1    1    1    1    1
// i=2(3,4) 0    1    1    4    5    5    5    5
// i=3(4,5) 0    1    1    4    5    6    6    9  ← 3kg(4) + 4kg(5) = 9
// i=4(5,7) 0    1    1    4    5    7    8    9
//
// Javob: dp[4][7] = 9


// ═══ AMALIY MISOL: Frontend Resource Loading ═══
// Sahifaning performance budget = 200KB
// Har bir resursning hajmi va foydalanuvchiga qiymati bor

function optimizeResources(resources, budgetKB) {
  const weights = resources.map(r => r.sizeKB);
  const values = resources.map(r => r.priority);

  const dp = new Array(budgetKB + 1).fill(0);
  const selected = new Array(budgetKB + 1).fill(null).map(() => []);

  for (let i = 0; i < resources.length; i++) {
    for (let w = budgetKB; w >= weights[i]; w--) {
      const withItem = dp[w - weights[i]] + values[i];
      if (withItem > dp[w]) {
        dp[w] = withItem;
        selected[w] = [...selected[w - weights[i]], resources[i].name];
      }
    }
  }

  return {
    maxPriority: dp[budgetKB],
    loadResources: selected[budgetKB]
  };
}

const resources = [
  { name: 'React', sizeKB: 42, priority: 10 },
  { name: 'Lodash', sizeKB: 72, priority: 3 },
  { name: 'Chart.js', sizeKB: 65, priority: 5 },
  { name: 'Moment.js', sizeKB: 67, priority: 2 },
  { name: 'Axios', sizeKB: 14, priority: 7 },
  { name: 'Tailwind', sizeKB: 35, priority: 8 }
];

console.log(optimizeResources(resources, 100));
// { maxPriority: 25, loadResources: ['React', 'Axios', 'Tailwind'] }
`.trim()
    }
  ],

  interviewQA: [
    {
      question: 'Memoization va Tabulation farqi?',
      answer: `Memoization (Top-Down):
— Rekursiv yondashuv + cache (object yoki Map)
— Katta masaladan boshlab kichikka bo'ladi
— Faqat KERAKLI kichik masalalar hisoblanadi (lazy evaluation)
— Kodni yozish osonroq — oddiy rekursiyaga cache qo'shish
— Kamchiligi: rekursiya stack limit (stack overflow xavfi)

Tabulation (Bottom-Up):
— Iterativ yondashuv + jadval (array)
— Eng kichik masaladan boshlab kattaga qarab to'ldiradi
— BARCHA kichik masalalar hisoblanadi (eager evaluation)
— Stack overflow muammosi yo'q
— Space optimization qilish osonroq (masalan, Fibonacci da O(1) xotira)

Qachon qaysi biri yaxshi:
— Memoization: barcha subproblemlar kerak bo'lmaganda, tushunish osonroq bo'lganda
— Tabulation: barcha subproblemlar kerak bo'lganda, space optimization muhim bo'lganda, katta input (stack overflow xavfi) bo'lganda

Amalda ko'pincha Tabulation afzal — chunki iterativ, tezroq (function call overhead yo'q) va optimize qilish oson.`
    },
    {
      question: 'Masalani DP bilan yechish mumkinligini qanday aniqlash?',
      answer: `DP masalasini aniqlash uchun 2 shartni tekshirish kerak:

1. Overlapping Subproblems — bir xil kichik masala bir necha marta takrorlanadimi?
   — Fibonacci: fib(3) bir necha joy da kerak
   — Agar har bir kichik masala faqat 1 marta uchraса — DP emas, oddiy Divide & Conquer

2. Optimal Substructure — katta masalaning optimal yechimi kichik masalalarning optimal yechimlaridan tuzilish mumkinmi?
   — Eng qisqa yo'l: A→C optimal = A→B optimal + B→C optimal
   — Agar bu xususiyat bo'lmasa — Greedy yoki boshqa yondashuv kerak

Masala matnidagi kalit so'zlar:
— "Necha xil usul?" → DP (Climbing Stairs, Coin Change Ways)
— "Eng kam/eng ko'p?" → DP (Coin Change Min, Knapsack)
— "Mumkinmi?" → DP (Subset Sum, Can Jump)
— "Eng uzun/eng qisqa?" → DP (LCS, LIS)

Yechish bosqichlari:
1. State ni aniqlash — dp[i] yoki dp[i][j] nima anglatadi?
2. Transition formulasi — dp[i] ni oldingilardan qanday hisoblash?
3. Base case — dp[0], dp[1] qiymatlari
4. To'ldirish tartibi — chapdan o'ngga? pastdan yuqoriga?
5. Javob — dp[n]? dp[n][m]? max(dp)?`
    },
    {
      question: 'Fibonacci ni O(1) space da qanday yechish mumkin?',
      answer: `Fibonacci ning har bir qadami faqat oldingi IKKITA qiymatga bog'liq:
fib(n) = fib(n-1) + fib(n-2)

Shuning uchun butun massiv saqlash shart emas — faqat 2 ta o'zgaruvchi yetarli:

function fib(n) {
  if (n <= 1) return n;
  let prev2 = 0;  // fib(i-2)
  let prev1 = 1;  // fib(i-1)
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}

Bu "rolling window" yoki "space optimization" deyiladi.

Evolyutsiya:
1. Naive recursion: O(2^n) vaqt, O(n) xotira
2. Memoization: O(n) vaqt, O(n) xotira
3. Tabulation: O(n) vaqt, O(n) xotira
4. Space optimized: O(n) vaqt, O(1) xotira ← ENG YAXSHI

Bu texnika boshqa DP masalalariga ham qo'llaniladi:
— Climbing Stairs: dp[i] = dp[i-1] + dp[i-2] → 2 o'zgaruvchi
— House Robber: dp[i] = max(dp[i-1], dp[i-2] + nums[i]) → 2 o'zgaruvchi
— LCS: O(n*m) jadval → O(min(n,m)) bitta qator

Qoida: agar dp[i] faqat oxirgi K ta qiymatga bog'liq bo'lsa, K ta o'zgaruvchi bilan O(K) = O(1) space ga tushirish mumkin.`
    },
    {
      question: 'Coin Change masalasini tushuntiring',
      answer: `Coin Change masalasi: berilgan tangalar to'plami bilan ma'lum summani hosil qilish uchun ENG KAM tangalar sonini topish.

Misol: coins = [1, 5, 10, 25], amount = 30
Javob: 2 (25 + 5)

Yechim:
dp[i] = i summani hosil qilish uchun eng kam tangalar soni

Transition: dp[i] = min(dp[i - coin] + 1) har bir coin uchun
— Har bir tanga uchun: "agar shu tangani ishlatсам, qolgan summa dp[i - coin] + 1 tanga"
— Eng kamini tanlaymiz

Base case: dp[0] = 0 (0 summa = 0 tanga)
Boshlang'ich: dp[1..amount] = Infinity (hali yechim topilmagan)

function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

Murakkablik: O(amount × coins.length) vaqt, O(amount) xotira

Bu masala Greedy bilan ISHLAMAYDI:
— coins = [1, 3, 4], amount = 6
— Greedy: 4 + 1 + 1 = 3 tanga
— DP: 3 + 3 = 2 tanga ← TO'G'RI

Ikkinchi variant — "Necha xil usul?" (Coin Change 2):
dp[0] = 1, tangalar bo'yicha iteratsiya (tartib muhim — avval coins, keyin amounts).`
    }
  ],

  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'big-o',
      label: 'Big O Notation'
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'array-string-patterns',
      label: 'Array va String Patterns'
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'graph-basics',
      label: 'Graph Asoslari (BFS/DFS)'
    }
  ]
}
