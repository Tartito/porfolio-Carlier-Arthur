// Variables globales
let mouseX = 0, mouseY = 0;
let isLoaded = false;

// Fonction d'initialisation
function init() {
    createParticles();
    setupCursor();
    setupScrollProgress();
    setupNavigation();
    setupAnimations();
    setupEasterEggs();
    hideLoader();
}

// Créer les particules d'arrière-plan
function createParticles() {
    const particlesContainer = document.getElementById('bg-particles');
    if (!particlesContainer || window.innerWidth <= 768) return; // Pas de particules sur mobile ou si pas de conteneur
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 6) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Configuration du curseur personnalisé
function setupCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.innerWidth <= 768) {
        if (cursor) cursor.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Effets hover sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .project, .other-project, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Barre de progression du scroll
function setupScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Navigation
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations au scroll
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
}

// Easter eggs et effets spéciaux
function setupEasterEggs() {
    // Konami code
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Clic sur le logo pour mode alternatif
    let logoClickCount = 0;
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            logoClickCount++;
            
            if (logoClickCount === 5) {
                document.body.classList.toggle('light-mode');
                logoClickCount = 0;
            }
            
            setTimeout(() => {
                logoClickCount = 0;
            }, 2000);
        });
    }

    // Effets de particules sur les clics
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn, .project-links a')) {
            createClickParticles(e.clientX, e.clientY);
        }
    });
}

// Activation de l'easter egg
function activateEasterEgg() {
    document.body.style.filter = 'hue-rotate(90deg) saturate(1.5)';
    
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #64ffda; color: #0a192f; padding: 20px; border-radius: 10px; font-family: monospace; font-weight: bold; z-index: 10000; opacity: 0; transition: opacity 0.3s ease;';
    message.textContent = 'Easter egg trouvé ! 🎉';
    document.body.appendChild(message);
    
    setTimeout(() => message.style.opacity = '1', 100);
    setTimeout(() => {
        document.body.style.filter = 'none';
        message.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 300);
    }, 3000);
}

// Créer des particules au clic
function createClickParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = 'position: fixed; width: 4px; height: 4px; background: #64ffda; border-radius: 50%; pointer-events: none; z-index: 9999; left: ' + x + 'px; top: ' + y + 'px; opacity: 1;';
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let startTime = Date.now();
        
        function animateParticle() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 1000;
            
            if (progress < 1) {
                const currentX = x + (vx * progress);
                const currentY = y + (vy * progress) + (200 * progress * progress);
                const opacity = 1 - progress;
                
                particle.style.left = currentX + 'px';
                particle.style.top = currentY + 'px';
                particle.style.opacity = opacity;
                
                requestAnimationFrame(animateParticle);
            } else {
                if (document.body.contains(particle)) {
                    document.body.removeChild(particle);
                }
            }
        }
        
        animateParticle();
    }
}

// Masquer le loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    
    setTimeout(() => {
        loader.classList.add('fade-out');
        isLoaded = true;
    }, 1500);
    
    setTimeout(() => {
        loader.style.display = 'none';
    }, 2000);
}

// Fonctions de gestion des skills
function toggleSkills() {
    const skillsList = document.getElementById('skills-list');
    const toggleButton = document.getElementById('skills-toggle');
    const toggleText = toggleButton ? toggleButton.querySelector('.toggle-text') : null;
    
    if (!skillsList || !toggleButton || !toggleText) return;
    
    if (skillsList.classList.contains('expanded')) {
        skillsList.classList.remove('expanded');
        toggleButton.classList.remove('expanded');
        toggleText.textContent = 'Voir plus';
    } else {
        skillsList.classList.add('expanded');
        toggleButton.classList.add('expanded');
        toggleText.textContent = 'Voir moins';
    }
}

// Gestion des onglets d'expérience
function showJob(jobIndex) {
    // Cacher tous les panneaux
    document.querySelectorAll('.job-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Retirer la classe active de tous les onglets
    document.querySelectorAll('.job-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Afficher le panneau sélectionné
    const selectedPanel = document.getElementById('job-' + jobIndex);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Ajouter la classe active à l'onglet sélectionné
    const selectedTab = document.querySelectorAll('.job-tab')[jobIndex];
    if (selectedTab) {
        selectedTab.classList.add('active');
        // Effet ripple
        createRippleEffect(selectedTab, event);
    }
}

// Effet ripple pour les boutons
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
    const y = event ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (element.contains(ripple)) {
            element.removeChild(ripple);
        }
    }, 600);
}

