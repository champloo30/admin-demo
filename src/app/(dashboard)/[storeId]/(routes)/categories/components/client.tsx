'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { CategoryColumn, columns } from './columns'
import { DataTable } from '@/components/ui/dataTable'
import ApiList from '@/components/ui/apiList'

interface CategoryClientProps {
  data: CategoryColumn[]
}

export const Client: React.FC<CategoryClientProps> = ({
  data
}) => {
  const router = useRouter()
  const params = useParams()

  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex justify-between items-center'>
        <Heading 
          title={`Categories (${data.length})`}
          description='Manage categories for your store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className='h-4 w-4 mr-2' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      {/* <Separator /> */}
      <Heading title='API' description='API calls for categories' />
      <Separator />
      <ApiList entityName='categories' entityIdName='categoryId' />
    </div>
  )
}

export default Client
