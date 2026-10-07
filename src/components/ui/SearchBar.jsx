export default function SearchBar({ value, onChange, placeholder = "Search notes, slides, books..." }) {
  return (
    <input
      className="search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
