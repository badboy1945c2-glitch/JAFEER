/**
 * modal.js - مدير النوافذ المنبثقة الهندسية
 */

let modalRoot = null;

function ensureModalRoot() {
  if (!modalRoot) {
    modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }
  return modalRoot;
}

/**
 * فتح نافذة منبثقة
 * @param {Object} options
 * @returns {{ close: Function }}
 */
export function openModal({
  title = '',
  content = '',
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  showFooter = true,
  onConfirm = null,
  onCancel = null
} = {}) {
  const root = ensureModalRoot();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  backdrop.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" aria-label="إغلاق النافذة">✕</button>
      </div>
      <div class="modal-body">
        ${typeof content === 'string' ? content : ''}
      </div>
      ${showFooter ? `
        <div class="modal-footer">
          <button class="btn btn-secondary modal-cancel-btn">${cancelText}</button>
          <button class="btn btn-primary modal-confirm-btn">${confirmText}</button>
        </div>
      ` : ''}
    </div>
  `;

  if (typeof content !== 'string' && content instanceof Node) {
    backdrop.querySelector('.modal-body').appendChild(content);
  }

  const close = () => {
    backdrop.classList.remove('is-open');
    setTimeout(() => {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
    }, 200);
    document.removeEventListener('keydown', handleKeydown);
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      if (onCancel) onCancel();
      close();
    }
  };

  document.addEventListener('keydown', handleKeydown);

  backdrop.querySelector('.modal-close').addEventListener('click', () => {
    if (onCancel) onCancel();
    close();
  });

  const cancelBtn = backdrop.querySelector('.modal-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      close();
    });
  }

  const confirmBtn = backdrop.querySelector('.modal-confirm-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (onConfirm) onConfirm();
      close();
    });
  }

  // إغلاق عند النقر على الخلفية الخارجية
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      if (onCancel) onCancel();
      close();
    }
  });

  root.appendChild(backdrop);
  // تفعيل الحركة بعد إضافة العنصر للـ DOM
  requestAnimationFrame(() => {
    backdrop.classList.add('is-open');
  });

  return { close };
}

