/* ==============================  
   Helper Functions  
============================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// Helper to get element by id
function getEl(id) {
  return document.getElementById(id);
}

// Debounce utility
function debounce(func, wait = 100) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// Helper for downloading files
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

/* ==============================  
   Page Load  
============================== */

document.addEventListener("DOMContentLoaded", () => {
  initPage();
  attachListeners();
  setupObservers();
  setupImageFallback();
  // EmailJS init is moved to bottom
});

/* ==============================  
   Initialize Page  
============================== */

function initPage() {
  const loading = getEl("loading-screen");
  if (loading) {
    setTimeout(() => {
      loading.classList.add("hidden");
      document.body.classList.add("loaded");
    }, 700);
  }
}

/* ==============================  
   Attach Event Listeners  
============================== */

function attachListeners() {
  const navToggle = getEl("nav-toggle");
  const navMenu = getEl("nav-menu");
  const scrollBtn = getEl("scroll-top");
  const contactForm = getEl("contact-form");

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    });
  }

  // Close menu when link is clicked
  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("active");
      if (navToggle) navToggle.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // Scroll events
  window.addEventListener(
    "scroll",
    debounce(() => {
      handleScroll();
    }, 20)
  );

  // Resize events
  window.addEventListener(
    "resize",
    debounce(() => {
      if (window.innerWidth > 768) {
        if (navMenu) navMenu.classList.remove("active");
        if (navToggle) navToggle.classList.remove("active");
        document.body.style.overflow = "auto";
      }
      updateActiveNavLink();
    }, 200)
  );

  // Scroll-to-top button
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Contact form submit listener
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
    contactForm.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => clearFieldError(input));
    });
  }
}

/* ==============================  
   Scroll Handlers  
============================== */

function handleScroll() {
  updateScrollBtn();
  updateNavbarBackground();
  updateActiveNavLink();
}

function updateScrollBtn() {
  const btn = getEl("scroll-top");
  if (!btn) return;
  btn.classList.toggle("visible", window.pageYOffset > 500);
}

function updateNavbarBackground() {
  const navbar = getEl("navbar");
  if (!navbar) return;
  navbar.style.background =
    window.scrollY > 50 ? "rgba(15,23,42,0.98)" : "rgba(15,23,42,0.95)";
}

function updateActiveNavLink() {
  const sections = $$("section[id]");
  const links = $$(".nav-link");
  const scroll = window.pageYOffset + 90;

  let current = sections[0]?.id;

  sections.forEach((sec) => {
    if (scroll >= sec.offsetTop && scroll < sec.offsetTop + sec.offsetHeight) {
      current = sec.id;
    }
  });

  links.forEach((link) => {
    link.classList.remove("active");
    const isMatch = (link.getAttribute("onclick") || "").includes(current);
    if (isMatch) link.classList.add("active");
  });
}
/* ==============================  
   Scroll to Section  
============================== */

window.scrollToSection = function (id) {
  const el = getEl(id);
  if (!el) return;
  window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });

  const navMenu = getEl("nav-menu");
  const navToggle = getEl("nav-toggle");
  if (navMenu) navMenu.classList.remove("active");
  if (navToggle) navToggle.classList.remove("active");
  document.body.style.overflow = "auto";
};

/* ==============================  
   Resume Download  
============================== */

window.downloadResume = async function () {
  try {
    const response = await fetch("UDAYKUMAR-1.pdf");
    if (!response.ok) throw new Error("Resume not found");

    const blob = await response.blob();
    downloadBlob(blob, "UDAYKUMAR.pdf");

    showNotification("Resume download started!", "success");
  } catch (err) {
    const fallbackText = `
Name: Udaykumar Borale
Phone: +91-8660272709
Email: udaykumarborale9@gmail.com
Location: Bangalore
Summary: Mechanical Design and Simulation Engineer with expertise in CATIA, CAD modeling, FEA, and product development.
    `;
    downloadBlob(
      new Blob([fallbackText], { type: "text/plain" }),
      "UDAYKUMAR_resume.txt"
    );
    showNotification("Fallback resume downloaded.", "info");
  }
};

/* ==============================  
   Open LinkedIn  
============================== */

window.openLinkedIn = function () {
  window.open("https://www.linkedin.com/in/udaykumarborale", "_blank");
};

/* ==============================  
   Contact Form Validation  
============================== */