// Effet de typing pour le titre
function typeWriter(element, text, speed) {
    speed = speed || 100;
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Supprimer le curseur clignotant après l'animation
            setTimeout(() => {
                const cursor = element.querySelector('::after');
                if (cursor) {
                    element.style.position = 'relative';
                }
            }, 2000);
        }
    }
    
    type();
}

// Performance monitoring
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    const loadTime = navigation.loadEventEnd;
                    if (loadTime < 2000) {
                        console.log('🚀 Site chargé rapidement:', Math.round(loadTime), 'ms');
                    }
                }
            }, 100);
        });
    }
}

// Lazy loading pour les images de projets
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.project-img').forEach(img => {
            img.style.opacity = '0.8';
            img.style.transform = 'scale(0.95)';
            img.style.transition = 'all 0.6s ease';
            imageObserver.observe(img);
        });
    }
}

// Gestion des thèmes
function setupThemeToggle() {
    // Détection du thème système
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        // L'utilisateur préfère le mode clair, mais on garde le mode sombre par défaut
    }

    // Écouter les changements de préférence système
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches) {
                document.body.classList.remove('light-mode');
            }
        });
    }
}

// Console message pour les développeurs
function setupConsoleMessage() {
    console.log('%c👋 Salut fellow developer!', 'font-size: 16px; color: #64ffda; font-weight: bold;');
    console.log('%cTu inspectes le code d\'Arthur ? Cool !', 'font-size: 14px; color: #a8b2d1;');
    console.log('%cSi tu as des questions ou des conseils, n\'hésite pas : a.carlier2004@outlook.fr', 'font-size: 14px; color: #a8b2d1;');
    console.log('%cPortfolio développé avec ❤️ à Metz', 'font-size: 12px; color: #8892b0;');
}

// Gestion des erreurs globales
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Erreur détectée:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise rejetée:', e.reason);
    });
}

// Optimisation des animations selon les préférences utilisateur
function setupAccessibility() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Réduire les animations pour les utilisateurs qui le préfèrent
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-smooth', 'none');
        
        // Supprimer les particules
        const particles = document.getElementById('bg-particles');
        if (particles) {
            particles.style.display = 'none';
        }
    }
}

// Gestion des transitions entre pages
function setupPageTransitions() {
    const allProjectsLinks = document.querySelectorAll('a[href="./projects.html"], a[href="projects.html"]');
    
    allProjectsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Créer l'overlay de transition
            const overlay = document.createElement('div');
            overlay.className = 'page-transition';
            overlay.innerHTML = '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #64ffda; font-family: monospace; font-size: 24px;">Chargement...</div>';
            document.body.appendChild(overlay);
            
            // Activer la transition
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            
            // Naviguer vers la nouvelle page
            setTimeout(() => {
                window.location.href = 'projects.html';
            }, 300);
        });
    });
}

// Gestion des interactions tactiles pour mobile
function setupTouchInteractions() {
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - scroll vers le bas
                window.scrollBy(0, 200);
            } else {
                // Swipe down - scroll vers le haut
                window.scrollBy(0, -200);
            }
        }
    }
}

// Optimisation pour les performances
let ticking = false;

function updateScrollEffects() {
    // Mise à jour de la barre de progression
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        const scrolled = window.scrollY;
        const maxHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    // Mise à jour de la navbar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    ticking = false;
}

// Animation des statistiques de la page projets
function animateProjectStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return; // Pas sur la page projets
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateNumber(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 50);
    const duration = 1500;
    const stepTime = Math.floor(duration / 50);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, stepTime);
}

// Système de filtrage des projets
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projects-grid');

    if (filterButtons.length === 0) return; // Pas sur la page projets

    console.log('Boutons de filtre trouvés:', filterButtons.length);
    console.log('Cartes de projets trouvées:', projectCards.length);

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Effet ripple sur le bouton
            createProjectRippleEffect(button, e);
            
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            console.log('Filtre sélectionné:', filterValue);
            
            // Ajouter effet de chargement
            if (projectsGrid) {
                projectsGrid.classList.add('loading');
            }
            
            setTimeout(() => {
                filterProjects(filterValue, projectCards);
                if (projectsGrid) {
                    projectsGrid.classList.remove('loading');
                }
            }, 200);
        });
    });

    // Afficher toutes les cartes au départ
    setTimeout(() => {
        filterProjects('all', projectCards);
    }, 100);
}

