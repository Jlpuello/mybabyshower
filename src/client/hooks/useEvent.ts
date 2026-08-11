import { useState, useEffect } from 'react';
import type { EventPublic } from '../../shared/types/event.types';

export const useEvent = () => {
  const [event, setEvent] = useState<EventPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch('/api/event');
        if (!response.ok) {
          throw new Error('Error al cargar el evento');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  return { event, loading, error };
};
