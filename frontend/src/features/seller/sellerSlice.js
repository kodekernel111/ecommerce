import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inventory: [], // Could be a reference to products or separate
    sales: 0,
    revenue: 0,
};

const sellerSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {
        recordSale: (state, action) => {
            const { amount } = action.payload;
            state.sales += 1;
            state.revenue += amount;
        },
    },
});

export const { recordSale } = sellerSlice.actions;
export default sellerSlice.reducer;
