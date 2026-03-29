# React Router — Yo'nalishlar (Routing)

## O'rnatish

```bash
yarn add react-router
```

## Vue Router bilan solishtirish

| Tushuncha | Vue Router | React Router |
|---|---|---|
| O'rnatish | `vue-router` | `react-router` |
| Ilovaga ulash | `app.use(router)` | `<BrowserRouter>` komponenti |
| Yo'nalishlarni yozish | Obyektlar massivi `{ path, component }` | JSX: `<Route path="/" element={<Page />} />` |
| Sahifani ko'rsatish | `<RouterView />` | `<Routes>...</Routes>` |
| Havola (link) | `<RouterLink to="/about">` | `<Link to="/about">` |
| Koddan yo'naltirish | `router.push('/about')` | `navigate('/about')` (`useNavigate` hook) |
| Yo'l parametrlari | `route.params.id` | `const { id } = useParams()` |
| Query parametrlar | `route.query.search` | `const [searchParams] = useSearchParams()` |
| 404 sahifa | `path: '/:pathMatch(.*)*'` | `path="*"` |
| Ichki yo'nalishlar | `children: [...]` | `<Route>` ichida `<Route>` + `<Outlet />` |

## Asosiy farq

**Vue Router** — yo'nalishlar **obyektlar massivi** sifatida alohida faylda yoziladi:

```js
// Vue
const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
]
const router = createRouter({ history: createWebHistory(), routes })
```

**React Router** — yo'nalishlar **JSX komponentlar** sifatida yoziladi:

```tsx
// React
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
  </Routes>
</BrowserRouter>
```

## Sahifalar orasida o'tish (Link)

Vue-da `<RouterLink>` — React-da `<Link>`:

```tsx
import { Link } from 'react-router'

<Link to="/">Bosh sahifa</Link>
<Link to="/about">Biz haqimizda</Link>
```

## Aktiv sahifani aniqlash (NavLink)

Vue-da `<RouterLink>` avtomatik `router-link-active` klassini qo'shadi.
React-da buning uchun `<NavLink>` komponenti bor — `<Link>`-dan farqi shunda.

```tsx
// Vue — avtomatik klass
<RouterLink to="/about">Biz haqimizda</RouterLink>
// → aktiv bo'lganda: class="router-link-active router-link-exact-active"
```

```tsx
// React — NavLink, className funksiya qabul qiladi
import { NavLink } from 'react-router'

<NavLink
  to="/about"
  className={({ isActive }) =>
    isActive ? 'font-bold text-blue-600' : 'text-gray-600'
  }
>
  Biz haqimizda
</NavLink>
```

`className`-ga funksiya beriladi — u `{ isActive }` obyektini qaytaradi.

### `end` prop — aniq moslik

`/` (bosh sahifa) uchun `end` prop qo'shish kerak. Aks holda `/about` yo'lida ham `/` aktiv bo'lib qoladi:

```tsx
// end yo'q — '/' hamma sahifada aktiv bo'ladi (chunki '/about' ham '/' bilan boshlanadi)
<NavLink to="/">Bosh sahifa</NavLink>

// end bor — faqat aniq '/' yo'lida aktiv bo'ladi
<NavLink to="/" end>Bosh sahifa</NavLink>
```

Vue-da bu `:exact="true"` propiga o'xshaydi.

### style orqali ham ishlash mumkin

```tsx
<NavLink
  to="/about"
  style={({ isActive }) => ({
    color: isActive ? 'blue' : 'gray',
    fontWeight: isActive ? 'bold' : 'normal',
  })}
>
  Biz haqimizda
</NavLink>
```

### `isPending` — sahifa yuklanayotganda

```tsx
<NavLink
  to="/about"
  className={({ isActive, isPending }) =>
    isActive ? 'active' : isPending ? 'loading' : ''
  }
>
  Biz haqimizda
</NavLink>
```

## Router hooklari

Vue-da `useRoute()` va `useRouter()` bor edi. React-da ular alohida hooklarga bo'lingan:

```tsx
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router'

// Koddan yo'naltirish (Vue-da: router.push())
const navigate = useNavigate()
navigate('/about')

// Yo'l parametrlari (Vue-da: route.params)
const { id } = useParams()

// Query parametrlar (Vue-da: route.query)
const [searchParams] = useSearchParams()
const search = searchParams.get('q')

// Joriy yo'nalish ma'lumotlari (Vue-da: route)
const location = useLocation()
// location.pathname — joriy yo'l
// location.search — query string
```

## Ichki yo'nalishlar (Nested Routes)

