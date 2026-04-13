import type { Topic } from '../../../types'

export const templateRefs: Topic = {
  id: 'template-refs',
  title: 'Template Refs',
  importance: 2,
  status: 'to-learn',
  description: 'ref on elements, component refs, nextTick — DOM ga to\'g\'ridan-to\'g\'ri murojaat',
  content: `Template refs — Vue komponentda DOM elementga yoki bola komponentga to'g'ridan-to'g'ri murojaat qilish mexanizmi.

═══════════════════════════════════════
  ELEMENT REF
═══════════════════════════════════════

ref atributi bilan DOM elementga havola olish:

  <script setup>
  import { ref, onMounted } from 'vue'

  const inputRef = ref<HTMLInputElement | null>(null)

  onMounted(() => {
    inputRef.value?.focus()   // DOM tayyor — fokus berish
  })
  </script>

  <template>
    <input ref="inputRef" />
  </template>

MUHIM:
- ref qiymati onMounted DAN KEYIN mavjud (oldin null)
- TypeScript-da HTML element tipini ko'rsatish kerak
- ref nomi template-dagi ref="..." bilan AYNAN bir xil bo'lishi kerak

═══════════════════════════════════════
  v-for ICHIDA REF
═══════════════════════════════════════

v-for bilan ref ishlatilganda — massiv bo'ladi:

  const itemRefs = ref<HTMLLIElement[]>([])

  <li v-for="item in items" :key="item.id" ref="itemRefs">
    {{ item.text }}
  </li>

  // onMounted da:
  itemRefs.value.forEach(el => console.log(el.textContent))

DIQQAT: Massiv tartibi v-for tartibi bilan BIR XIL bo'lmasligi mumkin!

═══════════════════════════════════════
  COMPONENT REF
═══════════════════════════════════════

Bola komponentga ref qo'yish:

  <script setup>
  import { ref } from 'vue'
  import ChildComponent from './ChildComponent.vue'

  const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

  function callChildMethod() {
    childRef.value?.someMethod()
  }
  </script>

  <template>
    <ChildComponent ref="childRef" />
  </template>

MUHIM: <script setup> da bola komponent o'z ichki state-ini YASHIRADI.
Ota ko'rishi uchun bola defineExpose() ishlatishi kerak:

  // ChildComponent.vue
  <script setup>
  const count = ref(0)
  function increment() { count.value++ }

  defineExpose({ count, increment })  // faqat bularni ota ko'radi
  </script>

═══════════════════════════════════════
  nextTick()
═══════════════════════════════════════

Vue reaktiv state o'zgarganida DOM ni DARHOL yangilaMAYDI —
navbatga qo'yib, bir vaqtda barcha o'zgarishlarni qo'llaydi.

nextTick() — DOM yangilanishini KUTISH:

  import { nextTick } from 'vue'

  count.value++
  // Bu yerda DOM hali ESKI

  await nextTick()
  // Bu yerda DOM YANGILANGAN

Ishlatish holatlari:
- State o'zgartirgandan keyin DOM elementni o'lchash
- Input-ga fokus berish (v-if bilan ko'rsatilgandan keyin)
- Scroll pozitsiyasini sozlash

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue ref() = React useRef()
Vue defineExpose() = React useImperativeHandle()
Vue nextTick() = React flushSync() (yaqin, lekin farqli)

Farq: Vue-da ref nomi string bo'lishi mumkin, React-da faqat object.`,
  codeExamples: [
    {
      title: 'Element ref va nextTick',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement | null>(null)
const messageRef = ref<HTMLDivElement | null>(null)
const isEditing = ref(false)
const text = ref('Salom dunyo')

// onMounted — DOM tayyor
onMounted(() => {
  console.log('Input element:', inputRef.value)
})

async function startEditing() {
  isEditing.value = true

  // v-if bilan ko'rsatilgan input hali DOM da YO'Q
  // nextTick — DOM yangilanishini kutish
  await nextTick()

  // Endi input DOM da bor — fokus berish mumkin
  inputRef.value?.focus()
  inputRef.value?.select()  // matnni belgilash
}

async function addMessage(msg: string) {
  text.value = msg

  await nextTick()

  // DOM yangilangandan keyin scroll
  if (messageRef.value) {
    messageRef.value.scrollTop = messageRef.value.scrollHeight
  }
}
</script>

<template>
  <div>
    <div v-if="!isEditing">
      <p>{{ text }}</p>
      <button @click="startEditing">Tahrirlash</button>
    </div>
    <div v-else>
      <input
        ref="inputRef"
        v-model="text"
        @keyup.enter="isEditing = false"
        @blur="isEditing = false"
      />
    </div>

    <div ref="messageRef" class="h-40 overflow-y-auto">
      <!-- Xabarlar ro'yxati -->
    </div>
  </div>
</template>`,
      description: 'nextTick() — DOM yangilanishini kutish. v-if bilan ko\'rsatilgan elementga faqat nextTick DAN KEYIN murojaat mumkin.',
    },
    {
      title: 'Component ref va defineExpose',
      language: 'html',
      code: `<!-- CounterChild.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const secretData = ref('bu yashirin')

function increment() {
  count.value++
}

function reset() {
  count.value = 0
}

// Faqat expose qilingan narsalar ota ko'radi
// secretData — yashirin qoladi
defineExpose({
  count,      // readonly ref
  increment,  // metod
  reset,      // metod
})
</script>

<template>
  <div class="border p-4 rounded">
    <p>Bola counter: {{ count }}</p>
    <button @click="increment">+1 (ichki)</button>
  </div>
</template>

<!-- ParentComponent.vue -->
<!--
<script setup lang="ts">
import { ref } from 'vue'
import CounterChild from './CounterChild.vue'

const counterRef = ref<InstanceType<typeof CounterChild> | null>(null)

function incrementFromParent() {
  counterRef.value?.increment()
}

function getChildCount() {
  console.log('Bola count:', counterRef.value?.count)
}

function resetChild() {
  counterRef.value?.reset()
}
</script>

<template>
  <div>
    <CounterChild ref="counterRef" />
    <button @click="incrementFromParent">+1 (ota orqali)</button>
    <button @click="getChildCount">Count olish</button>
    <button @click="resetChild">Reset</button>
  </div>
</template>
-->`,
      description: 'defineExpose — script setup da bola komponent nimani ochib ko\'rsatishni boshqaradi. InstanceType — TypeScript tip olish.',
    },
    {
      title: 'v-for ichida ref — massiv bilan ishlash',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface ListItem {
  id: number
  text: string
  height?: number
}

const items = ref<ListItem[]>([
  { id: 1, text: 'Birinchi element' },
  { id: 2, text: 'Ikkinchi element' },
  { id: 3, text: 'Uchinchi element — uzunroq matn bilan' },
])

// v-for ichida ref — massiv sifatida olinadi
const itemRefs = ref<HTMLDivElement[]>([])

onMounted(() => {
  measureItems()
})

function measureItems() {
  itemRefs.value.forEach((el, index) => {
    if (items.value[index]) {
      items.value[index].height = el.offsetHeight
    }
  })
}

function addItem() {
  const newId = Math.max(...items.value.map(i => i.id)) + 1
  items.value.push({
    id: newId,
    text: \`Yangi element #\${newId}\`,
  })
}

// items o'zgarganda qayta o'lchash
watch(items, async () => {
  // DOM yangilanishini kutish
  await new Promise(r => setTimeout(r, 0))
  measureItems()
}, { deep: true })
</script>

<template>
  <div>
    <div
      v-for="item in items"
      :key="item.id"
      ref="itemRefs"
      class="p-2 border mb-2"
    >
      {{ item.text }}
      <span v-if="item.height" class="text-sm text-gray-400">
        ({{ item.height }}px)
      </span>
    </div>
    <button @click="addItem">Element qo'shish</button>
  </div>
</template>`,
      description: 'v-for ichida ref — avtomatik massiv. Element o\'lchamlarini hisoblash va dinamik layout uchun foydali.',
    },
  ],
  interviewQA: [
    {
      question: 'Template ref va Composition API ref farqi nima?',
      answer: `Ikkalasi ham ref() funksiyasi bilan yaratiladi, lekin maqsadi farq qiladi. Composition API ref — REAKTIV qiymat saqlash (state). Template ref — DOM elementga HAVOLA saqlash. Ikkalasi bir xil ref() bilan yaratiladi, Vue template-dagi ref="name" atributini tekshirib, mos kelgan ref o'zgaruvchisiga DOM elementni yozadi. Template ref qiymati onMounted DAN KEYIN mavjud, oldin null.`,
    },
    {
      question: 'defineExpose() nima uchun kerak?',
      answer: `<script setup> da barcha o'zgaruvchi va funksiyalar YASHIRIN — ota komponent ko'ra olmaydi. Bu xavfsizlik va enkapsulatsiya uchun yaxshi. defineExpose() — faqat tanlangan narsalarni ota komponentga ochish. Bu React-dagi useImperativeHandle()-ga o'xshash. Amaliy misol: form komponentda validate() metodini expose qilish, modal komponentda open()/close() metodlarini. LEKIN ko'p hollarda props/emits yaxshiroq — ref orqali boshqarish imperative pattern, Vue deklarativ pattern-ni tavsiya etadi.`,
    },
    {
      question: 'nextTick() nima va qachon ishlatiladi?',
      answer: `nextTick() — Vue DOM yangilanishini kutish uchun. Vue reaktiv state o'zgarganida DOM ni DARHOL yangilamaydi — barcha o'zgarishlarni to'plab, bitta mikrotaskda qo'llaydi (batching). nextTick() keyingi DOM yangilanishini kutadi. Ishlatish: 1) state o'zgartirgandan keyin DOM o'lchamini o'lchash, 2) v-if bilan ko'rsatilgan elementga fokus berish, 3) scroll pozitsiyasini sozlash. async/await bilan ishlaydi: await nextTick().`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
  ],
}
