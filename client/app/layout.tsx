import './globals.css'
export const metadata = {
  title: 'Dg Studios',
  description: 'Creative Photography & Visual Storytelling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/public/dg-studio-logo.png' />
      </head>
      <body>{children}</body>
    </html>
  )
}
