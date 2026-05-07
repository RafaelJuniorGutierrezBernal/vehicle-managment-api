import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VehicleDetail from '../components/vehicle/VehicleDetail';
import type { Vehicle } from '../models';
import { vehicleService } from '../services/VehicleService';

const VehicleDetailPage = () => {
  const { vin } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vin) return;
    vehicleService
      .getVehicleByVin(vin)
      .then(setVehicle)
      .catch(() => setError('No se pudo encontrar el vehículo.'))
      .finally(() => setLoading(false));
  }, [vin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--accent-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-5xl">🚗</p>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{error ?? 'Vehículo no encontrado'}</h2>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-[var(--accent-primary)] hover:underline"
        >
          ← Volver al Inventario
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
      >
        ← Volver al Inventario
      </button>
      <VehicleDetail vehicle={vehicle} />
    </div>
  );
};

export default VehicleDetailPage;
