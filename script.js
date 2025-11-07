/* =============================================================================
   SIREN BEAUTY + WELLNESS - MAIN JAVASCRIPT
   Handles mobile navigation, form validation, cookie consent, and interactions
   ============================================================================= */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    
    /* =========================================================================
       MOBILE NAVIGATION TOGGLE
       ========================================================================= */
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        // Toggle mobile menu
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Update ARIA attribute for accessibility
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    /* =========================================================================
       SMOOTH SCROLLING FOR ANCHOR LINKS
       ========================================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for on-page anchors, not empty fragments
            if (href !== '#' && href.length > 1) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80; // Account for sticky header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    /* =========================================================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================= */
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            const consent = document.getElementById('consent').checked;
            
            // Validation
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage += 'Please enter your name.\n';
            }
            
            if (!email || !validateEmail(email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }
            
            if (!message) {
                isValid = false;
                errorMessage += 'Please enter a message.\n';
            }
            
            if (!consent) {
                isValid = false;
                errorMessage += 'Please consent to being contacted.\n';
            }
            
            if (!isValid) {
                alert(errorMessage);
                return;
            }
            
            // If validation passes, show success message
            // In production, this would send data to a server
            showFormMessage('success');
            contactForm.reset();
            
            // In a real implementation, you would send the data to your server:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    service: service,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                showFormMessage('success');
                contactForm.reset();
            })
            .catch(error => {
                showFormMessage('error');
            });
            */
        });
    }
    
    // Email validation helper function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Show form message helper function
    function showFormMessage(type) {
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');
        
        if (type === 'success' && successMessage) {
            successMessage.removeAttribute('hidden');
            errorMessage?.setAttribute('hidden', '');
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.setAttribute('hidden', '');
            }, 5000);
        } else if (type === 'error' && errorMessage) {
            errorMessage.removeAttribute('hidden');
            successMessage?.setAttribute('hidden', '');
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                errorMessage.setAttribute('hidden', '');
            }, 5000);
        }
    }
    
    /* =========================================================================
       COOKIE CONSENT BANNER
       ========================================================================= */
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');
    
    // Check if user has already made a choice
    if (cookieBanner) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            // Show banner if no choice has been made
            cookieBanner.removeAttribute('hidden');
        }
        
        // Handle accept button
        if (cookieAccept) {
            cookieAccept.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieBanner.setAttribute('hidden', '');
                
                // Here you would initialize analytics or other cookies
                // Example: initializeAnalytics();
            });
        }
        
        // Handle decline button
        if (cookieDecline) {
            cookieDecline.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'declined');
                cookieBanner.setAttribute('hidden', '');
                
                // Ensure no tracking cookies are set
            });
        }
    }
    
    /* =========================================================================
       HEADER SCROLL BEHAVIOR (Add shadow on scroll)
       ========================================================================= */
    const header = document.querySelector('.site-header');
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove shadow based on scroll position
            if (scrollTop > 0) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
    
    /* =========================================================================
       LAZY LOADING IMAGES (Intersection Observer)
       ========================================================================= */
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // If image has a data-src, use that; otherwise it's already set
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    /* =========================================================================
       FADE-IN ANIMATION ON SCROLL (Optional Enhancement)
       ========================================================================= */
    const fadeElements = document.querySelectorAll('.service-card, .feature-item, .value-card');
    
    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    // Trigger animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        });
        
        fadeElements.forEach(element => fadeObserver.observe(element));
    }
    
    /* =========================================================================
       FORM INPUT FOCUS EFFECTS
       ========================================================================= */
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        // Add focus class to parent form-group
        input.addEventListener('focus', function() {
            this.closest('.form-group')?.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.closest('.form-group')?.classList.remove('focused');
        });
        
        // Add has-value class for floating label effects (if implemented)
        input.addEventListener('input', function() {
            if (this.value) {
                this.closest('.form-group')?.classList.add('has-value');
            } else {
                this.closest('.form-group')?.classList.remove('has-value');
            }
        });
    });
    
    /* =========================================================================
       KEYBOARD NAVIGATION ENHANCEMENTS
       ========================================================================= */
    // Trap focus in mobile menu when open
    const focusableElements = navLinks?.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements && focusableElements.length > 0) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        document.addEventListener('keydown', function(e) {
            if (!navLinks?.classList.contains('active')) return;
            
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
            
            // Close menu on Escape key
            if (e.key === 'Escape') {
                mobileMenuToggle?.classList.remove('active');
                navLinks?.classList.remove('active');
                mobileMenuToggle?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                mobileMenuToggle?.focus();
            }
        });
    }
    
    /* =========================================================================
       UTILITY: Debounce function for performance optimization
       ========================================================================= */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /* =========================================================================
       WINDOW RESIZE HANDLER
       ========================================================================= */
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768) {
                mobileMenuToggle?.classList.remove('active');
                navLinks?.classList.remove('active');
                mobileMenuToggle?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }, 250);
    });
    
    /* =========================================================================
       CONSOLE LOG (Development Only - Remove in Production)
       ========================================================================= */
    console.log('Siren Beauty + Wellness website initialized successfully! 🌊✨');
    
});

/* =============================================================================
   ADDITIONAL UTILITY FUNCTIONS
   ============================================================================= */

/**
 * Check if an element is in viewport
 * @param {HTMLElement} elem - The element to check
 * @returns {boolean} - Whether the element is in viewport
 */
function isInViewport(elem) {
    const rect = elem.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 * @param {string} target - Selector for target element
 * @param {number} offset - Offset from top (default: 80)
 */
function smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/* =============================================================================
   SERVICE WORKER REGISTRATION (for PWA - optional future enhancement)
   ============================================================================= */
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
*/
