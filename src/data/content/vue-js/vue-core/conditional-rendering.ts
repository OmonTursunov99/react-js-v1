import type { Topic } from '../../../types'

export const conditionalRendering: Topic = {
  id: 'conditional-rendering',
  title: 'Shartli Renderlash va Ro\'yxatlar',
  importance: 2,
  status: 'to-learn',
  description: 'v-if vs v-show, v-for, :key, array change detection — shartli va ro\'yxat renderlash',
  content: `Vue da shartli renderlash (conditional rendering) va ro'yxatlar (list rendering) — template-da eng ko'p ishlatiladigan direktivalar. To'g'ri ishlatish — performance va xatosiz ilova uchun muhim.

═══════════════════════════════════════
  v-if VS v-show
═══════════════════════════════════════

v-if — elementni DOM dan TO'LIQ olib tashlaydi/qo'shadi:
  <div v-if="isVisible">Ko'rinadi</div>

  Shart false bo'lganda — DOM da hech narsa yo'q.
  Shart true bo'lganda — element qaytadan yaratiladi.

v-show — faqat CSS display:none qiladi:
  <div v-show="isVisible">Ko'rinadi</div>

  Element DOIM DOM da turadi, faqat yashiriladi.

QACHON NIMA:
- v-if: kamdan-kam o'zgaradigan shart (auth, role, bir martalik tekshirish)
- v-show: tez-tez toggle (modal, dropdown, tab)
- v-if: boshlang'ich shart false — hech narsa renderlaMAYDI (lazy)
- v-show: DOIM renderlanadi, keyin yashiriladi

v-if — qimmatroq (DOM yaratish/o'chirish), v-show — arzonroq (faqat CSS).

═══════════════════════════════════════
  v-else VA v-else-if
═══════════════════════════════════════

Shart zanjirlari:

  <div v-if="status === 'loading'">Yuklanmoqda...</div>
  <div v-else-if="status === 'error'">Xatolik yuz berdi</div>
  <div v-else-if="status === 'empty'">Ma'lumot yo'q</div>
  <div v-else>{{ data }}</div>

MUHIM: v-else/v-else-if — v-if DARHOL KEYIN bo'lishi kerak (orada boshqa element bo'lmasin).

<template> bilan guruhlash (DOM ga element qo'shmasdan):
  <template v-if="isAdmin">
    <h1>Admin Panel</h1>
    <AdminTools />
    <UserList />
  </template>

═══════════════════════════════════════
  v-for — RO'YXAT RENDERLASH
═══════════════════════════════════════

Array bilan:
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <li v-for="(item, index) in items" :key="item.id">
    {{ index + 1 }}. {{ item.name }}
  </li>

Object bilan:
  <div v-for="(value, key, index) in userObj" :key="key">
    {{ index }}: {{ key }} = {{ value }}
  </div>

Diapazon (range):
  <span v-for="n in 5" :key="n">{{ n }}</span>  <!-- 1, 2, 3, 4, 5 -->

<template> bilan (wrapper element qo'shmasdan):
  <template v-for="item in items" :key="item.id">
    <dt>{{ item.title }}</dt>
    <dd>{{ item.description }}</dd>
  </template>

═══════════════════════════════════════
  :key — MUHIM TUSHUNCHA
═══════════════════════════════════════

:key — Vue ning virtual DOM diff algoritmi uchun identifikator.

Key BILAN:
  Vue elementlarni aniq kuzatadi — qayta tartiblash, qo'shish, o'chirish to'g'ri ishlaydi.
  Input state, animatsiya, komponent lifecycle saqlanadi.

Key YO'Q (yoki index ishlatilsa):
  Vue "in-place patch" qiladi — tez, lekin XATO natija berishi mumkin:
  - Input-dagi yozuv noto'g'ri elementda qoladi
  - Animatsiya buziladi
  - Komponent lifecycle noto'g'ri ishlaydi

QOIDALAR:
- DOIM noyob va BARQAROR key ishlatish (item.id, item.slug)
- Index key sifatida ISHLATMANG (tartib o'zgarishi mumkin)
- Index faqat — ro'yxat statik va o'zgarmasa OK

═══════════════════════════════════════
  v-for + v-if — ANTI-PATTERN
═══════════════════════════════════════

v-if va v-for BITTA elementda ishlatmang!

Vue 3 da v-if YUQORIROQ prioritetga ega:
  <!-- XATO — item hali aniqlanmagan! -->
  <li v-for="item in items" v-if="item.active">

TO'G'RI usullar:
1. computed bilan filtrlash:
  const activeItems = computed(() => items.filter(i => i.active))
  <li v-for="item in activeItems" :key="item.id">

2. <template> bilan ajratish:
  <template v-for="item in items" :key="item.id">
    <li v-if="item.active">{{ item.name }}</li>
  </template>

═══════════════════════════════════════
  ARRAY CHANGE DETECTION
═══════════════════════════════════════

Vue KUZATADIGAN mutatsiya metodlari:
  push(), pop(), shift(), unshift(), splice(), sort(), reverse()

Vue KUZATMAYDIGAN o'zgarishlar:
  items[index] = newItem    // To'g'ri: items.splice(index, 1, newItem)
  items.length = 0          // To'g'ri: items.splice(0)

Yaxshi xabar: Vue 3 (Proxy) bilan items[0] = 'yangi' HAM ishlaydi!
Vue 2 da bu muammo edi, Vue 3 da hal bo'lgan.

Butunlay yangi array berish:
  items.value = items.value.filter(i => i.active)  // reaktiv

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Shartli renderlash:
  React: {isVisible && <div>...</div>} yoki ternary
  Vue: v-if="isVisible" — aniqroq, template-da

Ro'yxat:
  React: {items.map(item => <li key={item.id}>...</li>)}
  Vue: <li v-for="item in items" :key="item.id">

Key:
  React va Vue — ikkalasida ham key juda muhim, bir xil maqsad.

React-da JSX ichida JavaScript expression — moslashuvchan, lekin murakkab.
Vue-da direktivalar — soddaroq, lekin kamroq moslashuvchan.
v-show analog React-da yo'q — style={{ display: 'none' }} qo'lda yozish kerak.`,
  codeExamples: [
    {
      title: 'v-if vs v-show — amaliy farq',
      language: 'html',
      code: `<script setup lang="ts">
import { ref } from 'vue'

const showIf = ref(true)
const showShow = ref(true)
const heavyComponentCount = ref(0)

// v-if — har safar yaratiladi/yo'q qilinadi
// v-show — faqat CSS yashiriladi/ko'rsatiladi
</script>

<template>
  <div class="space-y-6">
    <!-- v-if vs v-show demo -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h3 class="font-bold mb-2">v-if</h3>
        <button @click="showIf = !showIf" class="px-3 py-1 bg-blue-500 text-white rounded mb-2">
          Toggle ({{ showIf ? 'ko\\'rinadi' : 'yashirin' }})
        </button>
        <!-- DOM dan to'liq olib tashlanadi -->
        <div v-if="showIf" class="p-4 bg-blue-100 rounded">
          v-if — DOM dan olib tashlangan/qayta yaratilgan
          <input placeholder="Matn kiriting — toggle qilsangiz yo'qoladi" class="mt-2 w-full border px-2 py-1" />
        </div>
      </div>

      <div>
        <h3 class="font-bold mb-2">v-show</h3>
        <button @click="showShow = !showShow" class="px-3 py-1 bg-green-500 text-white rounded mb-2">
          Toggle ({{ showShow ? 'ko\\'rinadi' : 'yashirin' }})
        </button>
        <!-- CSS display:none bilan yashiriladi -->
        <div v-show="showShow" class="p-4 bg-green-100 rounded">
          v-show — CSS bilan yashiriladi, DOM da qoladi
          <input placeholder="Matn kiriting — toggle qilsangiz SAQLANADI" class="mt-2 w-full border px-2 py-1" />
        </div>
      </div>
    </div>

    <!-- v-if — lazy rendering -->
    <div>
      <h3 class="font-bold mb-2">v-if lazy — shart false bo'lsa renderlaMAYDI</h3>
      <p v-if="false">Bu HECH QACHON renderlanmaydi — DOM da yo'q</p>
      <p v-show="false">Bu renderlanadi, lekin yashirin (DOM da bor)</p>
    </div>

    <!-- Shart zanjirlari -->
    <div>
      <h3 class="font-bold mb-2">v-if / v-else-if / v-else</h3>
      <button
        v-for="n in [0, 1, 5, 10]"
        :key="n"
        @click="heavyComponentCount = n"
        :class="['px-3 py-1 mr-2 rounded', heavyComponentCount === n ? 'bg-purple-500 text-white' : 'bg-gray-200']"
      >
        {{ n }}
      </button>
      <div class="mt-2 p-3 rounded" :class="{
        'bg-red-100': heavyComponentCount === 0,
        'bg-yellow-100': heavyComponentCount > 0 && heavyComponentCount < 5,
        'bg-green-100': heavyComponentCount >= 5,
      }">
        <p v-if="heavyComponentCount === 0">Hech narsa yo'q</p>
        <p v-else-if="heavyComponentCount < 5">Kam: {{ heavyComponentCount }}</p>
        <p v-else>Ko'p: {{ heavyComponentCount }}</p>
      </div>
    </div>
  </div>
</template>`,
      description: 'v-if — DOM dan olib tashlaydi (input state yo\'qoladi), v-show — CSS bilan yashiradi (input state saqlanadi). v-else-if zanjiri.',
    },
    {
      title: 'v-for — :key ahamiyati va anti-pattern',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
}

let nextId = 4
const todos = ref<Todo[]>([
  { id: 1, text: 'Vue o\\'rganish', done: false, priority: 'high' },
  { id: 2, text: 'TypeScript', done: true, priority: 'medium' },
  { id: 3, text: 'Test yozish', done: false, priority: 'low' },
])

const newTodo = ref('')
const filter = ref<'all' | 'active' | 'done'>('all')

// TO'G'RI — computed bilan filtrlash (v-for + v-if EMAS)
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active': return todos.value.filter(t => !t.done)
    case 'done': return todos.value.filter(t => t.done)
    default: return todos.value
  }
})

