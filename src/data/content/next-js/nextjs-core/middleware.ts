import type { Topic } from '../../../types'

export const middleware: Topic = {
  id: 'middleware',
  title: 'Middleware',
  importance: 2,
  status: 'to-learn',
  description: 'Next.js middleware — so\'rovlarni tutib olish, redirect, rewrite qilish',
  content: `Middleware — so'rov server ga yetib bormasdan OLDIN ishlovchi funksiya. U src/ yoki app/ papkasining ildizida middleware.ts faylida yoziladi.

═══════════════════════════════════════
  ASOSIY TUSHUNCHA
═══════════════════════════════════════

Middleware har bir so'rovda Edge Runtime da ishlaydi.
U response qaytarmasdan OLDIN so'rovni o'zgartirishi mumkin:

- Redirect (yo'naltirish)
- Rewrite (URL o'zgartirish)
- Headers qo'shish/o'zgartirish
- Cookie o'rnatish
- Response qaytarish (sahifaga yetkazmasdan)

═══════════════════════════════════════
  MIDDLEWARE.TS JOYLASHUVI
═══════════════════════════════════════

  project/
  ├── src/
  │   ├── middleware.ts    ← SHU YERDA
  │   └── app/
  └── package.json

MUHIM: Faqat BITTA middleware.ts bo'lishi mumkin!
U loyihaning ildizida (yoki src/ ichida) joylashadi.

═══════════════════════════════════════
  MATCHER KONFIGURATSIYASI
═══════════════════════════════════════

config.matcher bilan middleware qaysi routelarda ishlashini belgilash:

  export const config = {
    matcher: [
      '/dashboard/:path*',    // dashboard va uning barcha child routelari
      '/api/:path*',           // barcha API routelari
      '/((?!_next|favicon).*)', // _next va favicon dan TASHQARI hammasi
    ],
  }

Matcher ishlatilmasa — middleware BARCHA routelarda ishlaydi
(statik fayllar, _next ham kiradi — bu yomon).

═══════════════════════════════════════
  REDIRECT VA REWRITE
═══════════════════════════════════════

Redirect — brauzer yangi URL ga yuboriladi (URL o'zgaradi):
  return NextResponse.redirect(new URL('/login', request.url))

Rewrite — ichki yo'naltirish (URL o'zgarMAYDI):
  return NextResponse.rewrite(new URL('/api/proxy', request.url))

═══════════════════════════════════════
  EDGE RUNTIME CHEKLOVLARI
═══════════════════════════════════════

Middleware Edge Runtime da ishlaydi, shuning uchun:
- Node.js API larning BARCHASI ishlamaydi (fs, path, child_process)
- Faqat Web API lar mavjud (fetch, crypto, TextEncoder)
- Bundle hajmi cheklangan (1 MB)
- DB ga to'g'ridan-to'g'ri ulanib bo'lmaydi
- Og'ir hisoblashlar bajarish mumkin EMAS

═══════════════════════════════════════
  AMALIY ISHLATISH HOLATLARI
═══════════════════════════════════════

1. Autentifikatsiya tekshirish (token bor/yo'q)
2. Lokalizatsiya (tilni aniqlash va yo'naltirish)
3. A/B testing (cookie asosida variant tanlash)
4. Bot himoyasi (User-Agent tekshirish)
5. Rate limiting (so'rovlar sonini cheklash)`,
  codeExamples: [
    {
      title: 'Autentifikatsiya middleware',
      code: `// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  // Token yo'q va himoyalangan sahifa — login ga redirect
  if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Token bor va login sahifasida — dashboard ga redirect
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/login'],
}`,
      language: 'ts',
      description: 'Token asosida himoyalangan sahifalarni tekshirish',
    },
    {
      title: 'Lokalizatsiya middleware',
      code: `// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['uz', 'ru', 'en']
const defaultLocale = 'uz'

function getLocale(request: NextRequest): string {
  // 1. Cookie dan tekshirish
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  // 2. Accept-Language header dan
  const acceptLang = request.headers.get('Accept-Language')
  if (acceptLang) {
    const preferred = acceptLang.split(',')[0].split('-')[0]
    if (locales.includes(preferred)) return preferred
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some(
    locale => pathname.startsWith(\`/\${locale}/\`) || pathname === \`/\${locale}\`
  )

  if (!hasLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(\`/\${locale}\${pathname}\`, request.url)
    )
  }
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}`,
      language: 'ts',
      description: 'Til aniqlash va tegishli locale ga yo\'naltirish',
    },
  ],
  interviewQA: [
    {
      question: 'Next.js middleware qayerda ishlaydi va nima cheklovlari bor?',
      answer: "Middleware Edge Runtime da ishlaydi — bu CDN ga yaqin serverless muhit. Cheklovlari: Node.js API lar (fs, path) ishlamaydi, faqat Web API lar mavjud, bundle 1 MB gacha, DB ga to'g'ridan-to'g'ri ulanib bo'lmaydi. Buning sababi — middleware har so'rovda tezkor ishlashi kerak.",
    },
    {
      question: 'Redirect va rewrite orasidagi farq nima?',
      answer: "Redirect (301/302) — brauzer yangi URL ga yuboriladi, foydalanuvchi yangi URL ni ko'radi, yangi HTTP so'rov ketadi. Rewrite — server ichida yo'l o'zgartiriladi, lekin brauzerda URL O'ZGARMAYDI. Masalan, /blog rewrite qilinsa /api/blog ga — foydalanuvchi /blog ko'radi lekin aslida /api/blog dan javob keladi.",
    },
    {
      question: "Nima uchun matcher ishlatish kerak?",
      answer: "Matchersiz middleware BARCHA so'rovlarda ishlaydi — statik fayllar (_next/static), rasmlar, favicon ham. Bu ortiqcha ish va sekinlik. Matcher faqat kerakli routelarni filtrlaydi. Masalan, faqat /dashboard/* va /api/* uchun middleware ishlashi yetarli bo'lsa — matcher shu routelarni belgilaydi.",
    },
    {
      question: "Middleware da qanday amaliy vazifalar bajariladi?",
      answer: "Eng ko'p ishlatiladigan holatlar: 1) Autentifikatsiya — token tekshirish va login ga redirect. 2) Lokalizatsiya — tilni aniqlash va to'g'ri locale ga yo'naltirish. 3) A/B testing — cookie orqali foydalanuvchini variant A yoki B ga yo'naltirish. 4) Headers qo'shish — CORS, security headers. 5) Rate limiting.",
    },
  ],
  relatedTopics: [
    { techId: 'next-js', sectionId: 'nextjs-core', topicId: 'routing', label: 'Routing' },
    { techId: 'next-js', sectionId: 'nextjs-advanced', topicId: 'api-routes', label: 'API Routes' },
  ],
}
