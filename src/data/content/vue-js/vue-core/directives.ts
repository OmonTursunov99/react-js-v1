import type { Topic } from '../../../types'

export const directives: Topic = {
  id: 'directives',
  title: 'Direktivalar',
  importance: 3,
  status: 'to-learn',
  description: 'v-if/v-show, v-for, v-bind, v-on, v-model, custom directives — template boshqaruvi',
  content: `Direktivalar — Vue template-da maxsus atributlar bo'lib, DOM elementlarni reaktiv tarzda boshqarish uchun ishlatiladi. v- prefiksi bilan boshlanadi.

═══════════════════════════════════════
  v-if / v-else-if / v-else VS v-show
═══════════════════════════════════════

v-if — elementni DOM dan TO'LIQ olib tashlaydi/qo'shadi:
  <div v-if="status === 'loading'">Yuklanmoqda...</div>
  <div v-else-if="status === 'error'">Xatolik!</div>
  <div v-else>Ma'lumot tayyor</div>

v-show — faqat CSS display:none qiladi (DOM da qoladi):
  <div v-show="isVisible">Ko'rinadi/yashirinadi</div>

QACHON NIMA:
- v-if — kamdan-kam o'zgaradigan holat (auth, role-based UI)
- v-show — tez-tez o'zgaradigan holat (toggle, tab)
- v-if — boshlang'ich render-da shart false bo'lsa — hech narsa renderlaMAYDI (lazy)
- v-show — DOIM renderlanadi, faqat CSS bilan yashiriladi

═══════════════════════════════════════
  v-for — Ro'yxat renderlash
═══════════════════════════════════════

  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- index bilan: -->
  <li v-for="(item, index) in items" :key="item.id">
    {{ index + 1 }}. {{ item.name }}
  </li>

  <!-- Object uchun: -->
  <div v-for="(value, key, index) in userObj" :key="key">
    {{ key }}: {{ value }}
  </div>

  <!-- Diapazon: -->
  <span v-for="n in 10" :key="n">{{ n }}</span>

MUHIM: :key DOIM qo'yish kerak! Key — Vue ning element identifikatsiyasi uchun.
OGOHLANTIRISH: v-if va v-for BITTA elementda ishlatmang! v-if yuqoriroq prioritetga ega.

═══════════════════════════════════════
  v-bind (:) — Atribut bog'lash
═══════════════════════════════════════

  <img v-bind:src="imageUrl" />
  <img :src="imageUrl" />          <!-- qisqa sintaksis -->

  <!-- Dinamik class: -->
  <div :class="{ active: isActive, 'text-bold': isBold }"></div>
  <div :class="[baseClass, isActive ? 'active' : '']"></div>

  <!-- Dinamik style: -->
  <div :style="{ color: textColor, fontSize: size + 'px' }"></div>

  <!-- Barcha atributlarni bir vaqtda: -->
  <input v-bind="inputAttrs" />
  <!-- inputAttrs = { type: 'text', placeholder: 'Ism', disabled: false } -->

═══════════════════════════════════════
  v-on (@) — Hodisa tinglash
═══════════════════════════════════════

  <button v-on:click="handleClick">Bosing</button>
  <button @click="handleClick">Bosing</button>     <!-- qisqa -->

  <!-- Modifikatorlar: -->
  <form @submit.prevent="onSubmit">          <!-- preventDefault -->
  <input @keyup.enter="onEnter">             <!-- faqat Enter -->
  <button @click.stop="onClick">             <!-- stopPropagation -->
  <button @click.once="onClickOnce">         <!-- faqat 1 marta -->
  <div @click.self="onSelf">                 <!-- faqat o'zi bosilganda -->

═══════════════════════════════════════
  v-model — Ikki tomonlama bog'lash
═══════════════════════════════════════

  <input v-model="name" />
  <!-- Teng: <input :value="name" @input="name = $event.target.value" /> -->

  <!-- Modifikatorlar: -->
  <input v-model.trim="name" />        <!-- bo'shliqlarni olib tashlash -->
  <input v-model.number="age" />       <!-- number ga aylantirish -->
  <input v-model.lazy="search" />      <!-- input emas, change eventda -->

  <!-- Component v-model (Vue 3.4+): -->
  <!-- Bola: defineModel() -->
  <!-- Ota: <Child v-model="value" /> -->

═══════════════════════════════════════
  CUSTOM DIRECTIVES
═══════════════════════════════════════

O'z direktivangizni yaratish mumkin:

  // v-focus — avtomatik fokus
  const vFocus = {
    mounted(el: HTMLElement) {
      el.focus()
    }
  }

  // v-click-outside
  const vClickOutside = {
    mounted(el, binding) {
      el._clickOutside = (e) => {
        if (!el.contains(e.target)) binding.value(e)
      }
      document.addEventListener('click', el._clickOutside)
    },
    unmounted(el) {
      document.removeEventListener('click', el._clickOutside)
    }
  }

Lifecycle hook-lar: created, beforeMount, mounted, beforeUpdate,
updated, beforeUnmount, unmounted`,
  codeExamples: [
    {
      title: 'v-if, v-for, v-bind amaliy misol',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'

interface Task {
  id: number
  text: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
}

const tasks = ref<Task[]>([
  { id: 1, text: 'Vue o\\'rganish', done: false, priority: 'high' },
  { id: 2, text: 'Nuxt o\\'rganish', done: false, priority: 'medium' },
  { id: 3, text: 'Test yozish', done: true, priority: 'low' },
])

const filter = ref<'all' | 'active' | 'done'>('all')

const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter(t => !t.done)
  if (filter.value === 'done') return tasks.value.filter(t => t.done)
  return tasks.value
})

const priorityClass: Record<string, string> = {
  high: 'border-red-500 bg-red-50',
  medium: 'border-yellow-500 bg-yellow-50',
  low: 'border-green-500 bg-green-50',
}
</script>

<template>
  <div>
    <!-- v-for + v-bind:class -->
    <button
      v-for="f in ['all', 'active', 'done'] as const"
      :key="f"
      :class="{ 'font-bold underline': filter === f }"
      @click="filter = f"
    >
      {{ f }}
    </button>

    <!-- v-if — bo'sh holat -->
    <p v-if="filteredTasks.length === 0">Vazifalar yo'q</p>

    <!-- v-for + :class + v-model -->
    <div
      v-for="task in filteredTasks"
      :key="task.id"
      :class="[priorityClass[task.priority], 'p-2 border-l-4 mb-2']"
    >
      <label>
        <input type="checkbox" v-model="task.done" />
        <span :class="{ 'line-through opacity-50': task.done }">
          {{ task.text }}
        </span>
      </label>
    </div>
  </div>
</template>`,
      description: 'v-for bilan ro\'yxat, :class bilan dinamik stillar, v-model bilan checkbox, v-if bilan bo\'sh holat. computed bilan filtrlash.',
    },
    {
      title: 'v-model komponentda — defineModel()',
      language: 'html',
      code: `<!-- SearchInput.vue — Vue 3.4+ defineModel -->
<script setup lang="ts">
// defineModel — v-model uchun makro
const modelValue = defineModel<string>({ default: '' })

// Bir nechta v-model:
// const title = defineModel<string>('title')
// const content = defineModel<string>('content')

function clear() {
  modelValue.value = ''
}
</script>

<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="modelValue = ($event.target as HTMLInputElement).value"
      placeholder="Qidirish..."
      class="border rounded px-3 py-2 w-full"
    />
    <button
      v-show="modelValue"
      @click="clear"
      class="absolute right-2 top-2"
    >
      ✕
    </button>
  </div>
</template>

<!-- Ota komponentda ishlatish: -->
<!--
<script setup>
import { ref } from 'vue'
import SearchInput from './SearchInput.vue'

const search = ref('')
</script>

<template>
  <SearchInput v-model="search" />
  <p>Qidiruv: {{ search }}</p>
</template>
-->`,
      description: 'Vue 3.4+ defineModel() — v-model uchun eng qulay usul. Avval modelValue prop + update:modelValue emit kerak edi.',
    },
    {
      title: 'Custom directive — v-click-outside',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, type Directive } from 'vue'

// Custom directive — element tashqarisiga bosilganda
const vClickOutside: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    const handler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value()  // callback chaqirish
      }
    }
    // Handler-ni element-ga saqlash (unmount-da o'chirish uchun)
    ;(el as any).__clickOutside = handler
    document.addEventListener('click', handler)
  },
  unmounted(el) {
    document.removeEventListener('click', (el as any).__clickOutside)
  },
}

const isDropdownOpen = ref(false)
const selectedItem = ref('Tanlang...')

function closeDropdown() {
  isDropdownOpen.value = false
}

function selectItem(item: string) {
  selectedItem.value = item
  isDropdownOpen.value = false
}
</script>

<template>
  <div v-click-outside="closeDropdown" class="relative inline-block">
    <button @click="isDropdownOpen = !isDropdownOpen">
      {{ selectedItem }}
    </button>
    <ul v-show="isDropdownOpen" class="absolute bg-white border shadow mt-1">
      <li
        v-for="item in ['Vue', 'React', 'Angular']"
        :key="item"
        @click="selectItem(item)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>`,
      description: 'Custom directive lifecycle: mounted, updated, unmounted. v-click-outside — dropdown, modal kabi komponentlar uchun juda kerakli.',
    },
  ],
  interviewQA: [
    {
      question: 'v-if va v-show farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `v-if — elementni DOM dan to'liq olib tashlaydi (shart false bo'lganda) va qaytadan yaratadi (true bo'lganda). v-show — element DOIM DOM da turadi, faqat CSS display:none bilan yashiriladi. v-if — kamdan-kam o'zgaradigan holat uchun (auth check, role-based UI), chunki DOM yaratish/o'chirish qimmat. v-show — tez-tez toggle qilinadigan holat uchun (tab, modal, tooltip), chunki faqat CSS o'zgaradi. v-if lazy — boshlang'ich shart false bo'lsa, hech narsa renderlanmaydi.`,
    },
    {
      question: 'v-for da :key nima uchun kerak?',
      answer: `key — Vue ning virtual DOM diff algoritmi uchun element identifikatori. key bo'lmasa, Vue "in-place patch" strategiyasini ishlatadi — elementlarni qayta ishlatadi, faqat ichini o'zgartiradi. Bu tez ishlaydi, lekin input state, animatsiya, komponent lifecycle muammolariga olib kelishi mumkin. key bor bo'lsa — Vue elementlarni aniq kuzatadi, qayta tartiblaydi, kerakli o'zgarishlarni qiladi. DOIM noyob va barqaror key ishlatish kerak (index EMAS, chunki tartib o'zgarishi mumkin).`,
    },
    {
      question: 'v-model qanday ishlaydi? Komponent uchun v-model qanday yaratiladi?',
      answer: `v-model — :value + @input sintaktik qisqartmasi (two-way binding). Input uchun: <input v-model="name"> = <input :value="name" @input="name = $event.target.value">. Komponent uchun (Vue 3.4+): defineModel() makrosi — eng qulay usul. Avval: modelValue prop + update:modelValue emit kerak edi. Bir nechta v-model: <Comp v-model:title="t" v-model:content="c"> — har biri alohida prop/emit juftligi. Modifikatorlar: .trim, .number, .lazy — input qiymatini transformatsiya qiladi.`,
    },
    {
      question: 'Custom directive nima va qachon ishlatiladi?',
      answer: `Custom directive — to'g'ridan-to'g'ri DOM manipulyatsiyasi kerak bo'lganda ishlatiladi. Masalan: v-focus (avtomatik fokus), v-click-outside (tashqariga bosish), v-tooltip, v-intersection (lazy loading), v-permission (ruxsat tekshirish). Directive lifecycle: created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, unmounted. LEKIN ko'p hollarda composable yoki komponent yaxshiroq. Directive FAQAT past darajadagi DOM operatsiyalari uchun ishlatilishi kerak.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'performance', label: 'Performance' },
  ],
}
