'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlipCounterProps {
  value: number | string;
  duration?: number;
  className?: string;
}

export function FlipCounter({ value, duration = 1000, className = '' }: FlipCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [digits, setDigits] = useState<string[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));

    if (isNaN(numericValue)) {
      setDigits(String(value).split(''));
      return;
    }

    if (hasAnimated.current) {
      setDisplayValue(numericValue);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startValue + (numericValue - startValue) * easeOutQuart);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  useEffect(() => {
    setDigits(displayValue.toString().split(''));
  }, [displayValue]);

  return (
    <div className={`inline-flex gap-[2px] ${className}`}>
      {digits.map((digit, index) => (
        <div key={index} className="relative w-[1ch] h-[1.2em] overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={digit}
              className="absolute"
              initial={{ y: -50, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
              }}
            >
              {digit}
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
