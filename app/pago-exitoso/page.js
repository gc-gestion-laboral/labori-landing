'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PagoExitosoContent() {
  const [cuenta, setCuenta] = useState(3);
  useSearchParams(); // por si viene token de Flow

  useEffect(() => {
    const t = setInterval(() => setCuenta(c => {
      if (c <= 1) { clearInterval(t); window.location.href = 'https://gc-gestion.online'; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0F172A,#1E3A8A)',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:'-apple-system,sans-serif'}}>
      <div style={{maxWidth:'520px',width:'100%',textAlign:'center'}}>
        <div style={{width:'80px',height:'80px',background:'#22C55E',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem',boxShadow:'0 0 0 16px rgba(34,197,94,0.15)'}}>
          <span style={{fontSize:'40px'}}>✓</span>
        </div>
        <h1 style={{fontSize:'32px',fontWeight:'800',color:'white',margin:'0 0 12px'}}>¡Pago exitoso!</h1>
        <p style={{fontSize:'16px',color:'#94A3B8',margin:'0 0 2rem',lineHeight:'1.6'}}>
          Tu suscripción ha sido activada. Ya puedes usar Labori sin restricciones.
        </p>
        <div style={{background:'rgba(255,255,255,0.06)',borderRadius:'16px',padding:'1.5rem',marginBottom:'2rem',border:'1px solid rgba(255,255,255,0.1)'}}>
          <p style={{color:'#94A3B8',fontSize:'14px',margin:'0 0 8px'}}>Redirigiendo automáticamente en</p>
          <div style={{fontSize:'48px',fontWeight:'800',color:'#60A5FA'}}>{cuenta}</div>
        </div>
        <a href="https://gc-gestion.online" style={{display:'block',padding:'16px',background:'#2563EB',color:'white',borderRadius:'12px',textDecoration:'none',fontSize:'16px',fontWeight:'700',boxShadow:'0 8px 32px rgba(37,99,235,0.4)'}}>
          🚀 Ingresar a Labori ahora
        </a>
        <p style={{fontSize:'13px',color:'#475569',marginTop:'1.5rem'}}>
          Recibirás un email de confirmación en los próximos minutos.
        </p>
      </div>
    </div>
  );
}

export default function PagoExitoso() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#0F172A',display:'flex',alignItems:'center',justifyContent:'center'}}><p style={{color:'white'}}>Cargando...</p></div>}>
      <PagoExitosoContent />
    </Suspense>
  );
}
