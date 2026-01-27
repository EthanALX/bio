/**
 * Performance detection utilities
 * 性能检测工具
 */

export type PerformanceLevel = 'high' | 'medium' | 'low';

export interface PerformanceConfig {
  level: PerformanceLevel;
  particleCount: number;
  enablePostProcessing: boolean;
  enable3D: boolean;
  enableAnimations: boolean;
}

/**
 * 检测设备性能等级
 */
export function detectPerformance(): PerformanceLevel {
  // SSR 环境下返回默认值
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'medium';
  }

  // 检测 CPU 核心数
  const cores = navigator.hardwareConcurrency || 4;

  // 检测内存 (如果可用)
  const memory = (navigator as any).deviceMemory || 4;

  // 检测是否为移动设备
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // 检测是否为低端设备
  if (isMobile || cores < 4 || memory < 4) {
    return 'low';
  }

  // 检测是否为高端设备
  if (cores >= 8 && memory >= 8) {
    return 'high';
  }

  return 'medium';
}

/**
 * 根据性能等级获取配置
 */
export function getPerformanceConfig(level?: PerformanceLevel): PerformanceConfig {
  const detectedLevel = level || detectPerformance();

  const configs: Record<PerformanceLevel, PerformanceConfig> = {
    high: {
      level: 'high',
      particleCount: 5000,
      enablePostProcessing: true,
      enable3D: true,
      enableAnimations: true,
    },
    medium: {
      level: 'medium',
      particleCount: 2000,
      enablePostProcessing: true,
      enable3D: true,
      enableAnimations: true,
    },
    low: {
      level: 'low',
      particleCount: 500,
      enablePostProcessing: false,
      enable3D: false,
      enableAnimations: false,
    },
  };

  return configs[detectedLevel];
}

/**
 * 测试初始渲染性能
 */
export async function testRenderPerformance(): Promise<number> {
  return new Promise((resolve) => {
    let frameCount = 0;
    const startTime = performance.now();
    const duration = 1000; // 测试 1 秒

    function countFrame() {
      frameCount++;
      const elapsed = performance.now() - startTime;

      if (elapsed < duration) {
        requestAnimationFrame(countFrame);
      } else {
        const fps = (frameCount / elapsed) * 1000;
        resolve(fps);
      }
    }

    requestAnimationFrame(countFrame);
  });
}

/**
 * 检查是否支持 WebGL
 */
export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * 检查是否支持 WebGL2
 */
export function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch (e) {
    return false;
  }
}
