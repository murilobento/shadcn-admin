import { useState } from 'react'
import { Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { type ProductionDetail } from '../data/schema'
import { useProductions } from './productions-provider'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Rascunho', variant: 'secondary' },
  in_production: { label: 'Em Produção', variant: 'default' },
  completed: { label: 'Concluída', variant: 'outline' },
  cancelled: { label: 'Cancelada', variant: 'destructive' },
}

export function ProductionsDetailDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = useProductions()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const { data: detail } = useQuery({
    queryKey: ['production', currentRow?.id],
    queryFn: async () => {
      const res = await api.get(`/productions/${currentRow?.id}`)
      return res.data as { production: ProductionDetail; compositionNeeded: ProductionDetail['compositionNeeded'] }
    },
    enabled: open === 'view' && !!currentRow,
  })

  const production = detail?.production
  const compositionNeeded = detail?.compositionNeeded || []
  const status = production?.status || currentRow?.status || 'draft'
  const statusConfig = statusMap[status] || { label: status, variant: 'secondary' as const }

  async function handleAction(action: 'start' | 'complete' | 'cancel') {
    if (!currentRow) return
    setIsLoading(true)
    try {
      await api.post(`/productions/${currentRow.id}/${action}`)
      queryClient.invalidateQueries({ queryKey: ['productions'] })
      const messages = {
        start: 'Produção iniciada.',
        complete: 'Produção concluída. Estoque atualizado.',
        cancel: 'Produção cancelada.',
      }
      toast.success(messages[action])
      setOpen(null)
      setTimeout(() => setCurrentRow(null), 300)
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Algo deu errado.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={open === 'view'}
      onOpenChange={(state) => {
        if (!state) {
          setOpen(null)
          setTimeout(() => setCurrentRow(null), 300)
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <div className='flex items-center justify-between'>
            <DialogTitle>Detalhes da Produção</DialogTitle>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
          <DialogDescription>
            {production?.product?.name || currentRow?.product?.name} —{' '}
            {production?.quantity || currentRow?.quantity}{' '}
            {production?.product?.unit || currentRow?.product?.unit}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {compositionNeeded.length > 0 && (
            <div>
              <h4 className='mb-2 text-sm font-medium'>Insumos Necessários</h4>
              <div className='space-y-1'>
                {compositionNeeded.map((item) => (
                  <div
                    key={item.supplyId}
                    className='flex items-center justify-between rounded-md border px-3 py-2 text-sm'
                  >
                    <span>{item.supplyName}</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-muted-foreground'>
                        {item.needed} {item.unit}
                      </span>
                      <Badge variant={item.sufficient ? 'default' : 'destructive'}>
                        {item.available} disp.
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(production?.notes || currentRow?.notes) && (
            <div>
              <h4 className='mb-1 text-sm font-medium'>Observação</h4>
              <p className='text-sm text-muted-foreground'>
                {production?.notes || currentRow?.notes}
              </p>
            </div>
          )}

          {production?.completedAt && (
            <div>
              <h4 className='mb-1 text-sm font-medium'>Concluída em</h4>
              <p className='text-sm text-muted-foreground'>
                {new Date(production.completedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          {status === 'draft' && (
            <Button onClick={() => handleAction('start')} disabled={isLoading}>
              {isLoading ? <Loader2 className='animate-spin' /> : <Clock size={16} className='me-1' />}
              Iniciar Produção
            </Button>
          )}
          {status === 'in_production' && (
            <>
              <Button onClick={() => handleAction('complete')} disabled={isLoading}>
                {isLoading ? <Loader2 className='animate-spin' /> : <CheckCircle2 size={16} className='me-1' />}
                Concluir
              </Button>
              <Button variant='destructive' onClick={() => handleAction('cancel')} disabled={isLoading}>
                {isLoading ? <Loader2 className='animate-spin' /> : <XCircle size={16} className='me-1' />}
                Cancelar
              </Button>
            </>
          )}
          {status === 'cancelled' && (
            <Button variant='outline' onClick={() => setOpen(null)}>
              Fechar
            </Button>
          )}
          {status === 'completed' && (
            <Button variant='outline' onClick={() => setOpen(null)}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
