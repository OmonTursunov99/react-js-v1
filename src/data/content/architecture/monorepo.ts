import type { Topic } from '../../types'

export const monorepo: Topic = {
    id: 'monorepo',
    title: 'Monorepo',
    importance: 1,
    status: 'to-learn',
    description: 'Turborepo, Nx — katta loyiha tuzilmasi',
    content: `Monorepo — bir nechta loyiha/paket BITTA git repository-da. Katta jamoalar va tashkilotlar uchun. Google, Meta, Microsoft ishlatadi.

═══════════════════════════════════════
  MONOREPO vs POLYREPO
═══════════════════════════════════════

Polyrepo (an'anaviy):
  repo-1: frontend
  repo-2: admin-panel
  repo-3: shared-ui-library
  repo-4: backend

Muammolari:
  ❌ Shared kod — npm paket qilib publish, versiya boshqarish
  ❌ Dependency sync — frontend va admin farqli React versiya
  ❌ Cross-repo o'zgarish — 4 ta PR, 4 ta review

Monorepo:
  one-repo/
  ├── apps/
  │   ├── frontend/
  │   ├── admin/
  │   └── backend/
  └── packages/
      ├── ui/            # shared UI komponentlar
      ├── utils/         # umumiy utility
      └── config/        # shared config

Afzalliklari:
  ✅ Shared kod — to'g'ridan-to'g'ri import, npm kerak emas
  ✅ Atomic commits — bir PR da barcha o'zgarishlar
  ✅ Dependency sync — bir joyda boshqarish
  ✅ Code reuse oson

═══════════════════════════════════════
  VOSITALAR
═══════════════════════════════════════

Turborepo (Vercel):
  ✅ Tez — remote caching, parallel tasks
  ✅ Sodda setup
  ✅ Vite/Next.js bilan yaxshi
  ❌ Kamroq feature

Nx (Nrwl):
  ✅ Ko'p feature — affected commands, generators
  ✅ Plugin tizimi (React, Next, Node)
  ✅ Vizual dependency graph
  ❌ Murakkabrok

pnpm workspaces:
  ✅ Eng sodda — faqat workspace protocol
  ✅ Tez dependency install (hard link)
  ❌ Build orchestration yo'q (Turbo/Nx qo'shish kerak)

═══════════════════════════════════════
  QACHON KERAK
═══════════════════════════════════════

Monorepo KERAK:
  ✅ 2+ ilova bir xil shared kod ishlatsa
  ✅ Design system / UI kit bo'lsa
  ✅ Full-stack (frontend + backend) bitta jamoada
  ✅ Micro-frontend arxitektura

Monorepo KERAK EMAS:
  ❌ Bitta ilova
  ❌ Kichik jamoa (1-2 developer)
  ❌ Aloqasi bo'lmagan loyihalar`,
    codeExamples: [
      {
        title: 'Turborepo tuzilmasi',
        language: 'ts',
        code: `// Papka tuzilmasi
// my-monorepo/
// ├── apps/
// │   ├── web/           # React frontend (Vite)
// │   │   ├── package.json
// │   │   └── src/
// │   └── admin/          # Admin panel (Vite)
// │       ├── package.json
// │       └── src/
// ├── packages/
// │   ├── ui/             # Shared UI komponentlar
// │   │   ├── package.json
// │   │   └── src/
// │   ├── utils/          # Shared utility
// │   │   ├── package.json
// │   │   └── src/
// │   └── tsconfig/       # Shared TS config
// │       └── base.json
// ├── turbo.json           # Turborepo config
// ├── package.json         # Root
// └── pnpm-workspace.yaml  # Workspace config

// pnpm-workspace.yaml
// packages:
//   - "apps/*"
//   - "packages/*"

// turbo.json
// {
//   "tasks": {
//     "build": {
//       "dependsOn": ["^build"],   // dependency-lar avval build
//       "outputs": ["dist/**"]
//     },
//     "dev": { "persistent": true },
//     "lint": {},
//     "test": {}
//   }
// }

// apps/web/package.json
// {
//   "dependencies": {
//     "@my-org/ui": "workspace:*",     // local paket
//     "@my-org/utils": "workspace:*"
//   }
// }

// Ishlatish — oddiy import
// apps/web/src/App.tsx
import { Button, Card } from '@my-org/ui'
import { formatDate } from '@my-org/utils'

// Buyruqlar
// turbo build        # barcha paketlar parallel build
// turbo dev          # barcha dev serverlar
// turbo lint         # barcha linter-lar
// turbo test         # barcha testlar`,
        description: 'Turborepo: apps/ (ilovalar) + packages/ (shared kod). workspace:* — local paket. turbo build — parallel build, caching. Shared paketlar oddiy import bilan.',
      },
    ],
    interviewQA: [
      {
        question: 'Monorepo nima va nima uchun kerak?',
        answer: `Monorepo — bir nechta loyiha/paket BITTA git repository-da. Afzalliklari: shared kod to'g'ridan-to'g'ri import (npm publish kerak emas), atomic commits (bir PR da barcha o'zgarish), dependency sync (barcha ilovalar bir xil versiya). Kamchiliklari: repo katta, CI/CD murakkab, tooling kerak (Turborepo/Nx). Qachon kerak: 2+ ilova shared kod bilan, design system, full-stack jamoa. Kerak emas: bitta ilova, kichik jamoa.`,
      },
      {
        question: 'Turborepo va Nx farqi nima?',
        answer: `Turborepo (Vercel): sodda setup, remote caching (bir developer build qilsa boshqasi cache dan oladi), parallel task execution. Minimal configuration. Nx (Nrwl): ko'proq feature — affected commands (faqat o'zgargan paketlarni build/test), code generators, plugin tizimi, dependency graph vizualizatsiya. Tanlash: kichik-o'rta monorepo → Turborepo (sodda). Katta enterprise → Nx (ko'p feature). Ikkalasi ham pnpm workspaces ustiga quriladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'ci-cd', label: 'CI/CD' },
    ],
  }
