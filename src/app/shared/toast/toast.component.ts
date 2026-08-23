import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastItem } from './toast.service';

// Path based on your project tree: shared/toast/ -> core/services/app.service.ts
import { AppService } from '../../core/services/app.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed z-[100] top-4 flex flex-col gap-3 w-[calc(100%-2rem)] max-w-sm
             ltr:right-4 rtl:left-4"
      [attr.dir]="app.currentLang() === 'ar' ? 'rtl' : 'ltr'"
    >
      <div
        *ngFor="let toast of toastService.toasts()"
        class="relative overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md
               bg-zinc-900/95 animate-toast-in flex items-start gap-3 p-4 pr-3 rtl:pr-4 rtl:pl-3"
        [ngClass]="borderClass(toast.type)"
      >
        <!-- Icon -->
        <div class="shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div *ngIf="toast.type === 'loading'" class="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Message -->
        <p class="flex-1 text-sm font-medium text-zinc-100 leading-snug pt-0.5">
          {{ app.currentLang() === 'ar' ? toast.messageAr : toast.messageEn }}
        </p>

        <!-- Close button (hidden while loading — resolve/fail will replace it) -->
        <button
          *ngIf="toast.type !== 'loading'"
          (click)="toastService.dismiss(toast.id)"
          class="shrink-0 text-zinc-500 hover:text-zinc-200 transition-colors text-sm leading-none p-1 -m-1"
          [attr.aria-label]="app.currentLang() === 'ar' ? 'إغلاق' : 'Close'"
        >
          ✕
        </button>

        <!-- Countdown progress bar -->
        <div
          *ngIf="toast.duration > 0"
          class="absolute bottom-0 left-0 h-0.5 origin-left"
          [ngClass]="barClass(toast.type)"
          [style.animation]="'toast-countdown ' + toast.duration + 'ms linear forwards'"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes toast-countdown {
      from { width: 100%; }
      to { width: 0%; }
    }
    @keyframes toast-in {
      from { opacity: 0; transform: translateY(-8px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-toast-in { animation: toast-in 0.2s ease-out; }
  `],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
  readonly app = inject(AppService);

  borderClass(type: ToastItem['type']): string {
    switch (type) {
      case 'success': return 'border-emerald-500/30';
      case 'error': return 'border-red-500/30';
      case 'info': return 'border-sky-500/30';
      default: return 'border-zinc-800';
    }
  }

  barClass(type: ToastItem['type']): string {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-sky-500';
      default: return 'bg-brand';
    }
  }
}
