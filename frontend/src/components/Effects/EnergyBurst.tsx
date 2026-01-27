'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './EnergyBurst.module.css';

export function EnergyBurst() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 1, 0] }}
      transition={{
        duration: 3,
        times: [0, 0.7, 0.85, 1],
        ease: 'easeInOut'
      }}
      onAnimationComplete={() => setIsVisible(false)}
    >
      {/* 中心爆发点 */}
      <motion.div
        className={styles.core}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.5, 1], opacity: [1, 0.8, 0] }}
        transition={{
          duration: 1.5,
          ease: [0.16, 1, 0.3, 1],
          times: [0, 0.4, 1]
        }}
      />

      {/* 能量波纹 */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.wave}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}

      {/* 射线 */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.ray}
          style={{
            transform: `rotate(${i * 30}deg)`,
            willChange: 'transform, opacity'
          }}
          initial={{ scaleY: 0, opacity: 1 }}
          animate={{ scaleY: [0, 1.5, 0], opacity: [1, 0.7, 0] }}
          transition={{
            duration: 1.2,
            delay: 0.15 + i * 0.04,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}

      {/* 文字爆发 */}
      <motion.div
        className={styles.text}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          RUNNING
        </motion.h1>
        <motion.div
          className={styles.subtitle}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.9,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          释放你的能量
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
