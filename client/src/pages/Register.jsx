import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [formError, setFormError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await register(name, email, password, role);
            navigate('/');
        } catch (err) {
            setFormError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <h2>Register</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <div className="form-group">
                    <label>Account Type</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">Customer</option>
                        <option value="advertiser">Advertiser</option>
                        <option value="business_owner">Business Owner</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p className="auth-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;
