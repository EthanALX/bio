'use client';
import { motion } from 'framer-motion';

interface RippleProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function RippleEffect({ x, y, onComplete }: RippleProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.6) 0%, transparent 70%)',
      }}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
    />
  );
}
