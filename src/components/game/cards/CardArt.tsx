'use client';

// Inline SVG illustrations for each card - steampunk Wonderland themed

const ART_COMPONENTS: Record<string, (cls: string) => JSX.Element> = {
  pistol: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <rect x="15" y="30" width="50" height="12" rx="2" fill="currentColor" opacity="0.8"/>
      <rect x="55" y="25" width="25" height="22" rx="3" fill="currentColor" opacity="0.6"/>
      <rect x="35" y="42" width="8" height="20" rx="2" fill="currentColor" opacity="0.7"/>
      <circle cx="12" cy="36" r="4" fill="currentColor" opacity="0.5"/>
      <circle cx="70" cy="36" r="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
      <path d="M35 62 L43 62 L40 68 L38 68 Z" fill="currentColor" opacity="0.5"/>
      {/* Steam wisps */}
      <path d="M8 30 Q5 24 8 18 Q11 12 8 6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
      <path d="M14 28 Q11 22 14 16" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2"/>
    </svg>
  ),
  shield: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M50 8 L80 20 L80 50 Q80 70 50 76 Q20 70 20 50 L20 20 Z"
        fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M50 18 L70 28 L70 48 Q70 62 50 66 Q30 62 30 48 L30 28 Z"
        fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
      {/* Gear emblem */}
      <circle cx="50" cy="42" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
      <circle cx="50" cy="42" r="5" fill="currentColor" opacity="0.4"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <rect key={i} x="48" y="30" width="4" height="6" rx="1" fill="currentColor" opacity="0.5"
          transform={`rotate(${a} 50 42)`}/>
      ))}
    </svg>
  ),
  companion: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      {/* Robot body */}
      <rect x="35" y="28" width="30" height="35" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      {/* Head */}
      <rect x="40" y="10" width="20" height="18" rx="3" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      {/* Eyes */}
      <circle cx="46" cy="19" r="3" fill="currentColor" opacity="0.7"/>
      <circle cx="54" cy="19" r="3" fill="currentColor" opacity="0.7"/>
      {/* Antenna */}
      <line x1="50" y1="10" x2="50" y2="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="50" cy="3" r="2" fill="currentColor" opacity="0.6"/>
      {/* Arms */}
      <rect x="25" y="32" width="10" height="4" rx="2" fill="currentColor" opacity="0.4"/>
      <rect x="65" y="32" width="10" height="4" rx="2" fill="currentColor" opacity="0.4"/>
      {/* Heart gear */}
      <circle cx="50" cy="42" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* Legs */}
      <rect x="38" y="63" width="8" height="10" rx="2" fill="currentColor" opacity="0.3"/>
      <rect x="54" y="63" width="8" height="10" rx="2" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  coat: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M30 15 L50 8 L70 15 L75 65 L55 70 L50 60 L45 70 L25 65 Z"
        fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      {/* Collar */}
      <path d="M35 15 L50 10 L65 15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      {/* Buttons */}
      <circle cx="50" cy="28" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="50" cy="38" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="50" cy="48" r="2" fill="currentColor" opacity="0.6"/>
      {/* Plates */}
      <rect x="33" y="25" width="12" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <rect x="55" y="25" width="12" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    </svg>
  ),
  monocle: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="36" r="22" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.6"/>
      <circle cx="50" cy="36" r="18" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.08"/>
      {/* Lens shine */}
      <path d="M38 24 Q42 22 44 26" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
      {/* Chain */}
      <path d="M72 36 Q80 40 82 50 Q84 60 78 68" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" strokeDasharray="3 2"/>
      {/* Gear decorations */}
      <circle cx="50" cy="36" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" strokeDasharray="4 3"/>
      {/* Magnification lines */}
      <line x1="42" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
      <line x1="42" y1="38" x2="58" y2="38" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
    </svg>
  ),
  journal: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <rect x="25" y="10" width="50" height="60" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
      {/* Spine */}
      <rect x="25" y="10" width="8" height="60" rx="2" fill="currentColor" opacity="0.25"/>
      {/* Pages */}
      <line x1="38" y1="22" x2="68" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="38" y1="30" x2="65" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
      <line x1="38" y1="38" x2="68" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <line x1="38" y1="46" x2="60" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.25"/>
      <line x1="38" y1="54" x2="68" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      {/* Bookmark */}
      <path d="M62 10 L62 5 L67 8 L72 5 L72 10" fill="currentColor" opacity="0.4"/>
      {/* Gear stamp */}
      <circle cx="52" cy="42" r="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15"/>
    </svg>
  ),
  engine: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      {/* Main body */}
      <rect x="20" y="20" width="60" height="40" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      {/* Gears */}
      <circle cx="40" cy="40" r="12" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
      <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.4"/>
      <circle cx="62" cy="35" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <circle cx="62" cy="35" r="3" fill="currentColor" opacity="0.3"/>
      {/* Teeth on big gear */}
      {[0,60,120,180,240,300].map((a,i) => (
        <rect key={i} x="38" y="26" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.4"
          transform={`rotate(${a} 40 40)`}/>
      ))}
      {/* Steam pipes */}
      <line x1="20" y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <line x1="20" y1="50" x2="10" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      {/* Steam */}
      <path d="M8 26 Q4 20 8 14" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2"/>
    </svg>
  ),
  cat: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      {/* Body */}
      <ellipse cx="50" cy="50" rx="20" ry="15" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      {/* Head */}
      <circle cx="50" cy="28" r="14" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
      {/* Ears */}
      <path d="M38 18 L34 6 L42 14" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1"/>
      <path d="M62 18 L66 6 L58 14" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1"/>
      {/* Eyes */}
      <ellipse cx="44" cy="26" rx="3" ry="4" fill="currentColor" opacity="0.6"/>
      <ellipse cx="56" cy="26" rx="3" ry="4" fill="currentColor" opacity="0.6"/>
      {/* Grin */}
      <path d="M40 34 Q50 42 60 34" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
      {/* Whiskers */}
      <line x1="34" y1="30" x2="20" y2="28" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="34" y1="33" x2="20" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="66" y1="30" x2="80" y2="28" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      <line x1="66" y1="33" x2="80" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.3"/>
      {/* Tail */}
      <path d="M70 50 Q85 45 82 30 Q80 22 85 18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
      {/* Fading effect */}
      <ellipse cx="50" cy="50" rx="22" ry="17" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" strokeDasharray="3 5"/>
    </svg>
  ),
  blade: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      {/* Blade */}
      <path d="M50 8 L55 50 L50 55 L45 50 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      {/* Guard */}
      <rect x="35" y="52" width="30" height="5" rx="2" fill="currentColor" opacity="0.5"/>
      {/* Handle */}
      <rect x="46" y="57" width="8" height="14" rx="2" fill="currentColor" opacity="0.4"/>
      {/* Spring mechanism */}
      <path d="M42 58 Q44 62 42 66 Q44 70 42 74" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
      <circle cx="50" cy="54" r="2" fill="currentColor" opacity="0.5"/>
      {/* Shine */}
      <line x1="48" y1="15" x2="48" y2="35" stroke="currentColor" strokeWidth="0.8" opacity="0.2"/>
    </svg>
  ),
  bomb: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="45" r="20" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/>
      {/* Fuse */}
      <path d="M50 25 Q55 15 60 12 Q65 10 68 5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
      {/* Spark */}
      <circle cx="70" cy="4" r="3" fill="currentColor" opacity="0.6"/>
      <line x1="70" y1="1" x2="72" y2="-3" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <line x1="73" y1="4" x2="77" y2="3" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      {/* Rivets */}
      <circle cx="40" cy="40" r="1.5" fill="currentColor" opacity="0.4"/>
      <circle cx="60" cy="40" r="1.5" fill="currentColor" opacity="0.4"/>
      <circle cx="50" cy="55" r="1.5" fill="currentColor" opacity="0.4"/>
      {/* Smoke wisps */}
      <path d="M72 8 Q76 4 74 -2" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2"/>
    </svg>
  ),
  // Simpler fallbacks for remaining art
  toolkit: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <rect x="20" y="25" width="60" height="35" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="35" y="20" width="30" height="6" rx="3" fill="currentColor" opacity="0.3"/>
      <line x1="35" y1="35" x2="35" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
      <circle cx="45" cy="42" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <rect x="55" y="35" width="12" height="4" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="55" y="43" width="8" height="4" rx="1" fill="currentColor" opacity="0.25"/>
    </svg>
  ),
  pocketwatch: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="42" r="24" stroke="currentColor" strokeWidth="2.5" fill="currentColor" opacity="0.1"/>
      <circle cx="50" cy="42" r="20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
      <line x1="50" y1="42" x2="50" y2="26" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <line x1="50" y1="42" x2="62" y2="48" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="50" cy="42" r="2" fill="currentColor" opacity="0.5"/>
      <path d="M50 18 L50 10 Q50 6 54 6 L56 6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
        <line key={i} x1="50" y1="24" x2="50" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.3"
          transform={`rotate(${a} 50 42)`}/>
      ))}
    </svg>
  ),
  ward: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <ellipse cx="50" cy="40" rx="28" ry="30" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <ellipse cx="50" cy="40" rx="20" ry="22" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1"/>
      <line x1="50" y1="10" x2="50" y2="70" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
      <line x1="22" y1="40" x2="78" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
      <path d="M35 20 Q50 30 65 20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M35 60 Q50 50 65 60" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
    </svg>
  ),
  satchel: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <rect x="25" y="25" width="50" height="40" rx="5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M35 25 L35 15 Q35 10 45 10 L55 10 Q65 10 65 15 L65 25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      <rect x="42" y="38" width="16" height="10" rx="2" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1"/>
      <circle cx="50" cy="43" r="2" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  coin: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="40" r="22" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="50" cy="40" r="17" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
      <text x="50" y="46" textAnchor="middle" fontSize="18" fill="currentColor" opacity="0.5" fontFamily="Georgia">&#9733;</text>
    </svg>
  ),
  watch: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="42" r="22" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.08"/>
      <circle cx="50" cy="42" r="18" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25"/>
      <line x1="50" y1="42" x2="50" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
      <line x1="50" y1="42" x2="60" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="50" cy="42" r="2" fill="currentColor" opacity="0.4"/>
      <path d="M50 20 L50 12 Q50 8 54 8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
    </svg>
  ),
};

