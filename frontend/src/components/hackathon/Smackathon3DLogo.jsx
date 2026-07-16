import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Float, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/**
 * The logo plane itself — textured with your actual artwork, tilts toward
 * the cursor like a hologram panel, and drifts gently on its own.
 */
function LogoPlane({ imageUrl, imageAspect }) {
  const texture = useTexture(imageUrl);
  const meshRef = useRef();
  const { pointer } = useThree();

  const width = 4.4;
  const height = width / imageAspect;

  useFrame(() => {
    if (!meshRef.current) return;
    const targetTiltX = pointer.y * 0.22;
    const targetTiltY = pointer.x * 0.32;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      -targetTiltX,
      0.06
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetTiltY,
      0.06
    );
  });

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial
          map={texture}
          transparent
          emissive="#ff1a1a"
          emissiveMap={texture}
          emissiveIntensity={0.35}
          roughness={0.3}
          metalness={0.65}
        />
      </mesh>
    </Float>
  );
}

/** Concentric neon "scope" rings, rebuilt as real rotating 3D torus geometry. */
function ScopeRings() {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.12;
  });
  return (
    <group ref={group} position={[0, 1.05, -0.35]}>
      {[1.55, 1.85, 2.15].map((r) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.011, 8, 80]} />
          <meshBasicMaterial color="#ff2b2b" toneMapped={false} />
        </mesh>
      ))}
      {/* crosshair struts */}
      {[0, Math.PI / 2].map((rot) => (
        <mesh key={rot} rotation={[Math.PI / 2, 0, rot]}>
          <boxGeometry args={[0.02, 0.02, 4.6]} />
          <meshBasicMaterial color="#ff2b2b" toneMapped={false} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}



export default function Smackathon3DLogo({
  imageUrl = '/images/logo/logo.jpeg',
  imageAspect = 1,
  height = '500px',
}) {
  return (
    <div style={{ width: '100%', height, background: 'transparent' }}>
      <Canvas camera={{ position: [0, 0, 6.2], fov: 38 }} dpr={[1, 2]}>
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 4, 5]} intensity={1.1} color="#ff3333" />
        <pointLight position={[-5, -2, 3]} intensity={0.5} color="#33d9ff" />

        <Suspense fallback={null}>
          <ScopeRings />
          <LogoPlane imageUrl={imageUrl} imageAspect={imageAspect} />
          <Sparkles
            count={90}
            scale={[9, 5.5, 4]}
            size={2.2}
            speed={0.25}
            color="#ff3333"
            opacity={0.5}
          />
          <Environment preset="night" />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={0.75} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
