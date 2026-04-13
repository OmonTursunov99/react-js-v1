import type { Topic } from '../../../types'

export const serverComponents: Topic = {
    id: 'server-components',
    title: 'React Server Components (RSC)',
    importance: 3,
    status: 'to-learn',
    description: 'Server vs Client components, "use client", Next.js App Router',
    content: `React Server Components (RSC) — server-da render bo'ladigan komponentlar. Client-ga JS yuborMAYDI — faqat HTML natijasi. React-ning kelajagi.

═══════════════════════════════════════
  SSR vs RSC (MUHIM FARQ!)
═══════════════════════════════════════

SSR:
  Server-da HTML yaratadi → client-ga yuboradi → JS yuklanadi → HYDRATION
  Barcha komponent JS client-ga yuboriladi (bundle)

RSC:
  Server Component JS client-ga YUBORILMAYDI
  Faqat render NATIJASI (HTML) yuboriladi
  Interaktiv bo'lishi kerak bo'lsa → "use client"

═══════════════════════════════════════
  SERVER vs CLIENT COMPONENT
═══════════════════════════════════════

Server Component (default Next.js App Router-da):
  ✅ Database-ga to'g'ridan-to'g'ri kirish
  ✅ File system o'qish
  ✅ API secret-lar xavfsiz
  ✅ Bundle-ga qo'shilMAYDI (kichik JS)
  ❌ useState, useEffect ishlatib BO'LMAYDI
  ❌ onClick, onChange ishlatib BO'LMAYDI
  ❌ Browser API (window, document) yo'q

Client Component ("use client"):
  ✅ useState, useEffect — interaktivlik
  ✅ onClick, onChange — event-lar
  ✅ Browser API
  ❌ Database-ga to'g'ridan-to'g'ri kirib bo'lmaydi
  ❌ Bundle-ga qo'shiladi

═══════════════════════════════════════
  "use client" DIREKTIVA
═══════════════════════════════════════

  // Server Component (default)
  async function ProductPage({ id }: { id: string }) {
    const product = await db.product.findById(id)  // to'g'ridan-to'g'ri DB
    return (
      <div>
        <h1>{product.name}</h1>
        <AddToCartButton productId={id} />  {/* client component */}
      </div>
    )
  }

  // Client Component
  'use client'  // ← BU DIREKTIVA
  function AddToCartButton({ productId }: { productId: string }) {
    const [added, setAdded] = useState(false)
    return (
      <button onClick={() => { addToCart(productId); setAdded(true) }}>
        {added ? 'Savatda ✓' : 'Savatga qoshish'}
      </button>
    )
  }

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

Server Component (default):
  ✅ Static kontent (matn, rasm)
  ✅ Data fetching (DB, API)
  ✅ Layout, page wrapper

Client Component ("use client"):
  ✅ Interaktivlik (click, hover, input)
  ✅ State (useState, useReducer)
  ✅ Effects (useEffect)
  ✅ Browser API (localStorage, geolocation)

Qoida: IMKON QADAR server component.
Faqat interaktivlik kerak bo'lganda "use client".`,
    codeExamples: [
      {
        title: 'Server va Client component — Next.js',
        language: 'tsx',
        code: `// ===== SERVER COMPONENT (default) =====
// app/products/[id]/page.tsx
// "use client" YO'Q — server component

interface Product {
  id: string
  name: string
  price: number
  description: string
}

// async function — server-da ishlaydi
async function ProductPage({ params }: { params: { id: string } }) {
  // To'g'ridan-to'g'ri DB-dan (API kerak emas!)
  const product = await db.product.findUnique({
    where: { id: params.id },
  })

  if (!product) return <p>Topilmadi</p>

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>{product.price} so'm</p>

      {/* Client component — interaktiv qism */}
      <AddToCartButton productId={product.id} price={product.price} />
      <ProductReviews productId={product.id} />
    </div>
  )
}

// ===== CLIENT COMPONENT =====
// components/AddToCartButton.tsx
'use client'

import { useState } from 'react'

export function AddToCartButton({
  productId,
  price,
}: {
  productId: string
  price: number
}) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  async function handleAdd() {
    await fetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    })
    setAdded(true)
  }

  return (
    <div>
      <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <p>Jami: {price * quantity} so'm</p>
      <button onClick={handleAdd} disabled={added}>
        {added ? 'Savatda ✓' : 'Savatga'}
      </button>
    </div>
  )
}

// ProductPage — server-da render, JS client-ga YUBORILMAYDI
// AddToCartButton — client-da render, JS bundle-da
// Natija: kichikroq bundle, tezroq sahifa`,
        description: 'Server component: async, DB access, JS yuborilmaydi. Client component: "use client", useState/onClick, JS bundle-da. Server default, client faqat interaktivlik uchun.',
      },
    ],
    interviewQA: [
      {
        question: 'React Server Components nima?',
        answer: `RSC — server-da render bo'ladigan komponentlar. Client-ga JS yuborMAYDI — faqat render natijasi. SSR-dan farqi: SSR barcha komponent JS-ni client-ga yuboradi (hydration). RSC server component JS-ni YUBORILMAYDI — bundle kichikroq. Server component: async, DB access, API secret, useState/useEffect YO'Q. Client component: "use client" direktiva, interaktivlik, useState/useEffect.`,
      },
      {
        question: '"use client" nima va qachon kerak?',
        answer: `"use client" — fayl boshiga qo'yiladigan direktiva. Bu fayl va uning import-lari CLIENT COMPONENT ekanini bildiradi. QACHON: useState, useEffect kerak bo'lganda, onClick/onChange kerak bo'lganda, Browser API (window, localStorage) ishlatilganda. QACHON KERAK EMAS: static kontent, data fetching, layout. Qoida: IMKON QADAR server component (default). Faqat interaktivlik uchun "use client". Server component client component-ni CHILD sifatida ishlatishi MUMKIN.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'ssr-csr-ssg', label: 'SSR vs CSR' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'hydration', label: 'Hydration' },
      { techId: 'react-js', sectionId: 'theory-questions', topicId: 'react-18-19', label: 'React 19 yangiliklari' },
      { techId: 'react-js', sectionId: 'react-core', topicId: 'use-action-state', label: 'useActionState' },
    ],
  }
