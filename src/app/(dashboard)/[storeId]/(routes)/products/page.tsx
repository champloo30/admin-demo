import React from 'react'
import Client from './components/client'
import prismaDB from '@/lib/prismaDB'
import { ProductColumn } from './components/columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'

export default async function Products({
  params
}: {
  params: { storeId: string }
}) {
  const products = await prismaDB.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.value,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <Client data={formattedProducts} />
      </div>
    </div>
  )
}
