import { useRef, useEffect } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const backdropRef = useRef<HTMLDivElement>(null)

    // isOpen o'zgarganda dialog-ni ochish/yopish
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (isOpen) {
            dialog.showModal()
        } else {
            dialog.close()
        }
    }, [isOpen])

    // Tashqi qismga bosganda yopish (backdrop click)
    function handleBackdropClick(e: React.MouseEvent) {
        if (e.target === backdropRef.current) {
            onClose()
        }
    }

    // ESC bosganda yopish
    function handleCancel(e: React.SyntheticEvent) {
        e.preventDefault()
        onClose()
    }

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            className="backdrop:bg-black/50 bg-transparent p-0 m-auto"
        >
            <div
                ref={backdropRef}
                onClick={handleBackdropClick}
                className="fixed inset-0 flex items-center justify-center"
            >
                <div className="bg-white rounded-xl p-6 min-w-80 max-w-lg shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                        >
                            &times;
                        </button>
                    </div>
                    <div>{children}</div>
                </div>
            </div>
        </dialog>
    )
}
