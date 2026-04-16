import { useState } from 'react';
import { useInventoryStore } from '../store/inventoryStore';
import { formatCurrency, calculateCredit } from '../utils';
import { Calculator, TrendingUp, Car, MessageCircle, RefreshCw } from 'lucide-react';

const PLAZO_OPTIONS = [12, 24, 36, 48, 60];

export default function Credito() {
  const cars = useInventoryStore(s => s.cars.filter(c => c.status === 'DISPONIBLE'));
  const [carPrice, setCarPrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [months, setMonths] = useState(36);
  const [selectedCarId, setSelectedCarId] = useState('');

  const handleCarSelect = (id: string) => {
    setSelectedCarId(id);
    const car = cars.find(c => c.id === id);
    if (car) {
      setCarPrice(car.price);
      setDownPayment(Math.round(car.price * 0.2));
    }
  };

  const downPct = Math.round((downPayment / carPrice) * 100);
  const financed = carPrice - downPayment;
  const result = financed > 0 ? calculateCredit(carPrice, downPayment, months) : null;

  const selectedCar = cars.find(c => c.id === selectedCarId);

  // Similar car recommendations
  const similarCars = selectedCar
    ? cars.filter(c => c.id !== selectedCarId && Math.abs(c.price - selectedCar.price) / selectedCar.price <= 0.2)
    : [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Calculator size={20} className="text-hg-red" />
            <h2 className="text-hg-white font-semibold text-lg">Configurar Crédito</h2>
          </div>

          {/* Select from inventory */}
          <div>
            <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">
              Seleccionar del Inventario (opcional)
            </label>
            <select
              value={selectedCarId}
              onChange={e => handleCarSelect(e.target.value)}
              className="input-field"
            >
              <option value="">Ingresa precio manualmente...</option>
              {cars.map(c => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.model} {c.year} · {formatCurrency(c.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Car preview */}
          {selectedCar && (
            <div className="flex items-center gap-3 bg-hg-muted/20 rounded-xl p-3 border border-hg-border">
              <img src={selectedCar.image} alt={selectedCar.model} className="w-16 h-12 object-cover rounded-lg"
                onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x48/1E2330/8892A4?text=Auto'; }} />
              <div>
                <p className="text-hg-white font-semibold text-sm">{selectedCar.brand} {selectedCar.model} {selectedCar.year}</p>
                <p className="text-hg-text text-xs">{selectedCar.version} · {selectedCar.km.toLocaleString()} km</p>
              </div>
            </div>
          )}

          {/* Price input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-hg-text text-xs font-medium uppercase tracking-wider">Precio del Auto</label>
              <span className="text-hg-white font-mono text-sm font-bold">{formatCurrency(carPrice)}</span>
            </div>
            <input
              type="range" min={100000} max={1500000} step={5000}
              value={carPrice}
              onChange={e => setCarPrice(Number(e.target.value))}
              className="w-full accent-hg-red h-1.5 rounded-full"
            />
            <div className="flex justify-between text-hg-text/50 text-xs mt-1">
              <span>$100k</span><span>$1.5M</span>
            </div>
          </div>

          {/* Down payment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-hg-text text-xs font-medium uppercase tracking-wider">Enganche</label>
              <span className="text-hg-white font-mono text-sm font-bold">
                {formatCurrency(downPayment)} <span className="text-hg-text font-normal">({downPct}%)</span>
              </span>
            </div>
            <input
              type="range" min={0} max={carPrice * 0.6} step={5000}
              value={downPayment}
              onChange={e => setDownPayment(Number(e.target.value))}
              className="w-full accent-hg-red h-1.5 rounded-full"
            />
            <div className="flex justify-between text-hg-text/50 text-xs mt-1">
              <span>$0</span><span>60%</span>
            </div>
          </div>

          {/* Plazo */}
          <div>
            <label className="block text-hg-text text-xs font-medium mb-2 uppercase tracking-wider">Plazo</label>
            <div className="flex gap-2 flex-wrap">
              {PLAZO_OPTIONS.map(p => (
                <button
                  key={p}
                  onClick={() => setMonths(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${months === p ? 'hg-gradient text-white' : 'bg-hg-muted/50 text-hg-text hover:text-hg-light'}`}
                >
                  {p} meses
                </button>
              ))}
            </div>
          </div>

          <p className="text-hg-text/50 text-xs">* Tasa de interés referencial 18% anual. Sujeto a aprobación de crédito.</p>
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Main monthly payment */}
              <div className="card p-6 border-hg-red/30 bg-hg-red/5">
                <p className="text-hg-text text-xs uppercase tracking-wider mb-1">Mensualidad estimada</p>
                <div className="flex items-end gap-2">
                  <span className="text-hg-white font-display text-5xl tracking-wider">
                    {formatCurrency(result.monthlyPayment)}
                  </span>
                </div>
                <p className="text-hg-text text-sm mt-1">por {months} meses</p>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Precio del Auto', value: formatCurrency(carPrice), color: 'text-hg-light' },
                  { label: 'Enganche', value: formatCurrency(downPayment), color: 'text-blue-400' },
                  { label: 'Monto Financiado', value: formatCurrency(financed), color: 'text-amber-400' },
                  { label: 'Total a Pagar', value: formatCurrency(result.totalAmount), color: 'text-hg-light' },
                  { label: 'Interés Total', value: formatCurrency(result.totalInterest), color: 'text-hg-red' },
                  { label: 'Tasa Mensual', value: `${(result.monthlyRate * 100).toFixed(2)}%`, color: 'text-violet-400' },
                ].map(item => (
                  <div key={item.label} className="bg-hg-muted/20 rounded-xl p-3 border border-hg-border">
                    <p className="text-hg-text text-[10px] uppercase tracking-wider">{item.label}</p>
                    <p className={`${item.color} font-mono font-bold text-sm mt-0.5`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <div className="card p-4">
                <p className="text-hg-text text-xs font-medium mb-3 uppercase tracking-wider">Distribución del pago</p>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-hg-text">Capital</span>
                      <span className="text-blue-400 font-mono">{Math.round((financed / result.totalAmount) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-hg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(financed / result.totalAmount) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-hg-text">Intereses</span>
                      <span className="text-hg-red font-mono">{Math.round((result.totalInterest / result.totalAmount) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-hg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-hg-red rounded-full" style={{ width: `${(result.totalInterest / result.totalAmount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=5216699942914&text=Hola! Estoy interesado en un crédito para ${selectedCar ? `${selectedCar.brand} ${selectedCar.model} ${selectedCar.year}` : 'un auto'} a ${months} meses con enganche de ${formatCurrency(downPayment)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                <MessageCircle size={18} />
                Solicitar crédito por WhatsApp
              </a>
            </>
          ) : (
            <div className="card p-12 text-center">
              <TrendingUp size={40} className="text-hg-muted mx-auto mb-3" />
              <p className="text-hg-text">Configura los parámetros para ver la simulación</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar cars */}
      {similarCars.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw size={16} className="text-hg-red" />
            <h3 className="text-hg-white font-semibold">Autos Similares (±20% del precio)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {similarCars.slice(0, 3).map(car => (
              <button
                key={car.id}
                onClick={() => handleCarSelect(car.id)}
                className="flex items-center gap-3 bg-hg-muted/20 hover:bg-hg-muted/40 rounded-xl p-3 border border-hg-border transition-all text-left"
              >
                <img src={car.image} alt={car.model} className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x48/1E2330/8892A4?text=Auto'; }} />
                <div>
                  <p className="text-hg-white font-medium text-sm">{car.brand} {car.model}</p>
                  <p className="text-hg-text text-xs">{car.year} · {car.km.toLocaleString()} km</p>
                  <p className="text-emerald-400 font-mono text-xs font-bold mt-0.5">{formatCurrency(car.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
