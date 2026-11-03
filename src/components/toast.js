/**
 * toast.js - نظام الإشعارات العائمة الخفيفة لموقع «المهندس الصغير»
 * يدعم الرسائل العادية، الأخطاء، والنجاح مع زر التراجع (Undo)
 */

let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('toast-root');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-root';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    } else {
      toastContainer.className = 'toast-container';
    }
  }
  return toastContainer;
}

/**
 * إظهار إشعار عائم
 * @param {string} message - نص الإشعار
 * @param {Object} options - خيارات مثل type ('info'|'success'|'error'), duration, onUndo
 */
export function showToast(message, { type = 'info', duration = 4000, onUndo = null } = {}) {
  const container = ensureContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let undoButtonHtml = '';
  if (onUndo) {
    undoButtonHtml = `
      <button class="btn btn-sm btn-ghost toast-undo-btn" style="color: var(--violet-700); font-weight: 600; padding: 2px 8px; margin-right: auto;">
        تراجع
      </button>
    `;
  }

  toast.innerHTML = `
    <div style="flex-grow: 1;">${message}</div>
    ${undoButtonHtml}
    <button class="toast-close-btn" style="color: var(--ink-muted); font-size: 1.1rem; line-height: 1;" aria-label="إغلاق الإشعار">
      ×
    </button>
  `;

  const removeToast = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'opacity 150ms ease, transform 150ms ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 150);
  };

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', removeToast);

  if (onUndo) {
    const undoBtn = toast.querySelector('.toast-undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        onUndo();
        removeToast();
      });
    }
  }

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(removeToast, duration);
  }

  return { remove: removeToast };
}

