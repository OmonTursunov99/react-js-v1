import type { Topic } from '../../../types'

export const discriminatedUnions: Topic = {
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
      { techId: 'react-js', sectionId: 'typescript-react', topicId: 'props-typing', label: 'Props Typing' },
      { techId: 'react-js', sectionId: 'component-patterns', topicId: 'polymorphic-components', label: 'Polymorphic Components' },
    ],
  }
