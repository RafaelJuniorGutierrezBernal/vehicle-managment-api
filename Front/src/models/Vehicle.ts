export interface Vehicle {
  vin: string;                   
  make: string;                  
  model: string;
  year: number;
  version?: string;
  body?: string;
  transmission?: string;
  state?: string;
  condition?: number;
  odometer?: number;             
  color?: string;
  interior?: string;
  description?: string;
  imageUrl?: string;
  currentPrice?: number;
  status?: "active" | "closed" | "pending";
}
