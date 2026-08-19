import { useEffect } from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { StorySection } from '../components/landing/StorySection';
import { RevelationSection } from '../components/landing/RevelationSection';
import { EventInfoSection } from '../components/landing/EventInfoSection';
import { GallerySection } from '../components/landing/GallerySection';
import { Loading } from '../components/ui/Loading';
import { useEvent } from '../hooks/useEvent';
import { useSEO } from '../hooks/useSEO';

const LandingPage = () => {
  const { event, loading, error } = useEvent();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code');
      if (codeParam) {
        const sanitized = codeParam.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
        sessionStorage.setItem('invitation_code', sanitized);
      }
    }
  }, []);

  useSEO({
    title: event?.title,
    description: event?.description,
    metaTitle: (event as any)?.metaTitle,
    metaDescription: (event as any)?.metaDescription,
  });

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
        secondaryColor={event.secondaryColor}
      />
      <StorySection
        storyTitle={event.storyTitle}
        storyContent={event.storyContent}
        storyImage={event.storyImage}
        primaryColor={event.primaryColor}
        secondaryColor={event.secondaryColor}
      />
      <RevelationSection
        revelationTitle={event.revelationTitle}
        revelationContent={event.revelationContent}
        revelationMediaUrl={event.revelationMediaUrl}
        revelationMediaType={event.revelationMediaType}
        isRevealed={event.isRevealed}
        primaryColor={event.primaryColor}
        secondaryColor={event.secondaryColor}
      />
      <EventInfoSection
        eventDate={event.eventDate}
        eventTime={event.eventTime}
        location={event.location}
        address={event.address}
        googleMapsUrl={event.googleMapsUrl}
        locationImage={event.locationImage}
        primaryColor={event.primaryColor}
        secondaryColor={event.secondaryColor}
      />
      <GallerySection primaryColor={event.primaryColor} secondaryColor={event.secondaryColor} />
    </div>
  );
};

export default LandingPage;
