import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFound = () => (
    <section id="page-hero" style={{ paddingTop: 180, minHeight: '70vh' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
            <div className="coming-soon" style={{ maxWidth: 640, margin: '0 auto' }}>
                <div className="eco-icon"><Compass size={26} /></div>
                <h1 className="section-title" style={{ fontSize: 'clamp(3rem,8vw,5rem)', margin: '10px 0' }}>
                    4<span className="grad-text">0</span>4
                </h1>
                <p className="section-text" style={{ maxWidth: 460, margin: '0 auto 28px' }}>
                    This page drifted off into the digital void. Let's get you back on course.
                </p>
                <div className="hero-actions" style={{ justifyContent: 'center' }}>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Back Home
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

export default NotFound;