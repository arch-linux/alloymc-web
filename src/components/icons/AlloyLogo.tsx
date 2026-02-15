export function AlloyLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Anvil / ingot shape */}
      <path
        d="M20 4L6 14v4l14 10 14-10v-4L20 4z"
        fill="url(#logo-gradient)"
      />
      <path d="M20 18L6 14v4l14 10V18z" fill="#e06000" />
      <path d="M20 18l14-4v4L20 28V18z" fill="#cc5500" />
      {/* Spark */}
      <circle cx="20" cy="12" r="2" fill="#f0b830" />
      <defs>
        <linearGradient id="logo-gradient" x1="6" y1="4" x2="34" y2="28">
          <stop stopColor="#ff9a4a" />
          <stop offset="1" stopColor="#f04800" />
        </linearGradient>
      </defs>
    </svg>
  );
}
