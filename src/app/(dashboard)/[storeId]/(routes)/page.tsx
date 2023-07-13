import React from 'react'
import prismaDB from '@/lib/prismaDB'

interface DashboardProps {
  params: { storeId: string }
}

const Dashboard: React.FC<DashboardProps> = async ({
  params
}) => {
  const store = await prismaDB.store.findFirst({
    where: {
      id: params.storeId
    }
  })

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <h1 className='text-4xl font-semibold'>{store?.name}</h1>
      </div>
    </div>
  )
}

export default Dashboard
