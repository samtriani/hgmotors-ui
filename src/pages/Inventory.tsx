import { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { useForm } from 'react-hook-form';
import { formatCurrency, formatNumber, getDaysInInventory, getInventoryBadge, getStatusColor, getStatusLabel } from '../utils';
import { Plus, Search, X, Filter, ExternalLink, Edit2, Trash2, MessageCircle } from 'lucide-react';
import type { Car, CarStatus } from '../types';
import dayjs from 'dayjs';

const STATUS_FILTERS: { value: CarStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'DISPONIBLE', label: 'Disponibles' },
  { value: 'RESERVADO', label: 'Reservados' },
  { value: 'EN_TALLER', label: 'En Taller' },
  { value: 'VENDIDO', label: 'Vendidos' },
];

type CarForm = Omit<Car, 'id'>;

function CarModal({ car, onClose, onSave }: {
  car?: Car; onClose: () => void; onSave: (data: CarForm) => void;
}) {
  const { register, handleSubmit } = useForm<CarForm>({
    defaultValues: car || {
      brand: '', model: '', version: '', year: new Date().getFullYear(),
      price: 0, km: 0, status: 'DISPONIBLE', image: '', color: '',
      vin: '', entryDate: dayjs().format('YYYY-MM-DD'),
      fuelType: 'Gasolina', transmission: 'Automática', description: ''
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in">
        <div className="flex items-center justify-between p-5 border-b border-hg-border">
          <h2 className="text-hg-white font-semibold">{car ? 'Editar Auto' : 'Agregar Auto al Inventario'}</h2>
          <button onClick={onClose} className="text-hg-text hover:text-hg-light"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSave)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Marca *</label>
              <input {...register('brand', { required: true })} className="input-field" placeholder="Toyota, Honda..." />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Modelo *</label>
              <input {...register('model', { required: true })} className="input-field" placeholder="Corolla, Civic..." />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Versión</label>
              <input {...register('version')} className="input-field" placeholder="LT, EX, Touring..." />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Año *</label>
              <input {...register('year', { valueAsNumber: true, required: true })} type="number" className="input-field" />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Color</label>
              <input {...register('color')} className="input-field" placeholder="Blanco, Negro..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Precio (MXN) *</label>
              <input {...register('price', { valueAsNumber: true, required: true })} type="number" className="input-field" />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Kilometraje</label>
              <input {...register('km', { valueAsNumber: true })} type="number" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Transmisión</label>
              <select {...register('transmission')} className="input-field">
                <option>Automática</option>
                <option>Manual</option>
                <option>CVT</option>
              </select>
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Combustible</label>
              <select {...register('fuelType')} className="input-field">
                <option>Gasolina</option>
                <option>Diesel</option>
                <option>Híbrido</option>
                <option>Eléctrico</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">VIN / Folio</label>
              <input {...register('vin')} className="input-field" placeholder="Número de serie" />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Fecha Ingreso</label>
              <input {...register('entryDate')} type="date" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">URL Imagen</label>
            <input {...register('image')} className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Estatus</label>
            <select {...register('status')} className="input-field">
              <option value="DISPONIBLE">Disponible</option>
              <option value="RESERVADO">Reservado</option>
              <option value="EN_TALLER">En Taller</option>
              <option value="VENDIDO">Vendido</option>
            </select>
          </div>
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">Descripción</label>
            <textarea {...register('description')} className="input-field resize-none h-20" placeholder="Equipamiento, detalles..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">
              <Plus size={16} />{car ? 'Actualizar' : 'Agregar Auto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CarDetailModal({ car, onClose, onEdit }: { car: Car; onClose: () => void; onEdit: () => void }) {
  const days = getDaysInInventory(car.entryDate);
  const badge = getInventoryBadge(days);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="card w-full max-w-lg relative z-10 animate-in overflow-hidden">
        <div className="relative h-52 bg-hg-muted overflow-hidden">
          <img src={car.image} alt={car.model} className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/500x200/1E2330/8892A4?text=Sin+Imagen'; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-hg-card/90 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-hg-dark/80 rounded-lg flex items-center justify-center text-hg-light hover:text-white"><X size={16} /></button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white font-bold text-xl">{car.brand} {car.model}</h2>
            <p className="text-hg-light text-sm">{car.version} · {car.year}</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-hg-white text-2xl font-bold font-mono">{formatCurrency(car.price)}</span>
            <div className="flex gap-2">
              <span className={`badge ${getStatusColor(car.status)}`}>{getStatusLabel(car.status)}</span>
              <span className={`badge ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Kilometraje', value: `${formatNumber(car.km)} km` },
              { label: 'Color', value: car.color },
              { label: 'Transmisión', value: car.transmission },
              { label: 'Combustible', value: car.fuelType },
              { label: 'VIN', value: car.vin },
              { label: 'Ingresó', value: dayjs(car.entryDate).format('DD/MM/YYYY') },
            ].map(item => (
              <div key={item.label} className="bg-hg-muted/30 rounded-lg p-3">
                <p className="text-hg-text text-[10px] uppercase tracking-wider">{item.label}</p>
                <p className="text-hg-white text-sm font-medium mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
          {car.description && (
            <p className="text-hg-text text-sm mb-4 leading-relaxed">{car.description}</p>
          )}
          <div className="flex gap-2">
            <button onClick={onEdit} className="btn-secondary flex-1"><Edit2 size={14} />Editar</button>
            <a
              href={`https://api.whatsapp.com/send?phone=5216699942914&text=Hola! Me interesa el ${car.brand} ${car.model} ${car.year} · ${formatCurrency(car.price)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-400 text-sm font-medium px-4 py-2 rounded-lg transition-all flex-1 justify-center"
            >
              <MessageCircle size={14} />WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const { cars, addCar, updateCar, deleteCar } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CarStatus | 'ALL'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | undefined>();
  const [detailCar, setDetailCar] = useState<Car | undefined>();

  const filtered = cars.filter(car => {
    const matchSearch = !search || `${car.brand} ${car.model} ${car.version} ${car.year}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || car.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSave = (data: CarForm) => {
    if (selectedCar) updateCar(selectedCar.id, data);
    else addCar(data);
    setShowModal(false);
    setSelectedCar(undefined);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f.value ? 'bg-hg-red text-white' : 'bg-hg-muted/50 text-hg-text hover:text-hg-light'}`}
            >
              {f.label} {f.value !== 'ALL' && <span className="ml-1 opacity-60">{cars.filter(c => c.status === f.value).length}</span>}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hg-text" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 h-9"
              placeholder="Buscar marca, modelo..."
            />
          </div>
          <button
            onClick={() => { setSelectedCar(undefined); setShowModal(true); }}
            className="btn-primary whitespace-nowrap"
          >
            <Plus size={16} />Agregar
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-hg-text text-xs">{filtered.length} vehículos encontrados</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(car => {
          const days = getDaysInInventory(car.entryDate);
          const badge = getInventoryBadge(days);
          return (
            <div
              key={car.id}
              className="card overflow-hidden hover:border-hg-muted cursor-pointer transition-all group"
              onClick={() => setDetailCar(car)}
            >
              <div className="relative h-40 bg-hg-muted overflow-hidden">
                <img
                  src={car.image}
                  alt={car.model}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x160/1E2330/8892A4?text=Sin+Imagen'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hg-card/80 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className={`badge text-[10px] ${getStatusColor(car.status)}`}>{getStatusLabel(car.status)}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-hg-white font-semibold text-sm leading-tight">{car.brand} {car.model}</h3>
                <p className="text-hg-text text-xs">{car.version} · {car.year} · {formatNumber(car.km)} km</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-hg-white font-bold font-mono text-sm">{formatCurrency(car.price)}</span>
                    <span className={`badge text-[10px] ${badge.color}`}>{badge.label}</span>
                  </div>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelectedCar(car); setShowModal(true); }}
                      className="w-7 h-7 rounded-md bg-hg-muted/50 hover:bg-hg-muted text-hg-text hover:text-hg-light flex items-center justify-center transition-all"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => { if (confirm(`¿Eliminar ${car.brand} ${car.model}?`)) deleteCar(car.id); }}
                      className="w-7 h-7 rounded-md bg-hg-red/10 hover:bg-hg-red/20 text-hg-red flex items-center justify-center transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Filter size={32} className="text-hg-muted mx-auto mb-3" />
          <p className="text-hg-text">No se encontraron vehículos con los filtros aplicados.</p>
        </div>
      )}

      {showModal && (
        <CarModal
          car={selectedCar}
          onClose={() => { setShowModal(false); setSelectedCar(undefined); }}
          onSave={handleSave}
        />
      )}
      {detailCar && (
        <CarDetailModal
          car={detailCar}
          onClose={() => setDetailCar(undefined)}
          onEdit={() => { setSelectedCar(detailCar); setDetailCar(undefined); setShowModal(true); }}
        />
      )}
    </div>
  );
}
