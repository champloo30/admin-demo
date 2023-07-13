'use client'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Billboard } from '@prisma/client'
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
import ImageUpload from '@/components/ui/imageUpload'

interface BillboardFormProps {
  initialData: Billboard | null
}

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const router = useRouter()
  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })
  
  const title = initialData ? 'Edit Billboard' : 'Create Billboard'
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
  const toastMsg = initialData ? 'Billboard updated.' : 'Billboard created.'
  const action = initialData ? 'Save changes' : 'Create'

  
  console.log(title);

  async function onSubmit(data: BillboardFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success('Billboard deleted.')
    } catch (error) {
      toast.error('Make sure you have removed all categories using this billboard.')
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
            title='Delete Billboard'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form className='w-full space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
          <FormField 
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image:</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label:</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Billboard label' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-4'>
            <Button variant='outline' disabled={loading} type='button' onClick={() => router.push(`/${params.storeId}/billboards`)}>Cancel</Button>
            <Button disabled={loading} type='submit'>{action}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BillboardForm
