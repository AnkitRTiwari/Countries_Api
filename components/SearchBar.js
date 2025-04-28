const SearchBar = ({ setEntry }) => {
  return (
    <div className="search-container">
      <i className="fa-solid fa-magnifying-glass"></i>
      <input
        type="text"
        placeholder="Search for a country or continent..."
        onChange={(e) => {
          setEntry(e.target.value.toLowerCase());
        }}
      />
    </div>
  );
};

export default SearchBar;
