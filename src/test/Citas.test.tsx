import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as CitasModule from '../pages/Citas';

const Citas = (CitasModule as any).default || (CitasModule as any).Citas;

describe('Citas Page', () => {
  const mockUser = { id: 2, nombre: 'Veterinario', role: 'veterinario', email: 'editor@test.com' };

  it('Debe renderizar el módulo de citas', () => {
    render(<Citas user={mockUser} role="veterinario" />);
    expect(screen.getByText(/Agendar Cita/i)).toBeInTheDocument();
  });
});