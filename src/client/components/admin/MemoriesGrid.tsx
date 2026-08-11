import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Camera,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { CreateMemoryModal, type MemoryRow } from './CreateMemoryModal';
import { AnimatePresence, motion } from 'framer-motion';

export type { MemoryRow };

// ── Tarjeta individual sortable ───────────────────────────────────────
interface MemoryCardProps {
  memory: MemoryRow;
  onToggle: (publicId: string) => void;
  onDelete: (memory: MemoryRow) => void;
  isDeleting: boolean;
  isToggling: boolean;
}

const MemoryCard = ({ memory, onToggle, onDelete, isDeleting, isToggling }: MemoryCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: memory.publicId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden shadow-soft border border-warmBeige/50 group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-cream overflow-hidden">
        {memory.mediaType === 'IMAGE' ? (
          <img
            src={memory.mediaUrl}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              src={memory.mediaUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                <Video className="w-5 h-5 text-textPrimary ml-0.5" />
              </div>
            </div>
          </div>
        )}

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/50 text-white flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Badge tipo */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-black/60 text-white flex items-center gap-1">
          {memory.mediaType === 'IMAGE' ? <Camera className="w-3 h-3" /> : <Video className="w-3 h-3" />}
        </div>

        {/* Estado publicado */}
        <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
          memory.isPublished ? 'bg-green-500 text-white' : 'bg-gray-600/80 text-gray-100'
        }`}>
          {memory.isPublished ? 'Publicado' : 'Borrador'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-textPrimary line-clamp-1">{memory.title}</p>
        {memory.eventDate && (
          <p className="text-xs text-textLight mt-0.5">
            {new Date(memory.eventDate).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => onToggle(memory.publicId)}
            disabled={isToggling}
            title={memory.isPublished ? 'Ocultar' : 'Publicar'}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              memory.isPublished
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            } disabled:opacity-50`}
          >
            {isToggling ? (
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : memory.isPublished ? (
              <><EyeOff className="w-3 h-3" /> Ocultar</>
            ) : (
              <><Eye className="w-3 h-3" /> Publicar</>
            )}
          </button>
          <button
            onClick={() => onDelete(memory)}
            disabled={isDeleting}
            title="Eliminar"
            className="p-1.5 rounded-lg text-textLight hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            {isDeleting ? (
              <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Componente principal ───────────────────────────────────────────────
interface MemoriesGridProps {
  memories: MemoryRow[];
  onMemoryCreated: (memory: MemoryRow) => void;
  onMemoryDeleted: (publicId: string) => void;
  onMemoryToggled: (memory: MemoryRow) => void;
  onReorder: (orderedIds: string[]) => void;
}

export const MemoriesGrid = ({
  memories,
  onMemoryCreated,
  onMemoryDeleted,
  onMemoryToggled,
  onReorder,
}: MemoriesGridProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = memories.findIndex((m) => m.publicId === active.id);
      const newIndex = memories.findIndex((m) => m.publicId === over.id);
      const reordered = arrayMove(memories, oldIndex, newIndex);
      onReorder(reordered.map((m) => m.publicId));
    },
    [memories, onReorder]
  );

  const handleToggle = async (publicId: string) => {
    setTogglingId(publicId);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/admin/memories/${publicId}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const updated: MemoryRow = await res.json();
      onMemoryToggled(updated);
    } catch {
      alert('No se pudo cambiar el estado.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (memory: MemoryRow) => {
    if (!confirm(`¿Eliminar "${memory.title}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(memory.publicId);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/admin/memories/${memory.publicId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      onMemoryDeleted(memory.publicId);
    } catch {
      alert('No se pudo eliminar el recuerdo.');
    } finally {
      setDeletingId(null);
    }
  };

  const published = memories.filter((m) => m.isPublished).length;

  return (
    <>
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-serif font-semibold text-textPrimary">Galería de recuerdos</h2>
            <p className="text-sm text-textSecondary mt-0.5">
              {memories.length} {memories.length === 1 ? 'recuerdo' : 'recuerdos'} ·{' '}
              <span className="text-green-600 font-medium">{published} publicados</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-textLight hidden md:block">
              Arrastra las tarjetas para reordenar
            </p>
            <Button id="btn-add-memory" variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Agregar recuerdo
            </Button>
          </div>
        </div>

        {/* Grid DnD */}
        <div className="p-6">
          {memories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center mb-4">
                <ImageIcon className="w-7 h-7 text-goldAccent" />
              </div>
              <p className="text-textSecondary font-medium">No hay recuerdos en la galería</p>
              <p className="text-sm text-textLight mt-1 mb-5">
                Sube fotos y videos especiales del baby shower.
              </p>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Agregar el primero
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={memories.map((m) => m.publicId)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {memories.map((memory) => (
                      <MemoryCard
                        key={memory.publicId}
                        memory={memory}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        isDeleting={deletingId === memory.publicId}
                        isToggling={togglingId === memory.publicId}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      <CreateMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(memory) => {
          onMemoryCreated(memory);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
