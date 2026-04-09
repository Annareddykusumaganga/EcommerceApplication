import { Component } from '@angular/core';
import { ToastService, ToastState } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
     <div class="toast-wrap" *ngIf="toastService.toast$ | async as toast">

      <div
        *ngIf="toast.show"
        class="app-toast"
        [ngClass]="toast.type"
      >

        <span>{{ toast.message }}</span>

        

      </div>

    </div>
`,
  styles: [`

/* ===== Position Top-Left ===== */

.toast-wrap {
  position: fixed;
  top: 20px;
  right: 20px;   /* ← Top right */
   left: auto;    /* ✅ Cancel left alignment */
  z-index: 9999;
}

/* ===== Toast Base ===== */

.app-toast {
min-width: 260px;
  padding: 12px 16px;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  animation: slideInRight 0.3s ease;

}

/* ===== Success Toast ===== */

.success {
  background-color: #28a745; /* Green */
  color: white;
}

/* ===== Error Toast ===== */

.error {
  background-color: #dc3545; /* Red */
  color: white;
}

/* ===== Info Toast ===== */

.info {
  background-color: #17a2b8; /* Blue */
  color: white;
}

/* ===== Close Button ===== */

.toast-close {

  background: transparent;

  border: none;

  color: white;

  font-size: 18px;

  cursor: pointer;

  margin-left: 10px;
}

/* ===== Animation ===== */

@keyframes slideInRight {

  from {
    opacity: 0;
    transform: translateX(40px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }

}

  `]

})
export class ToastComponent {
  constructor(public toastService: ToastService) { }

}
