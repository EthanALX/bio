'use client';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 粒子着色器
const vertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float strength = 1.0 - (dist * 2.0);
    vec3 glow = vColor * strength;

    gl_FragColor = vec4(glow, strength * 0.6);
  }
`;

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  size: number;
}

function Particles({ count = 3000 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  // 生成粒子数据
  const particles = useMemo(() => {
    const temp: Particle[] = [];
    const colors = [
      new THREE.Color('#0ea5e9'), // Electric Blue
      new THREE.Color('#06b6d4'), // Bright Cyan
      new THREE.Color('#a855f7'), // Cyber Purple
      new THREE.Color('#f97316'), // Neon Orange
    ];

    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 1
      });
    }
    return temp;
  }, [count]);

  // 创建 BufferGeometry
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;

      sizes[i] = particle.size;
    });

    return [positions, colors, sizes];
  }, [particles, count]);

  // 鼠标交互
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 动画循环
  useFrame((state) => {
    if (!mesh.current) return;

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      // 基础运动
      particle.position.add(particle.velocity);

      // 边界检测
      if (Math.abs(particle.position.x) > 50) particle.velocity.x *= -1;
      if (Math.abs(particle.position.y) > 50) particle.velocity.y *= -1;
      if (Math.abs(particle.position.z) > 50) particle.velocity.z *= -1;

      // 鼠标吸引力
      const mouseX = mousePos.current.x * 30;
      const mouseY = mousePos.current.y * 30;
      const dx = mouseX - particle.position.x;
      const dy = mouseY - particle.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 15) {
        particle.velocity.x += dx * 0.0001;
        particle.velocity.y += dy * 0.0001;
      }

      // 波动效果
      particle.position.y += Math.sin(time + i * 0.1) * 0.01;

      // 更新 buffer
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
    });

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleField({ count = 3000 }: { count?: number }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
