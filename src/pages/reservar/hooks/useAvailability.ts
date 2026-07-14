import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface TimeSlot {
  time: string;
  display: string;
}

export function useAvailability(analystId: string | null, date: string | null) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!analystId || !date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dayOfWeek = new Date(date + 'T12:00:00').getDay();

      const { data: availability, error: availError } = await supabase
        .from('analyst_availability')
        .select('start_time, end_time')
        .eq('analyst_id', analystId)
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();

      if (availError) throw availError;
      if (!availability) {
        setSlots([]);
        setLoading(false);
        return;
      }

      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('analyst_id', analystId)
        .eq('appointment_date', date)
        .neq('status', 'Cancelled');

      if (apptError) throw apptError;

      const bookedTimes = new Set(
        (appointments || []).map((a: { appointment_time: string }) =>
          a.appointment_time.substring(0, 5)
        )
      );

      const generatedSlots: TimeSlot[] = [];
      const [startH, startM] = availability.start_time.split(':').map(Number);
      const [endH, endM] = availability.end_time.split(':').map(Number);

      let currentH = startH;
      let currentM = startM;
      const endTotal = endH * 60 + endM;

      while (currentH * 60 + currentM < endTotal) {
        const timeStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;

        if (!bookedTimes.has(timeStr)) {
          const hour12 = currentH % 12 || 12;
          const ampm = currentH < 12 ? 'AM' : 'PM';
          generatedSlots.push({
            time: timeStr,
            display: `${hour12}:${String(currentM).padStart(2, '0')} ${ampm}`,
          });
        }

        currentM += 30;
        if (currentM >= 60) {
          currentH += 1;
          currentM = 0;
        }
      }

      setSlots(generatedSlots);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar disponibilidad';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [analystId, date]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  useEffect(() => {
    if (!analystId || !date) return;

    const channel = supabase
      .channel(`appointments-${analystId}-${date}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `analyst_id=eq.${analystId}`,
        },
        (payload) => {
          const newAppointment = payload.new as { appointment_date: string; appointment_time: string; status: string };
          if (
            newAppointment.appointment_date === date &&
            newAppointment.status !== 'Cancelled'
          ) {
            const bookedTime = newAppointment.appointment_time.substring(0, 5);
            setSlots((prev) => prev.filter((slot) => slot.time !== bookedTime));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [analystId, date]);

  return { slots, loading, error, refetch: fetchAvailability };
}