# Senior React Frontend Interview — To'liq Tayyorgarlik Rejasi

**Suxbat sanasi:** 2026-04-11 (4 kun qoldi)

---

## 1. REACT CORE (Asosiy bilimlar)

### Bilasiz (docs/ da bor)
- [x] `useState`
- [x] `useEffect`
- [x] `useRef`
- [x] `useMemo`
- [x] `useCallback`
- [x] `useContext`
- [x] `useReducer`
- [x] `useLayoutEffect`
- [x] `useTransition`
- [x] `useDeferredValue`
- [x] Virtual DOM, Reconciliation (react-dom.md)

### O'rganish kerak
- [ ] **React rendering cycle** — Render vs Commit fazasi, batching, fiber arxitekturasi ⭐⭐⭐
- [ ] **React.memo / forwardRef** — Qachon va nima uchun memo ishlatiladi, ref forwarding ⭐⭐⭐
- [ ] **useImperativeHandle** — forwardRef bilan birgalikda parent-ga API ochish ⭐⭐
- [ ] **useId** — SSR-safe unikal ID generatsiya ⭐
- [ ] **useSyncExternalStore** — Tashqi store subscription (Redux ichki ishlatadi) ⭐⭐
- [ ] **use() hook (React 19)** — Promise va Context o'qish, yangi pattern ⭐⭐
- [ ] **useOptimistic (React 19)** — Optimistic UI update ⭐⭐
- [ ] **useActionState (React 19)** — Form + server action state ⭐⭐

---

## 2. COMPONENT PATTERNS (Senior uchun juda muhim)

- [ ] **Composition vs Inheritance** — Nima uchun React-da inheritance ishlatilmaydi ⭐⭐⭐
- [ ] **Compound Components** — `<Select><Option/></Select>` pattern ⭐⭐⭐
- [ ] **Render Props** — Funksiya orqali child render qilish ⭐⭐
- [ ] **Higher-Order Components (HOC)** — `withAuth(Component)` pattern, qachon ishlatiladi ⭐⭐
- [ ] **Custom Hooks** — O'z hooklarini yozish, logikani ajratish ⭐⭐⭐
- [ ] **Controlled vs Uncontrolled** — Input/form boshqaruvi farqi ⭐⭐⭐
- [ ] **Error Boundaries** — `componentDidCatch`, class component kerak ⭐⭐⭐
- [ ] **Suspense + React.lazy** — Code splitting, lazy loading ⭐⭐⭐
- [ ] **Portal** — `createPortal` — modal, tooltip, dropdown ⭐⭐

---

## 3. STATE MANAGEMENT (Chuqurroq)

### Bilasiz
- [x] Redux Toolkit (slice, configureStore, useSelector, useDispatch)
- [x] Zustand (create, selector pattern)
- [x] TanStack Query (useQuery)
- [x] Context API

### O'rganish kerak
- [ ] **Redux Middleware** — thunk, saga — async logika qanday ishlaydi ⭐⭐⭐
- [ ] **RTK Query** — Redux Toolkit ichidagi data fetching (TanStack Query alternativa) ⭐⭐
- [ ] **TanStack Query chuqur** — mutations, invalidation, optimistic updates, cache strategies ⭐⭐⭐
- [ ] **Qachon nima ishlatish** — Local state vs Context vs Redux vs Zustand vs Server state farqi ⭐⭐⭐

---

## 4. ROUTING (Chuqurroq)

### Bilasiz
- [x] React Router (BrowserRouter, Routes, Route, NavLink)

### O'rganish kerak
- [ ] **Protected Routes** — Auth guard qanday qilinadi ⭐⭐⭐
- [ ] **Lazy routes** — `React.lazy` + `Suspense` bilan route code-splitting ⭐⭐⭐
- [ ] **Loaders / Actions** — React Router v6.4+ data loading pattern ⭐⭐
- [ ] **useNavigate, useParams, useSearchParams** — Programmatic navigation, URL params ⭐⭐⭐
- [ ] **Nested layouts** — Outlet pattern ⭐⭐

---

## 5. PERFORMANCE & OPTIMIZATION (Senior uchun kalit mavzu)

