import { useSalesStore } from '../store/salesStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCRMStore } from '../store/crmStore';
import { formatCurrency, getStatusColor, getStatusLabel } from '../utils';
import { FileText, AlertTriangle, CheckCircle, Clock, DollarSign, Car } from 'lucide-react';
import dayjs from 'dayjs';

const DOC_ITEMS = [
  { id: 'doc1', label: 'Factura / Carta de Cesión', status: 'PENDIENTE' },
  { id: 'doc2', label: 'Verificación Vehicular', status: 'LISTO' },
  { id: 'doc3', label: 'Tenencia al Corriente', status: 'LISTO' },
  { id: 'doc4', label: 'Contrato de Compraventa', status: 'PENDIENTE' },
  { id: 'doc5', label: 'Póliza de Garantía', status: 'LISTO' },
];

export default function Administracion() {
  const sales = useSalesStore(s => s.sales);
  const cars = useInventoryStore(s => s.cars);
  const clients = useCRMStore(s => s.clients);

  const pendingDocs = sales.filter(s => s.status === 'PENDIENTE_DOCS');
  const completed = sales.filter(s => s.status === 'COMPLETADA');
  const totalRevenue = completed.reduce((a, s) => a + s.finalPrice, 0);
  const totalCommissions = sales.reduce((a, s) => a + s.commission, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center"><DollarSign size={20} className="text-emerald-400" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Ingresos Totales</p>
          <p className="text-hg-white text-xl font-bold font-mono">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center"><Clock size={20} className="text-amber-400" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Docs Pendientes</p>
          <p className="text-hg-white text-xl font-bold font-mono">{pendingDocs.length}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-violet-400/10 flex items-center justify-center"><Car size={20} className="text-violet-400" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Total Inventario</p>
          <p className="text-hg-white text-xl font-bold font-mono">{formatCurrency(cars.filter(c=>c.status!=='VENDIDO').reduce((a,c)=>a+c.price,0))}</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-xl bg-hg-red/10 flex items-center justify-center"><FileText size={20} className="text-hg-red" /></div>
          <p className="text-hg-text text-xs uppercase tracking-wider mt-3">Comisiones</p>
          <p className="text-hg-white text-xl font-bold font-mono">{formatCurrency(totalCommissions)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending docs sales */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-hg-white font-semibold">Ventas con Docs Pendientes</h3>
          </div>
          {pendingDocs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-hg-text text-sm">¡Todo al corriente!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingDocs.map(sale => {
                const car = cars.find(c => c.id === sale.carId);
                const client = clients.find(c => c.id === sale.clientId);
                return (
                  <div key={sale.id} className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-hg-white text-sm font-medium">
                        {car ? `${car.brand} ${car.model} ${car.year}` : 'Vehículo'}
                      </span>
                      <span className={`badge ${getStatusColor(sale.status)}`}>{getStatusLabel(sale.status)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-hg-text">{client?.name}</span>
                      <span className="text-emerald-400 font-mono">{formatCurrency(sale.finalPrice)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {DOC_ITEMS.map(doc => (
                        <span key={doc.id} className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border ${
                          doc.status === 'LISTO' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                        }`}>
                          {doc.status === 'LISTO' ? <CheckCircle size={9} /> : <Clock size={9} />}
                          {doc.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All sales list */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-hg-red" />
            <h3 className="text-hg-white font-semibold">Historial de Ventas</h3>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sales.map(sale => {
              const car = cars.find(c => c.id === sale.carId);
              const client = clients.find(c => c.id === sale.clientId);
              return (
                <div key={sale.id} className="flex items-center justify-between py-2.5 border-b border-hg-border last:border-0">
                  <div>
                    <p className="text-hg-white text-sm font-medium">
                      {car ? `${car.brand} ${car.model} ${car.year}` : 'Vehículo'}
                    </p>
                    <p className="text-hg-text text-xs">{client?.name} · {dayjs(sale.saleDate).format('DD/MM/YYYY')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-hg-white font-mono text-sm">{formatCurrency(sale.finalPrice)}</span>
                    <span className={`badge ${getStatusColor(sale.status)}`}>{getStatusLabel(sale.status)}</span>
                  </div>
                </div>
              );
            })}
            {sales.length === 0 && <p className="text-hg-text text-center py-6">Sin ventas registradas.</p>}
          </div>
        </div>
      </div>

      {/* Inventory value breakdown */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Car size={16} className="text-blue-400" />
          <h3 className="text-hg-white font-semibold">Estado del Inventario — Valor Total</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hg-border">
                {['Vehículo', 'Año', 'KM', 'Precio', 'Estatus', 'Días inv.'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 text-hg-text text-xs font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cars.filter(c => c.status !== 'VENDIDO').map(car => {
                const days = dayjs().diff(dayjs(car.entryDate), 'day');
                return (
                  <tr key={car.id} className="table-row">
                    <td className="py-2.5 px-3">
                      <div>
                        <p className="text-hg-white font-medium whitespace-nowrap">{car.brand} {car.model}</p>
                        <p className="text-hg-text text-xs">{car.version}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-hg-light">{car.year}</td>
                    <td className="py-2.5 px-3 text-hg-light font-mono text-xs">{car.km.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-mono font-bold text-xs whitespace-nowrap">{formatCurrency(car.price)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${getStatusColor(car.status)}`}>{getStatusLabel(car.status)}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`badge text-xs font-mono ${days > 60 ? 'text-hg-red bg-hg-red/10 border-hg-red/20' : days > 30 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'}`}>
                        {days}d
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
