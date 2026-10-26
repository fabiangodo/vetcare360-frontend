import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Mascotas } from './pages/Mascotas';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.75rem', fontWeight: 'bold' }}>
            {currentTab === 'dashboard' && 'Panel Principal'}
            {currentTab === 'mascotas' && 'Gestión de Mascotas'}
            {currentTab === 'citas' && 'Agenda de Citas'}
          </h1>
        </header>

        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'mascotas' && <Mascotas />}
        {currentTab === 'citas' && <p>Vista de Citas (Siguiente paso)</p>}
      </main>
    </div>
  );
}

export default App;