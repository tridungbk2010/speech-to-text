import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Box from "./Box.tsx";

const Playground = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box boxId="box1" />
      <Box position={[0, 0, 1]} boxId="box2" />
      <OrbitControls makeDefault />
      <gridHelper />
    </Canvas>
  );
};

export default Playground;
