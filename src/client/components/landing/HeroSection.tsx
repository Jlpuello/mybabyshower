import { SectionNavButton } from './SectionNavButton';

interface HeroSectionProps {
  title: string | null;
  babyName: string | null;
  description: string | null;
  heroImage: string | null;
  primaryColor: string | null;
}

export const HeroSection = ({ title, babyName, description, heroImage, primaryColor }: HeroSectionProps) => {
  const displayTitle = title && title.trim() ? title : 'Oh Baby';
  const displayName = babyName && babyName.trim() ? babyName : 'Danielle';
  const displayDescription = description && description.trim()
    ? description.toUpperCase()
    : 'PLEASE JOIN US FOR A BABY SHOWER HONORING MOMMY-TO-BE';
  const color = primaryColor || '#C9A962';

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-between py-12 md:py-20 px-4 overflow-hidden select-none">
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

      {/* 1. Título principal caligráfico */}
      <div className="relative z-10 text-center pt-4 md:pt-8 mb-8 md:mb-16">
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
          {displayDescription}
        </p>
      </div>

      {/* 3. Nombre destacado caligráfico y Navegación inferior */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center mt-auto">
        <p
          className="font-script text-6xl sm:text-7xl md:text-8xl tracking-wide font-normal drop-shadow-sm leading-none mb-1 md:mb-2"
          style={{ color }}
        >
          {displayName}
        </p>

        <SectionNavButton targetId={['historia', 'revelacion', 'detalles', 'galeria']} color={color} />
      </div>
    </section>
  );
};
