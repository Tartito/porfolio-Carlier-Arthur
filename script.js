console.log("🚀 Page Projets - Arthur Carlier");

document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript chargé avec succès !");
    
    // Initialisation de toutes les fonctions
    setupScrollProgress();
    setupCursor();
    animateStats();
    setupProjectFilters();
    setupRippleEffects();
    
    console.log("✅ Toutes les fonctions initialisées !");
});

// ========== BARRE DE PROGRESSION DU SCROLL ==========
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

// ========== CURSEUR PERSONNALISÉ ==========
function setupCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.innerWidth <= 768) {
        if (cursor) cursor.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Effets hover
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.opacity = '0.8';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.opacity = '0.6';
        });
    });
}

// ========== ANIMATION DES STATISTIQUES ==========
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
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

// ========== SYSTÈME DE FILTRAGE DES PROJETS ==========
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projects-grid');

    console.log("Boutons de filtre trouvés:", filterButtons.length);
    console.log("Cartes de projets trouvées:", projectCards.length);

    if (filterButtons.length === 0 || projectCards.length === 0) {
        console.warn("Éléments de filtrage manquants !");
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filterValue = this.getAttribute('data-filter');
            console.log("Filtre sélectionné:", filterValue);
            
            // Effet ripple sur le bouton
            createRippleEffect(this, e);
            
            // Gérer les classes active
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
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
        if (!categoryAttr) {
            console.warn("Carte sans attribut data-category:", card);
            return;
        }
        
        const categories = categoryAttr.split(' ');
        const shouldShow = filterValue === 'all' || categories.includes(filterValue);
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.5s ease';
            
            // Animation d'apparition avec délai
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, visibleCount * 100);
            
            visibleCount++;
        } else {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    console.log(`${visibleCount} projets affichés pour le filtre: ${filterValue}`);
}

// ========== EFFETS DE RIPPLE ==========
function setupRippleEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Ne pas créer de ripple si on clique sur un lien
            if (e.target.closest('a')) return;
            
            createRippleEffect(this, e);
        });
    });
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(100, 255, 218, 0.3);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        pointer-events: none;
        z-index: 1;
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

// ========== STYLES CSS POUR LES ANIMATIONS ==========
// Ajouter les keyframes pour l'effet ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        background: #64ffda;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.6;
        mix-blend-mode: difference;
        transition: all 0.1s ease;
        transform: translate(-50%, -50%);
    }
    
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #64ffda, #4fd1c7);
        z-index: 10000;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
    }
    
    .projects-grid.loading {
        opacity: 0.6;
        transition: opacity 0.2s ease;
    }
    
    .projects-grid.loading .project-card {
        transform: scale(0.98);
        transition: transform 0.2s ease;
    }
    
    @media (max-width: 768px) {
        .cursor {
            display: none !important;
        }
    }
`;
document.head.appendChild(style);

// ========== GESTION DES ERREURS ==========
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript détectée:', e.error);
});

// ========== MESSAGE CONSOLE POUR LES DÉVELOPPEURS ==========
setTimeout(() => {
    console.log(`
    %c🎯 Page Projets - Arthur Carlier
    %cTu explores mes créations ? Génial !
    %cChaque projet raconte une histoire d'apprentissage et de passion pour le code.
    %c
    Envie de collaborer ? a.carlier2004@outlook.fr
    `, 
    'font-size: 16px; color: #64ffda; font-weight: bold;',
    'font-size: 14px; color: #a8b2d1;',
    'font-size: 14px; color: #a8b2d1;',
    'font-size: 12px; color: #8892b0;'
    );
}, 1000);