const LoadingSpinner = ({ size = 'md', text = '' }) => {
    return (
        <div className={`spinner-wrapper spinner-${size}`}>
            <div className="spinner"></div>
            {text && <p className="spinner-text">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
