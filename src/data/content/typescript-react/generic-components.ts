import type { Topic } from '../../types'

export const genericComponents: Topic = {
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
  }
