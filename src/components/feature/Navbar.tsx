import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background-50/95 backdrop-blur-md border-b border-background-200/70'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <i className="ri-line-chart-line text-background-50 text-lg"></i>
            </div>
            <span className={`text-lg font-semibold font-heading tracking-tight whitespace-nowrap transition-colors duration-200 ${scrolled ? 'text-foreground-900' : 'text-background-50'}`}>
              ConFinEx
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${scrolled ? 'text-foreground-700 hover:text-primary-600' : 'text-background-50 hover:text-background-50/80'}`}>
              Home
            </Link>
            <a href="#servicios" className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${scrolled ? 'text-foreground-700 hover:text-primary-600' : 'text-background-50 hover:text-background-50/80'}`}>
              Servicios
            </a>
            <a href="#como-funciona" className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${scrolled ? 'text-foreground-700 hover:text-primary-600' : 'text-background-50 hover:text-background-50/80'}`}>
              Cómo Funciona
            </a>
            <a href="#analistas" className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${scrolled ? 'text-foreground-700 hover:text-primary-600' : 'text-background-50 hover:text-background-50/80'}`}>
              Analistas
            </a>
            <Link
              to="/reservar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-500 text-background-50 text-sm font-medium hover:bg-primary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-calendar-check-line text-base"></i>
              Reservar Cita
            </Link>
            <Link
              to="/admin"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${scrolled ? 'border border-background-200/70 text-foreground-700 hover:bg-background-100' : 'bg-background-50 text-foreground-800 hover:bg-background-50/90'}`}
            >
              <i className="ri-dashboard-line text-base"></i>
              Admin
            </Link>
          </div>

          <Link
            to="/reservar"
            className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-background-50 text-sm font-medium hover:bg-primary-600 transition-all duration-200 whitespace-nowrap cursor-pointer"
          >
            <i className="ri-calendar-check-line text-base"></i>
            Reservar
          </Link>
        </div>
      </div>
    </nav>
  );
}