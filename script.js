// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const loadingScreen = document.getElementById('loading-screen');
const profileImage = document.getElementById('profile-image');
const profileFallback = document.getElementById('profile-fallback');

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    initializePage();
    setupEventListeners();
    setupIntersectionObserver();
    setupImageHandling();
});

// Page Initialization
function initializePage() {
    // Hide loading screen after a short delay
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.add('loaded');
    }, 1000);

    // Initialize navigation
    updateActiveNavLink();

    // Console welcome message
    console.log('%c🚀 Welcome to Udaykumar Borale\'s Portfolio!', 'color: #a855f7; font-size: 16px; font-weight: bold;');
    console.log('%c📧 Contact: udaykumarborale9@gmail.com', 'color: #3b82f6;');
    console.log('%c📱 Phone: +91-8660272709', 'color: #10b981;');
    console.log('%c💼 LinkedIn: linkedin.com/in/udaykumarborale', 'color: #0077b5;');
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Scroll events
    window.addEventListener('scroll', debounce(handleScroll, 10));

    // Scroll to top button
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', scrollToTop);
    }

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);

        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Window resize
    window.addEventListener('resize', debounce(handleResize, 250));
}

// Mobile Menu Functions
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll Functions
function handleScroll() {
    updateScrollTopButton();
    updateNavbarBackground();
    updateActiveNavLink();
}

function updateScrollTopButton() {
    if (scrollTopBtn) {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
}

function updateNavbarBackground() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkText = link.textContent.toLowerCase();
        if (linkText === currentSection ||
            (currentSection === 'hero' && linkText === 'udaykumar borale')) {
            link.classList.add('active');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        closeMobileMenu();
    }
}

// Resume Download Function (fixed: uses Blob and file name; content matches uploaded PDF summary)
function downloadResume() {
    try {
        const pdfPath = 'UDAYKUMAR-1.pdf'; // exact filename you provided

        const link = document.createElement('a');
        link.href = pdfPath;
        link.download = 'UDAYKUMAR.pdf'; 
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Resume download started!', 'success');
    } catch (error) {
        console.error('Error downloading resume:', error);
        showNotification('Error downloading resume. Please try again.', 'error');
    }
}


+91-8660272709 | udaykumarborale9@gmail.com | linkedin.com/in/udaykumarborale
https://udaykumar.online/ | Banashankari 1St stage Bangalore-560050

SUMMARY
Experienced Mechanical Design and Simulation Engineer specializing in advanced 3D modelling, simulation, and comprehensive product development. Proficient in industry-standard tools such as CATIA, SolidWorks, Solid Edge, PTC Creo, Siemens NX, ANSYS, Abaqus, Hyper Mesh, ANSA, and MATLAB. Skilled in utilizing PLM/PDM systems to streamline design workflows and ensure efficient project management.

EDUCATION
B.E. in Mechanical Engineering - Bangalore Institute of Technology (2022-2025) - CGPA: 8.5
Diploma in Mechanical Engineering - Jawaharlal Nehru Polytechnic (2018-2021) - 72%

WORK EXPERIENCE
R&D Engineer – Powertrain & BIW Design - Chropynska India Private Ltd (Oct 2025 – Present)
- Lead end-to-end design and development of Powertrain and Body-in-White (BIW) systems.
- Optimized components for performance, durability and manufacturability.

Quality and Product Design Engineer - JK Fenner India Ltd (2021-2022)
- Created detailed 3D models and simulations to support product design initiatives.
- Assisted quality assurance and collaborated with cross-functional teams.

INTERNSHIPS & TRAINING
- Bajaj Engineering & Skills Training (BEST), PES University — Mechatronics & Automation Trainee (Feb–Jul 2025)
- CONCEPTIA KONNECT — Simulation & Structural Analysis (Feb–May 2025)
- PRIME TOOLING — Design & Structural Analysis (Mar–Feb 2025)
- CNC Machines & Manufacturing (Bharat Fritz Werner) — Oct–Nov 2023
- BELATHUR INDUSTRIES — Machining Operations (May–Jun 2023)
- BOSCH — CFD & Flow Simulation Intern (Feb–Mar 2023)

PROJECTS
- Modeling and Analysis of Vertical Axis Wind Turbine Blade (Apr–Jul 2024) — CATIA V5, SolidWorks, ANSYS
- Studies on Free Convection in a Trapezoidal Cavity with Porous Media (Aug–Dec 2024) — MATLAB, FEM

