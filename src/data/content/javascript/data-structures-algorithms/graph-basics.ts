import type { Topic } from '../../../types'

export const graphBasics: Topic = {
  id: 'graph-basics',
  title: 'Graph Asoslari (BFS/DFS)',
  importance: 2,
  status: 'to-learn',
  description: 'Adjacency list, BFS, DFS, shortest path, topological sort',
  content: `
Graph — bu tugunlar (vertices/nodes) va ularni bog'lovchi qirralar (edges) dan tashkil topgan ma'lumotlar tuzilmasi. Array va Tree dan farqli o'laroq, graph da har qanday tugun boshqa har qanday tugunga bog'lanishi mumkin.

═══════════════════════════════════════
  GRAPH TURLARI
═══════════════════════════════════════

1. Directed (Yo'naltirilgan) vs Undirected (Yo'naltirilmagan)

  — Directed graph: qirra faqat bir tomonga ishlaydi (A → B, lekin B → A emas)
    Misol: Twitter follow, web saytlar orasidagi linklar
  — Undirected graph: qirra ikki tomonga ham ishlaydi (A ↔ B)
    Misol: Facebook do'stlik, yo'llar xaritasi

2. Weighted (Og'irlikli) vs Unweighted (Og'irliksiz)

  — Weighted: har bir qirraning "narxi" bor (masofa, vaqt, xarajat)
    Misol: Google Maps — shaharlar orasidagi masofa
  — Unweighted: barcha qirralar teng, narx yo'q
    Misol: social network do'stlik bog'lanishlari

3. Cyclic vs Acyclic

  — Cyclic: sikl bor — bir tugundan boshlab o'sha tugunga qaytish mumkin
  — Acyclic: sikl yo'q — DAG (Directed Acyclic Graph) — dependency graph

═══════════════════════════════════════
  GRAPH NI TASVIRLASH USULLARI
═══════════════════════════════════════

1. Adjacency List (Qo'shnilik ro'yxati) — ENG KO'P ISHLATILADIGAN

  Har bir tugun uchun uning qo'shnilarini saqlash:

  const graph = {
    A: ['B', 'C'],
    B: ['A', 'D'],
    C: ['A', 'D'],
    D: ['B', 'C']
  }

  Afzalliklari:
  — Kam xotira ishlatadi: O(V + E)
  — Sparse (siyrak) graphlar uchun ideal
  — Qo'shnilarni tez iteratsiya qilish mumkin

2. Adjacency Matrix (Qo'shnilik matritsasi)

  V × V o'lchamli 2D massiv, 1 = bog'lanish bor, 0 = yo'q:

      A  B  C  D
  A [ 0, 1, 1, 0 ]
  B [ 1, 0, 0, 1 ]
  C [ 1, 0, 0, 1 ]
  D [ 0, 1, 1, 0 ]

  Afzalliklari:
  — Ikki tugun orasida qirra borligini O(1) da tekshirish
  — Dense (zich) graphlar uchun yaxshi

  Kamchiliklari:
  — Ko'p xotira: O(V²) — katta graphlar uchun muammo
  — Qo'shnilarni topish O(V) vaqt oladi

═══════════════════════════════════════
  BFS — BREADTH-FIRST SEARCH
═══════════════════════════════════════

BFS — "kenglik bo'yicha qidirish". Queue (navbat) ishlatadi.

Ishlash tartibi:
1. Boshlang'ich tugunni queue ga qo'sh
2. Queue dan birinchi elementni ol
3. Uning barcha ko'rilmagan qo'shnilarini queue ga qo'sh
4. Queue bo'sh bo'lguncha takrorlash

Xususiyatlari:
— Level by level (qatma-qat) ko'radi
— Eng qisqa yo'lni topadi (unweighted graph da)
— Vaqt: O(V + E), Xotira: O(V)

Qachon ishlatiladi:
— Shortest path (og'irliksiz graph)
— Level-order traversal
— Eng yaqin natijani topish
— Social network da "6 degrees of separation"

═══════════════════════════════════════
  DFS — DEPTH-FIRST SEARCH
═══════════════════════════════════════

DFS — "chuqurlik bo'yicha qidirish". Stack yoki rekursiya ishlatadi.

Ishlash tartibi:
1. Boshlang'ich tugunni stack ga qo'sh (yoki rekursiv chaqir)
2. Stack dan oxirgi elementni ol
3. Uning birinchi ko'rilmagan qo'shnisiga o'tib ket
4. Boshi berk ko'chaga kirsa — orqaga qayт (backtrack)

Xususiyatlari:
— Iloji boricha chuqurga boradi, keyin orqaga qaytadi
— Barcha yo'llarni ko'radi
— Vaqt: O(V + E), Xotira: O(V) (worst case)

Qachon ishlatiladi:
— Cycle detection (sikl aniqlash)
— Topological sort
— Connectivity tekshirish (bog'langanlik)
— Maze solving (labirint yechish)
— Path existence (yo'l bormi?)

═══════════════════════════════════════
  BFS vs DFS TAQQOSLASH
═══════════════════════════════════════

  Xususiyat          | BFS              | DFS
  ——————————————————|——————————————————|——————————————————
  Ma'lumot tuzilmasi | Queue (FIFO)     | Stack (LIFO)
  Shortest path     | Ha (unweighted)  | Yo'q
  Xotira            | Ko'proq          | Kamroq
  Mukammallik       | Complete          | May not complete
  Qo'llanilish      | Eng yaqin topish | Barcha yo'llar

═══════════════════════════════════════
  TOPOLOGICAL SORT
═══════════════════════════════════════

Topological sort — DAG (Directed Acyclic Graph) dagi tugunlarni shunday tartiblashki, har bir qirra (u → v) uchun u doim v dan OLDIN keladi.

Misol — kurslar tartibi:
  Matematika → Fizika → Mexanika
  Matematika → Informatika
  Informatika → Web Development

  Topological tartib: Matematika, Fizika, Informatika, Mexanika, Web Dev

Qo'llanilishi:
— Package dependency resolution (npm install)
— Build system (Webpack, Makefile)
— Task scheduling (vazifalar tartibi)
— Course prerequisites (kurs ketma-ketligi)

Algorithm (Kahn's — BFS asosida):
1. Har bir tugunning in-degree (kiruvchi qirralar soni) ni hisoblash
2. In-degree = 0 bo'lgan tugunlarni queue ga qo'shish
3. Queue dan olish, natijaga qo'shish
4. Uning qo'shnilarining in-degree ni 1 ga kamaytirish
5. In-degree 0 ga tushganlarni queue ga qo'shish
6. Queue bo'sh bo'lguncha takrorlash

Agar natijadagi tugunlar soni < umumiy tugunlar → CYCLE bor!

═══════════════════════════════════════
  REAL-WORLD MISOLLAR
═══════════════════════════════════════

1. Social Network: foydalanuvchilar = tugunlar, do'stlik = qirralar
   — Do'stlar tavsiyasi: BFS bilan 2-darajali do'stlar
   — "6 degrees of separation": BFS shortest path

2. Route Finding: shaharlar = tugunlar, yo'llar = qirralar
   — Google Maps: weighted graph + Dijkstra algorithm
   — GPS navigatsiya

3. Dependency Graph: paketlar = tugunlar, dependency = qirralar
   — npm/yarn: topological sort bilan o'rnatish tartibi
   — Webpack module bundling

4. DOM Traversal: elementlar = tugunlar, parent-child = qirralar
   — Tree aslida maxsus graph turi
   — document.querySelectorAll — DFS ishlatadi

5. Web Crawler: sahifalar = tugunlar, linklar = qirralar
   — Google bot: BFS bilan sahifalarni indekslash

═══════════════════════════════════════
  MURAKKABLIK JADVALI
═══════════════════════════════════════

  Operatsiya        | Adj. List | Adj. Matrix
  ————————————————|——————————|————————————
  Qirra qo'shish    | O(1)      | O(1)
  Qirra o'chirish   | O(E)      | O(1)
  Qirra tekshirish  | O(V)      | O(1)
  Qo'shnilar        | O(deg)    | O(V)
  Xotira            | O(V + E)  | O(V²)
  BFS/DFS           | O(V + E)  | O(V²)
`.trim(),

  codeExamples: [
    {
      title: 'Graph class (Adjacency List)',
      language: 'js',
      description: 'Adjacency list asosida Graph klassi — addVertex, addEdge, removeVertex, removeEdge, display',
      code: `
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  // ── Tugun qo'shish ──
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
    return this;
  }

  // ── Qirra qo'shish (undirected) ──
  addEdge(v1, v2) {
    // Tugunlar yo'q bo'lsa — avtomatik qo'shish
    this.addVertex(v1);
    this.addVertex(v2);

    if (!this.adjacencyList[v1].includes(v2)) {
      this.adjacencyList[v1].push(v2);
    }
    if (!this.adjacencyList[v2].includes(v1)) {
      this.adjacencyList[v2].push(v1);
    }
    return this;
  }

  // ── Qirra o'chirish ──
  removeEdge(v1, v2) {
    this.adjacencyList[v1] = this.adjacencyList[v1]?.filter(v => v !== v2);
    this.adjacencyList[v2] = this.adjacencyList[v2]?.filter(v => v !== v1);
    return this;
  }

  // ── Tugun o'chirish (barcha bog'liq qirralar bilan) ──
  removeVertex(vertex) {
    if (!this.adjacencyList[vertex]) return this;

    // Avval barcha bog'liq qirralarni o'chirish
    for (const neighbor of this.adjacencyList[vertex]) {
      this.removeEdge(vertex, neighbor);
    }

    delete this.adjacencyList[vertex];
    return this;
  }

  // ── Qo'shnilar ro'yxati ──
  getNeighbors(vertex) {
    return this.adjacencyList[vertex] || [];
  }

  // ── Graph ni ko'rsatish ──
  display() {
    for (const vertex in this.adjacencyList) {
      console.log(\`\${vertex} → \${this.adjacencyList[vertex].join(', ')}\`);
    }
  }
}

// ═══ ISHLATISH ═══

const g = new Graph();

// Shaharlar graph i
g.addEdge('Toshkent', 'Samarqand');
g.addEdge('Toshkent', 'Namangan');
g.addEdge('Samarqand', 'Buxoro');
g.addEdge('Samarqand', 'Namangan');
g.addEdge('Buxoro', 'Xiva');

g.display();
// Toshkent → Samarqand, Namangan
// Samarqand → Toshkent, Buxoro, Namangan
// Namangan → Toshkent, Samarqand
// Buxoro → Samarqand, Xiva
// Xiva → Buxoro

console.log(g.getNeighbors('Samarqand'));
// ['Toshkent', 'Buxoro', 'Namangan']

g.removeVertex('Namangan');
g.display();
// Toshkent → Samarqand
// Samarqand → Toshkent, Buxoro
// Buxoro → Samarqand, Xiva
// Xiva → Buxoro


// ═══ DIRECTED GRAPH (Yo'naltirilgan) ═══

class DirectedGraph extends Graph {
  addEdge(from, to) {
    this.addVertex(from);
    this.addVertex(to);

    if (!this.adjacencyList[from].includes(to)) {
      this.adjacencyList[from].push(to);
    }
    // Teskari qirra qo'shilmaydi!
    return this;
  }

  removeEdge(from, to) {
    this.adjacencyList[from] = this.adjacencyList[from]?.filter(v => v !== to);
    return this;
  }
}

const dg = new DirectedGraph();
dg.addEdge('A', 'B');  // A → B (lekin B → A emas)
dg.addEdge('A', 'C');  // A → C
dg.addEdge('B', 'D');  // B → D
dg.addEdge('C', 'D');  // C → D

dg.display();
// A → B, C
// B → D
// C → D
// D →
`.trim()
    },
    {
      title: 'BFS — Breadth-First Search (Shortest Path)',
      language: 'js',
      description: 'BFS implementatsiyasi — queue bilan qatma-qat qidirish va unweighted graph da eng qisqa yo\'l topish',
      code: `
// ═══ BFS TRAVERSAL ═══

function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];

  visited.add(start);

  while (queue.length > 0) {
    const vertex = queue.shift(); // Queue dan birinchisini olish (FIFO)
    result.push(vertex);

    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}

// Misol graph
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log(bfs(graph, 'A'));
// ['A', 'B', 'C', 'D', 'E', 'F']
// Level 0: A
// Level 1: B, C
// Level 2: D, E, F


// ═══ BFS SHORTEST PATH (Unweighted Graph) ═══

function bfsShortestPath(graph, start, end) {
  if (start === end) return [start];

  const visited = new Set([start]);
  const queue = [[start]]; // Har bir element — yo'l (path)

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    for (const neighbor of graph[current] || []) {
      if (neighbor === end) {
        return [...path, neighbor]; // Topildi!
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return null; // Yo'l topilmadi
}

console.log(bfsShortestPath(graph, 'A', 'F'));
// ['A', 'C', 'F'] — eng qisqa yo'l (2 qadam)
// A → B → E → F ham bor (3 qadam), lekin BFS eng qisqasini topadi

console.log(bfsShortestPath(graph, 'D', 'F'));
// ['D', 'B', 'E', 'F']


// ═══ BFS SHORTEST DISTANCE (parent tracking bilan) ═══

function bfsDistance(graph, start) {
  const distances = { [start]: 0 };
  const parent = { [start]: null };
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift();

    for (const neighbor of graph[current] || []) {
      if (!(neighbor in distances)) {
        distances[neighbor] = distances[current] + 1;
        parent[neighbor] = current;
        queue.push(neighbor);
      }
    }
  }

  return { distances, parent };
}

const { distances, parent } = bfsDistance(graph, 'A');
console.log(distances);
// { A: 0, B: 1, C: 1, D: 2, E: 2, F: 2 }

// Yo'lni qayta tiklash (parent orqali)
function reconstructPath(parent, end) {
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = parent[current];
  }
  return path;
}

console.log(reconstructPath(parent, 'F'));
// ['A', 'C', 'F']


// ═══ BFS LEVEL-BY-LEVEL ═══

function bfsLevels(graph, start) {
  const visited = new Set([start]);
  let currentLevel = [start];
  const levels = [];

  while (currentLevel.length > 0) {
    levels.push([...currentLevel]);
    const nextLevel = [];

    for (const vertex of currentLevel) {
      for (const neighbor of graph[vertex] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          nextLevel.push(neighbor);
        }
      }
    }

    currentLevel = nextLevel;
  }

  return levels;
}

console.log(bfsLevels(graph, 'A'));
// [['A'], ['B', 'C'], ['D', 'E', 'F']]
`.trim()
    },
    {
      title: 'DFS (Recursive + Iterative) + Cycle Detection',
      language: 'js',
      description: 'DFS ning ikki usuli — rekursiv va iterativ, hamda graph da sikl (cycle) borligini aniqlash',
      code: `
// ═══ DFS RECURSIVE ═══

function dfsRecursive(graph, start, visited = new Set()) {
  visited.add(start);
  const result = [start];

  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      result.push(...dfsRecursive(graph, neighbor, visited));
    }
  }

  return result;
}

const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log(dfsRecursive(graph, 'A'));
// ['A', 'B', 'D', 'E', 'F', 'C']
// Avval chuqurga boradi: A → B → D (tub) → E → F → C


// ═══ DFS ITERATIVE (Stack bilan) ═══

function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];

  while (stack.length > 0) {
    const vertex = stack.pop(); // Stack dan oxirgisini olish (LIFO)

    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);

      // Qo'shnilarni teskari tartibda qo'shish
      // (chap tugunni birinchi ko'rish uchun)
      const neighbors = graph[vertex] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i])) {
          stack.push(neighbors[i]);
        }
      }
    }
  }

  return result;
}

console.log(dfsIterative(graph, 'A'));
// ['A', 'B', 'D', 'E', 'F', 'C']


// ═══ DFS — YO'L TOPISH ═══

function dfsHasPath(graph, start, end, visited = new Set()) {
  if (start === end) return true;

  visited.add(start);

  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      if (dfsHasPath(graph, neighbor, end, visited)) {
        return true;
      }
    }
  }

  return false;
}

console.log(dfsHasPath(graph, 'A', 'F')); // true
console.log(dfsHasPath(graph, 'A', 'G')); // false (G tugun yo'q)


// ═══ CYCLE DETECTION — UNDIRECTED GRAPH ═══

function hasCycleUndirected(graph) {
  const visited = new Set();

  function dfs(vertex, parent) {
    visited.add(vertex);

    for (const neighbor of graph[vertex] || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, vertex)) return true;
      } else if (neighbor !== parent) {
        // Ko'rilgan tugun + parent emas = CYCLE!
        return true;
      }
    }

    return false;
  }

  // Har bir komponent uchun tekshirish (disconnected graph)
  for (const vertex in graph) {
    if (!visited.has(vertex)) {
      if (dfs(vertex, null)) return true;
    }
  }

  return false;
}

// Cycle bor
const cyclicGraph = {
  A: ['B', 'C'],
  B: ['A', 'C'],  // A-B-C-A = cycle
  C: ['A', 'B']
};

// Cycle yo'q (tree)
const acyclicGraph = {
  A: ['B', 'C'],
  B: ['A'],
  C: ['A']
};

console.log(hasCycleUndirected(cyclicGraph));  // true
console.log(hasCycleUndirected(acyclicGraph)); // false


// ═══ CYCLE DETECTION — DIRECTED GRAPH ═══

function hasCycleDirected(graph) {
  const WHITE = 0; // Ko'rilmagan
  const GRAY = 1;  // Jarayonda (DFS stack da)
  const BLACK = 2; // Tugallangan

  const color = {};
  for (const vertex in graph) {
    color[vertex] = WHITE;
  }

  function dfs(vertex) {
    color[vertex] = GRAY; // Jarayonga kirdi

    for (const neighbor of graph[vertex] || []) {
      if (color[neighbor] === GRAY) {
        // GRAY tugunga qaytib keldik = CYCLE!
        return true;
      }
      if (color[neighbor] === WHITE) {
        if (dfs(neighbor)) return true;
      }
    }

    color[vertex] = BLACK; // Tugallandi
    return false;
  }

  for (const vertex in graph) {
    if (color[vertex] === WHITE) {
      if (dfs(vertex)) return true;
    }
  }

  return false;
}

// Directed cycle: A → B → C → A
const directedCyclic = {
  A: ['B'],
  B: ['C'],
  C: ['A']  // Cycle!
};

// Directed acyclic (DAG)
const dag = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D'],
  D: []
};

console.log(hasCycleDirected(directedCyclic)); // true
console.log(hasCycleDirected(dag));            // false


// ═══ TOPOLOGICAL SORT (Kahn's Algorithm — BFS) ═══

function topologicalSort(graph) {
  // 1. In-degree hisoblash
  const inDegree = {};
  for (const vertex in graph) {
    if (!(vertex in inDegree)) inDegree[vertex] = 0;
    for (const neighbor of graph[vertex]) {
      inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;
    }
  }

  // 2. In-degree = 0 bo'lganlarni queue ga
  const queue = [];
  for (const vertex in inDegree) {
    if (inDegree[vertex] === 0) queue.push(vertex);
  }

  // 3. BFS
  const result = [];
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);

    for (const neighbor of graph[vertex] || []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Cycle tekshirish
  if (result.length !== Object.keys(inDegree).length) {
    return null; // Cycle bor — topological sort mumkin emas
  }

  return result;
}

// Kurslar dependency graph
const courses = {
  'Matematika': ['Fizika', 'Informatika'],
  'Fizika': ['Mexanika'],
  'Informatika': ['Web Dev'],
  'Mexanika': [],
  'Web Dev': []
};

console.log(topologicalSort(courses));
// ['Matematika', 'Fizika', 'Informatika', 'Mexanika', 'Web Dev']

console.log(topologicalSort(directedCyclic));
// null — cycle bor
`.trim()
    }
  ],

  interviewQA: [
    {
      question: 'BFS va DFS farqi? Qachon qaysi biri yaxshi?',
      answer: `BFS (Breadth-First Search) — queue (FIFO) ishlatadi, qatma-qat (level by level) ko'radi. Unweighted graph da eng qisqa yo'lni kafolatlaydi. Ko'proq xotira ishlatadi chunki butun level ni saqlaydi.

DFS (Depth-First Search) — stack/rekursiya (LIFO) ishlatadi, iloji boricha chuqurga boradi, keyin orqaga qaytadi (backtrack). Kamroq xotira ishlatadi.

Qachon BFS ishlatiladi:
— Eng qisqa yo'l kerak bo'lganda (unweighted graph)
— Eng yaqin natijani topish kerak
— Level-order traversal
— Social network da do'stlar tavsiyasi

Qachon DFS ishlatiladi:
— Yo'l borligini tekshirish (path existence)
— Cycle detection
— Topological sort
— Labirint yechish (maze solving)
— Connected components topish

Murakkablik ikkalasida ham bir xil: O(V + E) vaqt, O(V) xotira.`
    },
    {
      question: 'Adjacency List va Adjacency Matrix farqi?',
      answer: `Adjacency List — har bir tugun uchun qo'shnilar ro'yxatini saqlaydi (odatda Map yoki Object). Xotira: O(V + E). Sparse (siyrak) graphlar uchun ideal.

Adjacency Matrix — V × V o'lchamli 2D massiv, 1 = bog'lanish bor, 0 = yo'q. Xotira: O(V²). Dense (zich) graphlar uchun yaxshi.

Taqqoslash:
— Qirra borligini tekshirish: Matrix O(1), List O(degree)
— Barcha qo'shnilarni olish: Matrix O(V), List O(degree)
— Qirra qo'shish: ikkalasida O(1)
— Xotira: Matrix O(V²), List O(V + E)

Frontend da deyarli doim Adjacency List ishlatiladi, chunki:
1. Ko'pchilik real-world graphlar sparse
2. Kamroq xotira
3. JavaScript Object/Map bilan tabiiy ishlaydi
4. Qo'shnilarni iteratsiya qilish tezroq

Matrix faqat:
— Ikki tugun orasidagi qirrani tez-tez tekshirish kerak bo'lganda
— Graph juda dense bo'lganda (V tugun, V² ga yaqin qirralar)
— Floyd-Warshall kabi algoritmlar uchun`
    },
    {
      question: 'Graph da cycle borligini qanday aniqlash mumkin?',
      answer: `Undirected graph uchun — DFS bilan:
— Har bir tugunni DFS bilan ko'rib chiqish
— Agar qo'shni allaqachon visited bo'lsa VA u parent (kelgan tugun) bo'lmasa — CYCLE bor
— Parent ni tekshirish muhim, chunki undirected graph da A-B qirrasi B-A ham degani

Directed graph uchun — "3 rang" usuli:
— WHITE (0): hali ko'rilmagan
— GRAY (1): DFS stack da, hozir ko'rilmoqda
— BLACK (2): to'liq ko'rib chiqilgan

Agar DFS da GRAY tugunga qaytib kelsak — back edge = CYCLE bor.

Directed graph uchun yana bir usul — Topological Sort (Kahn's algorithm):
— In-degree hisoblash va BFS qilish
— Agar natijadagi tugunlar soni < umumiy tugunlar soni — cycle bor
— Chunki cycle dagi tugunlarning in-degree hech qachon 0 ga tushmaydi

Frontend da cycle detection:
— Module dependency: circular import aniqlash
— State management: circular subscription
— React: useEffect infinite loop (aslida dependency cycle)`
    },
    {
      question: 'Topological sort nima va qachon kerak?',
      answer: `Topological sort — DAG (Directed Acyclic Graph) tugunlarini shunday tartibga solishki, har bir yo'naltirilgan qirra (u → v) uchun u doim v dan OLDIN keladi. Faqat cycle bo'lmagan directed graph uchun ishlaydi.

Ikki asosiy algoritm:
1. Kahn's Algorithm (BFS asosida):
   — In-degree (kiruvchi qirralar) = 0 bo'lgan tugunlardan boshlash
   — Queue dan olish, qo'shnilarning in-degree ni kamaytirish
   — Yangi 0 bo'lganlarni queue ga qo'shish
   — Vaqt: O(V + E)

2. DFS asosida:
   — DFS qilish, tugun "tugallanganda" stack ga qo'shish
   — Stack ni teskari tartibda o'qish
   — Vaqt: O(V + E)

Real-world qo'llanilishi:
— npm/yarn: paketlarni dependency tartibida o'rnatish
— Webpack/Vite: modullarni to'g'ri tartibda bundle qilish
— CI/CD: build steplarni tartibda bajarish
— Database migration: migratsiyalarni ketma-ketlikda qo'llash
— Task scheduler: vazifalarni dependency bo'yicha bajarish
— Kurslar: prerequisite asosida o'qish tartibi

Agar topological sort amalga oshmasa (natija to'liq emas) — graph da cycle bor, bu xatolik deb hisoblanadi (masalan, circular dependency).`
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
      topicId: 'tree-bst',
      label: 'Tree va BST'
    },
    {
      techId: 'javascript',
      sectionId: 'data-structures-algorithms',
      topicId: 'stack-queue',
      label: 'Stack va Queue'
    }
  ]
}
