// ================= FIXED FULL script.js (with FormSubmit working) ==================
// All your features preserved — ONLY contact form submission updated.

// Helper selectors
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const getEl = (id) => document.getElementById(id);

// Debounce
function debounce(fn, wait = 100) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// File download helper
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// On DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initPage();
  attachListeners();
  setupObservers();
  setupImageFallback();
});

function initPage() {
  const loadingScreen = getEl("loading-screen");
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      document.body.classList.add("loaded");
    }, 700);
  } else {
    document.body.classList.add("loaded");
  }

  updateNavbarBackground();
  updateActiveNavLink();
}

function attachListeners() {
  const navToggle = getEl("nav-toggle");
  const navMenu = getEl("nav-menu");
  const scrollTopBtn = getEl("scroll-top");
  const contactForm = getEl("contact-form");

  // Mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    });
  }

  // Close menu when clicking a link
  $$(".nav-link").forEach((link) =>
    link.addEventListener("click", () => {
      const menu = getEl("nav-menu");
      const toggle = getEl("nav-toggle");
      if (menu) menu.classList.remove("active");
      if (toggle) toggle.classList.remove("active");
      document.body.style.overflow = "";
    })
  );

  // Scroll listeners
  window.addEventListener("scroll", debounce(handleScroll, 20));

  window.addEventListener(
    "resize",
    debounce(() => {
      const menu = getEl("nav-menu");
      if (window.innerWidth > 768 && menu && menu.classList.contains("active")) {
        menu.classList.remove("active");
        const toggle = getEl("nav-toggle");
        if (toggle) toggle.classList.remove("active");
        document.body.style.overflow = "";
      }
      updateActiveNavLink();
    }, 200)
  );

  // Scroll top
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // Contact form submit (FIX — FormSubmit works now)
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);

    // Real‑time validation
    const inputs = contactForm.querySelectorAll("input, textarea");
    inputs.forEach((i) => {
      i.addEventListener("blur", () => validateField(i));
      i.addEventListener("input", () => clearFieldError(i));
    });
  }

  // Keyboard Escape closes menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const menu = getEl("nav-menu");
      const toggle = getEl("nav-toggle");
      if (menu && menu.classList.contains("active")) {
        menu.classList.remove("active");
        if (toggle) toggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });
}

function handleScroll() {
  updateScrollTopButton();
  updateNavbarBackground();
  updateActiveNavLink();
}

function updateScrollTopButton() {
  const btn = getEl("scroll-top");
  if (!btn) return;
  if (window.pageYOffset > 500) btn.classList.add("visible");
  else btn.classList.remove("visible");
}

function updateNavbarBackground() {
  const navbar = getEl("navbar");
  if (!navbar) return;
  navbar.style.background =
    window.scrollY > 50
      ? "rgba(15,23,42,0.98)"
      : "rgba(15,23,42,0.95)";
}

function updateActiveNavLink() {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  if (sections.length === 0 || navLinks.length === 0) return;

  let current = sections[0].id || "";
  const scrollPos = window.pageYOffset + 90;

  for (const sec of sections) {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      current = sec.id;
      break;
    }
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const target = (link.getAttribute("onclick") || "").match(
      /scrollToSection\('([^']+)'\)/
    );
    if ((target && target[1] === current)) link.classList.add("active");
  });
}

// Smooth scroll
window.scrollToSection = function (sectionId) {
  const el = getEl(sectionId);
  if (!el) return;
  const offset = el.offsetTop - 70;
  window.scrollTo({ top: offset, behavior: "smooth" });

  const menu = getEl("nav-menu");
  const toggle = getEl("nav-toggle");
  if (menu) menu.classList.remove("active");
  if (toggle) toggle.classList.remove("active");
  document.body.style.overflow = "";
};

// Resume download
window.downloadResume = async function () {
  const pdfPath = "UDAYKUMAR-1.pdf";
  try {
    const res = await fetch(pdfPath);
    if (res.ok) {
      const blob = await res.blob();
      downloadBlob(blob, "UDAYKUMAR.pdf");
      showNotification("Resume download started!", "success");
      return;
    }
    throw new Error("PDF missing");
  } catch (err) {
    const fallback = `Resume for Udaykumar Borale`;
    const blob = new Blob([fallback], { type: "text/plain" });
    downloadBlob(blob, "UDAYKUMAR_resume.txt");
  }
};

// LinkedIn
window.openLinkedIn = function () {
  window.open("https://www.linkedin.com/in/udaykumarborale", "_blank");
};

// ===================== FIXED CONTACT FORM SUBMIT =====================
// NOW WORKS WITH FORMSUBMIT
function handleFormSubmit(e) {
  const form = e.currentTarget;

  // VALIDATE — if errors, block submit
  if (!validateForm(form)) {
    e.preventDefault();
    showNotification("Please fix the errors in the form.", "error");
    return;
  }

  // Allow normal POST to FormSubmit
  showNotification("Sending message...", "success");
}

// Validation helpers
function validateForm(form) {
  const fields = Array.from(form.querySelectorAll("input[required], textarea[required]"));
  let ok = true;
  fields.forEach((f) => {
    if (!validateField(f)) ok = false;
  });
  return ok;
}

function validateField(field) {
  const name = field.name;
  const value = (field.value || "").trim();
  let msg = "";

  if (!value) msg = `${name} is required.`;
  if (!msg && name === "email") {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) msg = "Please enter a valid email.";
  }
  if (!msg && name === "subject" && value.length < 5)
    msg = "Subject should be at least 5 characters.";
  if (!msg && name === "message" && value.length < 10)
    msg = "Message should be at least 10 characters.";

  if (msg) {
    showFieldError(field, msg);
    return false;
  }

  clearFieldError(field);
  return true;
}

function showFieldError(field, msg) {
  const id = `${field.name}-error`;
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = "block";
  }
  field.style.borderColor = "#ef4444";
}

function clearFieldError(field) {
  const id = `${field.name}-error`;
  const el = document.getElementById(id);
  if (el) {
    el.textContent = "";
    el.style.display = "none";
  }
  field.style.borderColor = "";
}

// Image fallback
function setupImageFallback() {
  const img = getEl("profile-image");
  const fallback = getEl("profile-fallback");
  if (!img || !fallback) return;

  img.addEventListener("load", () => fallback.classList.add("hidden"));
  img.addEventListener("error", () => fallback.classList.remove("hidden"));

  if (img.complete) {
    if (img.naturalWidth > 0) fallback.classList.add("hidden");
    else fallback.classList.remove("hidden");
  }
}

// Reveal animations
function setupObservers() {
  const items = Array.from(
    document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
  );
  if (items.length === 0) return;

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    obs.observe(el);
  });
}

// Notifications
function showNotification(message, type = "info") {
  document.querySelectorAll(".notification").forEach((n) => n.remove());

  const div = document.createElement("div");
  div.className = `notification notification-${type}`;
  div.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">✕</button>
    </div>`;

  div.style.cssText =
    "position:fixed;top:90px;right:20px;padding:12px 16px;border-radius:8px;color:white;z-index:10000;background:#333;box-shadow:0 0 20px rgba(0,0,0,.3);";

  document.body.appendChild(div);

  div.querySelector(".notification-close").addEventListener("click", () =>
    div.remove()
  );

  setTimeout(() => div.remove(), 4500);
}

// Expose helpers
window.__portfolioHelpers = { debounce };
