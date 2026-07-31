// Session & Auth Guard
let currentUser = null;
function checkAuth() {
  const session = sessionStorage.getItem('enelectro_session');
  if (!session) {
    window.location.href = 'login.html';
    return false;
  }
  currentUser = JSON.parse(session);
  return true;
}

// Global UI / Filter state
let activeCategory = 'all';
let searchQuery = '';
let maxPrice = 3000;
let minRating = 0;
let sortBy = 'popular';
let cart = [];
let appliedPromo = null; // 'WELCOME10' for 10% off

// Setup session header data
function setupHeader() {
  if (!currentUser) return;
  document.getElementById('display-username').textContent = currentUser.name;
  
  // Get initials
  const parts = currentUser.name.split(' ');
  const initials = parts.map(p => p.charAt(0)).join('').substring(0, 2);
  document.getElementById('user-initials').textContent = initials || 'מ';
}

function logout() {
  sessionStorage.removeItem('enelectro_session');
  window.location.href = 'login.html';
}

// -------------------------------------------------------------
// CART STATE MANAGEMENT
// -------------------------------------------------------------
function loadCart() {
  if (!currentUser) return;
  const storedCart = localStorage.getItem(`enelectro_cart_${currentUser.email}`);
  cart = storedCart ? JSON.parse(storedCart) : [];
  updateCartBadge();
}

function saveCart() {
  if (!currentUser) return;
  localStorage.setItem(`enelectro_cart_${currentUser.email}`, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalQty;
  
  // Animate badge on change
  badge.classList.remove('pulse-animation');
  void badge.offsetWidth; // trigger reflow
  badge.style.animation = 'scaleBounce 0.3s ease';
  setTimeout(() => badge.style.animation = '', 300);
}

function addToCart(productId, quantity = 1) {
  const item = cart.find(i => i.productId === productId);
  const product = products.find(p => p.id === productId);
  
  if (!product) return;

  if (item) {
    item.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart();
  showToast(`המוצר "${product.name}" נוסף לסל הקניות`, 'success');
  renderCart();
}

function updateCartQuantity(productId, delta) {
  const item = cart.find(i => i.productId === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.productId !== productId);
  }
  
  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  const product = products.find(p => p.id === productId);
  cart = cart.filter(i => i.productId !== productId);
  saveCart();
  renderCart();
  if (product) {
    showToast(`המוצר "${product.name}" הוסר מהסל`, 'error');
  }
}

function renderCart() {
  const wrapper = document.getElementById('cart-items-wrapper');
  wrapper.innerHTML = '';

  if (cart.length === 0) {
    wrapper.innerHTML = `
      <div class="empty-cart-view">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <span>עגלת הקניות שלך ריקה</span>
      </div>
    `;
    updateCartTotals(0);
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    subtotal += product.price * item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${product.name}</div>
        <div class="cart-item-price">₪${product.price}</div>
        <div class="cart-item-controls">
          <div class="qty-counter">
            <button class="qty-btn" onclick="updateCartQuantity('${product.id}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity('${product.id}', 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${product.id}')" title="הסר מהסל">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    wrapper.appendChild(itemEl);
  });

  updateCartTotals(subtotal);
}

