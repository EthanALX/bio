'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function ContentWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="mx-auto relative z-50 flex flex-col"
      style={{
        width: 'clamp(1000px, 85vw, 1600px)',
        padding: '0 clamp(1rem, 2vw, 3rem)',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.2 }}
    >
      {children}
    </motion.div>
  );
}
