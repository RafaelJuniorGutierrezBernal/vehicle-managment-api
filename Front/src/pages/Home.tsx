import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, CheckCircle2, Tag, Clock } from 'lucide-react';
import type { Vehicle } from '../models';
import VehicleList from '../components/vehicle/VehicleList';
import { vehicleService } from '../services/VehicleService';

interface StatConfig {
  label: string;
  filter: (v: Vehicle) => boolean;
  accent: string;
  ringColor: string;
  Icon: React.ElementType;
}

const STAT_CONFIGS: StatConfig[] = [
  {
    label: 'Total',
    filter: () => true,
    accent: 'text-[var(--accent-primary)]',
    ringColor: 'ring-[var(--accent-primary)]/20',
    Icon: Car,
  },
  {
    label: 'Disponibles',
    filter: (v) => v.status === 'active' || !v.status,
    accent: 'text-[var(--accent-success)]',
    ringColor: 'ring-[var(--accent-success)]/20',
    Icon: CheckCircle2,
  },
  {
    label: 'Vendidos',
    filter: (v) => v.status === 'closed',
    accent: 'text-[var(--accent-danger)]',
    ringColor: 'ring-[var(--accent-danger)]/20',
    Icon: Tag,
  },
  {
    label: 'Pendientes',
    filter: (v) => v.status === 'pending',
    accent: 'text-[var(--accent-warning)]',
    ringColor: 'ring-[var(--accent-warning)]/20',
    Icon: Clock,
  },
];

const STATUS_FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: 'Disponibles', value: 'active' },
  { label: 'Vendidos', value: 'closed' },
  { label: 'Pendientes', value: 'pending' },
];

const Home = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    vehicleService
      .getVehicles()
      .then((data) => setVehicles(data))
      .catch(() => setError('No se pudieron cargar los vehículos.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = vehicles.filter((v) => {
    const matchStatus =
      statusFilter === 'all' || v.status === statusFilter || (!v.status && statusFilter === 'active');
    const term = search.toLowerCase();
    const matchSearch =
      !search ||
      v.make?.toLowerCase().includes(term) ||
      v.model?.toLowerCase().includes(term) ||
      v.vin?.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STAT_CONFIGS.map((s) => {
          const count = loading ? null : vehicles.filter(s.filter).length;
          return (
            <div
              key={s.label}
              className="relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col gap-2 overflow-hidden group hover:border-[var(--accent-primary)]/40 transition-all duration-300"
            >
              {/* Animated ring bg */}
              <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ring-[12px] ${s.ringColor} opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
              <s.Icon size={18} className={s.accent} strokeWidth={2} />
              <span className={`text-3xl font-black tracking-tight ${s.accent}`}>
                {count === null ? '—' : count}
              </span>
              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Car size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por marca, modelo o VIN…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all duration-200"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                statusFilter === f.value
                  ? 'bg-[var(--accent-primary)] text-[var(--primary-bg)] border-transparent shadow-md shadow-[var(--accent-primary)]/20'
                  : 'bg-transparent border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/30 rounded-xl p-4 text-sm text-[var(--accent-danger)]">
          {error}
        </div>
      )}

      {/* Vehicle Grid */}
      <VehicleList
        vehicles={filtered}
        loading={loading}
        onVehicleClick={(v) => navigate(`/vehicle/${v.vin}`)}
      />
    </div>
  );
};

export default Home;
