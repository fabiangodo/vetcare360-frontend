import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as DashboardModule from '../pages/Dashboard';

const Dashboard = (DashboardModule as any).default || (DashboardModule as any).Dashboard;

describe('Dashboard Page', () => {
  const mockUser = { id: 3, nombre: 'Cliente', role: 'cliente', email: 'viewer@test.com' };

  it('Debe renderizar la vista principal del panel', () => {
    render(<Dashboard user={mockUser} role="cliente" />);
    expect(screen.getByText(/Pacientes Activos/i)).toBeInTheDocument();
  });
});