cat > /tmp/new_landing.js << 'PYEOF'
'use client';
import { useState, useEffect } from 'react';

const API = 'https://gc-gestion.online/api';

function fmt(n) { return n ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n) : null; }

const MODULOS = [
  {
    id: 'laboral',
    icono: '👥',
    nombre: 'Gestión Laboral Integral',
    badge: 'Activo',
    badgeColor: '#10B981',
    color: '#1A56DB',
    grad: 'linear-gradient(135deg,#1A56DB,#3B82F6)',
    desc: 'Administra empresas, trabajadores, contratos, anexos, certificados, cartas de aviso, amonestaciones, licencias médicas, finiquitos y expediente laboral desde una sola plataforma.',
    funciones: ['Empresas y trabajadores','Contratos automáticos','Anexos','Certificados','Cartas de aviso','Mutuo acuerdo','Amonestaciones','Licencias médicas','Costeo laboral','Finiquitos','Expediente laboral'],
  },
  {
    id: 'remuneraciones',
    icono: '💰',
    nombre: 'Remuneraciones',
    badge: 'Activo',
    badgeColor: '#10B981',
    color: '#0EA5E9',
    grad: 'linear-gradient(135deg,#0EA5E9,#06B6D4)',
    desc: 'Calcula liquidaciones, genera libros de remuneraciones, archivos Previred, certificados oficiales e informes de costos laborales en minutos.',
    funciones: ['Liquidaciones de sueldo','Libro de remuneraciones','Archivo Previred','Certificado N°6 SII','DJ 1887','Informes de costos','Parámetros legales','Centros de costo','Biblioteca de conceptos'],
  },
  {
    id: 'cobranza',
    icono: '⚡',
    nombre: 'Cobranza Inteligente',
    badge: 'DESTACADO',
    badgeColor: '#F59E0B',
    color: '#F59E0B',
    grad: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    desc: 'Automatiza tu cobranza por WhatsApp, email e inteligencia artificial. Recupera más dinero, reduce llamadas y permite a tus clientes pagar online.',
    funciones: ['Cartera total','Por cobrar','Cobrado','Vencido','Clientes morosos','DICOM','Convenios','Incobrables','Links de pago','Mercado Pago','Portal de clientes','Flujos automáticos','Plantillas WhatsApp/email','LaborixX Talk IA'],
    addon: true,
    precio: 'desde 0.54 UF/mes',
    descuento: '40% OFF',
  },
  {
    id: 'contabilidad',
    icono: '📊',
    nombre: 'Contabilidad',
    badge: 'Próximamente',
    badgeColor: '#8B5CF6',
    color: '#8B5CF6',
    grad: 'linear-gradient(135deg,#8B5CF6,#7C3AED)',
    desc: 'F29, F50, libros contables, balances y conciliación bancaria.',
    funciones: ['Libro de compras y ventas','F29 y F50','Balance general','Libro mayor','Conciliación bancaria'],
    pronto: true,
  },
  {
    id: 'facturacion',
    icono: '🧾',
    nombre: 'Facturación Electrónica',
    badge: 'Próximamente',
    badgeColor: '#6B7280',
    color: '#6B7280',
    grad: 'linear-gradient(135deg,#6B7280,#4B5563)',
    desc: 'Emisión de facturas, boletas y notas de crédito conectadas directamente al SII Chile.',
    funciones: ['Facturas electrónicas','Boletas','Notas de crédito','Notas de débito','DTE al SII'],
    pronto: true,
  },
  {
    id: 'despacho',
    icono: '🏢',
    nombre: 'Despacho Contable',
    badge: 'Próximamente',
    badgeColor: '#6B7280',
    color: '#DC2626',
    grad: 'linear-gradient(135deg,#DC2626,#EF4444)',
    desc: 'CRM para oficinas contables. Gestiona clientes, documentos, tareas y agenda profesional.',
    funciones: ['Gestión de clientes','Documentos','Tareas y agenda','Panel profesional'],
    pronto: true,
  },
];

