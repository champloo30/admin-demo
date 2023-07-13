import prismaDB from '@/lib/prismaDB'
import React from 'react'
import BillboardsForm from './components/billboardsForm'

export default async function BillboardPage({
  params
}: {
  params: { billboardId: string}
}) {
  const billboard = await prismaDB.billboard.findUnique({
    where: {
      id: params.billboardId
    }
  })

  return (
    <div className='flex flex-col'>
      <div className='container mx-8 py-6 flex flex-1'>
        <BillboardsForm initialData={billboard} />
      </div>
    </div>
  )
}
