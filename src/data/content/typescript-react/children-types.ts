import type { Topic } from '../../types'

export const childrenTypes: Topic = {
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
  }
