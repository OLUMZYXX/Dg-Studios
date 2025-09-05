import './globals.css'
import CookieConsentBanner from '../components/CookieConsentBanner'

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
        <link rel='icon' href='/public/favicon.svg' type='image/svg+xml' />
      </head>
      <body>
        <CookieConsentBanner />
        {children}
      </body>
    </html>
  )
}
