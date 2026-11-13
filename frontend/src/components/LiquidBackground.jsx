import React, { useEffect, useState } from 'react';

export default function LiquidBackground() {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="liquid-canvas-bg" aria-hidden="true">
      {/* Morphing Retro Color Blobs */}
      <div className="liquid-blob blob-1" />
      <div className="liquid-blob blob-2" />
      <div className="liquid-blob blob-3" />
      <div className="liquid-blob blob-4" />

      {/* Viscous interactive cursor refraction glow */}
      <div
        className="blob-cursor"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          opacity: mousePos.x > 0 ? 0.75 : 0
        }}
      />
    </div>
  );
}
