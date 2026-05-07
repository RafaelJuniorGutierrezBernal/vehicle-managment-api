import { Car } from 'lucide-react';
import Card from "../common/Card";
import Button from "../common/Button";
import type { Vehicle } from "../../models";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails?: () => void;
}

const formatPrice = (price?: number): string => {
  if (price === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

const STATUS_META: Record<string, { label: string; textColor: string; bg: string; pulse: boolean }> = {
  active: {
    label: 'Disponible',
    textColor: 'text-[var(--accent-success)]',
    bg: 'bg-[var(--accent-success)]/10 border border-[var(--accent-success)]/20',
    pulse: true,
  },
  closed: {
    label: 'Vendido',
    textColor: 'text-[var(--accent-danger)]',
    bg: 'bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/20',
    pulse: false,
  },
  pending: {
    label: 'Pendiente',
    textColor: 'text-[var(--accent-warning)]',
    bg: 'bg-[var(--accent-warning)]/10 border border-[var(--accent-warning)]/20',
    pulse: false,
  },
};

function VehicleCard({ vehicle, onViewDetails }: VehicleCardProps) {
  const status = vehicle.status ?? 'active';
  const meta = STATUS_META[status] ?? STATUS_META.active;

  return (
    <Card onClick={onViewDetails}>
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={vehicle.imageUrl || 'https://placehold.co/400x220/1e293b/38bdf8?text=Sin+Imagen'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Car icon badge top-left */}
        <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-lg bg-[var(--primary-bg)]/60 backdrop-blur-sm flex items-center justify-center">
          <Car size={14} className="text-[var(--accent-primary)]" strokeWidth={2} />
        </div>

        {/* Status badge top-right */}
        <span className={`absolute top-2.5 right-2.5 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.bg} ${meta.textColor} backdrop-blur-sm`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${meta.pulse ? 'animate-pulse' : ''}`} />
          {meta.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {vehicle.year}
            {vehicle.transmission && ` • ${vehicle.transmission}`}
            {vehicle.odometer != null && ` • ${vehicle.odometer.toLocaleString()} km`}
          </p>
        </div>

        {vehicle.description && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {vehicle.description}
          </p>
        )}

        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-semibold">Precio</p>
            <p className="text-lg font-black text-[var(--accent-primary)] tracking-tight">
              {formatPrice(vehicle.currentPrice)}
            </p>
          </div>
          <Button
            variant="primary"
            className="text-xs px-3 py-1.5 shrink-0"
            onClick={(e) => {
              e?.stopPropagation();
              onViewDetails?.();
            }}
          >
            Ver →
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default VehicleCard;
