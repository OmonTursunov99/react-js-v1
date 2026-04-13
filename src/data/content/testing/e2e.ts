import type { Topic } from '../../types'

export const e2e: Topic = {
    id: 'e2e',
    title: 'E2E Testing',
    importance: 1,
    status: 'to-learn',
    description: 'Playwright / Cypress asoslari',
    content: `E2E (End-to-End) testing — butun ilovani HAQIQIY BRAUZERDA test qilish. Foydalanuvchi tajribasini boshidan oxirigacha tekshirish.

═══════════════════════════════════════
  E2E vs UNIT/INTEGRATION
═══════════════════════════════════════

Unit/Integration (RTL):
  - jsdom (virtual DOM, brauzer emas)
  - Tez (millisekundlar)
  - Komponent darajasida
  - Network mock qilinadi

E2E (Playwright/Cypress):
  - HAQIQIY brauzer (Chrome, Firefox, Safari)
  - Sekin (sekundlar)
  - Butun ilova darajasida
  - Haqiqiy server bilan (yoki mock server)

E2E nima tekshiradi:
  ✅ Login flow boshidan oxirigacha
  ✅ Form submit → server → natija ko'rish
  ✅ Navigation (sahifalar orasida o'tish)
  ✅ Cross-browser muvofiqligi

═══════════════════════════════════════
  PLAYWRIGHT vs CYPRESS
═══════════════════════════════════════

Playwright (Microsoft):
  ✅ Multi-browser (Chrome, Firefox, Safari, mobile)
  ✅ Parallel test (tez)
  ✅ Auto-wait (element tayyor bo'lguncha kutadi)
  ✅ TypeScript native
  ✅ Network interception
  ✅ Codegen (brauzerda yozish)

Cypress:
  ✅ Developer UX yaxshi (time travel debugging)
  ✅ Katta ekotizim
  ✅ Dashboard (CI natijalarni ko'rish)
  ❌ Faqat Chrome-based (Firefox qisman)
  ❌ Multi-tab, multi-domain qiyin

Hozirgi tavsiya: PLAYWRIGHT — ko'p brauzer, tez, bepul.

═══════════════════════════════════════
  PLAYWRIGHT ASOSLARI
═══════════════════════════════════════

  import { test, expect } from '@playwright/test'

  test('login flow', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    await page.getByLabel('Email').fill('ali@test.com')
    await page.getByLabel('Parol').fill('123456')
    await page.getByRole('button', { name: 'Kirish' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  })

API: RTL-ga juda O'XSHASH:
  page.getByRole() — RTL kabi
  page.getByLabel() — RTL kabi
  page.getByText() — RTL kabi
  Lekin HAQIQIY brauzerda ishlaydi!

═══════════════════════════════════════
  QACHON E2E KERAK
═══════════════════════════════════════

E2E KERAK:
  ✅ Critical user flow (login, checkout, registration)
  ✅ Cross-browser tekshirish
  ✅ Multi-page flow (wizard, onboarding)
  ✅ Third-party integratsiya

E2E KERAK EMAS:
  ❌ Har bir komponent (unit/integration yetarli)
  ❌ Edge case-lar (unit test tezroq)
  ❌ Stil tekshirish (visual regression alohida)

Qoida: 5-10 ta CRITICAL flow uchun E2E, qolgani unit/integration.`,
    codeExamples: [
      {
        title: 'Playwright — asosiy test',
        language: 'ts',
        code: `import { test, expect } from '@playwright/test'

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should add and complete a todo', async ({ page }) => {
    // Todo qo'shish
    await page.getByPlaceholder('Yangi vazifa').fill('Playwright o\\'rganish')
    await page.getByRole('button', { name: 'Qo\\'shish' }).click()

    // Tekshirish
    const todo = page.getByText('Playwright o\\'rganish')
    await expect(todo).toBeVisible()

    // Bajarish
    await page.getByRole('checkbox').click()

    // Line-through stilni tekshirish
    await expect(todo).toHaveCSS('text-decoration-line', 'line-through')
  })

  test('should navigate between pages', async ({ page }) => {
    // Bosh sahifadan section-ga o'tish
    await page.getByText('React Core').click()

    await expect(page).toHaveURL(/\\/section\\/react-core/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('React Core')

    // Topic-ga o'tish
    await page.getByText('useState').click()

    await expect(page).toHaveURL(/\\/section\\/react-core\\/use-state/)
  })

  test('should toggle dark mode', async ({ page }) => {
    // Light mode default
    const html = page.locator('html')

    // Dark mode toggle
    await page.getByRole('button', { name: /🌙/ }).click()

    await expect(html).toHaveClass(/dark/)

    // Light mode qaytish
    await page.getByRole('button', { name: /☀️/ }).click()

    await expect(html).not.toHaveClass(/dark/)
  })
})`,
        description: 'Playwright — haqiqiy brauzerda test. API RTL-ga o\'xshash (getByRole, getByText). page.goto — sahifaga o\'tish. expect(page).toHaveURL — navigatsiya tekshirish.',
      },
      {
        title: 'Playwright — API mock va screenshot',
        language: 'ts',
        code: `import { test, expect } from '@playwright/test'

test.describe('User Dashboard', () => {
  test('should display users from API', async ({ page }) => {
    // API mock — network darajasida
    await page.route('/api/users', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Ali', role: 'admin' },
          { id: '2', name: 'Vali', role: 'user' },
        ]),
      })
    })

    await page.goto('http://localhost:5173/users')

    await expect(page.getByText('Ali')).toBeVisible()
    await expect(page.getByText('Vali')).toBeVisible()
  })

  test('should handle API error', async ({ page }) => {
    await page.route('/api/users', async (route) => {
      await route.fulfill({ status: 500 })
    })

    await page.goto('http://localhost:5173/users')

    await expect(page.getByText(/xato/i)).toBeVisible()

    // Screenshot — vizual tekshirish / debug
    await page.screenshot({ path: 'tests/screenshots/error-state.png' })
  })

  test('should be responsive', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:5173')

    // Sidebar yashirin bo'lishi kerak (mobile da)
    // await expect(page.getByRole('complementary')).not.toBeVisible()

    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })

    // Sidebar ko'rinadi
    // await expect(page.getByRole('complementary')).toBeVisible()
  })
})

// playwright.config.ts
// export default defineConfig({
//   testDir: './e2e',
//   use: { baseURL: 'http://localhost:5173' },
//   webServer: {
//     command: 'npm run dev',
//     port: 5173,
//   },
//   projects: [
//     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
//     { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
//     { name: 'mobile', use: { ...devices['iPhone 13'] } },
//   ],
// })`,
        description: 'page.route — API mock (network intercept). Screenshot — debug va vizual test. setViewportSize — responsive test. Config: multi-browser, webServer avtomatik start.',
      },
    ],
    interviewQA: [
      {
        question: 'E2E testing nima va qachon kerak?',
        answer: `E2E — butun ilovani haqiqiy brauzerda boshidan oxirigacha test qilish. Unit/integration jsdom-da (virtual DOM), E2E haqiqiy Chrome/Firefox-da. Qachon kerak: critical user flow (login, checkout, registration), multi-page navigation, cross-browser tekshirish, third-party integratsiya. Qachon kerak emas: har bir komponent (unit yetarli), edge case-lar (unit tezroq). Qoida: 5-10 ta critical flow uchun E2E, qolgani unit/integration.`,
      },
      {
        question: 'Playwright va Cypress farqi nima?',
        answer: `Playwright (Microsoft): multi-browser (Chrome, Firefox, Safari, mobile), parallel test, auto-wait, TypeScript native, bepul. Cypress: yaxshi DX (time-travel debugging), katta ekotizim, dashboard. Kamchiliklari: faqat Chrome-based (Firefox qisman), multi-tab qiyin, parallel uchun to'lov. Hozirgi tavsiya: PLAYWRIGHT — ko'proq brauzer, tezroq (parallel), bepul. Cypress — agar jamoa allaqachon ishlatayotgan bo'lsa.`,
      },
      {
        question: 'E2E testda API qanday mock qilinadi?',
        answer: `Playwright: page.route("/api/users", (route) => route.fulfill({body: JSON.stringify(data)})) — network darajasida intercept. Cypress: cy.intercept("GET", "/api/users", {body: data}). Alternativa: mock server (MSW, json-server) — haqiqiy HTTP server, lekin soxta data. Afzallik: haqiqiy network behavior test qilinadi. Yechim tanlash: oddiy mock → page.route, murakkab scenario → mock server.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'testing', topicId: 'rtl', label: 'RTL (unit/integration)' },
      { sectionId: 'architecture', topicId: 'ci-cd', label: 'CI/CD (E2E pipeline)' },
    ],
  }
