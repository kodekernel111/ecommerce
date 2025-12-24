import { createSlice } from '@reduxjs/toolkit';

// Hydrate state from localStorage
const loadState = () => {
    try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const userId = localStorage.getItem('userId');

        if (token && userStr) {
            const user = JSON.parse(userStr);
            // Ensure userId is present in user object if missing
            if (userId && !user.userId) {
                user.userId = userId;
            }
            return {
                user: user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        }
    } catch (e) {
        console.error("Failed to load auth state", e);
    }
    return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    };
};

const initialState = loadState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
