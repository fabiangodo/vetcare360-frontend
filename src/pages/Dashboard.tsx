import React from 'react';
import { Dog, Users, Calendar, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Pacientes Registrados', value: '124', icon: Dog, color: '#3b82f6' },
    { title: 'Citas Hoy', value: '8', icon: Calendar, color: '#10b981' },
    { title: 'Propietarios', value: '89', icon: Users, color: '#8b5cf6' },
    { title: 'Atenciones del Mes', value: '45', icon: Activity, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Tarjetas de Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>{stat.title}</p>
                <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.75rem', color: '#0f172a', fontWeight: 'bold' }}>
                  {stat.value}
                </h3>
              </div>
              <div
                style={{
                  backgroundColor: `${stat.color}15`,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Icon size={28} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Próximas Citas */}
      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a' }}>Próximas Citas Médicas</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem' }}>
              <th style={{ padding: '0.75rem 0' }}>Mascota</th>
              <th style={{ padding: '0.75rem 0' }}>Propietario</th>
              <th style={{ padding: '0.75rem 0' }}>Hora</th>
              <th style={{ padding: '0.75rem 0' }}>Motivo</th>
              <th style={{ padding: '0.75rem 0' }}>Estado</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.9rem', color: '#334155' }}>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.85rem 0', fontWeight: '600' }}>Max (Golden Retriever)</td>
              <td>Carlos Pérez</td>
              <td>10:00 AM</td>
              <td>Vacunación Anual</td>
              <td><span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Confirmada</span></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.85rem 0', fontWeight: '600' }}>Luna (Siamés)</td>
              <td>María Gómez</td>
              <td>11:30 AM</td>
              <td>Control General</td>
              <td><span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Pendiente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};