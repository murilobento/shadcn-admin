import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailPlus, Send } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { useUsers } from './users-provider'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Por favor, insira um email para convidar.' : undefined,
  }),
  role: z.string().min(1, 'Cargo é obrigatório.'),
  desc: z.string().optional(),
})

type UserInviteForm = z.infer<typeof formSchema>

interface UserInviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({
  open,
  onOpenChange,
}: UserInviteDialogProps) {
  const { triggerRefresh } = useUsers()
  const form = useForm<UserInviteForm>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', role: '', desc: '' },
  })

  const onSubmit = async (values: UserInviteForm) => {
    try {
      await api.post('/users/invite', values)
      toast.success('Convite enviado com sucesso')
      form.reset()
      onOpenChange(false)
      triggerRefresh()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Falha ao enviar convite')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle className='flex items-center gap-2'>
            <MailPlus /> Convidar Usuário
          </DialogTitle>
          <DialogDescription>
            Convide um novo usuário para se juntar à sua equipe enviando um convite por email. Atribua um cargo para definir seu nível de acesso.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='user-invite-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='eg: john.doe@gmail.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Selecione um cargo'
                    items={roles.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='desc'
              render={({ field }) => (
                <FormItem className=''>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      className='resize-none'
                      placeholder='Adicione uma nota pessoal ao seu convite (opcional)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-y-2'>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
          <Button type='submit' form='user-invite-form'>
            Convidar <Send />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