- [ ] **Re-render sabablari** — Props, state, context, parent re-render ⭐⭐⭐
- [ ] **React.memo + useMemo + useCallback** — Qachon ishlatish, qachon ortiqcha ⭐⭐⭐
- [ ] **React Profiler / DevTools** — Performance bottleneck topish ⭐⭐⭐
- [ ] **Virtualization** — Katta ro'yxatlar — react-window / react-virtuoso ⭐⭐
- [ ] **Code splitting** — Dynamic import, lazy loading ⭐⭐⭐
- [ ] **React Compiler** — Nima qiladi, qanday ishlaydi (loyihada ishlatilmoqda!) ⭐⭐
- [ ] **Key prop** — Nima uchun kerak, index key nima uchun yomon ⭐⭐⭐
- [ ] **Debounce / Throttle** — Input va scroll optimizatsiya ⭐⭐

---

## 6. TYPESCRIPT + REACT (Senior uchun juda muhim)

- [ ] **Component props typing** — `interface Props {}`, `React.FC` vs function ⭐⭐⭐
- [ ] **Generic components** — `<Select<T>>` — generik komponentlar ⭐⭐⭐
- [ ] **Event types** — `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent` ⭐⭐⭐
- [ ] **Children types** — `ReactNode`, `ReactElement`, `PropsWithChildren` ⭐⭐
- [ ] **Discriminated unions** — Props-da variant pattern: `{type: 'a', data: A} | {type: 'b', data: B}` ⭐⭐⭐
- [ ] **Utility types** — `Omit`, `Pick`, `Partial`, `Record`, `ReturnType` ⭐⭐
- [ ] **as const, satisfies** — TypeScript 5 features ⭐⭐

---

## 7. TESTING (Senior uchun so'rashadi)

- [ ] **Vitest / Jest** — Unit test yozish ⭐⭐⭐
- [ ] **React Testing Library (RTL)** — `render`, `screen`, `userEvent`, `waitFor` ⭐⭐⭐
- [ ] **Testing patterns** — Nima test qilinadi — behavior, not implementation ⭐⭐⭐
- [ ] **Mock** — API mock, module mock, hook mock ⭐⭐
- [ ] **E2E** — Playwright / Cypress asoslari ⭐

---

## 8. ARCHITECTURE & BEST PRACTICES

- [ ] **Feature-Sliced Design (FSD)** — Loyiha FSD-da! Tushuntira olish kerak ⭐⭐⭐
- [ ] **SOLID in React** — Single Responsibility, DI in components ⭐⭐
- [ ] **Atomic Design** — atoms → molecules → organisms → templates → pages ⭐⭐
- [ ] **Monorepo** — Turborepo, Nx — katta loyiha tuzilmasi ⭐
- [ ] **CI/CD** — GitHub Actions, deploy pipeline ⭐⭐
- [ ] **Accessibility (a11y)** — ARIA attributes, semantic HTML, keyboard nav ⭐⭐

---

## 9. NAZARIY SAVOLLAR (100% so'rashadi)

- [ ] Virtual DOM nima va qanday ishlaydi? — Diffing algorithm, fiber, reconciliation
- [ ] React lifecycle (functional) — Mount → render → commit → cleanup
- [ ] Hooks qoidalari (Rules of Hooks) — Nima uchun shart ichida hook ishlatib bo'lmaydi
- [ ] Controlled vs Uncontrolled — Farqi, qachon nima ishlatiladi
- [ ] Key nima uchun kerak? — Reconciliation, list performance
- [ ] useEffect vs useLayoutEffect — Qachon nima, paint oldin/keyin
- [ ] Props drilling muammosi — Context, composition, state management
- [ ] SSR vs CSR vs SSG — Farqlari, qachon nima ishlatiladi
- [ ] React 18/19 yangiliklari — Concurrent features, Server Components, Compiler
- [ ] REST vs GraphQL — Farqi, qachon nima ishlatiladi

---

## 4 KUNLIK REJA

### 1-kun (2026-04-07, bugun)
- [ ] Component Patterns (Compound, HOC, Render Props, Custom Hooks)
- [ ] Error Boundaries
- [ ] Suspense + lazy
- [ ] Performance (re-render, memo, key)

### 2-kun (2026-04-08)
- [ ] TypeScript + React (generics, event types, discriminated unions)
- [ ] Protected Routes, useNavigate/useParams
- [ ] TanStack Query chuqur (mutations, cache)

### 3-kun (2026-04-09)
- [ ] Testing (RTL + Vitest asoslari)
- [ ] Redux Middleware (thunk)
- [ ] Arxitektura (FSD tushuntirish)
- [ ] Nazariy savollar tayyorlash

### 4-kun (2026-04-10)
- [ ] Umumiy takrorlash
- [ ] Mock interview o'zingiz bilan
- [ ] Zaif tomonlarni mustahkamlash
