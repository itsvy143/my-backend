// Hamburger menu toggle
 const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  // Close menu when a navigation link is clicked
  navLinks.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });

// Load skills and interests from data.json
async function loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();

    // Load skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    data.skills.forEach(skill => {
      const skillBar = document.createElement('div');
      skillBar.className = 'skill-bar';
      skillBar.innerHTML = `
        <h3>${skill.name}</h3>
        <div class="progress-bar" aria-label="${skill.name} skill level: ${skill.level}%">
          <div class="progress-bar-fill" style="width: 0;"></div>
        </div>
      `;
      skillsContainer.appendChild(skillBar);
      // Animate progress bar fill
      setTimeout(() => {
        skillBar.querySelector('.progress-bar-fill').style.width = skill.level + '%';
      }, 100);
    });

    // Load interests
    const interestsContainer = document.getElementById('interests-container');
    interestsContainer.innerHTML = '';
    data.interests.forEach(interest => {
      const interestCard = document.createElement('div');
      interestCard.className = 'interest-card';
      interestCard.tabIndex = 0;
      interestCard.innerHTML = `
        <i class="${interest.icon}" aria-hidden="true"></i>
        <p>${interest.name}</p>
      `;
      interestsContainer.appendChild(interestCard);
    });
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Form validation and submission
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  clearErrors();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  let valid = true;

  if (name === '') {
    showError('name', 'Name is required');
    valid = false;
  }

  if (email === '') {
    showError('email', 'Email is required');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email');
    valid = false;
  }

  if (message === '') {
    showError('message', 'Message is required');
    valid = false;
  }

  if (!valid) return;

  // Submit form data to backend (server.js)
 try {
  const API_URL = location.hostname === 'localhost'
    ? 'http://localhost:5500'
    : 'https://my-backend-2-bq15.onrender.com'; 

  const response = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, message })
  });

  const data = await response.json();

  if (response.ok) {
    alert(data.message || 'Message sent successfully!');
    form.reset();
  } else {
    alert(data.error || 'Failed to send message. Please try again later.');
  }
} catch (error) {
  alert('Error sending message. Please try again later.');
  console.error('Form submission error:', error);
}
});


function showError(fieldName, message) {
  const field = form[fieldName];
  const errorSpan = field.nextElementSibling;
  errorSpan.textContent = message;
  field.setAttribute('aria-invalid', 'true');
}

function clearErrors() {
  ['name', 'email', 'message'].forEach(fieldName => {
    const field = form[fieldName];
    const errorSpan = field.nextElementSibling;
    errorSpan.textContent = '';
    field.removeAttribute('aria-invalid');
  });
}

function validateEmail(email) {
  // Simple email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

// Initialize AOS animations
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
});

// Load data on page load
document.addEventListener('DOMContentLoaded', loadData);
