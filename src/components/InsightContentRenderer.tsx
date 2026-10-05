import React from 'react';
import type { InsightBlock } from '../data/insightTypes';

function inlineMarkdown(value: string): React.ReactNode[] {
  const tokens = value.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\)]+\))/g).filter(Boolean);
  return tokens.map((token, index) => {
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={index} className="font-semibold text-white">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }
    const match = token.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
    if (match) {
      const [, label, rawUrl] = match;
      let url = '';
      try {
        const parsed = new URL(rawUrl, window.location.origin);
        if (parsed.protocol === 'https:' || parsed.protocol === 'http:') url = parsed.toString();
      } catch {}
      if (url) {
        const external = new URL(url).origin !== window.location.origin;
        return (
          <a
            key={index}
            href={url}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="font-medium text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-brand-red/60"
          >
            {label}
          </a>
        );
      }
    }
    return <React.Fragment key={index}>{token}</React.Fragment>;
  });
}

export const InsightContentRenderer: React.FC<{ blocks: InsightBlock[]; headingIds?: string[] }> = ({ blocks, headingIds = [] }) => (
  <div className="kapi-insight-body max-w-none">
    {blocks.map((block, index) => {
      if (block.type === 'paragraph') {
        return <p key={index} className="mb-6 text-[15px] leading-8 text-[#C3C7D0] sm:text-base">{inlineMarkdown(block.text)}</p>;
      }

      if (block.type === 'heading') {
        const Heading = block.level === 3 ? 'h3' : 'h2';
        const headingIndex = blocks.slice(0, index).filter(item => item.type === 'heading').length;
        return (
          <Heading
            key={index}
            id={headingIds[headingIndex]}
            className={
              block.level === 3
                ? 'mb-4 mt-10 text-xl font-display font-semibold leading-tight tracking-[-0.02em] text-white'
                : 'mb-5 mt-14 scroll-mt-28 text-2xl font-display font-semibold leading-tight tracking-[-0.025em] text-white sm:text-3xl'
            }
          >
            {block.text}
          </Heading>
        );
      }

      if (block.type === 'list') {
        const ListTag = block.ordered ? 'ol' : 'ul';
        return (
          <ListTag key={index} className={(block.ordered ? 'list-decimal ' : 'list-disc ') + 'mb-7 space-y-2.5 pl-6 text-[15px] leading-7 text-[#C3C7D0] sm:text-base'}>
            {(block.items || []).map((item, itemIndex) => <li key={itemIndex}>{inlineMarkdown(item)}</li>)}
          </ListTag>
        );
      }

      if (block.type === 'quote') {
        return (
          <figure key={index} className="my-9 border-l border-brand-red/60 pl-5 sm:pl-7">
            <blockquote className="text-lg font-display leading-8 text-white/90 sm:text-xl">{inlineMarkdown(block.text)}</blockquote>
            {block.attribution && <figcaption className="mt-3 text-xs font-mono uppercase tracking-[0.12em] text-[#7D8492]">{block.attribution}</figcaption>}
          </figure>
        );
      }

      if (block.type === 'image') {
        return (
          <figure key={index} className="my-9">
            <img src={block.url} alt={block.alt} loading="lazy" className="w-full rounded-2xl border border-white/[0.08] bg-[#0B0C0E] object-cover" />
            {block.caption && <figcaption className="mt-2 text-xs leading-5 text-[#707684]">{block.caption}</figcaption>}
          </figure>
        );
      }

      if (block.type === 'table') {
        return (
          <div key={index} className="my-9 overflow-x-auto rounded-2xl border border-white/[0.08]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-white/[0.035]">
                  {block.headers.map((header, headerIndex) => <th key={headerIndex} className="border-b border-white/[0.08] px-4 py-3 font-semibold text-white">{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-white/[0.06] last:border-b-0">
                    {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top leading-6 text-[#B6BBC5]">{inlineMarkdown(cell)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      if (block.type === 'callout') {
        return (
          <aside key={index} className="my-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
            {block.title && <p className="mb-2 text-sm font-semibold text-white">{block.title}</p>}
            <p className="text-sm leading-6 text-[#B9BEC8]">{inlineMarkdown(block.text)}</p>
          </aside>
        );
      }

      if (block.type === 'code') {
        return (
          <pre key={index} className="my-8 overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#08090B] p-5 text-xs leading-6 text-[#D7DAE0]">
            <code>{block.code}</code>
          </pre>
        );
      }

      if (block.type === 'link') {
        return (
          <p key={index} className="my-7">
            <a href={block.url} target={/^https?:\/\//.test(block.url) && !block.url.startsWith(window.location.origin) ? '_blank' : undefined} rel={/^https?:\/\//.test(block.url) && !block.url.startsWith(window.location.origin) ? 'noreferrer' : undefined} className="inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-brand-red hover:decoration-brand-red/60">
              {block.label}
            </a>
          </p>
        );
      }

      if (block.type === 'divider') {
        return <hr key={index} className="my-10 border-0 border-t border-white/[0.08]" />;
      }

      return null;
    })}
  </div>
);
