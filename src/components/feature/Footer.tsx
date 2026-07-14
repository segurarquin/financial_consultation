import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-background-50/80">
      <div className="w-full px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
                <i className="ri-line-chart-line text-background-50 text-lg"></i>
              </div>
              <span className="text-lg font-semibold text-background-50 font-heading tracking-tight whitespace-nowrap">
                FinConsult
              </span>
            </div>
            <p className="text-sm leading-relaxed text-background-50/60">
              Asesoría financiera profesional para ayudarte a tomar las mejores decisiones con tu patrimonio.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-background-50 mb-4 uppercase tracking-wider">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/reservar" className="text-sm text-background-50/60 hover:text-background-50 transition-colors duration-200 whitespace-nowrap">
                  Reservar Cita
                </Link>
              </li>
              <li>
                <a href="#servicios" className="text-sm text-background-50/60 hover:text-background-50 transition-colors duration-200 whitespace-nowrap">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-sm text-background-50/60 hover:text-background-50 transition-colors duration-200 whitespace-nowrap">
                  Cómo Funciona
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-background-50 mb-4 uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5 text-sm text-background-50/60">
                <i className="ri-mail-line text-base"></i>
                <span>contacto@finconsult.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-background-50/60">
                <i className="ri-phone-line text-base"></i>
                <span>+52 55 1234 5678</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-background-50/60">
                <i className="ri-map-pin-line text-base"></i>
                <span>Ciudad de México, MX</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background-50/10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <p className="text-xs text-background-50/40">
            &copy; {currentYear} FinConsult. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-background-50/40 hover:text-background-50/70 transition-colors duration-200 whitespace-nowrap" rel="nofollow">
              Privacidad
            </a>
            <a href="#" className="text-xs text-background-50/40 hover:text-background-50/70 transition-colors duration-200 whitespace-nowrap" rel="nofollow">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}