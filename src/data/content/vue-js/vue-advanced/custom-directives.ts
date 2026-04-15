import type { Topic } from '../../../types'

export const customDirectives: Topic = {
  id: 'custom-directives',
  title: 'Custom Directives',
  importance: 2,
  status: 'to-learn',
  description: 'Custom direktivalar yaratish, direktiva hook-lari, amaliy misollar',
  content: `Custom directives — Vue-da DOM elementlariga past darajadagi (low-level) funksionallik qo'shish mexanizmi. v-if, v-show, v-model kabi built-in direktivalar qatoriga o'zingizning direktivalaringizni yaratishingiz mumkin.

═══════════════════════════════════════
  DIREKTIVA NIMA VA QACHON KERAK?
═══════════════════════════════════════

Direktiva — DOM elementiga qo'shimcha xatti-harakat (behavior) beradi.
Komponent emas, chunki UI qaytarmaydi — faqat DOM bilan ishlaydi.

Qachon ishlatiladi:
- DOM ga bevosita murojaat kerak (focus, scroll, resize)
- Tashqi kutubxona integratsiyasi (tippy.js, flatpickr)
- Bir xil DOM logikani ko'p joyda qayta ishlatish
- Event listener lar bilan ishlash (click-outside, intersection)

Qachon ISHLATMASLIK kerak:
- Agar composable yetarli bo'lsa — composable afzal
- Agar UI render qilish kerak — komponent ishlating

═══════════════════════════════════════
  DIREKTIVA HOOK-LARI
═══════════════════════════════════════

Vue 3 da direktiva hook-lari komponent lifecycle bilan bir xil:

  const vMyDirective = {
    created(el, binding, vnode) {},      // element yaratildi
    beforeMount(el, binding, vnode) {},  // DOM ga qo'shishdan oldin
    mounted(el, binding, vnode) {},      // DOM ga qo'shildi
    beforeUpdate(el, binding, vnode) {}, // yangilanishdan oldin
    updated(el, binding, vnode) {},      // yangilandi
    beforeUnmount(el, binding, vnode) {},// DOM dan olishdan oldin
    unmounted(el, binding, vnode) {}     // DOM dan olindi
  }

binding objecti:
- value — joriy qiymat: v-dir="123" -> 123
- oldValue — oldingi qiymat (update da)
- arg — argument: v-dir:top -> "top"
- modifiers — modifikatorlar: v-dir.trim.lazy -> { trim: true, lazy: true }
- instance — komponent instansiyasi

═══════════════════════════════════════
  QISQA YOZISH (SHORTHAND)
═══════════════════════════════════════

Agar faqat mounted va updated kerak bo'lsa:
  const vColor = (el, binding) => {
    el.style.color = binding.value
  }

Bu ikki hook uchun bir xil funksiya chaqiriladi.

═══════════════════════════════════════
  RO'YXATGA OLISH
═══════════════════════════════════════

1. Lokal — komponent ichida:
   <script setup>
   const vFocus = { mounted: (el) => el.focus() }
   </script>
   <template><input v-focus /></template>

2. Global — app darajasida:
   app.directive('focus', { mounted: (el) => el.focus() })

═══════════════════════════════════════
  OBJECT LITERAL QIYMAT
═══════════════════════════════════════

Direktivaga murakkab qiymat berish:
  <div v-tooltip="{ text: 'Salom', position: 'top', delay: 300 }">
  // binding.value = { text: 'Salom', position: 'top', delay: 300 }

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React-da direktivalar tushunchasi YO'Q.
React muqobillari:
- Custom hooks (useClickOutside, useFocus)
- ref callback: <input ref={(el) => el?.focus()} />
- HOC yoki wrapper komponent

Vue direktivalar afzalliklari:
- Template da intuitiv sintaksis: v-focus, v-click-outside
- DOM lifecycle bilan chambarchas bog'liq
- Modifiers va arguments qulayligi

React yondashuv afzalliklari:
- Faqat bitta pattern (hooks) — o'rganish osonroq
- Komponent mantiqiy oqimida ko'rinadi (deklarativ)`,
  codeExamples: [
    {
      title: 'v-focus — avtomatik fokus direktiva',
      language: 'html',
      code: `<script setup lang="ts">
// v- prefiksi avtomatik qo'shiladi — const nomi vFocus
const vFocus = {
  mounted(el: HTMLElement) {
    el.focus()
  },
}
</script>

<template>
  <div>
    <h3>Login sahifasi</h3>
    <!-- Sahifa ochilganda avtomatik fokus -->
    <input v-focus placeholder="Username" class="input" />
    <input placeholder="Password" type="password" class="input" />
    <button>Kirish</button>
  </div>
</template>`,
      description: 'Eng oddiy direktiva — element mount bo\'lganda avtomatik fokus beradi.',
    },
    {
      title: 'v-click-outside — tashqariga bosishni aniqlash',
      language: 'ts',
      code: `// directives/clickOutside.ts
import type { Directive, DirectiveBinding } from 'vue'

type ClickHandler = (event: MouseEvent) => void

interface HTMLElementWithClickOutside extends HTMLElement {
  __clickOutside?: ClickHandler
}

export const vClickOutside: Directive = {
  mounted(el: HTMLElementWithClickOutside, binding: DirectiveBinding<ClickHandler>) {
    const handler: ClickHandler = (event) => {
      // Element tashqarisiga bosilganini tekshirish
      if (!el.contains(event.target as Node)) {
        binding.value(event)  // callback chaqirish
      }
    }

    // Referensni saqlash (unmount da tozalash uchun)
    el.__clickOutside = handler
    document.addEventListener('click', handler)
  },

  unmounted(el: HTMLElementWithClickOutside) {
    // Memory leak oldini olish — event listener tozalash
    if (el.__clickOutside) {
      document.removeEventListener('click', el.__clickOutside)
      delete el.__clickOutside
    }
  },
}

// ========== Ishlatish ==========
// <div v-click-outside="closeDropdown" class="dropdown">
//   <button @click="isOpen = !isOpen">Menu</button>
//   <ul v-show="isOpen">
//     <li>Element 1</li>
//     <li>Element 2</li>
//   </ul>
// </div>
//
// const closeDropdown = () => { isOpen.value = false }`,
      description: 'v-click-outside — dropdown, modal yopish uchun. Element tashqarisiga bosilganda callback chaqiriladi.',
    },
    {
      title: 'v-permission — ruxsat tekshirish direktiva',
      language: 'ts',
      code: `// directives/permission.ts
import type { Directive } from 'vue'

// Foydalanuvchi ruxsatlari (odatda store-dan keladi)
const userPermissions = ['read', 'write', 'admin']

export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const required = binding.value
    const permissions = Array.isArray(required) ? required : [required]

    // Modifikatorlar tekshirish
    const checkAll = binding.modifiers.all  // v-permission.all — barchasi kerak

    let hasPermission: boolean
    if (checkAll) {
      hasPermission = permissions.every(p => userPermissions.includes(p))
    } else {
      hasPermission = permissions.some(p => userPermissions.includes(p))
    }

    if (!hasPermission) {
      if (binding.modifiers.disable) {
        // v-permission.disable — o'chirish (ko'rsatish, lekin disable)
        el.setAttribute('disabled', 'true')
        el.style.opacity = '0.5'
        el.style.pointerEvents = 'none'
      } else {
        // Default — yashirish
        el.style.display = 'none'
      }
    }
  },
}

// ========== Ishlatish ==========
// <!-- Ruxsat bo'lmasa yashirish -->
// <button v-permission="'admin'">Foydalanuvchi o'chirish</button>
//
// <!-- Bir nechta ruxsat (bitta yetarli) -->
// <button v-permission="['write', 'admin']">Tahrirlash</button>
//
// <!-- Barchasi kerak -->
// <button v-permission.all="['write', 'admin']">Maxsus</button>
//
// <!-- Yashirish emas, disable qilish -->
// <button v-permission.disable="'admin'">O'chirish</button>`,
      description: 'v-permission — foydalanuvchi ruxsatlariga qarab elementni ko\'rsatish/yashirish/disable qilish.',
    },
    {
      title: 'v-loading — yuklanish overlay',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, type Directive } from 'vue'

// ========== Direktiva ==========
const vLoading: Directive<HTMLElement, boolean> = {
  mounted(el, binding) {
    // Position relative qo'shish (overlay uchun)
    el.style.position = 'relative'

    // Overlay element yaratish
    const overlay = document.createElement('div')
    overlay.className = 'loading-overlay'
    overlay.innerHTML = \`
      <div class="spinner"></div>
      <span>Yuklanmoqda...</span>
    \`
    overlay.style.cssText = \`
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 8px; background: rgba(255,255,255,0.8);
      border-radius: inherit; z-index: 10;
    \`

    // Element ga biriktirish
    ;(el as any).__loadingOverlay = overlay

    if (binding.value) {
      el.appendChild(overlay)
    }
  },

  updated(el, binding) {
    const overlay = (el as any).__loadingOverlay as HTMLElement
    if (binding.value && !el.contains(overlay)) {
      el.appendChild(overlay)
    } else if (!binding.value && el.contains(overlay)) {
      el.removeChild(overlay)
    }
  },

  unmounted(el) {
    delete (el as any).__loadingOverlay
  },
}

// ========== Ishlatish ==========
const isLoading = ref(false)

async function fetchData() {
  isLoading.value = true
  await new Promise(r => setTimeout(r, 2000))
  isLoading.value = false
}
</script>

<template>
  <button @click="fetchData">Ma'lumot yuklash</button>

  <div v-loading="isLoading" class="data-container">
    <p>Bu yerda ma'lumotlar ko'rinadi</p>
    <p>Loading true bo'lganda overlay paydo bo'ladi</p>
  </div>
</template>`,
      description: 'v-loading — element ustiga loading overlay qo\'yish. Element.io kutubxonasi patterini.',
    },
  ],
  interviewQA: [
    {
      question: 'Custom directive nima? Qachon komponent o\'rniga directive ishlatish kerak?',
      answer: `Custom directive — DOM elementga past darajadagi xatti-harakat qo'shish mexanizmi. Komponentdan farqi: UI (template) qaytarmaydi, faqat DOM manipulyatsiya qiladi. Ishlatish: 1) DOM ga bevosita murojaat (focus, scroll, resize), 2) Event listener (click-outside, intersection), 3) Tashqi kutubxona integratsiyasi (tippy.js). Agar UI render kerak — komponent, agar faqat DOM behavior — directive. Composable ham alternativa: agar lifecycle hook kerak bo'lmasa, composable yetarli.`,
    },
    {
      question: 'Direktiva hook-larini sanang. binding objectida nima bor?',
      answer: `Hook-lar (komponent lifecycle bilan bir xil): created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, unmounted. Har bir hook: (el, binding, vnode) qabul qiladi. binding: value (joriy qiymat), oldValue (oldingi), arg (v-dir:arg -> "arg"), modifiers (v-dir.trim -> { trim: true }), instance (komponent). Shorthand: faqat mounted+updated uchun funksiya yozish: const vDir = (el, binding) => {...}.`,
    },
    {
      question: 'Direktiva da memory leak qanday oldini olinadi?',
      answer: `unmounted hook-da barcha event listener, observer, timer larni tozalash SHART. Pattern: mounted-da listener qo'shganda referensni element-ga saqlash (el.__handler = fn), unmounted-da o'chirish (removeEventListener, disconnect, clearInterval). Aks holda komponent yo'q qilingandan keyin ham listener ishlaydi — memory leak. Misol: v-click-outside — document listener, v-intersection — IntersectionObserver, v-debounce — setTimeout.`,
    },
    {
      question: 'React-da direktivalarga muqobil nima?',
      answer: `React-da directive tushunchasi yo'q. Muqobillar: 1) Custom hooks — useClickOutside(), useFocus(), useIntersection(). 2) ref callback — <input ref={(el) => el?.focus()} />. 3) HOC yoki wrapper komponent. 4) forwardRef + useImperativeHandle. Vue direktiva afzalligi — template-da intuitiv: v-focus, v-click-outside. React yondashuv afzalligi — bitta pattern (hooks), mantiqiy oqimda ko'rinadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'render-functions', label: 'Render Functions' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'plugins', label: 'Plugins' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
  ],
}
