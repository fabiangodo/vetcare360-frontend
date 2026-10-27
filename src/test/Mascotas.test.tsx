import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as MascotasModule from '../pages/Mascotas';

const Mascotas = (MascotasModule as any).default || (MascotasModule as any).Mascotas;

describe('Mascotas Page', () => {
  const mockUser = { id: 1, nombre: 'Admin', role: 'admin', email: 'admin@test.com' };

  it('Debe renderizar la vista de mascotas', () => {
    render(<Mascotas user={mockUser} role="admin" />);
    expect(screen.getByText(/Registrar Nuevo Paciente/i)).toBeInTheDocument();
  });
});