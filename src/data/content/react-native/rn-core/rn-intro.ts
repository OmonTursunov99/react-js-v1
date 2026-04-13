import type { Topic } from '../../../types'

export const rnIntro: Topic = {
  id: 'rn-intro',
  title: 'React Native Overview',
  importance: 3,
  status: 'to-learn',
  description: 'React Native arxitekturasi, Expo vs bare workflow, Bridge va JSI',
  content: `React Native — JavaScript va React yordamida iOS va Android uchun native mobil ilovalar yaratish freymvorki. Facebook tomonidan 2015-yilda chiqarilgan.

═══════════════════════════════════════
  ASOSIY TUSHUNCHA
═══════════════════════════════════════

React Native web komponentlar (div, span) o'rniga
NATIVE komponentlar (View, Text, Image) ishlatadi.

  React (Web):   <div> → DOM element
  React Native:  <View> → UIView (iOS) / android.view.View (Android)

JavaScript kodi native komponentlarga "ko'prik" (bridge) orqali ulanadi.
Natija — HAQIQIY native ilova (WebView EMAS).

═══════════════════════════════════════
  EXPO VS BARE WORKFLOW
═══════════════════════════════════════

EXPO (tavsiya etiladi):
- Tayyor konfiguratsiya (Xcode/Android Studio kerak EMAS)
- expo start — bir buyruq bilan ishga tushirish
- Over-the-air (OTA) yangilanishlar
- expo-router — fayl tizimiga asoslangan routing
- Expo Go ilovasi bilan tezkor sinash
- EAS Build — bulutda build qilish

Cheklovlari: Ba'zi native modullarni to'g'ridan-to'g'ri ishlatib bo'lmaydi

BARE WORKFLOW:
- To'liq nazorat (Xcode, Android Studio)
- Ixtiyoriy native modul qo'shish
- Murakkab native integratsiyalar
- Sozlash va boshqarish qiyinroq

Hozirgi tavsiya: Expo bilan boshlang, kerak bo'lsa bare ga o'ting.

═══════════════════════════════════════
  ARXITEKTURA: BRIDGE (ESKI)
═══════════════════════════════════════

Eski arxitektura — Bridge:
  JS Thread ←→ Bridge (JSON) ←→ Native Thread

Bridge orqali JS va Native o'rtasida JSON xabarlar almashiladi.
Bu ASINXRON va SEKIN — chunki har bir xabar serializatsiya/deserializatsiya qilinadi.

Muammolar:
- JSON serialization overhead
- Asinxron — real-time aloqa qiyin
- Katta ma'lumotlar uzatish sekin

═══════════════════════════════════════
  ARXITEKTURA: JSI (YANGI)
═══════════════════════════════════════

Yangi arxitektura — JSI (JavaScript Interface):
  JS Thread ←→ JSI (C++) ←→ Native Thread

JSI — C++ qatlam. JS to'g'ridan-to'g'ri native funksiyalarni chaqiradi.
Bridge kerak EMAS, JSON serialization yo'q.

Afzalliklari:
- SINXRON chaqiruvlar
- Bridge overhead yo'q
- Turbo Modules (lazy loading native modullar)
- Fabric (yangi rendering tizimi)

═══════════════════════════════════════
  THREADLAR
═══════════════════════════════════════

React Native 3 ta asosiy thread ishlatadi:

1. JS Thread — React kodi, biznes logika
2. UI/Main Thread — native UI rendering
3. Shadow Thread — layout hisoblash (Yoga engine)

JS Thread band bo'lsa — animatsiyalar tushib qoladi.
Shuning uchun og'ir hisoblashlarni JS Thread da qilmaslik kerak.`,
  codeExamples: [
    {
      title: 'Birinchi React Native ilova',
      code: `// App.tsx
import { View, Text, StyleSheet } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salom, React Native!</Text>
      <Text style={styles.subtitle}>
        Bu native ilova — WebView EMAS
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
})`,
      language: 'tsx',
      description: 'Eng oddiy React Native komponent — View va Text',
    },
    {
      title: 'Expo bilan loyiha yaratish',
      code: `// Terminal buyruqlari:
// npx create-expo-app@latest my-app
// cd my-app
// npx expo start

// app/_layout.tsx (Expo Router)
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Bosh sahifa' }}
      />
      <Stack.Screen
        name="profile"
        options={{ title: 'Profil' }}
      />
    </Stack>
  )
}

// app/index.tsx
import { View, Text } from 'react-native'
import { Link } from 'expo-router'

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bosh sahifa</Text>
      <Link href="/profile">Profilga o'tish</Link>
    </View>
  )
}`,
      language: 'tsx',
      description: 'Expo Router bilan fayl tizimiga asoslangan navigatsiya',
    },
    {
      title: 'React va React Native farqi',
      code: `// React (Web)
function WebComponent() {
  return (
    <div className="container">
      <h1>Sarlavha</h1>
      <p>Matn</p>
      <button onClick={handleClick}>Bosing</button>
      <input type="text" onChange={handleChange} />
    </div>
  )
}

// React Native (Mobil)
import { View, Text, TouchableOpacity, TextInput } from 'react-native'

function NativeComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sarlavha</Text>
      <Text>Matn</Text>
      <TouchableOpacity onPress={handlePress}>
        <Text>Bosing</Text>
      </TouchableOpacity>
      <TextInput onChangeText={handleChange} />
    </View>
  )
}
// div → View, p/h1 → Text, button → TouchableOpacity
// className → style, onClick → onPress`,
      language: 'tsx',
      description: 'Web React va React Native komponentlar farqi',
    },
  ],
  interviewQA: [
    {
      question: 'React Native qanday ishlaydi? Bu WebView mi?',
      answer: "Yo'q, React Native WebView EMAS. U JavaScript kodini native komponentlarga tarjima qiladi. <View> iOS da UIView, Android da android.view.View bo'ladi. JS Thread da React kodi ishlaydi, natija JSI/Bridge orqali native UI thread ga uzatiladi. Foydalanuvchi HAQIQIY native interfeysni ko'radi.",
    },
    {
      question: 'Bridge va JSI orasidagi farq nima?',
      answer: "Bridge (eski) — JS va Native o'rtasida JSON xabarlar almashadi. Asinxron, sekin, serialization overhead bor. JSI (yangi) — C++ qatlam orqali JS to'g'ridan-to'g'ri native funksiyalarni chaqiradi. Sinxron, tez, serialization kerak emas. JSI Turbo Modules va Fabric renderer ni imkon qiladi.",
    },
    {
      question: "Expo va bare workflow qachon tanlash kerak?",
      answer: "Expo — aksariyat loyihalar uchun tavsiya etiladi. Tez boshlash, OTA yangilanishlar, EAS Build. Bare workflow — murakkab native integratsiyalar kerak bo'lganda (maxsus native modul, Bluetooth, ARKit). Hozirgi Expo juda kuchli — ko'p native modullarni qo'llab-quvvatlaydi, shuning uchun bare ga o'tish kamdan-kam kerak.",
    },
    {
      question: "React Native da qanday threadlar bor?",
      answer: "3 ta asosiy thread: 1) JS Thread — React kodi, biznes logika, state boshqarish. 2) UI/Main Thread — native UI rendering, foydalanuvchi interaksiyalari. 3) Shadow Thread — Yoga layout engine, flexbox hisoblash. JS Thread band bo'lsa animatsiyalar 'lag' qiladi. Shuning uchun og'ir hisoblashlarni Reanimated (UI thread) yoki worker ga o'tkazish kerak.",
    },
  ],
  relatedTopics: [
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'core-components', label: 'Core Components' },
    { techId: 'react-native', sectionId: 'rn-advanced', topicId: 'native-modules', label: 'Native Modules' },
  ],
}
