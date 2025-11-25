import { type LinkProps } from '@tanstack/react-router'

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type User = {
  name: string
  email: string
  avatar: string
}

type Module = {
  name: string
  logo: React.ElementType
  navGroups: NavGroup[]
}

type SidebarData = {
  user: User
  modules: Module[]
  generalNav: NavItem[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink, Module }
