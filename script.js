// script.js — Full functionality: DOM, nav, tilt, parallax, Three.js hero

// ---------------- DOM Helpers ----------------
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

// ---------------- Page Load & Year ----------------
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navLinks = document.getElementById('nav-links');
  if (navLinks && !navLinks.classList.contains('open')) {
    navLinks.style.display = '';
  }
});

window.addEventListener('load', () => {
  const load = document.getElementById('loading-screen');
  if (load) { load.style.opacity = '0'; setTimeout(() => load.remove(), 600); }
});

// ---------------- NAVIGATION ----------------
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

// Mobile menu toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    if (navLinks.classList.contains('open')) {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.gap = '12px';
    } else {
      navLinks.style.display = '';
    }
  });
}

// Smooth scroll function
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 86; // header height
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });

  // Close mobile menu after clicking a link
  if (navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navLinks.style.display = '';
  }
}
window.scrollToSection = scrollToSection;

// Attach click for all nav buttons (optional if you use onclick in HTML)
document.querySelectorAll('.nav-link').forEach(btn => {
  btn.addEventListener('click', e => {
    const target = btn.getAttribute('onclick')?.match(/scrollToSection\('(.+)'\)/)?.[1];
    if (target) scrollToSection(target);
  });
});



// ---------------- Resume Download ----------------
function downloadResume() {
  const link = document.createElement('a');
  link.href = 'UDAYKUMAR-1.pdf'; // root folder path
  link.download = 'UDAYKUMAR-1.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
window.downloadResume = downloadResume;


// Attach to all resume buttons automatically
$$('a[onclick*="downloadResume"]').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); downloadResume(); });
});

// ---------------- Profile Fallback ----------------
function showProfileFallback() {
  const img = document.getElementById('profile-image'), fb = document.getElementById('profile-fallback');
  if (img) img.style.display = 'none';
  if (fb) fb.style.display = 'flex';
}
window.showProfileFallback = showProfileFallback;

// ---------------- Typing Animation ----------------
(function roleTyping() {
  const roles = [
    'Powertrain Specialist',
    'BIW Structural Engineer',
    'NVH & Crash Analyst',
    'Prototype Validation Lead',
    'Simulation & CAE Expert'
  ];
  const el = document.getElementById('role-typing');
  if (!el) return;
  let idx = 0, ch = 0, forward = true;
  const speed = 60, pause = 900;
  function step() {
    const word = roles[idx];
    if (forward) {
      ch++;
      el.textContent = word.slice(0, ch);
      if (ch === word.length) { forward = false; setTimeout(step, pause); return; }
    } else {
      ch--;
      el.textContent = word.slice(0, ch);
      if (ch === 0) { forward = true; idx = (idx + 1) % roles.length; }
    }
    setTimeout(step, speed);
  }
  setTimeout(step, 400);
})();

// ---------------- Contact Form ----------------
function handleFormSubmit(e) {
  e.preventDefault();

  const status = document.getElementById("form-status");
  status.textContent = "Sending...";

  emailjs.sendForm(
    "service_3n7lhrd",      // YOUR Service ID
    "template_0f74wlr",     // YOUR Template ID
    e.target
  )
  .then(() => {
    const firstName = e.target.first_name.value.trim();
    const subject = e.target.subject.value.trim();

    // List of friendly success messages
    const successReplies = [
        `Thanks, ${firstName}! Your message about "${subject}" has been received. We'll get back to you shortly. ✅`,
        `Hi ${firstName}, we appreciate you reaching out regarding "${subject}". Expect a reply soon! 🌟`,
        `${firstName}, your message on "${subject}" is in safe hands. We'll contact you very soon. 💬`
    ];

    // Pick a random friendly reply
    const randomReply = successReplies[Math.floor(Math.random() * successReplies.length)];

    // Optional: Typing animation for a professional touch
    status.textContent = "";
    typeMessage(status, randomReply);

    e.target.reset(); // Clear the form
})
.catch((err) => {
    console.error("EmailJS Error:", err);

    // Friendly error message
    const errorReplies = [
        "Oops! Something went wrong. Please try again.",
        "Sorry, we couldn't send your message. Give it another shot!",
        "Hmm, something didn't work. Please resubmit your message."
    ];

    const randomError = errorReplies[Math.floor(Math.random() * errorReplies.length)];
    status.textContent = randomError;
});

// Typing animation function
function typeMessage(element, text, index = 0) {
    if(index < text.length) {
        element.textContent += text[index];
        setTimeout(() => typeMessage(element, text, index + 1), 25);
    }
}


// ---------------- Floating Hire Me ----------------
const floating = document.querySelector('.floating-hireme');
if (floating) {
  floating.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToSection('contact');
  });
}

