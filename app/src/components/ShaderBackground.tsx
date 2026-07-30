/**
 * WebGL2 shader background — organic motion with pointer interaction.
 * Themed for FortiVex: dark base with subtle red/white glow.
 */

import { useRef, useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

// FortiVex-themed shader: dark background, subtle red and white accents
const FORTIVEX_SHADER = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 move;
uniform vec2 touch;
uniform int pointerCount;
uniform vec2 pointers;

#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2,1);
  vec3 col=vec3(0.02, 0.02, 0.04);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    float warm=0.00125/d*(cos(sin(i)*vec3(1.2,0.3,0.2))+1.).r;
    col+=vec3(warm*0.9, warm*0.1, warm*0.15);
    float b=noise(i+p+bg*1.731);
    col+=.0015*b/length(max(p,vec2(b*p.x*.02,p.y)))*vec3(0.95,0.2,0.2);
    col=mix(col, vec3(0.04+bg*.04, 0.03+bg*.02, 0.06+bg*.03), d);
  }
  O=vec4(col, 0.92);
}`;

type RendererRef = {
  updateMouse: (coords: number[]) => void;
  updatePointerCount: (n: number) => void;
  updatePointerCoords: (coords: number[]) => void;
  updateMove: (deltas: number[]) => void;
  render: (now: number) => void;
  updateScale: (scale: number) => void;
  setup: () => void;
  init: () => void;
  reset: () => void;
  test: (source: string) => string | null;
  updateShader: (source: string) => void;
};

type PointerHandlerRef = {
  get first(): number[];
  get count(): number;
  get coords(): number[];
  get move(): number[];
};

function useShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const rendererRef = useRef<RendererRef | null>(null);
  const pointersRef = useRef<PointerHandlerRef | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    const vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let buffer: WebGLBuffer | null = null;
    let mouseMove = [0, 0];
    let mouseCoords = [0, 0];
    let pointerCoords = [0, 0];
    let nbrOfPointers = 0;
    let scale = Math.max(1, 0.5 * window.devicePixelRatio);
    let shaderSource = FORTIVEX_SHADER;

    const compile = (shader: WebGLShader, source: string) => {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
      }
    };

    const reset = () => {
      if (program && !gl.getProgramParameter(program, gl.DELETE_STATUS)) {
        if (vs) {
          gl.detachShader(program, vs);
          gl.deleteShader(vs);
        }
        if (fs) {
          gl.detachShader(program, fs);
          gl.deleteShader(fs);
        }
        gl.deleteProgram(program);
      }
      program = vs = fs = null;
      buffer = null;
    };

    const setup = () => {
      vs = gl.createShader(gl.VERTEX_SHADER)!;
      fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      compile(vs, vertexSrc);
      compile(fs, shaderSource);
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
      }
    };

    const init = () => {
      if (!program) return;
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    };

    const test = (source: string) => {
      const shader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      const log = ok ? null : gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      return log;
    };

    let uResolution: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let uMove: WebGLUniformLocation | null = null;
    let uTouch: WebGLUniformLocation | null = null;
    let uPointerCount: WebGLUniformLocation | null = null;
    let uPointers: WebGLUniformLocation | null = null;

    const cacheUniforms = () => {
      if (!program) return;
      uResolution = gl.getUniformLocation(program, 'resolution');
      uTime = gl.getUniformLocation(program, 'time');
      uMove = gl.getUniformLocation(program, 'move');
      uTouch = gl.getUniformLocation(program, 'touch');
      uPointerCount = gl.getUniformLocation(program, 'pointerCount');
      uPointers = gl.getUniformLocation(program, 'pointers');
    };

    const MAX_DELTA = 0.2; // cap at 200ms so tab-back doesn't cause a time jump
    let lastTime = 0;
    let animationTime = 0;

    const render = (now = 0) => {
      if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;
      const delta = lastTime ? Math.min((now - lastTime) * 1e-3, MAX_DELTA) : 0;
      lastTime = now;
      animationTime += delta;
      if (uResolution === null) cacheUniforms();
      gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
      gl.clearColor(0.02, 0.02, 0.05, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, animationTime);
      gl.uniform2f(uMove, mouseMove[0], mouseMove[1]);
      gl.uniform2f(uTouch, mouseCoords[0], mouseCoords[1]);
      gl.uniform1i(uPointerCount, nbrOfPointers);
      gl.uniform2fv(uPointers, new Float32Array(pointerCoords));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    rendererRef.current = {
      updateMouse: (c) => { mouseCoords = c; },
      updatePointerCount: (n) => { nbrOfPointers = n; },
      updatePointerCoords: (c) => { pointerCoords = c; },
      updateMove: (d) => { mouseMove = d; },
      render,
      updateScale: (s) => { scale = s; },
      setup,
      init,
      reset,
      test,
      updateShader: (source) => {
        reset();
        shaderSource = source;
        setup();
        init();
      },
    };

    const map = (x: number, y: number) => [
      x * scale,
      canvas.height - y * scale,
    ];

    const pointersMap = new Map<number, number[]>();
    let lastCoords = [0, 0];
    let moves = [0, 0];

    const handler: PointerHandlerRef = {
      get first() {
        const v = pointersMap.values().next().value;
        return v ?? lastCoords;
      },
      get count() {
        return pointersMap.size;
      },
      get coords() {
        return pointersMap.size > 0
          ? Array.from(pointersMap.values()).flat()
          : [0, 0];
      },
      get move() {
        return moves;
      },
    };
    pointersRef.current = handler;

    const onPointerDown = (e: PointerEvent) => {
      pointersMap.set(e.pointerId, map(e.clientX, e.clientY));
    };
    const onPointerUp = (e: PointerEvent) => {
      if (pointersMap.size === 1) lastCoords = handler.first;
      pointersMap.delete(e.pointerId);
      moves = [0, 0];
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (pointersMap.size === 1) lastCoords = handler.first;
      pointersMap.delete(e.pointerId);
      moves = [0, 0];
    };
    const onPointerMove = (e: PointerEvent) => {
      if (pointersMap.size === 0) return;
      lastCoords = [e.clientX, e.clientY];
      pointersMap.set(e.pointerId, map(e.clientX, e.clientY));
      moves = [moves[0] + e.movementX, moves[1] + e.movementY];
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointermove', onPointerMove);

    setup();
    init();

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    scale = dpr;

    if (rendererRef.current.test(FORTIVEX_SHADER) === null) {
      rendererRef.current.updateShader(FORTIVEX_SHADER);
    }

    let isVisible = true;
    let rafActive = false;

    const loop = (now: number) => {
      if (!isVisible) {
        rafActive = false;
        return;
      }
      if (rendererRef.current && pointersRef.current) {
        const p = pointersRef.current;
        rendererRef.current.updateMouse(p.first);
        rendererRef.current.updatePointerCount(p.count);
        rendererRef.current.updatePointerCoords(p.coords);
        rendererRef.current.updateMove(p.move);
        rendererRef.current.render(now);
      }
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (rafActive) return;
      rafActive = true;
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      rafActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };

    // Contained to its section, so pause rendering entirely once it scrolls
    // out of view, and skip the animation loop altogether for reduced motion
    // (renders one static frame instead of animating forever).
    const reduced = prefersReducedMotion();
    let intersectionObserver: IntersectionObserver | undefined;

    if (reduced) {
      rendererRef.current.render(0);
    } else {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = !!entries[0]?.isIntersecting;
          if (isVisible) startLoop();
          else stopLoop();
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(canvas);
      startLoop();
    }

    const resize = () => {
      if (!canvasRef.current) return;
      const c = canvasRef.current;
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      rendererRef.current?.updateScale(dpr);
      if (reduced) rendererRef.current?.render(0);
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      intersectionObserver?.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointermove', onPointerMove);
      stopLoop();
      rendererRef.current?.reset();
      rendererRef.current = null;
      pointersRef.current = null;
    };
  }, []);

  return canvasRef;
}

export default function ShaderBackground({
  className = '',
}: {
  className?: string;
}) {
  const canvasRef = useShaderBackground();

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover touch-none pointer-events-auto ${className}`}
      style={{ background: '#0a0a0a' }}
      aria-hidden
    />
  );
}
