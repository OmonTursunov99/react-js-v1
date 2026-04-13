import type { Topic } from '../../../types'

export const styling: Topic = {
  id: 'styling',
  title: 'Styling & Layout',
  importance: 3,
  status: 'to-learn',
  description: 'StyleSheet, flexbox, Dimensions, responsive design',
  content: `React Native da CSS ishlatilMAYDI. O'rniga JavaScript object sifatida stillar yoziladi. Layout uchun Flexbox ishlatiladi (Yoga engine).

═══════════════════════════════════════
  STYLESHEET
═══════════════════════════════════════

StyleSheet.create() — stillarni optimallashtirish:

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  })

StyleSheet.create afzalliklari:
- Validatsiya (noto'g'ri property xato beradi)
- Bridge orqali faqat ID yuboriladi (performance)
- Avtomatik TypeScript intellisense

═══════════════════════════════════════
  FLEXBOX FARQLARI
═══════════════════════════════════════

React Native Flexbox web dan farq qiladi:

  flexDirection: 'column'   ← STANDART (web da 'row')
  alignItems: 'stretch'     ← STANDART
  flexShrink: 0             ← STANDART (web da 1)

Asosiy proplar:
  flex: 1          — mavjud bo'sh joyni to'ldiradi
  flexDirection    — 'row' | 'column'
  justifyContent   — asosiy o'q bo'ylab
  alignItems       — ikkinchi o'q bo'ylab
  flexWrap         — 'wrap' | 'nowrap'
  gap              — elementlar orasidagi bo'shliq

═══════════════════════════════════════
  O'LCHAM BIRLIKLARI
═══════════════════════════════════════

React Native da faqat RAQAM ishlatiladi (px, rem, em yo'q):

  { width: 100 }       — density-independent pixels (dp)
  { width: '50%' }     — foiz
  { flex: 1 }          — flexbox nisbati

dp avtomatik ravishda ekran zichligiga moslanadi:
  iPhone 14: 1dp = 3px (3x retina)
  Android: 1dp = ekran density ga bog'liq

═══════════════════════════════════════
  DIMENSIONS VA USEWINDOWDIMENSIONS
═══════════════════════════════════════

Ekran o'lchamlarini olish:

  // Statik (o'zgarmaydi — rotation da ham)
  import { Dimensions } from 'react-native'
  const { width, height } = Dimensions.get('window')

  // Reaktiv (rotation da yangilanadi) ← TAVSIYA
  import { useWindowDimensions } from 'react-native'
  const { width, height } = useWindowDimensions()

═══════════════════════════════════════
  CONDITIONAL STYLES
═══════════════════════════════════════

Bir nechta stil birlashtirish:

  <View style={[styles.base, isActive && styles.active]} />

  <View style={[styles.card, { marginTop: index === 0 ? 0 : 12 }]} />

Array orqali stillar birlashtirilib, oxirgisi ustun.

═══════════════════════════════════════
  RESPONSIVE DESIGN
═══════════════════════════════════════

Turli ekran o'lchamlarga moslanish:
1. Foiz (%) va flex ishlatish
2. useWindowDimensions bilan breakpoint
3. Platform.select — iOS/Android uchun turli stillar
4. SafeAreaView — notch va status bar uchun`,
  codeExamples: [
    {
      title: 'Flexbox layout misollari',
      code: `import { View, Text, StyleSheet } from 'react-native'

export function FlexDemo() {
  return (
    <View style={styles.container}>
      {/* Header — balandligi belgilangan */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Header</Text>
      </View>

      {/* Content — qolgan joyni to'ldiradi */}
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <Text>Sidebar</Text>
        </View>
        <View style={styles.main}>
          <Text>Asosiy kontent</Text>
        </View>
      </View>

      {/* Footer — balandligi belgilangan */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // To'liq ekranni egallash
  },
  header: {
    height: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: {
    flex: 1, // Qolgan joyni to'ldiradi
    flexDirection: 'row', // Gorizontal layout
  },
  sidebar: {
    width: 80,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  main: {
    flex: 1, // Qolgan kenglikni to'ldiradi
    padding: 16,
  },
  footer: {
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { color: '#fff' },
})`,
      language: 'tsx',
      description: 'Flexbox bilan header-content-footer layout',
    },
    {
      title: 'Responsive design',
      code: `import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'

export function ResponsiveGrid() {
  const { width } = useWindowDimensions()

  // Breakpointlar
  const isTablet = width >= 768
  const numColumns = isTablet ? 3 : 2
  const cardWidth = width / numColumns - 24

  const items = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    title: \`Card \${i + 1}\`,
  }))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isTablet ? 'Planshet' : 'Telefon'} rejimi
      </Text>
      <View style={styles.grid}>
        {items.map(item => (
          <View
            key={item.id}
            style={[styles.card, { width: cardWidth }]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
})`,
      language: 'tsx',
      description: 'useWindowDimensions bilan responsive grid',
    },
    {
      title: 'Dinamik stillar va tema',
      code: `import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'

const themes = {
  light: {
    bg: '#ffffff',
    text: '#000000',
    card: '#f5f5f5',
    primary: '#007AFF',
  },
  dark: {
    bg: '#1a1a1a',
    text: '#ffffff',
    card: '#2d2d2d',
    primary: '#0A84FF',
  },
}

export function ThemedScreen() {
  const [isDark, setIsDark] = useState(false)
  const theme = isDark ? themes.dark : themes.light

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        {isDark ? 'Qorong\\'i' : 'Yorug\\''}  rejim
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.text }}>Karta kontenti</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => setIsDark(!isDark)}
      >
        <Text style={styles.buttonText}>Tema o'zgartirish</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 20, borderRadius: 12, marginBottom: 20 },
  button: { padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
})`,
      language: 'tsx',
      description: 'Dinamik tema bilan stil o\'zgartirish',
    },
  ],
  interviewQA: [
    {
      question: "React Native da Flexbox web dan qanday farq qiladi?",
      answer: "Asosiy farqlar: 1) flexDirection standart 'column' (web da 'row'). 2) flexShrink standart 0 (web da 1). 3) Barcha qiymatlar raqam (px, rem yo'q) — dp ishlatiladi. 4) position standart 'relative'. 5) gap property qo'llab-quvvatlanadi. RN Yoga layout engine ishlatadi — CSS ning to'liq flexbox spetsifikatsiyasini qo'llab-quvvatlaMaydi.",
    },
    {
      question: "Dimensions va useWindowDimensions orasidagi farq nima?",
      answer: "Dimensions.get('window') — statik qiymat, komponent mount bo'lganda olinadi. Ekran aylantirilganda YANGILANMAYDI. useWindowDimensions — React hook, ekran o'lchami o'zgarganda komponent qayta renderlanadi. Doim useWindowDimensions ishlatish tavsiya etiladi — responsive va rotation safe.",
    },
    {
      question: "StyleSheet.create nima uchun kerak? Oddiy object yetarli emasmi?",
      answer: "StyleSheet.create afzalliklari: 1) Validatsiya — noto'g'ri property darhol xato beradi. 2) Performance — stil ID sifatida bridge orqali yuboriladi (to'liq object emas). 3) Immutable — yaratilgandan keyin o'zgartirib bo'lmaydi. 4) TypeScript intellisense. Lekin inline stillar ham ishlaydi — dinamik qiymatlar uchun zarur.",
    },
  ],
  relatedTopics: [
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'core-components', label: 'Core Components' },
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'platform-specific', label: 'Platform Specific' },
  ],
}
