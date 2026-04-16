import { useState } from 'react';
import { useWorkshopStore } from '../store/workshopStore';
import { useInventoryStore } from '../store/inventoryStore';
import { formatCurrency, getStatusColor, getStatusLabel } from '../utils';
import { Wrench, CheckSquare, Square, Plus, X, DollarSign } from 'lucide-react';
import type { WorkshopItem } from '../types';
import dayjs from 'dayjs';

const CHECKLIST_LABELS: Record<keyof WorkshopItem['checklist'], string> = {
  motor: '🔧 Motor y mecánica',
  frenos: '⏸️ Sistema de frenos',
  estetica: '🎨 Estética y pintura',
  llantas: '⭕ Llantas y rines',
  electricidad: '⚡ Sistema eléctrico',
  ac: '❄️ Aire acondicionado',
  documentacion: '📄 Documentación',
};

function WorkshopCard({ item, onUpdate, onChecklist }: {
  item: WorkshopItem;
  onUpdate: (id: string, data: Partial<WorkshopItem>) => void;
  onChecklist: (id: string, key: keyof WorkshopItem['checklist'], val: boolean) => void;
}) {
  const car = useInventoryStore(s => s.getCar(item.carId));
  const checkedCount = Object.values(item.checklist).filter(Boolean).length;
  const totalCount = Object.keys(item.checklist).length;
  const progress = Math.round((checkedCount / totalCount) * 100);

  return (
    <div className="card overflow-hidden">
      {/* Car header */}
      <div className="flex items-center gap-3 p-4 border-b border-hg-border">
        {car && (
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-hg-muted flex-shrink-0">
            <img src={car.image} alt={car.model} className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x48/1E2330/8892A4?text=Auto'; }} />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-hg-white font-semibold">{car ? `${car.brand} ${car.model} ${car.year}` : 'Vehículo'}</h3>
          <p className="text-hg-text text-xs">{car?.version} · VIN: {car?.vin}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <select
            value={item.status}
            onChange={e => onUpdate(item.id, { status: e.target.value as WorkshopItem['status'] })}
            className={`badge border cursor-pointer bg-transparent text-xs ${getStatusColor(item.status)}`}
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="COMPLETADO">Completado</option>
          </select>
          <span className="text-hg-text text-xs">{dayjs(item.startDate).format('DD/MM/YYYY')}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-hg-text text-xs">Progreso de preparación</span>
            <span className="text-hg-white text-xs font-mono font-bold">{checkedCount}/{totalCount} · {progress}%</span>
          </div>
          <div className="h-2 bg-hg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-400' : 'hg-gradient'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {(Object.entries(item.checklist) as [keyof WorkshopItem['checklist'], boolean][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => onChecklist(item.id, key, !val)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                val ? 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400' : 'bg-hg-muted/30 border border-hg-border text-hg-text hover:text-hg-light'
              }`}
            >
              {val ? <CheckSquare size={14} className="flex-shrink-0" /> : <Square size={14} className="flex-shrink-0" />}
              <span className="text-xs">{CHECKLIST_LABELS[key]}</span>
            </button>
          ))}
        </div>

        {/* Cost */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-hg-text text-xs">
            <DollarSign size={14} className="text-amber-400" />
            <span>Costo de preparación:</span>
          </div>
          <input
            type="number"
            value={item.cost || ''}
            onChange={e => onUpdate(item.id, { cost: Number(e.target.value) })}
            className="input-field w-36 h-8 text-xs font-mono"
            placeholder="0"
          />
          <span className="text-amber-400 font-mono text-sm font-bold">{item.cost > 0 ? formatCurrency(item.cost) : ''}</span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-hg-text text-xs mb-1.5 uppercase tracking-wider">Notas del taller</label>
          <textarea
            value={item.notes}
            onChange={e => onUpdate(item.id, { notes: e.target.value })}
            className="input-field resize-none h-16 text-xs"
            placeholder="Observaciones, refacciones requeridas..."
          />
        </div>
      </div>
    </div>
  );
}

function AddWorkshopModal({ onClose, onSave }: { onClose: () => void; onSave: (carId: string) => void }) {
  const cars = useInventoryStore(s => s.cars.filter(c => c.status !== 'VENDIDO'));
  const [carId, setCarId] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="card w-full max-w-sm relative z-10 animate-in p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-hg-white font-semibold">Agregar al Taller</h2>
          <button onClick={onClose} className="text-hg-text hover:text-hg-light"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Vehículo</label>
            <select value={carId} onChange={e => setCarId(e.target.value)} className="input-field">
              <option value="">Seleccionar...</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} {c.year}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={() => { if (carId) { onSave(carId); onClose(); } }} disabled={!carId} className="btn-primary flex-1">
              <Plus size={14} />Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Taller() {
  const { items, addItem, updateItem, updateChecklist } = useWorkshopStore();
  const { updateCarStatus } = useInventoryStore();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'ALL' | WorkshopItem['status']>('ALL');

  const filtered = items.filter(i => filter === 'ALL' || i.status === filter);
  const totalCost = items.reduce((a, i) => a + i.cost, 0);

  const handleAdd = (carId: string) => {
    addItem({
      carId, assignedTo: 'u4',
      startDate: dayjs().format('YYYY-MM-DD'),
      checklist: { motor: false, frenos: false, estetica: false, llantas: false, electricidad: false, ac: false, documentacion: false },
      cost: 0, notes: '', status: 'PENDIENTE'
    });
    updateCarStatus(carId, 'EN_TALLER');
  };

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center"><Wrench size={20} className="text-blue-400" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">En Proceso</p>
          <p className="text-hg-white text-xl font-bold font-mono">{items.filter(i=>i.status==='EN_PROCESO').length}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center"><Wrench size={20} className="text-amber-400" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Pendientes</p>
          <p className="text-hg-white text-xl font-bold font-mono">{items.filter(i=>i.status==='PENDIENTE').length}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center"><CheckSquare size={20} className="text-emerald-400" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Completados</p>
          <p className="text-hg-white text-xl font-bold font-mono">{items.filter(i=>i.status==='COMPLETADO').length}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-hg-red/10 flex items-center justify-center"><DollarSign size={20} className="text-hg-red" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Costo Total</p>
          <p className="text-hg-white text-xl font-bold font-mono">{formatCurrency(totalCost)}</p>
        </div>
      </div>

      {/* Filters & add */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(['ALL', 'PENDIENTE', 'EN_PROCESO', 'COMPLETADO'] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-hg-red text-white' : 'bg-hg-muted/50 text-hg-text hover:text-hg-light'}`}>
              {s === 'ALL' ? 'Todos' : getStatusLabel(s)} {s !== 'ALL' && `(${items.filter(i=>i.status===s).length})`}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />Agregar al Taller
        </button>
      </div>

      {/* Workshop items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(item => (
          <WorkshopCard key={item.id} item={item} onUpdate={updateItem} onChecklist={updateChecklist} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Wrench size={32} className="text-hg-muted mx-auto mb-3" />
          <p className="text-hg-text">No hay vehículos en taller con este filtro.</p>
        </div>
      )}

      {showModal && <AddWorkshopModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  );
}
