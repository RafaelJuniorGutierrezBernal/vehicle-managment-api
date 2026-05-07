import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleForm from '../components/vehicle/VehicleForm';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Hash: () => <div />,
  DollarSign: () => <div />,
  Image: () => <div />,
  AlignLeft: () => <div />,
  Info: () => <div />,
}));

describe('VehicleForm', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  it('renders all form fields', () => {
    render(<VehicleForm onSubmit={mockOnSubmit} buttonText="Registrar" />);
    
    expect(screen.getByLabelText(/VIN \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Marca \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Modelo \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Año \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
  });

  it('shows error when required fields are empty on submit', async () => {
    render(<VehicleForm onSubmit={mockOnSubmit} buttonText="Registrar" />);
    
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    expect(await screen.findByText(/El VIN es requerido/i)).toBeInTheDocument();
    expect(await screen.findByText(/La marca es requerida/i)).toBeInTheDocument();
    expect(await screen.findByText(/El modelo es requerido/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correctly formatted data when valid', async () => {
    render(<VehicleForm onSubmit={mockOnSubmit} buttonText="Registrar" />);
    
    fireEvent.change(screen.getByLabelText(/VIN \*/i), { target: { value: 'VIN123' } });
    fireEvent.change(screen.getByLabelText(/Marca \*/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByLabelText(/Modelo \*/i), { target: { value: 'Corolla' } });
    fireEvent.change(screen.getByLabelText(/Año \*/i), { target: { value: '2024' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        vin: 'VIN123',
        make: 'Toyota',
        model: 'Corolla',
        year: 2024,
      }));
    });
  });

  it('disables submit button and shows loading state', async () => {
    // Make onSubmit stay pending
    let resolveSubmit: (val: any) => void;
    const pendingSubmit = new Promise((resolve) => { resolveSubmit = resolve; });
    const slowOnSubmit = vi.fn().mockReturnValue(pendingSubmit);

    render(<VehicleForm onSubmit={slowOnSubmit} buttonText="Registrar" />);
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/VIN \*/i), { target: { value: 'VIN' } });
    fireEvent.change(screen.getByLabelText(/Marca \*/i), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Modelo \*/i), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Año \*/i), { target: { value: '2024' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/Un momento.../i);

    // Resolve it
    // @ts-ignore
    resolveSubmit(undefined);
    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
