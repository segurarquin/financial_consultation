import { Link } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

const features = [
  {
    icon: 'ri-user-star-line',
    title: 'Analistas Expertos',
    description: 'Nuestro equipo de analistas financieros cuenta con amplia experiencia en inversiones, planificación patrimonial y estrategia fiscal.',
  },
  {
    icon: 'ri-calendar-todo-line',
    title: 'Agenda Inteligente',
    description: 'Sistema de reservas en tiempo real que te muestra solo los horarios disponibles, sin complicaciones ni llamadas telefónicas.',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Asesoría Confidencial',
    description: 'Toda la información compartida durante tus consultas es totalmente confidencial y protegida bajo estrictos estándares de seguridad.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Elige tu Analista',
    description: 'Selecciona entre nuestros analistas disponibles según el perfil que mejor se adapte a tus necesidades.',
  },
  {
    number: '02',
    title: 'Selecciona Fecha y Hora',
    description: 'Elige el día y horario que más te convenga. Solo verás los espacios realmente disponibles.',
  },
  {
    number: '03',
    title: 'Confirma tu Cita',
    description: 'Completa tus datos, confirma la reserva y recibe la confirmación al instante. Así de fácil.',
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative w-full min-h-[620px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=Abstract%20geometric%20composition%20with%20soft%20flowing%20lines%20in%20muted%20steel%20blue%20and%20warm%20cream%20tones%2C%20subtle%20gradient%20overlay%2C%20minimalist%20corporate%20background%2C%20clean%20smooth%20curves%2C%20professional%20finance%20theme%2C%20no%20text%2C%20ethereal%20glow%2C%20elegant%20abstract%20shapes%2C%20soft%20lighting%2C%20high%20end%20aesthetic&width=1800&height=1000&seq=hero-bg-finconsult&orientation=landscape"
            alt="FinConsult - Asesoría financiera profesional"
            title="FinConsult Asesoría Financiera Profesional"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50"></div>

          <div className="relative z-10 w-full px-6 md:px-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-50/15 backdrop-blur-sm border border-background-50/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></div>
              <span className="text-xs font-medium text-background-50/90 tracking-wide uppercase">
                Asesoría Financiera Profesional
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-background-50 leading-tight mb-5">
              Tu futuro financiero
              <br />
              <span className="text-accent-300">comienza aquí</span>
            </h1>

            <p className="text-base md:text-lg text-background-50/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Agenda una consulta personalizada con nuestros analistas expertos y recibe orientación profesional para alcanzar tus metas financieras.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/reservar"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg bg-accent-500 text-background-50 dark:text-foreground-950 text-base font-semibold hover:bg-accent-600 transition-all duration-200 shadow-lg shadow-accent-500/25 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-calendar-check-line text-lg"></i>
                Reservar Cita
              </Link>
              <a
                href="#servicios"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg border border-background-50/30 text-background-50 text-base font-medium hover:bg-background-50/10 transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-down-line text-lg"></i>
                Conocer Más
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="w-full px-6 md:px-10 py-20 md:py-28 bg-background-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold tracking-wide uppercase mb-3">
                Nuestros Servicios
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground-950 mb-4">
                Asesoría que marca la diferencia
              </h2>
              <p className="text-foreground-600 max-w-xl mx-auto text-sm md:text-base">
                Te acompañamos en cada etapa de tu vida financiera con un servicio personalizado y profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-xl bg-background-100 border border-background-200/70 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-5 group-hover:bg-primary-500 transition-colors duration-300">
                    <i className={`${feature.icon} text-xl text-primary-600 group-hover:text-background-50 transition-colors duration-300`}></i>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="como-funciona" className="w-full px-6 md:px-10 py-20 md:py-28 bg-background-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold tracking-wide uppercase mb-3">
                Proceso Simple
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground-950 mb-4">
                ¿Cómo funciona?
              </h2>
              <p className="text-foreground-600 max-w-xl mx-auto text-sm md:text-base">
                Reservar tu asesoría financiera nunca fue tan fácil. Solo tres pasos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative text-center group">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-primary-200">
                      <div className="absolute right-0 -top-[4px] w-2.5 h-2.5 rounded-full bg-primary-400"></div>
                    </div>
                  )}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500 text-background-50 flex items-center justify-center group-hover:bg-accent-500 transition-colors duration-300">
                    <span className="text-2xl font-heading font-bold">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground-600 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analysts Section */}
        <section id="analistas" className="w-full px-6 md:px-10 py-20 md:py-28 bg-background-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold tracking-wide uppercase mb-3">
                Nuestro Equipo
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground-950 mb-4">
                Conoce a nuestros analistas
              </h2>
              <p className="text-foreground-600 max-w-xl mx-auto text-sm md:text-base">
                Profesionales certificados listos para ayudarte a alcanzar tus objetivos financieros.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="p-8 rounded-xl bg-background-100 border border-background-200/70 text-center group hover:border-primary-200 transition-all duration-300 cursor-default">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden bg-secondary-200">
                  <img
                    src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20confident%20male%20financial%20advisor%20in%20his%2040s%2C%20wearing%20a%20navy%20suit%20with%20a%20crisp%20white%20shirt%2C%20friendly%20expression%2C%20clean%20studio%20background%20with%20soft%20neutral%20lighting%2C%20corporate%20portrait%20style&width=200&height=200&seq=analyst-x&orientation=squarish"
                    alt="PersonaX - Analista Financiero Senior"
                    title="PersonaX Analista Financiero"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground-900 mb-1">PersonaX</h3>
                <p className="text-sm text-primary-600 font-medium mb-3">Analista Financiero Senior</p>
                <p className="text-sm text-foreground-600 leading-relaxed mb-4">
                  Especialista en inversiones y planificación patrimonial con más de 15 años de experiencia en el sector financiero.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-foreground-500 bg-background-50 px-3 py-1.5 rounded-full">
                  <i className="ri-time-line text-sm"></i>
                  <span>Lun - Vie | 8:00 AM - 5:00 PM</span>
                </div>
              </div>

              <div className="p-8 rounded-xl bg-background-100 border border-background-200/70 text-center group hover:border-primary-200 transition-all duration-300 cursor-default">
                <div className="w-20 h-20 mx-auto mb-5 rounded-full overflow-hidden bg-secondary-200">
                  <img
                    src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20confident%20female%20financial%20advisor%20in%20her%2030s%2C%20wearing%20a%20tailored%20blazer%2C%20warm%20smile%2C%20clean%20studio%20background%20with%20soft%20neutral%20lighting%2C%20corporate%20portrait%20style&width=200&height=200&seq=analyst-y&orientation=squarish"
                    alt="PersonaY - Analista Financiera"
                    title="PersonaY Analista Financiera"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground-900 mb-1">PersonaY</h3>
                <p className="text-sm text-primary-600 font-medium mb-3">Analista Financiera</p>
                <p className="text-sm text-foreground-600 leading-relaxed mb-4">
                  Experta en estrategia fiscal y planeación de retiro, con enfoque en soluciones personalizadas para cada etapa de vida.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-foreground-500 bg-background-50 px-3 py-1.5 rounded-full">
                  <i className="ri-time-line text-sm"></i>
                  <span>Lun - Vie | 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-6 md:px-10 py-20 md:py-28 bg-primary-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-500 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-background-50 blur-3xl"></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-background-50 mb-4">
              ¿Listo para tomar el control de tus finanzas?
            </h2>
            <p className="text-base text-background-50/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Da el primer paso hacia un futuro financiero más sólido. Agenda tu consulta hoy mismo.
            </p>
            <Link
              to="/reservar"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-lg bg-accent-500 text-background-50 dark:text-foreground-950 text-base font-semibold hover:bg-accent-600 transition-all duration-200 shadow-lg shadow-accent-500/25 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-calendar-check-line text-lg"></i>
              Reservar Mi Cita
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}