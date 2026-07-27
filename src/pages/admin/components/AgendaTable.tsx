import { useState } from 'react';

interface AgendaTableProps {
  appointments: Array<{
    id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    comments: string;
    client_name: string;
    client_phone: string;
    client_email: string;
  }>;
  analystName: string;
}

type SortField = 'appointment_date' | 'appointment_time' | 'client_name' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-accent-100 text-accent-800',
  Confirmed: 'bg-primary-100 text-primary-800',
  Completed: 'bg-secondary-100 text-secondary-800',
  Cancelled: 'bg-red-50 text-red-700',
};

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export default function AgendaTable({ appointments, analystName }: AgendaTableProps) {
  const [sortField, setSortField] = useState<SortField>('appointment_date');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sorted = [...appointments].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'appointment_date') {
      cmp = a.appointment_date.localeCompare(b.appointment_date);
    } else if (sortField === 'appointment_time') {
      cmp = a.appointment_time.localeCompare(b.appointment_time);
    } else if (sortField === 'client_name') {
      cmp = a.client_name.localeCompare(b.client_name);
    } else if (sortField === 'status') {
      cmp = a.status.localeCompare(b.status);
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <i className="ri-arrow-up-down-line text-foreground-400 text-xs"></i>;
    return (
      <i
        className={`text-primary-500 text-xs ${sortDir === 'asc' ? 'ri-sort-asc' : 'ri-sort-desc'}`}
      ></i>
    );
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-background-50 rounded-xl border border-background-200/70 p-10 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary-100 flex items-center justify-center">
          <i className="ri-calendar-2-line text-xl text-secondary-500"></i>
        </div>
        <p className="text-foreground-600 text-sm">
          No hay citas registradas para {analystName}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background-50 rounded-xl border border-background-200/70 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-background-200/70 bg-background-100/70">
              <th
                className="text-left py-3 px-4 font-medium text-foreground-700 cursor-pointer hover:text-primary-600 transition-colors whitespace-nowrap"
                onClick={() => handleSort('client_name')}
              >
                <span className="inline-flex items-center gap-1.5">
                  Cliente <SortIcon field="client_name" />
                </span>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-foreground-700 cursor-pointer hover:text-primary-600 transition-colors whitespace-nowrap"
                onClick={() => handleSort('appointment_date')}
              >
                <span className="inline-flex items-center gap-1.5">
                  Fecha <SortIcon field="appointment_date" />
                </span>
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-foreground-700 cursor-pointer hover:text-primary-600 transition-colors whitespace-nowrap"
                onClick={() => handleSort('appointment_time')}
              >
                <span className="inline-flex items-center gap-1.5">
                  Hora <SortIcon field="appointment_time" />
                </span>
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground-700 whitespace-nowrap">
                Teléfono
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground-700 whitespace-nowrap">
                Email
              </th>
              <th
                className="text-left py-3 px-4 font-medium text-foreground-700 cursor-pointer hover:text-primary-600 transition-colors whitespace-nowrap"
                onClick={() => handleSort('status')}
              >
                <span className="inline-flex items-center gap-1.5">
                  Estado <SortIcon field="status" />
                </span>
              </th>
              <th className="text-left py-3 px-4 font-medium text-foreground-700 whitespace-nowrap">
                Comentarios
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((appt) => (
              <tr
                key={appt.id}
                className="border-b border-background-200/40 hover:bg-background-100/50 transition-colors"
              >
                <td className="py-3 px-4 text-foreground-900 font-medium whitespace-nowrap">
                  {appt.client_name}
                </td>
                <td className="py-3 px-4 text-foreground-700 whitespace-nowrap">
                  {formatDate(appt.appointment_date)}
                </td>
                <td className="py-3 px-4 text-foreground-700 whitespace-nowrap">
                  {appt.appointment_time.slice(0, 5)}
                </td>
                <td className="py-3 px-4 text-foreground-600 whitespace-nowrap">
                  {appt.client_phone || '-'}
                </td>
                <td className="py-3 px-4 text-foreground-600 whitespace-nowrap max-w-[180px] truncate">
                  {appt.client_email || '-'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.status] || 'bg-secondary-100 text-secondary-800'}`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-foreground-600 max-w-[180px] truncate">
                  {appt.comments || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}