import { Suspense, lazy, useEffect, useRef } from 'react';
import type { Application } from '@splinetool/runtime';

// Kick off the fetch at module-evaluation time (not on first render) so it
// downloads in parallel with the rest of the app instead of after it mounts.
// @splinetool/react-spline pulls in @splinetool/runtime + three.js — a multi-MB
// dependency that, if statically imported, gets inlined into the main entry
// chunk and blocks the whole page (nav, hero text, everything) on its parse
// time. Dynamic import splits it into its own chunk so the rest of the app
// becomes interactive immediately while this fetches in the background.
const splineModule = import('@splinetool/react-spline');
const Spline = lazy(() => splineModule);

export interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (spline: Application) => void;
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  const appRef = useRef<Application | null>(null);

  // A backgrounded tab throttles rAF; Spline's own animation loop (which
  // drives things like the robot's mouse-look) resumes with a huge elapsed
  // delta after being away a while, causing it to lurch/oscillate wildly
  // trying to "catch up". Stopping the runtime while hidden and restarting
  // clean on return avoids that entirely.
  useEffect(() => {
    const onVisibilityChange = () => {
      const app = appRef.current;
      if (!app) return;
      if (document.visibilityState === 'hidden') {
        app.stop();
      } else {
        app.play();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 rounded-full border-2 border-fortivex-red/50 border-t-fortivex-red animate-spin" />
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={(app) => {
          appRef.current = app;
          onLoad?.(app);
        }}
      />
    </Suspense>
  );
}
