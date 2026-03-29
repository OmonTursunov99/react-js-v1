# React DOM va Virtual DOM — React vs Vue

## Virtual DOM nima?

Virtual DOM — bu brauzerning haqiqiy DOM-ining JavaScript-dagi "nusxasi". Frameworklar avval virtual DOM-ni o'zgartiradi, keyin haqiqiy DOM bilan solishtiradi va **faqat farqlarni** brauzerga qo'llaydi.

Bu ikkalasida ham bor — React-da ham, Vue-da ham. Lekin **qanday ishlashi** butunlay farq qiladi.

## React DOM — bu nima?

React ikki qismdan iborat:

| Paket | Vazifasi |
|---|---|
| `react` | Yadro — komponentlar, hooklar, virtual DOM yaratish |
| `react-dom` | Renderer — virtual DOM-ni **brauzer DOM-iga** aylantiradi |

Nega ajratilgan? Chunki `react` yadrosi universal — uni turli rendererlarga ulash mumkin:

- `react-dom` → brauzer (web)
- `react-native` → mobil (iOS, Android)
- `react-three-fiber` → 3D (WebGL)

**Vue-da** hammasi bitta `vue` paketida. Renderer ichida.

## Reaktivlik: React vs Vue

Bu eng katta farq. Ikkalasi virtual DOM ishlatadi, lekin **qachon qayta render qilishni** butunlay boshqacha aniqlaydi.

### Vue — Proxy bilan avtomatik kuzatish

Vue `ref()` yoki `reactive()` ichiga qo'yilgan ma'lumotlarni **Proxy** orqali kuzatadi:

```js
// Vue
const user = reactive({ name: 'Ali', age: 25 })

// Vue ichida shunday ishlaydi:
// const user = new Proxy(originalObject, {
//   get(target, key) {
//     track(target, key)  // "kim bu qiymatni o'qidi" — eslab qo'yadi
//     return target[key]
//   },
//   set(target, key, value) {
//     target[key] = value
//     trigger(target, key) // "shu qiymat o'zgardi" — faqat bog'liq joylarni yangilaydi
//     return true
//   }
// })
```

**Jarayon:**
1. `user.name` o'qilganda → Vue eslab qoladi: "bu komponent `name`-ga bog'liq"
2. `user.name = 'Vali'` yozilganda → Vue **faqat `name`-ga bog'liq komponentlarni** qayta render qiladi
3. Boshqa komponentlar **umuman qayta render bo'lmaydi**

### React — setState bilan to'liq qayta render

React Proxy ishlatmaydi. React-da hech qanday avtomatik kuzatish yo'q. O'rniga `setState` chaqirilganda **butun komponent** qayta render bo'ladi:

```tsx
// React
const [user, setUser] = useState({ name: 'Ali', age: 25 })

// O'zgartirish — yangi obyekt yaratish kerak
setUser({ ...user, name: 'Vali' })
```

**Jarayon:**
1. `setUser()` chaqirildi
2. React **butun App komponentini** va uning **barcha bolalarini** qayta render qiladi
3. Virtual DOM-ning eski va yangi versiyasini solishtiradi (**diffing/reconciliation**)
4. Faqat farqlarni haqiqiy DOM-ga qo'llaydi

### Vizual solishtirish

```
Vue: O'zgartirish → Proxy sezadi → faqat bog'liq komponent yangilanadi → DOM patch
React: setState() → butun daraxt qayta render → virtual DOM diff → DOM patch
```

## Reconciliation — React-ning diffing algoritmi

React-ning asosiy kuchi shu. `setState` chaqirilganda:

```
1. Eski virtual DOM:          Yangi virtual DOM:
   <div>                        <div>
     <h1>Ali</h1>                 <h1>Vali</h1>     ← farq!
     <p>25 yosh</p>               <p>25 yosh</p>    ← o'xshash
   </div>                       </div>

2. React ikkalasini solishtiradi (diff)

3. Faqat <h1> ni yangilaydi, <p> ga tegmaydi
```

