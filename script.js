/* ============================================
   Ahmed Mahmoud Portfolio - JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize page loader
  initPageLoader();
  
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initLanguageToggle();
  initTypingEffect();
  initScrollAnimations();
  initSmoothScroll();
  initCounterAnimation();
  initParticles();
  initMagneticButtons();
  initTiltEffect();
  initParallax();
  initTextReveal();
  initCustomCursor();
});

/* ============================================
   Page Loader
   ============================================ */
function initPageLoader() {
  const loader = document.getElementById("pageLoader");
  
  // Hide loader after page is fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("hidden");
      // Remove from DOM after animation
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 800); // Show loader for at least 800ms
  });
}

/* ============================================
   Navbar Scroll Effect
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Check initial state
}

/* ============================================
   Mobile Menu
   ============================================ */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  const toggleMenu = () => {
    menuBtn.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "";
  };

  menuBtn.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });
}

/* ============================================
   Language Toggle
   ============================================ */
function initLanguageToggle() {
  const langToggle = document.getElementById("lang-toggle");
  const langText = langToggle.querySelector(".lang-text");
  let isArabic = false;

  langToggle.addEventListener("click", () => {
    isArabic = !isArabic;

    // Update document direction and language
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";

    // Update toggle button text
    langText.textContent = isArabic ? "English" : "عربي";

    // Update all elements with data-en and data-ar attributes
    const translatableElements =
      document.querySelectorAll("[data-en][data-ar]");
    translatableElements.forEach((el) => {
      const newText = isArabic ? el.dataset.ar : el.dataset.en;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = newText;
      } else {
        el.textContent = newText;
      }
    });

    // Re-init typing effect with correct language
    initTypingEffect(isArabic);
  });
}

/* ============================================
   Typing Effect
   ============================================ */
let typingTimeout = null; // Global timeout reference

function initTypingEffect(isArabic = false) {
  const typedElement = document.getElementById("typed-text");

  // Clear any existing timeout to prevent multiple instances
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }

  const textsEn = [
    "Full Stack Developer",
    "Python Instructor",
    "Freelancer",
    "Problem Solver",
  ];

  const textsAr = ["مطور Full Stack", "مدرس بايثون", "فريلانسر", "حلال مشاكل"];

  const texts = isArabic ? textsAr : textsEn;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typedElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typedElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500; // Pause before next word
    }

    typingTimeout = setTimeout(type, typingSpeed);
  }

  // Clear any existing text and start fresh
  typedElement.textContent = "";
  charIndex = 0;
  textIndex = 0;
  isDeleting = false;

  type();
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-visible");

        // Trigger counter animation when stat cards are visible
        if (entry.target.classList.contains("stat-card")) {
          animateCounter(entry.target.querySelector(".stat-number"));
        }
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const animatableElements = document.querySelectorAll(
    ".section-header, .skill-category, .timeline-item, .project-card, " +
      ".teaching-card, .education-card, .certificate-card, .contact-card, .stat-card",
  );

  animatableElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Add CSS for visible state
  const style = document.createElement("style");
  style.textContent = `
        .animate-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
  document.head.appendChild(style);
}

/* ============================================
   Counter Animation
   ============================================ */
function initCounterAnimation() {
  // This is handled by scroll animations
}

function animateCounter(element) {
  if (!element || element.classList.contains("counted")) return;

  const target = element.getAttribute("data-count");
  if (!target) return;

  element.classList.add("counted");
  const duration = 2000;
  const start = 0;
  const end = parseInt(target);
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (end - start) * easeOutQuart);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = end;
    }
  }

  requestAnimationFrame(updateCounter);
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

/* ============================================
   Active Navigation Link
   ============================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

// Initialize active nav link functionality
initActiveNavLink();

/* ============================================
   Particle System
   ============================================ */
function initParticles() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    
    // Random position
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 20 + "s";
    particle.style.animationDuration = (Math.random() * 10 + 10) + "s";
    
    particlesContainer.appendChild(particle);
  }
}

/* ============================================
   Magnetic Buttons Effect
   ============================================ */
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".btn, .social-link, .contact-card");
  
  buttons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });
}

/* ============================================
   3D Tilt Effect for Cards
   ============================================ */
function initTiltEffect() {
  const cards = document.querySelectorAll(".project-card, .skill-category, .stat-card");
  
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ============================================
   Parallax Scrolling Effect
   ============================================ */
function initParallax() {
  const parallaxElements = document.querySelectorAll(".hero-gradient, .hero-image, .floating-card");
  
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.1;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

/* ============================================
   Text Reveal Animation
   ============================================ */
function initTextReveal() {
  const textElements = document.querySelectorAll(".hero-title, .section-title");
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "textReveal 1s ease forwards";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  textElements.forEach((element) => {
    observer.observe(element);
  });
}

/* ============================================
   Custom Cursor Effect
   ============================================ */
function initCustomCursor() {
  // Create cursor elements
  const cursor = document.createElement("div");
  const cursorFollower = document.createElement("div");
  
  cursor.className = "custom-cursor";
  cursorFollower.className = "custom-cursor-follower";
  
  document.body.appendChild(cursor);
  document.body.appendChild(cursorFollower);
  
  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  
  // Update cursor position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });
  
  // Smooth follower animation
  function animateFollower() {
    const distX = mouseX - followerX;
    const distY = mouseY - followerY;
    
    followerX += distX * 0.1;
    followerY += distY * 0.1;
    
    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top = followerY + "px";
    
    requestAnimationFrame(animateFollower);
  }
  
  animateFollower();
  
  // Expand cursor on hover
  const hoverElements = document.querySelectorAll("a, button, .project-card, .skill-item");
  
  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
      cursorFollower.classList.add("cursor-hover");
    });
    
    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
      cursorFollower.classList.remove("cursor-hover");
    });
  });
}
