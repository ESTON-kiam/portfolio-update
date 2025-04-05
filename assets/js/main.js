document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', function() {
        preloader.style.display = 'none';
    });

    // Cursor Effect
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.6,
            ease: 'power2.out'
        });
    });
    
    // Hover effects for cursor
    const hoverElements = document.querySelectorAll('a, button, .project-card, .tech-icons i, .social-link, .filter-btn, .tab-btn');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-follower-hover');
        });
        
        el.addEventListener('mouseleave', function() {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-follower-hover');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const navLinkItems = document.querySelectorAll('.nav-link');
    navLinkItems.forEach(item => {
        item.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // Tab Functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Form Submission
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here you would typically send the form data to a server
        // For demonstration, we'll just show an alert
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });

    // Scroll Reveal Animations
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 1000,
        delay: 200,
        reset: true
    });

    sr.reveal('.section-header, .about-image, .about-text, .skills-container, .contact-container', {
        interval: 200
    });

    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-level, .language-item, .info-item');
        
        elements.forEach(el => {
            const elementPosition = el.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                el.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
});



// Animate skill bars and circles on scroll
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-level');
    const circles = document.querySelectorAll('.progress-ring-circle');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        bar.style.width = level;
    });
    
    circles.forEach(circle => {
        const circleParent = circle.closest('.circle-progress');
        const value = circleParent.getAttribute('data-value');
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (value / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = 'var(--primary-color)';
    });
}

// Call this function when skills section is in view
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    skillsObserver.observe(skillsSection);
}




document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    
    // Validate form
    if (!validateForm(form)) return;
    
    // UI Loading state
    form.classList.add('is-submitting');
    
    try {
      // Prepare form data for Netlify
      const formData = new FormData(form);
      formData.append('form-name', 'contact');
      
      // Submit to Netlify
      await fetch('/', {
        method: 'POST',
        body: new URLSearchParams(formData).toString(),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      // Show success
      form.classList.remove('is-submitting');
      form.classList.add('is-success');
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error sending your message. Please try again later.');
      form.classList.remove('is-submitting');
    }
  });
  
  function validateForm(form) {
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.input-group').forEach(group => {
      group.classList.remove('invalid');
    });
    
    // Validate each required field
    form.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.input-group');
      const error = group.querySelector('.error-message');
      
      if (!field.value.trim()) {
        group.classList.add('invalid');
        error.textContent = 'This field is required';
        isValid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        group.classList.add('invalid');
        error.textContent = 'Please enter a valid email';
        isValid = false;
      } else if (field.minLength > 0 && field.value.length < field.minLength) {
        group.classList.add('invalid');
        error.textContent = `Minimum ${field.minLength} characters required`;
        isValid = false;
      }
    });
    
    return isValid;
  }