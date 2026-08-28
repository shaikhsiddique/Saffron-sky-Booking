import { Chair } from './Chair';
import { ROOM, THIN, WALL } from './colors';

export function FixedFurniture() {
  return (
    <g>
      {/* reception / counter */}
      <rect x="32" y="246" width="92" height="18" rx="2" fill="#ece2cc" stroke={THIN} strokeWidth="2" />
      <rect x="52" y="252" width="46" height="5" fill="#c8b681" />

      {/* inner counter / service bar */}
      <rect x="105" y="195" width="285" height="9" rx="2" fill={WALL} />
      {[120, 182, 244, 306, 368].map((x) => <circle key={x} cx={x} cy="207" r="5" fill="none" stroke={THIN} strokeWidth="1.4" />)}

      {/* central long sofa */}
      <rect x="120" y="294" width="100" height="46" rx="5" fill="#d1aa53" stroke={THIN} strokeWidth="2" />
      <rect x="131" y="301" width="78" height="32" rx="3" fill="#faf7ef" stroke="#b2a489" strokeWidth="1" />

      {/* large center communal table */}
      <rect x="245" y="287" width="150" height="70" rx="4" fill="#e3cf90" stroke={THIN} strokeWidth="2" />
      <rect x="257" y="299" width="126" height="46" rx="3" fill="#f9f5ea" stroke="#b2a489" strokeWidth="1" />
      {[270, 295, 320, 345, 370].map((x) => <Chair key={`a${x}`} x={x} y={286} rotate={0} />)}
      {[270, 295, 320, 345, 370].map((x) => <Chair key={`b${x}`} x={x} y={359} rotate={180} />)}

      {/* stair block */}
      <rect x="242" y="405" width="102" height="88" fill="#f5f1e9" stroke={WALL} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1="250" y1={417 + i * 10} x2="295" y2={417 + i * 10} stroke="#777" strokeWidth="1.2" />
      ))}
      <rect x="266" y="430" width="26" height="35" fill="none" stroke="#777" strokeWidth="1.2" />
      <text x="295" y="486" fontSize="9" textAnchor="middle" fill="#444">STAIRS</text>

      {/* lift */}
      <rect x="345" y="418" width="72" height="70" fill="#f5f1e9" stroke={WALL} strokeWidth="3" />
      <text x="381" y="455" fontSize="10" textAnchor="middle" fill="#444">LIFT</text>

      {/* kitchen block */}
      <rect x="255" y="505" width="205" height="126" fill={ROOM} stroke={WALL} strokeWidth="4" />
      <text x="357" y="573" fontSize="15" textAnchor="middle" fill="#3f3f3f" fontFamily="Georgia, serif">KITCHEN</text>
      <rect x="255" y="505" width="58" height="18" fill="#eee7d7" stroke="#8c806e" strokeWidth="1" />
      <rect x="402" y="548" width="58" height="18" fill="#eee7d7" stroke="#8c806e" strokeWidth="1" />
      <rect x="313" y="631" width="88" height="30" rx="10" fill="#fbf6ea" stroke="#998d77" strokeWidth="1.4" />
      <text x="357" y="651" fontSize="8" textAnchor="middle" fill="#777">SERVICE</text>

      {/* lower washrooms */}
      <rect x="258" y="1288" width="195" height="56" fill="#f4f0e7" stroke={WALL} strokeWidth="3" />
      <line x1="324" y1="1288" x2="324" y2="1344" stroke={THIN} strokeWidth="2" />
      <line x1="390" y1="1288" x2="390" y2="1344" stroke={THIN} strokeWidth="2" />
      <circle cx="293" cy="1308" r="7" fill="none" stroke="#666" />
      <circle cx="359" cy="1324" r="7" fill="none" stroke="#666" />
      <circle cx="424" cy="1308" r="7" fill="none" stroke="#666" />

      {/* little storage / utility room */}
      <rect x="454" y="1160" width="38" height="100" fill="#f6f1e8" stroke={WALL} strokeWidth="3" />
      <text x="473" y="1214" fontSize="7" textAnchor="middle" fill="#555" transform="rotate(90 473 1214)">STORE</text>

      {/* stage / curved service counter */}
      <path d="M 260 646 Q 358 674 420 646" fill="none" stroke="#6f6454" strokeWidth="2" />

      {/* tiny architectural boxes / columns */}
      {[30, 110, 205, 245, 455, 492].map((x) => <rect key={x} x={x} y="370" width="9" height="9" fill="#e1ddd4" stroke="#777" strokeWidth="1" />)}
    </g>

  );
}
