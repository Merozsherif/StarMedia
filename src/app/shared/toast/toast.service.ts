import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'loading' | 'info';

export interface ToastItem {
  id: number;
  type: ToastType;
  messageEn: string;
  messageAr: string;
  duration: number;      // ms, 0 = stays until manually closed or updated
  createdAt: number;
}

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class ToastService {
  /** Reactive list of currently visible toasts — read this from the toast component */
  readonly toasts = signal<ToastItem[]>([]);

  private timers = new Map<number, ReturnType<typeof setTimeout>>();

  /** Quick success toast */
  success(messageEn: string, messageAr: string, duration = 3500): number {
    return this.push('success', messageEn, messageAr, duration);
  }

  /** Quick error toast (stays a bit longer by default) */
  error(messageEn: string, messageAr: string, duration = 5000): number {
    return this.push('error', messageEn, messageAr, duration);
  }

  /** Neutral info toast */
  info(messageEn: string, messageAr: string, duration = 3500): number {
    return this.push('info', messageEn, messageAr, duration);
  }

  /**
   * Start a "loading" toast that stays open until you resolve it.
   * Returns the toast id — pass it to resolve() or fail() when the operation finishes.
   *
   * Example:
   *   const id = this.toast.loading('Saving project...', 'جاري حفظ المشروع...');
   *   this.api.save(data).subscribe({
   *     next: () => this.toast.resolve(id, 'Project saved', 'تم حفظ المشروع'),
   *     error: () => this.toast.fail(id, 'Failed to save', 'فشل الحفظ')
   *   });
   */
  loading(messageEn: string, messageAr: string): number {
    return this.push('loading', messageEn, messageAr, 0);
  }

  /** Turn a loading toast into a success toast */
  resolve(id: number, messageEn: string, messageAr: string, duration = 3000): void {
    this.update(id, 'success', messageEn, messageAr, duration);
  }

  /** Turn a loading toast into an error toast */
  fail(id: number, messageEn: string, messageAr: string, duration = 5000): void {
    this.update(id, 'error', messageEn, messageAr, duration);
  }

  /** Manually dismiss a toast (used by the close button and by auto-dismiss timers) */
  dismiss(id: number): void {
    this.clearTimer(id);
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  /** Clear every toast currently on screen */
  clearAll(): void {
    this.toasts().forEach(t => this.clearTimer(t.id));
    this.toasts.set([]);
  }

  // ---- internal ----

  private push(type: ToastType, messageEn: string, messageAr: string, duration: number): number {
    const id = nextId++;
    const item: ToastItem = { id, type, messageEn, messageAr, duration, createdAt: Date.now() };
    this.toasts.update(list => [...list, item]);
    this.scheduleAutoDismiss(item);
    return id;
  }

  private update(id: number, type: ToastType, messageEn: string, messageAr: string, duration: number): void {
    this.clearTimer(id);
    this.toasts.update(list =>
      list.map(t => (t.id === id ? { ...t, type, messageEn, messageAr, duration, createdAt: Date.now() } : t))
    );
    const item = this.toasts().find(t => t.id === id);
    if (item) this.scheduleAutoDismiss(item);
  }

  private scheduleAutoDismiss(item: ToastItem): void {
    if (item.duration <= 0) return; // loading toasts (duration 0) stay open
    const timer = setTimeout(() => this.dismiss(item.id), item.duration);
    this.timers.set(item.id, timer);
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }
}
