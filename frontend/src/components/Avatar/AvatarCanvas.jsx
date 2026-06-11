import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import AvatarModel from "./AvatarModel";
import { AVATAR_STATES } from "./avatarStates";

function CameraController({ avatarState }) {
  const { camera } = useThree();

  useEffect(() => {
    if (avatarState === AVATAR_STATES.LISTENING) {
      camera.position.z = 2.2;
    }

    if (avatarState === AVATAR_STATES.TALKING) {
      camera.position.z = 3.2;
    }

    if (avatarState === AVATAR_STATES.IDLE) {
      camera.position.z = 3;
    }

    camera.updateProjectionMatrix();
  }, [avatarState, camera]);

  return null;
}

export default function AvatarCanvas({ avatarState }) {
  return (
    <Canvas camera={{ position: [0, 1.6, 3], fov: 35 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 5, 3]} intensity={1.2} />

      <Suspense fallback={null}>
        <CameraController avatarState={avatarState} />
        <AvatarModel avatarState={avatarState} />
      </Suspense>
    </Canvas>
  );
}
