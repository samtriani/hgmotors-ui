import dayjs from 'dayjs';

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount);

export const formatNumber = (n: number) =>
  new Intl.NumberFormat('es-MX').format(n);

export const getDaysInInventory = (entryDate: string) =>
  dayjs().diff(dayjs(entryDate), 'day');

export const getInventoryBadge = (days: number) => {
  if (days < 30) return { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: `${days}d` };
  if (days < 60) return { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: `${days}d` };
  return { color: 'text-hg-red bg-hg-red/10 border-hg-red/20', label: `${days}d ⚠` };
};

export const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    DISPONIBLE: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    RESERVADO: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    VENDIDO: 'text-hg-text bg-hg-muted/50 border-hg-border',
    EN_TALLER: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    NUEVO: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    SEGUIMIENTO: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    NEGOCIACION: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    CERRADO: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    PERDIDO: 'text-hg-text bg-hg-muted/50 border-hg-border',
    COMPLETADA: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    PENDIENTE_DOCS: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    CANCELADA: 'text-hg-red bg-hg-red/10 border-hg-red/20',
    EN_PROCESO: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    PENDIENTE: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    COMPLETADO: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  };
  return map[status] || 'text-hg-text bg-hg-muted/50 border-hg-border';
};

export const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    DISPONIBLE: 'Disponible', RESERVADO: 'Reservado', VENDIDO: 'Vendido',
    EN_TALLER: 'En Taller', NUEVO: 'Nuevo', SEGUIMIENTO: 'Seguimiento',
    NEGOCIACION: 'Negociación', CERRADO: 'Cerrado', PERDIDO: 'Perdido',
    COMPLETADA: 'Completada', PENDIENTE_DOCS: 'Docs Pendientes', CANCELADA: 'Cancelada',
    EN_PROCESO: 'En Proceso', PENDIENTE: 'Pendiente', COMPLETADO: 'Completado',
  };
  return map[status] || status;
};

export const getRoleLabel = (role: string) => {
  const map: Record<string, string> = {
    DIRECTOR: 'Director General', GERENTE: 'Gerente de Ventas',
    VENDEDOR: 'Agente de Ventas', TALLER: 'Mecánico / Taller', ADMIN: 'Administración',
  };
  return map[role] || role;
};

export const calculateCredit = (price: number, downPayment: number, months: number) => {
  const financed = price - downPayment;
  const annualRate = 0.18; // 18% anual mock
  const monthlyRate = annualRate / 12;
  const monthlyPayment = financed * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalAmount = monthlyPayment * months + downPayment;
  const totalInterest = totalAmount - price;
  return { monthlyPayment, totalAmount, totalInterest, monthlyRate };
};
