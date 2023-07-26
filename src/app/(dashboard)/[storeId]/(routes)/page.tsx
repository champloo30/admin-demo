import React from 'react'
import prismaDB from '@/lib/prismaDB'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreditCard, DollarSign, Package } from 'lucide-react'
import { formatter } from '@/lib/utils'
import { getTotalRevenue } from '@/actions/getTotalRevenue'
import { getSalesCount } from '@/actions/getSalesCount'
import { getStockCount } from '@/actions/getStockCount'
import Overview from '@/components/overview'
import { getGraphRevenue } from '@/actions/getGraphRevenue'

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

  const totalRevenue = await getTotalRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId)
  const stockCount = await getStockCount(params.storeId)
  const graphRevenue = await getGraphRevenue(params.storeId)

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-4 p-8 flex flex-col flex-1'>
        <Heading title={`${store?.name} Dashboard`} description='Overview of your store' />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className='flex flex-row justify-between items-center'>
              <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row justify-between items-center'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row justify-between items-center'>
              <CardTitle className='text-sm font-medium'>Products In Stock</CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardContent className='pl-2'>
              <Overview data={graphRevenue} />
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
