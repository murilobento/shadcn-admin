import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  ShoppingCart,
  Package,
  ShoppingBag,
  Truck,
  ClipboardCheck,
  ArrowLeftRight,
  ArrowUpCircle,
  ArrowDownCircle,
  Briefcase,
  Store,
  Warehouse,
  DollarSign,
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
      logo: Briefcase,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
            {
              title: 'Usuários',
              url: '/admin/users',
              icon: Users,
            },
            {
              title: 'Cargos e Permissões',
              url: '/admin/roles',
              icon: Shield,
            },
            {
              title: 'Configurações',
              url: '/admin/settings',
              icon: Settings,
            },
          ],
        },
      ],
    },
    {
      name: 'Comercial',
      logo: Store,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
            {
              title: 'Clientes',
              url: '/commercial/customers',
              icon: Users,
            },
            {
              title: 'Vendas',
              url: '/commercial/sales',
              icon: ShoppingCart,
            },
          ],
        },
      ],
    },
    {
      name: 'Estoque',
      logo: Warehouse,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
            {
              title: 'Inventário',
              url: '/stock/inventory',
              icon: Package,
            },
            {
              title: 'Compras',
              url: '/stock/purchases',
              icon: ShoppingBag,
            },
            {
              title: 'Fornecedor',
              url: '/stock/suppliers',
              icon: Truck,
            },
            {
              title: 'Acerto de Estoque',
              url: '/stock/stock-adjustment',
              icon: ClipboardCheck,
            },
            {
              title: 'Movimentação de Estoque',
              url: '/stock/stock-movement',
              icon: ArrowLeftRight,
            },
          ],
        },
      ],
    },
    {
      name: 'Financeiro',
      logo: DollarSign,
      navGroups: [
        {
          title: 'General',
          items: [
            {
              title: 'Dashboard',
              url: '/',
              icon: LayoutDashboard,
            },
            {
              title: 'Contas a Pagar',
              url: '/financial/accounts-payable',
              icon: ArrowUpCircle,
            },
            {
              title: 'Contas a Receber',
              url: '/financial/accounts-receivable',
              icon: ArrowDownCircle,
            },
          ],
        },
      ],
    },
  ],
}
