import type { Topic } from '../../../types'

export const lifecycle: Topic = {
  id: 'lifecycle',
  title: 'Lifecycle Hooks',
  importance: 3,
  status: 'to-learn',
  description: 'onMounted, onUpdated, onUnmounted, setup() — komponent hayot sikli',
  content: `Vue komponent hayot sikli — yaratilishdan yo'q bo'lishgacha bo'lgan bosqichlar. Har bir bosqichda maxsus hook funksiyalar chaqiriladi.

═══════════════════════════════════════
  HAYOT SIKLI BOSQICHLARI
═══════════════════════════════════════

1. Setup bosqichi (Composition API):
   - setup() yoki <script setup> — reaktiv state yaratiladi
   - Bu bosqichda DOM mavjud EMAS

2. Mounting (DOM ga ulash):
   - onBeforeMount() — DOM yaratilishidan OLDIN
   - onMounted() — DOM yaratilgandan KEYIN ✅ Eng ko'p ishlatiladi

3. Updating (qayta render):
   - onBeforeUpdate() — DOM yangilanishidan OLDIN
   - onUpdated() — DOM yangilangandan KEYIN

4. Unmounting (DOM dan olib tashlash):
   - onBeforeUnmount() — olib tashlashdan OLDIN
   - onUnmounted() — olib tashlangandan KEYIN ✅ Tozalash uchun

5. Maxsus hook-lar:
   - onActivated() — KeepAlive komponent qayta aktivlashganda
   - onDeactivated() — KeepAlive komponent deaktivlashganda
   - onErrorCaptured() — nasl komponentdagi xatolikni ushlash

═══════════════════════════════════════
  onMounted() — ENG MUHIM HOOK
═══════════════════════════════════════

DOM tayyor bo'lganda chaqiriladi. Ishlatish holatlari:
- API dan ma'lumot olish
- DOM elementga to'g'ridan-to'g'ri murojaat
- Tashqi kutubxona initsializatsiyasi (chart, map)
- Event listener qo'shish

  onMounted(() => {
    fetchData()                    // API chaqiruv
    chartInstance = new Chart(el)  // tashqi kutubxona
    window.addEventListener('resize', onResize)
  })

MUHIM: onMounted FAQAT client-da ishlaydi (SSR da YO'Q).

═══════════════════════════════════════
  onUnmounted() — TOZALASH
═══════════════════════════════════════

Komponent yo'q qilinganda chaqiriladi. Majburiy tozalash:
- Event listener-larni olib tashlash
- Timer/interval-larni to'xtatish
- WebSocket ulanishni yopish
- Tashqi kutubxona instance-ni destroy qilish

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    clearInterval(timer)
    socket.close()
    chartInstance.destroy()
  })

Agar tozalanmasa — MEMORY LEAK bo'ladi!

═══════════════════════════════════════
  onUpdated() — EHTIYOTKORLIK BILAN
═══════════════════════════════════════

Har qanday reaktiv state o'zgarganda va DOM yangilanganda ishlaydi.
Bu hook ichida STATE O'ZGARTIRMANG — cheksiz loop bo'ladi!

  onUpdated(() => {
    // DOM o'zgarganidan keyin scrollni tuzatish
    scrollToBottom()
    // XATO: count.value++ — cheksiz loop!
  })

Ko'p hollarda watch() yaxshiroq tanlov.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue: onMounted + onUnmounted = React: useEffect(() => { ... ; return cleanup }, [])
Vue: onUpdated = React: useEffect(() => { ... }) (dependency yo'q)
Vue: watch(dep, cb) = React: useEffect(cb, [dep])

MUHIM FARQ:
- Vue hook-lari alohida funksiyalar — aniq va tushunarli
- React-da useEffect bitta hook orqali hamma narsa
- Vue-da setup() BITTA MARTA ishlaydi
- React-da komponent funksiyasi HAR RENDERDA ishlaydi`,
  codeExamples: [
    {
      title: 'Asosiy lifecycle hook-lar',
      language: 'html',
      code: `<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

const count = ref(0)
const message = ref('')

// 1. Setup bosqichi (hozir, script setup ichida)
console.log('1. Setup — DOM hali YO'Q')

// 2. DOM yaratilishidan oldin
onBeforeMount(() => {
  console.log('2. onBeforeMount — DOM hali yo'q')
})

// 3. DOM tayyor
onMounted(() => {
  console.log('3. onMounted — DOM tayyor! ✅')
  message.value = 'Komponent yuklandi'
})

// 4. Qayta render oldidan
onBeforeUpdate(() => {
  console.log('4. onBeforeUpdate — DOM hali eski')
})

// 5. Qayta render keyin
onUpdated(() => {
  console.log('5. onUpdated — DOM yangilandi')
})

// 6. Olib tashlash oldidan
onBeforeUnmount(() => {
  console.log('6. onBeforeUnmount — hali DOM da')
})

// 7. Olib tashlangandan keyin
onUnmounted(() => {
  console.log('7. onUnmounted — DOM dan olib tashlandi ✅')
})
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>`,
      description: `Barcha lifecycle hook-lar tartibi. Konsolda ko'ring: setup -> beforeMount -> mounted -> (click) -> beforeUpdate -> updated.`,
    },
    {
      title: 'onMounted — API chaqiruv va DOM murojaat',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

// Timer va resize handler — tozalash uchun saqlash
let resizeHandler: (() => void) | null = null
let pollingTimer: number | null = null

onMounted(async () => {
  // 1. API dan ma'lumot olish
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) throw new Error('API xatolik')
    users.value = await response.json()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    isLoading.value = false
  }

  // 2. DOM elementga murojaat
  if (containerRef.value) {
    console.log('Container balandligi:', containerRef.value.offsetHeight)
  }

  // 3. Event listener qo'shish
  resizeHandler = () => {
    console.log("Oyna o'lchami:", window.innerWidth)
  }
  window.addEventListener('resize', resizeHandler)

  // 4. Polling boshlash
  pollingTimer = window.setInterval(() => {
    console.log("Yangi ma'lumot tekshirilmoqda...")
  }, 30000)
})

// TOZALASH — memory leak oldini olish
onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  if (pollingTimer) {
    clearInterval(pollingTimer)
  }
})
</script>

