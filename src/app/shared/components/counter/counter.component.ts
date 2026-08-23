import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
})
export class CounterComponent implements OnChanges, OnDestroy {
  @Input() to = 0;
  @Input() suffix = '';
  @Input() duration = 1800;

  value = 0;

  private raf?: number;

  ngOnChanges(changes: SimpleChanges): void {
    // Runs as soon as `to` is bound (no IntersectionObserver dependency —
    // starts animating immediately so it can never silently fail to trigger).
    if (changes['to']) {
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  private animate(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    const target = this.to;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / this.duration);
      const eased = 1 - Math.pow(1 - p, 3);
      this.value = Math.round(target * eased);
      if (p < 1) {
        this.raf = requestAnimationFrame(tick);
      } else {
        this.value = target;
      }
    };
    this.raf = requestAnimationFrame(tick);
  }
}
