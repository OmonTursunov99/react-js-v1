import type { Topic } from '../../../types'

export const polymorphicComponents: Topic = {
    id: `polymorphic-components`,
    title: `Polymorphic Components`,
    importance: 2,
    status: `to-learn`,
    description: `"as" prop pattern — <Button as="a" href="/"> qilib ishlatish`,
    content: `Polymorphic Components — "as" prop orqali komponent qaysi HTML element yoki komponent sifatida renderlanishini tanlash. UI kutubxonalarida keng tarqalgan pattern.

═══════════════════════════════════════
  NIMA BU
═══════════════════════════════════════

"as" prop — komponent qaysi HTML element yoki komponent
sifatida renderlanishini tanlash:

  <Button as="a" href="/">Asosiy sahifa</Button>
  // Renderlanadi: <a href="/" class="btn">Asosiy sahifa</a>

  <Button as="button" onClick={save}>Saqlash</Button>
  // Renderlanadi: <button class="btn" onclick="...">Saqlash</button>

  <Text as="h1">Sarlavha</Text>
  // Renderlanadi: <h1>Sarlavha</h1>

  <Text as="p">Oddiy matn</Text>
  // Renderlanadi: <p>Oddiy matn</p>

Komponent KO'RINISHI bir xil, lekin HTML elementi turli.

═══════════════════════════════════════
  NIMA UCHUN KERAK
═══════════════════════════════════════

UI library-larda — Button ba'zan link, ba'zan button,
ba'zan div bo'lishi kerak:

  1. Accessibility: <a> tag SEO va screen reader uchun
     muhim, lekin ko'rinishi button kabi bo'lishi kerak

  2. Semantic HTML: <h1>, <h2>, <p>, <span> — turli
     vazifa, bir xil stil

  3. Moslashuvchanlik: Bir komponent — ko'p ishlatish

Mashhur kutubxonalar bu pattern ishlatadi:
  - Chakra UI: <Box as="section">
  - Mantine: <Button component="a">
  - Headless UI: <Menu.Button as={Fragment}>

═══════════════════════════════════════
  TYPESCRIPT BILAN
═══════════════════════════════════════

Murakkab generic tiplar kerak:
  - ComponentPropsWithoutRef<T> — element props-larini olish
  - as prop — ElementType (string yoki component)
  - Props merge — komponent o'z props + element props

TypeScript-da to'liq tipizatsiya qiyin, lekin
foydalanuvchiga to'g'ri autocomplete beradi:

  <Button as="a" href="/">  ← href faqat "a" uchun!
  <Button as="button" type="submit"> ← type faqat "button" uchun!`,
    codeExamples: [
      {
        title: `Box component — as prop bilan har xil element`,
        language: `tsx`,
        code: `import { type ElementType, type ComponentPropsWithoutRef, type ReactNode } from 'react'

// Polymorphic component tipi
type BoxProps<T extends ElementType> = {
  as?: T
  children?: ReactNode
  className?: string
} & ComponentPropsWithoutRef<T>

// Box component — "as" prop bilan istalgan element
function Box<T extends ElementType = 'div'>({
  as,
  children,
  className,
  ...props
}: BoxProps<T>) {
  const Component = as || 'div'

  return (
    // @ts-expect-error — polymorphic props spread
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

// Text component — tipografiya uchun
type TextProps<T extends ElementType> = BoxProps<T> & {
  variant?: 'heading' | 'body' | 'caption'
}

function Text<T extends ElementType = 'p'>({
  variant = 'body',
  className = '',
  ...props
}: TextProps<T>) {
  const variantStyles = {
    heading: 'text-2xl font-bold',
    body: 'text-base',
    caption: 'text-sm text-gray-500',
  }

  return <Box className={\`\${variantStyles[variant]} \${className}\`} {...props} />
}

// Button component — polymorphic
type ButtonProps<T extends ElementType> = BoxProps<T> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

function Button<T extends ElementType = 'button'>({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps<T>) {
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    ghost: 'bg-transparent text-blue-500 hover:bg-blue-50',
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <Box
      className={\`rounded font-medium \${variantStyles[variant]} \${sizeStyles[size]} \${className}\`}
      {...props}
    />
  )
}

// Ishlatish
function App() {
  return (
    <div className="p-8 space-y-4">
      {/* Box — turli elementlar */}
      <Box as="section" className="p-4 border rounded">
        Section element
      </Box>
      <Box as="article" className="p-4 bg-gray-50">
        Article element
      </Box>

      {/* Text — tipografiya */}
      <Text as="h1" variant="heading">Sarlavha (h1)</Text>
      <Text as="h2" variant="heading">Kichik sarlavha (h2)</Text>
      <Text as="p" variant="body">Oddiy matn (p)</Text>
      <Text as="span" variant="caption">Izoh matni (span)</Text>

      {/* Button — button yoki link */}
      <div className="flex gap-2">
        <Button as="button" onClick={() => alert('Bosildi!')}>
          Tugma (button)
        </Button>
        <Button as="a" href="https://react.dev" variant="secondary">
          Havola (a)
        </Button>
        <Button as="a" href="/settings" variant="ghost" size="sm">
          Sozlamalar
        </Button>
      </div>
    </div>
  )
}`,
        description: `Polymorphic Box, Text, Button — "as" prop orqali istalgan HTML element sifatida render. TypeScript generic-lar bilan element-ga mos props autocomplete beradi (href faqat "a" uchun, onClick faqat "button" uchun).`,
      },
    ],
    interviewQA: [
      {
        question: `Polymorphic component nima?`,
        answer: `Polymorphic component — "as" prop orqali qaysi HTML element yoki React komponent sifatida renderlanishini tanlash imkonini beradigan komponent. Masalan: <Button as="a" href="/"> — button ko'rinishida, lekin aslida <a> tag render bo'ladi. Bu UI kutubxonalarda (Chakra UI, Mantine) keng tarqalgan. Afzalliklari: 1) Semantic HTML — to'g'ri element ishlatish. 2) Accessibility — <a>, <button>, <h1> to'g'ri ishlatiladi. 3) Bir komponent — ko'p vazifa.`,
      },
      {
        question: `TypeScript-da polymorphic component qanday tipizatsiya qilinadi?`,
        answer: `TypeScript-da generic tip kerak: function Box<T extends ElementType = 'div'>(props: BoxProps<T>). BoxProps<T> = { as?: T } & ComponentPropsWithoutRef<T> — bu "as" ga berilgan element-ning barcha props-larini avtomatik qo'shadi. Masalan: as="a" bo'lsa href, target paydo bo'ladi; as="button" bo'lsa type, disabled paydo bo'ladi. Bu murakkab tipizatsiya, lekin foydalanuvchiga ajoyib autocomplete beradi. ComponentPropsWithoutRef ref-siz props oladi, ref kerak bo'lsa ComponentPropsWithRef ishlatiladi.`,
      },
    ],
    relatedTopics: [
      { techId: `react-js`, sectionId: `typescript-react`, topicId: `generic-components`, label: `Generic Components` },
      { techId: `react-js`, sectionId: `component-patterns`, topicId: `composition-vs-inheritance`, label: `Composition` },
    ],
  }