<template>
  <div ref="containerRef">
    <p v-if="isLoading">Yuklanmoqda...</p>
    <p v-else-if="error" class="text-red-500">{{ error }}</p>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} — {{ user.email }}
      </li>
    </ul>
  </div>
</template>`,
      description: 'onMounted — API chaqiruv, DOM murojaat, event listener. onUnmounted — MAJBURIY tozalash. Memory leak oldini olish pattern.',
    },
    {
      title: 'onErrorCaptured — Xatolik chegarasi',
      language: 'html',
      code: `<!-- ErrorBoundary.vue -->
<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<Error | null>(null)
const errorInfo = ref('')

onErrorCaptured((err: Error, instance, info: string) => {
  error.value = err
  errorInfo.value = info

  console.error('Xatolik ushlandi:', err.message)
  console.error('Komponent:', instance)
  console.error('Info:', info)

  // true qaytarsa — xatolik yuqoriga tarqalmaydi
  // false/undefined — xatolik yuqoriga ham tarqaladi
  return false
})

function resetError() {
  error.value = null
  errorInfo.value = ''
}
</script>

<template>
  <div v-if="error" class="bg-red-50 border border-red-200 p-4 rounded">
    <h3 class="text-red-700 font-bold">Xatolik yuz berdi!</h3>
    <p class="text-red-600">{{ error.message }}</p>
    <p class="text-sm text-gray-500">{{ errorInfo }}</p>
    <button
      @click="resetError"
      class="mt-2 px-4 py-2 bg-red-600 text-white rounded"
    >
      Qayta urinish
    </button>
  </div>
  <slot v-else />
</template>

<!-- Ishlatish: -->
<!--
<ErrorBoundary>
  <DangerousComponent />
</ErrorBoundary>
-->`,
      description: `onErrorCaptured — React ErrorBoundary analog. Nasl komponentdagi xatolikni ushlash va fallback ko'rsatish.`,
    },
  ],
  interviewQA: [
    {
      question: 'Vue lifecycle hook-larni tartib bilan aytib bering',
      answer: `Setup/created -> onBeforeMount -> onMounted -> (state o'zgarganda) onBeforeUpdate -> onUpdated -> (komponent yo'q qilinganda) onBeforeUnmount -> onUnmounted. Eng muhimlari: onMounted — DOM tayyor, API chaqiruv, event listener. onUnmounted — tozalash (listener, timer, subscription). onUpdated — DOM yangilangandan keyin. Ota komponent onMounted — BARCHA bola komponentlar mounted bo'lgandan keyin chaqiriladi.`,
    },
    {
      question: 'Vue va React lifecycle farqi nima?',
      answer: `Vue-da har bir bosqich uchun ALOHIDA hook bor (onMounted, onUnmounted) — aniq va tushunarli. React-da useEffect BITTA hook barcha lifecycle bosqichlarini bajaradi — dependency array orqali boshqariladi. Vue setup() BITTA MARTA chaqiriladi, React komponent funksiyasi HAR RENDERDA chaqiriladi. Vue-da stale closure muammosi YO'Q, React-da useEffect dependency array noto'g'ri bo'lsa muammo bo'ladi.`,
    },
    {
      question: `onMounted ichida async/await ishlatsa bo'ladimi?`,
      answer: `Ha, lekin EHTIYOT bo'lish kerak. onMounted(async () => { await fetchData() }) ishlaydi, lekin Vue kutMAYDI — komponent darhol renderlanadi. Shuning uchun loading/error state ishlatish kerak. SSR-da onMounted ISHLAMAYDI (server-da DOM yo'q) — server uchun onServerPrefetch yoki Nuxt-da useFetch ishlatiladi. Suspense bilan async setup() ham mumkin — lekin bu experimental feature.`,
    },
    {
      question: 'Memory leak nima va qanday oldini olinadi?',
      answer: `Memory leak — komponent yo'q qilingandan keyin ham resurslar (event listener, timer, subscription) xotirada qolishi. Oldini olish: onUnmounted() da BARCHA tashqi subscription-larni tozalash. addEventListener -> removeEventListener. setInterval -> clearInterval. WebSocket -> close(). Tashqi kutubxona -> destroy(). Vue composable-da ham tozalash kerak — composable ichida onUnmounted ishlatiladi. Watch/watchEffect avtomatik tozalanadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'composition-api', label: 'Composition API' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'template-refs', label: 'Template Refs' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'composables', label: 'Composables' },
  ],
}
