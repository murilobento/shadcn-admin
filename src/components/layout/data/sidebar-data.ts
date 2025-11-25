import {
  LayoutDashboard,
  Command,
  GalleryVerticalEnd,
  AudioWaveform,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  generalNav: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
  ],
  modules: [
    {
      name: 'Administrativo',
      logo: Command,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
          ],
        },
      ],
    },
    {
      name: 'Comercial',
      logo: GalleryVerticalEnd,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
          ],
        },
      ],
    },
    {
      name: 'Estoque',
      logo: AudioWaveform,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
          ],
        },
      ],
    },
    {
      name: 'Financeiro',
      logo: Command,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
          ],
        },
      ],
    },
  ],
}
