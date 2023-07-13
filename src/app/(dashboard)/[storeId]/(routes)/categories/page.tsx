import React from 'react'
import Client from './components/client'
import prismaDB from '@/lib/prismaDB'
import { CategoryColumn } from './components/columns'
import { format } from 'date-fns'

export default async function Categories({
  params
}: {
  params: { storeId: string }
}) {
  const categories = await prismaDB.category.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <Client data={formattedCategories} />
      </div>
    </div>
  )
}
