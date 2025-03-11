import React from 'react'
import { Canvas} from '@react-three/fiber'
import { Lightformer, ContactShadows, Environment, Center} from '@react-three/drei'
import Beast from './Beast'
import Backdrop from './Backdrop'
import CameraRig from './CameraRig'
import { OrbitControls } from '@react-three/drei'
import state from '../store'
import { PerspectiveCamera } from '@react-three/drei'
import { Effects } from './Effects'

const Model  = () => {
  return (
    <Canvas
    gl={{ preserveDrawingBuffer:true,logarithmicDepthBuffer: true, antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 15], fov: 25 }} shadows>
      <Backdrop/>
        <ambientLight intensity={15}/>
        {/* <Environment files="/Old Depot 2k.hdr" ground={{ height: 35, radius: 100, scale: 150 }}/> */}

        <PerspectiveCamera makeDefault  position={[60, 20, 20]} fov={80} />
        <Effects/>
        <OrbitControls  enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} minDistance={1} maxDistance={100} /> 
        
    </Canvas>
  )
}

export default Model