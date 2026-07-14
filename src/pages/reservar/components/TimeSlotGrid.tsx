import { TimeSlot } from '@/pages/reservar/hooks/useAvailability';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function TimeSlotGrid({
  slots,
  selectedTime,
  onSelect,
  loading,
  error,
  onRetry,
}: TimeSlotGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-sm text-foreground-500">Cargando horarios disponibles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <i className="ri-error-warning-line text-xl text-red-500"></i>
        </div>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-secondary-100 text-secondary-700 text-sm font-medium hover:bg-secondary-200 transition-colors duration-200 whitespace-nowrap cursor-pointer"
        >
          <i className="ri-refresh-line mr-1.5"></i>
          Reintentar
        </button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
          <i className="ri-time-line text-xl text-secondary-400"></i>
        </div>
        <p className="text-sm text-foreground-500">
          No hay horarios disponibles para esta fecha.
        </p>
        <p className="text-xs text-foreground-400">Selecciona otra fecha para ver disponibilidad.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
      {slots.map((slot) => {
        const isSelected = selectedTime === slot.time;
        return (
          <button
            key={slot.time}
            onClick={() => onSelect(slot.time)}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
              isSelected
                ? 'bg-primary-500 text-background-50 dark:text-foreground-950 shadow-lg shadow-primary-500/20 scale-105'
                : 'bg-background-100 text-foreground-700 hover:bg-primary-100 hover:text-primary-700 border border-background-200/70 hover:border-primary-200'
            }`}
          >
            {slot.display}
          </button>
        );
      })}
    </div>
  );
}