function validateForm(form) {
  let isValid = true;

  form.querySelectorAll("input[required], textarea[required]").forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let message = "";

  if (!value) {
    message = `${getFieldLabel(field.name)} is required.`;
  } else if (field.name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      message = "Invalid email format.";
    }
  } else if (
    ["first_name", "last_name"].includes(field.name) &&
    value.length < 2
  ) {
    message = `${getFieldLabel(field.name)} must be at least 2 characters.`;
  } else if (field.name === "subject" && value.length < 5) {
    message = "Subject must be at least 5 characters.";
  } else if (field.name === "message" && value.length < 10) {
    message = "Message must be at least 10 characters.";
  }

  if (message) {
    showFieldError(field, message);
    return false;
  }

  clearFieldError(field);
  return true;
}

function getFieldLabel(name) {
  const labels = {
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
  };
  return labels[name] || name;
}

function showFieldError(field, message) {
  const errorElement = getEl(`${field.name}-error`);
  if (errorElement) {
    errorElement.textContent = message;
  }
  field.style.borderColor = "#ef4444";
}

function clearFieldError(field) {
  const errorElement = getEl(`${field.name}-error`);
  if (errorElement) {
    errorElement.textContent = "";
  }
  field.style.borderColor = "";
}

/* ==============================  
   Image Fallback  
============================== */

function setupImageFallback() {
  const img = getEl("profile-image");
  const fallback = getEl("profile-fallback");

  if (!img || !fallback) return;

  img.addEventListener("load", () => fallback.classList.add("hidden"));
  img.addEventListener("error", () => fallback.classList.remove("hidden"));
}

/* ==============================  
   On-scroll Animations  
============================== */

function setupObservers() {
  const elements = $$(".fade-in, .slide-in-left, .slide-in-right");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  elements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 80}ms`;
    observer.observe(el);
  });
}

/* ==============================  
   Notifications  
============================== */

function showNotification(message, type = "info") {
  document.querySelectorAll(".notification").forEach((n) => n.remove());

  const div = document.createElement("div");
  div.className = `notification notification-${type}`;
  div.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    z-index: 9999;
  `;
  div.textContent = message;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 4000);
}
/* ==============================
   Chatbot Toggle (Fixed)
============================== */

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotClose = document.getElementById("chatbot-close");

// OPEN CHATBOT
if (chatbotToggle && chatbotWindow) {
  chatbotToggle.addEventListener("click", () => {
    chatbotWindow.classList.remove("hidden");
  });
}

// CLOSE CHATBOT
if (chatbotClose && chatbotWindow) {
  chatbotClose.addEventListener("click", () => {
    chatbotWindow.classList.add("hidden");
  });
}

/* ==============================
   Chatbot Functionality (Rule‑Based)
============================== */

const chatbotInput = document.getElementById("chatbot-input");
const chatbotSend = document.getElementById("chatbot-send");
const chatbotMessages = document.getElementById("chatbot-messages");

if (chatbotSend && chatbotInput) {
  chatbotSend.addEventListener("click", sendChatbotMessage);
  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatbotMessage();
  });
}

