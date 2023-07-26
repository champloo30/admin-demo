import { UserButton, auth } from '@clerk/nextjs'
import React from 'react'
import { MainNav } from '@/components/mainNav'
import StoreSwitcher from '@/components/storeSwitcher'
import { redirect } from 'next/navigation'
import prismaDB from '@/lib/prismaDB'
import { ThemeToggler } from '@/components/themeToggler'

export default async function Navbar() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await prismaDB.store.findMany({
    where: {
      userId
    }
  })

  return (
    <div className='border-b'>
      <div className="h-16 px-8 flex items-center">
        <StoreSwitcher items={stores} />
        <MainNav className='mx-6 ' />
        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggler />
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </div>
  )
}