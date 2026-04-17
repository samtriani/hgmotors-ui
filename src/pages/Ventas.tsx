import { useState, useMemo } from 'react';
import { useSalesStore } from '../store/salesStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCRMStore } from '../store/crmStore';
import { useAuthStore } from '../store/authStore';
import { useForm } from 'react-hook-form';
import { formatCurrency, getStatusColor, getStatusLabel } from '../utils';
import {
  Plus, X, DollarSign, Car, CheckCircle, FileText,
  Gauge, Palette, Settings, Fuel, TrendingUp,
  ArrowUpRight, Clock,
} from 'lucide-react';
import type { Sale, Car as CarType } from '../types';
import { MOCK_USERS } from '../mock/data';
import dayjs from 'dayjs';

const AGENT_COLORS: Record<string, string> = {
  u3: '#dc2626', u6: '#7c3aed', u7: '#d97706',
};

type SaleForm = Omit<Sale, 'id' | 'commission'>;
type FilterTab = 'TODAS' | 'COMPLETADA' | 'PENDIENTE_DOCS' | 'CANCELADA';

// ─── Modal nueva venta ────────────────────────────────────────────────────────
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
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Vendedor</label>
            <select {...register('sellerId')} className="input-field">
              {MOCK_USERS.filter(u => u.role === 'VENDEDOR').map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
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

// ─── Modal detalle auto ───────────────────────────────────────────────────────
function CarDetailModal({ car, onClose }: { car: CarType; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="card w-full max-w-lg relative z-10 animate-in overflow-hidden">
        <div className="relative h-52 bg-hg-muted overflow-hidden">
          <img src={car.image} alt={car.model} className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x200/1E2330/8892A4?text=Sin+Imagen'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-hg-card/90 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-hg-dark/80 rounded-lg flex items-center justify-center text-hg-light hover:text-white transition-colors">
            <X size={16} />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-bold text-xl">{car.brand} {car.model}</h2>
            <p className="text-hg-light text-sm">{car.version} · {car.year}</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-hg-white text-2xl font-bold font-mono">{formatCurrency(car.price)}</span>
            <span className="badge text-hg-text bg-hg-muted/40 border-hg-border">VIN: {car.vin}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Gauge,    label: 'Kilometraje', value: `${car.km.toLocaleString('es-MX')} km` },
              { icon: Palette,  label: 'Color',       value: car.color },
              { icon: Settings, label: 'Transmisión', value: car.transmission },
              { icon: Fuel,     label: 'Combustible', value: car.fuelType },
            ].map(item => (
              <div key={item.label} className="bg-hg-muted/30 rounded-lg p-3 flex items-center gap-2">
                <item.icon size={14} className="text-hg-text flex-shrink-0" />
                <div>
                  <p className="text-hg-text text-[10px] uppercase tracking-wider">{item.label}</p>
                  <p className="text-hg-white text-sm font-medium mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          {car.description && (
            <p className="text-hg-text text-sm leading-relaxed border-t border-hg-border pt-3 mt-4">{car.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ticket de venta ──────────────────────────────────────────────────────────
function SaleTicket({ sale, onCarClick }: { sale: Sale; onCarClick: (car: CarType) => void }) {
  const car = useInventoryStore(s => s.getCar(sale.carId));
  const client = useCRMStore(s => s.getClient(sale.clientId));
  const seller = MOCK_USERS.find(u => u.id === sale.sellerId);
  const sellerColor = seller ? (AGENT_COLORS[seller.id] ?? '#dc2626') : '#dc2626';

  const statusStyle: Record<string, string> = {
    COMPLETADA: 'border-l-emerald-500',
    PENDIENTE_DOCS: 'border-l-amber-400',
    CANCELADA: 'border-l-hg-red',
  };

  return (
    <div className={`card border-l-4 ${statusStyle[sale.status] ?? 'border-l-hg-red'} hover:border-hg-muted transition-all`}>
      <div className="flex items-start gap-4 p-4">
        {/* Car thumbnail */}
        <button
          onClick={() => car && onCarClick(car)}
          className="flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden bg-hg-muted relative group"
        >
          {car?.image ? (
            <img src={car.image} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96x64/1E2330/8892A4?text=Auto'; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car size={20} className="text-hg-muted" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Car size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-hg-text text-[10px] font-mono">#{sale.id.toUpperCase()}</p>
                <span className="text-hg-border">·</span>
                <p className="text-hg-text text-[10px]">{dayjs(sale.saleDate).format('DD MMM YYYY')}</p>
              </div>
              <h3 className="text-hg-white font-semibold text-sm mt-0.5">
                {car ? `${car.brand} ${car.model} ${car.year}` : 'Vehículo'}
              </h3>
              <p className="text-hg-text text-xs">{car?.version}</p>
            </div>
            <span className={`badge text-xs flex-shrink-0 ${getStatusColor(sale.status)}`}>{getStatusLabel(sale.status)}</span>
          </div>

          {/* Data grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-hg-muted/30 rounded-lg px-3 py-2">
              <p className="text-hg-text text-[10px] uppercase tracking-wider">Cliente</p>
              <p className="text-hg-white text-xs font-medium mt-0.5 truncate">{client?.name || '—'}</p>
            </div>
            <div className="bg-hg-muted/30 rounded-lg px-3 py-2">
              <p className="text-hg-text text-[10px] uppercase tracking-wider">Vendedor</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center border flex-shrink-0"
                  style={{ background: `${sellerColor}22`, borderColor: `${sellerColor}44`, color: sellerColor }}>
                  {seller?.avatar ?? '?'}
                </div>
                <p className="text-hg-white text-xs font-medium truncate">{seller?.name ?? '—'}</p>
              </div>
            </div>
            <div className="bg-hg-muted/30 rounded-lg px-3 py-2">
              <p className="text-hg-text text-[10px] uppercase tracking-wider">Precio Final</p>
              <p className="text-emerald-400 text-sm font-bold font-mono mt-0.5">{formatCurrency(sale.finalPrice)}</p>
            </div>
            <div className="bg-hg-muted/30 rounded-lg px-3 py-2">
              <p className="text-hg-text text-[10px] uppercase tracking-wider">Comisión · {sale.paymentMethod.replace('_', ' ')}</p>
              <p className="text-amber-400 text-xs font-bold font-mono mt-0.5">{formatCurrency(sale.commission)}</p>
            </div>
          </div>

          {sale.notes && (
            <p className="text-hg-text text-xs italic mt-2 truncate">{sale.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Ventas() {
  const { sales, addSale } = useSalesStore();
  const { updateCarStatus } = useInventoryStore();
  const { updateClientStatus } = useCRMStore();
  const [showModal, setShowModal] = useState(false);
  const [detailCar, setDetailCar] = useState<CarType | null>(null);
  const [tab, setTab] = useState<FilterTab>('TODAS');

  const completadas = sales.filter(s => s.status === 'COMPLETADA');
  const totalVentas = completadas.reduce((a, s) => a + s.finalPrice, 0);
  const totalComisiones = sales.reduce((a, s) => a + s.commission, 0);
  const docsPendientes = sales.filter(s => s.status === 'PENDIENTE_DOCS').length;
  // Filtrado
  const filtered = useMemo(() => {
    return sales.filter(s => {
      if (tab !== 'TODAS' && s.status !== tab) return false;
      return true;
    });
  }, [sales, tab]);

  const handleSave = (data: SaleForm) => {
    addSale({ ...data, commission: data.finalPrice * 0.02 });
    updateCarStatus(data.carId, 'VENDIDO');
    updateClientStatus(data.clientId, 'CERRADO');
    setShowModal(false);
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: 'TODAS', label: 'Todas' },
    { key: 'COMPLETADA', label: 'Completadas' },
    { key: 'PENDIENTE_DOCS', label: 'Docs Pendientes' },
    { key: 'CANCELADA', label: 'Canceladas' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-hg-white tracking-wider">VENTAS</h1>
          <p className="text-hg-text text-xs mt-0.5">{dayjs().format('MMMM YYYY')} · {completadas.length} ventas cerradas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />Nueva Venta
        </button>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10',
            label: 'Total Ventas', value: formatCurrency(totalVentas),
            sub: `${completadas.length} operaciones cerradas`, trend: '+12%',
          },
          {
            icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10',
            label: 'Autos Vendidos', value: completadas.length,
            sub: 'Operaciones del mes',
          },
          {
            icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10',
            label: 'Comisiones', value: formatCurrency(totalComisiones),
            sub: 'Total acumulado del mes',
          },
          {
            icon: FileText, color: 'text-hg-red', bg: 'bg-hg-red/10',
            label: 'Docs Pendientes', value: docsPendientes,
            sub: docsPendientes > 0 ? 'Requieren atención' : 'Todo en orden',
          },
        ].map(card => (
          <div key={card.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon size={20} className={card.color} />
              </div>
              {card.trend && (
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                  <ArrowUpRight size={12} />{card.trend}
                </span>
              )}
            </div>
            <p className="text-hg-text text-xs uppercase tracking-wider mt-3">{card.label}</p>
            <p className="text-hg-white text-xl font-bold font-mono">{card.value}</p>
            <p className="text-hg-text text-[11px] mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filtros ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1 bg-hg-card border border-hg-border rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t.key
                  ? 'bg-hg-red text-white'
                  : 'text-hg-text hover:text-hg-light'
              }`}
            >
              {t.label}
              {t.key !== 'TODAS' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {sales.filter(s => s.status === t.key).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="text-hg-text text-xs ml-auto">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* ── Lista de ventas ── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Clock size={32} className="text-hg-muted mx-auto mb-3" />
            <p className="text-hg-text">No hay ventas en esta categoría.</p>
          </div>
        ) : (
          filtered.map(sale => <SaleTicket key={sale.id} sale={sale} onCarClick={setDetailCar} />)
        )}
      </div>

      {showModal && <SaleModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {detailCar && <CarDetailModal car={detailCar} onClose={() => setDetailCar(null)} />}
    </div>
  );
}
