"use client";
import { useRef, useEffect, useState, Dispatch, SetStateAction } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh, Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";

function MeshComponent() {
    const fileUrl = "/shiba/scene.gltf";
    const mesh = useRef<Mesh>(null!);
    const gltf = useLoader(GLTFLoader, fileUrl);

    // State to hold the current position
    const [position, setPosition]: any = useState([0, 1, 0]);

    // Function to handle key down events
    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowRight':
                setPosition(prevPos => [prevPos[0] + 1, prevPos[1], prevPos[2]]);
                break;
            case 'ArrowLeft':
                setPosition(prevPos => [prevPos[0] - 1, prevPos[1], prevPos[2]]);
                break;
            case 'ArrowUp':
                setPosition(prevPos => [prevPos[0], prevPos[1], prevPos[2] - 1]);
                break;
            case 'ArrowDown':
                setPosition(prevPos => [prevPos[0], prevPos[1], prevPos[2] + 1]);
                break;
            default:
                break;
        }
    };

    // Effect to add keydown listener on mount and remove on unmount
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Update the mesh position on each frame
    useFrame(() => {
        if (mesh.current) {
            mesh.current.position.set(...position);
        }
    });

    return (
        <mesh ref={mesh} position={position} rotation={[0, Math.PI, 0]}>
            <primitive object={gltf.scene} />
        </mesh>
    );
}

export default function Shiba() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Canvas className='h-2xl w-2xl' camera={{ position: [0, 10, 0] }}>
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <MeshComponent />
                <gridHelper />
            </Canvas>
        </div>
    );
}