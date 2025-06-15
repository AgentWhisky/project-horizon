import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

const enterTiming = '300ms cubic-bezier(0.25, 0.8, 0.25, 1)';
const leaveTiming = '300ms cubic-bezier(0.55, 0, 0.55, 0.2)';
const chipEnterStyle = {
  opacity: 0,
  transform: 'translateY(10px) scale(0.95)',
  width: '0px',
};
const chipFinalStyle = {
  opacity: 1,
  transform: 'translateY(0) scale(1)',
  width: '*',
};

export const chipSetAnimation = trigger('chipSetAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          ...chipEnterStyle,
        }),
        stagger('80ms', [animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style(chipFinalStyle))]),
      ],
      { optional: true }
    ),
  ]),
]);

export const chipAnimation = trigger('chipAnimation', [
  transition(':enter', [style(chipEnterStyle), animate(enterTiming, style(chipFinalStyle))]),
  transition(':leave', [
    animate(
      leaveTiming,
      style({
        opacity: 0,
        transform: 'scale(0.8)',
        width: '0px',
      })
    ),
  ]),
]);
