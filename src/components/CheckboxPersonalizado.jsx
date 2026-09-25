export default function CheckboxPersonalizado({
  checked,
  onChange,
  label,
  className = "",
}) {
  return (
    <label
      className={`flex items-center gap-2 text-sm cursor-pointer ${className}`}
    >
      <span className="relative flex items-center shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-600 checked:border-blue-600"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      {label}
    </label>
  );
}
