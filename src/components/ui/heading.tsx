import React from 'react'

interface HeadingProps {
  title: string,
  description: string
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-4xl font-bold'>{title}</h2>
      <p className='text-muted-foreground'>{description}</p>
    </div>
  )
}