const stats = computed(() => ({
  total: todos.value.length,
  done: todos.value.filter(t => t.done).length,
  active: todos.value.filter(t => !t.done).length,
}))

function addTodo() {
  if (!newTodo.value.trim()) return
  todos.value.push({
    id: nextId++,
    text: newTodo.value,
    done: false,
    priority: 'medium',
  })
  newTodo.value = ''
}

function removeTodo(id: number) {
  todos.value = todos.value.filter(t => t.id !== id)
}

function toggleDone(todo: Todo) {
  todo.done = !todo.done
}
</script>

<template>
  <div>
    <!-- Qo'shish -->
    <form @submit.prevent="addTodo" class="flex gap-2 mb-4">
      <input v-model.trim="newTodo" placeholder="Yangi vazifa" class="border px-3 py-2 flex-1 rounded" />
      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Qo'shish</button>
    </form>

    <!-- Filter — v-for bilan inline array -->
    <div class="flex gap-2 mb-4">
      <button
        v-for="f in (['all', 'active', 'done'] as const)"
        :key="f"
        @click="filter = f"
        :class="['px-3 py-1 rounded', filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200']"
      >
        {{ f }} ({{ f === 'all' ? stats.total : f === 'done' ? stats.done : stats.active }})
      </button>
    </div>

    <!-- Ro'yxat — :key="todo.id" (INDEX EMAS!) -->
    <TransitionGroup name="list" tag="ul" class="space-y-2">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="flex items-center gap-3 p-3 bg-white border rounded shadow-sm"
      >
        <input type="checkbox" :checked="todo.done" @change="toggleDone(todo)" />
        <span :class="{ 'line-through text-gray-400': todo.done }" class="flex-1">
          {{ todo.text }}
        </span>
        <span class="text-xs px-2 py-0.5 rounded" :class="{
          'bg-red-100 text-red-700': todo.priority === 'high',
          'bg-yellow-100 text-yellow-700': todo.priority === 'medium',
          'bg-green-100 text-green-700': todo.priority === 'low',
        }">
          {{ todo.priority }}
        </span>
        <button @click="removeTodo(todo.id)" class="text-red-500 hover:text-red-700">✕</button>
      </li>
    </TransitionGroup>

    <p v-if="filteredTodos.length === 0" class="text-center text-gray-500 py-8">
      Vazifalar yo'q
    </p>
  </div>
