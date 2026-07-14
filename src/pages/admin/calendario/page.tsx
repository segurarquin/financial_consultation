import { Link } from 'react-router-dom';

export default function AdminCalendario() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-50 px-6">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary-100 flex items-center justify-center">
          <i className="ri-calendar-2-line text-2xl text-secondary-500"></i>
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground-950 mb-3">
          Calendario de Citas
        </h1>
        <p className="text-foreground-600 mb-8 leading-relaxed">
          La vista de calendario estará disponible en la siguiente fase. Podrás filtrar por analista, fecha y estado de las citas.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary-500 text-background-50 dark:text-foreground-950 text-sm font-medium hover:bg-secondary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-dashboard-line"></i>
            Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 text-background-50 text-sm font-medium hover:bg-primary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line"></i>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}