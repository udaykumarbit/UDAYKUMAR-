// script.fixed.js — fully fixed and hardening version of your original script.js
// Replace your existing script.js with this file (or copy its content into script.js).

// Helper: safe query
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// DOM Elements (lazy-get when needed to avoid nulls on early script execution)
function getEl(id) { return document.getElementById(id); }

// Debounce utility (works correctly)
function debounce(fn, wait = 100) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Safe download helper
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initPage();
  attachListeners();
  setupObservers();
  setupImageFallback();
});

function initPage() {
  const loadingScreen = getEl('loading-screen');
  if (loadingScreen) {
    // Keep for minimum UX, hide after a short delay
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 700);
  } else {
    document.body.classList.add('loaded');
  }

  // Initial navbar state
  updateNavbarBackground();
  updateActiveNavLink();

  // Friendly console message
  console.log('%cPortfolio loaded — hello!', 'color:#a855f7;font-weight:700');
}

function attachListeners() {
  const navToggle = getEl('nav-toggle');
  const navMenu = getEl('nav-menu');
  const scrollTopBtn = getEl('scroll-top');
  const contactForm = getEl('contact-form');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu when clicking a nav link
  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    const menu = getEl('nav-menu');
    const toggle = getEl('nav-toggle');
    if (menu) menu.classList.remove('active');
    if (toggle) toggle.classList.remove('active');
    document.body.style.overflow = '';
  }));

  // Scroll handlers (debounced)
  window.addEventListener('scroll', debounce(handleScroll, 20));
  window.addEventListener('resize', debounce(() => {
    // ensure mobile menu is closed on large screens
    const menu = getEl('nav-menu');
    if (window.innerWidth > 768 && menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      const toggle = getEl('nav-toggle');
      if (toggle) toggle.classList.remove('active');
      document.body.style.overflow = '';
    }
    updateActiveNavLink();
  }, 200));

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Contact form handling
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);

    // real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(i => {
      i.addEventListener('blur', () => validateField(i));
      i.addEventListener('input', () => clearFieldError(i));
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menu = getEl('nav-menu');
      const toggle = getEl('nav-toggle');
      if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
        if (toggle) toggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    // Enter on focused nav button should click it
    if (e.key === 'Enter' && document.activeElement && document.activeElement.classList.contains('nav-link')) {
      document.activeElement.click();
    }
  });
}

function handleScroll() {
  updateScrollTopButton();
  updateNavbarBackground();
  updateActiveNavLink();
}

function updateScrollTopButton() {
  const btn = getEl('scroll-top');
  if (!btn) return;
  if (window.pageYOffset > 500) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

function updateNavbarBackground() {
  const navbar = getEl('navbar');
  if (!navbar) return;
  navbar.style.background = window.scrollY > 50 ? 'rgba(15,23,42,0.98)' : 'rgba(15,23,42,0.95)';
}

function updateActiveNavLink() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  if (sections.length === 0 || navLinks.length === 0) return;

  let current = sections[0].id || '';
  const scrollPos = window.pageYOffset + 90; // offset to account for navbar
  for (const sec of sections) {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      current = sec.id;
      break;
    }
  }

  navLinks.forEach(link => {
    link.classList.remove('active');
    const target = (link.getAttribute('onclick') || '').match(/scrollToSection\('([^']+)'\)/);
    // if link text matches id or onclick target
    if ((target && target[1] === current) || link.textContent.trim().toLowerCase() === current) {
      link.classList.add('active');
    }
  });
}

// Smooth scroll exposed for HTML
window.scrollToSection = function (sectionId) {
  const el = getEl(sectionId);
  if (!el) return;
  const offset = el.offsetTop - 70; // navbar height
  window.scrollTo({ top: offset, behavior: 'smooth' });
  // close mobile menu
  const menu = getEl('nav-menu');
  const toggle = getEl('nav-toggle');
  if (menu) menu.classList.remove('active');
  if (toggle) toggle.classList.remove('active');
  document.body.style.overflow = '';
};

// Resume download — tries to fetch the PDF, falls back to a generated text resume (works in static hosts)
window.downloadResume = async function () {
  const pdfPath = 'UDAYKUMAR-1.pdf'; // change if your PDF has a different name
  try {
    // try to fetch the PDF
    const res = await fetch(pdfPath, { method: 'GET' });
    if (res.ok) {
      const blob = await res.blob();
      downloadBlob(blob, 'UDAYKUMAR.pdf');
      showNotification('Resume download started!', 'success');
      return;
    }
    // else fallback
    throw new Error('PDF not found on server');
  } catch (err) {
    console.warn('PDF fetch failed, falling back to text resume:', err.message);
    // Fallback text resume (brief summary) — you can replace the content below with your full resume string or to fetch another path
    const resumeContent = `Name: Udaykumar Borale\nPhone: +91-8660272709\nEmail: udaykumarborale9@gmail.com\nLinkedIn: https://www.linkedin.com/in/udaykumarborale\nLocation: Bangalore-560050\n\nSummary:\nExperienced Mechanical Design and Simulation Engineer...`;
    const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, 'UDAYKUMAR_resume.txt');
    showNotification('Downloaded text resume fallback.', 'info');
  }
};

