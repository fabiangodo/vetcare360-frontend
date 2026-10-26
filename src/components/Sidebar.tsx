import React from 'react';
import { LayoutDashboard, Dog, Calendar, HeartPulse, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'mascotas', label: 'Pacientes / Mascotas', icon: Dog },
    { id: 'citas', label: 'Agenda Médica', icon: Calendar },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#0f172a',
      color: '#fff',
      minHeight: '100vh',
      padding: '1.75rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '4px 0 12px rgba(0,0,0,0.05)'
    }}>
      <div>
        {/* Logo Veterinario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <div style={{
            backgroundColor: '#10b981',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <HeartPulse size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#f8fafc', letterSpacing: '0.5px' }}>
              VetCare <span style={{ color: '#34d399' }}>360</span>
            </h2>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: '500' }}>Centro Veterinario</p>
          </div>
        </div>
        
        {/* Menú de Navegación */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isActive ? '#34d399' : '#94a3b8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.92rem',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '4px solid #10b981' : '4px solid transparent'
                }}
              >
                <Icon size={20} color={isActive ? '#34d399' : '#64748b'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Widget de Estado Sistema */}
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        borderRadius: '12px',
        padding: '1rem',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <ShieldCheck size={20} color="#10b981" />
        <div>
          <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: '#e2e8f0' }}>AWS EC2 Conectado</p>
          <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b' }}>v1.0.2 • Producción</p>
        </div>
      </div>
    </aside>
  );
};