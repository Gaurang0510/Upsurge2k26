import React from 'react';
import { cn } from '@/lib/utils';

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  ...props
}) {
  const getAnimationClass = () => {
    if (vertical) {
      return reverse ? 'animate-marquee-vertical-reverse' : 'animate-marquee-vertical';
    } else {
      return reverse ? 'animate-marquee-horizontal-reverse' : 'animate-marquee-horizontal';
    }
  };

  return (
    <div
      {...props}
      data-slot="marquee"
      className={cn(
        'group flex overflow-hidden p-2 [--duration:30s] [--gap:1.5rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          className={cn(
            'flex shrink-0 justify-around',
            !vertical ? 'flex-row [gap:var(--gap)]' : 'flex-col [gap:var(--gap)]',
            getAnimationClass(),
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
