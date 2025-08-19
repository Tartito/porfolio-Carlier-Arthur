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
    setupProjectImageAnimations(); // Nouvelle fonction pour les animations d'images
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
    const interactiveElements = document.querySelectorAll('a, button, .project, .other-project, .project-card, .project-image');
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
    
    let ticking = false;
    
    function updateProgress() {
        const scrolled = window.scrollY;
        const maxHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        progressBar.style.width = progress + '%';
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    });
}

// Navigation
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
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
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                    
                    // Animation spéciale pour les éléments de timeline
                    if (entry.target.classList.contains('timeline-item')) {
                        entry.target.style.transform = 'translateX(0)';
                        entry.target.style.opacity = '1';
                    }
                    
                    // Animation spéciale pour les projets
                    if (entry.target.classList.contains('project')) {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observer tous les éléments animés
    document.querySelectorAll('.fade-up, .timeline-item, .project, .certification-card').forEach(el => {
        observer.observe(el);
    });
}

// NOUVELLE FONCTION : Animation spéciale pour les images de projets (simple zoom)
function setupProjectImageAnimations() {
    const projectImages = document.querySelectorAll('.project-image a');
    const projects = document.querySelectorAll('.project');
    
    projectImages.forEach(imageLink => {
        const img = imageLink.querySelector('img');
        if (!img) return;
        
        // Configuration initiale
        img.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Événements de survol
        imageLink.addEventListener('mouseenter', () => {
            // Simple zoom et amélioration de la luminosité
            img.style.transform = 'scale(1.08)';
            img.style.filter = 'brightness(1.1) contrast(1.05)';
        });
        
        imageLink.addEventListener('mouseleave', () => {
            // Retour à l'état normal
            img.style.transform = 'scale(1)';
            img.style.filter = 'none';
        });
    });
    
    // Effet de survol global sur tout le projet
    projects.forEach(project => {
        project.addEventListener('mouseenter', () => {
            // Animer tous les éléments enfants
            const title = project.querySelector('.project-title');
            const description = project.querySelector('.project-description');
            const techList = project.querySelector('.project-tech-list');
            const links = project.querySelector('.project-links');
            
            if (title) {
                title.style.transform = 'translateY(-2px)';
                title.style.color = 'var(--white)';
            }
            
            if (description) {
                description.style.transform = 'translateY(-3px)';
                description.style.background = 'rgba(17, 34, 64, 0.95)';
            }
            
            if (techList) {
                const techItems = techList.querySelectorAll('li');
                techItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.transform = 'translateY(-2px)';
                        item.style.color = 'var(--green)';
                    }, index * 50);
                });
            }
            
            if (links) {
                links.style.transform = 'translateY(-2px)';
            }
        });
        
        project.addEventListener('mouseleave', () => {
            // Retour à l'état normal
            const title = project.querySelector('.project-title');
            const description = project.querySelector('.project-description');
            const techList = project.querySelector('.project-tech-list');
            const links = project.querySelector('.project-links');
            
            if (title) {
                title.style.transform = 'translateY(0)';
                title.style.color = 'var(--lightest-slate)';
            }
            
            if (description) {
                description.style.transform = 'translateY(0)';
                description.style.background = 'rgba(17, 34, 64, 0.9)';
            }
            
            if (techList) {
                const techItems = techList.querySelectorAll('li');
                techItems.forEach(item => {
                    item.style.transform = 'translateY(0)';
                    item.style.color = 'var(--light-slate)';
                });
            }
            
            if (links) {
                links.style.transform = 'translateY(0)';
            }
        });
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
                const isLightMode = document.body.classList.contains('light-mode');
                document.body.classList.toggle('light-mode');
                
                // Message selon l'état
                if (!isLightMode) {
                    showTemporaryMessage('Mode clair activé ! ☀️', 3000);
                    
                    // Effet de transition fluide
                    document.body.style.transition = 'all 0.5s ease';
                } else {
                    showTemporaryMessage('Mode sombre activé ! 🌙', 3000);
                    
                    // Effet de transition fluide
                    document.body.style.transition = 'all 0.5s ease';
                }
                
                logoClickCount = 0;
                
                // Sauvegarder la préférence
                localStorage.setItem('theme-preference', !isLightMode ? 'light' : 'dark');
            }
            
            setTimeout(() => {
                logoClickCount = 0;
            }, 2000);
        });
    }

    // Effets de particules sur les clics
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn, .project-links a, .project-link')) {
            createClickParticles(e.clientX, e.clientY);
        }
    });
}

