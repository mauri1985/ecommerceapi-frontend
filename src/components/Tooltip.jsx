import { useState } from "react";

export default function Tooltip({ texto, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <span
        className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded pointer-events-none transition-opacity duration-150 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {texto}
      </span>
    </div>
  );
}
