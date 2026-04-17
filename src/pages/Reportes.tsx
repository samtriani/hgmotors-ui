import { useMemo, useState } from 'react';
import { useSalesStore } from '../store/salesStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCRMStore } from '../store/crmStore';
import { formatCurrency } from '../utils';
import { SALES_DETAIL_BY_MONTH, MOCK_USERS } from '../mock/data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { DollarSign, Car, TrendingUp, Receipt, Calendar, ChevronDown, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ReporteSale = {
  brand: string; model: string; version: string; year: number;
  price: number; seller: string; client: string; method: string;
  mes: string; commission: number;
};

const SELLER_COLORS: Record<string, string> = {
  'Alejandro Ruiz': '#dc2626',
  'Patricia Ríos':  '#7c3aed',
  'Omar Castro':    '#d97706',
};

const METHOD_LABELS: Record<string, string> = {
  Contado: 'Contado', Crédito: 'Crédito', 'Enganche + Crédito': 'Eng. + Crédito',
  CONTADO: 'Contado', CREDITO: 'Crédito', ENGANCHE_CREDITO: 'Eng. + Crédito',
};

// Mes corto → etiqueta completa con año
const MES_LABEL: Record<string, string> = {
  Nov: 'Noviembre 2025',
  Dic: 'Diciembre 2025',
  Ene: 'Enero 2026',
  Feb: 'Febrero 2026',
  Mar: 'Marzo 2026',
  Abr: 'Abril 2026',
};

const MESES_HISTORICOS = ['Nov', 'Dic', 'Ene', 'Feb', 'Mar'];
const MES_ACTUAL = 'Abr';
const TODOS = 'Todo el período';

