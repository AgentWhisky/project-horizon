import { animate, style, transition, trigger } from '@angular/animations';

export const cardAnimation = trigger('cardAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translateY(20px) scale(0.96)',
    }),
    animate(
      '300ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      style({
        opacity: 1,
        transform: 'translateY(0) scale(1)',
      })
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms ease-in',
      style({
        opacity: 0,
        transform: 'translateY(20px) scale(0.96)',
      })
    ),
  ]),
]);
