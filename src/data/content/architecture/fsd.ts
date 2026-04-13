import type { Topic } from '../../types'

export const fsd: Topic = {
    id: 'fsd',
    title: 'Feature-Sliced Design (FSD)',
    importance: 3,
    status: 'to-learn',
    description: 'shared → entities → features → widgets → pages → app',
    content: `Feature-Sliced Design (FSD) — frontend loyihalar uchun arxitektura metodologiyasi. Kodni DARAJALAR (layers) va SEGMENTLAR (slices) bo'yicha tartibga soladi. Rossiya/MDH davlatlarida juda mashhur.

═══════════════════════════════════════
  MUAMMO: TARTIBSIZ KOD
═══════════════════════════════════════

Ko'p loyihalarda:
  src/
  ├── components/   ← 200 ta fayl, qaysi qayerga tegishli?
  ├── hooks/        ← hamma hook bir joyda
  ├── utils/        ← dump papka
  └── pages/

Muammolar:
  ❌ Komponent qaysi feature-ga tegishli — noma'lum
  ❌ Import tartibsiz — hamma hamma joydan import qiladi
  ❌ Refactoring qiyin — nima nimaga bog'liq — noma'lum
  ❌ Yangi developer tushunishi qiyin

═══════════════════════════════════════
  FSD DARAJALARI (LAYERS)
═══════════════════════════════════════

Pastdan yuqoriga (qat'iy ierarxiya):

  1. shared    — qayta ishlatiladigan kod (UI kit, utils, API client)
  2. entities  — biznes entitylar (User, Product, Order)
  3. features  — foydalanuvchi harakatlari (AddToCart, Login, Search)
  4. widgets   — mustaqil UI bloklar (Header, Sidebar, ProductList)
  5. pages     — sahifalar (HomePage, ProductPage)
  6. app       — ilova sozlamalari (router, providers, global styles)

QOIDA: Yuqori daraja pastdan IMPORT qilishi mumkin.
Past daraja yuqoridan import qilishi MUMKIN EMAS.

  pages → widgets → features → entities → shared  ✅
  shared → entities  ❌ TAQIQLANGAN!
  features → widgets ❌ TAQIQLANGAN!

═══════════════════════════════════════
  SEGMENT TUZILMASI
═══════════════════════════════════════

Har bir slice (feature/entity) ichida:

  features/add-to-cart/
  ├── ui/          — React komponentlar
  ├── model/       — business logika (store, hooks)
  ├── api/         — server so'rovlar
  ├── lib/         — utility funksiyalar
  ├── config/      — konfiguratsiya
  └── index.ts     — PUBLIC API (faqat shu orqali export)

index.ts — PUBLIC API:
  export { AddToCartButton } from './ui/AddToCartButton'
  export { useCart } from './model/useCart'

Boshqa slice-lar FAQAT index.ts orqali import qiladi.
Ichki fayllarni TO'G'RIDAN-TO'G'RI import TAQIQLANGAN.

═══════════════════════════════════════
  FSD AMALDA
═══════════════════════════════════════

  src/
  ├── app/                    # 6-daraja: ilova
  │   ├── providers/
  │   ├── router.tsx
  │   └── styles/
  ├── pages/                  # 5-daraja: sahifalar
  │   ├── home/
  │   └── product/
  ├── widgets/                # 4-daraja: mustaqil bloklar
  │   ├── header/
  │   └── product-list/
  ├── features/               # 3-daraja: foydalanuvchi harakatlari
  │   ├── auth/
  │   ├── add-to-cart/
  │   └── search/
  ├── entities/               # 2-daraja: biznes entitylar
  │   ├── user/
  │   ├── product/
  │   └── order/
  └── shared/                 # 1-daraja: umumiy kod
      ├── ui/
      ├── api/
      ├── lib/
      └── config/

═══════════════════════════════════════
  FSD AFZALLIKLARI VA KAMCHILIKLARI
═══════════════════════════════════════

Afzalliklari:
  ✅ Aniq tuzilma — yangi developer tez tushunadi
  ✅ Import qoidalari — dependency tartibli
  ✅ Modularlik — feature alohida ishlab chiqish mumkin
  ✅ Katta loyihalar uchun juda yaxshi

Kamchiliklari:
  ❌ Kichik loyihalar uchun ortiqcha (overhead)
  ❌ O'rganish egri chizig'i bor
  ❌ Qaysi daraja — ba'zan noaniq (feature vs widget?)
  ❌ Hali standart emas — har jamoa o'ziga moslaydi`,
    codeExamples: [
      {
        title: 'FSD tuzilmasi — e-commerce',
        language: 'ts',
        code: `// ===== shared/ — umumiy kod =====
// shared/ui/Button.tsx
export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>
}

// shared/api/client.ts
export const apiClient = {
  get: (url: string) => fetch(url).then(r => r.json()),
  post: (url: string, body: unknown) => fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then(r => r.json()),
}

// ===== entities/ — biznes entitylar =====
// entities/product/model/types.ts
export interface Product {
  id: string
  name: string
  price: number
  image: string
}

// entities/product/ui/ProductCard.tsx
export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded p-4">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price} so'm</p>
    </div>
  )
}

// entities/product/index.ts — PUBLIC API
export { ProductCard } from './ui/ProductCard'
export type { Product } from './model/types'

// ===== features/ — foydalanuvchi harakatlari =====
// features/add-to-cart/ui/AddToCartButton.tsx
import { Button } from '@/shared/ui'        // ✅ shared dan
import type { Product } from '@/entities/product' // ✅ entities dan

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  return <Button onClick={() => addItem(product)}>Savatga</Button>
}

// features/add-to-cart/index.ts
export { AddToCartButton } from './ui/AddToCartButton'

// ===== widgets/ — mustaqil bloklar =====
// widgets/product-list/ui/ProductList.tsx
import { ProductCard } from '@/entities/product'     // ✅ entities
import { AddToCartButton } from '@/features/add-to-cart' // ✅ features

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.id}>
          <ProductCard product={p} />
          <AddToCartButton product={p} />
        </div>
      ))}
    </div>
  )
}

// ===== pages/ — sahifalar =====
// pages/home/ui/HomePage.tsx
import { ProductList } from '@/widgets/product-list' // ✅ widgets
import { useProducts } from '@/entities/product'     // ✅ entities

export function HomePage() {
  const { data: products } = useProducts()
  return <ProductList products={products ?? []} />
}`,
        description: 'FSD amalda: shared (UI kit) → entities (Product) → features (AddToCart) → widgets (ProductList) → pages (HomePage). Har daraja faqat PASTDAGIDAN import qiladi.',
      },
      {
        title: 'FSD — Public API (index.ts)',
        language: 'ts',
        code: `// ❌ NOTO'G'RI — ichki fayldan to'g'ridan-to'g'ri import
import { ProductCard } from '@/entities/product/ui/ProductCard'
import { useProducts } from '@/entities/product/model/useProducts'
import type { Product } from '@/entities/product/model/types'

// ✅ TO'G'RI — faqat index.ts orqali
import { ProductCard, useProducts, type Product } from '@/entities/product'

// entities/product/index.ts — PUBLIC API
export { ProductCard } from './ui/ProductCard'
export { useProducts } from './model/useProducts'
export type { Product } from './model/types'

// ICHKI fayllarni O'ZGARTIRISH — tashqarini ta'sir QILMAYDI
// ProductCard.tsx → ProductCardNew.tsx — faqat index.ts yangilanadi
// Boshqa slice-lar hech narsa o'zgartirmaydi

// ESLint qoida bilan tekshirish:
// eslint-plugin-import — boundaries qoidasi
// @feature-sliced/eslint-config — FSD uchun maxsus`,
        description: 'Public API pattern — har slice faqat index.ts orqali export qiladi. Ichki tuzilma o\'zgarsa — boshqa slice-lar ta\'sirlanmaydi. Encapsulation.',
      },
    ],
    interviewQA: [
      {
        question: 'Feature-Sliced Design nima?',
        answer: `FSD — frontend arxitektura metodologiyasi. Kodni 6 ta DARAJA (layer) bo'yicha tartibga soladi: shared → entities → features → widgets → pages → app. Asosiy qoida: yuqori daraja pastdan import qilishi mumkin, teskari — MUMKIN EMAS. Har slice ichida segmentlar: ui/, model/, api/, lib/. Public API — faqat index.ts orqali eksport. Afzalliklari: aniq tuzilma, import tartibli, modular, katta loyihalar uchun yaxshi.`,
      },
      {
        question: 'FSD da layer qoidalari qanday ishlaydi?',
        answer: `Qat'iy ierarxiya: pages → widgets → features → entities → shared. Yuqori daraja pastdagidan import qilishi MUMKIN. Past daraja yuqoridagidan import qilishi TAQIQLANGAN. Bir xil daraja ichida cross-import TAQIQLANGAN (feature A → feature B emas). Agar 2 ta feature bir-biriga kerak bo'lsa — umumiy logikani entities yoki shared-ga ko'chirish kerak. Bu dependency graphni tartibli saqlaydi — circular dependency bo'lmaydi.`,
      },
      {
        question: 'FSD da entities va features farqi nima?',
        answer: `Entities — biznes ob'ektlar (User, Product, Order). Nima ekanini ko'rsatadi — karta, ro'yxat, tip. Harakat yo'q. Features — foydalanuvchi HARAKATLARI (AddToCart, Login, Search). Nima qilishni ko'rsatadi — tugma, forma, action. Misol: ProductCard (entity) — mahsulotni ko'rsatadi. AddToCartButton (feature) — savatga qo'shish harakati. Widget ikkalasini birlashtiradi: ProductCard + AddToCartButton = ProductWidget.`,
      },
      {
        question: 'FSD kichik loyihalarga kerakmi?',
        answer: `Kichik loyihalar (5-10 sahifa, 1-2 developer) uchun FSD ORTIQCHA — overhead katta, foyda kam. Oddiy tuzilma yetarli: src/components, src/pages, src/hooks, src/utils. FSD kerak: 10+ sahifa, 3+ developer, uzoq muddatli loyiha. O'rta variant: FSD-ning ba'zi elementlarini olish — feature papkalar, public API (index.ts), lekin to'liq 6 darajani majburlamaslik. Loyiha o'sganda asta-sekin FSD-ga o'tish mumkin.`,
      },
    ],
    relatedTopics: [
      { sectionId: 'architecture', topicId: 'atomic-design', label: 'Atomic Design (alternativa)' },
      { sectionId: 'architecture', topicId: 'solid-react', label: 'SOLID printsiplari' },
    ],
  }
