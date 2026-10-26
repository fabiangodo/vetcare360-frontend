import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Mascotas } from './pages/Mascotas';
import { Citas } from './pages/Citas';
import { Bell, UserCheck } from 'lucide-react';

export type UserRole = 'admin' | 'editor' | 'cliente';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>('editor');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} role={role} />
      
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.6rem', fontWeight: '800' }}>
              {currentTab === 'dashboard' && 'Panel Principal'}
              {currentTab === 'mascotas' && 'Ficha de Pacientes'}
              {currentTab === 'citas' && 'Control de Citas'}
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Modo activo: <strong style={{ textTransform: 'uppercase', color: '#10b981' }}>{role}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '10px' }}>
              <UserCheck size={16} color="#64748b" />
              <select
                value={role}
                onChange={(e) => {
                  const newRole = e.target.value as UserRole;
                  setRole(newRole);
                  if (newRole === 'cliente' && currentTab === 'dashboard') {
                    setCurrentTab('mascotas');
                  }
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontWeight: '700',
                  color: '#334155',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="editor">Perfil: Editor (Control Total)</option>
                <option value="admin">Perfil: Admin (Veterinario)</option>
                <option value="cliente">Perfil: Cliente (Dueño)</option>
              </select>
            </div>

            <button style={{
              backgroundColor: '#fff',
              border: '1px solid #e2e8f0',
              padding: '0.6rem',
              borderRadius: '12px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex'
            }}>
              <Bell size={18} />
            </button>
          </div>
        </header>

        {currentTab === 'dashboard' && role !== 'cliente' && <Dashboard />}
        {currentTab === 'mascotas' && <Mascotas role={role} />}
        {currentTab === 'citas' && <Citas role={role} />}
      </main>
    </div>
  );
}

export default App;