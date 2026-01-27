'use client';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { RippleEffect } from '@/components/Effects/RippleEffect';
import { FlipCounter } from '@/components/Effects/FlipCounter';
import styles from './StatCard.module.css';

interface StatCardProps {
  value: string | number;
  label: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export function StatCard({ value, label, isActive, onClick, index }: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    onClick();
  };

  const handleRippleComplete = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };

  // 提取数字部分用于动画
  const numericValue = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.]/g, ''))
    : value;

  return (
    <motion.div
      ref={cardRef}
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{
        x: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* 左侧发光条 */}
      <div className={styles.glowBar} />

      {/* 波纹效果 */}
      {ripples.map(ripple => (
        <RippleEffect
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          onComplete={() => handleRippleComplete(ripple.id)}
        />
      ))}

      {/* 边框流光 */}
      <div className={styles.borderGlow} />

      {/* 内容 */}
      <div className={styles.value}>
        {!isNaN(numericValue) ? (
          <FlipCounter value={numericValue} className={styles.counter} />
        ) : (
          value
        )}
      </div>
      <div className={styles.label}>{label}</div>

      {/* 背景粒子 */}
      {isActive && <CardParticles />}
    </motion.div>
  );
}

// 卡片粒子效果
function CardParticles() {
  return (
    <div className={styles.particles}>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={styles.particle}
          initial={{
            x: 0,
            y: 0,
            opacity: 0.8,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            opacity: 0,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
