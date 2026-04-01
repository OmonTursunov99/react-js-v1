import { useAppSelector, useAppDispatch } from '../../app/store'
import { togglePackage, deactivateAll } from '../../app/store/internetPackagesSlice'

export default function InternetPackagesPage() {
    const packages = useAppSelector(state => state.internetPackages)
    const dispatch = useAppDispatch()

    const activePackages = packages.filter(p => p.active)
    const totalPrice = activePackages.reduce((sum, p) => sum + p.price, 0)
    const totalGb = activePackages.reduce((sum, p) => sum + p.gb, 0)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Internet paketlar</h1>
                <button
                    onClick={() => dispatch(deactivateAll())}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Hammasini o'chirish
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Faol paketlar</p>
                    <p className="text-2xl font-bold">{activePackages.length}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Jami internet</p>
                    <p className="text-2xl font-bold text-blue-600">{totalGb > 0 ? `${totalGb} GB` : '—'}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Jami narx</p>
                    <p className="text-2xl font-bold text-green-600">{totalPrice.toLocaleString()} so'm</p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {packages.map(pkg => (
                    <div
                        key={pkg.id}
                        className={`flex justify-between items-center p-4 rounded-xl transition-colors ${
                            pkg.active ? 'bg-white' : 'bg-gray-50 opacity-60'
                        }`}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">{pkg.name}</p>
                            <div className="flex gap-3 text-sm text-gray-500">
                                {pkg.gb > 0 && <span>{pkg.gb} GB</span>}
                                <span>{pkg.duration}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-bold">{pkg.price.toLocaleString()} so'm</p>
                            <button
                                onClick={() => dispatch(togglePackage(pkg.id))}
                                className={`px-4 py-1 rounded-lg text-sm transition-colors ${
                                    pkg.active
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'border border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                {pkg.active ? 'Faol' : 'Ulash'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
