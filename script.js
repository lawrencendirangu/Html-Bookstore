const themeToggleBtn = document.getElementById('theme-toggle');

function updateThemeIcon() {
    if (!themeToggleBtn) return;

    const isLightTheme = document.body.classList.contains('dark-mode');
    themeToggleBtn.textContent = isLightTheme ? '🌙' : '💡';
    themeToggleBtn.setAttribute('aria-label', isLightTheme ? 'Switch to dark theme' : 'Switch to light theme');
}

if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.add('dark-mode');
    }

    updateThemeIcon();

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'light' : 'dark');
        updateThemeIcon();
    });
}


const dialog = document.querySelector('dialog');
const closeButton = dialog.querySelector('button:last-of-type');
const openModalButton = document.getElementById('open-modal');

closeButton.addEventListener('click', () => {
  dialog.close();
});

openModalButton.addEventListener('click', () => {
  dialog.showModal();
});

// Close the modal when clicking outside of it
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const isInDialog = (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  );
  if (!isInDialog) {
    dialog.close();
  }
});

const multiStepForm = document.getElementById('multi-step-form');
const formSteps = document.querySelectorAll('.contact-form .form-step');
const progressSteps = document.querySelectorAll('.contact-form .form-progress .step');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const submitBtn = document.querySelector('.submit-btn');
const reviewName = document.getElementById('review-name');
const reviewAddress = document.getElementById('review-address');
const reviewEmail = document.getElementById('review-email');
const reviewPhone = document.getElementById('review-phone');
let currentFormStep = 0;

function updateFormStep() {
  formSteps.forEach((step, index) => {
    step.classList.toggle('active', index === currentFormStep);
  });

  progressSteps.forEach((step, index) => {
    step.classList.toggle('active', index === currentFormStep);
  });

  prevBtn.style.display = currentFormStep === 0 ? 'none' : 'inline-flex';
  nextBtn.style.display = currentFormStep === formSteps.length - 1 ? 'none' : 'inline-flex';
  submitBtn.style.display = currentFormStep === formSteps.length - 1 ? 'inline-flex' : 'none';

  if (currentFormStep === formSteps.length - 1) {
    updateReview();
  }
}

function validateStep(index) {
  const fields = formSteps[index].querySelectorAll('input[required], textarea[required]');
  for (const field of fields) {
    if (!field.value.trim()) {
      field.focus();
      return false;
    }
  }
  return true;
}

function updateReview() {
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  reviewName.textContent = name || '-';
  reviewAddress.textContent = address || '-';
  reviewEmail.textContent = email || '-';
  reviewPhone.textContent = phone || '-';
}

if (multiStepForm && nextBtn && prevBtn && submitBtn) {
  updateFormStep();

  nextBtn.addEventListener('click', () => {
    if (!validateStep(currentFormStep)) return;
    currentFormStep = Math.min(formSteps.length - 1, currentFormStep + 1);
    updateFormStep();
  });

  prevBtn.addEventListener('click', () => {
    currentFormStep = Math.max(0, currentFormStep - 1);
    updateFormStep();
  });

  multiStepForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you! Your contact request has been submitted.');
    multiStepForm.reset();
    currentFormStep = 0;
    updateFormStep();
    reviewName.textContent = reviewAddress.textContent = reviewEmail.textContent = reviewPhone.textContent = '-';
  });
}
