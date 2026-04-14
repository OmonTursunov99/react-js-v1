import type { Direction } from './types'

export const directions: Direction[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Web frontend texnologiyalari — HTML, CSS, JavaScript, frameworklar',
    icon: '🌐',
    gradient: 'from-blue-500 to-cyan-400',
    categories: [
      // ── Markup ──
      {
        id: 'markup',
        title: 'Markup',
        description: 'Markup tillar — sahifa tuzilmasi',
        icon: '📄',
        gradient: 'from-orange-500 to-red-400',
        technologies: [
          {
            id: 'html',
            title: 'HTML',
            description: 'HyperText Markup Language — web sahifalar tuzilmasi',
            icon: '🏗️',
            gradient: 'from-orange-500 to-orange-400',
            locale: 'uz',
          },
          {
            id: 'xml',
            title: 'XML',
            description: 'eXtensible Markup Language — strukturalangan ma\'lumot',
            icon: '📋',
            gradient: 'from-amber-600 to-orange-400',
            locale: 'uz',
          },
        ],
      },

      // ── Styling ──
      {
        id: 'styling',
        title: 'Styling',
        description: 'Styling tillar — dizayn va tartib',
        icon: '🎨',
        gradient: 'from-blue-500 to-purple-400',
        technologies: [
          {
            id: 'css',
            title: 'CSS',
            description: 'Cascading Style Sheets — web sahifalar dizayni',
            icon: '🎨',
            gradient: 'from-blue-500 to-blue-400',
            locale: 'uz',
          },
          {
            id: 'sass',
            title: 'Sass',
            description: 'Syntactically Awesome Style Sheets — CSS preprocessor',
            icon: '💅',
            gradient: 'from-pink-500 to-rose-400',
            locale: 'uz',
          },
          {
            id: 'less',
            title: 'Less',
            description: 'Leaner Style Sheets — CSS preprocessor',
            icon: '✨',
            gradient: 'from-indigo-500 to-blue-400',
            locale: 'uz',
          },
        ],
      },

      // ── Tillar ──
      {
        id: 'tillar',
        title: 'Tillar',
        description: 'Dasturlash tillari — JavaScript, TypeScript',
        icon: '⚡',
        gradient: 'from-yellow-500 to-amber-400',
        technologies: [
          {
            id: 'javascript',
            title: 'JavaScript',
            description: 'Web dasturlashning asosiy tili — to\'liq qo\'llanma',
            icon: '⚡',
            gradient: 'from-yellow-500 to-amber-400',
            locale: 'uz',
          },
          {
            id: 'typescript',
            title: 'TypeScript',
            description: 'JavaScript + statik tiplar — katta loyihalar uchun',
            icon: '🔷',
            gradient: 'from-blue-600 to-indigo-500',
            locale: 'uz',
          },
        ],
      },

      // ── Testing ──
      {
        id: 'testing',
        title: 'Testing',
        description: 'Test yozish — sifatni ta\'minlash',
        icon: '🧪',
        gradient: 'from-green-500 to-emerald-400',
        technologies: [
          {
            id: 'testing',
            title: 'Testing',
            description: 'Unit, integration, E2E testlar — Vitest, RTL, Playwright',
            icon: '🧪',
            gradient: 'from-green-500 to-emerald-400',
            locale: 'uz',
          },
        ],
      },

      // ── Vue ecosystem ──
      {
        id: 'vue-ecosystem',
        title: 'Vue Ecosystem',
        description: 'Vue.js ekotizimi — progressive framework',
        icon: '💚',
        gradient: 'from-green-500 to-teal-400',
        technologies: [
          {
            id: 'vue-js',
            title: 'Vue.js',
            description: 'Progressive JavaScript framework — Composition API',
            icon: '💚',
            gradient: 'from-green-500 to-teal-400',
            locale: 'uz',
          },
          {
            id: 'nuxt-js',
            title: 'Nuxt.js',
            description: 'Vue.js meta-framework — SSR, file-based routing',
            icon: '🟢',
            gradient: 'from-emerald-600 to-green-400',
            locale: 'uz',
          },
        ],
      },

      // ── React ecosystem ──
      {
        id: 'react-ecosystem',
        title: 'React Ecosystem',
        description: 'React ekotizimi — UI kutubxona va frameworklar',
        icon: '⚛️',
        gradient: 'from-cyan-500 to-blue-400',
        technologies: [
          {
            id: 'react-js',
            title: 'React.js',
            description: 'UI kutubxona — hooklar, komponentlar, state management',
            icon: '⚛️',
            gradient: 'from-cyan-500 to-blue-400',
            locale: 'uz',
          },
          {
            id: 'next-js',
            title: 'Next.js',
            description: 'React meta-framework — SSR, App Router, API routes',
            icon: '▲',
            gradient: 'from-gray-800 to-gray-600',
            locale: 'uz',
          },
          {
            id: 'react-native',
            title: 'React Native',
            description: 'Mobil ilovalar — iOS va Android uchun React',
            icon: '📱',
            gradient: 'from-blue-500 to-purple-500',
            locale: 'uz',
          },
        ],
      },

      // ── Angular ──
      {
        id: 'angular',
        title: 'Angular',
        description: 'Google Angular framework — to\'liq ekotizim',
        icon: '🅰️',
        gradient: 'from-red-500 to-rose-400',
        technologies: [
          {
            id: 'angular',
            title: 'Angular',
            description: 'Full-featured framework — TypeScript, RxJS, DI',
            icon: '🅰️',
            gradient: 'from-red-500 to-rose-400',
            locale: 'uz',
          },
        ],
      },
    ],
  },
]

// ── Yordamchi funksiyalar ──

export function findDirection(directionId: string) {
  return directions.find(d => d.id === directionId)
}

export function findCategory(directionId: string, categoryId: string) {
  const direction = findDirection(directionId)
  if (!direction) return undefined
  return direction.categories.find(c => c.id === categoryId)
}

export function findTechnologyMeta(directionId: string, categoryId: string, techId: string) {
  const category = findCategory(directionId, categoryId)
  if (!category) return undefined
  return category.technologies.find(t => t.id === techId)
}
