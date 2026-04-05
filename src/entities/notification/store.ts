import { create } from 'zustand'

export interface Notification {
    id: number
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    read: boolean
    date: string
}

interface NotificationState {
    notifications: Notification[]
    filter: 'all' | 'unread' | 'read'

    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void
    markAsRead: (id: number) => void
    markAllAsRead: () => void
    removeNotification: (id: number) => void
    clearAll: () => void
    setFilter: (filter: NotificationState['filter']) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [
        {
            id: 1,
            title: 'Balans kam',
            message: 'Balansingizda 5 000 so\'m qoldi. Iltimos to\'ldiring.',
            type: 'warning',
            read: false,
            date: '2026-04-02',
        },
        {
            id: 2,
            title: 'Yangi tarif',
            message: 'Gold tarif endi 60 000 so\'m. Maxsus taklif!',
            type: 'info',
            read: false,
            date: '2026-04-01',
        },
        {
            id: 3,
            title: 'To\'lov muvaffaqiyatli',
            message: '50 000 so\'m muvaffaqiyatli to\'landi.',
            type: 'success',
            read: true,
            date: '2026-03-30',
        },
        {
            id: 4,
            title: 'Internet tugadi',
            message: 'Oylik internet paketingiz tugadi.',
            type: 'error',
            read: false,
            date: '2026-03-29',
        },
    ],
    filter: 'all',

    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                {
                    ...notification,
                    id: Date.now(),
                    read: false,
                    date: new Date().toISOString().split('T')[0],
                },
                ...state.notifications,
            ],
        })),

    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            ),
        })),

    markAllAsRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearAll: () => set({ notifications: [] }),

    setFilter: (filter) => set({ filter }),
}))
