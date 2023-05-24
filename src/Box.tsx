import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";
import { useControls } from "leva";

export default function Box(props: ThreeElements["mesh"] & { boxId: string }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((_, delta) => (mesh.current.rotation.x += delta));

  const boxProps = useControls(props.boxId, {
    position: {
      value: props.position || [0, 0, 0],
      step: 0.01,
      onChange: (value) => {
        console.log("changed pos", value);
      },
      transient: false,
    },
    rotation: {
      value: [0, 0, 0],
      step: 0.1,
    },
    scale: {
      value: [1, 1, 1],
      step: 0.1,
    },
  });

  return (
    <mesh
      {...boxProps}
      ref={mesh}
      onClick={(_) => setActive(!active)}
      onPointerOver={(_) => setHover(true)}
      onPointerOut={(_) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
