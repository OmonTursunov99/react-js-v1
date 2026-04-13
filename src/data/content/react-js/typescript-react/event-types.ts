import type { Topic } from '../../../types'

export const eventTypes: Topic = {
    id: 'event-types',
    title: 'Event Types',
    importance: 3,
    status: 'to-learn',
    description: 'React.ChangeEvent, React.MouseEvent va boshqalar',
    content: `React event-lari TypeScript-da maxsus tiplar bilan ishlatiladi. Browser native event-laridan farqli — React SyntheticEvent ishlatadi.

═══════════════════════════════════════
  ASOSIY EVENT TIPLARI
═══════════════════════════════════════

React.ChangeEvent<HTMLInputElement>      — input o'zgarishi
React.MouseEvent<HTMLButtonElement>      — mouse click
React.FormEvent<HTMLFormElement>         — form submit
React.KeyboardEvent<HTMLInputElement>    — klaviatura
React.FocusEvent<HTMLInputElement>       — focus/blur
React.DragEvent<HTMLDivElement>          — drag & drop
React.TouchEvent<HTMLDivElement>         — touch (mobil)
React.WheelEvent<HTMLDivElement>         — mouse wheel
React.ClipboardEvent<HTMLInputElement>   — copy/paste
React.PointerEvent<HTMLDivElement>       — pointer (mouse + touch)

Generic parametr — qaysi HTML element-dan kelganini bildiradi.

═══════════════════════════════════════
  CHANGE EVENT
═══════════════════════════════════════

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value      // string
    const name = e.target.name        // input name
    const checked = e.target.checked  // checkbox uchun
  }

  <input onChange={handleChange} />

Turli elementlar uchun:
  ChangeEvent<HTMLInputElement>    — input, checkbox
  ChangeEvent<HTMLSelectElement>   — select
  ChangeEvent<HTMLTextAreaElement>  — textarea

═══════════════════════════════════════
  FORM EVENT
═══════════════════════════════════════

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()  // sahifa yangilanishini to'xtatish
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
  }

  <form onSubmit={handleSubmit}>

e.target vs e.currentTarget:
  target — event sodir bo'lgan element (masalan input)
  currentTarget — handler ulangan element (masalan form)
  TypeScript-da currentTarget tiplanmagan — CURRENTTARGET ishlatish xavfsizroq.

═══════════════════════════════════════
  INLINE vs ALOHIDA HANDLER
═══════════════════════════════════════

Inline — tip avtomatik aniqlanadi:
  <button onClick={(e) => {
    // e avtomatik React.MouseEvent<HTMLButtonElement>
    console.log(e.clientX, e.clientY)
  }}>
    Click
  </button>

Alohida funksiya — tip qo'lda yoziladi:
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(e.clientX, e.clientY)
  }
  <button onClick={handleClick}>Click</button>

═══════════════════════════════════════
  SYNTHETIC EVENT
═══════════════════════════════════════

React BARCHA event-larni SyntheticEvent bilan o'raydi:
  - Cross-browser muvofiqligi
  - Event pooling (React 17 da olib tashlandi)
  - Delegation (document-ga bitta listener)

Native event olish:
  function handleClick(e: React.MouseEvent) {
    const nativeEvent = e.nativeEvent  // browser native event
  }`,
    codeExamples: [
      {
        title: 'Barcha asosiy event tiplar',
        language: 'tsx',
        code: `import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'

function EventTypesDemo() {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user' })

  // ChangeEvent — input, select, textarea
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    setFormData(prev => ({ ...prev, role: e.target.value }))
  }

  // FormEvent — form submit
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(formData)
  }

  // KeyboardEvent — Enter bosilganda
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      console.log('Enter bosildi')
    }
  }

  // MouseEvent — click, contextmenu
  function handleContextMenu(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault()
    console.log(\`Right click: \${e.clientX}, \${e.clientY}\`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name}
        onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <input name="email" type="email" value={formData.email}
        onChange={handleInputChange} />
      <select value={formData.role} onChange={handleSelectChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <div onContextMenu={handleContextMenu}>
        O'ng tugma bilan bosing
      </div>
      <button type="submit">Yuborish</button>
    </form>
  )
}`,
        description: 'Asosiy event tiplar: ChangeEvent (input/select), FormEvent (submit), KeyboardEvent (key), MouseEvent (click). Har biri generic — qaysi HTML element ekanini bildiradi.',
      },
      {
        title: 'Event handler tipini prop sifatida berish',
        language: 'tsx',
        code: `// Event handler props
interface SearchInputProps {
  onSearch: (query: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

// Variant 1: Oddiy callback (tip ma'lumoti yetarli)
function SearchInput({ onSearch, onFocus, onBlur }: SearchInputProps) {
  return (
    <input
      onChange={e => onSearch(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Qidirish..."
    />
  )
}

// Variant 2: HTML event handler-larni to'g'ridan-to'g'ri uzatish
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary'
}

function Button({ variant = 'primary', children, onClick, ...rest }: ButtonProps) {
  // onClick tipi avtomatik: React.MouseEventHandler<HTMLButtonElement>
  return (
    <button onClick={onClick} className={variant} {...rest}>
      {children}
    </button>
  )
}

// Variant 3: Custom event data
interface TableRowProps<T> {
  item: T
  onSelect: (item: T) => void
  onDelete: (id: string) => void
}

function TableRow<T extends { id: string; name: string }>({
  item,
  onSelect,
  onDelete,
}: TableRowProps<T>) {
  return (
    <tr onClick={() => onSelect(item)}>
      <td>{item.name}</td>
      <td>
        <button onClick={e => {
          e.stopPropagation()  // row click-ni to'xtatish
          onDelete(item.id)
        }}>
          O'chirish
        </button>
      </td>
    </tr>
  )
}`,
        description: 'Event handler props: oddiy callback (onSearch: (q: string) => void), HTML handler (extends ComponentPropsWithoutRef), yoki generic callback (onSelect: (item: T) => void).',
      },
    ],
    interviewQA: [
      {
        question: 'React event TypeScript-da qanday tiplanadi?',
        answer: `React event-lari SyntheticEvent asosida tiplanadi. Asosiy tiplar: ChangeEvent<HTMLInputElement> (input o'zgarishi), MouseEvent<HTMLButtonElement> (click), FormEvent<HTMLFormElement> (submit), KeyboardEvent (klaviatura). Generic parametr — qaysi HTML element ekanini bildiradi. Inline handler-da tip avtomatik aniqlanadi, alohida funksiyada qo'lda yoziladi. e.target — event sodir bo'lgan element, e.currentTarget — handler ulangan element.`,
      },
      {
        question: 'e.target va e.currentTarget farqi nima?',
        answer: `e.target — event haqiqatan sodir bo'lgan element (masalan form ichidagi input). Tipi EventTarget — aniq tip yo'q, type assertion kerak: (e.target as HTMLInputElement).value. e.currentTarget — handler ULANGAN element (masalan form o'zi). TypeScript-da to'g'ri tiplanmagan — FormEvent<HTMLFormElement> da currentTarget: HTMLFormElement. Qoida: currentTarget ishlatish xavfsizroq, chunki tiplanmagan. Input uchun ChangeEvent<HTMLInputElement> da target to'g'ri tiplanadi.`,
      },
      {
        question: 'React SyntheticEvent nima?',
        answer: `SyntheticEvent — React-ning barcha event-larini o'raydigan wrapper. Browser native event-laridan farqi: 1) Cross-browser muvofiqligi — barcha brauzerlarda bir xil ishlaydi, 2) Event delegation — React document-ga bitta listener qo'yadi (event bubbling), 3) Barcha React event tiplarining ota klasi. nativeEvent property orqali original browser event-ga kirish mumkin. React 17 dan boshlab event pooling olib tashlandi — event-ni asinxron ishlatish xavfsiz.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'react-core', topicId: 'event-system', label: 'React Event System' },
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Controlled Components' },
    ],
  }
