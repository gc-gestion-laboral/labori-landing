export const metadata = {
  metadataBase: new URL('https://labori.cl'),
  title: 'Labori — Software contable integrado con el SII para contadores en Chile',
  description: 'Plataforma para contadores y oficinas contables en Chile: integración con el SII, AutoBalance Asistido, contabilidad, remuneraciones, cobranza y gestión de oficina. Prueba gratis 15 días.',
  keywords: ['software para contadores en Chile', 'sistema de contabilidad integrado con el SII', 'software para oficinas contables', 'automatización contable', 'sistema de remuneraciones', 'gestión de oficinas de contabilidad', 'balance contable automatizado'],
  openGraph: {
    title: 'Labori — La plataforma integral para contadores y oficinas contables',
    description: 'Automatiza tu contabilidad con integración al SII, administra toda tu oficina y entrega beneficios gratuitos a tus clientes. 15 días gratis.',
    url: 'https://labori.cl',
    siteName: 'Labori',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Labori — Software contable integrado con el SII',
    description: 'Contabilidad, remuneraciones, cobranza y gestión de oficina en una sola plataforma. 15 días gratis.',
  },
  alternates: { canonical: 'https://labori.cl' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://gc-gestion.online" />
      </head>
      <body style={{margin:0,padding:0,fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:'#060F1E'}}>
        {children}
      </body>
    </html>
  )
}
