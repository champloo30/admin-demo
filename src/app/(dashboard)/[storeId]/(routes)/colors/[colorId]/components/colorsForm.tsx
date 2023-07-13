'use client'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Color } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alertModal'

interface ColorFormProps {
  initialData: Color | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be a valid hex code'
  })
})

type ColorFormValues = z.infer<typeof formSchema>

const ColorForm: React.FC<ColorFormProps> = ({
  initialData
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const router = useRouter()
  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })

  const title = initialData ? 'Edit Color' : 'Create Color'
  const description = initialData ? 'Edit a color' : 'Add a new color'
  const toastMsg = initialData ? 'Color updated.' : 'Color created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function onSubmit(data: ColorFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success(toastMsg)
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }       
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success('Color deleted.')
    } catch (error) {
      toast.error('Make sure you have removed all products using this color.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex justify-between items-center'>
        <Heading 
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='icon'
            title='Delete Color'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form className='w-full space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-1/3 grid grid-rows-1 gap-4">
            <FormField 
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Color name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value:</FormLabel>
                    <FormControl>
                      <div className='flex items-center gap-4'>
                        <Input disabled={loading} placeholder='Color value' {...field} />
                        <div 
                          className='border border-black p-4 rounded-full'
                          style={{ backgroundColor: field.value }}
                        />
                      </div>
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-4'>
            <Button variant='outline' disabled={loading} type='button' onClick={() => router.push(`/${params.storeId}/sizes`)}>Cancel</Button>
            <Button disabled={loading} type='submit'>{action}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ColorForm
