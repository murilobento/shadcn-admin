import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import api from '@/lib/api'

interface Sale {
  id: number
  user: string
  email: string
  amount: string
  status: string
}

export function RecentSales() {
  const [sales, setSales] = React.useState<Sale[]>([])

  React.useEffect(() => {
    async function fetchSales() {
      try {
        const response = await api.get('/dashboard/activity')
        setSales(response.data)
      } catch (error) {
        console.error('Failed to fetch sales:', error)
      }
    }
    fetchSales()
  }, [])

  return (
    <div className='space-y-8'>
      {sales.map((sale) => (
        <div key={sale.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={`/avatars/0${(sale.id % 5) + 1}.png`} alt='Avatar' />
            <AvatarFallback>{sale.user.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>{sale.user}</p>
              <p className='text-muted-foreground text-sm'>{sale.email}</p>
            </div>
            <div className='font-medium'>{sale.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
