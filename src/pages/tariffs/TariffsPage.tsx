import { useState, useRef, useLayoutEffect } from 'react'

interface Tariff {
    id: number
    name: string
    price: string
    features: string[]
}

const tariffs: Tariff[] = [
    {
        id: 1,
        name: 'Start',
        price: '15 000',
        features: ['1 GB internet', '50 daqiqa', '20 SMS'],
    },
    {
        id: 2,
        name: 'Silver',
        price: '35 000',
        features: ['5 GB internet', '200 daqiqa', '100 SMS', 'Telegram bepul'],
    },
    {
        id: 3,
        name: 'Gold',
        price: '65 000',
        features: ['15 GB internet', '500 daqiqa', 'Cheksiz SMS', 'Telegram bepul', 'YouTube 3 GB'],
    },
    {
        id: 4,
        name: 'Premium',
        price: '99 000',
        features: ['Cheksiz internet', 'Cheksiz daqiqa', 'Cheksiz SMS', 'Barcha ijtimoiy tarmoqlar bepul'],
    },
]

export default function TariffsPage() {
    const [selectedId, setSelectedId] = useState(1)
    const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 })
    const tabsRef = useRef<HTMLDivElement>(null)

    // useLayoutEffect — brauzer ekranga chizishdan OLDIN pozitsiyani hisoblaydi
    // Agar useEffect ishlatilsa — avval eski joyda ko'rinib, keyin yangi joyga "sakraydi" (miltillash)
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

    const selectedTariff = tariffs.find(t => t.id === selectedId)

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-bold">Tariflar</h1>

            {/* Tablar — aktiv tab ostida highlight animatsiya bilan siljiydi */}
            <div ref={tabsRef} className="relative flex gap-1 bg-white rounded-lg p-1">
                {/* Animated highlight */}
                <div
                    className="absolute bottom-1 h-1 bg-blue-500 rounded transition-all duration-300"
                    style={{ left: highlightStyle.left, width: highlightStyle.width }}
                />
                {tariffs.map(tariff => (
                    <button
                        key={tariff.id}
                        data-id={tariff.id}
                        onClick={() => setSelectedId(tariff.id)}
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

            {/* Tanlangan tarif ma'lumoti */}
            {selectedTariff && (
                <div className="bg-white rounded-xl p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{selectedTariff.name}</h2>
                        <p className="text-2xl font-bold text-blue-600">{selectedTariff.price} so'm</p>
                    </div>
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
        </div>
    )
}
