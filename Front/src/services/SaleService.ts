import type { Sale } from "../models/Sale";
import { API_BASE_URL, getHeaders } from '../config/api';

export const saleService = {
    
    createSale: async (saleData: Sale): Promise<Sale> =>{
        const response = await fetch(`${API_BASE_URL}/sales`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(saleData),
        });
        if (!response.ok) {
            throw new Error('Failed to create sale');
        }
        return response.json();
    },
    getSales: async (): Promise<Sale[]> => {
        const response = await fetch(`${API_BASE_URL}/sales/list`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener las ventas');
        return response.json();
    },

    getSaleByVin: async (vin : string): Promise<Sale> => {
        const response = await fetch(`${API_BASE_URL}/sales/${vin}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al obtener la venta');
        return response.json();
    },
    deleteSaleByVin: async (vin : string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/sales/${vin}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('Error al eliminar la venta');
    },
    updateSaleByVin: async (vin : string, saleData: Sale): Promise<Sale> => {
        const response = await fetch(`${API_BASE_URL}/sales/${vin}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(saleData),
        });
        if (!response.ok) throw new Error('Error al actualizar la venta');
        return response.json();
    }
}