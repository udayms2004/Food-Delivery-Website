// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'white';
        navbar.style.boxShadow = 'none';
    }
});

// Restaurant cards hover effect
const restaurantCards = document.querySelectorAll('.restaurant-card');
restaurantCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Search functionality
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Add your search logic here
        alert(`Searching for restaurants near: ${searchTerm}`);
    }
});

// Mobile menu toggle (to be implemented with additional HTML/CSS)
function toggleMobileMenu() {
    const navItems = document.querySelector('.nav-items');
    navItems.classList.toggle('show');
}

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
});

// Initialize with some animation
document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        heroContent.style.transition = 'all 0.8s ease';
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function addToCart(itemId, name, restaurant, price, image) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: name,
            restaurant: restaurant,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Item added to cart');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartCount();
            if (window.location.pathname.includes('cart.html')) {
                renderCart();
            }
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const grandTotal = document.querySelector('.grand-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add items from restaurants to begin your order</p>
            </div>
        `;
        cartTotal.textContent = '₹0';
        grandTotal.textContent = '₹0';
        return;
    }
    
    let totalAmount = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        return `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-restaurant">${item.restaurant}</p>
                    <p class="item-price">₹${item.price}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `₹${totalAmount}`;
    grandTotal.textContent = `₹${totalAmount + 50}`; // Adding delivery and platform fee
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize cart if on cart page
if (window.location.pathname.includes('cart.html')) {
    renderCart();
}

// Restaurant page functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-restaurants input');
    const sortSelect = document.querySelector('.sort-by select');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    const paginationButtons = document.querySelectorAll('.page-btn');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            restaurantCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const cuisine = card.querySelector('.cuisine').textContent.toLowerCase();
                const isMatch = name.includes(searchTerm) || cuisine.includes(searchTerm);
                card.style.display = isMatch ? 'block' : 'none';
            });
            updateNoResults();
        });
    }

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const cardsArray = Array.from(restaurantCards);
            
            cardsArray.sort((a, b) => {
                switch(sortValue) {
                    case 'rating':
                        return getRating(b) - getRating(a);
                    case 'delivery-time':
                        return getDeliveryTime(a) - getDeliveryTime(b);
                    case 'cost-low':
                        return getCost(a) - getCost(b);
                    case 'cost-high':
                        return getCost(b) - getCost(a);
                    default:
                        return 0;
                }
            });

            const grid = document.querySelector('.restaurant-grid');
            cardsArray.forEach(card => grid.appendChild(card));
        });
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.textContent.toLowerCase();
            restaurantCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (filter === 'pure veg') {
                    const isVeg = card.querySelector('.badge').textContent.toLowerCase().includes('pure veg');
                    card.style.display = isVeg ? 'block' : 'none';
                } else if (filter === 'non-veg') {
                    const isNonVeg = card.querySelector('.badge').textContent.toLowerCase().includes('non-veg');
                    card.style.display = isNonVeg ? 'block' : 'none';
                } else if (filter === 'rating 4.0+') {
                    const rating = getRating(card);
                    card.style.display = rating >= 4.0 ? 'block' : 'none';
                } else if (filter === 'fast delivery') {
                    const deliveryTime = getDeliveryTime(card);
                    card.style.display = deliveryTime <= 30 ? 'block' : 'none';
                } else if (filter === 'offers') {
                    // Add offer filtering logic here
                    card.style.display = 'block';
                }
            });
            updateNoResults();
        });
    });

    // Pagination functionality
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Add pagination logic here
        });
    });

    // Helper functions
    function getRating(card) {
        const ratingText = card.querySelector('.rating').textContent;
        return parseFloat(ratingText.replace(/[^\d.]/g, ''));
    }

    function getDeliveryTime(card) {
        const timeText = card.querySelector('.restaurant-meta span:first-child').textContent;
        return parseInt(timeText.match(/\d+/)[0]);
    }

    function getCost(card) {
        const costText = card.querySelector('.restaurant-meta span:last-child').textContent;
        return parseInt(costText.match(/\d+/)[0]);
    }

    function updateNoResults() {
        const visibleCards = Array.from(restaurantCards).filter(card => 
            card.style.display !== 'none'
        ).length;

        let noResults = document.querySelector('.no-results');
        if (visibleCards === 0) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No restaurants found</h3>
                    <p>Try changing your filters or search term</p>
                `;
                document.querySelector('.restaurant-grid').appendChild(noResults);
            }
        } else if (noResults) {
            noResults.remove();
        }
    }

    // Loading animation
    function showLoadingState() {
        restaurantCards.forEach(card => {
            card.classList.add('loading');
            card.querySelector('.restaurant-img').classList.add('skeleton');
            card.querySelector('.restaurant-info h3').classList.add('skeleton');
            card.querySelector('.cuisine').classList.add('skeleton');
            card.querySelectorAll('.restaurant-meta span').forEach(span => 
                span.classList.add('skeleton')
            );
        });
    }

    function hideLoadingState() {
        restaurantCards.forEach(card => {
            card.classList.remove('loading');
            card.querySelectorAll('.skeleton').forEach(el => 
                el.classList.remove('skeleton')
            );
        });
    }

    // Simulate loading state
    showLoadingState();
    setTimeout(hideLoadingState, 1000);
});

// Menu page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for menu categories
    const menuLinks = document.querySelectorAll('.menu-categories a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const offset = 80; // Account for fixed navbar
            
            window.scrollTo({
                top: targetSection.offsetTop - offset,
                behavior: 'smooth'
            });

            // Update active state
            menuLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
        });
    });

    // Update active menu category on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.menu-section');
        let currentSection = '';
        const offset = 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.parentElement.classList.add('active');
            }
        });
    });

    // Add to cart functionality for menu items
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const menuItem = this.closest('.menu-item');
            const itemId = generateItemId(menuItem);
            const itemName = menuItem.querySelector('.item-header h3').textContent;
            const itemPrice = parseInt(menuItem.querySelector('.price').textContent.replace(/[^\d]/g, ''));
            const itemImage = menuItem.querySelector('img').src;
            const restaurantName = document.querySelector('.restaurant-details h1').textContent;

            addToCart(itemId, itemName, restaurantName, itemPrice, itemImage);

            // Change button to quantity control
            this.innerHTML = `
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${itemId}', -1)">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-btn" onclick="updateQuantity('${itemId}', 1)">+</button>
                </div>
            `;
            this.classList.add('in-cart');
        });
    });

    // Helper function to generate unique item ID
    function generateItemId(menuItem) {
        const name = menuItem.querySelector('.item-header h3').textContent;
        const restaurant = document.querySelector('.restaurant-details h1').textContent;
        return `${restaurant.toLowerCase().replace(/\s+/g, '-')}-${name.toLowerCase().replace(/\s+/g, '-')}`;
    }

    // Update quantity display for items already in cart
    function updateCartButtons() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        addToCartButtons.forEach(button => {
            const menuItem = button.closest('.menu-item');
            const itemId = generateItemId(menuItem);
            const cartItem = cartItems.find(item => item.id === itemId);
            
            if (cartItem) {
                button.innerHTML = `
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${itemId}', -1)">-</button>
                        <span class="quantity">${cartItem.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${itemId}', 1)">+</button>
                    </div>
                `;
                button.classList.add('in-cart');
            }
        });
    }

    // Initialize cart buttons
    if (window.location.pathname.includes('/restaurants/')) {
        updateCartButtons();
    }
});
