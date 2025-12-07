import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="fixed top-5 right-5 z-50 space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          (click)="toastService.remove(toast.id)"
          class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-2xl dark:text-gray-400 dark:bg-gray-800 cursor-pointer" 
          role="alert"
          [class.text-green-700]="toast.type === 'success'"
          [class.dark:text-green-200]="toast.type === 'success'"
          [class.bg-red-100]="toast.type === 'error'"
          [class.dark:bg-red-800]="toast.type === 'error'"
          [class.text-red-700]="toast.type === 'error'"
          [class.dark:text-red-200]="toast.type === 'error'">
          @if (toast.type === 'success') {
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            </div>
          } @else {
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </div>
          }
          <div class="ms-3 text-sm font-normal">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
