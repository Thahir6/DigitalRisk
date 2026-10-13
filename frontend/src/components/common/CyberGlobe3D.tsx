import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CyberGlobe3DProps {
  className?: string;
  threatCount?: number;
  interactive?: boolean;
}

export const CyberGlobe3D: React.FC<CyberGlobe3DProps> = ({
  className = 'w-full h-full min-h-[380px]',
  threatCount = 12,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    let isDisposed = false;
    let animId: number;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // 2. WebGL Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Central Wireframe Globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereGeo = new THREE.SphereGeometry(6, 32, 24);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const globeMesh = new THREE.Mesh(sphereGeo, wireframeMat);
    globeGroup.add(globeMesh);

    // Inner glowing core
    const innerGeo = new THREE.IcosahedronGeometry(4.5, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerCore);

    // 4. Dot constellation surface
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 6.05;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.16,
      transparent: true,
      opacity: 0.65,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particleCloud);

    // 5. Orbital Security Rings
    const ringGeo = new THREE.RingGeometry(7.8, 7.9, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 3;
    orbitRing.rotation.y = Math.PI / 6;
    globeGroup.add(orbitRing);

    const ringGeo2 = new THREE.RingGeometry(8.8, 8.88, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const orbitRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    orbitRing2.rotation.x = -Math.PI / 4;
    orbitRing2.rotation.y = Math.PI / 4;
    globeGroup.add(orbitRing2);

    // 6. Threat Node Pulses (red, orange, cyan points scattered on globe surface)
    const threatGroup = new THREE.Group();
    globeGroup.add(threatGroup);

    const colors = [0xef4444, 0xf97316, 0x06b6d4, 0x10b981];
    for (let i = 0; i < threatCount; i++) {
      const lat = (Math.random() - 0.5) * Math.PI;
      const lon = Math.random() * Math.PI * 2;
      const r = 6.15;
      const x = r * Math.cos(lat) * Math.cos(lon);
      const y = r * Math.sin(lat);
      const z = r * Math.cos(lat) * Math.sin(lon);

      const nodeGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      threatGroup.add(nodeMesh);

      // Threat beam arcs connecting to adjacent node
      if (i % 2 === 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(x * 1.15, y * 1.15, z * 1.15),
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.5,
        });
        const beam = new THREE.Line(lineGeo, lineMat);
        threatGroup.add(beam);
      }
    }

    // 7. Interactive mouse tracking
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.35;
      mouseY = y * 0.35;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 8. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 9. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation
      globeGroup.rotation.y += 0.0025;
      innerCore.rotation.x -= 0.0015;
      orbitRing.rotation.z += 0.003;
      orbitRing2.rotation.z -= 0.002;

      // Mouse perspective damping
      targetRotationX += (mouseY - targetRotationX) * 0.05;
      targetRotationY += (mouseX - targetRotationY) * 0.05;
      globeGroup.rotation.x = targetRotationX;
      globeGroup.rotation.z = -targetRotationY * 0.4;

      // Subtle pulse on threat nodes
      const scalePulse = 1 + Math.sin(elapsedTime * 4) * 0.2;
      threatGroup.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          child.scale.set(scalePulse, scalePulse, scalePulse);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      // Dispose Three.js objects
      sphereGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [threatCount, interactive]);

  // Fallback for devices without WebGL
  if (!webGlSupported) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="w-64 h-64 rounded-full border border-cyan-500/20 bg-cyan-950/20 flex items-center justify-center relative animate-pulse-ring">
          <div className="w-48 h-48 rounded-full border border-cyan-400/30 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-blue-500/40 flex items-center justify-center">
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
                [RADAR 3D ONLINE]
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};
