import type { Topic } from '../../../types'

export const propsTyping: Topic = {
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
      { techId: 'react-js', sectionId: 'typescript-react', topicId: 'children-types', label: 'Children tiplar' },
      { techId: 'react-js', sectionId: 'typescript-react', topicId: 'discriminated-unions', label: 'Discriminated Unions' },
      { techId: 'react-js', sectionId: 'typescript-react', topicId: 'generic-components', label: 'Generic Components' },
    ],
  }
