import type { Topic } from '../../../types'

export const securityVue: Topic = {
  id: 'security-vue',
  title: 'Security in Vue',
  importance: 2,
  status: 'to-learn',
  description: 'Vue xavfsizlik — XSS, v-html xavflari, CSP, CSRF, DOMPurify, input validation',
  content: `Web ilovalar xavfsizligi — senior dasturchi uchun MUHIM mavzu. Vue o'zida ba'zi himoyalar bor, lekin dasturchi ham xavfsiz kod yozishi kerak.

═══════════════════════════════════════
  XSS (Cross-Site Scripting) HIMOYA
═══════════════════════════════════════

Vue AVTOMATIK XSS himoya qiladi template interpolation orqali:

  {{ userInput }}  → avtomatik HTML escape

  <p>{{ '<script>alert("xss")</script>' }}</p>
  Natija: &lt;script&gt;alert("xss")&lt;/script&gt;
  Brauzer bu HTML sifatida ISHLAMAYDI — faqat matn ko'rinadi.

Vue template-da barcha interpolation ({{ }}) va v-bind avtomatik escape qiladi.

BU ISHLAYDI chunki Vue textContent va setAttribute ishlatadi — innerHTML EMAS.

═══════════════════════════════════════
  v-html — ENG KATTA XAVF
═══════════════════════════════════════

v-html foydalanuvchi inputini TO'G'RIDAN-TO'G'RI DOM ga qo'yadi:

  <div v-html="userContent"></div>

Agar userContent = '<img onerror="alert(document.cookie)" src="x">'
→ COOKIE O'G'IRLANISHI mumkin!

QOIDALAR:
1. HECH QACHON foydalanuvchi inputini v-html ga BERMAng
2. Agar kerak bo'lsa — SANITIZE qiling (DOMPurify)
3. Faqat ISHONCHLI manba (o'zingiz yaratgan HTML) uchun ishlatish
4. Server-dan kelgan HTML ham sanitize qilish kerak

DOMPurify bilan xavfsiz v-html:
  import DOMPurify from 'dompurify'
  const safeHtml = DOMPurify.sanitize(userInput)

═══════════════════════════════════════
  XAVFLI BINDING PATTERN-LARI
═══════════════════════════════════════

1. Dinamik href:
  <a :href="userUrl">Link</a>
  Xavf: javascript:alert('xss')
  Himoya: URL validation, faqat http/https ruxsat

2. Dinamik style:
  <div :style="userStyle">
  Xavf: background: url('javascript:...')
  Himoya: faqat ruxsat etilgan property-lar

3. Dinamik attribute nomi:
  <div :[userAttr]="value">
  Xavf: onmouseover, onclick va h.k.
  Vue BU HOLDA event attributlarni BLOKADI qiladi

4. Dinamik komponent:
  <component :is="userInput">
  Xavf: kutilmagan komponent render
  Himoya: whitelist ishlatish

═══════════════════════════════════════
  CONTENT SECURITY POLICY (CSP)
═══════════════════════════════════════

CSP — brauzerga qaysi resurslar RUXSAT etilganini aytish:

HTTP header:
  Content-Security-Policy: default-src 'self'; script-src 'self'

Vue bilan CSP:
- Pre-compiled template (SFC) — CSP bilan to'liq mos
- Runtime template compilation — 'unsafe-eval' kerak (XAVFLI)
- Inline style (v-bind CSS) — 'unsafe-inline' yoki nonce kerak

TAVSIYA: Doim pre-compiled template (SFC + Vite) ishlatish — CSP strict bo'lishi mumkin.

═══════════════════════════════════════
  CSRF (Cross-Site Request Forgery)
═══════════════════════════════════════

CSRF — zararli sayt foydalanuvchi nomidan so'rov yuborish:

Himoya usullari:
1. CSRF Token — server beradi, har bir so'rovda yuborish
2. SameSite cookie — Set-Cookie: SameSite=Strict
3. Custom header tekshirish — X-Requested-With
4. Origin/Referer header tekshirish

Vue loyihada:
  axios.defaults.headers['X-CSRF-TOKEN'] = getCsrfToken()

═══════════════════════════════════════
  INPUT VALIDATION
═══════════════════════════════════════

Client-side validation — UX uchun (xavfsizlik uchun YETARLI EMAS):
  - Required, email format, min/max length
  - Regex pattern tekshirish
  - Maxsus belgilar filtrlash

Server-side validation — MAJBURIY:
  - Har bir input SERVER-DA HAM tekshirilishi KERAK
  - Client validation osonlik bilan bypass qilinadi (DevTools)

Qoida: Client validation = UX, Server validation = XAVFSIZLIK

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Ikkalasida ham:
- Template/JSX interpolation avtomatik escape
- Xavfli HTML: v-html (Vue) = dangerouslySetInnerHTML (React)

Farqlar:
- React: dangerouslySetInnerHTML — nomi OGOHLANTIRADI
- Vue: v-html — nom unchalik ogohlantiruvchan emas
- React: JSX ichida JavaScript — ko'proq ehtiyotkorlik kerak
- Vue: template cheklovlari — kamroq xavfli pattern
- React: href="javascript:" — React 16.9+ OGOHLANTIRADI
- Vue: dinamik href uchun maxsus ogohlantirish YO'Q (o'zingiz tekshirishingiz kerak)`,
  codeExamples: [
    {
      title: 'XSS himoya va DOMPurify',
      language: 'html',
      code: `<script setup lang="ts">
import { ref, computed } from 'vue'
import DOMPurify from 'dompurify'

// Foydalanuvchi kiritgan kontent (xavfli bo'lishi mumkin)
const userInput = ref('<p>Salom</p><script>alert("xss")</script>')
const richContent = ref('')

// ✅ DOMPurify bilan sanitize
const safeHtml = computed(() =>
  DOMPurify.sanitize(userInput.value, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  })
)

// ✅ URL validation
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

const userUrl = ref('https://example.com')
const safeUrl = computed(() =>
  isValidUrl(userUrl.value) ? userUrl.value : '#'
)
</script>

<template>
  <!-- ✅ XAVFSIZ — avtomatik escape -->
  <p>{{ userInput }}</p>
  <!-- Natija: <p>Salom</p><script>... matni KO'RINADI, ishlamaydi -->

  <!-- ❌ XAVFLI — v-html sanitize-siz -->
  <!-- <div v-html="userInput"></div> -->
  <!-- HECH QACHON bunday qilmang! -->

  <!-- ✅ XAVFSIZ — DOMPurify bilan -->
  <div v-html="safeHtml"></div>
  <!-- script tag olib tashlangan, faqat p tag qoladi -->

  <!-- ✅ XAVFSIZ — URL validation -->
  <a :href="safeUrl" target="_blank" rel="noopener noreferrer">
    Link
  </a>
</template>`,
      description: 'XSS himoya: {{ }} avtomatik escape. v-html uchun DOMPurify. URL validation — faqat http/https ruxsat.',
    },
    {
      title: 'CSRF himoya va xavfsiz API so\'rovlar',
      language: 'ts',
      code: `// composables/useSecureApi.ts
import { ref } from 'vue'

// CSRF token olish (server cookie yoki meta tag orqali beradi)
function getCsrfToken(): string {
  // Meta tag dan
  const meta = document.querySelector('meta[name="csrf-token"]')
  if (meta) return meta.getAttribute('content') || ''

  // Cookie dan
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}

export function useSecureApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function secureRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'same-origin',  // Cookie yuborish
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),       // CSRF himoya
          'X-Requested-With': 'XMLHttpRequest', // AJAX marker
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}\`)
      }

      return await response.json()
    } catch (err) {
      error.value = (err as Error).message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Sensitive data — har safar token yangilash
  async function secureMutation<T>(
    url: string,
    data: unknown
  ): Promise<T | null> {
    return secureRequest<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return { isLoading, error, secureRequest, secureMutation }
}`,
      description: 'CSRF himoya: token header-da yuborish, credentials: same-origin, custom header qo\'shish.',
    },
    {
      title: 'Input validation va sanitization composable',
      language: 'ts',
      code: `// composables/useInputValidation.ts
import { ref, computed } from 'vue'

interface ValidationRule {
  check: (value: string) => boolean
  message: string
}

export function useInputValidation(rules: ValidationRule[]) {
  const value = ref('')
  const touched = ref(false)

  const errors = computed(() => {
    if (!touched.value) return []
    return rules
      .filter(rule => !rule.check(value.value))
      .map(rule => rule.message)
  })

  const isValid = computed(() => errors.value.length === 0 && touched.value)

  function touch() { touched.value = true }
  function reset() { value.value = ''; touched.value = false }

  return { value, errors, isValid, touched, touch, reset }
}

// Foydalanish:
// const email = useInputValidation([
//   { check: v => v.length > 0, message: 'Email kiritish shart' },
//   { check: v => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v), message: 'Email formati noto\'g\'ri' },
//   { check: v => !v.includes('<'), message: 'Maxsus belgilar ruxsat etilmagan' },
// ])

// Sanitize helpers
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')             // HTML tag belgilari
    .replace(/javascript:/gi, '')      // JS protocol
    .replace(/on\w+=/gi, '')           // Event handlers
    .trim()
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Faqat xavfsiz belgilar
    .replace(/\\.\\./g, '_')              // Path traversal himoya
    .slice(0, 255)                      // Uzunlik cheklash
}`,
      description: 'Input validation composable va sanitization utility-lar. Client-side validation UX uchun, server-side — xavfsizlik uchun.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue XSS dan qanday himoyalaydi?',
      answer: `Vue {{ }} template interpolation va v-bind avtomatik HTML escape qiladi. < → &lt;, > → &gt;, " → &quot;. Bu textContent va setAttribute orqali amalga oshiriladi — innerHTML emas. Shuning uchun <script> tag matn ko'rinadi, brauzer UNI ishga tushirMAYDI. LEKIN: v-html bu himoyani CHETLAB O'TADI — to'g'ridan-to'g'ri innerHTML qo'yadi. Shuning uchun v-html HECH QACHON foydalanuvchi inputi bilan ishlatilMASligi kerak (yoki DOMPurify bilan sanitize qilish).`,
    },
    {
      question: 'v-html xavflari nima va qanday xavfsiz ishlatish mumkin?',
      answer: `v-html innerHTML orqali DOM ga qo'yadi — hech qanday escape YO'Q. Xavflar: 1) <script> tag — JS kodi ishga tushadi. 2) <img onerror="..."> — event handler orqali XSS. 3) <a href="javascript:..."> — link orqali XSS. Xavfsiz ishlatish: 1) FAQAT ishonchli manba (o'zingiz yaratgan HTML). 2) DOMPurify.sanitize(html, {ALLOWED_TAGS, ALLOWED_ATTR}) — barcha xavfli tag/attr olib tashlaydi. 3) Server-side sanitize ham SHART. 4) CSP header qo'shish — qo'shimcha himoya. React analogi: dangerouslySetInnerHTML — nomi aniqroq ogohlantiradi.`,
    },
    {
      question: 'Vue loyihada CSP (Content Security Policy) qanday sozlanadi?',
      answer: `CSP brauzerga qaysi resurslar ruxsat etilganini aytadi. Vue SFC (pre-compiled) bilan: script-src 'self' — eval kerak EMAS, to'liq CSP-compatible. Runtime template compilation ishlatilsa: 'unsafe-eval' kerak — bu XAVFLI, shuning uchun doim pre-compile tavsiya. Inline styles (v-bind CSS, :style) uchun: 'unsafe-inline' yoki nonce-based strategy. Tavsiyalar: 1) SFC + Vite = pre-compile. 2) default-src 'self'. 3) script-src 'self' (cdn kerak bo'lsa qo'shing). 4) style-src 'self' 'unsafe-inline' (Vue inline style uchun). 5) img-src 'self' data: (base64 image uchun).`,
    },
    {
      question: 'CSRF himoya Vue loyihada qanday amalga oshiriladi?',
      answer: `CSRF — zararli sayt foydalanuvchi sessiyasi bilan so'rov yuborish. Himoya: 1) CSRF Token — server har sahifada noyob token beradi, client har so'rovda header-da yuboradi (X-CSRF-TOKEN). 2) SameSite cookie — Set-Cookie: SameSite=Strict/Lax — boshqa saytdan kelgan so'rovda cookie yuborilMAYDI. 3) Custom header — X-Requested-With: XMLHttpRequest — oddiy form submit bu header yuborOLMAYDI. 4) Vue implementation: axios/fetch interceptor-da CSRF token header qo'shish. 5) Double Submit Cookie — token cookie va header-da, server ikkalasini taqqoslaydi.`,
    },
    {
      question: 'Dinamik href va URL xavfsizligi haqida gapiring.',
      answer: `<a :href="userUrl"> — agar foydalanuvchi "javascript:alert(1)" yozsa, click qilganda XSS ishlaydi. Vue bu holatda OGOHLANTIRMAYDI (React 16.9+ ogohlantiradi). Himoya: 1) URL validation — faqat http/https/mailto ruxsat: new URL(input).protocol tekshiring. 2) Whitelist yondashuw — ruxsat etilgan domain-lar ro'yxati. 3) rel="noopener noreferrer" — yangi tab-da ochilganda xavfsizlik. 4) Hech qachon foydalanuvchi inputini to'g'ridan-to'g'ri href-ga bermang. Xuddi shunday: :src img uchun, :action form uchun ham tekshirish kerak.`,
    },
    {
      question: 'Vue va React xavfsizlik yondashuvlarini taqqoslang.',
      answer: `O'xshashliklar: ikkalasida {{ }}/JSX avtomatik escape, ikkalasida xavfli HTML API bor (v-html / dangerouslySetInnerHTML). Farqlar: 1) React nomi OGOHLANTIRADI — "dangerouslySetInnerHTML", Vue — oddiy "v-html". 2) React href="javascript:" da console warning beradi (16.9+), Vue bermaydi. 3) Vue template-da JavaScript cheklangan — kamroq xavfli pattern. JSX-da to'liq JS — ko'proq ehtiyotkorlik kerak. 4) Vue :style injection — Vue3 xavfli CSS qiymatlarni FILTRLAYLI, React inline style ob'ekt — xavfsizroq. 5) Ikkalasida CSP masalasi: runtime template/eval kerak bo'lsa — CSP muammo.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'directives', label: 'Direktivalar' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'compiler-optimizations', label: 'Compiler optimizatsiyalari' },
    { techId: 'vue-js', sectionId: 'vue-theory', topicId: 'vue-ecosystem', label: 'Vue ekotizimi' },
  ],
}
