import type { Topic } from '../../../types'

export const observers: Topic = {
  id: 'observers',
  title: 'Browser Observers',
  importance: 2,
  status: 'to-learn',
  description: 'IntersectionObserver, MutationObserver, ResizeObserver',
  content: `
# Browser Observers

## Observer nima?

Browser Observer — bu **asinxron kuzatuvchi** API. U DOM o'zgarishlarini samarali kuzatadi, polling (setInterval) ga qaraganda ancha yaxshi performance beradi.

## IntersectionObserver

Element **viewport** ga (yoki boshqa elementga) qanchalik ko'rinishini kuzatadi.

**Ishlatilishi:**
- Lazy loading rasmlar
- Infinite scroll
- Animatsiyalarni trigger qilish (element ko'ringanda)
- Reklama ko'rinish statistikasi
- "Back to top" tugmasini ko'rsatish

**Asosiy tushunchalar:**
- \`root\` — kuzatish konteksti (default: viewport)
- \`rootMargin\` — root atrofida margin (masalan, "100px" — 100px oldinroq trigger)
- \`threshold\` — necha foiz ko'ringanda trigger (0 = 1px, 1 = to'liq)

## MutationObserver

DOM daraxtidagi **o'zgarishlarni** kuzatadi: element qo'shilishi, o'chirilishi, attribut o'zgarishi, matn o'zgarishi.

**Ishlatilishi:**
- Third-party kutubxona DOM o'zgarishlariga reaksiya
- Content security — taqiqlangan elementlarni aniqlash
- Auto-save funksionallik
- Rich text editor o'zgarishlarni kuzatish

**Config opsiyalari:**
- \`childList\` — bolalar qo'shilishi/o'chirilishi
- \`attributes\` — attribut o'zgarishi
- \`characterData\` — matn o'zgarishi
- \`subtree\` — barcha ichki elementlar (deep)
- \`attributeFilter\` — faqat belgilangan attributlar

## ResizeObserver

Element **o'lchamining** o'zgarishini kuzatadi. \`window.onresize\` dan farqi — har bir elementni alohida kuzatadi.

**Ishlatilishi:**
- Responsive komponentlar (container queries o'rniga)
- Chart/grafik o'lchamini moslashtirish
- Virtualized list item balandligini aniqlash
- Layout shift ni kuzatish

## PerformanceObserver (bonus)

Performance metrikalarini kuzatadi: LCP, FID, CLS, resource timing va h.k.

## Observer pattern — umumiy xususiyatlar

Barcha observer lar bir xil pattern da ishlaydi:
1. Callback funksiya bilan observer yaratish
2. \`.observe(element)\` — kuzatishni boshlash
3. \`.unobserve(element)\` — bitta elementni to'xtatish
4. \`.disconnect()\` — barcha kuzatishni to'xtatish

**Muhim:** Observer callback lar **asinxron** — ular microtask yoki animation frame da bajariladi, sinxron emas.
  `.trim(),
  codeExamples: [
    {
      title: 'IntersectionObserver — lazy loading va infinite scroll',
      language: 'js',
      description: 'Element ko\'rinishini kuzatish',
      code: `// Lazy loading rasmlar
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;          // Rasmni yuklash
        img.removeAttribute('data-src');
        observer.unobserve(img);             // Endi kuzatish shart emas
      }
    });
  },
  {
    root: null,          // viewport
    rootMargin: '100px', // 100px oldinroq yuklash
    threshold: 0,        // 1px ko'rinsa yetarli
  }
);

lazyImages.forEach(img => imageObserver.observe(img));

// === Infinite Scroll ===
const sentinel = document.getElementById('sentinel'); // list oxiridagi bo'sh element

const scrollObserver = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting) {
      await loadMoreItems();
    }
  },
  { rootMargin: '200px' } // 200px oldin yuklay boshlash
);

scrollObserver.observe(sentinel);

// === Animatsiya trigger ===
const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      } else {
        entry.target.classList.remove('animate-in');
      }
    });
  },
  { threshold: 0.2 } // 20% ko'ringanda
);

document.querySelectorAll('.animate-on-scroll')
  .forEach(el => animateObserver.observe(el));`,
    },
    {
      title: 'MutationObserver — DOM o\'zgarishlarini kuzatish',
      language: 'js',
      description: 'Element qo\'shilishi, attribut o\'zgarishini kuzatish',
      code: `// DOM o'zgarishlarini kuzatish
const targetNode = document.getElementById('content');

const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    switch (mutation.type) {
      case 'childList':
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log('Qo\\'shildi:', node.tagName);
          }
        });
        mutation.removedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            console.log('O\\'chirildi:', node.tagName);
          }
        });
        break;
      case 'attributes':
        console.log(
          \`Attribut "\${mutation.attributeName}" o'zgardi:\`,
          mutation.oldValue,
          '→',
          mutation.target.getAttribute(mutation.attributeName)
        );
        break;
      case 'characterData':
        console.log('Matn o\\'zgardi:', mutation.target.textContent);
        break;
    }
  });
});

mutationObserver.observe(targetNode, {
  childList: true,           // bolalar o'zgarishi
  attributes: true,          // attributlar
  characterData: true,       // matn
  subtree: true,             // ichki elementlar ham
  attributeOldValue: true,   // eski qiymatni saqlash
  attributeFilter: ['class', 'data-status'], // faqat bu attributlar
});

// Kuzatishni to'xtatish
// mutationObserver.disconnect();

// Hali qayta ishlanmagan o'zgarishlarni olish
// const pending = mutationObserver.takeRecords();

// Amaliy misol: taqiqlangan script ni aniqlash
const securityObserver = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.tagName === 'SCRIPT' && node.src.includes('malicious')) {
        node.remove();
        console.warn('Zararli script bloklandi!');
      }
    });
  });
});
securityObserver.observe(document.head, { childList: true });`,
    },
    {
      title: 'ResizeObserver va PerformanceObserver',
      language: 'js',
      description: 'Element o\'lchamini va performance ni kuzatish',
      code: `// === ResizeObserver ===
const chart = document.getElementById('chart');

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // contentBoxSize — content maydoni
    const { inlineSize: width, blockSize: height } =
      entry.contentBoxSize[0];

    console.log(\`O'lcham: \${width}x\${height}\`);

    // Responsive logic
    if (width < 400) {
      entry.target.classList.add('compact');
    } else {
      entry.target.classList.remove('compact');
    }

    // Chart ni qayta chizish
    redrawChart(width, height);
  }
});

resizeObserver.observe(chart);

// Bir nechta elementni kuzatish
document.querySelectorAll('.resizable').forEach(el => {
  resizeObserver.observe(el);
});

// === PerformanceObserver ===
// Core Web Vitals kuzatish
const perfObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    switch (entry.entryType) {
      case 'largest-contentful-paint':
        console.log('LCP:', entry.startTime, 'ms');
        break;
      case 'first-input':
        console.log('FID:', entry.processingStart - entry.startTime, 'ms');
        break;
      case 'layout-shift':
        if (!entry.hadRecentInput) {
          console.log('CLS:', entry.value);
        }
        break;
    }
  }
});

perfObserver.observe({
  type: 'largest-contentful-paint',
  buffered: true, // oldingi yozuvlarni ham olish
});

// Tozalash — komponent unmount da
// resizeObserver.disconnect();
// perfObserver.disconnect();`,
    },
  ],
  interviewQA: [
    {
      question: 'IntersectionObserver nima va qanday ishlatiladi?',
      answer: 'IntersectionObserver — element **viewport** (yoki boshqa element) ga qanchalik ko\'rinishini asinxron kuzatuvchi API. Asosiy ishlatilishi: lazy loading rasmlar, infinite scroll, animatsiya trigger, reklama statistikasi. `root` (kuzatish konteksti), `rootMargin` (oldinroq trigger), `threshold` (necha % ko\'ringanda) opsiyalari bor.',
    },
    {
      question: 'MutationObserver ni qachon ishlatish kerak?',
      answer: 'MutationObserver DOM daraxtidagi o\'zgarishlarni kuzatadi: element qo\'shilishi/o\'chirilishi, attribut o\'zgarishi, matn o\'zgarishi. Ishlatilishi: third-party kutubxona o\'zgarishlariga reaksiya, content security (zararli script bloklash), rich text editor, auto-save. `subtree: true` bilan ichki elementlar ham kuzatiladi.',
    },
    {
      question: 'ResizeObserver va window.onresize farqi nimada?',
      answer: '`window.onresize` faqat **brauzer oynasi** o\'lchamini kuzatadi. `ResizeObserver` **har bir elementni alohida** kuzatadi — masalan, sidebar yopilganda container kengligi o\'zgarganda. Bu container queries o\'rniga responsive komponentlar yaratish, chart/grafik o\'lchamini moslashtirish uchun ishlatiladi.',
    },
    {
      question: 'Observer API larning umumiy pattern i qanday?',
      answer: 'Barcha observer lar bir xil ishlaydi: 1) Callback bilan observer yaratish: `new XObserver(callback)`. 2) `.observe(element)` — kuzatishni boshlash. 3) `.unobserve(element)` — bitta elementni to\'xtatish. 4) `.disconnect()` — hammasini to\'xtatish. Callback lar **asinxron** bo\'lib, entries massivini oladi. Memory leak oldini olish uchun `disconnect()` chaqirish muhim.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'events',
      label: 'Events',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'dom-tree',
      label: 'DOM Tree',
    },
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'observer-pattern',
      label: 'Observer Pattern',
    },
  ],
}
