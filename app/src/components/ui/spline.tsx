import { Suspense, lazy } from 'react';

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
  onLoad?: (spline: unknown) => void;
}

export function SplineScene({ scene, className, onLoad }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 rounded-full border-2 border-fortivex-red/50 border-t-fortivex-red animate-spin" />
        </div>
      }
    >
      <Spline scene={scene} className={className} onLoad={onLoad} />
    </Suspense>
  );
}
