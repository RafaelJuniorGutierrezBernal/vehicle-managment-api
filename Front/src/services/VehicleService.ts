import type { Vehicle } from '../models';
import { API_BASE_URL, getHeaders } from '../config/api';


export const vehicleService = {

    createVehicle: async (vehicleData: Vehicle): Promise<Vehicle> =>{
        const { version, ...rest } = vehicleData as any;
        const dataToSave = { ...rest, trim: version };

        const response = await fetch(`${API_BASE_URL}/vehicles`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(dataToSave),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            console.error('API Error details:', errorBody);
            throw new Error(errorBody.message || 'Error al crear el vehículo');
        }
        return response.json();
    },
    
    getVehicles: async (): Promise<Vehicle[]> => {
        const response = await fetch(`${API_BASE_URL}/vehicles/list`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener vehículos');
        return response.json();
    },

    getVehicleByVin: async (vin: string): Promise<Vehicle> => {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vin}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener el vehículo');
        return response.json();
    },

    deleteVehicleByVin: async (vin : string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/vehicles/${vin}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al eliminar el vehículo');
    },

    updateVehicle: async (vin: string, vehicleData: Vehicle): Promise<Vehicle> => {
        const { version, ...rest } = vehicleData as any;
        const dataToUpdate = { ...rest, trim: version };

        const response = await fetch(`${API_BASE_URL}/vehicles/${vin}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(dataToUpdate),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || 'Error al actualizar el vehículo');
        }
        return response.json();
    }
};
