import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function AvatarModel({ avatarState }) {
  const group = useRef();

  const { scene, animations } = useGLTF("/models/avatar.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // stop all animations first
    Object.values(actions || {}).forEach(action => action?.stop());

    if (avatarState === "talking") {
      // play FIRST animation clip only
      const first = Object.values(actions)[0];
      first?.reset().fadeIn(0.3).play();
    }
  }, [avatarState, actions]);

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1.015}
      position={[0, -1.2, 0]}
    />
  );
}
