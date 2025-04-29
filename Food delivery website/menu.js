document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelectorAll('.cart-count');
    
    // Initialize cart in localStorage if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Update cart count in the navbar
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.forEach(element => {
            element.textContent = count;
        });
    }

    // Add item to cart
    function addToCart(itemElement) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemDetails = itemElement.closest('.item-details');
        const menuItem = itemElement.closest('.menu-item');
        
        const item = {
            id: Date.now().toString(), // Unique ID for the item
            name: itemDetails.querySelector('h3').textContent,
            price: parseInt(itemDetails.querySelector('.price').textContent.replace('₹', '')),
            image: menuItem.querySelector('img').src,
            restaurant: document.querySelector('.restaurant-details h1').textContent,
            quantity: 1
        };

        // Check if item from same restaurant exists
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.name === item.name && 
            cartItem.restaurant === item.restaurant
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(item);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Show success message
        const button = itemElement;
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
            button.style.color = '';
        }, 1000);
    }

    // Add click event listeners to all Add to Cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            addToCart(this);
        });
    });

    // Initialize cart count
    updateCartCount();
});
