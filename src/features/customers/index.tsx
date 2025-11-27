import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CustomersDialogs } from './components/customers-dialogs'
import { CustomersPrimaryButtons } from './components/customers-primary-buttons'
import { CustomersProvider } from './components/customers-provider'
import { CustomersTable } from './components/customers-table'


const route = getRouteApi('/_authenticated/commercial/customers/')

export function Customers() {
    const search = route.useSearch()
    const navigate = route.useNavigate()

    return (
        <CustomersProvider>
            <Header fixed>
                <Search />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />

                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Lista de Clientes</h2>
                        <p className='text-muted-foreground'>
                            Gerencie seus clientes aqui.
                        </p>
                    </div>
                    <CustomersPrimaryButtons />
                </div>
                <CustomersTable search={search} navigate={navigate as any} />
            </Main>

            <CustomersDialogs />
        </CustomersProvider>
    )
}
