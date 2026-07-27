import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Analyst {
  id: string;
  name: string;
}

interface AppointmentEditData {
  id: string;
  client_id: string;
  analyst_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  comments: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  analyst_name: string;
}

interface AppointmentEditModalProps {
  appointment: AppointmentEditData;
  analysts: Analyst[];
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
];

export default function AppointmentEditModal({
  appointment,
  analysts,
  onClose,
  onSaved,
  onDeleted,
}: AppointmentEditModalProps) {
  const [clientName, setClientName] = useState(appointment.client_name);
  const [clientPhone, setClientPhone] = useState(appointment.client_phone);
  const [clientEmail, setClientEmail] = useState(appointment.client_email);
  const [status, setStatus] = useState(appointment.status);
  const [analystId, setAnalystId] = useState(appointment.analyst_id);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isDirectDelete = !!(appointment as any)._directDelete;

  useEffect(() => {
    setClientName(appointment.client_name);
    setClientPhone(appointment.client_phone);
    setClientEmail(appointment.client_email);
    setStatus(appointment.status);
    setAnalystId(appointment.analyst_id);
    setError(null);
    setSuccessMsg(null);
    setShowDeleteConfirm(isDirectDelete);
  }, [appointment]);

  const handleSave = async () => {
    if (!clientName.trim()) {
      setError('El nombre del cliente es obligatorio');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      // Update client info
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          full_name: clientName.trim(),
          phone: clientPhone.trim(),
          email: clientEmail.trim() || null,
        })
        .eq('id', appointment.client_id);

      if (clientError) throw new Error(clientError.message);

      // Update appointment
      const { error: apptError } = await supabase
        .from('appointments')
        .update({
          status,
          analyst_id: analystId,
        })
        .eq('id', appointment.id);

      if (apptError) throw new Error(apptError.message);

      setSuccessMsg('Cita actualizada correctamente');
      setTimeout(() => {
        onSaved();
      }, 600);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar cambios';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointment.id);

      if (deleteError) throw new Error(deleteError.message);

      onDeleted();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar la cita';
      setError(message);
    } finally {
      setDeleting(false);
    }
  };

  const formattedDate = appointment.appointment_date
    .split('-')
    .reverse()
    .join('/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background-50 rounded-2xl shadow-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-background-200/70">
          <h3 className="text-lg font-heading font-semibold text-foreground-900">
            Editar Cita
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-background-100 transition-all duration-200 cursor-pointer"
          >
            <i className="ri-close-line text-foreground-600"></i>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Success / Error messages */}
          {successMsg && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary-50 text-primary-700 text-sm">
              <i className="ri-check-line"></i>
              {successMsg}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 text-red-700 text-sm">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          {/* Client Info Section */}
          <div>
            <h4 className="text-xs font-semibold text-foreground-500 uppercase tracking-wide mb-3">
              Información del Cliente
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-foreground-600 mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-all duration-200"
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground-600 mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-all duration-200"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground-600 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-all duration-200"
                    placeholder="cliente@email.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details Section */}
          <div>
            <h4 className="text-xs font-semibold text-foreground-500 uppercase tracking-wide mb-3">
              Detalles de la Cita
            </h4>
            <div className="space-y-3">
              {/* Date & Time (readonly) */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background-100/70 border border-background-200/40">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                  <i className="ri-calendar-line text-primary-600 text-sm"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground-900">
                    {formattedDate}
                  </p>
                  <p className="text-xs text-foreground-600">
                    {appointment.appointment_time.slice(0, 5)} hrs
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs text-foreground-600 mb-1.5">
                  Estado
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="appearance-none w-full px-3 py-2 pr-8 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-all duration-200 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-foreground-500 pointer-events-none text-sm"></i>
                </div>
              </div>

              {/* Analyst */}
              <div>
                <label className="block text-xs text-foreground-600 mb-1.5">
                  Analista asignado
                </label>
                <div className="relative">
                  <select
                    value={analystId}
                    onChange={(e) => setAnalystId(e.target.value)}
                    className="appearance-none w-full px-3 py-2 pr-8 rounded-lg border border-background-200/70 bg-background-50 text-sm text-foreground-900 focus:outline-none focus:border-primary-400 transition-all duration-200 cursor-pointer"
                  >
                    {analysts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-foreground-500 pointer-events-none text-sm"></i>
                </div>
              </div>

              {/* Comments (readonly) */}
              {appointment.comments && (
                <div>
                  <label className="block text-xs text-foreground-600 mb-1.5">
                    Comentarios del cliente
                  </label>
                  <div className="px-3 py-2.5 rounded-lg bg-background-100/70 border border-background-200/40 text-sm text-foreground-700 italic">
                    &ldquo;{appointment.comments}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-background-200/70 space-y-3">
          {/* Delete area */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-delete-bin-line"></i>
              Eliminar esta cita
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 space-y-2.5">
              <p className="text-sm text-red-700 font-medium">
                ¿Estás seguro? Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-background-50 text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background-50 border-t-transparent rounded-full animate-spin"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <i className="ri-delete-bin-line"></i>
                      Sí, eliminar
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg border border-background-200/70 text-sm text-foreground-600 hover:bg-background-100 transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-background-200/70 text-sm text-foreground-600 hover:bg-background-100 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-500 text-background-50 text-sm font-medium hover:bg-primary-600 disabled:opacity-50 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-background-50 border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}