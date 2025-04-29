document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.querySelector('.cart-items');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartCount = document.querySelector('.cart-count');
    const itemsTotal = document.querySelector('.items-total');
    const taxesAmount = document.querySelector('.taxes-amount');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');

    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Update cart count
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

        if (cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'flex';
            checkoutBtn.disabled = true;
            return;
        }

        cartItems.style.display = 'block';
        cartEmpty.style.display = 'none';
        checkoutBtn.disabled = false;

        // Clear existing items
        cartItems.innerHTML = '';

        // Group items by restaurant
        const itemsByRestaurant = {};
        cart.forEach(item => {
            if (!itemsByRestaurant[item.restaurant]) {
                itemsByRestaurant[item.restaurant] = [];
            }
            itemsByRestaurant[item.restaurant].push(item);
        });

        // Calculate totals
        let subtotal = 0;
        Object.entries(itemsByRestaurant).forEach(([restaurant, items]) => {
            const restaurantDiv = document.createElement('div');
            restaurantDiv.className = 'restaurant-group';
            restaurantDiv.innerHTML = `
                <h3 class="restaurant-name">${restaurant}</h3>
                <div class="restaurant-items"></div>
            `;

            const restaurantItems = restaurantDiv.querySelector('.restaurant-items');
            items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">₹${item.price}</div>
                        <div class="item-controls">
                            <button onclick="updateQuantity('${item.id}', -1)" class="quantity-btn">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button onclick="updateQuantity('${item.id}', 1)" class="quantity-btn">+</button>
                        </div>
                    </div>
                    <div class="item-total">
                        ₹${itemTotal}
                    </div>
                    <button onclick="removeFromCart('${item.id}')" class="remove-item">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                restaurantItems.appendChild(itemDiv);
            });

            cartItems.appendChild(restaurantDiv);
        });

        // Update summary
        const taxes = Math.round(subtotal * 0.05); // 5% GST
        const total = subtotal + 40 + 10 + taxes; // Add delivery and platform fee

        itemsTotal.textContent = `₹${subtotal}`;
        taxesAmount.textContent = `₹${taxes}`;
        totalAmount.textContent = `₹${total}`;
    }

    // Handle quantity updates
    window.updateQuantity = function(itemId, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    };

    // Handle item removal
    window.removeFromCart = function(itemId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        updateCart();
    };

    // Handle checkout
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const address = document.getElementById('address').value;
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const taxes = Math.round(subtotal * 0.05);
        const total = subtotal + 40 + 10 + taxes;

        // Create order
        const order = {
            id: 'ORD' + Date.now(),
            items: cart,
            totalAmount: total,
            deliveryAddress: address,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');

        // Show success message and redirect
        alert('Order placed successfully! Order ID: ' + order.id);
        window.location.href = 'order-confirmation.html?orderId=' + order.id;
    });

    // Initialize cart
    updateCart();
});
