/**
 * NEURALFLOW AI - INTERACTIVE SCRIPTS
 * Premium AI Agency Website Functionality
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        scrollOffset: 80, // Height of sticky header
        animationDelay: 100, // Stagger delay for scroll animations
        heroParticleCount: window.matchMedia('(pointer: coarse)').matches ? 25 : 40,
        heroConnectionDistance: 150,
        heroParticleSpeed: 0.3,
        throttleTimeout: 16 // ~60fps
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const utils = {
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        debounce: function(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        isMobile: function() {
            return window.matchMedia('(pointer: coarse)').matches ||
                   window.matchMedia('(max-width: 768px)').matches;
        },

        prefersReducedMotion: function() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
    };

    // ============================================
    // HERO CANVAS ANIMATION - Neural Network Effect
    // ============================================
    const HeroAnimation = {
        canvas: null,
        ctx: null,
        particles: [],
        animationId: null,
        isActive: false,
        resizeObserver: null,

        init: function() {
            this.canvas = document.getElementById('heroCanvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) return;

            this.setupCanvas();
            this.createParticles();
            this.isActive = true;
            this.animate();

            // Handle resize with ResizeObserver for better performance
            if (window.ResizeObserver) {
                this.resizeObserver = new ResizeObserver(utils.throttle(() => {
                    this.handleResize();
                }, 100));
                this.resizeObserver.observe(this.canvas.parentElement);
            } else {
                window.addEventListener('resize', utils.throttle(() => {
                    this.handleResize();
                }, 100), { passive: true });
            }

            // Pause animation when tab is hidden
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pause();
                } else {
                    this.resume();
                }
            });

            // Pause when hero is not in viewport to save resources
            this.setupIntersectionObserver();
        },

        setupCanvas: function() {
            const parent = this.canvas.parentElement;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            this.canvas.width = parent.offsetWidth * dpr;
            this.canvas.height = parent.offsetHeight * dpr;
            this.canvas.style.width = parent.offsetWidth + 'px';
            this.canvas.style.height = parent.offsetHeight + 'px';

            this.ctx.scale(dpr, dpr);
            this.width = parent.offsetWidth;
            this.height = parent.offsetHeight;
        },

        createParticles: function() {
            this.particles = [];
            const count = CONFIG.heroParticleCount;

            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    vx: (Math.random() - 0.5) * CONFIG.heroParticleSpeed,
                    vy: (Math.random() - 0.5) * CONFIG.heroParticleSpeed,
                    radius: Math.random() * 2 + 2,
                    opacity: Math.random() * 0.5 + 0.3
                });
            }
        },

        handleResize: function() {
            this.setupCanvas();
            this.createParticles();
        },

        setupIntersectionObserver: function() {
            if (!('IntersectionObserver' in window)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0) {
                        this.resume();
                    } else {
                        this.pause();
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(this.canvas);
        },

        pause: function() {
            this.isActive = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        },

        resume: function() {
            if (!this.isActive && this.canvas) {
                this.isActive = true;
                this.animate();
            }
        },

        animate: function() {
            if (!this.isActive || !this.ctx) return;

            this.ctx.clearRect(0, 0, this.width, this.height);

            // Update and draw particles
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > this.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.height) p.vy *= -1;

                // Keep in bounds
                p.x = Math.max(0, Math.min(this.width, p.x));
                p.y = Math.max(0, Math.min(this.height, p.y));

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
                this.ctx.fill();
            }

            // Draw connections
            this.drawConnections();

            this.animationId = requestAnimationFrame(() => this.animate());
        },

        drawConnections: function() {
            const maxDistance = CONFIG.heroConnectionDistance;
            const maxConnections = 3;

            for (let i = 0; i < this.particles.length; i++) {
                let connections = 0;

                for (let j = i + 1; j < this.particles.length; j++) {
                    if (connections >= maxConnections) break;

                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        connections++;
                        const opacity = (1 - distance / maxDistance) * 0.3;

                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        this.ctx.lineWidth = 0.8;
                        this.ctx.stroke();
                    }
                }
            }
        },

        destroy: function() {
            this.pause();
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
        }
    };

    // ============================================
    // SCROLL REVEAL ANIMATION
    // ============================================
    const ScrollReveal = {
        elements: [],
        observer: null,

        init: function() {
            if (utils.prefersReducedMotion()) {
                // Show all elements immediately if reduced motion is preferred
                document.querySelectorAll('.scroll-reveal').forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                return;
            }

            this.elements = document.querySelectorAll('.scroll-reveal');
            if (this.elements.length === 0) return;

            this.setupObserver();
        },

        setupObserver: function() {
            if (!('IntersectionObserver' in window)) {
                // Fallback: show all elements
                this.elements.forEach(el => el.classList.add('scroll-reveal--visible'));
                return;
            }

            const options = {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add stagger delay based on element's position among siblings
                        const siblings = Array.from(this.elements);
                        const index = siblings.indexOf(entry.target);
                        const delay = Math.min(index * 100, 500);

                        setTimeout(() => {
                            entry.target.classList.add('scroll-reveal--visible');
                        }, delay);

                        // Stop observing once revealed
                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);

            this.elements.forEach(el => this.observer.observe(el));
        }
    };

    // ============================================
    // SMOOTH SCROLL NAVIGATION
    // ============================================
    const SmoothScroll = {
        init: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleClick(e));
            });
        },

        handleClick: function(e) {
            const href = e.currentTarget.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerOffset = CONFIG.scrollOffset;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            if (navLinks && navLinks.classList.contains('nav-links--open')) {
                navLinks.classList.remove('nav-links--open');
                const toggle = document.getElementById('navToggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }

            // Update URL without jumping
            history.pushState(null, null, href);
        }
    };

    // ============================================
    // STICKY HEADER
    // ============================================
    const StickyHeader = {
        header: null,
        lastScrollY: 0,
        ticking: false,

        init: function() {
            this.header = document.getElementById('header');
            if (!this.header) return;

            window.addEventListener('scroll', utils.throttle(() => {
                this.handleScroll();
            }, 16), { passive: true });

            this.handleScroll();
        },

        handleScroll: function() {
            const scrollY = window.pageYOffset;

            // Add/remove scrolled class
            if (scrollY > 50) {
                this.header.classList.add('header--scrolled');
            } else {
                this.header.classList.remove('header--scrolled');
            }

            // Update active nav link
            this.updateActiveNavLink(scrollY);

            this.lastScrollY = scrollY;
        },

        updateActiveNavLink: function(scrollY) {
            const sections = ['hero', 'services', 'about', 'cases', 'process', 'testimonials', 'contact'];
            const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

            let currentSection = '';
            const offset = CONFIG.scrollOffset + 100;

            for (const sectionId of sections) {
                const section = document.getElementById(sectionId);
                if (!section) continue;

                const sectionTop = section.offsetTop - offset;
                const sectionBottom = sectionTop + section.offsetHeight;

                if (scrollY >= sectionTop && scrollY < sectionBottom) {
                    currentSection = sectionId;
                    break;
                }
            }

            navLinks.forEach(link => {
                link.classList.remove('nav-link--active');
                const href = link.getAttribute('href');
                if (href === '#' + currentSection) {
                    link.classList.add('nav-link--active');
                }
            });
        }
    };

    // ============================================
    // MOBILE MENU
    // ============================================
    const MobileMenu = {
        toggle: null,
        navLinks: null,

        init: function() {
            this.toggle = document.getElementById('navToggle');
            this.navLinks = document.getElementById('navLinks');

            if (!this.toggle || !this.navLinks) return;

            this.toggle.addEventListener('click', () => this.handleToggle());

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.navLinks.classList.contains('nav-links--open')) {
                    this.close();
                }
            });

            // Close on clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navLinks.contains(e.target) && !this.toggle.contains(e.target)) {
                    this.close();
                }
            });
        },

        handleToggle: function() {
            const isOpen = this.navLinks.classList.toggle('nav-links--open');
            this.toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        },

        close: function() {
            this.navLinks.classList.remove('nav-links--open');
            this.toggle.setAttribute('aria-expanded', 'false');
        }
    };

    // ============================================
    // CONTACT FORM
    // ============================================
    const ContactForm = {
        form: null,
        isSubmitting: false,

        init: function() {
            this.form = document.getElementById('contactForm');
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Real-time validation
            this.form.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearError(field));
            });
        },

        validateField: function(field) {
            const value = field.value.trim();
            let error = '';

            if (!value) {
                error = 'Toto pole je povinné';
            } else if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    error = 'Zadajte platný email';
                }
            }

            if (error) {
                this.showError(field, error);
                return false;
            }

            return true;
        },

        showError: function(field, message) {
            field.classList.add('form-input--error');
            const errorEl = document.getElementById(field.id + 'Error');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('form-error--visible');
            }
        },

        clearError: function(field) {
            field.classList.remove('form-input--error');
            const errorEl = document.getElementById(field.id + 'Error');
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.classList.remove('form-error--visible');
            }
        },

        handleSubmit: function(e) {
            e.preventDefault();

            if (this.isSubmitting) return;

            // Validate all fields
            const fields = this.form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            // Simulate form submission
            this.isSubmitting = true;
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;
                this.isSubmitting = false;

                // Show success message
                const successEl = document.getElementById('formSuccess');
                if (successEl) {
                    successEl.classList.add('form-success--visible');
                }

                // Reset form
                this.form.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    if (successEl) {
                        successEl.classList.remove('form-success--visible');
                    }
                }, 5000);

            }, 1500);
        }
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        // Initialize all modules
        HeroAnimation.init();
        ScrollReveal.init();
        SmoothScroll.init();
        StickyHeader.init();
        MobileMenu.init();
        ContactForm.init();

        // Log ready state
        console.log('NeuralFlow AI website loaded successfully');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
