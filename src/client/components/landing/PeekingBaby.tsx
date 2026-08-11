import { useInView } from 'react-intersection-observer';

interface PeekingBabyProps {
  side: 'left' | 'right';
  position?: 'top' | 'bottom' | 'middle';
  delay?: '300' | '500' | '600' | '800' | '1000' | 'none';
  className?: string;
}

export const PeekingBaby = ({
  side,
  position = 'top',
  delay = 'none',
  className = '',
}: PeekingBabyProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const imgSrc = side === 'left' ? '/izquierdo.png' : '/derecho.png';
  const animClass = side === 'left' ? 'animate-fade-right' : 'animate-fade-left';
  const delayClass = delay !== 'none' ? `animate-delay-${delay}` : '';

  const positionClasses = {
    top: 'top-6 sm:top-10 md:top-14',
    bottom: 'bottom-8 sm:bottom-12 md:bottom-16',
    middle: 'top-1/3',
  };

  const sideClass = side === 'left' ? 'left-0' : 'right-0';

  return (
    <div
      ref={ref}
      className={`absolute z-20 ${sideClass} ${positionClasses[position]} ${className}`}
    >
      {inView && (
        <img
          src={imgSrc}
          alt={`Bebé asomándose ${side}`}
          className={`w-28 sm:w-36 md:w-52 lg:w-64 max-w-[35vw] pointer-events-none mix-blend-multiply drop-shadow-sm ${animClass} animate-once ${delayClass}`}
        />
      )}
    </div>
  );
};