SKILLS
3D Modeling: CATIA, SolidWorks, Solid Edge, PTC Creo, Siemens NX
Simulation: ANSYS, Abaqus, HyperMesh, ANSA, MATLAB
Programming & Tools: Python, MATLAB, Microsoft Office
Certifications: CATIA V5, SolidWorks, ANSYS Workbench, Python Programming
Languages: English, Kannada, Hindi, Marathi
Interests: Reading, Traveling, Music, Carrom, Cricket
`;

        const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'UDAYKUMAR_resume.txt'; // text fallback download; change to .pdf if you want to serve actual PDF binary
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showNotification('Resume download started.', 'success');
    } catch (error) {
        console.error('Error downloading resume:', error);
        showNotification('Error downloading resume. Please try again.', 'error');
    }
}

// If you want to download the actual uploaded PDF (UDAYKUMAR-1.pdf) instead, replace downloadResume() to fetch and download that file
// (I used a text fallback here because static binary serving depends on how your site is hosted).

// Open LinkedIn Profile
function openLinkedIn() {
    try {
        window.open('https://www.linkedin.com/in/udaykumarborale', '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('Error opening LinkedIn:', error);
        showNotification('Error opening LinkedIn. Please try again.', 'error');
    }
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        showNotification('Please fix the errors in the form.', 'error');
        return;
    }

    try {
        const formData = new FormData(contactForm);
        const firstName = formData.get('firstName')?.trim();
        const lastName = formData.get('lastName')?.trim();
        const email = formData.get('email')?.trim();
        const subject = formData.get('subject')?.trim();
        const message = formData.get('message')?.trim();

        // Create mailto link with form data
        const mailtoLink = `mailto:udaykumarborale9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        showNotification('Email client opened! Please send your message.', 'success');

        // Reset form
        contactForm.reset();
        clearAllFieldErrors();

    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Error submitting form. Please try again.', 'error');
    }
}

// Form Validation
function validateForm() {
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    formInputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
        isValid = false;
    }

    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address.';
            isValid = false;
        }
    }

    // Name validation
    if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
        if (value.length < 2) {
            errorMessage = `${getFieldLabel(fieldName)} must be at least 2 characters long.`;
            isValid = false;
        }
    }

    // Subject validation
    if (fieldName === 'subject' && value && value.length < 5) {
        errorMessage = 'Subject must be at least 5 characters long.';
        isValid = false;
    }

    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
        errorMessage = 'Message must be at least 10 characters long.';
        isValid = false;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    field.style.borderColor = '#ef4444';
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    field.style.borderColor = '';
}

function clearAllFieldErrors() {
    const errorElements = contactForm.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });

    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Image Handling
function setupImageHandling() {
    if (profileImage && profileFallback) {
        profileImage.addEventListener('load', function () {
            profileFallback.classList.add('hidden');
        });

        profileImage.addEventListener('error', function () {
            profileFallback.classList.remove('hidden');
            console.log('Profile image not found, showing fallback');
        });

        // Check if image is already loaded
        if (profileImage.complete) {
            if (profileImage.naturalWidth > 0) {
                profileFallback.classList.add('hidden');
            } else {
                profileFallback.classList.remove('hidden');
            }
        }
    }
}

// Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in');
    animatedElements.forEach((element, index) => {
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const iconClass = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconClass}" aria-hidden="true"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add notification styles
    const bgColor = type === 'success' ? '#10b981' :
        type === 'error' ? '#ef4444' : '#3b82f6';

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }

    // Enter key on navigation buttons
    if (e.key === 'Enter' && e.target.classList.contains('nav-link')) {
        e.target.click();
    }
}

// Window Resize Handler
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMobileMenu();
    }
}

// Utility Functions
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

// Performance Monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
            }, 0);
        });
    }
}

// Initialize performance monitoring
logPerformance();

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .profile-fallback.hidden {
        display: none !important;
    }
    
    @media (max-width: 480px) {
        .notification {
            right: 10px !important;
            left: 10px !important;
            max-width: none !important;
            transform: translateY(-100%) !important;
            top: 80px !important;
        }
        
        .notification.visible {
            transform: translateY(0) !important;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Expose functions to global scope for HTML onclick handlers
window.scrollToSection = scrollToSection;
window.downloadResume = downloadResume;
window.openLinkedIn = openLinkedIn;



