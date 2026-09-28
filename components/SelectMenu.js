const SelectMenu = ({ label, icon, value, options, onChange }) => {
  return (
    <label className="select-menu">
      <i className={`fa-solid fa-${icon}`} />
      <span className="visually-hidden">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <i className="fa-solid fa-chevron-down select-menu-caret" />
    </label>
  );
};

export default SelectMenu;
