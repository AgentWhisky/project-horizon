import { Directive, ElementRef, effect, inject, input } from '@angular/core';

/**
 * A animation directive that enables an expansion animation on an element with height auto
 * - `hzExpand` is bound to a boolean value to trigger the animation change
 * - `hzExpandOpenDuration` is an optional input that sets the opening duration (ms)
 * - `hzExpandCloseDuratio` is an optional input that sets the closing duration (ms)
 *
 * - Default opening and closing durations are 200ms
 */
@Directive({
  selector: '[hzExpand]',
})
export class HzExpandDirective {
  readonly hzExpand = input<boolean>(false);
  readonly hzExpandOpenDuration = input<number>(200);
  readonly hzExpandCloseDuration = input<number>(200);

  private host: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  private anim: Animation | null = null;

  constructor() {
    const el = this.host.nativeElement;
    el.style.overflow = 'hidden';
    el.style.height = '0px';
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');

    effect(() => this.run(this.hzExpand()));
  }

  private run(open: boolean) {
    const el = this.host.nativeElement;
    this.anim?.cancel();

    if (open) {
      el.style.display = '';
      el.setAttribute('aria-hidden', 'false');

      /** Get scroll height to emulate height auto */
      const target = el.scrollHeight;

      this.anim = el.animate([{ height: '0px' }, { height: `${target}px` }], {
        duration: this.hzExpandOpenDuration(),
        easing: 'ease-out',
        fill: 'forwards',
      });

      this.anim.onfinish = () => {
        el.style.height = 'auto';
      };
    } else {
      //** Get current height to emulate height auto */
      const curHeight = el.getBoundingClientRect().height;
      el.style.height = `${curHeight}px`;

      this.anim = el.animate([{ height: `${curHeight}px` }, { height: '0px' }], {
        duration: this.hzExpandCloseDuration(),
        easing: 'ease-in',
        fill: 'forwards',
      });

      this.anim.onfinish = () => {
        el.style.display = 'none';
        el.setAttribute('aria-hidden', 'true');
      };
    }
  }
}
