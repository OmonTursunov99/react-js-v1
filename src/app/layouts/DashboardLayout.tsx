import { useMemo } from 'react'
import { Outlet } from 'react-router'
import { Header } from '../../widgets'
import { Footer } from '../../widgets'
import { UserInfo } from '../../entities'
import type { User } from '../../entities'
import { formatPhone } from '../../shared'

export default function DashboardLayout() {
    const userData: User = {
        first_name: "Omon",
        last_name: "Tursunov",
        middle_name: "Odilovich",
        phone_number: 998900100505,
    }

    const fullName = useMemo(() => {
        return [ userData.last_name, userData.first_name, userData.middle_name ]
            .filter(Boolean)
            .join(' ')
    }, [ userData.last_name, userData.first_name, userData.middle_name ])

    const formattedPhone = useMemo(() => {
        return formatPhone(userData.phone_number)
    }, [ userData.phone_number ])

    return (
        <>
            <Header/>
            <main className="p-4">
                <UserInfo fullName={ fullName } phone={ formattedPhone }/>
                <div className="w-full grid-cols-[3fr,9fr]">

                    <Outlet/>
                </div>
            </main>
            <Footer/>
        </>
    )
}
