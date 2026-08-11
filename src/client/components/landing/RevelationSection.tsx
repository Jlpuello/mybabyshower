import { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { SectionNavButton } from './SectionNavButton';
import { PeekingBaby } from './PeekingBaby';

interface RevelationSectionProps {
  revelationTitle: string | null;
  revelationContent: string | null;
  revelationMediaUrl: string | null;
  revelationMediaType: string | null;
  isRevealed: boolean;
  primaryColor: string | null;
  secondaryColor?: string | null;
}

export const RevelationSection = ({
  revelationTitle,
  revelationContent,
  revelationMediaUrl,
  revelationMediaType,
  isRevealed,
  primaryColor,
  secondaryColor,
}: RevelationSectionProps) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { ref: sectionRef, inView } = useInView({
    threshold: 0.3,
  });

  // Autoplay cuando entra a la vista y pausa cuando sale de pantalla
  useEffect(() => {
    if (revelationMediaType === 'VIDEO' && videoRef.current) {
      if (inView) {
        videoRef.current.play().catch(() => {
          // Fallback en caso de restricciones del navegador
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView, revelationMediaType]);

  if (!isRevealed || !revelationTitle) return null;

  const color = primaryColor || '#C9A962';
  const secColor = secondaryColor || '#D4C4B7';

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="revelacion"
      className="relative overflow-hidden min-h-[100dvh] flex flex-col items-center justify-between py-6 sm:py-10 md:py-16 px-4 bg-gradient-to-b from-cream via-cream/80 to-white select-none"
    >
      <PeekingBaby side="left" position="top" delay="300" />
      <div className="h-1 sm:h-3" />

      <div className="max-w-3xl mx-auto my-auto text-center w-full px-2 sm:px-4">
        {/* Badge decorativo */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2 shadow-xs border"
          style={{ backgroundColor: `${secColor}25`, color, borderColor: `${secColor}60` }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Momento Especial
        </div>

        {/* Título principal */}
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-3 sm:mb-6 text-center leading-tight drop-shadow-xs"
          style={{ color }}
        >
          {revelationTitle}
        </h2>

        {/* Tarjeta contenedora 16:9 optimizada para móvil con marco elegante multicapa */}
        {revelationMediaUrl && (
          <div
            className="mb-3 sm:mb-6 max-w-xl sm:max-w-2xl mx-auto p-1.5 sm:p-2.5 rounded-3xl sm:rounded-[2rem] border-2 shadow-2xl transition-all"
            style={{ backgroundColor: `${secColor}20`, borderColor: `${secColor}80` }}
          >
            <div
              className="relative w-full aspect-video rounded-2xl sm:rounded-[1.4rem] overflow-hidden shadow-inner border-2 bg-black"
              style={{ borderColor: color }}
            >
              {revelationMediaType === 'VIDEO' ? (
                <>
                  <video
                    ref={videoRef}
                    src={revelationMediaUrl}
                    controls
                    autoPlay
                    muted={isMuted}
                    playsInline
                    loop
                    preload="auto"
                    className="w-full h-full object-cover"
                  />

                  {/* Botón flotante para activar/desactivar sonido */}
                  <button
                    onClick={toggleMute}
                    type="button"
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium transition-all shadow-lg active:scale-95 cursor-pointer"
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
                        <span>Activar sonido</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                        <span>Sonido activo</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <img
                  src={revelationMediaUrl}
                  alt="Revelación"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        )}

        {/* Contenido descriptivo */}
        {revelationContent && (
          <div
            className="prose prose-sm sm:prose-lg max-w-none text-textSecondary leading-relaxed text-center px-2 max-h-[25vh] overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: revelationContent }}
          />
        )}
      </div>

      <SectionNavButton targetId={['detalles', 'galeria']} color={primaryColor} />
    </section>
  );
};
