/* ============================================
   Ahmed Mahmoud Portfolio - JavaScript
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initThemeToggle();
  initLanguageToggle();
  initTypingEffect();
  initScrollAnimations();
  initSmoothScroll();
  initCounterAnimation();
});

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
   Theme Toggle
   ============================================ */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");
  
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  // Set initial icon
  if (savedTheme === "light") {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
  }

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Update theme
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Update icon with animation
    themeIcon.style.transform = "rotate(360deg)";
    setTimeout(() => {
      if (newTheme === "light") {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
      } else {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      }
      themeIcon.style.transform = "rotate(0deg)";
    }, 150);
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
