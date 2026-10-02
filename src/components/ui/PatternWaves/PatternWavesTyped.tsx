import type { ComponentType } from 'react';
import PatternWavesBase from './PatternWaves.jsx';

export interface PatternWavesProps {
  preset?: string;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  fade?: string;
  fadeSize?: number;
  interactive?: boolean;
  cursorSize?: number;
  cursorStrength?: number;
  speed?: number;
  scale?: number;
  depth?: number;
  shine?: number;
  contrast?: number;
  intro?: boolean;
}

const PatternWaves = PatternWavesBase as ComponentType<PatternWavesProps>;

export default PatternWaves;
