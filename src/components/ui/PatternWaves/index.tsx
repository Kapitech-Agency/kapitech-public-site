import React from 'react';
import PatternWavesImplementation from './PatternWaves.jsx';

export interface PatternWavesProps {
  [key: string]: unknown;
}

const PatternWaves = PatternWavesImplementation as unknown as React.ComponentType<PatternWavesProps>;

export default PatternWaves;
