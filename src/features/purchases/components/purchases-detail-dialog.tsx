import { useState } from 'react'
import { Loader2, CheckCircle2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePurchases } from './purchases-provider'

const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' }> = {
  pending: { label: 'Pendente', variant: 'secondary' },
  completed: { label: 'Concluída', variant: 'default' },
}

export function PurchasesDetailDialog() {
  const { open, setOpen, currentRow, setCurrentRow } = usePurchases()
  const [isLoading, setIsLoading] = useState(false)
  const [showReverse, setShowReverse] = useState(false)
  const [reverseReason, setReverseReason] = useState('')
  const queryClient = useQueryClient()

  if (!currentRow) return null

  const purchase = currentRow
  const statusConfig = statusMap[purchase.status] || { label: purchase.status, variant: 'secondary' as const }

  async function handleComplete() {
    if (!currentRow) return
    setIsLoading(true)
    try {
      await api.post(`/purchases/${currentRow.id}/complete`)
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      toast.success('Compra concluída. Estoque atualizado.')
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

  async function handleReverse() {
    if (!currentRow || !reverseReason.trim()) return
    setIsLoading(true)
    try {
      await api.post(`/purchases/${currentRow.id}/reverse`, { reason: reverseReason.trim() })
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['stock-balances'] })
      toast.success('Estorno realizado. Estoque revertido.')
      setShowReverse(false)
      setReverseReason('')
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
          setShowReverse(false)
          setReverseReason('')
          setOpen(null)
          setTimeout(() => setCurrentRow(null), 300)
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <div className='flex items-center justify-between'>
            <DialogTitle>Detalhes da Compra</DialogTitle>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
          <DialogDescription>
            Fornecedor: <strong>{purchase.supplier}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <h4 className='mb-2 text-sm font-medium'>Itens</h4>
            <div className='space-y-1'>
              {purchase.items.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between rounded-md border px-3 py-2 text-sm'
                >
                  <span>{item.supply.name}</span>
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>
                      {item.packages} {item.supply.packageUnit || 'emb.'}(s)
                    </span>
                    <span className='text-muted-foreground'>=</span>
                    <strong>{item.quantity} {item.supply.unit}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {purchase.notes && (
            <div>
              <h4 className='mb-1 text-sm font-medium'>Observação</h4>
              <p className='text-sm text-muted-foreground'>{purchase.notes}</p>
            </div>
          )}

          {purchase.reversedAt && (
            <div className='rounded-md border border-destructive/50 bg-destructive/5 px-3 py-2'>
              <h4 className='mb-1 text-sm font-medium text-destructive'>Estorno</h4>
              <p className='text-sm text-muted-foreground'>
                {new Date(purchase.reversedAt).toLocaleString()}
              </p>
              {purchase.reversalReason && (
                <p className='mt-1 text-sm'>Motivo: {purchase.reversalReason}</p>
              )}
            </div>
          )}

          <div>
            <h4 className='mb-1 text-sm font-medium'>Criada em</h4>
            <p className='text-sm text-muted-foreground'>
              {new Date(purchase.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {showReverse && (
          <div className='space-y-2 rounded-md border border-destructive/50 p-3'>
            <Label className='text-sm font-medium text-destructive'>Motivo do Estorno *</Label>
            <Input
              placeholder='Informe o motivo do estorno...'
              value={reverseReason}
              onChange={(e) => setReverseReason(e.target.value)}
              autoFocus
            />
            <p className='text-xs text-muted-foreground'>
              O estoque será revertido e a compra voltará para pendente.
            </p>
          </div>
        )}

        <DialogFooter className='gap-2'>
          {purchase.status === 'pending' && !showReverse && (
            <Button onClick={handleComplete} disabled={isLoading}>
              {isLoading ? <Loader2 className='animate-spin' /> : <CheckCircle2 size={16} className='me-1' />}
              Concluir
            </Button>
          )}
          {purchase.status === 'completed' && !showReverse && (
            <Button variant='destructive' onClick={() => setShowReverse(true)}>
              <RotateCcw size={16} className='me-1' />
              Estornar
            </Button>
          )}
          {showReverse && (
            <>
              <Button
                variant='destructive'
                onClick={handleReverse}
                disabled={isLoading || !reverseReason.trim()}
              >
                {isLoading ? <Loader2 className='animate-spin' /> : <RotateCcw size={16} className='me-1' />}
                Confirmar Estorno
              </Button>
              <Button variant='outline' onClick={() => { setShowReverse(false); setReverseReason('') }}>
                Cancelar
              </Button>
            </>
          )}
          {!showReverse && (
            <Button variant='outline' onClick={() => setOpen(null)}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