</template>`,
      description: ':key="todo.id" — noyob identifikator (index EMAS). computed bilan filtrlash — v-for + v-if anti-pattern o\'rniga. TransitionGroup animatsiya.',
    },
    {
      title: 'v-for — Object, Range, template',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, reactive } from 'vue'

// Object bilan v-for
const userProfile = reactive({
  ism: 'Ali Valiyev',
  email: 'ali@example.com',
  yoshi: 28,
  kasbi: 'Frontend Developer',
  shahar: 'Toshkent',
})

// Nested object — v-for ichida v-for
const categories = ref([
  {
    id: 1,
    name: 'Frontend',
    skills: ['Vue', 'React', 'TypeScript', 'CSS'],
  },
  {
    id: 2,
    name: 'Backend',
    skills: ['Node.js', 'Python', 'PostgreSQL'],
  },
  {
    id: 3,
    name: 'DevOps',
    skills: ['Docker', 'CI/CD', 'AWS'],
  },
])

// Array mutatsiya
function addSkill(categoryId: number) {
  const cat = categories.value.find(c => c.id === categoryId)
  if (cat) {
    const skill = prompt('Yangi skill:')
    if (skill) cat.skills.push(skill)
  }
}

function removeSkill(categoryId: number, index: number) {
  const cat = categories.value.find(c => c.id === categoryId)
  if (cat) cat.skills.splice(index, 1)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Object bo'yicha v-for -->
    <div>
      <h3 class="font-bold mb-2">Object bo'yicha v-for</h3>
      <table class="w-full border-collapse">
        <tr v-for="(value, key, index) in userProfile" :key="key"
            :class="index % 2 === 0 ? 'bg-gray-50' : ''">
          <td class="border px-3 py-2 font-semibold capitalize">{{ key }}</td>
          <td class="border px-3 py-2">{{ value }}</td>
        </tr>
      </table>
    </div>

    <!-- Range — 1 dan N gacha -->
    <div>
      <h3 class="font-bold mb-2">Range v-for (1-5)</h3>
      <div class="flex gap-2">
        <div v-for="n in 5" :key="n"
          class="w-10 h-10 flex items-center justify-center rounded bg-blue-500 text-white font-bold">
          {{ n }}
        </div>
      </div>
    </div>

    <!-- Nested v-for + template -->
    <div>
      <h3 class="font-bold mb-2">Ichma-ich v-for</h3>
      <div v-for="category in categories" :key="category.id" class="mb-4">
        <div class="flex items-center gap-2 mb-1">
          <h4 class="font-semibold">{{ category.name }}</h4>
          <button @click="addSkill(category.id)" class="text-sm text-blue-500">+ Qo'shish</button>
        </div>
        <!-- template v-for — wrapper element qo'shmasdan -->
        <div class="flex flex-wrap gap-1">
          <template v-for="(skill, i) in category.skills" :key="skill">
            <span class="px-2 py-1 bg-gray-200 rounded text-sm flex items-center gap-1">
              {{ skill }}
              <button @click="removeSkill(category.id, i)" class="text-red-400 hover:text-red-600">&times;</button>
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>`,
      description: 'v-for object (value, key, index), range (1-N), nested v-for, template v-for. Array mutatsiya: push(), splice().',
    },
  ],
  interviewQA: [
    {
      question: 'v-if va v-show farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `v-if — elementni DOM dan to'liq olib tashlaydi va qaytadan yaratadi. v-show — element DOIM DOM da, faqat CSS display:none bilan yashiriladi. v-if: kamdan-kam o'zgaradigan shart (auth, role), boshlang'ich false — lazy (renderlaMAYDI). v-show: tez-tez toggle (modal, tab, dropdown), element og'ir bo'lganda (qayta yaratish qimmat). v-if qimmatroq (DOM manipulyatsiya), v-show arzonroq (faqat CSS). v-show <template> da ishlaMAYDI, v-if ishlaydi.`,
    },
    {
      question: 'v-for da :key nima uchun kerak va index nima uchun yomon?',
      answer: `key — Vue virtual DOM diff algoritmi uchun element identifikatori. key bilan Vue elementlarni aniq kuzatadi — qayta tartiblash, qo'shish, o'chirish to'g'ri ishlaydi. key yo'q — "in-place patch": Vue elementlarni qayta ishlatadi, ichini o'zgartiradi — tez, lekin input state, animatsiya, lifecycle buzilishi mumkin. Index key — tartib o'zgarsa (sort, filter, splice) noto'g'ri ishlaydi, chunki index o'zgaradi. DOIM noyob, barqaror key: item.id, item.slug. Index — FAQAT statik ro'yxat uchun.`,
    },
    {
      question: 'v-for va v-if birgalikda ishlatish nima uchun anti-pattern?',
      answer: `Vue 3 da v-if YUQORIROQ prioritetga ega — v-for dan OLDIN baholanadi. Natijada: <li v-for="item in items" v-if="item.active"> — item hali aniqlanmagan! To'g'ri usullar: 1) computed bilan filtrlash: const active = computed(() => items.filter(i => i.active)) — performance yaxshi (keshlanadi). 2) <template v-for> + ichida <li v-if> — har bir element uchun tekshirish. Computed usul tavsiya etiladi — toza, test qilish oson, keshlanadi.`,
    },
    {
      question: 'Vue 3 da array change detection qanday ishlaydi?',
      answer: `Vue 3 Proxy API ishlatadi — barcha o'zgarishlar kuzatiladi: items[0] = 'yangi' HAM ishlaydi (Vue 2 da ishlamasdi). Mutatsiya metodlari (push, pop, splice, sort, reverse) — reaktiv. Butunlay yangi array berish: items.value = [...newItems] — ham reaktiv. Vue 2 da Vue.set() yoki splice() kerak edi — Vue 3 da bu muammo yo'q. LEKIN reactive() bilan destructure qilinganda reaktivlik yo'qoladi — ref() ishlatish tavsiya etiladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'directives', label: 'Direktivalar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'performance', label: 'Performance' },
  ],
}
