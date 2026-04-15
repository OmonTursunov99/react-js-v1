import type { Topic } from '../../../types'

export const renderFunctions: Topic = {
  id: 'render-functions',
  title: 'Render Functions',
  importance: 2,
  status: 'to-learn',
  description: 'h() funksiyasi, VNode yaratish, JSX Vue-da, funksional komponentlar',
  content: `Render funksiyalari — Vue template-ning alternativ usuli bo'lib, JavaScript yordamida VNode (Virtual DOM node) yaratish imkonini beradi. Template 95% hollarda yetarli, lekin murakkab dinamik UI uchun render funksiyalari kuchliroq.

═══════════════════════════════════════
  h() FUNKSIYASI (HYPERSCRIPT)
═══════════════════════════════════════

h() — "hyperscript" degan ma'noni anglatadi. Bu funksiya VNode yaratadi:

  h(type, props?, children?)

  type — string (HTML tag) yoki komponent
  props — attributlar, eventlar, class, style
  children — string, VNode massivi yoki slot funksiyalar

Oddiy misol:
  h('div', { class: 'container' }, [
    h('h1', null, 'Salom'),
    h('p', { onClick: handler }, 'Matn')
  ])

Natija template bilan bir xil:
  <div class="container">
    <h1>Salom</h1>
    <p @click="handler">Matn</p>
  </div>

═══════════════════════════════════════
  QACHON RENDER FUNKSIYA ISHLATILADI?
═══════════════════════════════════════

1. Juda dinamik komponentlar — tag nomi runtime-da aniqlanadi
2. Programmatik komponent yaratish — massivdan UI generatsiya
3. Kutubxona/library yozishda — moslashuvchanlik kerak
4. Higher-Order Components — komponentni o'rab qaytarish
5. Murakkab slot manipulyatsiya — slotlarni transform qilish

Ko'p hollarda template yetarli va tezroq — faqat kerak bo'lganda render function ishlating!

═══════════════════════════════════════
  JSX VUE-DA
═══════════════════════════════════════

Vue JSX qo'llab-quvvatlaydi — @vitejs/plugin-vue-jsx plagini orqali.
JSX h() funksiyasiga kompilyatsiya qilinadi.

  // vite.config.ts
  import vueJsx from '@vitejs/plugin-vue-jsx'
  export default { plugins: [vue(), vueJsx()] }

  // Komponentda:
  setup() {
    const count = ref(0)
    return () => (
      <div>
        <h1>Count: {count.value}</h1>
        <button onClick={() => count.value++}>+1</button>
      </div>
    )
  }

ESLATMA: Vue JSX React JSX dan farqli:
- class (className emas), onClick (React bilan bir xil)
- v-model, v-show direktivlari ishlaydi
- Slot sintaksisi farqli: {slots.default?.()}

═══════════════════════════════════════
  FUNKSIONAL KOMPONENTLAR
═══════════════════════════════════════

Vue 3-da funksional komponent — oddiy funksiya:

  function Heading(props, { slots }) {
    return h('h' + props.level, {}, slots.default?.())
  }
  Heading.props = ['level']

Vue 3-da funksional komponentlar deyarli afzallik bermaydi —
stateful komponentlar ham yetarlicha tez.

═══════════════════════════════════════
  resolveComponent & resolveDirective
═══════════════════════════════════════

Render funksiyada global ro'yxatxona komponentlarni topish:

  import { resolveComponent, resolveDirective, withDirectives } from 'vue'

  setup() {
    return () => {
      const MyComp = resolveComponent('MyGlobalComponent')
      const vTooltip = resolveDirective('tooltip')
      return withDirectives(h(MyComp, { msg: 'salom' }), [
        [vTooltip, 'Tooltip matni']
      ])
    }
  }

═══════════════════════════════════════
  REACT BILAN TAQQOSLASH
═══════════════════════════════════════

Vue render functions vs React JSX:
- React DOIM JSX/render function ishlatadi — template yo'q
- Vue-da template ASOSIY, render function QOʻSHIMCHA variant
- React-da createElement() = Vue-da h()
- React.Fragment = Vue Fragment (avtomatik)
- Vue-da v-model, v-show render function-da ham ishlaydi (withDirectives)
- React-da className, Vue-da class ishlatiladi
- Vue h() TypeScript bilan yaxshiroq tipizatsiya beradi`,
  codeExamples: [
    {
      title: 'h() bilan dinamik heading komponent',
      language: 'ts',
      code: `import { h, defineComponent, type PropType } from 'vue'

// Dinamik heading — level asosida h1-h6 yaratadi
export default defineComponent({
  name: 'DynamicHeading',
  props: {
    level: {
      type: Number as PropType<1 | 2 | 3 | 4 | 5 | 6>,
      required: true,
      validator: (v: number) => v >= 1 && v <= 6,
    },
    color: {
      type: String,
      default: 'inherit',
    },
  },
  setup(props, { slots }) {
    // Template bilan buni qilish uchun 6 ta v-if kerak!
    return () => h(
      \`h\${props.level}\`,           // dinamik tag: h1, h2, ... h6
      { style: { color: props.color } },
      slots.default?.()              // slot kontenti
    )
  },
})

// ========== Ishlatish ==========
// <DynamicHeading :level="1" color="blue">
//   Asosiy sarlavha
// </DynamicHeading>
// Natija: <h1 style="color: blue">Asosiy sarlavha</h1>`,
      description: 'h() bilan dinamik tag yaratish — template-da 6 ta v-if yozish o\'rniga bitta funksiya.',
    },
    {
      title: 'JSX komponent — @vitejs/plugin-vue-jsx',
      language: 'ts',
      code: `// components/TodoList.tsx
import { defineComponent, ref } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

export default defineComponent({
  name: 'TodoList',
  setup() {
    const todos = ref<Todo[]>([
      { id: 1, text: 'Vue o\\'rganish', done: true },
      { id: 2, text: 'Render functions', done: false },
      { id: 3, text: 'JSX syntax', done: false },
    ])

    const toggle = (id: number) => {
      const todo = todos.value.find(t => t.id === id)
      if (todo) todo.done = !todo.done
    }

    // JSX qaytarish — React ga o'xshash!
    return () => (
      <ul class="todo-list">
        {todos.value.map(todo => (
          <li
            key={todo.id}
            class={{ done: todo.done }}
            onClick={() => toggle(todo.id)}
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    )
  },
})

// Farq React dan:
// - class (className emas)
// - .value kerak (ref uchun)
// - v-model ishlaydi: <input v-model={text.value} />`,
      description: 'Vue JSX sintaksisi — React JSX ga o\'xshash, lekin Vue xususiyatlari bilan.',
    },
    {
      title: 'resolveComponent & withDirectives',
      language: 'ts',
      code: `import {
  h, defineComponent, resolveComponent,
  resolveDirective, withDirectives
} from 'vue'

export default defineComponent({
  name: 'RenderWithDirectives',
  setup() {
    return () => {
      // Global ro'yxatdagi komponentni topish
      const RouterLink = resolveComponent('RouterLink')
      const vTooltip = resolveDirective('tooltip')

      const link = h(
        RouterLink,
        { to: '/about' },
        { default: () => 'About sahifasi' }
      )

      // Direktiva qo'shish
      const button = withDirectives(
        h('button', { class: 'btn' }, 'Hover me'),
        [[vTooltip, 'Tooltip matni', '', { top: true }]]
        //          qiymat    arg  modifiers
      )

      return h('div', [link, button])
    }
  },
})`,
      description: 'Render function ichida global komponentlar va direktivalarni ishlatish.',
    },
    {
      title: 'Programmatik slot manipulyatsiya',
      language: 'ts',
      code: `import { h, defineComponent, type VNode } from 'vue'

// Har bir slot child ni wrapper bilan o'rash
export default defineComponent({
  name: 'WrappedSlot',
  props: {
    wrapperClass: { type: String, default: 'item' },
  },
  setup(props, { slots }) {
    return () => {
      const children = slots.default?.() || []

      // Har bir child node ni div bilan o'rash
      const wrapped = children.map((child: VNode, index: number) =>
        h('div', {
          class: props.wrapperClass,
          key: index,
          style: {
            padding: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            marginBottom: '8px',
          },
        }, [child])
      )

      return h('div', { class: 'wrapper-container' }, wrapped)
    }
  },
})

// ========== Ishlatish ==========
// <WrappedSlot wrapperClass="card-item">
//   <span>Birinchi</span>
//   <span>Ikkinchi</span>
//   <span>Uchinchi</span>
// </WrappedSlot>
// Natija: har biri alohida div.card-item ichida`,
      description: 'Render function bilan slot children-ni programmatik manipulyatsiya qilish — template bilan qilish qiyin.',
    },
  ],
  interviewQA: [
    {
      question: 'Vue render function qachon ishlatiladi? Template dan qanday farqi bor?',
      answer: `Render function h() bilan VNode yaratadi — template ning JavaScript alternativi. Ishlatish hollari: 1) Dinamik tag nomi (h1-h6 kabi), 2) Programmatik UI generatsiya (massivdan murakkab UI), 3) Kutubxona yozishda moslashuvchanlik, 4) Slot manipulyatsiya (children transform). Farq: Template kompilyatsiya vaqtida optimizatsiya qilinadi (static hoisting, patch flags), render function bunday optimizatsiyaga ega emas. Shuning uchun 95% hollarda template afzal.`,
    },
    {
      question: 'h() funksiyasi nima? Qanday argumentlar qabul qiladi?',
      answer: `h() — hyperscript, VNode yaratuvchi funksiya. h(type, props?, children?). type — HTML tag string yoki komponent. props — class, style, on* eventlar, boshqa attributlar. children — string, VNode massivi yoki slot funksiyalar object: { default: () => [...] }. Misol: h('div', { class: 'box', onClick: fn }, [h('span', 'Matn')]). Template ichidagi <div class="box" @click="fn"><span>Matn</span></div> bilan bir xil.`,
    },
    {
      question: 'Vue da JSX qanday ishlaydi? React JSX dan farqi nima?',
      answer: `Vue JSX — @vitejs/plugin-vue-jsx plagini orqali. JSX h() ga kompilyatsiya qilinadi. React dan farqlar: 1) class ishlatiladi (className emas), 2) ref.value kerak, 3) v-model JSX da ishlaydi: <input v-model={val.value} />, 4) v-show ishlaydi, 5) slot: {slots.default?.()} — React children dan farqli, 6) emit: <Comp onUpdate={handler} />. O'xshashlik: JSX sintaksis, map() bilan list render, key attribut.`,
    },
    {
      question: 'resolveComponent va resolveDirective nima uchun kerak?',
      answer: `Render function ichida global ro'yxatdagi komponent va direktivalarni topish uchun. Template da <RouterLink> yozganda Vue avtomatik resolve qiladi, lekin render function da qo'lda: const RL = resolveComponent('RouterLink') -> h(RL, { to: '/' }). Direktivalar uchun: const vTip = resolveDirective('tooltip') -> withDirectives(h('div'), [[vTip, 'matn']]). Faqat setup() yoki render function ichida ishlaydi.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-core', topicId: 'template-syntax', label: 'Template Syntax' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'async-components', label: 'Async Components' },
    { techId: 'vue-js', sectionId: 'vue-advanced', topicId: 'custom-directives', label: 'Custom Directives' },
    { techId: 'vue-js', sectionId: 'vue-typescript', topicId: 'tsx-components', label: 'TSX Components' },
  ],
}
