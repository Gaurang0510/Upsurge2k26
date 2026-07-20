import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-8 w-8 rounded-full border-2 border-evidence border-t-transparent animate-spin"
            />
            <span className="font-mono text-xs uppercase tracking-widest text-steel">
              Loading 3D…
            </span>
          </div>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
