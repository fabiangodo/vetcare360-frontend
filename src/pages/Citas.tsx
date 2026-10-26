import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import type { UserRole } from '../App';

interface CitasProps {
  role: UserRole;
}

interface Cita {
  id: number;
  mascota: string;
  propietario: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

export const Citas: React.FC<CitasProps> = ({ role }) => {
  const [citas, setCitas] = useState<Cita[]>([
    { id: 1, mascota: 'Max', propietario: 'Carlos Pérez', fecha: '2026-10-27', hora: '10:00 AM', motivo: 'Vacunación Octuple', estado: 'Confirmada' },
    { id: 2, mascota: 'Luna', propietario: 'Carlos Pérez', fecha: '2026-10-27', hora: '11:30 AM', motivo: 'Control General', estado: 'Pendiente' },
    { id: 3, mascota: 'Rocky', propietario: 'Juan Tapia', fecha: '2026-10-28', hora: '03:00 PM', motivo: 'Limpieza Dental', estado: 'Confirmada' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    mascota: '',
    propietario: '',
    fecha: '',
    hora: '',
    motivo: '',
    estado: 'Pendiente' as const
  });

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCita.mascota || !nuevaCita.fecha || !nuevaCita.hora) return;

    const item: Cita = {
      id: Date.now(),
      ...nuevaCita,
      propietario: role === 'cliente' ? 'Carlos Pérez (Tú)' : nuevaCita.propietario
    };

    setCitas([...citas, item]);
    setNuevaCita({ mascota: '', propietario: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente' });
    setShowModal(false);
  };

  const handleEliminarCita = (id: number) => {
    if (role !== 'editor') return;
    setCitas(citas.filter(c => c.id !== id));
  };

  const listaCitas = role === 'cliente'
    ? citas.filter(c => c.propietario.includes('Carlos'))
    : citas;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
          {role === 'cliente' 
            ? 'Histórico de citas de tus mascotas' 
            : role === 'editor'
            ? 'Gestión clínica exclusiva: Puedes agendar y cancelar citas médicas.'
            : 'Gestión de agenda clínica'}
        </p>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.63rem 1.2rem',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          {role === 'cliente' ? 'Solicitar Cita' : 'Agendar Cita'}
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Mascota / Dueño</th>
              <th style={{ padding: '1rem' }}>Fecha</th>
              <th style={{ padding: '1rem' }}>Hora</th>
              <th style={{ padding: '1rem' }}>Motivo</th>
              <th style={{ padding: '1rem' }}>Estado</th>
              {role === 'editor' && <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones (Solo Editor)</th>}
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.9rem', color: '#334155' }}>
            {listaCitas.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{c.mascota}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.propietario}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
                    <CalendarIcon size={14} color="#10b981" />
                    {c.fecha}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', color: '#0284c7' }}>
                    <Clock size={14} />
                    {c.hora}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{c.motivo}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      backgroundColor: c.estado === 'Confirmada' ? '#dcfce7' : '#fef3c7',
                      color: c.estado === 'Confirmada' ? '#15803d' : '#b45309',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {c.estado === 'Confirmada' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {c.estado}
                  </span>
                </td>
                {role === 'editor' && (
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleEliminarCita(c.id)}
                      title="Eliminar Cita (Solo Editor)"
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.4rem 0.8rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Trash2 size={14} />
                      Cancelar Cita
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1.75rem', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>
              {role === 'cliente' ? 'Solicitar Cita Médica' : 'Agendar Nueva Cita'}
            </h3>
            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Mascota</label>
                <input required type="text" value={nuevaCita.mascota} onChange={e => setNuevaCita({...nuevaCita, mascota: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              {role !== 'cliente' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Propietario</label>
                  <input required type="text" value={nuevaCita.propietario} onChange={e => setNuevaCita({...nuevaCita, propietario: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Fecha</label>
                <input required type="date" value={nuevaCita.fecha} onChange={e => setNuevaCita({...nuevaCita, fecha: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Hora preferida</label>
                <input required type="text" placeholder="Ej: 10:30 AM" value={nuevaCita.hora} onChange={e => setNuevaCita({...nuevaCita, hora: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Motivo de consulta</label>
                <input type="text" value={nuevaCita.motivo} onChange={e => setNuevaCita({...nuevaCita, motivo: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: '700' }}>Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};