import type { Topic } from '../../../types'

export const jsxTransform: Topic = {
    id: 'jsx-transform',
    title: 'JSX Transform',
    importance: 2,
    status: 'to-learn' as const,
    description: 'JSX nima, qanday JavaScript-ga aylanadi, old va new transform farqi',
    content: `JSX — JavaScript-ning kengaytmasi bo'lib, HTML-ga o'xshash sintaksis bilan UI yozish imkonini beradi. Brauzer JSX-ni TUSHMAYDI — u avval JavaScript-ga aylantiriladi.

═══════════════════════════════════════
  JSX NIMA
═══════════════════════════════════════

JSX = JavaScript XML — syntax sugar.
Bu HTML EMAS, JavaScript EMAS — ikkalasi orasidagi ko'prik.

const element = <h1 className="title">Salom</h1>

Bu brauzerga TUSHMAYDI. Build vaqtida JavaScript-ga aylanadi.

═══════════════════════════════════════
  OLD TRANSFORM (React 16 gacha)
═══════════════════════════════════════

// JSX
const element = <h1 className="title">Salom</h1>

// Aylanadi:
const element = React.createElement('h1', { className: 'title' }, 'Salom')

MUAMMO: Har bir faylda "import React from 'react'" yozish SHART edi.
Chunki React.createElement() ishlatiladi.

═══════════════════════════════════════
  NEW TRANSFORM (React 17+)
═══════════════════════════════════════

// JSX
const element = <h1 className="title">Salom</h1>

// Aylanadi:
import { jsx as _jsx } from 'react/jsx-runtime'
const element = _jsx('h1', { className: 'title', children: 'Salom' })

AFZALLIGI:
- "import React" yozish KERAK EMAS — avtomatik import
- Bundle hajmi bir oz kichikroq
- tsconfig.json da: "jsx": "react-jsx" (eski: "react")

═══════════════════════════════════════
  JSX QOIDALARI
═══════════════════════════════════════

1. BITTA ROOT element: <div>...</div> yoki <Fragment> yoki <>...</>
2. className (class emas — JS da class kalit so'z)
3. htmlFor (for emas — JS da for kalit so'z)
4. camelCase atributlar: onClick, onChange, tabIndex
5. style object: style={{ color: 'red', fontSize: 16 }}
6. {expression} — JS ifodalar: {name}, {1 + 2}, {isAdmin && <Admin />}

═══════════════════════════════════════
  FRAGMENT (<> </>)
═══════════════════════════════════════

Qo'shimcha DOM element yaratmasdan bir nechta elementni qaytarish:

// Keraksiz div
<div><h1>A</h1><p>B</p></div>

// Fragment — DOM-da qo'shimcha element YO'Q
<><h1>A</h1><p>B</p></>

// Key kerak bo'lsa:
<Fragment key={item.id}><h1>A</h1><p>B</p></Fragment>`,
    codeExamples: [
        {
            title: 'JSX → createElement aylanishi',
            language: 'tsx' as const,
            code: `// ===== JSX YOZASIZ: =====

function Greeting({ name }: { name: string }) {
  return (
    <div className="card">
      <h1>Salom, {name}!</h1>
      {name === 'Admin' && <p style={{ color: 'red' }}>Maxsus kirish</p>}
      <ul>
        {['React', 'Vue', 'Angular'].map(fw => (
          <li key={fw}>{fw}</li>
        ))}
      </ul>
    </div>
  )
}

// ===== REACT 17+ (NEW TRANSFORM) GA AYLANADI: =====
// import { jsx, jsxs } from 'react/jsx-runtime'
//
// function Greeting({ name }) {
//   return jsxs('div', {
//     className: 'card',
//     children: [
//       jsx('h1', { children: ['Salom, ', name, '!'] }),
//       name === 'Admin' && jsx('p', {
//         style: { color: 'red' },
//         children: 'Maxsus kirish'
//       }),
//       jsx('ul', {
//         children: ['React', 'Vue', 'Angular'].map(fw =>
//           jsx('li', { children: fw }, fw)
//         )
//       })
//     ]
//   })
// }

// MUHIM: "import React" yo'q — avtomatik import!
// tsconfig.json: "jsx": "react-jsx"`,
            description: 'JSX build vaqtida jsx() funksiya chaqiruvlariga aylanadi. React 17+ da import avtomatik — "import React" yozish kerak emas. Bu new JSX transform deyiladi.',
        },
    ],
    interviewQA: [
        {
            question: 'JSX nima va brauzer uni tushuna oladimi?',
            answer: `JSX — JavaScript XML — syntax sugar bo'lib, HTML-ga o'xshash sintaksis bilan UI yozish imkonini beradi. Brauzer JSX-ni TUSHMAYDI. Build vaqtida (Babel/TypeScript orqali) oddiy JavaScript-ga aylantiriladi. <h1>Salom</h1> → jsx('h1', { children: 'Salom' }) ga aylanadi.`,
        },
        {
            question: 'Old va New JSX transform farqi nima?',
            answer: `Old transform (React 16-): JSX React.createElement() ga aylanardi, shu sababli har faylda "import React from 'react'" yozish SHART edi. New transform (React 17+): JSX jsx() funksiyaga aylanadi va import AVTOMATIK qo'shiladi — "import React" yozish kerak emas. tsconfig.json da "jsx": "react-jsx" qo'yiladi. Bundle hajmi ham bir oz kichikroq bo'ladi.`,
        },
        {
            question: 'JSX-ning asosiy qoidalari qanday?',
            answer: `JSX qoidalari: 1) Bitta root element kerak (<div>, <Fragment>, yoki <>), 2) class emas className (JS da class kalit so'z), 3) for emas htmlFor, 4) camelCase atributlar (onClick, onChange, tabIndex), 5) style object sifatida: style={{ color: 'red' }}, 6) {expression} ichida JS yozish mumkin. Fragment (<></>) qo'shimcha DOM element yaratmasdan bir nechta elementni qaytaradi.`,
        },
    ],
    relatedTopics: [
        { techId: 'react-js', sectionId: 'react-core', topicId: 'virtual-dom', label: 'Virtual DOM' },
        { techId: 'react-js', sectionId: 'performance', topicId: 'react-compiler', label: 'React Compiler' },
    ],
}
