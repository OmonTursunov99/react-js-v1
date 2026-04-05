import { BrowserRouter, Routes, Route } from 'react-router'
import { DashboardLayout, EmptyLayout } from '../layouts'
import { HomePage, AboutPage, NotFoundPage, TariffsPage, InternetPackagesPage, SettingsPage } from '../../pages'

export default function RouterProvider() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Header + Footer bilan sahifalar */ }
                <Route element={ <DashboardLayout/> }>
                    <Route path="/" element={ <HomePage/> }/>
                    <Route path="/about" element={ <AboutPage/> }/>
                    <Route path="/tariffs" element={ <TariffsPage /> } />
                    <Route path="/internet" element={ <InternetPackagesPage /> } />
                    <Route path="/settings" element={ <SettingsPage /> } />
                </Route>

                {/* Header/Footer siz sahifalar */ }
                <Route element={ <EmptyLayout/> }>
                    <Route path="*" element={ <NotFoundPage/> }/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
