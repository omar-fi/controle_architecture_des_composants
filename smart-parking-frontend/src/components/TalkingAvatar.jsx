import React, { useState, useEffect, useRef, Suspense } from 'react';
import './TalkingAvatar.css';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const AvatarModel = ({ isSpeaking }) => {
    const { scene } = useGLTF('/avatar.glb');
    const avatarRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        // Simple bobbing to simulate life/talking
        if (avatarRef.current) {
            avatarRef.current.position.y = -1.2 + Math.sin(t) * 0.05;
            if (isSpeaking) {
                avatarRef.current.scale.set(1.5, 1.5 + Math.sin(t * 20) * 0.05, 1.5);
                avatarRef.current.rotation.y = Math.sin(t * 5) * 0.1;
            } else {
                avatarRef.current.scale.set(1.5, 1.5, 1.5);
                avatarRef.current.rotation.y = 0;
            }
        }
    });

    return <primitive ref={avatarRef} object={scene} scale={1.5} position={[0, -1.2, 0]} />;
};

const TalkingAvatar = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasSpoken, setHasSpoken] = useState(false);

    const script = "Bonjour ! Bienvenue sur Smart Parking. Je suis là pour vous guider. Trouvez une place en temps réel et réservez-la instantanément pour un stationnement sans stress. Bonne route !";

    useEffect(() => {
        const timer = setTimeout(() => {
            speak();
        }, 1000);
        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = () => {
        if (isSpeaking) return;
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.1;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            setHasSpoken(true);
        };
        window.speechSynthesis.speak(utterance);
    };

    if (hasSpoken) return null;

    return (
        <div className={`talking-avatar-container ${isSpeaking ? 'speaking' : ''}`} onClick={speak}>
            <div className="avatar-3d-wrapper" style={{ width: '200px', height: '200px' }}>
                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <pointLight position={[-5, -5, -5]} intensity={0.5} />
                    <Suspense fallback={null}>
                        <AvatarModel isSpeaking={isSpeaking} />
                    </Suspense>
                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
            </div>
            <div className="speech-bubble">
                {isSpeaking ? (
                    <div className="sound-wave">
                        <span></span><span></span><span></span>
                    </div>
                ) : (
                    <p className="click-hint">Cliquez-moi ! 👋</p>
                )}
            </div>
        </div>
    );
};

export default TalkingAvatar;