const PLANES_MODULOS = [
  { modulo: 'Remuneraciones', esencial: '0.8 UF · 10 emp', profesional: '1.0 UF · 160 emp', enterprise: '1.5 UF · ilimitadas' },
  { modulo: 'Contabilidad', esencial: '0.7 UF · 60 emp', profesional: '1.0 UF · 160 emp', enterprise: '1.5 UF · ilimitadas' },
  { modulo: 'Plan Empresa (ambos)', esencial: '—', profesional: '1.5 UF · 160 emp', enterprise: '2.3 UF · ilimitadas' },
  { modulo: 'Cobranza Inteligente', esencial: '0.9 UF (0.54 con 40% desc.)', profesional: '—', enterprise: '—' },
  { modulo: 'Facturación', esencial: '0.3 UF · 10 doc', profesional: '1.0 UF · 80 doc', enterprise: '2.0 UF · 180 doc' },
  { modulo: 'Despacho Contable', esencial: '0.7 UF', profesional: '—', enterprise: '—' },
];

export default function Home() {
  const [paso, setPaso] = useState('landing');
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '', rut: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [trialFin, setTrialFin] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

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
        body: JSON.stringify({ nombre: form.nombre, email: form.email, password: form.password, rut: form.rut, plan_id: 'starter' })
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Error al crear cuenta'); return; }
      setTrialFin(d.trial_fin);
      setPaso('exito');
    } catch { setError('Error de conexión. Intenta nuevamente.'); }
    finally { setCargando(false); }
  };

  if (paso === 'exito') return (
    <div style={{minHeight:'100vh',background:'#060F1E',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{maxWidth:'520px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'72px',marginBottom:'1rem'}}>🎉</div>
        <h1 style={{fontSize:'32px',fontWeight:'900',color:'white',margin:'0 0 12px',letterSpacing:'-1px'}}>¡Bienvenido a LaborixX!</h1>
        <p style={{fontSize:'16px',color:'rgba(255,255,255,0.5)',margin:'0 0 2rem',lineHeight:'1.7'}}>
          Tu cuenta fue creada. Tienes <strong style={{color:'#00c8ff'}}>15 días de prueba gratuita</strong> para explorar la plataforma.
        </p>
        {trialFin && (
          <div style={{background:'rgba(255,255,255,0.05)',borderRadius:'12px',padding:'1rem',marginBottom:'2rem',border:'1px solid rgba(255,255,255,0.1)'}}>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'13px',margin:0}}>Tu prueba gratuita vence el</p>
            <p style={{color:'white',fontSize:'20px',fontWeight:'700',margin:'4px 0 0'}}>{new Date(trialFin).toLocaleDateString('es-CL',{day:'numeric',month:'long',year:'numeric'})}</p>
          </div>
        )}
        <a href="https://gc-gestion.online" style={{display:'block',padding:'16px',background:'linear-gradient(135deg,#1A56DB,#0EA5E9)',color:'white',borderRadius:'12px',textDecoration:'none',fontSize:'16px',fontWeight:'700',marginBottom:'12px',boxShadow:'0 8px 24px rgba(26,86,219,0.4)'}}>
          🚀 Ingresar a LaborixX
        </a>
        <p style={{fontSize:'13px',color:'rgba(255,255,255,0.3)'}}>Ingresa con tu email y contraseña.</p>
      </div>
    </div>
  );

  if (paso === 'registro') return (
    <div style={{minHeight:'100vh',background:'#060F1E',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{maxWidth:'480px',width:'100%'}}>
        <button onClick={()=>setPaso('landing')} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'14px',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'6px'}}>
          ← Volver
        </button>
        <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'20px',padding:'2rem'}}>
          <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <div style={{fontSize:'32px',fontWeight:'900',color:'white',marginBottom:'8px'}}>Labori<span style={{color:'#00c8ff'}}>X</span></div>
            <h2 style={{fontSize:'22px',fontWeight:'800',color:'white',margin:'0 0 8px'}}>Crear cuenta gratis</h2>
            <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',margin:0}}>15 días de prueba — sin tarjeta de crédito</p>
          </div>
          <form onSubmit={registrar} style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            {[
              {key:'nombre',label:'Nombre completo',ph:'Juan González',type:'text',req:true},
              {key:'email',label:'Email de trabajo',ph:'juan@empresa.cl',type:'email',req:true},
              {key:'rut',label:'RUT (opcional)',ph:'12.345.678-9',type:'text'},
              {key:'password',label:'Contraseña',ph:'Mínimo 8 caracteres',type:'password',req:true},
              {key:'confirmar',label:'Confirmar contraseña',ph:'Repite tu contraseña',type:'password',req:true},
            ].map(f => (
              <div key={f.key}>
                <label style={{fontSize:'12px',fontWeight:'600',color:'rgba(255,255,255,0.6)',display:'block',marginBottom:'6px'}}>{f.label}</label>
                <input type={f.type} required={f.req} placeholder={f.ph}
                  value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                  style={{width:'100%',height:'44px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.1)',padding:'0 14px',fontSize:'14px',outline:'none',background:'rgba(255,255,255,0.05)',color:'white',boxSizing:'border-box'}}
                />
              </div>
            ))}
            {error && <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#EF4444'}}>{error}</div>}
            <button type="submit" disabled={cargando} style={{height:'48px',background:'linear-gradient(135deg,#1A56DB,#0EA5E9)',color:'white',border:'none',borderRadius:'12px',fontSize:'15px',fontWeight:'700',cursor:cargando?'not-allowed':'pointer',opacity:cargando?0.7:1,marginTop:'8px',boxShadow:'0 4px 16px rgba(26,86,219,0.4)'}}>
              {cargando ? '⏳ Creando cuenta...' : '🚀 Comenzar prueba gratis'}
            </button>
            <p style={{fontSize:'12px',color:'rgba(255,255,255,0.3)',textAlign:'center',margin:0}}>
              Al crear tu cuenta aceptas nuestros <a href="/terminos" style={{color:'#00c8ff'}}>Términos de uso</a> y <a href="/privacidad" style={{color:'#00c8ff'}}>Política de privacidad</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",overflowX:'hidden'}}>

      {/* NAVBAR */}
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,background:'rgba(6,15,30,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 2rem',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:'22px',fontWeight:'900',color:'white',letterSpacing:'-0.5px'}}>
            Labori<span style={{color:'#00c8ff'}}>X</span>
          </div>
          <div style={{display:'flex',gap:'1.5rem',alignItems:'center'}}>
            {[['#modulos','Módulos'],['#antes-despues','¿Por qué?'],['#planes','Planes'],['#roadmap','Roadmap']].map(([h,l])=>(
              <a key={h} href={h} style={{color:'rgba(255,255,255,0.5)',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>{l}</a>
            ))}
            <a href="https://gc-gestion.online" style={{height:'36px',padding:'0 16px',background:'rgba(255,255,255,0.08)',color:'white',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',fontSize:'13px',fontWeight:'500',textDecoration:'none',display:'flex',alignItems:'center'}}>
              Iniciar sesión
            </a>
            <button onClick={()=>setPaso('registro')} style={{height:'36px',padding:'0 16px',background:'linear-gradient(135deg,#1A56DB,#0EA5E9)',color:'white',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer',boxShadow:'0 2px 10px rgba(26,86,219,0.4)'}}>
              Comenzar gratis
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(135deg,#060F1E 0%,#0C1A3A 50%,#060F1E 100%)',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'8rem 2rem 4rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-20%',right:'-10%',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(26,86,219,0.15) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',bottom:'-20%',left:'-10%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,200,255,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{maxWidth:'900px',position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'20px',padding:'6px 16px',marginBottom:'2rem'}}>
            <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#10B981'}}/>
            <span style={{fontSize:'12px',color:'#6EE7B7',fontWeight:'600'}}>Plataforma activa · Normativa chilena · 🇨🇱</span>
          </div>
          <h1 style={{fontSize:'clamp(38px,6vw,76px)',fontWeight:'900',color:'white',margin:'0 0 1.5rem',lineHeight:'1.05',letterSpacing:'-3px'}}>
            Todo lo que hoy haces<br/><span style={{color:'#00c8ff'}}>manualmente,</span><br/>LaborixX lo automatiza.
          </h1>
          <p style={{fontSize:'clamp(16px,2vw,20px)',color:'rgba(255,255,255,0.5)',margin:'0 0 1rem',lineHeight:'1.7',maxWidth:'700px',marginLeft:'auto',marginRight:'auto'}}>
            Contratos, trabajadores, remuneraciones, documentos laborales, cobranza, pagos online y automatizaciones para empresas y oficinas contables en Chile.
          </p>
          <p style={{fontSize:'18px',fontWeight:'700',color:'rgba(255,255,255,0.8)',margin:'0 0 3rem',fontStyle:'italic'}}>
            "Administra. Automatiza. Cobra. Crece."
          </p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={()=>setPaso('registro')} style={{height:'56px',padding:'0 40px',background:'linear-gradient(135deg,#1A56DB,#0EA5E9)',color:'white',border:'none',borderRadius:'14px',fontSize:'17px',fontWeight:'800',cursor:'pointer',boxShadow:'0 8px 32px rgba(26,86,219,0.5)',display:'inline-flex',alignItems:'center',gap:'8px'}}>
              🚀 Comenzar ahora
            </button>
            <a href="#modulos" style={{height:'56px',padding:'0 32px',background:'rgba(255,255,255,0.06)',color:'white',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',fontSize:'16px',fontWeight:'500',textDecoration:'none',display:'inline-flex',alignItems:'center'}}>
              Ver módulos →
            </a>
          </div>
          <div style={{display:'flex',gap:'3rem',justifyContent:'center',marginTop:'5rem',flexWrap:'wrap'}}>
            {[['6','Módulos disponibles'],['15 días','Prueba gratuita'],['100%','Normativa chilena'],['IA','Cobranza inteligente']].map(([n,l])=>(
              <div key={n} style={{textAlign:'center'}}>
                <div style={{fontSize:'28px',fontWeight:'900',color:'#00c8ff'}}>{n}</div>
                <div style={{fontSize:'13px',color:'rgba(255,255,255,0.3)',marginTop:'4px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANTES VS DESPUES */}
      <section id="antes-despues" style={{padding:'6rem 2rem',background:'#F8FAFC'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'#0C1A2E',margin:'0 0 1rem',letterSpacing:'-1px'}}>¿Por qué LaborixX?</h2>
            <p style={{fontSize:'18px',color:'#6B7280',margin:0}}>Menos planillas. Menos errores. Menos tiempo perdido. Más control.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
            <div style={{background:'#FEF2F2',border:'2px solid #FECACA',borderRadius:'20px',padding:'2rem'}}>
              <div style={{fontSize:'14px',fontWeight:'700',color:'#DC2626',marginBottom:'1.5rem',letterSpacing:'0.1em'}}>❌ ANTES</div>
              {['Word y Excel para cada documento','WhatsApp para cobrar','Planillas de remuneraciones manuales','Recordatorios por correo','Documentos sueltos sin respaldo','Cobranzas desordenadas','Tiempo perdido en tareas repetitivas'].map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 0',borderBottom:'1px solid rgba(220,38,38,0.1)',fontSize:'14px',color:'#374151'}}>
                  <span style={{color:'#DC2626',fontSize:'16px'}}>✗</span>{t}
                </div>
              ))}
            </div>
            <div style={{background:'linear-gradient(135deg,#060F1E,#0C1A3A)',border:'2px solid rgba(0,200,255,0.3)',borderRadius:'20px',padding:'2rem'}}>
              <div style={{fontSize:'14px',fontWeight:'700',color:'#00c8ff',marginBottom:'1.5rem',letterSpacing:'0.1em'}}>✅ CON LABORIX</div>
              {['Contratos automáticos en segundos','Cobranza automática con IA y WhatsApp','Liquidaciones calculadas y validadas','Flujos automáticos programados','Todo centralizado y con respaldo','Cartera de cobranza en tiempo real','Más tiempo para lo que importa'].map(t=>(
                <div key={t} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 0',borderBottom:'1px solid rgba(0,200,255,0.1)',fontSize:'14px',color:'rgba(255,255,255,0.8)'}}>
                  <span style={{color:'#10B981',fontSize:'16px'}}>✓</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section style={{padding:'6rem 2rem',background:'#060F1E'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'white',margin:'0 0 1rem',letterSpacing:'-1px'}}>La plataforma chilena para empresas que quieren trabajar<br/><span style={{color:'#00c8ff'}}>menos manual y más inteligente</span></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem'}}>
            {[
              {icon:'⏱️',titulo:'Ahorra tiempo',desc:'Documentos y procesos que antes tomaban horas, ahora se generan en minutos.',color:'#1A56DB'},
              {icon:'🎯',titulo:'Evita errores',desc:'Datos centralizados, cálculos automatizados y documentos consistentes.',color:'#10B981'},
              {icon:'💸',titulo:'Cobra más rápido',desc:'Flujos automáticos, WhatsApp, email y links de pago para recuperar dinero.',color:'#F59E0B'},
              {icon:'🇨🇱',titulo:'Cumple con Chile',desc:'Diseñado para empresas, contadores y RRHH bajo normativa laboral chilena.',color:'#EF4444'},
              {icon:'📈',titulo:'Crece por módulos',desc:'Activa solo lo que necesitas y escala cuando tu empresa crezca.',color:'#8B5CF6'},
            ].map(b=>(
              <div key={b.titulo} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'16px',padding:'1.5rem'}}>
                <div style={{width:'48px',height:'48px',borderRadius:'12px',background:b.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',marginBottom:'1rem'}}>{b.icon}</div>
                <h3 style={{fontSize:'16px',fontWeight:'700',color:'white',margin:'0 0 8px'}}>{b.titulo}</h3>
                <p style={{fontSize:'13px',color:'rgba(255,255,255,0.4)',margin:0,lineHeight:'1.7'}}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULOS */}
      <section id="modulos" style={{padding:'6rem 2rem',background:'#F8FAFC'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'#0C1A2E',margin:'0 0 1rem',letterSpacing:'-1px'}}>Centraliza tu gestión en un solo lugar</h2>
            <p style={{fontSize:'18px',color:'#6B7280',margin:0}}>Tu empresa en orden, tu cobranza en movimiento.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
            {MODULOS.map((m,i)=>(
              <div key={m.id} style={{background:'white',borderRadius:'20px',padding:'2rem',border:'1px solid #E5E7EB',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',alignItems:'start',opacity:m.pronto?0.75:1}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1rem'}}>
                    <div style={{width:'48px',height:'48px',borderRadius:'12px',background:m.grad,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',boxShadow:'0 4px 14px '+m.color+'40'}}>{m.icono}</div>
                    <div>
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <h3 style={{fontSize:'18px',fontWeight:'800',color:'#0C1A2E',margin:0}}>{m.nombre}</h3>
                        <span style={{fontSize:'10px',fontWeight:'700',padding:'2px 8px',borderRadius:'10px',background:m.badgeColor+'20',color:m.badgeColor,border:'1px solid '+m.badgeColor+'40'}}>{m.badge}</span>
                      </div>
                      {m.addon && <div style={{fontSize:'12px',color:m.color,fontWeight:'600',marginTop:'2px'}}>{m.precio} · <span style={{color:'#EF4444'}}>{m.descuento} primeros 6 meses</span></div>}
                    </div>
                  </div>
                  <p style={{fontSize:'14px',color:'#6B7280',lineHeight:'1.7',margin:'0 0 1rem'}}>{m.desc}</p>
                  {!m.pronto && (
                    <button onClick={()=>setPaso('registro')} style={{height:'40px',padding:'0 20px',background:m.grad,border:'none',borderRadius:'10px',color:'white',fontSize:'13px',fontWeight:'700',cursor:'pointer',boxShadow:'0 4px 12px '+m.color+'30'}}>
                      {m.addon ? 'Activar módulo →' : 'Comenzar gratis →'}
                    </button>
                  )}
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
                  {m.funciones.map(f=>(
                    <span key={f} style={{fontSize:'12px',padding:'4px 10px',borderRadius:'20px',background:m.color+'10',color:m.color,fontWeight:'500',border:'1px solid '+m.color+'20'}}>{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LABORIX TALK */}
      <section style={{padding:'6rem 2rem',background:'linear-gradient(135deg,#060F1E,#0C1A3A)'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto',textAlign:'center'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(0,200,255,0.1)',border:'1px solid rgba(0,200,255,0.2)',borderRadius:'20px',padding:'4px 14px',fontSize:'11px',color:'#00c8ff',fontWeight:'600',marginBottom:'2rem',letterSpacing:'0.05em'}}>
            ⚡ INTELIGENCIA ARTIFICIAL
          </div>
          <h2 style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:'900',color:'white',margin:'0 0 1rem',letterSpacing:'-1px'}}>LaborixX Talk</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.5)',margin:'0 0 3rem',lineHeight:'1.7',maxWidth:'600px',marginLeft:'auto',marginRight:'auto'}}>
            IA entrenada para cobranza en Chile. Responde automáticamente por WhatsApp, entiende el estado de deuda y escala conversaciones cuando sea necesario.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',marginBottom:'3rem'}}>
            {[
              {icon:'🕐',titulo:'Respuesta 24/7',desc:'Nunca deja sin responder a un deudor'},
              {icon:'🧠',titulo:'Entrenada para cobrar',desc:'Conoce el contexto de cada cliente'},
              {icon:'🔗',titulo:'Integrada al sistema',desc:'Ve saldos, vencimientos y convenios'},
              {icon:'📉',titulo:'Reduce tiempo operativo',desc:'Automatiza el 80% de las gestiones'},
            ].map(t=>(
              <div key={t.titulo} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'1.5rem'}}>
                <div style={{fontSize:'32px',marginBottom:'12px'}}>{t.icon}</div>
                <div style={{fontSize:'14px',fontWeight:'700',color:'white',marginBottom:'6px'}}>{t.titulo}</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',lineHeight:'1.6'}}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DT PROXIMAMENTE */}
      <section style={{padding:'4rem 2rem',background:'#F8FAFC'}}>
        <div style={{maxWidth:'800px',margin:'0 auto'}}>
          <div style={{background:'white',border:'2px dashed #E5E7EB',borderRadius:'20px',padding:'2rem',display:'flex',alignItems:'center',gap:'2rem',flexWrap:'wrap'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'14px',background:'linear-gradient(135deg,#1A56DB20,#0EA5E920)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',flexShrink:0}}>🏛️</div>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <h3 style={{fontSize:'18px',fontWeight:'800',color:'#0C1A2E',margin:0}}>Registro automático en la DT</h3>
                <span style={{fontSize:'10px',fontWeight:'700',padding:'2px 10px',borderRadius:'10px',background:'#FEF3C7',color:'#D97706',border:'1px solid #FDE68A'}}>PRÓXIMAMENTE</span>
              </div>
              <p style={{fontSize:'14px',color:'#6B7280',margin:0,lineHeight:'1.6'}}>
                Estamos desarrollando la automatización para registrar contratos en la Dirección del Trabajo sin salir de LaborixX.
              </p>
            </div>
            <span style={{fontSize:'12px',color:'#9CA3AF',fontWeight:'600',background:'#F3F4F6',padding:'6px 14px',borderRadius:'20px',flexShrink:0}}>Roadmap 2026</span>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section id="planes" style={{padding:'6rem 2rem',background:'#060F1E'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'white',margin:'0 0 1rem',letterSpacing:'-1px'}}>Activa solo lo que necesitas</h2>
            <p style={{fontSize:'18px',color:'rgba(255,255,255,0.4)',margin:0}}>Modelo modular. Paga por módulo. Escala cuando quieras.</p>
          </div>
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'20px',overflow:'hidden',marginBottom:'2rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',background:'rgba(255,255,255,0.05)',padding:'1rem 1.5rem',gap:'1rem'}}>
              {['Módulo','Esencial','Profesional','Enterprise'].map((h,i)=>(
                <div key={h} style={{fontSize:'12px',fontWeight:'700',color:i===0?'rgba(255,255,255,0.5)':'white',letterSpacing:'0.05em',textAlign:i>0?'center':'left'}}>{h}</div>
              ))}
            </div>
            {PLANES_MODULOS.map((p,i)=>(
              <div key={p.modulo} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',padding:'1rem 1.5rem',gap:'1rem',borderTop:'1px solid rgba(255,255,255,0.05)',background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
                <div style={{fontSize:'13px',fontWeight:'600',color:'white'}}>{p.modulo}</div>
                {[p.esencial,p.profesional,p.enterprise].map((v,j)=>(
                  <div key={j} style={{fontSize:'12px',color:v==='—'?'rgba(255,255,255,0.2)':'#00c8ff',textAlign:'center',fontWeight:v!=='—'?'600':'400'}}>{v}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{background:'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(239,68,68,0.1))',border:'1px solid rgba(245,158,11,0.3)',borderRadius:'16px',padding:'1.5rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem',marginBottom:'2rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
              <div style={{background:'linear-gradient(135deg,#F59E0B,#EF4444)',borderRadius:'10px',padding:'8px 14px',fontSize:'18px',fontWeight:'900',color:'white'}}>40% OFF</div>
              <div>
                <div style={{fontSize:'14px',fontWeight:'700',color:'#FCD34D'}}>Oferta de lanzamiento — Junio y Julio 2026</div>
                <div style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>Módulo Cobranza Inteligente con 40% de descuento durante 6 meses</div>
              </div>
            </div>
            <button onClick={()=>setPaso('registro')} style={{height:'40px',padding:'0 20px',background:'linear-gradient(135deg,#F59E0B,#EF4444)',border:'none',borderRadius:'10px',color:'white',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>
              Aprovechar oferta →
            </button>
          </div>
          <p style={{textAlign:'center',color:'rgba(255,255,255,0.3)',fontSize:'13px'}}>Todos los módulos incluyen 15 días de prueba gratis · Máximo 3 editores + 15 visores · Precios en UF + IVA</p>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" style={{padding:'6rem 2rem',background:'#F8FAFC'}}>
        <div style={{maxWidth:'900px',margin:'0 auto',textAlign:'center'}}>
          <h2 style={{fontSize:'clamp(28px,4vw,44px)',fontWeight:'900',color:'#0C1A2E',margin:'0 0 1rem',letterSpacing:'-1px'}}>Un ecosistema en crecimiento</h2>
          <p style={{fontSize:'18px',color:'#6B7280',margin:'0 0 4rem'}}>Seguimos construyendo para automatizar todo lo que necesitas.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem',textAlign:'left'}}>
            <div style={{background:'white',borderRadius:'20px',padding:'2rem',border:'1px solid #E5E7EB'}}>
              <div style={{fontSize:'13px',fontWeight:'700',color:'#10B981',marginBottom:'1.5rem',letterSpacing:'0.1em'}}>✅ DISPONIBLE AHORA</div>
              {['Gestión Laboral Integral','Contratos y Anexos','Certificados','Licencias médicas','Finiquitos','Remuneraciones','Previred y LRE','Cobranza Inteligente','WhatsApp y email automático','Mercado Pago','LaborixX Talk IA','Portal del deudor'].map(f=>(
                <div key={f} style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 0',borderBottom:'1px solid #F3F4F6',fontSize:'13px',color:'#374151'}}>
                  <span style={{color:'#10B981'}}>✓</span>{f}
                </div>
              ))}
            </div>
            <div style={{background:'#0C1A2E',borderRadius:'20px',padding:'2rem'}}>
              <div style={{fontSize:'13px',fontWeight:'700',color:'#00c8ff',marginBottom:'1.5rem',letterSpacing:'0.1em'}}>🔧 PRÓXIMAMENTE</div>
              {['Envío automático a la DT','Robot DT completo','Facturación electrónica','Contabilidad Express','Tributaria','Activos fijos','Despacho Contable','Firma electrónica avanzada','Más automatizaciones con IA'].map(f=>(
                <div key={f} style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'13px',color:'rgba(255,255,255,0.6)'}}>
                  <span style={{color:'#00c8ff'}}>◌</span>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:'6rem 2rem',background:'#060F1E'}}>
        <div style={{maxWidth:'720px',margin:'0 auto'}}>
          <h2 style={{fontSize:'36px',fontWeight:'900',color:'white',textAlign:'center',margin:'0 0 3rem',letterSpacing:'-1px'}}>Preguntas frecuentes</h2>
          {[
            ['¿Necesito tarjeta de crédito para la prueba?','No. Los 15 días de prueba son completamente gratuitos y no requieren ningún dato de pago.'],
            ['¿Cómo funciona el modelo de precios?','Pagas solo por los módulos que activas. Cada módulo tiene tramos Esencial, Profesional y Enterprise según la cantidad de empresas que gestionas.'],
            ['¿Qué pasa cuando termina la prueba?','Al vencer el trial, podrás elegir los módulos que quieres activar y pagar solo por ellos. Sin sorpresas.'],
            ['¿Puedo cambiar de módulos?','Sí, puedes activar o desactivar módulos en cualquier momento desde tu cuenta.'],
            ['¿Los documentos tienen validez legal?','Los documentos siguen los formatos del Código del Trabajo chileno. Deben ser firmados por las partes para tener validez legal.'],
            ['¿Cómo funciona el cobro?','El cobro es mensual en pesos chilenos, calculado sobre el valor de la UF del primer día de cada mes. Puedes cancelar cuando quieras.'],
          ].map(([p,r])=>(
            <details key={p} style={{background:'rgba(255,255,255,0.04)',borderRadius:'12px',padding:'1.25rem 1.5rem',marginBottom:'1rem',border:'1px solid rgba(255,255,255,0.08)',cursor:'pointer'}}>
              <summary style={{fontSize:'15px',fontWeight:'600',color:'white',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                {p} <span style={{color:'rgba(255,255,255,0.4)'}}>+</span>
              </summary>
              <p style={{fontSize:'14px',color:'rgba(255,255,255,0.5)',margin:'1rem 0 0',lineHeight:'1.6'}}>{r}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{padding:'6rem 2rem',background:'linear-gradient(135deg,#060F1E,#0C1A3A)',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'600px',height:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(26,86,219,0.15) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <h2 style={{fontSize:'clamp(28px,4vw,52px)',fontWeight:'900',color:'white',margin:'0 0 1rem',letterSpacing:'-1.5px'}}>Empieza a automatizar<br/>tu empresa hoy</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.5)',margin:'0 0 2rem',lineHeight:'1.7',maxWidth:'600px',marginLeft:'auto',marginRight:'auto'}}>
            Activa LaborixX y transforma la forma en que gestionas trabajadores, documentos, remuneraciones y cobranza.
          </p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={()=>setPaso('registro')} style={{height:'56px',padding:'0 40px',background:'linear-gradient(135deg,#1A56DB,#0EA5E9)',color:'white',border:'none',borderRadius:'14px',fontSize:'17px',fontWeight:'800',cursor:'pointer',boxShadow:'0 8px 32px rgba(26,86,219,0.5)'}}>
              🚀 Solicitar demo
            </button>
            <a href="#planes" style={{height:'56px',padding:'0 32px',background:'rgba(255,255,255,0.06)',color:'white',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'14px',fontSize:'16px',fontWeight:'500',textDecoration:'none',display:'inline-flex',alignItems:'center'}}>
              Ver planes →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:'#030810',padding:'3rem 2rem',borderTop:'1px solid rgba(255,255,255,0.04)'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <div style={{fontSize:'20px',fontWeight:'900',color:'white'}}>Labori<span style={{color:'#00c8ff'}}>X</span></div>
          <div style={{display:'flex',gap:'2rem',flexWrap:'wrap'}}>
            <a href="/terminos" style={{color:'rgba(255,255,255,0.3)',fontSize:'13px',textDecoration:'none'}}>Términos de uso</a>
            <a href="/privacidad" style={{color:'rgba(255,255,255,0.3)',fontSize:'13px',textDecoration:'none'}}>Privacidad</a>
            <a href="mailto:contacto@labori.cl" style={{color:'rgba(255,255,255,0.3)',fontSize:'13px',textDecoration:'none'}}>contacto@labori.cl</a>
          </div>
          <p style={{color:'rgba(255,255,255,0.15)',fontSize:'12px',margin:0}}>© 2026 LaborixX · Plataforma integral · 🇨🇱 Chile</p>
        </div>
      </footer>
    </div>
  );
}
