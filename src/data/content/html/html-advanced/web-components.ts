import type { Topic } from '../../../types'

export const webComponents: Topic = {
  id: 'web-components',
  title: 'Web Components',
  importance: 2,
  status: 'to-learn',
  description: 'Custom Elements, Shadow DOM, templatelar va slotlar',
  content: `Web Components — brauzerning o'rnatilgan API si bo'lib, qayta ishlatiladigan, inkapsulyatsiyalangan UI komponentlar yaratish imkonini beradi. Framework kerak emas — sof HTML/JS bilan ishlaydi.

═══════════════════════════════════════
  3 TA ASOSIY TEXNOLOGIYA
═══════════════════════════════════════

1. Custom Elements — yangi HTML teg yaratish
2. Shadow DOM — stillarni inkapsulyatsiya qilish
3. HTML Templates — qayta ishlatiladigan HTML shablon

═══════════════════════════════════════
  CUSTOM ELEMENTS
═══════════════════════════════════════

customElements.define() — yangi teg ro'yxatdan o'tkazish.

Qoidalar:
  - Nom DOIM tire (-) bo'lishi kerak: <my-card>, <user-avatar>
  - HTMLElement dan extend qiladi
  - Lifecycle callbacklar mavjud

Lifecycle:
  connectedCallback()    — DOM ga qo'shilganda
  disconnectedCallback() — DOM dan olib tashlaganda
  attributeChangedCallback(name, old, new) — atribut o'zgarganda
  adoptedCallback()      — boshqa documentga ko'chirilganda

observedAttributes — kuzatiladigan atributlar ro'yxati (static getter)

═══════════════════════════════════════
  SHADOW DOM
═══════════════════════════════════════

Shadow DOM — komponent ichidagi DOM va stillarni tashqi sahifadan ajratadi.

  this.attachShadow({ mode: 'open' })

mode: 'open'   — tashqaridan shadowRoot ga kirish mumkin
mode: 'closed' — tashqaridan kirish mumkin EMAS

Afzalliklari:
  - Stillar tashqariga chiqmaydi
  - Tashqi stillar ichiga kirmaydi
  - DOM nomi to'qnashmasligi kafolati

═══════════════════════════════════════
  TEMPLATE VA SLOT
═══════════════════════════════════════

<template> — brauzer ko'rsatmaydigan HTML shablon.
  content.cloneNode(true) bilan nusxa olinadi.

<slot> — tashqaridan kontent kiritish joyi:
  <slot>           — default slot
  <slot name="header"> — nomlangan slot

Foydalanuvchi:
  <my-card>
    <span slot="header">Sarlavha</span>
    <p>Asosiy kontent (default slot)</p>
  </my-card>

═══════════════════════════════════════
  REACT VA WEB COMPONENTS
═══════════════════════════════════════

Web Components va React birga ishlashi mumkin:
  - React ichida <my-card> ishlatish mumkin
  - React event handling bilan biroz murakkab (ref kerak)
  - Framework-agnostic komponent kerak bo'lsa — Web Components yaxshi`,

  codeExamples: [
    {
      title: 'Custom Element yaratish',
      language: 'js',
      description: 'Shadow DOM, template va slot bilan to\'liq komponent',
      code: `// Karta komponent
class MyCard extends HTMLElement {
  constructor() {
    super()
    // Shadow DOM yaratish
    const shadow = this.attachShadow({ mode: 'open' })

    // Template
    shadow.innerHTML = \`
      <style>
        :host {
          display: block;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .header {
          background: #3b82f6;
          color: white;
          padding: 12px 16px;
          font-weight: bold;
        }
        .body {
          padding: 16px;
        }
      </style>
      <div class="header">
        <slot name="header">Standart sarlavha</slot>
      </div>
      <div class="body">
        <slot>Standart kontent</slot>
      </div>
    \`
  }

  connectedCallback() {
    console.log('Komponent DOM ga qo\\'shildi')
  }

  disconnectedCallback() {
    console.log('Komponent DOM dan olib tashlandi')
  }
}

// Tegni ro'yxatdan o'tkazish
customElements.define('my-card', MyCard)`,
    },
    {
      title: 'Atributlar bilan ishlash',
      language: 'js',
      description: 'observedAttributes va attributeChangedCallback',
      code: `class UserAvatar extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'size']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // Atribut o'zgarganda qayta render
    if (oldVal !== newVal) this.render()
  }

  get name() {
    return this.getAttribute('name') || 'Noma\\'lum'
  }

  get size() {
    return this.getAttribute('size') || '48'
  }

  render() {
    const initial = this.name.charAt(0).toUpperCase()
    this.shadowRoot.innerHTML = \`
      <style>
        .avatar {
          width: \${this.size}px;
          height: \${this.size}px;
          border-radius: 50%;
          background: #8b5cf6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: \${Number(this.size) / 2}px;
        }
      </style>
      <div class="avatar">\${initial}</div>
    \`
  }
}

customElements.define('user-avatar', UserAvatar)

// Ishlatish: <user-avatar name="Ali" size="64"></user-avatar>`,
    },
    {
      title: 'HTML template va slot',
      language: 'html',
      description: 'Template tegi va nomlangan slotlar',
      code: `<!-- Template — sahifada ko'rinmaydi -->
<template id="product-template">
  <style>
    .product { border: 1px solid #ddd; padding: 16px; }
    .product-name { font-size: 1.2em; font-weight: bold; }
    .product-price { color: #16a34a; }
  </style>
  <div class="product">
    <div class="product-name"><slot name="name">Nomi</slot></div>
    <div class="product-price"><slot name="price">Narxi</slot></div>
    <slot>Tavsif</slot>
  </div>
</template>

<!-- Ishlatish -->
<product-card>
  <span slot="name">iPhone 16</span>
  <span slot="price">$999</span>
  <p>Eng yangi Apple telefoni</p>
</product-card>

<script>
class ProductCard extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    const template = document.getElementById('product-template')
    shadow.appendChild(template.content.cloneNode(true))
  }
}
customElements.define('product-card', ProductCard)
</script>`,
    },
  ],

  interviewQA: [
    {
      question: 'Web Components nima va qanday afzalliklari bor?',
      answer: 'Web Components — brauzerning native API si: Custom Elements (yangi teglar), Shadow DOM (stillar inkapsulyatsiyasi), HTML Templates (shablonlar). Afzalliklari: 1) Framework-agnostic — React, Vue, Angular hammasida ishlaydi. 2) Inkapsulyatsiya — stillar tashqariga chiqmaydi. 3) Native — kutubxona kerak emas. 4) Qayta ishlatish mumkin — turli loyihalarda.',
    },
    {
      question: 'Shadow DOM nima va nima uchun kerak?',
      answer: 'Shadow DOM — komponent ichidagi DOM va CSS ni tashqi sahifadan to\'liq ajratadi. Ichki stillar tashqariga ta\'sir qilmaydi va tashqi stillar ichiga kirmaydi. attachShadow({ mode: "open" }) bilan yaratiladi. "open" — tashqaridan element.shadowRoot ga kirish mumkin, "closed" — mumkin emas. Bu real inkapsulyatsiya — CSS class nomi to\'qnashishi muammosi yo\'q.',
    },
    {
      question: 'Custom Element lifecycle callbacklari qaysilar?',
      answer: 'connectedCallback() — element DOM ga qo\'shilganda (mount). disconnectedCallback() — DOM dan olib tashlaganda (unmount). attributeChangedCallback(name, old, new) — kuzatilgan atribut o\'zgarganda (faqat static observedAttributes da ko\'rsatilganlar). adoptedCallback() — boshqa document ga ko\'chirilganda (kam ishlatiladi). React ning useEffect va componentDidMount ga o\'xshash.',
    },
  ],

  relatedTopics: [
    { techId: 'css', sectionId: 'css-advanced', topicId: 'custom-properties', label: 'CSS Variables' },
  ],
}
