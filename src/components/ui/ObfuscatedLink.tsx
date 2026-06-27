'use client';

/**
 * Bot-resistant contact link.
 *
 * Strategy: render human-readable text in the HTML source ("info [at] qbmw.de"),
 * assemble the real mailto:/tel: href only on user interaction (click/keyboard).
 * No useEffect, no hydration tricks — content is always immediately visible.
 *
 * Usage (inline):
 *   <ObfuscatedLink parts={['info','@','qbmw','.','de']} prefix="mailto:" />
 *   → renders "info [at] qbmw.de", opens mailto on click
 *
 * Usage (card wrapper with children):
 *   <ObfuscatedLink parts={['+4917693172917']} prefix="tel:" className="flex ...">
 *     <Icon/><span>+49 176 93172917</span>
 *   </ObfuscatedLink>
 *   → children always visible, card becomes clickable after JS parses
 */

import { type ReactNode } from 'react';

interface Props {
  /** String fragments joined at click time to form the target address */
  parts: string[];
  /** URI scheme prefix — 'mailto:', 'tel:', or '' for full URLs in parts */
  prefix: string;
  /** Human-readable label override (no children case). For emails,
   *  defaults to the address with '@' replaced by ' [at] '. */
  display?: string;
  className?: string;
  children?: ReactNode;
  /** Open in new tab (window.open with noopener,noreferrer) */
  target?: string;
}

export default function ObfuscatedLink({
  parts,
  prefix,
  display,
  className,
  children,
  target,
}: Props) {
  function navigate() {
    const address = parts.join('');
    const href = `${prefix}${address}`;
    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  }

  // What bots read in the HTML source (for the no-children inline case)
  const rawAddress = parts.join('');
  const humanLabel =
    display ??
    (prefix === 'mailto:'
      ? rawAddress.replace('@', ' [at] ') // "info [at] qbmw.de"
      : rawAddress);

  return (
    <span
      role="link"
      tabIndex={0}
      onClick={navigate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate();
        }
      }}
      className={`cursor-pointer${className ? ` ${className}` : ''}`}
    >
      {children ?? humanLabel}
    </span>
  );
}
