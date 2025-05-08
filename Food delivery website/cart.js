// Order Now Functionality
document.addEventListener("DOMContentLoaded", () => {
    const orderButtons = document.querySelectorAll(".order-btn");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to update cart count in the navbar
    const updateCartCount = () => {
        const cartCountElement = document.querySelector(".cart-count");
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
        }
    };

    // Add event listeners to "Order Now" buttons
    orderButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const dishName = button.getAttribute("data-name");
            const dishPrice = parseFloat(button.getAttribute("data-price"));

            // Add the dish to the cart
            const cartItem = { name: dishName, price: dishPrice };
            cart.push(cartItem);

            // Save the updated cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Update the cart count
            updateCartCount();

            // Notify the user
            alert(`${dishName} has been added to your cart!`);
        });
    });

    // Initialize the cart count on page load
    updateCartCount();
});

document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartEmptyMessage = document.querySelector(".cart-empty");
    const itemsTotalElement = document.querySelector(".items-total");
    const totalAmountElement = document.querySelector(".total-amount");
    const taxesAmountElement = document.querySelector(".taxes-amount");
    const checkoutButton = document.querySelector(".checkout-btn");

    // Retrieve cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to render cart items
    const renderCartItems = () => {
        if (cart.length === 0) {
            cartEmptyMessage.style.display = "block";
            cartItemsContainer.innerHTML = ""; // Clear any existing items
            itemsTotalElement.textContent = "₹0";
            taxesAmountElement.textContent = "₹0";
            totalAmountElement.textContent = "₹0";
            checkoutButton.disabled = true;
            return;
        }

        cartEmptyMessage.style.display = "none";
        checkoutButton.disabled = false;

        let itemsTotal = 0;
        cartItemsContainer.innerHTML = ""; // Clear existing items

        cart.forEach((item, index) => {
            itemsTotal += item.price;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <div class="item-details">
                    <span>${item.name}</span>
                    <span>₹${item.price}</span>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Update billing details
        const taxes = Math.round(itemsTotal * 0.05); // 5% GST
        const deliveryFee = 40; // Fixed delivery fee
        const platformFee = 10; // Fixed platform fee
        const totalAmount = itemsTotal + taxes + deliveryFee + platformFee;

        itemsTotalElement.textContent = `₹${itemsTotal}`;
        taxesAmountElement.textContent = `₹${taxes}`;
        totalAmountElement.textContent = `₹${totalAmount}`;
    };

    // Function to remove an item from the cart
    cartItemsContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-item")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1); // Remove the item from the cart array
            localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
            renderCartItems(); // Re-render the cart items
        }
    });

    // Render cart items on page load
    renderCartItems();
});
