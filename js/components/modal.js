/**
 * Modal Component
 * Reusable modal system with accessibility support
 */

class Modal {
  constructor(id) {
    this.modal = document.getElementById(id);
    this.overlay = this.modal?.querySelector('.modal-overlay');
    this.closeBtn = this.modal?.querySelector('.modal-close');
    this.content = this.modal?.querySelector('.modal-content');
    this.isOpen = false;
    
    this.previousActiveElement = null;
    this.focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    this.init();
  }
  
  init() {
    if (!this.modal) return;
    
    this.setupEventListeners();
    this.setupAccessibility();
  }
  
  setupEventListeners() {
    // Close button
    this.closeBtn?.addEventListener('click', () => this.close());
    
    // Overlay click
    this.overlay?.addEventListener('click', () => this.close());
    
    // Keyboard escape
    this.handleKeydown = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      if (e.key === 'Tab' && this.isOpen) {
        this.trapFocus(e);
      }
    };
  }
  
  setupAccessibility() {
    // Set initial ARIA attributes
    if (this.modal) {
      this.modal.setAttribute('role', 'dialog');
      this.modal.setAttribute('aria-modal', 'true');
      
      // Find or create title
      let titleId = this.modal.getAttribute('aria-labelledby');
      if (!titleId) {
        const title = this.modal.querySelector('h2, h3, .modal-title');
        if (title) {
          titleId = `modal-title-${Date.now()}`;
          title.id = titleId;
          this.modal.setAttribute('aria-labelledby', titleId);
        }
      }
    }
  }
  
  open(contentHTML = null) {
    if (!this.modal || this.isOpen) return;
    
    // Store previously focused element
    this.previousActiveElement = document.activeElement;
    
    // Update content if provided
    if (contentHTML && this.content) {
      this.content.innerHTML = contentHTML;
    }
    
    // Show modal
    this.modal.classList.remove('hidden');
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add keyboard listener
    document.addEventListener('keydown', this.handleKeydown);
    
    // Focus first focusable element or close button
    setTimeout(() => {
      const focusable = this.modal.querySelector(this.focusableSelectors);
      if (focusable) {
        focusable.focus();
      } else {
        this.closeBtn?.focus();
      }
    }, 100);
    
    // Dispatch open event
    this.modal.dispatchEvent(new CustomEvent('modal:open'));
  }
  
  close() {
    if (!this.modal || !this.isOpen) return;
    
    // Hide modal
    this.modal.classList.add('hidden');
    this.modal.setAttribute('aria-hidden', 'true');
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Remove keyboard listener
    document.removeEventListener('keydown', this.handleKeydown);
    
    // Restore focus
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
    
    // Dispatch close event
    this.modal.dispatchEvent(new CustomEvent('modal:close'));
  }
  
  trapFocus(e) {
    const focusableElements = this.modal.querySelectorAll(this.focusableSelectors);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      // Tab backwards
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab forwards
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  // Static method to create and open a modal
  static create(contentHTML, options = {}) {
    const modalId = options.id || `modal-${Date.now()}`;
    
    // Create modal HTML
    const modalHTML = `
      <div id="${modalId}" class="modal hidden" role="dialog" aria-modal="true">
        <div class="modal-overlay"></div>
        <div class="modal-content card">
          <button class="modal-close" aria-label="Close modal">&times;</button>
          <div class="modal-body">
            ${contentHTML}
          </div>
        </div>
      </div>
    `;
    
    // Append to body if not exists
    if (!document.getElementById(modalId)) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }
    
    // Create instance and open
    const modal = new Modal(modalId);
    modal.open();
    
    return modal;
  }
  
  // Destroy modal
  destroy() {
    this.close();
    this.modal?.remove();
  }
}

// Auto-initialize modals with data attributes
document.addEventListener('DOMContentLoaded', () => {
  // Find all modals and initialize them
  document.querySelectorAll('[data-modal]').forEach(modalEl => {
    const modalId = modalEl.id;
    const instance = new Modal(modalId);
    
    // Store instance on element
    modalEl._modalInstance = instance;
  });
  
  // Find all modal triggers
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.dataset.modalTrigger;
      const modalEl = document.getElementById(modalId);
      
      if (modalEl?._modalInstance) {
        modalEl._modalInstance.open();
      } else {
        const modal = new Modal(modalId);
        modal.open();
      }
    });
  });
});

// Export
window.Modal = Modal;

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Modal;
}
