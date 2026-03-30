(function () {
  'use strict';

  // Mark JS as loaded for CSS animation fallback
  document.documentElement.classList.add('js-loaded');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ============================================
  // 1. SCROLL PROGRESS BAR + HEADER
  // ============================================
  var progressBar = document.getElementById('scrollProgress');
  var header = document.getElementById('header');
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollTop = document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0 && progressBar) {
          progressBar.style.width = (scrollTop / scrollHeight) * 100 + '%';
        }
        if (header) {
          header.classList.toggle('scrolled', scrollTop > 60);
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ============================================
  // 2. ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-desktop a:not(.btn)');

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

  // ============================================
  // 3. MOBILE NAVIGATION
  // ============================================
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  function getFocusableElements() {
    if (!mobileNav) return [];
    return Array.from(mobileNav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'));
  }

  function openMobileNav() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    var focusable = getFocusableElements();
    if (focusable.length) focusable[0].focus();
  }

  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) closeMobileNav();
    });

    // Focus trap + Escape
    document.addEventListener('keydown', function (e) {
      if (!mobileNav.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeMobileNav();
        hamburger.focus();
        return;
      }

      if (e.key === 'Tab') {
        var focusable = getFocusableElements();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  // ============================================
  // 4. SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  });

  // ============================================
  // 5. SCROLL-TRIGGERED ANIMATIONS
  // ============================================
  var animatedElements = document.querySelectorAll('.animate-on-scroll');

  function applyReducedMotion() {
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  if (prefersReducedMotion.matches) {
    applyReducedMotion();
  } else {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          animObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    animatedElements.forEach(function (el) {
      animObserver.observe(el);
    });
  }

  // Listen for reduced-motion changes at runtime
  prefersReducedMotion.addEventListener('change', function () {
    if (prefersReducedMotion.matches) {
      applyReducedMotion();
      stopAutoPlay();
    }
  });

  // ============================================
  // 6. COUNTER ANIMATION
  // ============================================
  var counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';

    if (prefersReducedMotion.matches) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  // ============================================
  // 7. TESTIMONIAL CAROUSEL
  // ============================================
  var track = document.getElementById('testimonialsTrack');
  var slides = track ? track.querySelectorAll('.testimonial-slide') : [];
  var dots = document.querySelectorAll('.testimonial-dot');
  var prevBtn = document.querySelector('.testimonial-prev');
  var nextBtn = document.querySelector('.testimonial-next');
  var currentSlide = 0;
  var slideCount = slides.length;
  var autoPlayInterval = null;

  function goToSlide(index) {
    if (slideCount === 0) return;
    if (index < 0) index = slideCount - 1;
    if (index >= slideCount) index = 0;
    currentSlide = index;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
  }

  function startAutoPlay() {
    if (prefersReducedMotion.matches || slideCount === 0) return;
    stopAutoPlay();
    autoPlayInterval = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
      stopAutoPlay();
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
      stopAutoPlay();
      startAutoPlay();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goToSlide(i);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  var carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    carousel.addEventListener('focusin', stopAutoPlay);
    carousel.addEventListener('focusout', startAutoPlay);

    // Touch/swipe support
    var touchStartX = 0;

    carousel.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      var delta = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(delta) > 50) {
        goToSlide(currentSlide + (delta > 0 ? 1 : -1));
        stopAutoPlay();
        startAutoPlay();
      }
    }, { passive: true });

    // Keyboard support
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
        stopAutoPlay();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
        stopAutoPlay();
        startAutoPlay();
      }
    });
  }

  startAutoPlay();

  // ============================================
  // 8. CONTACT FORM VALIDATION
  // ============================================
  var form = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var formStatus = document.getElementById('formStatus');
  var isSubmitting = false;
  var hasSubmitted = false;

  var fields = {
    name: {
      el: document.getElementById('name'),
      validate: function (val) {
        if (!val.trim()) return 'Prosím, zadajte vaše meno.';
        if (val.trim().length < 2) return 'Meno musí mať aspoň 2 znaky.';
        return '';
      }
    },
    email: {
      el: document.getElementById('email'),
      validate: function (val) {
        if (!val.trim()) return 'Prosím, zadajte e-mailovú adresu.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Prosím, zadajte platnú e-mailovú adresu.';
        return '';
      }
    },
    message: {
      el: document.getElementById('message'),
      validate: function (val) {
        if (!val.trim()) return 'Prosím, napíšte vašu správu.';
        if (val.trim().length < 10) return 'Správa musí mať aspoň 10 znakov.';
        return '';
      }
    }
  };

  function validateField(key) {
    var field = fields[key];
    if (!field || !field.el) return true;
    var error = field.validate(field.el.value);
    var errorEl = field.el.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = error;
    field.el.classList.toggle('input-error', !!error);
    field.el.classList.toggle('input-valid', !error && field.el.value.trim().length > 0);
    return !error;
  }

  function validateAll() {
    var valid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key)) valid = false;
    });
    return valid;
  }

  if (form && submitBtn) {
    // Blur validation after first submit attempt
    Object.keys(fields).forEach(function (key) {
      if (!fields[key].el) return;
      fields[key].el.addEventListener('blur', function () {
        if (hasSubmitted) validateField(key);
      });
      fields[key].el.addEventListener('input', function () {
        if (hasSubmitted) validateField(key);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;
      hasSubmitted = true;

      if (!validateAll()) return;

      isSubmitting = true;
      submitBtn.setAttribute('data-state', 'loading');
      submitBtn.disabled = true;
      if (formStatus) formStatus.textContent = '';

      setTimeout(function () {
        submitBtn.setAttribute('data-state', 'success');
        if (formStatus) formStatus.textContent = 'Správa bola úspešne odoslaná!';

        setTimeout(function () {
          submitBtn.removeAttribute('data-state');
          submitBtn.disabled = false;
          isSubmitting = false;
          form.reset();
          hasSubmitted = false;
          if (formStatus) formStatus.textContent = '';
          Object.keys(fields).forEach(function (key) {
            if (!fields[key].el) return;
            fields[key].el.classList.remove('input-valid', 'input-error');
            var errEl = fields[key].el.parentElement.querySelector('.form-error');
            if (errEl) errEl.textContent = '';
          });
        }, 3000);
      }, 1500);
    });
  }

})();
