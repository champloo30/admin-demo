import prismaDB from '@/lib/prismaDB'
import React from 'react'
import CategoriesForm from './components/categoriesForm'

export default async function CategoryPage({
  params
}: {
  params: { categoryId: string, storeId: string }
}) {
  const category = await prismaDB.category.findUnique({
    where: {
      id: params.categoryId
    }
  })

  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId: params.storeId
    }
  })

  return (
    <div className='flex flex-col'>
      <div className='container mx-8 py-6 flex flex-1'>
        <CategoriesForm initialData={category} billboards={billboards} />
      </div>
    </div>
  )
}
