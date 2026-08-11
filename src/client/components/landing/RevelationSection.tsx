import { SectionNavButton } from './SectionNavButton';

interface RevelationSectionProps {
  revelationTitle: string | null;
  revelationContent: string | null;
  revelationMediaUrl: string | null;
  revelationMediaType: string | null;
  isRevealed: boolean;
  primaryColor: string | null;
}

export const RevelationSection = ({
  revelationTitle,
  revelationContent,
  revelationMediaUrl,
  revelationMediaType,
  isRevealed,
  primaryColor,
}: RevelationSectionProps) => {
  if (!isRevealed || !revelationTitle) return null;

  return (
    <section id="revelacion" className="min-h-screen flex flex-col items-center justify-between py-16 px-4 bg-cream select-none">
      <div className="h-4" />

      <div className="max-w-4xl mx-auto my-auto text-center w-full">
        <h2
          className="text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-8 text-center"
          style={{ color: primaryColor || '#2D2D2D' }}
        >
          {revelationTitle}
        </h2>

        {revelationMediaUrl && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-soft max-w-2xl mx-auto">
            {revelationMediaType === 'VIDEO' ? (
              <video
                src={revelationMediaUrl}
                controls
                className="w-full"
                style={{ maxHeight: '420px' }}
                preload="metadata"
              />
            ) : (
              <img
                src={revelationMediaUrl}
                alt="Revelación"
                className="w-full"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
                loading="lazy"
              />
            )}
          </div>
        )}

        {revelationContent && (
          <div
            className="prose prose-lg max-w-none text-textSecondary leading-relaxed text-center"
            dangerouslySetInnerHTML={{ __html: revelationContent }}
          />
        )}
      </div>

      <SectionNavButton targetId={['detalles', 'galeria']} color={primaryColor} />
    </section>
  );
};
