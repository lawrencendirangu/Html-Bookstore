const books = [
  { id: 'f1', title: 'The Psychology of Money', author: 'Morgan Housel', category: 'finance', price: 499, image: 'Images/The Psychology of Money by Morgan Housel.jpg' },
  { id: 'f2', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'finance', price: 399, image: 'Images/Rich Dad Poor Dad.jpg' },
  { id: 'f3', title: 'The Art of Spending Money', author: 'Morgan Housel', category: 'finance', price: 449, image: 'Images/The Art of Spending Money _ Morgan Housel Book.jpg' },
  { id: 's1', title: 'You Are a Badass', author: 'Jen Sincero', category: 'self-help', price: 399, image: 'Images/You are a Badass - Jen Sincero.jpg' },
  { id: 's2', title: 'Think and Grow Smart', author: 'Napoleon Hill inspired', category: 'self-help', price: 359, image: 'Images/Think and Grow Smart.jpg' },
  { id: 's3', title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', category: 'self-help', price: 459, image: 'Images/The 7 Habits Of Highly Effective People _ Powerful Lessons In Personal Change By.jpg' },
  { id: 'fic1', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'fiction', price: 459, image: 'Images/To Kill A Mockingbird by Harper Lee.jpg' },
  { id: 'fic2', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'fiction', price: 389, image: 'Images/The Great Gatsby.jpg' },
  { id: 'fic3', title: 'The Catcher in the Rye', author: 'J. D. Salinger', category: 'fiction', price: 349, image: 'Images/The Catcher In The Rye ~ JD Salinger ~ 1951 ~ 1st Edition ~ Little Brown And Company_.jpg' },
  { id: 'c1', title: 'The Laws of Human Nature', author: 'Robert Greene', category: 'classics', price: 479, image: 'Images/the laws of human nature.jpg' },
  { id: 'c2', title: 'Hoje temos', author: 'Classic collection', category: 'classics', price: 299, image: 'Images/Hoje temos.jpg' },
  { id: 'c3', title: 'The Silent City', author: 'Classic fiction', category: 'classics', price: 329, image: 'Images/The Silent City.jpg' }
];

const state = {
  filter: 'all',
  search: '',
  wishlist: new Set(),
  cart: new Map(),
  paymentMethod: 'card'
};

const elements = {
  bookGrid: document.getElementById('book-grid'),
  template: document.getElementById('book-card-template'),
  searchInput: document.getElementById('search-input'),
  searchButton: document.getElementById('search-button'),
  searchSuggestions: document.getElementById('search-suggestions'),
  searchFeedback: document.getElementById('search-feedback'),
  themeToggle: document.getElementById('theme-toggle'),
  openModal: document.getElementById('open-modal'),
  modal: document.getElementById('subscribe-modal'),
  modalOverlay: document.getElementById('modal-overlay'),
  closeModal: document.getElementById('close-modal'),
  subscribeBtn: document.getElementById('subscribe'),
  video: document.getElementById('bookstore-video'),
  filterButtons: document.querySelectorAll('.filter-chip'),
  jumpCards: document.querySelectorAll('[data-jump-filter]'),
  promoActions: document.querySelectorAll('[data-promo-filter]'),
  wishlistPanel: document.getElementById('wishlist-panel'),
  wishlistFab: document.getElementById('wishlist-fab'),
  closeWishlist: document.getElementById('close-wishlist'),
  wishlistList: document.getElementById('wishlist-list'),
  wishlistEmpty: document.getElementById('wishlist-empty'),
  wishlistCount: document.getElementById('wishlist-count'),
  contactForm: document.getElementById('contact-form'),
  openCheckout: document.getElementById('open-checkout'),
  checkoutPanel: document.getElementById('checkout-panel'),
  checkoutEmpty: document.getElementById('checkout-empty'),
  checkoutItems: document.getElementById('checkout-items'),
  checkoutSubtotal: document.getElementById('checkout-subtotal'),
  checkoutShipping: document.getElementById('checkout-shipping'),
  checkoutTax: document.getElementById('checkout-tax'),
  checkoutTotal: document.getElementById('checkout-total'),
  cartStatus: document.getElementById('cart-status'),
  placeOrder: document.getElementById('place-order'),
  paymentOptions: document.querySelectorAll('[data-payment-method]')
};

function money(value) { return `$${value.toFixed(2)}`; }

function normalize(text) {
  return text.toLowerCase().trim();
}

function getVisibleBooks() {
  const term = normalize(state.search);
  return books.filter((book) => {
    const matchesFilter = state.filter === 'all'
      || book.category === state.filter
      || (state.filter === 'wishlist' && state.wishlist.has(book.id));
    const haystack = normalize(`${book.title} ${book.author} ${book.category}`);
    const matchesSearch = !term || haystack.includes(term) || book.title.toLowerCase().startsWith(term);
    return matchesFilter && matchesSearch;
  });
}

function getCartStats() {
  let itemCount = 0;
  let subtotal = 0;
  state.cart.forEach((item, bookId) => {
    const book = books.find((entry) => entry.id === bookId);
    if (!book) return;
    itemCount += item.quantity;
    subtotal += book.price * item.quantity;
  });
  const shipping = itemCount > 0 ? 5 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { itemCount, subtotal, shipping, tax, total };
}

function getMatchingTitles() {
  const term = normalize(state.search);
  if (!term) return [];
  return books.filter((book) => book.title.toLowerCase().startsWith(term));
}

function renderBookGrid(target, booksToRender) {
  if (!target || !elements.template) return;
  target.innerHTML = '';

  booksToRender.forEach((book) => {
    const card = elements.template.content.firstElementChild.cloneNode(true);
    card.querySelector('.book-cover').src = book.image;
    card.querySelector('.book-cover').alt = book.title;
    card.querySelector('.book-category').textContent = book.category;
    card.querySelector('.book-title').textContent = book.title;
    card.querySelector('.book-author').textContent = `by ${book.author}`;
    card.querySelector('.book-price').textContent = money(book.price);

    const heart = card.querySelector('.wishlist-toggle');
    heart.dataset.bookId = book.id;
    heart.classList.toggle('is-active', state.wishlist.has(book.id));
    heart.textContent = state.wishlist.has(book.id) ? '♥' : '♡';

    const action = card.querySelector('[data-action="add-wishlist"]');
    action.dataset.bookId = book.id;
    action.textContent = state.wishlist.has(book.id) ? 'Saved' : 'Wish list';

    const cartAction = card.querySelector('[data-action="add-cart"]');
    cartAction.dataset.bookId = book.id;

    target.appendChild(card);
  });
}

function renderWishList() {
  if (!elements.wishlistList || !elements.wishlistEmpty) return;
  elements.wishlistList.innerHTML = '';
  const items = books.filter((book) => state.wishlist.has(book.id));
  elements.wishlistEmpty.hidden = items.length > 0;
  if (elements.wishlistCount) elements.wishlistCount.textContent = String(items.length);

  items.forEach((book) => {
    const item = document.createElement('article');
    item.className = 'wishlist-item';
    item.innerHTML = `
      <img src="${book.image}" alt="${book.title}">
      <div>
        <h4>${book.title}</h4>
        <p>${book.author}</p>
      </div>
      <button class="secondary-button" type="button" data-remove-wishlist="${book.id}">Remove</button>
    `;
    elements.wishlistList.appendChild(item);
  });
}

function renderCheckout() {
  if (!elements.checkoutItems || !elements.checkoutTotal || !elements.checkoutEmpty || !elements.cartStatus) return;

  const { itemCount, subtotal, shipping, tax, total } = getCartStats();
  elements.checkoutItems.innerHTML = '';
  if (elements.checkoutSubtotal) elements.checkoutSubtotal.textContent = money(subtotal);
  if (elements.checkoutShipping) elements.checkoutShipping.textContent = money(shipping);
  if (elements.checkoutTax) elements.checkoutTax.textContent = money(tax);
  elements.checkoutTotal.textContent = money(total);
  elements.cartStatus.textContent = `Cart: ${itemCount} item${itemCount === 1 ? '' : 's'} | Total: ${money(total)}`;
  elements.checkoutEmpty.hidden = itemCount > 0;

  state.cart.forEach((item, bookId) => {
    const book = books.find((entry) => entry.id === bookId);
    if (!book) return;

    const row = document.createElement('article');
    row.className = 'checkout-item';
    row.innerHTML = `
      <div>
        <h4>${book.title}</h4>
        <p>${money(book.price)} x ${item.quantity}</p>
      </div>
      <div class="checkout-actions">
        <button class="secondary-button" type="button" data-cart-action="decrease" data-book-id="${bookId}">-</button>
        <button class="secondary-button" type="button" data-cart-action="increase" data-book-id="${bookId}">+</button>
        <button class="secondary-button" type="button" data-cart-action="remove" data-book-id="${bookId}">Remove</button>
      </div>
    `;
    elements.checkoutItems.appendChild(row);
  });
}

function updateSearchUI() {
  const matches = getMatchingTitles();
  if (!elements.searchSuggestions || !elements.searchFeedback) return;

  elements.searchSuggestions.innerHTML = '';

  if (!state.search.trim()) {
    elements.searchFeedback.textContent = 'Type a first letter or full title to get suggestions.';
    return;
  }

  if (matches.length === 0) {
    elements.searchFeedback.textContent = 'Sorry, no books match that search.';
    return;
  }

  elements.searchFeedback.textContent = `${matches.length} suggestion${matches.length === 1 ? '' : 's'} found.`;
  matches.slice(0, 6).forEach((book) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'suggestion-chip';
    chip.innerHTML = `<strong>${book.title}</strong>&nbsp;by ${book.author}`;
    chip.addEventListener('click', () => {
      state.search = book.title;
      elements.searchInput.value = book.title;
      refreshBooks();
    });
    elements.searchSuggestions.appendChild(chip);
  });
}

