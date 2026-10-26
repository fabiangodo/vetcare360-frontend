import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Cita {
  id: number;
  mascota: string;
  propietario: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

export const Citas: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([
    { id: 1, mascota: 'Max', propietario: 'Carlos Pérez', fecha: '2026-10-27', hora: '10:00 AM', motivo: 'Vacunación Anual', estado: 'Confirmada' },
    { id: 2, mascota: 'Luna', propietario: 'María Gómez', fecha: '2026-10-27', hora: '11:30 AM', motivo: 'Control General', estado: 'Pendiente' },
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
      ...nuevaCita
    };

    setCitas([...citas, item]);
    setNuevaCita({ mascota: '', propietario: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente' });
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Botón Nueva Cita */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Agendar Cita
        </button>
      </div>

      {/* Tabla de Citas */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Mascota / Dueño</th>
              <th style={{ padding: '1rem' }}>Fecha</th>
              <th style={{ padding: '1rem' }}>Hora</th>
              <th style={{ padding: '1rem' }}>Motivo</th>
              <th style={{ padding: '1rem' }}>Estado</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.9rem', color: '#334155' }}>
            {citas.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '600' }}>{c.mascota}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.propietario}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CalendarIcon size={14} color="#64748b" />
                    {c.fecha}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="#64748b" />
                    {c.hora}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{c.motivo}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      backgroundColor: c.estado === 'Confirmada' ? '#dcfce7' : '#fef3c7',
                      color: c.estado === 'Confirmada' ? '#15803d' : '#b45309',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {c.estado === 'Confirmada' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {c.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agendar Cita */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>Agendar Nueva Cita</h3>
            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Mascota</label>
                <input required type="text" value={nuevaCita.mascota} onChange={e => setNuevaCita({...nuevaCita, mascota: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Propietario</label>
                <input required type="text" value={nuevaCita.propietario} onChange={e => setNuevaCita({...nuevaCita, propietario: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Fecha</label>
                <input required type="date" value={nuevaCita.fecha} onChange={e => setNuevaCita({...nuevaCita, fecha: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Hora</label>
                <input required type="text" placeholder="Ej: 10:30 AM" value={nuevaCita.hora} onChange={e => setNuevaCita({...nuevaCita, hora: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Motivo de consulta</label>
                <input type="text" value={nuevaCita.motivo} onChange={e => setNuevaCita({...nuevaCita, motivo: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Agendar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};