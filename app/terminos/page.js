export const metadata = { title: 'Términos de uso — Labori' };

export default function Terminos() {
  return (
    <div style={{fontFamily:'-apple-system,sans-serif',maxWidth:'800px',margin:'0 auto',padding:'4rem 2rem',color:'#374151'}}>
      <a href="/" style={{color:'#2563EB',textDecoration:'none',fontSize:'14px',display:'block',marginBottom:'2rem'}}>← Volver a labori.cl</a>
      <h1 style={{fontSize:'36px',fontWeight:'800',color:'#111827',marginBottom:'0.5rem'}}>Términos de uso</h1>
      <p style={{color:'#6B7280',fontSize:'14px',marginBottom:'3rem'}}>Última actualización: Junio 2026</p>

      {[
        ['1. Aceptación de los términos', 'Al registrarse y utilizar Labori (en adelante "el Servicio"), usted acepta estar sujeto a estos Términos de Uso. Si no está de acuerdo con alguno de estos términos, no debe utilizar el Servicio.'],
        ['2. Descripción del servicio', 'Labori es una plataforma SaaS (Software como Servicio) de gestión laboral para empresas chilenas. El Servicio permite generar y administrar contratos de trabajo, liquidaciones de sueldos, certificados laborales y otros documentos relacionados con la gestión de recursos humanos, conforme a la legislación laboral chilena vigente.'],
        ['3. Registro y cuenta', 'Para utilizar el Servicio, debe registrarse con información veraz y actualizada. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente sobre cualquier uso no autorizado de su cuenta.'],
        ['4. Período de prueba gratuita', 'Labori ofrece un período de prueba gratuita de 15 días calendario desde el registro. Durante este período, tendrá acceso completo al Servicio sin costo. Al finalizar el período de prueba, deberá suscribirse a un plan de pago para continuar usando el Servicio.'],
        ['5. Planes y pagos', 'Los planes de suscripción se cobran mensualmente en pesos chilenos (CLP) más IVA, calculados en base al valor de la UF vigente al momento del cobro. Los pagos se procesan a través de Flow.cl. En caso de atraso en el pago superior a 5 días hábiles, el acceso al Servicio será suspendido automáticamente hasta regularizar el pago.'],
        ['6. Cancelación', 'Puede cancelar su suscripción en cualquier momento contactando a soporte@labori.cl. La cancelación se hará efectiva al término del período mensual pagado. No se realizan reembolsos por períodos parciales.'],
        ['7. Uso aceptable', 'Usted se compromete a usar el Servicio únicamente para fines lícitos y de acuerdo con estos Términos. Queda prohibido: (a) usar el Servicio para actividades ilegales; (b) intentar acceder a datos de otros usuarios; (c) realizar ingeniería inversa del software; (d) sobrecargar deliberadamente los servidores del Servicio.'],
        ['8. Propiedad intelectual', 'El Servicio y todo su contenido, características y funcionalidades son propiedad de GC Gestión Laboral y están protegidos por las leyes de propiedad intelectual de Chile. Los documentos generados por usted mediante el Servicio son de su propiedad.'],
        ['9. Limitación de responsabilidad', 'GC Gestión Laboral no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del Servicio. Los documentos generados por Labori deben ser revisados por un profesional antes de su firma y uso oficial. Labori no reemplaza el asesoramiento legal o laboral profesional.'],
        ['10. Disponibilidad del servicio', 'Nos comprometemos a mantener el Servicio disponible el mayor tiempo posible. Sin embargo, no garantizamos disponibilidad ininterrumpida. Realizaremos mantenimientos programados informando con anticipación a los usuarios.'],
        ['11. Modificaciones', 'Nos reservamos el derecho de modificar estos Términos en cualquier momento. Notificaremos los cambios significativos por email. El uso continuado del Servicio después de dichos cambios constituye su aceptación de los nuevos Términos.'],
        ['12. Ley aplicable', 'Estos Términos se rigen por las leyes de la República de Chile. Cualquier disputa será sometida a los tribunales competentes de la ciudad de Santiago de Chile.'],
        ['13. Contacto', 'Para consultas sobre estos Términos, contáctenos en: legal@labori.cl o a través de labori.cl.'],
      ].map(([titulo, texto]) => (
        <div key={titulo} style={{marginBottom:'2rem'}}>
          <h2 style={{fontSize:'18px',fontWeight:'700',color:'#111827',marginBottom:'8px'}}>{titulo}</h2>
          <p style={{fontSize:'15px',lineHeight:'1.7',margin:0}}>{texto}</p>
        </div>
      ))}
    </div>
  );
}