function refreshBooks() {
  const visible = getVisibleBooks();
  renderBookGrid(elements.bookGrid, visible);
  renderWishList();
  renderCheckout();
  updateSearchUI();
}

function setFilter(filter) {
  state.filter = filter;
  elements.filterButtons.forEach((button) => button.classList.toggle('is-active', button.dataset.filter === filter));
  refreshBooks();
}

function toggleWishlist(bookId) {
  if (state.wishlist.has(bookId)) {
    state.wishlist.delete(bookId);
  } else {
    state.wishlist.add(bookId);
  }
  refreshBooks();
}

function addToCart(bookId) {
  const existing = state.cart.get(bookId);
  if (existing) {
    existing.quantity += 1;
    state.cart.set(bookId, existing);
  } else {
    state.cart.set(bookId, { quantity: 1 });
  }
  refreshBooks();
}

function changeCart(bookId, action) {
  const existing = state.cart.get(bookId);
  if (!existing) return;

  if (action === 'increase') existing.quantity += 1;
  if (action === 'decrease') existing.quantity -= 1;
  if (action === 'remove' || existing.quantity <= 0) {
    state.cart.delete(bookId);
  } else {
    state.cart.set(bookId, existing);
  }

  refreshBooks();
}

function openWishlist() {
  elements.wishlistPanel.classList.add('is-open');
  elements.wishlistPanel.setAttribute('aria-hidden', 'false');
}

