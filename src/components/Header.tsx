import { Bell, Search, Menu, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getRoleLabel } from '../utils';

interface HeaderProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

export default function Header({ onMenuToggle, pageTitle }: HeaderProps) {
  const user = useAuthStore(s => s.user);

  return (
    <header className="h-14 bg-hg-dark border-b border-hg-border flex items-center px-4 gap-4 sticky top-0 z-20 glass">
      <button
        onClick={onMenuToggle}
        className="text-hg-text hover:text-hg-light transition-colors lg:hidden"
      >
        <Menu size={20} />
      </button>

      {pageTitle && (
        <h1 className="font-display text-xl text-hg-white tracking-wider hidden sm:block">{pageTitle}</h1>
      )}

      <div className="flex-1 hidden md:flex max-w-xs">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hg-text" />
          <input
            type="text"
            placeholder="Buscar…"
            className="input-field pl-9 h-8 text-xs"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* WhatsApp quick button */}
      <a
        href="https://api.whatsapp.com/send?phone=5216699942914&text=!Hola%20me%20interesa%20informaci%C3%B3n!"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
      >
        <MessageCircle size={14} />
        <span className="hidden sm:block">WhatsApp</span>
      </a>

      {/* Notifications */}
      <button className="relative text-hg-text hover:text-hg-light transition-colors">
        <Bell size={18} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-hg-red rounded-full text-white text-[9px] flex items-center justify-center font-bold">3</span>
      </button>

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
