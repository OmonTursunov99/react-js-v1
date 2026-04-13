import type { Topic } from '../../../types'

export const navigation: Topic = {
  id: 'navigation',
  title: 'Navigation',
  importance: 3,
  status: 'to-learn',
  description: 'React Navigation — stack, tab, drawer navigatorlar, deep linking',
  content: `React Native da o'rnatilgan routing yo'q. React Navigation — eng mashhur navigatsiya kutubxonasi. Expo Router esa fayl tizimiga asoslangan alternativa.

═══════════════════════════════════════
  REACT NAVIGATION
═══════════════════════════════════════

React Navigation uch asosiy navigator turini taqdim etadi:

1. Stack Navigator — sahifalar ustma-ust joylashadi (push/pop)
2. Tab Navigator  — pastki tab bar (Instagram kabi)
3. Drawer Navigator — yon panel (Gmail kabi)

O'rnatish:
  npm install @react-navigation/native
  npm install @react-navigation/native-stack
  npm install react-native-screens react-native-safe-area-context

═══════════════════════════════════════
  STACK NAVIGATOR
═══════════════════════════════════════

Stack — eng asosiy navigator. Sahifalar "stek" ga qo'shiladi:
- navigate('Details') — yangi sahifa PUSH qilinadi
- goBack() — orqaga qaytish (POP)

  const Stack = createNativeStackNavigator()

  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={DetailsScreen} />
  </Stack.Navigator>

═══════════════════════════════════════
  TAB NAVIGATOR
═══════════════════════════════════════

Pastki tab bar bilan navigatsiya:

  const Tab = createBottomTabNavigator()

  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>

Har bir tab o'z stack navigator ga ega bo'lishi mumkin
(nested navigators).

═══════════════════════════════════════
  DRAWER NAVIGATOR
═══════════════════════════════════════

Yon panel (chapdan siljitish bilan ochiladi):

  const Drawer = createDrawerNavigator()

  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>

═══════════════════════════════════════
  PARAMETR UZATISH
═══════════════════════════════════════

Sahifalar orasida ma'lumot uzatish:

  // Yuborish:
  navigation.navigate('Details', { itemId: 42, title: 'Salom' })

  // Qabul qilish:
  const { itemId, title } = route.params

═══════════════════════════════════════
  DEEP LINKING
═══════════════════════════════════════

Deep linking — tashqi URL orqali ilovaning ichki sahifasini ochish:

  myapp://details/42  → DetailsScreen { id: 42 }
  https://myapp.com/details/42  → Universal link

Konfiguratsiya:
  const linking = {
    prefixes: ['myapp://', 'https://myapp.com'],
    config: {
      screens: {
        Home: '',
        Details: 'details/:id',
      },
    },
  }

═══════════════════════════════════════
  EXPO ROUTER
═══════════════════════════════════════

Expo Router — Next.js ga o'xshash fayl tizimiga asoslangan routing:

  app/
  ├── _layout.tsx      → Root layout
  ├── index.tsx        → / (bosh sahifa)
  ├── profile.tsx      → /profile
  └── [id].tsx         → /123 (dinamik)

Afzalliklari: avtomatik deep linking, universal links, SEO (web).`,
  codeExamples: [
    {
      title: 'Stack + Tab nested navigatsiya',
      code: `import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, TouchableOpacity } from 'react-native'

// Ekranlar
function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Bosh sahifa</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { id: 1, title: 'Mahsulot' })}
        style={{ marginTop: 16, padding: 12, backgroundColor: '#007AFF', borderRadius: 8 }}
      >
        <Text style={{ color: '#fff' }}>Batafsil</Text>
      </TouchableOpacity>
    </View>
  )
}

function DetailsScreen({ route }: any) {
  const { id, title } = route.params
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ID: {id}</Text>
      <Text>Nomi: {title}</Text>
    </View>
  )
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Profil</Text>
    </View>
  )
}

// Navigatorlar
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Bosh sahifa' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Batafsil' }} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}`,
      language: 'tsx',
      description: 'Tab ichida Stack navigator — eng ko\'p ishlatiladigan pattern',
    },
    {
      title: 'TypeScript bilan type-safe navigatsiya',
      code: `import { NativeStackScreenProps } from '@react-navigation/native-stack'

// Route parametrlarini aniqlash
type RootStackParamList = {
  Home: undefined
  Details: { id: number; title: string }
  Profile: { userId: string }
}

// Screen props tipi
type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type DetailsProps = NativeStackScreenProps<RootStackParamList, 'Details'>

function HomeScreen({ navigation }: HomeProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        // TypeScript tekshiradi — id va title majburiy!
        navigation.navigate('Details', { id: 42, title: 'Salom' })
      }}
    >
      <Text>Batafsil</Text>
    </TouchableOpacity>
  )
}

function DetailsScreen({ route, navigation }: DetailsProps) {
  // route.params tipi avtomatik: { id: number; title: string }
  const { id, title } = route.params

  return (
    <View>
      <Text>ID: {id}, Nomi: {title}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Orqaga</Text>
      </TouchableOpacity>
    </View>
  )
}`,
      language: 'tsx',
      description: 'TypeScript bilan navigation parametrlari type-safe',
    },
    {
      title: 'Deep Linking konfiguratsiya',
      code: `import { NavigationContainer } from '@react-navigation/native'

// Deep linking sozlamalari
const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      // myapp://home yoki https://myapp.com/home
      Home: 'home',
      // myapp://product/42 yoki https://myapp.com/product/42
      ProductDetails: 'product/:id',
      // myapp://profile/ali
      Profile: 'profile/:username',
      // Nested navigatorlar
      Settings: {
        screens: {
          Notifications: 'settings/notifications',
          Privacy: 'settings/privacy',
        },
      },
    },
  },
}

export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<LoadingScreen />}>
      <RootNavigator />
    </NavigationContainer>
  )
}

// URL misollari:
// myapp://product/42        → ProductDetails { id: '42' }
// https://myapp.com/home    → Home screen
// myapp://settings/privacy  → Settings > Privacy`,
      language: 'tsx',
      description: 'Deep linking — tashqi URL dan ilovaning ichki sahifasini ochish',
    },
  ],
  interviewQA: [
    {
      question: "React Navigation da Stack, Tab va Drawer qachon ishlatiladi?",
      answer: "Stack — asosiy navigatsiya (sahifadan sahifaga o'tish, orqaga qaytish). Tab — ilovaning asosiy bo'limlari (Home, Search, Profile). Drawer — sozlamalar, menyu (Gmail kabi). Ko'pincha nested ishlatiadi: Tab ichida Stack, Drawer ichida Tab+Stack. Masalan: Drawer > Tab > Stack.",
    },
    {
      question: "Deep linking nima va nima uchun muhim?",
      answer: "Deep linking — tashqi URL orqali ilovaning ichki sahifasini ochish. Misol: push notification dagi link → mahsulot sahifasi. 2 turi: URI scheme (myapp://product/42) va Universal Links (https://myapp.com/product/42). Muhim sabab: marketing kampaniyalar, push notifications, boshqa ilovalardan link.",
    },
    {
      question: "Expo Router va React Navigation orasidagi farq nima?",
      answer: "Expo Router fayl tizimiga asoslangan (Next.js kabi) — app/ papkadagi fayllar avtomatik route bo'ladi. React Navigation esa konfiguratsiya asosida — navigatorlarni qo'lda yaratish kerak. Expo Router ichida React Navigation ishlatadi! Expo Router afzalligi: avtomatik deep linking, web qo'llab-quvvatlash, oddiyroq API.",
    },
    {
      question: "Nested navigatorlarda ekranlar orasida ma'lumot qanday uzatiladi?",
      answer: "3 usul: 1) Route params — navigation.navigate('Details', { id: 42 }). 2) Context/Zustand — global state orqali. 3) Navigation state — getFocusedRouteNameFromRoute(). Params oddiy ma'lumotlar uchun, global state murakkab holatlar uchun. MUHIM: params da katta objectlar yuborMANG — faqat ID yuborib, ekranda fetch qilish tavsiya etiladi.",
    },
  ],
  relatedTopics: [
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'rn-intro', label: 'React Native Overview' },
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'platform-specific', label: 'Platform Specific' },
  ],
}
