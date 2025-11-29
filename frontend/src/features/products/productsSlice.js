import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 299.99,
            description: 'Experience audio like never before with our Premium Wireless Headphones. Featuring industry-leading active noise cancellation, these headphones block out the world so you can focus on your music. With a 30-hour battery life, plush memory foam ear cushions, and seamless Bluetooth 5.0 connectivity, they are designed for all-day comfort and performance. Includes a carrying case and USB-C charging cable.',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
                'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
                'https://images.unsplash.com/photo-1524678606372-fa87843ebd46?w=500&q=80',
            ],
            category: 'Electronics',
            stock: 15,
        },
        {
            id: 2,
            name: 'Ergonomic Office Chair',
            price: 199.50,
            description: 'Upgrade your workspace with our Ergonomic Office Chair. Designed to support your posture during long work hours, it features adjustable lumbar support, breathable mesh back, and a cushioned seat. The chair offers 360-degree swivel, smooth-rolling casters, and height adjustment to fit any desk. Say goodbye to back pain and hello to productivity.',
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80',
                'https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=500&q=80',
                'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80',
                'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80',
            ],
            category: 'Furniture',
            stock: 8,
        },
        {
            id: 3,
            name: 'Smart Watch Series 5',
            price: 349.00,
            description: 'Stay connected and healthy with the Smart Watch Series 5. This advanced wearable tracks your heart rate, sleep patterns, and daily activity with precision. It features an always-on Retina display, water resistance up to 50 meters, and built-in GPS. Receive notifications, make calls, and control your music right from your wrist. Compatible with iOS and Android.',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80',
                'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80',
                'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80',
            ],
            category: 'Electronics',
            stock: 20,
        },
        {
            id: 4,
            name: 'Minimalist Backpack',
            price: 79.99,
            description: 'The Minimalist Backpack is the perfect blend of style and functionality for your daily commute or weekend getaways. Made from water-resistant, durable canvas, it features a padded laptop sleeve (fits up to 15"), multiple internal pockets for organization, and comfortable adjustable straps. Its sleek design complements any outfit while keeping your essentials secure.',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
                'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=500&q=80',
                'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500&q=80',
                'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80',
            ],
            category: 'Accessories',
            stock: 50,
        },
    ],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    filter: 'All',
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action) => {
            state.items.push(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
    },
});

export const { addProduct, updateProduct, setFilter } = productsSlice.actions;

export const selectAllProducts = (state) => {
    if (state.products.filter === 'All') return state.products.items;
    return state.products.items.filter(item => item.category === state.products.filter);
};

export default productsSlice.reducer;
