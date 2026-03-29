# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды

- **Запуск dev-сервера:** `yarn dev` — запускает Vite с HMR (горячая перезагрузка модулей)
- **Сборка проекта:** `yarn build` — сначала проверяет типы через `tsc -b`, затем собирает через `vite build` в папку `dist/`
- **Линтинг:** `yarn lint` — проверка кода через ESLint (TypeScript + React hooks/refresh правила)
- **Превью продакшн-сборки:** `yarn preview` — локальный сервер для собранного `dist/`
- **Установка зависимостей:** `yarn`

## Стек технологий

| Технология | Версия | Аналог во Vue | Назначение |
|---|---|---|---|
| React | 19.2 | Vue 3 | UI-фреймворк (библиотека) |
| React DOM | 19.2 | Встроен в Vue | Рендеринг в браузер |
| TypeScript | 5.9 | TypeScript | Типизация |
| Vite | 8.0 | Vite | Сборщик и dev-сервер |
| ESLint | 9.39 | ESLint | Линтер |
| Babel | 7.29 | — | Транспиляция (для React Compiler) |
| React Compiler | 1.0 | Vue Reactivity Transform (убран) | Автоматическая оптимизация рендеринга |

## Архитектура проекта

### Точка входа

```
index.html → src/main.tsx → <App />
```

**Сравнение с Vue:**
- Во Vue: `main.ts` создаёт приложение через `createApp(App).mount('#app')`
- В React: `main.tsx` создаёт корень через `createRoot(document.getElementById('root')!).render(<App />)`

Ключевое отличие: Vue оборачивает приложение в экземпляр `App`, React просто рендерит JSX в DOM-узел.

### Файл `src/main.tsx` — корень приложения

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `createRoot` — создаёт корневой React-узел (аналог `createApp()` во Vue)
- `StrictMode` — режим разработки, который предупреждает о проблемах (аналогов во Vue нет — Vue предупреждает через devtools). В StrictMode React вызывает компоненты дважды в dev-режиме, чтобы найти побочные эффекты
- `index.css` — глобальные стили (как в Vue, когда стили не scoped)

### Файл `src/App.tsx` — главный компонент

```tsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Count is {count}
    </button>
  )
}

export default App
```

**Сравнение с Vue (Composition API):**

| Концепция | React | Vue 3 (Composition API) |
|---|---|---|
| Реактивное состояние | `useState(0)` возвращает `[count, setCount]` | `const count = ref(0)` |
| Изменение состояния | `setCount(count + 1)` или `setCount(prev => prev + 1)` | `count.value++` |
| Шаблон/разметка | JSX прямо в функции `return (...)` | `<template>...</template>` |
| CSS-классы | `className="counter"` | `class="counter"` |
| Обработчик события | `onClick={() => ...}` | `@click="..."` |
| Файл компонента | `.tsx` — всё в одном файле через JSX | `.vue` — разделение на `<template>`, `<script>`, `<style>` |

### Ключевые отличия React от Vue

**1. Компоненты — это функции (не объекты и не SFC)**

В Vue компонент — это `.vue` файл с тремя секциями. В React компонент — это обычная функция, которая возвращает JSX. Нет `<template>`, нет `<style scoped>` — всё в JS/TS.

**2. JSX вместо шаблонов**

Vue использует HTML-подобные шаблоны с директивами (`v-if`, `v-for`, `v-bind`). React использует JSX — это JavaScript-выражения, которые выглядят как HTML:
- `v-if="show"` → `{show && <Component />}` или `{show ? <A /> : <B />}`
- `v-for="item in items"` → `{items.map(item => <Item key={item.id} />)}`
- `:src="url"` (v-bind) → `src={url}`
- `@click="handler"` (v-on) → `onClick={handler}`

**3. Реактивность — явная, через хуки**

Vue: реактивность автоматическая — обернул в `ref()` или `reactive()` и Vue сам отслеживает зависимости.

React: нужно явно вызывать `setState` для обновления. React не отслеживает зависимости автоматически — ты сам говоришь, когда перерендерить.

**4. Нет двусторонней привязки (v-model) из коробки**

В Vue: `<input v-model="name" />` — данные автоматически синхронизируются.

