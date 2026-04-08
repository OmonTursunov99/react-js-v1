import type { Topic } from '../types'

export const typescriptReactTopics: Topic[] = [
  {
    id: 'props-typing',
    title: 'Component Props Typing',
    importance: 3,
    status: 'to-learn',
    description: 'interface Props {}, React.FC vs function',
    content: `Props tipizatsiyasi — React + TypeScript-ning asosi. Har bir komponentga qanday props berish mumkinligini TIP bilan belgilash.

═══════════════════════════════════════
  ASOSIY PATTERN
═══════════════════════════════════════

  interface ButtonProps {
    label: string                    // majburiy
    variant?: 'primary' | 'secondary' // ixtiyoriy (?)
    disabled?: boolean
    onClick: () => void
  }

  function Button({ label, variant = 'primary', disabled = false, onClick }: ButtonProps) {
    return (
      <button onClick={onClick} disabled={disabled} className={variant}>
        {label}
      </button>
    )
  }

TypeScript kompilyatsiya vaqtida tekshiradi:
  <Button label="OK" onClick={() => {}} />  // ✅
  <Button />                                 // ❌ label va onClick kerak
  <Button label={123} />                     // ❌ label string bo'lishi kerak
  <Button label="OK" onClick={() => {}} color="red" />  // ❌ color yo'q

═══════════════════════════════════════
  interface vs type
═══════════════════════════════════════

Ikkalasi ham props uchun ishlaydi:

  // interface — extends bilan kengaytirish mumkin
  interface ButtonProps {
    label: string
  }
  interface IconButtonProps extends ButtonProps {
    icon: string
  }

  // type — union, intersection, mapped types uchun kuchliroq
  type ButtonProps = {
    label: string
  }
  type IconButtonProps = ButtonProps & {
    icon: string
  }

Qoida: props uchun INTERFACE ishlatish tavsiya etiladi
(React ekotizimida standart). Union/intersection kerak bo'lsa — type.

═══════════════════════════════════════
  React.FC vs FUNCTION DECLARATION
═══════════════════════════════════════

  // React.FC (eski usul — TAVSIYA ETILMAYDI)
  const Button: React.FC<ButtonProps> = ({ label }) => {
    return <button>{label}</button>
  }

  // Function declaration (TAVSIYA ETILADI)
  function Button({ label }: ButtonProps) {
    return <button>{label}</button>
  }

React.FC muammolari:
  ❌ Implicit children (React 18 da olib tashlandi)
  ❌ Generic components qiyin
  ❌ defaultProps bilan ishlashda muammo
  ❌ Keraksiz abstraction

Function declaration afzalliklari:
  ✅ Oddiy va tushunarli
  ✅ Generic oson
  ✅ Hoisting (fayl ichida tartib muhim emas)
  ✅ TypeScript community standardi

═══════════════════════════════════════
  HTML ELEMENT PROPS-LARINI OLISH
═══════════════════════════════════════

Komponent HTML element-ning props-larini ham qabul qilishi kerak bo'lsa:

  // ComponentPropsWithoutRef — ref-SIZ
  interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    variant?: 'primary' | 'secondary'
  }

  // Endi onClick, disabled, className, type va boshqa
  // BARCHA button atributlari avtomatik qo'shiladi

  // ComponentPropsWithRef — ref BILAN (forwardRef uchun)
  interface InputProps extends React.ComponentPropsWithRef<'input'> {
    label: string
  }

═══════════════════════════════════════
  PROPS BEST PRACTICES
═══════════════════════════════════════

1. Optional props-ga default qiymat:
   function Card({ rounded = true }: CardProps) {}

2. Object destructuring bilan:
   function User({ name, age, email }: UserProps) {}

3. Rest props:
   function Button({ variant, ...rest }: ButtonProps) {
     return <button {...rest} className={variant} />
   }

4. Readonly (majburiy emas, lekin xavfsiz):
   interface Props { readonly items: readonly Item[] }`,
    codeExamples: [
      {
        title: 'Props tipizatsiya pattern-lari',
        language: 'tsx',
        code: `import type { ReactNode } from 'react'

// 1. Asosiy props
interface CardProps {
  title: string
  description?: string         // ixtiyoriy
  variant: 'default' | 'outlined' | 'elevated'  // union literal
  children: ReactNode
  onClose?: () => void
}

function Card({ title, description, variant = 'default', children, onClose }: CardProps) {
  return (
    <div className={\`card card--\${variant}\`}>
      <div className="card-header">
        <h3>{title}</h3>
        {onClose && <button onClick={onClose}>×</button>}
      </div>
      {description && <p>{description}</p>}
      {children}
    </div>
  )
}

// 2. HTML props-larini kengaytirish
interface InputFieldProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string
  error?: string
}

function InputField({ label, error, ...inputProps }: InputFieldProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} className={error ? 'border-red-500' : ''} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

// 3. Callback props
interface FormProps {
  onSubmit: (data: FormData) => void
  onCancel: () => void
  onChange?: (field: string, value: string) => void
}`,
        description: 'Asosiy props pattern-lari: union literal (variant), optional (?), children (ReactNode), callback, HTML props kengaytirish (ComponentPropsWithoutRef).',
      },
      {
        title: 'React.FC vs Function — farq',
        language: 'tsx',
        code: `// ❌ React.FC — eski, TAVSIYA ETILMAYDI
const BadButton: React.FC<{ label: string }> = ({ label }) => {
  return <button>{label}</button>
}

// ✅ Function declaration — TAVSIYA ETILADI
interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
}

function GoodButton({ label, variant = 'primary' }: ButtonProps) {
  return <button className={variant}>{label}</button>
}

// ✅ Arrow function ham OK (lekin hoisting yo'q)
const AlsoGoodButton = ({ label, variant = 'primary' }: ButtonProps) => {
  return <button className={variant}>{label}</button>
}

// ✅ Generic component — function declaration bilan oson
function Select<T extends { id: string; label: string }>({
  items,
  onSelect,
}: {
  items: T[]
  onSelect: (item: T) => void
}) {
  return (
    <select onChange={e => {
      const item = items.find(i => i.id === e.target.value)
      if (item) onSelect(item)
    }}>
      {items.map(item => (
        <option key={item.id} value={item.id}>{item.label}</option>
      ))}
    </select>
  )
}

// React.FC bilan generic QIYIN:
// const Select: React.FC<SelectProps<T>> = ... // T ni qayerda aniqlash?`,
        description: 'Function declaration — oddiy, generic oson, hoisting bor. React.FC — generic qiyin, keraksiz abstraction. Community standart: function declaration.',
      },
      {
        title: 'Rest props va forwardRef',
        language: 'tsx',
        code: `import { forwardRef } from 'react'

// Rest props — o'zingizning + barcha HTML props
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className,
  ...rest         // qolgan barcha button props
}: ButtonProps) {
  return (
    <button
      {...rest}   // onClick, type, form va boshqalar
      disabled={disabled || isLoading}
      className={\`btn btn-\${variant} btn-\${size} \${className ?? ''}\`}
    >
      {isLoading ? 'Yuklanmoqda...' : children}
    </button>
  )
}

// forwardRef bilan — ref uzatish kerak bo'lganda
interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, ...rest }, ref) {
    return (
      <div>
        <label>{label}</label>
        <input ref={ref} {...rest} />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    )
  }
)

// Ishlatish
function Form() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <Input ref={inputRef} label="Ism" placeholder="Ismingiz..." />
}`,
        description: 'Rest props (...rest) — o\'zingizning props-larni ajratib, qolganini HTML elementga uzatish. forwardRef<ElementType, Props> — ref tipini birinchi generic sifatida berish.',
      },
    ],
    interviewQA: [
      {
        question: 'React komponent props-larini qanday tiplashtirish kerak?',
        answer: `Interface bilan: interface ButtonProps { label: string; onClick: () => void }. Funksiya parametrida destructuring: function Button({ label, onClick }: ButtonProps). Optional props uchun ? va default qiymat: variant?: string, default = "primary". HTML element props-larini kengaytirish: extends ComponentPropsWithoutRef<"button">. Qoida: interface tavsiya etiladi (extends bilan kengaytirish), type esa union/intersection uchun.`,
      },
      {
        question: 'React.FC va oddiy function farqi nima? Qaysi biri yaxshiroq?',
        answer: `React.FC (FunctionComponent) — eski pattern. Muammolari: React 17 da implicit children qo'shardi (kerak bo'lmasa ham), generic component qiyin, defaultProps bilan muammo, keraksiz abstraction. Oddiy function declaration afzalliklari: sodda, generic oson (<T>), hoisting bor, TypeScript community standardi. Hozirgi tavsiya: DOIM function declaration yoki arrow function ishlatish, React.FC ishlatMASLIK.`,
      },
      {
        question: 'ComponentPropsWithoutRef va ComponentPropsWithRef farqi nima?',
        answer: `ComponentPropsWithoutRef<"button"> — button element-ning BARCHA HTML atributlarini tip sifatida beradi (onClick, disabled, type, className...), lekin ref YO'Q. Oddiy komponentlar uchun. ComponentPropsWithRef<"input"> — barcha atributlar + ref. forwardRef bilan ishlaydi. Qachon qaysi: oddiy komponent (ref kerak emas) → WithoutRef. forwardRef ishlatgan komponent → WithRef yoki forwardRef<HTMLElement, Props> pattern.`,
      },
      {
        question: 'Props-da interface va type farqi nima?',
        answer: `Interface: extends bilan kengaytirish oson, declaration merging (bir xil nom — birlashadi), React ekotizimida standart. Type: union (A | B), intersection (A & B), mapped types, conditional types — kuchliroq tiplar uchun. Amalda: oddiy props → interface, discriminated union → type, utility type → type. Ko'p hollarda ikkalasi bir xil natija beradi — jamoadagi convention ga amal qilish muhim.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'typescript-react', topicId: 'children-types', label: 'Children tiplar' },
      { sectionId: 'typescript-react', topicId: 'discriminated-unions', label: 'Discriminated Unions' },
      { sectionId: 'typescript-react', topicId: 'generic-components', label: 'Generic Components' },
    ],
  },
  {
    id: 'generic-components',
    title: 'Generic Components',
    importance: 3,
    status: 'to-learn',
    description: '<Select<T>> — generik komponentlar',
    content: `Generic Components — TypeScript generics bilan ishlaydi komponentlar. Bir xil komponent turli xil data tiplari bilan ishlaydi, lekin tip xavfsizligini saqlaydi.

═══════════════════════════════════════
  MUAMMO: TIP YO'QOLISHI
═══════════════════════════════════════

  // any bilan — tip xavfsizligi YO'Q
  function List({ items, onSelect }: { items: any[]; onSelect: (item: any) => void }) {}

  <List items={users} onSelect={(item) => {
    item.name  // ❌ TypeScript bilmaydi item nima
  }} />

Generic bilan:
  function List<T>({ items, onSelect }: { items: T[]; onSelect: (item: T) => void }) {}

  <List items={users} onSelect={(item) => {
    item.name  // ✅ TypeScript biladi item = User
  }} />

═══════════════════════════════════════
  GENERIC COMPONENT YARATISH
═══════════════════════════════════════

  function Select<T>({ items, renderItem, onSelect }: {
    items: T[]
    renderItem: (item: T) => string
    onSelect: (item: T) => void
  }) {
    return (
      <select onChange={e => {
        const item = items[Number(e.target.value)]
        onSelect(item)
      }}>
        {items.map((item, i) => (
          <option key={i} value={i}>{renderItem(item)}</option>
        ))}
      </select>
    )
  }

TypeScript T ni AVTOMATIK aniqlaydi (type inference):
  <Select
    items={users}              // T = User (avtomatik)
    renderItem={u => u.name}   // u: User
    onSelect={u => console.log(u.email)}  // u: User
  />

═══════════════════════════════════════
  GENERIC CONSTRAINTS
═══════════════════════════════════════

T ga cheklov qo'yish — "T kamida shu property-larga ega bo'lishi kerak":

  function List<T extends { id: string }>({ items }: { items: T[] }) {
    return items.map(item => (
      <div key={item.id}>{/* item.id DOIM bor */}</div>
    ))
  }

  <List items={users} />    // ✅ User-da id bor
  <List items={numbers} />  // ❌ number-da id yo'q

Ko'p ishlatiladigan constraint-lar:
  T extends { id: string }           — id bo'lishi kerak
  T extends { id: string; label: string }  — id va label
  T extends string | number          — faqat primitive
  T extends Record<string, unknown>  — har qanday object

═══════════════════════════════════════
  ARROW FUNCTION GENERIC
═══════════════════════════════════════

TSX faylda arrow function generic muammo:
  // ❌ <T> JSX tag deb o'ylaydi
  const List = <T>(props: Props<T>) => { ... }

  // ✅ YECHIM 1: extends qo'shish
  const List = <T extends unknown>(props: Props<T>) => { ... }

  // ✅ YECHIM 2: function declaration (eng oddiy)
  function List<T>(props: Props<T>) { ... }

═══════════════════════════════════════
  REAL-WORLD MISOLLAR
═══════════════════════════════════════

Generic kerak bo'ladigan komponentlar:
  - Select/Dropdown — har xil data
  - Table — har xil ustunlar va qatorlar
  - List — har xil elementlar
  - Form — har xil maydonlar
  - Modal — har xil content props
  - Autocomplete — har xil natijalar`,
    codeExamples: [
      {
        title: 'Generic Select komponent',
        language: 'tsx',
        code: `interface SelectProps<T> {
  items: T[]
  value: T | null
  getLabel: (item: T) => string
  getKey: (item: T) => string
  onChange: (item: T) => void
  placeholder?: string
}

function Select<T>({
  items,
  value,
  getLabel,
  getKey,
  onChange,
  placeholder = 'Tanlang...',
}: SelectProps<T>) {
  return (
    <select
      value={value ? getKey(value) : ''}
      onChange={e => {
        const item = items.find(i => getKey(i) === e.target.value)
        if (item) onChange(item)
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {items.map(item => (
        <option key={getKey(item)} value={getKey(item)}>
          {getLabel(item)}
        </option>
      ))}
    </select>
  )
}

// Ishlatish — T avtomatik aniqlanadi
interface User { id: string; name: string; role: string }
interface City { code: string; title: string }

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [city, setCity] = useState<City | null>(null)

  return (
    <>
      {/* T = User */}
      <Select
        items={users}
        value={user}
        getLabel={u => u.name}
        getKey={u => u.id}
        onChange={setUser}
      />

      {/* T = City */}
      <Select
        items={cities}
        value={city}
        getLabel={c => c.title}
        getKey={c => c.code}
        onChange={setCity}
      />
    </>
  )
}`,
        description: 'Generic Select — bir komponent User, City, va har qanday tip bilan ishlaydi. getLabel/getKey callback-lar orqali har xil data strukturaga moslashadi. T avtomatik aniqlanadi.',
      },
      {
        title: 'Generic Table komponent',
        language: 'tsx',
        code: `interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

interface TableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
}

function Table<T extends { id: string }>({
  data,
  columns,
  onRowClick,
}: TableProps<T>) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={String(col.key)} className="text-left p-2 border-b font-medium">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
          >
            {columns.map(col => (
              <td key={String(col.key)} className="p-2 border-b">
                {col.render
                  ? col.render(item[col.key], item)
                  : String(item[col.key])
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Ishlatish
interface Product {
  id: string
  name: string
  price: number
  inStock: boolean
}

const columns: Column<Product>[] = [
  { key: 'name', header: 'Nomi' },
  { key: 'price', header: 'Narxi', render: (v) => \`\${v} so'm\` },
  { key: 'inStock', header: 'Mavjud', render: (v) => v ? '✅' : '❌' },
]

<Table data={products} columns={columns} onRowClick={p => navigate(\`/products/\${p.id}\`)} />`,
        description: 'Generic Table — Column<T> bilan keyof T orqali faqat mavjud property-larni tanlash mumkin. render callback — custom ko\'rinish. T extends {id: string} — id majburiy.',
      },
    ],
    interviewQA: [
      {
        question: 'Generic component nima va nima uchun kerak?',
        answer: `Generic component — TypeScript generics (<T>) bilan turli xil data tiplari bilan ishlaydigan komponent. Muammo: any ishlatsa tip xavfsizligi yo'qoladi. Generic bilan: Select<User>, Select<City> — bir komponent turli tiplar bilan ishlaydi, lekin TypeScript hamma joyda to'g'ri tipni biladi. T ko'pincha avtomatik aniqlanadi (type inference) — qo'lda yozish shart emas. Misol: List<T>, Table<T>, Select<T>.`,
      },
      {
        question: 'Generic constraint nima? T extends nima qiladi?',
        answer: `Generic constraint — T ga cheklov qo'yish. T extends {id: string} deganda — T kamida id: string property-ga ega bo'lishi kerak. Chunki komponent ichida item.id ishlatilsa, TypeScript id mavjudligini bilishi kerak. Constraint-siz T har narsa bo'lishi mumkin va hech qanday property-ni ishlatib bo'lmaydi. Keng tarqalgan: T extends {id: string; label: string}, T extends Record<string, unknown>, T extends string | number.`,
      },
      {
        question: 'TSX faylda arrow function generic muammosi nima?',
        answer: `TSX faylda <T> JSX opening tag deb tushuniladi: const List = <T>(props) => {} — TypeScript <T> ni JSX tag deb xato beradi. Yechimlar: 1) extends qo'shish: <T extends unknown> — endi JSX tag emas, generic, 2) Function declaration ishlatish: function List<T>() {} — muammo yo'q, 3) Trailing comma: <T,>(props) => {} — ba'zi bundler-larda ishlaydi. Eng oddiy yechim — function declaration.`,
      },
      {
        question: 'keyof T nima va generic-da qanday ishlatiladi?',
        answer: `keyof T — T tipining barcha property nomlarini union sifatida qaytaradi. Masalan: keyof User = "id" | "name" | "email". Generic component-da: Column<T> = {key: keyof T} — faqat T-ning haqiqiy property-lari ishlatilishi mumkin. Noto'g'ri property yozsangiz — TypeScript xato beradi. Table<Product> da column key faqat "id" | "name" | "price" bo'lishi mumkin — bu tip xavfsizligi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'polymorphic-components', label: 'Polymorphic Components' },
      { sectionId: 'typescript-react', topicId: 'utility-types', label: 'Utility Types' },
    ],
  },
  {
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
      { sectionId: 'react-core', topicId: 'event-system', label: 'React Event System' },
      { sectionId: 'component-patterns', topicId: 'controlled-vs-uncontrolled', label: 'Controlled Components' },
    ],
  },
  {
    id: 'children-types',
    title: 'Children Types',
    importance: 2,
    status: 'to-learn',
    description: 'ReactNode, ReactElement, PropsWithChildren',
    content: `React-da children-ning turli xil tiplari bor. To'g'ri tipni tanlash — komponent nimani qabul qilishini aniq belgilaydi.

═══════════════════════════════════════
  CHILDREN TIPLARI
═══════════════════════════════════════

ReactNode — ENG KENG tip (ko'pincha shu kerak):
  string | number | boolean | null | undefined | ReactElement | ReactFragment
  Deyarli HAR NARSA bo'lishi mumkin

ReactElement — faqat JSX element:
  <div>...</div>, <Component />, React.createElement(...)
  string, number, null EMAS

JSX.Element — ReactElement bilan deyarli bir xil:
  JSX.Element = ReactElement<any, any>

string | number — faqat matn/raqam

═══════════════════════════════════════
  QACHON QAYSI BIR
═══════════════════════════════════════

ReactNode — ko'p hollarda (eng keng, eng moslashuvchan):
  function Card({ children }: { children: ReactNode }) {}
  // <Card>Matn</Card>
  // <Card><p>Element</p></Card>
  // <Card>{null}</Card>
  // <Card>{condition && <Component />}</Card>

ReactElement — faqat JSX element kerak bo'lganda:
  function Layout({ header }: { header: ReactElement }) {}
  // <Layout header={<Header />} />  ✅
  // <Layout header="text" />  ❌ string emas

Render prop (funksiya):
  function DataProvider({ children }: { children: (data: Data) => ReactNode }) {}
  // <DataProvider>{(data) => <Display data={data} />}</DataProvider>

═══════════════════════════════════════
  PropsWithChildren
═══════════════════════════════════════

  // Qo'lda
  interface CardProps {
    title: string
    children: ReactNode
  }

  // Utility type bilan
  type CardProps = PropsWithChildren<{
    title: string
  }>
  // Natija: { title: string; children?: ReactNode }

DIQQAT: PropsWithChildren da children OPTIONAL (?).
Agar children majburiy bo'lsa — qo'lda yozing.

═══════════════════════════════════════
  React 18+ O'ZGARISHLAR
═══════════════════════════════════════

React 18 dan oldin React.FC avtomatik children qo'shardi:
  const Card: React.FC = ({ children }) => ...  // implicit children

React 18+: children EXPLICIT bo'lishi kerak:
  function Card({ children }: { children: ReactNode }) {}
  // Yoki PropsWithChildren ishlatish

Bu YAXSHI o'zgarish — chunki har komponent children
qabul qilishi kerak emas (masalan <Input />).`,
    codeExamples: [
      {
        title: 'Children tip pattern-lari',
        language: 'tsx',
        code: `import type { ReactNode, ReactElement } from 'react'

// 1. ReactNode — eng keng (ko'pincha shu kerak)
interface CardProps {
  title: string
  children: ReactNode  // string, element, null, array — HAR NARSA
}

function Card({ title, children }: CardProps) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-bold">{title}</h3>
      <div>{children}</div>
    </div>
  )
}

// Ishlatish
<Card title="Test">
  <p>Matn</p>         {/* ✅ element */}
  Oddiy matn          {/* ✅ string */}
  {42}                 {/* ✅ number */}
  {null}               {/* ✅ null */}
  {show && <Alert />}  {/* ✅ conditional */}
</Card>

// 2. ReactElement — faqat JSX element
interface LayoutProps {
  header: ReactElement    // faqat <Component /> yoki <div>...</div>
  sidebar?: ReactElement
  children: ReactNode
}

function Layout({ header, sidebar, children }: LayoutProps) {
  return (
    <div>
      <header>{header}</header>
      {sidebar && <aside>{sidebar}</aside>}
      <main>{children}</main>
    </div>
  )
}

<Layout header={<Header />} sidebar={<Sidebar />}>
  <Content />
</Layout>

// 3. Render prop — funksiya sifatida children
interface DataListProps<T> {
  items: T[]
  children: (item: T, index: number) => ReactNode
}

function DataList<T>({ items, children }: DataListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{children(item, i)}</li>)}</ul>
}

<DataList items={users}>
  {(user, i) => <span>{i + 1}. {user.name}</span>}
</DataList>`,
        description: 'ReactNode — har narsa (string, element, null). ReactElement — faqat JSX. Render prop — children funksiya sifatida, generic T bilan tiplanadi.',
      },
    ],
    interviewQA: [
      {
        question: 'ReactNode, ReactElement, JSX.Element farqi nima?',
        answer: `ReactNode — eng keng tip: string, number, boolean, null, undefined, ReactElement, fragment, array. Deyarli har narsa. Ko'pincha children uchun shu ishlatiladi. ReactElement — faqat JSX element: <div>, <Component />. string yoki null emas. Render natijasi tiplashtirish uchun. JSX.Element — ReactElement<any, any> bilan deyarli bir xil, lekin TypeScript JSX infrastrukturasi tomonidan ishlatiladi. Amalda: children uchun ReactNode, faqat element kerak bo'lsa ReactElement.`,
      },
      {
        question: 'PropsWithChildren nima va qachon ishlatish kerak?',
        answer: `PropsWithChildren<P> — utility tip: P & { children?: ReactNode }. Children-ni qo'lda yozmaslik uchun: type CardProps = PropsWithChildren<{title: string}>. LEKIN children OPTIONAL bo'ladi (?). Agar children majburiy bo'lsa — qo'lda yozing: { children: ReactNode }. React 18 da React.FC implicit children olib tashlandi — endi har doim explicit yozish kerak. PropsWithChildren qulaylik uchun, lekin qo'lda yozish aniqroq.`,
      },
      {
        question: 'React 18 da children tipizatsiyasi nima o\'zgardi?',
        answer: `React 18 dan oldin: React.FC avtomatik children: ReactNode qo'shardi — har komponent children qabul qilardi (kerak bo'lmasa ham). React 18+: children explicit bo'lishi kerak — qo'lda yozish shart. Bu yaxshi o'zgarish: <Input children={<div/>} /> kabi xatolar oldini oladi. Endi faqat haqiqatan children kerak bo'lgan komponentlarga qo'shiladi. React.FC ishlatmaslik yana bir sabab — eski versiyada implicit children muammosi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'children-api', label: 'Children API' },
      { sectionId: 'component-patterns', topicId: 'composition-vs-inheritance', label: 'Composition' },
    ],
  },
  {
    id: 'discriminated-unions',
    title: 'Discriminated Unions',
    importance: 3,
    status: 'to-learn',
    description: 'Props-da variant pattern',
    content: `Discriminated Unions — TypeScript-ning eng kuchli pattern-laridan biri. Komponent props-larini "variant" bo'yicha farqlash imkonini beradi. Noto'g'ri kombinatsiyalarni KOMPILYATSIYA vaqtida oldini oladi.

═══════════════════════════════════════
  MUAMMO: NOTO'G'RI KOMBINATSIYA
═══════════════════════════════════════

  // ❌ Yomon — isLoading va error BIR VAQTDA bo'lishi mumkin
  interface RequestState {
    isLoading: boolean
    error: string | null
    data: User[] | null
  }

  // Mantiqan noto'g'ri holatlar mumkin:
  // { isLoading: true, error: "xato", data: [user1] }
  // Bu HECH QACHON bo'lmasligi kerak!

Discriminated union bilan — faqat TO'G'RI holatlar mumkin:

  type RequestState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'error'; error: string }
    | { status: 'success'; data: User[] }

  // { status: 'loading', data: [...] } — ❌ TypeScript XATO beradi!
  // { status: 'error' } — ❌ error property kerak!

═══════════════════════════════════════
  QANDAY ISHLAYDI
═══════════════════════════════════════

"Discriminant" — umumiy property (odatda status, type, variant):

  type Shape =
    | { type: 'circle'; radius: number }
    | { type: 'square'; side: number }
    | { type: 'rectangle'; width: number; height: number }

TypeScript discriminant (type) asosida QAYSI variant ekanini biladi:

  function area(shape: Shape): number {
    switch (shape.type) {
      case 'circle':
        return Math.PI * shape.radius ** 2  // radius MAVJUD
      case 'square':
        return shape.side ** 2              // side MAVJUD
      case 'rectangle':
        return shape.width * shape.height   // width, height MAVJUD
    }
  }

═══════════════════════════════════════
  PROPS-DA ISHLATISH
═══════════════════════════════════════

  type AlertProps =
    | { variant: 'info'; message: string }
    | { variant: 'error'; message: string; onRetry: () => void }
    | { variant: 'success'; message: string; autoClose?: number }

  // variant='error' bo'lsa — onRetry MAJBURIY
  // variant='info' bo'lsa — onRetry MUMKIN EMAS

  function Alert(props: AlertProps) {
    switch (props.variant) {
      case 'error':
        return (
          <div className="bg-red-100">
            {props.message}
            <button onClick={props.onRetry}>Qayta urinish</button>
          </div>
        )
      case 'success':
        return <div className="bg-green-100">{props.message}</div>
      case 'info':
        return <div className="bg-blue-100">{props.message}</div>
    }
  }

═══════════════════════════════════════
  EXHAUSTIVENESS CHECK
═══════════════════════════════════════

never tipi bilan barcha holatlar ko'rib chiqilganini tekshirish:

  function assertNever(x: never): never {
    throw new Error('Unexpected: ' + x)
  }

  switch (shape.type) {
    case 'circle': ...
    case 'square': ...
    // 'rectangle' UNUTILGAN!
    default:
      assertNever(shape)
      // ❌ TypeScript XATO: Type 'rectangle' is not assignable to 'never'
  }

Yangi variant qo'shilsa — barcha switch-larda xato paydo bo'ladi.
Hech bir holatni unutish MUMKIN EMAS.`,
    codeExamples: [
      {
        title: 'Component props bilan discriminated union',
        language: 'tsx',
        code: `// Button — variant bo'yicha farqli props
type ButtonProps =
  | {
      variant: 'button'
      onClick: () => void
      type?: 'button' | 'submit'
    }
  | {
      variant: 'link'
      href: string
      target?: '_blank' | '_self'
    }

function Button(props: ButtonProps) {
  if (props.variant === 'link') {
    return (
      <a href={props.href} target={props.target} className="btn">
        Link
      </a>
    )
  }

  return (
    <button onClick={props.onClick} type={props.type} className="btn">
      Button
    </button>
  )
}

// Ishlatish
<Button variant="link" href="/about" />           // ✅
<Button variant="button" onClick={() => {}} />     // ✅
<Button variant="link" onClick={() => {}} />       // ❌ link da onClick yo'q!
<Button variant="button" href="/about" />          // ❌ button da href yo'q!

// Modal — turli xil content
type ModalProps =
  | { type: 'confirm'; title: string; onConfirm: () => void; onCancel: () => void }
  | { type: 'alert'; title: string; message: string; onClose: () => void }
  | { type: 'form'; title: string; children: React.ReactNode; onSubmit: (data: FormData) => void }

function Modal(props: ModalProps) {
  switch (props.type) {
    case 'confirm':
      return (
        <div>
          <h2>{props.title}</h2>
          <button onClick={props.onConfirm}>Ha</button>
          <button onClick={props.onCancel}>Yo'q</button>
        </div>
      )
    case 'alert':
      return (
        <div>
          <h2>{props.title}</h2>
          <p>{props.message}</p>
          <button onClick={props.onClose}>OK</button>
        </div>
      )
    case 'form':
      return (
        <form onSubmit={e => { e.preventDefault(); props.onSubmit(new FormData(e.currentTarget)) }}>
          <h2>{props.title}</h2>
          {props.children}
          <button type="submit">Yuborish</button>
        </form>
      )
  }
}`,
        description: 'Discriminated union — variant/type bo\'yicha farqli props. TypeScript noto\'g\'ri kombinatsiyani KOMPILYATSIYA vaqtida ushlaydi. link da onClick, button da href — xato.',
      },
      {
        title: 'API response — exhaustiveness check',
        language: 'tsx',
        code: `// API holati — faqat TO'G'RI kombinatsiyalar
type ApiState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string; retryCount: number }
  | { status: 'success'; data: T; updatedAt: Date }

// Exhaustiveness check helper
function assertNever(x: never): never {
  throw new Error(\`Unexpected state: \${JSON.stringify(x)}\`)
}

// Komponent — barcha holatlar ko'rib chiqiladi
function UserList() {
  const [state, setState] = useState<ApiState<User[]>>({ status: 'idle' })

  // switch — barcha holatlar
  switch (state.status) {
    case 'idle':
      return <button onClick={fetchUsers}>Yuklash</button>

    case 'loading':
      return <p>Yuklanmoqda...</p>

    case 'error':
      return (
        <div>
          <p className="text-red-500">Xato: {state.error}</p>
          <p>Urinishlar: {state.retryCount}</p>
          <button onClick={fetchUsers}>Qayta urinish</button>
        </div>
      )

    case 'success':
      return (
        <div>
          <p className="text-gray-500">
            Yangilangan: {state.data.length} ta, {state.updatedAt.toLocaleString()}
          </p>
          <ul>
            {state.data.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      )

    default:
      // Yangi status qo'shilsa — SHU YERDA XATO BERADI
      return assertNever(state)
  }
}`,
        description: 'ApiState<T> — faqat to\'g\'ri holatlar: idle (hech narsa), loading (data yo\'q), error (error bor), success (data bor). assertNever — yangi holat qo\'shilsa xato beradi.',
      },
    ],
    interviewQA: [
      {
        question: 'Discriminated Union nima va React-da qanday ishlatiladi?',
        answer: `Discriminated Union — umumiy discriminant property (type, status, variant) bo'yicha farqlanadigan tip birlashmasi. React-da: komponent props-larini variant bo'yicha farqlash. Masalan: Button variant="link" → href kerak, variant="button" → onClick kerak. TypeScript noto'g'ri kombinatsiyani KOMPILYATSIYA vaqtida ushlaydi. switch/if bilan discriminant tekshirilganda TypeScript qolgan property-larni avtomatik aniqlaydi (type narrowing).`,
      },
      {
        question: 'Exhaustiveness check nima va nima uchun kerak?',
        answer: `Exhaustiveness check — switch-da BARCHA holatlar ko'rib chiqilganini tekshirish. never tipiga assign qilish bilan: default: assertNever(value). Agar biror holat qolsa — TypeScript "Type X is not assignable to never" xatosi beradi. Nima uchun kerak: yangi variant/status qo'shilganda barcha switch/if-larda XATO paydo bo'ladi — hech bir joyda yangi holatni ko'rib chiqishni UNUTIB BO'LMAYDI. Bu katta loyihalarda juda muhim.`,
      },
      {
        question: 'Boolean flag-lar vs discriminated union — qaysi yaxshiroq?',
        answer: `Boolean flag-lar muammo: { isLoading: boolean; error: string | null; data: User[] | null } — mantiqan noto'g'ri holatlar mumkin (isLoading=true va error="xato" bir vaqtda). Discriminated union: { status: "loading" } | { status: "error"; error: string } — faqat to'g'ri holatlar mumkin. Afzalliklari: 1) impossible states impossible, 2) TypeScript auto-complete yaxshiroq, 3) switch bilan oson ishlov berish. Kamchiligi: ko'proq kod yozish. Lekin xavfsizlik muhimroq.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'typescript-react', topicId: 'props-typing', label: 'Props Typing' },
      { sectionId: 'component-patterns', topicId: 'polymorphic-components', label: 'Polymorphic Components' },
    ],
  },
  {
    id: 'utility-types',
    title: 'Utility Types',
    importance: 2,
    status: 'to-learn',
    description: 'Omit, Pick, Partial, Record, ReturnType',
    content: `TypeScript utility types — mavjud tiplardan yangi tiplar yaratish uchun. React-da props transformatsiyasi uchun juda ko'p ishlatiladi.

═══════════════════════════════════════
  ENG KO'P ISHLATILADIGAN UTILITY TYPES
═══════════════════════════════════════

Partial<T> — barcha property-larni OPTIONAL qiladi:
  Partial<User> = { id?: string; name?: string; email?: string }
  Ishlatish: update funksiyalar, default props

Required<T> — barcha property-larni MAJBURIY qiladi:
  Required<Partial<User>> = { id: string; name: string; email: string }

Pick<T, K> — faqat TANLANGAN property-lar:
  Pick<User, 'id' | 'name'> = { id: string; name: string }
  Ishlatish: sub-set props

Omit<T, K> — tanlangan property-larni OLIB TASHLASH:
  Omit<User, 'password'> = { id: string; name: string; email: string }
  Ishlatish: maxfiy maydonlarni olib tashlash

Record<K, V> — kalit-qiymat mapping:
  Record<string, number> = { [key: string]: number }
  Record<'sm' | 'md' | 'lg', string> = { sm: string; md: string; lg: string }

ReturnType<T> — funksiya qaytargan tipni olish:
  ReturnType<typeof fetchUsers> = Promise<User[]>

Parameters<T> — funksiya parametrlari tipini olish:
  Parameters<typeof fn> = [string, number]

Exclude<T, U> — union-dan tiplarni CHIQARISH:
  Exclude<'a' | 'b' | 'c', 'a'> = 'b' | 'c'

Extract<T, U> — union-dan tiplarni OLISH:
  Extract<'a' | 'b' | 'c', 'a' | 'b'> = 'a' | 'b'

NonNullable<T> — null va undefined ni olib tashlash:
  NonNullable<string | null | undefined> = string

═══════════════════════════════════════
  REACT-DA ISHLATISH
═══════════════════════════════════════

1. Props transformatsiyasi:
   // UserForm — id kerak emas (yangi user yaratish)
   type CreateUserProps = Omit<User, 'id'>

   // UserCard — faqat ko'rsatish uchun kerakli maydonlar
   type UserCardProps = Pick<User, 'name' | 'avatar'>

2. Partial update:
   // Faqat o'zgargan maydonlarni yuborish
   function updateUser(id: string, data: Partial<User>) {}
   updateUser('123', { name: 'Ali' })  // faqat name

3. Component variant-lari:
   type Size = 'sm' | 'md' | 'lg'
   const sizeMap: Record<Size, string> = {
     sm: 'text-sm px-2',
     md: 'text-base px-4',
     lg: 'text-lg px-6',
   }

4. Store tiplari:
   type RootState = ReturnType<typeof store.getState>
   type AppDispatch = typeof store.dispatch`,
    codeExamples: [
      {
        title: 'React props bilan utility types',
        language: 'tsx',
        code: `interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: Date
}

// Omit — maxfiy maydonni olib tashlash
type PublicUser = Omit<User, 'password'>

// Pick — faqat kerakli maydonlar
type UserPreview = Pick<User, 'id' | 'name'>

// Partial — update uchun (barcha ixtiyoriy)
type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>>
// { name?: string; email?: string; password?: string; role?: 'admin' | 'user' }

// Komponentlarda ishlatish
function UserCard({ id, name }: UserPreview) {
  return <div><span>{name}</span></div>
}

function UserProfile({ name, email, role, createdAt }: PublicUser) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <p>Rol: {role}</p>
      <p>Yaratilgan: {createdAt.toLocaleDateString()}</p>
    </div>
  )
}

function EditUserForm({ userId }: { userId: string }) {
  async function handleSubmit(data: UserUpdate) {
    await fetch(\`/api/users/\${userId}\`, {
      method: 'PATCH',
      body: JSON.stringify(data),  // faqat o'zgargan maydonlar
    })
  }

  return <form onSubmit={/* ... */}>...</form>
}

// Record — variant mapping
type ButtonVariant = 'primary' | 'secondary' | 'danger'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-gray-200 text-gray-800',
  danger: 'bg-red-500 text-white',
}

function Button({ variant = 'primary' }: { variant?: ButtonVariant }) {
  return <button className={variantStyles[variant]}>Click</button>
}`,
        description: 'Omit (olib tashlash), Pick (tanlash), Partial (ixtiyoriy), Record (mapping). Bitta User interfeysi-dan turli kontekstlar uchun yangi tiplar yaratish.',
      },
      {
        title: 'ReturnType, Parameters, Extract',
        language: 'tsx',
        code: `import { configureStore } from '@reduxjs/toolkit'

// ReturnType — funksiya qaytargan tipni olish
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email, createdAt: new Date() }
}

type NewUser = ReturnType<typeof createUser>
// { id: string; name: string; email: string; createdAt: Date }

// Store tiplari — Redux pattern
const store = configureStore({ reducer: { /* ... */ } })
type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

// Parameters — funksiya parametrlarini olish
type CreateUserParams = Parameters<typeof createUser>
// [string, string]

// Extract va Exclude — union filterlash
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ReadMethod = Extract<HttpMethod, 'GET'>           // 'GET'
type WriteMethod = Exclude<HttpMethod, 'GET'>           // 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// NonNullable — null/undefined olib tashlash
type MaybeUser = User | null | undefined
type DefiniteUser = NonNullable<MaybeUser>  // User

// Amalda
function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null)

  // NonNullable guard
  function requireUser(): NonNullable<typeof user> {
    if (!user) throw new Error('User not found')
    return user
  }

  return { user, requireUser }
}`,
        description: 'ReturnType — funksiya qaytargan tip (Redux store.getState). Extract/Exclude — union filterlash. NonNullable — null olib tashlash. Parameters — funksiya argumentlari tipi.',
      },
    ],
    interviewQA: [
      {
        question: 'Partial, Pick, Omit qanday ishlaydi va qachon ishlatiladi?',
        answer: `Partial<T> — barcha property-larni optional (?) qiladi. Ishlatish: update funksiyalar (faqat o'zgargan maydonlar). Pick<T, K> — faqat tanlangan property-larni oladi. Ishlatish: sub-set props, komponentga faqat kerakli maydonlar. Omit<T, K> — tanlangan property-larni olib tashlaydi. Ishlatish: password olib tashlash, id olib tashlash (create uchun). Bularni birlashtirish mumkin: Partial<Omit<User, "id">> — id-siz, barcha ixtiyoriy.`,
      },
      {
        question: 'Record nima va React-da qanday ishlatiladi?',
        answer: `Record<K, V> — kalit-qiymat mapping tipi. K — kalit tiplari, V — qiymat tipi. React-da: variant mapping (Record<ButtonVariant, string> — har variant uchun CSS class), lookup objects (Record<string, ComponentType>), form state (Record<string, string>). Afzalligi: barcha kalitlar MAJBURIY — biror variant unutilsa TypeScript xato beradi. Masalan: Record<"sm"|"md"|"lg", string> — uchovi ham yozilishi KERAK.`,
      },
      {
        question: 'ReturnType nima uchun kerak?',
        answer: `ReturnType<typeof fn> — funksiya qaytargan tipni chiqarib oladi. Nima uchun kerak: 1) Redux — type RootState = ReturnType<typeof store.getState>, 2) Custom hook qaytargan tip: ReturnType<typeof useAuth>, 3) Factory funksiya natijasi. typeof bilan birga ishlatiladi — avval o'zgaruvchidan tip olinadi, keyin ReturnType qo'llanadi. Bu DRY prinsipi — tipni bir joyda aniqlash, boshqa joylarda chiqarib olish.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'typescript-react', topicId: 'generic-components', label: 'Generic Components' },
      { sectionId: 'typescript-react', topicId: 'props-typing', label: 'Props Typing' },
    ],
  },
  {
    id: 'as-const-satisfies',
    title: 'as const, satisfies',
    importance: 2,
    status: 'to-learn',
    description: 'TypeScript 5 features',
    content: `as const va satisfies — TypeScript-ning kuchli tip daraqalash (narrowing) vositalari. React konfiguratsiyalar va route-larda juda foydali.

═══════════════════════════════════════
  as const — LITERAL TIPGA AYLANTIRISH
═══════════════════════════════════════

Oddiy:
  const colors = ['red', 'green', 'blue']
  // tip: string[] — har qanday string bo'lishi mumkin

as const bilan:
  const colors = ['red', 'green', 'blue'] as const
  // tip: readonly ['red', 'green', 'blue'] — FAQAT shu 3 ta

Farq:
  const config = { api: '/api', timeout: 3000 }
  // tip: { api: string; timeout: number }

  const config = { api: '/api', timeout: 3000 } as const
  // tip: { readonly api: '/api'; readonly timeout: 3000 }
  // Qiymatlar ANIQ va O'ZGARMAS

as const beradi:
  ✅ Literal types (string → 'exact-string')
  ✅ readonly (o'zgartirish mumkin emas)
  ✅ Tuple (array → exact tuple)

═══════════════════════════════════════
  as const ISHLATISH HOLATLARI
═══════════════════════════════════════

1. Route konfiguratsiya:
   const ROUTES = {
     home: '/',
     about: '/about',
     user: '/users/:id',
   } as const
   // ROUTES.home tipi '/' (string emas)

2. Action types:
   const ACTIONS = {
     add: 'TODO_ADD',
     remove: 'TODO_REMOVE',
   } as const

3. Variant array:
   const sizes = ['sm', 'md', 'lg'] as const
   type Size = typeof sizes[number]  // 'sm' | 'md' | 'lg'

═══════════════════════════════════════
  satisfies — TIPNI TEKSHIRISH + ANIQLASH
═══════════════════════════════════════

satisfies operator — qiymat berilgan TIPGA mos kelishini tekshiradi,
LEKIN aniqroq tipni SAQLAB QOLADI.

Muammo:
  type Colors = Record<string, [number, number, number]>

  // Variant 1: type annotation
  const colors: Colors = { red: [255, 0, 0], green: [0, 255, 0] }
  colors.red  // [number, number, number] — 'red' kaliti yo'qoldi

  // Variant 2: as const
  const colors = { red: [255, 0, 0], green: [0, 255, 0] } as const
  // Tip to'g'ri, lekin Colors ga mos kelishini TEKSHIRMAYDI

  // ✅ satisfies — IKKALASI: tekshirish + aniq tip
  const colors = {
    red: [255, 0, 0],
    green: [0, 255, 0],
  } satisfies Colors
  colors.red  // [number, number, number] — LEKIN 'red' kaliti saqlanadi!

═══════════════════════════════════════
  satisfies + as const
═══════════════════════════════════════

Eng kuchli kombinatsiya — IKKALASINI BIRGA:

  const config = {
    api: '/api',
    timeout: 3000,
    retries: 3,
  } as const satisfies Record<string, string | number>

  // 1. as const — qiymatlar literal: '/api', 3000, 3
  // 2. satisfies — Record<string, string | number> ga MOS kelishini tekshiradi
  // 3. Aniq tip saqlanadi: config.api = '/api' (string emas)`,
    codeExamples: [
      {
        title: 'as const — route va config',
        language: 'tsx',
        code: `// 1. Route paths
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  user: '/users/:id',
  settings: '/settings',
} as const

type RoutePath = typeof ROUTES[keyof typeof ROUTES]
// '/' | '/dashboard' | '/users/:id' | '/settings'

function navigate(path: RoutePath) { /* ... */ }
navigate(ROUTES.dashboard)  // ✅ '/dashboard'
navigate('/random')          // ❌ bu path yo'q!

// 2. Union type array-dan
const STATUSES = ['idle', 'loading', 'success', 'error'] as const
type Status = typeof STATUSES[number]  // 'idle' | 'loading' | 'success' | 'error'

// Select komponentda ishlatish
function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as Status)}>
      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}

// 3. Event map
const EVENT_NAMES = {
  userCreated: 'USER_CREATED',
  userDeleted: 'USER_DELETED',
  orderPlaced: 'ORDER_PLACED',
} as const

type EventName = typeof EVENT_NAMES[keyof typeof EVENT_NAMES]
// 'USER_CREATED' | 'USER_DELETED' | 'ORDER_PLACED'`,
        description: 'as const — route paths, status-lar, event nomlari. typeof + keyof bilan union type yaratish. string emas, ANIQ qiymatlar — xato qilish mumkin emas.',
      },
      {
        title: 'satisfies — tip tekshirish + aniq tip',
        language: 'tsx',
        code: `// Theme config — satisfies bilan
interface ThemeConfig {
  colors: Record<string, string>
  spacing: Record<string, number>
  fonts: Record<string, string>
}

const theme = {
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    danger: '#EF4444',
  },
  spacing: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Poppins, sans-serif',
  },
} satisfies ThemeConfig

// ✅ ThemeConfig ga mos kelishini TEKSHIRDI
// ✅ Aniq kalitlar saqlanadi:
theme.colors.primary    // ✅ autocomplete ishlaydi
theme.colors.unknown    // ❌ xato — 'unknown' yo'q

// as const satisfies — eng kuchli
const routes = {
  home: '/',
  about: '/about',
  contact: '/contact',
} as const satisfies Record<string, string>

// 1. Record<string, string> ga mos — ✅ tekshirildi
// 2. Qiymatlar literal: routes.home = '/' (string emas)
// 3. Kalitlar aniq: routes.home ✅, routes.unknown ❌

// Form validation rules
interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
}

const validationRules = {
  email: { required: true, pattern: /^[^@]+@[^@]+$/ },
  password: { required: true, minLength: 8, maxLength: 100 },
  name: { required: true, minLength: 2 },
} satisfies Record<string, ValidationRule>

// validationRules.email.pattern — ✅ mavjud (aniq tip)
// validationRules.email.minLength — ❌ yo'q (aniq tip!)`,
        description: 'satisfies — tipga mos kelishini tekshiradi, lekin ANIQ tipni saqlaydi. Type annotation (: Type) bilan farq: annotation aniq tipni yo\'qotadi, satisfies saqlaydi.',
      },
    ],
    interviewQA: [
      {
        question: 'as const nima qiladi?',
        answer: `as const — qiymatlarni LITERAL tipga aylantiradi va readonly qiladi. string → "exact-string", number → exact-number, array → readonly tuple. Misol: const x = "hello" as const — tip "hello" (string emas). Array: ["a", "b"] as const → readonly ["a", "b"]. Object: {api: "/api"} as const → {readonly api: "/api"}. Foydali: route paths, action types, config qiymatlar — ANIQ qiymatlar bilan ishlash, noto'g'ri string-ni oldini olish.`,
      },
      {
        question: 'satisfies va type annotation (:) farqi nima?',
        answer: `Type annotation (: Type) — qiymatga tip BERADI, aniq qiymat yo'qoladi. const x: Record<string, string> = {a: "1"} — x.a tipi string, x.b ham string (xato berMAYDI). satisfies — tipga MOS KELISHINI TEKSHIRADI, lekin aniq tipni SAQLAYDI. const x = {a: "1"} satisfies Record<string, string> — x.a tipi "1" (literal), x.b xato beradi (yo'q). satisfies = tip tekshirish + aniq tip saqlash.`,
      },
      {
        question: 'typeof ROUTES[keyof typeof ROUTES] nima qiladi?',
        answer: `Bosqichma-bosqich: 1) typeof ROUTES — object tipini oladi: {home: "/", about: "/about"}. 2) keyof typeof ROUTES — kalitlar union: "home" | "about". 3) typeof ROUTES[keyof typeof ROUTES] — qiymatlar union: "/" | "/about". as const bilan ishlaydi — as const bo'lmasa barcha qiymatlar string bo'lib qoladi. Natija: route path-larning ANIQ union tipini yaratish — navigate funksiyasiga faqat mavjud path berish mumkin.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'typescript-react', topicId: 'utility-types', label: 'Utility Types' },
    ],
  },

  // ===== YANGI MAVZULAR =====
  {
    id: 'hooks-typing',
    title: 'Hooks Typing',
    importance: 3,
    status: 'to-learn',
    description: 'useRef, useState, custom hook return type tipizatsiyasi',
    content: `React hook-larini TypeScript bilan to'g'ri tiplashtirish — har kunlik ish. Har bir hook o'ziga xos tipizatsiya pattern-iga ega.

═══════════════════════════════════════
  useState TIPIZATSIYA
═══════════════════════════════════════

Oddiy qiymatlar — avtomatik inference:
  const [count, setCount] = useState(0)        // number
  const [name, setName] = useState('')          // string
  const [active, setActive] = useState(false)   // boolean

Generic kerak bo'lganda:
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

Qoida: boshlang'ich qiymat tipni aniqlay olsa — generic KERAK EMAS.
null yoki bo'sh array bo'lsa — generic KERAK.

═══════════════════════════════════════
  useRef TIPIZATSIYA
═══════════════════════════════════════

2 xil useRef bor:

1. DOM element ref:
   const inputRef = useRef<HTMLInputElement>(null)
   // inputRef.current: HTMLInputElement | null
   // null bilan boshlanadi — element mount bo'lganda to'ladi

2. Mutable value ref (instance variable):
   const timerRef = useRef<number>(0)
   // timerRef.current: number
   // DOIM qiymatga ega — null EMAS

Farq: DOM ref — null bilan, mutable ref — qiymat bilan.

DOM element tiplari:
  useRef<HTMLInputElement>(null)
  useRef<HTMLDivElement>(null)
  useRef<HTMLButtonElement>(null)
  useRef<HTMLFormElement>(null)
  useRef<HTMLCanvasElement>(null)

═══════════════════════════════════════
  useReducer TIPIZATSIYA
═══════════════════════════════════════

  // Action tipini discriminated union bilan
  type Action =
    | { type: 'increment' }
    | { type: 'decrement' }
    | { type: 'set'; payload: number }

  interface State {
    count: number
  }

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'increment': return { count: state.count + 1 }
      case 'decrement': return { count: state.count - 1 }
      case 'set': return { count: action.payload }
    }
  }

  const [state, dispatch] = useReducer(reducer, { count: 0 })
  dispatch({ type: 'set', payload: 10 })  // ✅
  dispatch({ type: 'reset' })              // ❌ 'reset' yo'q!

═══════════════════════════════════════
  CUSTOM HOOK RETURN TYPE
═══════════════════════════════════════

Tuple qaytarish (useState kabi):
  function useToggle(initial = false): [boolean, () => void] {
    const [value, setValue] = useState(initial)
    const toggle = useCallback(() => setValue(v => !v), [])
    return [value, toggle]
  }
  const [isOpen, toggleOpen] = useToggle()

Object qaytarish (ko'p qiymat):
  function useAuth() {
    // ...
    return { user, isLoading, login, logout }
  }
  const { user, login } = useAuth()

Qoida:
  2 ta qiymat → tuple: [value, setter]
  3+ ta qiymat → object: { value, setter, helper }

═══════════════════════════════════════
  useCallback va useMemo TIPIZATSIYA
═══════════════════════════════════════

Ko'pincha avtomatik inference yetarli:
  const memoized = useMemo(() => items.filter(i => i.active), [items])
  // tip: Item[] (avtomatik)

  const handler = useCallback((id: string) => {
    deleteItem(id)
  }, [])
  // tip: (id: string) => void (avtomatik)

Generic kerak bo'lganda:
  const data = useMemo<ProcessedData>(() => {
    return processData(rawData)
  }, [rawData])`,
    codeExamples: [
      {
        title: 'Hook-lar tipizatsiyasi — barcha pattern-lar',
        language: 'tsx',
        code: `import { useState, useRef, useReducer, useCallback, useEffect } from 'react'

// === useState ===
// Avtomatik inference
const [count, setCount] = useState(0)             // number
const [name, setName] = useState('Ali')            // string

// Generic kerak
const [user, setUser] = useState<User | null>(null)
const [items, setItems] = useState<Item[]>([])
const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

// === useRef ===
// DOM ref — null bilan boshlash
const inputRef = useRef<HTMLInputElement>(null)
const divRef = useRef<HTMLDivElement>(null)

// Ishlatish
function focusInput() {
  inputRef.current?.focus()  // null check kerak (?)
}

// Mutable ref — qiymat bilan boshlash
const renderCount = useRef(0)
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

useEffect(() => {
  renderCount.current += 1  // null check KERAK EMAS
})

// === useReducer ===
type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set'; payload: number }

interface CounterState {
  count: number
  history: number[]
}

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1, history: [...state.history, state.count + 1] }
    case 'decrement':
      return { ...state, count: state.count - 1, history: [...state.history, state.count - 1] }
    case 'reset':
      return { count: 0, history: [] }
    case 'set':
      return { ...state, count: action.payload, history: [...state.history, action.payload] }
  }
}

const [state, dispatch] = useReducer(counterReducer, { count: 0, history: [] })`,
        description: 'useState — oddiy qiymatlar avtomatik, null/union uchun generic. useRef — DOM ref null bilan, mutable ref qiymat bilan. useReducer — discriminated union action.',
      },
      {
        title: 'Custom hook — to\'g\'ri tipizatsiya',
        language: 'tsx',
        code: `import { useState, useEffect, useCallback } from 'react'

// 1. Tuple return — useState kabi
function useToggle(initialValue = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle]  // tuple
}

const [isOpen, toggleOpen] = useToggle()
// isOpen: boolean, toggleOpen: () => void

// 2. Object return — ko'p qiymat
interface UseFetchResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      setData(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xatolik')
    } finally {
      setIsLoading(false)
    }
  }, [url])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, isLoading, error, refetch: fetchData }
}

// Generic avtomatik aniqlanadi
const { data: users, isLoading } = useFetch<User[]>('/api/users')
// users: User[] | null

// 3. as const tuple (aniq tiplar uchun)
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  const setAndSave = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const resolved = typeof newValue === 'function'
        ? (newValue as (prev: T) => T)(prev)
        : newValue
      localStorage.setItem(key, JSON.stringify(resolved))
      return resolved
    })
  }, [key])

  return [value, setAndSave] as const
  // as const — tuple sifatida qaytaradi (array emas)
}

