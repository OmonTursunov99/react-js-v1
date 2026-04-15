import type { Topic } from '../../../types'

export const componentPatterns: Topic = {
  id: 'component-patterns',
  title: 'Vue Component Patterns',
  importance: 2,
  status: 'to-learn',
  description: 'Komponent dizayn patternlari — Compound, Renderless, Container/Presentational, HOC',
  content: `Vue 3 da komponentlarni qayta ishlatiladigan, moslashuvchan va tushunarli qilish uchun bir nechta design pattern mavjud.

═══════════════════════════════════════
  COMPOUND COMPONENTS
═══════════════════════════════════════

Compound Components — bir nechta komponent birgalikda ishlaydi, lekin har biri mustaqil. Ular provide/inject orqali ichki state ulashadi.

Misol: Accordion komponent
  <Accordion>          — state boshqaruvchi (provide)
    <AccordionItem>    — har bir element (inject)
      <AccordionHeader />
      <AccordionContent />
    </AccordionItem>
  </Accordion>

Afzalliklari:
  1. API toza — foydalanuvchi faqat slot-larni joylashtiradi
  2. Ichki logika yashirin — tashqi kod murakkablikni ko'rmaydi
  3. Moslashuvchan — istalgan tartibda joylashtirish mumkin

═══════════════════════════════════════
  RENDERLESS (HEADLESS) COMPONENTS
═══════════════════════════════════════

Renderless komponent — UI BERMAYDI, faqat logika va state beradi.
Barcha ko'rinish slot orqali tashqaridan beriladi.

  <MouseTracker v-slot="{ x, y }">
    <p>Kursor: {{ x }}, {{ y }}</p>
  </MouseTracker>

Qachon ishlatish:
  - Bir xil logika, lekin har xil UI kerak
  - Form validatsiya, drag-and-drop, infinite scroll
  - Kutubxona yaratayotganda (Headless UI)

Vue 3 da ko'pincha composable (hook) bilan almashtiriladi:
  const { x, y } = useMouse()

Lekin renderless pattern hali ham foydali — slot orqali
bola komponentlarga kontekst uzatish qulay.

═══════════════════════════════════════
  CONTAINER / PRESENTATIONAL
═══════════════════════════════════════

Container (Smart) komponent:
  - Ma'lumot oladi (API, store)
  - Biznes logika boshqaradi
  - UI bilan ishi yo'q

Presentational (Dumb) komponent:
  - Faqat props orqali ma'lumot oladi
  - Faqat UI ko'rsatadi
  - Event emit qiladi, o'zi qaror qabul qilmaydi

  <!-- Container -->
  <UserListContainer>
    <!-- Presentational -->
    <UserCard :user="user" @delete="handleDelete" />
  </UserListContainer>

Bu pattern kodni ajratadi: logika bir joyda, ko'rinish boshqa joyda.

═══════════════════════════════════════
  CONTROLLED VS UNCONTROLLED
═══════════════════════════════════════

Controlled — state TASHQARIDAN boshqariladi:
  <MyInput :modelValue="name" @update:modelValue="name = $event" />
  yoki qisqa: <MyInput v-model="name" />

Uncontrolled — state ICHKARIDA boshqariladi:
  <MyInput defaultValue="Boshlang'ich" />
  Komponent o'zi ref bilan state saqlaydi.

Vue-da v-model tufayli controlled pattern ancha oson.
React-da controlled component bo'lish MAJBURIY (value + onChange).

═══════════════════════════════════════
  WRAPPER / PROXY COMPONENT
═══════════════════════════════════════

Mavjud komponent ustiga qo'shimcha funksionallik qo'shish:

  <BaseButton>         — v-bind="$attrs" bilan barcha props uzatadi
    default slot       — kontent
  </BaseButton>

$attrs — komponentga berilgan, lekin props da e'lon qilinmagan barcha atributlar.
inheritAttrs: false qo'yib, $attrs ni qo'lda joylashtirish mumkin.

Bu pattern UI library yaratishda juda ko'p ishlatiladi.

═══════════════════════════════════════
  HIGHER-ORDER COMPONENTS (HOC)
═══════════════════════════════════════

HOC — funksiya, komponent qabul qilib, yangi komponent qaytaradi.
React-da keng tarqalgan, Vue-da KAM ishlatiladi.

Vue-da HOC o'rniga composable yoki wrapper component afzal.
Sabab: Vue template + SFC tizimi HOC bilan yaxshi ishlamaydi.

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

  Pattern             | Vue                  | React
  ────────────────────|──────────────────────|──────────────
  Compound            | provide/inject+slots | Context + children
  Renderless          | scoped slots         | Render props / hooks
  Container/Present.  | Bir xil              | Bir xil
  Controlled          | v-model              | value+onChange
  Wrapper             | $attrs, inheritAttrs | ...rest props spread
  HOC                 | Kam ishlatiladi      | Keng tarqalgan

XULOSA: Vue-da composable (Composition API) ko'p patternlarni
almashtirib yuboradi. React-da hooks xuddi shu vazifani bajaradi.`,
  codeExamples: [
    {
      title: 'Compound Components — Accordion',
      language: 'html',
      code: `<!-- Accordion.vue -->
<script setup lang="ts">
import { provide, ref } from "vue"

const activeId = ref<string | null>(null)

function toggle(id: string) {
  activeId.value = activeId.value === id ? null : id
}

provide("accordion", { activeId, toggle })
</script>

<template>
  <div class="accordion">
    <slot />
  </div>
</template>


<!-- AccordionItem.vue -->
<script setup lang="ts">
import { inject, computed } from "vue"

const props = defineProps<{ id: string }>()
const { activeId, toggle } = inject("accordion")!

const isOpen = computed(() => activeId.value === props.id)
</script>

<template>
  <div class="accordion-item">
    <button @click="toggle(id)" class="accordion-header">
      <slot name="header" />
      <span>{{ isOpen ? "▲" : "▼" }}</span>
    </button>
    <div v-show="isOpen" class="accordion-content">
      <slot />
    </div>
  </div>
</template>


<!-- Foydalanish -->
<!-- <Accordion>
  <AccordionItem id="1">
    <template #header>Savol 1</template>
    Javob 1
  </AccordionItem>
  <AccordionItem id="2">
    <template #header>Savol 2</template>
    Javob 2
  </AccordionItem>
</Accordion> -->`,
      description: 'provide/inject orqali compound pattern — komponentlar ichki state ulashadi.',
    },
    {
      title: 'Renderless Component — MouseTracker',
      language: 'html',
      code: `<!-- MouseTracker.vue — faqat logika, UI yo'q -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const x = ref(0)
const y = ref(0)

function update(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
}

onMounted(() => window.addEventListener("mousemove", update))
onUnmounted(() => window.removeEventListener("mousemove", update))
</script>

<template>
  <!-- Faqat slot — UI tashqaridan beriladi -->
  <slot :x="x" :y="y" />
</template>


<!-- Foydalanish 1 — oddiy matn -->
<!-- <MouseTracker v-slot="{ x, y }">
  <p>Kursor: {{ x }}px, {{ y }}px</p>
</MouseTracker> -->

<!-- Foydalanish 2 — vizual element -->
<!-- <MouseTracker v-slot="{ x, y }">
  <div
    class="cursor-dot"
    :style="{ left: x + 'px', top: y + 'px' }"
  />
</MouseTracker> -->


<!-- Composable alternativa (Vue 3 da afzalroq): -->
<!-- import { useMouse } from "./composables/useMouse"
const { x, y } = useMouse() -->`,
      description: 'Renderless komponent logika beradi, UI scoped slot orqali tashqaridan keladi.',
    },
    {
      title: 'Wrapper / Proxy Component',
      language: 'html',
      code: `<!-- BaseButton.vue — barcha native atributlarni uzatadi -->
<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}>()

// inheritAttrs: false — $attrs ni qo'lda joylashtirish uchun
defineOptions({ inheritAttrs: false })
</script>

<template>
  <button
    v-bind="$attrs"
    :class="[
      'btn',
      'btn-' + (variant ?? 'primary'),
      'btn-' + (size ?? 'md'),
      { 'btn-loading': loading }
    ]"
    :disabled="loading || ($attrs.disabled as boolean)"
  >
    <span v-if="loading" class="spinner" />
    <slot />
  </button>
</template>


<!-- Foydalanish — barcha native atributlar ishlaydi -->
<!-- <BaseButton
  variant="danger"
  size="lg"
  :loading="isSaving"
  @click="save"
  type="submit"
  aria-label="Saqlash"
>
  Saqlash
</BaseButton> -->

<!-- type, aria-label, @click — $attrs orqali uzatiladi -->`,
      description: '$attrs va inheritAttrs:false bilan wrapper komponent — barcha atributlar ichki elementga uzatiladi.',
    },
    {
      title: 'Container / Presentational pattern',
      language: 'html',
      code: `<!-- UserListContainer.vue — SMART (logika) -->
<script setup lang="ts">
import { ref, onMounted } from "vue"
import UserList from "./UserList.vue"

interface User {
  id: number
  name: string
  email: string
}

const users = ref<User[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await fetch("/api/users")
    users.value = await res.json()
  } catch (e) {
    error.value = "Foydalanuvchilar yuklanmadi"
  } finally {
    loading.value = false
  }
})

function deleteUser(id: number) {
  users.value = users.value.filter(u => u.id !== id)
}
</script>

<template>
  <div v-if="loading">Yuklanmoqda...</div>
  <div v-else-if="error">{{ error }}</div>
  <UserList v-else :users="users" @delete="deleteUser" />
</template>


<!-- UserList.vue — DUMB (faqat UI) -->
<!-- <script setup lang="ts">
interface User { id: number; name: string; email: string }

defineProps<{ users: User[] }>()
const emit = defineEmits<{ delete: [id: number] }>()
</script>

<template>
  <ul class="user-list">
    <li v-for="user in users" :key="user.id">
      <span>{{ user.name }} ({{ user.email }})</span>
      <button @click="emit('delete', user.id)">O'chirish</button>
    </li>
  </ul>
</template> -->`,
      description: 'Container logika boshqaradi, Presentational faqat props oladi va UI ko`rsatadi.',
    },
    {
      title: 'Controlled vs Uncontrolled — defineModel',
      language: 'html',
      code: `<!-- ControlledInput.vue — v-model bilan boshqariladigan -->
<script setup lang="ts">
// Vue 3.4+ — defineModel()
const model = defineModel<string>({ required: true })
</script>

<template>
  <input
    :value="model"
    @input="model = ($event.target as HTMLInputElement).value"
    class="input"
  />
</template>


<!-- UncontrolledInput.vue — ichki state bilan -->
<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{ defaultValue?: string }>()
const emit = defineEmits<{ change: [value: string] }>()

const internal = ref(props.defaultValue ?? "")

function handleInput(e: Event) {
  internal.value = (e.target as HTMLInputElement).value
  emit("change", internal.value)
}
</script>

<template>
  <input :value="internal" @input="handleInput" class="input" />
</template>


<!-- Foydalanish -->
<!-- Controlled: parent state ni boshqaradi -->
<!-- <ControlledInput v-model="username" /> -->

<!-- Uncontrolled: komponent o'zi boshqaradi -->
<!-- <UncontrolledInput
  defaultValue="Admin"
  @change="val => console.log(val)"
/> -->`,
      description: 'Controlled — tashqaridan v-model bilan. Uncontrolled — ichki ref bilan o`zi boshqaradi.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue da Compound Components pattern qanday amalga oshiriladi?',
      answer: `Vue da Compound Components provide/inject va slots orqali amalga oshiriladi. Ota komponent provide bilan ichki state va metodlarni beradi, bola komponentlar inject bilan oladi. Masalan, Accordion ota activeId va toggle funksiyani provide qiladi, AccordionItem inject bilan oladi va o'z id sini solishtiradi. Bu pattern API ni toza saqlaydi — foydalanuvchi faqat komponentlarni slot ichiga joylashtiradi. React da xuddi shu pattern Context API + children/cloneElement orqali amalga oshiriladi.`,
    },
    {
      question: 'Renderless komponent nima va Vue 3 da uning o`rniga nima ishlatiladi?',
      answer: `Renderless komponent UI bermaydi — faqat logika va state ni scoped slot orqali tashqariga chiqaradi. Masalan, MouseTracker komponent x, y koordinatalarni slot ga beradi, UI tashqaridan aniqlanadi. Vue 3 da Composition API kelgandan keyin ko'p hollarda composable (custom hook) afzalroq — const { x, y } = useMouse(). Lekin renderless pattern hali ham foydali: slot orqali bola komponentlarga kontekst uzatish, yoki kutubxona tarkibida UI-free logika berish uchun. React da bu "render props" pattern deb ataladi va hooks bilan almashtirilgan.`,
    },
    {
      question: 'Vue da $attrs va inheritAttrs nima uchun kerak?',
      answer: `$attrs — komponentga berilgan lekin props da e'lon qilinmagan barcha atributlar (class, style, id, aria-*, event-lar). Default holatda ular root elementga avtomatik tushadi (inheritAttrs: true). inheritAttrs: false qo'yib, $attrs ni v-bind="$attrs" orqali kerakli ichki elementga qo'lda joylashtirish mumkin. Bu wrapper/proxy komponent yaratishda juda muhim — BaseButton, BaseInput kabi komponentlarda barcha native atributlar ichki button/input ga uzatiladi. React da bu ...rest props spread bilan amalga oshiriladi.`,
    },
    {
      question: 'Container/Presentational pattern hali ham dolzarbmi?',
      answer: `Ha, lekin Vue 3 Composition API bilan uning ahamiyati kamaydi. Avvallari bu pattern logika va UI ni ajratishning asosiy usuli edi. Hozir composable lar yordamida logikani alohida funksiyalarga chiqarish mumkin — bu Container komponent yaratishdan ko'ra sodda. Lekin katta loyihalarda bu pattern hali ham foydali: API bilan ishlaydigan "smart" komponent va faqat props oladigan "dumb" komponent ajratish kodni tushunarliroq qiladi, testlashni osonlashtiradi.`,
    },
    {
      question: 'Vue da HOC (Higher-Order Component) nima uchun kam ishlatiladi?',
      answer: `Vue da HOC kam ishlatilishining sababi — Vue SFC (Single File Component) tizimi va template sintaksisi HOC bilan yaxshi mos kelmaydi. React da HOC oddiy: funksiya komponent oladi, yangi komponent qaytaradi. Vue da esa SFC template, script, style dan iborat — buni funksiya bilan o'rash qiyin. Vue 3 da composable (Composition API) va scoped slots HOC ning barcha vazifalarini bajaradi va ancha sodda. Shuning uchun Vue hamjamiyatida HOC o'rniga composable yoki wrapper component ishlatish tavsiya qilinadi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'provide-inject', label: 'Provide / Inject' },
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'slots', label: 'Slots' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'dynamic-components', label: 'Dynamic Components' },
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
  ],
}
