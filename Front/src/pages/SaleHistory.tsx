import { useEffect, useState } from 'react';
import { ShoppingCart, User, DollarSign, Calendar, Hash } from 'lucide-react';
import { saleService } from '../services/SaleService';
import type { Sale } from '../models';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });

const SaleHistory = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    saleService
      .getSales()
      .then(setSales)
      .catch(() => setError('No se pudo cargar el historial de ventas.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--accent-primary)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--accent-danger)]/10 border border-[var(--accent-danger)]/30 rounded-2xl p-6 text-[var(--accent-danger)] shadow-lg shadow-red-900/10">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Historial de Ventas</h1>
          <p className="text-[var(--text-secondary)] mt-2 font-medium flex items-center gap-2">
            <ShoppingCart size={16} className="text-[var(--accent-primary)]" />
            {sales.length} {sales.length === 1 ? 'transacción registrada' : 'transacciones registradas'}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {sales.length === 0 ? (
        <div className="bg-[var(--card-bg)] border border-dashed border-[var(--border-color)] rounded-3xl p-16 text-center shadow-handmade">
          <div className="w-16 h-16 bg-[var(--secondary-bg)] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={32} className="text-[var(--text-secondary)]" />
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">Aún no hay ventas registradas</p>
          <p className="text-[var(--text-secondary)] mt-1">Las transacciones aparecerán aquí una vez que se completen.</p>
        </div>
      ) : (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-handmade">
          {/* Table container with horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--secondary-bg)]/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2"><Hash size={14} /> VIN</div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2"><User size={14} /> Vendedor</div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2"><DollarSign size={14} /> Precio</div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">MMR</div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2"><Calendar size={14} /> Fecha</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {sales.map((sale, idx) => (
                  <tr
                    key={sale.id ?? idx}
                    className="group hover:bg-[var(--accent-primary)]/5 transition-all duration-200"
                  >
                    <td className="px-6 py-5">
                      <span className="font-mono text-[var(--accent-primary)] text-xs font-bold bg-[var(--accent-primary)]/10 px-2 py-1 rounded-md" title={sale.vehicleVin}>
                        {sale.vehicleVin}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[var(--text-primary)] font-bold tracking-tight">{sale.seller}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[var(--accent-success)] font-black text-base">
                        {formatPrice(sale.sellingPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[var(--text-secondary)] font-medium">
                        {sale.mmr ? formatPrice(sale.mmr) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[var(--text-secondary)] font-medium">
                        {sale.saleDate ? formatDate(sale.saleDate) : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaleHistory;