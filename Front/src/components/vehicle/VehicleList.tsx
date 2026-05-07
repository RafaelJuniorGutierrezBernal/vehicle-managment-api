import VehicleCard from './VehicleCard';
import type { Vehicle } from '../../models';

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleClick?: (vehicle: Vehicle) => void;
  loading?: boolean;
}

function VehicleList({ vehicles, onVehicleClick, loading = false }: VehicleListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden animate-pulse">
            <div className="h-44 bg-[var(--border-color)]" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[var(--border-color)] rounded w-3/4" />
              <div className="h-3 bg-[var(--border-color)] rounded w-1/2" />
              <div className="h-6 bg-[var(--border-color)] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--card-bg)] border border-dashed border-[var(--border-color)] rounded-xl">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-[var(--text-secondary)] font-medium">No se encontraron vehículos.</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Intenta con otros filtros o términos de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.vin}
          vehicle={vehicle}
          onViewDetails={() => onVehicleClick?.(vehicle)}
        />
      ))}
    </div>
  );
}

export default VehicleList;
