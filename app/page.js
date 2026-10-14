'use client';
import { useState, useEffect, useRef } from 'react';

const API = 'https://gc-gestion.online/api';
const CAP = 'https://gc-gestion.online/capturas/';
const VER = '?v=20261014';

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const ocultarSiFalla = (e) => { const c = e.currentTarget.closest('[data-marco]'); if (c) c.style.display = 'none'; else e.currentTarget.style.display = 'none'; };

export default function Home() {
  const isMobile = useIsMobile();
  const [paso, setPaso] = useState('landing');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('registro')) {
      setPaso('registro');
    }
  }, []);

  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', rut: '', telefono: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [trialFin, setTrialFin] = useState(null);
  const [statsRef, statsInView] = useInView();
  const horas = useCountUp(12, 2000, statsInView);
  const docs = useCountUp(500, 2000, statsInView);
  const satisf = useCountUp(98, 2000, statsInView);
  const tiempo = useCountUp(80, 2000, statsInView);

  const irA = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); };

  const registrar = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmar) { setError('Las contrasenas no coinciden'); return; }
    if (form.password.length < 8) { setError('La contrasena debe tener al menos 8 caracteres'); return; }
    setCargando(true);
    try {
      const r = await fetch(API + '/suscripciones/registro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password, rut: form.rut, telefono: form.telefono, plan_id: 'starter' }) });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Error al crear cuenta'); return; }
      setTrialFin(d.trial_fin);
      setPaso('exito');
    } catch { setError('Error de conexion.'); }
    finally { setCargando(false); }
  };

  if (paso === 'exito') return (
    <div style={{ minHeight: '100vh', background: '#060F1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '72px', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: '0 0 12px' }}>Bienvenido a Labori</h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '0 0 2rem', lineHeight: '1.7' }}>Tu cuenta fue creada. Tienes <strong style={{ color: '#00c8ff' }}>15 dias de prueba gratuita</strong>.</p>
        {trialFin && <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Tu prueba gratuita vence el</p><p style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: '4px 0 0' }}>{new Date(trialFin).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>}
        <a href="https://gc-gestion.online" style={{ display: 'block', padding: '16px', background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Ingresar a Labori</a>
      </div>
    </div>
  );

  if (paso === 'registro') return (
    <div style={{ minHeight: '100vh', background: '#060F1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <button onClick={() => setPaso('landing')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px', marginBottom: '1.5rem' }}>← Volver</button>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'white', marginBottom: '8px' }}>Labori<span style={{ color: '#00c8ff' }}>X</span></div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: '0 0 8px' }}>Crear cuenta gratis</h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>15 dias de prueba sin tarjeta</p>
          </div>
          <form onSubmit={registrar} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[{ key: 'nombre', label: 'Nombre completo', ph: 'Juan Gonzalez', type: 'text', req: true }, { key: 'email', label: 'Email', ph: 'juan@empresa.cl', type: 'email', req: true }, { key: 'rut', label: 'RUT (opcional)', ph: '12.345.678-9', type: 'text' }, { key: 'telefono', label: 'Teléfono de contacto', ph: '+56 9 1234 5678', type: 'tel', req: true }, { key: 'password', label: 'Contrasena', ph: 'Minimo 8 caracteres', type: 'password', req: true }, { key: 'confirmar', label: 'Confirmar contrasena', ph: 'Repite tu contrasena', type: 'password', req: true }].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input type={f.type} required={f.req} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', padding: '0 14px', fontSize: '16px', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} />
              </div>
            ))}
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#EF4444' }}>{error}</div>}
            <button type="submit" disabled={cargando} style={{ height: '48px', background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', opacity: cargando ? 0.7 : 1 }}>{cargando ? 'Creando cuenta...' : 'Comenzar prueba gratis'}</button>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>Al registrarte aceptas los <a href="/terminos" style={{ color: '#00c8ff' }}>Terminos</a> y <a href="/privacidad" style={{ color: '#00c8ff' }}>Privacidad</a></p>
          </form>
        </div>
      </div>
    </div>
  );

  const PAD = isMobile ? '3.5rem 1.25rem' : '5.5rem 2rem';

  const modulos = [
    {
      ic: '🏢', color: '#7C3AED', titulo: 'Gestión de Oficina Contable',
      desc: 'Administra clientes, obligaciones tributarias, vencimientos y documentación desde un solo lugar.',
      detalle: ['CRM y bitácora de clientes', 'Confección y control de F29', 'Declaraciones de Renta', 'Credenciales SII centralizadas', 'Calendario de vencimientos y alertas', 'Bodega de formatos y documentos', 'Captación y formalización de empresas', 'Modificaciones societarias y patentes', 'Oficinas virtuales', 'Apertura de cuentas bancarias', 'Término de giro'],
    },
    {
      ic: '📊', color: '#FBBF24', titulo: 'Contabilidad Integrada',
      desc: 'Libros contables, balances y registros de compras y ventas conectados con la información del SII.',
      detalle: ['Libro Diario y Libro Mayor', 'Balance de 8 columnas', 'Estado de Resultados', 'Libros de Compras, Ventas y Honorarios', 'Libro Caja 14D', 'Foliador de hojas', 'Conciliación bancaria', 'Contabilidad Express desde Excel'],
    },
    {
      ic: '👥', color: '#0EA5E9', titulo: 'Remuneraciones y RR.HH.',
      desc: 'Calcula remuneraciones y genera liquidaciones, contratos, anexos y toda la documentación laboral.',
      detalle: ['Liquidaciones con AFP, salud, IUSC y AFC', 'Archivo Previred', 'Libro de remuneraciones', 'Certificado N°6 del SII y DJ 1887', 'Contratos y anexos automáticos', 'Finiquitos y amonestaciones', 'Licencias médicas', 'Expediente laboral por trabajador', 'Informes de costo'],
    },
    {
      ic: '⚡', color: '#F59E0B', titulo: 'Cobranza Inteligente', extra: 'Adicional · 1,5 UF',
      desc: 'Controla tus honorarios pendientes y automatiza la cobranza por correo y WhatsApp con inteligencia artificial.',
      detalle: ['WhatsApp y correo automáticos', 'Labori Talk: IA de cobranza 24/7', 'Convenios de pago', 'Links de pago con Mercado Pago', 'Portal del deudor', 'Cartera de cobranza en tiempo real'],
    },
    {
      ic: '✨', color: '#A78BFA', titulo: 'Documentos e Inteligencia Artificial', extra: 'IA: adicional · 1,0 UF',
      desc: 'Documentación comercial incluida en todos los planes. Labori AI Studio se contrata aparte y redacta en segundos lo que antes tomaba horas.',
      detalle: ['Incluido: 13 documentos comerciales', 'Incluido: 3 contratos con respaldo jurídico', 'AI Studio: objetos sociales y cláusulas', 'AI Studio: cartas explicativas al SII', 'AI Studio: comodatos, poderes y mandatos', 'AI Studio: Artículo 38 bis', 'AI Studio: depurador de F29', 'AI Studio: 40 consultas especializadas al mes con fuentes citadas'],
    },
  ];

  const beneficios = [
    { ic: '💵', t: 'Flujo de caja', d: 'Ingresos, egresos y movimientos financieros ordenados.' },
    { ic: '📦', t: 'Control de inventario', d: 'Existencias y movimientos de productos al día.' },
    { ic: '🗓️', t: 'Planificador de pagos', d: 'Obligaciones y próximos vencimientos a la vista.' },
    { ic: '📁', t: 'Gestión de proyectos', d: 'Tareas, avances y actividades de la empresa.' },
  ];

  const faq = [
    ['¿Puedo probar Labori antes de contratar?', 'Sí. Puedes utilizar Labori durante 15 días gratis, sin tarjeta de crédito, para conocer sus herramientas y funcionalidades.'],
    ['¿Labori está diseñado para contadores independientes?', 'Sí. La plataforma está diseñada tanto para contadores independientes como para oficinas de contabilidad que administran múltiples empresas.'],
    ['¿Puedo integrar la información de mis clientes con el SII?', 'Sí. Labori cuenta con herramientas de integración con el SII que permiten recuperar información tributaria y facilitar distintos procesos contables.'],
    ['¿Mis clientes pueden utilizar herramientas gratuitas?', 'Sí. Labori permite entregar a tus clientes acceso a su propio portal con herramientas de gestión empresarial, sin costo adicional y conforme a las condiciones del servicio.'],
    ['¿Qué sucede después de los 15 días gratuitos?', 'Eliges el plan que necesitas para continuar. El cobro es mensual en pesos, calculado sobre el valor de la UF del primer día de cada mes.'],
  ];

  const btnPrincipal = { background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', border: 'none', borderRadius: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 6px 26px rgba(26,86,219,0.45)' };
  const btnSecundario = { background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '13px', fontWeight: '600', cursor: 'pointer' };
  const eyebrow = (bg, col) => ({ display: 'inline-flex', alignItems: 'center', gap: '6px', background: bg, borderRadius: '20px', padding: '5px 14px', fontSize: '11px', color: col, fontWeight: '800', letterSpacing: '0.08em', marginBottom: '1.25rem' });
  const h2 = (col) => ({ fontSize: 'clamp(25px,3.6vw,40px)', fontWeight: '900', color: col, margin: '0 0 0.9rem', lineHeight: '1.18', letterSpacing: '-0.5px' });

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', overflowX: 'hidden', background: '#060F1E', paddingBottom: isMobile ? '72px' : 0 }}>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(6,15,30,0.93)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 1rem' : '0 2rem', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: isMobile ? '19px' : '22px', fontWeight: '900', color: 'white', flexShrink: 0 }}>Labori<span style={{ color: '#00c8ff' }}>X</span></div>
          <div style={{ display: 'flex', gap: isMobile ? '0.45rem' : '1.4rem', alignItems: 'center' }}>
            {!isMobile && ['autobalance:AutoBalance', 'soluciones:Soluciones', 'beneficios:Beneficios Gratis', 'planes:Planes'].map(x => {
              const [id, txt] = x.split(':');
              return <a key={id} href={'#' + id} style={{ color: 'rgba(255,255,255,0.58)', textDecoration: 'none', fontSize: '13.5px', fontWeight: '500' }}>{txt}</a>;
            })}
            {!isMobile && <a href="https://gc-gestion.online" style={{ height: '34px', padding: '0 14px', background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Iniciar sesión</a>}
            <a href="https://gc-gestion.online/trabajadores" style={{ height: '34px', padding: isMobile ? '0 10px' : '0 14px', background: 'rgba(16,185,129,0.14)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '8px', fontSize: isMobile ? '11.5px' : '12.5px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>Trabajadores</a>
            <button onClick={() => setPaso('registro')} style={{ ...btnPrincipal, height: '34px', padding: isMobile ? '0 11px' : '0 16px', borderRadius: '8px', fontSize: isMobile ? '11.5px' : '12.5px', whiteSpace: 'nowrap', boxShadow: 'none' }}>Probar gratis</button>
          </div>
        </div>
      </nav>

      {/* BARRA DE MARCA */}
      <div style={{ marginTop: '62px', background: '#0A1424', borderTop: '1px solid rgba(251,191,36,0.18)', borderBottom: '1px solid rgba(251,191,36,0.18)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '9px 1.25rem', textAlign: 'center' }}>
          <span style={{ fontSize: 'clamp(9.5px,1.2vw,12px)', fontWeight: '700', color: '#FBBF24', letterSpacing: '0.16em', textTransform: 'uppercase', lineHeight: '1.5' }}>
            Tecnología creada por contadores · para contadores
          </span>
        </div>
      </div>

      {/* 1 · HERO */}
      <section style={{ background: 'linear-gradient(170deg,#060F1E 0%,#0C1A3A 55%,#060F1E 100%)', padding: isMobile ? '2.5rem 1.25rem 3rem' : '4rem 2rem 4.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-25%', right: '-15%', width: '620px', height: '620px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-15%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,200,255,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '980px', margin: '0 auto', position: 'relative' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: '20px', padding: '5px 15px', marginBottom: '1.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '11.5px', color: '#6EE7B7', fontWeight: '700' }}>15 días gratis · sin tarjeta de crédito</span>
          </div>

          <h1 style={{ fontSize: 'clamp(31px,5.4vw,60px)', fontWeight: '900', color: 'white', margin: '0 0 1.1rem', lineHeight: '1.07', letterSpacing: '-1.5px' }}>
            Contador, transforma<br /><span style={{ color: '#00c8ff' }}>tu forma de trabajar.</span>
          </h1>

          <p style={{ fontSize: 'clamp(15.5px,1.9vw,19px)', color: 'rgba(255,255,255,0.62)', margin: '0 auto 2rem', lineHeight: '1.65', maxWidth: '680px' }}>
            Automatiza tu contabilidad con integración al SII, administra toda tu oficina y entrega beneficios gratuitos a tus clientes. Todo desde una sola plataforma.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button onClick={() => setPaso('registro')} style={{ ...btnPrincipal, height: '54px', padding: isMobile ? '0 24px' : '0 34px', fontSize: isMobile ? '15px' : '16.5px' }}>Comenzar 15 días gratis</button>
            <button onClick={() => irA('video')} style={{ ...btnSecundario, height: '54px', padding: isMobile ? '0 22px' : '0 30px', fontSize: isMobile ? '14.5px' : '15.5px' }}>▶ Ver cómo funciona</button>
          </div>

          {/* CAPTURA DASHBOARD */}
          <div style={{ position: 'relative', maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '7px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 36px 80px rgba(0,0,0,0.55)' }}>
              <div style={{ background: '#1A1A2E', borderRadius: '9px', padding: '7px 11px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                {['#FF5F56', '#FFBD2E', '#27C93F'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '18px', marginLeft: '8px' }} />
              </div>
              <img src={CAP + 'home.png' + VER} alt="Panel principal de Labori" loading="eager" style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
            </div>
            {!isMobile && (
              <>
                <div style={{ position: 'absolute', top: '-18px', right: '-26px', background: 'rgba(16,185,129,0.92)', borderRadius: '12px', padding: '11px 15px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                  <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.75)', marginBottom: '2px' }}>Contratos generados</div>
                  <div style={{ fontSize: '21px', fontWeight: '900', color: 'white' }}>+2.400</div>
                </div>
                <div style={{ position: 'absolute', bottom: '-18px', left: '-26px', background: 'rgba(26,86,219,0.92)', borderRadius: '12px', padding: '11px 15px', boxShadow: '0 8px 24px rgba(26,86,219,0.3)' }}>
                  <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.75)', marginBottom: '2px' }}>Empresas gestionadas</div>
                  <div style={{ fontSize: '21px', fontWeight: '900', color: 'white' }}>+350</div>
                </div>
              </>
            )}
          </div>

          {/* INDICADORES */}
          <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? '0.75rem' : '1.25rem', marginTop: isMobile ? '2.5rem' : '3.5rem' }}>
            {[
              { valor: horas, sufijo: 'hrs', label: 'Ahorradas por semana', color: '#00c8ff' },
              { valor: docs, sufijo: '+', label: 'Documentos generados', color: '#10B981' },
              { valor: satisf, sufijo: '%', label: 'Clientes satisfechos', color: '#F59E0B' },
              { valor: tiempo, sufijo: '%', label: 'Menos tiempo manual', color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} style={{ padding: isMobile ? '1.1rem 0.6rem' : '1.5rem 1rem', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
                <div style={{ fontSize: isMobile ? '28px' : '38px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.valor}{s.sufijo}</div>
                <div style={{ fontSize: isMobile ? '11px' : '12.5px', color: 'rgba(255,255,255,0.42)', marginTop: '7px', lineHeight: '1.4' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2 · SII + AUTOBALANCE */}
      <section id="autobalance" style={{ padding: PAD, background: 'linear-gradient(135deg,#04101F,#07233B 55%,#051424)', borderTop: '1px solid rgba(0,200,255,0.12)' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr', gap: isMobile ? '2.25rem' : '3.5rem', alignItems: 'center' }}>
            <div>
              <div style={eyebrow('rgba(0,200,255,0.12)', '#00c8ff')}>⚡ INTEGRACIÓN SII · AUTOBALANCE</div>
              <h2 style={h2('white')}>Tu contabilidad conectada directamente con el SII.</h2>
              <p style={{ fontSize: '17px', fontWeight: '700', color: '#00c8ff', margin: '0 0 1rem', lineHeight: '1.5' }}>Prepara balances en minutos, no en horas, con AutoBalance Asistido.</p>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.58)', lineHeight: '1.75', margin: '0 0 1.75rem' }}>
                Labori integra la información tributaria disponible en el SII con tu sistema contable y automatiza procesos que tradicionalmente requieren horas de trabajo manual.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
                {[
                  ['🔗', 'Integración con el SII', 'Recupera la información tributaria de tus clientes.'],
                  ['📥', 'Importación inteligente', 'Incorpora compras y ventas sin duplicar documentos.'],
                  ['⚙️', 'Contabilización automatizada', 'Genera asientos con tu plan de cuentas.'],
                  ['🧮', 'Ajustes asistidos', 'Facilita los ajustes de IVA y cierres.'],
                  ['📗', 'Balances en minutos', 'Con revisión y complementación manual.'],
                  ['🔍', 'Control de diferencias', 'Identifica los períodos que requieren revisión.'],
                ].map(([ic, t, d]) => (
                  <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,200,255,0.14)', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{ic} {t}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.46)', lineHeight: '1.5' }}>{d}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '13px', fontWeight: '800', color: '#FBBF24', letterSpacing: '0.06em', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                MENOS DIGITACIÓN. MENOS TRABAJO MANUAL. MÁS TIEMPO PARA TUS CLIENTES.
              </div>

              <button onClick={() => setPaso('registro')} style={{ ...btnPrincipal, height: '50px', padding: '0 30px', fontSize: '15px' }}>Comenzar 15 días gratis</button>
            </div>

            <div>
              <div data-marco style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '7px', border: '1px solid rgba(0,200,255,0.2)', boxShadow: '0 24px 60px rgba(0,0,0,0.45)', marginBottom: '1.25rem' }}>
                <img src={CAP + 'autobalance.png' + VER} alt="AutoBalance Asistido" loading="lazy" onError={ocultarSiFalla} style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
              </div>
              {/* FLUJO */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {['SII', 'Labori', 'AutoBalance', 'Balance'].map((p, i) => (
                  <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: '800', color: i === 3 ? '#0C1A2E' : '#00c8ff', background: i === 3 ? 'linear-gradient(135deg,#00c8ff,#0EA5E9)' : 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)', borderRadius: '20px', padding: '5px 13px', whiteSpace: 'nowrap' }}>{p}</span>
                    {i < 3 && <span style={{ color: 'rgba(0,200,255,0.5)', fontSize: '13px' }}>→</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · ECOSISTEMA */}
      <section id="soluciones" style={{ padding: PAD, background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={eyebrow('#EDE9FE', '#7C3AED')}>ECOSISTEMA LABORI</div>
            <h2 style={h2('#0C1A2E')}>Una sola plataforma para toda tu oficina contable.</h2>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto' }}>
              Centraliza tus operaciones, automatiza procesos y mantén el control de toda tu cartera de clientes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.1rem' }}>
            {modulos.map(m => (
              <div key={m.titulo} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: m.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{m.ic}</div>
                  {m.extra && <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase', background: m.color + '18', color: m.color, border: '1px solid ' + m.color + '44', padding: '4px 9px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{m.extra}</span>}
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0C1A2E', marginBottom: '7px', lineHeight: '1.3' }}>{m.titulo}</div>
                <div style={{ fontSize: '13.5px', color: '#6B7280', lineHeight: '1.65', marginBottom: '14px', flex: 1 }}>{m.desc}</div>
                <details style={{ borderTop: '1px solid #F1F5F9', paddingTop: '11px' }}>
                  <summary style={{ fontSize: '12.5px', fontWeight: '700', color: m.color, cursor: 'pointer', listStyle: 'none', outline: 'none' }}>Ver qué incluye +</summary>
                  <div style={{ marginTop: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {m.detalle.map(d => (
                      <div key={d} style={{ display: 'flex', gap: '7px', fontSize: '12.5px', color: '#374151', lineHeight: '1.5' }}>
                        <span style={{ color: m.color, fontWeight: '700', flexShrink: 0 }}>✓</span>{d}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#94A3B8', marginTop: '1.75rem' }}>
            Gestión de Oficina, Contabilidad y RR.HH. vienen incluidos en todos los planes. Cobranza Inteligente y Labori AI Studio se contratan como complementos.
          </p>
        </div>
      </section>

      {/* 4 · BENEFICIOS GRATIS PARA LOS CLIENTES */}
      <section id="beneficios" style={{ padding: PAD, background: 'linear-gradient(140deg,#041A14,#062B20 55%,#04121C)', borderTop: '1px solid rgba(16,185,129,0.15)' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '2.25rem' : '3.5rem', alignItems: 'center' }}>
            <div>
              <div style={eyebrow('rgba(16,185,129,0.14)', '#6EE7B7')}>🎁 SIN COSTO ADICIONAL</div>
              <h2 style={h2('white')}>Entrega más valor a tus clientes sin pagar más.</h2>
              <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.75', margin: '0 0 1.75rem' }}>
                Con Labori, tus clientes acceden a su propio portal empresarial con herramientas de gestión totalmente gratuitas.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {beneficios.map(b => (
                  <div key={b.t} style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: '13px', padding: '1rem' }}>
                    <div style={{ fontSize: '22px', marginBottom: '7px' }}>{b.ic}</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{b.t}</div>
                    <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.5' }}>{b.d}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '13px', fontWeight: '800', color: '#6EE7B7', letterSpacing: '0.04em', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                TUS CLIENTES RECIBEN MÁS BENEFICIOS. TU OFICINA ENTREGA MÁS VALOR.
              </div>

              <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', margin: '0 0 1.5rem' }}>
                Labori también incluye un <a href="https://gc-gestion.online/trabajadores" style={{ color: '#6EE7B7', textDecoration: 'none', fontWeight: '600' }}>portal para trabajadores</a>, donde consultan su documentación laboral y liquidaciones.
              </p>

              <button onClick={() => setPaso('registro')} style={{ height: '50px', padding: '0 30px', background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', border: 'none', borderRadius: '13px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 6px 24px rgba(16,185,129,0.35)' }}>Comenzar 15 días gratis</button>
            </div>

            <div style={{ position: 'relative' }}>
              <div data-marco style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '7px', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }}>
                <img src={CAP + 'portal-clientes.png' + VER} alt="Portal de clientes de Labori" loading="lazy" onError={ocultarSiFalla} style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
                <div style={{ position: 'absolute', top: '-14px', right: isMobile ? '10px' : '-14px', background: 'linear-gradient(135deg,#10B981,#059669)', borderRadius: '11px', padding: '8px 16px', boxShadow: '0 8px 22px rgba(16,185,129,0.45)', fontSize: '14px', fontWeight: '900', color: 'white', letterSpacing: '0.06em' }}>GRATIS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · VIDEO */}
      <section id="video" style={{ padding: PAD, background: '#060F1E' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div style={eyebrow('rgba(0,200,255,0.1)', '#00c8ff')}>▶ VIDEO EXPLICATIVO</div>
            <h2 style={h2('white')}>Conoce Labori por dentro.</h2>
            <p style={{ fontSize: '15.5px', color: 'rgba(255,255,255,0.55)', margin: '0 auto', lineHeight: '1.7', maxWidth: '580px' }}>
              Descubre cómo funciona la plataforma y las herramientas que pueden transformar la gestión de tu oficina contable.
            </p>
          </div>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: isMobile ? '12px' : '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <iframe
              src="https://www.youtube.com/embed/zqJblKim4l8"
              title="Conoce Labori"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button onClick={() => setPaso('registro')} style={{ ...btnPrincipal, height: '50px', padding: '0 32px', fontSize: '15px' }}>Probar gratis 15 días</button>
          </div>
        </div>
      </section>

      {/* 6 · PLANES */}
      <section id="planes" style={{ padding: PAD, background: 'linear-gradient(170deg,#060F1E,#0B1A33 60%,#060F1E)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <div style={eyebrow('rgba(26,86,219,0.16)', '#60A5FA')}>PLANES Y PRECIOS</div>
            <h2 style={h2('white')}>Elige el plan ideal para tu oficina.</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Desde contadores independientes hasta oficinas con grandes carteras de clientes.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { nombre: 'Plan Profesional', precio: '1,5', limite: 'Hasta 60 empresas', destacado: false },
              { nombre: 'Plan Corporativo', precio: '2,0', limite: 'Empresas ilimitadas', destacado: true },
            ].map(pl => (
              <div key={pl.nombre} style={{
                position: 'relative',
                background: pl.destacado ? 'linear-gradient(160deg,rgba(26,86,219,0.16),rgba(255,255,255,0.03))' : 'rgba(255,255,255,0.03)',
                border: '1px solid ' + (pl.destacado ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'),
                borderRadius: '20px', padding: '2rem 1.75rem',
                boxShadow: pl.destacado ? '0 8px 40px rgba(26,86,219,0.22)' : 'none',
              }}>
                {pl.destacado && (
                  <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', padding: '5px 16px', borderRadius: '20px', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(26,86,219,0.45)' }}>Más elegido</span>
                )}
                <div style={{ fontSize: '17px', fontWeight: '800', color: 'white', marginBottom: '14px' }}>{pl.nombre}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '5px' }}>
                  <span style={{ fontSize: '44px', fontWeight: '900', color: 'white', letterSpacing: '-2px', lineHeight: 1 }}>{pl.precio}</span>
                  <span style={{ fontSize: '17px', fontWeight: '700', color: 'rgba(255,255,255,0.75)' }}>UF</span>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '18px' }}>+ IVA al mes</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#00c8ff', paddingBottom: '14px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{pl.limite}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
                  {['Gestión de Oficina Contable', 'Sistema de Contabilidad', 'Recursos Humanos y Remuneraciones', 'Integración SII y AutoBalance', 'Portal gratuito para tus clientes'].map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#4ADE80', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.78)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPaso('registro')} style={{
                  width: '100%', height: '46px',
                  background: pl.destacado ? 'linear-gradient(135deg,#1A56DB,#0EA5E9)' : 'rgba(255,255,255,0.08)',
                  border: pl.destacado ? 'none' : '1px solid rgba(255,255,255,0.18)',
                  borderRadius: '12px', color: 'white', fontSize: '14.5px', fontWeight: '700', cursor: 'pointer',
                  boxShadow: pl.destacado ? '0 4px 18px rgba(26,86,219,0.4)' : 'none',
                }}>Comenzar gratis</button>
              </div>
            ))}
          </div>

          {/* COMPLEMENTOS */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '18px', padding: isMobile ? '1.4rem' : '1.75rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>Potencia tu experiencia con complementos</div>
              <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.5)' }}>Se contratan aparte y funcionan con cualquier plan</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              {[
                { nombre: 'Labori AI Studio', precio: '1,0', icono: '✨', color: '#A78BFA', desc: 'Documentos legales, cartas al SII, cláusulas e informes con IA.', detalle: ['40 consultas especializadas al mes', 'Entrega la normativa usada como respaldo', 'Objetos sociales y cláusulas de arbitraje', 'Comodatos, poderes y mandatos', 'Artículo 38 bis y depurador de F29', 'Generación ilimitada de documentos'] },
                { nombre: 'Cobranza Inteligente', precio: '1,5', icono: '⚡', color: '#F59E0B', desc: 'IA que cobra por WhatsApp y correo, y rastrea cada deudor.', detalle: ['Labori Talk: IA de cobranza 24/7', 'WhatsApp y correo automáticos', 'Convenios de pago', 'Links de pago con Mercado Pago', 'Portal del deudor', 'Cartera en tiempo real'] },
              ].map(ad => (
                <div key={ad.nombre} style={{ position: 'relative', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '1.4rem' }}>
                  <span style={{ position: 'absolute', top: '13px', right: '13px', fontSize: '9.5px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', background: ad.color + '22', color: ad.color, border: '1px solid ' + ad.color + '44', padding: '3px 9px', borderRadius: '20px' }}>Adicional</span>
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>{ad.icono}</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'white', marginBottom: '10px' }}>{ad.nombre}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '900', color: 'white', letterSpacing: '-1px', lineHeight: 1 }}>{ad.precio}</span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'rgba(255,255,255,0.75)' }}>UF</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>+ IVA al mes</div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '12px' }}>{ad.desc}</div>
                  <details>
                    <summary style={{ fontSize: '12px', fontWeight: '700', color: ad.color, cursor: 'pointer', listStyle: 'none', outline: 'none' }}>Ver características +</summary>
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {ad.detalle.map(d => (
                        <div key={d} style={{ display: 'flex', gap: '7px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                          <span style={{ color: ad.color, flexShrink: 0 }}>✓</span>{d}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '12.5px', marginTop: '1.5rem', lineHeight: '1.6' }}>
            Todos los planes incluyen 15 días de prueba gratis. Máximo 3 editores + 15 visores. Precios en UF + IVA, cobrados en pesos según la UF del primer día de cada mes.
          </p>
        </div>
      </section>

      {/* 7 · FAQ + CTA FINAL */}
      <section style={{ padding: PAD, background: '#060F1E' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ ...h2('white'), textAlign: 'center', marginBottom: '2rem' }}>Preguntas frecuentes</h2>
          {faq.map(([p, r]) => (
            <details key={p} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.1rem 1.35rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              <summary style={{ fontSize: '14.5px', fontWeight: '600', color: 'white', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', outline: 'none' }}>{p} <span style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>+</span></summary>
              <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.52)', margin: '0.9rem 0 0', lineHeight: '1.7' }}>{r}</p>
            </details>
          ))}
        </div>

        <div style={{ maxWidth: '760px', margin: isMobile ? '3rem auto 0' : '4.5rem auto 0', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: '900', color: 'white', margin: '0 0 1rem', letterSpacing: '-1px', lineHeight: '1.15' }}>
            Tu oficina contable puede<br />trabajar de otra manera.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '0 auto 2rem', lineHeight: '1.7', maxWidth: '560px' }}>
            Automatiza procesos, centraliza tus clientes y descubre todo lo que puedes lograr con Labori.
          </p>
          <button onClick={() => setPaso('registro')} style={{ ...btnPrincipal, height: '56px', padding: isMobile ? '0 26px' : '0 40px', fontSize: isMobile ? '15.5px' : '17px', borderRadius: '14px' }}>Comenzar mis 15 días gratis</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#030810', padding: '2.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'white', width: isMobile ? '100%' : 'auto' }}>Labori<span style={{ color: '#00c8ff' }}>X</span></div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', width: isMobile ? '100%' : 'auto' }}>
            <a href="/terminos" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12.5px', textDecoration: 'none' }}>Términos</a>
            <a href="/privacidad" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12.5px', textDecoration: 'none' }}>Privacidad</a>
            <a href="https://gc-gestion.online" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12.5px', textDecoration: 'none' }}>Iniciar sesión</a>
            <a href="mailto:notificaciones@grupocontadores.cl" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12.5px', textDecoration: 'none' }}>Contacto</a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '11.5px', margin: 0, width: isMobile ? '100%' : 'auto' }}>2026 Labori · Hecho por contadores para contadores · Chile</p>
        </div>
      </footer>

      {/* CTA FIJO MOVIL */}
      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99, background: 'rgba(6,15,30,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px calc(10px + env(safe-area-inset-bottom))' }}>
          <button onClick={() => setPaso('registro')} style={{ ...btnPrincipal, width: '100%', height: '48px', fontSize: '14.5px', borderRadius: '12px' }}>
            Prueba Labori gratis por 15 días
          </button>
        </div>
      )}
    </div>
  );
}
