const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#navLinks');
const themeToggle = document.querySelector('.theme-toggle');
const projectFilterButtons = document.querySelectorAll('.project-filter-btn');
const timelineFilterButtons = document.querySelectorAll('.timeline-filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const timelineItems = document.querySelectorAll('.timeline-item');
const reveals = document.querySelectorAll('.reveal');
const modal = document.querySelector('#projectModal');
const modalTitle = document.querySelector('#modalTitle');
const modalText = document.querySelector('#modalText');
const modalList = document.querySelector('#modalList');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

const projectDetails = {
  'Packout Conveyor': {
    text: 'A production conveyor improvement project focused on material flow, process stability, and safer operator interaction.',
    points: [
      'Reviewed conveyor transfer points and common stoppage patterns.',
      'Improved handling flow to reduce manual intervention.',
      'Supported production reliability through practical equipment improvement.'
    ]
  },
  'Packout Reload': {
    text: 'A reload process improvement project built around better line continuity and reduced equipment interruption.',
    points: [
      'Studied operator movement and reload timing.',
      'Improved reload process flow for smoother production support.',
      'Focused on uptime, maintainability, and clear operating logic.'
    ]
  },
  'Resort Reload Dual Input': {
    text: 'An upgraded automation concept that adds dual input capability to improve process flexibility and reduce bottlenecks.',
    points: [
      'Added dual input operation to support line flexibility.',
      'Reduced single-path dependency in the reload flow.',
      'Improved system readiness for changing production conditions.'
    ]
  },
  'Chronic Kidney Disease Prediction': {
    text: 'A machine learning project focused on classification, preprocessing, feature handling, and model evaluation.',
    points: [
      'Cleaned medical dataset values and handled missing data.',
      'Compared classification models using accuracy, precision, recall, F1-score, and ROC-AUC.',
      'Prepared insights for academic reporting and model interpretation.'
    ]
  }
};

function closeMenu() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.remove('open');
  body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    body.classList.toggle('menu-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}

projectFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    projectFilterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.projectFilter;
    projectCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'block' : 'none';
    });
  });
});

timelineFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    timelineFilterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.timelineFilter;
    timelineItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.timelineCategory === filter;
      item.style.display = show ? 'grid' : 'none';
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

reveals.forEach((element) => observer.observe(element));

document.querySelectorAll('.project-open').forEach((button) => {
  button.addEventListener('click', () => {
    const detail = projectDetails[button.dataset.project];
    if (!detail || !modal || !modalTitle || !modalText || !modalList) return;

    modalTitle.textContent = button.dataset.project;
    modalText.textContent = detail.text;
    modalList.innerHTML = detail.points.map((point) => `<li>${point}</li>`).join('');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'true') {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    closeMenu();
  }
});

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name')).trim();
    const email = String(formData.get('email')).trim();
    const message = String(formData.get('message')).trim();
    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete all fields.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    formStatus.textContent = 'Sending message...';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent successfully.';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Message failed. Please check the form and try again.';
      }
    } catch (error) {
      formStatus.textContent = 'Network error. Please try again later.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
      }
    }
  });
}

const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
