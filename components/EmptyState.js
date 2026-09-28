const EmptyState = ({ icon, title, children, action }) => {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <i className={`fa-solid fa-${icon}`} />
      </span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