function sendChatbotMessage() {
  const text = chatbotInput.value.trim();
  if (!text) return;

  appendChatMessage("user", text);
  chatbotInput.value = "";

  // Typing animation
  const typingDiv = document.createElement("div");
  typingDiv.className = "chat-message bot typing";
  typingDiv.textContent = "Typing...";
  chatbotMessages.appendChild(typingDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

  setTimeout(() => {
    typingDiv.remove();
    appendChatMessage("bot", getBotReply(text));
  }, 900);
}

function sendChatbotMessage_OLD() {
  const text = chatbotInput.value.trim();
  if (!text) return;

  appendChatMessage("user", text);
  chatbotInput.value = "";

  setTimeout(() => {
    appendChatMessage("bot", getBotReply(text));
  }, 400);
}

function getBotReply(msg) {
  msg = msg.toLowerCase();

  // Greetings + Emoji Reactions + Smart Synonyms
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey") || msg.includes("hii") || msg.includes("yo"))
    return "Hello! 😊 I'm Uday's AI Assistant. How can I help you today?";

  if (msg.includes("how are you"))
    return "I'm doing great 😄 and ready to help you with anything about Uday or this website!";

  if (msg.includes("who are you") || msg.includes("your name") || msg.includes("introduce"))
    return "I'm Uday's personal AI assistant 🤖 here to guide you through his portfolio.";

  if (msg.includes("what can you do") || msg.includes("help me") || msg.includes("your work"))
    return "I can tell you about Uday's skills, projects, resume, contact, location and more! 💡";

  if (msg.includes("thanks") || msg.includes("thank you"))
    return "You're welcome! 😊 Happy to help!";

  if (msg.includes("bye") || msg.includes("goodbye") || msg.includes("see you"))
    return "Goodbye! 👋 Have a wonderful day!";
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
    return "Hello! I'm Uday's AI Assistant. How can I help you today?";
  if (msg.includes("how are you"))
    return "I'm doing great and ready to help you with anything about Uday or this website!";
  if (msg.includes("who are you"))
    return "I'm Uday's personal AI assistant here to guide you through his portfolio.";
  if (msg.includes("what can you do"))
    return "I can tell you about Uday, his projects, skills, resume, location, and contact details.";
  if (msg.includes("bye") || msg.includes("goodbye"))
    return "Goodbye! Have a great day 😊";

  if (msg.includes("name")) return "I am Uday’s AI Assistant!";
  if (msg.includes("about") || msg.includes("yourself")) return "Uday is an R&D Engineer specializing in Powertrain & BIW Design.";
  if (msg.includes("project")) return "You can view Uday’s projects in the Projects section of this website.";
  if (msg.includes("contact") || msg.includes("email")) return "You can contact Uday at udaykumarborale9@gmail.com.";
  if (msg.includes("phone") || msg.includes("number")) return "His phone number is +91‑8660272709.";
  if (msg.includes("social") || msg.includes("linkedin")) return "LinkedIn: linkedin.com/in/udaykumarborale";
  if (msg.includes("location") || msg.includes("from")) return "Uday is based in Bangalore, India 🇮🇳.";
  if (msg.includes("resume") || msg.includes("cv")) return "You can download the resume using the 'Download Resume' button above.";

  return "I can help you with information about Uday, his skills, projects, resume, contact details, and location. What would you like to know?";
}

function appendChatMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `chat-message ${sender}`;
  div.textContent = text;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

/* ==============================
   Project Cards Popup Preview
============================== */

const projectCards = document.querySelectorAll(".project-card");
const projectPopup = document.getElementById("project-popup");
const projectPopupClose = document.getElementById("project-popup-close");
const projectPopupContent = document.getElementById("project-popup-content");

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    const title = card.getAttribute("data-title");
    const description = card.getAttribute("data-description");
    const image = card.getAttribute("data-image");

    if (projectPopupContent) {
      projectPopupContent.innerHTML = `
        <h2>${title}</h2>
        <img src="${image}" alt="${title}" />
        <p>${description}</p>
      `;
    }

    if (projectPopup) projectPopup.classList.add("visible");
  });
});

if (projectPopupClose && projectPopup) {
  projectPopupClose.addEventListener("click", () => {
    projectPopup.classList.remove("visible");
  });
}

/* ==============================
   Smooth Scroll for Anchor Links
============================== */

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth",
      });
    }
  });
});
/* ==============================
   CONTACT FORM SUBMISSION (EmailJS)
   — Corrected Version A —
   — Uses: first_name, last_name, email, subject, message —
============================== */

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;

  // Validate before sending
  if (!validateForm(form)) {
    showNotification("Please fix the errors in the form.", "error");
    return;
  }

  const status = document.getElementById("form-status");
  if (status) {
    status.style.color = "white";
    status.textContent = "Sending...";
  }

  // Initialize EmailJS
  emailjs.init("5muRzVJinIh6V4qiL"); // Your public key

  // SEND EMAIL via EmailJS
  emailjs
    .sendForm("service_3n7lhrd", "template_ld4gc8y", form)
    .then(() => {
      if (status) {
        status.style.color = "lightgreen";
        status.textContent = "Message sent successfully!";
      }

      form.reset();
      clearAllFieldErrors(form);
      showNotification("Message sent successfully!", "success");
    })
    .catch((err) => {
      console.error(err);
      if (status) {
        status.style.color = "red";
        status.textContent = "Failed to send message.";
      }
      showNotification("Failed to send message.", "error");
    });
}

/* ==============================
   REMOVE old mailto system
   (Version B removed completely)
============================== */

// (Nothing here — OLD VERSION REMOVED)

/* ==============================
   END OF SCRIPT
============================== */

console.log("script.js loaded successfully (Corrected Version A)");
