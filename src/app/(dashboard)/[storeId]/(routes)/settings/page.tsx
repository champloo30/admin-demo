import prismaDB from '@/lib/prismaDB'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import SettingsForm from './componnents/settingsForm'

interface SettingsProps {
  params: {
    storeId: string
  }
}

const Settings: React.FC<SettingsProps> = async ({
  params
}) => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismaDB.store.findFirst({
    where: {
      id: params.storeId,
      userId
    }
  })

  if (!store) {
    redirect('/')
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='container mx-8 py-6 flex flex-1'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}

export default Settings
