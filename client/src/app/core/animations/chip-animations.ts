// chip-animations.ts
import { animate, style, transition, trigger, query, stagger, animateChild } from '@angular/animations';

export const chipSetAnimation = trigger('chipSetAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(10px) scale(0.9)',
          width: '0px',
          overflow: 'hidden',
        }),
        stagger('80ms', [
          animate(
            '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
            style({
              opacity: 1,
              transform: 'translateY(0) scale(1)',
              width: '*',
            })
          ),
        ]),
      ],
      { optional: true }
    ),

    // Animate move (reordering)
    query(':enter, :leave, :move', [animateChild()], { optional: true }),
  ]),
]);

export const chipAnimation = trigger('chipAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(10px) scale(0.95)',
      width: '0px',
    }),
    animate(
      '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
      style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        width: '*',
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms cubic-bezier(0.55, 0, 0.55, 0.2)',
      style({
        opacity: 0,
        transform: 'scale(0.8)',
        width: '0px',
      })
    ),
  ]),
]);
