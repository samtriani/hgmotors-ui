import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useSalesStore } from '../store/salesStore';
import { useCRMStore } from '../store/crmStore';
import { formatCurrency, getDaysInInventory, getRoleLabel } from '../utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { SALES_MONTHLY_DATA, SALES_DETAIL_BY_MONTH, MOCK_USERS } from '../mock/data';
import {
  Car, Users, DollarSign, AlertTriangle, TrendingUp,
  Trophy, Clock, Target, CheckCircle, ArrowUpRight, X
} from 'lucide-react';
import dayjs from 'dayjs';

const CLIENT_STATUSES = ['NUEVO', 'SEGUIMIENTO', 'NEGOCIACION', 'CERRADO'];

function StatCard({ icon: Icon, label, value, sub, color = 'text-hg-red', trend, onClick }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string; trend?: string; onClick?: () => void;
}) {
  return (
    <div
      className={`stat-card group hover:border-hg-muted transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.99]' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-current/10 ${color}`}>
          <Icon size={20} className="opacity-80" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <ArrowUpRight size={12} />{trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-hg-text text-xs uppercase tracking-wider font-medium">{label}</p>
        <p className="text-hg-white text-2xl font-bold mt-0.5 font-mono">{value}</p>
        {sub && <p className="text-hg-text text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

const SELLER_COLORS: Record<string, string> = {
  Alejandro: '#dc2626', Patricia: '#7c3aed', Omar: '#d97706',
};

function DirectorDashboard() {
  const navigate = useNavigate();
  const cars = useInventoryStore(s => s.cars);
  const sales = useSalesStore(s => s.sales);
  const clients = useCRMStore(s => s.clients);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const disponibles = cars.filter(c => c.status === 'DISPONIBLE').length;
  const vendidos = cars.filter(c => c.status === 'VENDIDO').length;
  const alerta60 = cars.filter(c => getDaysInInventory(c.entryDate) > 60 && c.status !== 'VENDIDO').length;
  const totalInventario = cars.filter(c => c.status !== 'VENDIDO').reduce((a, c) => a + c.price, 0);
  const ventasMes = sales.filter(s => s.status === 'COMPLETADA').reduce((a, s) => a + s.finalPrice, 0);
  const leadsActivos = clients.filter(c => ['NUEVO','SEGUIMIENTO','NEGOCIACION'].includes(c.status)).length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Ventas del Mes" value={formatCurrency(ventasMes)} sub="Mes en curso" color="text-emerald-400" trend="+12%" onClick={() => navigate('/ventas')} />
        <StatCard icon={Car} label="Inventario Total" value={formatCurrency(totalInventario)} sub={`${disponibles} autos disponibles`} color="text-blue-400" />
        <StatCard icon={AlertTriangle} label="Autos +60 días" value={alerta60} sub="Requieren atención" color="text-amber-400" />
        <StatCard icon={Users} label="Leads Activos" value={leadsActivos} sub="Clientes en proceso" color="text-violet-400" trend="+3 hoy" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-hg-white font-semibold">Ventas Mensuales</h3>
              <p className="text-hg-text text-xs mt-0.5">Últimos 6 meses · clic en mes para ver detalle</p>
            </div>
            <span className="badge text-emerald-400 bg-emerald-400/10 border-emerald-400/20">En vivo</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={SALES_MONTHLY_DATA}
              onClick={d => { if (d?.activePayload) setSelectedMonth(d.activePayload[0].payload.mes); }}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8102E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C8102E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" />
              <XAxis dataKey="mes" tick={{ fill: '#8892A4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#161A22', border: '1px solid #1E2330', borderRadius: '8px', fontSize: 12, padding: '10px 14px' }}
                labelStyle={{ color: '#C4CDD8', fontWeight: 600, marginBottom: 4 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: '#161A22', border: '1px solid #1E2330', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
                      <p style={{ color: '#C4CDD8', fontWeight: 600, marginBottom: 6 }}>{label}</p>
                      <p style={{ color: '#22c55e', fontFamily: 'monospace' }}>{formatCurrency(d.monto)}</p>
                      <p style={{ color: '#8892A4', marginTop: 2 }}>{d.ventas} vehículos vendidos</p>
                      <p style={{ color: '#8892A4', fontSize: 10, marginTop: 4 }}>Clic para ver detalle</p>
                    </div>
                  );
                }}
              />
              <Area type="monotone" dataKey="monto" stroke="#C8102E" fill="url(#redGrad)" strokeWidth={2}
                dot={({ cx, cy, payload }) => (
                  <circle key={payload.mes} cx={cx} cy={cy} r={selectedMonth === payload.mes ? 5 : 3}
                    fill={selectedMonth === payload.mes ? '#fff' : '#C8102E'}
                    stroke="#C8102E" strokeWidth={2} />
                )}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Detail panel */}
          {selectedMonth && (() => {
            const isCurrentMonth = selectedMonth === 'Abr';
            const details = isCurrentMonth
              ? sales.filter(s => s.status === 'COMPLETADA').map(s => {
                  const car = cars.find(c => c.id === s.carId);
                  const seller = MOCK_USERS.find(u => u.id === s.sellerId);
                  return {
                    brand: car?.brand ?? '—', model: car?.model ?? '—',
                    version: car?.version ?? '', year: car?.year ?? 0,
                    price: s.finalPrice,
                    seller: seller?.name.split(' ')[0] ?? '—',
                    method: s.paymentMethod.replace('_', ' '),
                  };
                })
              : (SALES_DETAIL_BY_MONTH[selectedMonth] ?? []);

            const total = details.reduce((a, d) => a + d.price, 0);

            return (
              <div className="mt-4 border-t border-hg-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-hg-white font-semibold text-sm">{selectedMonth} · {details.length} vehículos</span>
                    <span className="text-emerald-400 font-mono text-sm ml-3">{formatCurrency(total)}</span>
                  </div>
                  <button onClick={() => setSelectedMonth(null)} className="text-hg-text hover:text-hg-light transition-colors">
                    <X size={15} />
                  </button>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {details.map((d, i) => {
                    const color = SELLER_COLORS[d.seller] ?? '#dc2626';
                    return (
                      <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-hg-muted/20 hover:bg-hg-muted/30 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold font-mono border flex-shrink-0"
                            style={{ background: `${color}20`, borderColor: `${color}40`, color }}>
                            {d.seller.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-hg-white text-xs font-medium truncate">{d.brand} {d.model} {d.year}</p>
                            <p className="text-hg-text text-[10px] truncate">{d.version} · {d.method}</p>
                          </div>
                        </div>
                        <span className="text-emerald-400 text-xs font-mono font-bold flex-shrink-0 ml-3">{formatCurrency(d.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Top stats */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-amber-400" />
              <h3 className="text-hg-white font-semibold text-sm">Top Vendedor</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <span className="text-amber-400 text-sm font-bold">AR</span>
              </div>
              <div>
                <p className="text-hg-white font-medium text-sm">Alejandro Ruiz</p>
                <p className="text-hg-text text-xs">2 ventas · {formatCurrency(875000)}</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-hg-muted rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-hg-red" />
              <h3 className="text-hg-white font-semibold text-sm">Meta del Mes</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-hg-text text-xs">Progreso</span>
              <span className="text-hg-white text-xs font-mono font-bold">4/8 ventas</span>
            </div>
            <div className="h-1.5 bg-hg-muted rounded-full overflow-hidden">
              <div className="h-full hg-gradient rounded-full transition-all" style={{ width: '50%' }} />
            </div>
            <p className="text-hg-text text-xs mt-2">Faltan 4 ventas para meta mensual</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-emerald-400" />
              <h3 className="text-hg-white font-semibold text-sm">Resumen Inv.</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Disponibles', val: disponibles, color: 'bg-emerald-400' },
                { label: 'Reservados', val: cars.filter(c=>c.status==='RESERVADO').length, color: 'bg-amber-400' },
                { label: 'En Taller', val: cars.filter(c=>c.status==='EN_TALLER').length, color: 'bg-blue-400' },
                { label: 'Vendidos', val: vendidos, color: 'bg-hg-muted' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-hg-text text-xs">{item.label}</span>
                  </div>
                  <span className="text-hg-white text-xs font-mono">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent alerts */}
      <div className="card p-5">
        <h3 className="text-hg-white font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-400" />
          Autos con más de 30 días en inventario
        </h3>
        <div className="space-y-2">
          {cars
            .filter(c => getDaysInInventory(c.entryDate) >= 30 && c.status !== 'VENDIDO')
            .sort((a, b) => getDaysInInventory(b.entryDate) - getDaysInInventory(a.entryDate))
            .slice(0, 5)
            .map(car => {
              const days = getDaysInInventory(car.entryDate);
              const urgency = days > 60 ? 'text-hg-red' : 'text-amber-400';
              return (
                <div key={car.id} className="flex items-center justify-between py-2 border-b border-hg-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-hg-muted flex-shrink-0">
                      <img src={car.image} alt={car.model} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x40/1E2330/8892A4?text=Auto'; }} />
                    </div>
                    <div>
                      <p className="text-hg-white text-sm font-medium">{car.brand} {car.model} {car.year}</p>
                      <p className="text-hg-text text-xs">{car.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-hg-light font-mono text-sm">{formatCurrency(car.price)}</span>
                    <span className={`badge ${urgency} ${days > 60 ? 'bg-hg-red/10 border-hg-red/20' : 'bg-amber-400/10 border-amber-400/20'}`}>
                      {days} días
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function GerenteDashboard() {
  const clients = useCRMStore(s => s.clients);
  const sales = useSalesStore(s => s.sales);

  const pipeline = CLIENT_STATUSES.map(status => ({
    status,
    count: clients.filter(c => c.status === status).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {pipeline.map(p => (
          <StatCard
            key={p.status}
            icon={Users}
            label={p.status}
            value={p.count}
            color={p.status === 'CERRADO' ? 'text-emerald-400' : p.status === 'NEGOCIACION' ? 'text-violet-400' : 'text-amber-400'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-hg-white font-semibold mb-4">Ventas por Mes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SALES_MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" />
              <XAxis dataKey="mes" tick={{ fill: '#8892A4', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickFormatter={v => `${v}`} />
              <Tooltip contentStyle={{ background: '#161A22', border: '1px solid #1E2330', borderRadius: '8px', fontSize: 12 }} formatter={(v: number) => [v, 'Ventas']} />
              <Bar dataKey="ventas" fill="#C8102E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <h3 className="text-hg-white font-semibold mb-4">Desempeño Vendedores</h3>
          {MOCK_USERS.filter(u => u.role === 'VENDEDOR').map(seller => {
            const sellerSales = sales.filter(s => s.sellerId === seller.id && s.status === 'COMPLETADA');
            const total = sellerSales.reduce((a, s) => a + s.finalPrice, 0);
            return (
              <div key={seller.id} className="flex items-center gap-3 py-2.5 border-b border-hg-border last:border-0">
                <div className="w-8 h-8 rounded-lg bg-hg-red/20 border border-hg-red/30 flex items-center justify-center">
                  <span className="text-hg-red text-xs font-bold">{seller.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-hg-white text-sm font-medium">{seller.name}</span>
                    <span className="text-hg-light text-xs font-mono">{sellerSales.length} ventas</span>
                  </div>
                  <div className="h-1.5 bg-hg-muted rounded-full overflow-hidden">
                    <div className="h-full hg-gradient rounded-full" style={{ width: `${Math.min((sellerSales.length / 8) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function VendedorDashboard() {
  const user = useAuthStore(s => s.user);
  const cars = useInventoryStore(s => s.cars);
  const clients = useCRMStore(s => s.clients);

  const myClients = clients.filter(c => c.assignedTo === user?.id);
  const disponibles = cars.filter(c => c.status === 'DISPONIBLE').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Mis Clientes" value={myClients.length} sub="Total asignados" color="text-violet-400" />
        <StatCard icon={Car} label="Disponibles" value={disponibles} sub="En inventario" color="text-emerald-400" />
        <StatCard icon={Clock} label="Seguimientos" value={myClients.filter(c => c.status === 'SEGUIMIENTO').length} sub="Pendientes hoy" color="text-amber-400" />
      </div>

      <div className="card p-5">
        <h3 className="text-hg-white font-semibold mb-4">Mis Clientes Activos</h3>
        <div className="space-y-2">
          {myClients.filter(c => c.status !== 'CERRADO' && c.status !== 'PERDIDO').map(client => (
            <div key={client.id} className="flex items-center justify-between py-2.5 border-b border-hg-border last:border-0">
              <div>
                <p className="text-hg-white text-sm font-medium">{client.name}</p>
                <p className="text-hg-text text-xs">{client.phone} · {client.source}</p>
              </div>
              <div className="flex items-center gap-2">
                {client.budget && <span className="text-hg-light text-xs font-mono">{formatCurrency(client.budget)}</span>}
                <span className={`badge text-xs ${
                  client.status === 'NEGOCIACION' ? 'text-violet-400 bg-violet-400/10 border-violet-400/20' :
                  client.status === 'SEGUIMIENTO' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                  'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
                }`}>{client.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore(s => s.user);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl text-hg-white tracking-wider">
          BIENVENIDO, <span className="text-hg-red">{user?.name.split(' ')[0].toUpperCase()}</span>
        </h1>
        <p className="text-hg-text text-sm mt-1">
          {getRoleLabel(user?.role || '')} · {dayjs().format('dddd, D [de] MMMM YYYY')}
        </p>
      </div>

      {user?.role === 'DIRECTOR' && <DirectorDashboard />}
      {user?.role === 'GERENTE' && <GerenteDashboard />}
      {(user?.role === 'VENDEDOR') && <VendedorDashboard />}
      {user?.role === 'TALLER' && (
        <div className="card p-8 text-center">
          <Wrench size={40} className="text-blue-400 mx-auto mb-3" />
          <h2 className="text-hg-white font-semibold text-lg">Panel de Taller</h2>
          <p className="text-hg-text text-sm mt-1">Ve al módulo de Taller para gestionar los vehículos en preparación.</p>
        </div>
      )}
      {user?.role === 'ADMIN' && <DirectorDashboard />}
    </div>
  );
}

function Wrench({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
