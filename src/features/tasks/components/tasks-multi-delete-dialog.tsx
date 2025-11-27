'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type TaskMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETAR'

export function TasksMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: TaskMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Por favor, digite "${CONFIRM_WORD}" para confirmar.`)
      return
    }

    onOpenChange(false)

    toast.promise(sleep(2000), {
      loading: 'Deletando tarefas...',
      success: () => {
        table.resetRowSelection()
        return `Deletado ${selectedRows.length} ${selectedRows.length > 1 ? 'tarefas' : 'tarefa'
          }`
      },
      error: 'Erro',
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Deletar {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'tarefas' : 'tarefa'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Tem certeza que deseja deletar as tarefas selecionadas? <br />
            Esta ação não pode ser desfeita.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span className=''>Confirme digitando "{CONFIRM_WORD}":</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Digite "${CONFIRM_WORD}" para confirmar.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Aviso!</AlertTitle>
            <AlertDescription>
              Por favor, tenha cuidado, esta operação não pode ser desfeita.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Deletar'
      destructive
    />
  )
}
