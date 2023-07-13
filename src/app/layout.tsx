import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modalProvider'
import { ToasterProvider } from '@/providers/toastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-Commerce Admin Dashboard',
  description: 'E-Commerce Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ToasterProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
