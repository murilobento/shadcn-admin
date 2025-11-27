'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const { triggerRefresh } = useUsers()

  const handleConfirm = async () => {
    if (isDeleteMode && value.trim() !== currentRow.email) return

    try {
      if (isDeleteMode) {
        await api.delete(`/users/${currentRow.id}`)
        toast.success('Usuário excluído com sucesso')
      } else {
        await api.patch(`/users/${currentRow.id}`, { status: 'inactive' })
        toast.success('Usuário inativado com sucesso')
      }
      onOpenChange(false)
      triggerRefresh()
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
        `Falha ao ${isDeleteMode ? 'excluir' : 'inativar'} usuário`
      )
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleConfirm}
      disabled={isDeleteMode && value.trim() !== currentRow.email}
      title={
        isDeleteMode ? (
          <span className='text-destructive'>
            <AlertTriangle
              className='stroke-destructive me-1 inline-block'
              size={18}
            />{' '}
            Excluir Usuário
          </span>
        ) : (
          'Inativar Usuário'
        )
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            O que você deseja fazer com o usuário{' '}
            <span className='font-bold'>{currentRow.email}</span>?
            <br />
            Recomendamos apenas inativar o acesso para manter o histórico.
          </p>

          <div className='flex items-center space-x-2 py-2'>
            <input
              type='checkbox'
              id='user-delete-mode'
              className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
              checked={isDeleteMode}
              onChange={(e) => setIsDeleteMode(e.target.checked)}
            />
            <label
              htmlFor='user-delete-mode'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Quero excluir permanentemente (Irreversível)
            </label>
          </div>

          {isDeleteMode && (
            <>
              <p className='mb-2 text-sm text-muted-foreground'>
                Esta ação removerá permanentemente o usuário com o cargo de{' '}
                <span className='font-bold'>
                  {currentRow.role.toUpperCase()}
                </span>{' '}
                do sistema. Isso não pode ser desfeito.
              </p>

              <Label className='my-2'>
                Email:
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder='Digite o email para confirmar a exclusão.'
                />
              </Label>

              <Alert variant='destructive'>
                <AlertTitle>Aviso!</AlertTitle>
                <AlertDescription>
                  Por favor, tenha cuidado, esta operação não pode ser desfeita.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      }
      confirmText={isDeleteMode ? 'Excluir' : 'Inativar'}
      destructive={isDeleteMode}
    />
  )
}
