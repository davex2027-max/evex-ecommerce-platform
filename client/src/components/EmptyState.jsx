const EmptyState = ({ icon = '📦', title, message, action, actionLabel, onAction }) => {
    return (
        <div className="empty-state">
            <span className="empty-state-icon">{icon}</span>
            <h3>{title}</h3>
            {message && <p>{message}</p>}
            {action && (
                <button className="btn btn-primary" onClick={onAction}>
                    {actionLabel || action}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
