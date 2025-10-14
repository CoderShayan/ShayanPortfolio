document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     HEADER hide/reveal on scroll - OPTIMIZED
  ========================== */
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  let scrollTimeout;

  const handleScroll = () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;
    
    // Clear existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    // Hide header when scrolling down, show when scrolling up
    if (current > lastScroll && current > 100) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    lastScroll = current <= 0 ? 0 : current;

    // Scroll progress bar
    const progress = document.getElementById('scroll-progress');
    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = Math.min((window.scrollY / docHeight) * 100, 100);
      progress.style.width = `${scrolled}%`;
    }

    // Add scroll class for additional styling
    if (current > 50) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  };

  // Throttled scroll handler
  window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null;
      }, 10);
    }
  });

  /* =========================
     NAV toggle for mobile - ENHANCED
  ========================== */
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  
  if (navToggle && nav) {
    const toggleNav = () => {
      const isOpening = !nav.classList.contains('open');
      nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      
      // Toggle icon between bars and times
      const icon = navToggle.querySelector('i');
      if (icon) {
        if (isOpening) {
          icon.classList.replace('fa-bars', 'fa-times');
          document.body.style.overflow = 'hidden';
        } else {
          icon.classList.replace('fa-times', 'fa-bars');
          document.body.style.overflow = '';
        }
      }
    };

    navToggle.addEventListener('click', toggleNav);

    // Close mobile nav when clicking on links
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (nav.classList.contains('open')) {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            // Close menu first
            toggleNav();
            
            // Then scroll to target
            setTimeout(() => {
              const headerHeight = header.offsetHeight;
              const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
            }, 300);
          }
        }
      });
    });

    // Close nav when clicking outside on mobile
    if (window.innerWidth <= 768) {
      document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && 
            !nav.contains(e.target) && 
            !navToggle.contains(e.target)) {
          toggleNav();
        }
      });
    }

    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        toggleNav();
      }
    });
  }

  /* =========================
     Stagger hero text animation
  ========================== */
  const staggerEls = document.querySelectorAll('.stagger');
  staggerEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('show');
    }, i * 200);
  });

  /* =========================
     Section reveal on scroll - OPTIMIZED
  ========================== */
  const revealEls = document.querySelectorAll('.reveal');
  const cardAnimatedEls = document.querySelectorAll('.card-animated');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('show');
        }, index * 150);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealEls.forEach(el => revealObserver.observe(el));
  cardAnimatedEls.forEach(el => cardObserver.observe(el));

  /* =========================
     SKILLS AUTO-SCROLL & HIGHLIGHT - COMPLETE FEATURE
  ========================== */
  const skillsScroll = document.getElementById('skills-scroll');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillDots = document.querySelectorAll('.skill-dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (skillsScroll && skillCards.length > 0) {
    let currentSkillIndex = 0;
    let autoScrollInterval;
    let isUserInteracting = false;
    let interactionTimeout;

    // Initialize skills
    updateSkillHighlight();
    startAutoScroll();

    // Function to scroll to specific skill
    const scrollToSkill = (index) => {
      if (index < 0) index = skillCards.length - 1;
      if (index >= skillCards.length) index = 0;
      
      currentSkillIndex = index;
      
      const skillCard = skillCards[index];
      const scrollLeft = skillCard.offsetLeft - (skillsScroll.offsetWidth - skillCard.offsetWidth) / 2;
      
      skillsScroll.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
      
      updateSkillHighlight();
      resetAutoScroll();
    };

    // Update highlight state
    function updateSkillHighlight() {
      skillCards.forEach((card, index) => {
        card.classList.toggle('active', index === currentSkillIndex);
      });
      
      skillDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSkillIndex);
      });
      
      // Update button states
      if (prevBtn) prevBtn.disabled = currentSkillIndex === 0;
      if (nextBtn) nextBtn.disabled = currentSkillIndex === skillCards.length - 1;
    }

    // Auto-scroll functionality
    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        if (!isUserInteracting) {
          scrollToSkill(currentSkillIndex + 1);
        }
      }, 3000); // Change skill every 3 seconds
    }

    function resetAutoScroll() {
      clearInterval(autoScrollInterval);
      startAutoScroll();
    }

    // Navigation button events
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        isUserInteracting = true;
        scrollToSkill(currentSkillIndex - 1);
        clearInteractionTimeout();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        isUserInteracting = true;
        scrollToSkill(currentSkillIndex + 1);
        clearInteractionTimeout();
      });
    }

    // Dot navigation
    skillDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        isUserInteracting = true;
        scrollToSkill(index);
        clearInteractionTimeout();
      });
    });

    // Manual scroll detection
    skillsScroll.addEventListener('scroll', () => {
      isUserInteracting = true;
      clearInteractionTimeout();
      
      // Find which skill is currently centered
      const scrollCenter = skillsScroll.scrollLeft + (skillsScroll.offsetWidth / 2);
      
      skillCards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        if (Math.abs(scrollCenter - cardCenter) < card.offsetWidth / 2) {
          if (currentSkillIndex !== index) {
            currentSkillIndex = index;
            updateSkillHighlight();
          }
        }
      });
    });

    // Touch and mouse events to detect user interaction
    skillsScroll.addEventListener('touchstart', () => {
      isUserInteracting = true;
      clearInteractionTimeout();
    });

    skillsScroll.addEventListener('mousedown', () => {
      isUserInteracting = true;
      clearInteractionTimeout();
    });

    // Clear interaction timeout after user stops interacting
    function clearInteractionTimeout() {
      if (interactionTimeout) clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        isUserInteracting = false;
      }, 5000); // Resume auto-scroll after 5 seconds of inactivity
    }

    // Pause auto-scroll when hovering
    skillsScroll.addEventListener('mouseenter', () => {
      isUserInteracting = true;
      clearInterval(autoScrollInterval);
    });

    skillsScroll.addEventListener('mouseleave', () => {
      isUserInteracting = false;
      resetAutoScroll();
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(autoScrollInterval);
      } else {
        resetAutoScroll();
      }
    });

    // Responsive handling
    window.addEventListener('resize', () => {
      scrollToSkill(currentSkillIndex);
    });
  }

  /* =========================
     Smooth scroll for anchor links - ENHANCED
  ========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* =========================
     CONTACT MODAL - COMPLETELY FIXED & VISIBLE
  ========================== */
  const contactToggleBtn = document.getElementById('contact-toggle');
  const contactModal = document.getElementById('contact-modal');
  const closeContactBtn = document.getElementById('close-contact');

  if (contactToggleBtn && contactModal && closeContactBtn) {
    const openContactModal = () => {
      contactModal.style.display = 'flex';
      document.body.classList.add('modal-open');
      contactToggleBtn.setAttribute('aria-expanded', 'true');
      
      // Force reflow and add show class for animation
      contactModal.offsetHeight; // Trigger reflow
      setTimeout(() => {
        contactModal.classList.add('show');
      }, 10);

      // Focus trap for accessibility
      trapFocus(contactModal);
    };

    const closeContactModal = () => {
      contactModal.classList.remove('show');
      setTimeout(() => {
        contactModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        contactToggleBtn.setAttribute('aria-expanded', 'false');
        
        // Return focus to toggle button
        contactToggleBtn.focus();
      }, 300);
    };

    contactToggleBtn.addEventListener('click', openContactModal);
    closeContactBtn.addEventListener('click', closeContactModal);

    // Close modal when clicking on backdrop
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal || e.target.classList.contains('modal-backdrop')) {
        closeContactModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactModal.style.display === 'flex') {
        closeContactModal();
      }
    });

    // Prevent modal content from closing when clicking inside
    contactModal.querySelector('.modal-container').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /* =========================
     APPOINTMENT MODAL - COMPLETELY FIXED & VISIBLE
  ========================== */
  const bookAppointmentBtn = document.getElementById('book-appointment');
  const appointmentModal = document.getElementById('appointment-modal');
  const closeAppointmentBtn = document.getElementById('close-appointment');

  if (bookAppointmentBtn && appointmentModal && closeAppointmentBtn) {
    const openAppointmentModal = () => {
      appointmentModal.style.display = 'flex';
      document.body.classList.add('modal-open');
      
      // Set minimum date to today
      const dateInput = document.getElementById('appointment-date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
      }
      
      // Force reflow and add show class for animation
      appointmentModal.offsetHeight; // Trigger reflow
      setTimeout(() => {
        appointmentModal.classList.add('show');
      }, 10);

      // Focus trap for accessibility
      trapFocus(appointmentModal);
    };

    const closeAppointmentModal = () => {
      appointmentModal.classList.remove('show');
      setTimeout(() => {
        appointmentModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        
        // Return focus to book appointment button
        bookAppointmentBtn.focus();
      }, 300);
    };

    bookAppointmentBtn.addEventListener('click', openAppointmentModal);
    closeAppointmentBtn.addEventListener('click', closeAppointmentModal);

    // Close modal when clicking on backdrop
    appointmentModal.addEventListener('click', (e) => {
      if (e.target === appointmentModal || e.target.classList.contains('modal-backdrop')) {
        closeAppointmentModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && appointmentModal.style.display === 'flex') {
        closeAppointmentModal();
      }
    });

    // Prevent modal content from closing when clicking inside
    appointmentModal.querySelector('.modal-container').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /* =========================
     CONTACT FORM HANDLING - ENHANCED
  ========================== */
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
      };
      
      // Enhanced validation
      const errors = [];
      
      if (!formData.name) {
        errors.push('Name is required');
        highlightField('name', true);
      } else {
        highlightField('name', false);
      }
      
      if (!formData.email) {
        errors.push('Email is required');
        highlightField('email', true);
      } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
        highlightField('email', true);
      } else {
        highlightField('email', false);
      }
      
      if (!formData.message) {
        errors.push('Message is required');
        highlightField('message', true);
      } else {
        highlightField('message', false);
      }
      
      if (errors.length > 0) {
        showFormStatus(errors.join('. '), 'error');
        return;
      }
      
      // Simulate form submission
      showFormStatus('Sending message...', 'sending');
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Here you would typically send the data to your server
        console.log('Contact Form Submission:', formData);
        
        showFormStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // Reset status after 5 seconds
        setTimeout(() => {
          showFormStatus('', 'default');
        }, 5000);
      } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus('Failed to send message. Please try again.', 'error');
      }
    });

    // Real-time validation
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          highlightField(field.id, false);
        }
      });
    });
  }

  /* =========================
     APPOINTMENT FORM HANDLING - ENHANCED
  ========================== */
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    // Set minimum date to today
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }

    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = {
        name: document.getElementById('appointment-name').value.trim(),
        email: document.getElementById('appointment-email').value.trim(),
        phone: document.getElementById('appointment-phone').value.trim(),
        date: document.getElementById('appointment-date').value,
        projectType: document.getElementById('project-type').value.trim(),
        budget: document.getElementById('budget-range').value.trim(),
        projectDetails: document.getElementById('project-details').value.trim()
      };
      
      // Enhanced validation
      const errors = [];
      
      if (!formData.name) {
        errors.push('Name is required');
        highlightField('appointment-name', true);
      } else {
        highlightField('appointment-name', false);
      }
      
      if (!formData.email) {
        errors.push('Email is required');
        highlightField('appointment-email', true);
      } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
        highlightField('appointment-email', true);
      } else {
        highlightField('appointment-email', false);
      }
      
      if (!formData.projectType) {
        errors.push('Project type is required');
        highlightField('project-type', true);
      } else {
        highlightField('project-type', false);
      }
      
      if (!formData.projectDetails) {
        errors.push('Project details are required');
        highlightField('project-details', true);
      } else {
        highlightField('project-details', false);
      }
      
      if (errors.length > 0) {
        showAppointmentStatus(errors.join('. '), 'error');
        return;
      }
      
      // Simulate form submission
      showAppointmentStatus('Scheduling your appointment...', 'sending');
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Send email notification
        sendAppointmentEmail(formData);
        
        showAppointmentStatus('Appointment scheduled successfully! We\'ll contact you soon to confirm.', 'success');
        appointmentForm.reset();
        
        // Close modal after 3 seconds
        setTimeout(() => {
          closeAppointmentModal();
          showAppointmentStatus('', 'default');
        }, 3000);
      } catch (error) {
        console.error('Appointment submission error:', error);
        showAppointmentStatus('Failed to schedule appointment. Please try again.', 'error');
      }
    });

    // Real-time validation
    appointmentForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          highlightField(field.id, false);
        }
      });
    });
  }

  /* =========================
     HELPER FUNCTIONS
  ========================== */
  
  // Form status display
  function showFormStatus(message, type = 'default') {
    let statusElement = document.querySelector('#main-contact-form .form-status');
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.className = 'form-status';
      contactForm.appendChild(statusElement);
    }
    
    statusElement.textContent = message;
    statusElement.className = 'form-status';
    
    if (type !== 'default') {
      statusElement.classList.add(type);
    }
  }

  function showAppointmentStatus(message, type = 'default') {
    let statusElement = document.querySelector('#appointment-form .form-status');
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.className = 'form-status';
      const formActions = appointmentForm.querySelector('.form-actions');
      if (formActions) {
        formActions.appendChild(statusElement);
      }
    }
    
    statusElement.textContent = message;
    statusElement.className = 'form-status';
    
    if (type !== 'default') {
      statusElement.classList.add(type);
    }
  }

  // Field highlighting
  function highlightField(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    if (field) {
      if (hasError) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
      } else {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }
    }
  }

  // Email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Send appointment email (simulated)
  function sendAppointmentEmail(formData) {
    // In a real implementation, this would be an API call to your backend
    console.log('Appointment Email Details:', formData);
    
    const emailContent = `
      NEW APPOINTMENT REQUEST - PORTFOLIO WEBSITE
      ===========================================
      
      Client Information:
      ------------------
      👤 Name: ${formData.name}
      📧 Email: ${formData.email}
      📞 Phone: ${formData.phone || 'Not provided'}
      📅 Preferred Date: ${formData.date || 'Not specified'}
      
      Project Details:
      ---------------
      🚀 Project Type: ${formData.projectType}
      💰 Budget Range: ${formData.budget || 'Not specified'}
      
      Project Requirements:
      ${formData.projectDetails}
      
      ---
      📱 Submitted through portfolio website
      ⏰ Timestamp: ${new Date().toLocaleString()}
    `;
    
    console.log('Email content that would be sent:\n', emailContent);
  }

  /* =========================
     ACTIVE NAV LINK HIGHLIGHTING
  ========================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');

  function highlightNavLink() {
    let current = '';
    const scrollY = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Throttled scroll for nav highlighting
  let navHighlightTimeout;
  window.addEventListener('scroll', () => {
    if (!navHighlightTimeout) {
      navHighlightTimeout = setTimeout(() => {
        highlightNavLink();
        navHighlightTimeout = null;
      }, 50);
    }
  });

  /* =========================
     PROFILE IMAGE FALLBACK ENHANCEMENT
  ========================== */
  const profileImg = document.getElementById('profile-img');
  if (profileImg) {
    profileImg.addEventListener('error', function() {
      this.style.display = 'none';
      const fallback = document.getElementById('profile-fallback');
      if (fallback) {
        fallback.style.display = 'flex';
      }
    });
    
    // Try to load the image
    profileImg.addEventListener('load', function() {
      const fallback = document.getElementById('profile-fallback');
      if (fallback) {
        fallback.style.display = 'none';
      }
    });
  }

  /* =========================
     INITIALIZE PARTICLES - OPTIMIZED
  ========================== */
  initParticles('hero-canvas', Math.max(Math.floor(window.innerWidth / 25), 30), {
    initParticle: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random() * 0.3 + 0.1
    }),
    updateParticle: (p, w, h, ctx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(111, 140, 255, ${p.alpha})`;
      ctx.fill();
      p.y -= p.speed;
      if (p.y < -p.r) {
        p.y = h + p.r;
        p.x = Math.random() * w;
      }
    }
  });

  initParticles('contact-canvas', 40, {
    initParticle: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.3 + 0.1
    }),
    updateParticle: (p, w, h, ctx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(111, 140, 255, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.x < -p.r) p.x = w + p.r;
      if (p.y > h + p.r) p.y = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
    }
  });

  initParticles('appointment-canvas', 30, {
    initParticle: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1 + 0.2,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.2 + 0.1
    }),
    updateParticle: (p, w, h, ctx) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(111, 140, 255, ${p.alpha})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x > w + p.r) p.x = -p.r;
      if (p.x < -p.r) p.x = w + p.r;
      if (p.y > h + p.r) p.y = -p.r;
      if (p.y < -p.r) p.y = h + p.r;
    }
  });

});

/* =========================
   HERO BACKGROUND PARTICLES FUNCTION - OPTIMIZED
========================= */
function initParticles(canvasId, count, animateFunc) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let w = canvas.width = canvas.offsetWidth;
  let h = canvas.height = canvas.offsetHeight;

  const resizeHandler = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  };

  // Debounced resize
  let resizeTimeout;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeHandler, 250);
  };

  window.addEventListener('resize', debouncedResize);

  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(animateFunc.initParticle(w, h));
  }

  let animationId;
  let lastTime = 0;
  const fps = 60;
  const interval = 1000 / fps;

  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta > interval) {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => animateFunc.updateParticle(p, w, h, ctx));
      lastTime = timestamp - (delta % interval);
    }

    animationId = requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();

  // Cleanup function
  return () => {
    window.removeEventListener('resize', debouncedResize);
    cancelAnimationFrame(animationId);
  };
}

/* =========================
   FOCUS TRAP FOR MODALS - ACCESSIBILITY
========================= */
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  modal.addEventListener('keydown', handleTabKey);

  // Focus first element
  setTimeout(() => {
    firstElement.focus();
  }, 100);

  // Return cleanup function
  return () => {
    modal.removeEventListener('keydown', handleTabKey);
  };
}

/* =========================
   PERFORMANCE OPTIMIZATIONS
========================= */

// Debounce utility function
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle utility function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/* =========================
   LOADING STATE MANAGEMENT
========================= */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Remove loading spinner if exists
  const loadingSpinner = document.getElementById('loading-spinner');
  if (loadingSpinner) {
    setTimeout(() => {
      loadingSpinner.style.opacity = '0';
      setTimeout(() => {
        loadingSpinner.remove();
      }, 500);
    }, 500);
  }
});

/* =========================
   ERROR HANDLING & FALLBACKS
========================= */
window.addEventListener('error', (e) => {
  console.error('Script error:', e.error);
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  e.preventDefault();
});

/* =========================
   RESPONSIVE UTILITIES
========================= */

// Check if device is mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Check if device is tablet
function isTablet() {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Check if device is desktop
function isDesktop() {
  return window.innerWidth > 1024;
}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 300);
});

/* =========================
   TOUCH DEVICE DETECTION
========================= */
let isTouchDevice = false;

try {
  document.createEvent('TouchEvent');
  isTouchDevice = true;
} catch (e) {
  isTouchDevice = false;
}

// Add touch class to body for CSS targeting
if (isTouchDevice) {
  document.body.classList.add('touch-device');
} else {
  document.body.classList.add('no-touch-device');
}

/* =========================
   ACCESSIBILITY IMPROVEMENTS
========================= */

// Skip to main content for screen readers
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
  position: absolute;
  top: -40px;
  left: 6px;
  background: #6f8cff;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 10000;
  transition: top 0.3s;
`;
skipLink.addEventListener('focus', () => {
  skipLink.style.top = '6px';
});
skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Add main content id to main element
const mainElement = document.querySelector('main');
if (mainElement) {
  mainElement.id = 'main-content';
}

/* =========================
   MODAL VISIBILITY ENHANCEMENTS
========================= */

// Force modal visibility check
function ensureModalVisibility() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
      setTimeout(() => {
        modal.style.display = 'flex';
      }, 10);
    }
  });
}

// Re-check modal visibility on window focus
window.addEventListener('focus', ensureModalVisibility);

// Additional safety check for modal z-index
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop') || 
      e.target.classList.contains('modal')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.style.zIndex = '2000';
    }
  }
});