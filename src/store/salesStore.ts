import { create } from 'zustand';
import type { Sale } from '../types';
import { MOCK_SALES } from '../mock/data';

interface SalesState {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateSale: (id: string, data: Partial<Sale>) => void;
}

export const useSalesStore = create<SalesState>()((set) => ({
  sales: MOCK_SALES,
  addSale: (sale) => set(s => ({ sales: [...s.sales, { ...sale, id: `s${Date.now()}` }] })),
  updateSale: (id, data) => set(s => ({ sales: s.sales.map(s2 => s2.id === id ? { ...s2, ...data } : s2) })),
}));
