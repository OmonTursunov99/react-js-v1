import type { Topic } from '../../../types'

export const nestedRoutes: Topic = {
  id: 'nested-routes',
  title: 'Nested Routes',
  importance: 2,
  status: 'to-learn',
  description: 'children[], named views, layout patterns — ichma-ich route tuzilmasi',
  content: `Nested routes — route-lar ichida route-lar yaratish imkoniyati. Bu layout tuzilmalarini, dashboard panellarini va murakkab sahifa ierarxiyalarini qurishda asosiy vosita hisoblanadi.

═══════════════════════════════════════
  children[] BILAN NESTED ROUTES
═══════════════════════════════════════

Har bir route object children massiviga ega bo'lishi mumkin. Parent route-da <RouterView /> bo'lishi kerak — child komponent shu yerda render bo'ladi.

  const routes = [
    {
      path: '/dashboard',
      component: DashboardLayout,
      children: [
        { path: '', component: DashboardHome },        // /dashboard
        { path: 'analytics', component: Analytics },    // /dashboard/analytics
        { path: 'settings', component: Settings },      // /dashboard/settings
      ]
    }
  ]

MUHIM: child route path-ida / boshlamaslik kerak (relative path).
Agar / bilan boshlansa — bu absolut path bo'ladi va parent path-ga qo'shilmaydi.

Default child route — path: '' bo'lgan child. Parent route ochilganda aynan shu ko'rsatiladi. Agar default child bo'lmasa — parent-ning <RouterView /> bo'sh qoladi.

═══════════════════════════════════════
  NAMED VIEWS
═══════════════════════════════════════

Bitta sahifada bir nechta <RouterView /> ishlatish mumkin — har biriga nom berish orqali:

  <template>
    <RouterView name="sidebar" />
    <RouterView />              <!-- default -->
    <RouterView name="footer" />
  </template>

Route konfiguratsiyasida components (ko'plik) ishlatiladi:

  {
    path: '/dashboard',
    components: {
      default: DashboardMain,
      sidebar: DashboardSidebar,
      footer: DashboardFooter,
    }
  }

Named views — bitta URL da turli joylarga turli komponentlar joylashtirish uchun. Layout tizimi qurishda juda qulay.

═══════════════════════════════════════
  LAYOUT PATTERNS
═══════════════════════════════════════

Ko'p ilovalarda bir nechta layout bo'ladi:
- DefaultLayout — header + sidebar + content
- AuthLayout — faqat content (login/register)
- AdminLayout — admin sidebar + content

Buni route-lar orqali tashkil qilish:

  const routes = [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        { path: '', component: HomePage },
        { path: 'about', component: AboutPage },
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,  // header/sidebar YO'Q
      children: [
        { path: 'login', component: LoginPage },
        { path: 'register', component: RegisterPage },
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [...]
    }
  ]

Har bir layout o'z <RouterView /> ga ega — child sahifalar shu ichida render bo'ladi.

═══════════════════════════════════════
  CHUQUR NESTING
═══════════════════════════════════════

Nesting bir necha daraja chuqur bo'lishi mumkin:

  /admin                          → AdminLayout
  /admin/users                    → AdminLayout → UsersLayout
  /admin/users/:id                → AdminLayout → UsersLayout → UserDetail
  /admin/users/:id/posts          → AdminLayout → UsersLayout → UserDetail → UserPosts

Har bir daraja o'z <RouterView /> ga ega. route.matched massivi barcha mos kelgan route record-larni ko'rsatadi — bu breadcrumb yaratish uchun juda foydali.

EHTIYOT: 3+ daraja nesting kodni murakkablashtiradi. Ko'pincha 2 daraja yetarli (layout + page). Chuqurroq kerak bo'lsa — flat route + komponent ichida boshqarish yaxshiroq.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React Router v6: nested routes <Route> ichida <Route> yoziladi. <Outlet /> child-ni render qiladi. Bu Vue-ning children[] + <RouterView /> ga to'liq mos keladi.

React: createBrowserRouter-da children massivi bor — Vue Router konfiguratsiyasiga juda o'xshash.

Named views — React Router-da to'g'ridan-to'g'ri analogi YO'Q. React-da bu layout komponentlar va context orqali qilinadi, lekin Vue-dagi named views ancha oddiy va deklarativ.

React Router v6.4+ da layout routes mavjud — element va children bilan. Vue Router boshidan shu pattern-ni qo'llagan.

Ikkala framework ham route.matched (Vue) va useMatches() (React) orqali breadcrumb qurishni qo'llab-quvvatlaydi.`,
  codeExamples: [
    {
      title: 'Dashboard layout bilan nested routes',
      language: 'ts',
      code: `// src/router/index.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/pages/AboutPage.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',  // /dashboard — default child
        name: 'dashboard',
        component: () => import('@/pages/dashboard/OverviewPage.vue'),
      },
      {
        path: 'analytics',  // /dashboard/analytics
        name: 'dashboard-analytics',
        component: () => import('@/pages/dashboard/AnalyticsPage.vue'),
      },
      {
        path: 'users',  // /dashboard/users
        name: 'dashboard-users',
        component: () => import('@/pages/dashboard/UsersPage.vue'),
        children: [
          {
            path: ':id',  // /dashboard/users/:id
            name: 'dashboard-user-detail',
            component: () => import('@/pages/dashboard/UserDetailPage.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'settings',  // /dashboard/settings
        name: 'dashboard-settings',
        component: () => import('@/pages/dashboard/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/pages/auth/RegisterPage.vue'),
      },
    ],
  },
]`,
      description: 'Uchta layout (Default, Dashboard, Auth) — har birida o\'z child sahifalari. Dashboard ichida 3-daraja nesting.',
    },
    {
      title: 'DashboardLayout komponenti',
      language: 'html',
      code: `<script setup lang="ts">
// DashboardLayout.vue
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Breadcrumb — route.matched dan
const breadcrumbs = computed(() => {
  return route.matched
    .filter(record => record.meta.title)
    .map(record => ({
      title: record.meta.title as string,
      path: record.path,
    }))
})

// Sidebar navigatsiya
const sidebarLinks = [
  { name: 'dashboard', label: 'Umumiy', icon: '📊' },
  { name: 'dashboard-analytics', label: 'Analitika', icon: '📈' },
  { name: 'dashboard-users', label: 'Foydalanuvchilar', icon: '👥' },
  { name: 'dashboard-settings', label: 'Sozlamalar', icon: '⚙️' },
]
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <h2 class="text-lg font-bold mb-4">Dashboard</h2>
      <nav>
        <RouterLink
          v-for="link in sidebarLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
          active-class="bg-blue-100 text-blue-700"
        >
          <span>{{ link.icon }}</span>
          <span>{{ link.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 p-6">
      <!-- Breadcrumb -->
      <nav class="mb-4 text-sm text-gray-500">
        <span v-for="(crumb, i) in breadcrumbs" :key="crumb.path">
          <RouterLink :to="crumb.path">{{ crumb.title }}</RouterLink>
          <span v-if="i < breadcrumbs.length - 1"> / </span>
        </span>
      </nav>

      <!-- Child route shu yerda render bo'ladi -->
      <RouterView />
    </div>
  </div>
</template>`,
      description: 'Dashboard layout — sidebar + breadcrumb + RouterView. Child route-lar RouterView ichida ko\'rsatiladi.',
    },
    {
      title: 'Named Views — bir sahifada bir nechta RouterView',
      language: 'html',
      code: `<!-- MainLayout.vue — named views bilan -->
<template>
  <div class="grid grid-cols-[250px_1fr] grid-rows-[auto_1fr_auto] min-h-screen">
    <!-- Header — barcha sahifalar uchun bir xil -->
    <header class="col-span-2 bg-white shadow p-4">
      <AppHeader />
    </header>

    <!-- Sidebar — route ga qarab turli komponent -->
    <aside class="bg-gray-50 p-4">
      <RouterView name="sidebar" />
    </aside>

    <!-- Main content -->
    <main class="p-6">
      <RouterView />
    </main>

    <!-- Footer — ixtiyoriy -->
    <footer class="col-span-2">
      <RouterView name="footer" />
    </footer>
  </div>
</template>

<!--
Route konfiguratsiya:

{
  path: '/dashboard',
  components: {
    default: DashboardContent,
    sidebar: DashboardSidebar,
    footer: DashboardFooter,
  },
},
{
  path: '/profile',
  components: {
    default: ProfileContent,
    sidebar: ProfileSidebar,
    // footer — yo'q, ko'rinmaydi
  },
},
{
  path: '/settings',
  components: {
    default: SettingsContent,
    sidebar: SettingsSidebar,
    footer: SettingsFooter,
  },
}
-->`,
      description: 'Named views bilan bitta layout-da turli bo\'limlarga turli komponentlar joylashtirish.',
    },
    {
      title: 'Nested routes konfiguratsiyasi',
      language: 'ts',
      code: `import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { title: 'Admin', requiresAuth: true, roles: ['admin'] },
    // Redirect — /admin ochilsa /admin/dashboard ga
    redirect: { name: 'admin-dashboard' },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/pages/admin/DashboardPage.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'products',
        // Bu route o'zi komponent ko'rsatmaydi — children uchun layout
        component: () => import('@/pages/admin/ProductsLayout.vue'),
        meta: { title: 'Mahsulotlar' },
        redirect: { name: 'admin-products-list' },
        children: [
          {
            path: '',
            name: 'admin-products-list',
            component: () => import('@/pages/admin/ProductListPage.vue'),
          },
          {
            path: 'create',
            name: 'admin-products-create',
            component: () => import('@/pages/admin/ProductCreatePage.vue'),
            meta: { title: 'Yangi mahsulot' },
          },
          {
            path: ':id',
            name: 'admin-products-edit',
            component: () => import('@/pages/admin/ProductEditPage.vue'),
            props: true,
            meta: { title: 'Tahrirlash' },
          },
        ],
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: () => import('@/pages/admin/OrdersPage.vue'),
        meta: { title: 'Buyurtmalar' },
      },
    ],
  },
]

// ProductsLayout.vue ichida:
// <template>
//   <div>
//     <h1>Mahsulotlar</h1>
//     <RouterView />  <!-- ProductList yoki ProductEdit -->
//   </div>
// </template>`,
      description: 'Admin panel — 3 daraja nesting, redirect, meta title. ProductsLayout — sub-layout pattern.',
    },
  ],
  interviewQA: [
    {
      question: 'Nested routes qachon ishlatiladi va qanday ishlaydi?',
      answer: `Nested routes — sahifalar umumiy layout (header, sidebar, footer) ulashganda ishlatiladi. Parent route komponentida <RouterView /> bo'ladi — child route-lar shu yerda render bo'ladi. Masalan: /dashboard → DashboardLayout, /dashboard/analytics → DashboardLayout ichida AnalyticsPage. Vue Router avtomatik ravishda URL-ga mos parent va child komponentlarni birga render qiladi. route.matched massivida barcha mos kelgan route record-lar bo'ladi. Parent komponent o'zgarmaydi — faqat child almashinadi. Bu performance uchun yaxshi — layout har safar qayta render bo'lmaydi.`,
    },
    {
      question: 'Named views va nested routes farqi nima? Qachon qaysi biri ishlatiladi?',
      answer: `Nested routes — URL ierarxiyasini ifodalaydi. /dashboard/users — dashboard layout ichida users sahifasi. Parent → child munosabati bor. Named views — bitta URL da bir nechta komponentni turli joylarga joylashtirish. Masalan bitta /dashboard URL-da sidebar, content va footer uchun turli komponentlar. Named views-da components (ko'plik) ishlatiladi, nested routes-da component (birlik). Amaliyotda ko'pincha ikkalasi birga ishlatiladi: nested routes layout ierarxiyasi uchun, named views esa layout ichidagi turli zonalar uchun. Lekin ko'p hollarda named views o'rniga oddiy slot-lar va props yetarli.`,
    },
    {
      question: 'Default child route nima uchun kerak?',
      answer: `Default child route — path: "" bo'lgan child. Agar /dashboard route-da faqat children bor va default child yo'q bo'lsa, /dashboard URL-da parent layout render bo'ladi, lekin <RouterView /> bo'sh qoladi — foydalanuvchi bo'sh sahifa ko'radi. path: "" bilan /dashboard ochilganda DashboardOverview komponent ko'rsatiladi. Muqobil yechim: redirect ishlatish — { path: "/dashboard", redirect: "/dashboard/overview" }. Lekin redirect URL-ni o'zgartiradi. Default child esa URL o'zgarmasdan kontent ko'rsatadi. Ikkalasining ham o'rni bor — redirect aniqroq URL beradi, default child esa toza URL saqlaydi.`,
    },
    {
      question: 'Nested routes bilan breadcrumb qanday yaratiladi?',
      answer: `Vue Router route.matched massivi barcha mos kelgan route record-larni qaytaradi. Masalan /admin/products/123 uchun matched = [AdminLayout record, ProductsLayout record, ProductEdit record]. Har bir record-ning meta property-siga title qo'shiladi. Keyin computed bilan breadcrumb massiv yaratiladi: route.matched.filter(r => r.meta.title).map(r => ({ title: r.meta.title, path: r.path })). Bu deklarativ va avtomatik — yangi nested route qo'shilsa, breadcrumb avtomatik yangilanadi. React Router-da useMatches() xuddi shunday ishlaydi — lekin Vue-da meta tizimi bilan birga keladi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'router-basics', label: 'Router asoslari' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'route-meta', label: 'Route Meta' },
    { techId: 'vue-js', sectionId: 'vue-router', topicId: 'lazy-routes', label: 'Lazy Loading Routes' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'components', label: 'Komponentlar' },
  ],
}
