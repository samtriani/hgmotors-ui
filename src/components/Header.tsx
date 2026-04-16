import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, Car, Users, X, AlertTriangle, FileText, Wrench } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInventoryStore } from '../store/inventoryStore';
import { useCRMStore } from '../store/crmStore';
import { useSalesStore } from '../store/salesStore';
import { getRoleLabel, getDaysInInventory, formatCurrency } from '../utils';

interface HeaderProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

export default function Header({ onMenuToggle, pageTitle }: HeaderProps) {
  const user = useAuthStore(s => s.user);
  const cars = useInventoryStore(s => s.cars);
  const clients = useCRMStore(s => s.clients);
  const sales = useSalesStore(s => s.sales);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // ── Search results ──────────────────────────────────────────────
  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return null;
    const q = query.toLowerCase();
    const matchedCars = cars
      .filter(c => `${c.brand} ${c.model} ${c.version} ${c.year}`.toLowerCase().includes(q))
      .slice(0, 4);
    const matchedClients = clients
      .filter(c => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(q))
      .slice(0, 3);
    return { cars: matchedCars, clients: matchedClients };
  }, [query, cars, clients]);

  // ── Notifications ───────────────────────────────────────────────
  const notifications = useMemo(() => {
    const items: { id: string; type: 'taller' | 'docs' | 'inventario'; title: string; sub: string; route: string }[] = [];

    cars
      .filter(c => c.status === 'EN_TALLER')
      .forEach(c => items.push({
        id: c.id,
        type: 'taller',
        title: `${c.brand} ${c.model} en taller`,
        sub: `${getDaysInInventory(c.entryDate)} días · ${c.version}`,
        route: '/inventario',
      }));

    sales
      .filter(s => s.status === 'PENDIENTE_DOCS')
      .forEach(s => items.push({
        id: s.id,
        type: 'docs',
        title: 'Venta con documentos pendientes',
        sub: `Folio ${s.id.toUpperCase()} · ${formatCurrency(s.finalPrice)}`,
        route: '/ventas',
      }));

    cars
      .filter(c => getDaysInInventory(c.entryDate) > 60 && c.status !== 'VENDIDO')
      .forEach(c => items.push({
        id: `alert-${c.id}`,
        type: 'inventario',
        title: `${c.brand} ${c.model} lleva +60 días`,
        sub: `${getDaysInInventory(c.entryDate)} días en inventario`,
        route: '/inventario',
      }));

    return items;
  }, [cars, sales]);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const notifIcons = {
    taller: <Wrench size={14} className="text-blue-400" />,
    docs: <FileText size={14} className="text-amber-400" />,
    inventario: <AlertTriangle size={14} className="text-hg-red" />,
  };

  return (
    <header className="h-14 bg-hg-dark border-b border-hg-border flex items-center px-4 gap-4 sticky top-0 z-20 glass">
      <button onClick={onMenuToggle} className="text-hg-text hover:text-hg-light transition-colors lg:hidden">
        <Menu size={20} />
      </button>

      {pageTitle && (
        <h1 className="font-display text-xl text-hg-white tracking-wider hidden sm:block">{pageTitle}</h1>
      )}

      {/* Global search */}
      <div className="flex-1 hidden md:flex max-w-xs relative" ref={searchRef}>
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hg-text pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Buscar auto, cliente…"
            className="input-field pl-9 h-8 text-xs w-full"
          />
          {query && (
            <button onClick={() => { setQuery(''); setSearchOpen(false); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-hg-text hover:text-hg-light">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        {searchOpen && searchResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-hg-card border border-hg-border rounded-xl shadow-2xl overflow-hidden z-50">
            {searchResults.cars.length === 0 && searchResults.clients.length === 0 ? (
              <p className="text-hg-text text-xs p-4 text-center">Sin resultados para "{query}"</p>
            ) : (
              <>
                {searchResults.cars.length > 0 && (
                  <div>
                    <p className="text-hg-text text-[10px] uppercase tracking-wider px-3 pt-3 pb-1 font-medium">Vehículos</p>
                    {searchResults.cars.map(car => (
                      <button key={car.id} onClick={() => { navigate('/inventario'); setSearchOpen(false); setQuery(''); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-hg-muted/40 transition-colors text-left">
                        <div className="w-8 h-8 rounded-md overflow-hidden bg-hg-muted flex-shrink-0">
                          <img src={car.image} alt={car.model} className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-hg-white text-xs font-medium truncate">{car.brand} {car.model} {car.year}</p>
                          <p className="text-hg-text text-[10px] truncate">{car.version} · {formatCurrency(car.price)}</p>
                        </div>
                        <Car size={12} className="text-hg-text flex-shrink-0 ml-auto" />
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.clients.length > 0 && (
                  <div className="border-t border-hg-border/50">
                    <p className="text-hg-text text-[10px] uppercase tracking-wider px-3 pt-3 pb-1 font-medium">Clientes</p>
                    {searchResults.clients.map(client => (
                      <button key={client.id} onClick={() => { navigate('/clientes'); setSearchOpen(false); setQuery(''); }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-hg-muted/40 transition-colors text-left">
                        <div className="w-8 h-8 rounded-md bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-violet-400 text-[10px] font-bold">{client.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-hg-white text-xs font-medium truncate">{client.name}</p>
                          <p className="text-hg-text text-[10px] truncate">{client.phone} · {client.status}</p>
                        </div>
                        <Users size={12} className="text-hg-text flex-shrink-0 ml-auto" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative text-hg-text hover:text-hg-light transition-colors"
        >
          <Bell size={18} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-hg-red rounded-full text-white text-[9px] flex items-center justify-center font-bold">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 bg-hg-card border border-hg-border rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-hg-border">
              <p className="text-hg-white text-sm font-semibold">Notificaciones</p>
              <span className="text-hg-text text-xs">{notifications.length} activas</span>
            </div>

            {notifications.length === 0 ? (
              <p className="text-hg-text text-xs p-5 text-center">Sin notificaciones pendientes</p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <button key={n.id} onClick={() => { navigate(n.route); setNotifOpen(false); }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-hg-muted/30 transition-colors text-left border-b border-hg-border/40 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-hg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      {notifIcons[n.type]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-hg-white text-xs font-medium leading-tight">{n.title}</p>
                      <p className="text-hg-text text-[10px] mt-0.5">{n.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-hg-border px-4 py-2">
              <p className="text-hg-text text-[10px] text-center">Click en una alerta para ir al módulo</p>
            </div>
          </div>
        )}
      </div>

      {/* User avatar */}
      {user && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hg-red/20 border border-hg-red/30 flex items-center justify-center">
            <span className="text-hg-red text-xs font-bold font-mono">{user.avatar}</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-hg-white text-xs font-medium leading-tight">{user.name}</p>
            <p className="text-hg-text text-[10px] leading-tight">{getRoleLabel(user.role)}</p>
          </div>
        </div>
      )}
    </header>
  );
}
