'use client'

import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/dataTable'

interface OrderClientProps {
  data: OrderColumn[]
}

export const Client: React.FC<OrderClientProps> = ({
  data
}) => {

  return (
    <div className='w-full flex flex-col gap-8'>
      <div className='flex justify-between items-center'>
        <Heading 
          title={`Orders (${data.length})`}
          description='View orders for your store'
        />
      </div>
      <Separator />
      <DataTable searchKey='products' columns={columns} data={data} />
    </div>
  )
}

export default Client
