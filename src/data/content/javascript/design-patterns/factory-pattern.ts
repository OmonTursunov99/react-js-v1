import type { Topic } from '../../../types'

export const factoryPattern: Topic = {
  id: 'factory-pattern',
  title: 'Factory Pattern',
  importance: 2,
  status: 'to-learn',
  description: 'Simple factory, factory method, abstract factory',
  content: `
# Factory Pattern

## Factory nima?

Factory (fabrika) — **obyekt yaratish mantiqini** alohida joyga chiqaruvchi pattern. \`new\` operatorini to'g'ridan-to'g'ri ishlatish o'rniga, factory funksiya/klass qaysi obyektni yaratishni hal qiladi.

## Nega kerak?

1. **Yaratish mantiqini inkapsulyatsiya** — mijoz qaysi klass yaratilayotganini bilishi shart emas
2. **Moslashuvchanlik** — yangi tip qo'shish oson
3. **Murakkab yaratish** — ko'p parametrli obyektlarni qulay yaratish
4. **Testing** — mock obyektlar yaratish oson

## Factory turlari

### 1. Simple Factory
Oddiy funksiya turga qarab obyekt yaratadi:
\`\`\`js
function createUser(type) {
  if (type === 'admin') return new Admin();
  if (type === 'editor') return new Editor();
  return new Guest();
}
\`\`\`

### 2. Factory Method
Base class da yaratish metodini aniqlash, subclass lar override qiladi. Har bir subclass **o'z tipidagi** obyekt yaratadi.

### 3. Abstract Factory
Bir-biri bilan bog'liq obyektlar **oilasini** yaratadi. Masalan: LightTheme factory va DarkTheme factory — har biri o'z rangdagi button, input, card yaratadi.

## JavaScript da Factory

JS da factory juda tabiiy ishlaydi:
- Funksiya turli obyekt qaytarishi mumkin
- Class kerak emas — oddiy obyekt ham bo'ladi
- \`Object.create()\` — prototype-based factory

## Real-world misollar

- \`document.createElement('div')\` — element factory
- \`React.createElement()\` — React element factory
- \`new Error()\` vs \`TypeError()\` vs \`RangeError()\` — Error factory
- API response formatters — backend data ni UI obyektga aylantirish
- Database driver factory — turli DB ga ulanish

## Factory vs Constructor

| Factory | Constructor |
|---------|------------|
| Turli tip qaytarishi mumkin | Faqat o'z tipini |
| \`new\` shart emas | \`new\` kerak |
| Nom bilan niyatni bildiradi | Generic |
| Kesh qilishi mumkin | Har safar yangi |
  `.trim(),
  codeExamples: [
    {
      title: 'Simple Factory — turli obyektlar yaratish',
      language: 'js',
      description: 'Parametrga qarab turli obyekt qaytarish',
      code: `// Simple Factory — notification yaratish
function createNotification(type, message) {
  const base = {
    id: Date.now(),
    message,
    createdAt: new Date(),
    read: false,
  };

  switch (type) {
    case 'success':
      return { ...base, type, icon: '✅', color: 'green', duration: 3000 };
    case 'error':
      return { ...base, type, icon: '❌', color: 'red', duration: 0 }; // yopilmaydi
    case 'warning':
      return { ...base, type, icon: '⚠️', color: 'yellow', duration: 5000 };
    case 'info':
      return { ...base, type, icon: 'ℹ️', color: 'blue', duration: 4000 };
    default:
      throw new Error(\`Noma'lum notification turi: \${type}\`);
  }
}

const success = createNotification('success', 'Saqlandi!');
const error = createNotification('error', 'Xato yuz berdi');

// === User factory ===
function createUser(role, data) {
  const baseUser = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date(),
  };

  const permissions = {
    admin: ['read', 'write', 'delete', 'manage-users'],
    editor: ['read', 'write'],
    viewer: ['read'],
  };

  return {
    ...baseUser,
    role,
    permissions: permissions[role] || permissions.viewer,
    can(action) {
      return this.permissions.includes(action);
    },
  };
}

const admin = createUser('admin', { name: 'Ali', email: 'ali@mail.com' });
console.log(admin.can('delete')); // true
console.log(admin.can('fly'));    // false`,
    },
    {
      title: 'Factory Method pattern',
      language: 'js',
      description: 'Base class va subclass orqali turli obyektlar',
      code: `// Factory Method — Transport factory
class Transport {
  // Factory method — subclass override qiladi
  createVehicle() {
    throw new Error('createVehicle() ni implement qiling');
  }

  deliver(cargo) {
    const vehicle = this.createVehicle();
    console.log(\`\${vehicle.name} bilan yuk tashilmoqda: \${cargo}\`);
    vehicle.move();
    return vehicle;
  }
}

class RoadTransport extends Transport {
  createVehicle() {
    return {
      name: 'Yuk mashina',
      speed: 80,
      move() { console.log(\`🚛 Yo'lda \${this.speed} km/s\`); },
    };
  }
}

class SeaTransport extends Transport {
  createVehicle() {
    return {
      name: 'Kema',
      speed: 30,
      move() { console.log(\`🚢 Dengizda \${this.speed} km/s\`); },
    };
  }
}

class AirTransport extends Transport {
  createVehicle() {
    return {
      name: 'Samolyot',
      speed: 900,
      move() { console.log(\`✈️ Havoda \${this.speed} km/s\`); },
    };
  }
}

// Ishlatish
const road = new RoadTransport();
road.deliver('Mebel');

const sea = new SeaTransport();
sea.deliver('Konteyner');

// Transport factory
function getTransport(type) {
  const transports = {
    road: RoadTransport,
    sea: SeaTransport,
    air: AirTransport,
  };
  const TransportClass = transports[type];
  if (!TransportClass) throw new Error(\`Noma'lum transport: \${type}\`);
  return new TransportClass();
}

const transport = getTransport('air');
transport.deliver('Pochta');`,
    },
    {
      title: 'Abstract Factory va Registry pattern',
      language: 'js',
      description: 'Bir-biriga bog\'liq obyektlar oilasini yaratish',
      code: `// Abstract Factory — UI Theme
class LightThemeFactory {
  createButton(text) {
    return {
      text,
      bgColor: '#ffffff',
      textColor: '#333333',
      border: '1px solid #ccc',
      render() { console.log(\`[Light Button] \${text}\`); },
    };
  }

  createInput(placeholder) {
    return {
      placeholder,
      bgColor: '#f5f5f5',
      textColor: '#333333',
      render() { console.log(\`[Light Input] \${placeholder}\`); },
    };
  }

  createCard(title) {
    return {
      title,
      bgColor: '#ffffff',
      shadow: '0 2px 4px rgba(0,0,0,0.1)',
      render() { console.log(\`[Light Card] \${title}\`); },
    };
  }
}

class DarkThemeFactory {
  createButton(text) {
    return {
      text,
      bgColor: '#1a1a2e',
      textColor: '#e0e0e0',
      border: '1px solid #444',
      render() { console.log(\`[Dark Button] \${text}\`); },
    };
  }

  createInput(placeholder) {
    return {
      placeholder,
      bgColor: '#16213e',
      textColor: '#e0e0e0',
      render() { console.log(\`[Dark Input] \${placeholder}\`); },
    };
  }

  createCard(title) {
    return {
      title,
      bgColor: '#1a1a2e',
      shadow: '0 2px 4px rgba(0,0,0,0.5)',
      render() { console.log(\`[Dark Card] \${title}\`); },
    };
  }
}

// Ishlatish — theme factory ni tanlash
function createUI(factory) {
  const btn = factory.createButton('Yuborish');
  const input = factory.createInput('Ismingiz...');
  const card = factory.createCard('Profil');
  return { btn, input, card };
}

const darkUI = createUI(new DarkThemeFactory());
const lightUI = createUI(new LightThemeFactory());

// === Registry Pattern (factory + registration) ===
class ComponentRegistry {
  static #registry = new Map();

  static register(name, factory) {
    this.#registry.set(name, factory);
  }

  static create(name, props) {
    const factory = this.#registry.get(name);
    if (!factory) throw new Error(\`"\${name}" ro'yxatda yo'q\`);
    return factory(props);
  }
}

ComponentRegistry.register('button', (p) => ({ type: 'button', ...p }));
ComponentRegistry.register('input', (p) => ({ type: 'input', ...p }));

const btn = ComponentRegistry.create('button', { text: 'Click' });`,
    },
  ],
  interviewQA: [
    {
      question: 'Factory pattern nima va nega kerak?',
      answer: 'Factory — obyekt yaratish mantiqini alohida joy ga chiqaruvchi pattern. `new` operatorini to\'g\'ridan-to\'g\'ri ishlatish o\'rniga, factory qaysi obyektni yaratishni hal qiladi. Afzalliklari: yaratish mantiqini inkapsulyatsiya qiladi, yangi tip qo\'shish oson, testing uchun mock yaratish qulay, murakkab obyektlarni qulay yaratadi.',
    },
    {
      question: 'Simple Factory, Factory Method va Abstract Factory farqi?',
      answer: '**Simple Factory** — bitta funksiya turga qarab obyekt yaratadi. **Factory Method** — base class da yaratish metodi, subclass lar override qiladi (har biri o\'z tipidagi obyekt). **Abstract Factory** — bir-biriga **bog\'liq obyektlar oilasini** yaratadi (masalan, dark theme uchun barcha UI komponentlar). Murakkablik darajasi oshib boradi.',
    },
    {
      question: 'JavaScript da Factory qachon ishlatish kerak?',
      answer: 'Ishlatilishi: 1) Turga qarab **turli obyekt** yaratish kerak bo\'lganda. 2) Yaratish mantiqida murakkab **logika** bo\'lganda (validatsiya, default qiymatlar). 3) **Interface/protocol** ga mos obyekt kerak bo\'lganda. 4) **Testlarda** mock/stub yaratish uchun. 5) API response ni UI modelga aylantirish. Real misollar: `document.createElement()`, `React.createElement()`.',
    },
    {
      question: 'Factory va Constructor farqi nimada?',
      answer: 'Factory: `new` shart emas, **turli tip** qaytarishi mumkin, nom bilan niyatni bildiradi (`createAdmin`), kesh qilishi mumkin (bir xil parametr uchun bir xil obyekt). Constructor: `new` kerak, faqat **o\'z tipini** qaytaradi, nomi class nomi bilan bir xil. Factory moslashuvchanroq, constructor oddiyroq.',
    },
  ],
  relatedTopics: [
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'module-pattern',
      label: 'Module Pattern',
    },
    {
      techId: 'javascript',
      sectionId: 'design-patterns',
      topicId: 'strategy-pattern',
      label: 'Strategy Pattern',
    },
  ],
}
