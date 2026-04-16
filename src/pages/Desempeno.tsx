import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { Trophy, TrendingUp, Users, Target, DollarSign, Award } from 'lucide-react';
import { useSalesStore } from '../store/salesStore';
import { useCRMStore } from '../store/crmStore';
import { MOCK_USERS, AGENT_MONTHLY_DATA, AGENT_MONTHLY_REVENUE } from '../mock/data';
import dayjs from 'dayjs';

const AGENTS = MOCK_USERS.filter(u => u.role === 'VENDEDOR');

const AGENT_COLORS: Record<string, string> = {
  u3: '#dc2626',
  u6: '#7c3aed',
  u7: '#d97706',
};

const META_EQUIPO = 12;

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
const fmtK = (n: number) =>
  n >= 1000000 ? `$${(n / 1000000).toFixed(2)}M` : `$${(n / 1000).toFixed(0)}K`;

const STATUS_COLORS: Record<string, string> = {
  Nuevos: '#3b82f6',
  Seguimiento: '#f59e0b',
  Negociación: '#8b5cf6',
  Cerrado: '#22c55e',
  Perdido: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  NUEVO: 'Nuevo', SEGUIMIENTO: 'Seguimiento',
  NEGOCIACION: 'Negociación', CERRADO: 'Cerrado', PERDIDO: 'Perdido',
};
const STATUS_STYLES: Record<string, string> = {
  NUEVO: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  SEGUIMIENTO: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  NEGOCIACION: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  CERRADO: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  PERDIDO: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const RANK_CONFIG = [
  { icon: '🥇', border: 'border-yellow-500/40', glow: 'bg-yellow-500/5' },
  { icon: '🥈', border: 'border-slate-400/30', glow: 'bg-slate-400/5' },
  { icon: '🥉', border: 'border-amber-700/30', glow: 'bg-amber-700/5' },
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function Desempeno() {
  const sales = useSalesStore(s => s.sales);
  const clients = useCRMStore(s => s.clients);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  const currentMonth = dayjs().format('YYYY-MM');
  const mesLabel = `${MESES[dayjs().month()]} ${dayjs().year()}`;

  const agentStats = useMemo(() => {
    return AGENTS.map(agent => {
      const agentSales = sales.filter(s => s.sellerId === agent.id);
      const completedSales = agentSales.filter(s => s.status === 'COMPLETADA');
      const monthlySales = completedSales.filter(s => s.saleDate.startsWith(currentMonth));
      const agentClients = clients.filter(c => c.assignedTo === agent.id);

      const monthRevenue = monthlySales.reduce((a, s) => a + s.finalPrice, 0);
      const totalRevenue = completedSales.reduce((a, s) => a + s.finalPrice, 0);
      const totalCommission = agentSales.reduce((a, s) => a + s.commission, 0);

      const closedCount = agentClients.filter(c => c.status === 'CERRADO').length;
      const activeClients = agentClients.filter(c =>
        ['NUEVO', 'SEGUIMIENTO', 'NEGOCIACION'].includes(c.status)
      ).length;
      const conversionRate = agentClients.length > 0
        ? Math.round((closedCount / agentClients.length) * 100) : 0;

      const pipeline = {
        Nuevos: agentClients.filter(c => c.status === 'NUEVO').length,
        Seguimiento: agentClients.filter(c => c.status === 'SEGUIMIENTO').length,
        Negociación: agentClients.filter(c => c.status === 'NEGOCIACION').length,
        Cerrado: closedCount,
        Perdido: agentClients.filter(c => c.status === 'PERDIDO').length,
      };

      return {
        ...agent,
        monthlySales: monthlySales.length,
        totalSales: completedSales.length,
        monthRevenue,
        totalRevenue,
        totalCommission,
        activeClients,
        conversionRate,
        pipeline,
        allClients: agentClients,
      };
    }).sort((a, b) => b.monthRevenue - a.monthRevenue);
  }, [sales, clients, currentMonth]);

  const teamMonthSales = agentStats.reduce((a, s) => a + s.monthlySales, 0);
  const teamMonthRevenue = agentStats.reduce((a, s) => a + s.monthRevenue, 0);
  const topAgent = agentStats[0];

  const pipelineData = agentStats.map(a => ({
    name: a.name.split(' ')[0],
    ...a.pipeline,
  }));

  const displayedClients = clients
    .filter(c => activeAgent === null || c.assignedTo === activeAgent)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl text-hg-white tracking-wider flex items-center gap-2">
            <Award size={22} className="text-yellow-400" /> DESEMPEÑO DEL EQUIPO
          </h1>
          <p className="text-hg-text text-sm mt-0.5">Análisis de productividad · {mesLabel}</p>
        </div>
        <div className="flex items-center gap-2 bg-hg-card border border-hg-border rounded-lg px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-hg-text text-sm">Tiempo real</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <Users size={17} className="text-blue-400" />
            </div>
            <span className="text-hg-text text-xs font-medium uppercase tracking-wider">Agentes</span>
          </div>
          <p className="font-display text-3xl text-hg-white">{AGENTS.length}</p>
          <p className="text-hg-text text-xs mt-1">vendedores en campo</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-hg-red/15 border border-hg-red/20 flex items-center justify-center">
              <TrendingUp size={17} className="text-hg-red" />
            </div>
            <span className="text-hg-text text-xs font-medium uppercase tracking-wider">Ventas / mes</span>
          </div>
          <p className="font-display text-3xl text-hg-white">{teamMonthSales}</p>
          <p className="text-hg-text text-xs mt-1">unidades (equipo completo)</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign size={17} className="text-emerald-400" />
            </div>
            <span className="text-hg-text text-xs font-medium uppercase tracking-wider">Ingresos / mes</span>
          </div>
          <p className="font-display text-2xl text-hg-white">{fmtK(teamMonthRevenue)}</p>
          <p className="text-hg-text text-xs mt-1">líder: <span className="text-hg-light">{topAgent?.name.split(' ')[0]}</span></p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
              <Target size={17} className="text-violet-400" />
            </div>
            <span className="text-hg-text text-xs font-medium uppercase tracking-wider">Meta equipo</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="font-display text-3xl text-hg-white">{teamMonthSales}</p>
            <p className="text-hg-text text-lg">/ {META_EQUIPO}</p>
          </div>
          <div className="w-full bg-hg-muted rounded-full h-1.5 mt-2">
            <div
              className="bg-violet-500 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min((teamMonthSales / META_EQUIPO) * 100, 100)}%` }}
            />
          </div>
          <p className="text-hg-text text-xs mt-1">{Math.round((teamMonthSales / META_EQUIPO) * 100)}% alcanzado</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-hg-light text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
          <Trophy size={13} className="text-yellow-400" /> Ranking del Mes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agentStats.map((agent, idx) => {
            const rank = RANK_CONFIG[idx] ?? RANK_CONFIG[2];
            const color = AGENT_COLORS[agent.id] ?? '#dc2626';
            const metaAgente = Math.ceil(META_EQUIPO / AGENTS.length);
            const pct = Math.min(Math.round((agent.monthlySales / metaAgente) * 100), 100);

            return (
              <div key={agent.id} className={`card p-5 border ${rank.border} ${rank.glow} relative overflow-hidden`}>
                <div className="absolute top-3 right-3 text-2xl select-none">{rank.icon}</div>

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold font-mono border flex-shrink-0"
                    style={{ background: `${color}22`, borderColor: `${color}44`, color }}
                  >
                    {agent.avatar}
                  </div>
                  <div>
                    <p className="text-hg-white font-semibold">{agent.name}</p>
                    <p className="text-hg-text text-xs">Agente de Ventas</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Ventas / mes', value: agent.monthlySales, mono: true },
                    { label: 'Ingresos', value: fmtK(agent.monthRevenue), colored: true },
                    { label: 'Prospectos activos', value: agent.activeClients, mono: true },
                    { label: 'Conversión', value: `${agent.conversionRate}%`, mono: true },
                  ].map(item => (
                    <div key={item.label} className="bg-hg-muted/40 rounded-lg p-2.5">
                      <p className="text-hg-text text-[10px] uppercase tracking-wide leading-tight mb-1">{item.label}</p>
                      <p
                        className={`font-bold text-lg font-mono ${item.colored ? '' : 'text-hg-white'}`}
                        style={item.colored ? { color } : {}}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1 text-hg-text">
                    <span>vs meta ({metaAgente} ventas)</span>
                    <span style={{ color }}>{pct}%</span>
                  </div>
                  <div className="w-full bg-hg-muted rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-hg-border/50 flex justify-between items-center">
                  <span className="text-hg-text text-xs">Comisiones acum.</span>
                  <span className="text-emerald-400 text-xs font-mono font-semibold">{fmt(agent.totalCommission)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Ventas por mes por agente */}
        <div className="card p-5 lg:col-span-3">
          <h3 className="text-hg-light text-sm font-semibold mb-4">Ventas por Agente — Últimos 6 Meses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={AGENT_MONTHLY_DATA} barGap={3} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#f3f4f6', fontWeight: 600 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 8 }} />
              <Bar dataKey="Alejandro" fill={AGENT_COLORS.u3} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Patricia" fill={AGENT_COLORS.u6} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Omar" fill={AGENT_COLORS.u7} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline por agente */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-hg-light text-sm font-semibold mb-4">Pipeline de Prospectos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pipelineData} layout="vertical" barSize={12} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#d1d5db', fontSize: 12 }} axisLine={false} tickLine={false} width={68} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Bar dataKey="Nuevos" stackId="a" fill={STATUS_COLORS.Nuevos} />
              <Bar dataKey="Seguimiento" stackId="a" fill={STATUS_COLORS.Seguimiento} />
              <Bar dataKey="Negociación" stackId="a" fill={STATUS_COLORS.Negociación} />
              <Bar dataKey="Cerrado" stackId="a" fill={STATUS_COLORS.Cerrado} />
              <Bar dataKey="Perdido" stackId="a" fill={STATUS_COLORS.Perdido} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {Object.entries(STATUS_COLORS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: v }} />
                <span className="text-hg-text text-[10px]">{k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ingresos por agente */}
        <div className="card p-5">
          <h3 className="text-hg-light text-sm font-semibold mb-4">Ingresos por Agente — Últimos 6 Meses</h3>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={AGENT_MONTHLY_REVENUE} barGap={3} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [fmt(v), '']}
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#f3f4f6', fontWeight: 600 }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 8 }} />
              <Bar dataKey="Alejandro" fill={AGENT_COLORS.u3} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Patricia" fill={AGENT_COLORS.u6} radius={[3, 3, 0, 0]} />
              <Bar dataKey="Omar" fill={AGENT_COLORS.u7} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Eficiencia individual */}
        <div className="card p-5">
          <h3 className="text-hg-light text-sm font-semibold mb-5">Eficiencia Individual</h3>
          <div className="space-y-5">
            {agentStats.map(agent => {
              const color = AGENT_COLORS[agent.id] ?? '#dc2626';
              return (
                <div key={agent.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg text-[10px] font-bold font-mono flex items-center justify-center border"
                        style={{ background: `${color}22`, borderColor: `${color}44`, color }}
                      >
                        {agent.avatar}
                      </div>
                      <span className="text-hg-white text-sm font-medium">{agent.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-hg-text">{agent.conversionRate}% conv.</span>
                      <span className="text-emerald-400">{fmt(agent.totalCommission)}</span>
                      <span className="text-hg-text/60">{agent.totalSales} total</span>
                    </div>
                  </div>
                  <div className="w-full bg-hg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${agent.conversionRate}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-hg-border">
            <p className="text-hg-text text-xs font-medium uppercase tracking-wider mb-3">
              Prospectos activos en pipeline
            </p>
            {agentStats.map(agent => {
              const color = AGENT_COLORS[agent.id] ?? '#dc2626';
              const total = agent.allClients.length;
              const MAX_REF = 10;
              return (
                <div key={agent.id} className="flex items-center gap-3 mb-2.5">
                  <span className="text-hg-text text-xs w-16 shrink-0">{agent.name.split(' ')[0]}</span>
                  <div className="flex-1 bg-hg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((agent.activeClients / MAX_REF) * 100, 100)}%`, background: color }}
                    />
                  </div>
                  <span className="text-hg-text text-xs font-mono w-16 text-right shrink-0">
                    {agent.activeClients}/{total} act.
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detalle por agente */}
      <div>
        <h2 className="text-hg-light text-xs font-semibold uppercase tracking-wider mb-3">
          Detalle de Prospectos
        </h2>

        {/* Agent filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveAgent(null)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              activeAgent === null
                ? 'bg-hg-card border-hg-border text-hg-white'
                : 'border-transparent text-hg-text hover:text-hg-light'
            }`}
          >
            Todos ({clients.length})
          </button>
          {agentStats.map(agent => {
            const color = AGENT_COLORS[agent.id];
            const isActive = activeAgent === agent.id;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(isActive ? null : agent.id)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all border"
                style={
                  isActive
                    ? { background: `${color}20`, borderColor: `${color}40`, color }
                    : { borderColor: 'transparent', color: '#9ca3af' }
                }
              >
                {agent.name.split(' ')[0]} ({agent.allClients.length})
              </button>
            );
          })}
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-hg-border bg-hg-muted/20">
                  {['Cliente', 'Agente', 'Estado', 'Fuente', 'Presupuesto', 'Ingresó'].map(h => (
                    <th key={h} className="text-left p-4 text-hg-text text-xs font-medium uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedClients.map(client => {
                  const agent = AGENTS.find(a => a.id === client.assignedTo);
                  const color = agent ? (AGENT_COLORS[agent.id] ?? '#dc2626') : '#dc2626';
                  return (
                    <tr key={client.id} className="border-b border-hg-border/40 hover:bg-hg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="text-hg-white font-medium text-sm">{client.name}</p>
                        <p className="text-hg-text text-xs">{client.phone}</p>
                      </td>
                      <td className="p-4">
                        {agent && (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-md text-[10px] font-bold font-mono flex items-center justify-center border flex-shrink-0"
                              style={{ background: `${color}22`, borderColor: `${color}44`, color }}
                            >
                              {agent.avatar}
                            </div>
                            <span className="text-hg-text text-xs">{agent.name.split(' ')[0]}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_STYLES[client.status]}`}>
                          {STATUS_LABELS[client.status]}
                        </span>
                      </td>
                      <td className="p-4 text-hg-text text-xs">{client.source}</td>
                      <td className="p-4 text-right font-mono text-hg-white text-xs">{fmt(client.budget ?? 0)}</td>
                      <td className="p-4 text-hg-text text-xs whitespace-nowrap">
                        {dayjs(client.createdAt).format('DD MMM YY')}
                      </td>
                    </tr>
                  );
                })}
                {displayedClients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-hg-text text-sm">Sin registros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
