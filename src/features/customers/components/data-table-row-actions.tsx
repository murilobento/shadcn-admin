import { Edit, MoreHorizontal, Trash, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Row } from '@tanstack/react-table'
import { type Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const customer = row.original as Customer
    const { setOpen, setCurrentRow } = useCustomers()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                    <MoreHorizontal className='h-4 w-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(customer)
                        setOpen('edit')
                    }}
                >
                    <Edit className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        // Logic to duplicate or other actions
                    }}
                >
                    <User className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                    Make a copy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(customer)
                        setOpen('delete')
                    }}
                    className='!text-destructive'
                >
                    <Trash className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
