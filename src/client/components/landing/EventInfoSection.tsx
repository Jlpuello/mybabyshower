import { useState } from 'react';
import { MapPin, Calendar, Clock, ExternalLink, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionNavButton } from './SectionNavButton';
import { PeekingBaby } from './PeekingBaby';

interface EventInfoSectionProps {
  eventDate: Date;
  eventTime: string;
  location: string;
  address: string;
  googleMapsUrl?: string | null;
  locationImage: string | null;
  primaryColor: string | null;
  secondaryColor?: string | null;
}

export const EventInfoSection = ({
  eventDate,
  eventTime,
  location,
  address,
  googleMapsUrl,
  locationImage,
  primaryColor,
  secondaryColor,
}: EventInfoSectionProps) => {
  const navigate = useNavigate();
  const [copiedLocation, setCopiedLocation] = useState(false);
  const mainColor = primaryColor || '#C9A962';
  const secColor = secondaryColor || '#D4C4B7';

  const formattedDate = new Date(eventDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleLocationClick = () => {
    const fullAddressText = `${location} - ${address}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullAddressText).catch(() => {});
    }
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 3000);

    const targetMapUrl =
      googleMapsUrl?.trim() ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location} ${address}`)}`;

    window.open(targetMapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="detalles" className="relative overflow-hidden min-h-[100dvh] flex flex-col items-center justify-between py-6 sm:py-10 md:py-16 px-4 bg-offWhite select-none">
      <PeekingBaby side="right" position="top" delay="300" />
      <PeekingBaby side="left" position="bottom" delay="600" />
      <div className="h-1 sm:h-3" />

      <div className="max-w-5xl mx-auto my-auto w-full px-2 sm:px-4 max-h-[62vh] md:max-h-none overflow-y-auto pr-1 md:pr-0">
        <h2
          className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-4 sm:mb-8 text-center"
          style={{ color: mainColor }}
        >
          Detalles del Evento
        </h2>

        <div className={locationImage ? "grid md:grid-cols-2 gap-6 sm:gap-8 items-center max-w-4xl sm:max-w-5xl mx-auto" : "max-w-xl mx-auto w-full space-y-3 sm:space-y-4"}>
          {/* Info Cards */}
          <div className="space-y-3 sm:space-y-4 w-full">
            <div
              className="bg-white p-4 sm:p-5 rounded-xl shadow-soft border hover:shadow-md transition-shadow"
              style={{ borderColor: `${secColor}60` }}
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: mainColor }} />
                <div>
                  <h3 className="font-semibold text-textPrimary text-sm sm:text-base mb-0.5">Fecha</h3>
                  <p className="text-textSecondary text-xs sm:text-sm capitalize">{formattedDate}</p>
                </div>
              </div>
            </div>

            <div
              className="bg-white p-4 sm:p-5 rounded-xl shadow-soft border hover:shadow-md transition-shadow"
              style={{ borderColor: `${secColor}60` }}
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: mainColor }} />
                <div>
                  <h3 className="font-semibold text-textPrimary text-sm sm:text-base mb-0.5">Hora</h3>
                  <p className="text-textSecondary text-xs sm:text-sm">{eventTime}</p>
                </div>
              </div>
            </div>

            {/* Tarjeta de Ubicación Interactiva */}
            <div
              onClick={handleLocationClick}
              className="bg-white p-4 sm:p-5 rounded-xl shadow-soft border hover:shadow-md transition-all cursor-pointer group relative overflow-hidden active:scale-[0.99]"
              style={{ borderColor: `${secColor}60` }}
              title="Toca para copiar dirección y abrir en Google Maps / Waze"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" style={{ color: mainColor }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-textPrimary text-sm sm:text-base mb-0.5">Ubicación</h3>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-goldAccent/10 text-goldAccent border border-goldAccent/20 flex items-center gap-1 group-hover:bg-goldAccent group-hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" />
                        Abrir Mapa
                      </span>
                    </div>
                    <p className="text-textSecondary text-xs sm:text-sm font-medium">{location}</p>
                    <p className="text-textLight text-xs sm:text-sm mt-0.5">{address}</p>
                  </div>
                </div>
              </div>

              {/* Feedback de copia / click */}
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-textLight group-hover:text-goldAccent transition-colors">
                <span className="flex items-center gap-1.5 font-medium">
                  {copiedLocation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                      <span className="text-green-600 font-semibold">¡Dirección copiada y abriendo mapa! 📍</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Toca para copiar dirección y abrir mapa 📍</span>
                    </>
                  )}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              </div>
            </div>
          </div>

          {/* Location Image */}
          {locationImage && (
            <div
              className="rounded-xl overflow-hidden shadow-soft border w-full"
              style={{ borderColor: `${secColor}60` }}
            >
              <img
                src={locationImage}
                alt={location}
                className="w-full h-48 sm:h-64 md:h-80 object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Botón de ingreso con código de invitación - Integrado en el flujo responsivo */}
      <div className="w-full max-w-md mx-auto px-4 my-3 sm:my-5">
        <button
          onClick={() => {
            const storedCode = typeof window !== 'undefined' ? sessionStorage.getItem('invitation_code') : null;
            if (storedCode) {
              navigate(`/guest?code=${storedCode}`);
            } else {
              navigate('/guest');
            }
          }}
          className="w-full px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl text-xs sm:text-base font-semibold transition-all shadow-md hover:shadow-lg hover:opacity-95 text-white active:scale-95 cursor-pointer"
          style={{
            backgroundColor: primaryColor || '#C9A962',
          }}
        >
          Ingresar con código de invitación
        </button>
      </div>

      <SectionNavButton
        targetId={['galeria', 'hero']}
        color={primaryColor}
        thought="Explora nuestra galería de recuerdos 📸💖"
      />
    </section>
  );
};
