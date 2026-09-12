export default function LogoMauriShop({ className = "h-12" }) {
  return (
    <svg
      viewBox="0 0 340 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>MauriShop</title>
      <circle cx="80" cy="80" r="65" fill="#ffffff" />
      <g transform="translate(30,20)">
        <path
          d="M4 4 H24 L40 68 H100 L114 22 H30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="52" cy="98" r="22" fill="#ffffff" />
        <circle cx="92" cy="98" r="22" fill="#ffffff" />
        <path
          d="M4 4 H24 L40 68 H100 L114 22 H30"
          fill="none"
          stroke="#2563eb"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="52" cy="98" r="15" fill="#2563eb" />
        <circle cx="92" cy="98" r="15" fill="#2563eb" />
      </g>
      <text
        x="180"
        y="65"
        fontFamily="'Boogaloo', sans-serif"
        fontWeight="700"
        fontSize="55"
        fill="#023e8a"
      >
        MAURI
      </text>
      <text
        x="185"
        y="60"
        fontFamily="'Boogaloo', sans-serif"
        fontWeight="700"
        fontSize="55"
        fill="#ffffff"
      >
        MAURI
      </text>
      <text
        x="175"
        y="145"
        fontFamily="'Boogaloo', sans-serif"
        fontWeight="700"
        fontSize="85"
        fill="#023e8a"
      >
        Shop
      </text>
      <text
        x="180"
        y="140"
        fontFamily="'Boogaloo', sans-serif"
        fontWeight="700"
        fontSize="85"
        fill="#ffffff"
      >
        Shop
      </text>
    </svg>
  );
}
