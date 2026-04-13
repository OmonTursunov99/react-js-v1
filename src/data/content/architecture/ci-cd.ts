import type { Topic } from '../../types'

export const ciCd: Topic = {
    id: 'ci-cd',
    title: 'CI/CD',
    importance: 2,
    status: 'to-learn',
    description: 'GitHub Actions, deploy pipeline, lint + test + build',
    content: `CI/CD — Continuous Integration / Continuous Deployment. Kod push qilinganda avtomatik test, build, va deploy qilish.

═══════════════════════════════════════
  CI — CONTINUOUS INTEGRATION
═══════════════════════════════════════

Har push/PR da avtomatik:
  1. Lint — kod sifati tekshirish (ESLint)
  2. Type check — TypeScript tekshirish
  3. Test — unit va integration testlar
  4. Build — production build muvaffaqiyatli bo'lishini tekshirish

Maqsad: muammoni ERTA topish (commit qilinganidan keyin darhol).

═══════════════════════════════════════
  CD — CONTINUOUS DEPLOYMENT
═══════════════════════════════════════

CI muvaffaqiyatli bo'lgandan keyin avtomatik:
  - Staging environment-ga deploy
  - Preview URL yaratish (PR uchun)
  - Production-ga deploy (main branch)

═══════════════════════════════════════
  GITHUB ACTIONS
═══════════════════════════════════════

.github/workflows/ci.yml fayli bilan:

  Trigger: push yoki PR → main
  Steps:
    1. checkout — kodni olish
    2. setup-node — Node.js o'rnatish
    3. install — dependency-lar o'rnatish
    4. lint — ESLint
    5. typecheck — tsc --noEmit
    6. test — vitest
    7. build — vite build

═══════════════════════════════════════
  DEPLOY PLATFORMALAR
═══════════════════════════════════════

Vercel:
  ✅ Git push → avtomatik deploy
  ✅ PR preview URL
  ✅ Edge Functions
  ✅ Next.js uchun ideal

Netlify:
  ✅ Static site uchun yaxshi
  ✅ Form handling
  ✅ Git push → deploy

AWS (S3 + CloudFront):
  ✅ To'liq kontrol
  ❌ Sozlash murakkab

Docker + VPS:
  ✅ Har qanday stack
  ❌ O'zingiz boshqarasiz

═══════════════════════════════════════
  BEST PRACTICES
═══════════════════════════════════════

1. Main branch himoyalangan — to'g'ridan-to'g'ri push yo'q
2. PR required — har o'zgarish PR orqali
3. CI majburiy — test o'tmasa merge mumkin emas
4. Preview deploy — PR uchun alohida URL
5. Environment variables — secrets GitHub-da
6. Cache — node_modules va build cache tezlashtirish uchun`,
    codeExamples: [
      {
        title: 'GitHub Actions — CI pipeline',
        language: 'ts',
        code: `// .github/workflows/ci.yml
// name: CI
//
// on:
//   push:
//     branches: [main]
//   pull_request:
//     branches: [main]
//
// jobs:
//   ci:
//     runs-on: ubuntu-latest
//
//     steps:
//       - name: Checkout
//         uses: actions/checkout@v4
//
//       - name: Setup Node.js
//         uses: actions/setup-node@v4
//         with:
//           node-version: 20
//           cache: 'yarn'
//
//       - name: Install dependencies
//         run: yarn install --frozen-lockfile
//
//       - name: Lint
//         run: yarn lint
//
//       - name: Type check
//         run: npx tsc --noEmit
//
//       - name: Test
//         run: yarn test --run
//
//       - name: Build
//         run: yarn build
//
//       - name: Upload build artifact
//         if: github.ref == 'refs/heads/main'
//         uses: actions/upload-artifact@v4
//         with:
//           name: dist
//           path: dist/

// Pipeline:
// Push/PR → Install → Lint → Type Check → Test → Build
// Agar biror qadam XATO bersa — pipeline TO'XTAYDI
// PR merge qilish mumkin EMAS (branch protection)

// Parallellashtirish mumkin:
// jobs:
//   lint:
//     runs-on: ubuntu-latest
//     steps: [checkout, install, lint]
//   test:
//     runs-on: ubuntu-latest
//     steps: [checkout, install, test]
//   build:
//     runs-on: ubuntu-latest
//     needs: [lint, test]  # lint va test o'tgandan keyin
//     steps: [checkout, install, build]`,
        description: 'GitHub Actions CI: push/PR da avtomatik lint → typecheck → test → build. frozen-lockfile — aniq dependency versiyalar. Cache — tezlashtirish. Branch protection — CI o\'tmasa merge yo\'q.',
      },
      {
        title: 'Vercel deploy + preview',
        language: 'ts',
        code: `// Vercel bilan deploy — GIT PUSH YETARLI:

// 1. vercel.com da GitHub repo ulash
// 2. Framework: Vite (avtomatik aniqlaydi)
// 3. Build command: yarn build
// 4. Output directory: dist
// 5. Push → avtomatik deploy!

// Natija:
// main branch push → production deploy (my-app.vercel.app)
// PR ochilsa → preview deploy (my-app-pr-123.vercel.app)

// vercel.json — ixtiyoriy konfiguratsiya
// {
//   "buildCommand": "yarn build",
//   "outputDirectory": "dist",
//   "framework": "vite",
//   "rewrites": [
//     { "source": "/(.*)", "destination": "/index.html" }
//   ]
// }

// SPA uchun MUHIM: rewrites
// Barcha URL-lar index.html-ga yo'naltiriladi
// Aks holda /about sahifada F5 bosilsa — 404

// Environment variables
// Vercel dashboard → Settings → Environment Variables
// VITE_API_URL=https://api.example.com
// VITE_GA_ID=G-XXXXXXXXXX
//
// Kod-da:
// const apiUrl = import.meta.env.VITE_API_URL`,
        description: 'Vercel — git push bilan avtomatik deploy. PR uchun preview URL. SPA rewrites — barcha URL-lar index.html-ga. Environment variables — dashboard orqali.',
      },
    ],
    interviewQA: [
      {
        question: 'CI/CD nima?',
        answer: `CI (Continuous Integration) — har push/PR da avtomatik: lint, type check, test, build. Muammoni erta topish uchun. CD (Continuous Deployment) — CI muvaffaqiyatli bo'lganda avtomatik deploy. Pipeline: push → install → lint → typecheck → test → build → deploy. GitHub Actions, GitLab CI, Jenkins bilan amalga oshiriladi. Best practice: main branch himoyalangan, PR required, CI majburiy (o'tmasa merge yo'q).`,
      },
      {
        question: 'Frontend CI pipeline-da nima bo\'lishi kerak?',
        answer: `Minimal: 1) Lint — ESLint (kod sifati), 2) Type check — tsc --noEmit (TypeScript xatolar), 3) Test — vitest/jest (unit/integration), 4) Build — production build muvaffaqiyatli. Qo'shimcha: E2E test (Playwright), bundle size check (kattalashtirmaslik), lighthouse (performance), preview deploy (PR uchun URL). Tezlashtirish: dependency cache, parallel jobs (lint || test, keyin build).`,
      },
      {
        question: 'SPA deploy qilganda qanday muammo bo\'ladi?',
        answer: `SPA muammo: foydalanuvchi /about sahifada F5 bosilsa — server /about fayl qidiradi va 404 beradi. Chunki barcha routing client-side (JavaScript-da). Yechim: barcha URL-larni index.html-ga yo'naltirish (rewrite/redirect). Vercel: vercel.json-da rewrites. Nginx: try_files $uri /index.html. Netlify: _redirects faylida /* /index.html 200. Apache: .htaccess bilan. Bu SPA deploy-ning eng ko'p uchraydigan muammosi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'e2e', label: 'E2E (pipeline)' },
      { sectionId: 'architecture', topicId: 'monorepo', label: 'Monorepo' },
    ],
  }
