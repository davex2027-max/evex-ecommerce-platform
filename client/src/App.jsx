import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import AdList from './pages/AdList';
import MyAds from './pages/MyAds';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <CartProvider>
                    <Router>
                        <Navbar />
                        <main className="container">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/products" element={<ProductList />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route path="/cart" element={
                                    <ProtectedRoute><CartPage /></ProtectedRoute>
                                } />
                                <Route path="/checkout" element={
                                    <ProtectedRoute><Checkout /></ProtectedRoute>
                                } />
                                <Route path="/my-orders" element={
                                    <ProtectedRoute><MyOrders /></ProtectedRoute>
                                } />
                                <Route path="/ads" element={<AdList />} />
                                <Route path="/my-ads" element={
                                    <ProtectedRoute roles={['advertiser', 'business_owner']}><MyAds /></ProtectedRoute>
                                } />
                                <Route path="/admin" element={
                                    <ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>
                                } />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </Router>
                </CartProvider>
            </ToastProvider>
        </AuthProvider>
    );
}

export default App;
