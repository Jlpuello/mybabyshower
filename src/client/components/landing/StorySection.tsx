import { SectionNavButton } from './SectionNavButton';
import { PeekingBaby } from './PeekingBaby';

interface StorySectionProps {
  storyTitle: string | null;
  storyContent: string | null;
  storyImage?: string | null;
  primaryColor: string | null;
  secondaryColor?: string | null;
}

export const StorySection = ({ storyTitle, storyContent, storyImage, primaryColor, secondaryColor }: StorySectionProps) => {
  if (!storyTitle || !storyContent) return null;

  const mainColor = primaryColor || '#C9A962';
  const secColor = secondaryColor || '#D4C4B7';

  return (
    <section id="historia" className="relative overflow-hidden min-h-[100dvh] flex flex-col items-center justify-between py-8 sm:py-12 md:py-16 px-4 bg-ivory select-none">
      <PeekingBaby side="right" position="bottom" delay="300" />
      <div className="h-2 sm:h-4" />

      <div className="max-w-3xl mx-auto my-auto text-center w-full px-2 sm:px-4">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-3 sm:mb-4"
          style={{ color: mainColor }}
        >
          {storyTitle}
        </h2>
        <div
          className="w-16 h-1 mx-auto rounded-full mb-4 sm:mb-6 opacity-80"
          style={{ backgroundColor: secColor }}
        />
        <div className="max-h-[52vh] overflow-y-auto custom-scrollbar px-1 space-y-4">
          <div
            className="prose prose-base sm:prose-lg max-w-none text-textSecondary leading-relaxed text-left md:text-center"
            dangerouslySetInnerHTML={{ __html: storyContent }}
          />
          {storyImage && (
            <div className="mt-4 max-w-xl mx-auto">
              <div
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border-2 sm:border-4 bg-white p-1"
                style={{ borderColor: secColor }}
              >
                <img
                  src={storyImage}
                  alt={storyTitle}
                  className="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-xl sm:rounded-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <SectionNavButton
        targetId={['revelacion', 'detalles', 'galeria']}
        color={primaryColor}
        thought="¡Descubre la gran sorpresa de la revelación! 🤫🎉"
      />
    </section>
  );
};