// Open LinkedIn
window.openLinkedIn = function () {
  try {
    window.open('https://www.linkedin.com/in/udaykumarborale', '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error('Failed to open LinkedIn', err);
    showNotification('Could not open LinkedIn.', 'error');
  }
};

// Contact form handling and validation
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validateForm(form)) {
    showNotification('Please fix the errors in the form.', 'error');
    return;
  }

  try {
    const fd = new FormData(form);
    const firstName = (fd.get('firstName') || '').toString().trim();
    const lastName = (fd.get('lastName') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const subject = (fd.get('subject') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    const mailto = `mailto:udaykumarborale9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    // open email client
    window.location.href = mailto;
    showNotification('Email client opened — please send your message.', 'success');
    form.reset();
    clearAllFieldErrors(form);
  } catch (err) {
    console.error(err);
    showNotification('Error submitting form.', 'error');
  }
}

function validateForm(form) {
  const fields = Array.from(form.querySelectorAll('input[required], textarea[required]'));
  let ok = true;
  fields.forEach(f => { if (!validateField(f)) ok = false; });
  return ok;
}

function validateField(field) {
  if (!field) return true;
  const name = field.name;
  const value = (field.value || '').trim();
  let msg = '';

  if (field.required && !value) msg = `${getFieldLabel(name)} is required.`;
  if (!msg && name === 'email' && value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) msg = 'Please enter a valid email address.';
  }
  if (!msg && (name === 'firstName' || name === 'lastName') && value.length > 0 && value.length < 2) {
    msg = `${getFieldLabel(name)} must be at least 2 characters long.`;
  }
  if (!msg && name === 'subject' && value.length > 0 && value.length < 5) {
    msg = 'Subject must be at least 5 characters long.';
  }
  if (!msg && name === 'message' && value.length > 0 && value.length < 10) {
    msg = 'Message must be at least 10 characters long.';
  }

  if (msg) {
    showFieldError(field, msg);
    return false;
  }
  clearFieldError(field);
  return true;
}

function getFieldLabel(n) {
  const labels = { firstName: 'First Name', lastName: 'Last Name', email: 'Email', subject: 'Subject', message: 'Message' };
  return labels[n] || n;
}

function showFieldError(field, message) {
  try {
    const id = `${field.name}-error`;
    const el = document.getElementById(id);
    if (el) { el.textContent = message; el.style.display = 'block'; }
    field.style.borderColor = '#ef4444';
  } catch (e) { /* ignore */ }
}

function clearFieldError(field) {
  try {
    const id = `${field.name}-error`;
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.style.display = 'none'; }
    field.style.borderColor = '';
  } catch (e) { /* ignore */ }
}

function clearAllFieldErrors(form) {
  if (!form) return;
  form.querySelectorAll('.error-message').forEach(e => { e.textContent = ''; e.style.display = 'none'; });
  form.querySelectorAll('input, textarea').forEach(i => i.style.borderColor = '');
}

// Image fallback
function setupImageFallback() {
  const img = getEl('profile-image');
  const fallback = getEl('profile-fallback');
  if (!img || !fallback) return;

  img.addEventListener('load', () => fallback.classList.add('hidden'));
  img.addEventListener('error', () => fallback.classList.remove('hidden'));
  // if already loaded
  if (img.complete) {
    if (img.naturalWidth && img.naturalWidth > 0) fallback.classList.add('hidden');
    else fallback.classList.remove('hidden');
  }
}

// Intersection observer for .fade-in and similar classes
function setupObservers() {
  const items = Array.from(document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right'));
  if (items.length === 0) return;

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach((el, i) => {
    // small stagger
    el.style.transitionDelay = `${i * 80}ms`;
    obs.observe(el);
  });
}

// Notifications (simple)
function showNotification(message, type = 'info') {
  try {
    // remove existing
    document.querySelectorAll('.notification').forEach(n => n.remove());
    const div = document.createElement('div');
    div.className = `notification notification-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    div.innerHTML = `<div class="notification-content"><i class="fas ${icon}" aria-hidden="true"></i><span>${message}</span><button class="notification-close" aria-label="Close">✕</button></div>`;
    // inline styles to avoid requiring CSS updates
    div.style.cssText = `position:fixed;top:90px;right:20px;padding:12px 16px;border-radius:8px;color:white;z-index:10000;box-shadow:0 10px 30px rgba(0,0,0,0.2);max-width:360px;`;
    div.style.background = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    document.body.appendChild(div);
    // close button
    const closeBtn = div.querySelector('.notification-close');
    if (closeBtn) closeBtn.addEventListener('click', () => div.remove());
    // auto remove
    setTimeout(() => { if (div.parentNode) div.remove(); }, 4500);
  } catch (e) { console.warn('Notification failed', e); }
}

// Performance logging (optional)
(function logPerf() {
  if (!('performance' in window)) return;
  window.addEventListener('load', () => {
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) console.log('Page load time:', Math.round(nav.loadEventEnd - nav.loadEventStart), 'ms');
    } catch (e) { /* ignore */ }
  });
})();

// Expose for debugging
window.__portfolioHelpers = { debounce };