Vue-da `children` massivi va `<RouterView />` ishlatiladi. React-da `<Route>` ichiga `<Route>` qo'yiladi va `<Outlet />` orqali ko'rsatiladi:

```tsx
// Vue
const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome },
      { path: 'settings', component: DashboardSettings },
    ]
  }
]
// template ichida: <RouterView />
```

```tsx
// React
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="settings" element={<DashboardSettings />} />
</Route>

// DashboardLayout ichida:
import { Outlet } from 'react-router'

function DashboardLayout() {
  return (
    <div>
      <nav>...</nav>
      <Outlet />   {/* bu yerga ichki sahifa chiqadi */}
    </div>
  )
}
```

`<Outlet />` — bu Vue-dagi `<RouterView />` ning analogi.

## Himoyalangan yo'nalishlar (Protected Routes)

Vue-da `beforeEach` guard ishlatiladi. React-da oddiy komponent yoziladi:

```tsx
// Vue
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn) next('/login')
  else next()
})
```

```tsx
// React
import { Navigate } from 'react-router'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = false // bu yerda auth tekshirish

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Ishlatish:
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

## useNavigate — koddan yo'naltirish

Vue-da `router.push()` va `router.replace()` bor edi. React-da `useNavigate()` hook ishlatiladi:

```tsx
import { useNavigate } from 'react-router'

function LoginPage() {
  const navigate = useNavigate()

  function handleLogin() {
    // Oddiy o'tish — history-ga qo'shadi (orqaga qaytish mumkin)
    navigate('/dashboard')

    // replace — history-ga qo'SHMAYDI (login sahifasiga orqaga qaytish kerak emas)
    navigate('/dashboard', { replace: true })

    // Orqaga — history.back() kabi
    navigate(-1)

    // Oldinga
    navigate(1)

    // State bilan — keyingi sahifaga ma'lumot uzatish
    navigate('/profile', { state: { from: 'login' } })
  }
}
```

State-ni keyingi sahifada olish:
```tsx
import { useLocation } from 'react-router'

function ProfilePage() {
  const location = useLocation()
  console.log(location.state) // { from: 'login' }
}
```

---

## useParams — URL parametrlari

Vue-da: `route.params.id`. React-da:

```tsx
// Route ta'rifi:
<Route path="/users/:id" element={<UserPage />} />
<Route path="/users/:userId/posts/:postId" element={<PostPage />} />
```

```tsx
// UserPage ichida:
import { useParams } from 'react-router'

function UserPage() {
  const { id } = useParams()
  // /users/42 → id = "42" (har doim string!)

  return <h1>Foydalanuvchi: {id}</h1>
}
```

```tsx
// PostPage ichida — bir nechta parametr:
function PostPage() {
  const { userId, postId } = useParams()
  // /users/5/posts/99 → userId="5", postId="99"
}
```

> **Muhim:** `useParams` har doim `string` qaytaradi. Raqam kerak bo'lsa: `Number(id)` yoki `parseInt(id)`.

---

## useSearchParams — Query parametrlar

Vue-da: `route.query.q`. React-da:

```tsx
import { useSearchParams } from 'react-router'

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // URL: /search?q=react&page=2
  const query = searchParams.get('q')    // "react"
  const page = searchParams.get('page')  // "2"
  const missing = searchParams.get('x')  // null — yo'q bo'lsa

  // URL ni yangilash — sahifa qayta yuklanmaydi
  function handleSearch(value: string) {
    setSearchParams({ q: value, page: '1' })
    // URL: /search?q=value&page=1
  }

  // Faqat bitta parametrni o'zgartirish
  function nextPage() {
    setSearchParams(prev => {
      prev.set('page', String(Number(page) + 1))
      return prev
    })
  }
}
```

---

## useLocation — joriy yo'l ma'lumotlari

Vue-da: `route.path`, `route.fullPath`. React-da:

```tsx
import { useLocation } from 'react-router'

function AnyComponent() {
  const location = useLocation()

  // /users/42?q=hello#section
  location.pathname  // "/users/42"
  location.search    // "?q=hello"
  location.hash      // "#section"
  location.state     // navigate() bilan uzatilgan ma'lumot
}
```

Amaliy misol — sahifa o'zgarganda analytics yuborish:
```tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router'

function App() {
  const location = useLocation()

  useEffect(() => {
    // har safar sahifa o'zgarganda ishlaydi
    console.log('Sahifa ochildi:', location.pathname)
    // analytics.track(location.pathname)
  }, [location])
}
```

---

## Lazy loading — kodni bo'lish (Code Splitting)

Vue-da: `component: () => import('./Page.vue')` — avtomatik lazy.
React-da: `React.lazy()` + `<Suspense>` ishlatiladi:

```tsx
// Vue — juda sodda
const routes = [
  { path: '/about', component: () => import('./pages/AboutPage.vue') }
]
```

```tsx
// React
import { lazy, Suspense } from 'react'

