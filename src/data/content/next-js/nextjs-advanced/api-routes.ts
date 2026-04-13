import type { Topic } from '../../../types'

export const apiRoutes: Topic = {
  id: 'api-routes',
  title: 'API Routes (Route Handlers)',
  importance: 2,
  status: 'to-learn',
  description: 'Route Handlers — GET, POST, streaming responses',
  content: `Next.js App Router da API endpointlar Route Handlers orqali yaratiladi. Ular app/ papkasida route.ts fayllarida yoziladi.

═══════════════════════════════════════
  ASOSIY TUSHUNCHA
═══════════════════════════════════════

Route Handler — Web Request/Response API ga asoslangan server-side endpoint.
Har bir HTTP metod uchun alohida funksiya eksport qilinadi:

  // app/api/hello/route.ts
  export async function GET() {
    return Response.json({ message: 'Salom!' })
  }

Qo'llab-quvvatlanadigan metodlar:
GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

═══════════════════════════════════════
  FAYL KONVENTSIYASI
═══════════════════════════════════════

  app/
  ├── api/
  │   ├── users/
  │   │   ├── route.ts          → /api/users (GET, POST)
  │   │   └── [id]/
  │   │       └── route.ts      → /api/users/123 (GET, PUT, DELETE)
  │   └── posts/
  │       └── route.ts          → /api/posts

MUHIM: route.ts va page.tsx bir papkada bo'lishi MUMKIN EMAS!

═══════════════════════════════════════
  REQUEST VA RESPONSE
═══════════════════════════════════════

Request object dan ma'lumot olish:
- request.json()      — JSON body
- request.formData()  — Form data
- request.text()      — Text body
- request.nextUrl     — URL, searchParams

Response yaratish:
- Response.json(data)           — JSON
- new Response(body, options)   — Custom response
- NextResponse.redirect(url)    — Redirect

═══════════════════════════════════════
  CACHING XULQI
═══════════════════════════════════════

GET — standart holda CACHE qilinadi (statik)
POST, PUT, DELETE — DOIM dinamik

GET ni dinamik qilish:
  export const dynamic = 'force-dynamic'
  // yoki
  export const revalidate = 0

═══════════════════════════════════════
  STREAMING RESPONSE
═══════════════════════════════════════

ReadableStream bilan streaming response yuborish mumkin.
Bu ChatGPT-ga o'xshash real-time javoblar uchun ishlatiladi.

Encoder orqali text stream yaratiladi va chunk-lab yuboriladi.
Client tomonida fetch + reader.read() bilan qabul qilinadi.

═══════════════════════════════════════
  CORS SOZLAMALARI
═══════════════════════════════════════

Route Handler da CORS headers qo'shish mumkin:

  return new Response(JSON.stringify(data), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST',
    },
  })

Yoki middleware da global CORS sozlash tavsiya etiladi.`,
  codeExamples: [
    {
      title: 'CRUD Route Handlers',
      code: `// app/api/users/route.ts
import { NextRequest } from 'next/server'

interface User {
  id: number
  name: string
  email: string
}

// GET /api/users — barcha foydalanuvchilar
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const role = searchParams.get('role')

  const users = await db.user.findMany({
    where: role ? { role } : undefined,
  })

  return Response.json(users)
}

// POST /api/users — yangi foydalanuvchi yaratish
export async function POST(request: NextRequest) {
  const body: Omit<User, 'id'> = await request.json()

  if (!body.name || !body.email) {
    return Response.json(
      { error: "Nom va email majburiy" },
      { status: 400 }
    )
  }

  const user = await db.user.create({ data: body })
  return Response.json(user, { status: 201 })
}`,
      language: 'ts',
      description: 'GET va POST metod bilan foydalanuvchilar API',
    },
    {
      title: 'Dinamik route handler',
      code: `// app/api/users/[id]/route.ts
import { NextRequest } from 'next/server'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/users/123
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params
  const user = await db.user.findUnique({
    where: { id: Number(id) },
  })

  if (!user) {
    return Response.json(
      { error: "Foydalanuvchi topilmadi" },
      { status: 404 }
    )
  }

  return Response.json(user)
}

// DELETE /api/users/123
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params
  await db.user.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}`,
      language: 'ts',
      description: 'Dinamik [id] bilan bitta foydalanuvchi CRUD',
    },
    {
      title: 'Streaming Response',
      code: `// app/api/stream/route.ts
export async function POST(request: Request) {
  const { prompt } = await request.json()

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const words = prompt.split(' ')

      for (const word of words) {
        // Har bir so'zni alohida yuborish
        controller.enqueue(
          encoder.encode(\`data: \${word}\\n\\n\`)
        )
        // Simulyatsiya uchun kechikish
        await new Promise(r => setTimeout(r, 200))
      }

      controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}`,
      language: 'ts',
      description: 'Server-Sent Events bilan streaming javob',
    },
  ],
  interviewQA: [
    {
      question: 'Route Handlers va Pages Router dagi API Routes orasidagi farq nima?',
      answer: "Route Handlers Web standart Request/Response API ishlatadi (Pages Router da req/res Node.js API). Route Handlers Edge Runtime da ham ishlaydi. Ular app/ papkasida route.ts da joylashadi (pages/api/ emas). GET funksiyalari standart holda cache qilinadi. HTTP metodlar alohida funksiyalar sifatida eksport qilinadi.",
    },
    {
      question: "Route handler da GET qachon cache qilinadi?",
      answer: "GET funksiyasi standart holda statik cache qilinadi agar: Request object ishlatilmasa, boshqa dinamik funksiyalar (cookies, headers) chaqirilmasa. Cache ni o'chirish uchun: export const dynamic = 'force-dynamic', yoki Request parametrini qabul qilish, yoki POST/PUT/DELETE ishlatish.",
    },
    {
      question: "Streaming response qachon ishlatiladi?",
      answer: "Streaming response real-time ma'lumot yuborish kerak bo'lganda ishlatiladi: AI chatbot javoblari (ChatGPT kabi), katta ma'lumot to'plamlarini bo'laklab yuborish, Server-Sent Events (SSE), uzoq davom etadigan jarayonlar natijasini real-time ko'rsatish. ReadableStream yoki Web Streams API ishlatiladi.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'middleware', label: 'Middleware' },
    { techId: 'next-js', sectionId: 'nextjs-advanced', topicId: 'server-actions', label: 'Server Actions' },
  ],
}
