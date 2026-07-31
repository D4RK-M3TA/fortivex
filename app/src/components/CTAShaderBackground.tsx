/**
 * WebGL shader background for CTA section — FortiVex themed (dark + red wave).
 * Contained to section (absolute inset-0). Uses capped delta time to avoid tab-back jump.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/motion';

const MAX_DELTA = 0.2;

export function CTAShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.OrthographicCamera | null;
    renderer: THREE.WebGLRenderer | null;
    mesh: THREE.Mesh | null;
    uniforms: { time: { value: number }; resolution: { value: THREE.Vector2 } } | null;
    animationId: number | null;
    lastTime: number;
    animationTime: number;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
    lastTime: 0,
    animationTime: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const { current: refs } = sceneRef;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        float d = length(p) * 0.05;
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float xScale = 1.0;
        float yScale = 0.5;
        float r = 0.04 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.015 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.01 / abs(p.y + sin((bx + time) * xScale) * yScale);

        vec3 col = vec3(r * 0.95, g * 0.2, b * 0.2);
        col += vec3(0.02, 0.02, 0.04);
        gl_FragColor = vec4(col, 0.85);
      }
    `;

    refs.scene = new THREE.Scene();
    refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    refs.renderer.setClearColor(new THREE.Color(0x0a0a0a), 0);

    refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    refs.uniforms = {
      resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      time: { value: 0 },
    };

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -1, -1, 0, 1, -1, 0, -1, 1, 0,
      1, -1, 0, -1, 1, 0, 1, 1, 0,
    ]), 3));

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: refs.uniforms,
      side: THREE.DoubleSide,
      transparent: true,
    });

    refs.mesh = new THREE.Mesh(geometry, material);
    refs.scene.add(refs.mesh);

    const setSize = () => {
      if (!container || !refs.renderer || !refs.uniforms) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      // updateStyle:false means Three.js won't touch canvas.style — it only sets
      // the (DPR-scaled) drawing buffer. Without setting CSS size ourselves, the
      // canvas has no layout constraint and renders at its buffer's pixel size
      // (e.g. 2x too wide on high-DPR mobile screens), forcing the whole page wider.
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      refs.renderer.setSize(w, h, false);
      refs.uniforms.resolution.value.set(w, h);
    };

    setSize();

    const renderFrame = () => {
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    let isVisible = true;
    let rafActive = false;

    const animate = (now: number) => {
      if (!isVisible) {
        rafActive = false;
        return;
      }
      const delta = refs.lastTime ? Math.min((now - refs.lastTime) * 0.001, MAX_DELTA) : 0;
      refs.lastTime = now;
      refs.animationTime += delta;
      if (refs.uniforms) refs.uniforms.time.value = refs.animationTime;
      renderFrame();
      refs.animationId = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (rafActive) return;
      rafActive = true;
      refs.animationId = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      rafActive = false;
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
        refs.animationId = null;
      }
    };

    // Contained to the CTA section — no reason to render every frame while it's
    // scrolled out of view. Reduced motion skips the loop and shows one static frame.
    const reduced = prefersReducedMotion();
    let intersectionObserver: IntersectionObserver | undefined;

    if (reduced) {
      renderFrame();
    } else {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = !!entries[0]?.isIntersecting;
          if (isVisible) startLoop();
          else stopLoop();
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(container);
      startLoop();
    }

    const resizeObserver = new ResizeObserver(() => {
      setSize();
      if (reduced) renderFrame();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      stopLoop();
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        (refs.mesh.material as THREE.Material).dispose();
      }
      refs.renderer?.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
