import type { Topic } from '../../../types'

export const mixinsTopic: Topic = {
  id: 'mixins',
  title: 'Mixins',
  importance: 2,
  status: 'to-learn',
  description: 'Mixin pattern, Object.assign bilan mixins, class mixin va funksional mixin',

  content: `
# Mixins — JavaScript-da ko'p xususiyatlilik

## Mixin nima?
Mixin — bu class yoki ob'ektga **qo'shimcha xususiyat va metodlar** qo'shish pattern-i. JavaScript-da multiple inheritance yo'q, shuning uchun mixin-lar orqali bir nechta manbadan funksionallik olish mumkin.

## Nima uchun kerak?
Tasavvur qiling: \`User\` class-i bor, unga \`EventEmitter\` va \`Serializable\` xususiyatlarini qo'shmoqchisiz. Lekin \`extends\` faqat BITTA class-dan meros oladi. Mixin — bu muammoning yechimi.

## Object.assign bilan mixin
Eng sodda usul — \`Object.assign(target.prototype, mixin)\`. Bu mixin ob'ektdagi barcha metodlarni target-ning prototype-iga ko'chiradi.

## Class Mixin (Subclass Factory)
Funksiya class qabul qilib, uni extend qilgan yangi class qaytaradi. Bu pattern TypeScript bilan yaxshi ishlaydi va type-safe.

## Funksional Mixin
Oddiy funksiya target ob'ektga xususiyat qo'shadi. Class-siz, prototype-siz ishlaydi. Ko'proq funksional yondashuvga mos.

## Mixin vs Composition
- Mixin — ob'ektning o'ziga metodlar qo'shadi (mutatsiya)
- Composition — alohida ob'ektlarni birlashtiradi (immutable)
Ko'p hollarda composition yaxshiroq, lekin mixin-larning ham o'z o'rni bor.

## Mixin muammolari
1. **Name collision** — ikki mixin bir xil nomdagi metod bersa, oxirgisi yutadi
2. **Implicit dependencies** — mixin ichida \`this.name\` ishlatilsa, target-da name bo'lishi kerak
3. **Debug qiyinligi** — metod qaysi mixin-dan kelganini aniqlash qiyin
4. **Diamond problem** — ikki mixin bir xil parent-dan keladigan metodlarni override qilsa

## Best Practices
- Mixin nomlarini aniq qo'ying (Serializable, EventEmitter)
- Mixin ichida faqat o'z maydonlarini ishlating
- Name collision-dan ehtiyot bo'ling
- Murakkab holatlarda composition-ni afzal ko'ring
- Symbol bilan private mixin maydonlarini himoyalang
  `.trim(),

  codeExamples: [
    {
      title: 'Object.assign bilan oddiy mixin',
      language: 'js',
      description: 'Prototype-ga metodlar ko\'chirish',
      code: `// Mixin ob'ektlar
const Serializable = {
  serialize() {
    return JSON.stringify(this);
  },
  toObject() {
    return { ...this };
  }
};

const Validatable = {
  validate() {
    for (const [key, value] of Object.entries(this)) {
      if (value === null || value === undefined) {
        throw new Error(\`\${key} maydoni to'ldirilmagan\`);
      }
    }
    return true;
  }
};

const Timestamped = {
  setCreatedAt() {
    this.createdAt = new Date().toISOString();
    return this;
  },
  setUpdatedAt() {
    this.updatedAt = new Date().toISOString();
    return this;
  }
};

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Mixin-larni qo'shish
Object.assign(User.prototype, Serializable, Validatable, Timestamped);

const user = new User('Ali', 'ali@mail.com');
user.setCreatedAt();
console.log(user.serialize());
// {"name":"Ali","email":"ali@mail.com","createdAt":"2026-04-13T..."}
console.log(user.validate()); // true`
    },
    {
      title: 'Class Mixin — Subclass Factory pattern',
      language: 'js',
      description: 'Funksiya orqali class-ni kengaytirish — TypeScript bilan yaxshi ishlaydi',
      code: `// Mixin funksiyalar (class qaytaradi)
const EventEmitterMixin = (Base) => class extends Base {
  #listeners = {};

  on(event, fn) {
    (this.#listeners[event] ??= []).push(fn);
    return this;
  }

  emit(event, ...args) {
    (this.#listeners[event] ?? []).forEach(fn => fn(...args));
    return this;
  }

  off(event, fn) {
    this.#listeners[event] = (this.#listeners[event] ?? [])
      .filter(f => f !== fn);
    return this;
  }
};

const LoggableMixin = (Base) => class extends Base {
  log(message) {
    console.log(\`[\${this.constructor.name}] \${message}\`);
  }

  logMethod(name, ...args) {
    this.log(\`\${name}(\${args.join(', ')})\`);
  }
};

// Mixin-larni zanjirlab qo'llash
class BaseModel {
  constructor(data) {
    Object.assign(this, data);
  }
}

class User extends LoggableMixin(EventEmitterMixin(BaseModel)) {
  save() {
    this.log('Saqlanmoqda...');
    this.emit('save', this);
    return this;
  }
}

const user = new User({ name: 'Ali', age: 25 });
user.on('save', (u) => console.log(\`Saqlandi: \${u.name}\`));
user.save();
// [User] Saqlanmoqda...
// Saqlandi: Ali

console.log(user instanceof BaseModel); // true`
    },
    {
      title: 'Funksional Mixin',
      language: 'js',
      description: 'Class-siz mixin — oddiy funksiya bilan',
      code: `// Funksional mixin-lar
function withStorage(obj, key) {
  obj.saveToStorage = function() {
    localStorage.setItem(key, JSON.stringify(this));
  };
  obj.loadFromStorage = function() {
    const data = localStorage.getItem(key);
    if (data) Object.assign(this, JSON.parse(data));
    return this;
  };
  return obj;
}

function withUndoRedo(obj) {
  const history = [];
  let index = -1;

  obj.snapshot = function() {
    const state = JSON.stringify(this);
    history.splice(index + 1);
    history.push(state);
    index++;
    return this;
  };

  obj.undo = function() {
    if (index > 0) {
      index--;
      const clean = { ...this };
      Object.keys(clean).forEach(k => {
        if (typeof clean[k] !== 'function') delete this[k];
      });
      Object.assign(this, JSON.parse(history[index]));
    }
    return this;
  };

  return obj;
}

// Ishlatish
const editor = { text: '', fontSize: 14 };
withStorage(editor, 'editor-state');
withUndoRedo(editor);

editor.text = 'Salom';
editor.snapshot();
editor.text = 'Salom dunyo';
editor.snapshot();
editor.undo();
console.log(editor.text); // "Salom"`
    }
  ],

  interviewQA: [
    {
      question: 'Mixin nima va u JavaScript-da qanday ishlaydi?',
      answer: 'Mixin — ob\'ektga qo\'shimcha metodlar qo\'shish pattern-i. JS-da multiple inheritance yo\'q, mixin bu muammoni hal qiladi. Uch usuli bor: 1) Object.assign(Target.prototype, mixin) — eng oddiy. 2) Class mixin (subclass factory): const M = (Base) => class extends Base {...} — TypeScript uchun yaxshi. 3) Funksional mixin — oddiy funksiya target-ga method qo\'shadi. Har birining afzalligi va kamchiligi bor.'
    },
    {
      question: 'Mixin pattern-ning muammolari nimalar?',
      answer: '1) Name collision — ikki mixin bir xil metod bersa, oxirgisi yutadi (silent override). 2) Implicit dependencies — mixin this.x ishlatsa, target-da x bo\'lishi kerak lekin bu hech joyda tekshirilmaydi. 3) Debug qiyinligi — metod qaysi mixin-dan kelganini aniqlash murakkab. 4) Prototype pollution — global ob\'ektlarga mixin qo\'shish xavfli. 5) Testing — mixin-ning o\'zi test qilish qiyin, chunki u target-ga bog\'liq. Yechim: kichik, mustaqil mixin-lar yarating.'
    },
    {
      question: 'Class Mixin va Object.assign mixin farqi nima?',
      answer: 'Object.assign: oddiy, lekin prototype chain-ga ta\'sir qilmaydi, super ishlamaydi, instanceof ishlamaydi. Class Mixin (subclass factory): prototype chain-ga qo\'shiladi, super ishlaydi, instanceof ishlaydi, private fields (#) ishlatish mumkin, TypeScript-da type-safe. Class Mixin yaxshiroq, lekin murakkabroq. Oddiy utility metodlar uchun Object.assign yetarli, murakkab funksionallik uchun Class Mixin ishlating.'
    },
    {
      question: 'Mixin vs Composition — qachon qaysi birini tanlash kerak?',
      answer: 'Mixin: ob\'ektning O\'ZIGA metodlar qo\'shadi (mutatsiya). Composition: alohida ob\'ektlarni birlashtiradi. Mixin ishlating: ko\'p class-larga bir xil xulq kerak bo\'lganda (EventEmitter, Serializable). Composition ishlating: "has-a" munosabat bo\'lganda (Car has Engine). Zamonaviy trend: composition afzal. React ham mixin-lardan (createClass) composition-ga (hooks) o\'tgan. Lekin ba\'zi holatlarda mixin qulayroq — masalan, logging, event handling.'
    }
  ],

  relatedTopics: [
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'inheritance', label: 'Inheritance' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'classes', label: 'ES6 Classes' },
    { techId: 'javascript', sectionId: 'oop-classes', topicId: 'design-patterns-oop', label: 'Design Patterns' }
  ]
}
