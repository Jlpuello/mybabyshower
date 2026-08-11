import { HeroSection } from '../components/landing/HeroSection';
import { StorySection } from '../components/landing/StorySection';
import { RevelationSection } from '../components/landing/RevelationSection';
import { EventInfoSection } from '../components/landing/EventInfoSection';
import { GallerySection } from '../components/landing/GallerySection';
import { Loading } from '../components/ui/Loading';
import { useEvent } from '../hooks/useEvent';

const LandingPage = () => {
  const { event, loading, error } = useEvent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Cargando..." size="lg" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Error al cargar el evento</p>
          <p className="text-textSecondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        title={event.title}
        babyName={event.babyName}
        description={event.description}
        heroImage={event.heroImage}
        primaryColor={event.primaryColor}
      />
      <StorySection
        storyTitle={event.storyTitle}
        storyContent={event.storyContent}
        primaryColor={event.primaryColor}
      />
      <RevelationSection
        revelationTitle={event.revelationTitle}
        revelationContent={event.revelationContent}
        revelationMediaUrl={event.revelationMediaUrl}
        revelationMediaType={event.revelationMediaType}
        isRevealed={event.isRevealed}
        primaryColor={event.primaryColor}
      />
      <EventInfoSection
        eventDate={event.eventDate}
        eventTime={event.eventTime}
        location={event.location}
        address={event.address}
        locationImage={event.locationImage}
        primaryColor={event.primaryColor}
      />
      <GallerySection primaryColor={event.primaryColor} />
    </div>
  );
};

export default LandingPage;
