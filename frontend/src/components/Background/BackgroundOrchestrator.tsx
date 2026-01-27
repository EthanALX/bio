'use client';
import { Suspense, lazy, useState, useEffect } from 'react';
import { getPerformanceConfig } from '@/lib/performance/detector';

const ParticleField = lazy(() =>
  import('./ParticleField').then((m) => ({ default: m.ParticleField }))
);

interface BackgroundOrchestratorProps {
  enableParticles?: boolean;
}

export function BackgroundOrchestrator({
  enableParticles = true,
}: BackgroundOrchestratorProps) {
  const [mounted, setMounted] = useState(false);
  const config = getPerformanceConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* 3D 粒子场 */}
      {mounted && enableParticles && config.enable3D && (
        <Suspense fallback={null}>
          <ParticleField count={config.particleCount} />
        </Suspense>
      )}

      {/* 渐变背景层 */}
      <div
        className="fixed inset-0 -z-20"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.15), transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(168, 85, 247, 0.1), transparent 50%), linear-gradient(135deg, var(--deep-slate) 0%, var(--darker-slate) 100%)',
        }}
      />
    </>
  );
}
