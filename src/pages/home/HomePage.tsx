import { UserCard, Tabs } from "../../shared"

export default function HomePage() {
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
        </div>
    )
}
