import React from 'react';
import { Dog, Users, Calendar, TrendingUp, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Pacientes Activos', value: '124', change: '+12% este mes', icon: Dog, color: '#10b981', bg: '#ecfdf5' },
    { title: 'Citas Para Hoy', value: '8', change: '2 pendientes', icon: Calendar, color: '#0284c7', bg: '#f0f9ff' },
    { title: 'Clientes / Dueños', value: '89', change: '+5 nuevos', icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
    { title: 'Atenciones del Mes', value: '142', change: 'Récord mensual', icon: TrendingUp, color: '#f59e0b', bg: '#fffbeb' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Banner de Bienvenida */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        padding: '2rem',
        borderRadius: '20px',
        color: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={18} color="#a7f3d0" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#a7f3d0', letterSpacing: '0.5px' }}>PANEL DE CONTROL VETERINARIO</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>¡Hola! Todo listo para las consultas de hoy</h2>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>Tienes 8 citas agendadas y 3 controles médicos programados.</p>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b', fontWeight: '600' }}>{stat.title}</p>
                  <h3 style={{ margin: '0.4rem 0 0 0', fontSize: '1.85rem', color: '#0f172a', fontWeight: '800' }}>
                    {stat.value}
                  </h3>
                </div>
                <div style={{ backgroundColor: stat.bg, padding: '0.8rem', borderRadius: '12px', color: stat.color }}>
                  <Icon size={24} />
                </div>
              </div>
              <span style={{ marginTop: '1rem', fontSize: '0.75rem', fontWeight: '600', color: stat.color }}>
                {stat.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Próximas Citas */}
      <div style={{ backgroundColor: '#fff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>Próximos Pacientes</h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Agenda del día en tiempo real</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Mascota</th>
                <th style={{ padding: '0.75rem 1rem' }}>Propietario</th>
                <th style={{ padding: '0.75rem 1rem' }}>Hora</th>
                <th style={{ padding: '0.75rem 1rem' }}>Motivo</th>
                <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.9rem', color: '#334155' }}>
              <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    🐶 Max <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>(Golden)</span>
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>Carlos Pérez</td>
                <td style={{ padding: '1rem', fontWeight: '600' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7' }}>
                    <Clock size={14} /> 10:00 AM
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>Vacunación Octuple</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={13} /> Confirmada
                  </span>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    🐱 Luna <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>(Siamés)</span>
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#475569' }}>María Gómez</td>
                <td style={{ padding: '1rem', fontWeight: '600' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0284c7' }}>
                    <Clock size={14} /> 11:30 AM
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>Control Sanitario</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> Por confirmar
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};