function updateCartTotals(subtotal) {
  let discount = 0;
  if (appliedPromo === 'WELCOME10') {
    discount = Math.round(subtotal * 0.1);
  }

  const finalTotal = subtotal - discount;
  const tax = Math.round(finalTotal * 17 / 117); // 17% VAT included

  document.getElementById('cart-subtotal').textContent = `₪${subtotal}`;
  
  const discountRow = document.getElementById('discount-row');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('cart-discount').textContent = `-₪${discount}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('cart-tax').textContent = `₪${tax}`;
  document.getElementById('cart-total').textContent = `₪${finalTotal}`;
}

function applyPromoCode() {
  const input = document.getElementById('promo-code-input');
  const code = input.value.trim().toUpperCase();

  if (code === 'WELCOME10') {
    appliedPromo = 'WELCOME10';
    showToast('קוד הקופון הוחל בהצלחה! 10% הנחה', 'success');
    renderCart();
  } else if (code === '') {
    showToast('נא להזין קוד קופון', 'error');
  } else {
    showToast('קוד קופון לא תקף', 'error');
  }
}

function toggleCart(open) {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  
  if (open) {
    overlay.classList.add('active');
    drawer.classList.add('active');
  } else {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
  }
}

// -------------------------------------------------------------
// FILTER & SEARCH LOGIC
// -------------------------------------------------------------
function triggerSearch() {
  const input = document.getElementById('catalog-search');
  searchQuery = input.value.trim().toLowerCase();
  renderCatalog();
}

function setCategoryFilter(category, button) {
  activeCategory = category;
  
  // Update UI active state
  const buttons = document.querySelectorAll('.cat-filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  
  renderCatalog();
}

function updatePriceSliderLabel(val) {
  maxPrice = parseInt(val);
  document.getElementById('price-limit-label').textContent = `עד ₪${maxPrice}`;
  renderCatalog();
}

function setRatingFilter(minStars, row) {
  if (minRating === minStars) {
    // toggle off
    minRating = 0;
    row.classList.remove('active');
  } else {
    minRating = minStars;
    const rows = document.querySelectorAll('.rating-filter-row');
    rows.forEach(r => r.classList.remove('active'));
    row.classList.add('active');
  }
  renderCatalog();
}

function resetAllFilters() {
  activeCategory = 'all';
  searchQuery = '';
  maxPrice = 3000;
  minRating = 0;
  sortBy = 'popular';

  // Reset inputs in DOM
  document.getElementById('catalog-search').value = '';
  document.getElementById('price-limit').value = 3000;
  document.getElementById('price-limit-label').textContent = 'עד ₪3000';
  document.getElementById('catalog-sort').value = 'popular';

  // Reset filter buttons style
  const buttons = document.querySelectorAll('.cat-filter-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-category') === 'all') btn.classList.add('active');
  });

  const ratingRows = document.querySelectorAll('.rating-filter-row');
  ratingRows.forEach(r => r.classList.remove('active'));

  renderCatalog();
  showToast('המסננים נוקו בהצלחה', 'success');
}

function handleSortChange() {
  const select = document.getElementById('catalog-sort');
  sortBy = select.value;
  renderCatalog();
}

// -------------------------------------------------------------
// CATALOG RENDERING
// -------------------------------------------------------------
function renderCatalog() {
  const container = document.getElementById('product-grid-container');
  container.innerHTML = '';

  // 1. Filtering
  let filtered = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesPrice = product.price <= maxPrice;
    const matchesRating = product.rating >= minRating;
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query) ||
      product.tagline.toLowerCase().includes(query) ||
      product.categoryLabel.toLowerCase().includes(query);

    return matchesCategory && matchesPrice && matchesRating && matchesSearch;
  });

  // Update title / counter
  const titleEl = document.getElementById('results-count-title');
  if (searchQuery) {
    titleEl.textContent = `תוצאות חיפוש עבור "${searchQuery}" (${filtered.length})`;
  } else {
    const catText = {
      'all': 'כל המוצרים לבית',
      'kitchen': 'מטבח טכנולוגי',
      'cleaning': 'ניקיון ותחזוקה',
      'climate': 'בקרת אקלים',
      'smarthome': 'בית חכם'
    }[activeCategory];
    titleEl.textContent = `${catText} (${filtered.length})`;
  }

  // 2. Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'popular') return b.reviewsCount - a.reviewsCount;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3>לא נמצאו מוצרים תואמים</h3>
        <p style="margin-top: 8px; color: var(--text-muted);">נסה לשנות את מסנני החיפוש או המחיר של הדף.</p>
      </div>
    `;
    return;
  }

  // 3. Render Cards
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Badge styling
    let badgeHtml = '';
    if (p.badge) {
      const badgeClass = p.badge.toLowerCase().replace(' ', '-');
      badgeHtml = `<span class="card-badge ${badgeClass}">${p.badge}</span>`;
    }

    // Stars display
    const fullStars = Math.floor(p.rating);
    const halfStar = p.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    const starString = '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);

    // Original price block
    const priceOriginalHtml = p.originalPrice ? `<span class="price-original">₪${p.originalPrice}</span>` : '';

    card.innerHTML = `
      ${badgeHtml}
      <div class="product-image-container" onclick="openProductDetails('${p.id}')">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="product-card-details">
        <span class="product-category">${p.categoryLabel}</span>
        <h3 class="product-name" onclick="openProductDetails('${p.id}')">${p.name}</h3>
        
        <div class="rating-row">
          <span class="stars" style="color: var(--gold-accent);">${starString}</span>
          <span class="rating-avg">${p.rating}</span>
          <span class="rating-count">(${p.reviewsCount} חוות דעת)</span>
        </div>

        <p class="product-short-desc">${p.description}</p>
        
        <div class="product-card-footer">
          <div class="price-block">
            ${priceOriginalHtml}
            <span class="price">₪${p.price}</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart('${p.id}')" title="הוסף לסל הקניות">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// -------------------------------------------------------------
// PRODUCT DETAIL MODAL
// -------------------------------------------------------------
let activeProductForModal = null;
let selectedStarInput = 5;

function openProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  activeProductForModal = product;
  selectedStarInput = 5;

  const modal = document.getElementById('product-modal');
  const content = document.getElementById('product-detail-content');

  // Stars rendering
  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  const starString = '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);

  // Specs lists
  const specsListHtml = product.specs.map(s => `<li>${s}</li>`).join('');

  // Reviews lists
  const reviewsHtml = product.reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <span class="review-user">${r.user}</span>
        <span class="stars">${'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}</span>
      </div>
      <div class="review-date">${r.date}</div>
      <p class="review-text">${r.text}</p>
    </div>
  `).join('');

  content.innerHTML = `
    <div class="detail-gallery">
      <img src="${product.image}" alt="${product.name}" class="detail-main-img">
    </div>
    
    <div class="detail-info">
      <span class="product-category">${product.categoryLabel}</span>
      <h2 class="detail-name">${product.name}</h2>
      <p class="detail-tagline">${product.tagline}</p>
      
      <div class="rating-row" style="margin-top: 4px;">
        <span class="stars" style="color: var(--gold-accent); font-size: 1.1rem;">${starString}</span>
        <span class="rating-avg" style="font-size: 1rem;">${product.rating}</span>
        <span class="rating-count">(${product.reviewsCount} ביקורות)</span>
      </div>

      <div class="detail-price-row">
        <span class="detail-price">₪${product.price}</span>
        ${product.originalPrice ? `<span class="price-original" style="font-size: 1.1rem;">₪${product.originalPrice}</span>` : ''}
      </div>

      <p class="detail-desc">${product.description}</p>
      
      <h4 style="margin-top: 10px; font-size: 1rem;">מפרט טכני עיקרי:</h4>
      <ul class="detail-specs-list">
        ${specsListHtml}
      </ul>

      <div class="detail-actions">
        <button class="detail-add-btn" onclick="addToCart('${product.id}'); closeProductModalDirect();">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          הוסף לסל הקניות
        </button>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="reviews-section">
      <h3 class="reviews-title">חוות דעת של רוכשים</h3>
      
      <!-- Write a Review -->
      <div class="add-review-form">
        <span class="add-review-title">כתוב חוות דעת משלך</span>
        
        <div style="display: flex; align-items: center; gap: 16px;">
          <span>דירוג:</span>
          <div class="star-rating-input">
            <button class="star-input-btn active" onclick="setStarInput(1)" data-star="1">★</button>
            <button class="star-input-btn active" onclick="setStarInput(2)" data-star="2">★</button>
            <button class="star-input-btn active" onclick="setStarInput(3)" data-star="3">★</button>
            <button class="star-input-btn active" onclick="setStarInput(4)" data-star="4">★</button>
            <button class="star-input-btn active" onclick="setStarInput(5)" data-star="5">★</button>
          </div>
        </div>

        <textarea class="review-textarea" id="review-comment" placeholder="מה דעתך על המוצר? (ספר לנו על איכות הבנייה, השימוש, אמינות...)"></textarea>
        
        <button class="submit-review-btn" onclick="submitReview()">פרסם חוות דעת</button>
      </div>

      <div class="reviews-grid" id="modal-reviews-grid">
        ${reviewsHtml || '<p style="color: var(--text-muted); grid-column: 1/-1;">אין ביקורות עדיין. היה הראשון לכתוב ביקורת!</p>'}
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeProductModalDirect() {
  document.getElementById('product-modal').classList.remove('active');
  activeProductForModal = null;
}

function closeProductModal(event) {
  if (event.target === document.getElementById('product-modal')) {
    closeProductModalDirect();
  }
}

// Interactive Review stars input selection
function setStarInput(rating) {
  selectedStarInput = rating;
  const stars = document.querySelectorAll('.star-input-btn');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function submitReview() {
  const commentVal = document.getElementById('review-comment').value.trim();
  if (!commentVal) {
    showToast('אנא כתוב תוכן חוות דעת לפני הפרסום', 'error');
    return;
  }

  const newReview = {
    user: currentUser.name,
    rating: selectedStarInput,
    text: commentVal,
    date: new Date().toISOString().split('T')[0]
  };

  // Push to database
  activeProductForModal.reviews.unshift(newReview);
  
  // Recalculate average rating
  const totalStars = activeProductForModal.reviews.reduce((sum, r) => sum + r.rating, 0);
  activeProductForModal.reviewsCount = activeProductForModal.reviews.length;
  activeProductForModal.rating = parseFloat((totalStars / activeProductForModal.reviewsCount).toFixed(1));

  // Re-render catalog and modal content
  renderCatalog();
  openProductDetails(activeProductForModal.id);
  showToast('חוות הדעת שלך פורסמה בהצלחה!', 'success');
}

// -------------------------------------------------------------
// CHECKOUT WIZARD PROCESS
// -------------------------------------------------------------
let checkoutStep = 1;

function openCheckoutWizard() {
  if (cart.length === 0) {
    showToast('סל הקניות שלך ריק. הוסף מוצרים לקנייה!', 'error');
    return;
  }
  
  // Close cart drawer first
  toggleCart(false);

  checkoutStep = 1;
  document.getElementById('checkout-modal').classList.add('active');
  document.getElementById('checkout-form').reset();
  
  updateCheckoutStepView();
}

function closeCheckoutModalDirect() {
  document.getElementById('checkout-modal').classList.remove('active');
}

function closeCheckoutModal(event) {
  if (event.target === document.getElementById('checkout-modal')) {
    closeCheckoutModalDirect();
  }
}

function changeCheckoutStep(direction) {
  if (direction === 1) {
    // Proceeding to next step - Validation check
    if (checkoutStep === 1) {
      const address = document.getElementById('shipping-address').value.trim();
      const phone = document.getElementById('shipping-phone').value.trim();
      if (!address || !phone) {
        showToast('נא למלא את כל שדות פרטי המשלוח', 'error');
        return;
      }
      if (!/^[0-9\-]{9,11}$/.test(phone.replace('-', ''))) {
        showToast('נא להזין מספר טלפון תקין', 'error');
        return;
      }
    } else if (checkoutStep === 2) {
      const cardName = document.getElementById('card-name').value.trim();
      const cardNum = document.getElementById('card-number').value.trim().replace(/\s/g, '');
      const expiry = document.getElementById('card-expiry').value.trim();
      const cvv = document.getElementById('card-cvv').value.trim();

      if (!cardName || !cardNum || !expiry || !cvv) {
        showToast('נא למלא את כל פרטי התשלום לסימולציה', 'error');
        return;
      }

      if (cardNum.length < 16 || cardNum.length > 19) {
        showToast('נא להזין מספר אשראי תקין (16 ספרות)', 'error');
        return;
      }
      
      // Submit order since verification passed
      submitOrder();
      return;
    } else if (checkoutStep === 3) {
      // Finished receipt view, close modal
      closeCheckoutModalDirect();
      return;
    }
  }

  checkoutStep += direction;
  updateCheckoutStepView();
}

function updateCheckoutStepView() {
  // Toggle forms
  document.querySelectorAll('.checkout-step-content').forEach((el, index) => {
    if (index + 1 === checkoutStep) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });

  // Toggle indicators
  document.querySelectorAll('.step-node').forEach((el, index) => {
    const stepNum = index + 1;
    el.className = 'step-node';
    if (stepNum === checkoutStep) {
      el.classList.add('active');
    } else if (stepNum < checkoutStep) {
      el.classList.add('completed');
      el.textContent = '✓';
    } else {
      el.textContent = stepNum;
    }
  });

  // Adjust button text and visibility
  const prevBtn = document.getElementById('btn-checkout-prev');
  const nextBtn = document.getElementById('btn-checkout-next');

  if (checkoutStep === 1) {
    prevBtn.style.display = 'none';
    nextBtn.textContent = 'המשך לתשלום';
  } else if (checkoutStep === 2) {
    prevBtn.style.display = 'block';
    nextBtn.textContent = 'בצע הזמנה (₪' + document.getElementById('cart-total').textContent.replace('₪', '') + ')';
  } else if (checkoutStep === 3) {
    prevBtn.style.display = 'none';
    nextBtn.textContent = 'סגור וסיים';
  }
}

function submitOrder() {
  const orderId = 'EN-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('receipt-order-id').textContent = `הזמנה מס' #${orderId}`;

  // Build items list for receipt card
  const receiptItemsWrapper = document.getElementById('receipt-items-list');
  receiptItemsWrapper.innerHTML = '';

  let totalPaid = 0;

  cart.forEach(item => {
    const p = products.find(prod => prod.id === item.productId);
    if (!p) return;
    totalPaid += p.price * item.quantity;
    
    const row = document.createElement('div');
    row.className = 'receipt-item-row';
    row.innerHTML = `
      <span>${p.name} (x${item.quantity})</span>
      <span>₪${p.price * item.quantity}</span>
    `;
    receiptItemsWrapper.appendChild(row);
  });

  // Adjust for promo discount
  let finalPaid = totalPaid;
  if (appliedPromo === 'WELCOME10') {
    const discount = Math.round(totalPaid * 0.1);
    finalPaid = totalPaid - discount;
    const discountRow = document.createElement('div');
    discountRow.className = 'receipt-item-row';
    discountRow.style.color = 'var(--teal-accent)';
    discountRow.innerHTML = `
      <span>קופון הנחה (10%):</span>
      <span>-₪${discount}</span>
    `;
    receiptItemsWrapper.appendChild(discountRow);
  }

  document.getElementById('receipt-total-paid').textContent = `₪${finalPaid}`;

  // Launch Confetti celebration!
  launchConfetti();

  // Clear Cart
  cart = [];
  appliedPromo = null;
  document.getElementById('promo-code-input').value = '';
  saveCart();
  renderCart();

  // Switch to step 3 (Receipt)
  checkoutStep = 3;
  updateCheckoutStepView();
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS Helper
// -------------------------------------------------------------
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' 
    ? `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    : `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// -------------------------------------------------------------