function filterProjects(filterValue, projectCards) {
    let visibleCount = 0;
    
    projectCards.forEach(card => {
        const categoryAttr = card.getAttribute('data-category');
        if (!categoryAttr) return;
        
        const categories = categoryAttr.split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.5s ease';
            
            // Animation d'apparition avec délai progressif
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, visibleCount * 100);
            
            visibleCount++;
        } else {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-30px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    console.log(visibleCount + ' projets affichés pour le filtre: ' + filterValue);
}

// Effet de ripple spécifique aux projets
function createProjectRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.style.cssText = 'position: absolute; border-radius: 50%; background: rgba(100, 255, 218, 0.3); transform: scale(0); animation: ripple-effect 0.6s linear; pointer-events: none;';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
    const y = event ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (element.contains(ripple)) {
            element.removeChild(ripple);
        }
    }, 600);
}

// Effet de ripple sur les cartes de projets
function setupProjectRippleEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Ne pas créer de ripple si on clique sur un lien
            if (e.target.closest('a')) return;
            
            createProjectRippleEffect(this, e);
        });
    });
}

// Initialisation spécifique à la page projets
function initProjectsPage() {
    // Vérifier si on est sur la page projets
    const isProjectsPage = document.querySelector('.projects-stats') || document.querySelector('.project-filters');
    
    if (isProjectsPage) {
        animateProjectStats();
        setupProjectFilters();
        setupProjectRippleEffects();
        
        // Message spécial pour la page projets
        console.log('%c🚀 Page Projets - Arthur Carlier', 'font-size: 16px; color: #64ffda; font-weight: bold;');
        console.log('%cTu explores mes créations ? Génial !', 'font-size: 14px; color: #a8b2d1;');
        console.log('%cChaque projet raconte une histoire d\'apprentissage et de passion pour le code.', 'font-size: 14px; color: #a8b2d1;');
        console.log('%cEnvie de collaborer ? a.carlier2004@outlook.fr', 'font-size: 12px; color: #8892b0;');
    }
}

// Initialisation complète au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupPerformanceMonitoring();
    setupLazyLoading();
    setupThemeToggle();
    setupConsoleMessage();
    setupErrorHandling();
    setupAccessibility();
    setupPageTransitions();
    initProjectsPage(); // Initialisation spéciale pour la page projets
    
    // Configuration pour mobile
    if (window.innerWidth <= 768) {
        setupTouchInteractions();
    }
});

// Événements de chargement
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Démarrer l'effet de typing après le chargement
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !heroTitle.classList.contains('typed')) {
            heroTitle.classList.add('typed');
        }
    }, 2000);
});

// Optimisation des événements de scroll
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
});

// Fonctions globales disponibles dans le HTML
window.toggleSkills = toggleSkills;
window.showJob = showJob;

// Ajout des styles CSS pour les animations et effets
const style = document.createElement('style');
style.textContent = '@keyframes ripple-effect { to { transform: scale(4); opacity: 0; } } .cursor { position: fixed; width: 20px; height: 20px; background: #64ffda; border-radius: 50%; pointer-events: none; z-index: 9999; opacity: 0.6; mix-blend-mode: difference; transition: all 0.1s ease; transform: translate(-50%, -50%); } .cursor.hover { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; } .scroll-progress { position: fixed; top: 0; left: 0; width: 0%; height: 3px; background: linear-gradient(90deg, #64ffda, #4fd1c7); z-index: 10000; transition: width 0.1s ease; box-shadow: 0 0 10px rgba(100, 255, 218, 0.5); } .projects-grid.loading { opacity: 0.6; transition: opacity 0.2s ease; } .projects-grid.loading .project-card { transform: scale(0.98); transition: transform 0.2s ease; } .page-transition { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a192f; z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; } .page-transition.active { opacity: 1; pointer-events: all; } .particle { position: absolute; width: 2px; height: 2px; background: #64ffda; border-radius: 50%; opacity: 0.3; animation: float 6s ease-in-out infinite; } @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; } 50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; } } .ripple { position: absolute; background: #64ffda; border-radius: 50%; transform: scale(0); animation: ripple 0.6s linear; pointer-events: none; } @keyframes ripple { to { transform: scale(4); opacity: 0; } } .fade-out { opacity: 0; transition: opacity 0.5s ease; } .loader { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0a192f; display: flex; justify-content: center; align-items: center; z-index: 10000; transition: opacity 0.5s ease; } .loader.fade-out { opacity: 0; pointer-events: none; } .light-mode { --navy: #ffffff; --light-navy: #f8fafc; --lightest-navy: #e2e8f0; --slate: #475569; --light-slate: #334155; --lightest-slate: #1e293b; } @media (max-width: 768px) { .cursor { display: none !important; } .particle { display: none; } }';
document.head.appendChild(style);