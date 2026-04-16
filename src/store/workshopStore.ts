import { create } from 'zustand';
import type { WorkshopItem } from '../types';
import { MOCK_WORKSHOP } from '../mock/data';

interface WorkshopState {
  items: WorkshopItem[];
  addItem: (item: Omit<WorkshopItem, 'id'>) => void;
  updateItem: (id: string, data: Partial<WorkshopItem>) => void;
  updateChecklist: (id: string, key: keyof WorkshopItem['checklist'], value: boolean) => void;
}

export const useWorkshopStore = create<WorkshopState>()((set) => ({
  items: MOCK_WORKSHOP,
  addItem: (item) => set(s => ({ items: [...s.items, { ...item, id: `w${Date.now()}` }] })),
  updateItem: (id, data) => set(s => ({ items: s.items.map(i => i.id === id ? { ...i, ...data } : i) })),
  updateChecklist: (id, key, value) => set(s => ({
    items: s.items.map(i => i.id === id ? { ...i, checklist: { ...i.checklist, [key]: value } } : i)
  })),
}));
