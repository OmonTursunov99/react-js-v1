import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface InternetPackage {
    id: number
    name: string
    gb: number
    price: number
    duration: string
    active: boolean
}

const initialState: InternetPackage[] = [
    { id: 1, name: 'Kunlik 1 GB', gb: 1, price: 3000, duration: '1 kun', active: false },
    { id: 2, name: 'Haftalik 5 GB', gb: 5, price: 12000, duration: '7 kun', active: false },
    { id: 3, name: 'Oylik 10 GB', gb: 10, price: 25000, duration: '30 kun', active: true },
    { id: 4, name: 'Oylik 20 GB', gb: 20, price: 45000, duration: '30 kun', active: false },
    { id: 5, name: 'Tungi 5 GB', gb: 5, price: 5000, duration: '30 kun (00:00-06:00)', active: true },
    { id: 6, name: 'Cheksiz YouTube', gb: 0, price: 15000, duration: '30 kun', active: false },
]

const internetPackagesSlice = createSlice({
    name: 'internetPackages',
    initialState,
    reducers: {
        togglePackage(state, action: PayloadAction<number>) {
            const pkg = state.find(p => p.id === action.payload)
            if (pkg) pkg.active = !pkg.active
        },
        activatePackage(state, action: PayloadAction<number>) {
            const pkg = state.find(p => p.id === action.payload)
            if (pkg) pkg.active = true
        },
        deactivatePackage(state, action: PayloadAction<number>) {
            const pkg = state.find(p => p.id === action.payload)
            if (pkg) pkg.active = false
        },
        deactivateAll(state) {
            state.forEach(p => p.active = false)
        },
    },
})

export const { togglePackage, activatePackage, deactivatePackage, deactivateAll } = internetPackagesSlice.actions
export default internetPackagesSlice.reducer
