'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, Server } from "lucide-react"
import { Badge, BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

interface ApiAlertProps {
  title: string,
  description: string,
  variant: 'public' | 'admin'
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin'
}

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = 'public'
}) => {
  function onCopy() {
    navigator.clipboard.writeText(description)
    toast.success('API route copied to clipboard.')
  }

  return (
    <Alert className="space-x-8">
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {title}
        <Badge variant={variantMap[variant]}>
          {textMap[variant]}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex justify-between items-center">
        <code className="relative rounded bg-muted p-[0.3rem] text-sm font-semibold">
          {description}
        </code>
        <Button 
          variant='outline'
          size='icon'
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

