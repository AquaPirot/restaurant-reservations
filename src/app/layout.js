import './globals.css'

export const metadata = {
  title: 'Rezervacije - Restoran',
  description: 'Sistem za upravljanje rezervacijama restorana',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Sistem za upravljanje rezervacijama restorana" />
        <title>Rezervacije - Restoran</title>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}