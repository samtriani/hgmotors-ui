import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff, Car, AlertCircle } from 'lucide-react';

const DEMO_USERS = [
  { email: 'director@hg.com', role: 'Director General', color: 'text-hg-red' },
  { email: 'gerente@hg.com', role: 'Gerente de Ventas', color: 'text-violet-400' },
  { email: 'vendedor@hg.com', role: 'Agente de Ventas', color: 'text-amber-400' },
  { email: 'taller@hg.com', role: 'Taller', color: 'text-blue-400' },
  { email: 'admin@hg.com', role: 'Administración', color: 'text-emerald-400' },
];

export default function Login() {
  const [email, setEmail] = useState('director@hg.com');
  const [password, setPassword] = useState('hg2024');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Credenciales incorrectas. Intenta de nuevo.');
  };

  return (
    <div className="min-h-screen bg-hg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-hg-grid opacity-30" />
      {/* Red glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-hg-red/10 rounded-full blur-[100px]" />
      {/* Red glow bottom */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-hg-red/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10 animate-in">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 overflow-hidden border border-hg-border bg-hg-card">
            <img
              src="https://hgmotors.mx/wp-content/uploads/2023/06/HgLogo-03.png"
              alt="HG Motors"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="font-display text-4xl text-hg-white tracking-wider">HG MOTORS</h1>
          <p className="text-hg-text text-sm mt-1 font-body">Sistema de Gestión Interno · ERP</p>
        </div>

        {/* Login card */}
        <div className="card p-8 shadow-2xl">
          <h2 className="text-hg-light font-semibold text-lg mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="usuario@hg.com"
                required
              />
            </div>
            <div>
              <label className="block text-hg-text text-xs font-medium mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-hg-text hover:text-hg-light transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-hg-red/10 border border-hg-red/20 rounded-lg px-3 py-2 text-hg-red text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full hg-gradient text-white font-semibold py-2.5 rounded-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Car size={16} /> Ingresar al Sistema</>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-hg-border">
            <p className="text-hg-text text-xs font-medium uppercase tracking-wider mb-3">
              Accesos demo — contraseña: <span className="text-hg-light font-mono">hg2024</span>
            </p>
            <div className="space-y-1.5">
              {DEMO_USERS.map(u => (
                <button
                  key={u.email}
                  onClick={() => { setEmail(u.email); setPassword('hg2024'); setError(''); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-hg-muted/50 transition-colors group"
                >
                  <span className={`text-xs font-medium ${u.color}`}>{u.role}</span>
                  <span className="text-hg-text text-xs font-mono group-hover:text-hg-light transition-colors">{u.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-hg-text/50 text-xs mt-6">
          HG Motors © 2024 · Plaza Andanza, Mazatlán, Sin.
        </p>
      </div>
    </div>
  );
}
