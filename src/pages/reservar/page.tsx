import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAvailability } from '@/pages/reservar/hooks/useAvailability';
import StepIndicator from '@/pages/reservar/components/StepIndicator';
import TimeSlotGrid from '@/pages/reservar/components/TimeSlotGrid';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

interface Analyst {
  id: string;
  name: string;
  active: boolean;
}

const STEPS = [
  { label: 'Analista', icon: 'ri-user-star-line' },
  { label: 'Fecha', icon: 'ri-calendar-line' },
  { label: 'Horario', icon: 'ri-time-line' },
  { label: 'Datos', icon: 'ri-file-list-line' },
];

function generateWeekdays(count: number): { value: string; display: string }[] {
  const dates: { value: string; display: string }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = new Date(today);
  current.setDate(current.getDate() + 1);

  while (dates.length < count) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, '0');
      const dd = String(current.getDate()).padStart(2, '0');
      const value = `${yyyy}-${mm}-${dd}`;

      const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
      ];
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      dates.push({
        value,
        display: `${dayNames[day]} ${dd} ${monthNames[current.getMonth()]}`,
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export default function Reservar() {
  const [step, setStep] = useState(1);
  const [reachedStep, setReachedStep] = useState(1);

  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [analystsLoading, setAnalystsLoading] = useState(true);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Analyst | null>(null);

  const weekdays = useMemo(() => generateWeekdays(14), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { slots, loading: slotsLoading, error: slotsError, refetch: refetchSlots } = useAvailability(
    selectedAnalyst?.id ?? null,
    selectedDate
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    comments: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function fetchAnalysts() {
      try {
        const { data, error } = await supabase
          .from('analysts')
          .select('id, name, active')
          .eq('active', true)
          .order('name');

        if (error) throw error;
        setAnalysts(data || []);
      } catch {
        setAnalysts([]);
      } finally {
        setAnalystsLoading(false);
      }
    }
    fetchAnalysts();
  }, []);

  const goToStep = (s: number) => {
    if (s <= reachedStep) {
      setStep(s);
      if (s < 3) {
        setSelectedTime(null);
      }
      if (s < 2) {
        setSelectedDate(null);
      }
      if (s < 1) {
        setSelectedAnalyst(null);
      }
    }
  };

  const handleSelectAnalyst = (analyst: Analyst) => {
    setSelectedAnalyst(analyst);
    setSelectedDate(null);
    setSelectedTime(null);
    setReachedStep(Math.max(reachedStep, 2));
    setStep(2);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setReachedStep(Math.max(reachedStep, 3));
    setStep(3);
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setReachedStep(Math.max(reachedStep, 4));
    setStep(4);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = 'El nombre debe tener al menos 3 caracteres';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'El número de teléfono es requerido';
    } else if (!/^[\d\s\-+()]{7,20}$/.test(formData.phone.trim())) {
      errors.phone = 'Ingresa un número de teléfono válido';
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido';
    }
    if (formData.comments.length > 500) {
      errors.comments = 'Los comentarios no pueden exceder 500 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitClick = () => {
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setSubmitting(true);
    setSubmitError(null);

    try {
      const { count, error: checkError } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('analyst_id', selectedAnalyst!.id)
        .eq('appointment_date', selectedDate!)
        .eq('appointment_time', `${selectedTime!}:00`)
        .neq('status', 'cancelled');

      if (checkError) throw checkError;
      if (count && count > 0) {
        throw new Error('Este horario acaba de ser reservado por otro usuario. Por favor selecciona otro horario.');
      }

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          full_name: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
        })
        .select('id')
        .single();

      if (clientError) throw clientError;

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          analyst_id: selectedAnalyst!.id,
          client_id: clientData.id,
          appointment_date: selectedDate!,
          appointment_time: `${selectedTime!}:00`,
          status: 'pending',
          comments: formData.comments.trim() || null,
        });

      if (appointmentError) throw appointmentError;

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear la cita. Intenta de nuevo.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 pb-10 px-6 flex items-center justify-center bg-background-50">
          <div className="max-w-lg w-full text-center animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-pop-in" style={{ animationDelay: '0.2s' }}>
              <i className="ri-check-line text-3xl text-green-600"></i>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950 mb-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              ¡Cita Reservada!
            </h1>
            <p className="text-foreground-600 mb-2 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
              Tu cita con <strong>{selectedAnalyst?.name}</strong> ha sido agendada.
            </p>
            <p className="text-sm text-foreground-500 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {selectedDate && (
                <>
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </>
              )}{' '}
              a las {selectedTime} hrs
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="px-6 py-2.5 rounded-lg bg-primary-500 text-background-50 dark:text-foreground-950 text-sm font-medium hover:bg-primary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-home-line mr-1.5"></i>
                Volver al Inicio
              </Link>
              <button
                onClick={() => {
                  setSuccess(false);
                  setStep(1);
                  setReachedStep(1);
                  setSelectedAnalyst(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setFormData({ fullName: '', phone: '', email: '', comments: '' });
                  setFormErrors({});
                  setSubmitError(null);
                }}
                className="px-6 py-2.5 rounded-lg bg-background-100 text-foreground-700 text-sm font-medium hover:bg-background-200 transition-all duration-200 whitespace-nowrap cursor-pointer border border-background-200/70"
              >
                <i className="ri-add-line mr-1.5"></i>
                Nueva Reserva
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-16 px-4 md:px-6 bg-background-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950 mb-2">
              Reserva tu Cita
            </h1>
            <p className="text-sm text-foreground-500">
              Completa los siguientes pasos para agendar tu asesoría financiera.
            </p>
          </div>

          <StepIndicator
            currentStep={step}
            steps={STEPS}
            onStepClick={goToStep}
            reachedStep={reachedStep}
          />

          {/* Step 1: Select Analyst */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h3 className="text-lg font-heading font-semibold text-foreground-900 mb-1 text-center">
                Selecciona tu analista
              </h3>
              <p className="text-sm text-foreground-500 mb-6 text-center">
                Elige el analista financiero con quien deseas agendar tu cita.
              </p>

              {analystsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                </div>
              ) : analysts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-foreground-500">No hay analistas disponibles en este momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                  {analysts.map((analyst, idx) => (
                    <button
                      key={analyst.id}
                      onClick={() => handleSelectAnalyst(analyst)}
                      className="p-6 rounded-xl bg-background-100 border-2 border-background-200/70 hover:border-primary-400 hover:bg-primary-50/50 transition-all duration-300 text-left group cursor-pointer animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300 flex-shrink-0">
                          <i className="ri-user-3-line text-lg text-primary-600 group-hover:text-background-50 transition-colors duration-300"></i>
                        </div>
                        <div>
                          <p className="font-heading font-semibold text-foreground-900 text-base">
                            {analyst.name}
                          </p>
                          <p className="text-xs text-foreground-500 mt-0.5">Analista Financiero</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-xl text-foreground-300 group-hover:text-primary-500 transition-all duration-300 ml-auto group-hover:translate-x-1"></i>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Date */}
          {step === 2 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <i className="ri-user-3-line text-primary-600"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-900">{selectedAnalyst?.name}</p>
                  <button
                    onClick={() => goToStep(1)}
                    className="text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                  >
                    Cambiar analista
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-heading font-semibold text-foreground-900 mb-1 text-center">
                Selecciona la fecha
              </h3>
              <p className="text-sm text-foreground-500 mb-6 text-center">
                Elige el día que mejor se adapte a tu agenda.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-w-xl mx-auto">
                {weekdays.map((d, idx) => {
                  const isSelected = selectedDate === d.value;
                  const dateObj = new Date(d.value + 'T00:00:00');
                  const dayNum = dateObj.getDate();

                  return (
                    <button
                      key={d.value}
                      onClick={() => handleSelectDate(d.value)}
                      className={`flex flex-col items-center gap-1 px-4 py-3.5 rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap animate-fade-in-up ${
                        isSelected
                          ? 'bg-primary-500 text-background-50 dark:text-foreground-950 shadow-lg shadow-primary-500/20 scale-105'
                          : 'bg-background-100 text-foreground-700 hover:bg-primary-100 hover:text-primary-700 border border-background-200/70'
                      }`}
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <span className="text-xs font-medium opacity-70">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dateObj.getDay()]}
                      </span>
                      <span className="text-xl font-heading font-bold">{dayNum}</span>
                      <span className="text-xs opacity-70">
                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][dateObj.getMonth()]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {step === 3 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <i className="ri-user-3-line text-primary-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground-900">{selectedAnalyst?.name}</p>
                    <button onClick={() => goToStep(1)} className="text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
                      Cambiar
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <i className="ri-calendar-line text-primary-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground-900">
                      {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                    <button onClick={() => goToStep(2)} className="text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
                      Cambiar
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-heading font-semibold text-foreground-900 mb-1 text-center">
                Selecciona el horario
              </h3>
              <p className="text-sm text-foreground-500 mb-6 text-center">
                Solo se muestran los horarios realmente disponibles.
              </p>

              <div className="max-w-md mx-auto">
                <TimeSlotGrid
                  slots={slots}
                  selectedTime={selectedTime}
                  onSelect={handleSelectTime}
                  loading={slotsLoading}
                  error={slotsError}
                  onRetry={refetchSlots}
                />
              </div>
            </div>
          )}

          {/* Step 4: Personal Info */}
          {step === 4 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground-900">{selectedAnalyst?.name}</span>
                </div>
                <span className="text-foreground-300">|</span>
                <span className="text-sm text-foreground-600">
                  {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
                <span className="text-foreground-300">|</span>
                <span className="text-sm font-semibold text-primary-600">{selectedTime} hrs</span>
                <button
                  onClick={() => goToStep(3)}
                  className="text-xs text-primary-600 hover:text-primary-700 transition-colors cursor-pointer ml-2"
                >
                  Cambiar
                </button>
              </div>

              <h3 className="text-lg font-heading font-semibold text-foreground-900 mb-1 text-center">
                Tus datos
              </h3>
              <p className="text-sm text-foreground-500 mb-6 text-center">
                Completa la información para confirmar tu cita.
              </p>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground-700 mb-1.5">
                    Nombre completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                    }}
                    placeholder="Ej. Carlos Mendoza López"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-background-50 text-foreground-900 placeholder:text-foreground-400 transition-all duration-200 outline-none ${
                      formErrors.fullName
                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-background-200/70 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground-700 mb-1.5">
                    Número de teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                    }}
                    placeholder="Ej. +52 55 1234 5678"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-background-50 text-foreground-900 placeholder:text-foreground-400 transition-all duration-200 outline-none ${
                      formErrors.phone
                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-background-200/70 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground-700 mb-1.5">
                    Correo electrónico <span className="text-foreground-400 text-xs">(opcional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    placeholder="Ej. carlos@correo.com"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-background-50 text-foreground-900 placeholder:text-foreground-400 transition-all duration-200 outline-none ${
                      formErrors.email
                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-background-200/70 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-foreground-700 mb-1.5">
                    Comentarios <span className="text-foreground-400 text-xs">(opcional, máx. 500 caracteres)</span>
                  </label>
                  <textarea
                    id="comments"
                    rows={3}
                    maxLength={500}
                    value={formData.comments}
                    onChange={(e) => {
                      setFormData({ ...formData, comments: e.target.value });
                      if (formErrors.comments) setFormErrors({ ...formErrors, comments: '' });
                    }}
                    placeholder="¿Algún tema específico que quieras tratar en la consulta?"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-background-50 text-foreground-900 placeholder:text-foreground-400 transition-all duration-200 outline-none resize-none ${
                      formErrors.comments
                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-background-200/70 focus:border-primary-400 focus:ring-2 focus:ring-primary-100'
                    }`}
                  ></textarea>
                  {formErrors.comments && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.comments}</p>
                  )}
                  <p className="text-xs text-foreground-400 mt-1 text-right">
                    {formData.comments.length}/500
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                    <i className="ri-error-warning-line text-red-500 mt-0.5"></i>
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                )}

                <button
                  onClick={handleSubmitClick}
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-primary-500 text-background-50 dark:text-foreground-950 text-sm font-semibold hover:bg-primary-600 transition-all duration-200 shadow-lg shadow-primary-500/20 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-background-50/30 border-t-background-50 rounded-full animate-spin"></div>
                      Reservando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-calendar-check-line"></i>
                      Confirmar Reserva
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowConfirm(false)}></div>
          <div className="relative bg-background-50 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-[scaleIn_0.2s_ease-out]">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                <i className="ri-calendar-check-line text-2xl text-primary-600"></i>
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground-950 mb-2">
                Confirmar Reserva
              </h3>
              <p className="text-sm text-foreground-500">
                Revisa los detalles de tu cita antes de confirmar.
              </p>
            </div>

            <div className="bg-background-100 rounded-xl p-4 mb-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-line text-sm text-primary-600"></i>
                </div>
                <div>
                  <p className="text-xs text-foreground-500">Analista</p>
                  <p className="text-sm font-medium text-foreground-900">{selectedAnalyst?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-calendar-line text-sm text-primary-600"></i>
                </div>
                <div>
                  <p className="text-xs text-foreground-500">Fecha</p>
                  <p className="text-sm font-medium text-foreground-900">
                    {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-time-line text-sm text-primary-600"></i>
                </div>
                <div>
                  <p className="text-xs text-foreground-500">Hora</p>
                  <p className="text-sm font-medium text-foreground-900">{selectedTime} hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <i className="ri-user-3-line text-sm text-primary-600"></i>
                </div>
                <div>
                  <p className="text-xs text-foreground-500">Cliente</p>
                  <p className="text-sm font-medium text-foreground-900">{formData.fullName}</p>
                  <p className="text-xs text-foreground-500">{formData.phone}{formData.email ? ` · ${formData.email}` : ''}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg bg-background-100 text-foreground-700 text-sm font-medium hover:bg-background-200 transition-all duration-200 whitespace-nowrap cursor-pointer border border-background-200/70"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-lg bg-primary-500 text-background-50 dark:text-foreground-950 text-sm font-semibold hover:bg-primary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                Confirmar Cita
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}