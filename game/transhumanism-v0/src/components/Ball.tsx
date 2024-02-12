"use client";
import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, PlaneHelper, Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";
import { motion } from 'framer-motion-3d';
import { TextureLoader } from 'three';


function MeshComponent() {
    const fileUrl = "/shiba/scene.gltf";
    const mesh = useRef<Mesh>(null!);
    const red = useLoader(TextureLoader, '/1.webp');


    // State to hold the current position
    // State to hold the target position
    const [targetPosition, setTargetPosition] = useState<[x: number, y: number, z: number]>([0, .1, 0]);
    const speed = 0.7;
    // Function to handle key down events
    const handleKeyDown = (event: KeyboardEvent) => {
        let offsetX = 0;
        let offsetZ = 0;

        if (event.key === 'ArrowRight') {
            offsetX = speed;
        } else if (event.key === 'ArrowLeft') {
            offsetX = -speed;
        }

        if (event.key === 'ArrowUp') {
            offsetZ = -speed; // Negative Z moves forward
        } else if (event.key === 'ArrowDown') {
            offsetZ = speed; // Positive Z moves backward
        }

        // Diagonal movement logic
        if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            offsetX *= Math.sqrt(2); // Increase horizontal speed for diagonal movement
            offsetZ *= Math.sqrt(2); // Increase vertical speed for diagonal movement
        }

        setTargetPosition((prevPos: number[]) => [prevPos[0] + offsetX, prevPos[1], prevPos[2] + offsetZ]);
    };


    // Effect to add keydown listener on mount and remove on unmount
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    return (
        <motion.mesh
            ref={mesh}
            rotation={[-Math.PI / 2, 0, 0]}
            animate={{ x: targetPosition[0], y: targetPosition[1], z: targetPosition[2] }}
            transition={{ stiffness: 285, damping: 36 }}
            onClick={() => console.log('Clicked')}

        >
            {/* <primitive object={gltf.scene} /> */}
            <planeGeometry attach="geometry" args={[1, 1]} />
            <meshBasicMaterial attach="material" map={red} />
        </motion.mesh>
    );
}

export default function Transhumanism() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Canvas className='h-2xl w-2xl' camera={{ position: [0, 10, 0] }}>
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <MeshComponent />
                <gridHelper scale={0.5} />
            </Canvas>
        </div>
    );
}