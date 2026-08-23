import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from './confirm-dialog.service';
import { AppService } from '../../core/services/app.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="confirmDialog.current() as req"
      class="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      [attr.dir]="app.currentLang() === 'ar' ? 'rtl' : 'ltr'"
    >
      <div class="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">

        <div class="flex items-start gap-3">
          <div
            class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            [ngClass]="req.danger === false ? 'bg-brand/10' : 'bg-red-500/10'"
          >
            <svg *ngIf="req.danger !== false" class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
            </svg>
            <svg *ngIf="req.danger === false" class="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1 pt-1">
            <h3 class="text-sm font-bold text-white">
              {{ app.currentLang() === 'ar' ? req.titleAr : req.titleEn }}
            </h3>
            <p class="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              {{ app.currentLang() === 'ar' ? req.messageAr : req.messageEn }}
            </p>
          </div>
        </div>

        <div class="flex gap-2.5 pt-2">
          <button
            (click)="confirmDialog.cancel()"
            class="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800 transition text-xs font-mono font-semibold"
          >
            {{ app.currentLang() === 'ar' ? (req.cancelTextAr || 'إلغاء') : (req.cancelTextEn || 'Cancel') }}
          </button>
          <button
            (click)="confirmDialog.confirm()"
            class="flex-1 px-4 py-2.5 rounded-xl text-xs font-mono font-bold shadow-md transition"
            [ngClass]="req.danger === false
              ? 'btn-brand'
              : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white'"
          >
            {{ app.currentLang() === 'ar' ? (req.confirmTextAr || 'تأكيد') : (req.confirmTextEn || 'Confirm') }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fade-in 0.15s ease-out; }
  `],
})
export class ConfirmDialogComponent {
  readonly confirmDialog = inject(ConfirmDialogService);
  readonly app = inject(AppService);
}
