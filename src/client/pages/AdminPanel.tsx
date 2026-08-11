import { useState, useEffect, useCallback } from 'react';
import { LoginForm } from '../components/admin/LoginForm';
import { Dashboard } from '../components/admin/Dashboard';
import { GuestsTable, type GuestRow } from '../components/admin/GuestsTable';
import { GiftsTable, type GiftRow } from '../components/admin/GiftsTable';
import { MemoriesGrid, type MemoryRow } from '../components/admin/MemoriesGrid';
import { EventSettings } from '../components/admin/EventSettings';
import { Button } from '../components/ui/Button';
import { LogOut, LayoutDashboard, Users, Gift, Image as ImageIcon, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'guests' | 'gifts' | 'memories' | 'event'>(
    'dashboard'
  );
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [gifts, setGifts] = useState<GiftRow[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [memories, setMemories] = useState<MemoryRow[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [loadingMemories, setLoadingMemories] = useState(false);

  const stats = {
    totalGuests: guests.length,
    confirmedGuests: guests.filter((g) => g.attendanceStatus === 'CONFIRMED').length,
    declinedGuests: guests.filter((g) => g.attendanceStatus === 'DECLINED').length,
    totalGifts: gifts.length,
    reservedGifts: gifts.filter((g) => g.isFull).length,
    totalMemories: memories.length,
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      fetchGuests();
      fetchGifts();
      fetchMemories();
    }
  }, []);

  const fetchGuests = async () => {
    setLoadingGuests(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar invitados');
      const data: GuestRow[] = await res.json();
      setGuests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGuests(false);
    }
  };

  const fetchGifts = async () => {
    setLoadingGifts(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/gifts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al cargar regalos');
      const data: GiftRow[] = await res.json();
      setGifts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGifts(false);
    }
  };

  const fetchMemories = async () => {
    setLoadingMemories(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('/api/admin/memories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data: MemoryRow[] = await res.json();
      setMemories(data);
    } catch {
      console.error('Error al cargar recuerdos');
    } finally {
      setLoadingMemories(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    fetchGuests();
    fetchGifts();
    fetchMemories();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleGuestCreated = (guest: GuestRow) => {
    setGuests((prev) => [guest, ...prev]);
  };

  const handleGuestUpdated = (updatedGuest: GuestRow) => {
    setGuests((prev) => prev.map((g) => (g.publicId === updatedGuest.publicId ? updatedGuest : g)));
  };

  const handleGiftCreated = (gift: GiftRow) => {
    setGifts((prev) => [gift, ...prev]);
  };

  const handleGiftDeleted = (publicId: string) => {
    setGifts((prev) => prev.filter((g) => g.publicId !== publicId));
  };

  const handleMemoryCreated = (memory: MemoryRow) => {
    setMemories((prev) => [...prev, memory]);
  };

  const handleMemoryDeleted = (publicId: string) => {
    setMemories((prev) => prev.filter((m) => m.publicId !== publicId));
  };

  const handleMemoryToggled = (updated: MemoryRow) => {
    setMemories((prev) => prev.map((m) => (m.publicId === updated.publicId ? updated : m)));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReorder = useCallback(async (orderedIds: string[]) => {
    // Actualización optimista: orden local
    setMemories((prev) => {
      const map = new Map(prev.map((m) => [m.publicId, m]));
      return orderedIds.map((id, i) => ({ ...map.get(id)!, sortOrder: i }));
    });
    // Persistir en BD
    try {
      const token = localStorage.getItem('authToken');
      await fetch('/api/admin/memories/reorder', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    } catch {
      console.error('Error al guardar el orden');
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-offWhite py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
            Volver al inicio
          </Button>
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'event' as const, label: 'Datos del Evento', icon: Settings },
    { id: 'guests' as const, label: 'Invitados', icon: Users },
    { id: 'gifts' as const, label: 'Regalos', icon: Gift },
    { id: 'memories' as const, label: 'Recuerdos', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-offWhite">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-textPrimary">Panel Administrativo</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-goldAccent text-textPrimary'
                  : 'border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'guests' && guests.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-goldAccent/20 text-textPrimary font-semibold">
                  {guests.length}
                </span>
              )}
              {tab.id === 'gifts' && gifts.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-goldAccent/20 text-textPrimary font-semibold">
                  {gifts.length}
                </span>
              )}
              {tab.id === 'memories' && memories.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-goldAccent/20 text-textPrimary font-semibold">
                  {memories.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {activeTab === 'dashboard' && <Dashboard stats={stats} />}
        {activeTab === 'guests' && (
          loadingGuests ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin w-8 h-8 text-goldAccent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <GuestsTable
              guests={guests}
              onGuestCreated={handleGuestCreated}
              onGuestUpdated={handleGuestUpdated}
            />
          )
        )}
        {activeTab === 'gifts' && (
          loadingGifts ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin w-8 h-8 text-goldAccent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <GiftsTable
              gifts={gifts}
              onGiftCreated={handleGiftCreated}
              onGiftDeleted={handleGiftDeleted}
            />
          )
        )}
        {activeTab === 'memories' && (
          loadingMemories ? (
            <div className="flex justify-center py-20">
              <svg className="animate-spin w-8 h-8 text-goldAccent" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <MemoriesGrid
              memories={memories}
              onMemoryCreated={handleMemoryCreated}
              onMemoryDeleted={handleMemoryDeleted}
              onMemoryToggled={handleMemoryToggled}
              onReorder={handleReorder}
            />
          )
        )}
        {activeTab === 'event' && <EventSettings />}
      </div>
    </div>
  );
};

export default AdminPanel;
