import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('VetCare 360 - Tests de Integración', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Debe renderizar la pantalla de Login al iniciar sin sesión', () => {
    render(<App />);
    expect(screen.getByText('VetCare 360')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin@test.com')).toBeInTheDocument();
  });

  it('Debe mostrar error si se ingresa un correo no registrado', async () => {
    render(<App />);
    const emailInput = screen.getByPlaceholderText('admin@test.com');
    const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'fake@test.com' } });
    fireEvent.submit(submitBtn.closest('form')!);

    expect(await screen.findByText(/correo no registrado/i)).toBeInTheDocument();
  });

  it('Debe iniciar sesión correctamente con credenciales Admin', async () => {
    render(<App />);
    const emailInput = screen.getByPlaceholderText('admin@test.com');
    const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.submit(submitBtn.closest('form')!);

    // Espera a que el panel autenticado sincronice con Supabase o cargue los datos
    expect(await screen.findByText(/Sincronizando datos con Supabase|Registrar Mascota/i)).toBeInTheDocument();
  });
});