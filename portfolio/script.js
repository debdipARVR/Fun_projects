/**
 * DEBDIP BANDYOPADHYAY — PORTFOLIO JAVASCRIPT ENGINE
 * Pure Vanilla JS: Zero Dependencies, High Performance
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollProgress();
    initStickyNavbar();
    initTypewriter();
    initParticleCanvas();
    initStatsCounter();
    initProjectFilters();
    initBackToTop();
    initMobileMenu();
    initCopyrightYear();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark / Light Mode with LocalStorage)
   ========================================================================== */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Read stored theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showToast(`Switched to ${newTheme} mode`);
        });
    }

    // Keyboard shortcut [T] to toggle theme
    document.addEventListener('keydown', (e) => {
        if ((e.key === 't' || e.key === 'T') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            themeToggleBtn.click();
        }
    });
}

/* ==========================================================================
   2. SCROLL PROGRESS BAR & STICKY NAVBAR
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    });
}

function initStickyNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky shadow state
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Tracker
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   3. TYPEWRITER EFFECT (Hero Section)
   ========================================================================== */
function initTypewriter() {
    const typedElement = document.getElementById('typed-text');
    if (!typedElement) return;

    const phrases = [
        "AI Quality Engineering & LLM Evaluation",
        "Playwright • Python Test Automation",
        "Enterprise Quality Systems & CI/CD",
        "Aerospace & High-Reliability Testing",
        "Spatial AI & AR/VR Research (IIT Jodhpur)"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 65;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
        } else {
            typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 65;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2200; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 350; // Pause before new word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   4. PARTICLE CANVAS BACKGROUND (Pure Vanilla Canvas)
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            ctx.fillStyle = isDark 
                ? `rgba(56, 189, 248, ${this.opacity * 0.5})`
                : `rgba(37, 99, 235, ${this.opacity * 0.35})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Spawn particles based on screen width
    const particleCount = Math.min(Math.floor(window.innerWidth / 22), 50);
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and connect particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    ctx.strokeStyle = isDark
                        ? `rgba(56, 189, 248, ${0.12 * (1 - distance / 110)})`
                        : `rgba(37, 99, 235, ${0.08 * (1 - distance / 110)})`;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   5. STATS ANIMATED NUMBER COUNTERS (Intersection Observer)
   ========================================================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10);
                    let current = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.ceil(current);
                        }
                    }, 25);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   7. PROJECT MODAL POPUP (Interactive Deep Dive)
   ========================================================================== */
const projectDetailsData = {
    "genai-pipeline": {
        title: "Enterprise RAG & Conversational LLM Evaluation Pipeline",
        company: "Cognizant GenAI Center of Excellence (CoE)",
        tagline: "Automated Evaluation Framework for Non-Deterministic AI Model Responses",
        overview: "Spearheaded the design and implementation of automated quality gates for enterprise generative AI platforms and conversational assistants. Built evaluation pipelines using the DeepEval framework to mathematically audit LLM outputs against ground-truth corpora.",
        architecture: [
            "<strong>Hallucination & Faithfulness:</strong> Automated calculation of factual consistency between retrieved RAG context and model completions.",
            "<strong>Answer Relevancy & Semantic Distance:</strong> Vector-based semantic similarity scoring using embedding models and cosine distance.",
            "<strong>LLM-as-a-Judge Automation:</strong> Programmatic scoring using Azure OpenAI evaluators with strict JSON schema criteria.",
            "<strong>CI/CD Cloud Integration:</strong> Continuous evaluation gates integrated into Azure DevOps pipelines before model deployment."
        ],
        techStack: ["Python", "DeepEval", "Azure OpenAI", "LLM-as-a-Judge", "Pytest", "Azure DevOps", "NVIDIA NIM", "Poetry"]
    },
    "playwright-framework": {
        title: "Enterprise Playwright-Python-BDD Automation Architecture",
        company: "Cognizant Technology Solutions",
        tagline: "Scalable Cross-Browser End-to-End Automation Platform",
        overview: "Architected a next-generation Python automation framework with Playwright and Pytest-BDD, transitioning legacy test suites to a high-speed, Dockerized architecture.",
        architecture: [
            "<strong>Page Object Model (POM):</strong> Decoupled UI element locators from business logic for zero maintenance overhead.",
            "<strong>Parallel Execution:</strong> Implemented pytest-xdist to run 50+ test workers concurrently across Chromium, Firefox, and WebKit.",
            "<strong>Dockerized Test Runners:</strong> Packaged lightweight headless containers with Allure interactive reporting.",
            "<strong>40% Performance Gain:</strong> Slashed execution runtime by 40% and eliminated UI race-condition flakiness with Playwright auto-waiting."
        ],
        techStack: ["Playwright", "Python", "Pytest-BDD", "Docker", "Allure Reporting", "Azure CI/CD", "Git"]
    },
    "boeing-suite": {
        title: "Aerospace Safety-Critical Automation Suite",
        company: "The Boeing Company",
        tagline: "High-Reliability Regression Testing for Critical Flight Software",
        overview: "Led a team of engineers in developing and maintaining automated test suites for safety-critical aerospace software systems adhering to stringent aviation standards.",
        architecture: [
            "<strong>2,000+ Test Suite:</strong> Architected regression suites covering multi-tier aerospace system integrations.",
            "<strong>Continuous Integration:</strong> Built automated triggers for regression validation upon daily build commits.",
            "<strong>Award Recognition:</strong> Conferred the Boeing Pride Award & Star Award (2019) for exceptional testing quality."
        ],
        techStack: ["Aerospace Systems", "Test Architecture", "Continuous Integration", "Safety-Critical QA", "Regression Engines"]
    },
    "oracle-ebs": {
        title: "Oracle EBS Multi-Module Automated Regression Engine",
        company: "Cognizant Technology Solutions",
        tagline: "Automated Regression for Global Enterprise Platforms",
        overview: "Designed scalable automation frameworks supporting multi-Operating Unit (multi-OU) Oracle EBS execution across AP, AR, PO, CE, and FA modules during CPU patch release cycles.",
        architecture: [
            "<strong>Resilient Execution:</strong> Created runtime persistence, resume-from-failure logic, and automated credential reset.",
            "<strong>TOSCA & UFT POCs:</strong> Delivered input-driven TOSCA automation POCs and presented live demos to global enterprise clients.",
            "<strong>500+ CPU Test Scripts:</strong> Automated multi-tier regression across NTST/NUAT patch cycles with zero unassisted failures."
        ],
        techStack: ["Oracle EBS", "Tricentis Tosca", "HP UFT", "Python Requests", "Docker", "Jira Governance"]
    },
    "arvr-research": {
        title: "Spatial 3D Reconstruction & GANs in Augmented Reality",
        company: "IIT Jodhpur (School of AI & Data Science)",
        tagline: "Postgraduate Academic Research in Spatial AI & Computer Vision",
        overview: "Research in Augmented Reality, 3D point cloud scanning, and Generative Adversarial Networks (GANs) for immersive spatial interaction quality.",
        architecture: [
            "<strong>3D Scanning & Mesh Analysis:</strong> Evaluating point cloud fidelity and real-time spatial anchor tracking.",
            "<strong>Generative Models:</strong> Investigating GAN architectures for texture synthesis and lighting estimation.",
            "<strong>Interactive UX Validation:</strong> Testing human-computer interaction latency and spatial perception."
        ],
        techStack: ["PyTorch", "GANs", "3D Scanning", "AR/VR", "Unity", "Spatial AI"]
    },
    "one-click-capture": {
        title: "One Click Capture Automation & Evidence Utility",
        company: "Accenture LLP",
        tagline: "Enterprise Automation Utility for Tooling Optimization",
        overview: "Conceived, engineered, and deployed an automated multi-screen test evidence logger and defect packaging tool adopted across global delivery teams.",
        architecture: [
            "<strong>Cost Optimization:</strong> Reduced annual third-party licensing expenses by ~$8,000.",
            "<strong>75% Efficiency Gain:</strong> Automated multi-window screenshot capture, timestamping, and Word/PDF defect report compilation.",
            "<strong>Accenture Recognition:</strong> Formally recognized by leadership for innovation and process excellence."
        ],
        techStack: ["VBScript", "Automation Utility", "Process Optimization", "Tooling Innovation"]
    }
};

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const data = projectDetailsData[projectId];

    if (!modal || !data) return;

    modalContent.innerHTML = `
        <span class="project-tag" style="margin-bottom: 0.8rem; display: inline-block;">${data.company}</span>
        <h2 style="font-size: 1.4rem; margin-bottom: 4px;">${data.title}</h2>
        <p style="font-size: 0.88rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 1.2rem;">${data.tagline}</p>
        
        <div style="margin-bottom: 1.2rem;">
            <h4 style="font-size: 0.95rem; margin-bottom: 6px; color: var(--text-primary);">Overview</h4>
            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">${data.overview}</p>
        </div>

        <div style="margin-bottom: 1.4rem;">
            <h4 style="font-size: 0.95rem; margin-bottom: 8px; color: var(--text-primary);">Architecture & Key Contributions</h4>
            <ul style="list-style: none; padding-left: 0;">
                ${data.architecture.map(item => `<li style="position: relative; padding-left: 1.2rem; margin-bottom: 6px; font-size: 0.85rem; color: var(--text-secondary);"><span style="position: absolute; left: 0; color: var(--accent-cyan);">▹</span>${item}</li>`).join('')}
            </ul>
        </div>

        <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
            <h4 style="font-size: 0.85rem; margin-bottom: 8px; color: var(--text-muted);">Technologies Used</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${data.techStack.map(t => `<span style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(56, 189, 248, 0.1); border: 1px solid var(--border-subtle); padding: 3px 8px; border-radius: 4px; color: var(--accent-cyan);">${t}</span>`).join('')}
            </div>
        </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

/* ==========================================================================
   8. BACK TO TOP BUTTON & MOBILE MENU
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        menuBtn.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ==========================================================================
   9. CONTACT FORM & CLIPBOARD COPY UTILITIES
   ========================================================================== */
function handleFormSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
    }

    // Direct mailto trigger
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';
        }
        showToast(`Thank you ${name}! Opening mail client...`);
        
        const mailtoUri = `mailto:debdip1992@outlook.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;
        window.location.href = mailtoUri;

        document.getElementById('contact-form').reset();
        setTimeout(() => {
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';
            }
        }, 3000);
    }, 800);
}

function copyToClipboard(text, buttonElement) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Copied "${text}" to clipboard!`);
            if (buttonElement) {
                const icon = buttonElement.querySelector('i');
                if (icon) {
                    icon.className = 'fa-solid fa-check';
                    setTimeout(() => { icon.className = 'fa-regular fa-copy'; }, 2000);
                }
            }
        });
    } else {
        showToast(`Contact: ${text}`);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

function initCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
