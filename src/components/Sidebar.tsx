import React from 'react';
import { LayoutDashboard, Dog, Calendar, LogOut } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mascotas', label: 'Mascotas', icon: Dog },
    { id: 'citas', label: 'Citas Médicas', icon: Calendar },
  ];

  return (
    <aside style={{ width: '240px', backgroundColor: '#1e293b', color: '#fff', minHeight: '100vh', padding: '1.5rem 1rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', color: '#38bdf8' }}>
        🐾 VetCare 360
      </h2>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? '#0284c7' : 'transparent',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: isActive ? '600' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};