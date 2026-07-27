import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Analyst {
  id: string;
  name: string;
  active: boolean;
}

interface AppointmentWithDetails {
  id: string;
  analyst_id: string;
  client_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  comments: string;
  created_at: string;
  analyst_name: string;
  client_name: string;
  client_phone: string;
  client_email: string;
}

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  totalClients: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export default function useAdminData() {
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    totalClients: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const todayStr = new Date().toISOString().split('T')[0];

      const [
        analystsResult,
        appointmentsResult,
        totalClientsResult,
        todayResult,
        upcomingResult,
        completedResult,
        cancelledResult,
      ] = await Promise.all([
        supabase.from('analysts').select('id, name, active').eq('active', true).order('name'),
        supabase
          .from('appointments')
          .select(`
            id, analyst_id, client_id, appointment_date, appointment_time, status, comments, created_at,
            analysts ( name ),
            clients ( full_name, phone, email )
          `)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true }),
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('appointment_date', todayStr),
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .gte('appointment_date', todayStr),
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'completed'),
        supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'cancelled'),
      ]);

      if (analystsResult.error) throw new Error(analystsResult.error.message);
      if (appointmentsResult.error) throw new Error(appointmentsResult.error.message);

      const rawAppointments = appointmentsResult.data || [];

      const mapped: AppointmentWithDetails[] = rawAppointments.map((item) => {
        const analystData = Array.isArray(item.analysts) ? item.analysts[0] : item.analysts;
        const clientData = Array.isArray(item.clients) ? item.clients[0] : item.clients;

        return {
          id: item.id,
          analyst_id: item.analyst_id,
          client_id: item.client_id,
          appointment_date: item.appointment_date,
          appointment_time: item.appointment_time,
          status: item.status,
          comments: item.comments,
          created_at: item.created_at,
          analyst_name: analystData?.name || 'Desconocido',
          client_name: clientData?.full_name || 'Desconocido',
          client_phone: clientData?.phone || '',
          client_email: clientData?.email || '',
        };
      });

      setAnalysts(analystsResult.data || []);
      setAppointments(mapped);
      setStats({
        totalAppointments: mapped.length,
        todayAppointments: todayResult.count || 0,
        upcomingAppointments: upcomingResult.count || 0,
        totalClients: totalClientsResult.count || 0,
        completedAppointments: completedResult.count || 0,
        cancelledAppointments: cancelledResult.count || 0,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    const channel = supabase
      .channel('admin-appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          fetchAllData();
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        () => {
          fetchAllData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllData]);

  const getAppointmentsByAnalyst = useCallback(
    (analystId: string) => {
      return appointments.filter((a) => a.analyst_id === analystId);
    },
    [appointments],
  );

  const getAppointmentsByDate = useCallback(
    (date: string) => {
      return appointments.filter((a) => a.appointment_date === date);
    },
    [appointments],
  );

  const getAppointmentsByMonth = useCallback(
    (year: number, month: number) => {
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      return appointments.filter((a) => a.appointment_date.startsWith(prefix));
    },
    [appointments],
  );

  return {
    analysts,
    appointments,
    stats,
    loading,
    error,
    refresh: fetchAllData,
    getAppointmentsByAnalyst,
    getAppointmentsByDate,
    getAppointmentsByMonth,
  };
}