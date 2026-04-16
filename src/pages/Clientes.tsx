import { useState } from 'react';
import { useCRMStore } from '../store/crmStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useForm } from 'react-hook-form';
import { getStatusColor, getStatusLabel, formatCurrency } from '../utils';
import { Plus, Search, X, MessageCircle, User, Phone, Mail, Columns, List } from 'lucide-react';
import type { Client, ClientStatus } from '../types';
import dayjs from 'dayjs';

const STATUSES: ClientStatus[] = ['NUEVO', 'SEGUIMIENTO', 'NEGOCIACION', 'CERRADO'];
type ClientForm = Omit<Client, 'id' | 'createdAt'>;

function ClientModal({ client, onClose, onSave }: {
  client?: Client; onClose: () => void; onSave: (data: ClientForm) => void;
}) {
  const cars = useInventoryStore(s => s.cars);
  const { register, handleSubmit } = useForm<ClientForm>({
    defaultValues: client || { name: '', phone: '', email: '', status: 'NUEVO', assignedTo: 'u3', budget: undefined, notes: '', source: 'WhatsApp' }
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto relative z-10 animate-in">
        <div className="flex items-center justify-between p-5 border-b border-hg-border">
          <h2 className="text-hg-white font-semibold">{client ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <button onClick={onClose} className="text-hg-text hover:text-hg-light"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSave)} className="p-5 space-y-4">
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Nombre Completo *</label>
            <input {...register('name', { required: true })} className="input-field" placeholder="Nombre del cliente" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Teléfono</label>
              <input {...register('phone')} className="input-field" placeholder="669 123 4567" />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Email</label>
              <input {...register('email')} type="email" className="input-field" placeholder="correo@email.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Estatus</label>
              <select {...register('status')} className="input-field">
                {STATUSES.map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                <option value="PERDIDO">Perdido</option>
              </select>
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Fuente</label>
              <select {...register('source')} className="input-field">
                {['WhatsApp', 'Instagram', 'Facebook', 'Google', 'Página web', 'Referido', 'Visita directa'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Presupuesto (MXN)</label>
              <input {...register('budget', { valueAsNumber: true })} type="number" className="input-field" placeholder="400000" />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Auto de interés</label>
              <select {...register('interestedIn')} className="input-field">
                <option value="">Sin especificar</option>
                {cars.filter(c => c.status !== 'VENDIDO').map(c => (
                  <option key={c.id} value={c.id}>{c.brand} {c.model} {c.year}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Notas</label>
            <textarea {...register('notes')} className="input-field resize-none h-20" placeholder="Detalles importantes del cliente..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary"><Plus size={16} />{client ? 'Actualizar' : 'Crear Cliente'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientCard({ client, onClick, onMove }: {
  client: Client; onClick: () => void; onMove: (status: ClientStatus) => void;
}) {
  const car = useInventoryStore(s => s.getCar(client.interestedIn || ''));
  return (
    <div onClick={onClick} className="card p-4 cursor-pointer hover:border-hg-muted transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hg-muted flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-hg-text" />
          </div>
          <div>
            <p className="text-hg-white text-sm font-medium leading-tight">{client.name}</p>
            <p className="text-hg-text text-xs">{client.source}</p>
          </div>
        </div>
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-hg-text text-xs">
          <Phone size={10} /><span>{client.phone}</span>
        </div>
        {client.budget && (
          <div className="flex items-center gap-2 text-hg-text text-xs">
            <span className="text-hg-light font-mono">Presup: {formatCurrency(client.budget)}</span>
          </div>
        )}
        {car && <p className="text-xs text-blue-400 truncate">🚗 {car.brand} {car.model} {car.year}</p>}
      </div>
      {client.notes && <p className="text-hg-text text-xs line-clamp-2 mb-3">{client.notes}</p>}
      <div className="flex items-center justify-between">
        <span className="text-hg-text/50 text-[10px]">{dayjs(client.createdAt).format('DD/MM')}</span>
        <a
          href={`https://api.whatsapp.com/send?phone=52${client.phone.replace(/\D/g,'')}&text=Hola ${client.name.split(' ')[0]}, le contacto de HG Motors!`}
          target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="w-6 h-6 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 flex items-center justify-center transition-all"
        >
          <MessageCircle size={12} />
        </a>
      </div>
    </div>
  );
}

export default function Clientes() {
  const { clients, addClient, updateClient, updateClientStatus } = useCRMStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const handleSave = (data: Omit<Client, 'id' | 'createdAt'>) => {
    if (selectedClient) updateClient(selectedClient.id, data);
    else addClient(data);
    setShowModal(false);
    setSelectedClient(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setView('kanban')} className={`btn-${view === 'kanban' ? 'primary' : 'secondary'}`}>
            <Columns size={14} />Kanban
          </button>
          <button onClick={() => setView('list')} className={`btn-${view === 'list' ? 'primary' : 'secondary'}`}>
            <List size={14} />Lista
          </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hg-text" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 h-9" placeholder="Buscar cliente..." />
          </div>
          <button onClick={() => { setSelectedClient(undefined); setShowModal(true); }} className="btn-primary whitespace-nowrap">
            <Plus size={16} />Nuevo
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
          {STATUSES.map(status => {
            const colClients = filtered.filter(c => c.status === status);
            const headerColors: Record<ClientStatus, string> = {
              NUEVO: 'border-cyan-400/50 text-cyan-400',
              SEGUIMIENTO: 'border-amber-400/50 text-amber-400',
              NEGOCIACION: 'border-violet-400/50 text-violet-400',
              CERRADO: 'border-emerald-400/50 text-emerald-400',
              PERDIDO: 'border-hg-border text-hg-text',
            };
            return (
              <div key={status} className="bg-hg-muted/20 rounded-xl border border-hg-border min-w-[260px]">
                <div className={`flex items-center justify-between p-3 border-b ${headerColors[status]}`}>
                  <span className="font-semibold text-sm">{getStatusLabel(status)}</span>
                  <span className="badge text-xs bg-current/10 border-current/20">{colClients.length}</span>
                </div>
                <div className="p-2 space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto">
                  {colClients.map(client => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onClick={() => { setSelectedClient(client); setShowModal(true); }}
                      onMove={(s) => updateClientStatus(client.id, s)}
                    />
                  ))}
                  {colClients.length === 0 && (
                    <div className="text-center py-6 text-hg-text/40 text-xs">Sin clientes</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hg-border">
                {['Cliente', 'Contacto', 'Estatus', 'Fuente', 'Presupuesto', 'Fecha', 'Acción'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-hg-text text-xs font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => (
                <tr key={client.id} className="table-row">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-hg-white font-medium">{client.name}</p>
                      <p className="text-hg-text text-xs">{client.notes.slice(0, 40)}...</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-0.5">
                      <p className="text-hg-light text-xs flex items-center gap-1"><Phone size={10} />{client.phone}</p>
                      <p className="text-hg-text text-xs flex items-center gap-1"><Mail size={10} />{client.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={client.status}
                      onChange={e => updateClientStatus(client.id, e.target.value as ClientStatus)}
                      className={`badge border cursor-pointer bg-transparent ${getStatusColor(client.status)}`}
                      onClick={e => e.stopPropagation()}
                    >
                      {[...STATUSES, 'PERDIDO' as ClientStatus].map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-hg-text text-xs">{client.source}</td>
                  <td className="py-3 px-4 text-hg-light font-mono text-xs">{client.budget ? formatCurrency(client.budget) : '—'}</td>
                  <td className="py-3 px-4 text-hg-text text-xs">{dayjs(client.createdAt).format('DD/MM/YY')}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedClient(client); setShowModal(true); }}
                        className="w-7 h-7 rounded bg-hg-muted hover:bg-hg-border text-hg-text hover:text-hg-light flex items-center justify-center transition-all">
                        <User size={12} />
                      </button>
                      <a href={`https://api.whatsapp.com/send?phone=52${client.phone.replace(/\D/g,'')}&text=Hola ${client.name.split(' ')[0]}, le contacto de HG Motors!`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 flex items-center justify-center transition-all">
                        <MessageCircle size={12} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-hg-text">No se encontraron clientes.</div>
          )}
        </div>
      )}

      {showModal && (
        <ClientModal
          client={selectedClient}
          onClose={() => { setShowModal(false); setSelectedClient(undefined); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
