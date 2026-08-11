import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Palette,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EventData {
  id: string;
  publicId: string;
  title: string;
  babyName: string | null;
  description: string | null;
  eventDate: string;
  eventTime: string;
  location: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  heroImage: string | null;
  locationImage: string | null;
  storyTitle: string | null;
  storyContent: string | null;
  storyImage: string | null;
  revelationTitle: string | null;
  revelationContent: string | null;
  revelationMediaUrl: string | null;
  revelationMediaType: 'IMAGE' | 'VIDEO' | null;
  isRevealed: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export const EventSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'location' | 'images' | 'story'>('general');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [babyName, setBabyName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#8B7355');
  const [secondaryColor, setSecondaryColor] = useState('#D4C4B7');

  // Story & Revelation
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [revelationTitle, setRevelationTitle] = useState('');
  const [revelationContent, setRevelationContent] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  // Images & Files
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [locationImagePreview, setLocationImagePreview] = useState<string | null>(null);
  const [locationImageFile, setLocationImageFile] = useState<File | null>(null);
  const [storyImagePreview, setStoryImagePreview] = useState<string | null>(null);
  const [storyImageFile, setStoryImageFile] = useState<File | null>(null);
  const [revelationMediaPreview, setRevelationMediaPreview] = useState<string | null>(null);
  const [revelationMediaFile, setRevelationMediaFile] = useState<File | null>(null);
  const [revelationMediaType, setRevelationMediaType] = useState<'IMAGE' | 'VIDEO' | null>(null);

  const heroInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const revelationInputRef = useRef<HTMLInputElement>(null);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/event', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar datos del evento');
      const data: EventData = await res.json();

      setTitle(data.title || '');
      setBabyName(data.babyName || '');
      setDescription(data.description || '');
      setEventDate(data.eventDate ? new Date(data.eventDate).toISOString().split('T')[0] : '');
      setEventTime(data.eventTime || '');
      setLocation(data.location || '');
      setAddress(data.address || '');
      setLatitude(data.latitude !== null && data.latitude !== undefined ? String(data.latitude) : '');
      setLongitude(data.longitude !== null && data.longitude !== undefined ? String(data.longitude) : '');
      setPrimaryColor(data.primaryColor || '#8B7355');
      setSecondaryColor(data.secondaryColor || '#D4C4B7');

      setStoryTitle(data.storyTitle || '');
      setStoryContent(data.storyContent || '');
      setRevelationTitle(data.revelationTitle || '');
      setRevelationContent(data.revelationContent || '');
      setIsRevealed(data.isRevealed || false);

      setHeroImagePreview(data.heroImage);
      setLocationImagePreview(data.locationImage);
      setStoryImagePreview(data.storyImage);
      setRevelationMediaPreview(data.revelationMediaUrl);
      setRevelationMediaType(data.revelationMediaType);
    } catch (err) {
      console.error(err);
      showToast('No se pudieron cargar los datos del evento', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLocationImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocationImageFile(file);
      setLocationImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoryImageFile(file);
      setStoryImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRevelationMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRevelationMediaFile(file);
      setRevelationMediaPreview(URL.createObjectURL(file));
      setRevelationMediaType(file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();

      formData.append('title', title.trim());
      formData.append('babyName', babyName.trim());
      formData.append('description', description.trim());
      formData.append('eventDate', eventDate);
      formData.append('eventTime', eventTime.trim());
      formData.append('location', location.trim());
      formData.append('address', address.trim());
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      formData.append('primaryColor', primaryColor);
      formData.append('secondaryColor', secondaryColor);

      formData.append('storyTitle', storyTitle.trim());
      formData.append('storyContent', storyContent.trim());
      formData.append('revelationTitle', revelationTitle.trim());
      formData.append('revelationContent', revelationContent.trim());
      formData.append('isRevealed', String(isRevealed));

      if (heroImageFile) formData.append('heroImage', heroImageFile);
      if (locationImageFile) formData.append('locationImage', locationImageFile);
      if (storyImageFile) formData.append('storyImage', storyImageFile);
      if (revelationMediaFile) formData.append('revelationMedia', revelationMediaFile);

      const res = await fetch('/api/admin/event', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al guardar cambios');
      }

      showToast('¡Datos del evento actualizados correctamente!', 'success');
      fetchEvent(); // recargar datos frescos
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Error al guardar los datos', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <svg className="animate-spin w-8 h-8 text-goldAccent" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const sections = [
    { id: 'general', label: 'General y Tema', icon: Heart },
    { id: 'location', label: 'Fecha y Ubicación', icon: MapPin },
    { id: 'images', label: 'Imágenes', icon: ImageIcon },
    { id: 'story', label: 'Historia y Revelación', icon: Sparkles },
  ];

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      {/* Toast alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-ivory/50">
        <div>
          <h2 className="text-xl font-serif font-bold text-textPrimary">Datos del Evento</h2>
          <p className="text-sm text-textSecondary mt-0.5">
            Personaliza el título, fecha, lugar, imágenes y colores de tu celebración.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/50 px-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-goldAccent text-textPrimary bg-white font-semibold'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-goldAccent' : 'text-textLight'}`} />
              {sec.label}
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* SECTION: GENERAL */}
        {activeSection === 'general' && (
          <div className="space-y-6 max-w-2xl">
            <Input
              id="event-title"
              label="Título del Evento *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Baby Shower de Matías"
              required
            />

            <Input
              id="event-baby-name"
              label="Nombre del Bebé"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="Ej: Matías, Sofía, Nuestro Bebé"
            />

            <div>
              <label className="block text-sm font-medium text-textSecondary mb-1">
                Descripción General
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Un mensaje especial de bienvenida para los invitados..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-warmBeige bg-white text-textPrimary placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-goldAccent text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  <Palette className="inline w-4 h-4 mr-1 text-goldAccent" />
                  Color Principal (Acentuado)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-warmBeige text-sm uppercase font-mono text-textPrimary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  <Palette className="inline w-4 h-4 mr-1 text-textLight" />
                  Color Secundario
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-1 bg-white"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-warmBeige text-sm uppercase font-mono text-textPrimary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: LOCATION */}
        {activeSection === 'location' && (
          <div className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Fecha del Evento *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-warmBeige bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-goldAccent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Hora del Evento *
                </label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  placeholder="Ej: 15:00 hrs"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-warmBeige bg-white text-textPrimary focus:outline-none focus:ring-2 focus:ring-goldAccent text-sm"
                />
              </div>
            </div>

            <Input
              id="event-location"
              label="Nombre del Lugar / Salón *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Salón de Eventos Los Olivos"
              required
            />

            <Input
              id="event-address"
              label="Dirección Completa *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Av. Principal 123, Ciudad"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <Input
                id="event-lat"
                label="Latitud GPS (Opcional)"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Ej: 4.6097"
              />
              <Input
                id="event-lng"
                label="Longitud GPS (Opcional)"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Ej: -74.0817"
              />
            </div>
          </div>
        )}

        {/* SECTION: IMAGES */}
        {activeSection === 'images' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Hero Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-textSecondary">
                Imagen Principal de Portada (Hero)
              </label>
              <input
                ref={heroInputRef}
                type="file"
                accept="image/*"
                onChange={handleHeroChange}
                className="hidden"
              />
              {heroImagePreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-warmBeige group bg-gray-100">
                  <img src={heroImagePreview} alt="Hero" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => heroInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-sm gap-2"
                  >
                    <Upload className="w-5 h-5" /> Cambiar imagen
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-warmBeige bg-ivory hover:border-goldAccent transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-textLight mb-2" />
                  <span className="text-sm font-medium text-textSecondary">Subir imagen principal</span>
                  <span className="text-xs text-textLight mt-1">JPEG, PNG, WEBP</span>
                </button>
              )}
            </div>

            {/* Location Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-textSecondary">
                Imagen del Lugar / Mapa
              </label>
              <input
                ref={locationInputRef}
                type="file"
                accept="image/*"
                onChange={handleLocationImageChange}
                className="hidden"
              />
              {locationImagePreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-warmBeige group bg-gray-100">
                  <img src={locationImagePreview} alt="Lugar" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => locationInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-sm gap-2"
                  >
                    <Upload className="w-5 h-5" /> Cambiar imagen
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => locationInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-warmBeige bg-ivory hover:border-goldAccent transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-textLight mb-2" />
                  <span className="text-sm font-medium text-textSecondary">Subir foto del lugar</span>
                  <span className="text-xs text-textLight mt-1">JPEG, PNG, WEBP</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* SECTION: STORY & REVELATION */}
        {activeSection === 'story' && (
          <div className="space-y-6 max-w-2xl">
            {/* Historia */}
            <div className="border border-warmBeige rounded-xl p-5 bg-ivory/30 space-y-4">
              <h3 className="text-md font-serif font-bold text-textPrimary flex items-center gap-2">
                <FileText className="w-4 h-4 text-goldAccent" />
                Nuestra Historia
              </h3>
              <Input
                id="story-title"
                label="Título de la Historia"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Ej: Nuestra Historia"
              />
              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Contenido de la Historia
                </label>
                <textarea
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  placeholder="Relata cómo comenzó este viaje hermoso..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-warmBeige bg-white text-textPrimary placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-goldAccent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Imagen de la Historia (Opcional - debajo del texto)
                </label>
                <input
                  ref={storyInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStoryImageChange}
                  className="hidden"
                />
                {storyImagePreview ? (
                  <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-warmBeige bg-gray-100 group">
                    <img src={storyImagePreview} alt="Historia" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => storyInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-xs gap-1.5"
                    >
                      <Upload className="w-4 h-4" /> Cambiar imagen
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => storyInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-warmBeige bg-white hover:border-goldAccent transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-textLight mb-1" />
                    <span className="text-xs font-medium text-textSecondary">Subir imagen para la historia</span>
                    <span className="text-[11px] text-textLight mt-0.5">JPEG, PNG, WEBP</span>
                  </button>
                )}
              </div>
            </div>

            {/* Revelación */}
            <div className="border border-warmBeige rounded-xl p-5 bg-ivory/30 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-serif font-bold text-textPrimary flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-goldAccent" />
                  Sección de Revelación
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-textSecondary font-medium">
                    {isRevealed ? 'Revelado' : 'Oculto'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRevealed(!isRevealed)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-goldAccent ${
                      isRevealed ? 'bg-goldAccent' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        isRevealed ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <Input
                id="revelation-title"
                label="Título de la Revelación"
                value={revelationTitle}
                onChange={(e) => setRevelationTitle(e.target.value)}
                placeholder="Ej: ¡Es un niño!"
              />

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Contenido de la Revelación
                </label>
                <textarea
                  value={revelationContent}
                  onChange={(e) => setRevelationContent(e.target.value)}
                  placeholder="Detalles o mensaje especial sobre la revelación..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-warmBeige bg-white text-textPrimary placeholder:text-textLight focus:outline-none focus:ring-2 focus:ring-goldAccent text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary mb-1">
                  Foto o Video de la Revelación
                </label>
                <input
                  ref={revelationInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleRevelationMediaChange}
                  className="hidden"
                />
                {revelationMediaPreview ? (
                  <div className="relative aspect-video max-w-sm rounded-xl overflow-hidden border border-warmBeige bg-black">
                    {revelationMediaType === 'VIDEO' ? (
                      <video src={revelationMediaPreview} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={revelationMediaPreview} alt="Revelación" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => revelationInputRef.current?.click()}
                      className="absolute bottom-2 right-2 px-3 py-1 bg-black/70 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-black/90"
                    >
                      <Upload className="w-3.5 h-3.5" /> Cambiar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => revelationInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-warmBeige bg-white hover:border-goldAccent transition-colors cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-textLight mb-1" />
                    <span className="text-xs font-medium text-textSecondary">Subir media de revelación</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="min-w-[180px]"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Guardar Cambios
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
