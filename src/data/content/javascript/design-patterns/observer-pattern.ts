import type { Topic } from '../../../types'

export const observerPattern: Topic = {
  id: 'observer-pattern',
  title: 'Observer / Pub-Sub Pattern',
  importance: 3,
  status: 'to-learn',
  description: 'Observer/pub-sub, EventEmitter, custom implementation',
  content: `
# Observer / Pub-Sub Pattern

## Observer nima?

Observer (kuzatuvchi) — bir obyekt (**subject**) holatini kuzatuvchi bir nechta obyektlar (**observers**) bo'lib, subject o'zgarganda barcha observer lar avtomatik xabardor qilinadi.

## Observer vs Pub/Sub

| Xususiyat | Observer | Pub/Sub |
|-----------|----------|---------|
| Bog'lanish | Subject observer larni biladi | Bir-birini bilmaydi |
| Vositachi | Yo'q — to'g'ridan-to'g'ri | **Event bus** vositachi |
| Coupling | Tighter | Looser |
| Misol | DOM events, RxJS | EventEmitter, Redis Pub/Sub |

## Hayotiy misollar

- **DOM events** — \`addEventListener\` / \`removeEventListener\`
- **React state** — state o'zgarganda komponentlar qayta renderlanadi
- **Redux** — \`store.subscribe()\`
- **Vue reactivity** — \`watch\`, \`watchEffect\`
- **Node.js EventEmitter** — \`on\`, \`emit\`, \`off\`
- **RxJS Observables** — stream-based observer
- **WebSocket** — real-time ma'lumotlar

## EventEmitter pattern

Node.js ning EventEmitter class i observer pattern ning eng mashxur implementatsiyasi:
- \`on(event, callback)\` — obuna bo'lish
- \`off(event, callback)\` — obunani bekor qilish
- \`emit(event, ...args)\` — event chiqarish
- \`once(event, callback)\` — faqat bir marta ishlash

## Amaliy qo'llanilishi

1. **State management** — store o'zgarganda UI yangilanadi
2. **Real-time ilovalar** — chat, notification
3. **Form validation** — maydon o'zgarganda validatsiya
4. **Logging** — turli joy larda log yozish
5. **Undo/Redo** — o'zgarishlarni kuzatish

## Xotira boshqarish

Observer pattern da **memory leak** eng katta xavf. Obunani **bekor qilishni unutmang**:
- React da \`useEffect\` cleanup
- Komponent destroy bo'lganda \`off()\` chaqirish
- \`WeakRef\` / \`FinalizationRegistry\` ishlatish
  `.trim(),
  codeExamples: [
    {
      title: 'EventEmitter — to\'liq implementatsiya',
      language: 'js',
      description: 'Pub/Sub pattern ning amaliy implementatsiyasi',
      code: `class EventEmitter {
  #events = new Map();

  // Obuna bo'lish
  on(event, callback) {
    if (!this.#events.has(event)) {
      this.#events.set(event, new Set());
    }
    this.#events.get(event).add(callback);

    // Unsubscribe funksiya qaytarish
    return () => this.off(event, callback);
  }

  // Faqat bir marta ishlash
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    wrapper._original = callback; // off() uchun
    return this.on(event, wrapper);
  }

  // Obunani bekor qilish
  off(event, callback) {
    const listeners = this.#events.get(event);
    if (!listeners) return;

    listeners.delete(callback);
    // once() wrapper ni ham tekshirish
    listeners.forEach(fn => {
      if (fn._original === callback) listeners.delete(fn);
    });

    if (listeners.size === 0) {
      this.#events.delete(event);
    }
  }

  // Event chiqarish
  emit(event, ...args) {
    const listeners = this.#events.get(event);
    if (!listeners) return false;

    listeners.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(\`Event "\${event}" handler xatosi:\`, error);
      }
    });
    return true;
  }

  // Barcha listener larni o'chirish
  removeAllListeners(event) {
    if (event) {
      this.#events.delete(event);
    } else {
      this.#events.clear();
    }
  }

  // Listener sonini olish
  listenerCount(event) {
    return this.#events.get(event)?.size ?? 0;
  }
}

// Ishlatish
const emitter = new EventEmitter();

const unsub = emitter.on('message', (data) => {
  console.log('Xabar:', data);
});

emitter.once('connect', () => {
  console.log('Ulandi (faqat bir marta)');
});

emitter.emit('connect'); // "Ulandi"
emitter.emit('connect'); // hech narsa — once edi
emitter.emit('message', { text: 'Salom' }); // "Xabar: {text: 'Salom'}"

unsub(); // obunani bekor qilish`,
    },
    {
      title: 'Observer Pattern — Store implementatsiya',
      language: 'js',
      description: 'Redux-ga o\'xshash oddiy store',
      code: `// Oddiy reactive store — Observer pattern
class Store {
  #state;
  #listeners = new Set();
  #reducer;

  constructor(reducer, initialState) {
    this.#reducer = reducer;
    this.#state = initialState;
  }

  getState() {
    return this.#state;
  }

  dispatch(action) {
    const prevState = this.#state;
    this.#state = this.#reducer(this.#state, action);

    // Faqat state o'zgarganda xabardor qilish
    if (prevState !== this.#state) {
      this.#notify();
    }
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    // Unsubscribe funksiyasi
    return () => this.#listeners.delete(listener);
  }

  #notify() {
    this.#listeners.forEach(listener => listener(this.#state));
  }
}

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          done: false,
        }],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };
    default:
      return state;
  }
}

// Ishlatish
const store = new Store(todoReducer, { todos: [] });

// Observer — UI yangilash
const unsub = store.subscribe((state) => {
  console.log('Todos:', state.todos.length);
  renderUI(state);
});

store.dispatch({ type: 'ADD_TODO', payload: 'TypeScript o\\'rganish' });
store.dispatch({ type: 'ADD_TODO', payload: 'React patterns' });
store.dispatch({ type: 'TOGGLE_TODO', payload: store.getState().todos[0].id });

unsub(); // cleanup`,
    },
    {
      title: 'Typed EventEmitter va amaliy misol',
      language: 'ts',
      description: 'TypeScript bilan type-safe events',
      code: `// TypeScript bilan type-safe EventEmitter
type EventMap = {
  'user:login': { userId: string; name: string };
  'user:logout': { userId: string };
  'notification': { message: string; type: 'info' | 'error' };
};

class TypedEmitter<T extends Record<string, unknown>> {
  private events = new Map<keyof T, Set<(data: any) => void>>();

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off<K extends keyof T>(event: K, callback: (data: T[K]) => void) {
    this.events.get(event)?.delete(callback);
  }

  emit<K extends keyof T>(event: K, data: T[K]) {
    this.events.get(event)?.forEach(cb => cb(data));
  }
}

// Ishlatish — to'liq type-safety!
const bus = new TypedEmitter<EventMap>();

// TypeScript xato beradi agar noto'g'ri data bersa
bus.on('user:login', (data) => {
  console.log(data.name); // TS biladi: { userId, name }
});

bus.on('notification', (data) => {
  console.log(data.message, data.type); // TS biladi: { message, type }
});

bus.emit('user:login', { userId: '1', name: 'Ali' }); // OK
// bus.emit('user:login', { wrong: true }); // TS XATO!`,
    },
  ],
  interviewQA: [
    {
      question: 'Observer pattern nima va qayerda ishlatiladi?',
      answer: 'Observer — bir obyekt (subject) holatini kuzatuvchi bir nechta obyektlar (observers) bo\'lib, subject o\'zgarganda barcha observer lar avtomatik xabardor qilinadi. Ishlatilishi: DOM events (`addEventListener`), React/Vue reactivity, Redux `subscribe()`, Node.js EventEmitter, WebSocket, RxJS Observables.',
    },
    {
      question: 'Observer va Pub/Sub farqi nimada?',
      answer: 'Observer da subject observer larni **to\'g\'ridan-to\'g\'ri biladi** (tight coupling). Pub/Sub da esa **event bus vositachi** orqali muloqot bo\'ladi — publisher va subscriber bir-birini **bilmaydi** (loose coupling). Pub/Sub yanada moslashuvchan, lekin debug qilish qiyinroq.',
    },
    {
      question: 'Observer pattern da memory leak qanday oldini olish mumkin?',
      answer: 'Asosiy qoida: **har doim unsubscribe qilish**. Usullari: 1) `on()` dan qaytgan unsubscribe funksiyasini saqlash va chaqirish. 2) React da `useEffect` cleanup. 3) Komponent destroy da `removeAllListeners()`. 4) `WeakRef` ishlatish — observer garbage collect bo\'lganda avtomatik tozalanadi. 5) `once()` metodi — bir marta ishlaydi va o\'zi tozalanadi.',
    },
    {
      question: 'EventEmitter ni qanday implement qilasiz?',
      answer: 'Asosiy tuzilma: `Map<string, Set<Function>>` — har bir event nomi uchun callback lar to\'plami. Metodlar: `on(event, cb)` — Set ga qo\'shish, `off(event, cb)` — Set dan o\'chirish, `emit(event, ...args)` — barcha callback larni chaqirish, `once(event, cb)` — wrapper yaratib, bir marta ishlagandan keyin o\'zi off qiladi. `on()` dan unsubscribe funksiya qaytarish best practice.',
    },
    {
      question: 'JavaScript da Observer pattern ning real-world misollari?',
      answer: 'Ko\'p: 1) **DOM events** — `addEventListener/removeEventListener`. 2) **React useState** — state o\'zgarganda re-render. 3) **Redux store.subscribe()** — state o\'zgarishini kuzatish. 4) **Vue watch/watchEffect** — reactive data kuzatish. 5) **Node.js EventEmitter** — server events. 6) **RxJS** — Observable/Subject. 7) **MutationObserver** — DOM o\'zgarishi.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'singleton',
      label: 'Singleton Pattern',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'events',
      label: 'DOM Events',
    },
    {
      techId: 'javascript',
      sectionId: 'dom-browser',
      topicId: 'observers',
      label: 'Browser Observers',
    },
  ],
}
