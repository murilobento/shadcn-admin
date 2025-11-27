'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

type CustomersDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Customer
}

export function CustomersDeleteDialog({
    open,
    onOpenChange,
    currentRow,
}: CustomersDeleteDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeleteMode, setIsDeleteMode] = useState(false)
    const { triggerRefresh } = useCustomers()

    const handleConfirm = async () => {
        setIsDeleting(true)
        try {
            if (isDeleteMode) {
                await api.delete(`/customers/${currentRow.id}`)
                toast.success('Cliente excluído com sucesso')
            } else {
                await api.patch(`/customers/${currentRow.id}`, { status: 'inactive' })
                toast.success('Cliente inativado com sucesso')
            }
            onOpenChange(false)
            triggerRefresh()
        } catch (error: any) {
            toast.error(
                error.response?.data?.error ||
                `Falha ao ${isDeleteMode ? 'excluir' : 'inativar'} cliente`
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {isDeleteMode ? 'Excluir Cliente' : 'Inativar Cliente'}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        O que você deseja fazer com{' '}
                        <span className='font-bold'>{currentRow.name}</span>?
                        <br />
                        <br />
                        Recomendamos apenas inativar o cadastro para manter o histórico de
                        vendas e informações.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className='flex items-center space-x-2 py-4'>
                    <input
                        type='checkbox'
                        id='delete-mode'
                        className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                        checked={isDeleteMode}
                        onChange={(e) => setIsDeleteMode(e.target.checked)}
                    />
                    <label
                        htmlFor='delete-mode'
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                        Quero excluir permanentemente (Irreversível)
                    </label>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleConfirm()
                        }}
                        disabled={isDeleting}
                        className={
                            isDeleteMode
                                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                : ''
                        }
                    >
                        {isDeleting
                            ? 'Processando...'
                            : isDeleteMode
                                ? 'Excluir Permanentemente'
                                : 'Inativar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
