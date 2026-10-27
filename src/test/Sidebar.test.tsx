import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as SidebarModule from '../components/Sidebar';

const Sidebar = (SidebarModule as any).default || (SidebarModule as any).Sidebar;

describe('Sidebar Component', () => {
  const mockUser = { id: 1, nombre: 'Admin User', role: 'admin', email: 'admin@test.com' };
  const mockSetCurrentTab = vi.fn();
  const mockOnLogout = vi.fn();

  it('Debe renderizar la navegación y datos del usuario', () => {
    render(
      <Sidebar
        currentTab="mascotas"
        setCurrentTab={mockSetCurrentTab}
        user={mockUser}
        role="admin"
        onLogout={mockOnLogout}
      />
    );

    expect(screen.getByText(/VetCare/i)).toBeInTheDocument();
    expect(screen.getByText(/ADMIN/i)).toBeInTheDocument();
  });

  it('Debe cambiar de pestaña al hacer clic en el menú', () => {
    render(
      <Sidebar
        currentTab="mascotas"
        setCurrentTab={mockSetCurrentTab}
        user={mockUser}
        role="admin"
        onLogout={mockOnLogout}
      />
    );

    const agendaBtn = screen.getByText(/Agenda Médica/i);
    fireEvent.click(agendaBtn);
    expect(mockSetCurrentTab).toHaveBeenCalledWith('citas');
  });
});