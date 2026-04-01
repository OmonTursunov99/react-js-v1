import { useReducer } from 'react'

interface Service {
    id: number
    name: string
    price: number
    active: boolean
}

// Action turlari
type ServiceAction =
    | { type: 'TOGGLE'; id: number }
    | { type: 'ACTIVATE_ALL' }
    | { type: 'DEACTIVATE_ALL' }
    | { type: 'RESET' }

// Boshlang'ich holat
const initialServices: Service[] = [
    { id: 1, name: 'Kimni qo\'ng\'iroq qildi', price: 500, active: true },
    { id: 2, name: 'Konferens aloqa', price: 1200, active: false },
    { id: 3, name: 'Kutish rejimi', price: 0, active: true },
    { id: 4, name: 'SMS xabarnoma', price: 300, active: false },
    { id: 5, name: 'Internet tungi tarif', price: 2000, active: false },
    { id: 6, name: 'Xalqaro qo\'ng\'iroq', price: 5000, active: false },
]

// Reducer — barcha logika bir joyda
function servicesReducer(state: Service[], action: ServiceAction): Service[] {
    switch (action.type) {
        case 'TOGGLE':
            return state.map(s =>
                s.id === action.id ? { ...s, active: !s.active } : s
            )
        case 'ACTIVATE_ALL':
            return state.map(s => ({ ...s, active: true }))
        case 'DEACTIVATE_ALL':
            return state.map(s => ({ ...s, active: false }))
        case 'RESET':
            return initialServices
    }
}

export default function AboutPage() {
    const [services, dispatch] = useReducer(servicesReducer, initialServices)

    const activeCount = services.filter(s => s.active).length
    const totalPrice = services.filter(s => s.active).reduce((sum, s) => sum + s.price, 0)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Xizmatlar</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => dispatch({ type: 'ACTIVATE_ALL' })}
                        className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Hammasini yoqish
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'DEACTIVATE_ALL' })}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Hammasini o'chirish
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'RESET' })}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-200"
                    >
                        Qaytarish
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Faol xizmatlar: <strong>{activeCount}</strong> / {services.length}</p>
                <p className="text-lg font-bold text-blue-600">{totalPrice.toLocaleString()} so'm/oy</p>
            </div>

            <div className="flex flex-col gap-3">
                {services.map(service => (
                    <div
                        key={service.id}
                        className={`flex justify-between items-center p-4 rounded-xl transition-colors ${
                            service.active ? 'bg-white' : 'bg-gray-50 opacity-60'
                        }`}
                    >
                        <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-gray-500">
                                {service.price > 0 ? `${service.price.toLocaleString()} so'm/oy` : 'Bepul'}
                            </p>
                        </div>
                        <button
                            onClick={() => dispatch({ type: 'TOGGLE', id: service.id })}
                            className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                                service.active
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'border border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                            {service.active ? 'Yoqilgan' : 'Yoqish'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
