import { useNotificationStore } from '../../entities/notification'

const typeColors: Record<string, string> = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
}

const typeLabels: Record<string, string> = {
    info: 'Ma\'lumot',
    success: 'Muvaffaqiyat',
    warning: 'Ogohlantirish',
    error: 'Xato',
}

export default function SettingsPage() {
    // Zustand — kerakli qismni tanlash (selector)
    const notifications = useNotificationStore((s) => s.notifications)
    const filter = useNotificationStore((s) => s.filter)
    const setFilter = useNotificationStore((s) => s.setFilter)
    const markAsRead = useNotificationStore((s) => s.markAsRead)
    const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
    const removeNotification = useNotificationStore((s) => s.removeNotification)
    const clearAll = useNotificationStore((s) => s.clearAll)
    const addNotification = useNotificationStore((s) => s.addNotification)

    const filtered = notifications.filter((n) => {
        if (filter === 'unread') return !n.read
        if (filter === 'read') return n.read
        return true
    })

    const unreadCount = notifications.filter((n) => !n.read).length

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Bildirishnomalar
                    {unreadCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-sm bg-red-500 text-white rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => addNotification({
                            title: 'Test bildirishnoma',
                            message: 'Bu test uchun yaratilgan bildirishnoma.',
                            type: 'info',
                        })}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        + Yangi
                    </button>
                    <button
                        onClick={markAllAsRead}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-200"
                    >
                        Hammasini o'qish
                    </button>
                    <button
                        onClick={clearAll}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Tozalash
                    </button>
                </div>
            </div>

            {/* Filtrlar */}
            <div className="flex gap-2">
                {(['all', 'unread', 'read'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            filter === f
                                ? 'bg-blue-500 text-white'
                                : 'border border-gray-300 hover:bg-gray-200'
                        }`}
                    >
                        {f === 'all' ? 'Hammasi' : f === 'unread' ? 'O\'qilmagan' : 'O\'qilgan'}
                        {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
                    </button>
                ))}
            </div>

            {/* Bildirishnomalar ro'yxati */}
            {filtered.length === 0 ? (
                <p className="text-gray-400 text-sm">Bildirishnomalar yo'q</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((n) => (
                        <div
                            key={n.id}
                            className={`flex justify-between items-start p-4 rounded-xl border transition-colors ${
                                typeColors[n.type]
                            } ${!n.read ? 'border-l-4' : 'opacity-60'}`}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{n.title}</span>
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-white/50">
                                        {typeLabels[n.type]}
                                    </span>
                                    {!n.read && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    )}
                                </div>
                                <p className="text-sm opacity-80">{n.message}</p>
                                <p className="text-xs opacity-50">{n.date}</p>
                            </div>
                            <div className="flex gap-1">
                                {!n.read && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        className="px-2 py-1 text-xs rounded bg-white/50 hover:bg-white/80"
                                    >
                                        O'qish
                                    </button>
                                )}
                                <button
                                    onClick={() => removeNotification(n.id)}
                                    className="px-2 py-1 text-xs rounded bg-white/50 hover:bg-white/80"
                                >
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
