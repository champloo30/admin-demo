import React from 'react'
import Client from './components/client'
import prismaDB from '@/lib/prismaDB'
import { SizeColumn } from './components/columns'
import { format } from 'date-fns'

export default async function Sizes({
  params
}: {
  params: { storeId: string }
}) {
  const sizes = await prismaDB.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <Client data={formattedSizes} />
      </div>
    </div>
  )
}
