import React from 'react';
import { useReducedMotion } from 'motion/react';
import PatternWaves from './ui/PatternWaves/PatternWavesTyped';

export const InsightAmbientBackground: React.FC<{
  intensity?: 'hero' | 'detail';
}> = ({ intensity = 'hero' }) => {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0">
        <PatternWaves
          preset="silk"
          color="#dc143c"
          backgroundColor="#170f0f"
          opacity={intensity === 'hero' ? 0.58 : 0.28}
          fade="none"
          fadeSize={0.7}
          interactive={!reducedMotion}
          cursorSize={intensity === 'hero' ? 50 : 42}
          cursorStrength={reducedMotion ? 0 : intensity === 'hero' ? 0.6 : 0.35}
          speed={reducedMotion ? 0 : intensity === 'hero' ? 0.28 : 0.18}
          scale={1.05}
          depth={intensity === 'hero' ? 0.72 : 0.6}
          shine={intensity === 'hero' ? 0.7 : 0.52}
          contrast={intensity === 'hero' ? 1.08 : 1.02}
          intro={!reducedMotion}
        />
      </div>

      <div className="absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-[#0B0C0E]/70 via-[#0B0C0E]/22 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[14%] bg-gradient-to-l from-[#0B0C0E]/70 via-[#0B0C0E]/22 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0B0C0E]/72 via-[#0B0C0E]/24 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#0B0C0E]/68 to-[#0B0C0E]" />
    </div>
  );
};

export default InsightAmbientBackground;
