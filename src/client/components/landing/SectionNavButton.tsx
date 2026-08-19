import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionNavButtonProps {
  targetId: string | string[];
  direction?: 'down' | 'up';
  color?: string | null;
  label?: string;
  thought?: string;
}

export const SectionNavButton = ({
  targetId,
  direction = 'down',
  color,
  label,
  thought,
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
    <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-auto pt-2 sm:pt-4 pb-1 sm:pb-3">
      {/* Divider line */}
      <div className="w-full border-t border-slate-300/60 mb-2 sm:mb-3 opacity-70" />

      {label && (
        <span className="text-xs uppercase tracking-widest text-textLight font-medium mb-2">
          {label}
        </span>
      )}

      {/* Burbuja de pensamiento curious float */}
      {thought && (
        <button
          type="button"
          onClick={handleClick}
          className="group/thought relative mb-1.5 flex flex-col items-center transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none select-none"
        >
          {/* Cuerpo principal de la nube de pensamiento */}
          <div
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/95 backdrop-blur-xs shadow-md border text-[11px] sm:text-xs md:text-sm font-medium text-slate-700 text-center max-w-[88vw] sm:max-w-xs transition-all duration-300 group-hover/thought:shadow-lg animate-pulse"
            style={{ borderColor: `${btnColor}60` }}
          >
            <span className="leading-snug">{thought}</span>
          </div>

          {/* Círculos conectores tipo burbuja de pensamiento */}
          <div className="flex flex-col items-center gap-0.5 mt-0.5">
            <span
              className="w-2.5 h-2.5 rounded-full bg-white shadow-xs border"
              style={{ borderColor: `${btnColor}50` }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-white shadow-xs border"
              style={{ borderColor: `${btnColor}40` }}
            />
          </div>
        </button>
      )}

      {/* Interactive button */}
      <button
        type="button"
        onClick={handleClick}
        className="group relative flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        title={label || (direction === 'up' ? 'Volver al inicio' : 'Siguiente sección')}
      >
        {/* Inner circle badge */}
        <span className="relative z-10 w-11 h-11 rounded-full bg-white shadow-soft border border-slate-100 flex items-center justify-center transition-transform group-hover:shadow-md">
          <Icon
            className="w-6 h-6 group-hover:animate-bounce transition-colors"
            style={{ color: btnColor }}
          />
        </span>
      </button>
    </div>
  );
};