В React: нужно вручную:
```tsx
const [name, setName] = useState('')
<input value={name} onChange={(e) => setName(e.target.value)} />
```

### React Compiler

В этом проекте включён **React Compiler** (`babel-plugin-react-compiler` в `vite.config.ts`). Это новая функция React 19, которая автоматически мемоизирует компоненты и значения.

**Что это значит:** Раньше разработчики вручную оборачивали в `useMemo`, `useCallback`, `React.memo`. Теперь компилятор делает это автоматически на этапе сборки.

**Аналог во Vue:** Vue изначально работает иначе — его система реактивности сама отслеживает зависимости и обновляет только то, что нужно. React Compiler — это попытка приблизиться к такой же "автоматической" оптимизации.

### Конфигурация Vite (`vite.config.ts`)

```ts
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [
    react(),                                        // React Fast Refresh (HMR)
    babel({ presets: [reactCompilerPreset()] })     // React Compiler
  ],
})
```

- `@vitejs/plugin-react` — обеспечивает Fast Refresh (мгновенное обновление при редактировании, как HMR во Vue)
- `@rolldown/plugin-babel` с `reactCompilerPreset` — включает React Compiler

Во Vue аналог: `@vitejs/plugin-vue` — один плагин, который обрабатывает `.vue` файлы.

### TypeScript конфигурация (`tsconfig.app.json`)

- `"strict": true` — строгий режим TypeScript
- `"noUnusedLocals": true` — ошибка при неиспользуемых переменных
- `"noUnusedParameters": true` — ошибка при неиспользуемых параметрах функций
- `"jsx": "react-jsx"` — автоматический импорт JSX-рантайма (не нужно писать `import React from 'react'` в каждом файле)

### ESLint конфигурация (`eslint.config.js`)

Используется плоская конфигурация ESLint 9 (flat config) с правилами:
- `js.configs.recommended` — базовые JS-правила
- `tseslint.configs.recommended` — TypeScript-правила
- `reactHooks.configs.flat.recommended` — правила для хуков React (обязательно для правильной работы хуков)
- `reactRefresh.configs.vite` — правила для React Fast Refresh

### Структура файлов

```
src/
  main.tsx      — точка входа, рендеринг <App /> в DOM
  App.tsx       — главный компонент
  App.css       — стили компонента App (не scoped — в отличие от Vue <style scoped>)
  index.css     — глобальные стили
  assets/       — статические ресурсы (изображения, SVG)
```

## Зависимости в `package.json`

### dependencies (продакшн)

| Пакет | Назначение |
|---|---|
| `react` | Ядро React — хуки, компоненты, виртуальный DOM |
| `react-dom` | Рендеринг React-компонентов в браузерный DOM |

Во Vue это один пакет `vue`, который включает и ядро, и рендерер. В React ядро (`react`) и рендерер (`react-dom`) разделены — это позволяет использовать одно ядро для web, mobile (React Native), VR и т.д.

### devDependencies (для разработки)

| Пакет | Назначение |
|---|---|
| `@vitejs/plugin-react` | Плагин Vite для React (Fast Refresh/HMR) — аналог `@vitejs/plugin-vue` |
| `@rolldown/plugin-babel` | Babel через Rolldown (bundler Vite 8) для React Compiler |
| `babel-plugin-react-compiler` | React Compiler — автооптимизация рендеринга |
| `@babel/core` | Ядро Babel (нужно для React Compiler) |
| `typescript` | TypeScript компилятор |
| `@types/react` | Типы для React |
| `@types/react-dom` | Типы для React DOM |
| `@types/node` | Типы для Node.js |
| `@types/babel__core` | Типы для Babel |
| `eslint` | Линтер |
| `@eslint/js` | Базовые правила ESLint |
| `typescript-eslint` | TypeScript-интеграция для ESLint |
| `eslint-plugin-react-hooks` | Правила для хуков React (Rules of Hooks) |
| `eslint-plugin-react-refresh` | Правила для корректной работы HMR |
| `globals` | Глобальные переменные для ESLint (browser, node и т.д.) |
| `vite` | Сборщик и dev-сервер |

### Менеджер пакетов

Проект использует **Yarn 1 (Classic)** — указан в поле `packageManager` в `package.json`. Используй `yarn` для установки зависимостей, не `npm`.
