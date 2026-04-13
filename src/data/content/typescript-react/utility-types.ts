import type { Topic } from '../../types'

export const utilityTypes: Topic = {
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
  }
