import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from '../components/vehicle/VehicleCard';
import type { Vehicle } from '../models';

// Mock Lucide icons to avoid rendering complexities in tests
vi.mock('lucide-react', () => ({
  Car: () => <div data-testid="car-icon" />,
}));

const mockVehicle: Vehicle = {
  vin: 'TEST1234567890',
  make: 'Toyota',
  model: 'Corolla',
  year: 2024,
  currentPrice: 35000000,
  status: 'active',
  imageUrl: 'https://test.com/image.jpg',
  description: 'Test description',
  transmission: 'Automática',
  odometer: 15000,
};

describe('VehicleCard', () => {
  it('renders vehicle information correctly', () => {
    render(
      <MemoryRouter>
        <VehicleCard vehicle={mockVehicle} />
      </MemoryRouter>
    );

    expect(screen.getByText('Toyota Corolla')).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
    expect(screen.getByText(/15.000 km/)).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$ 35.000.000')).toBeInTheDocument();
  });

  it('displays the correct status badge', () => {
    render(
      <MemoryRouter>
        <VehicleCard vehicle={mockVehicle} />
      </MemoryRouter>
    );

    const badge = screen.getByText('Disponible');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-[var(--accent-success)]');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <VehicleCard vehicle={mockVehicle} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
