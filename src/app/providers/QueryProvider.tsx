import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data qancha vaqt "yangi" hisoblanadi — shu vaqt ichida qayta fetch yo'q
            staleTime: 5 * 60 * 1000, // 5 daqiqa (default: 0 — darhol eskirgan)

            // Kesh xotiradan qachon o'chiriladi (komponent unmount-dan keyin)
            gcTime: 10 * 60 * 1000, // 10 daqiqa (default: 5 daqiqa)

            // Xato bo'lganda necha marta qayta urinish
            retry: 2, // 2 marta (default: 3)

            // Har urinishdan keyin qancha kutish (ms)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // 1-urinish: 1s, 2-urinish: 2s, 3-urinish: 4s... max 30s

            // Tab-ga qaytganda qayta fetch qilish
            refetchOnWindowFocus: true, // default: true

            // Internet qaytganda qayta fetch qilish
            refetchOnReconnect: true, // default: true

            // Komponent qayta mount bo'lganda qayta fetch
            refetchOnMount: true, // default: true

            // Muntazam interval bilan qayta fetch (polling)
            // refetchInterval: false, // default: false (o'chirilgan)
            // refetchInterval: 30000, // har 30 soniyada

            // Brauzer tab ko'rinmasa ham polling davom etsinmi
            // refetchIntervalInBackground: false, // default: false

            // So'rov ishlashni yoqish/o'chirish
            // enabled: true, // default: true

            // Yangi data yuklanayotganda eski datani ko'rsatish
            // placeholderData: undefined, // default: undefined

            // Network yo'q bo'lganda qanday harakat qilish
            networkMode: 'online', // 'online' | 'always' | 'offlineFirst'
            // 'online' — faqat internet bor bo'lganda (default)
            // 'always' — har doim (offline-first ilovalar uchun)
            // 'offlineFirst' — avval keshdan, keyin fetch

            // Javobdan kerakli qismni olish (har bir query uchun alohida qilish yaxshiroq)
            // select: (data) => data.results,

            // Strukturaviy ulashish — agar data bir xil bo'lsa, eski reference saqlanadi
            structuralSharing: true, // default: true
        },

        mutations: {
            // Mutation (POST/PUT/DELETE) uchun qayta urinish
            retry: 0, // default: 0 (qayta urinish yo'q)

            // Network mode
            networkMode: 'online', // default: 'online'
        },
    },
})

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
