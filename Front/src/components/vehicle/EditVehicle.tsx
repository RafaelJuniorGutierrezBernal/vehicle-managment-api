import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { vehicleService } from "../../services/VehicleService";
import type { Vehicle } from "../../models/Vehicle";
import VehicleForm from "./VehicleForm";
import { useToast } from "../common/Toast";

const EditVehicle = () => {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vin) return;
    vehicleService
      .getVehicleByVin(vin)
      .then(setVehicle)
      .catch(() => {
        showToast("No se pudo cargar la información del vehículo.", "error");
        navigate("/");
      })
      .finally(() => setLoading(false));
  }, [vin, navigate, showToast]);

  const handleUpdate = async (formattedData: Vehicle) => {
    if (!vin) return;
    try {
      await vehicleService.updateVehicle(vin, formattedData);
      showToast("Vehículo actualizado exitosamente.", "success");
      navigate(`/vehicle/${vin}`);
    } catch (error: any) {
      showToast(error.message || "Error al actualizar vehículo.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--accent-primary)] border-t-transparent" />
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Editar Vehículo</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {vehicle.make} {vehicle.model} — VIN: <span className="font-mono text-[var(--accent-primary)]">{vin}</span>
        </p>
      </div>
      <VehicleForm initialData={vehicle} onSubmit={handleUpdate} buttonText="Guardar Cambios" isEdit={true} />
    </div>
  );
};

export default EditVehicle;
