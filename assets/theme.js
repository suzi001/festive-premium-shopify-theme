/**
 * Festive Premium — Theme JavaScript
 * Handles: countdown timer, testimonial carousel, mobile menu, search drawer, scroll animations
 */
(function () {
  'use strict';

  // ==================== DOM READY ====================
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSearchDrawer();
    initCountdown();
    initTestimonialsCarousel();
    initScrollAnimations();
  });

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    var toggle = document.getElementById('mobileMenuToggle');
    var drawer = document.getElementById('mobileNavDrawer');
    var close = document.getElementById('mobileNavClose');
    var overlay = document.getElementById('mobileNavOverlay');

    if (!toggle || !drawer) return;

    function openMenu() {
      drawer.classList.add('mobile-nav-drawer--open');
      if (overlay) overlay.classList.add('mobile-nav-overlay--visible');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.remove('mobile-nav-drawer--open');
      if (overlay) overlay.classList.remove('mobile-nav-overlay--visible');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openMenu);
    if (close) close.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('mobile-nav-drawer--open')) {
        closeMenu();
      }
    });
  }

  // ==================== SEARCH DRAWER ====================
  function initSearchDrawer() {
    var toggle = document.getElementById('searchToggle');
    var drawer = document.getElementById('searchDrawer');
    var close = document.getElementById('searchClose');

    if (!toggle || !drawer) return;

    function openSearch() {
      drawer.classList.add('search-drawer--open');
      var input = drawer.querySelector('.search-input');
      if (input) setTimeout(function () { input.focus(); }, 300);
    }

    function closeSearch() {
      drawer.classList.remove('search-drawer--open');
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (drawer.classList.contains('search-drawer--open')) {
        closeSearch();
      } else {
        openSearch();
      }
    });

    if (close) close.addEventListener('click', closeSearch);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('search-drawer--open')) {
        closeSearch();
      }
    });
  }

  // ==================== COUNTDOWN TIMER ====================
  function initCountdown() {
    var section = document.querySelector('.holiday-countdown');
    if (!section) return;

    var targetDateStr = section.getAttribute('data-target-date');
    if (!targetDateStr) return;

    var targetDate = new Date(targetDateStr + 'T00:00:00');
    if (isNaN(targetDate.getTime())) return;

    var daysEl = document.getElementById('countdownDays');
    var hoursEl = document.getElementById('countdownHours');
    var minutesEl = document.getElementById('countdownMinutes');
    var secondsEl = document.getElementById('countdownSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function pad(num) {
      return String(num).padStart(2, '0');
    }

    function updateCountdown() {
      var now = new Date().getTime();
      var distance = targetDate.getTime() - now;

      if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minutesEl.textContent = pad(minutes);
      secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ==================== TESTIMONIALS CAROUSEL ====================
  function initTestimonialsCarousel() {
    var carousel = document.getElementById('testimonialsCarousel');
    if (!carousel) return;

    var slides = carousel.querySelectorAll('.testimonial-slide');
    var dots = document.querySelectorAll('.testimonials-dot');
    if (!slides.length) return;

    var currentIndex = 0;
    var autoplaySpeed = 5; // default seconds

    // Read autoplay speed from section data attribute
    var section = carousel.closest('.testimonials');
    if (section) {
      var speed = parseInt(section.getAttribute('data-autoplay-speed'), 10);
      if (speed > 0) autoplaySpeed = speed;
    }

    function goToSlide(index) {
      slides.forEach(function (s) { s.classList.remove('testimonial-slide--active'); });
      dots.forEach(function (d) { d.classList.remove('testimonials-dot--active'); });

      slides[index].classList.add('testimonial-slide--active');
      if (dots[index]) dots[index].classList.add('testimonials-dot--active');
      currentIndex = index;
    }

    function nextSlide() {
      var next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    // Dot click handlers
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var slideIndex = parseInt(this.getAttribute('data-slide'), 10);
        goToSlide(slideIndex);
      });
    });

    // Autoplay
    var autoplayInterval = setInterval(nextSlide, autoplaySpeed * 1000);

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', function () {
      clearInterval(autoplayInterval);
    });
    carousel.addEventListener('mouseleave', function () {
      autoplayInterval = setInterval(nextSlide, autoplaySpeed * 1000);
    });
  }

  // ==================== SCROLL ANIMATIONS ====================
  function initScrollAnimations() {
    // Simple fade-in on scroll for elements with .animate-on-scroll class
    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe section headings
    document.querySelectorAll('.section-heading').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(function (el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.5s ease ' + (index * 0.08) + 's, transform 0.5s ease ' + (index * 0.08) + 's';
      observer.observe(el);
    });
  }

})();
