import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], totalPrice: 0 });
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        if (!user) {
            setCart({ items: [], totalPrice: 0 });
            return;
        }
        try {
            setLoading(true);
            const { data } = await API.get('/cart');
            setCart(data);
        } catch (err) {
            console.error('Failed to fetch cart:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const { data } = await API.post('/cart/add', { productId, quantity });
            setCart(data);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const { data } = await API.put(`/cart/${productId}`, { quantity });
            setCart(data);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const removeItem = async (productId) => {
        try {
            const { data } = await API.delete(`/cart/${productId}`);
            setCart(data);
            return data;
        } catch (err) {
            throw err;
        }
    };

    const clearCart = async () => {
        try {
            const { data } = await API.delete('/cart');
            setCart(data);
            return data;
        } catch (err) {
            throw err;
        }
    };

    return (
        <CartContext.Provider
            value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