// Fonction pour afficher des messages temporaires
function showTemporaryMessage(text, duration = 3000) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--green);
        color: var(--navy);
        padding: 15px 20px;
        border-radius: 8px;
        font-family: var(--font-mono);
        font-size: 14px;
        font-weight: bold;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        box-shadow: var(--shadow);
    `;
    message.textContent = text;
    document.body.appendChild(message);
    
    // Animation d'entrée
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateX(0)';
    }, 100);
    
    // Animation de sortie
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 300);
    }, duration);
}

// Activation de l'easter egg
function activateEasterEgg() {
    document.body.style.filter = 'hue-rotate(90deg) saturate(1.5)';
    
    showTemporaryMessage('Easter egg trouvé ! 🎉');
    
    // Créer des particules spéciales
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createClickParticles(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }, i * 100);
    }
    
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 3000);
}

// Créer des particules au clic - Version améliorée
function createClickParticles(x, y) {
    const particleCount = window.innerWidth <= 768 ? 3 : 6; // Moins de particules sur mobile
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: var(--green);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${x}px;
            top: ${y}px;
            opacity: 1;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = window.innerWidth <= 768 ? 80 : 100; // Vitesse réduite sur mobile
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
    const toggleArrow = toggleButton ? toggleButton.querySelector('.toggle-arrow') : null;
    
    if (!skillsList || !toggleButton || !toggleText) return;
    
    if (skillsList.classList.contains('expanded')) {
        skillsList.classList.remove('expanded');
        toggleButton.classList.remove('expanded');
        toggleText.textContent = 'Voir plus';
        if (toggleArrow) toggleArrow.textContent = '▶';
    } else {
        skillsList.classList.add('expanded');
        toggleButton.classList.add('expanded');
        toggleText.textContent = 'Voir moins';
        if (toggleArrow) toggleArrow.textContent = '▼';
        
        // Animation des nouvelles compétences
        const hiddenSkills = skillsList.querySelectorAll('.hidden-skill');
        hiddenSkills.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.opacity = '1';
                skill.style.transform = 'translateY(0)';
            }, index * 100);
        });
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

// Effet ripple pour les boutons - Version améliorée
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
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (element.contains(ripple)) {
            element.removeChild(ripple);
        }
    }, 600);
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
            overlay.innerHTML = `
                <div style="
                    position: absolute; 
                    top: 50%; 
                    left: 50%; 
                    transform: translate(-50%, -50%); 
                    color: var(--green); 
                    font-family: var(--font-mono); 
                    font-size: clamp(18px, 5vw, 24px);
                    text-align: center;
                ">
                    <div style="margin-bottom: 20px;">Chargement...</div>
                    <div style="width: 50px; height: 3px; background: var(--green); margin: 0 auto; animation: pulse 1s ease-in-out infinite;"></div>
                </div>
            `;
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
    if (window.innerWidth > 768) return; // Seulement sur mobile
    
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - scroll vers le bas
                window.scrollBy({
                    top: 200,
                    behavior: 'smooth'
                });
            } else {
                // Swipe down - scroll vers le haut
                window.scrollBy({
                    top: -200,
                    behavior: 'smooth'
                });
            }
        }
    }
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

// Lazy loading pour les images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Animation d'apparition
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.95)';
                    img.style.transition = 'all 0.6s ease';
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.style.transform = 'scale(1)';
                    }, 100);
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.project-img, .img').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Console message pour les développeurs
function setupConsoleMessage() {
    const messages = [
        '%c👋 Salut fellow developer!',
        '%cTu inspectes le code d\'Arthur ? Cool !',
        '%cSi tu as des questions ou des conseils, n\'hésite pas : a.carlier2004@outlook.fr',
        '%cPortfolio développé avec ❤️ à Metz'
    ];
    
    const styles = [
        'font-size: 16px; color: #64ffda; font-weight: bold;',
        'font-size: 14px; color: #a8b2d1;',
        'font-size: 14px; color: #a8b2d1;',
        'font-size: 12px; color: #8892b0;'
    ];
    
    messages.forEach((message, index) => {
        console.log(message, styles[index]);
    });
    
    // Easter egg dans la console
    console.log('%cPssst... Essaie le code Konami : ↑ ↑ ↓ ↓ ← → ← → B A', 'font-size: 10px; color: #64ffda; font-style: italic;');
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
    // Respecter les préférences de mouvement réduit
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-smooth', 'none');
        
        // Supprimer les particules
        const particles = document.getElementById('bg-particles');
        if (particles) {
            particles.style.display = 'none';
        }
        
        // Désactiver les animations CSS
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Gestion des thèmes
function setupThemeToggle() {
    // Charger la préférence sauvegardée
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.body.style.transition = 'all 0.5s ease';
    }
    
    // Détecter le thème système
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Écouter les changements de préférence système
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches && !document.body.classList.contains('light-mode')) {
                // L'utilisateur préfère le mode sombre et on n'est pas en mode clair forcé
                showTemporaryMessage('Mode sombre système détecté 🌙');
            }
        });
    }
}

// Animation des statistiques pour la page projets
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
    ripple.style.cssText = `
        position: absolute; 
        border-radius: 50%; 
        background: rgba(100, 255, 218, 0.3); 
        transform: scale(0); 
        animation: ripple-effect 0.6s linear; 
        pointer-events: none;
    `;
    
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

// Fonction d'optimisation des performances
function optimizePerformance() {
    // Préchargement des images importantes
    const importantImages = [
        'photo/Img_Arthur.png',
        'photo/imageCyna.png',
        'photo/MatchIt.png'
    ];
    
    importantImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Intersection Observer pour les animations coûteuses
    const expensiveAnimations = document.querySelectorAll('.project-image, .about-pic');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '50px'
    });
    
    expensiveAnimations.forEach(el => {
        animationObserver.observe(el);
    });
}

// Gestion des événements redimensionnement
function setupResizeHandler() {
    let resizeTimer;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        
        resizeTimer = setTimeout(() => {
            // Recréer les particules si nécessaire
            if (window.innerWidth > 768) {
                const particlesContainer = document.getElementById('bg-particles');
                if (particlesContainer && particlesContainer.children.length === 0) {
                    createParticles();
                }
            }
            
            // Réinitialiser le curseur
            setupCursor();
            
            // Réajuster les animations tactiles
            if (window.innerWidth <= 768) {
                setupTouchInteractions();
            }
        }, 250);
    });
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
    initProjectsPage();
    optimizePerformance();
    setupResizeHandler();
    
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
    
    // Message de bienvenue après chargement complet
    setTimeout(() => {
        if (!sessionStorage.getItem('welcome-shown')) {
            showTemporaryMessage('Bienvenue sur mon portfolio ! 👋', 4000);
            sessionStorage.setItem('welcome-shown', 'true');
        }
    }, 3000);
});

// Fonctions globales disponibles dans le HTML
window.toggleSkills = toggleSkills;
window.showJob = showJob;

// Ajout des styles CSS manquants via JavaScript
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes ripple-effect { 
        to { transform: scale(4); opacity: 0; } 
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .project-image img,
    .about-pic img {
        transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .cursor { display: none !important; }
        .bg-particles { display: none !important; }
        .particle { display: none !important; }
        
        .hero-title::after { display: none !important; }
        
        .fixed-social,
        .fixed-email { display: none !important; }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .cursor { display: none !important; }
        .bg-particles { display: none !important; }
        .particle { display: none !important; }
    }
`;
document.head.appendChild(additionalStyles);