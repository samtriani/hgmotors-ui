import { useState } from 'react';
import { useSalesStore } from '../store/salesStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCRMStore } from '../store/crmStore';
import { useAuthStore } from '../store/authStore';
import { useForm } from 'react-hook-form';
import { formatCurrency, getStatusColor, getStatusLabel } from '../utils';
import { Plus, X, DollarSign, Car, User, CheckCircle, FileText } from 'lucide-react';
import type { Sale } from '../types';
import dayjs from 'dayjs';

type SaleForm = Omit<Sale, 'id' | 'commission'>;

function SaleModal({ onClose, onSave }: { onClose: () => void; onSave: (data: SaleForm) => void }) {
  const cars = useInventoryStore(s => s.cars.filter(c => c.status === 'DISPONIBLE' || c.status === 'RESERVADO'));
  const clients = useCRMStore(s => s.clients);
  const user = useAuthStore(s => s.user);
  const { register, handleSubmit, watch } = useForm<SaleForm>({
    defaultValues: { sellerId: user?.id || 'u3', paymentMethod: 'CONTADO', status: 'COMPLETADA', saleDate: dayjs().format('YYYY-MM-DD'), notes: '' }
  });

  const carId = watch('carId');
  const selectedCar = cars.find(c => c.id === carId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto relative z-10 animate-in">
        <div className="flex items-center justify-between p-5 border-b border-hg-border">
          <h2 className="text-hg-white font-semibold">Registrar Nueva Venta</h2>
          <button onClick={onClose} className="text-hg-text hover:text-hg-light"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSave)} className="p-5 space-y-4">
          {selectedCar && (
            <div className="flex items-center gap-3 bg-hg-muted/30 rounded-xl p-3 border border-hg-border">
              <img src={selectedCar.image} alt={selectedCar.model} className="w-16 h-12 object-cover rounded-lg"
                onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x48/1E2330/8892A4?text=Auto'; }} />
              <div>
                <p className="text-hg-white font-semibold">{selectedCar.brand} {selectedCar.model} {selectedCar.year}</p>
                <p className="text-emerald-400 font-mono font-bold">{formatCurrency(selectedCar.price)}</p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Vehículo *</label>
            <select {...register('carId', { required: true })} className="input-field">
              <option value="">Seleccionar auto...</option>
              {cars.map(c => <option key={c.id} value={c.id}>{c.brand} {c.model} {c.version} {c.year} · {formatCurrency(c.price)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Cliente *</label>
            <select {...register('clientId', { required: true })} className="input-field">
              <option value="">Seleccionar cliente...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Precio Final (MXN) *</label>
              <input {...register('finalPrice', { valueAsNumber: true, required: true })} type="number" className="input-field" placeholder={selectedCar?.price.toString()} />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Forma de Pago</label>
              <select {...register('paymentMethod')} className="input-field">
                <option value="CONTADO">Contado</option>
                <option value="CREDITO">Crédito</option>
                <option value="ENGANCHE_CREDITO">Enganche + Crédito</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Fecha de Venta</label>
              <input {...register('saleDate')} type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Estatus</label>
              <select {...register('status')} className="input-field">
                <option value="COMPLETADA">Completada</option>
                <option value="PENDIENTE_DOCS">Docs Pendientes</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Notas</label>
            <textarea {...register('notes')} className="input-field resize-none h-16" placeholder="Observaciones de la venta..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary"><CheckCircle size={16} />Registrar Venta</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SaleTicket({ sale }: { sale: Sale }) {
  const car = useInventoryStore(s => s.getCar(sale.carId));
  const client = useCRMStore(s => s.getClient(sale.clientId));
  return (
    <div className="card p-5 border-l-4 border-l-hg-red hover:border-hg-muted transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-hg-text text-xs font-mono">#{sale.id.toUpperCase()}</p>
          <h3 className="text-hg-white font-semibold mt-0.5">
            {car ? `${car.brand} ${car.model} ${car.year}` : 'Vehículo'}
          </h3>
          <p className="text-hg-text text-xs">{car?.version}</p>
        </div>
        <span className={`badge ${getStatusColor(sale.status)}`}>{getStatusLabel(sale.status)}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div className="bg-hg-muted/30 rounded-lg p-3">
          <p className="text-hg-text text-[10px] uppercase tracking-wider">Cliente</p>
          <p className="text-hg-white text-xs font-medium mt-0.5 truncate">{client?.name || '—'}</p>
        </div>
        <div className="bg-hg-muted/30 rounded-lg p-3">
          <p className="text-hg-text text-[10px] uppercase tracking-wider">Precio Final</p>
          <p className="text-emerald-400 text-sm font-bold font-mono mt-0.5">{formatCurrency(sale.finalPrice)}</p>
        </div>
        <div className="bg-hg-muted/30 rounded-lg p-3">
          <p className="text-hg-text text-[10px] uppercase tracking-wider">Comisión</p>
          <p className="text-amber-400 text-xs font-bold font-mono mt-0.5">{formatCurrency(sale.commission)}</p>
        </div>
        <div className="bg-hg-muted/30 rounded-lg p-3">
          <p className="text-hg-text text-[10px] uppercase tracking-wider">Pago</p>
          <p className="text-hg-white text-xs font-medium mt-0.5">{sale.paymentMethod.replace('_', ' ')}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-hg-text text-xs">{dayjs(sale.saleDate).format('DD/MM/YYYY')}</span>
        {sale.notes && <p className="text-hg-text text-xs italic truncate max-w-[200px]">{sale.notes}</p>}
      </div>
    </div>
  );
}

export default function Ventas() {
  const { sales, addSale } = useSalesStore();
  const { updateCarStatus } = useInventoryStore();
  const { updateClientStatus } = useCRMStore();
  const [showModal, setShowModal] = useState(false);

  const totalVentas = sales.filter(s => s.status === 'COMPLETADA').reduce((a, s) => a + s.finalPrice, 0);
  const totalComisiones = sales.reduce((a, s) => a + s.commission, 0);

  const handleSave = (data: SaleForm) => {
    const commission = data.finalPrice * 0.02;
    addSale({ ...data, commission });
    updateCarStatus(data.carId, 'VENDIDO');
    updateClientStatus(data.clientId, 'CERRADO');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
            <DollarSign size={20} className="text-emerald-400" />
          </div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Total Ventas</p>
          <p className="text-hg-white text-xl font-bold font-mono">{formatCurrency(totalVentas)}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
            <Car size={20} className="text-amber-400" />
          </div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Autos Vendidos</p>
          <p className="text-hg-white text-xl font-bold font-mono">{sales.filter(s=>s.status==='COMPLETADA').length}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-violet-400/10 flex items-center justify-center">
            <User size={20} className="text-violet-400" />
          </div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Comisiones</p>
          <p className="text-hg-white text-xl font-bold font-mono">{formatCurrency(totalComisiones)}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-hg-red/10 flex items-center justify-center">
            <FileText size={20} className="text-hg-red" />
          </div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Docs Pendientes</p>
          <p className="text-hg-white text-xl font-bold font-mono">{sales.filter(s=>s.status==='PENDIENTE_DOCS').length}</p>
        </div>
      </div>

      {/* Add button */}
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />Nueva Venta
        </button>
      </div>

      {/* Sales list */}
      <div className="space-y-3">
        {sales.length === 0 ? (
          <div className="card p-12 text-center">
            <DollarSign size={32} className="text-hg-muted mx-auto mb-3" />
            <p className="text-hg-text">No hay ventas registradas aún.</p>
          </div>
        ) : (
          sales.map(sale => <SaleTicket key={sale.id} sale={sale} />)
        )}
      </div>

      {showModal && (
        <SaleModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}
    </div>
  );
}
