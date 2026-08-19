import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
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
import './App.css';

function App() {
    return (
        <AuthProvider>
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
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/my-orders" element={<MyOrders />} />
                            <Route path="/ads" element={<AdList />} />
                            <Route path="/my-ads" element={<MyAds />} />
                            <Route path="/admin" element={<AdminPanel />} />
                        </Routes>
                    </main>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
