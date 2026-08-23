import { Injectable, signal } from '@angular/core';

export interface ConfirmRequest {
  titleEn: string;
  titleAr: string;
  messageEn: string;
  messageAr: string;
  confirmTextEn?: string;
  confirmTextAr?: string;
  cancelTextEn?: string;
  cancelTextAr?: string;
  danger?: boolean; // true = red/destructive styling (default true, since this is mainly for deletes)
}

interface ActiveConfirm extends ConfirmRequest {
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  readonly current = signal<ActiveConfirm | null>(null);

  /**
   * Opens the confirm dialog and resolves true/false based on the user's choice.
   *
   * Example (delete flow):
   *   const ok = await this.confirmDialog.ask({
   *     titleEn: 'Delete project?', titleAr: 'حذف المشروع؟',
   *     messageEn: 'This action cannot be undone.', messageAr: 'الإجراء ده مش هينعمله رجوع.'
   *   });
   *   if (!ok) return;
   *   // proceed with delete...
   */
  ask(request: ConfirmRequest): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.current.set({ danger: true, ...request, resolve });
    });
  }

  confirm(): void {
    this.current()?.resolve(true);
    this.current.set(null);
  }

  cancel(): void {
    this.current()?.resolve(false);
    this.current.set(null);
  }
}
