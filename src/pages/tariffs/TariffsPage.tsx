import { useState, useRef, useLayoutEffect, useTransition } from 'react'

interface Tariff {
    id: number
    name: string
    price: string
    features: string[]
    details: string
}

const tariffs: Tariff[] = [
    {
        id: 1,
        name: 'Start',
        price: '15 000',
        features: ['1 GB internet', '50 daqiqa', '20 SMS'],
        details: 'Boshlang\'ich foydalanuvchilar uchun eng arzon tarif. Kunlik 50 MB bonus internet.',
    },
    {
        id: 2,
        name: 'Silver',
        price: '35 000',
        features: ['5 GB internet', '200 daqiqa', '100 SMS', 'Telegram bepul'],
        details: 'O\'rta darajadagi foydalanuvchilar uchun. Telegram, WhatsApp bepul. Haftalik 1 GB bonus.',
    },
    {
        id: 3,
        name: 'Gold',
        price: '65 000',
        features: ['15 GB internet', '500 daqiqa', 'Cheksiz SMS', 'Telegram bepul', 'YouTube 3 GB'],
        details: 'Faol foydalanuvchilar uchun premium tarif. YouTube, Instagram uchun alohida 3 GB. 24/7 qo\'llab-quvvatlash.',
    },
    {
        id: 4,
        name: 'Premium',
        price: '99 000',
        features: ['Cheksiz internet', 'Cheksiz daqiqa', 'Cheksiz SMS', 'Barcha ijtimoiy tarmoqlar bepul'],
        details: 'Eng yuqori darajadagi tarif. Cheksiz imkoniyatlar. Roaming uchun 2 GB. VIP xizmat.',
    },
]

// "Qimmat" komponent — ko'p elementlarni render qiladi (simulyatsiya)
function TariffComparison({ selectedId }: { selectedId: number }) {
    return (
        <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Tariflarni solishtirish</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-2">Xususiyat</th>
                        {tariffs.map(t => (
                            <th
                                key={t.id}
                                className={`text-center py-2 ${t.id === selectedId ? 'text-blue-600 font-bold' : 'text-gray-500'}`}
                            >
                                {t.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {['Internet', 'Daqiqa', 'SMS', 'Ijtimoiy tarmoq'].map((row, i) => (
                        <tr key={i} className="border-b">
                            <td className="py-2 text-gray-600">{row}</td>
                            {tariffs.map(t => (
                                <td
                                    key={t.id}
                                    className={`text-center py-2 ${t.id === selectedId ? 'bg-blue-50 font-medium' : ''}`}
                                >
                                    {t.features[i] ?? '—'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default function TariffsPage() {
    const [selectedId, setSelectedId] = useState(1)
    const [comparisonId, setComparisonId] = useState(1)
    const [isPending, startTransition] = useTransition()
    const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 })
    const tabsRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const container = tabsRef.current
        if (!container) return

        const activeButton = container.querySelector(`[data-id="${selectedId}"]`) as HTMLElement | null
        if (!activeButton) return

        setHighlightStyle({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
        })
    }, [selectedId])

    function handleTabClick(id: number) {
        // Muhim (urgent) yangilanish — tab darhol o'zgaradi
        setSelectedId(id)

        // Past ustuvorlikdagi (non-urgent) yangilanish — jadval keyinroq yangilanadi
        startTransition(() => {
            setComparisonId(id)
        })
    }

    const selectedTariff = tariffs.find(t => t.id === selectedId)

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Tariflar</h1>

            {/* Tablar */}
            <div ref={tabsRef} className="relative flex gap-1 bg-white rounded-lg p-1">
                <div
                    className="absolute bottom-1 h-1 bg-blue-500 rounded transition-all duration-300"
                    style={{ left: highlightStyle.left, width: highlightStyle.width }}
                />
                {tariffs.map(tariff => (
                    <button
                        key={tariff.id}
                        data-id={tariff.id}
                        onClick={() => handleTabClick(tariff.id)}
                        className={`px-4 py-2 rounded-md text-sm transition-colors ${
                            selectedId === tariff.id
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tariff.name}
                    </button>
                ))}
            </div>

            {/* Tanlangan tarif — DARHOL yangilanadi */}
            {selectedTariff && (
                <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{selectedTariff.name}</h2>
                        <p className="text-2xl font-bold text-blue-600">{selectedTariff.price} so'm</p>
                    </div>
                    <p className="text-gray-500 text-sm">{selectedTariff.details}</p>
                    <ul className="flex flex-col gap-2">
                        {selectedTariff.features.map((feature, i) => (
                            <li key={i} className="text-gray-600">• {feature}</li>
                        ))}
                    </ul>
                    <button className="self-start px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Ulash
                    </button>
                </div>
            )}

            {/* Solishtirish jadvali — useTransition bilan PAST ustuvorlikda yangilanadi */}
            <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <TariffComparison selectedId={comparisonId} />
            </div>
        </div>
    )
}
