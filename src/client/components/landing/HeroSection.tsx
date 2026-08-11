import { Heart } from 'lucide-react';
import { SectionNavButton } from './SectionNavButton';
import { PeekingBaby } from './PeekingBaby';

interface HeroSectionProps {
  title: string | null;
  babyName: string | null;
  description: string | null;
  heroImage: string | null;
  primaryColor: string | null;
  secondaryColor?: string | null;
}

export const HeroSection = ({ title, babyName, description, heroImage, primaryColor, secondaryColor }: HeroSectionProps) => {
  const displayTitle = title && title.trim() ? title : 'Oh Baby';
  const displayName = babyName && babyName.trim() ? babyName : 'Danielle';
  const displayDescription = description && description.trim()
    ? description.toUpperCase()
    : 'PLEASE JOIN US FOR A BABY SHOWER HONORING MOMMY-TO-BE';
  const color = primaryColor || '#C9A962';
  const secColor = secondaryColor || '#D4C4B7';

  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col items-center justify-between py-6 sm:py-10 md:py-16 px-4 overflow-hidden select-none">
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

      {/* Decorative Peeking Babies */}
      <PeekingBaby side="left" position="top" delay="500" />
      <PeekingBaby side="right" position="bottom" delay="800" />

      {/* 1. Título principal caligráfico */}
      <div className="relative z-10 text-center pt-2 sm:pt-4 md:pt-6 mb-3 sm:mb-6 md:mb-10">
        <h1
          className="font-script text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wide font-normal drop-shadow-xs leading-tight sm:leading-none"
          style={{ color: heroImage ? '#1E293B' : '#334155' }}
        >
          {displayTitle}
        </h1>
      </div>

      {/* 2. Bloque de descripción intermedio centrado */}
      <div className="relative z-10 text-center max-w-xl mx-auto my-auto py-2 sm:py-4 px-3 sm:px-4">
        <p
          className="font-sans uppercase tracking-[0.18em] sm:tracking-[0.28em] text-[11px] sm:text-sm md:text-base font-semibold text-textSecondary leading-relaxed border-y py-2 sm:py-2.5 px-4 rounded-xl"
          style={{ borderColor: `${secColor}70`, backgroundColor: `${secColor}15` }}
        >
          {displayDescription}
        </p>
      </div>

      {/* 3. Nombre destacado caligráfico con corazones y animación de rebote */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center mt-auto pt-1 sm:pt-2">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-0 sm:mb-1 animate-bounce">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-current opacity-80" style={{ color }} />
          <p
            className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wide font-normal drop-shadow-md leading-none"
            style={{ color }}
          >
            {displayName}
          </p>
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-current opacity-80" style={{ color }} />
        </div>

        <SectionNavButton targetId={['historia', 'revelacion', 'detalles', 'galeria']} color={color} />
      </div>
    </section>
  );
};
