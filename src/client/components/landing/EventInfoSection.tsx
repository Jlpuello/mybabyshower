import { MapPin, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SectionNavButton } from './SectionNavButton';

interface EventInfoSectionProps {
  eventDate: Date;
  eventTime: string;
  location: string;
  address: string;
  locationImage: string | null;
  primaryColor: string | null;
}

export const EventInfoSection = ({
  eventDate,
  eventTime,
  location,
  address,
  locationImage,
  primaryColor,
}: EventInfoSectionProps) => {
  const navigate = useNavigate();
  const formattedDate = new Date(eventDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section id="detalles" className="min-h-screen flex flex-col items-center justify-between py-16 px-4 bg-offWhite select-none">
      <div className="h-4" />

      <div className="max-w-5xl mx-auto my-auto w-full">
        <h2
          className="text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-10 text-center"
          style={{ color: primaryColor || '#2D2D2D' }}
        >
          Detalles del Evento
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Info Cards */}
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-xl shadow-soft border border-warmBeige/40">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: primaryColor || '#C9A962' }} />
                <div>
                  <h3 className="font-semibold text-textPrimary mb-0.5">Fecha</h3>
                  <p className="text-textSecondary capitalize">{formattedDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-soft border border-warmBeige/40">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: primaryColor || '#C9A962' }} />
                <div>
                  <h3 className="font-semibold text-textPrimary mb-0.5">Hora</h3>
                  <p className="text-textSecondary">{eventTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-soft border border-warmBeige/40">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: primaryColor || '#C9A962' }} />
                <div>
                  <h3 className="font-semibold text-textPrimary mb-0.5">Ubicación</h3>
                  <p className="text-textSecondary font-medium">{location}</p>
                  <p className="text-textLight text-sm mt-0.5">{address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Image */}
          {locationImage && (
            <div className="rounded-xl overflow-hidden shadow-soft border border-warmBeige/40">
              <img
                src={locationImage}
                alt={location}
                className="w-full h-72 md:h-80 object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Botón de ingreso con código de invitación */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/guest')}
            className="px-8 py-3.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg hover:opacity-95 text-white active:scale-95"
            style={{
              backgroundColor: primaryColor || '#C9A962',
            }}
          >
            Ingresar con código de invitación
          </button>
        </div>
      </div>

      <SectionNavButton targetId={['galeria', 'hero']} color={primaryColor} />
    </section>
  );
};
