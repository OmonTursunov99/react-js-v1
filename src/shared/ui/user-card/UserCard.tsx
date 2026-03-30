interface UserCardProps {
    mainTitle: string
    title: string
    subTitle?: string
    hasAction?: boolean
    labelAction?: string
}

export default function UserCard(props: UserCardProps) {
    const { mainTitle, title, subTitle = '' } = props

    return (
        <div className="w-full bg-white rounded-xl flex flex-col items-start gap-2 p-4">
            <p className="text-sm">{title}</p>
            <strong className="text-xl">{mainTitle}</strong>
            <p className="text-sm text-gray-500">{subTitle}</p>
        </div>
    )
}
