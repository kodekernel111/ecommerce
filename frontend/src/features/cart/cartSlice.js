import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const initialState = loadState() || {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);
            const quantityToAdd = newItem.quantity || 1;

            if (!existingItem) {
                // Ensure we don't start with more than stock
                const safeQuantity = newItem.stock && quantityToAdd > newItem.stock ? newItem.stock : quantityToAdd;

                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    image: newItem.image,
                    quantity: safeQuantity,
                    stock: newItem.stock, // Store stock limit
                    totalPrice: newItem.price * safeQuantity,
                });
                state.totalQuantity += safeQuantity;
                state.totalAmount += newItem.price * safeQuantity;
            } else {
                // Determine how much we can actually add
                let safeQuantityToAdd = quantityToAdd;
                if (existingItem.stock) {
                    const availableSpace = existingItem.stock - existingItem.quantity;
                    if (availableSpace <= 0) {
                        return; // Cannot add any more
                    }
                    if (quantityToAdd > availableSpace) {
                        safeQuantityToAdd = availableSpace;
                    }
                }

                existingItem.quantity += safeQuantityToAdd;
                existingItem.totalPrice += newItem.price * safeQuantityToAdd;

                // Update stock if it changed in the backend (optional, but good to keep fresh)
                if (newItem.stock !== undefined) {
                    existingItem.stock = newItem.stock;
                }

                state.totalQuantity += safeQuantityToAdd;
                state.totalAmount += newItem.price * safeQuantityToAdd;
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.totalAmount -= existingItem.totalPrice;
                state.items = state.items.filter((item) => item.id !== id);
            }
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem && quantity > 0) {
                // Check stock limit
                if (existingItem.stock && quantity > existingItem.stock) {
                    return; // Ignore update if exceeding stock
                }

                const quantityDiff = quantity - existingItem.quantity;
                state.totalQuantity += quantityDiff;
                state.totalAmount += quantityDiff * existingItem.price;

                existingItem.quantity = quantity;
                existingItem.totalPrice = quantity * existingItem.price;
            }
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
