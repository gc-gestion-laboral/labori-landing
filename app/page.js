'use client';
import { useState, useEffect } from 'react';

const API = 'https://gc-gestion.online/api';

const PLANES_DEFAULT = [
  { id:'starter',     nombre:'Starter',     precio_uf:0.8, precio_clp_con_iva:38000,  max_empresas:4,    max_trabajadores:25,  soporte:'Email',             color:'#2563EB' },
  { id:'basico',      nombre:'Básico',      precio_uf:1.5, precio_clp_con_iva:72000,  max_empresas:15,   max_trabajadores:70,  soporte:'Email',             color:'#7C3AED' },
  { id:'profesional', nombre:'Profesional', precio_uf:2.5, precio_clp_con_iva:121000, max_empresas:45,   max_trabajadores:180, soporte:'Email prioritario', color:'#0891B2', popular:true },
  { id:'business',    nombre:'Business',    precio_uf:4.0, precio_clp_con_iva:193000, max_empresas:null, max_trabajadores:350, soporte:'Soporte prioritario',color:'#059669' },
  { id:'enterprise',  nombre:'Enterprise',  precio_uf:null,precio_clp_con_iva:null,   max_empresas:null, max_trabajadores:null, soporte:'Dedicado',          color:'#DC2626' },
];

function fmt(n) { return n ? '$' + n.toLocaleString('es-CL') : null; }

