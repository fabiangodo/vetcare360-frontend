import React, { useState } from 'react';
import { Plus, Search, Dog, Cat, Trash2, Edit } from 'lucide-react';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  propietario: string;
}

export const Mascotas: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([
    { id: 1, nombre: 'Max', especie: 'Perro', raza: 'Golden Retriever', edad: 3, propietario: 'Carlos Pérez' },
    { id: 2, nombre: 'Luna', especie: 'Gato', raza: 'Siamés', edad: 2, propietario: 'María Gómez' },
    { id: 3, nombre: 'Rocky', especie: 'Perro', raza: 'Bulldog Francés', edad: 4, propietario: 'Juan Tapia' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: '',
    especie: 'Perro',
    raza: '',
    edad: '',
    propietario: ''
  });

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaMascota.nombre || !nuevaMascota.propietario) return;

    const item: Mascota = {
      id: Date.now(),
      nombre: nuevaMascota.nombre,
      especie: nuevaMascota.especie,
      raza: nuevaMascota.raza,
      edad: Number(nuevaMascota.edad) || 0,
      propietario: nuevaMascota.propietario
    };

    setMascotas([...mascotas, item]);
    setNuevaMascota({ nombre: '', especie: 'Perro', raza: '', edad: '', propietario: '' });
    setShowModal(false);
  };

  const filteredMascotas = mascotas.filter(m =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controles: Búsqueda y Botón Nuevo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.5rem 0.75rem', width: '300px' }}>
          <Search size={18} color="#94a3b8" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Buscar por mascota o dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          />
        </div>

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
          Registrar Mascota
        </button>
      </div>

      {/* Tabla de Mascotas */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Mascota</th>
              <th style={{ padding: '1rem' }}>Especie / Raza</th>
              <th style={{ padding: '1rem' }}>Edad</th>
              <th style={{ padding: '1rem' }}>Propietario</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.9rem', color: '#334155' }}>
            {filteredMascotas.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {m.especie === 'Perro' ? <Dog size={18} color="#0284c7" /> : <Cat size={18} color="#e11d48" />}
                  {m.nombre}
                </td>
                <td style={{ padding: '1rem' }}>{m.especie} - {m.raza}</td>
                <td style={{ padding: '1rem' }}>{m.edad} año(s)</td>
                <td style={{ padding: '1rem' }}>{m.propietario}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', marginRight: '0.5rem' }}><Edit size={16} /></button>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Mascota */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginTop: 0, color: '#0f172a' }}>Nuevo Paciente</h3>
            <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Nombre Mascota</label>
                <input required type="text" value={nuevaMascota.nombre} onChange={e => setNuevaMascota({...nuevaMascota, nombre: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Especie</label>
                <select value={nuevaMascota.especie} onChange={e => setNuevaMascota({...nuevaMascota, especie: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }}>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Raza</label>
                <input type="text" value={nuevaMascota.raza} onChange={e => setNuevaMascota({...nuevaMascota, raza: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Edad (años)</label>
                <input type="number" value={nuevaMascota.edad} onChange={e => setNuevaMascota({...nuevaMascota, edad: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>Nombre del Propietario</label>
                <input required type="text" value={nuevaMascota.propietario} onChange={e => setNuevaMascota({...nuevaMascota, propietario: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};