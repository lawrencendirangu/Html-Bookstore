const themeToggleBtn = document.getElementById('theme-toggle');

function updateThemeIcon() {
    if (!themeToggleBtn) return;

  const isLightTheme = document.body.classList.contains('dark-mode');
  themeToggleBtn.textContent = isLightTheme ? '🌙✨' : '🌞📚';
  themeToggleBtn.setAttribute('aria-label', isLightTheme ? 'Switch to night reading mode' : 'Switch to day reading mode');
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

const categorySections = document.querySelectorAll('.category');

categorySections.forEach((categorySection) => {
  const toggleBtn = categorySection.querySelector('.featured .btn-primary');
  const extraBooks = categorySection.querySelectorAll(':scope > .books-grid');

  if (!toggleBtn || extraBooks.length === 0) return;

  let isExpanded = false;

  extraBooks.forEach((bookCard) => {
    bookCard.classList.add('is-hidden-book');
  });

  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.textContent = 'view more';

  toggleBtn.addEventListener('click', (event) => {
    event.preventDefault();
    isExpanded = !isExpanded;

    extraBooks.forEach((bookCard) => {
      bookCard.classList.toggle('is-hidden-book', !isExpanded);
    });

    toggleBtn.textContent = isExpanded ? 'view less' : 'view more';
    toggleBtn.setAttribute('aria-expanded', String(isExpanded));
  });
});

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchFeedback = document.getElementById('search-feedback');
const searchableFeaturedTitles = document.querySelectorAll('.category .featured .card-body h3');
const searchableBookTitles = document.querySelectorAll('.category .books-grid figcaption');
const openCheckoutBtn = document.getElementById('open-checkout');
const closeCheckoutBtn = document.getElementById('close-checkout');
const checkoutPanel = document.getElementById('checkout-panel');
const checkoutItemsList = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutEmpty = document.getElementById('checkout-empty');
const cartStatus = document.getElementById('cart-status');
const placeOrderBtn = document.getElementById('place-order');

const cart = new Map();

function parsePriceFromText(priceText) {
  const parsed = Number(priceText.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getBookFromActionButton(button) {
  const figure = button.closest('figure');
  if (!figure) return null;

  const title = figure.querySelector('figcaption')?.textContent.trim() || 'Book';
  const priceText = figure.querySelector('.price')?.textContent || '$0';
  const price = parsePriceFromText(priceText);

  return { title, price };
}

function getCartStats() {
  let itemCount = 0;
  let total = 0;

  cart.forEach((item) => {
    itemCount += item.quantity;
    total += item.quantity * item.price;
  });

  return { itemCount, total };
}

function updateCartStatus() {
  if (!cartStatus) return;
  const { itemCount, total } = getCartStats();
  cartStatus.textContent = `Cart: ${itemCount} item${itemCount === 1 ? '' : 's'} | Total: $${total.toFixed(2)}`;
}

function renderCheckout() {
  if (!checkoutItemsList || !checkoutTotal || !checkoutEmpty) return;

  checkoutItemsList.innerHTML = '';
  const { itemCount, total } = getCartStats();

  checkoutTotal.textContent = `$${total.toFixed(2)}`;
  checkoutEmpty.hidden = itemCount > 0;

  cart.forEach((item, key) => {
    const listItem = document.createElement('li');
    listItem.className = 'checkout-item';

    const details = document.createElement('div');
    details.className = 'checkout-item-details';

    const title = document.createElement('h3');
    title.textContent = item.title;

    const price = document.createElement('p');
    price.textContent = `$${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;

    details.appendChild(title);
    details.appendChild(price);

    const controls = document.createElement('div');
    controls.className = 'checkout-item-controls';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.type = 'button';
    decreaseBtn.className = 'btn checkout-action-btn';
    decreaseBtn.textContent = '-';
    decreaseBtn.setAttribute('data-cart-action', 'decrease');
    decreaseBtn.setAttribute('data-cart-key', key);

    const increaseBtn = document.createElement('button');
    increaseBtn.type = 'button';
    increaseBtn.className = 'btn checkout-action-btn';
    increaseBtn.textContent = '+';
    increaseBtn.setAttribute('data-cart-action', 'increase');
    increaseBtn.setAttribute('data-cart-key', key);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn checkout-action-btn remove';
    removeBtn.textContent = 'Remove';
    removeBtn.setAttribute('data-cart-action', 'remove');
    removeBtn.setAttribute('data-cart-key', key);

    controls.appendChild(decreaseBtn);
    controls.appendChild(increaseBtn);
    controls.appendChild(removeBtn);

    listItem.appendChild(details);
    listItem.appendChild(controls);

    checkoutItemsList.appendChild(listItem);
  });

  updateCartStatus();
}

function addToCart(book, quantity = 1) {
  if (!book || !book.title) return;

  const existing = cart.get(book.title);

  if (existing) {
    existing.quantity += quantity;
    cart.set(book.title, existing);
  } else {
    cart.set(book.title, {
      title: book.title,
      price: book.price,
      quantity
    });
  }

  renderCheckout();
}

function openCheckoutPanel() {
  if (!checkoutPanel) return;
  checkoutPanel.hidden = false;
  checkoutPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeCheckoutPanel() {
  if (!checkoutPanel) return;
  checkoutPanel.hidden = true;
}

document.addEventListener('click', (event) => {
  const actionBtn = event.target.closest('figure .btn');
  if (!actionBtn) return;

  const actionText = actionBtn.textContent.trim().toLowerCase();
  if (actionText !== 'buy now' && actionText !== 'add to cart') return;

  event.preventDefault();
  const book = getBookFromActionButton(actionBtn);
  if (!book) return;

  addToCart(book, 1);

  if (actionText === 'buy now') {
    openCheckoutPanel();
  }
});

if (openCheckoutBtn) {
  openCheckoutBtn.addEventListener('click', () => {
    openCheckoutPanel();
  });
}

if (closeCheckoutBtn) {
  closeCheckoutBtn.addEventListener('click', () => {
    closeCheckoutPanel();
  });
}

if (checkoutItemsList) {
  checkoutItemsList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;

    const action = button.getAttribute('data-cart-action');
    const key = button.getAttribute('data-cart-key');
    if (!action || !key || !cart.has(key)) return;

    const item = cart.get(key);

    if (action === 'increase') {
      item.quantity += 1;
      cart.set(key, item);
    }

    if (action === 'decrease') {
      if (item.quantity <= 1) {
        cart.delete(key);
      } else {
        item.quantity -= 1;
        cart.set(key, item);
      }
    }

    if (action === 'remove') {
      cart.delete(key);
    }

    renderCheckout();
  });
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener('click', () => {
    const { itemCount, total } = getCartStats();

    if (itemCount === 0) {
      alert('Your cart is empty. Add books before placing an order.');
      return;
    }

    alert(`Order placed successfully for ${itemCount} item${itemCount === 1 ? '' : 's'} totaling $${total.toFixed(2)}.`);
    cart.clear();
    renderCheckout();
    closeCheckoutPanel();
  });
}

updateCartStatus();
renderCheckout();

function clearSearchState() {
  searchableBookTitles.forEach((title) => {
    title.closest('.books-grid')?.classList.remove('search-match-book');
  });

  searchableFeaturedTitles.forEach((title) => {
    title.closest('.featured')?.classList.remove('search-match-featured');
  });

  if (searchFeedback) {
    searchFeedback.textContent = '';
    searchFeedback.classList.remove('is-success', 'is-error');
  }
}

function normalizeSearchText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function getBestDistanceForTitle(normalizedTitle, normalizedQuery) {
  let bestDistance = levenshteinDistance(normalizedTitle, normalizedQuery);
  const words = normalizedTitle.split(' ').filter(Boolean);

  words.forEach((word, index) => {
    bestDistance = Math.min(bestDistance, levenshteinDistance(word, normalizedQuery));

    if (index < words.length - 1) {
      const twoWords = `${words[index]} ${words[index + 1]}`;
      bestDistance = Math.min(bestDistance, levenshteinDistance(twoWords, normalizedQuery));
    }
  });

  return bestDistance;
}

function revealAndHighlightItem(searchItem) {
  if (!searchItem) return;

  if (searchItem.type === 'featured') {
    searchItem.container.classList.add('search-match-featured');
    return;
  }

  searchItem.container.classList.add('search-match-book');

  if (searchItem.container.classList.contains('is-hidden-book')) {
    searchItem.container.classList.remove('is-hidden-book');
  }
}

function getFuzzySuggestion(queryValue) {
  const normalizedQuery = normalizeSearchText(queryValue);
  if (!normalizedQuery) return null;

  const searchIndex = [];

  searchableBookTitles.forEach((titleElement) => {
    const titleText = titleElement.textContent.trim();
    const gridCard = titleElement.closest('.books-grid');
    if (!gridCard) return;

    searchIndex.push({
      type: 'book',
      titleText,
      normalizedTitle: normalizeSearchText(titleText),
      container: gridCard
    });
  });

  searchableFeaturedTitles.forEach((titleElement) => {
    const titleText = titleElement.textContent.trim();
    const featuredCard = titleElement.closest('.featured');
    if (!featuredCard) return;

    searchIndex.push({
      type: 'featured',
      titleText,
      normalizedTitle: normalizeSearchText(titleText),
      container: featuredCard
    });
  });

  let closestItem = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  searchIndex.forEach((item) => {
    const distance = getBestDistanceForTitle(item.normalizedTitle, normalizedQuery);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }
  });

  const maxAllowedDistance = Math.max(1, Math.floor(normalizedQuery.length * 0.25));

  if (!closestItem || closestDistance > maxAllowedDistance) {
    return null;
  }

  return closestItem;
}

function performBookSearch() {
  if (!searchInput) return;

  const queryValue = searchInput.value.trim();
  const query = queryValue.toLowerCase();
  clearSearchState();

  if (!query) {
    if (searchFeedback) {
      searchFeedback.textContent = 'Enter a book title to search our store.';
      searchFeedback.classList.add('is-error');
    }
    return;
  }

  const matchedHiddenBooks = [];
  const matchedVisibleBooks = [];
  const matchedFeatured = [];

  searchableBookTitles.forEach((title) => {
    const titleText = title.textContent.trim().toLowerCase();
    if (!titleText.includes(query)) return;

    const gridCard = title.closest('.books-grid');
    if (!gridCard) return;

    gridCard.classList.add('search-match-book');

    if (gridCard.classList.contains('is-hidden-book')) {
      gridCard.classList.remove('is-hidden-book');
      matchedHiddenBooks.push(gridCard);
    } else {
      matchedVisibleBooks.push(gridCard);
    }
  });

  searchableFeaturedTitles.forEach((title) => {
    const titleText = title.textContent.trim().toLowerCase();
    if (!titleText.includes(query)) return;

    const featuredCard = title.closest('.featured');
    if (!featuredCard) return;

    featuredCard.classList.add('search-match-featured');
    matchedFeatured.push(featuredCard);
  });

  const totalMatches = matchedHiddenBooks.length + matchedVisibleBooks.length + matchedFeatured.length;

  if (totalMatches > 0) {
    if (searchFeedback) {
      searchFeedback.textContent = `Great choice. We found ${totalMatches} result${totalMatches === 1 ? '' : 's'} for "${queryValue}".`;
      searchFeedback.classList.add('is-success');
    }

    const firstMatch = matchedFeatured[0] || matchedHiddenBooks[0] || matchedVisibleBooks[0];
    firstMatch?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const fuzzySuggestion = getFuzzySuggestion(queryValue);

  if (fuzzySuggestion) {
    revealAndHighlightItem(fuzzySuggestion);

    if (searchFeedback) {
      searchFeedback.textContent = `We could not find an exact match for "${queryValue}", but we found "${fuzzySuggestion.titleText}". If this is your book, it is available now.`;
      searchFeedback.classList.add('is-success');
    }

    fuzzySuggestion.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (searchFeedback) {
    searchFeedback.textContent = `Sorry, we do not have "${queryValue}" in store right now. We can source it for you in about 7-14 business days.`;
    searchFeedback.classList.add('is-error');
  }
}

if (searchButton && searchInput) {
  searchButton.addEventListener('click', performBookSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performBookSearch();
    }
  });
}

const bookstoreVideo = document.getElementById('bookstore-video');

if (bookstoreVideo) {
  const playVideo = () => {
    const playPromise = bookstoreVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // Ignore autoplay rejections in browsers with stricter policies.
      });
    }
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            bookstoreVideo.pause();
          }
        });
      },
      {
        root: null,
        rootMargin: '180px 0px',
        threshold: 0.35
      }
    );

    videoObserver.observe(bookstoreVideo);
  } else {
    // Older browsers: start once video can be played.
    bookstoreVideo.addEventListener('canplay', playVideo, { once: true });
  }
}
