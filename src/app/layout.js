import './globals.css'

export const metadata = {
  title: 'Rezervacije - Restoran',
  description: 'Sistem za upravljanje rezervacijama restorana',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json'
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Sistem za upravljanje rezervacijama restorana" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <title>Rezervacije - Restoran</title>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}