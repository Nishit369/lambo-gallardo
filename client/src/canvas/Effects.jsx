import { useLoader } from "@react-three/fiber";
import { EffectComposer,  Bloom, LUT } from "@react-three/postprocessing";
import { LUTCubeLoader } from "postprocessing";

export function Effects() {
  const texture = useLoader(LUTCubeLoader, "/cube.cube");

  return (
    (
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} mipmapBlur luminanceSmoothing={0} intensity={0.5} />
        <LUT lut={texture} />
      </EffectComposer>
    )
  );
}