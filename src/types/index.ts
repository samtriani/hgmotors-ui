// AUTH
export type UserRole = 'DIRECTOR' | 'GERENTE' | 'VENDEDOR' | 'TALLER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

// INVENTORY
export type CarStatus = 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO' | 'EN_TALLER';

export interface Car {
  id: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  km: number;
  status: CarStatus;
  image: string;
  color: string;
  vin: string;
  entryDate: string;
  description?: string;
  fuelType: string;
  transmission: string;
}

// CRM
export type ClientStatus = 'NUEVO' | 'SEGUIMIENTO' | 'NEGOCIACION' | 'CERRADO' | 'PERDIDO';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: ClientStatus;
  assignedTo: string;
  interestedIn?: string;
  budget?: number;
  notes: string;
  createdAt: string;
  source: string;
}

// SALES
export interface Sale {
  id: string;
  clientId: string;
  carId: string;
  sellerId: string;
  finalPrice: number;
  saleDate: string;
  paymentMethod: 'CONTADO' | 'CREDITO' | 'ENGANCHE_CREDITO';
  status: 'COMPLETADA' | 'PENDIENTE_DOCS' | 'CANCELADA';
  commission: number;
  notes: string;
}

// TALLER
export interface WorkshopItem {
  id: string;
  carId: string;
  assignedTo: string;
  startDate: string;
  checklist: {
    motor: boolean;
    frenos: boolean;
    estetica: boolean;
    llantas: boolean;
    electricidad: boolean;
    ac: boolean;
    documentacion: boolean;
  };
  cost: number;
  notes: string;
  status: 'EN_PROCESO' | 'COMPLETADO' | 'PENDIENTE';
}

// CREDIT SIMULATOR
export interface CreditSimulation {
  carPrice: number;
  downPayment: number;
  months: 12 | 24 | 36 | 48 | 60;
  monthlyRate: number;
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
}