// ---------------- Soft 3D Tilt + Parallax ----------------
(function tiltParallaxEngine() {
  const TILT_SELECTOR = '.tilt-card';
  const PARALLAX_CONTAINER = '[data-parallax], .parallax-3d, .parallax-soft';
  const MAX_TILT = 10;
  const TRANSLATE_Z = 12;
  const DAMPING = 0.12;

  const tiltCards = $$(TILT_SELECTOR);
  if (!tiltCards.length) return;
  const state = new WeakMap();

  tiltCards.forEach(card => {
    if (!card.querySelector('.tilt-inner')) {
      const inner = document.createElement('div');
      inner.className = 'tilt-inner';
      while (card.firstChild) inner.appendChild(card.firstChild);
      card.appendChild(inner);
    }
    state.set(card, { tx: 0, ty: 0, rx: 0, ry: 0 });
    card.style.willChange = 'transform';
    if (!card.querySelector('.tilt-glow')) {
      const glow = document.createElement('div');
      glow.className = 'tilt-glow';
      card.appendChild(glow);
    }
  });

  const parallaxContainers = Array.from(document.querySelectorAll(PARALLAX_CONTAINER));
  let activePointer = null;

  function handlePointerMove(clientX, clientY, container) {
    const rect = (container && container.getBoundingClientRect()) || { left:0, top:0, width: window.innerWidth, height: window.innerHeight };
    const nx = ((clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((clientY - rect.top) / rect.height - 0.5) * -2;
    const cards = container ? Array.from(container.querySelectorAll(TILT_SELECTOR)) : tiltCards;
    cards.forEach(card => {
      const s = state.get(card);
      if (!s) return;
      const targetRx = clamp(ny * MAX_TILT, -MAX_TILT, MAX_TILT);
      const targetRy = clamp(-nx * MAX_TILT, -MAX_TILT, MAX_TILT);
      s.rx += (targetRx - s.rx) * DAMPING;
      s.ry += (targetRy - s.ry) * DAMPING;
      s.tx += (-nx * TRANSLATE_Z - s.tx) * (DAMPING * 0.9);
      s.ty += (-ny * TRANSLATE_Z - s.ty) * (DAMPING * 0.9);
    });
  }

  function handlePointerLeave(container) {
    const cards = container ? Array.from(container.querySelectorAll(TILT_SELECTOR)) : tiltCards;
    cards.forEach(card => {
      const s = state.get(card);
      if (!s) return;
      s.rx += (0 - s.rx) * (DAMPING * 1.6);
      s.ry += (0 - s.ry) * (DAMPING * 1.6);
      s.tx += (0 - s.tx) * (DAMPING * 1.6);
      s.ty += (0 - s.ty) * (DAMPING * 1.6);
    });
  }

  const pointerEvent = window.PointerEvent ? 'pointermove' : 'mousemove';
  parallaxContainers.forEach(container => {
    const onMove = (e) => handlePointerMove(e.clientX ?? e.touches?.[0]?.clientX, e.clientY ?? e.touches?.[0]?.clientY, container);
    container.addEventListener(pointerEvent, onMove, { passive: true });
    container.addEventListener('touchmove', onMove, { passive: true });
    container.addEventListener('pointerleave', () => handlePointerLeave(container));
    container.addEventListener('touchend', () => handlePointerLeave(container));
  });

  const globalMove = (e) => handlePointerMove(e.clientX ?? e.touches?.[0]?.clientX, e.clientY ?? e.touches?.[0]?.clientY, null);
  document.addEventListener(pointerEvent, globalMove, { passive: true });
  document.addEventListener('touchmove', globalMove, { passive: true });
  document.addEventListener('pointerleave', () => handlePointerLeave(null));
  document.addEventListener('touchend', () => handlePointerLeave(null));

  let lastScrollY = window.scrollY;
  const parallaxElements = $$(PARALLAX_CONTAINER);
  function onScrollRaf() {
    const dy = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    parallaxElements.forEach(container => {
      const rect = container.getBoundingClientRect();
      const depthFactor = clamp((window.innerHeight/2 - rect.top - rect.height/2) / (window.innerHeight), -1, 1);
      const offset = Math.round(depthFactor * 18);
      container.style.setProperty('--parallax-offset', `${offset}px`);
      const cards = Array.from(container.querySelectorAll(TILT_SELECTOR));
      cards.forEach((card, i) => {
        const z = (i - (cards.length-1)/2) * 6;
        card.style.transform = composeTransform(state.get(card), ` translateZ(${z * (1 - Math.abs(depthFactor))}px)`);
      });
    });
    scrollTick = false;
  }
  let scrollTick = false;
  window.addEventListener('scroll', () => { if (!scrollTick) { scrollTick = true; requestAnimationFrame(onScrollRaf); } }, { passive: true });
  requestAnimationFrame(onScrollRaf);

  function rafLoop() {
    tiltCards.forEach(card => {
      const s = state.get(card);
      if (!s) return;
      const transform = `rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) translate3d(${s.tx.toFixed(1)}px, ${s.ty.toFixed(1)}px, 0)`;
      card.style.transform = transform;
    });
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function composeTransform(stateObj, suffix = '') {
    if (!stateObj) return suffix;
    return `rotateX(${stateObj.rx.toFixed(2)}deg) rotateY(${stateObj.ry.toFixed(2)}deg) translate3d(${stateObj.tx.toFixed(1)}px, ${stateObj.ty.toFixed(1)}px, 0)` + suffix;
  }
})();

// ---------------- THREE.JS Hero ----------------
(function threeHero() {
  function init() {
    const canvas = document.getElementById('three-canvas'); 
    if(!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000,0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38,1,0.1,100);
    camera.position.set(0,0.9,3.2);

    const hemi = new THREE.HemisphereLight(0xffffff,0x111122,0.7); hemi.position.set(0,1,0); scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff,0.9); dir.position.set(3,5,2); scene.add(dir);

    const grp = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(1.6,0.8,1.0);
    const boxMat = new THREE.MeshStandardMaterial({metalness:0.9,roughness:0.25,color:0x1e293b});
    const housing = new THREE.Mesh(boxGeo,boxMat); housing.rotation.y = 0.2; grp.add(housing);

    const cylGeo = new THREE.CylinderGeometry(0.28,0.28,1.05,32);
    const cylMat = new THREE.MeshStandardMaterial({metalness:0.95,roughness:0.15,color:0x0ea5a4});
    const rotor = new THREE.Mesh(cylGeo,cylMat); rotor.rotation.z = Math.PI/2; rotor.position.set(0,0,0.02); grp.add(rotor);

    const torGeo = new THREE.TorusGeometry(0.45,0.08,16,80);
    const torMat = new THREE.MeshStandardMaterial({metalness:0.9,roughness:0.2,color:0xff8a00});
    const ring = new THREE.Mesh(torGeo,torMat); ring.rotation.x = Math.PI/2; ring.position.set(0.72,0,0); grp.add(ring);

    const bracketGeo = new THREE.BoxGeometry(0.18,0.06,0.5);
    const bracketMat = new THREE.MeshStandardMaterial({metalness:0.85,roughness:0.35,color:0x94a3b8});
    for(let i=0;i<4;i++){ const b = new THREE.Mesh(bracketGeo,bracketMat); const ang = i * Math.PI/2; b.position.set(Math.cos(ang)*0.95, Math.sin(ang)*0.12, Math.sin(ang)*0.35); b.rotation.z = ang; grp.add(b); }

    const planeGeo = new THREE.PlaneGeometry(6,3);
    const planeMat = new THREE.MeshBasicMaterial({color:0x07102a, side: THREE.DoubleSide});
    const plane = new THREE.Mesh(planeGeo, planeMat); plane.position.set(0,-0.2,-1.1); scene.add(plane);

    scene.add(grp);

    function resize(){
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(32, rect.width);
      const h = Math.max(32, rect.height);
      if(canvas.width !== Math.floor(w * devicePixelRatio) || canvas.height !== Math.floor(h * devicePixelRatio)){
        renderer.setSize(w,h,false);
        camera.aspect = w/h;
        camera.updateProjectionMatrix();
      }
    }

    let mouseX=0, mouseY=0;
    const throttledPointer = throttle((e)=>{
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      if(clientX==null) return;
      mouseX = ((clientX-rect.left)/rect.width - 0.5)*2;
      mouseY = ((clientY-rect.top)/rect.height - 0.5)*-2;
    }, 16);

    window.addEventListener('pointermove', throttledPointer);
    window.addEventListener('touchmove', throttledPointer, {passive:true});

    const clock = new THREE.Clock();
    function animate(){
      resize();
      const t = clock.getElapsedTime();
      grp.rotation.y = Math.sin(t*0.4)*0.26 + mouseX*0.25;
      grp.rotation.x = Math.sin(t*0.12)*0.05 + mouseY*0.07;
      rotor.rotation.x = t*3.2;
      ring.rotation.z = -t*0.9;
      renderer.render(scene,camera);
      requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('unload', ()=> { renderer.dispose(); });
  }

  if(document.readyState === 'complete') init(); 
  else window.addEventListener('load', init);

  function throttle(fn, wait){ let raf=false; return (...args)=>{ if(raf) return; raf=true; requestAnimationFrame(()=>{ fn(...args); raf=false; }); }; }
})();

