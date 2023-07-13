'use client'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Billboard, Category } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
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

interface CategoryFormProps {
  initialData: Category | null,
  billboards: Billboard[]
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const params = useParams()
  const router = useRouter()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  })

  const title = initialData ? 'Edit Category' : 'Create Category'
  const description = initialData ? 'Edit a category' : 'Add a new category'
  const toastMsg = initialData ? 'Category updated.' : 'Category created.'
  const action = initialData ? 'Save changes' : 'Create'

  async function onSubmit(data: CategoryFormValues) {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/categories`)
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success('Category deleted.')
    } catch (error) {
      toast.error('Make sure you have removed all products using this category.')
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
            title='Delete Category'
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
                    <Input disabled={loading} placeholder='Category name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard:</FormLabel>
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
                            placeholder='Select a billboard'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem
                            key={billboard.id}
                            value={billboard.id}
                          >
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-4'>
            <Button variant='outline' disabled={loading} type='button' onClick={() => router.push(`/${params.storeId}/categories`)}>Cancel</Button>
            <Button disabled={loading} type='submit'>{action}</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CategoryForm