## Nega React Proxy ishlatmaydi?

| Sabab | Tushuntirish |
|---|---|
| Soddalik | React-ning modeli oddiy: "state o'zgardi → qayta render". Sehrli yo'q |
| Oldindan aytish mumkin | Har doim bilasan — `setState` = qayta render. Vue-da ba'zan Proxy kutilmagan holatlar yaratadi |
| Immutability | React yangi obyekt yaratishni talab qiladi — bu vaqt bo'yicha taqqoslashni osonlashtiradi |
| React Compiler | Yangi React Compiler avtomatik optimallashtiradi — Proxy kerak emas |

## Amaliy farq — bir xil ish, ikki xil yondashuv

### Oddiy state o'zgartirish

```js
// Vue — to'g'ridan-to'g'ri o'zgartirish (Proxy kuzatadi)
const count = ref(0)
count.value++  // Vue avtomatik biladi va yangilaydi
```

```tsx
// React — yangi qiymat berish (setState chaqirish)
const [count, setCount] = useState(0)
setCount(count + 1)  // React butun komponentni qayta render qiladi
```

### Obyekt ichidagi qiymatni o'zgartirish

```js
// Vue — oddiy o'zgartirish
const user = reactive({ name: 'Ali', age: 25 })
user.name = 'Vali'  // Vue faqat name-ni kuzatadi va yangilaydi
```

```tsx
// React — yangi obyekt yaratish (spread operator)
const [user, setUser] = useState({ name: 'Ali', age: 25 })
setUser({ ...user, name: 'Vali' })  // eski obyektni o'zgartirish ISHLAMAYDI
// user.name = 'Vali' — BU ISHLAMAYDI! React buni sezmaydi
```

### Massivga element qo'shish

```js
// Vue
const items = ref(['olma', 'nok'])
items.value.push('uzum')  // Vue kuzatadi
```

```tsx
// React — yangi massiv yaratish
const [items, setItems] = useState(['olma', 'nok'])
setItems([...items, 'uzum'])  // yangi massiv
// items.push('uzum') — BU ISHLAMAYDI!
```

## React-da optimallashtirish

React har safar butun daraxtni qayta render qilgani uchun, kerak bo'lganda qo'lda optimallashtirish kiritish mumkin:

```tsx
// React.memo — komponentni faqat propslari o'zgarganda qayta render qiladi
// Vue-da bunga ehtiyoj yo'q — Proxy o'zi hal qiladi
const ExpensiveComponent = React.memo(function Expensive({ data }) {
  return <div>{data}</div>
})

// useMemo — qimmat hisoblashni keshlash
// Vue-da analogi: computed()
const sorted = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name))
}, [items])  // faqat items o'zgarganda qayta hisoblanadi

// useCallback — funksiyani keshlash
// Vue-da bunga ehtiyoj yo'q
const handleClick = useCallback(() => {
  setCount(c => c + 1)
}, [])
```

**React Compiler** (bu loyihada yoqilgan) — `useMemo`, `useCallback`, `React.memo` ni **avtomatik** qo'shadi. Shuning uchun qo'lda yozish shart emas.

## Xulosa jadvali

| Xususiyat | React | Vue |
|---|---|---|
| Virtual DOM | Bor | Bor |
| Renderer | Alohida paket (`react-dom`) | Ichki (vue ichida) |
| Reaktivlik | `setState()` → to'liq qayta render | Proxy → faqat bog'liq qism yangilanadi |
| Ma'lumot o'zgartirish | Immutable — yangi obyekt yaratish | Mutable — to'g'ridan-to'g'ri o'zgartirish |
| Kuzatish | Yo'q — sen aytasan qachon yangilash | Avtomatik — Proxy kuzatadi |
| Optimallashtirish | `memo`, `useMemo`, `useCallback` (yoki React Compiler) | Kerak emas — Proxy o'zi hal qiladi |
| Diffing | Reconciliation algoritmi | Patch algoritmi (virtual DOM diff) |
