'use client'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Store } from '@prisma/client'
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
import { ApiAlert } from '@/components/ui/apiAlert'
import { useOrigin } from '@/hooks/useOrigin'

interface settingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm: React.FC<settingsFormProps> = ({
  initialData
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  async function onSubmit(data: SettingsFormValues) {
    try {
      setLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      toast.success('Store updated.')
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }       
  }

  async function onDelete() {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted.')
    } catch (error) {
      toast.error('Make sure you have removed all products and categories.')
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
          title='Settings'
          description='Manage store preferences'
        />
        <Button
          disabled={loading}
          variant='destructive'
          size='icon'
          title='Delete Store'
          onClick={() => setOpen(true)}
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form className='w-full space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Name:</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Store Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className='ml-auto' disabled={loading} type='submit'>Save Changes</Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert 
        title='NEXT_PUBLIC_API_URL' 
        description={`${origin}/api/${params.storeId}`} 
        variant='public' 
      />
    </div>
  )
}

export default SettingsForm
