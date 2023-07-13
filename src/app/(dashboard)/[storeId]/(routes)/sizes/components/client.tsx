'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { SizeColumn, columns } from './columns'
import { DataTable } from '@/components/ui/dataTable'
import ApiList from '@/components/ui/apiList'

interface SizeClientProps {
  data: SizeColumn[]
}

export const Client: React.FC<SizeClientProps> = ({
  data
}) => {
  const router = useRouter()
  const params = useParams()

  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex justify-between items-center'>
        <Heading 
          title={`Sizes (${data.length})`}
          description='Manage sizes for your store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className='h-4 w-4 mr-2' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      {/* <Separator /> */}
      <Heading title='API' description='API calls for Sizes' />
      <Separator />
      <ApiList entityName='sizes' entityIdName='sizeId' />
    </div>
  )
}

export default Client
