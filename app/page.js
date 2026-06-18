'use client';
import { useState, useEffect, useRef } from 'react';

const API = 'https://gc-gestion.online/api';

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

export default function Home() {
  const [paso, setPaso] = useState('landing');
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', rut: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [trialFin, setTrialFin] = useState(null);
  const [statsRef, statsInView] = useInView();
  const horas = useCountUp(12, 2000, statsInView);
  const docs = useCountUp(500, 2000, statsInView);
  const empresas = useCountUp(98, 2000, statsInView);
  const tiempo = useCountUp(80, 2000, statsInView);

  const registrar = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmar) { setError('Las contrasenas no coinciden'); return; }
    if (form.password.length < 8) { setError('La contrasena debe tener al menos 8 caracteres'); return; }
    setCargando(true);
    try {
      const r = await fetch(API + '/suscripciones/registro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password, rut: form.rut, plan_id: 'starter' }) });
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
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', margin: '0 0 12px' }}>Bienvenido a LaborixX</h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '0 0 2rem', lineHeight: '1.7' }}>Tu cuenta fue creada. Tienes <strong style={{ color: '#00c8ff' }}>15 dias de prueba gratuita</strong>.</p>
        {trialFin && <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>Tu prueba gratuita vence el</p><p style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: '4px 0 0' }}>{new Date(trialFin).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>}
        <a href="https://gc-gestion.online" style={{ display: 'block', padding: '16px', background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Ingresar a LaborixX</a>
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
            {[{ key: 'nombre', label: 'Nombre completo', ph: 'Juan Gonzalez', type: 'text', req: true }, { key: 'email', label: 'Email', ph: 'juan@empresa.cl', type: 'email', req: true }, { key: 'rut', label: 'RUT (opcional)', ph: '12.345.678-9', type: 'text' }, { key: 'password', label: 'Contrasena', ph: 'Minimo 8 caracteres', type: 'password', req: true }, { key: 'confirmar', label: 'Confirmar contrasena', ph: 'Repite tu contrasena', type: 'password', req: true }].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input type={f.type} required={f.req} placeholder={f.ph} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ width: '100%', height: '44px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', padding: '0 14px', fontSize: '14px', outline: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} />
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

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(6,15,30,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '22px', fontWeight: '900', color: 'white' }}>Labori<span style={{ color: '#00c8ff' }}>X</span></div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="#modulos" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Modulos</a>
            <a href="#planes" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Planes</a>
            <a href="#roadmap" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px' }}>Roadmap</a>
            <a href="https://gc-gestion.online" style={{ height: '36px', padding: '0 16px', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Iniciar sesion</a>
            <button onClick={() => setPaso('registro')} style={{ height: '36px', padding: '0 16px', background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Comenzar gratis</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#060F1E 0%,#0C1A3A 60%,#060F1E 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,200,255,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '900px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '6px 16px', marginBottom: '2rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
            <span style={{ fontSize: '12px', color: '#6EE7B7', fontWeight: '600' }}>Plataforma activa · Normativa chilena · 15 dias gratis</span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: '900', color: 'white', margin: '0 0 1.5rem', lineHeight: '1.05', letterSpacing: '-2px' }}>
            Automatiza la administracion<br /><span style={{ color: '#00c8ff' }}>completa de tu empresa.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.75rem', lineHeight: '1.7', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Contratos, remuneraciones, documentos laborales y cobranza inteligente desde una sola plataforma.
          </p>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', margin: '0 0 3rem' }}>
            Ahorra horas de trabajo cada semana y olvídate de los procesos manuales.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <button onClick={() => setPaso('registro')} style={{ height: '56px', padding: '0 40px', background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 32px rgba(26,86,219,0.5)', transition: 'transform 0.2s' }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'none'}>
              Solicitar Demo
            </button>
            <a href="#planes" style={{ height: '56px', padding: '0 32px', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', fontSize: '16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Ver Planes</a>
          </div>
          {/* MOCKUP HOME */}
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '8px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
              <div style={{ background: '#1A1A2E', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                {['#FF5F56', '#FFBD2E', '#27C93F'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '20px', marginLeft: '8px' }} />
              </div>
              <img src="https://gc-gestion.online/capturas/home.png" alt="LaborixX Dashboard" style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
            </div>
            {/* Tarjetas flotantes */}
            <div style={{ position: 'absolute', top: '-20px', right: '-30px', background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>Contratos generados</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'white' }}>+2.400</div>
            </div>
            <div style={{ position: 'absolute', bottom: '-20px', left: '-30px', background: 'rgba(26,86,219,0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(26,86,219,0.3)' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '2px' }}>Empresas gestionadas</div>
              <div style={{ fontSize: '22px', fontWeight: '900', color: 'white' }}>+350</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS ANIMADOS */}
      <section ref={statsRef} style={{ padding: '5rem 2rem', background: '#060F1E', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { valor: horas, sufijo: 'hrs', label: 'Ahorradas por semana', color: '#00c8ff' },
            { valor: docs, sufijo: '+', label: 'Documentos generados', color: '#10B981' },
            { valor: empresas, sufijo: '%', label: 'Clientes satisfechos', color: '#F59E0B' },
            { valor: tiempo, sufijo: '%', label: 'Menos tiempo manual', color: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: '900', color: s.color, lineHeight: 1 }}>{s.valor}{s.sufijo}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULO 1 - RRHH */}
      <section id="modulos" style={{ padding: '6rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DBEAFE', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: '#1A56DB', fontWeight: '700', marginBottom: '1.5rem' }}>👥 GESTION LABORAL</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: '900', color: '#0C1A2E', margin: '0 0 1rem', lineHeight: '1.2' }}>Nunca vuelvas a redactar un contrato manualmente.</h2>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', margin: '0 0 2rem' }}>Genera contratos, anexos, certificados y toda la documentacion laboral en segundos. Centraliza el expediente de cada trabajador y cumple con el Codigo del Trabajo chileno sin esfuerzo.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                {['Contratos automaticos', 'Anexos', 'Certificados', 'Licencias medicas', 'Finiquitos', 'Amonestaciones', 'Expediente laboral'].map(f => (
                  <span key={f} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#EFF6FF', color: '#1A56DB', fontWeight: '500' }}>{f}</span>
                ))}
              </div>
              <button onClick={() => setPaso('registro')} style={{ height: '48px', padding: '0 28px', background: 'linear-gradient(135deg,#1A56DB,#3B82F6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(26,86,219,0.3)' }}>Probar gratis 15 dias</button>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '8px', boxShadow: '0 24px 60px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB', transform: 'rotate(1deg)', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'rotate(1deg)'}>
                <img src="https://gc-gestion.online/capturas/rrhh.png" alt="Gestion Laboral" style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULO 2 - REMUNERACIONES */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg,#060F1E,#0C1A3A)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '8px', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', transform: 'rotate(-1deg)', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'rotate(-1deg)'}>
                <img src="https://gc-gestion.online/capturas/remuneraciones.png" alt="Remuneraciones" style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(14,165,233,0.2)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: '#0EA5E9', fontWeight: '700', marginBottom: '1.5rem' }}>💰 REMUNERACIONES</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: '900', color: 'white', margin: '0 0 1rem', lineHeight: '1.2' }}>Calcula cientos de remuneraciones en minutos.</h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', margin: '0 0 2rem' }}>Liquidaciones automaticas con AFP, salud, IUSC y AFC. Genera el archivo Previred, libro de remuneraciones y certificados oficiales sin hojas de calculo.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                {['Liquidaciones', 'Previred', 'Libro de remuneraciones', 'Certificado N6 SII', 'DJ 1887', 'Informes de costo'].map(f => (
                  <span key={f} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(14,165,233,0.15)', color: '#0EA5E9', fontWeight: '500' }}>{f}</span>
                ))}
              </div>
              <button onClick={() => setPaso('registro')} style={{ height: '48px', padding: '0 28px', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>Probar gratis 15 dias</button>
            </div>
          </div>
        </div>
      </section>

      {/* MODULO 3 - COBRANZA */}
      <section style={{ padding: '6rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: '#D97706', fontWeight: '700', marginBottom: '8px' }}>⚡ COBRANZA INTELIGENTE</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', borderRadius: '20px', padding: '4px 12px', fontSize: '11px', color: 'white', fontWeight: '700', marginBottom: '1.5rem', marginLeft: '8px' }}>40% OFF</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: '900', color: '#0C1A2E', margin: '0 0 1rem', lineHeight: '1.2' }}>Recupera mas dinero sin llamar clientes.</h2>
              <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', margin: '0 0 2rem' }}>IA que cobra por ti via WhatsApp y email. Genera convenios de pago, envia links de pago y rastrea cada deudor automaticamente. Menos llamadas, mas recuperacion.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2rem' }}>
                {['WhatsApp automatico', 'Email automatico', 'IA de cobranza', 'Convenios de pago', 'Mercado Pago', 'Portal del deudor', 'DICOM', 'Flujos automaticos'].map(f => (
                  <span key={f} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#FEF3C7', color: '#D97706', fontWeight: '500' }}>{f}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setPaso('registro')} style={{ height: '48px', padding: '0 28px', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>Activar con 40% OFF</button>
              </div>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>Oferta valida junio y julio 2026 · 6 meses de descuento</p>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ background: 'white', borderRadius: '16px', padding: '8px', boxShadow: '0 24px 60px rgba(0,0,0,0.12)', border: '1px solid #E5E7EB', transform: 'rotate(1deg)', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'rotate(1deg)'}>
                <img src="https://gc-gestion.online/capturas/cobranza.png" alt="Cobranza Inteligente" style={{ width: '100%', borderRadius: '10px', display: 'block' }} />
              </div>
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', borderRadius: '12px', padding: '10px 16px', boxShadow: '0 8px 24px rgba(245,158,11,0.4)' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>Descuento activo</div>
                <div style={{ fontSize: '22px', fontWeight: '900', color: 'white' }}>40% OFF</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LABORIX TALK */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg,#060F1E,#0C1A3A)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.2)', borderRadius: '20px', padding: '4px 14px', fontSize: '11px', color: '#00c8ff', fontWeight: '600', marginBottom: '2rem' }}>INTELIGENCIA ARTIFICIAL</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: '900', color: 'white', margin: '0 0 1rem' }}>LaborixX Talk</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', margin: '0 0 3rem', lineHeight: '1.7', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>IA entrenada para cobranza en Chile. Responde por WhatsApp, entiende cada deuda y escala cuando sea necesario.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem' }}>
            {[{ icon: '🕐', titulo: 'Respuesta 24/7', desc: 'Nunca deja sin responder' }, { icon: '🧠', titulo: 'Entrenada para cobrar', desc: 'Conoce cada cliente' }, { icon: '🔗', titulo: 'Integrada al sistema', desc: 'Ve saldos y convenios' }, { icon: '📉', titulo: 'Reduce trabajo manual', desc: 'Automatiza el 80%' }].map(t => (
              <div key={t.titulo} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', transition: 'transform 0.2s, border-color 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,200,255,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{t.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>{t.titulo}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANTES VS DESPUES */}
      <section style={{ padding: '6rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '900', color: '#0C1A2E', margin: '0 0 1rem' }}>Deja de perseguir procesos. Automatizalos.</h2>
            <p style={{ fontSize: '18px', color: '#6B7280', margin: 0 }}>Menos planillas. Menos errores. Menos tiempo perdido. Mas control.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ background: '#FEF2F2', border: '2px solid #FECACA', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#DC2626', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>ANTES — Sin LaborixX</div>
              {['Word y Excel para cada documento', 'WhatsApp para cobrar manualmente', 'Planillas de remuneraciones a mano', 'Recordatorios manuales por correo', 'Documentos sueltos sin respaldo', 'Cobranzas desordenadas', 'Horas perdidas en tareas repetitivas'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(220,38,38,0.1)', fontSize: '14px', color: '#374151' }}><span style={{ color: '#DC2626', fontWeight: '700' }}>✗</span>{t}</div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg,#060F1E,#0C1A3A)', border: '2px solid rgba(0,200,255,0.3)', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#00c8ff', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>DESPUES — Con LaborixX</div>
              {['Contratos automaticos en segundos', 'Cobranza automatica con IA', 'Liquidaciones calculadas y validadas', 'Flujos automaticos programados', 'Todo centralizado y con respaldo', 'Cartera de cobranza en tiempo real', 'Mas tiempo para lo que importa'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(0,200,255,0.1)', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}><span style={{ color: '#10B981', fontWeight: '700' }}>✓</span>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DT PROXIMAMENTE */}
      <section style={{ padding: '3rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'white', border: '2px dashed #E5E7EB', borderRadius: '20px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🏛️</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0C1A2E', margin: 0 }}>Registro automatico en la DT</h3>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 10px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706' }}>PROXIMAMENTE</span>
              </div>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.6' }}>Estamos desarrollando la automatizacion para registrar contratos en la Direccion del Trabajo sin salir de LaborixX.</p>
            </div>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600', background: '#F3F4F6', padding: '6px 14px', borderRadius: '20px', flexShrink: 0 }}>Roadmap 2026</span>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{ padding: '6rem 2rem', background: '#060F1E' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '900', color: 'white', margin: '0 0 1rem' }}>Activa solo lo que necesitas</h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Modelo modular. Paga por modulo. Escala cuando quieras.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'rgba(255,255,255,0.05)', padding: '1rem 1.5rem', gap: '1rem' }}>
              {['Modulo', 'Esencial', 'Profesional', 'Enterprise'].map((h, i) => <div key={h} style={{ fontSize: '12px', fontWeight: '700', color: i === 0 ? 'rgba(255,255,255,0.5)' : 'white', textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>)}
            </div>
            {[
              { modulo: 'Remuneraciones', esencial: '0.8 UF - 10 emp', profesional: '1.0 UF - 160 emp', enterprise: '1.5 UF - ilimitadas' },
              { modulo: 'Contabilidad', esencial: '0.7 UF - 60 emp', profesional: '1.0 UF - 160 emp', enterprise: '1.5 UF - ilimitadas' },
              { modulo: 'Plan Empresa (ambos)', esencial: 'No disponible', profesional: '1.5 UF - 160 emp', enterprise: '2.3 UF - ilimitadas' },
              { modulo: 'Cobranza Inteligente', esencial: '0.9 UF (0.54 con desc.)', profesional: '', enterprise: '' },
              { modulo: 'Facturacion', esencial: '0.3 UF - 10 doc', profesional: '1.0 UF - 80 doc', enterprise: '2.0 UF - 180 doc' },
              { modulo: 'Despacho Contable', esencial: '0.7 UF', profesional: '', enterprise: '' },
            ].map((p, i) => (
              <div key={p.modulo} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1rem 1.5rem', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>{p.modulo}</div>
                {[p.esencial, p.profesional, p.enterprise].map((v, j) => <div key={j} style={{ fontSize: '12px', color: v ? '#00c8ff' : 'rgba(255,255,255,0.2)', textAlign: 'center', fontWeight: v ? '600' : '400' }}>{v || '—'}</div>)}
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.1))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', borderRadius: '10px', padding: '8px 14px', fontSize: '18px', fontWeight: '900', color: 'white' }}>40% OFF</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#FCD34D' }}>Oferta de lanzamiento - Junio y Julio 2026</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Modulo Cobranza Inteligente con 40% de descuento durante 6 meses</div>
              </div>
            </div>
            <button onClick={() => setPaso('registro')} style={{ height: '40px', padding: '0 20px', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Aprovechar oferta</button>
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Todos los modulos incluyen 15 dias de prueba gratis. Maximo 3 editores + 15 visores. Precios en UF + IVA.</p>
        </div>
      </section>

      {/* ROADMAP TIMELINE */}
      <section id="roadmap" style={{ padding: '6rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: '900', color: '#0C1A2E', margin: '0 0 1rem' }}>Un ecosistema en crecimiento</h2>
            <p style={{ fontSize: '18px', color: '#6B7280', margin: 0 }}>Seguimos construyendo para automatizar todo lo que necesitas.</p>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg,#1A56DB,#00c8ff,#8B5CF6)', transform: 'translateX(-50%)' }} />
            {[
              { lado: 'left', fecha: 'Disponible', color: '#10B981', items: ['Gestion Laboral Integral', 'Contratos y Anexos', 'Remuneraciones y Previred', 'Cobranza Inteligente', 'WhatsApp y email IA', 'Mercado Pago', 'LaborixX Talk'] },
              { lado: 'right', fecha: 'Q3 2026', color: '#F59E0B', items: ['Envio automatico a la DT', 'Robot DT completo', 'Despacho Contable', 'Firma electronica avanzada'] },
              { lado: 'left', fecha: 'Q4 2026', color: '#8B5CF6', items: ['Facturacion electronica', 'Contabilidad Express', 'Tributaria', 'Activos fijos'] },
              { lado: 'right', fecha: '2027', color: '#EF4444', items: ['Contabilidad completa', 'Mas automatizaciones IA', 'Integraciones SII avanzadas'] },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: item.lado === 'left' ? 'flex-start' : 'flex-end', marginBottom: '3rem', position: 'relative' }}>
                <div style={{ width: '45%', background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', position: 'relative' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: item.color, marginBottom: '1rem', letterSpacing: '0.05em' }}>{item.fecha}</div>
                  {item.items.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '13px', color: '#374151', borderBottom: '1px solid #F9FAFB' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />{f}
                    </div>
                  ))}
                  <div style={{ position: 'absolute', top: '20px', [item.lado === 'left' ? 'right' : 'left']: '-8px', width: '16px', height: '16px', borderRadius: '50%', background: item.color, border: '3px solid white', boxShadow: '0 0 0 2px ' + item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '6rem 2rem', background: '#060F1E' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: 'white', textAlign: 'center', margin: '0 0 3rem' }}>Preguntas frecuentes</h2>
          {[
            ['Necesito tarjeta de credito para la prueba?', 'No. Los 15 dias de prueba son completamente gratuitos.'],
            ['Como funciona el modelo de precios?', 'Pagas solo por los modulos que activas. Cada modulo tiene tramos Esencial, Profesional y Enterprise segun la cantidad de empresas que gestionas.'],
            ['Que pasa cuando termina la prueba?', 'Al vencer el trial, eleges los modulos que quieres activar y pagas solo por ellos. Sin sorpresas.'],
            ['Puedo cambiar de modulos?', 'Si, puedes activar o desactivar modulos en cualquier momento desde tu cuenta.'],
            ['Los documentos tienen validez legal?', 'Los documentos siguen los formatos del Codigo del Trabajo chileno. Deben ser firmados por las partes para tener validez.'],
            ['Como funciona el cobro?', 'El cobro es mensual en pesos chilenos, calculado sobre el valor de la UF del primer dia de cada mes.'],
          ].map(([p, r]) => (
            <details key={p} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
              <summary style={{ fontSize: '15px', fontWeight: '600', color: 'white', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>{p} <span style={{ color: 'rgba(255,255,255,0.4)' }}>+</span></summary>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: '1rem 0 0', lineHeight: '1.6' }}>{r}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg,#060F1E,#0C1A3A)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(26,86,219,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: '900', color: 'white', margin: '0 0 1rem', letterSpacing: '-1px' }}>Empieza a automatizar<br />tu empresa hoy</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', margin: '0 0 2rem', lineHeight: '1.7', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>Activa LaborixX y transforma la forma en que gestionas trabajadores, documentos, remuneraciones y cobranza.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setPaso('registro')} style={{ height: '56px', padding: '0 40px', background: 'linear-gradient(135deg,#1A56DB,#0EA5E9)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 32px rgba(26,86,219,0.5)' }}>Solicitar demo</button>
            <a href="#planes" style={{ height: '56px', padding: '0 32px', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', fontSize: '16px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Ver planes</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#030810', padding: '3rem 2rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>Labori<span style={{ color: '#00c8ff' }}>X</span></div>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <a href="/terminos" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Terminos</a>
            <a href="/privacidad" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>Privacidad</a>
            <a href="mailto:contacto@labori.cl" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textDecoration: 'none' }}>contacto@labori.cl</a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: '12px', margin: 0 }}>2026 LaborixX - Plataforma integral - Chile</p>
        </div>
      </footer>
    </div>
  );
}
