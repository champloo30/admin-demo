'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Store } from '@prisma/client'
import { useStoreModal } from '@/hooks/useStoreModal'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface SwitcherProps extends PopoverTriggerProps {
  items: Store[]
}

export default function StoreSwitcher({
  className,
  items = []
}: SwitcherProps) {
  const [open, setOpen] = useState(false)
  const storeModal = useStoreModal()
  const params = useParams()
  const router = useRouter()

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id
  }))

  const currentStore = formattedItems.find((item) => item.value === params.storeId)

  function onStoreSelect(store: { label: string, value: string }) {
    setOpen(false)
    router.push(`/${store.value}`)
  } 

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          role='combobox'
          aria-expanded={open}
          aria-label='Select a store'
          className={cn('w-[200px] flex justify-between', className)}
        >
          <StoreIcon className='h-4 w-4 mr-2' />
          {currentStore?.label}
          <ChevronsUpDown className='h-4 w-4 ml-auto shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading='Stores'>
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className='text-sm cursor-pointer'
                >
                  <StoreIcon className='h-4 w-4 mr-2' />
                  {store.label}
                  <Check 
                    className={cn(
                      'h-4 w-4 ml-auto',
                      currentStore?.value === store.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  storeModal.onOpen()
                }}
                className='cursor-pointer'
              >
                <PlusCircle className='h-5 w-5 mr-2' />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
