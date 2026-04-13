import type { Topic } from '../../../types'

export const memoryManagement: Topic = {
  id: 'memory-management',
  title: 'Xotira Boshqaruvi',
  importance: 2,
  status: 'to-learn',
  description: 'Garbage collection, memory leak, WeakRef',
  content: `═══════════════════════════════════════
  XOTIRA BOSHQARUVI ASOSLARI
═══════════════════════════════════════

JavaScript da xotirani QUYLAB (manual) boshqarish shart emas —
Garbage Collector (GC) avtomatik tozalaydi. Lekin bu "xotira haqida
o'ylamaslik kerak" degani EMAS. Noto'g'ri yozilgan kod memory leak
ga olib keladi — ilova vaqt o'tishi bilan tobora ko'proq xotira
iste'mol qiladi va sekinlashadi.

Xotira hayotiy sikli:
1. AJRATISH (Allocation) — o'zgaruvchi yaratilganda xotira ajratiladi
2. ISHLATISH (Use) — o'qish va yozish operatsiyalari
3. BO'SHATISH (Deallocation) — GC tomonidan avtomatik

═══════════════════════════════════════
  GARBAGE COLLECTION — MARK-AND-SWEEP
═══════════════════════════════════════

Zamonaviy JavaScript engine lar (V8, SpiderMonkey) mark-and-sweep
algoritmini ishlatadi.

Ishlash mexanizmi:
1. GC "ildiz" (root) dan boshlaydi — global obyekt, stack,
   joriy funksiya o'zgaruvchilari
2. MARK bosqichi — ildizdan barcha yetib boriladigan (reachable)
   obyektlarni belgilaydi
3. SWEEP bosqichi — belgilanMAGAN obyektlarni xotiradan o'chiradi
4. COMPACT (ixtiyoriy) — xotiradagi bo'shliqlarni birlashtiradi

MUHIM: Obyektga hech qanday referens yo'q bo'lsa — u "yetib bo'lmaydigan"
(unreachable) va GC tomonidan o'chiriladi.

V8 engine da GC ikki bosqichli:
- Minor GC (Scavenger) — yangi obyektlar uchun (young generation)
- Major GC (Mark-Sweep-Compact) — eski obyektlar uchun (old generation)

═══════════════════════════════════════
  MEMORY LEAK SABABLARI
═══════════════════════════════════════

Memory leak — ishlatilmaydigan obyektlarga referens qolib ketishi,
GC ularni o'chira olmasligi.

1. GLOBAL O'ZGARUVCHILAR
   var yoki this.prop orqali yaratilgan global o'zgaruvchilar
   sahifa yopilguncha xotirada qoladi. "use strict" yoqish va
   const/let ishlatish kerak.

2. TOZALANMAGAN TIMERLAR
   setInterval() callback ichidagi o'zgaruvchilar GC qilinmaydi.
   Komponent unmount da clearInterval() chaqirish SHART.

3. CLOSURES (YOPILMALAR)
   Closure tashqi funksiya o'zgaruvchilariga referens saqlaydi.
   Agar closure uzoq yashasa — tashqi o'zgaruvchilar ham yashaydi.

4. DOM REFERENSLARI
   JavaScript da DOM element ga referens saqlansa, element DOM dan
   o'chirilsa ham xotiradan ketmaydi. WeakRef yoki WeakMap ishlatish.

5. EVENT LISTENER LAR
   removeEventListener() chaqirmaslik — element o'chirilganda
   listener va uning closure si xotirada qoladi.

6. KATTA MA'LUMOTLAR STRUKTURALARI
   Map, Set, Array larga ma'lumot qo'shib, o'chirmaslik.
   Kerak bo'lmaganda clear() yoki delete() chaqirish.

═══════════════════════════════════════
  WEAKREF VA FINALIZATIONREGISTRY
═══════════════════════════════════════

WeakRef (ES2021) — obyektga ZAIF referens yaratadi. GC zaif referensni
e'tiborga olmaydi — agar kuchli referens qolmasa, obyekt o'chiriladi.

const ref = new WeakRef(largeObject)
const obj = ref.deref()  // Obyekt hali bormi? (yoki undefined)

FinalizationRegistry — obyekt GC qilingandan KEYIN callback chaqiradi.
Cleanup operatsiyalari uchun ishlatiladi (masalan, tashqi resursni
yopish).

const registry = new FinalizationRegistry((heldValue) => {
  console.log(heldValue + ' GC qilindi')
})
registry.register(obj, 'my-object')

MUHIM: WeakRef.deref() har doim tekshirish kerak — GC istalgan
paytda obyektni o'chirishi mumkin. FinalizationRegistry callback
QACHON chaqirilishi kafolatlanmaydi — GC vaqtiga bog'liq.

═══════════════════════════════════════
  CHROME DEVTOOLS — MEMORY PROFILER
═══════════════════════════════════════

Memory muammolarini aniqlash uchun Chrome DevTools:

1. MEMORY TAB:
   - Heap Snapshot — xotiradagi barcha obyektlarni ko'rish
   - Allocation timeline — vaqt bo'yicha xotira ajratilishini kuzatish
   - Allocation sampling — ishlash paytida xotira profili

2. PERFORMANCE TAB:
   - Memory checkbox yoqish — GC bosqichlarini ko'rish
   - Sawtooth pattern (arra tishi) — normal GC
   - Doim o'suvchi chiziq — MEMORY LEAK!

3. HEAP SNAPSHOT tahlili:
   - Ikki snapshot olish (avval va keyin)
   - "Comparison" ko'rinishida yangi obyektlarni solishtirish
   - "Retained size" — obyekt va uning reference lari hajmi
   - "Detached DOM" — DOM dan uzilgan lekin xotirada qolgan elementlar

═══════════════════════════════════════
  BEST PRACTICES
═══════════════════════════════════════

1. const/let ishlatish — global o'zgaruvchilardan qochish
2. Timer tozalash — clearTimeout/clearInterval
3. Event listener o'chirish — removeEventListener yoki AbortController
4. WeakMap/WeakSet — DOM metadata va kesh uchun
5. Katta array/object — kerak bo'lmaganida null ga tenglashtirish
6. React da — useEffect cleanup funksiyasini yozish
7. Closure hajmini kamaytirish — faqat kerakli o'zgaruvchini ishlatish
8. Production da profiling — muntazam memory snapshot olish`,
  codeExamples: [
    {
      title: 'Memory leak sabablari va yechimlar',
      language: 'js',
      code: `// ❌ 1. Global o'zgaruvchi — sahifa yopilguncha yashaydi
function processData() {
  // "use strict" bo'lmasa — global o'zgaruvchi yaratiladi!
  accidentalGlobal = new Array(1000000)
}

// ✅ Yechim: const/let va strict mode
function processData() {
  'use strict'
  const localData = new Array(1000000)
  // Funksiya tugagach GC tozalaydi
}

// ❌ 2. Tozalanmagan timer
function startPolling() {
  const hugeData = fetchLargeDataset()
  setInterval(() => {
    // hugeData closure da ushlanib qoldi
    console.log(hugeData.length)
  }, 1000)
}

// ✅ Yechim: clearInterval
function startPolling() {
  const hugeData = fetchLargeDataset()
  const id = setInterval(() => {
    console.log(hugeData.length)
  }, 1000)

  // Kerak bo'lmaganida tozalash
  return () => clearInterval(id)
}

// ❌ 3. DOM referensi
const elements = []
function addButton() {
  const btn = document.createElement('button')
  document.body.appendChild(btn)
  elements.push(btn)  // Referens saqlanmoqda!
  // btn DOM dan o'chirilsa ham elements[] da qoladi
}

// ✅ Yechim: WeakRef yoki o'chirish
function removeButton(index) {
  const btn = elements[index]
  btn.remove()
  elements.splice(index, 1)  // Referensni ham o'chirish
}`,
      description: 'Eng keng tarqalgan memory leak sabablari va ularning yechimlari',
    },
    {
      title: 'Closure memory leak va yechimi',
      language: 'js',
      code: `// ❌ Closure katta obyektni ushlab turadi
function createHandler() {
  const hugeArray = new Array(1_000_000).fill('*')

  return function handler() {
    // hugeArray ga referens bor — GC qila olmaydi
    console.log(hugeArray.length)
  }
}

const handler = createHandler()
// handler mavjud ekan, 1M elementli array xotirada qoladi

// ✅ Yechim: faqat kerakli qiymatni olish
function createHandler() {
  const hugeArray = new Array(1_000_000).fill('*')
  const length = hugeArray.length  // Faqat kerakli qiymat

  return function handler() {
    console.log(length)  // Faqat raqam — hugeArray GC qilinadi
  }
}

// ❌ Event listener memory leak
function setupListeners() {
  const data = loadHeavyData()

  document.addEventListener('click', function onClick() {
    processData(data)
  })
  // Listener o'chirilmasa — data xotirada qoladi
}

// ✅ Yechim: AbortController bilan cleanup
function setupListeners() {
  const data = loadHeavyData()
  const controller = new AbortController()

  document.addEventListener('click', () => {
    processData(data)
  }, { signal: controller.signal })

  // Kerak bo'lmaganida:
  return () => controller.abort()  // Barcha listenerlar o'chadi
}`,
      description: 'Closure va event listener memory leak larni bartaraf qilish',
    },
    {
      title: 'WeakRef va FinalizationRegistry',
      language: 'js',
      code: `// WeakRef — zaif referens
class ImageCache {
  #cache = new Map()  // string → WeakRef

  set(url, imageObj) {
    this.#cache.set(url, new WeakRef(imageObj))
  }

  get(url) {
    const ref = this.#cache.get(url)
    if (!ref) return null

    const img = ref.deref()  // Hali bormi?
    if (!img) {
      // GC o'chirib yuborgan — keshdan ham o'chirish
      this.#cache.delete(url)
      return null
    }
    return img
  }
}

const cache = new ImageCache()
let bigImage = { data: new ArrayBuffer(10_000_000), url: '/photo.jpg' }
cache.set('/photo.jpg', bigImage)

console.log(cache.get('/photo.jpg'))  // { data: ..., url: ... }
bigImage = null  // Kuchli referens yo'q bo'ldi
// GC ishlaydi... keyingi safar:
// cache.get('/photo.jpg')  → null

// ═══════════════════════════════════════

// FinalizationRegistry — GC dan keyin cleanup
const registry = new FinalizationRegistry((fileName) => {
  console.log(\`\${fileName} GC qilindi, resurs yopilmoqda...\`)
  // Tashqi resursni yopish (fayl, socket va h.k.)
})

function processFile(name) {
  const fileHandle = { name, buffer: new ArrayBuffer(5_000_000) }
  registry.register(fileHandle, name)
  return fileHandle
}

let file = processFile('data.json')
file = null
// GC ishlaydi... keyin:
// "data.json GC qilindi, resurs yopilmoqda..."`,
      description: 'WeakRef bilan kesh va FinalizationRegistry bilan cleanup',
    },
    {
      title: 'React da memory leak oldini olish',
      language: 'js',
      code: `// ❌ React — tozalanmagan subscription
function UserStatus({ userId }) {
  const [status, setStatus] = useState('offline')

  useEffect(() => {
    // WebSocket subscription
    const ws = new WebSocket(\`/ws/users/\${userId}\`)
    ws.onmessage = (e) => {
      setStatus(JSON.parse(e.data).status)
    }
    // Cleanup yo'q! Komponent unmount bo'lsa ham ishlaydi
  }, [userId])
}

// ✅ Yechim: cleanup funksiyasi
function UserStatus({ userId }) {
  const [status, setStatus] = useState('offline')

  useEffect(() => {
    const ws = new WebSocket(\`/ws/users/\${userId}\`)
    ws.onmessage = (e) => {
      setStatus(JSON.parse(e.data).status)
    }

    // Cleanup — unmount yoki userId o'zgarganda
    return () => ws.close()
  }, [userId])
}

// ✅ fetch bilan AbortController
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        if (err.name !== 'AbortError') throw err
      })

    return () => controller.abort()
  }, [userId])
}

// ✅ Timer tozalash
function AutoSave({ data }) {
  useEffect(() => {
    const id = setInterval(() => {
      saveToServer(data)
    }, 30_000)

    return () => clearInterval(id)  // MUHIM!
  }, [data])
}`,
      description: 'React useEffect da memory leak oldini olish',
    },
    {
      title: 'Chrome DevTools bilan memory profiling',
      language: 'js',
      code: `// Memory leak ni aniqlash uchun qadamlar:

// 1. Heap Snapshot solishtirish
// Chrome DevTools → Memory tab → "Take heap snapshot"
// Amallarni bajaring (sahifani oching, yoping)
// Yana snapshot oling
// "Comparison" view da yangi obyektlarni ko'ring

// 2. Performance Monitor
// Chrome DevTools → Performance tab
// "Memory" checkbox ni yoqing → Record
// Oddiy foydalanish simulyatsiya qiling
// Natijani ko'ring:
// - Sawtooth pattern (arra tishi) = Normal GC
// - Doim o'suvchi chiziq = MEMORY LEAK!

// 3. Detached DOM elementlarni topish
// Heap snapshot → Filter: "Detached"
// Bu DOM dan olib tashlangan lekin JS da referens qolgan elementlar

// 4. console.memory (Chrome)
console.log(performance.memory)
// {
//   jsHeapSizeLimit: 2172649472,
//   totalJSHeapSize: 54190000,
//   usedJSHeapSize: 48700000   ← haqiqiy ishlatilayotgan
// }

// 5. Dasturiy xotira kuzatish
class MemoryMonitor {
  #snapshots = []

  take(label) {
    if (performance.memory) {
      this.#snapshots.push({
        label,
        used: performance.memory.usedJSHeapSize,
        time: Date.now()
      })
    }
  }

  report() {
    for (let i = 1; i < this.#snapshots.length; i++) {
      const prev = this.#snapshots[i - 1]
      const curr = this.#snapshots[i]
      const diff = curr.used - prev.used
      const mb = (diff / 1024 / 1024).toFixed(2)
      console.log(\`\${prev.label} → \${curr.label}: \${mb} MB\`)
    }
  }
}`,
      description: 'Chrome DevTools Memory profiler va dasturiy monitoring',
    },
  ],
  interviewQA: [
    {
      question: 'JavaScript da garbage collection qanday ishlaydi?',
      answer: 'JavaScript ning zamonaviy engine lari (V8) mark-and-sweep algoritmini ishlatadi. GC "ildiz" (root) — global obyekt, stack, joriy funksiya o\'zgaruvchilari — dan boshlab barcha yetib boriladigan (reachable) obyektlarni belgilaydi (mark). Keyin belgilanmagan obyektlarni xotiradan o\'chiradi (sweep). V8 da ikki avlod GC: Minor GC (Scavenger) — yangi, qisqa umrli obyektlar uchun tez ishlaydi. Major GC (Mark-Sweep-Compact) — eski obyektlar uchun, kamroq ishlaydi lekin sekinroq. GC avtomatik ishlaydi, dasturchi to\'g\'ridan-to\'g\'ri boshqara olmaydi.',
    },
    {
      question: 'Memory leak nima va eng keng tarqalgan sabablari qanday?',
      answer: 'Memory leak — dastur ishlatmaydigan xotira bo\'shatilmasligi, chunki obyektlarga referens qolib ketgan. Sabablari: 1) Global o\'zgaruvchilar — sahifa yopilguncha yashaydi. 2) Tozalanmagan timer lar — setInterval callback closure si. 3) Event listener lar — removeEventListener chaqirilmagan. 4) DOM referenslari — element o\'chirilgan lekin JS da referens bor. 5) Closure lar — katta obyektga keraksiz referens ushlab turadi. 6) Map/Set — ma\'lumot qo\'shib, o\'chirmaslik. Yechim: cleanup funksiyalar, WeakMap/WeakRef, AbortController ishlatish.',
    },
    {
      question: 'WeakRef nima va qachon ishlatiladi?',
      answer: 'WeakRef (ES2021) — obyektga zaif (weak) referens yaratadi. Oddiy referens GC ga "bu obyektni o\'chirma" deydi. WeakRef esa GC ga ta\'sir qilmaydi — agar boshqa kuchli referens qolmasa, GC obyektni o\'chiradi. deref() metodi obyektni qaytaradi yoki undefined (GC o\'chirgan bo\'lsa). Ishlatilishi: 1) Kesh — katta obyektlarni kerak bo\'lmaganida avtomatik tozalash. 2) Observer pattern — kuzatuvchi obyekt o\'chirilsa, avtomatik unsubscribe. MUHIM: deref() har doim tekshirish kerak, GC timing kafolatlanmaydi.',
    },
    {
      question: 'React da memory leak qanday oldini olinadi?',
      answer: 'React da asosiy memory leak manbayi — useEffect cleanup funksiyasini yozmaslik. Yechimlar: 1) useEffect return funksiyasi — subscription, timer, WebSocket ni yopish. 2) fetch uchun AbortController — controller.abort() cleanup da. 3) setState o\'chirilgan komponentda chaqirmaslik — abort signal yoki flag bilan tekshirish. 4) Event listener — AbortController.signal option bilan. 5) ref larda katta obyektlarni saqlashdan ehtiyot bo\'lish. Umumiy qoida: useEffect ichida "ochgan" narsani cleanup da "yopish" kerak.',
    },
    {
      question: 'Memory leak ni Chrome DevTools da qanday aniqlash mumkin?',
      answer: 'Memory tab da 3 usul: 1) Heap Snapshot — ikki snapshot olish (amal oldin va keyin), "Comparison" view da yangi obyektlarni solishtirish, "Detached DOM" filtri bilan DOM dan uzilgan elementlarni topish. 2) Allocation Timeline — vaqt bo\'yicha xotira ajratilishini kuzatish, ko\'k chiziqlar (saqlanib qolgan) ko\'p bo\'lsa — leak bor. 3) Performance tab — Memory checkbox yoqish, doim o\'suvchi xotira grafigi memory leak belgisi, normal holda "arra tishi" (sawtooth) ko\'rinishida bo\'lishi kerak — GC muntazam tozalaydi.',
    },
    {
      question: 'FinalizationRegistry nima va qachon ishlatiladi?',
      answer: 'FinalizationRegistry (ES2021) — obyekt garbage collect qilingandan keyin callback chaqirish imkonini beradi. Asosan tashqi resurslarni tozalash uchun: fayl handle yopish, WebSocket yopish, tashqi API dan unregister qilish. Ishlatish: const registry = new FinalizationRegistry(callback); registry.register(obj, heldValue). MUHIM cheklovlar: 1) callback QACHON chaqirilishi kafolatlanmaydi — GC vaqtiga bog\'liq. 2) Callback umuman chaqirilmasligi mumkin (dastur tugasa). Shuning uchun bu asosiy cleanup mexanizm emas, balki "backup" sifatida ishlatiladi.',
    },
  ],
}
