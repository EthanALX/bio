'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function ContentWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="max-w-[75%] min-w-[900px] mx-auto relative z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.2 }}
    >
      {children}
    </motion.div>
  );
}
