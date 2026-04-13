import type { Topic } from '../../../types'

export const coreComponents: Topic = {
  id: 'core-components',
  title: 'Core Components',
  importance: 3,
  status: 'to-learn',
  description: 'View, Text, ScrollView, FlatList, Image, TouchableOpacity',
  content: `React Native da web elementlar (div, span, img) o'rniga maxsus native komponentlar ishlatiladi. Ular to'g'ridan-to'g'ri platforma native elementlariga tarjima qilinadi.

═══════════════════════════════════════
  VIEW
═══════════════════════════════════════

View — eng asosiy komponent (web dagi <div> ga o'xshash).
Barcha layout va konteyner uchun ishlatiladi.

  <View style={{ flex: 1, padding: 16 }}>
    <Text>Kontent</Text>
  </View>

View standart holda flexbox layout ishlatadi (direction: 'column').

═══════════════════════════════════════
  TEXT
═══════════════════════════════════════

Text — matn ko'rsatish uchun yagona komponent.
React Native da matn FAQAT <Text> ichida bo'lishi SHART:

  // NOTO'G'RI — xato beradi!
  <View>Salom</View>

  // TO'G'RI
  <View><Text>Salom</Text></View>

Text ichma-ich joylashishi mumkin (bold, rang):
  <Text>Oddiy <Text style={{ fontWeight: 'bold' }}>qalin</Text> matn</Text>

═══════════════════════════════════════
  SCROLLVIEW
═══════════════════════════════════════

ScrollView — scrollable konteyner. Barcha children bir vaqtda renderlanadi.

  <ScrollView>
    {items.map(item => <ItemCard key={item.id} item={item} />)}
  </ScrollView>

OGOHLANTIRISH: Ko'p elementlar uchun ScrollView ishlatMANG!
100+ element bo'lsa hammasi bir vaqtda renderlanadi → sekin.
Buning o'rniga FlatList ishlatish kerak.

═══════════════════════════════════════
  FLATLIST
═══════════════════════════════════════

FlatList — katta ro'yxatlar uchun virtuallashtirilgan list.
Faqat ekranda ko'rinadigan elementlar renderlanadi.

  <FlatList
    data={items}
    keyExtractor={item => item.id}
    renderItem={({ item }) => <ItemCard item={item} />}
  />

Afzalliklari:
- Virtualization (faqat ko'rinadigan elementlar)
- Pull-to-refresh (onRefresh)
- Infinite scroll (onEndReached)
- Section support (SectionList)

═══════════════════════════════════════
  IMAGE
═══════════════════════════════════════

Image — rasm ko'rsatish. Lokal va tarmoq rasmlarni qo'llab-quvvatlaydi.

  // Lokal rasm
  <Image source={require('./photo.png')} style={{ width: 100, height: 100 }} />

  // Tarmoq rasm (width/height MAJBURIY)
  <Image source={{ uri: 'https://...' }} style={{ width: 200, height: 200 }} />

═══════════════════════════════════════
  TOUCHABLE KOMPONENTLAR
═══════════════════════════════════════

Foydalanuvchi bosishi mumkin bo'lgan komponentlar:

- TouchableOpacity  — bosishda shaffoflik o'zgaradi
- TouchableHighlight — bosishda fon rangi o'zgaradi
- Pressable         — eng moslashuvchan (React Native 0.63+)

  <TouchableOpacity onPress={() => alert('Bosildi!')}>
    <Text>Bosing</Text>
  </TouchableOpacity>

  <Pressable
    onPress={handlePress}
    onLongPress={handleLongPress}
    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
  >
    <Text>Pressable tugma</Text>
  </Pressable>

═══════════════════════════════════════
  TEXTINPUT
═══════════════════════════════════════

TextInput — matn kiritish maydoni (web dagi <input>).

  <TextInput
    value={text}
    onChangeText={setText}        // onChange EMAS!
    placeholder="Yozing..."
    keyboardType="email-address"  // Klaviatura turi
    secureTextEntry               // Parol rejimi
  />`,
  codeExamples: [
    {
      title: 'FlatList bilan ro\'yxat',
      code: `import { View, Text, FlatList, StyleSheet, Image } from 'react-native'

interface User {
  id: string
  name: string
  avatar: string
  role: string
}

const users: User[] = [
  { id: '1', name: 'Ali', avatar: 'https://i.pravatar.cc/50?u=1', role: 'Developer' },
  { id: '2', name: 'Vali', avatar: 'https://i.pravatar.cc/50?u=2', role: 'Designer' },
  { id: '3', name: 'Sardor', avatar: 'https://i.pravatar.cc/50?u=3', role: 'Manager' },
]

function UserCard({ user }: { user: User }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
      </View>
    </View>
  )
}

export default function UserList() {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserCard user={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<Text>Foydalanuvchilar yo'q</Text>}
    />
  )
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  role: { fontSize: 14, color: '#666' },
  separator: { height: 1, backgroundColor: '#eee' },
})`,
      language: 'tsx',
      description: 'FlatList — virtuallashtirilgan ro\'yxat (faqat ko\'rinadigan elementlar renderlanadi)',
    },
    {
      title: 'TextInput bilan forma',
      code: `import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Xatolik', 'Barcha maydonlarni to\\'ldiring')
      return
    }
    Alert.alert('Muvaffaqiyat', \`Kirish: \${email}\`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirish</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Parol"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Kirish</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})`,
      language: 'tsx',
      description: 'TextInput, TouchableOpacity va Alert bilan login forma',
    },
    {
      title: 'ScrollView va conditional rendering',
      code: `import { View, Text, ScrollView, Image, StyleSheet } from 'react-native'

interface Product {
  id: number
  name: string
  price: number
  image: string
  inStock: boolean
}

function ProductCard({ product }: { product: Product }) {
  return (
    <View style={[styles.card, !product.inStock && styles.outOfStock]}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price} so'm</Text>
      {!product.inStock && (
        <Text style={styles.badge}>Tugagan</Text>
      )}
    </View>
  )
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ScrollView contentContainerStyle={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  card: { width: '48%', margin: '1%', padding: 12, backgroundColor: '#fff', borderRadius: 12 },
  outOfStock: { opacity: 0.5 },
  image: { width: '100%', height: 120, borderRadius: 8 },
  name: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  badge: { color: 'red', fontSize: 12, marginTop: 4 },
})`,
      language: 'tsx',
      description: 'ScrollView bilan grid layout (kam element uchun)',
    },
  ],
  interviewQA: [
    {
      question: "FlatList va ScrollView orasidagi farq nima?",
      answer: "ScrollView barcha children ni bir vaqtda renderla qiladi — 1000 element bo'lsa 1000 tasi renderlanadi. FlatList virtualization ishlatadi — faqat ekranda ko'rinadigan elementlar renderlanadi. Katta ro'yxatlar (100+) uchun DOIM FlatList ishlatish kerak. ScrollView faqat kam kontent uchun (settings sahifa, forma).",
    },
    {
      question: "React Native da nima uchun Text komponenti majburiy?",
      answer: "React Native da matn FAQAT <Text> ichida bo'lishi kerak. Web da <div>matn</div> ishlaydi, lekin RN da <View>matn</View> xato beradi. Sababi: native platformalarda matn rendering alohida mexanizm. iOS da UILabel, Android da TextView ishlatiladi. Text komponenti shu native elementlarga map qilinadi.",
    },
    {
      question: "TouchableOpacity va Pressable orasidagi farq nima?",
      answer: "TouchableOpacity — bosishda opacity o'zgaradi (oddiy va tez). Pressable — React Native 0.63+ dagi yangi API. U ko'proq imkoniyat beradi: pressed holati style, onLongPress, hitSlop (bosish maydoni kengaytirish), android_ripple. Yangi loyihalarda Pressable ishlatish tavsiya etiladi.",
    },
    {
      question: "React Native da Image uchun nima uchun width/height majburiy?",
      answer: "Tarmoq rasmlar uchun RN o'lchamni OLMAYDI — web brauzer kabi rasm yuklanganidan keyin layout qayta hisoblamaydi. Bu CLS (Content Layout Shift) oldini olish uchun. Lokal rasmlar (require) uchun o'lcham avtomatik aniqlanadi. Tarmoq rasmlar uchun DOIM width/height berish yoki aspectRatio ishlatish kerak.",
    },
  ],
  relatedTopics: [
    { techId: 'react-native', sectionId: 'rn-core', topicId: 'styling', label: 'Styling' },
    { techId: 'react-native', sectionId: 'rn-advanced', topicId: 'performance', label: 'Performance' },
  ],
}
