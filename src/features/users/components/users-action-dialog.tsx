'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
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
import { Switch } from '@/components/ui/switch'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { type User } from '../data/schema'
import { useUsers } from './users-provider'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'Nome é obrigatório.'),
    lastName: z.string().min(1, 'Sobrenome é obrigatório.'),
    email: z.string().email('Email inválido.'),
    role: z.string().min(1, 'Cargo é obrigatório.'),
    status: z.string().min(1, 'Status é obrigatório.'),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    isEdit: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.isEdit && (!data.password || data.password === '')) {
        return false
      }
      return true
    },
    {
      message: 'Senha é obrigatória para novos usuários.',
      path: ['password'],
    }
  )
  .refine(
    (data) => {
      if (data.password && data.confirmPassword !== data.password) {
        return false
      }
      return true
    },
    {
      message: 'As senhas não coincidem.',
      path: ['confirmPassword'],
    }
  )

type UserForm = z.infer<typeof formSchema>

interface UserActionDialogProps {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const { triggerRefresh } = useUsers()
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: isEdit
      ? {
        firstName: currentRow.firstName,
        lastName: currentRow.lastName,
        email: currentRow.email,
        role: currentRow.role,
        status: currentRow.status,
        password: '',
        confirmPassword: '',
        isEdit,
      }
      : {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        status: 'active',
        password: '',
        confirmPassword: '',
        isEdit,
      },
  })

  const onSubmit = async (values: UserForm) => {
    try {
      if (isEdit) {
        await api.put(`/users/${currentRow.id}`, values)
        toast.success('Usuário atualizado com sucesso')
      } else {
        await api.post('/users', values)
        toast.success('Usuário criado com sucesso')
      }
      form.reset()
      onOpenChange(false)
      triggerRefresh()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Falha ao salvar usuário')
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Atualize o usuário aqui. ' : 'Crie um novo usuário aqui. '}
            Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit as any)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control as any}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Sobrenome
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Cargo</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Selecione um cargo'
                      className='col-span-4'
                      items={roles.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Ativo</FormLabel>
                    <FormControl>
                      <div className='col-span-4 flex items-center space-x-2'>
                        <Switch
                          checked={field.value === 'active'}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 'active' : 'inactive')
                          }
                        />
                        <span className='text-sm text-muted-foreground'>
                          {field.value === 'active' ? 'Sim' : 'Não'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Senha
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Confirmar Senha
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
