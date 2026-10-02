import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CinematicText,
  InteractiveMedia,
  Magnetic,
} from '../motion/MotionSystem';

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <div
      className={className}
      data-motion-reveal
      data-motion-duration={String(Math.max(0.72, 0.92 - Math.min(delay, 0.24)))}
      data-motion-y={String(y)}
    >
      {children}
    </div>
  );
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <CinematicText className={className} delay={delay}>
      {children}
    </CinematicText>
  );
}

export function ImageReveal({
  src,
  alt,
  className = '',
  imgClassName = '',
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <InteractiveMedia
      src={src}
      alt={alt}
      className={className}
      imageClassName={imgClassName}
      cursorLabel="View"
    />
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={`kapi-section-header ${align === 'center' ? 'is-center' : ''}`}
      data-motion-reveal
    >
      <span className="kapi-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export function GlassPanel({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={`kapi-panel ${className}`}
      data-motion-surface
    >
      {children}
    </Tag>
  );
}

export function GlassButton({
  to,
  children,
  variant = 'primary',
  className = '',
}: {
  to: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  return (
    <Magnetic as="span" strength={0.18} className="inline-flex">
      <Link
        to={to}
        className={`kapi-button kapi-button--${variant} ${className}`}
        data-cursor="button"
      >
        <span>{children}</span>
        <ArrowUpRight size={15} />
      </Link>
    </Magnetic>
  );
}

export function PageShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`kapi-page ${className}`}>{children}</div>;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className = '',
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`kapi-page-hero ${className}`} data-motion-section>
      <div className="kapi-page-hero__aura" data-motion-section-aura aria-hidden="true" />
      <div className="kapi-container">
        <div data-motion-reveal>
          <span className="kapi-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
