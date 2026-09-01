/*==================== toggle icon navbar ====================*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let navSlider = document.querySelector('.nav-slider');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};

/*==================== nav slider position ====================*/
function updateNavSlider() {
  const activeLink = document.querySelector('header nav a.active');
  if (activeLink && navSlider && window.innerWidth > 768) {
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = navbar.getBoundingClientRect();
    navSlider.style.width = linkRect.width + 'px';
    navSlider.style.left = (linkRect.left - navRect.left) + 'px';
    navSlider.style.opacity = '1';
  } else if (navSlider) {
    navSlider.style.opacity = '0';
  }
}

// Initial position - run immediately and on various events
updateNavSlider();
document.addEventListener('DOMContentLoaded', updateNavSlider);
window.addEventListener('load', updateNavSlider);
window.addEventListener('resize', updateNavSlider);
setTimeout(updateNavSlider, 100);

/*==================== scroll sections active link ====================*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
      });
      // Update slider position
      updateNavSlider();
    }
  });

  /*==================== sticky navbar ====================*/
  let header = document.querySelector('header');
  header.classList.toggle('sticky', window.scrollY > 100);

  /*==================== remove toggle icon and navbar when click navbar link (scroll) ====================*/
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
};

/*==================== scroll reveal ====================*/
ScrollReveal({
  reset: true,
  distance: '80px',
  duration: 2000,
  delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.about-img, .journey-column:first-child', { origin: 'left' });
ScrollReveal().reveal('.about-content, .journey-column:last-child', { origin: 'right' });
ScrollReveal().reveal('.featured-box, .testimonial-box', { origin: 'bottom', interval: 100 });

/*==================== typed js ====================*/
const typed = new Typed('.multiple-text', {
  strings: ['Fullstack Developer', 'DBMS Developer', 'Freelance Programmer', 'AI/ML Enthusiast', 'Founder', 'Learner', 'Leader'],
  typeSpeed: 100,
  backSpeed: 100,
  backDelay: 1000,
  loop: true
});

/*==================== testimonial modal ====================*/
const testimonialBoxes = document.querySelectorAll('.testimonial-box');
const modal = document.getElementById('testimonialModal');
const modalClose = document.getElementById('modalClose');
const modalTestimonial = document.getElementById('modalTestimonial');
const modalAuthor = document.getElementById('modalAuthor');
const modalLinkedin = document.getElementById('modalLinkedin');

testimonialBoxes.forEach(box => {
  box.addEventListener('click', () => {
    const content = box.querySelector('.testimonial-content').innerHTML;
    const author = box.querySelector('.testimonial-author').innerHTML;
    const linkedinUrl = box.getAttribute('data-linkedin');

    modalTestimonial.innerHTML = content;
    modalAuthor.innerHTML = author;
    modalLinkedin.href = linkedinUrl || '#';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

/*==================== schedule call modal ====================*/
const scheduleButtons = document.querySelectorAll('.schedule-call-btn');
const scheduleModal = document.getElementById('scheduleModal');
const scheduleModalClose = document.getElementById('scheduleModalClose');
const scheduleForm = document.getElementById('scheduleForm');
const scheduleDateInput = document.getElementById('scheduleDate');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
if (scheduleDateInput) {
  scheduleDateInput.setAttribute('min', today);
}

scheduleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    scheduleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

if (scheduleModalClose) {
  scheduleModalClose.addEventListener('click', () => {
    scheduleModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
}

if (scheduleModal) {
  scheduleModal.addEventListener('click', (e) => {
    if (e.target === scheduleModal) {
      scheduleModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

if (scheduleForm) {
  scheduleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(scheduleForm);

    const submitBtn = scheduleForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Submitting...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/meeeqrnv', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = Object.fromEntries(formData);
        showSuccessModal('Call Scheduled!', `Thank you ${data.name}! Your call has been scheduled for ${data.date} at ${data.time}. I will contact you soon to confirm.`);
        scheduleModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        scheduleForm.reset();
      } else {
        showSuccessModal('Oops!', 'There was a problem submitting your form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showSuccessModal('Error', 'Failed to schedule call. Please try again.');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

/*==================== contact form ====================*/
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);

    const submitBtn = contactForm.querySelector('.contact-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/meeeqrnv', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = Object.fromEntries(formData);
        showSuccessModal('Message Sent!', `Thank you ${data.fullName}! Your message has been sent successfully. I'll get back to you soon.`);
        contactForm.reset();
      } else {
        showSuccessModal('Oops!', 'There was a problem sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      showSuccessModal('Error', 'Failed to send message. Please try again.');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

/*==================== success modal ====================*/
const successModal = document.getElementById('successModal');
const successModalClose = document.getElementById('successModalClose');
const successTitle = document.getElementById('successTitle');
const successMessage = document.getElementById('successMessage');

function showSuccessModal(title, message) {
  successTitle.textContent = title;
  successMessage.textContent = message;
  successModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  successModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

if (successModalClose) {
  successModalClose.addEventListener('click', closeSuccessModal);
}

if (successModal) {
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      closeSuccessModal();
    }
  });
}

/*==================== macOS dock magnification effect for skills ====================*/
const skillsContainer = document.querySelector('.skills-container');
const skillBoxes = document.querySelectorAll('.skill-box');

// Configuration for the dock effect
const DOCK_CONFIG = {
  maxScale: 1.5,        // Maximum scale for the hovered item
  neighborScale: 1.25,  // Scale for immediate neighbors
  falloffRange: 2,      // How many neighbors to affect on each side
  baseScale: 1,         // Normal scale
  columnsPerRow: 6      // Number of columns in each row
};

function applyDockEffect(hoveredIndex) {
  // Calculate which row the hovered item is in
  const hoveredRow = Math.floor(hoveredIndex / DOCK_CONFIG.columnsPerRow);

  skillBoxes.forEach((box, index) => {
    // Calculate which row this item is in
    const currentRow = Math.floor(index / DOCK_CONFIG.columnsPerRow);

    let scale = DOCK_CONFIG.baseScale;
    box.classList.remove('dock-active', 'dock-neighbor');

    // Only apply effect if in the same row
    if (currentRow === hoveredRow) {
      const distance = Math.abs(index - hoveredIndex);

      if (distance === 0) {
        // Hovered item gets maximum scale
        scale = DOCK_CONFIG.maxScale;
        box.classList.add('dock-active');
      } else if (distance <= DOCK_CONFIG.falloffRange) {
        // Neighbors get progressively smaller scale based on distance
        const falloff = 1 - (distance / (DOCK_CONFIG.falloffRange + 1));
        scale = DOCK_CONFIG.baseScale + ((DOCK_CONFIG.neighborScale - DOCK_CONFIG.baseScale) * falloff);
        box.classList.add('dock-neighbor');
      }
    }

    box.style.transform = `scale(${scale})`;
  });
}

function resetDockEffect() {
  skillBoxes.forEach(box => {
    box.classList.remove('dock-active', 'dock-neighbor');
    box.style.transform = `scale(${DOCK_CONFIG.baseScale})`;
  });
}

// Add event listeners to each skill box
skillBoxes.forEach((box, index) => {
  box.addEventListener('mouseenter', () => {
    applyDockEffect(index);
  });
});

// Reset when mouse leaves the skills container
if (skillsContainer) {
  skillsContainer.addEventListener('mouseleave', () => {
    resetDockEffect();
  });
}
