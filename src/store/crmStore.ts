import { create } from 'zustand';
import type { Client, ClientStatus } from '../types';
import { MOCK_CLIENTS } from '../mock/data';

interface CRMState {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  updateClientStatus: (id: string, status: ClientStatus) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
}

export const useCRMStore = create<CRMState>()((set, get) => ({
  clients: MOCK_CLIENTS,
  addClient: (client) => set(s => ({
    clients: [...s.clients, { ...client, id: `cl${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] }]
  })),
  updateClient: (id, data) => set(s => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...data } : c) })),
  updateClientStatus: (id, status) => set(s => ({ clients: s.clients.map(c => c.id === id ? { ...c, status } : c) })),
  deleteClient: (id) => set(s => ({ clients: s.clients.filter(c => c.id !== id) })),
  getClient: (id) => get().clients.find(c => c.id === id),
}));