// Komponent faqat kerak bo'lganda yuklanadi
const AboutPage = lazy(() => import('../pages/about/AboutPage'))
const UserPage = lazy(() => import('../pages/user/UserPage'))

// Suspense — yuklanayotganda fallback ko'rsatadi
function RouterProvider() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Yuklanmoqda...</div>}>
        <Routes>
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user/:id" element={<UserPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

Nima uchun kerak? Har bir sahifa alohida `.js` faylga chiqadi — sahifa birinchi marta ochilganda yuklanadi. Ilova tezroq ishga tushadi.

---

## loader — sahifa ochilmadan data olish

Bu React Router v7-ning o'ziga xos xususiyati. Vue-da to'g'ridan-to'g'ri analogi yo'q (u odatda `onMounted` yoki `pinia action` orqali qilinadi).

```tsx
// Vue — komponent ichida data olish
onMounted(async () => {
  user.value = await fetchUser(route.params.id)
})
```

```tsx
// React Router — Route-ga loader berish
// Komponent render bo'lishidan OLDIN data olinadi → loading state kerak emas

// 1. Loader funksiyasi yoziladi
async function userLoader({ params }: { params: { id: string } }) {
  const user = await fetch(`/api/users/${params.id}`).then(r => r.json())
  return user
}

// 2. Route-ga beriladi
<Route
  path="/user/:id"
  element={<UserPage />}
  loader={userLoader}
/>

// 3. Komponent ichida useLoaderData() bilan olinadi
import { useLoaderData } from 'react-router'

function UserPage() {
  const user = useLoaderData() // loader qaytargan ma'lumot

  return <h1>{user.name}</h1>
}
```

Afzalligi: sahifa ochilishidan oldin data tayyor bo'ladi — foydalanuvchi bo'sh sahifani ko'rmaydi.

---

## errorElement — xato ushlash

Har bir Route-ga xato sahifasi berilishi mumkin:

```tsx
<Route
  path="/user/:id"
  element={<UserPage />}
  loader={userLoader}
  errorElement={<ErrorPage />}  // loader yoki komponent xato bersa
/>
```

```tsx
import { useRouteError } from 'react-router'

function ErrorPage() {
  const error = useRouteError()

  return (
    <div>
      <h1>Xato yuz berdi</h1>
      <p>{error instanceof Error ? error.message : 'Noma\'lum xato'}</p>
    </div>
  )
}
```

---

## index Route — parent path uchun

`index` prop — parent yo'lining o'ziga mos keladi:

```tsx
<Route path="/dashboard" element={<DashboardLayout />}>
  {/* /dashboard ga o'tganda shu komponent ko'rsatiladi */}
  <Route index element={<DashboardHome />} />

  {/* /dashboard/settings */}
  <Route path="settings" element={<DashboardSettings />} />

  {/* /dashboard/users */}
  <Route path="users" element={<DashboardUsers />} />
</Route>
```

`<Route index />` — `<Route path="" />` bilan bir xil. Outlet-da ko'rsatiladi.

---

## BrowserRouter vs HashRouter vs MemoryRouter

```tsx
import { BrowserRouter, HashRouter, MemoryRouter } from 'react-router'
```

| Router | URL ko'rinishi | Qachon ishlatiladi |
|---|---|---|
| `BrowserRouter` | `example.com/about` | Odatiy web ilovalar — server `index.html` ni qaytarib berishi kerak |
| `HashRouter` | `example.com/#/about` | Oddiy static hosting (GitHub Pages, s3) — server konfiguratsiyasi kerak emas |
| `MemoryRouter` | URL o'zgarmaydi | Testing, React Native, Storybook |

**BrowserRouter muammosi:** Agar server `/about` so'roviga `index.html` qaytarmasa — 404 beradi. Vite dev serverda bu avtomatik ishlaydi. Produksiyada server sozlanishi kerak (nginx, vercel.json va h.k.).

---

## Loyihadagi fayl tuzilishi (FSD)

```
src/
  app/
    providers/
      RouterProvider.tsx    — BrowserRouter + Routes + Route
  pages/
    home/
      HomePage.tsx
    about/
      AboutPage.tsx
    not-found/
      NotFoundPage.tsx
    index.ts               — barcha sahifalarni eksport qiladi
```
