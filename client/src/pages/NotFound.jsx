import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <h1>404</h1>
                <p>Page not found</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
        </div>
    );
};

export default NotFound;
