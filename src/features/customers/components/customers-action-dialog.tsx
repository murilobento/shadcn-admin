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
import { type Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

const formSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório.'),
    email: z.email({
        error: (iss) => (iss.input === '' ? 'E-mail é obrigatório.' : undefined),
    }),
    phoneNumber: z.string().min(1, 'Telefone é obrigatório.'),
    status: z.string().min(1, 'Status é obrigatório.'),
    address: z.string().optional(),
    city: z.string().optional(),
    isEdit: z.boolean(),
})

type CustomerForm = z.infer<typeof formSchema>

type CustomersActionDialogProps = {
    currentRow?: Customer
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CustomersActionDialog({
    currentRow,
    open,
    onOpenChange,
}: CustomersActionDialogProps) {
    const isEdit = !!currentRow
    const form = useForm<CustomerForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                ...currentRow,
                isEdit,
            }
            : {
                name: '',
                email: '',
                phoneNumber: '',
                status: 'active',
                address: '',
                city: '',
                isEdit,
            },
    })

    const { triggerRefresh } = useCustomers()

    const onSubmit = async (values: CustomerForm) => {
        try {
            if (isEdit) {
                await api.put(`/customers/${currentRow.id}`, values)
                toast.success('Cliente atualizado com sucesso')
            } else {
                await api.post('/customers', values)
                toast.success('Cliente criado com sucesso')
            }
            form.reset()
            onOpenChange(false)
            triggerRefresh()
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Falha ao salvar cliente')
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
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>{isEdit ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Atualize o cliente aqui. ' : 'Crie um novo cliente aqui. '}
                        Clique em salvar quando terminar.
                    </DialogDescription>
                </DialogHeader>
                <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
                    <Form {...form}>
                        <form
                            id='customer-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 px-0.5'
                        >
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Nome
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='João Silva'
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
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>E-mail</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='joao.silva@gmail.com'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phoneNumber'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Telefone
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='(11) 99999-9999'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Ativo
                                        </FormLabel>
                                        <FormControl>
                                            <div className='col-span-4 flex items-center space-x-2'>
                                                <Switch
                                                    checked={field.value === 'active'}
                                                    onCheckedChange={(checked) =>
                                                        field.onChange(checked ? 'active' : 'inactive')
                                                    }
                                                />
                                                <span className='text-sm text-muted-foreground'>
                                                    {field.value === 'active'
                                                        ? 'Sim'
                                                        : 'Não'}
                                                </span>
                                            </div>
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='address'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Endereço
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Rua das Flores, 123'
                                                className='col-span-4'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className='col-span-4 col-start-3' />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='city'
                                render={({ field }) => (
                                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                                        <FormLabel className='col-span-2 text-end'>
                                            Cidade
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='São Paulo'
                                                className='col-span-4'
                                                {...field}
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
                    <Button type='submit' form='customer-form'>
                        Salvar alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
