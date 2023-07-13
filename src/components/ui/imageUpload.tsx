'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ImagePlus, Trash } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

interface UploadProps {
  disabled?: boolean,
  onChange: (value: string) => void,
  onRemove: (value: string) => void,
  value: string[]
}

export const ImageUpload: React.FC<UploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  function onUpload(result: any) {
    onChange(result.info.secure_url)
  }
  
  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map((url) => (
          <div key={url} className='relative h-[200px] w-[200px] rounded-md overflow-hidden'>
            <div className="absolute z-10 top-2 right-2">
              <Button type='button' onClick={() => onRemove(url)} variant='destructive' size='icon'>
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image 
              fill
              className='object-cover'
              alt='Image'
              src={url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset='zxf72b2u'>
        {({ open }) => {
          function onClick() {
            open()
          }

          return (
            <Button type='button' disabled={disabled} variant='secondary' onClick={onClick}>
              <ImagePlus className='h-4 w-4 mr-2' />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload