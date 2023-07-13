import prismaDB from '@/lib/prismaDB'
import React from 'react'
import ProductsForm from './components/productsForm'

export default async function ProductPage({
  params
}: {
  params: { productId: string, storeId: string}
}) {
  const product = await prismaDB.product.findUnique({
    where: {
      id: params.productId
    },
    include: {
      images: true
    }
  })

  const categories = await prismaDB.category.findMany({
    where: {
      storeId: params.storeId
    }
  })

  const sizes = await prismaDB.size.findMany({
    where: {
      storeId: params.storeId
    }
  })

  const colors = await prismaDB.color.findMany({
    where: {
      storeId: params.storeId
    }
  })

  return (
    <div className='flex flex-col'>
      <div className='container mx-8 py-6 flex flex-1'>
        <ProductsForm 
          initialData={product} 
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  )
}
