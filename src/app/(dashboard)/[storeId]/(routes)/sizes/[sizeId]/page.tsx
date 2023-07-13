import prismaDB from '@/lib/prismaDB'
import React from 'react'
import SizesForm from './components/sizesForm'

export default async function SizePage({
  params
}: {
  params: { sizeId: string}
}) {
  const size = await prismaDB.size.findUnique({
    where: {
      id: params.sizeId
    }
  })

  return (
    <div className='flex flex-col'>
      <div className='container mx-8 py-6 flex flex-1'>
        <SizesForm initialData={size} />
      </div>
    </div>
  )
}
