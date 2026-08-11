import { renderHook, waitFor } from '@testing-library/react';
import { useEvent } from '../useEvent';

global.fetch = jest.fn();

describe('useEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches event data successfully', async () => {
    const mockEvent = {
      publicId: 'evt-123',
      title: 'Baby Shower',
      babyName: 'Sofía',
      primaryColor: '#C9A962',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvent,
    });

    const { result } = renderHook(() => useEvent());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toEqual(mockEvent);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useEvent());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('handles non-ok response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useEvent());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.event).toBeNull();
    expect(result.current.error).toBe('Error al cargar el evento');
  });
});