// Event & skill art - simpler symbolic representations
const SIMPLE_ART: Record<string, (c: string) => JSX.Element> = {
  stance: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M50 15 L65 40 L58 40 L70 65 L50 45 L55 45 L40 25 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1"/>
      <circle cx="50" cy="40" r="18" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" strokeDasharray="4 3"/>
    </svg>
  ),
  repair: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M30 55 L45 40 L50 45 L65 30" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.4"/>
      <circle cx="65" cy="30" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
      <rect x="26" y="52" width="10" height="10" rx="1" fill="currentColor" opacity="0.3" transform="rotate(-45 31 57)"/>
    </svg>
  ),
  eureka: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="35" r="16" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <line x1="50" y1="55" x2="50" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
      {[0,45,90,135,180,225,270,315].map((a,i) => (
        <line key={i} x1="50" y1="12" x2="50" y2="6" stroke="currentColor" strokeWidth="1.5" opacity="0.3"
          transform={`rotate(${a} 50 35)`}/>
      ))}
    </svg>
  ),
  hypothesis: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <text x="50" y="50" textAnchor="middle" fontSize="36" fill="currentColor" opacity="0.4" fontFamily="Georgia">?</text>
      <circle cx="50" cy="40" r="25" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" strokeDasharray="5 3"/>
    </svg>
  ),
  timeshift: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="40" r="22" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
      <path d="M50 18 L50 40 L65 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
      <path d="M28 30 Q20 40 28 50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
      <path d="M28 50 L24 46 M28 50 L32 46" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
    </svg>
  ),
  quickthink: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M20 50 L45 25 L50 30 L80 15" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.4"/>
      <path d="M75 15 L80 15 L80 20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
      <circle cx="35" cy="55" r="3" fill="currentColor" opacity="0.2"/>
      <circle cx="25" cy="60" r="2" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
  lucky: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <text x="50" y="55" textAnchor="middle" fontSize="40" fill="currentColor" opacity="0.35" fontFamily="Georgia">&#9733;</text>
      <circle cx="50" cy="40" r="25" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" strokeDasharray="2 4"/>
    </svg>
  ),
  scrounge: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M30 55 L50 35 L70 55" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
      <path d="M50 35 L50 15" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
      <path d="M45 20 L50 15 L55 20" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <rect x="25" y="55" width="50" height="12" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  determination: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M50 15 L55 30 L70 30 L58 40 L62 55 L50 46 L38 55 L42 40 L30 30 L45 30 Z"
        fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  sharpmind: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <circle cx="50" cy="35" r="20" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M38 35 Q44 25 50 35 Q56 25 62 35 Q56 45 50 35 Q44 45 38 35" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
      <circle cx="50" cy="35" r="5" fill="currentColor" opacity="0.3"/>
    </svg>
  ),
  bruteforce: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M35 60 L35 35 Q35 20 50 20 Q65 20 65 35 L65 60" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.35"/>
      <rect x="30" y="58" width="40" height="8" rx="2" fill="currentColor" opacity="0.2"/>
    </svg>
  ),
  reflexes: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M25 60 Q35 30 50 25 Q65 30 75 60" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
      <circle cx="50" cy="25" r="6" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M40 50 L30 45 M60 50 L70 45" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25"/>
    </svg>
  ),
  courage: (c) => (
    <svg viewBox="0 0 100 80" className={c}>
      <path d="M50 60 L35 40 Q30 25 50 15 Q70 25 65 40 Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M50 50 L42 38 Q38 28 50 22 Q62 28 58 38 Z" fill="currentColor" opacity="0.15"/>
    </svg>
  ),
};

const ALL_ART = { ...ART_COMPONENTS, ...SIMPLE_ART };

export function CardArt({ artKey, className = '' }: { artKey: string; className?: string }) {
  const renderer = ALL_ART[artKey];
  if (!renderer) {
    return (
      <svg viewBox="0 0 100 80" className={className}>
        <circle cx="50" cy="40" r="15" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2"/>
        <text x="50" y="45" textAnchor="middle" fontSize="14" fill="currentColor" opacity="0.3">?</text>
      </svg>
    );
  }
  return renderer(className);
}
