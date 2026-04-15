import type { Topic } from '../../../types'

export const reactivityDeep: Topic = {
  id: 'reactivity-deep',
  title: 'Reaktivlik mexanizmi',
  importance: 3,
  status: 'to-learn',
  description: 'Vue 3 Proxy-based reaktivlik — dependency tracking, track/trigger, get/set trap-lar, nested reaktivlik',
  content: `Vue 3 ning reaktivlik tizimi JavaScript Proxy API ustiga qurilgan. Bu tizim qanday ishlashini tushunish — senior developer uchun zaruriy bilim. U dependency tracking, lazy evaluation va fine-grained updates prinsiplarini birlashtiradi.

═══════════════════════════════════════
  PROXY ASOSIDAGI REAKTIVLIK
═══════════════════════════════════════

Vue 3 da reactive() chaqirilganda nima sodir bo'ladi:

1. Yangi Proxy(target, handler) yaratiladi
2. handler ichida get va set trap-lar aniqlangan
3. get trap: property o'qilganda — track() chaqiriladi
4. set trap: property yozilganda — trigger() chaqiriladi

  const handler = {
    get(target, key, receiver) {
      track(target, key)           // dependency ro'yxatga olish
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)         // yangilanish yuborish
      return result
    }
  }

Har bir reaktiv object uchun WeakMap-da targetMap saqlanadi — bu target -> depsMap -> dep (Set of effects) zanjiri.

═══════════════════════════════════════
  DEPENDENCY TRACKING (track/trigger)
═══════════════════════════════════════

Vue ichki tizimida "effect" tushunchasi markaziy. Component render, watch callback, computed getter — barchasi effect.

track(target, key) nima qiladi:
- Hozirgi faol effect-ni (activeEffect) oladi
- targetMap[target][key] ga bu effect-ni qo'shadi
- Natija: "bu property o'zgarganda — shu effect-ni qayta ishga tushir"

trigger(target, key) nima qiladi:
- targetMap[target][key] dan barcha effect-larni oladi
- Ularni navbatga qo'yib, qayta ishga tushiradi
- Scheduler orqali batching amalga oshiriladi

Effect tizimi:
  activeEffect = null  // hozir hech qanday effect ishlamayapti
  effect(() => {
    // Bu funksiya ichida o'qilgan har bir reaktiv property
    // avtomatik track() qilinadi
    console.log(state.count)  // track(state, 'count')
  })

═══════════════════════════════════════
  NESTED (CHUQUR) REAKTIVLIK
═══════════════════════════════════════

Vue 3 da nested object-lar LAZY reaktiv bo'ladi:

  const state = reactive({
    user: {           // hozircha oddiy object
      profile: {      // hozircha oddiy object
        name: 'Ali'
      }
    }
  })

  state.user          // get trap — nested Proxy yaratiladi
  state.user.profile  // yana get trap — yana Proxy yaratiladi

Lazy yondashuv — faqat murojaat qilinganda Proxy yaratish — xotirani tejaydi. Katta object-larda HAMMA nested property-ni oldindan Proxy qilish keraksiz.

Array uchun maxsus handler-lar bor: push, pop, splice kabi metodlar ham to'g'ri kuzatiladi. Vue length va index o'zgarishlarini ham track/trigger qiladi.

═══════════════════════════════════════
  Vue 2 vs Vue 3 — TARIXIY TAQQOSLASH
═══════════════════════════════════════

Vue 2 — Object.defineProperty:
- Har bir property uchun alohida getter/setter
- YANGI property qo'shish kuzatilMAS (Vue.set kerak)
- Array index orqali o'zgartirish kuzatilMAS
- delete operator kuzatilMAS (Vue.delete kerak)
- Oldindan barcha property-larni recursive aylantirish kerak

Vue 3 — Proxy:
- Butun object uchun bitta Proxy
- Yangi property qo'shish AVTOMATIK kuzatiladi
- Array index, length — HAMMASI kuzatiladi
- delete ham kuzatiladi (deleteProperty trap)
- Lazy — faqat kerak bo'lganda Proxy yaratadi
- Map, Set, WeakMap, WeakSet ni ham qo'llab-quvvatlaydi

═══════════════════════════════════════
  COLLECTION HANDLER-LAR
═══════════════════════════════════════

Map va Set uchun Vue maxsus handler ishlatadi. Bu collection-lar Proxy get trap orqali metodlarni intercept qiladi:

  const map = reactive(new Map())
  map.set('key', 'value')   // set metodi — trigger
  map.get('key')             // get metodi — track
  map.has('key')             // has — track
  map.delete('key')          // delete — trigger
  map.forEach(...)           // forEach — ITERATE track

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React reaktivlik modeli tubdan boshqacha:

React — PULL modeli:
- setState chaqiriladi -> komponent qayta render -> virtual DOM diff -> DOM yangilanadi
- Komponent funksiyasi to'liq qayta chaqiriladi
- Fine-grained emas — butun subtree qayta render bo'lishi mumkin
- useMemo, React.memo, useCallback — qo'lda optimallashtirish

Vue — PUSH modeli:
- Property o'zgaradi -> trigger() -> faqat bog'liq effect-lar qayta ishlaydi
- Fine-grained — faqat o'sha property-ga bog'liq DOM yangilanadi
- Avtomatik optimallashtirish — qo'shimcha memo kerak emas
- Setup bir marta ishlaydi — closure muammosi yo'q

React 19 Signal-like tushuncha (compiler) bilan Vue ga yaqinlashmoqda, lekin hali fundamental farq saqlanadi.`,
  codeExamples: [
    {
      title: 'Proxy trap-larini tushunish — soddalashtirilgan misol',
      language: 'ts',
      code: `// Vue ichki reaktivlik tizimining soddalashtirilgan versiyasi

let activeEffect: Function | null = null
const targetMap = new WeakMap<object, Map<string | symbol, Set<Function>>>()

function track(target: object, key: string | symbol) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect) // joriy effect-ni dependency sifatida yozish
}

function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect()) // barcha bog'liq effect-larni qayta ishga tushirish
  }
}

function reactive<T extends object>(target: T): T {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      const result = Reflect.get(target, key, receiver)
      // Nested object — recursive Proxy (lazy)
      if (typeof result === 'object' && result !== null) {
        return reactive(result)
      }
      return result
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver)
      const result = Reflect.set(target, key, value, receiver)
      if (oldValue !== value) {
        trigger(target, key) // faqat qiymat o'zgarganda trigger
      }
      return result
    },
  })
}

function effect(fn: Function) {
  activeEffect = fn
  fn() // birinchi marta ishlatish — track qilish uchun
  activeEffect = null
}

// Ishlatish:
const state = reactive({ count: 0, name: 'Ali' })

effect(() => {
  console.log('Count:', state.count) // track(state, 'count')
})

state.count++ // trigger -> console: "Count: 1"
state.name = 'Vali' // trigger, lekin bu effect bog'lanmagan`,
      description: 'Vue 3 reaktivlik tizimining soddalashtirilgan versiyasi — track/trigger mexanizmi qanday ishlashini ko\'rsatadi.',
    },
    {
      title: 'Nested reaktivlik va lazy Proxy',
      language: 'html',
      code: `<script setup lang="ts">
import { reactive, isReactive, watch } from 'vue'

interface AppState {
  user: {
    profile: {
      name: string
      address: {
        city: string
        zip: string
      }
    }
    settings: {
      theme: 'light' | 'dark'
      notifications: boolean
    }
  }
  items: Array<{ id: number; title: string }>
}

const state: AppState = reactive({
  user: {
    profile: {
      name: 'Ali',
      address: {
        city: 'Toshkent',
        zip: '100000',
      },
    },
    settings: {
      theme: 'dark',
      notifications: true,
    },
  },
  items: [
    { id: 1, title: 'Birinchi' },
    { id: 2, title: 'Ikkinchi' },
  ],
})

// Nested object ham reaktiv:
console.log(isReactive(state.user))              // true
console.log(isReactive(state.user.profile))       // true
console.log(isReactive(state.user.profile.address)) // true
console.log(isReactive(state.items[0]))           // true

// Chuqur o'zgarish — avtomatik kuzatiladi:
function updateCity(city: string) {
  state.user.profile.address.city = city // 4 darajali nested — ishlaydi!
}

// Array mutatsiyasi ham kuzatiladi:
function addItem(title: string) {
  state.items.push({ id: Date.now(), title })
}

function removeItem(id: number) {
  const index = state.items.findIndex(item => item.id === id)
  if (index > -1) state.items.splice(index, 1)
}

// Deep watch — barcha o'zgarishlarni kuzatish:
watch(
  () => state.user.profile.address,
  (newAddr) => {
    console.log('Manzil o\\'zgardi:', newAddr.city, newAddr.zip)
  },
  { deep: true }
)
</script>

<template>
  <div>
    <p>Shahar: {{ state.user.profile.address.city }}</p>
    <button @click="updateCity('Samarqand')">Shaharni o'zgartirish</button>
    <ul>
      <li v-for="item in state.items" :key="item.id">
        {{ item.title }}
        <button @click="removeItem(item.id)">O'chirish</button>
      </li>
    </ul>
    <button @click="addItem('Yangi element')">Qo'shish</button>
  </div>
</template>`,
      description: 'Vue 3 da nested object va array mutatsiyalari avtomatik kuzatiladi — Vue 2 dagi Vue.set muammosi yo\'q.',
    },
    {
      title: 'Vue 2 vs Vue 3 — amaliy farqlar',
      language: 'ts',
      code: `// ===== Vue 2 — Object.defineProperty cheklovlari =====

// Vue 2 da yangi property qo'shish kuzatilmas edi:
// this.user.newProp = 'qiymat'     // KUZATILMAYDI!
// Vue.set(this.user, 'newProp', 'qiymat')  // Kerak edi

// Array index o'zgartirish:
// this.items[0] = 'yangi'          // KUZATILMAYDI!
// Vue.set(this.items, 0, 'yangi')  // Kerak edi
// yoki: this.items.splice(0, 1, 'yangi')

// Array length o'zgartirish:
// this.items.length = 0             // KUZATILMAYDI!
// this.items.splice(0)              // Kerak edi

// ===== Vue 3 — Proxy bilan hammasi ishlaydi =====

import { reactive } from 'vue'

const state = reactive({
  user: { name: 'Ali' } as Record<string, any>,
  items: ['a', 'b', 'c'],
})

// Yangi property — avtomatik kuzatiladi:
state.user.age = 25                  // ISHLAYDI!
state.user.email = 'ali@mail.com'    // ISHLAYDI!

// Array index — ishlaydi:
state.items[0] = 'yangi'             // ISHLAYDI!
state.items[10] = 'o\\'ninchi'       // ISHLAYDI!

// Delete — ishlaydi:
delete state.user.age                // ISHLAYDI! (deleteProperty trap)

// Array length:
state.items.length = 1               // ISHLAYDI!

// Map va Set ham qo'llab-quvvatlanadi:
const map = reactive(new Map<string, number>())
map.set('score', 100)                // ISHLAYDI!
map.delete('score')                  // ISHLAYDI!

const set = reactive(new Set<string>())
set.add('element')                   // ISHLAYDI!
set.delete('element')                // ISHLAYDI!`,
      description: 'Vue 2 Object.defineProperty cheklovlari va Vue 3 Proxy yordamida ularning barchasi hal bo\'lganligi.',
    },
    {
      title: 'Effect tizimi va scheduler',
      language: 'ts',
      code: `import { reactive, effect, stop, type ReactiveEffectRunner } from 'vue'

// Vue ichki effect() API — odatda to'g'ridan-to'g'ri ishlatilmaydi,
// lekin tizimni tushunish uchun muhim

const state = reactive({ count: 0, name: 'Ali' })

// effect() — reaktiv funksiya yaratadi
const runner: ReactiveEffectRunner = effect(() => {
  // Bu funksiya ichida o'qilgan HAR BIR reaktiv property
  // avtomatik dependency sifatida yoziladi
  console.log(\`Count: \${state.count}, Name: \${state.name}\`)
})
// Darhol ishlaydi: "Count: 0, Name: Ali"

state.count++
// Qayta ishlaydi: "Count: 1, Name: Ali"

state.name = 'Vali'
// Qayta ishlaydi: "Count: 1, Name: Vali"

// Effect-ni to'xtatish:
stop(runner)
state.count++ // Endi hech narsa bo'lmaydi — effect to'xtatilgan

// ===== Scheduler — batching =====
// Vue komponent renderini scheduler orqali batching qiladi:

// Bir nechta o'zgarish — BITTA yangilanish:
state.count = 10
state.count = 20
state.count = 30
state.name = 'Karim'
// Komponent faqat BIR MARTA qayta render bo'ladi!

// Bu nextTick orqali amalga oshiriladi:
// 1. trigger() -> effect-ni navbatga qo'yish (queue)
// 2. Microtask (Promise.then) -> navbatdagi effect-larni ishga tushirish
// 3. Bitta tick-da bir nechta trigger -> effect faqat BIR MARTA ishlaydi

import { nextTick } from 'vue'

state.count = 100
// DOM hali yangilanmagan

await nextTick()
// Endi DOM yangilangan`,
      description: 'Vue ichki effect tizimi va scheduler — dependency tracking va batching qanday ishlaydi.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue 3 reaktivlik tizimi ichki tuzilmasini tushuntiring — track() va trigger() qanday ishlaydi?',
      answer: `Vue 3 reaktivlik tizimi uch asosiy qismdan iborat: 1) Proxy handler — get trap-da track(), set trap-da trigger() chaqiradi. 2) targetMap — WeakMap<target, Map<key, Set<effect>>> strukturasi. Har bir reaktiv object (target) uchun property-lar (key) va ularga bog'liq effect-lar (Set) saqlanadi. 3) activeEffect — hozirgi ishlayotgan effect. track() ishlashi: agar activeEffect mavjud bo'lsa — targetMap[target][key] ga qo'shadi. trigger() ishlashi: targetMap[target][key] dan barcha effect-larni olib, scheduler orqali navbatga qo'yadi. Scheduler microtask (Promise.then) orqali batching qiladi — bir nechta trigger bitta render beradi.`,
    },
    {
      question: 'Vue 3 nima uchun Object.defineProperty o\'rniga Proxy tanladi?',
      answer: `Object.defineProperty cheklovlari: 1) Yangi property qo'shishni kuza olmaydi — Vue.set() kerak edi. 2) Property o'chirishni kuza olmaydi — Vue.delete() kerak edi. 3) Array index va length o'zgarishini kuza olmaydi. 4) Map, Set kabi collection-larni qo'llab-quvvatlamaydi. 5) Oldindan barcha property-larni recursive aylantirish kerak — katta object-larda sekin. Proxy afzalliklari: 1) Butun object uchun bitta trap — yangi property, delete, has hammasi kuzatiladi. 2) Array index, length ishlaydi. 3) Map, Set, WeakMap uchun maxsus handler. 4) Lazy nested Proxy — faqat murojaat qilinganda yaratiladi, xotira tejaydi. Kamchilik: IE11 qo'llab-quvvatlamaydi (Vue 3 IE11 ni tashlab ketdi).`,
    },
    {
      question: 'Vue va React ning reaktivlik modellari qanday fundamental farq qiladi?',
      answer: `Vue — PUSH modeli (fine-grained reactivity): qiymat o'zgarganda faqat bog'liq effect-lar ishga tushadi. Har bir DOM node qaysi reactive property-ga bog'liq — aniq ma'lum. O'zgarish to'g'ridan-to'g'ri kerakli DOM-ga yetadi. React — PULL modeli (virtual DOM diffing): setState -> butun komponent funksiyasi qayta chaqiriladi -> yangi virtual DOM hosil -> eski bilan taqqoslash (reconciliation) -> farqlar DOM-ga qo'llanadi. Vue yondashuvi granular — ortiqcha render yo'q. React yondashuvi — soddaroq mental model, lekin optimallashtirish uchun useMemo, memo, useCallback kerak. Vue 3 Proxy + compiler optimizations (static hoisting, patch flags) birgalikda juda samarali.`,
    },
    {
      question: 'Nested reaktivlik qanday ishlaydi va nima uchun lazy?',
      answer: `Vue 3 da reactive() chaqirilganda faqat yuqori darajadagi object uchun Proxy yaratiladi. Nested object-lar uchun Proxy faqat ularga MUROJAAT QILINGANDA yaratiladi — bu lazy yondashuv. get trap-da: agar qaytariladigan qiymat object bo'lsa — reactive() ga o'rab qaytariladi. Yaratilgan nested Proxy keshlanadi (reactiveMap WeakMap-da). Bu nima uchun muhim: katta object-larda (masalan, 1000 elementli array, har birida nested object) barcha nested Proxy-larni oldindan yaratish — xotira va vaqt sarflaydi. Lazy yondashuv faqat foydalanilgan property-lar uchun Proxy yaratadi. Vue 2 da bunday optimallashtirish yo'q edi — Object.defineProperty recursive barcha property-larga darhol qo'llanardi.`,
    },
    {
      question: 'Vue 3 da Map va Set reaktivligi qanday amalga oshirilgan?',
      answer: `Map va Set oddiy object emas — ularning property-lari yo'q, metodlari (get, set, has, delete, forEach) orqali ishlaydi. Vue 3 ular uchun maxsus collectionHandlers ishlatadi. Bu handler Proxy get trap orqali metodlarni intercept qiladi: map.get(key) chaqirilganda — asl get metodini track() bilan o'rab qaytaradi. map.set(key, value) — asl set ni trigger() bilan o'rab qaytaradi. has, delete, forEach, entries, values, keys — hammasi shunaqa pattern. size property ham track qilinadi. ITERATE symbol — forEach va iteration metodlari uchun maxsus tracking. Bu yondashuv Vue 2 da mumkin emas edi — faqat Vue 3 Proxy tufayli collection-lar reaktiv bo'la oldi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-vs-reactive', label: 'ref() vs reactive()' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'shallow-raw', label: 'shallowRef va markRaw' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'effect-scope', label: 'effectScope API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
  ],
}
