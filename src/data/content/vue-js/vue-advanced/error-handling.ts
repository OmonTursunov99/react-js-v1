import type { Topic } from '../../../types'

export const errorHandling: Topic = {
  id: 'error-handling',
  title: 'Error Handling',
  importance: 2,
  status: 'to-learn',
  description: 'onErrorCaptured, errorHandler, xatolik propagatsiyasi, Error Boundary pattern',
  content: `Vue da xatoliklarni boshqarish — ilovaning barqarorligini ta'minlash uchun muhim. Vue bir nechta darajada error handling mexanizmlarini taqdim etadi: komponent darajasida, ilova darajasida va global darajada.

═══════════════════════════════════════
  onErrorCaptured() HOOK
═══════════════════════════════════════

Komponent darajasida — child komponentlardan ko'tarilgan
xatoliklarni ushlash:

  onErrorCaptured((error, instance, info) => {
    console.error('Xatolik:', error)
    console.log('Komponent:', instance)
    console.log('Info:', info)  // "setup function", "render", etc.

    // return false — xatolik propagatsiyasini TO'XTATISH
    // return true yoki hech narsa — xatolik yuqoriga ko'tariladi
    return false
  })

error — Error objecti
instance — xatolik yuz bergan komponent instansiyasi (yoki null)
info — xatolik manbayi haqida string ("render function", "watcher callback" va h.k.)

MUHIM: return false qilmasa — xatolik parent komponentga
va oxirida app.config.errorHandler ga yetib boradi.

═══════════════════════════════════════
  app.config.errorHandler
═══════════════════════════════════════

Ilova darajasida BARCHA ushlanmagan xatoliklarni tutish:

  // main.ts
  app.config.errorHandler = (err, instance, info) => {
    // Xatolikni log servisga yuborish
    logService.captureError(err as Error, {
      component: instance?.$options.name,
      info,
    })
  }

Bu handler Vue tomonidan ushlanmagan BARCHA xatoliklarni oladi:
- Template render xatoliklari
- Lifecycle hook xatoliklari
- Watcher callback xatoliklari
- Component event handler xatoliklari
- setup() funksiya xatoliklari

═══════════════════════════════════════
  app.config.warnHandler
═══════════════════════════════════════

Development da Vue warning-larni ushlash:

  app.config.warnHandler = (msg, instance, trace) => {
    // Custom warning handling
    // Faqat development da ishlaydi!
  }

Production da warning-lar chiqmaydi (performance uchun).

═══════════════════════════════════════
  XATOLIK PROPAGATSIYASI
═══════════════════════════════════════

Xatolik ko'tarilish tartibi (pastdan yuqoriga):

  1. Xatolik yuz bergan komponent
  2. Parent — onErrorCaptured (return false -> to'xtaydi)
  3. Grandparent — onErrorCaptured
  4. ... yuqoriga
  5. app.config.errorHandler — oxirgi bosqich

Agar hech kim ushlamasa — console.error ga tushadi.

═══════════════════════════════════════
  ASYNC XATOLIKLAR
═══════════════════════════════════════

Vue async xatoliklarni ham ushlaydi:
- async setup() ichidagi xatoliklar
- async lifecycle hook (onMounted(async () => ...))
- Promise.reject — watcher va event handler ichida

LEKIN: setTimeout, setInterval ichidagi xatoliklar
Vue tizimidan TASHQARIDA — ushlanmaydi.
Ular uchun: window.onerror yoki window.addEventListener('error')

═══════════════════════════════════════
  ERROR BOUNDARY PATTERN
═══════════════════════════════════════

React Error Boundary patternini Vue da qo'llash:

  <ErrorBoundary>
    <DangerousComponent />
  </ErrorBoundary>

ErrorBoundary — onErrorCaptured bilan xatolikni ushlaydi,
xatolik UI ko'rsatadi, retry imkoniyati beradi.

Bu pattern kutubxona komponentlarni o'rash uchun juda foydali —
bitta komponent xatoligi butun ilovani sindirishining oldini oladi.

═══════════════════════════════════════
  SENTRY INTEGRATSIYA
═══════════════════════════════════════

Production da xatoliklarni kuzatish:

  // npm i @sentry/vue
  import * as Sentry from '@sentry/vue'

  Sentry.init({
    app,
    dsn: 'https://your-dsn@sentry.io/project',
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
  })

Sentry avtomatik app.config.errorHandler ni o'rnatadi
va barcha Vue xatoliklarni dashboard-ga yuboradi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React Error Boundaries:
- CLASS komponent SHART (componentDidCatch, getDerivedStateFromError)
- Functional component bilan Error Boundary YARATIB BO'LMAYDI
- react-error-boundary kutubxonasi mashhur

Vue Error Handling:
- onErrorCaptured — HOOK (Composition API bilan ishlaydi)
- app.config.errorHandler — global handler
- Functional component bilan Error Boundary YARATISH MUMKIN

Farqlar:
- React Error Boundary faqat render xatoliklarini ushlaydi
- Vue onErrorCaptured render, lifecycle, watcher hammasini ushlaydi
- React da async xatolik uchun ErrorBoundary ISHLAMAYDI
- Vue da async setup() xatoliklari ushlanadi
- React Error Boundary class kerak, Vue da hook yetarli`,
  codeExamples: [
    {
      title: 'ErrorBoundary komponent — Vue Error Boundary pattern',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, onErrorCaptured, type Component } from 'vue'

interface Props {
  fallback?: Component
  onError?: (error: Error, info: string) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: undefined,
})

const error = ref<Error | null>(null)
const errorInfo = ref<string>('')

// Child komponentlardan ko'tarilgan xatoliklarni ushlash
onErrorCaptured((err, instance, info) => {
  error.value = err as Error
  errorInfo.value = info

  // Callback bor bo'lsa chaqirish (logging uchun)
  props.onError?.(err as Error, info)

  // return false — xatolik propagatsiyasini to'xtatish
  // Aks holda app.config.errorHandler ga ham yetadi
  return false
})

function retry() {
  error.value = null
  errorInfo.value = ''
}
</script>

<template>
  <!-- Xatolik bo'lsa — fallback ko'rsatish -->
  <div v-if="error" class="error-boundary">
    <!-- Custom fallback komponent -->
    <component v-if="fallback" :is="fallback" :error="error" :retry="retry" />

    <!-- Default fallback -->
    <div v-else class="error-fallback">
      <h3>Xatolik yuz berdi</h3>
      <p>{{ error.message }}</p>
      <pre v-if="errorInfo">{{ errorInfo }}</pre>
      <button @click="retry" class="retry-btn">
        Qayta urinish
      </button>
    </div>
  </div>

  <!-- Xatolik yo'q — normal content -->
  <slot v-else />
</template>

<!--
  ========== Ishlatish ==========
  <ErrorBoundary :on-error="logToSentry">
    <DangerousComponent />
  </ErrorBoundary>

  <ErrorBoundary :fallback="CustomErrorUI">
    <HeavyChart :data="data" />
  </ErrorBoundary>
-->`,
      description: 'ErrorBoundary — React Error Boundary patterning Vue varianti. onErrorCaptured + retry.',
    },
    {
      title: 'app.config.errorHandler — global xatolik handler',
      language: 'ts',
      code: `// main.ts — Global error handling setup
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// ========== Error Handler ==========
app.config.errorHandler = (err, instance, info) => {
  const error = err as Error

  // 1. Console ga yozish (development)
  console.error('[Vue Error]', {
    message: error.message,
    stack: error.stack,
    component: instance?.$options.name || 'Unknown',
    info, // "render function", "setup function", "watcher callback"
  })

  // 2. Error tracking servisga yuborish (production)
  if (import.meta.env.PROD) {
    sendToErrorService({
      type: 'vue-error',
      message: error.message,
      stack: error.stack,
      component: instance?.$options.name,
      hookInfo: info,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    })
  }

  // 3. Foydalanuvchiga xabar (toast)
  // toast.error('Kutilmagan xatolik yuz berdi')
}

// ========== Warn Handler (faqat development) ==========
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('[Vue Warning]', msg)
    // Warning-larni ham log qilish mumkin
  }
}

