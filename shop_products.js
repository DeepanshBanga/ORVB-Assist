// MultipleFiles/shop_products.js
import { supabase } from './supabase-config.js';
import { getCurrentUser } from './auth.js';

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    renderCart();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);
            addToCart(productName, productPrice);
        });
    });

    document.getElementById('checkout-all').addEventListener('click', checkoutAll);
});

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function saveCartToLocalStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCartToLocalStorage();
    renderCart();
    alert(`${name} added to cart!`);
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const cartTotalSpan = document.getElementById('cart-total');
    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    (₹${item.price.toFixed(2)} x ${item.quantity})
                </span>
                <span class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn-remove-item" data-name="${item.name}"><i class="fas fa-trash"></i></button>
            `;
            cartList.appendChild(listItem);
            total += item.price * item.quantity;
        });
    }

    cartTotalSpan.textContent = total.toFixed(2);

    document.querySelectorAll('.btn-remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.closest('button').dataset.name;
            removeFromCart(productName);
        });
    });
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCartToLocalStorage();
    renderCart();
}

async function checkoutAll() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const user = await getCurrentUser();
    if (!user) {
        alert('Please log in to proceed with checkout.');
        window.location.href = 'login.html';
        return;
    }

    const orderItems = cart.map(item => ({
        product_name: item.name,
        quantity: item.quantity,
        price_per_unit: item.price,
        total_price: item.price * item.quantity
    }));
    const totalAmount = parseFloat(document.getElementById('cart-total').textContent);

    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: user.id,
                    order_date: new Date().toISOString(),
                    total_amount: totalAmount,
                    status: 'Pending',
                    items: orderItems // Store items as JSONB
                }
            ])
            .select(); // Select the inserted data to get the order ID

        if (error) throw error;

        const orderId = data[0].id;
        alert(`Checkout successful! Your Order ID is #${orderId}.`);
        cart = []; // Clear cart after successful checkout
        saveCartToLocalStorage();
        renderCart();
        // Optionally, redirect to an order confirmation page or profile
        // window.location.href = 'profile.html';

    } catch (error) {
        console.error('Checkout failed:', error.message);
        alert('Checkout failed: ' + error.message);
    }
}