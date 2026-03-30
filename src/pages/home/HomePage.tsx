import { useState, useCallback } from 'react'
import { UserCard, Tabs, Modal } from "../../shared"

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [balance, setBalance] = useState(56.12)
    const [amount, setAmount] = useState('')

    const openModal = useCallback(() => {
        setIsModalOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setIsModalOpen(false)
        setAmount('')
    }, [])

    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value)
    }, [])

    const handlePayment = useCallback(() => {
        const value = parseFloat(amount)
        if (!value || value <= 0) return

        setBalance(prev => prev + value)
        closeModal()
    }, [amount, closeModal])

    return (
        <div className="grid gap-4 grid-cols-[6fr_3fr]">
            <div className="w-full flex flex-col gap-4">
                <div className="grid w-full grid-cols-2 gap-4">
                    <UserCard
                        mainTitle={`${balance.toFixed(2)} so'm`}
                        title="Asosiy balans"
                        subTitle="Keyingi yechish: 15 fevral"
                    />
                    <UserCard
                        mainTitle="Joriy tariff"
                        title="Silver staff"
                    />
                </div>
                <button
                    onClick={openModal}
                    className="self-start px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Balansni to'ldirish
                </button>
                <Tabs
                    tabs={[
                        {
                            id: 'services',
                            label: 'Xizmatlar',
                            content: <p>Ulangan xizmatlar ro'yxati</p>,
                        },
                        {
                            id: 'history',
                            label: 'Tarix',
                            content: <p>To'lovlar tarixi</p>,
                        },
                        {
                            id: 'details',
                            label: 'Tafsilotlar',
                            content: <p>Batafsil ma'lumot</p>,
                        },
                    ]}
                />
            </div>
            <div className="w-full">

            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Balansni to'ldirish"
            >
                <div className="flex flex-col gap-3">
                    <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Summani kiriting"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button
                        onClick={handlePayment}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                    >
                        To'lash
                    </button>
                </div>
            </Modal>
        </div>
    )
}
