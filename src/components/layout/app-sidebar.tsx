import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Command } from 'lucide-react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { ModuleSwitcher } from './module-switcher'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const [activeModule, setActiveModule] = React.useState(sidebarData.modules[0])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-2'>
          <Command className='size-6' />
          <span className='font-bold'>Shadcn Admin</span>
        </div>
        <SidebarMenu>
          {sidebarData.generalNav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <ModuleSwitcher
          modules={sidebarData.modules}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
        />
      </SidebarHeader>
      <SidebarContent>
        {activeModule.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
