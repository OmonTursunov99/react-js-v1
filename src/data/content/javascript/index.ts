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
import { dsaTopics } from './data-structures-algorithms'

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
    id: 'built-in-methods',
    number: 2,
    title: 'Built-in Metodlar',
    description: 'Array, String, Number, Date, JSON, structuredClone',
    icon: '🧰',
    gradient: 'from-emerald-500 to-teal-400',
    topics: builtInMethodsTopics,
  },
  {
    id: 'functions-closures',
    number: 3,
    title: 'Funksiyalar va Closures',
    description: 'Execution context, call stack, closures, higher-order functions',
    icon: '🔒',
    gradient: 'from-purple-500 to-indigo-400',
    topics: functionsClosuresTopics,
  },
  {
    id: 'objects-prototypes',
    number: 4,
    title: 'Obyektlar va Prototiplar',
    description: 'Obyekt yaratish, prototype chain, this, constructors',
    icon: '🏗️',
    gradient: 'from-orange-500 to-red-400',
    topics: objectsPrototypesTopics,
  },
  {
    id: 'oop-classes',
    number: 5,
    title: 'OOP va Klasslar',
    description: 'ES6 class, inheritance, SOLID, design patterns',
    icon: '🎭',
    gradient: 'from-pink-500 to-rose-400',
    topics: oopClassesTopics,
  },
  {
    id: 'error-handling',
    number: 6,
    title: 'Xatolarni Boshqarish',
    description: 'try/catch, Error turlari, custom errors, async xatolar',
    icon: '🛑',
    gradient: 'from-red-500 to-orange-400',
    topics: errorHandlingTopics,
  },
  {
    id: 'async-javascript',
    number: 7,
    title: 'Asinxron JavaScript',
    description: 'Callbacks, promises, async/await, event loop, microtasks',
    icon: '⏳',
    gradient: 'from-cyan-500 to-blue-400',
    topics: asyncJavascriptTopics,
  },
  {
    id: 'dom-browser',
    number: 8,
    title: 'DOM va Browser',
    description: 'DOM tree, events, fetch, WebSocket, workers, observers',
    icon: '🌐',
    gradient: 'from-teal-500 to-green-400',
    topics: domBrowserTopics,
  },
  {
    id: 'advanced',
    number: 9,
    title: 'Murakkab Mavzular',
    description: 'Modullar, Map/Set, Symbol, generators, Proxy, xotira',
    icon: '🧠',
    gradient: 'from-violet-500 to-purple-400',
    topics: advancedTopics,
  },
  {
    id: 'design-patterns',
    number: 10,
    title: 'Design Patterns',
    description: 'Singleton, Factory, Observer, Strategy, Module, Decorator',
    icon: '🎨',
    gradient: 'from-amber-500 to-yellow-400',
    topics: designPatternsTopics,
  },
  {
    id: 'data-structures-algorithms',
    number: 11,
    title: "Ma'lumotlar Tuzilmasi va Algoritmlar",
    description: 'Big O, LinkedList, Stack, Queue, Tree, Sorting, Searching, Graph, DP',
    icon: '🧮',
    gradient: 'from-blue-500 to-cyan-400',
    topics: dsaTopics,
  },
  {
    id: 'es6-security',
    number: 12,
    title: 'ES6+ va Xavfsizlik',
    description: 'ES2020-2024 yangiliklar, XSS, CORS, CSP',
    icon: '🔐',
    gradient: 'from-rose-500 to-pink-400',
    topics: es6SecurityTopics,
  },
]
