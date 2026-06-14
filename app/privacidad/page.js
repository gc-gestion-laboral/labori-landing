export const metadata = { title: 'Política de privacidad — Labori' };

export default function Privacidad() {
  return (
    <div style={{fontFamily:'-apple-system,sans-serif',maxWidth:'800px',margin:'0 auto',padding:'4rem 2rem',color:'#374151'}}>
      <a href="/" style={{color:'#2563EB',textDecoration:'none',fontSize:'14px',display:'block',marginBottom:'2rem'}}>← Volver a labori.cl</a>
      <h1 style={{fontSize:'36px',fontWeight:'800',color:'#111827',marginBottom:'0.5rem'}}>Política de privacidad</h1>
      <p style={{color:'#6B7280',fontSize:'14px',marginBottom:'3rem'}}>Última actualización: Junio 2026</p>

      {[
        ['1. Información que recopilamos', 'Recopilamos información que usted nos proporciona directamente: nombre, email, RUT, información de la empresa y datos de trabajadores ingresados al sistema. También recopilamos automáticamente datos de uso como dirección IP, tipo de navegador y páginas visitadas.'],
        ['2. Uso de la información', 'Usamos su información para: (a) proveer y mejorar el Servicio; (b) enviar comunicaciones relacionadas con su cuenta; (c) procesar pagos; (d) cumplir obligaciones legales. No vendemos ni compartimos su información con terceros para fines comerciales.'],
        ['3. Datos de trabajadores', 'Los datos de trabajadores que ingrese al sistema son de su exclusiva propiedad y responsabilidad. Labori los almacena de forma segura y no los utiliza para ningún fin distinto al funcionamiento del Servicio.'],
        ['4. Almacenamiento y seguridad', 'Sus datos se almacenan en servidores seguros con cifrado SSL/TLS. Utilizamos Supabase (PostgreSQL) como base de datos con medidas de seguridad de nivel empresarial. Las contraseñas se almacenan con hash bcrypt y nunca en texto plano.'],
        ['5. Retención de datos', 'Conservamos sus datos mientras su cuenta esté activa. Si cancela su suscripción, sus datos se mantendrán por 30 días adicionales para permitir la recuperación de información, tras lo cual serán eliminados permanentemente.'],
        ['6. Sus derechos', 'Usted tiene derecho a: (a) acceder a sus datos personales; (b) rectificar datos incorrectos; (c) solicitar la eliminación de sus datos; (d) exportar sus datos. Para ejercer estos derechos, contáctenos en privacidad@labori.cl.'],
        ['7. Cookies', 'Utilizamos cookies técnicas necesarias para el funcionamiento del Servicio (autenticación y sesión). No utilizamos cookies de seguimiento ni publicitarias.'],
        ['8. Servicios de terceros', 'Utilizamos los siguientes servicios de terceros: Flow.cl (procesamiento de pagos), Resend (envío de emails), Supabase (base de datos). Cada uno tiene sus propias políticas de privacidad.'],
        ['9. Menores de edad', 'El Servicio no está dirigido a menores de 18 años. No recopilamos conscientemente información de menores.'],
        ['10. Cambios a esta política', 'Podemos actualizar esta Política ocasionalmente. Le notificaremos por email sobre cambios significativos. Le recomendamos revisar esta Política periódicamente.'],
        ['11. Contacto', 'Para consultas sobre privacidad: privacidad@labori.cl — GC Gestión Laboral, Chile.'],
      ].map(([titulo, texto]) => (
        <div key={titulo} style={{marginBottom:'2rem'}}>
          <h2 style={{fontSize:'18px',fontWeight:'700',color:'#111827',marginBottom:'8px'}}>{titulo}</h2>
          <p style={{fontSize:'15px',lineHeight:'1.7',margin:0}}>{texto}</p>
        </div>
      ))}
    </div>
  );
}
