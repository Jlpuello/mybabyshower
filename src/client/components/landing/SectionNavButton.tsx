import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionNavButtonProps {
  targetId: string | string[];
  direction?: 'down' | 'up';
  color?: string | null;
  label?: string;
}

export const SectionNavButton = ({
  targetId,
  direction = 'down',
  color,
  label,
}: SectionNavButtonProps) => {
  const btnColor = color || '#C9A962';

  const handleClick = () => {
    if (direction === 'up' || targetId === 'hero' || targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targets = Array.isArray(targetId) ? targetId : [targetId];

    // Buscar el primer ID objetivo que exista en el DOM
    for (const id of targets) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Fallback si ninguno de los IDs indicados existe en el DOM
    const fallbackSequence = ['historia', 'revelacion', 'detalles', 'galeria'];
    for (const id of fallbackSequence) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Icon = direction === 'up' ? ChevronUp : ChevronDown;

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-auto pt-6 pb-4">
      {/* Divider line */}
      <div className="w-full border-t border-slate-300/60 mb-6 opacity-70" />

      {label && (
        <span className="text-xs uppercase tracking-widest text-textLight font-medium mb-2">
          {label}
        </span>
      )}

      {/* Interactive button */}
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex items-center justify-center p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        title={label || (direction === 'up' ? 'Volver al inicio' : 'Siguiente sección')}
      >
        {/* Pulsing ring */}
        <span
          className="absolute inset-0 rounded-full opacity-30 animate-ping group-hover:opacity-50"
          style={{ backgroundColor: btnColor }}
        />

        {/* Inner circle badge */}
        <span className="relative z-10 w-11 h-11 rounded-full bg-white shadow-soft border border-slate-100 flex items-center justify-center transition-transform group-hover:shadow-md">
          <Icon
            className="w-6 h-6 animate-bounce transition-colors"
            style={{ color: btnColor }}
          />
        </span>
      </button>
    </div>
  );
};
