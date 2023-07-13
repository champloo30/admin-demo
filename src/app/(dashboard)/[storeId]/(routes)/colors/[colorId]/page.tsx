import prismaDB from '@/lib/prismaDB'
import React from 'react'
import ColorsForm from './components/colorsForm'

export default async function ColorPage({
  params
}: {
  params: { colorId: string}
}) {
  const color = await prismaDB.color.findUnique({
    where: {
      id: params.colorId
    }
  })

  return (
    <div className='flex flex-col'>
      <div className='container mx-8 py-6 flex flex-1'>
        <ColorsForm initialData={color} />
      </div>
    </div>
  )
}
