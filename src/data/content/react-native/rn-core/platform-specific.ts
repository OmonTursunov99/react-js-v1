import type { Topic } from '../../../types'

export const platformSpecific: Topic = {
  id: 'platform-specific',
  title: 'Platform Specific Code',
  importance: 2,
  status: 'to-learn',
  description: 'Platform.OS, Platform.select, .ios.tsx/.android.tsx fayl konventsiyasi',
  content: `React Native da iOS va Android uchun turli kod yozish kerak bo'lgan holatlar mavjud. Buning uchun bir nechta mexanizm bor.

═══════════════════════════════════════
  PLATFORM MODULI
═══════════════════════════════════════

Platform moduli orqali qaysi platformada ekanligini aniqlash:

  import { Platform } from 'react-native'

  Platform.OS        // 'ios' | 'android' | 'web'
  Platform.Version   // iOS: 17.0, Android: 34

  if (Platform.OS === 'ios') {
    // faqat iOS uchun kod
  }

═══════════════════════════════════════
  PLATFORM.SELECT
═══════════════════════════════════════

Platformaga qarab qiymat tanlash:

  const styles = StyleSheet.create({
    container: {
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
        },
        android: {
          elevation: 5,
        },
      }),
    },
  })

iOS da shadow*, Android da elevation ishlatiladi.

═══════════════════════════════════════
  FAYL KONVENTSIYASI
═══════════════════════════════════════

Platformaga xos fayllar:
  Button.ios.tsx      — faqat iOS da import qilinadi
  Button.android.tsx  — faqat Android da import qilinadi
  Button.tsx          — umumiy (fallback)

Import da platforma ko'rsatilMAYDI:
  import { Button } from './Button'
  // iOS da Button.ios.tsx, Android da Button.android.tsx yuklanadi

Bu katta farqlar bo'lganda ishlatiladi (boshqa UI, boshqa API).

═══════════════════════════════════════
  STATUSBAR
═══════════════════════════════════════

StatusBar — ekran yuqorisidagi holat paneli:

  <StatusBar
    barStyle="light-content"       // matn rangi
    backgroundColor="#000"          // faqat Android
    translucent={true}              // faqat Android
  />

iOS da backgroundColor YO'Q — SafeAreaView ishlatiladi.

═══════════════════════════════════════
  SAFE AREA
═══════════════════════════════════════

SafeAreaView — notch, status bar, home indicator dan himoya:

  import { SafeAreaView } from 'react-native-safe-area-context'

  <SafeAreaView style={{ flex: 1 }}>
    <Text>Kontent xavfsiz zonada</Text>
  </SafeAreaView>

Yoki useSafeAreaInsets() hook bilan aniqroq nazorat:

  const insets = useSafeAreaInsets()
  <View style={{ paddingTop: insets.top }}>

═══════════════════════════════════════
  PLATFORMA XUSUSIYATLARI
═══════════════════════════════════════

iOS xususiyatlari:
- Shadow (shadowColor, shadowOffset, shadowOpacity)
- BlurView
- HapticFeedback (tebranish)

Android xususiyatlari:
- Elevation (soya)
- Ripple effect
- BackHandler (orqaga tugmasi)
- ToastAndroid

Ikkala platformada boshqacha:
- Shrift nomlari (fontFamily)
- Animatsiya xulqi
- Keyboard holati`,
  codeExamples: [
    {
      title: 'Platform.select bilan stillar',
      code: `import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  )
}

export function AppScreen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        translucent={Platform.OS === 'android'}
      />
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // Android StatusBar uchun qo'shimcha padding
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    // Platformaga xos soya
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    marginBottom: 8,
  },
})`,
      language: 'tsx',
      description: 'iOS va Android uchun turli soya va stil',
    },
    {
      title: 'Platforma xos fayl misoli',
      code: `// components/DatePicker.ios.tsx
import { View, Text } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

export function DatePicker({ value, onChange }: {
  value: Date
  onChange: (date: Date) => void
}) {
  return (
    <View>
      <Text style={{ fontSize: 16, marginBottom: 8 }}>Sanani tanlang:</Text>
      <DateTimePicker
        value={value}
        mode="date"
        display="spinner"  // iOS spinner ko'rinishi
        onChange={(_, date) => date && onChange(date)}
      />
    </View>
  )
}

// components/DatePicker.android.tsx
import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

export function DatePicker({ value, onChange }: {
  value: Date
  onChange: (date: Date) => void
}) {
  const [show, setShow] = useState(false)

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text style={{ fontSize: 16, padding: 12, borderWidth: 1, borderRadius: 8 }}>
          {value.toLocaleDateString('uz-UZ')}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"  // Android dialog
          onChange={(_, date) => {
            setShow(false)
            date && onChange(date)
          }}
        />
      )}
    </View>
  )
}

// Ishlatish (platforma avtomatik tanlanadi):
// import { DatePicker } from './components/DatePicker'`,
      language: 'tsx',
      description: '.ios.tsx va .android.tsx — platformaga xos komponentlar',
    },
  ],
  interviewQA: [
    {
      question: "Platform.select va .ios.tsx/.android.tsx qachon ishlatiladi?",
      answer: "Platform.select — kichik farqlar uchun (soya stili, padding). Bir faylda 2-3 qator farq bo'lsa. .ios.tsx/.android.tsx — katta farqlar uchun. Masalan, DatePicker iOS va Android da butunlay boshqa UI va logika talab qilsa — alohida fayllarda yozish toza va boshqarish oson.",
    },
    {
      question: "SafeAreaView nima uchun kerak?",
      answer: "Zamonaviy telefonlarda notch (o'yma), dynamic island, home indicator, status bar bor. SafeAreaView kontent shu elementlar tagiga tushmasligini ta'minlaydi. RN ning o'zidagi SafeAreaView faqat iOS ishlaydi. react-native-safe-area-context kutubxonasi ikkala platformada ishlaydi va useSafeAreaInsets() hook beradi.",
    },
    {
      question: "Android BackHandler qanday ishlatiladi?",
      answer: "Android da fizik/virtual orqaga tugmasi bor. BackHandler orqali uni tutib olish mumkin: BackHandler.addEventListener('hardwareBackPress', handler). Handler true qaytarsa — standart xulq to'xtatiladi. Misol: 'Chiqishni xohlaysizmi?' dialog ko'rsatish yoki nested navigator da orqaga qaytish logikasini o'zgartirish.",
    },
  ],
  relatedTopics: [
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'styling', label: 'Styling' },
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'navigation', label: 'Navigation' },
  ],
}
