import { motion } from 'framer-motion';

interface PeekingBabyProps {
  side: 'left' | 'right';
  position?: 'top' | 'bottom' | 'middle';
  delay?: '300' | '500' | '600' | '800' | '1000' | 'none';
  className?: string;
}

const DELAY_MAP: Record<string, number> = {
  '300': 0.3,
  '500': 0.5,
  '600': 0.6,
  '800': 0.8,
  '1000': 1.0,
  'none': 0,
};

export const PeekingBaby = ({
  side,
  position = 'top',
  delay = 'none',
  className = '',
}: PeekingBabyProps) => {
  const imgSrc = side === 'left' ? '/izquierdo.png' : '/derecho.png';

  const positionClasses = {
    top: 'top-6 sm:top-10 md:top-14',
    bottom: 'bottom-8 sm:bottom-12 md:bottom-16',
    middle: 'top-1/3',
  };

  const sideClass = side === 'left' ? '-left-2 sm:-left-4' : '-right-2 sm:-right-4';
  const delaySec = DELAY_MAP[delay] ?? 0;
  const initialX = side === 'left' ? -70 : 70;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 1.2,
        delay: delaySec,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`absolute z-30 pointer-events-none select-none ${sideClass} ${positionClasses[position]} ${className}`}
    >
      <img
        src={imgSrc}
        alt={`Bebé asomándose ${side}`}
        className="w-28 sm:w-36 md:w-52 lg:w-64 max-w-[35vw] pointer-events-none drop-shadow-md"
        loading="eager"
      />
    </motion.div>
  );
};