function closeWishlist() {
  elements.wishlistPanel.classList.remove('is-open');
  elements.wishlistPanel.setAttribute('aria-hidden', 'true');
}

function openModal() {
  if (elements.modal?.showModal) {
    elements.modal.showModal();
  } else if (elements.modal) {
    elements.modal.setAttribute('open', 'true');
  }
  if (elements.modalOverlay) elements.modalOverlay.hidden = false;
}

function closeModal() {
  if (elements.modal?.close) {
    elements.modal.close();
  } else if (elements.modal) {
    elements.modal.removeAttribute('open');
  }
  if (elements.modalOverlay) elements.modalOverlay.hidden = true;
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  elements.themeToggle.textContent = isDark ? 'Dark' : 'Light';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function openContactSection() {
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

function openCheckoutPanel() {
  document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleBookCardClick(event) {
  const wishlistButton = event.target.closest('.wishlist-toggle');
  const actionButton = event.target.closest('[data-action="add-wishlist"]');
  const cartButton = event.target.closest('[data-action="add-cart"]');
  if (wishlistButton) toggleWishlist(wishlistButton.dataset.bookId);
  if (actionButton) toggleWishlist(actionButton.dataset.bookId);
  if (cartButton) {
    addToCart(cartButton.dataset.bookId);
    openCheckoutPanel();
  }
}

function setPaymentMethod(method) {
  state.paymentMethod = method;
  elements.paymentOptions.forEach((option) => {
    option.classList.toggle('is-active', option.dataset.paymentMethod === method);
  });
}

function setupVideoAutoplay() {
  if (!elements.video) return;

  const tryPlay = () => {
    const playPromise = elements.video.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          elements.video.pause();
        }
      });
    }, { threshold: 0.55 });
    observer.observe(elements.video);
  } else {
    const onScroll = () => {
      const rect = elements.video.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
        tryPlay();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  if (elements.themeToggle) elements.themeToggle.textContent = 'Dark';
}

if (elements.searchInput) {
  elements.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value;
    refreshBooks();
  });
}

