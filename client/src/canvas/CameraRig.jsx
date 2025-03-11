import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { OrbitControls } from '@react-three/drei'; 
import state from '../store';

const CameraRig = ({ children }) => {
    const group = useRef();
    const snap = useSnapshot(state);

    useFrame((state, delta) => {
        const isBreakpoint = window.innerWidth <= 1260;
        const isMobile = window.innerWidth <= 600;

        let targetPosition = [-1.5, 0, 80];

        if (snap.intro) {
            if (isBreakpoint) {
                targetPosition = [0, 0, 2];
            }
            if (isMobile) {
                targetPosition = [0, 0, 2.5];
            }

            
            easing.damp3(state.camera.position, targetPosition, 0.25, delta);
            easing.dampE(
                group.current.rotation,
                [0, state.pointer.x * 1.5, 0],
                0.75,
                delta
            );
        }
    });

    return (
        <group ref={group}>
            {!snap.intro && (
                <OrbitControls
                enableZoom={false} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} makeDefault
                />
            )}
            {children}
        </group>
    );
};

export default CameraRig;