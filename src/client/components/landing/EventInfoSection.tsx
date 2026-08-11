import { MapPin, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    <section id="detalles" className="py-20 px-4 bg-offWhite">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-serif font-bold text-textPrimary mb-12 text-center"
          style={{ color: primaryColor || '#2D2D2D' }}
        >
          Detalles del Evento
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-soft">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 mt-1" style={{ color: primaryColor || '#C9A962' }} />
                <div>
                  <h3 className="font-semibold text-textPrimary mb-1">Fecha</h3>
                  <p className="text-textSecondary capitalize">{formattedDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 mt-1" style={{ color: primaryColor || '#C9A962' }} />
                <div>
                  <h3 className="font-semibold text-textPrimary mb-1">Hora</h3>
                  <p className="text-textSecondary">{eventTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-soft">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 mt-1" style={{ color: primaryColor || '#C9A962' }} />
                <div>
                  <h3 className="font-semibold text-textPrimary mb-1">Ubicación</h3>
                  <p className="text-textSecondary">{location}</p>
                  <p className="text-textLight text-sm mt-1">{address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Image */}
          {locationImage && (
            <div className="rounded-lg overflow-hidden shadow-soft">
              <img
                src={locationImage}
                alt={location}
                className="w-full h-80 object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Botón de ingreso con código de invitación al final */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/guest')}
            className="px-8 py-3.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg hover:opacity-95 text-white"
            style={{
              backgroundColor: primaryColor || '#C9A962',
            }}
          >
            Ingresar con código de invitación
          </button>
        </div>
      </div>
    </section>
  );
};
