export function MoltenCracks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
      >
        <defs>
          <linearGradient id="crack-glow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6b00" />
            <stop offset="50%" stopColor="#f0b830" />
            <stop offset="100%" stopColor="#ff4400" />
          </linearGradient>
          <filter id="crack-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Main fracture lines — jagged, organic */}
        <g stroke="url(#crack-glow)" strokeWidth="1.5" fill="none" filter="url(#crack-blur)">
          {/* Central web */}
          <path d="M600 400 L520 320 L480 310 L420 340 L350 300 L280 310 L200 280" />
          <path d="M600 400 L680 340 L740 350 L800 310 L860 330 L950 290 L1020 300" />
          <path d="M600 400 L580 480 L560 530 L520 580 L490 650" />
          <path d="M600 400 L640 470 L680 520 L720 600 L750 680" />
          <path d="M600 400 L550 390 L500 420 L430 410 L370 440 L280 430" />
          <path d="M600 400 L660 420 L720 410 L800 440 L880 420 L960 450" />

          {/* Branches */}
          <path d="M520 320 L540 260 L520 200 L530 140" />
          <path d="M680 340 L700 270 L680 210 L700 150" />
          <path d="M480 310 L450 250 L420 200" />
          <path d="M740 350 L770 280 L800 220" />
          <path d="M580 480 L520 500 L460 490 L400 510" />
          <path d="M640 470 L700 490 L760 480 L820 500" />
          <path d="M350 300 L330 240 L300 180" />
          <path d="M860 330 L890 260 L920 200" />

          {/* Fine secondary fractures */}
          <path d="M420 340 L400 400 L370 460" strokeWidth="0.8" />
          <path d="M800 310 L830 370 L860 440" strokeWidth="0.8" />
          <path d="M560 530 L600 560 L650 550" strokeWidth="0.8" />
          <path d="M500 420 L480 470 L450 520" strokeWidth="0.8" />
          <path d="M720 410 L750 460 L780 520" strokeWidth="0.8" />
          <path d="M540 260 L580 240 L610 260" strokeWidth="0.8" />
          <path d="M700 270 L660 250 L640 270" strokeWidth="0.8" />
        </g>

        {/* Bright hotspots at intersections */}
        <g fill="#ff6b00" opacity="0.4">
          <circle cx="600" cy="400" r="4" className="animate-glow-pulse" />
          <circle cx="520" cy="320" r="2.5" className="animate-glow-pulse" style={{ animationDelay: "1s" }} />
          <circle cx="680" cy="340" r="2.5" className="animate-glow-pulse" style={{ animationDelay: "2s" }} />
          <circle cx="580" cy="480" r="2" className="animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <circle cx="640" cy="470" r="2" className="animate-glow-pulse" style={{ animationDelay: "3s" }} />
        </g>
      </svg>
    </div>
  );
}
