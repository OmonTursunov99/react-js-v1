import { UserCard } from "../../shared"

export default function HomePage() {
    return (
        <div className="grid gap-4 grid-cols-[6fr_3fr]">
            <div className="w-full">
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
            </div>
            <div className="w-full">

            </div>
        </div>
    )
}
