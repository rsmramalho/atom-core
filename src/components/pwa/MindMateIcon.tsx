import React from 'react';

interface MindMateIconProps {
  size?: number;
  backgroundColor?: string;
  accentColor?: string;
  cornerRadius?: number;
  className?: string;
}

export const MindMateIcon: React.FC<MindMateIconProps> = ({
  size = 512,
  backgroundColor = '#111318',
  accentColor = '#26D96E',
  cornerRadius,
  className,
}) => {
  const radius = cornerRadius ?? size * 0.1875; // 18.75% default
  const center = size / 2;
  const orbitWidth = size * 0.35;
  const orbitHeight = size * 0.15;
  const strokeWidth = size * 0.025;
  const coreRadius = size * 0.065;
  const particleRadius = size * 0.025;
  const particleOrbitRadius = size * 0.28;

  // Calculate particle positions on each orbit
  const getParticlePosition = (angle: number, orbitAngle: number) => {
    const rad = (angle * Math.PI) / 180;
    const orbitRad = (orbitAngle * Math.PI) / 180;
    
    // Position on ellipse
    const x = particleOrbitRadius * Math.cos(rad);
    const y = particleOrbitRadius * 0.4 * Math.sin(rad);
    
    // Rotate by orbit angle
    const rotatedX = x * Math.cos(orbitRad) - y * Math.sin(orbitRad);
    const rotatedY = x * Math.sin(orbitRad) + y * Math.cos(orbitRad);
    
    return {
      x: center + rotatedX,
      y: center + rotatedY,
    };
  };

  const particle1 = getParticlePosition(45, 0);
  const particle2 = getParticlePosition(165, 60);
  const particle3 = getParticlePosition(285, 120);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect
        width={size}
        height={size}
        rx={radius}
        fill={backgroundColor}
      />
      
      {/* Glow effect for core */}
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={size * 0.02} />
        </filter>
      </defs>
      
      {/* Core glow */}
      <circle
        cx={center}
        cy={center}
        r={coreRadius * 2.5}
        fill="url(#coreGlow)"
        filter="url(#blur)"
      />
      
      {/* Orbit 1 - horizontal */}
      <ellipse
        cx={center}
        cy={center}
        rx={orbitWidth}
        ry={orbitHeight}
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeOpacity="0.8"
        transform={`rotate(0 ${center} ${center})`}
      />
      
      {/* Orbit 2 - 60 degrees */}
      <ellipse
        cx={center}
        cy={center}
        rx={orbitWidth}
        ry={orbitHeight}
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeOpacity="0.8"
        transform={`rotate(60 ${center} ${center})`}
      />
      
      {/* Orbit 3 - 120 degrees */}
      <ellipse
        cx={center}
        cy={center}
        rx={orbitWidth}
        ry={orbitHeight}
        stroke={accentColor}
        strokeWidth={strokeWidth}
        strokeOpacity="0.8"
        transform={`rotate(120 ${center} ${center})`}
      />
      
      {/* Particle 1 */}
      <circle
        cx={particle1.x}
        cy={particle1.y}
        r={particleRadius}
        fill={accentColor}
      />
      
      {/* Particle 2 */}
      <circle
        cx={particle2.x}
        cy={particle2.y}
        r={particleRadius}
        fill={accentColor}
      />
      
      {/* Particle 3 */}
      <circle
        cx={particle3.x}
        cy={particle3.y}
        r={particleRadius}
        fill={accentColor}
      />
      
      {/* Central core */}
      <circle
        cx={center}
        cy={center}
        r={coreRadius}
        fill={accentColor}
      />
    </svg>
  );
};

export default MindMateIcon;
