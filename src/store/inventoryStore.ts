import { create } from 'zustand';
import type { Car, CarStatus } from '../types';
import { MOCK_CARS } from '../mock/data';

interface InventoryState {
  cars: Car[];
  addCar: (car: Omit<Car, 'id'>) => void;
  updateCar: (id: string, data: Partial<Car>) => void;
  updateCarStatus: (id: string, status: CarStatus) => void;
  deleteCar: (id: string) => void;
  getCar: (id: string) => Car | undefined;
}

export const useInventoryStore = create<InventoryState>()((set, get) => ({
  cars: MOCK_CARS,
  addCar: (car) => set(s => ({ cars: [...s.cars, { ...car, id: `c${Date.now()}` }] })),
  updateCar: (id, data) => set(s => ({ cars: s.cars.map(c => c.id === id ? { ...c, ...data } : c) })),
  updateCarStatus: (id, status) => set(s => ({ cars: s.cars.map(c => c.id === id ? { ...c, status } : c) })),
  deleteCar: (id) => set(s => ({ cars: s.cars.filter(c => c.id !== id) })),
  getCar: (id) => get().cars.find(c => c.id === id),
}));
