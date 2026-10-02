import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <motion.div
      className={className}
      initial={{ opacity: 0, y: Math.min(y, 16), clipPath: 'inset(0 0 10% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
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
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.58, delay, ease: EASE }}
    >
      {children}
    </motion.div>
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
    <motion.div
      className={`kapi-media ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.14 }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={imgClassName}
        variants={{
          hidden: { opacity: 0, scale: 1.055, y: 16 },
          show: { opacity: 1, scale: 1, y: 0 },
        }}
        transition={{ duration: 0.78, ease: EASE }}
      />
      <motion.span
        aria-hidden="true"
        className="kapi-media-wipe"
        variants={{ hidden: { scaleX: 1 }, show: { scaleX: 0 } }}
        transition={{ duration: 0.72, delay: 0.06, ease: EASE }}
      />
    </motion.div>
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
    <div className={`kapi-section-header ${align === 'center' ? 'is-center' : ''}`}>
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
  return <Tag className={`kapi-panel ${className}`}>{children}</Tag>;
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
    <Link to={to} className={`kapi-button kapi-button--${variant} ${className}`}>
      <span>{children}</span>
      <ArrowUpRight size={15} />
    </Link>
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
    <section className={`kapi-page-hero ${className}`}>
      <div className="kapi-container">
        <Reveal>
          <span className="kapi-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
