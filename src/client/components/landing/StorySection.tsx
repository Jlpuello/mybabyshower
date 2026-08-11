interface StorySectionProps {
  storyTitle: string | null;
  storyContent: string | null;
  primaryColor: string | null;
}

export const StorySection = ({ storyTitle, storyContent, primaryColor }: StorySectionProps) => {
  if (!storyTitle || !storyContent) return null;

  return (
    <section className="py-20 px-4 bg-ivory">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-8 text-center"
          style={{ color: primaryColor || '#2D2D2D' }}
        >
          {storyTitle}
        </h2>
        <div
          className="prose prose-lg max-w-none text-textSecondary leading-relaxed"
          dangerouslySetInnerHTML={{ __html: storyContent }}
        />
      </div>
    </section>
  );
};