// ========== Global JS xatoliklari (Vue tashqarisidagi) ==========
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise]', event.reason)
})

// ========== Helper function ==========
function sendToErrorService(data: Record<string, unknown>) {
  // Real loyihada: fetch('/api/errors', { method: 'POST', body: JSON.stringify(data) })
  // Yoki Sentry: Sentry.captureException(error)
  console.log('[Error Service]', data)
}

app.use(router)
app.mount('#app')`,
      description: 'Global error handling — app.config.errorHandler, warnHandler, window error events.',
    },
    {
      title: 'onErrorCaptured — xatolik propagatsiyasi',
      language: 'html',
      code: `<script setup lang="ts">
// ========== Grandparent.vue ==========
import { onErrorCaptured, ref } from 'vue'
import ParentComp from './ParentComp.vue'

const errors = ref<string[]>([])

onErrorCaptured((error, instance, info) => {
  errors.value.push(
    \`[Grandparent] \${(error as Error).message} (\${info})\`
  )
  // return false yo'q — xatolik davom etadi (app.config.errorHandler ga)
  // return false — bu yerda to'xtatish
  return false
})
</script>

<template>
  <div>
    <h2>Grandparent</h2>
    <div v-if="errors.length" class="error-log">
      <h3>Ushlangan xatoliklar:</h3>
      <p v-for="(err, i) in errors" :key="i">{{ err }}</p>
    </div>
    <ParentComp />
  </div>
</template>

<!--
  ========== ParentComp.vue ==========
  <script setup>
  import { onErrorCaptured } from 'vue'
  import ChildComp from './ChildComp.vue'

  onErrorCaptured((error, instance, info) => {
    console.log('[Parent] Error ushlandi:', error.message)
    // return false — bu yerda to'xtatish (Grandparent ga yetmaydi)
    // return true — Grandparent ga ham yuborish
    return true  // propagatsiya davom etsin
  })
  </script>
  <template><ChildComp /></template>

  ========== ChildComp.vue ==========
  <script setup>
  import { onMounted } from 'vue'

  // Bu xatolik Parent -> Grandparent -> errorHandler ga ko'tariladi
  onMounted(() => {
    throw new Error('Child komponentda xatolik!')
  })
  </script>
  <template><div>Child</div></template>
-->`,
      description: 'Xatolik propagatsiyasi: Child -> Parent -> Grandparent. return false to\'xtatadi.',
    },
    {
      title: 'Async xatoliklarni boshqarish',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

// ========== Composable — xatolik bilan ishlash ==========
function useAsyncAction<T>(action: () => Promise<T>) {
  const data = ref<T | null>(null) as { value: T | null }
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  async function execute() {
    isLoading.value = true
    error.value = null

    try {
      data.value = await action()
    } catch (err) {
      error.value = err as Error
      // Xatolikni qayta throw qilish — onErrorCaptured ushlashi uchun
      // throw err
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, execute }
}

// ========== Ishlatish ==========
const { data: users, error, isLoading, execute: fetchUsers } = useAsyncAction(
  async () => {
    const res = await fetch('/api/users')
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
    return res.json()
  }
)

// ========== Component darajasida error handling ==========
onErrorCaptured((err) => {
  // Async xatoliklarni ham ushlaydi (async setup, async lifecycle)
  console.error('Async error:', (err as Error).message)
  return false
})

// ESLATMA: setTimeout/setInterval ichidagi xatoliklar
// Vue tizimidan TASHQARIDA — onErrorCaptured USHLAMAYDI!
// Ular uchun: try/catch yoki window.addEventListener('error')
</script>

<template>
  <div>
    <button @click="fetchUsers" :disabled="isLoading">
      {{ isLoading ? 'Yuklanmoqda...' : 'Foydalanuvchilarni yuklash' }}
    </button>

    <div v-if="error" class="error-message">
      <p>Xatolik: {{ error.message }}</p>
      <button @click="fetchUsers">Qayta urinish</button>
    </div>

    <ul v-else-if="users">
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>`,
      description: 'Async xatoliklarni composable va onErrorCaptured bilan boshqarish.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue da xatoliklarni boshqarish usullarini sanang.',
      answer: `1) onErrorCaptured(err, instance, info) — komponent darajasida, child xatoliklarni ushlaydi. return false — propagatsiyani to'xtatadi. 2) app.config.errorHandler — ilova darajasida, BARCHA ushlanmagan Vue xatoliklar. 3) app.config.warnHandler — faqat dev da Vue warninglar. 4) try/catch — oddiy JS xatoliklar uchun. 5) window.onerror / unhandledrejection — Vue tashqarisidagi xatoliklar (setTimeout, 3rd party). 6) Sentry kabi monitoring — production tracking.`,
    },
    {
      question: 'onErrorCaptured da return false nima qiladi?',
      answer: `return false — xatolik propagatsiyasini TO'XTATADI. Xatolik parent komponentlarga va app.config.errorHandler ga YETMAYDI. return true yoki hech narsa return qilmasa — xatolik yuqoriga ko'tarilishda davom etadi: Child -> Parent onErrorCaptured -> Grandparent onErrorCaptured -> ... -> app.config.errorHandler. Bu Error Boundary pattern uchun muhim — boundary komponent return false qilib, faqat o'zi ichidagi xatolikni boshqaradi.`,
    },
    {
      question: 'Vue da Error Boundary qanday yaratiladi? React dan farqi nima?',
      answer: `Vue: onErrorCaptured hook bilan — Composition API, functional component. error ref saqlab, v-if bilan fallback UI ko'rsatish. retry uchun error ni null qilish. React: componentDidCatch + getDerivedStateFromError — CLASS komponent SHART. Functional component bilan Error Boundary yaratib bo'lmaydi (react-error-boundary kutubxonasi ham class ishlatadi). Vue afzalligi: hook bilan oson, async xatoliklarni ham ushlaydi. React afzalligi: rasmiy pattern, keng qo'llaniladi.`,
    },
    {
      question: 'Qaysi xatoliklar Vue error handler da ushlanMaydi?',
      answer: `Vue error handler (onErrorCaptured, app.config.errorHandler) faqat Vue tizimi ichidagi xatoliklarni ushlaydi. USHLANMAYDIGAN xatoliklar: 1) setTimeout/setInterval callback. 2) requestAnimationFrame callback. 3) Tashqi kutubxona callback-lari (jQuery, 3rd party). 4) Web Worker xatoliklari. 5) Service Worker. Ularni ushlash uchun: try/catch, window.addEventListener('error'), window.addEventListener('unhandledrejection') ishlatish kerak.`,
    },
    {
      question: 'Production da xatoliklarni qanday monitoring qilasiz?',
      answer: `1) Sentry — eng mashhur. @sentry/vue paketi Vue integratsiya beradi: app.config.errorHandler avtomatik, router integratsiya, replay, performance tracing. 2) app.config.errorHandler ichida API ga yuborish — custom endpoint. 3) window.onerror + unhandledrejection — Vue tashqarisidagi. 4) Source maps — production-da stack trace o'qish. 5) User context — xatolik bilan birga user info, sahifa URL, brauzer. 6) Rate limiting — bir xil xatolikni ko'p marta yubormaslik.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'async-components', label: 'Async Components' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'lifecycle', label: 'Lifecycle Hooks' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'plugins', label: 'Plugins' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
  ],
}
