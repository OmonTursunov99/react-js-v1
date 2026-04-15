import type { Topic } from '../../../types'

export const reactivityTheory: Topic = {
  id: 'reactivity-theory',
  title: 'Reactivity Theory',
  importance: 3,
  status: 'to-learn',
  description: 'Vue reaktivlik nazariyasi — Proxy API, track/trigger, dependency graph, effect scheduling',
  content: `Vue 3 reaktivlik tizimi — bu framework-ning ASOSI. Tushunish uchun avval JavaScript Proxy API, keyin Vue uni qanday ishlatishini bilish kerak.

═══════════════════════════════════════
  PROXY API — ASOS
═══════════════════════════════════════

JavaScript Proxy ob'ektga "tuzog'lar" (traps) o'rnatadi:
- get trap — xususiyat O'QILGANDA ishlaydi
- set trap — xususiyat O'ZGARTIRILGANDA ishlaydi
- deleteProperty — xususiyat O'CHIRILGANDA
- has — 'in' operatori ishlatilganda

Vue reactive() ob'ektni Proxy bilan o'raydi:
1. get trap — track() chaqiriladi (kimdir bu xususiyatni O'QIDI deb yoziladi)
2. set trap — trigger() chaqiriladi (xususiyat o'zgardi, kuzatuvchilarni xabardor qilish)

═══════════════════════════════════════
  track() VA trigger() MEXANIZMI
═══════════════════════════════════════

track(target, key):
- Hozirgi faol effect-ni (activeEffect) topadi
- targetMap: WeakMap<object, Map<key, Set<effect>>> ga qo'shadi
- Bu "kim qaysi xususiyatni kuzatmoqda" degan DEPENDENCY GRAPH

trigger(target, key):
- targetMap dan shu target/key bo'yicha barcha effect-larni topadi
- Har bir effect-ni qayta ishga tushiradi (re-run)
- Effect ichida komponent render funksiyasi bo'lishi mumkin

Dependency Graph tuzilishi:
  targetMap (WeakMap)
    └── target (ob'ekt)
        └── depsMap (Map)
            └── key (xususiyat nomi)
                └── deps (Set<ReactiveEffect>)

═══════════════════════════════════════
  ReactiveEffect VA SCHEDULING
═══════════════════════════════════════

ReactiveEffect — kuzatuvchi funksiya. Ikkita tur:
1. Render effect — komponentni qayta renderlash
2. Computed effect — hisoblangan qiymatni yangilash
3. Watch effect — watch/watchEffect callback

Effect scheduling:
- Vue barcha trigger-larni sinxron qayta ishlaMAYDI
- Buning o'rniga queueJob() orqali mikrotask navbatiga qo'yadi
- nextTick() shu navbat bajarilgandan keyin ishlaydi
- BU SABABLI: state 3 marta o'zgartirsangiz, render BITTA MARTA ishlaydi

Scheduler ishlash tartibi:
1. State o'zgaradi -> trigger() -> effect navbatga qo'yiladi
2. Sinxron kod tugaydi
3. Mikrotask — queueFlush() ishga tushadi
4. Navbatdagi barcha effect-lar bajariladi (dublikatlar olib tashlanadi)
5. DOM yangilanadi

═══════════════════════════════════════
  NIMA UCHUN PROXY (Vue 2 — defineProperty EMAS)
═══════════════════════════════════════

Vue 2 — Object.defineProperty:
- Har bir xususiyatni alohida getter/setter bilan o'rash kerak edi
- YANGI xususiyat qo'shish kuzatilMASDI (Vue.set() kerak edi)
- Array index orqali o'zgartirish kuzatilMASDI
- Katta ob'ektlarda SEKIN — har bir xususiyat uchun getter/setter

Vue 3 — Proxy:
- BUTUN ob'ektni bitta Proxy bilan o'raydi
- Yangi xususiyatlar AVTOMATIK kuzatiladi
- Array o'zgarishlari AVTOMATIK kuzatiladi
- Lazy — faqat o'qilgan xususiyatlargina track qilinadi
- Map, Set, WeakMap ham qo'llab-quvvatlanadi

═══════════════════════════════════════
  TEMPLATE COMPILATION VA REAKTIVLIK
═══════════════════════════════════════

Template -> Render function -> VNode:
1. Compiler template-ni render funksiyaga aylantiradi
2. Render funksiya birinchi marta ishlaganda — reaktiv xususiyatlar O'QILADI
3. track() har bir o'qilgan xususiyat uchun render effect-ni yozadi
4. State o'zgarganda trigger() -> render effect qayta ishlaydi
5. Yangi VNode yaratiladi -> diff -> DOM yangilanadi

Bu "avtomatik dependency tracking" — siz dependency array yozMAYSIZ, Vue O'ZI biladi qaysi state qaysi komponentga bog'liq.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue: Proxy-based fine-grained reaktivlik
- Avtomatik dependency tracking (dependency array YO'Q)
- Faqat kerakli komponentlar re-render bo'ladi
- Mutable state (count.value++ ishlaydi)
- ref()/reactive() — aniq reaktivlik e'lon qilish

React: Immutable state + re-render modeli
- useState/useReducer — HAR SAFAR yangi reference
- useEffect/useMemo dependency array — QOIDA: hamma dependency yozish kerak
- Ota komponent re-render -> BARCHA bolalar re-render (memo() kerak)
- React Compiler — avtomatik memoizatsiya (Vue-ga yaqinlashish)

Vue-ning afzalligi: granular update — faqat o'zgangan xususiyatni ishlatgan komponent re-render bo'ladi. React-da bu uchun memo(), useMemo(), useCallback() kerak edi (React Compiler-gacha).`,
  codeExamples: [
    {
      title: 'Proxy API asoslari — Vue reaktivlik ishi',
      language: 'ts',
      code: `// Vue reaktivlik tizimining soddalashtirilgan versiyasi
type EffectFn = () => void

let activeEffect: EffectFn | null = null

// WeakMap<target, Map<key, Set<effect>>>
const targetMap = new WeakMap<
  object,
  Map<string | symbol, Set<EffectFn>>
>()

function track(target: object, key: string | symbol) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }
  deps.add(activeEffect)
}

function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const deps = depsMap.get(key)
  if (deps) {
    deps.forEach(effect => effect()) // barcha kuzatuvchilarni ishga tushirish
  }
}

function reactive<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key)                // KIM O'QIDI — yozib qo'yish
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)              // O'ZGARDI — xabardor qilish
      return result
    },
  })
}

// Ishlatish:
const state = reactive({ count: 0, name: 'Vue' })

function effect(fn: EffectFn) {
  activeEffect = fn
  fn()                                  // birinchi marta ishga tushirish — track qilish
  activeEffect = null
}

effect(() => {
  console.log('Count:', state.count)    // count O'QILDI -> track()
})

state.count++                           // count O'ZGARDI -> trigger() -> effect qayta ishlaydi`,
      description: 'Vue reaktivlik tizimining soddalashtirilgan implementatsiyasi. targetMap, track(), trigger() — bu Vue source code-dagi asosiy tushunchalar.',
    },
    {
      title: 'ref() vs reactive() — ichki ishlash farqi',
      language: 'ts',
      code: `// ref() — primitiv uchun, .value orqali wrapper
// Ichki implementatsiya (soddalashtirilgan):
class RefImpl<T> {
  private _value: T
  public dep: Set<EffectFn> = new Set()

  constructor(value: T) {
    // Ob'ekt bo'lsa — reactive() ga o'raladi
    this._value = isObject(value) ? reactive(value) : value
  }

  get value(): T {
    trackRefValue(this)     // .value O'QILGANDA — track
    return this._value
  }

  set value(newVal: T) {
    if (hasChanged(newVal, this._value)) {
      this._value = isObject(newVal) ? reactive(newVal) : newVal
      triggerRefValue(this)  // .value O'ZGARGANDA — trigger
    }
  }
}

// reactive() — ob'ekt uchun, to'g'ridan-to'g'ri Proxy
// Ichki: new Proxy(target, handlers)
// LEKIN: primitiv qo'llab-quvvatlanMAYDI (Proxy faqat ob'ekt uchun)

// ╔════════════════════════════════════════╗
// ║  ref(0)       → RefImpl { _value: 0 }  ║
// ║  ref({a: 1})  → RefImpl { _value: Proxy({a:1}) } ║
// ║  reactive({a: 1}) → Proxy({a: 1})      ║
// ╚════════════════════════════════════════╝`,
      description: 'ref() ichida RefImpl class bor, .value getter/setter orqali track/trigger. reactive() to\'g\'ridan-to\'g\'ri Proxy ishlatadi.',
    },
    {
      title: 'Effect scheduling — navbat va nextTick',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, nextTick } from 'vue'

const count = ref(0)

async function incrementThreeTimes() {
  // 3 ta o'zgarish — lekin render BITTA MARTA ishlaydi!
  count.value++ // trigger -> effect navbatga
  count.value++ // trigger -> effect ALLAQACHON navbatda (dublikat)
  count.value++ // trigger -> xuddi shunday

  // Hozir DOM hali ESKI (count = 0 ko'rinadi)
  console.log(document.querySelector('#count')?.textContent) // "0"

  // nextTick — DOM yangilangandan keyin
  await nextTick()
  console.log(document.querySelector('#count')?.textContent) // "3"
}
</script>

<template>
  <p id="count">{{ count }}</p>
  <button @click="incrementThreeTimes">+3</button>
</template>`,
      description: 'Vue effect scheduler dublikat effect-larni olib tashlaydi. 3 marta o\'zgartirish = 1 marta render. nextTick() — DOM yangilanishini kutish.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue reaktivlik tizimi qanday ishlaydi? Proxy API rolini tushuntiring.',
      answer: `Vue 3 reaktivligi Proxy API asosida qurilgan. reactive() ob'ektni Proxy bilan o'raydi. GET trap — track() chaqiradi (dependency yozadi), SET trap — trigger() chaqiradi (kuzatuvchilarni xabar qiladi). targetMap: WeakMap<target, Map<key, Set<effect>>> — bu dependency graph. Har bir komponent render funksiyasi ReactiveEffect sifatida ro'yxatga olinadi. State o'zgarganda faqat shu state-ni O'QIGAN komponentlar re-render bo'ladi. Bu "fine-grained reactivity" — React-dagi "re-render everything and diff" yondashuvdan farqli.`,
    },
    {
      question: 'Vue 3 nima uchun defineProperty o\'rniga Proxy tanladi?',
      answer: `Vue 2 Object.defineProperty bilan har bir xususiyatni alohida getter/setter bilan o'rashi kerak edi. 3 ta muammo: 1) YANGI xususiyat qo'shish kuzatilmas edi (Vue.set() kerak), 2) Array index orqali o'zgartirish ishlamadi (arr[0] = x kuzatilmadi), 3) Katta ob'ektlarda sekin — barcha xususiyatlar rekursiv o'raladi. Proxy butun ob'ektni bitta trap bilan kuzatadi, yangi xususiyatlar avtomatik, lazy tracking (faqat o'qilgan xususiyatlar track qilinadi), Map/Set qo'llab-quvvatlaydi. Kamchiligi: IE11 qo'llab-quvvatlanmaydi (Vue 2-dan farq).`,
    },
    {
      question: 'Vue qanday qilib faqat kerakli komponentlarni re-render qiladi?',
      answer: `Vue dependency tracking orqali. Har bir komponent render funksiyasi ReactiveEffect sifatida ishlaydi. Birinchi renderda reaktiv xususiyatlar O'QILADI — track() ularni shu komponent effect-iga bog'laydi. Keyinchalik faqat shu xususiyat o'zgarganda trigger() shu effect-ni qayta ishga tushiradi. React-dan farqi: React-da ota re-render -> barcha bolalar re-render (memo kerak). Vue-da ota re-render bo'lmasa-da, bola o'z state-ini kuzatayotgan bo'lsa, faqat O'SHANING O'ZI re-render bo'ladi.`,
    },
    {
      question: 'nextTick() nima va nima uchun kerak?',
      answer: `nextTick() — DOM yangilanishini kutish uchun. Vue state o'zgarishlarini sinxron DOM yangilamaydi — effect-larni mikrotask navbatiga qo'yadi (queueJob). Bir nechta state o'zgarishi BIR navbatga tushadi, dublikatlar olib tashlanadi, faqat BITTA render ishlaydi. await nextTick() — shu navbat bajarilib, DOM yangilangandan KEYIN kodni ishga tushiradi. Masalan: input.value = 'yangi' -> await nextTick() -> input elementining DOM qiymati yangilangan bo'ladi.`,
    },
    {
      question: 'track() va trigger() orasidagi dependency graph tuzilmasini tushuntiring.',
      answer: `Dependency graph: targetMap = WeakMap<object, Map<key, Set<ReactiveEffect>>>. Uch qatlam: 1) target (ob'ekt) -> depsMap, 2) key (xususiyat nomi) -> deps, 3) deps — shu xususiyatni kuzatayotgan effect-lar to'plami. Masalan: const state = reactive({a: 1, b: 2}). Agar A komponent state.a O'QISA, B komponent state.b O'QISA — targetMap[state]['a'] = {A_effect}, targetMap[state]['b'] = {B_effect}. state.a o'zgarganda FAQAT A re-render bo'ladi. WeakMap ishlatilishi — ob'ekt garbage collect bo'lganda avtomatik tozalanadi.`,
    },
    {
      question: 'Vue va React reaktivlik modellarini solishtiring.',
      answer: `Vue: push-based, fine-grained. State o'zgarganda Vue ANIQ biladi qaysi komponent bog'liq — faqat shuni re-render qiladi. Dependency array yozish KERAK EMAS — avtomatik tracking. Mutable state (count.value++). React: pull-based, coarse-grained. useState qilingan komponent va BARCHA bolalari re-render bo'ladi. useEffect/useMemo/useCallback uchun dependency array yozish kerak. Immutable state (setState(prev => prev + 1)). React Compiler bu farqni kamaytirmoqda — avtomatik memoizatsiya qo'shmoqda. Lekin fundamental model hali farq qiladi: Vue qaysi xususiyat o'zgarganini biladi, React faqat setState chaqirilganini biladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'ref-reactive', label: 'ref() va reactive()' },
    { techId: 'vue-js', sectionId: 'vue-reactivity', topicId: 'computed', label: 'computed()' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue2-vs-vue3', label: 'Vue 2 vs Vue 3' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'virtual-dom-vue', label: 'Virtual DOM' },
  ],
}
