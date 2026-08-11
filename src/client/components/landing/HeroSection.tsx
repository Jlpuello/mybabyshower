import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  title: string | null;
  babyName: string | null;
  heroImage: string | null;
  primaryColor: string | null;
}

export const HeroSection = ({ title, babyName, heroImage, primaryColor }: HeroSectionProps) => {
  const displayTitle = title && title.trim() ? title : 'Oh Baby';
  const displayName = babyName && babyName.trim() ? babyName : 'Danielle';
  const color = primaryColor || '#C9A962';

  const scrollToNextSection = () => {
    const target =
      document.getElementById('historia') ||
      document.getElementById('detalles') ||
      document.getElementById('revelacion') ||
      document.getElementById('galeria');

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between py-16 md:py-24 px-4 overflow-hidden select-none">
      {/* Background Layer */}
      {heroImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/70 via-sky-50/40 to-white">
          {/* Subtle Decorative SVG Clouds */}
          <div className="absolute top-10 left-10 w-72 h-36 bg-white/60 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/3 right-8 w-96 h-44 bg-white/70 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 left-1/4 w-80 h-40 bg-sky-50/80 rounded-full blur-2xl pointer-events-none" />
        </div>
      )}

      {/* 1. Título principal caligráfico (arriba con mayor separación) */}
      <div className="relative z-10 text-center pt-6 md:pt-10 mb-8 md:mb-16">
        <h1
          className="font-script text-7xl sm:text-8xl md:text-9xl tracking-wide font-normal drop-shadow-sm leading-none"
          style={{ color: heroImage ? '#1E293B' : '#334155' }}
        >
          {displayTitle}
        </h1>
      </div>

      {/* 2. Bloque de descripción intermedio centrado */}
      <div className="relative z-10 text-center max-w-xl mx-auto my-auto px-4">
        <p className="font-sans uppercase tracking-[0.22em] sm:tracking-[0.28em] text-xs sm:text-sm md:text-base font-semibold text-textSecondary leading-relaxed">
          PLEASE JOIN US FOR A BABY SHOWER HONORING MOMMY-TO-BE
        </p>
      </div>

      {/* 3. Nombre destacado caligráfico y Divisor (Nombre separado de la descripción y casi pegado a la línea) */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center mt-auto">
        <p
          className="font-script text-6xl sm:text-7xl md:text-8xl tracking-wide font-normal drop-shadow-sm leading-none mb-2 md:mb-3"
          style={{ color }}
        >
          {displayName}
        </p>

        {/* Línea horizontal delgada y sutil */}
        <div className="w-full border-t border-slate-300/60 mb-6 opacity-70" />

        {/* Botón / Span de flecha interactivo y parpadeante */}
        <button
          type="button"
          onClick={scrollToNextSection}
          className="group relative flex items-center justify-center p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
          title="Ver más detalles"
        >
          {/* Anillo exterior sutil con pulso */}
          <span
            className="absolute inset-0 rounded-full opacity-30 animate-ping group-hover:opacity-50"
            style={{ backgroundColor: color }}
          />

          {/* Badge del ícono */}
          <span
            className="relative z-10 w-11 h-11 rounded-full bg-white shadow-soft border border-slate-100 flex items-center justify-center transition-transform group-hover:shadow-md"
          >
            <ChevronDown
              className="w-6 h-6 animate-bounce transition-colors"
              style={{ color }}
            />
          </span>
        </button>
      </div>
    </section>
  );
};
