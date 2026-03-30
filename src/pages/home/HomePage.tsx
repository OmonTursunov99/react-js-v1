import { useState } from 'react'
import { UserCard, Tabs, Modal } from "../../shared"

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="grid gap-4 grid-cols-[6fr_3fr]">
            <div className="w-full flex flex-col gap-4">
                <div className="grid w-full grid-cols-2 gap-4">
                    <UserCard
                        mainTitle="56.12 so'm"
                        title="Asosiy balans"
                        subTitle="Kenygi yechish: 15 fevral"
                    />
                    <UserCard
                        mainTitle="Joriy tariff"
                        title="Silver staff"
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
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
                onClose={() => setIsModalOpen(false)}
                title="Balansni to'ldirish"
            >
                <div className="flex flex-col gap-3">
                    <input
                        type="number"
                        placeholder="Summani kiriting"
                        className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600">
                        To'lash
                    </button>
                </div>
            </Modal>
        </div>
    )
}
