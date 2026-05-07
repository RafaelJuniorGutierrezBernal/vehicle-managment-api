import { useNavigate } from "react-router-dom";
import { vehicleService } from "../../services/VehicleService";
import VehicleForm from "./VehicleForm";
import { useToast } from "../common/Toast";

function AddVehicle() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleCreate = async (formattedData: any) => {
    try {
      await vehicleService.createVehicle(formattedData);
      showToast("Vehículo agregado exitosamente.", "success");
      navigate("/");
    } catch (error: any) {
      showToast(error.message || "Error al agregar vehículo.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Agregar Nuevo Vehículo</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Completa la información técnica del vehículo para ingresarlo al inventario.
        </p>
      </div>
      <VehicleForm onSubmit={handleCreate} buttonText="Registrar Vehículo" />
    </div>
  );
}

export default AddVehicle;
