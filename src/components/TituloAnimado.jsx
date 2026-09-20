import { useState, useEffect } from "react";

export default function TituloAnimado({
  children,
  as: Tag = "h1",
  className = "",
  timeout,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), timeout);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Tag
      className={`transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
