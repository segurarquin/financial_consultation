import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAdminData from './hooks/useAdminData';
import StatCard from './components/StatCard';
import AgendaTable from './components/AgendaTable';
import { adminLogout, getAdminName } from './components/AuthGuard';

export default function Admin() {
  const { analysts, appointments, stats, loading, error, refresh, getAppointmentsByAnalyst } =
    useAdminData();
  const [selectedAnalyst, setSelectedAnalyst] = useState<string | null>(null);
  const adminName = getAdminName();

  const currentAnalyst = analysts.find((a) => a.id === selectedAnalyst);
  const filteredAppointments = selectedAnalyst
    ? getAppointmentsByAnalyst(selectedAnalyst)
    : appointments;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointment_date === todayStr);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-50 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-foreground-600">Cargando panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-50 pt-20 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <i className="ri-error-warning-line text-xl text-red-500"></i>
          </div>
          <p className="text-foreground-700 mb-2 font-medium">Error al cargar datos</p>
          <p className="text-sm text-foreground-600 mb-5">{error}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 text-background-50 text-sm font-medium hover:bg-primary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-refresh-line"></i>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-50 pt-20 pb-16">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950">
                Panel Administrativo
              </h1>
              <p className="text-sm text-foreground-600 mt-1">
                Gestiona y visualiza todas las citas de asesoría
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-foreground-500 bg-background-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                <i className="ri-shield-user-line mr-1"></i>
                {adminName}
              </span>
              <button
                onClick={() => { adminLogout(); window.location.reload(); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-background-200/70 text-sm font-medium text-foreground-700 hover:bg-background-100 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-r-line"></i>
                Cerrar Sesión
              </button>
              <button
                onClick={refresh}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-background-200/70 text-sm font-medium text-foreground-700 hover:bg-background-100 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-refresh-line"></i>
                Actualizar
              </button>
              <Link
                to="/admin/calendario"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary-500 text-background-50 dark:text-foreground-950 text-sm font-medium hover:bg-secondary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-2-line"></i>
                Calendario
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: 'ri-calendar-check-line', label: 'Total de Citas', value: stats.totalAppointments, accentClass: 'bg-primary-100 text-primary-600' },
            { icon: 'ri-calendar-event-line', label: 'Citas del Día', value: stats.todayAppointments, accentClass: 'bg-accent-100 text-accent-600' },
            { icon: 'ri-calendar-todo-line', label: 'Próximas Citas', value: stats.upcomingAppointments, accentClass: 'bg-secondary-100 text-secondary-600' },
            { icon: 'ri-user-line', label: 'Total de Clientes', value: stats.totalClients, accentClass: 'bg-primary-100 text-primary-600' },
          ].map((card, idx) => (
            <div key={card.label} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <StatCard {...card} />
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[
            { icon: 'ri-check-double-line', label: 'Citas Completadas', value: stats.completedAppointments, accentClass: 'bg-secondary-100 text-secondary-600' },
            { icon: 'ri-close-circle-line', label: 'Citas Canceladas', value: stats.cancelledAppointments, accentClass: 'bg-red-50 text-red-500' },
          ].map((card, idx) => (
            <div key={card.label} className="animate-fade-in-up" style={{ animationDelay: `${0.4 + idx * 0.1}s` }}>
              <StatCard {...card} />
            </div>
          ))}
        </div>

        {/* Analyst Selector */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-heading font-semibold text-foreground-900 mb-4">
            Agenda por Analista
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedAnalyst(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                selectedAnalyst === null
                  ? 'bg-primary-500 text-background-50'
                  : 'bg-background-100 text-foreground-700 hover:bg-background-200'
              }`}
            >
              Todos
            </button>
            {analysts.map((analyst) => (
              <button
                key={analyst.id}
                onClick={() => setSelectedAnalyst(analyst.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  selectedAnalyst === analyst.id
                    ? 'bg-primary-500 text-background-50'
                    : 'bg-background-100 text-foreground-700 hover:bg-background-200'
                }`}
              >
                {analyst.name}
              </button>
            ))}
          </div>
        </div>

        {/* Today's Appointments Quick View */}
        {todayAppointments.length > 0 && (
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
            <h3 className="text-base font-heading font-semibold text-foreground-900 mb-3 flex items-center gap-2">
              <i className="ri-calendar-event-line text-accent-500"></i>
              Citas de Hoy ({todayStr.split('-').reverse().join('/')})
            </h3>
            <div className="bg-background-50 rounded-xl border border-accent-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-background-200/70 bg-accent-50/30">
                      <th className="text-left py-2.5 px-4 font-medium text-foreground-700 whitespace-nowrap">Hora</th>
                      <th className="text-left py-2.5 px-4 font-medium text-foreground-700 whitespace-nowrap">Cliente</th>
                      <th className="text-left py-2.5 px-4 font-medium text-foreground-700 whitespace-nowrap">Analista</th>
                      <th className="text-left py-2.5 px-4 font-medium text-foreground-700 whitespace-nowrap">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.map((appt) => (
                      <tr key={appt.id} className="border-b border-background-200/40 hover:bg-background-100/50 transition-colors">
                        <td className="py-2.5 px-4 text-foreground-900 font-medium whitespace-nowrap">
                          {appt.appointment_time.slice(0, 5)}
                        </td>
                        <td className="py-2.5 px-4 text-foreground-700 whitespace-nowrap">
                          {appt.client_name}
                        </td>
                        <td className="py-2.5 px-4 text-foreground-600 whitespace-nowrap">
                          {appt.analyst_name}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            appt.status === 'pending' ? 'bg-accent-100 text-accent-800' :
                            appt.status === 'confirmed' ? 'bg-primary-100 text-primary-800' :
                            appt.status === 'completed' ? 'bg-secondary-100 text-secondary-800' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Agenda Table */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <AgendaTable
          appointments={filteredAppointments}
          analystName={currentAnalyst?.name || 'todos los analistas'}
        />
        </div>
      </div>
    </div>
  );
}