export default function Home() {
  const [planes, setPlanes] = useState(PLANES_DEFAULT);
  const [planSel, setPlanSel] = useState(null);
  const [paso, setPaso] = useState('planes'); // planes | registro | exito
  const [form, setForm] = useState({ nombre:'', email:'', password:'', confirmar:'', rut:'' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [trialFin, setTrialFin] = useState(null);

  useEffect(() => {
    fetch(`${API}/suscripciones/planes`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length) setPlanes(data); })
      .catch(() => {});
  }, []);

  const seleccionarPlan = (plan) => {
    if (plan.id === 'enterprise') {
      window.location.href = 'mailto:contacto@labori.cl?subject=Plan Enterprise Labori';
      return;
    }
    setPlanSel(plan);
    setPaso('registro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const registrar = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmar) { setError('Las contraseñas no coinciden'); return; }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    setCargando(true);
    try {
      const r = await fetch(`${API}/suscripciones/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password, rut: form.rut, plan_id: planSel.id })
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Error al crear cuenta'); return; }
      setTrialFin(d.trial_fin);
      setPaso('exito');
    } catch { setError('Error de conexión. Intenta nuevamente.'); }
    finally { setCargando(false); }
  };

  if (paso === 'exito') return (
    <div style={{minHeight:'100vh',background:'#0F172A',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{maxWidth:'520px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'1rem'}}>🎉</div>
        <h1 style={{fontSize:'32px',fontWeight:'700',color:'white',margin:'0 0 12px'}}>¡Bienvenido a Labori!</h1>
        <p style={{fontSize:'16px',color:'#94A3B8',margin:'0 0 2rem',lineHeight:'1.6'}}>
          Tu cuenta ha sido creada exitosamente. Tienes <strong style={{color:'#60A5FA'}}>15 días de prueba gratuita</strong> para explorar todas las funcionalidades.
        </p>
        {trialFin && (
          <div style={{background:'#1E293B',borderRadius:'12px',padding:'1rem',marginBottom:'2rem',border:'1px solid #334155'}}>
            <p style={{color:'#94A3B8',fontSize:'13px',margin:0}}>Tu prueba gratuita vence el</p>
            <p style={{color:'white',fontSize:'20px',fontWeight:'700',margin:'4px 0 0'}}>{new Date(trialFin).toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric'})}</p>
          </div>
        )}
        <a href="https://gc-gestion.online" style={{display:'block',padding:'16px',background:'#2563EB',color:'white',borderRadius:'12px',textDecoration:'none',fontSize:'16px',fontWeight:'700',marginBottom:'12px'}}>
          🚀 Ingresar a Labori
        </a>
        <p style={{fontSize:'13px',color:'#475569'}}>Ingresa con el email y contraseña que registraste.</p>
      </div>
    </div>
  );

  if (paso === 'registro') return (
    <div style={{minHeight:'100vh',background:'#F8FAFC',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
      <div style={{maxWidth:'480px',width:'100%'}}>
        <button onClick={()=>setPaso('planes')} style={{background:'none',border:'none',color:'#6B7280',cursor:'pointer',fontSize:'14px',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'6px'}}>
          ← Volver a los planes
        </button>
        <div style={{background:'white',borderRadius:'20px',padding:'2rem',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
          <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <div style={{fontSize:'40px',marginBottom:'8px'}}>💼</div>
            <h2 style={{fontSize:'24px',fontWeight:'700',color:'#111827',margin:'0 0 4px'}}>Crear cuenta</h2>
            <p style={{fontSize:'14px',color:'#6B7280',margin:0}}>
              Plan <strong style={{color:planSel?.color}}>{planSel?.nombre}</strong> — 15 días gratis, sin tarjeta
            </p>
          </div>
          <form onSubmit={registrar} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {[
              {key:'nombre',label:'Nombre completo *',ph:'Juan González',type:'text',req:true},
              {key:'email',label:'Email de trabajo *',ph:'juan@empresa.cl',type:'email',req:true},
              {key:'rut',label:'RUT (opcional)',ph:'12.345.678-9',type:'text'},
              {key:'password',label:'Contraseña *',ph:'Mínimo 8 caracteres',type:'password',req:true},
              {key:'confirmar',label:'Confirmar contraseña *',ph:'Repite tu contraseña',type:'password',req:true},
            ].map(f => (
              <div key={f.key} style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <label style={{fontSize:'13px',fontWeight:'500',color:'#374151'}}>{f.label}</label>
                <input type={f.type} required={f.req} placeholder={f.ph}
                  value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                  style={{height:'44px',borderRadius:'10px',border:'1.5px solid #E5E7EB',padding:'0 14px',fontSize:'14px',outline:'none',transition:'border 0.2s'}}
                  onFocus={e=>e.target.style.borderColor='#2563EB'}
                  onBlur={e=>e.target.style.borderColor='#E5E7EB'}
                />
              </div>
            ))}
            {error && <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#DC2626'}}>{error}</div>}
            <button type="submit" disabled={cargando} style={{height:'48px',background:'#2563EB',color:'white',border:'none',borderRadius:'12px',fontSize:'16px',fontWeight:'700',cursor:cargando?'not-allowed':'pointer',opacity:cargando?0.7:1,marginTop:'8px'}}>
              {cargando ? '⏳ Creando cuenta...' : '🚀 Comenzar prueba gratis'}
            </button>
            <p style={{fontSize:'12px',color:'#9CA3AF',textAlign:'center',margin:0}}>
              Al crear tu cuenta aceptas nuestros <a href="/terminos" style={{color:'#2563EB'}}>Términos de uso</a> y <a href="/privacidad" style={{color:'#2563EB'}}>Política de privacidad</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh'}}>
      {/* NAVBAR */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(15,23,42,0.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 2rem',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'36px',height:'36px',background:'#2563EB',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'white',fontSize:'18px',fontWeight:'800'}}>L</span>
            </div>
            <span style={{color:'white',fontSize:'20px',fontWeight:'700'}}>Labori</span>
            <span style={{fontSize:'10px',background:'rgba(59,130,246,0.2)',color:'#60A5FA',borderRadius:'20px',padding:'2px 8px',fontWeight:'600'}}>BETA</span>
          </div>
          <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
            <a href="#planes" style={{color:'#94A3B8',textDecoration:'none',fontSize:'14px'}}>Planes</a>
            <a href="#funciones" style={{color:'#94A3B8',textDecoration:'none',fontSize:'14px'}}>Funciones</a>
            <a href="https://gc-gestion.online" style={{height:'36px',padding:'0 16px',background:'rgba(255,255,255,0.08)',color:'white',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',fontSize:'13px',fontWeight:'500',cursor:'pointer',textDecoration:'none',display:'flex',alignItems:'center'}}>
              Iniciar sesión
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(135deg,#0F172A 0%,#1E3A8A 50%,#0F172A 100%)',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'8rem 2rem 4rem',textAlign:'center'}}>
        <div style={{maxWidth:'800px'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(59,130,246,0.15)',border:'1px solid rgba(59,130,246,0.3)',borderRadius:'20px',padding:'6px 16px',marginBottom:'2rem'}}>
            <span style={{fontSize:'12px',color:'#60A5FA',fontWeight:'600'}}>✨ 15 días de prueba gratuita — Sin tarjeta de crédito</span>
          </div>
          <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:'800',color:'white',margin:'0 0 1.5rem',lineHeight:'1.1',letterSpacing:'-2px'}}>
            Gestión laboral<br/><span style={{color:'#60A5FA'}}>simple y legal</span><br/>para Chile
          </h1>
          <p style={{fontSize:'clamp(16px,2vw,20px)',color:'#94A3B8',margin:'0 0 3rem',lineHeight:'1.7',maxWidth:'600px',marginLeft:'auto',marginRight:'auto'}}>
            Contratos, liquidaciones, Previred, finiquitos y más. Todo en un solo lugar, conforme al Código del Trabajo chileno.
          </p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="#planes" style={{height:'52px',padding:'0 32px',background:'#2563EB',color:'white',border:'none',borderRadius:'12px',fontSize:'16px',fontWeight:'700',cursor:'pointer',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'8px',boxShadow:'0 8px 32px rgba(37,99,235,0.4)'}}>
              🚀 Comenzar gratis
            </a>
            <a href="#funciones" style={{height:'52px',padding:'0 32px',background:'rgba(255,255,255,0.08)',color:'white',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',fontSize:'16px',fontWeight:'500',cursor:'pointer',textDecoration:'none',display:'inline-flex',alignItems:'center'}}>
              Ver funciones
            </a>
          </div>
          {/* Stats */}
          <div style={{display:'flex',gap:'3rem',justifyContent:'center',marginTop:'4rem',flexWrap:'wrap'}}>
            {[['100%','Conforme al Código del Trabajo'],['15 días','Prueba gratuita'],['Previred','Formato oficial validado']].map(([n,l])=>(
              <div key={n} style={{textAlign:'center'}}>
                <div style={{fontSize:'28px',fontWeight:'800',color:'white'}}>{n}</div>
                <div style={{fontSize:'13px',color:'#64748B',marginTop:'4px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUNCIONES */}
      <section id="funciones" style={{padding:'6rem 2rem',background:'#F8FAFC'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <h2 style={{fontSize:'40px',fontWeight:'800',color:'#111827',margin:'0 0 1rem'}}>Todo lo que necesitas</h2>
            <p style={{fontSize:'18px',color:'#6B7280',margin:0}}>Una plataforma completa para gestionar tu cartera de clientes laborales</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem'}}>
            {[
              {icon:'📄',titulo:'Contratos de trabajo',desc:'Genera contratos en Word para todos los tipos: indefinido, plazo fijo, obra/faena, teletrabajo y más.'},
              {icon:'💰',titulo:'Liquidaciones de sueldo',desc:'Cálculo automático de AFP, SIS, salud, IUSC y AFC. Descarga PDF individual o conjunto.'},
              {icon:'📊',titulo:'Previred y LRE',desc:'Archivo Previred formato v82 validado. Libro de Remuneraciones Electrónico para la DT.'},
              {icon:'🧮',titulo:'Calculadora de finiquito',desc:'Calcula finiquitos con todos los conceptos legales: vacaciones, indemnización y aviso previo.'},
              {icon:'⚠️',titulo:'Gestión disciplinaria',desc:'Amonestaciones escritas y verbales, cartas de aviso y mutuo acuerdo listos en segundos.'},
              {icon:'🏥',titulo:'Licencias médicas',desc:'Control completo de licencias con seguimiento de tramitación y cálculo de subsidios.'},
              {icon:'🏅',titulo:'Certificados oficiales',desc:'Certificados de antigüedad, laboral y renta. Certificado N°6 del SII para declaración de renta.'},
              {icon:'👥',titulo:'Multi-empresa',desc:'Gestiona toda tu cartera de clientes desde un solo panel. Cada empresa aislada y segura.'},
              {icon:'📤',titulo:'Importación masiva',desc:'Importa cientos de trabajadores desde Excel en segundos.'},
            ].map(f=>(
              <div key={f.titulo} style={{background:'white',borderRadius:'16px',padding:'1.5rem',border:'1px solid #E5E7EB',transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.1)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}>
                <div style={{fontSize:'32px',marginBottom:'12px'}}>{f.icon}</div>
                <h3 style={{fontSize:'16px',fontWeight:'700',color:'#111827',margin:'0 0 8px'}}>{f.titulo}</h3>
                <p style={{fontSize:'14px',color:'#6B7280',margin:0,lineHeight:'1.6'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{padding:'6rem 2rem',background:'#0F172A'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <h2 style={{fontSize:'40px',fontWeight:'800',color:'white',margin:'0 0 1rem'}}>Planes simples y transparentes</h2>
            <p style={{fontSize:'18px',color:'#94A3B8',margin:0}}>Todos incluyen 1 administrador + 3 editores. Prueba gratis 15 días.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem',alignItems:'start'}}>
            {planes.map(plan=>(
              <div key={plan.id} style={{
                background: plan.popular ? 'white' : 'rgba(255,255,255,0.04)',
                border: plan.popular ? `2px solid ${plan.color||'#2563EB'}` : '1px solid rgba(255,255,255,0.08)',
                borderRadius:'20px', padding:'2rem', position:'relative',
                transform: plan.popular ? 'scale(1.03)' : 'none',
              }}>
                {plan.popular && (
                  <div style={{position:'absolute',top:'-14px',left:'50%',transform:'translateX(-50%)',background:'#2563EB',color:'white',fontSize:'11px',fontWeight:'700',padding:'4px 16px',borderRadius:'20px',whiteSpace:'nowrap'}}>
                    ⭐ MÁS POPULAR
                  </div>
                )}
                <div style={{marginBottom:'1.5rem'}}>
                  <h3 style={{fontSize:'20px',fontWeight:'700',color:plan.popular?'#111827':'white',margin:'0 0 8px'}}>{plan.nombre}</h3>
                  {plan.precio_clp_con_iva ? (
                    <>
                      <div style={{fontSize:'36px',fontWeight:'800',color:plan.color||'#2563EB',lineHeight:1}}>{fmt(plan.precio_clp_con_iva)}</div>
                      <div style={{fontSize:'13px',color:plan.popular?'#6B7280':'#64748B',marginTop:'4px'}}>/mes + IVA · {plan.precio_uf} UF</div>
                    </>
                  ) : (
                    <div style={{fontSize:'28px',fontWeight:'800',color:plan.color||'#DC2626'}}>A medida</div>
                  )}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'1.5rem'}}>
                  {[
                    [plan.max_empresas ? `Hasta ${plan.max_empresas} empresas` : 'Empresas ilimitadas', true],
                    [plan.max_trabajadores ? `Hasta ${plan.max_trabajadores} trabajadores` : 'Trabajadores ilimitados', true],
                    ['1 administrador + 3 editores', true],
                    [plan.max_empresas ? `${plan.max_empresas} usuarios solo lectura` : 'Usuarios solo lectura ilimitados', true],
                    [plan.soporte, true],
                    ['Todos los módulos incluidos', true],
                    ['15 días de prueba gratis', plan.id !== 'enterprise'],
                  ].map(([texto,ok],i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'8px',fontSize:'13px',color:plan.popular?'#374151':'#94A3B8'}}>
                      <span style={{color:ok?'#22C55E':'#6B7280',fontSize:'16px'}}>{ok?'✓':'—'}</span>
                      {texto}
                    </div>
                  ))}
                </div>
                <button onClick={()=>seleccionarPlan(plan)} style={{
                  width:'100%',height:'44px',
                  background: plan.popular ? (plan.color||'#2563EB') : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  borderRadius:'10px',fontSize:'14px',fontWeight:'600',cursor:'pointer',
                }}>
                  {plan.id === 'enterprise' ? 'Contactar ventas' : 'Comenzar gratis →'}
                </button>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',color:'#475569',fontSize:'13px',marginTop:'2rem'}}>
            Precios en CLP + IVA. El valor en UF se calcula mensualmente según el valor oficial de la UF.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:'6rem 2rem',background:'#F8FAFC'}}>
        <div style={{maxWidth:'720px',margin:'0 auto'}}>
          <h2 style={{fontSize:'36px',fontWeight:'800',color:'#111827',textAlign:'center',margin:'0 0 3rem'}}>Preguntas frecuentes</h2>
          {[
            ['¿Necesito tarjeta de crédito para la prueba?','No. Los 15 días de prueba son completamente gratuitos y no requieren ningún dato de pago.'],
            ['¿Qué pasa cuando termina la prueba?','Recibirás un email avisándote. Puedes pagar en línea con tarjeta de crédito o débito para continuar.'],
            ['¿Puedo cambiar de plan?','Sí, puedes cambiar de plan en cualquier momento desde tu cuenta.'],
            ['¿Los documentos tienen validez legal?','Los documentos siguen los formatos del Código del Trabajo chileno. Deben ser firmados por las partes para tener validez.'],
            ['¿Puedo agregar más usuarios?','Cada plan incluye 1 administrador y 3 editores. Puedes contratar usuarios adicionales según necesidad.'],
            ['¿Cómo funciona el cobro?','El cobro es mensual automático en pesos chilenos. Puedes cancelar cuando quieras.'],
          ].map(([p,r])=>(
            <details key={p} style={{background:'white',borderRadius:'12px',padding:'1.25rem 1.5rem',marginBottom:'1rem',border:'1px solid #E5E7EB',cursor:'pointer'}}>
              <summary style={{fontSize:'16px',fontWeight:'600',color:'#111827',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                {p} <span style={{color:'#6B7280'}}>+</span>
              </summary>
              <p style={{fontSize:'14px',color:'#6B7280',margin:'1rem 0 0',lineHeight:'1.6'}}>{r}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{padding:'6rem 2rem',background:'linear-gradient(135deg,#1E3A8A,#2563EB)',textAlign:'center'}}>
        <h2 style={{fontSize:'40px',fontWeight:'800',color:'white',margin:'0 0 1rem'}}>Empieza hoy, gratis</h2>
        <p style={{fontSize:'18px',color:'rgba(255,255,255,0.8)',margin:'0 0 2rem'}}>15 días de prueba sin compromiso. Sin tarjeta de crédito.</p>
        <a href="#planes" style={{height:'52px',padding:'0 40px',background:'white',color:'#1E3A8A',border:'none',borderRadius:'12px',fontSize:'16px',fontWeight:'700',cursor:'pointer',textDecoration:'none',display:'inline-flex',alignItems:'center',boxShadow:'0 8px 32px rgba(0,0,0,0.2)'}}>
          🚀 Ver planes y comenzar
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#0F172A',padding:'3rem 2rem',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{width:'32px',height:'32px',background:'#2563EB',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{color:'white',fontSize:'16px',fontWeight:'800'}}>L</span>
            </div>
            <span style={{color:'white',fontSize:'16px',fontWeight:'700'}}>Labori</span>
          </div>
          <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
            <a href="/terminos" style={{color:'#475569',fontSize:'13px',textDecoration:'none'}}>Términos de uso</a>
            <a href="/privacidad" style={{color:'#475569',fontSize:'13px',textDecoration:'none'}}>Privacidad</a>
            <a href="mailto:contacto@labori.cl" style={{color:'#475569',fontSize:'13px',textDecoration:'none'}}>contacto@labori.cl</a>
          </div>
          <p style={{color:'#334155',fontSize:'12px',margin:0}}>© 2026 Labori — GC Gestión Laboral</p>
        </div>
      </footer>
    </div>
  );
}
