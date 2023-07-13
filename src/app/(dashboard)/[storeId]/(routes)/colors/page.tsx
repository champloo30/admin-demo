import React from 'react'
import Client from './components/client'
import prismaDB from '@/lib/prismaDB'
import { ColorColumn } from './components/columns'
import { format } from 'date-fns'

export default async function Colors({
  params
}: {
  params: { storeId: string }
}) {
  const colors = await prismaDB.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <Client data={formattedColors} />
      </div>
    </div>
  )
}
