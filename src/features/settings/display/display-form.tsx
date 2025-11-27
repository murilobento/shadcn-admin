import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const items = [
  {
    id: 'recents',
    label: 'Recentes',
  },
  {
    id: 'home',
    label: 'Início',
  },
  {
    id: 'applications',
    label: 'Aplicativos',
  },
  {
    id: 'desktop',
    label: 'Área de Trabalho',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documentos',
  },
] as const

const displayFormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Você deve selecionar pelo menos um item.',
  }),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// This can come from your database or API.
const defaultValues: Partial<DisplayFormValues> = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='items'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>Barra Lateral</FormLabel>
                <FormDescription>
                  Selecione os itens que você deseja exibir na barra lateral.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name='items'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className='flex flex-row items-start'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                )
                            }}
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Atualizar exibição</Button>
      </form>
    </Form>
  )
}
