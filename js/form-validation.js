// Form Validation and Handling

class FormValidator {
    constructor() {
        this.forms = new Map();
        this.init();
    }

    init() {
        // Initialize form validation for all forms
        this.initializeContactForm();
        this.setupGlobalFormHandling();
    }

    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        this.forms.set('contactForm', {
            element: contactForm,
            fields: {
                name: {
                    element: document.getElementById('name'),
                    errorElement: document.getElementById('name-error'),
                    validators: [this.validateRequired, this.validateMinLength.bind(this, 2)]
                },
                email: {
                    element: document.getElementById('email'),
                    errorElement: document.getElementById('email-error'),
                    validators: [this.validateRequired, this.validateEmail]
                },
                message: {
                    element: document.getElementById('message'),
                    errorElement: document.getElementById('message-error'),
                    validators: [this.validateRequired, this.validateMinLength.bind(this, 10)]
                }
            }
        });

        // Set up real-time validation
        Object.values(this.forms.get('contactForm').fields).forEach(field => {
            if (field.element) {
                field.element.addEventListener('blur', () => this.validateField(field));
                field.element.addEventListener('input', () => this.clearFieldError(field));
            }
        });

        // Handle form submission
        contactForm.addEventListener('submit', (e) => this.handleContactFormSubmit(e));
    }

    validateField(field) {
        const errors = [];

        field.validators.forEach(validator => {
            const error = validator(field.element.value, field.element);
            if (error) errors.push(error);
        });

        if (errors.length > 0) {
            this.showFieldError(field, errors[0]);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    validateRequired(value) {
        return value.trim() === '' ? 'This field is required' : null;
    }

    validateMinLength(minLength, value) {
        return value.trim().length < minLength ? `Must be at least ${minLength} characters` : null;
    }

    validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value.trim()) ? 'Please enter a valid email address' : null;
    }

    showFieldError(field, message) {
        if (field.element) {
            field.element.classList.add('error');
            field.element.setAttribute('aria-invalid', 'true');
        }
        if (field.errorElement) {
            field.errorElement.textContent = message;
            field.errorElement.style.display = 'block';
        }
    }

    clearFieldError(field) {
        if (field.element) {
            field.element.classList.remove('error');
            field.element.setAttribute('aria-invalid', 'false');
        }
        if (field.errorElement) {
            field.errorElement.textContent = '';
            field.errorElement.style.display = 'none';
        }
    }

    async handleContactFormSubmit(e) {
        e.preventDefault();

        const formData = this.forms.get('contactForm');
        if (!formData) return;

        // Validate all fields
        let isValid = true;
        Object.values(formData.fields).forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showFormStatus('Please correct the errors above', 'error');
            return;
        }

        // Show loading state
        this.setFormLoading(true);

        try {
            // Simulate form submission (replace with actual API call)
            await this.submitForm(new FormData(e.target));

            // Check for secret trigger in message
            const message = new FormData(e.target).get('message');
            if (message && message.toLowerCase().includes('love')) {
                // Trigger transition
                if (window.transitionManager) {
                    window.transitionManager.startTransition();
                }
            } else {
                this.showSuccessMessage();
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormStatus('Failed to send message. Please try again.', 'error');
        } finally {
            this.setFormLoading(false);
        }
    }

    async submitForm(formData) {
        // Simulate API call - replace with actual implementation
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1000);
        });
    }

    setFormLoading(loading) {
        const form = document.getElementById('contactForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        if (loading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-disabled', 'true');
            if (btnText) btnText.textContent = 'Sending...';
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.setAttribute('aria-disabled', 'false');
            if (btnText) btnText.textContent = 'Send Message';
        }
    }

    showFormStatus(message, type) {
        const statusElement = document.getElementById('form-status');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.className = `form-status ${type}`;
        statusElement.style.display = 'block';

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }

    showSuccessMessage() {
        const form = document.getElementById('contactForm');
        const originalContent = form.innerHTML;

        form.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">💌</div>
                <h3>Thank you for your message!</h3>
                <p style="margin-bottom: 2rem; color: #666;">We'll get back to you soon.</p>
                <button type="button" class="btn btn-primary" onclick="location.reload()" style="margin-right: 1rem;">Send Another</button>
                <button type="button" class="btn btn-secondary" onclick="document.querySelector('.contact-form').scrollIntoView({behavior: 'smooth'})">Back to Form</button>
            </div>
        `;

        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'Message sent successfully';
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    setupGlobalFormHandling() {
        // Prevent form submission on enter for single-line inputs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
                e.preventDefault();
            }
        });
    }
}

// Initialize form validator
const formValidator = new FormValidator();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
