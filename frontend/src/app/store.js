import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import sellerReducer from '../features/seller/sellerSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        seller: sellerReducer,
        auth: authReducer,
    },
});

// Save cart state to localStorage whenever it changes
store.subscribe(() => {
    try {
        const cartState = store.getState().cart;
        const serializedState = JSON.stringify(cartState);
        localStorage.setItem('cart', serializedState);
    } catch (err) {
        // Ignore write errors
        console.error("Could not save cart state", err);
    }
});
