import React from 'react';

interface AtmosphericBackgroundProps {
  imageUrl?: string;
  className?: string;
  opacity?: number;
  disableGrayscale?: boolean;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  imageUrl = '/hero_background_3d.png',
  className = '',
  opacity = 0.08,
  disableGrayscale = true,
}) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
    <img
      src={imageUrl}
      alt=""
      loading="eager"
      decoding="async"
      className={`w-full h-full object-cover object-center ${disableGrayscale ? '' : 'grayscale'}`}
      style={{ opacity }}
    />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_30%,rgba(230,57,70,.12),transparent_30rem),linear-gradient(180deg,#08090b_8%,rgba(8,9,11,.65)_58%,#08090b_100%)]" />
  </div>
);
