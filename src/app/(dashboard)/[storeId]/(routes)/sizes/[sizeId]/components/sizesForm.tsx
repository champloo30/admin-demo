'use client'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Size } from '@prisma/client'
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

interface SizeFormProps {
  initialData: Size | null
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
})

type SizeFormValues = z.infer<typeof formSchema>

const SizeForm: React.FC<SizeFormProps> = ({
  initialData
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const router = useRouter()
  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })

  const title = initialData ? 'Edit Size' : 'Create Size'
  const description = initialData ? 'Edit a size' : 'Add a new size'
  const toastMsg = initialData ? 'Size updated.' : 'Size created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function onSubmit(data: SizeFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success('Size deleted.')
    } catch (error) {
      toast.error('Make sure you have removed all products using this size.')
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
            title='Delete Size'
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
                    <Input disabled={loading} placeholder='Size name' {...field} />
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
                  <Select 
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue 
                            defaultValue={field.value} 
                            placeholder='Select a size'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='XS'>
                          XS
                        </SelectItem>
                        <SelectItem value='S'>
                          S
                        </SelectItem>
                        <SelectItem value='M'>
                          M
                        </SelectItem>
                        <SelectItem value='L'>
                          L
                        </SelectItem>
                        <SelectItem value='XL'>
                          XL
                        </SelectItem>
                        <SelectItem value='XXL'>
                          XXL
                        </SelectItem>
                        <SelectItem value='3XL'>
                          3XL
                        </SelectItem>
                      </SelectContent>
                    </Select>
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

export default SizeForm