export default function Reportes() {
  const sales    = useSalesStore(s => s.sales);
  const cars     = useInventoryStore(s => s.cars);
  const clients  = useCRMStore(s => s.clients);
  const [periodo, setPeriodo]         = useState<string>(TODOS);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ventas actuales (store)
  const ventasActuales: ReporteSale[] = useMemo(() =>
    sales.filter(s => s.status === 'COMPLETADA').map(s => {
      const car    = cars.find(c => c.id === s.carId);
      const client = clients.find(c => c.id === s.clientId);
      const seller = MOCK_USERS.find(u => u.id === s.sellerId);
      return {
        brand: car?.brand ?? '—', model: car?.model ?? '—',
        version: car?.version ?? '', year: car?.year ?? 0,
        price: s.finalPrice,
        seller: seller?.name ?? '—',
        client: client?.name ?? '—',
        method: s.paymentMethod,
        mes: MES_ACTUAL,
        commission: s.commission,
      };
    }), [sales, cars, clients]);

  // Ventas históricas (mock)
  const ventasHistoricas: ReporteSale[] = useMemo(() =>
    MESES_HISTORICOS.flatMap(mes =>
      (SALES_DETAIL_BY_MONTH[mes] ?? []).map(d => ({
        ...d, mes, commission: d.price * 0.02,
      }))
    ), []);

  const todasLasVentas = [...ventasHistoricas, ...ventasActuales];

  const ventasFiltradas = useMemo(() =>
    periodo === TODOS ? todasLasVentas : todasLasVentas.filter(v => v.mes === periodo),
    [periodo, todasLasVentas]);

  // KPIs
  const totalVendido   = ventasFiltradas.reduce((a, v) => a + v.price, 0);
  const totalComisiones = ventasFiltradas.reduce((a, v) => a + v.commission, 0);
  const ticketPromedio = ventasFiltradas.length > 0 ? totalVendido / ventasFiltradas.length : 0;

  // Por vendedor
  const porVendedor = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    ventasFiltradas.forEach(v => {
      if (!map[v.seller]) map[v.seller] = { count: 0, revenue: 0 };
      map[v.seller].count++;
      map[v.seller].revenue += v.price;
    });
    return Object.entries(map).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.revenue - a.revenue);
  }, [ventasFiltradas]);

  const topRevenue = porVendedor[0]?.revenue || 1;

  // Por pago
  const porPago = useMemo(() => {
    const map: Record<string, number> = {};
    ventasFiltradas.forEach(v => {
      const label = METHOD_LABELS[v.method] ?? v.method;
      map[label] = (map[label] ?? 0) + 1;
    });
    return Object.entries(map).map(([method, count]) => ({ method, count })).sort((a, b) => b.count - a.count);
  }, [ventasFiltradas]);

  // Gráfica
  const chartData = useMemo(() =>
    [...MESES_HISTORICOS, MES_ACTUAL].map(mes => {
      const v = todasLasVentas.filter(s => s.mes === mes);
      return { mes, monto: v.reduce((a, s) => a + s.price, 0), ventas: v.length, label: MES_LABEL[mes] };
    }), [todasLasVentas]);

  const periodoLabel = periodo === TODOS ? TODOS : MES_LABEL[periodo] ?? periodo;

  // ── Generar PDF ───────────────────────────────────────────────────────────
  const generarPDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const gris   = '#1a1a2e';
    const rojo   = [200, 16, 46] as [number, number, number];
    const blanco = [255, 255, 255] as [number, number, number];
    const grisOscuro = [30, 35, 48] as [number, number, number];
    const grisClaro  = [240, 242, 245] as [number, number, number];
    const verdeText  = [34, 197, 94] as [number, number, number];
    const ambar      = [251, 191, 36] as [number, number, number];

    // Header banda roja
    doc.setFillColor(...rojo);
    doc.rect(0, 0, W, 28, 'F');

    // Título
    doc.setTextColor(...blanco);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('HG MOTORS', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Gestión Automotriz · Mazatlán, Sinaloa', 14, 19);

    // Período y fecha
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Reporte: ${periodoLabel}`, W - 14, 12, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}`, W - 14, 19, { align: 'right' });

    // Línea decorativa
    doc.setFillColor(180, 10, 30);
    doc.rect(0, 28, W, 2, 'F');

    let y = 38;

    // ── KPI boxes ──
    doc.setTextColor(...[50, 50, 60] as [number, number, number]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('RESUMEN DEL PERÍODO', 14, y);
    y += 5;

    const kpis = [
      { label: 'Total Vendido',   value: formatCurrency(totalVendido),    color: verdeText },
      { label: 'Autos Vendidos',  value: `${ventasFiltradas.length} unidades`, color: [59, 130, 246] as [number, number, number] },
      { label: 'Ticket Promedio', value: formatCurrency(ticketPromedio),  color: [251, 191, 36] as [number, number, number] },
      { label: 'Comisiones',      value: formatCurrency(totalComisiones), color: [124, 58, 237] as [number, number, number] },
    ];

    const boxW = (W - 28 - 9) / 4;
    kpis.forEach((k, i) => {
      const x = 14 + i * (boxW + 3);
      doc.setFillColor(...grisClaro);
      doc.roundedRect(x, y, boxW, 18, 2, 2, 'F');
      doc.setDrawColor(...[220, 225, 230] as [number, number, number]);
      doc.roundedRect(x, y, boxW, 18, 2, 2, 'S');
      doc.setTextColor(...[120, 130, 145] as [number, number, number]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.text(k.label.toUpperCase(), x + boxW / 2, y + 5.5, { align: 'center' });
      doc.setTextColor(...k.color);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(k.value, x + boxW / 2, y + 13, { align: 'center' });
    });
    y += 26;

    // ── Tabla por vendedor ──
    doc.setTextColor(...[50, 50, 60] as [number, number, number]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DESEMPEÑO POR VENDEDOR', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Vendedor', 'Ventas', 'Total', 'Comisión']],
      body: porVendedor.map(v => [
        v.name,
        `${v.count} unidades`,
        formatCurrency(v.revenue),
        formatCurrency(v.revenue * 0.02),
      ]),
      headStyles: { fillColor: rojo, textColor: blanco, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: [50, 50, 60] },
      alternateRowStyles: { fillColor: grisClaro },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { halign: 'center' },
        2: { halign: 'right', textColor: verdeText, fontStyle: 'bold' },
        3: { halign: 'right', textColor: ambar },
      },
      margin: { left: 14, right: 14 },
      tableLineColor: [220, 225, 230],
      tableLineWidth: 0.2,
    });

    y = (doc as any).lastAutoTable.finalY + 8;

    // ── Tabla detalle de ventas ──
    doc.setTextColor(...[50, 50, 60] as [number, number, number]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DETALLE DE VENTAS', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Período', 'Vehículo', 'Cliente', 'Vendedor', 'F. Pago', 'Precio', 'Comisión']],
      body: ventasFiltradas.map(v => [
        MES_LABEL[v.mes] ?? v.mes,
        `${v.brand} ${v.model} ${v.year}`,
        v.client,
        v.seller,
        METHOD_LABELS[v.method] ?? v.method,
        formatCurrency(v.price),
        formatCurrency(v.commission),
      ]),
      foot: [['', '', '', '', 'TOTAL', formatCurrency(totalVendido), formatCurrency(totalComisiones)]],
      headStyles: { fillColor: grisOscuro, textColor: blanco, fontStyle: 'bold', fontSize: 7.5 },
      bodyStyles: { fontSize: 7.5, textColor: [50, 50, 60] },
      footStyles: { fillColor: rojo, textColor: blanco, fontStyle: 'bold', fontSize: 8 },
      alternateRowStyles: { fillColor: grisClaro },
      columnStyles: {
        0: { cellWidth: 26 },
        5: { halign: 'right', textColor: verdeText, fontStyle: 'bold' },
        6: { halign: 'right', textColor: ambar },
      },
      margin: { left: 14, right: 14 },
      tableLineColor: [220, 225, 230],
      tableLineWidth: 0.2,
    });

    // ── Footer en cada página ──
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFillColor(...grisOscuro);
      doc.rect(0, 287, W, 10, 'F');
      doc.setTextColor(...[150, 160, 175] as [number, number, number]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('HG Motors · Sistema de Gestión Automotriz · Confidencial', 14, 293);
      doc.text(`Página ${p} de ${pages}`, W - 14, 293, { align: 'right' });
    }

    const filename = periodo === TODOS
      ? 'HGMotors_Reporte_Completo.pdf'
      : `HGMotors_Reporte_${(MES_LABEL[periodo] ?? periodo).replace(' ', '_')}.pdf`;

    doc.save(filename);
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-hg-white tracking-wider">REPORTES</h1>
          <p className="text-hg-text text-xs mt-0.5">Historial de ventas y análisis por período</p>
        </div>
        <div className="flex items-center gap-3">

          {/* Selector de período */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 bg-hg-card border border-hg-border rounded-xl px-4 py-2.5 text-hg-white text-sm hover:border-hg-muted transition-colors min-w-[180px]"
            >
              <Calendar size={14} className="text-hg-red flex-shrink-0" />
              <span className="font-medium flex-1 text-left">{periodoLabel}</span>
              <ChevronDown size={14} className="text-hg-text flex-shrink-0" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-52 bg-hg-card border border-hg-border rounded-xl shadow-2xl overflow-hidden z-50">
                {[TODOS, ...MESES_HISTORICOS, MES_ACTUAL].map(p => (
                  <button
                    key={p}
                    onClick={() => { setPeriodo(p); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      periodo === p
                        ? 'text-hg-white bg-hg-red/20 font-medium'
                        : 'text-hg-text hover:text-hg-white hover:bg-hg-muted/40'
                    }`}
                  >
                    {p === TODOS ? TODOS : MES_LABEL[p]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Descargar PDF */}
          <button
            onClick={generarPDF}
            className="flex items-center gap-2 btn-primary"
          >
            <Download size={15} />
            Descargar PDF
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Total Vendido',   value: formatCurrency(totalVendido) },
          { icon: Car,        color: 'text-blue-400',    bg: 'bg-blue-400/10',    label: 'Autos Vendidos', value: ventasFiltradas.length },
          { icon: TrendingUp, color: 'text-amber-400',   bg: 'bg-amber-400/10',   label: 'Ticket Promedio',value: formatCurrency(ticketPromedio) },
          { icon: Receipt,    color: 'text-violet-400',  bg: 'bg-violet-400/10',  label: 'Comisiones',     value: formatCurrency(totalComisiones) },
        ].map(card => (
          <div key={card.label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-hg-text text-xs uppercase tracking-wider mt-3">{card.label}</p>
            <p className="text-hg-white text-xl font-bold font-mono">{card.value}</p>
            <p className="text-hg-text text-[11px] mt-0.5">{ventasFiltradas.length} operaciones</p>
          </div>
        ))}
      </div>

      {/* ── Gráfica (solo "Todo el período") ── */}
      {periodo === TODOS && (
        <div className="card p-5">
          <h3 className="text-hg-white font-semibold text-sm mb-4">Ventas por Mes</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2330" />
              <XAxis dataKey="mes" tick={{ fill: '#8892A4', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8892A4', fontSize: 10 }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: '#161A22', border: '1px solid #1E2330', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v), 'Monto']}
                labelFormatter={label => MES_LABEL[label] ?? label}
              />
              <Bar dataKey="monto" fill="#C8102E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Vendedor + Pago ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-hg-white font-semibold text-sm mb-4">Por Vendedor</h3>
          {porVendedor.length === 0
            ? <p className="text-hg-text text-xs text-center py-4">Sin datos</p>
            : (
              <div className="space-y-4">
                {porVendedor.map((v, i) => {
                  const color = SELLER_COLORS[v.name] ?? '#dc2626';
                  return (
                    <div key={v.name} className="flex items-center gap-3">
                      <span className="text-hg-text text-xs font-mono w-4 flex-shrink-0">{i + 1}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border flex-shrink-0"
                        style={{ background: `${color}20`, borderColor: `${color}40`, color }}>
                        {v.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-hg-white text-xs font-medium truncate">{v.name}</span>
                          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                            <span className="text-hg-text text-[10px] font-mono">{formatCurrency(v.revenue)}</span>
                            <span className="text-xs font-bold font-mono" style={{ color }}>{v.count} vtas</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-hg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(v.revenue / topRevenue) * 100}%`, background: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        <div className="card p-5">
          <h3 className="text-hg-white font-semibold text-sm mb-4">Por Forma de Pago</h3>
          {porPago.length === 0
            ? <p className="text-hg-text text-xs text-center py-4">Sin datos</p>
            : (
              <div className="space-y-3">
                {[
                  { key: 'Contado',        color: '#22c55e' },
                  { key: 'Crédito',        color: '#3b82f6' },
                  { key: 'Eng. + Crédito', color: '#7c3aed' },
                ].map(({ key, color }) => {
                  const count = porPago.find(p => p.method === key)?.count ?? 0;
                  const pct   = (count / (ventasFiltradas.length || 1)) * 100;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-hg-text text-xs">{key}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-hg-white text-xs font-mono font-bold">{count}</span>
                          <span className="text-hg-text text-[10px]">{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-hg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-hg-white font-semibold text-sm">Detalle de Ventas</h3>
          <span className="text-hg-text text-xs">{ventasFiltradas.length} registros</span>
        </div>
        {ventasFiltradas.length === 0
          ? <p className="text-hg-text text-xs text-center py-8">Sin ventas en este período</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-hg-border">
                    {['Período', 'Vehículo', 'Cliente', 'Vendedor', 'F. Pago', 'Precio', 'Comisión'].map(h => (
                      <th key={h} className="text-left text-hg-text uppercase tracking-wider text-[10px] pb-3 pr-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventasFiltradas.map((v, i) => {
                    const color = SELLER_COLORS[v.seller] ?? '#dc2626';
                    return (
                      <tr key={i} className="border-b border-hg-border/40 hover:bg-hg-muted/10 transition-colors">
                        <td className="py-3 pr-4">
                          <span className="text-hg-text text-[10px] whitespace-nowrap">{MES_LABEL[v.mes] ?? v.mes}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-hg-white font-medium">{v.brand} {v.model} {v.year}</p>
                          <p className="text-hg-text text-[10px]">{v.version}</p>
                        </td>
                        <td className="py-3 pr-4 text-hg-light">{v.client}</td>
                        <td className="py-3 pr-4">
                          <span className="font-medium" style={{ color }}>{v.seller}</span>
                        </td>
                        <td className="py-3 pr-4 text-hg-text">{METHOD_LABELS[v.method] ?? v.method}</td>
                        <td className="py-3 pr-4 text-emerald-400 font-mono font-bold">{formatCurrency(v.price)}</td>
                        <td className="py-3 text-amber-400 font-mono">{formatCurrency(v.commission)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-hg-border">
                    <td colSpan={5} className="pt-3 text-hg-text text-[10px] uppercase tracking-wider font-medium">Total período</td>
                    <td className="pt-3 text-emerald-400 font-mono font-bold">{formatCurrency(totalVendido)}</td>
                    <td className="pt-3 text-amber-400 font-mono font-bold">{formatCurrency(totalComisiones)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
