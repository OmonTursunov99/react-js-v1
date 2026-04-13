import type { Topic } from '../../../types'

export const testingVue: Topic = {
  id: 'testing-vue',
  title: 'Vue Testing',
  importance: 2,
  status: 'to-learn',
  description: 'Vue Test Utils, Pinia testing, Vitest bilan komponent testlash',
  content: `Vue komponentlarni test qilish — Vue Test Utils + Vitest kombinatsiyasi. Bu React Testing Library + Jest/Vitest ga o'xshash, lekin Vue-ga moslashtirilgan.

═══════════════════════════════════════
  VUE TEST UTILS — ASOSLAR
═══════════════════════════════════════

Vue Test Utils — rasmiy test kutubxonasi.
Ikki asosiy funksiya: mount va shallowMount.

mount() — komponentni BARCHA bola komponentlar bilan render qiladi.
  - To'liq integration test
  - Real DOM xatti-harakati
  - Sekinroq, lekin ishonchliroq

shallowMount() — bola komponentlarni STUB qiladi.
  - Faqat shu komponent logikasi testlanadi
  - Tezroq, lekin kam ishonchli
  - Bolalar stubComponent sifatida ko'rinadi

MUHIM: React dunyosida RTL "unit test emas, integration test yoz" deydi.
Vue dunyosida ham mount() afzalroq — shallowMount faqat alohida hollarda.

═══════════════════════════════════════
  MOUNT OPSIYALARI
═══════════════════════════════════════

  import { mount } from "@vue/test-utils"

  const wrapper = mount(MyComponent, {
    props: { title: "Test", count: 5 },
    slots: {
      default: "<p>Slot kontent</p>",
      header: HeaderComponent,
    },
    global: {
      plugins: [pinia, router],
      stubs: { RouterLink: true },
      provide: { theme: "dark" },
      mocks: { $t: (key) => key },
    },
    attachTo: document.body,
  })

Wrapper metodlari:
  wrapper.find(".class")       — element topish
  wrapper.findAll("li")        — barcha elementlar
  wrapper.findComponent(Child) — bola komponent topish
  wrapper.text()               — matn olish
  wrapper.html()               — HTML olish
  wrapper.exists()             — mavjudligini tekshirish
  wrapper.classes()            — CSS klasslar
  wrapper.attributes()         — HTML attributlar

═══════════════════════════════════════
  EVENTS VA INTERACTION
═══════════════════════════════════════

  await wrapper.find("button").trigger("click")
  await wrapper.find("input").setValue("test")
  await wrapper.find("form").trigger("submit.prevent")
  await wrapper.find("select").setValue("option2")

Custom event tekshirish:
  wrapper.vm.$emit("update", "value")
  expect(wrapper.emitted("update")).toBeTruthy()
  expect(wrapper.emitted("update")![0]).toEqual(["value"])

MUHIM: trigger() dan keyin DOIM await qilish kerak —
Vue DOM yangilashni keyingi tick da qiladi.

═══════════════════════════════════════
  PINIA TESTING
═══════════════════════════════════════

createTestingPinia — test uchun Pinia instance.
Barcha action-lar avtomatik spy bo'ladi.

  import { createTestingPinia } from "@pinia/testing"

  const wrapper = mount(Component, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            counter: { count: 10 },
          },
          stubActions: false,
        }),
      ],
    },
  })

  // Store-ga kirish
  const store = useCounterStore()
  store.count = 25
  await wrapper.vm.$nextTick()

═══════════════════════════════════════
  ROUTER TESTING
═══════════════════════════════════════

RouterLink va router-view test qilish:

  import { RouterLinkStub } from "@vue/test-utils"

  const wrapper = mount(NavComponent, {
    global: {
      stubs: { RouterLink: RouterLinkStub },
    },
  })

  const links = wrapper.findAllComponents(RouterLinkStub)
  expect(links[0].props("to")).toBe("/home")

To'liq router test:
  import { createRouter, createMemoryHistory } from "vue-router"

  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/", component: Home }],
  })

  await router.push("/")
  await router.isReady()

  const wrapper = mount(App, {
    global: { plugins: [router] },
  })

═══════════════════════════════════════
  VITEST BILAN INTEGRATION
═══════════════════════════════════════

vitest.config.ts:
  - environment: "jsdom" yoki "happy-dom"
  - happy-dom tezroq, lekin kam compatibility
  - setupFiles: ["./test/setup.ts"]

Test tuzilmasi:
  src/
    components/
      UserCard.vue
      __tests__/
        UserCard.test.ts

MUHIM: React RTL bilan taqqoslaganda Vue Test Utils
ko'proq wrapper API beradi. RTL "user perspective" ga e'tibor beradi,
VTU esa komponent internals-ga ham kirish imkonini beradi.`,
  codeExamples: [
    {
      title: 'Komponent test — mount va assertion',
      language: 'ts',
      code: `import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"

// UserCard komponent
// props: id (number), name (string), role (string)
// emits: select (id: number)

// import UserCard from "../UserCard.vue"

describe("UserCard", () => {
  function createWrapper(props: { id: number; name: string; role: string }) {
    return mount(UserCard, { props })
  }

  it("props to'g'ri renderlanadi", () => {
    const wrapper = createWrapper({ id: 1, name: "Ali", role: "Admin" })

    expect(wrapper.find("h2").text()).toBe("Ali")
    expect(wrapper.find("span").text()).toBe("Admin")
    expect(wrapper.classes()).toContain("card")
  })

  it("button bosilganda select event chiqadi", async () => {
    const wrapper = createWrapper({ id: 42, name: "Vali", role: "User" })

    await wrapper.find("button").trigger("click")

    expect(wrapper.emitted("select")).toHaveLength(1)
    expect(wrapper.emitted("select")![0]).toEqual([42])
  })

  it("element mavjud emas bo'lganda", () => {
    const wrapper = createWrapper({ id: 1, name: "Ali", role: "Admin" })
    expect(wrapper.find(".non-existent").exists()).toBe(false)
  })
})`,
      description: 'Mount bilan komponent yaratish, props tekshirish, event emitting test.',
    },
    {
      title: 'Pinia store testing',
      language: 'ts',
      code: `import { describe, it, expect, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { createTestingPinia } from "@pinia/testing"
import { setActivePinia } from "pinia"

// import CartPage from "../CartPage.vue"
// import { useCartStore } from "../../stores/cart"

interface CartItem {
  id: number
  name: string
  price: number
  qty: number
}

describe("CartPage — Pinia bilan", () => {
  it("boshlang'ich state bilan renderlanadi", () => {
    const pinia = createTestingPinia({
      initialState: {
        cart: {
          items: [
            { id: 1, name: "Kitob", price: 50000, qty: 2 },
            { id: 2, name: "Ruchka", price: 5000, qty: 5 },
          ] as CartItem[],
        },
      },
    })

    const wrapper = mount(CartPage, {
      global: { plugins: [pinia] },
    })

    expect(wrapper.findAll(".cart-item")).toHaveLength(2)
    expect(wrapper.text()).toContain("Kitob")
  })

  it("store action chaqiriladi", async () => {
    const pinia = createTestingPinia({ stubActions: false })
    const wrapper = mount(CartPage, {
      global: { plugins: [pinia] },
    })

    const store = useCartStore()
    store.addItem({ id: 3, name: "Daftar", price: 10000, qty: 1 })

    await wrapper.vm.$nextTick()
    expect(store.items).toHaveLength(1)
  })

  it("stubbed action spy sifatida ishlaydi", () => {
    const pinia = createTestingPinia() // stubActions: true (default)
    setActivePinia(pinia)

    const store = useCartStore()
    store.removeItem(1)

    expect(store.removeItem).toHaveBeenCalledWith(1)
  })
})`,
      description: 'createTestingPinia — initialState, stubActions, action spy. Store-ni to`g`ridan-to`g`ri o`zgartirish mumkin.',
    },
    {
      title: 'Slot va provide/inject test',
      language: 'ts',
      code: `import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { h } from "vue"

// import Modal from "../Modal.vue"
// import ThemeButton from "../ThemeButton.vue"

describe("Slot testing", () => {
  it("default slot renderlanadi", () => {
    const wrapper = mount(Modal, {
      slots: {
        default: "<p>Modal kontent</p>",
      },
    })

    expect(wrapper.find("p").text()).toBe("Modal kontent")
  })

  it("named slot renderlanadi", () => {
    const wrapper = mount(Modal, {
      slots: {
        header: "<h2>Sarlavha</h2>",
        default: "<p>Kontent</p>",
        footer: "<button>Yopish</button>",
      },
    })

    expect(wrapper.find("h2").text()).toBe("Sarlavha")
    expect(wrapper.find("button").text()).toBe("Yopish")
  })

  it("scoped slot bilan", () => {
    const wrapper = mount(DataList, {
      slots: {
        default: (props: { item: string; index: number }) =>
          h("span", {}, props.item + " #" + props.index),
      },
    })

    expect(wrapper.text()).toContain("#0")
  })
})

describe("Provide/Inject testing", () => {
  it("provide qiymat komponentga yetadi", () => {
    const wrapper = mount(ThemeButton, {
      global: {
        provide: { theme: "dark" },
      },
    })

    expect(wrapper.classes()).toContain("dark")
  })
})`,
      description: 'Default, named, scoped slotlarni test qilish. Provide/inject mock bilan.',
    },
    {
      title: 'Router va async test',
      language: 'ts',
      code: `import { describe, it, expect, vi } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import { createRouter, createMemoryHistory } from "vue-router"
import { RouterLinkStub } from "@vue/test-utils"

// import Navigation from "../Navigation.vue"
// import UserPage from "../UserPage.vue"

describe("Router testing", () => {
  it("RouterLink to'g'ri path beradi", () => {
    const wrapper = mount(Navigation, {
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })

    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links[0].props("to")).toBe("/")
    expect(links[1].props("to")).toBe("/about")
  })

  it("to'liq router bilan navigatsiya", async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: { template: "<div>Bosh</div>" } },
        { path: "/user/:id", component: UserPage },
      ],
    })

    await router.push("/user/42")
    await router.isReady()

    const wrapper = mount(UserPage, {
      global: { plugins: [router] },
    })

    expect(wrapper.text()).toContain("42")
  })
})

describe("Async testing", () => {
  it("API call dan keyin ma'lumot ko'rinadi", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ name: "Ali", age: 25 }),
    }))

    const wrapper = mount(UserPage)

    // Barcha pending promise-larni kutish
    await flushPromises()

    expect(wrapper.text()).toContain("Ali")
    expect(fetch).toHaveBeenCalledOnce()

    vi.restoreAllMocks()
  })
})`,
      description: 'RouterLinkStub, createMemoryHistory, flushPromises — router va async operatsiyalar testi.',
    },
    {
      title: 'Composable (hook) unit test',
      language: 'ts',
      code: `import { describe, it, expect } from "vitest"
import { ref } from "vue"

// Composable — React custom hook analog
// useCounter.ts
function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)

  function increment() { count.value++ }
  function decrement() { count.value-- }
  function reset() { count.value = initial }

  return { count, doubled, increment, decrement, reset }
}

describe("useCounter composable", () => {
  it("boshlang'ich qiymat bilan ishlaydi", () => {
    const { count, doubled } = useCounter(5)

    expect(count.value).toBe(5)
    expect(doubled.value).toBe(10)
  })

  it("increment va decrement ishlaydi", () => {
    const { count, increment, decrement } = useCounter(0)

    increment()
    increment()
    expect(count.value).toBe(2)

    decrement()
    expect(count.value).toBe(1)
  })

  it("reset boshlang'ich qiymatga qaytaradi", () => {
    const { count, increment, reset } = useCounter(10)

    increment()
    increment()
    expect(count.value).toBe(12)

    reset()
    expect(count.value).toBe(10)
  })
})

// MUHIM: Composable-ni komponent siz test qilish mumkin!
// React custom hook uchun renderHook kerak,
// Vue composable oddiy funksiya — to'g'ridan-to'g'ri chaqiriladi.`,
      description: 'Vue composable = React custom hook. Lekin Vue-da mount siz, oddiy funksiya sifatida test qilinadi.',
    },
  ],
  interviewQA: [
    {
      question: 'mount() va shallowMount() farqi nima? Qaysini ishlatish kerak?',
      answer: `mount() komponentni barcha bola komponentlar bilan to'liq render qiladi — real xatti-harakat. shallowMount() bola komponentlarni stub qiladi — faqat shu komponent logikasi testlanadi. Odatda mount() afzal — chunki real integration ko'proq xato topadi. shallowMount faqat bola komponent juda sekin yoki tashqi dependency kerak bo'lganda. Bu React RTL falsafasiga o'xshash — "test as user sees it". Lekin VTU shallowMount imkonini beradi — RTL-da bunday tanlov yo'q.`,
    },
    {
      question: 'Vue Test Utils va React Testing Library farqi nimada?',
      answer: `RTL "user perspective" ga e'tibor beradi — getByText, getByRole. DOM internals ga kirmaydi. VTU ko'proq API beradi — wrapper.vm orqali komponent instance-ga kirish, wrapper.emitted() bilan custom event-larni tekshirish, findComponent bilan bola komponent topish. RTL falsafasi — "implementation detail test qilma". VTU ikkalasini ham qo'llaydi. Amalda VTU + Vitest kombinatsiyasi RTL + Jest kombinatsiyasiga teng kuch.`,
    },
    {
      question: 'Pinia store-ni qanday test qilasiz?',
      answer: `createTestingPinia({}) ishlatiladi. initialState bilan boshlang'ich state berish, stubActions: false bilan real action ishlash, yoki default (true) bilan barcha action-lar spy bo'ladi. Test ichida store-ga to'g'ridan-to'g'ri state o'zgartirish mumkin (store.count = 10). expect(store.action).toHaveBeenCalled() bilan action chaqirilganini tekshirish. Store-ni izolyatsiyada (mount siz) ham test qilish mumkin — setActivePinia(createTestingPinia()) keyin useStore().`,
    },
    {
      question: 'Async komponentlarni qanday test qilasiz?',
      answer: `1) flushPromises() — barcha pending Promise-larni resolve qiladi. API call dan keyin await flushPromises() kerak. 2) vi.stubGlobal("fetch", ...) — global fetch-ni mock qilish. 3) wrapper.vm.$nextTick() — Vue DOM yangilashini kutish. 4) trigger() dan keyin await kerak — event handler async bo'lishi mumkin. Ketma-ketlik: mount -> trigger -> flushPromises -> assert. Vitest-da vi.useFakeTimers() bilan timer-larni ham boshqarish mumkin.`,
    },
    {
      question: 'Vue composable-ni qanday test qilasiz? React custom hook dan farqi nima?',
      answer: `Vue composable oddiy funksiya — to'g'ridan-to'g'ri chaqirib test qilish mumkin: const { count, increment } = useCounter(). ref/computed qaytaradi, .value orqali tekshiriladi. React custom hook-ni test qilish uchun renderHook() kerak — chunki hook faqat komponent ichida ishlaydi. Bu Vue-ning katta afzalligi — composable-lar mustaqil, komponent kontekstiga bog'liq emas (agar provide/inject ishlatmasa). Provide kerak bo'lsa, mount() bilan test komponent yaratish kerak.`,
    },
    {
      question: 'Vue komponent testida slot-larni qanday tekshirasiz?',
      answer: `mount() opsiyalarida slots berish: default slot uchun HTML string ("<p>Test</p>"), named slot uchun { header: "<h1>Title</h1>" }, scoped slot uchun funksiya ((props) => h("span", props.item)). Template-da slot ishlatilganini wrapper.find() bilan tekshirish. Scoped slot parametrlari to'g'ri kelishini assert qilish. VTU mount opsiyalari orqali har qanday slot kombinatsiyasini simulyatsiya qilish mumkin.`,
    },
  ],
  relatedTopics: [
    { techId: 'vue-js', sectionId: 'vue-patterns', topicId: 'vue-vs-react', label: 'Vue vs React' },
    { techId: 'react-js', sectionId: 'testing', topicId: 'rtl', label: 'React Testing Library' },
    { techId: 'react-js', sectionId: 'testing', topicId: 'vitest-jest', label: 'Vitest & Jest' },
    { techId: 'react-js', sectionId: 'testing', topicId: 'mocking', label: 'Mocking Strategies' },
  ],
}
