import React from 'react';
import PatternWaves from './ui/PatternWaves/PatternWavesTyped';

export const InsightAmbientBackground: React.FC<{
  intensity?: 'hero' | 'detail';
}> = ({ intensity = 'hero' }) => {
  const detail = intensity === 'detail';

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-[0.98]">
        <PatternWaves
          preset="silk"
          color="#dc143c"
          backgroundColor="#0B0C0E"
          opacity={detail ? 0.24 : 0.38}
          fade="edges"
          fadeSize={0.72}
          interactive
          cursorSize={detail ? 72 : 82}
          cursorStrength={detail ? 0.42 : 0.58}
          speed={detail ? 0.18 : 0.22}
          scale={1.08}
          depth={detail ? 0.5 : 0.62}
          shine={detail ? 0.45 : 0.58}
          contrast={1.02}
          intro
        />
      </div>

      <div className="absolute inset-y-0 left-0 w-[24%] bg-gradient-to-r from-[#0B0C0E] via-[#0B0C0E]/65 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[24%] bg-gradient-to-l from-[#0B0C0E] via-[#0B0C0E]/65 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0B0C0E] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0C0E] via-[#0B0C0E]/82 to-transparent" />

      <div className="absolute left-[9%] top-[18%] h-40 w-40 rounded-full bg-brand-red/[0.07] blur-3xl sm:h-56 sm:w-56" />
      <div className="absolute right-[12%] top-[28%] h-28 w-28 rounded-full bg-white/[0.025] blur-3xl sm:h-40 sm:w-40" />
    </div>
  );
};

export default InsightAmbientBackground;
