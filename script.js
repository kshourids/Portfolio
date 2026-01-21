// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scroll for anchor links (fallback if CSS smooth-scroll isn't enough for some browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before element enters view
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // observer.unobserve(entry.target); // Keep observing if you want re-trigger, or unobserve for one-time
        }
    });
};

const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

// Target all elements we want to animate
const animatedElements = document.querySelectorAll(
    '.glass-card, .bento-item, .skill-card, .timeline-item, .project-card, .section-title'
);

animatedElements.forEach(el => {
    scrollObserver.observe(el);
});

// Cursor Glow Effect
const cursorGlow = document.querySelector('.cursor-glow');
cursorGlow.style.background = 'radial-gradient(circle, rgba(90, 0, 200, 0.5) 0%, rgba(0, 150, 200, 0.4) 40%, transparent 70%)';

document.addEventListener('mousemove', (e) => {
    // Determine mouse position
    const x = e.clientX;
    const y = e.clientY;

    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
        cursorGlow.style.left = `${x}px`;
        cursorGlow.style.top = `${y}px`;

        // Parallax Effect
        document.querySelectorAll("[data-speed]").forEach(layer => {
            const speed = layer.getAttribute("data-speed");
            const xOffset = (window.innerWidth - x * speed) / 100;
            const yOffset = (window.innerHeight - y * speed) / 100;

            layer.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px)`;
        });
    });
});

// Optional: Enhance glow when hovering over interactive elements
// Optional: Enhance glow when hovering over interactive elements
document.querySelectorAll('a, button, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.width = '800px';
        cursorGlow.style.height = '800px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(90, 0, 200, 0.6) 0%, rgba(0, 150, 200, 0.5) 40%, transparent 70%)';
    });

    el.addEventListener('mouseleave', () => {
        cursorGlow.style.width = '600px';
        cursorGlow.style.height = '600px';
        cursorGlow.style.background = 'radial-gradient(circle, rgba(90, 0, 200, 0.5) 0%, rgba(0, 150, 200, 0.4) 40%, transparent 70%)';
    });
});

// Magnetic Buttons Effect
const magneticButtons = document.querySelectorAll('.btn, .glass-card');
magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Intensity of magnetic pull
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        // Reset check incase transition was removed
        btn.style.transition = 'transform 0.3s ease';
    });
});
// Code Compiling / Scramble Animation
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

function scrambleText(element) {
    // If element has child nodes, traverse them (to handle spans, strongs, etc.)
    if (element.children.length > 0) {
        Array.from(element.children).forEach(child => scrambleText(child));
        // Also handle direct text nodes mixed with tags
        Array.from(element.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                animateTextNode(node);
            }
        });
        return;
    }
    // If it's a leaf element (or just text), animate it
    if (element.textContent.trim().length > 0) {
        animateElement(element);
    }
}



function animateTextNode(node) {
    // Basic nodes can't easily store dataset without wrapper, skip strict check or assume parent handles
    const originalText = node.textContent;
    let iterations = 0;

    const interval = setInterval(() => {
        node.textContent = originalText
            .split("")
            .map((letter, index) => {
                if (index < iterations) return originalText[index];
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if (iterations >= originalText.length) clearInterval(interval);
        iterations += 2; // Speed (Very Fast)
    }, 30);
}

function animateElement(element) {
    if (element.dataset.animating === "true") return;
    element.dataset.animating = "true";

    const originalText = element.textContent;
    element.dataset.value = originalText;

    let iterations = 0;

    const interval = setInterval(() => {
        element.textContent = originalText
            .split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if (iterations >= originalText.length) {
            clearInterval(interval);
            element.dataset.animating = "false";
        }

        iterations += 2; // Speed (Very Fast)
    }, 30);
}

// Trigger Scramble on Load for Hero and Navbar
window.addEventListener('load', () => {
    // Target main text elements
    const targets = document.querySelectorAll(
        '.hero-content h1, .hero-content h2, .hero-content p, .nav-links a, .section-title'
    );

    targets.forEach(el => {
        // Ensure visibility if hidden by CSS
        el.style.opacity = '1';
        el.style.transform = 'none'; // precise placement

        // Slightly delay each for a "compiling" feel
        scrambleText(el);


    });
});

// Rain Effect Logic - ADJUSTED FOR LIGHT RAIN
function createRain() {
    const rainContainer = document.querySelector('.rain-container');
    if (!rainContainer) return;

    const dropCount = 50; // Light Rain (Reduced from 400)

    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.classList.add('rain-drop');

        // Random Position
        drop.style.left = Math.random() * 100 + 'vw';

        // Slower speed for light rain
        drop.style.animationDuration = Math.random() * 1 + 1 + 's'; // 1s to 2s
        drop.style.animationDelay = Math.random() * -2 + 's'; // Negative delay for instant start

        rainContainer.appendChild(drop);
    }
}

createRain();

// Drip Effect on specific elements
function createDrips() {
    // Select all relevant text/container elements
    const targets = document.querySelectorAll('h1, h2, h3, h4, p, a, span, .glass-card, .profile-img-container');

    // Ensure they can position drops relatively
    targets.forEach(t => {
        if (window.getComputedStyle(t).position === 'static') {
            t.style.position = 'relative';
        }
    });

    // Single interval for the entire page to manage performance
    setInterval(() => {
        // Pick a random visible element
        const visibleTargets = Array.from(targets).filter(t => {
            const rect = t.getBoundingClientRect();
            // Only drip on elements currently in viewport to save resources
            return rect.top >= -100 && rect.bottom <= (window.innerHeight + 100);
        });

        if (visibleTargets.length === 0) return;

        const target = visibleTargets[Math.floor(Math.random() * visibleTargets.length)];

        const drip = document.createElement('div');
        drip.classList.add('drip');

        // Random X position within element width
        const rect = target.getBoundingClientRect();
        const randomX = Math.random() * rect.width;

        drip.style.left = randomX + 'px';
        drip.style.top = '0px';

        // Random duration
        drip.style.animation = `dripFall ${Math.random() * 2 + 2}s linear`;

        target.appendChild(drip);

        // Clean up
        setTimeout(() => {
            drip.remove();
        }, 4000);
    }, 100); // Spawn a drop somewhere on screen every 100ms
}

createDrips();
