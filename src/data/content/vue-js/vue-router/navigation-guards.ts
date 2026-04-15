import type { Topic } from '../../../types'

export const navigationGuards: Topic = {
  id: 'navigation-guards',
  title: 'Navigation Guards',
  importance: 3,
  status: 'to-learn',
  description: 'beforeEach, afterEach, beforeEnter, onBeforeRouteLeave — navigatsiyani nazorat qilish',
  content: `Navigation Guards — Vue Router-da sahifalar orasidagi o'tishni nazorat qilish mexanizmi. Autentifikatsiya, ruxsat tekshirish, saqlash ogohlantirishlari va boshqa vazifalar uchun ishlatiladi.

═══════════════════════════════════════
  GLOBAL GUARDS
═══════════════════════════════════════

Global guard-lar BARCHA route o'tishlarida ishlaydi.

beforeEach — navigatsiya BOSHLANGANDAN OLDIN. Eng ko'p ishlatiladigan guard.
  router.beforeEach((to, from) => {
    // to — boradigan route
    // from — hozirgi route
    // return true/undefined — davom etish
    // return false — bekor qilish
    // return '/login' yoki { name: 'login' } — yo'naltirish
  })

afterEach — navigatsiya TUGAGANDAN KEYIN. Bekor qilib bo'lmaydi.
  router.afterEach((to, from, failure) => {
    // Analytics, page title o'zgartirish
    // failure — navigatsiya muvaffaqiyatsiz bo'lsa
  })

beforeResolve — beforeEach dan KEYIN, lekin navigatsiya tasdiqlanishidan OLDIN.
Barcha in-component guard-lar va async komponentlar yuklangandan keyin ishlaydi.
  router.beforeResolve((to) => {
    // Oxirgi tekshirish — data yuklanganini tekshirish
  })

TARTIB: beforeEach → (komponent guard-lar) → beforeResolve → afterEach

═══════════════════════════════════════
  PER-ROUTE GUARDS
═══════════════════════════════════════

beforeEnter — faqat ma'lum bir route-ga kirishda ishlaydi.
Route konfiguratsiyasida to'g'ridan-to'g'ri yoziladi:

  const routes = [
    {
      path: '/admin',
      component: AdminPage,
      beforeEnter: (to, from) => {
        if (!isAdmin()) return '/login'
      }
    }
  ]

beforeEnter faqat boshqa route-dan kirilganda ishlaydi.
Bir xil route ichida params o'zgarganda (masalan /user/1 → /user/2) ISHLAMAYDI.
Buning uchun onBeforeRouteUpdate kerak.

Massiv sifatida ham berish mumkin:
  beforeEnter: [checkAuth, checkRole('admin')]

═══════════════════════════════════════
  IN-COMPONENT GUARDS
═══════════════════════════════════════

Composition API da ikki guard mavjud:

onBeforeRouteLeave — komponentdan CHIQISHDAN oldin:
  onBeforeRouteLeave((to, from) => {
    if (hasUnsavedChanges.value) {
      return confirm('Saqlashsiz chiqasizmi?')
    }
  })

onBeforeRouteUpdate — XUDDI SHU komponentda route o'zgarganda:
  onBeforeRouteUpdate((to, from) => {
    // /user/1 → /user/2 — komponent qayta yaratilmaydi
    // yangi ma'lumotni yuklash kerak
    userId.value = to.params.id
  })

Options API da: beforeRouteEnter, beforeRouteUpdate, beforeRouteLeave.
Lekin beforeRouteEnter Composition API da YO'Q — chunki setup() da komponent hali tayyor emas.

═══════════════════════════════════════
  RETURN VALUES VA next()
═══════════════════════════════════════

Vue Router 4 da next() callback ESKIRGAN. O'rniga return ishlatiladi:

  return true / undefined  — navigatsiya davom etadi
  return false             — navigatsiya bekor qilinadi
  return '/path'           — boshqa route-ga yo'naltirish
  return { name: 'login' } — object bilan yo'naltirish
  return { name: 'login', query: { redirect: to.fullPath } }

next() hali ishlaydi (backward compatible), lekin TAVSIYA ETILMAYDI.
next() dan foydalansangiz — bir marta chaqirish SHART, aks holda xato.

═══════════════════════════════════════
  AUTENTIFIKATSIYA PATTERN
═══════════════════════════════════════

Eng ko'p uchraydigan pattern — auth guard:

  router.beforeEach((to) => {
    const isAuthenticated = !!localStorage.getItem('token')
    if (to.meta.requiresAuth && !isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  })

Route-larda meta bilan belgilash:
  { path: '/dashboard', meta: { requiresAuth: true } }

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React Router-da o'rnatilgan guard tizimi YO'Q. O'rniga:
- ProtectedRoute wrapper komponenti yoziladi
- loader funksiyasi (v6.4+ data API) ishlatiladi
- useEffect ichida tekshirish qilinadi

Vue Router guard-lari DEKLARATIV va markazlashgan — global beforeEach bitta joyda barcha auth logikani boshqaradi. React-da har bir himoyalangan route uchun wrapper kerak.

Vue: onBeforeRouteLeave — o'rnatilgan API.
React: beforeunload eventi yoki custom hook yozish kerak.

Vue guard-lari ASYNC — await qilib API so'rov yuborish mumkin.
React loader-lari ham async, lekin bu faqat v6.4+ da.`,
  codeExamples: [
    {
      title: 'Global auth guard',
      language: 'ts',
      code: `// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { guest: true },  // faqat login qilmaganlar uchun
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, roles: ['admin'] },
    },
  ],
})

// Global auth guard
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Token bor lekin user yuklangan emas
  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser()
    } catch {
      auth.logout()
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }

  // Auth kerak bo'lgan sahifa
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  // Role tekshirish
  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
    return { name: 'dashboard' }  // forbidden → dashboard
  }

  // Login sahifaga auth qilgan user kirsa
  if (to.meta.guest && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

// Page title o'zgartirish
router.afterEach((to) => {
  document.title = (to.meta.title as string) || 'My App'
})

export default router`,
      description: 'Amaliy auth guard — token tekshirish, role-based access, login redirect, va page title.',
    },
    {
      title: 'In-component guards',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router'

const route = useRoute()
const formData = ref({ name: '', email: '' })
const isDirty = ref(false)
const userData = ref<any>(null)
const isLoading = ref(false)

// Form o'zgarganini kuzatish
watch(formData, () => {
  isDirty.value = true
}, { deep: true })

// Sahifadan chiqishda ogohlantirish
onBeforeRouteLeave((to, from) => {
  if (isDirty.value) {
    const answer = window.confirm(
      'Saqlanmagan o\\'zgarishlar bor. Chiqishni xohlaysizmi?'
    )
    if (!answer) return false  // navigatsiyani bekor qilish
  }
})

// /user/1 → /user/2 o'tganda (komponent qayta yaratilMAYDI)
onBeforeRouteUpdate(async (to, from) => {
  // Yangi user ma'lumotini yuklash
  if (to.params.id !== from.params.id) {
    isLoading.value = true
    userData.value = await fetchUser(to.params.id as string)
    isLoading.value = false
  }
})

async function fetchUser(id: string) {
  const res = await fetch(\`/api/users/\${id}\`)
  return res.json()
}
</script>

<template>
  <form>
    <input v-model="formData.name" placeholder="Ism" />
    <input v-model="formData.email" placeholder="Email" />
    <button type="submit">Saqlash</button>
  </form>
</template>`,
      description: 'onBeforeRouteLeave — saqlamagan holda chiqishni oldini olish. onBeforeRouteUpdate — params o\'zgarganda data yuklash.',
    },
    {
      title: 'Per-route guard va guard funksiya kompozitsiyasi',
      language: 'ts',
      code: `// src/router/guards.ts — Qayta ishlatiladigan guard funksiyalar

import type { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Auth tekshirish
export const requireAuth: NavigationGuard = (to) => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
}

// Role tekshirish — factory funksiya
export function requireRole(...roles: string[]): NavigationGuard {
  return () => {
    const auth = useAuthStore()
    if (!roles.includes(auth.user?.role ?? '')) {
      return { name: 'forbidden' }
    }
  }
}

// Subscription tekshirish
export const requireSubscription: NavigationGuard = () => {
  const auth = useAuthStore()
  if (!auth.user?.hasActiveSubscription) {
    return { name: 'pricing' }
  }
}

// Route konfiguratsiyasida ishlatish:
// src/router/index.ts
const routes = [
  {
    path: '/admin',
    component: () => import('@/pages/AdminPage.vue'),
    // Massiv — ketma-ket ishlaydi
    beforeEnter: [requireAuth, requireRole('admin', 'superadmin')],
  },
  {
    path: '/premium-content',
    component: () => import('@/pages/PremiumPage.vue'),
    beforeEnter: [requireAuth, requireSubscription],
  },
]`,
      description: 'Guard funksiyalarni alohida faylda yozib, route-larda kompozitsiya qilish — DRY prinsipi.',
    },
    {
      title: 'Async guard — data preloading',
      language: 'ts',
      code: `// beforeResolve — barcha guard va async komponentdan KEYIN ishlaydi
// Ma'lumotni route o'tishidan OLDIN yuklash uchun ideal

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('@/pages/PostPage.vue'),
      meta: {
        // Guard uchun data loader funksiya
        loader: async (to: any) => {
          const res = await fetch(\`/api/posts/\${to.params.id}\`)
          if (!res.ok) throw new Error('Post topilmadi')
          return res.json()
        },
      },
    },
  ],
})

// beforeResolve — data preloading
router.beforeResolve(async (to) => {
  const loader = to.meta.loader as Function | undefined
  if (loader) {
    try {
      // Ma'lumotni yuklash va meta-ga saqlash
      to.meta.data = await loader(to)
    } catch (error) {
      // Xato bo'lsa 404 ga yo'naltirish
      return { name: 'not-found', params: { pathMatch: to.path.split('/') } }
    }
  }
})

// Komponentda ishlatish:
// const route = useRoute()
// const post = computed(() => route.meta.data)`,
      description: 'beforeResolve bilan data preloading — komponent render bo\'lishidan OLDIN ma\'lumot tayyor.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue Router guard-larining ishlash tartibi (execution order) qanday?',
      answer: `To'liq tartib: 1) Chiqayotgan komponentda onBeforeRouteLeave. 2) Global beforeEach. 3) Qayta ishlatiladigan komponentda onBeforeRouteUpdate. 4) Route konfiguratsiyasida beforeEnter. 5) Async komponentlarni resolve qilish. 6) Kirayotgan komponentda beforeRouteEnter (Options API). 7) Global beforeResolve. 8) Navigatsiya tasdiqlandi. 9) Global afterEach. 10) DOM yangilandi. Bu tartibni bilish muhim — masalan, beforeResolve da barcha komponentlar va guard-lar tayyor, shuning uchun data preloading uchun ideal. afterEach esa navigatsiyani bekor qila olmaydi — faqat analytics, logging uchun.`,
    },
    {
      question: 'next() callback va return value farqi nima? Nima uchun return tavsiya etiladi?',
      answer: `Vue Router 3 da FAQAT next() ishlardi — uni chaqirmaslik navigatsiyani to'xtatib qo'yardi. Muammo: next() ni bir necha marta chaqirish mumkin edi — bu kutilmagan xatolarga olib kelardi. Vue Router 4 da return value joriy qilindi: return true — davom, return false — bekor, return "/path" — redirect. Return value-ning afzalligi: TypeScript bilan yaxshi ishlaydi, bir necha marta return qilib bo'lmaydi (tuzilish jihatidan xavfsiz), kodni o'qish osonroq. next() backward compatibility uchun qoldirilgan, lekin yangi loyihalarda FAQAT return ishlatish kerak.`,
    },
    {
      question: 'Autentifikatsiya uchun guard yozishda qanday xatolarga yo\'l qo\'yish mumkin?',
      answer: `1) Cheksiz redirect loop — guard login sahifaga yo\'naltiradi, lekin login sahifa ham guard orqali o\'tadi va yana redirect bo\'ladi. Yechim: to.name === "login" tekshirish yoki meta.guest flag ishlatish. 2) Token borligini tekshirish — lekin token yaroqsiz (expired). Yechim: guard ichida API so\'rov yuborib user ma\'lumotini tekshirish, xatoda token o\'chirish. 3) Race condition — guard async, lekin navigatsiya parallel chaqirilsa. 4) SSR da localStorage ishlatish — server tomonda mavjud emas. 5) Guard ichida store to\'g\'ri ishga tushmagan bo\'lishi mumkin — Pinia store-ni guard ichida yaratish kerak, tashqarida emas.`,
    },
    {
      question: 'onBeforeRouteUpdate qachon kerak? watch(route) dan farqi nima?',
      answer: `onBeforeRouteUpdate — xuddi shu komponent qayta ishlatilganda ishlaydi. Masalan /user/1 dan /user/2 ga o'tganda — Vue komponentni qayta yaratmaydi, faqat route parametrlari o'zgaradi. onBeforeRouteUpdate guard sifatida ishlaydi — navigatsiyani BEKOR QILISH mumkin (return false). watch(route) esa oddiy watcher — navigatsiyani to'xtata olmaydi, faqat reaktsiya beradi. Agar foydalanuvchi formada saqlamagan ma'lumot bilan /user/2 ga o'tmoqchi bo'lsa — onBeforeRouteUpdate bilan to'xtatish mumkin, watch bilan emas. Lekin oddiy data yuklash uchun watch(route.params.id) ham yetarli.`,
    },
    {
      question: 'Navigation failure nima va qanday ushlanadi?',
      answer: `Navigation failure — router.push() muvaffaqiyatsiz bo'lganda qaytadigan xato. Sabablar: guard false qaytarsa (NavigationFailureType.aborted), allaqachon shu route-da bo'lsa (NavigationFailureType.duplicated), boshqa navigatsiya bilan almashtirilsa (NavigationFailureType.cancelled). router.push() Promise qaytaradi — await qilib failure ni tekshirish mumkin: const failure = await router.push("/about"); if (failure) { if (isNavigationFailure(failure, NavigationFailureType.aborted)) { console.log("Guard to'xtatdi") } }. afterEach da ham failure parametri bor — global monitoring uchun.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'router-basics', label: 'Router asoslari' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'route-meta', label: 'Route Meta' },
    { techId: 'vue-js', sectionId: 'vue-pinia', topicId: 'pinia-basics', label: 'Pinia asoslari' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
  ],
}
