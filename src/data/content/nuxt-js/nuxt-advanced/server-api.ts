import type { Topic } from '../../../types'

export const serverApi: Topic = {
  id: 'server-api',
  title: 'Server API',
  importance: 2,
  status: 'to-learn',
  description: 'server/api/ directory, defineEventHandler, HTTP methods, validatsiya',
  content: `SERVER API — NUXT SERVER ROUTES
═══════════════════════════════════════

Nuxt 3 da server/api/ papkasi orqali to"liq backend API yaratish mumkin.
Alohida Express yoki Fastify kerak emas — Nitro engine hammani boshqaradi.

MUHIM: Server routes faqat serverda ishlaydi, client bundle ga tushmaydi.
Sezgir logika (DB, auth, API keys) xavfsiz yoziladi.

═══════════════════════════════════════
1. SERVER/API/ DIRECTORY TUZILMASI
═══════════════════════════════════════

  server/
    api/
      hello.ts          → GET /api/hello
      users/
        index.ts         → GET /api/users
        index.post.ts    → POST /api/users
        [id].ts          → GET /api/users/:id
        [id].put.ts      → PUT /api/users/:id
        [id].delete.ts   → DELETE /api/users/:id
    middleware/
      auth.ts            → Server middleware (har bir request)
    utils/
      db.ts              → Yordamchi funksiyalar

Fayl nomi HTTP metodini aniqlaydi:
- index.ts → GET (default)
- index.post.ts → POST
- index.put.ts → PUT
- index.delete.ts → DELETE
- index.patch.ts → PATCH

═══════════════════════════════════════
2. DEFINEEVENTHANDLER
═══════════════════════════════════════

Har bir API route defineEventHandler bilan yaratiladi.
Event obyekti request, response, headers va boshqa ma"lumotlarni o"z ichiga oladi.

Asosiy yordamchi funksiyalar:
- readBody(event) — POST/PUT body o"qish
- getQuery(event) — URL query parametrlari
- getRouterParam(event, "id") — Dynamic route param
- getHeaders(event) — Request headerlar
- getCookie(event, "name") — Cookie o"qish
- setCookie(event, "name", "value") — Cookie yozish
- setResponseStatus(event, 201) — Status code

═══════════════════════════════════════
3. VALIDATSIYA
═══════════════════════════════════════

Production da request body va query albatta validatsiya qilinishi kerak.
Zod kutubxonasi eng mashhur yechim:

  import { z } from "zod"

  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().min(18).optional()
  })

  const body = await readBody(event)
  const result = schema.safeParse(body)

MUHIM: safeParse ishlatish tavsiya etiladi — throw qilmaydi,
natijani tekshirish imkonini beradi.

═══════════════════════════════════════
4. ERROR HANDLING
═══════════════════════════════════════

createError() bilan standart HTTP xatolar qaytariladi:

  throw createError({
    statusCode: 404,
    statusMessage: "User not found"
  })

Global error handler server/middleware/ da yoziladi.

═══════════════════════════════════════
5. DATABASE ULANISH PATTERNLARI
═══════════════════════════════════════

Prisma va Drizzle — eng mashhur ORM variantlar.
server/utils/ da singleton pattern bilan ulanish yaratiladi:

- Prisma: PrismaClient instance server/utils/db.ts da
- Drizzle: drizzle() instance server/utils/db.ts da
- Connection pooling production uchun muhim
- useRuntimeConfig() orqali DATABASE_URL olinadi`,
  codeExamples: [
    {
      title: 'Asosiy GET va POST routelar',
      language: 'ts',
      code: `// server/api/users/index.ts — GET /api/users
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
  })

  return { users, page, limit }
})

// server/api/users/index.post.ts — POST /api/users
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  })

  setResponseStatus(event, 201)
  return user
})`,
      description: 'Fayl nomi orqali HTTP metod aniqlash — GET default, .post.ts POST uchun',
    },
    {
      title: 'Dynamic route parametrlari',
      language: 'ts',
      code: `// server/api/users/[id].ts — GET /api/users/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID talab qilinadi",
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: "Foydalanuvchi topilmadi",
    })
  }

  return user
})

// server/api/users/[id].delete.ts — DELETE /api/users/:id
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  await prisma.user.delete({
    where: { id: Number(id) },
  })

  setResponseStatus(event, 204)
  return null
})`,
      description: '[id] dynamic segment — getRouterParam bilan olinadi',
    },
    {
      title: 'Zod bilan validatsiya',
      language: 'ts',
      code: `// server/api/users/index.post.ts
import { z } from "zod"

const CreateUserSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 belgi"),
  email: z.string().email("Email noto"g"ri formatda"),
  role: z.enum(["admin", "user"]).default("user"),
  age: z.number().min(18).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = CreateUserSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Validatsiya xatosi",
      data: result.error.flatten(),
    })
  }

  // result.data — tiplanganva validatsiyadan o"tgan
  const user = await prisma.user.create({
    data: result.data,
  })

  setResponseStatus(event, 201)
  return user
})`,
      description: 'Zod safeParse — xatolarni qaytarish yoki validatsiyadan o"tgan data ishlatish',
    },
    {
      title: 'Database ulanish — Prisma singleton',
      language: 'ts',
      code: `// server/utils/db.ts
import { PrismaClient } from "@prisma/client"

// Singleton pattern — development da hot reload
// har safar yangi connection ochmaslik uchun
let prisma: PrismaClient

declare global {
  var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}

export { prisma }

// Nuxt auto-import qiladi — server/ ichida
// import kerak emas, to"g"ridan-to"g"ri ishlatiladi`,
      description: 'server/utils/ dagi fayllar auto-import bo"ladi — barcha API route larda foydalanish mumkin',
    },
    {
      title: 'Client dan API chaqirish — $fetch va useFetch',
      language: 'ts',
      code: `// pages/users.vue — useFetch bilan SSR-safe
const { data: users, pending, error, refresh } = await useFetch("/api/users", {
  query: { page: 1, limit: 10 },
})

// POST — yangi foydalanuvchi yaratish
async function createUser(formData: { name: string; email: string }) {
  const user = await $fetch("/api/users", {
    method: "POST",
    body: formData,
  })

  // Ro"yxatni yangilash
  await refresh()
}

// DELETE — foydalanuvchini o"chirish
async function deleteUser(id: number) {
  await $fetch(\`/api/users/\${id}\`, {
    method: "DELETE",
  })

  await refresh()
}`,
      description: '$fetch — isomorphic fetch, useFetch — SSR da data olish bilan birga',
    },
  ],
  interviewQA: [
    {
      question: 'Nuxt server/api/ qanday ishlaydi va nima uchun alohida backend kerak emas?',
      answer: 'Nuxt 3 Nitro engine ustiga qurilgan. server/api/ papkasidagi har bir fayl avtomatik API endpoint bo"ladi. defineEventHandler bilan route handler yoziladi. Nitro bu handlerlarni serverda ishlatadi — client bundle ga tushmaydi. Shuning uchun DB ulanish, API keys, auth logikasi xavfsiz. Alohida Express/Fastify server o"rnatish shart emas — Nitro hammani boshqaradi.',
    },
    {
      question: 'HTTP metodlarini qanday ajratish mumkin?',
      answer: 'Fayl nomi konventsiyasi orqali: index.ts GET uchun, index.post.ts POST uchun, index.put.ts PUT, index.delete.ts DELETE, index.patch.ts PATCH. Yoki bitta faylda getMethod(event) bilan tekshirish mumkin, lekin alohida fayllar tozaroq va aniqroq yondashuv.',
    },
    {
      question: 'readBody() va getQuery() farqi nima?',
      answer: 'readBody(event) — POST/PUT request ning body sini o"qiydi (JSON, FormData). getQuery(event) — URL dagi query parametrlarini oladi, masalan /api/users?page=2&limit=10. readBody asinxron (await kerak), getQuery sinxron.',
    },
    {
      question: 'createError() nima uchun kerak va qanday ishlatiladi?',
      answer: 'createError() standart HTTP xato yaratadi — statusCode, statusMessage va data maydoni bor. throw createError({ statusCode: 404, statusMessage: "Not found" }) deb ishlatiladi. Nuxt bu xatoni tutib, client ga to"g"ri HTTP response qaytaradi. Validatsiya xatolarida data maydoniga batafsil ma"lumot qo"shish mumkin.',
    },
    {
      question: 'Server API da validatsiya qanday amalga oshiriladi?',
      answer: 'Eng mashhur yondashuv — Zod kutubxonasi. Schema yaratiladi (z.object), readBody natijasi safeParse orqali tekshiriladi. safeParse throw qilmaydi — result.success va result.error qaytaradi. Xato bo"lsa createError bilan 422 status qaytariladi. Bu pattern type-safe va xatolar batafsil.',
    },
    {
      question: '$fetch va useFetch farqi qanday?',
      answer: '$fetch — isomorphic fetch wrapper (ofetch). Serverda ham, clientda ham ishlaydi. JSON avtomatik parse qilinadi. useFetch esa $fetch ustiga qurilgan composable — SSR da data oladi, pending/error reactive state beradi, cache va dedupe qiladi. Sahifa yuklashda useFetch, event handler larda (click, submit) $fetch ishlatiladi.',
    },
  ],
}