if (elements.searchButton) {
  elements.searchButton.addEventListener('click', () => {
    refreshBooks();
  });
}

if (elements.filterButtons.length) {
  elements.filterButtons.forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter || 'all')));
}

if (elements.jumpCards.length) {
  elements.jumpCards.forEach((card) => {
    card.addEventListener('click', () => setFilter(card.dataset.jumpFilter || 'all'));
  });
}

if (elements.paymentOptions.length) {
  elements.paymentOptions.forEach((option) => {
    option.addEventListener('click', () => setPaymentMethod(option.dataset.paymentMethod || 'card'));
  });
}

if (elements.promoActions.length) {
  elements.promoActions.forEach((card) => {
    const runPromo = () => {
      setFilter(card.dataset.promoFilter || 'all');
      document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    card.addEventListener('click', runPromo);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        runPromo();
      }
    });
  });
}

if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleTheme);
if (elements.openModal) elements.openModal.addEventListener('click', openModal);
if (elements.closeModal) elements.closeModal.addEventListener('click', closeModal);
if (elements.modalOverlay) elements.modalOverlay.addEventListener('click', closeModal);
if (elements.subscribeBtn) elements.subscribeBtn.addEventListener('click', () => alert('Subscribed to the Readify demo newsletter.'));
if (elements.wishlistFab) elements.wishlistFab.addEventListener('click', openWishlist);
if (elements.closeWishlist) elements.closeWishlist.addEventListener('click', closeWishlist);
if (elements.openCheckout) elements.openCheckout.addEventListener('click', openCheckoutPanel);
if (elements.placeOrder) {
  elements.placeOrder.addEventListener('click', () => {
    const { itemCount, total } = getCartStats();
    if (itemCount === 0) {
      alert('Your cart is empty. Add a book first.');
      return;
    }
    alert(`Demo order completed for ${itemCount} item${itemCount === 1 ? '' : 's'} totaling ${money(total)} using ${state.paymentMethod.toUpperCase()}. No payment was processed.`);
    state.cart.clear();
    refreshBooks();
  });
}
if (elements.contactForm) {
  elements.contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thanks for contacting Readify. This demo message was sent successfully.');
    elements.contactForm.reset();
  });
}

document.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-wishlist]');
  if (removeButton) {
    state.wishlist.delete(removeButton.dataset.removeWishlist);
    refreshBooks();
    return;
  }

  const cartActionButton = event.target.closest('[data-cart-action]');
  if (cartActionButton) {
    changeCart(cartActionButton.dataset.bookId, cartActionButton.dataset.cartAction);
    return;
  }

  handleBookCardClick(event);
});

setupVideoAutoplay();
refreshBooks();