// PREMIUM CONFETTI EFFECT
// -------------------------------------------------------------
function launchConfetti() {
  const colors = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#3b82f6'];
  for (let i = 0; i < 75; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = Math.random() * 8 + 6 + 'px';
    confetti.style.height = Math.random() * 12 + 6 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '2px';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-20px';
    confetti.style.zIndex = '999';
    confetti.style.opacity = Math.random() * 0.7 + 0.3;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    const fallDuration = Math.random() * 1.5 + 1.5;
    const swayDuration = Math.random() * 1.5 + 0.5;

    confetti.style.transition = `top ${fallDuration}s linear, left ${swayDuration}s ease-in-out, transform ${fallDuration}s ease-in-out`;
    document.body.appendChild(confetti);

    // Trigger animation next frame
    requestAnimationFrame(() => {
      confetti.style.top = '110vh';
      confetti.style.left = `calc(${confetti.style.left} + ${Math.random() * 100 - 50}px)`;
      confetti.style.transform = `rotate(${Math.random() * 720}deg) scale(0.3)`;
    });

    setTimeout(() => confetti.remove(), fallDuration * 1000);
  }
}

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    setupHeader();
    loadCart();
    renderCart();
    renderCatalog();
    
    // Set up CTA button for hero banner (opens BaristaPro)
    const featuredCta = document.getElementById('featured-cta');
    if (featuredCta) {
      featuredCta.addEventListener('click', () => {
        openProductDetails('p2'); // BaristaPro Touch ID
      });
    }
  }
});
