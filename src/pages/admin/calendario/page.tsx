import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useAdminData from '../hooks/useAdminData';
import { adminLogout, getAdminName } from '../components/AuthGuard';
import AppointmentEditModal from '../components/AppointmentEditModal';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-accent-100 text-accent-800 border-accent-300',
  confirmed: 'bg-primary-100 text-primary-800 border-primary-300',
  completed: 'bg-secondary-100 text-secondary-800 border-secondary-300',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-accent-500',
  confirmed: 'bg-primary-500',
  completed: 'bg-secondary-500',
  cancelled: 'bg-red-400',
};

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export default function AdminCalendario() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [filterAnalyst, setFilterAnalyst] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<any | null>(null);

  const { analysts, appointments, stats, loading, error, refresh } = useAdminData();
  const adminName = getAdminName();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const todayStr = today.toISOString().split('T')[0];

  const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (!a.appointment_date.startsWith(monthPrefix)) return false;
      if (filterAnalyst && a.analyst_id !== filterAnalyst) return false;
      if (filterStatus && a.status !== filterStatus) return false;
      return true;
    });
  }, [appointments, monthPrefix, filterAnalyst, filterStatus]);

  const appointmentsByDate = useMemo(() => {
    const map: Record<string, typeof filteredAppointments> = {};
    filteredAppointments.forEach((a) => {
      if (!map[a.appointment_date]) map[a.appointment_date] = [];
      map[a.appointment_date].push(a);
    });
    return map;
  }, [filteredAppointments]);

  const selectedAppointments = selectedDate ? appointmentsByDate[selectedDate] || [] : [];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const handleSaved = () => {
    setEditingAppointment(null);
    refresh();
  };

  const handleDeleted = () => {
    setEditingAppointment(null);
    refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-50 pt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-foreground-600">Cargando calendario...</p>
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
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-background-200/70 text-sm text-foreground-600 hover:bg-background-100 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-left-line"></i>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950">
                  Calendario de Citas
                </h1>
                <p className="text-sm text-foreground-600 mt-1">
                  Visualiza y filtra todas las citas programadas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-foreground-500 bg-background-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                <i className="ri-shield-user-line mr-1"></i>
                {adminName}
              </span>
              <button
                onClick={() => { adminLogout(); window.location.reload(); }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-background-200/70 text-sm text-foreground-600 hover:bg-background-100 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-logout-box-r-line"></i>
              </button>
              <span className="text-sm text-foreground-600 bg-background-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                <strong className="text-foreground-900">{filteredAppointments.length}</strong> citas este mes
              </span>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Panel */}
          <div className="flex-1 min-w-0 animate-fade-in-up">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5 flex-wrap">
              <div className="relative">
                <select
                  value={filterAnalyst}
                  onChange={(e) => setFilterAnalyst(e.target.value)}
                  className="appearance-none bg-background-50 border border-background-200/70 rounded-lg pl-9 pr-8 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 cursor-pointer"
                >
                  <option value="">Todos los analistas</option>
                  {analysts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500 pointer-events-none"></i>
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-background-50 border border-background-200/70 rounded-lg pl-9 pr-8 py-2 text-sm text-foreground-800 focus:outline-none focus:border-primary-400 cursor-pointer"
                >
                  <option value="">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
                <i className="ri-filter-line absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500 pointer-events-none"></i>
              </div>
              {(filterAnalyst || filterStatus) && (
                <button
                  onClick={() => { setFilterAnalyst(''); setFilterStatus(''); }}
                  className="text-xs text-foreground-600 hover:text-foreground-900 underline whitespace-nowrap cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="w-9 h-9 rounded-lg border border-background-200/70 flex items-center justify-center hover:bg-background-100 transition-all duration-200 cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-foreground-700"></i>
              </button>
              <h2 className="text-lg font-heading font-semibold text-foreground-900">
                {MONTHS[currentMonth - 1]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="w-9 h-9 rounded-lg border border-background-200/70 flex items-center justify-center hover:bg-background-100 transition-all duration-200 cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-foreground-700"></i>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-background-200/70">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="py-2.5 text-center text-xs font-medium text-foreground-600 uppercase tracking-wide"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7">
                {days.map((day, idx) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="aspect-square border-b border-r border-background-200/40 bg-background-100/30"
                      ></div>
                    );
                  }

                  const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayAppointments = appointmentsByDate[dateStr] || [];
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`aspect-square border-b border-r border-background-200/40 p-1.5 flex flex-col items-center transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-primary-50 ring-1 ring-primary-300 ring-inset'
                          : isToday
                            ? 'bg-accent-50'
                            : 'hover:bg-background-100'
                      }`}
                    >
                      <span
                        className={`text-xs font-medium mb-1 w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-primary-500 text-background-50'
                            : isSelected
                              ? 'text-primary-700'
                              : 'text-foreground-700'
                        }`}
                      >
                        {day}
                      </span>
                      {dayAppointments.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 justify-center">
                          {dayAppointments.slice(0, 3).map((a) => (
                            <span
                              key={a.id}
                              className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[a.status] || 'bg-secondary-400'}`}
                              title={`${a.client_name} - ${a.appointment_time.slice(0, 5)}`}
                            ></span>
                          ))}
                          {dayAppointments.length > 3 && (
                            <span className="text-[9px] text-foreground-500 leading-none">
                              +{dayAppointments.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-foreground-600 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-500"></span> Pendiente
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500"></span> Confirmada
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-500"></span> Completada
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Cancelada
              </span>
            </div>
          </div>

          {/* Side Panel - Day Detail */}
          <div className="w-full lg:w-80 shrink-0 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="bg-background-50 rounded-xl border border-background-200/70 p-5 lg:sticky lg:top-24">
              {selectedDate ? (
                <>
                  <h3 className="text-base font-heading font-semibold text-foreground-900 mb-4 flex items-center gap-2">
                    <i className="ri-calendar-event-line text-primary-500"></i>
                    {selectedDate.split('-').reverse().join('/')}
                  </h3>

                  {selectedAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary-100 flex items-center justify-center">
                        <i className="ri-calendar-check-line text-secondary-500"></i>
                      </div>
                      <p className="text-sm text-foreground-600">
                        Sin citas para este día
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedAppointments
                        .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
                        .map((appt) => (
                          <div
                            key={appt.id}
                            className={`p-3 rounded-lg border ${STATUS_STYLES[appt.status] || 'bg-secondary-50 border-secondary-200'} transition-all duration-150 relative group`}
                          >
                            {/* Action buttons - top right */}
                            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingAppointment(appt);
                                }}
                                className="w-7 h-7 rounded-md bg-background-50 border border-background-200/70 flex items-center justify-center hover:bg-primary-50 hover:border-primary-300 transition-all duration-150 cursor-pointer"
                                title="Editar cita"
                              >
                                <i className="ri-edit-line text-xs text-foreground-600 hover:text-primary-600"></i>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingAppointment({ ...appt, _directDelete: true });
                                }}
                                className="w-7 h-7 rounded-md bg-background-50 border border-background-200/70 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-all duration-150 cursor-pointer"
                                title="Eliminar cita"
                              >
                                <i className="ri-delete-bin-line text-xs text-foreground-600 hover:text-red-600"></i>
                              </button>
                            </div>

                            <div className="flex items-center justify-between mb-1.5 pr-12">
                              <span className="text-sm font-semibold text-foreground-900">
                                {appt.appointment_time.slice(0, 5)}
                              </span>
                              <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-600">
                                {appt.status === 'pending' ? 'Pendiente' : appt.status === 'confirmed' ? 'Confirmada' : appt.status === 'completed' ? 'Completada' : appt.status === 'cancelled' ? 'Cancelada' : appt.status}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-foreground-800">
                              {appt.client_name}
                            </p>
                            <p className="text-xs text-foreground-600 mt-0.5">
                              {appt.analyst_name}
                            </p>
                            {appt.client_phone && (
                              <p className="text-xs text-foreground-500 mt-1 flex items-center gap-1">
                                <i className="ri-phone-line text-[10px]"></i>
                                {appt.client_phone}
                              </p>
                            )}
                            {appt.client_email && (
                              <p className="text-xs text-foreground-500 mt-0.5 flex items-center gap-1 truncate">
                                <i className="ri-mail-line text-[10px]"></i>
                                {appt.client_email}
                              </p>
                            )}
                            {appt.comments && (
                              <p className="text-xs text-foreground-600 mt-2 italic leading-relaxed border-t border-background-200/50 pt-2">
                                &ldquo;{appt.comments}&rdquo;
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary-100 flex items-center justify-center">
                    <i className="ri-arrow-left-line text-xl text-secondary-500"></i>
                  </div>
                  <p className="text-sm text-foreground-600 leading-relaxed">
                    Selecciona un día del calendario para ver las citas programadas
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingAppointment && (
        <AppointmentEditModal
          appointment={editingAppointment}
          analysts={analysts}
          onClose={() => setEditingAppointment(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}