import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { adminLogin, isAdminAuthenticated } from '@/pages/admin/components/AuthGuard';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Todos los campos son requeridos');
      return;
    }

    setLoading(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('admin_login', {
        p_email: email.trim(),
        p_password: password,
      });

      if (rpcError) {
        setError('Error de conexión. Intenta de nuevo: ' + rpcError.message);
        return;
      }

      if (data && data.success) {
        adminLogin(data.id, data.name);
        navigate('/admin', { replace: true });
      } else {
        setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError('Error inesperado: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <i className="ri-line-chart-line text-background-50 text-lg"></i>
            </div>
            <span className="text-xl font-semibold font-heading tracking-tight text-foreground-900 whitespace-nowrap">
              ConFinEx
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-foreground-950 mb-1">
            Panel Admin
          </h1>
          <p className="text-sm text-foreground-600">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-foreground-700 mb-1.5">
              Usuario
            </label>
            <input
              id="admin-email"
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="admin"
              autoComplete="username"
              className="w-full px-4 py-2.5 rounded-lg border border-background-200/70 text-sm bg-background-50 text-foreground-900 placeholder:text-foreground-400 transition-all duration-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-foreground-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="········"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-background-200/70 text-sm bg-background-50 text-foreground-900 placeholder:text-foreground-400 transition-all duration-200 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={() => { setShowPassword(!showPassword); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-400 hover:text-foreground-600 transition-colors cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={showPassword ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5">
              <i className="ri-error-warning-line text-red-500 mt-0.5 flex-shrink-0"></i>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary-500 text-background-50 dark:text-foreground-950 text-sm font-semibold hover:bg-primary-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-background-50/30 border-t-background-50 rounded-full animate-spin"></div>
                Verificando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i>
            Home
          </Link>
          <span className="text-foreground-300">|</span>
          <Link
            to="/reservar"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-600 hover:text-primary-600 transition-colors cursor-pointer"
          >
            <i className="ri-calendar-line"></i>
            Reservar Cita
          </Link>
        </div>
      </div>
    </div>
  );
}