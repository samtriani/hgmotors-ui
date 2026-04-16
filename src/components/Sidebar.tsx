import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard, Car, Users, DollarSign, Calculator,
  Wrench, FileText, LogOut, ChevronRight, MapPin
} from 'lucide-react';
import { getRoleLabel } from '../utils';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['DIRECTOR','GERENTE','VENDEDOR','ADMIN','TALLER'] },
  { to: '/inventario', icon: Car, label: 'Inventario', roles: ['DIRECTOR','GERENTE','VENDEDOR','ADMIN','TALLER'] },
  { to: '/clientes', icon: Users, label: 'Clientes (CRM)', roles: ['DIRECTOR','GERENTE','VENDEDOR','ADMIN'] },
  { to: '/ventas', icon: DollarSign, label: 'Ventas', roles: ['DIRECTOR','GERENTE','VENDEDOR','ADMIN'] },
  { to: '/credito', icon: Calculator, label: 'Simulador Crédito', roles: ['DIRECTOR','GERENTE','VENDEDOR','ADMIN'] },
  { to: '/taller', icon: Wrench, label: 'Taller', roles: ['DIRECTOR','GERENTE','TALLER','ADMIN'] },
  { to: '/administracion', icon: FileText, label: 'Administración', roles: ['DIRECTOR','ADMIN'] },
];

export default function Sidebar({ collapsed, onClose }: { collapsed?: boolean; onClose?: () => void }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter(item =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className={`flex flex-col h-full bg-hg-dark border-r border-hg-border ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-hg-border">
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-hg-card border border-hg-border flex-shrink-0">
          <img src="https://hgmotors.mx/wp-content/uploads/2023/06/HgLogo-03.png" alt="HG" className="w-full h-full object-contain p-1" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-display text-xl text-hg-white tracking-widest">HG MOTORS</span>
            <div className="flex items-center gap-1 text-hg-text text-[10px] mt-0.5">
              <MapPin size={9} />
              <span>Mazatlán, Sin.</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-hg-text/50 text-[10px] uppercase tracking-[0.15em] font-medium px-3 py-2">
            Módulos
          </p>
        )}
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} className="text-hg-red" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-hg-border">
        {user && (
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${!collapsed ? 'bg-hg-muted/30' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-hg-red/20 border border-hg-red/30 flex items-center justify-center flex-shrink-0">
              <span className="text-hg-red text-xs font-bold font-mono">{user.avatar}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-hg-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-hg-text text-xs truncate">{getRoleLabel(user.role)}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className={`sidebar-item sidebar-item-inactive w-full mt-1 text-hg-red/70 hover:text-hg-red hover:bg-hg-red/10`}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}
