export function MoltenCracks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
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
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="hotspot-glow">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Blurred under-layer for glow bleed */}
        <g stroke="url(#crack-glow)" fill="none" filter="url(#crack-blur)" opacity="0.18">
          <path d="M600 400 L520 320 L480 310 L420 340 L350 300 L280 310 L200 280" strokeWidth="4" />
          <path d="M600 400 L680 340 L740 350 L800 310 L860 330 L950 290 L1020 300" strokeWidth="4" />
          <path d="M600 400 L580 480 L560 530 L520 580 L490 650" strokeWidth="4" />
          <path d="M600 400 L640 470 L680 520 L720 600 L750 680" strokeWidth="4" />
          <path d="M600 400 L550 390 L500 420 L430 410 L370 440 L280 430" strokeWidth="3" />
          <path d="M600 400 L660 420 L720 410 L800 440 L880 420 L960 450" strokeWidth="3" />
        </g>

        {/* Sharp main fracture lines */}
        <g stroke="url(#crack-glow)" fill="none" opacity="0.14">
          {/* Central web */}
          <path d="M600 400 L520 320 L480 310 L420 340 L350 300 L280 310 L200 280" strokeWidth="2" />
          <path d="M600 400 L680 340 L740 350 L800 310 L860 330 L950 290 L1020 300" strokeWidth="2" />
          <path d="M600 400 L580 480 L560 530 L520 580 L490 650" strokeWidth="2" />
          <path d="M600 400 L640 470 L680 520 L720 600 L750 680" strokeWidth="2" />
          <path d="M600 400 L550 390 L500 420 L430 410 L370 440 L280 430" strokeWidth="1.5" />
          <path d="M600 400 L660 420 L720 410 L800 440 L880 420 L960 450" strokeWidth="1.5" />

          {/* Branches */}
          <path d="M520 320 L540 260 L520 200 L530 140" strokeWidth="1.5" />
          <path d="M680 340 L700 270 L680 210 L700 150" strokeWidth="1.5" />
          <path d="M480 310 L450 250 L420 200" strokeWidth="1.5" />
          <path d="M740 350 L770 280 L800 220" strokeWidth="1.5" />
          <path d="M580 480 L520 500 L460 490 L400 510" strokeWidth="1.5" />
          <path d="M640 470 L700 490 L760 480 L820 500" strokeWidth="1.5" />
          <path d="M350 300 L330 240 L300 180" strokeWidth="1.5" />
          <path d="M860 330 L890 260 L920 200" strokeWidth="1.5" />

          {/* Fine secondary fractures */}
          <path d="M420 340 L400 400 L370 460" strokeWidth="1" />
          <path d="M800 310 L830 370 L860 440" strokeWidth="1" />
          <path d="M560 530 L600 560 L650 550" strokeWidth="1" />
          <path d="M500 420 L480 470 L450 520" strokeWidth="1" />
          <path d="M720 410 L750 460 L780 520" strokeWidth="1" />
          <path d="M540 260 L580 240 L610 260" strokeWidth="1" />
          <path d="M700 270 L660 250 L640 270" strokeWidth="1" />
        </g>

        {/* Hotspot under-glow — opacity-only pulse */}
        <g fill="#ff6b00" filter="url(#hotspot-glow)">
          <circle cx="600" cy="400" r="6" opacity="0.35">
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="520" cy="320" r="4" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.4;0.15" dur="4s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="680" cy="340" r="4" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.4;0.15" dur="4s" begin="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="580" cy="480" r="3" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.35;0.1" dur="4s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="640" cy="470" r="3" opacity="0.2">
            <animate attributeName="opacity" values="0.1;0.35;0.1" dur="4s" begin="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="420" cy="340" r="2.5" opacity="0.15">
            <animate attributeName="opacity" values="0.08;0.3;0.08" dur="4s" begin="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="800" cy="310" r="2.5" opacity="0.15">
            <animate attributeName="opacity" values="0.08;0.3;0.08" dur="4s" begin="2.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Sharp hotspot cores — native SVG animate for true in-place pulse */}
        <g fill="#f0b830">
          <circle cx="600" cy="400" r="2.5" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="520" cy="320" r="1.5" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" begin="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="680" cy="340" r="1.5" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" begin="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="580" cy="480" r="1" opacity="0.35">
            <animate attributeName="opacity" values="0.15;0.5;0.15" dur="4s" begin="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="640" cy="470" r="1" opacity="0.35">
            <animate attributeName="opacity" values="0.15;0.5;0.15" dur="4s" begin="3s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
