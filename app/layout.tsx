import './globals.css'
import type { Metadata } from 'next'
import { Inter,Courier_Prime,Space_Mono,Inconsolata} from 'next/font/google'

const inter = Inconsolata({
  weight: ["400","700"],
  subsets: ['latin'] 
})

export const metadata: Metadata = {
  title: 'Fire-Todos',
  description: 'Make your todos with Fire-Todos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" type='image/png' />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
