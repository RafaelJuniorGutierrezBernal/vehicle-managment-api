import React, { useState, useEffect } from "react";
import { Hash, DollarSign, Image as ImageIcon, AlignLeft, Info } from 'lucide-react';
import type { Vehicle } from "../../models/Vehicle";

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: (data: Vehicle) => Promise<void>;
  buttonText: string;
  isEdit?: boolean;
}

const TRANSMISSION_OPTIONS = ['Automática', 'Manual', 'CVT', 'Semi-automática'];
const BODY_OPTIONS = ['Sedán', 'SUV', 'Hatchback', 'Pickup', 'Coupé', 'Convertible', 'Van', 'Camioneta', 'Otro'];
const STATE_OPTIONS = ['Nuevo', 'Usado', 'Certificado'];

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-[var(--secondary-bg)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all duration-300 text-sm disabled:opacity-50 shadow-inner';
const selectCls =
  'w-full px-4 py-3 rounded-xl bg-[var(--secondary-bg)] border border-[var(--border-color)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary)]/10 transition-all duration-300 text-sm appearance-none shadow-inner';
const labelCls = 'absolute -top-2.5 left-3 px-1.5 bg-[var(--card-bg)] text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest transition-colors group-focus-within:text-[var(--accent-primary)]';

const VehicleForm = ({ initialData, onSubmit, buttonText, isEdit = false }: VehicleFormProps) => {
  const [vehicleData, setVehicleData] = useState({
    vin: "",
    make: "",
    model: "",
    year: "",
    version: "",
    body: "",
    transmission: "",
    state: "",
    condition: "",
    odometer: "",
    color: "",
    interior: "",
    description: "",
    imageUrl: "",
    currentPrice: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof vehicleData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setVehicleData({
        vin:          initialData.vin              ?? "",
        make:         initialData.make             ?? "",
        model:        initialData.model            ?? "",
        year:         initialData.year?.toString() ?? "",
        version:      initialData.version          ?? "",
        body:         initialData.body             ?? "",
        transmission: initialData.transmission     ?? "",
        state:        initialData.state            ?? "",
        condition:    initialData.condition?.toString() ?? "",
        odometer:     initialData.odometer?.toString()  ?? "",
        color:        initialData.color            ?? "",
        interior:     initialData.interior         ?? "",
        description:  initialData.description      ?? "",
        imageUrl:     initialData.imageUrl         ?? "",
        currentPrice: initialData.currentPrice?.toString() ?? "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!vehicleData.vin.trim())   newErrors.vin  = 'El VIN es requerido';
    if (!vehicleData.make.trim())  newErrors.make = 'La marca es requerida';
    if (!vehicleData.model.trim()) newErrors.model = 'El modelo es requerido';
    if (!vehicleData.year || isNaN(Number(vehicleData.year))) newErrors.year = 'Año inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        ...vehicleData,
        year: Number(vehicleData.year),
        condition: vehicleData.condition ? Number(vehicleData.condition) : undefined,
        odometer:  vehicleData.odometer  ? Number(vehicleData.odometer)  : undefined,
        currentPrice: vehicleData.currentPrice ? Number(vehicleData.currentPrice) : undefined,
      } as Vehicle);
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ name, label, children, icon: Icon }: { name: string; label: string; children: React.ReactNode; icon?: React.ElementType }) => (
    <div className="relative group">
      <label htmlFor={name} className={labelCls}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none group-focus-within:text-[var(--accent-primary)] transition-colors" />}
        <div className={Icon ? 'pl-6' : ''}>
          {children}
        </div>
      </div>
      {errors[name as keyof typeof errors] && (
        <p className="mt-1.5 ml-1 text-[10px] font-bold text-[var(--accent-danger)] uppercase tracking-wide flex items-center gap-1">
           <Info size={10} /> {errors[name as keyof typeof errors]}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 lg:p-10 shadow-handmade">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--accent-primary)] rounded-full"></span>
            Información Básica
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Field name="vin" label="VIN *" icon={Hash}>
              <input type="text" id="vin" name="vin" value={vehicleData.vin} onChange={handleChange}
                disabled={isEdit} className={inputCls} placeholder="Ej: 1HGCM82633..." />
            </Field>
            <Field name="make" label="Marca *">
              <input type="text" id="make" name="make" value={vehicleData.make} onChange={handleChange}
                className={inputCls} placeholder="Ej: Toyota" />
            </Field>
            <Field name="model" label="Modelo *">
              <input type="text" id="model" name="model" value={vehicleData.model} onChange={handleChange}
                className={inputCls} placeholder="Ej: Corolla" />
            </Field>
            <Field name="year" label="Año *">
              <input type="number" id="year" name="year" value={vehicleData.year} onChange={handleChange}
                className={inputCls} placeholder="Ej: 2024" min="1900" max="2030" />
            </Field>
            <Field name="version" label="Versión / Trim">
              <input type="text" id="version" name="version" value={vehicleData.version} onChange={handleChange}
                className={inputCls} placeholder="Ej: XLE, Sport..." />
            </Field>
            <Field name="currentPrice" label="Precio de Venta" icon={DollarSign}>
              <input type="number" id="currentPrice" name="currentPrice" value={vehicleData.currentPrice} onChange={handleChange}
                className={inputCls} placeholder="Ej: 45000000" />
            </Field>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--accent-success)] rounded-full"></span>
            Especificaciones Técnicas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Field name="body" label="Carrocería">
              <select id="body" name="body" value={vehicleData.body} onChange={handleChange} className={selectCls}>
                <option value="">Seleccionar…</option>
                {BODY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field name="transmission" label="Transmisión">
              <select id="transmission" name="transmission" value={vehicleData.transmission} onChange={handleChange} className={selectCls}>
                <option value="">Seleccionar…</option>
                {TRANSMISSION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field name="state" label="Estado físico">
              <select id="state" name="state" value={vehicleData.state} onChange={handleChange} className={selectCls}>
                <option value="">Seleccionar…</option>
                {STATE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field name="condition" label="Condición (1–5)">
              <input type="number" id="condition" name="condition" value={vehicleData.condition} onChange={handleChange}
                className={inputCls} placeholder="Ej: 4.5" min="1" max="5" step="0.1" />
            </Field>
            <Field name="odometer" label="Odómetro (km)">
              <input type="number" id="odometer" name="odometer" value={vehicleData.odometer} onChange={handleChange}
                className={inputCls} placeholder="Ej: 25000" />
            </Field>
            <Field name="color" label="Color Exterior">
              <input type="text" id="color" name="color" value={vehicleData.color} onChange={handleChange}
                className={inputCls} placeholder="Ej: Blanco Perla" />
            </Field>
            <Field name="interior" label="Color Interior">
              <input type="text" id="interior" name="interior" value={vehicleData.interior} onChange={handleChange}
                className={inputCls} placeholder="Ej: Negro Cuero" />
            </Field>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[var(--accent-warning)] rounded-full"></span>
            Multimedia & Detalles
          </h3>
          <div className="space-y-6">
            <Field name="imageUrl" label="URL de Imagen" icon={ImageIcon}>
              <input type="url" id="imageUrl" name="imageUrl" value={vehicleData.imageUrl} onChange={handleChange}
                className={inputCls} placeholder="https://ejemplo.com/imagen.jpg" />
            </Field>

            <Field name="description" label="Descripción" icon={AlignLeft}>
              <textarea id="description" name="description" value={vehicleData.description} onChange={handleChange}
                rows={4} className={inputCls + ' resize-none'} placeholder="Estado del vehículo, mantenimientos, extras…" />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-gradient-to-r from-[var(--accent-primary)] to-[#0ea5e9] text-[var(--primary-bg)] hover:opacity-95 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {submitting ? 'Un momento...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;
