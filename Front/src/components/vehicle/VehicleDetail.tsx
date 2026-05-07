import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "../../models";
import Button from "../common/Button";
import { saleService } from "../../services/SaleService";
import keycloak from "../../keycloak";
import { vehicleService } from "../../services/VehicleService";
import { useToast } from "../common/Toast";

interface VehicleDetailProps {
  vehicle: Vehicle;
}

const formatPrice = (price?: number): string => {
  if (price === undefined) return 'N/A';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

const STATUS_LABEL: Record<string, string> = {
  active:  'Disponible',
  pending: 'Pendiente',
  closed:  'Vendido',
};

const STATUS_COLOR: Record<string, string> = {
  active:  'text-[var(--accent-success)] bg-[var(--accent-success)]/10 border-[var(--accent-success)]/20',
  pending: 'text-[var(--accent-warning)] bg-[var(--accent-warning)]/10 border-[var(--accent-warning)]/20',
  closed:  'text-[var(--accent-danger)]  bg-[var(--accent-danger)]/10  border-[var(--accent-danger)]/20',
};

/* Simple inline confirm hook */
function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <p className="text-[var(--text-primary)] font-medium text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-5 justify-end">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
        </div>
      </div>
    </div>
  );
}

const VehicleDetail = ({ vehicle }: VehicleDetailProps) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isAdmin =
    keycloak.hasResourceRole('ADMIN') || keycloak.hasRealmRole('ADMIN') || keycloak.hasRealmRole('admin');
  const isSold = vehicle.status === 'closed';
  const [confirm, setConfirm] = useState<null | 'sell' | 'delete'>(null);
  const [busy, setBusy] = useState(false);

  const handleSell = async () => {
    setBusy(true);
    try {
      await saleService.createSale({
        seller: keycloak.tokenParsed?.preferred_username ?? 'Sistema',
        mmr: 0,
        sellingPrice: vehicle.currentPrice ?? 0,
        saleDate: new Date(),
        vehicleVin: vehicle.vin,
      });
      showToast('¡Venta realizada con éxito!', 'success');
      navigate('/');
    } catch {
      showToast('Hubo un error al procesar la venta.', 'error');
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await vehicleService.deleteVehicleByVin(vehicle.vin);
      showToast('Vehículo eliminado con éxito.', 'success');
      navigate('/');
    } catch {
      showToast('No se pudo eliminar el vehículo.', 'error');
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const status = vehicle.status ?? 'active';

  const specItems = [
    { label: 'VIN',          value: vehicle.vin },
    { label: 'Año',          value: vehicle.year },
    { label: 'Carrocería',   value: vehicle.body ?? '—' },
    { label: 'Transmisión',  value: vehicle.transmission ?? '—' },
    { label: 'Color Ext.',   value: vehicle.color ?? '—' },
    { label: 'Color Int.',   value: vehicle.interior ?? '—' },
    { label: 'Odómetro',     value: vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : '—' },
    { label: 'Condición',    value: vehicle.condition ? `${vehicle.condition}/5` : '—' },
    { label: 'Estado físico',value: vehicle.state ?? '—' },
    { label: 'Estado venta', value: STATUS_LABEL[status] ?? status },
  ];

  return (
    <>
      {confirm === 'sell' && (
        <ConfirmModal
          message={`¿Confirmar venta directa de ${vehicle.make} ${vehicle.model} por ${formatPrice(vehicle.currentPrice)}?`}
          onConfirm={handleSell}
          onCancel={() => setConfirm(null)}
        />
      )}
      {confirm === 'delete' && (
        <ConfirmModal
          message={`¿Eliminar permanentemente ${vehicle.make} ${vehicle.model} (${vehicle.vin})?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: image */}
        <div className="space-y-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border-color)]">
            <img
              src={vehicle.imageUrl ?? 'https://placehold.co/800x450/1e293b/38bdf8?text=Sin+Imagen'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-4xl font-black uppercase tracking-widest border-4 border-white px-6 py-2 rotate-12">
                  Vendido
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                {vehicle.make} {vehicle.model}
              </h1>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[status] ?? STATUS_COLOR.active}`}>
                {STATUS_LABEL[status] ?? status}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {vehicle.year} • {vehicle.version ?? ''} • {vehicle.transmission ?? 'N/A'}
            </p>
          </div>

          {/* Price block */}
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Precio de Venta</p>
              <p className="text-4xl font-black text-[var(--accent-primary)] mt-1">
                {formatPrice(vehicle.currentPrice)}
              </p>
            </div>

            {!keycloak.authenticated ? (
              <div className="space-y-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  Inicia sesión para realizar transacciones sobre este vehículo.
                </p>
                <Button variant="primary" className="w-full py-3" onClick={() => keycloak.login()}>
                  Iniciar Sesión para Comprar
                </Button>
              </div>
            ) : isAdmin ? (
              <div className="space-y-2">
                <Button
                  variant="primary"
                  className="w-full py-3"
                  disabled={isSold || busy}
                  onClick={() => setConfirm('sell')}
                >
                  {isSold ? 'Vehículo Vendido' : 'Confirmar Venta Directa'}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    className="py-2"
                    onClick={() => navigate(`/edit-vehicle/${vehicle.vin}`)}
                  >
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="py-2"
                    disabled={busy}
                    onClick={() => setConfirm('delete')}
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--accent-warning)]/10 border border-[var(--accent-warning)]/20 rounded-xl p-3 text-xs text-[var(--accent-warning)]">
                Tu cuenta no tiene permisos de administrador para registrar ventas.
              </div>
            )}
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-3">Especificaciones</h3>
            <div className="grid grid-cols-2 gap-2">
              {specItems.map((item) => (
                <div key={item.label} className="bg-[var(--primary-bg)] border border-[var(--border-color)] rounded-xl p-3">
                  <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5 break-all">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">Descripción</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{vehicle.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleDetail;
