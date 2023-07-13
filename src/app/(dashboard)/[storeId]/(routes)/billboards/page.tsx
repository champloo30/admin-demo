import React from 'react'
import Client from './components/client'
import prismaDB from '@/lib/prismaDB'
import { BillboardColumn } from './components/columns'
import { format } from 'date-fns'

export default async function Billboards({
  params
}: {
  params: { storeId: string }
}) {
  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <Client data={formattedBillboards} />
      </div>
    </div>
  )
}
