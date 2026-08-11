interface HeroSectionProps {
  title: string;
  babyName: string | null;
  heroImage: string | null;
  primaryColor: string | null;
}

export const HeroSection = ({ title, babyName, heroImage, primaryColor }: HeroSectionProps) => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {heroImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ivory via-cream to-warmBeige" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className="text-5xl md:text-7xl font-serif font-bold text-textPrimary mb-6"
          style={{ color: heroImage ? '#ffffff' : primaryColor || '#2D2D2D' }}
        >
          {title}
        </h1>
        {babyName && (
          <p
            className="text-xl md:text-2xl font-serif text-textSecondary mb-8"
            style={{ color: heroImage ? '#ffffff' : '#5A5A5A' }}
          >
            Celebrando la llegada de {babyName}
          </p>
        )}

        <div className="animate-bounce mt-12">
          <svg
            className="w-8 h-8 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: heroImage ? '#ffffff' : primaryColor || '#2D2D2D' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};
