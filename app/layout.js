export const metadata = {
  title: 'Labori — Gestión Laboral para Chile',
  description: 'Plataforma SaaS de gestión laboral. Contratos, liquidaciones, Previred y más. Prueba gratis 15 días.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{margin:0,padding:0,fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:'#fff'}}>
        {children}
      </body>
    </html>
  )
}
