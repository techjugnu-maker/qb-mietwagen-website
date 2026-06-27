'use client';

/**
 * Renders a mailto:/tel: link assembled entirely on the client after hydration.
 * Server-rendered HTML contains no email/phone data — bots crawling static
 * HTML see only a placeholder span; users get a fully clickable link.
 *
 * Usage:
 *   <ObfuscatedLink parts={['info','@','qbmw','.','de']} prefix="mailto:" />
 *   <ObfuscatedLink parts={['+4917693172917']} prefix="tel:" display="+49 176 93172917" />
 *   <ObfuscatedLink parts={['info','@','qbmw','.','de']} prefix="mailto:" className="...">
 *     Card content as children (always visible; only the href is protected)
 *   </ObfuscatedLink>
 */

import { useState, useEffect, type ReactNode } from 'react';

interface Props {
  /** String fragments joined on the client to form the address */
  parts: string[];
  /** URI prefix: 'mailto:', 'tel:', or '' for full URLs split across parts */
  prefix: string;
  /** Visible label when no children are provided; falls back to assembled address */
  display?: string;
  className?: string;
  children?: ReactNode;
  target?: string;
  rel?: string;
}

export default function ObfuscatedLink({
  parts,
  prefix,
  display,
  className,
  children,
  target,
  rel,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const address = parts.join('');

  if (!mounted) {
    // Before JS executes: render a visually neutral placeholder.
    // Children (icons, labels) are still shown so card layouts look correct.
    return (
      <span className={className}>
        {children ?? <span aria-hidden="true">···</span>}
      </span>
    );
  }

  return (
    <a
      href={`${prefix}${address}`}
      className={className}
      target={target}
      rel={rel}
    >
      {children ?? display ?? address}
    </a>
  );
}
