import type { Topic } from '../../../types'

export const restVsGraphql: Topic = {
    id: 'rest-vs-graphql',
    title: 'REST vs GraphQL',
    importance: 2,
    status: 'to-learn',
    description: 'Farqi, qachon nima ishlatiladi',
    content: `REST va GraphQL — API arxitektura usullari. Har birining kuchli va zaif tomonlari bor.

═══════════════════════════════════════
  REST
═══════════════════════════════════════

  GET /api/users          — barcha userlar
  GET /api/users/123      — bitta user
  POST /api/users         — yangi user
  PUT /api/users/123      — yangilash
  DELETE /api/users/123   — o'chirish

  ✅ Oddiy va tushunarli
  ✅ HTTP cache ishlatadi
  ✅ Keng tarqalgan (standart)
  ✅ Har endpoint o'z URL-i

  ❌ Over-fetching (kerakdan ortiq data)
  ❌ Under-fetching (bitta sahifa uchun ko'p so'rov)
  ❌ Versiya boshqarish (/v1/, /v2/)

═══════════════════════════════════════
  GRAPHQL
═══════════════════════════════════════

Bitta endpoint, client NIMA KERAKLIGINI aytadi:

  POST /graphql
  {
    query: "{ user(id: 123) { name, email, posts { title } } }"
  }

  ✅ Client kerakli ma'lumotni tanlaydi (over-fetching yo'q)
  ✅ Bitta so'rov bilan ko'p data (under-fetching yo'q)
  ✅ Strong typing (schema)
  ✅ Introspection (self-documenting)

  ❌ Murakkabrok (o'rganish, setup)
  ❌ HTTP cache qiyin (bitta endpoint)
  ❌ N+1 query muammosi (server da)
  ❌ Over-engineering kichik loyihalar uchun

═══════════════════════════════════════
  QACHON NIMA
═══════════════════════════════════════

REST: ko'p hollarda, oddiy CRUD, kichik-o'rta loyiha, public API.
GraphQL: murakkab data talablar, mobil + web (farqli data kerak), katta loyiha, microservice aggregation.`,
    codeExamples: [
      {
        title: 'REST vs GraphQL — React-da',
        language: 'tsx',
        code: `// ===== REST bilan (TanStack Query) =====
function UserProfile({ userId }: { userId: string }) {
  // 3 ta alohida so'rov kerak
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
  })

  const { data: posts } = useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetch(\`/api/users/\${userId}/posts\`).then(r => r.json()),
    enabled: !!user,
  })

  const { data: followers } = useQuery({
    queryKey: ['users', userId, 'followers'],
    queryFn: () => fetch(\`/api/users/\${userId}/followers\`).then(r => r.json()),
    enabled: !!user,
  })

  // 3 ta so'rov, user-dan ko'p keraksiz maydon kelishi mumkin
  return <div>...</div>
}

// ===== GraphQL bilan =====
// BITTA so'rov — faqat kerakli maydonlar
const USER_PROFILE_QUERY = \`
  query UserProfile($id: ID!) {
    user(id: $id) {
      name
      avatar
      posts(limit: 5) {
        id
        title
      }
      followersCount
    }
  }
\`

function UserProfile({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: USER_PROFILE_QUERY,
        variables: { id: userId },
      }),
    }).then(r => r.json()).then(r => r.data),
  })

  // 1 ta so'rov, faqat kerakli maydonlar
  return <div>...</div>
}`,
        description: 'REST: 3 ta alohida endpoint, over-fetching mumkin. GraphQL: 1 ta so\'rov, faqat kerakli maydonlar. Murakkab sahifalar uchun GraphQL kamroq so\'rov.',
      },
    ],
    interviewQA: [
      {
        question: 'REST va GraphQL farqi nima?',
        answer: `REST: har resurs uchun alohida endpoint (/users, /posts), HTTP metod bilan CRUD, HTTP cache ishlaydi, oddiy va keng tarqalgan. GraphQL: bitta endpoint (/graphql), client kerakli ma'lumotni query bilan tanlaydi, strong typing (schema), introspection. REST muammo: over-fetching (keraksiz data) va under-fetching (ko'p so'rov). GraphQL yechadi: faqat kerakli maydonlar, bitta so'rovda ko'p data.`,
      },
      {
        question: 'Qachon REST, qachon GraphQL?',
        answer: `REST: ko'p hollarda yetarli, oddiy CRUD, public API, kichik-o'rta loyiha, HTTP caching muhim. GraphQL: murakkab va bog'liq data (user+posts+comments bitta so'rovda), mobil + web (farqli data talablar), microservice aggregation (bitta GraphQL gateway), real-time (subscriptions). Kichik loyihalar uchun GraphQL over-engineering — REST yetarli. Katta loyihalar uchun GraphQL vaqtni tejaydi.`,
      },
    ],
    relatedTopics: [
      { techId: 'react-js', sectionId: 'state-management', topicId: 'tanstack-query', label: 'TanStack Query' },
      { techId: 'react-js', sectionId: 'state-management', topicId: 'rtk-query', label: 'RTK Query' },
    ],
  }
