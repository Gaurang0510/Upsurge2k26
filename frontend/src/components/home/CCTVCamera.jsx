/* eslint-disable react/no-unknown-property */
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import { motion } from 'framer-motion';

function CCTVModel({ sweepSpeed = 1.0, baseRotationY = -2.34 }) {
  const { scene } = useGLTF('/cctv.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const groupRef = useRef();

  // 180 degrees total sweep range = -90° to +90° (±Math.PI / 2 radians)
  const maxSweepRad = Math.PI / 2;

  useFrame((state) => {
    if (groupRef.current) {
      // Oscillate back and forth smoothly over 180 degrees
      groupRef.current.rotation.y = baseRotationY + Math.sin(state.clock.getElapsedTime() * sweepSpeed) * maxSweepRad;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} scale={0.045} />
      </Center>
    </group>
  );
}

useGLTF.preload('/cctv.glb');

export default function CCTVCamera({
  className = '',
  baseRotationY = -2.34,
  sweepSpeed = 1.0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none select-none z-50 ${className}`.trim()}
    >
      {/* 3D R3F Canvas Container */}
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 filter drop-shadow-[0_0_40px_rgba(193,18,31,0.85)]">
        <Canvas
          camera={{ position: [0, 0, 2.3], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={4.5} />
          <directionalLight position={[10, 10, 10]} intensity={6.5} />
          <directionalLight position={[-10, 5, -10]} intensity={4.0} color="#0088ff" />
          <directionalLight position={[0, -10, 5]} intensity={3.0} color="#ff0044" />
          <Suspense fallback={null}>
            <CCTVModel sweepSpeed={sweepSpeed} baseRotationY={baseRotationY} />
          </Suspense>
        </Canvas>
      </div>
    </motion.div>
  );
}
