/* MyCoNet — shared chrome for every module artboard */
const { useState, useMemo } = React;

const MODULES = [
  { num:'00', name:'Dashboard',         color:'var(--ink)',  ic:'◎' },
  { num:'01', name:'Residents',         color:'var(--m1)',   ic:'◷', live:true },
  { num:'04', name:'Blueprint',         color:'var(--m4)',   ic:'◧', live:true },
  { num:'05', name:'Join',              color:'var(--m5)',   ic:'⬚', live:true },
  { num:'06', name:'Agreements',        color:'var(--m6)',   ic:'⬡' },
  { num:'07', name:'Operations',        color:'var(--m7)',   ic:'◎' },
  { num:'08', name:'Contributions',     color:'var(--m8)',   ic:'✦' },
  { num:'09', name:'Governance',        color:'var(--m9)',   ic:'⚖' },
];

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"/>
      <span>MyCoNet</span>
      <span className="sep">/</span>
      <span className="community">Greenhollow&nbsp;Commons</span>
    </div>
  );
}

function TopBar({ search, badge, ctas }) {
  return (
    <header className="topbar">
      <Brand/>
      <div className="topbar-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7"/><line x1="20" y1="20" x2="16.6" y2="16.6"/>
        </svg>
        <span>{search || 'Search residents, projects, proposals…'}</span>
        <span style={{marginLeft:'auto', fontFamily:'var(--mono)', fontSize:10.5, color:'var(--ink-4)', padding:'1px 5px', border:'1px solid var(--rule)', borderRadius:4}}>⌘K</span>
      </div>
      {ctas}
      <div className="topbar-right">
        <div className="topbar-bell">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>
          </svg>
        </div>
        <div className="topbar-user">
          <div className="av">MR</div>
          <span>Maya Reyes</span>
        </div>
      </div>
    </header>
  );
}

function SideNav({ active }) {
  const groups = useMemo(() => ([
    { label: 'Clubhouse', items: MODULES.slice(0, 4) },
    { label: "Once you're in", items: MODULES.slice(4) },
  ]), []);
  return (
    <nav className="side">
      {groups.map((g) => (
        <React.Fragment key={g.label}>
          <div className="side-label">{g.label}</div>
          {g.items.map((m) => (
            <div key={m.num}
              className={'side-item' + (m.num === active ? ' is-active' : '')}>
              <span className="swatch" style={{background: m.color}}/>
              <span className="ic">M{m.num}</span>
              <span>{m.name}</span>
              {m.num === '09' && <span className="badge">2</span>}
            </div>
          ))}
        </React.Fragment>
      ))}
      <div style={{flex:1}}/>
      <div style={{
        padding:'12px',marginTop:8,borderRadius:8,
        background:'color-mix(in srgb, var(--accent) 8%, transparent)',
        border:'1px dashed color-mix(in srgb, var(--accent) 25%, var(--rule))',
        fontSize:11.5, color:'var(--ink-2)', lineHeight:1.5,
      }}>
        <div style={{fontWeight:600, marginBottom:2}}>You're an Explorer</div>
        <div style={{color:'var(--ink-3)', fontSize:11}}>Sign the values to unlock Agreements, Operations, Contributions & Governance.</div>
      </div>
    </nav>
  );
}

function PageHead({ mod, label, color, title, sub, actions }) {
  return (
    <header className="page-head row between" style={{alignItems:'flex-start'}}>
      <div>
        <span className="page-eyebrow" style={{
          background: `color-mix(in srgb, ${color} 8%, transparent)`,
          color,
        }}>
          <span className="d" style={{background: color}}/>
          Module {mod} · {label}
        </span>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {actions && <div className="row gap-2">{actions}</div>}
    </header>
  );
}

function Avatar({ name, bg, size=36 }) {
  const initials = name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  return (
    <div className="av-circ" style={{ width:size, height:size, background:bg, fontSize: size<28 ? 10 : 13 }}>
      {initials}
    </div>
  );
}

function PillarRadar({ values, color = 'var(--m4)', size = 200 }) {
  // 5-point pentagon radar — pure SVG
  const labels = ['Ecology', 'Social', 'Economy', 'Hardware', 'Governance'];
  const cx = size/2, cy = size/2, r = size/2 - 28;
  const pt = (i, mag) => {
    const angle = -Math.PI/2 + i * (Math.PI * 2 / 5);
    return [cx + Math.cos(angle) * r * mag, cy + Math.sin(angle) * r * mag];
  };
  const ringPath = (mag) =>
    labels.map((_, i) => {
      const [x,y] = pt(i, mag);
      return (i===0?'M':'L') + x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ') + ' Z';
  const dataPath = values.map((v,i) => {
    const [x,y] = pt(i, v/5);
    return (i===0?'M':'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ') + ' Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[1, 0.75, 0.5, 0.25].map(m => (
        <path key={m} d={ringPath(m)} fill="none" stroke="var(--rule)" strokeWidth="1"/>
      ))}
      {labels.map((_, i) => {
        const [x,y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--rule)" strokeWidth="1"/>;
      })}
      <path d={dataPath} fill={`color-mix(in srgb, ${color} 22%, transparent)`} stroke={color} strokeWidth="1.5"/>
      {values.map((v,i) => {
        const [x,y] = pt(i, v/5);
        return <circle key={i} cx={x} cy={y} r="3" fill={color}/>;
      })}
      {labels.map((label,i) => {
        const [x,y] = pt(i, 1.18);
        return (
          <text key={label} x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="var(--mono)" fontSize="9" fontWeight="700"
            fill="var(--ink-3)">{label}</text>
        );
      })}
    </svg>
  );
}

function Pbar({ value, color = 'var(--accent)', max=5 }) {
  return (
    <div className="pbar">
      <div style={{ width: `${(value/max)*100}%`, background: color }}/>
    </div>
  );
}

function Chip({ children, color, light }) {
  if (light) return (
    <span className="chip" style={{
      color, background:`color-mix(in srgb, ${color} 10%, transparent)`,
      borderColor:`color-mix(in srgb, ${color} 20%, var(--rule-soft))`,
    }}>{children}</span>
  );
  return <span className="chip">{children}</span>;
}

function StatusDot({ color }) {
  return <span style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:color}}/>;
}

// Expose for other Babel scripts
Object.assign(window, {
  MODULES, TopBar, SideNav, PageHead, Avatar, PillarRadar, Pbar, Chip, StatusDot, Brand,
});
