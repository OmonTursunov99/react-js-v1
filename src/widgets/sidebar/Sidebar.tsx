import { NavLink } from "react-router";

interface SidebarItem {
    id: number
    path: string
    label: string
    end?: boolean
}

const menuItems: SidebarItem[] = [
    { id: 1, path: "/", label: "Bosh sahifa", end: true },
    { id: 2, path: "/tariffs", label: "Tariflar" },
    { id: 3, path: "/about", label: "Xizmatlar" },
]

export default function Sidebar() {
    return (
        <aside className="w-full">
            <ul className="w-full flex flex-col gap-2 items-start">
                {menuItems.map(item => (
                    <li key={item.id}>
                        <NavLink
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                isActive ? 'text-blue-600' : 'text-gray-600'
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
