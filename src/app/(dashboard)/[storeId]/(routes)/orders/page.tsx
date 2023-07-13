import React from 'react'
import Client from './components/client'
import prismaDB from '@/lib/prismaDB'
import { OrderColumn } from './components/columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'

export default async function Orders({
  params
}: {
  params: { storeId: string }
}) {
  const orders = await prismaDB.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <Client data={formattedOrders} />
      </div>
    </div>
  )
}
