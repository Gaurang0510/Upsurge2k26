'use client'

import { Component, Suspense, lazy, type ReactNode } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
  onError?: () => void
}

class SplineErrorBoundary extends Component<{ children: ReactNode; onError?: () => void }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

export function SplineScene({ scene, className, onError }: SplineSceneProps) {
  return (
    <SplineErrorBoundary onError={onError}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          onError={onError}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}
