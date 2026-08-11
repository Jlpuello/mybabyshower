import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { Camera, Play, Image as ImageIcon } from 'lucide-react';
import { SectionNavButton } from './SectionNavButton';
import { Footer } from './Footer';
import { PeekingBaby } from './PeekingBaby';

interface PublicMemory {
  publicId: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  eventDate: string | null;
}

interface GallerySectionProps {
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// ── Tarjeta de la galería con animación de intersección ──────────────
interface GalleryCardProps {
  memory: PublicMemory;
  index: number;
  onClick: () => void;
}

const GalleryCard = ({ memory, index, onClick }: GalleryCardProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Alturas alternadas para el efecto masonry
  const heights = ['aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]'];
  const heightClass = heights[index % heights.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className={`relative ${heightClass} rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300`}
      onClick={onClick}
    >
      {memory.mediaType === 'IMAGE' ? (
        <img
          src={memory.mediaUrl}
          alt={memory.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="relative w-full h-full bg-gray-900">
          <video
            src={memory.mediaUrl}
            className="w-full h-full object-cover opacity-80"
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-textPrimary ml-1" />
            </div>
          </div>
        </div>
      )}

      {/* Overlay con info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-semibold line-clamp-1">{memory.title}</p>
          {memory.eventDate && (
            <p className="text-white/70 text-xs mt-0.5">{formatDate(memory.eventDate)}</p>
          )}
        </div>
      </div>

      {/* Badge tipo en hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
          {memory.mediaType === 'IMAGE' ? (
            <Camera className="w-3.5 h-3.5 text-textPrimary" />
          ) : (
            <Play className="w-3.5 h-3.5 text-textPrimary" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const chunkArray = <T,>(arr: T[], size: number): { items: T[]; startIndex: number }[] => {
  const chunks: { items: T[]; startIndex: number }[] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push({
      items: arr.slice(i, i + size),
      startIndex: i,
    });
  }
  return chunks;
};

// ── Sección principal ─────────────────────────────────────────────────
export const GallerySection = ({ primaryColor, secondaryColor }: GallerySectionProps) => {
  const [memories, setMemories] = useState<PublicMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const { ref: sectionRef, inView: sectionInView } = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('/api/event/memories');
        if (res.ok) {
          const data: PublicMemory[] = await res.json();
          setMemories(data);
        }
      } catch {
        // No mostrar error, simplemente la sección queda vacía
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  // Convertir al formato de yet-another-react-lightbox
  const slides = memories.map((m) =>
    m.mediaType === 'VIDEO'
      ? {
          type: 'video' as const,
          sources: [{ src: m.mediaUrl, type: 'video/mp4' }],
          title: m.title,
          description: m.description ?? undefined,
        }
      : {
          src: m.mediaUrl,
          title: m.title,
          description: m.description ?? undefined,
        }
  );

  if (!loading && memories.length === 0) return null;

  const memoryChunks = chunkArray(memories, 4);

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[100dvh] flex flex-col items-center justify-between pt-6 sm:pt-10 md:pt-12 pb-0 px-0 bg-white select-none" id="galeria">
      <PeekingBaby side="left" position="top" delay="300" />
      <div className="max-w-6xl mx-auto my-auto w-full px-4">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs sm:text-sm font-medium mb-2.5 shadow-2xs border"
            style={{
              backgroundColor: `${secondaryColor ?? '#D4C4B7'}35`,
              color: primaryColor ?? '#C9A962',
              borderColor: `${secondaryColor ?? '#D4C4B7'}70`,
            }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Nuestra historia en imágenes
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-2">
            Galería de recuerdos
          </h2>
          <p className="text-textSecondary text-sm max-w-md mx-auto">
            Momentos especiales que hemos guardado para compartir con ustedes.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-full rounded-xl bg-warmBeige animate-pulse ${
                  ['aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]'][i % 4]
                }`}
              />
            ))}
          </div>
        )}

        {/* Galería organizada en bloques de 4 (2x2) en Móvil y Mosaico en Desktop */}
        {!loading && memories.length > 0 && (
          <div className="w-full max-h-[50vh] md:max-h-[55vh] overflow-y-auto pr-1">
            {/* Vista Móvil: Grupos/Bloques de 4 en 4 (grillas 2x2) */}
            <div className="block md:hidden space-y-4">
              {memoryChunks.map((chunk, groupIdx) => (
                <div key={groupIdx} className="grid grid-cols-2 gap-3 p-2 rounded-2xl bg-warmBeige/20 border border-warmBeige/40 shadow-xs">
                  {chunk.items.map((memory, localIdx) => {
                    const globalIdx = chunk.startIndex + localIdx;
                    return (
                      <GalleryCard
                        key={memory.publicId}
                        memory={memory}
                        index={globalIdx}
                        onClick={() => openLightbox(globalIdx)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Vista Desktop: Mosaico fluido continuo */}
            <div className="hidden md:block columns-3 lg:columns-4 gap-4 space-y-4">
              {memories.map((memory, index) => (
                <div key={memory.publicId} className="break-inside-avoid mb-4">
                  <GalleryCard
                    memory={memory}
                    index={index}
                    onClick={() => openLightbox(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenedor inferior: Botón de retorno e integración del Footer en la misma pantalla */}
      <div className="w-full flex flex-col items-center mt-auto">
        <div className="w-full max-w-xl px-4 flex flex-col items-center">
          <SectionNavButton targetId="hero" direction="up" color={primaryColor} label="Volver al inicio" />
        </div>
        <Footer />
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Video, Captions]}
        styles={{
          container: { backgroundColor: 'rgba(0,0,0,0.95)' },
        }}
      />
    </section>
  );
};
