import { ChevronsUpDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { type Module } from './types'

type ModuleSwitcherProps = {
    modules: Module[]
    activeModule: Module
    setActiveModule: (module: Module) => void
}

export function ModuleSwitcher({
    modules,
    activeModule,
    setActiveModule,
}: ModuleSwitcherProps) {
    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                        >
                            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                                <activeModule.logo className='size-4' />
                            </div>
                            <div className='grid flex-1 text-start text-sm leading-tight'>
                                <span className='truncate text-xs'>Módulo</span>
                                <span className='truncate font-semibold'>
                                    {activeModule.name}
                                </span>
                            </div>
                            <ChevronsUpDown className='ms-auto' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                        align='start'
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className='text-muted-foreground text-xs'>
                            Módulos
                        </DropdownMenuLabel>
                        {modules.map((module) => (
                            <DropdownMenuItem
                                key={module.name}
                                onClick={() => setActiveModule(module)}
                                className='gap-2 p-2'
                            >
                                <div className='flex size-6 items-center justify-center rounded-sm border'>
                                    <module.logo className='size-4 shrink-0' />
                                </div>
                                {module.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
