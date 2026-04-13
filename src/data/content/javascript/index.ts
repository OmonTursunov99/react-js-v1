import type { Section } from '../../types'
import { fundamentalsTopics } from './fundamentals'
import { functionsClosuresTopics } from './functions-closures'
import { objectsPrototypesTopics } from './objects-prototypes'
import { oopClassesTopics } from './oop-classes'
import { asyncJavascriptTopics } from './async-javascript'
import { advancedTopics } from './advanced'
import { domBrowserTopics } from './dom-browser'
import { designPatternsTopics } from './design-patterns'
import { errorHandlingTopics } from './error-handling'
import { builtInMethodsTopics } from './built-in-methods'
import { es6SecurityTopics } from './es6-security'

export const sections: Section[] = [
  {
    id: 'fundamentals',
    number: 1,
    title: 'Asoslar',
    description: "O'zgaruvchilar, tiplar, operatorlar, funksiyalar — JS ning poydevori",
    icon: '📦',
    gradient: 'from-yellow-500 to-amber-400',
    topics: fundamentalsTopics,
  },
  {
    id: 'functions-closures',
    number: 2,
    title: 'Funksiyalar va Closures',
    description: 'Execution context, call stack, closures, higher-order functions',
    icon: '🔒',
    gradient: 'from-purple-500 to-indigo-400',
    topics: functionsClosuresTopics,
  },
  {
    id: 'objects-prototypes',
    number: 3,
    title: 'Obyektlar va Prototiplar',
    description: 'Obyekt yaratish, prototype chain, this, constructors',
    icon: '🏗️',
    gradient: 'from-orange-500 to-red-400',
    topics: objectsPrototypesTopics,
  },
  {
    id: 'oop-classes',
    number: 4,
    title: 'OOP va Klasslar',
    description: 'ES6 class, inheritance, SOLID, design patterns',
    icon: '🎭',
    gradient: 'from-pink-500 to-rose-400',
    topics: oopClassesTopics,
  },
  {
    id: 'async-javascript',
    number: 5,
    title: 'Asinxron JavaScript',
    description: 'Event loop, promises, async/await, microtasks',
    icon: '⏳',
    gradient: 'from-cyan-500 to-blue-400',
    topics: asyncJavascriptTopics,
  },
  {
    id: 'advanced',
    number: 6,
    title: 'Murakkab Mavzular',
    description: 'Proxy, Symbol, generators, modullar, xotira',
    icon: '🧠',
    gradient: 'from-violet-500 to-purple-400',
    topics: advancedTopics,
  },
  {
    id: 'dom-browser',
    number: 7,
    title: 'DOM va Browser',
    description: 'DOM, events, Web API, fetch, workers, observers',
    icon: '🌐',
    gradient: 'from-teal-500 to-green-400',
    topics: domBrowserTopics,
  },
  {
    id: 'design-patterns',
    number: 8,
    title: 'Design Patterns',
    description: 'Module, Singleton, Observer, Factory, Strategy',
    icon: '🎨',
    gradient: 'from-amber-500 to-yellow-400',
    topics: designPatternsTopics,
  },
  {
    id: 'error-handling',
    number: 9,
    title: 'Xatolarni Boshqarish',
    description: 'try/catch, Error turlari, custom errors, async xatolar',
    icon: '🛑',
    gradient: 'from-red-500 to-orange-400',
    topics: errorHandlingTopics,
  },
  {
    id: 'built-in-methods',
    number: 10,
    title: 'Built-in Metodlar',
    description: 'Array, String, Number, Date, JSON, structuredClone',
    icon: '🧰',
    gradient: 'from-emerald-500 to-teal-400',
    topics: builtInMethodsTopics,
  },
  {
    id: 'es6-security',
    number: 11,
    title: 'ES6+ va Xavfsizlik',
    description: 'ES2020-2024 yangiliklar, XSS, CORS, CSP',
    icon: '🔐',
    gradient: 'from-rose-500 to-pink-400',
    topics: es6SecurityTopics,
  },
]
