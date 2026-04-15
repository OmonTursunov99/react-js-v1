import type { Topic } from '../../../types'

export const volarDx: Topic = {
  id: 'volar-dx',
  title: 'Volar & DX',
  importance: 1,
  status: 'to-learn',
  description: 'Volar (Vue Language Tools), vue-tsc, tsconfig sozlash, @vue/tsconfig, hybrid mode, IDE tajribasi — Vue TypeScript tooling',
  content: `Vue TypeScript ekotizimi — Volar (Vue Language Tools) asosida qurilgan. To'g'ri sozlangan tooling DX ni keskin yaxshilaydi: autocomplete, type checking, refactoring barchasi ishlaydi.

═══════════════════════════════════════
  VOLAR — VUE LANGUAGE TOOLS
═══════════════════════════════════════

Volar — Vue uchun rasmiy Language Server Protocol (LSP) implementatsiyasi.
U .vue fayllarini tushunadi va IDE ga quyidagilarni beradi:

  1) TYPE CHECKING — template ichida TypeScript tekshiruv
  2) AUTOCOMPLETE — props, emits, slot nomi va props
  3) GO TO DEFINITION — template dan script ga o'tish
  4) REFACTORING — rename, extract component
  5) DIAGNOSTICS — xatolarni real-time ko'rsatish

Volar QANDAY ISHLAYDI:
  - .vue faylni 3 qismga ajratadi: script, template, style
  - Template ni virtual TypeScript kodga aylantiradi
  - TypeScript Language Service orqali tekshiradi
  - Natijani IDE ga LSP orqali yuboradi

O'rnatish (VS Code):
  Extension: "Vue - Official" (id: Vue.volar)
  Bu YAGONA kerakli extension — boshqasi shart emas.

MUHIM: Eski "Vetur" extension ni O'CHIRISH kerak!
Volar va Vetur birga ISHLMAYDI — conflict bo'ladi.

═══════════════════════════════════════
  TAKEOVER MODE VA HYBRID MODE
═══════════════════════════════════════

TAKEOVER MODE (eskirgan, Vue 3.4 gacha):
  VS Code da TypeScript built-in extension ni o'chirib,
  Volar ni yagona TS server sifatida ishlatish.
  Muammo: barcha .ts fayllar ham Volar orqali — sekin.

HYBRID MODE (Vue 3.5+, hozirgi standart):
  Volar FAQAT .vue fayllar uchun ishlaydi.
  .ts/.tsx fayllar — VS Code built-in TS server.
  Tezroq va barqarorroq.

Hybrid mode AVTOMATIK yoqilgan (Volar 2.0+).
Maxsus sozlash KERAK EMAS.

Agar eski loyihada Takeover mode ishlatilayotgan bo'lsa:
  1) Volar ni yangilash (2.0+)
  2) TypeScript built-in extension ni QAYTA YOQISH
  3) VS Code ni restart qilish

═══════════════════════════════════════
  vue-tsc — CI DA TYPE CHECKING
═══════════════════════════════════════

vue-tsc — tsc (TypeScript compiler) ning Vue versiyasi.
.vue fayllarni TUSHUNADI va command line da type check qiladi.

O'rnatish:
  npm install -D vue-tsc typescript

Ishlatish:
  npx vue-tsc --noEmit         # type check only
  npx vue-tsc --noEmit --watch # watch mode

package.json script:
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "vue-tsc --noEmit && vite build"
  }

CI pipeline da:
  1) yarn install
  2) yarn type-check    ← vue-tsc
  3) yarn lint           ← eslint
  4) yarn build          ← vite build

MUHIM: Vite TIPLARNI TEKSHIRMAYDI! Vite faqat transpile qiladi
(esbuild/SWC). Type checking — vue-tsc vazifasi. Production build da
DOIMO vue-tsc ishlatish kerak.

vue-tsc vs tsc farqi:
  tsc — .vue fayllarni TUSHUNMAYDI (xato beradi)
  vue-tsc — Volar orqali .vue fayllarni parse qiladi
  vue-tsc SEKINROQ — lekin to'g'ri natija beradi

═══════════════════════════════════════
  TSCONFIG SOZLASH
═══════════════════════════════════════

Vue loyihada IKKITA tsconfig bo'ladi:

1) tsconfig.json — ROOT config (references bilan):
   {
     "files": [],
     "references": [
       { "path": "./tsconfig.app.json" },
       { "path": "./tsconfig.node.json" }
     ]
   }

2) tsconfig.app.json — ILOVA kodi uchun:
   {
     "extends": "@vue/tsconfig/tsconfig.dom.json",
     "include": ["src/**/*", "src/**/*.vue"],
     "compilerOptions": {
       "composite": true,
       "baseUrl": ".",
       "paths": { "@/*": ["./src/*"] }
     }
   }

3) tsconfig.node.json — VITE config uchun:
   {
     "extends": "@vue/tsconfig/tsconfig.node.json",
     "include": ["vite.config.*"],
     "compilerOptions": {
       "composite": true
     }
   }

@vue/tsconfig — Vue uchun TAVSIYA ETILGAN tsconfig presetlar.
Kerakli compilerOptions ni TO'G'RI sozlaydi:
  - jsx: "preserve" (Vue JSX uchun)
  - moduleResolution: "bundler"
  - strict: true
  - skipLibCheck: true

═══════════════════════════════════════
  PROJECT REFERENCES
═══════════════════════════════════════

Nima uchun alohida tsconfig.app.json va tsconfig.node.json?

ILOVA KODI (src/) — brauzer muhiti:
  - DOM tiplar kerak (document, window, HTMLElement)
  - Vue tiplar kerak (.vue fayllar)
  - Node.js tiplari KERAK EMAS

VITE CONFIG (vite.config.ts) — Node.js muhiti:
  - Node.js tiplar kerak (process, __dirname)
  - DOM tiplari KERAK EMAS
  - .vue fayllar KERAK EMAS

"composite": true — TypeScript incremental build uchun.
Katta loyihalarda build tezligini oshiradi.

═══════════════════════════════════════
  PERFORMANCE TIPS
═══════════════════════════════════════

Vue TypeScript SEKIN bo'lishi mumkin. Yechimlar:

1) skipLibCheck: true — node_modules tiplarini tekshirmaslik
   (KATTA ta'sir — doimo yoqib qo'yish kerak)

2) Kichik tsconfig include — faqat kerakli fayllar:
   "include": ["src/**/*"] — butun mono-reponi emas

3) vue-tsc --incremental — takroriy build larda tezroq

4) TypeScript 5.x+ — har versiya da performance yaxshilanadi

5) Volar 2.0+ Hybrid mode — .ts va .vue alohida server

6) Template da murakkab inline tiplardan QOCHISH:
   NOTO'G'RI: v-for="item in (items as (User & { extra: true })[])"
   TO'G'RI: computed da tip narrowing qilish, template sodda saqlash

7) Katta loyihalarda — monorepo + project references

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

React TypeScript tooling Vue ga qaraganda SODDAROQ:

React:
  - tsc — standart TypeScript compiler yetarli
  - .tsx fayllar — oddiy TypeScript, maxsus tool kerak emas
  - tsconfig.json — bitta yetarli (project references ixtiyoriy)
  - IDE: VS Code built-in TypeScript support yetarli
  - CI: tsc --noEmit — standart

Vue:
  - vue-tsc — MAXSUS compiler kerak (tsc emas)
  - .vue fayllar — SFC format, Volar kerak
  - tsconfig — ikkita (app + node), @vue/tsconfig preset
  - IDE: Volar extension MAJBURIY
  - CI: vue-tsc --noEmit — maxsus tool

NIMA UCHUN Vue murakkab?
  .vue fayllar — template, script, style bitta faylda.
  TypeScript .vue ni TUSHUNMAYDI — Volar TARJIMA qiladi.
  React .tsx — bu TypeScript o'zi, maxsus tool KERAK EMAS.

Lekin Vue DX YAXSHI bo'lganda:
  - Template autocomplete AJOYIB — props, events, slotlar
  - Type checking TEMPLATE ICHIDA ishlaydi
  - v-for, v-if, v-model — barchasi tip tekshiriladi
  - React JSX da bu NATIVE, Vue SFC da Volar ORQALI

Natija: React — TypeScript bilan NATIVE integratsiya.
Vue — Volar orqali KUCHLI, lekin MURAKKAB tooling.`,
  codeExamples: [
    {
      title: 'tsconfig.json — Vue loyiha uchun to\'liq sozlash',
      language: 'json',
      code: `// ═══ tsconfig.json (root) ═══
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

// ═══ tsconfig.app.json ═══
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue"
  ],
  "exclude": [
    "src/**/__tests__/*",
    "src/**/*.spec.ts",
    "src/**/*.test.ts"
  ],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    "skipLibCheck": true
  }
}

// ═══ tsconfig.node.json ═══
{
  "extends": "@vue/tsconfig/tsconfig.node.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "playwright.config.*"
  ],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "noEmit": true
  }
}

// ═══ env.d.ts — .vue modul deklaratsiyasi ═══
// /// <reference types="vite/client" />
// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }`,
      description: 'Vue loyiha uchun to\'liq tsconfig sozlashi: root references, app config (DOM + Vue), node config (Vite). @vue/tsconfig presetlari bilan.',
    },
    {
      title: 'vue-tsc — CI pipeline da type checking',
      language: 'bash',
      code: `# ═══ package.json scripts ═══
# "type-check": "vue-tsc --noEmit",
# "type-check:watch": "vue-tsc --noEmit --watch",
# "lint": "eslint . --ext .vue,.js,.jsx,.ts,.tsx",
# "build": "run-p type-check \"build-only {@}\" --",
# "build-only": "vite build",
# "preview": "vite preview"

# ═══ Lokal development ═══
# IDE da Volar real-time type check qiladi
# Qo'shimcha type check kerak emas

# vue-tsc — FAQAT CI va build uchun
npx vue-tsc --noEmit

# Watch mode — lokal development da ham ishlatish mumkin
npx vue-tsc --noEmit --watch

# Incremental — takroriy run larda tezroq
npx vue-tsc --noEmit --incremental

# ═══ CI Pipeline (GitHub Actions) ═══
# name: CI
# on: [push, pull_request]
# jobs:
#   check:
#     runs-on: ubuntu-latest
#     steps:
#       - uses: actions/checkout@v4
#       - uses: actions/setup-node@v4
#         with:
#           node-version: 20
#           cache: 'npm'
#       - run: npm ci
#       - run: npm run type-check    # vue-tsc --noEmit
#       - run: npm run lint           # eslint
#       - run: npm run build          # vite build

# ═══ Pre-commit hook (husky + lint-staged) ═══
# .husky/pre-commit:
# npx lint-staged

# .lintstagedrc.json:
# {
#   "*.{ts,tsx,vue}": [
#     "vue-tsc --noEmit --pretty",
#     "eslint --fix"
#   ]
# }

# ═══ MUHIM ESLATMA ═══
# Vite TIPLARNI TEKSHIRMAYDI!
# vite build — esbuild orqali faqat transpile
# Type error bo'lsa ham — build MUVAFFAQIYATLI bo'lishi mumkin!
# Shuning uchun build OLDIDAN vue-tsc ishlatish MAJBURIY`,
      description: 'vue-tsc ishlatish: CI pipeline, pre-commit hook, watch mode. Vite type check QILMASLIGINI tushunish muhim.',
    },
    {
      title: 'env.d.ts va global tip deklaratsiyalar',
      language: 'ts',
      code: `// ═══ env.d.ts — Muhit tiplari ═══

/// <reference types="vite/client" />

// ── .vue modul deklaratsiyasi ──
// TypeScript .vue faylni TUSHUNMAYDI
// Bu deklaratsiya: "har bir .vue fayl — Vue komponent" deydi
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<
    Record<string, never>,  // props
    Record<string, never>,  // emits
    any                      // data
  >
  export default component
}

// ── Vite muhit o'zgaruvchilari ──
// .env faylda: VITE_API_URL=https://api.example.com
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_ANALYTICS_ID?: string  // ixtiyoriy
  // VITE_ prefiksi bo'lmagan o'zgaruvchilar
  // client da ko'rinMAYDI (xavfsizlik)
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ═══ Ishlatish ═══
// const apiUrl = import.meta.env.VITE_API_URL
// // TypeScript: string (autocomplete ishlaydi)
//
// const unknown = import.meta.env.UNKNOWN_VAR
// // TypeScript ERROR: Property 'UNKNOWN_VAR' does not exist

// ── Global komponent tiplari ──
// GlobalComponents — Volar uchun global ro'yxatdan o'tgan
// komponentlarni template da tanish uchun
declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: (typeof import('vue-router'))['RouterLink']
    RouterView: (typeof import('vue-router'))['RouterView']
    // Agar global komponentlar registratsiya qilsangiz:
    // BaseButton: typeof import('./components/BaseButton.vue')['default']
    // BaseInput: typeof import('./components/BaseInput.vue')['default']
  }
}

// ── CSS Modules tiplari ──
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.module.scss' {
  const classes: Record<string, string>
  export default classes
}

// ── Asset tiplari ──
declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}`,
      description: 'env.d.ts — .vue modul deklaratsiya, Vite muhit o\'zgaruvchilari, global komponent tiplari, CSS modules va asset tiplari.',
    },
    {
      title: 'Volar konfiguratsiya va VS Code sozlash',
      language: 'json',
      code: `// ═══ .vscode/settings.json — Vue loyiha uchun ═══
{
  // ── TypeScript ──
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // ── Volar ──
  // Hybrid mode (Volar 2.0+) avtomatik yoqilgan
  // Maxsus sozlash kerak emas

  // ── Formatter ──
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ── ESLint ──
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ],

  // ── File associations ──
  "files.associations": {
    "*.css": "tailwindcss"
  },

  // ── Emmet ──
  "emmet.includeLanguages": {
    "vue": "html"
  }
}

// ═══ .vscode/extensions.json — Tavsiya etilgan extensionlar ═══
// {
//   "recommendations": [
//     "Vue.volar",                    // Vue Language Tools (MAJBURIY)
//     "dbaeumer.vscode-eslint",       // ESLint
//     "esbenp.prettier-vscode",       // Prettier
//     "bradlc.vscode-tailwindcss",    // Tailwind CSS IntelliSense
//     "streetsidesoftware.code-spell-checker" // Spelling
//   ],
//   "unwantedRecommendations": [
//     "octref.vetur"                  // Vetur — ESKIRGAN, O'CHIRISH!
//   ]
// }

// ═══ eslint.config.js — Vue + TypeScript ═══
// import pluginVue from 'eslint-plugin-vue'
// import tseslint from 'typescript-eslint'
//
// export default [
//   ...pluginVue.configs['flat/recommended'],
//   ...tseslint.configs.recommended,
//   {
//     files: ['*.vue', '**/*.vue'],
//     languageOptions: {
//       parserOptions: {
//         parser: tseslint.parser,
//       },
//     },
//   },
// ]`,
      description: 'VS Code sozlash: workspace TypeScript, Volar formatter, ESLint vue validate. Extensions recommendations va eslint config.',
    },
    {
      title: 'React vs Vue — TypeScript tooling taqqoslash',
      language: 'ts',
      code: `// ═══════════════════════════════════════
//  REACT TypeScript Tooling
// ═══════════════════════════════════════

// tsconfig.json — BITTA config yetarli:
// {
//   "compilerOptions": {
//     "target": "ES2020",
//     "jsx": "react-jsx",        // React JSX transform
//     "strict": true,
//     "module": "ESNext",
//     "moduleResolution": "bundler"
//   },
//   "include": ["src"]
// }

// Type checking:
// tsc --noEmit             ← STANDART tsc yetarli!

// IDE:
// VS Code built-in TypeScript — YETARLI
// Qo'shimcha extension KERAK EMAS

// .tsx fayl — oddiy TypeScript:
// TypeScript NATIVE tushunadi, maxsus tool kerak emas

// ═══════════════════════════════════════
//  VUE TypeScript Tooling
// ═══════════════════════════════════════

// tsconfig — IKKITA config kerak:
// tsconfig.json (root references)
// tsconfig.app.json (ilova — DOM)
// tsconfig.node.json (vite config — Node)

// Type checking:
// vue-tsc --noEmit          ← MAXSUS tool kerak!
// tsc --noEmit              ← .vue fayllarni TUSHUNMAYDI

// IDE:
// Volar extension MAJBURIY  ← qo'shimcha o'rnatish kerak
// VS Code built-in TS yetarli EMAS

// .vue fayl — SFC (Single File Component):
// TypeScript native TUSHUNMAYDI
// Volar TARJIMA qiladi: .vue → virtual .ts

// ═══════════════════════════════════════
//  XULOSA — Tooling murakkabligi
// ═══════════════════════════════════════

// React:
// ✓ tsc — standart           (maxsus tool kerak emas)
// ✓ VS Code built-in         (extension kerak emas)
// ✓ 1 tsconfig               (sodda)
// ✓ .tsx = TypeScript         (native support)
// Murakkablik: ★☆☆ (minimal)

// Vue:
// ✗ vue-tsc — maxsus tool    (o'rnatish kerak)
// ✗ Volar — maxsus extension (o'rnatish kerak)
// ✗ 2-3 tsconfig             (project references)
// ✗ .vue → Volar → .ts       (tarjima qatlami)
// Murakkablik: ★★★ (sezilarli)

// LEKIN Vue DX natijasi YAXSHI:
// - Template ichida type checking ishlaydi
// - Props, emits, slots — barchasi tipizatsiya
// - v-for, v-if ichida autocomplete
// - defineProps, defineEmits — compiler makroslari kuchli
// Muammo faqat SOZLASH da — bir marta sozlagandan keyin DX ajoyib`,
      description: 'React va Vue TypeScript tooling taqqoslashi. React: minimal sozlash. Vue: murakkab, lekin natija kuchli. Har birining trade-off lari.',
    },
  ],
  interviewQA: [
    {
      question: 'Volar nima va u qanday ishlaydi?',
      answer: `Volar (Vue Language Tools) — Vue uchun rasmiy Language Server Protocol (LSP) implementatsiyasi. U .vue SFC fayllarni tushunadi va IDE ga type checking, autocomplete, go-to-definition, refactoring beradi. Ishlash prinsipi: Volar .vue faylni parse qiladi, template ni virtual TypeScript kodga aylantiradi, va TypeScript Language Service orqali tekshiradi. Natijani IDE ga LSP orqali yuboradi. Vue 3.5+ da Hybrid mode standart — Volar faqat .vue fayllar uchun, .ts fayllar VS Code built-in TS server orqali. Eski Takeover mode da Volar BARCHA TS fayllar uchun ishlagan — sekinroq edi.`,
    },
    {
      question: 'vue-tsc nima uchun kerak? Oddiy tsc ishlatib bo\'lmaydimi?',
      answer: `tsc (TypeScript compiler) .vue fayllarni TUSHUNMAYDI — ular TypeScript uchun noma'lum format. vue-tsc — tsc ning Vue versiyasi bo'lib, Volar orqali .vue fayllarni parse qiladi va type check qiladi. CI pipeline da vue-tsc --noEmit MAJBURIY — bu production ga type error o'tishini oldini oladi. MUHIM nuqta: Vite TIPLARNI TEKSHIRMAYDI! Vite faqat esbuild orqali transpile qiladi — type error bo'lsa ham build muvaffaqiyatli bo'ladi. Shuning uchun build = vue-tsc --noEmit + vite build ketma-ketligida bo'lishi kerak.`,
    },
    {
      question: 'Vue loyihada nima uchun ikkita tsconfig (app va node) kerak?',
      answer: `Ilova kodi (src/) va Vite config (vite.config.ts) TURLI MUHITLARDA ishlaydi. Ilova — brauzer: DOM tiplar kerak (document, HTMLElement), Node.js tiplar KERAK EMAS. Vite config — Node.js: process, __dirname kerak, DOM kerak EMAS. Agar bitta tsconfig bo'lsa — ikki muhit tiplari ARALASHADI, bu xatolarga olib keladi. Project references (composite: true) orqali TypeScript har bir config ni ALOHIDA tekshiradi va incremental build qiladi. @vue/tsconfig preset lar to'g'ri compilerOptions ni avtomatik sozlaydi.`,
    },
    {
      question: 'Hybrid mode va Takeover mode farqi nima?',
      answer: `Takeover mode (eskirgan) — VS Code built-in TypeScript extension o'chiriladi, Volar YAGONA TS server bo'lib ishlaydi. Muammo: barcha .ts fayllar ham Volar orqali — sekin, chunki Volar .vue uchun optimizatsiya qilingan. Hybrid mode (Volar 2.0+, standart) — Volar FAQAT .vue fayllar bilan ishlaydi, .ts/.tsx fayllar VS Code built-in TS server orqali. Tezroq va barqarorroq. Hybrid mode avtomatik yoqilgan, maxsus sozlash kerak emas. Eski loyihada Takeover mode dan Hybrid ga o'tish uchun: Volar ni yangilash, TS built-in extension ni qayta yoqish.`,
    },
    {
      question: 'Vue va React TypeScript DX ni taqqoslang — qaysi biri yaxshiroq?',
      answer: `React DX — SODDA SOZLASH: tsc standart, VS Code built-in yetarli, bitta tsconfig, .tsx = native TypeScript. Maxsus tool kerak emas. Vue DX — MURAKKAB SOZLASH: vue-tsc maxsus tool, Volar extension, ikki-uch tsconfig, .vue → virtual .ts tarjima qatlami. LEKIN sozlagandan keyin Vue DX KUCHLI: template ichida type checking, defineProps/defineEmits compiler makroslari, v-for/v-if da tip tekshiruv, slot tipizatsiyasi. React da JSX — bu TypeScript o'zi, shuning uchun NATIVE ishlaydi. Vue SFC — maxsus format, Volar TARJIMA qiladi. Trade-off: React — nol sozlash, Vue — ko'p sozlash + ko'proq imkoniyat. Katta loyihalarda ikkalasi ham yaxshi DX beradi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'props-emits-typing', label: 'Props & Emits tipizatsiya' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'typed-composables', label: 'Tipli composablelar' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'typed-slots-inject', label: 'Typed Slots & Inject' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue-ecosystem', label: 'Vue ekotizimi' },
  ],
}
