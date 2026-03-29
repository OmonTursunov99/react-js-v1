interface UserInfoProps {
  fullName: string
  phone: string
}

export default function UserInfo({ fullName, phone }: UserInfoProps) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-lg bg-gray-100 w-full">
      <p className="text-lg font-bold">{fullName}</p>
      <p className="text-sm text-gray-600">{phone}</p>
    </div>
  )
}