const [theme, setTheme] = useLocalStorage('theme', 'light')
// theme: string, setTheme: (v: string | (prev: string) => string) => void`,
        description: 'Custom hook return: tuple ([value, setter] — 2 ta qiymat uchun, as const bilan), object ({data, isLoading} — ko\'p qiymat uchun). Generic <T> — turli tiplar bilan ishlash.',
      },
    ],
    interviewQA: [
      {
        question: 'useState-da qachon generic kerak, qachon kerak emas?',
        answer: `Generic KERAK EMAS: boshlang'ich qiymat tipni aniqlay olsa — useState(0), useState(""), useState(false). TypeScript avtomatik inference qiladi. Generic KERAK: null bo'lishi mumkin — useState<User | null>(null), bo'sh array — useState<Item[]>([]), union literal — useState<"idle" | "loading">("idle"). Qoida: TypeScript o'zi to'g'ri tip chiqara olmasa — generic yozing.`,
      },
      {
        question: 'useRef-da DOM ref va mutable ref farqi nima?',
        answer: `DOM ref: useRef<HTMLInputElement>(null) — null bilan boshlanadi, element mount bo'lganda React o'zi to'ldiradi. current: HTMLInputElement | null — DOIM null check kerak (?. yoki if). Mutable ref: useRef<number>(0) — qiymat bilan boshlanadi, current: number — null check kerak EMAS. TypeScript farqlaydi: null bilan boshlansa — RefObject (readonly current), qiymat bilan boshlansa — MutableRefObject (writable current).`,
      },
      {
        question: 'Custom hook-dan tuple va object qaytarish farqi nima?',
        answer: `Tuple: [value, setter] — 2 ta qiymat uchun yaxshi, useState kabi. Destructuring da nom o'zgartirish oson: [isOpen, toggle]. as const kerak — aks holda TypeScript (boolean | () => void)[] deb o'ylaydi. Object: {data, isLoading, error} — 3+ qiymat uchun, nom aniq. Destructuring da nom o'zgartirish uchun : kerak: {data: users}. Qoida: 2 ta → tuple, 3+ → object.`,
      },
      {
        question: 'useReducer-da action tipini qanday yozish kerak?',
        answer: `Discriminated union — eng yaxshi pattern: type Action = | {type: "increment"} | {type: "set"; payload: number}. Har action-ning payload-i aniq tiplanadi. switch-da TypeScript auto-complete beradi, exhaustiveness check mumkin. Reducer funksiya: (state: State, action: Action): State — qaytarish tipini aniq yozish xavfsizroq. dispatch({type: "unknown"}) — TypeScript XATO beradi. Enum o'rniga string literal union tavsiya etiladi.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'component-patterns', topicId: 'custom-hooks', label: 'Custom Hooks' },
      { sectionId: 'react-core', topicId: 'use-ref', label: 'useRef tiplar' },
      { sectionId: 'react-core', topicId: 'use-state', label: 'useState tiplar' },
    ],
  },
]
