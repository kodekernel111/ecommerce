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
                state.items.push({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    image: newItem.image,
                    quantity: quantityToAdd,
                    totalPrice: newItem.price * quantityToAdd,
                });
                state.totalQuantity += quantityToAdd;
            } else {
                existingItem.quantity += quantityToAdd;
                existingItem.totalPrice += newItem.price * quantityToAdd;
                state.totalQuantity += quantityToAdd;
            }
            state.totalAmount += newItem.price * quantityToAdd;
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
    },
});

export const { addToCart, removeFromCart, updateQuantity, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;
