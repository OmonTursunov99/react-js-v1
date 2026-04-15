import type { Topic } from '../../../types'

export const treeBst: Topic = {
  id: 'tree-bst',
  title: 'Tree va Binary Search Tree',
  importance: 2,
  status: 'to-learn',
  description: 'Binary Tree, BST, traversal (DFS/BFS), balancing',
  content: `Tree — ierarxik (daraxtsimon) ma'lumot tuzilmasi bo'lib, u tugunlar (node) va ular orasidagi bog'lanishlardan tashkil topgan. Binary Search Tree (BST) esa tree ning eng muhim turi bo'lib, tez qidirish, qo'shish va o'chirish imkonini beradi.

═══════════════════════════════════════
  TREE ASOSIY TUSHUNCHALARI
═══════════════════════════════════════

▸ NODE (tugun) — ma'lumot saqlaydigan birlik
▸ ROOT (ildiz) — daraxtning eng yuqori tugun (ota-onasi yo'q)
▸ LEAF (barg) — farzandi yo'q tugun (eng pastki tugunlar)
▸ EDGE (qirra) — ikki tugun orasidagi bog'lanish
▸ PARENT — tugunning ota-onasi (tepasidagi tugun)
▸ CHILD — tugunning farzandi (pastidagi tugun)
▸ SIBLING — bir xil parent ga ega tugunlar (aka-uka)
▸ DEPTH (chuqurlik) — root dan tugun gacha bo'lgan qirralar soni
▸ HEIGHT (balandlik) — tugundan eng chuqur leaf gacha bo'lgan qirralar soni
▸ SUBTREE (pastki daraxt) — tugun va uning barcha avlodlari
▸ LEVEL — bir xil chuqurlikdagi tugunlar (root = level 0)

Misol:
        10          ← root (depth: 0, height: 3)
       /  \\
      5    15       ← depth: 1
     / \\     \\
    3   7    20     ← depth: 2
   /
  1                 ← leaf (depth: 3)

═══════════════════════════════════════
  BINARY TREE vs BINARY SEARCH TREE
═══════════════════════════════════════

▸ BINARY TREE (Ikkilik daraxt):
  - Har bir tugunning eng ko'pi bilan 2 ta farzandi bor (left, right)
  - Elementlar tartibsiz bo'lishi mumkin
  - Maxsus qoida yo'q

▸ BINARY SEARCH TREE (BST):
  - Binary Tree ning maxsus turi
  - QOIDA: left < node < right
    - Chap tomdagi BARCHA tugunlar parent dan KICHIK
    - O'ng tomdagi BARCHA tugunlar parent dan KATTA
  - Bu qoida tufayli qidirish juda tez — O(log n)

  BST misol:
        8
       / \\
      3   10
     / \\    \\
    1   6    14
       / \\   /
      4   7 13

  Tekshirish: 3 ning chapi 1 (1 < 3 ✓), o'ngi 6 (6 > 3 ✓)
  8 ning chapi 3 (3 < 8 ✓), o'ngi 10 (10 > 8 ✓)

═══════════════════════════════════════
  TRAVERSAL USULLARI (AYLANIB CHIQISH)
═══════════════════════════════════════

Daraxtning barcha tugunlarini aylanib chiqishning ikki asosiy usuli bor:

▸ DFS (Depth-First Search) — chuqurlikka birinchi:

  1. INORDER (LNR) — Left, Node, Right
     BST uchun: TARTIBLANGAN massiv beradi!
     Misol (yuqoridagi BST): 1, 3, 4, 6, 7, 8, 10, 13, 14

  2. PREORDER (NLR) — Node, Left, Right
     Daraxtni nusxalash yoki serialize qilish uchun foydali.
     Misol: 8, 3, 1, 6, 4, 7, 10, 14, 13

  3. POSTORDER (LRN) — Left, Right, Node
     Daraxtni o'chirish yoki pastdan yuqoriga hisoblash uchun.
     Misol: 1, 4, 7, 6, 3, 13, 14, 10, 8

  DFS xotirada stack ishlatadi (rekursiya yoki aniq stack).

▸ BFS (Breadth-First Search) — kenglikka birinchi:

  LEVEL-ORDER — har bir darajani chapdan o'ngga
  Queue (navbat) ishlatadi.
  Misol: 8, 3, 10, 1, 6, 14, 4, 7, 13

  BFS qachon foydali:
  - Eng yaqin elementni topish kerak bo'lganda
  - Level bo'yicha ishlash kerak bo'lganda
  - Daraxt juda chuqur bo'lganda (DFS stack overflow bo'lishi mumkin)

═══════════════════════════════════════
  BST OPERATSIYALARI VA MURAKKABLIGI
═══════════════════════════════════════

  | Operatsiya  | Average    | Worst Case |
  |-------------|------------|------------|
  | Qidirish    | O(log n)   | O(n)       |
  | Qo'shish    | O(log n)   | O(n)       |
  | O'chirish   | O(log n)   | O(n)       |
  | Traversal   | O(n)       | O(n)       |

  Nega worst case O(n)?
  Agar elementlar tartiblangan holda qo'shilsa, daraxt
  "cho'zilgan" bo'lib qoladi (linked list ga o'xshaydi):

  1 → 2 → 3 → 4 → 5  (bir tomonlama daraxt)

  Bu holatda qidirish O(n) bo'ladi, O(log n) emas.
  Buning oldini olish uchun BALANSLANAGAN daraxtlar kerak.

═══════════════════════════════════════
  BST DA O'CHIRISH — 3 HOLAT
═══════════════════════════════════════

1. LEAF (farzandi yo'q) — shunchaki o'chirish
2. BITTA FARZAND — tugunni farzandi bilan almashtirish
3. IKKI FARZAND — eng muhim holat:
   - O'ng subtree dagi eng kichik element (inorder successor) ni topish
   - Yoki chap subtree dagi eng katta element (inorder predecessor)
   - Shu element bilan almashtirib, keyin eski joydan o'chirish

═══════════════════════════════════════
  REAL-WORLD QOLLANISH
═══════════════════════════════════════

1. DOM TREE — HTML hujjat daraxt tuzilmasida
   <html>
     <body>
       <div>
         <p>Matn</p>
       </div>
     </body>
   </html>

2. FILE SYSTEM — papkalar va fayllar ierarxiyasi
   /home/user/documents/file.txt

3. EXPRESSION PARSING — matematik ifodalar
   (2 + 3) * 4 → daraxt sifatida ifodalanadi

4. AUTOCOMPLETE — prefikslarga asoslangan qidirish (Trie)

5. DATABASE INDEXING — B-Tree va B+ Tree
   Ma'lumotlar bazasida tez qidirish uchun

6. REACT COMPONENT TREE — komponentlar ierarxiyasi
   <App> → <Header> → <Nav> → <Link>

═══════════════════════════════════════
  AVL VA RED-BLACK TREE
═══════════════════════════════════════

Balanslanagan BST lar — worst case ni O(log n) ga kamaytiradi.

▸ AVL TREE:
  - Har bir tugunning chap va o'ng subtree balandligi
    1 dan ko'p farq qilmasligi kerak
  - Qo'shish/o'chirishda rotation (aylanish) qilinadi
  - Qidirish juda tez — qat'iy balanslangan
  - Lekin qo'shish/o'chirish sekinroq (ko'p rotation)

▸ RED-BLACK TREE:
  - Har bir tugun qizil yoki qora rangga ega
  - 5 ta qoida bilan balans saqlanadi
  - AVL ga qaraganda kamroq rotation kerak
  - Java ning TreeMap, C++ ning std::map — Red-Black Tree

  Intervyuda chuqur bilish shart emas, lekin:
  - Nima ekanini bilish kerak
  - Nega kerak ekanini tushuntirish kerak (worst case O(log n) uchun)
  - Rotation tushunchasi (tugunlarni qayta joylash)`.trim(),
  codeExamples: [
    {
      title: 'TreeNode va BST — to\'liq implementatsiya',
      language: 'js',
      description: 'BST class: insert, search (contains), findMin, findMax, remove metodlari.',
      code: `class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  // ═══ QO'SHISH — O(log n) average ═══
  insert(value) {
    const newNode = new TreeNode(value)

    if (!this.root) {
      this.root = newNode
      return this
    }

    let current = this.root
    while (true) {
      // Dublikat bo'lsa — qo'shmaymiz
      if (value === current.value) return this

      if (value < current.value) {
        // Chapga borish
        if (!current.left) {
          current.left = newNode
          return this
        }
        current = current.left
      } else {
        // O'ngga borish
        if (!current.right) {
          current.right = newNode
          return this
        }
        current = current.right
      }
    }
  }

  // ═══ QIDIRISH — O(log n) average ═══
  contains(value) {
    let current = this.root

    while (current) {
      if (value === current.value) return true
      if (value < current.value) {
        current = current.left
      } else {
        current = current.right
      }
    }

    return false
  }

  // ═══ MINIMUM — eng chap tugun ═══
  findMin(node = this.root) {
    if (!node) return null
    let current = node
    while (current.left) {
      current = current.left
    }
    return current.value
  }

  // ═══ MAXIMUM — eng o'ng tugun ═══
  findMax(node = this.root) {
    if (!node) return null
    let current = node
    while (current.right) {
      current = current.right
    }
    return current.value
  }

  // ═══ O'CHIRISH — 3 holat ═══
  remove(value, node = this.root, parent = null) {
    let current = node

    while (current) {
      if (value < current.value) {
        parent = current
        current = current.left
      } else if (value > current.value) {
        parent = current
        current = current.right
      } else {
        // Topildi! 3 holatni tekshiramiz

        // Holat 3: IKKI FARZAND
        if (current.left && current.right) {
          // O'ng subtree dagi eng kichik qiymat (inorder successor)
          current.value = this.findMin(current.right)
          // Shu qiymatni o'ng subtree dan o'chirish
          this.remove(current.value, current.right, current)
        }
        // Holat 1 & 2: LEAF yoki BITTA FARZAND
        else {
          const child = current.left || current.right

          if (!parent) {
            // Root ni o'chirish
            this.root = child
          } else if (parent.left === current) {
            parent.left = child
          } else {
            parent.right = child
          }
        }

        return this
      }
    }

    return this // topilmadi
  }
}

// ═══ ISHLATISH ═══
const bst = new BinarySearchTree()

//         8
//        / \\
//       3   10
//      / \\    \\
//     1   6    14
//        / \\   /
//       4   7 13

bst.insert(8)
bst.insert(3)
bst.insert(10)
bst.insert(1)
bst.insert(6)
bst.insert(14)
bst.insert(4)
bst.insert(7)
bst.insert(13)

console.log(bst.contains(6))   // true
console.log(bst.contains(99))  // false
console.log(bst.findMin())     // 1
console.log(bst.findMax())     // 14

bst.remove(3) // ikki farzandli tugunni o'chirish
console.log(bst.contains(3))   // false`,
    },
    {
      title: 'DFS Traversals — recursive va iterative',
      language: 'js',
      description: 'Inorder (tartiblangan), Preorder (nusxalash), Postorder (o\'chirish) — rekursiv va iterativ usullarda.',
      code: `class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

// Yordamchi: massivdan BST yaratish
function buildBST(values) {
  const bst = { root: null }
  function insert(val) {
    const node = new TreeNode(val)
    if (!bst.root) { bst.root = node; return }
    let curr = bst.root
    while (true) {
      if (val < curr.value) {
        if (!curr.left) { curr.left = node; return }
        curr = curr.left
      } else {
        if (!curr.right) { curr.right = node; return }
        curr = curr.right
      }
    }
  }
  values.forEach(insert)
  return bst.root
}

const root = buildBST([8, 3, 10, 1, 6, 14, 4, 7, 13])

//         8
//        / \\
//       3   10
//      / \\    \\
//     1   6    14
//        / \\   /
//       4   7 13

// ═══════════════════════════════════
// INORDER (LNR) — Left, Node, Right
// BST uchun TARTIBLANGAN natija beradi
// ═══════════════════════════════════

// Rekursiv
function inorderRecursive(node, result = []) {
  if (!node) return result
  inorderRecursive(node.left, result)   // L
  result.push(node.value)               // N
  inorderRecursive(node.right, result)  // R
  return result
}

console.log('Inorder (recursive):', inorderRecursive(root))
// [1, 3, 4, 6, 7, 8, 10, 13, 14] — tartiblangan!

// Iterativ (stack bilan)
function inorderIterative(root) {
  const result = []
  const stack = []
  let current = root

  while (current || stack.length > 0) {
    // Eng chapga borish
    while (current) {
      stack.push(current)
      current = current.left
    }

    current = stack.pop()
    result.push(current.value)  // N
    current = current.right     // R ga o'tish
  }

  return result
}

console.log('Inorder (iterative):', inorderIterative(root))
// [1, 3, 4, 6, 7, 8, 10, 13, 14]

// ═══════════════════════════════════
// PREORDER (NLR) — Node, Left, Right
// Daraxtni serialize/nusxalash uchun
// ═══════════════════════════════════

// Rekursiv
function preorderRecursive(node, result = []) {
  if (!node) return result
  result.push(node.value)                // N
  preorderRecursive(node.left, result)   // L
  preorderRecursive(node.right, result)  // R
  return result
}

console.log('Preorder (recursive):', preorderRecursive(root))
// [8, 3, 1, 6, 4, 7, 10, 14, 13]

// Iterativ (stack bilan)
function preorderIterative(root) {
  if (!root) return []
  const result = []
  const stack = [root]

  while (stack.length > 0) {
    const node = stack.pop()
    result.push(node.value)         // N

    // Stack LIFO — avval right, keyin left (chap birinchi chiqadi)
    if (node.right) stack.push(node.right)
    if (node.left) stack.push(node.left)
  }

  return result
}

console.log('Preorder (iterative):', preorderIterative(root))
// [8, 3, 1, 6, 4, 7, 10, 14, 13]

// ═══════════════════════════════════
// POSTORDER (LRN) — Left, Right, Node
// Daraxtni o'chirish, expression evaluation
// ═══════════════════════════════════

// Rekursiv
function postorderRecursive(node, result = []) {
  if (!node) return result
  postorderRecursive(node.left, result)   // L
  postorderRecursive(node.right, result)  // R
  result.push(node.value)                 // N
  return result
}

console.log('Postorder (recursive):', postorderRecursive(root))
// [1, 4, 7, 6, 3, 13, 14, 10, 8]

// Iterativ (2 stack usuli)
function postorderIterative(root) {
  if (!root) return []
  const result = []
  const stack1 = [root]
  const stack2 = []

  while (stack1.length > 0) {
    const node = stack1.pop()
    stack2.push(node)
    if (node.left) stack1.push(node.left)
    if (node.right) stack1.push(node.right)
  }

  while (stack2.length > 0) {
    result.push(stack2.pop().value)
  }

  return result
}

console.log('Postorder (iterative):', postorderIterative(root))
// [1, 4, 7, 6, 3, 13, 14, 10, 8]`,
    },
    {
      title: 'BFS level-order, maxDepth, isValidBST',
      language: 'js',
      description: 'BFS traversal (queue bilan), daraxt balandligini topish, BST validatsiya — klassik intervyu masalalari.',
      code: `class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

// Yordamchi: massivdan BST yaratish
function buildBST(values) {
  let root = null
  for (const val of values) {
    root = insertBST(root, val)
  }
  return root
}
function insertBST(node, val) {
  if (!node) return new TreeNode(val)
  if (val < node.value) node.left = insertBST(node.left, val)
  else if (val > node.value) node.right = insertBST(node.right, val)
  return node
}

const root = buildBST([8, 3, 10, 1, 6, 14, 4, 7, 13])

// ═══════════════════════════════════
// 1. BFS — LEVEL ORDER TRAVERSAL
// ═══════════════════════════════════
// Har bir darajani alohida massiv sifatida qaytaradi

function levelOrder(root) {
  if (!root) return []

  const result = []
  const queue = [root]

  while (queue.length > 0) {
    const levelSize = queue.length
    const currentLevel = []

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()  // Navbatdan olish (FIFO)
      currentLevel.push(node.value)

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }

    result.push(currentLevel)
  }

  return result
}

console.log('Level Order:', levelOrder(root))
// [[8], [3, 10], [1, 6, 14], [4, 7, 13]]
//
// Level 0:     8
// Level 1:   3, 10
// Level 2:  1, 6, 14
// Level 3: 4, 7, 13

// Oddiy BFS (tekis massiv)
function bfsFlat(root) {
  if (!root) return []
  const result = []
  const queue = [root]

  while (queue.length > 0) {
    const node = queue.shift()
    result.push(node.value)
    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)
  }

  return result
}

console.log('BFS flat:', bfsFlat(root))
// [8, 3, 10, 1, 6, 14, 4, 7, 13]

// ═══════════════════════════════════
// 2. MAX DEPTH (balandlik)
// ═══════════════════════════════════

// Rekursiv — DFS
function maxDepth(node) {
  if (!node) return 0
  const leftDepth = maxDepth(node.left)
  const rightDepth = maxDepth(node.right)
  return Math.max(leftDepth, rightDepth) + 1
}

console.log('Max Depth:', maxDepth(root)) // 4

// Iterativ — BFS
function maxDepthBFS(root) {
  if (!root) return 0

  let depth = 0
  const queue = [root]

  while (queue.length > 0) {
    const levelSize = queue.length
    depth++

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
  }

  return depth
}

console.log('Max Depth (BFS):', maxDepthBFS(root)) // 4

// ═══════════════════════════════════
// 3. IS VALID BST (BST tekshirish)
// ═══════════════════════════════════
// Har bir tugun o'z chegaralari ichida ekanini tekshirish

function isValidBST(node, min = -Infinity, max = Infinity) {
  if (!node) return true

  // Tugun o'z chegarasidan chiqib ketgan
  if (node.value <= min || node.value >= max) {
    return false
  }

  // Chap: max chegarasi = hozirgi tugun qiymati
  // O'ng: min chegarasi = hozirgi tugun qiymati
  return (
    isValidBST(node.left, min, node.value) &&
    isValidBST(node.right, node.value, max)
  )
}

console.log('Is Valid BST:', isValidBST(root)) // true

// Noto'g'ri BST yaratish
const badRoot = new TreeNode(5)
badRoot.left = new TreeNode(1)
badRoot.right = new TreeNode(4)  // 4 < 5 — o'ngda bo'lmasligi kerak!
badRoot.right.left = new TreeNode(3)
badRoot.right.right = new TreeNode(6)

console.log('Bad BST:', isValidBST(badRoot)) // false

// ═══════════════════════════════════
// 4. INVERT BINARY TREE
// ═══════════════════════════════════
// Daraxtni "oyna" ko'rinishiga aylantirish (chap ↔ o'ng)
// Mashhur intervyu savoli (Homebrew muallifi ham yecha olmagan!)

function invertTree(node) {
  if (!node) return null

  // Chap va o'ngni almashtirish
  const temp = node.left
  node.left = node.right
  node.right = temp

  invertTree(node.left)
  invertTree(node.right)

  return node
}

const smallTree = buildBST([4, 2, 7, 1, 3, 6, 9])
console.log('Before invert:', bfsFlat(smallTree))  // [4, 2, 7, 1, 3, 6, 9]

invertTree(smallTree)
console.log('After invert:', bfsFlat(smallTree))   // [4, 7, 2, 9, 6, 3, 1]

// ═══════════════════════════════════
// 5. LOWEST COMMON ANCESTOR (BST)
// ═══════════════════════════════════
// Ikki tugunning eng yaqin umumiy ajdodi

function lowestCommonAncestor(root, p, q) {
  let current = root

  while (current) {
    // Ikkala qiymat ham chapda
    if (p < current.value && q < current.value) {
      current = current.left
    }
    // Ikkala qiymat ham o'ngda
    else if (p > current.value && q > current.value) {
      current = current.right
    }
    // Biri chapda, biri o'ngda (yoki biri hozirgi tugun)
    else {
      return current.value
    }
  }

  return null
}

const bstRoot = buildBST([8, 3, 10, 1, 6, 14, 4, 7, 13])
console.log('LCA(4, 7):', lowestCommonAncestor(bstRoot, 4, 7))   // 6
console.log('LCA(1, 7):', lowestCommonAncestor(bstRoot, 1, 7))   // 3
console.log('LCA(1, 14):', lowestCommonAncestor(bstRoot, 1, 14)) // 8`,
    },
  ],
  interviewQA: [
    {
      question: 'Binary Tree va BST farqi nimada?',
      answer: `Binary Tree — har bir tugunning eng ko'pi bilan 2 ta farzandi (left, right) bo'lgan daraxt. Elementlar tartibsiz bo'lishi mumkin, maxsus qoida yo'q. Binary Search Tree (BST) — Binary Tree ning maxsus turi bo'lib, qat'iy qoida bor: har bir tugunning chap tomonidagi BARCHA tugunlar undan KICHIK, o'ng tomonidagi BARCHA tugunlar undan KATTA bo'lishi kerak (left < node < right). Bu qoida tufayli BST da qidirish O(log n) da ishlaydi — har qadamda yarim daraxtni "tashlash" mumkin (binary search prinsipida). Oddiy binary tree da esa qidirish O(n) — barcha tugunlarni tekshirish kerak.`,
    },
    {
      question: 'Inorder traversal nimani beradi? Nima uchun muhim?',
      answer: `Inorder traversal (LNR — Left, Node, Right) BST da TARTIBLANGAN natija beradi. Masalan, agar BST da [8, 3, 10, 1, 6] bo'lsa, inorder traversal: [1, 3, 6, 8, 10] qaytaradi — o'sish tartibida. Bu xususiyat juda foydali: 1) BST ni tekshirish — inorder natijasi tartiblangan bo'lsa, bu to'g'ri BST. 2) K-chi eng kichik elementni topish — inorder da k-chi element. 3) BST ni tartiblangan massivga aylantirish. 4) Ikki BST ni birlashtirish. Inorder iterativ implementatsiyasi stack bilan amalga oshiriladi: eng chapga borib stack ga push qilamiz, so'ng pop qilib, o'ng farzandga o'tamiz.`,
    },
    {
      question: 'BST da qidirish murakkabligi qanday? Worst case nima?',
      answer: `BST da qidirish average case O(log n) — har qadamda daraxtning yarmini "tashlaymiz" (binary search prinsipida). Agar qidirilayotgan qiymat hozirgi tugundan kichik bo'lsa — chapga, katta bo'lsa — o'ngga boramiz. Lekin WORST CASE O(n) bo'lishi mumkin. Bu daraxt "degenerate" (cho'zilgan) bo'lganda sodir bo'ladi — masalan, elementlar tartiblangan holda qo'shilsa: 1, 2, 3, 4, 5. Bunda daraxt linked list ga o'xshab qoladi (faqat o'ng farzandlar) va qidirish O(n) bo'ladi. Buni hal qilish uchun BALANSLANAGAN daraxtlar (AVL Tree, Red-Black Tree) ishlatiladi — ular qayta joylashish (rotation) orqali balandlikni log n darajasida ushlab turadi, shuning uchun worst case ham O(log n) bo'ladi.`,
    },
    {
      question: 'DFS va BFS farqi nimada? Qachon qaysi birini ishlatish yaxshi?',
      answer: `DFS (Depth-First Search) — chuqurlikka birinchi boradi. Stack ishlatadi (rekursiya yoki aniq stack). Xotirada O(h) joy egallaydi (h = daraxt balandligi). BFS (Breadth-First Search) — kenglikka birinchi, har bir darajani to'liq o'tib, keyingisiga o'tadi. Queue ishlatadi. Xotirada O(w) joy egallaydi (w = eng keng daraja).

DFS ni qachon ishlatish: daraxt chuqur emas, keng bo'lganda; yechim chuqurda bo'lishi ehtimoli yuqori bo'lganda; backtracking kerak bo'lganda; xotirani tejash kerak bo'lganda (baland, tor daraxtlarda). BFS ni qachon ishlatish: eng qisqa yo'lni topish kerak bo'lganda; yechim root ga yaqin bo'lganda; level bo'yicha ishlash kerak bo'lganda (masalan, darajalar bo'yicha chop etish).

Amalda: DOM da element qidirish — BFS (yaqinroq element topiladi); fayl tizimida barcha fayllarni o'qish — DFS (papkani to'liq o'tish); eng qisqa marshrutni topish — BFS.`,
    },
  ],
  relatedTopics: [
    { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'big-o', label: 'Big O Notation' },
    { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'stack-queue', label: 'Stack va Queue' },
    { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'graph-basics', label: 'Graph asoslari' },
    { techId: 'javascript', sectionId: 'data-structures-algorithms', topicId: 'linked-list', label: 'Linked List' },
  ],
}
