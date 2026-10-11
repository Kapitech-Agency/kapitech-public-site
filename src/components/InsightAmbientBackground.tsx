import React from 'react';
import { useReducedMotion } from 'motion/react';
import PatternWaves from './ui/PatternWaves/PatternWavesTyped';

export const InsightAmbientBackground: React.FC<{
  intensity?: 'hero' | 'detail';
}> = ({ intensity = 'hero' }) => {
  const reducedMotion = useReducedMotion();
  const hero = intensity === 'hero';

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0">
        <PatternWaves
          preset="silk"
          color="#DC143C"
          backgroundColor="#0B0C0E"
          opacity={hero ? 0.23 : 0.11}
          fade="edges"
          fadeSize={0.78}
          interactive={!reducedMotion}
          cursorSize={hero ? 50 : 42}
          cursorStrength={reducedMotion ? 0 : hero ? 0.34 : 0.16}
          speed={reducedMotion ? 0 : hero ? 0.18 : 0.12}
          scale={1.08}
          depth={hero ? 0.58 : 0.46}
          shine={hero ? 0.46 : 0.34}
          contrast={hero ? 1.02 : 1}
          intro={!reducedMotion}
        />
      </div>

      <div className="absolute inset-0 bg-dark-base/28" />
      <div className="absolute inset-y-0 left-0 w-[18%] bg-gradient-to-r from-dark-base/88 via-dark-base/48 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[18%] bg-gradient-to-l from-dark-base/88 via-dark-base/48 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-dark-base/82 via-dark-base/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-dark-base/74 to-dark-base" />
    </div>
  );
};

export default InsightAmbientBackground;
