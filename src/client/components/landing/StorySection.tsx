import { SectionNavButton } from './SectionNavButton';

interface StorySectionProps {
  storyTitle: string | null;
  storyContent: string | null;
  primaryColor: string | null;
}

export const StorySection = ({ storyTitle, storyContent, primaryColor }: StorySectionProps) => {
  if (!storyTitle || !storyContent) return null;

  return (
    <section id="historia" className="min-h-screen flex flex-col items-center justify-between py-16 px-4 bg-ivory select-none">
      <div className="h-4" />

      <div className="max-w-3xl mx-auto my-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-8"
          style={{ color: primaryColor || '#2D2D2D' }}
        >
          {storyTitle}
        </h2>
        <div
          className="prose prose-lg max-w-none text-textSecondary leading-relaxed text-left md:text-center"
          dangerouslySetInnerHTML={{ __html: storyContent }}
        />
      </div>

      <SectionNavButton targetId={['revelacion', 'detalles', 'galeria']} color={primaryColor} />
    </section>
  );
};
