import React, { useState } from 'react';
import { Search, Plus, Dog, Cat } from 'lucide-react';
import { registrarMascotaEnAWS } from '../services/api';

export const Mascotas = ({ user, role }: { user?: any; role?: string }) => {
  const [cargando, setCargando] = useState(false);

  // Función que se ejecuta al presionar el botón
  const handleRegistrarMascota = async () => {
    setCargando(true);
    try {
      const nuevaMascota = {
        nombre: 'Max',
        especie: 'Perro',
        raza: 'Golden Retriever',
        edad: '3 años',
        propietario: 'Carlos Pérez',
        accion: 'REGISTRAR_NUEVO_PACIENTE'
      };

      // Dispara la llamada HTTP hacia AWS API Gateway
      await registrarMascotaEnAWS(nuevaMascota);
      alert('¡Petición enviada con éxito al API Gateway de AWS!');
    } catch (error) {
      console.error('Detalle de conexión AWS:', error);
      alert('Petición enviada a AWS. Abre F12 -> Network para ver el encabezado Authorization y la respuesta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Barra superior de búsqueda y botón de acción */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '0.5rem 0.75rem',
            width: '300px',
          }}
        >
          <Search size={18} color="#94a3b8" style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Buscar por mascota..."
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          />
        </div>

        {/* Botón que gatilla el Request a AWS */}
        <button
          onClick={handleRegistrarMascota}
          disabled={cargando}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: cargando ? '#6ee7b7' : '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.63rem 1.2rem',
            fontWeight: 700,
            cursor: cargando ? 'wait' : 'pointer',
          }}
        >
          <Plus size={18} />
          {cargando ? 'Conectando con AWS...' : 'Registrar Nuevo Paciente'}
        </button>
      </div>

      {/* Tabla de Pacientes */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead
            style={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
            }}
          >
            <tr>
              <th style={{ padding: '1rem' }}>Mascota</th>
              <th style={{ padding: '1rem' }}>Especie / Raza</th>
              <th style={{ padding: '1rem' }}>Edad</th>
              <th style={{ padding: '1rem' }}>Propietario</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.9rem', color: '#334155' }}>
            <tr style={{ borderBottom: '1px solid #f8fafc' }}>
              <td style={{ padding: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dog size={18} color="#10b981" />
                Max
              </td>
              <td style={{ padding: '1rem' }}>Perro - Golden Retriever</td>
              <td style={{ padding: '1rem' }}>3 año(s)</td>
              <td style={{ padding: '1rem' }}>Carlos Pérez</td>
              <td style={{ padding: '1rem', textAlign: 'right' }}></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f8fafc' }}>
              <td style={{ padding: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cat size={18} color="#e11d48" />
                Luna
              </td>
              <td style={{ padding: '1rem' }}>Gato - Siamés</td>
              <td style={{ padding: '1rem' }}>2 año(s)</td>
              <td style={{ padding: '1rem' }}>Carlos Pérez</td>
              <td style={{ padding: '1rem', textAlign: 'right' }}></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f8fafc' }}>
              <td style={{ padding: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Dog size={18} color="#10b981" />
                Rocky
              </td>
              <td style={{ padding: '1rem' }}>Perro - Bulldog Francés</td>
              <td style={{ padding: '1rem' }}>4 año(s)</td>
              <td style={{ padding: '1rem' }}>Juan Tapia</td>
              <td style={{ padding: '1rem', textAlign: 'right' }}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mascotas;