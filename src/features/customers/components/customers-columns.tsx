import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes } from '../data/data'
import { type Customer } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const customersColumns: ColumnDef<Customer>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        meta: {
            className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
        },
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nome' />
        ),
        cell: ({ row }) => (
            <LongText className='max-w-[500px] ps-3 truncate font-medium'>{row.getValue('name')}</LongText>
        ),
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none w-full'
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='E-mail' />
        ),
        cell: ({ row }) => (
            <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
        ),
    },
    {
        accessorKey: 'phoneNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Telefone' />
        ),
        cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const { status } = row.original
            const badgeColor = callTypes.get(status)
            const statusMap: Record<string, string> = {
                active: 'Ativo',
                inactive: 'Inativo',
                blocked: 'Bloqueado',
            }
            return (
                <div className='flex space-x-2 w-[100px]'>
                    <Badge variant='outline' className={cn('capitalize', badgeColor)}>
                        {statusMap[status] || status}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableHiding: false,
        enableSorting: false,
    },
    {
        accessorKey: 'city',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Cidade' />
        ),
        cell: ({ row }) => <div>{row.getValue('city')}</div>,
        enableSorting: true,
    },
    {
        id: 'actions',
        cell: DataTableRowActions,
    },
]
