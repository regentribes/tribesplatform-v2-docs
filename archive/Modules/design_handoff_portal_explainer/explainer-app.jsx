/* MyCoNet Portal Explainer */
const { useState, useEffect, useMemo, useRef } = React;

/* ── Tweak defaults ── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "green",
  "theme": "light",
  "userName": "Maya"
}/*EDITMODE-END*/;

const ACCENT_PALETTES = {
  green:  { accent: 'hsl(142 76% 36%)', soft: 'hsl(142 50% 93%)' },
  forest: { accent: 'hsl(160 65% 32%)', soft: 'hsl(160 40% 92%)' },
  amber:  { accent: 'hsl(28 82% 45%)',  soft: 'hsl(28 60% 93%)'  },
  indigo: { accent: 'hsl(232 60% 50%)', soft: 'hsl(232 50% 95%)' },
};

/* ── Icons (tiny inline SVG) ── */
const Check = ({size=12}) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
    strokeLinecap="round" strokeLinejoin="round" style={{width:size,height:size}}>
    <polyline points="5 12 10 17 19 7" />
  </svg>
);
const Arrow = () => (
  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{width:14,height:14}}>
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

/* ── Helpers ── */
const initialsOf = (n) => n.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();

/* ───────────────────────────────────────────────────────── */
/* Top bar                                                  */
/* ───────────────────────────────────────────────────────── */
function TopBar({ name }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="logo" href="#">
          <span className="logo-mark" />
          <span>MyCoNet</span>
          <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-3)',fontWeight:500,marginLeft:6}}>
            · Greenhollow Commons
          </span>
        </a>
        <nav className="topnav">
          <a className="topnav-link is-current" href="#welcome">Welcome</a>
          <a className="topnav-link" href="#meet">Meet residents</a>
          <a className="topnav-link" href="#blueprint">The project</a>
          <a className="topnav-link" href="#join">Join</a>
          <a className="topnav-link" href="#governance">Decide</a>
          <a className="topnav-cta" href="#join">
            Hi, {name} →
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ───────────────────────────────────────────────────────── */
/* Hero                                                     */
/* ───────────────────────────────────────────────────────── */
function Hero({ name }) {
  return (
    <section className="hero" id="welcome">
      <span className="pill">Greenhollow Commons · Member portal</span>
      <h1>
        Welcome, {name}.<br/>
        This is the <span className="underline">digital clubhouse</span> for a regenerative neighborhood being formed
        — <span className="accent">together</span>.
      </h1>
      <p className="lead">
        You're not on a social network. You're inside the operating system of a community-in-formation.
        Meet the people gathering around it, read the plan they're building, contribute the work
        you're good at, and help decide what happens next.
      </p>
      <div className="cta-row">
        <a className="btn btn-primary" href="#meet">
          Take the tour <Arrow/>
        </a>
        <a className="btn btn-secondary" href="#join">
          I'm ready to join
        </a>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* Clubhouse dashboard preview                              */
/* ───────────────────────────────────────────────────────── */
const CH_CARDS = [
  { num:'01', name:'Community Network',     desc:'Meet 38 residents and explorers', color:'var(--m1)' },
  { num:'04', name:'Project Blueprint',     desc:'Phase 2 of 4 · PROVE',            color:'var(--m4)' },
  { num:'05', name:'Join the community',    desc:'4 steps · Sign the values',       color:'var(--m5)', cta:true },
  { num:'06', name:'Active projects',       desc:'5 open · 2 need help this week',  color:'var(--m6)' },
  { num:'07', name:'Operations',            desc:'12 deliverables · 3 due Friday',  color:'var(--m7)' },
  { num:'08', name:'Your contributions',    desc:'420 pts · 3 badges · top 25%',    color:'var(--m8)' },
  { num:'09', name:'Governance',            desc:'2 proposals open for your vote',  color:'var(--m9)' },
  { num:'04', name:'Blueprint pillars',     desc:'Ecology 4·Social 3·Economy 2',    color:'var(--m4)' },
  { num:'01', name:'Travel & visits',       desc:'3 explorers visiting next month', color:'var(--m1)' },
];

function ClubhousePreview({ name }) {
  return (
    <div className="clubhouse">
      <div className="clubhouse-chrome">
        <span className="dot r"/><span className="dot y"/><span className="dot g"/>
        <span className="url-bar"><span className="lock">🔒</span>greenhollow.myco.net/dashboard</span>
      </div>
      <div className="clubhouse-body">
        <aside className="ch-side">
          <div className="who">
            <div className="avatar">{initialsOf(name)}</div>
            <div>
              <div className="name">{name} Reyes</div>
              <div className="role">Explorer</div>
            </div>
          </div>
          <div className="ch-nav">
            <div className="ch-nav-label">Clubhouse</div>
            <div className="ch-nav-item is-active">
              <span className="swatch" style={{background:'var(--ink)'}}/>
              <span className="mnum">M00</span> Dashboard
            </div>
            <div className="ch-nav-item">
              <span className="swatch" style={{background:'var(--m1)'}}/>
              <span className="mnum">M01</span> Residents
            </div>
            <div className="ch-nav-item">
              <span className="swatch" style={{background:'var(--m4)'}}/>
              <span className="mnum">M04</span> Blueprint
            </div>
            <div className="ch-nav-item">
              <span className="swatch" style={{background:'var(--m5)'}}/>
              <span className="mnum">M05</span> Join
            </div>
            <div className="ch-nav-label">Once you're in</div>
            <div className="ch-nav-item" style={{opacity:.5}}>
              <span className="swatch" style={{background:'var(--m6)'}}/>
              <span className="mnum">M06</span> Agreements
            </div>
            <div className="ch-nav-item" style={{opacity:.5}}>
              <span className="swatch" style={{background:'var(--m7)'}}/>
              <span className="mnum">M07</span> Operations
            </div>
            <div className="ch-nav-item" style={{opacity:.5}}>
              <span className="swatch" style={{background:'var(--m8)'}}/>
              <span className="mnum">M08</span> Contributions
            </div>
            <div className="ch-nav-item" style={{opacity:.5}}>
              <span className="swatch" style={{background:'var(--m9)'}}/>
              <span className="mnum">M09</span> Governance
            </div>
          </div>
        </aside>
        <main className="ch-main">
          <h3 className="ch-greet">Good morning, {name}.</h3>
          <p className="ch-sub">
            You're an <strong>Explorer</strong> at Greenhollow Commons. Read, browse, and meet people —
            sign the values to unlock the full community.
          </p>
          <div className="ch-grid">
            {CH_CARDS.map((c, i) => (
              <div className="ch-card" key={i}>
                <div className="accent-bar" style={{background:c.color}}/>
                <div className="row1">
                  <span className="mtag" style={{color:c.color}}>M{c.num}</span>
                  {c.cta
                    ? <span className="badge" style={{background:c.color}}>Start</span>
                    : <span style={{fontFamily:'var(--mono)',fontSize:10,color:'var(--ink-4)'}}>↗</span>}
                </div>
                <div className="title">{c.name}</div>
                <div className="desc">{c.desc}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────── */
/* Section header                                           */
/* ───────────────────────────────────────────────────────── */
function SectionHead({ mod, label, color, h, lead, id }) {
  return (
    <div id={id}>
      <span className="section-eyebrow" style={{
        background: `color-mix(in srgb, ${color} 8%, transparent)`,
        color: color,
      }}>
        <span className="mod-dot" style={{background: color}}/>
        Module {mod} · {label}
      </span>
      <h2 className="section-h">{h}</h2>
      <p className="section-lead">{lead}</p>
    </div>
  );
}

/* ───────────────────────────────────────────────────────── */
/* M01 — Meet residents                                     */
/* ───────────────────────────────────────────────────────── */
const RESIDENTS = [
  { name:'Ana Whitewater', where:'San Cristóbal, MX', av:'var(--m1)',
    offers:['Permaculture design','Mycology'], seeks:['Co-builders'], match:92 },
  { name:'Eli Tanaka',     where:'Visiting Tlaxcala, MAY', av:'var(--m4)',
    offers:['Natural building','Cob'], seeks:['Land partner'], match:81 },
  { name:'Priya Mahesh',   where:'Berkeley, CA · Vision holder', av:'var(--m9)',
    offers:['NVC facilitation','Conflict mediation'], seeks:['Resident circle'], match:76 },
  { name:'Diego Solá',     where:'Oaxaca · Resident', av:'var(--m5)',
    offers:['Investment capital'], seeks:['Project leads'], match:68 },
];

function MeetSection() {
  return (
    <section className="section" id="meet">
      <div className="section-split">
        <div>
          <SectionHead
            mod="01" label="Community Network" color="var(--m1)"
            h="Meet the people gathering around this idea."
            lead="Before anything is built, the right people have to find each other. Browse rich profiles
                  of every resident, vision-holder, and explorer — sorted by how well your offers, seeks, values, and skills line up."
          />
          <div className="why">
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Real profiles, not posts.</strong> What you bring, what you need, where you're headed.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>AI match score</strong> across values, skills, OCEAN personality, and goals — not just keywords.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Travel plans</strong> so you can connect IRL — visit a community before you commit.</p>
            </div>
          </div>
        </div>
        <div className="demo">
          <div className="demo-head">
            <div className="demo-title">
              <span className="mod" style={{background:'var(--m1)'}}>M01</span>
              <strong>Residents · Top matches for you</strong>
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-3)'}}>38 members</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {RESIDENTS.map((r,i) => (
              <div className="neighbor-card" key={i}>
                <div className="av" style={{background:r.av}}>{initialsOf(r.name)}</div>
                <div className="meta">
                  <div className="name-row">
                    <span className="nname">{r.name}</span>
                    <span className="match">{r.match}% match</span>
                  </div>
                  <div className="where">{r.where}</div>
                  <div className="chips">
                    {r.offers.map(o => <span className="chip k-offer" key={o}>+ {o}</span>)}
                    {r.seeks.map(s  => <span className="chip k-seek"  key={s}>? {s}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* M04 — Blueprint                                          */
/* ───────────────────────────────────────────────────────── */
const PILLARS = [
  { name:'Ecology',    score: 4.2 },
  { name:'Social',     score: 3.6 },
  { name:'Economy',    score: 2.3 },
  { name:'Hardware',   score: 2.8 },
  { name:'Governance', score: 3.4 },
];

function BlueprintSection() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => e.isIntersecting && setAnimated(true), {threshold:.3});
    const el = document.getElementById('blueprint');
    if (el) o.observe(el);
    return () => o.disconnect();
  }, []);
  return (
    <section className="section" id="blueprint">
      <div className="section-split reverse">
        <div className="demo">
          <div className="demo-head">
            <div className="demo-title">
              <span className="mod" style={{background:'var(--m4)'}}>M04</span>
              <strong>Blueprint · Greenhollow Commons</strong>
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-3)'}}>v3.2 · Living doc</span>
          </div>
          <div className="phases">
            <div className="phase done"><div className="pname">SPARK</div><div className="ptag">✓ Passed</div></div>
            <div className="phase active"><div className="pname">PROVE</div><div className="ptag">In progress</div></div>
            <div className="phase"><div className="pname">BUILD</div><div className="ptag">Locked</div></div>
            <div className="phase"><div className="pname">LIVE</div><div className="ptag">Locked</div></div>
          </div>
          <div style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:600,letterSpacing:'0.08em',
            color:'var(--ink-4)',textTransform:'uppercase',marginBottom:8,marginTop:14}}>
            5 Pillars · Readiness
          </div>
          <div className="pillars">
            {PILLARS.map(p => (
              <div className="pillar" key={p.name}>
                <span className="pn">{p.name}</span>
                <div className="pbar">
                  <div style={{width: animated ? `${(p.score/5)*100}%` : '0%'}}/>
                </div>
                <span className="pval">{p.score.toFixed(1)}<span style={{color:'var(--ink-4)'}}>/5</span></span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop:16,padding:'10px 12px',background:'color-mix(in srgb, var(--m4) 8%, transparent)',
            borderRadius:8,fontSize:12,color:'var(--ink-2)',lineHeight:1.55,
          }}>
            <strong style={{color:'var(--m4)'}}>Next gate:</strong> Economy must reach 3.0 before BUILD phase unlocks.
            The team is looking for funding-strategy contributors.
          </div>
        </div>
        <div>
          <SectionHead
            mod="04" label="Blueprint" color="var(--m4)"
            h="Read the plan. The whole plan."
            lead="No pitch deck. No marketing site. The Blueprint is the community's living planning
                  document — open, honest, and updated every week. See what's been decided, what's still being
                  worked out, and exactly how ready the project is."
          />
          <div className="why">
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Four phases</strong> — SPARK → PROVE → BUILD → LIVE. You see exactly where the project stands.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Five pillars</strong> with honest readiness scores — Ecology, Social, Economy, Hardware, Governance.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Gate checks</strong> between phases — so excitement never outruns reality.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* M05 — Join + values                                      */
/* ───────────────────────────────────────────────────────── */
const VALUES = [
  { t:'Care for the land before yield.',
    d:'Decisions are tested against ecological impact first, profit second.' },
  { t:'Consent over consensus.',
    d:'We seek no objections, not unanimous applause. Move forward if good enough for now.' },
  { t:'Show up, don\'t just sign up.',
    d:'Logged contributions matter more than promises. Reputation is earned in the doing.' },
  { t:'Disagree out loud, decide in writing.',
    d:'Bring the hard things to the circle. What we decide goes in the Blueprint.' },
  { t:'Leave it better.',
    d:'Land, people, money — whatever you touch, leave it more alive than you found it.' },
];

function JoinSection() {
  const [checked, setChecked] = useState([false, false, false, false, false]);
  const toggle = (i) => setChecked(c => c.map((v,j)=> j===i ? !v : v));
  const allChecked = checked.every(Boolean);
  const count = checked.filter(Boolean).length;
  return (
    <section className="section" id="join">
      <div className="section-split">
        <div>
          <SectionHead
            mod="05" label="Join" color="var(--m5)"
            h="Joining is signing the values — not paying a fee."
            lead="When you're ready to move from explorer to joining member, you read the community's values
                  and best practices, and you mark each one you can stand behind. Skip one? Bring it to the circle.
                  Everything is negotiated, nothing is hidden."
          />
          <div className="why">
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>No NDAs, no hidden rules.</strong> What you sign is what's in the Blueprint.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Application reviewed by a real human</strong> — the project leads, not an algorithm.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Unlocks Agreements, Operations, Contributions, and Governance.</strong></p>
            </div>
          </div>
        </div>
        <div className="demo">
          <div className="demo-head">
            <div className="demo-title">
              <span className="mod" style={{background:'var(--m5)'}}>M05</span>
              <strong>Step 3 of 4 · Values & best practices</strong>
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:count===5?'var(--m5)':'var(--ink-3)'}}>
              {count}/5 signed
            </span>
          </div>
          <div className="values">
            {VALUES.map((v,i) => (
              <div key={i} className={"value-row" + (checked[i]?' checked':'')}
                   onClick={()=>toggle(i)} role="checkbox" aria-checked={checked[i]} tabIndex="0">
                <div className="box"><Check/></div>
                <div className="vtext">
                  <div className="vt">{v.t}</div>
                  <div className="vd">{v.d}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="value-cta" disabled={!allChecked}>
            {allChecked ? 'Submit application →' : `Sign ${5-count} more to continue`}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* M06 — Browse projects + make agreement                  */
/* ───────────────────────────────────────────────────────── */
const PROJECTS = [
  { name:'Greywater wetlands install', desc:'Build the reed-bed wetland that handles all household greywater for Cluster A.',
    needs:['Earthworks','Plumbing','3 weekends'], open:true },
  { name:'Funding circle, round 2',
    desc:'Find 4 more investor-members to close the BUILD-phase capital raise ($120k remaining).',
    needs:['Network access','Pitch help','Legal review'] },
  { name:'Onboarding new residents (Q3)',
    desc:'Run the application review, host two welcome calls, pair newcomers with mentors.',
    needs:['Facilitation','Hospitality'] },
];

function AgreementsSection() {
  const [picked, setPicked] = useState(0);
  const [what, setWhat] = useState('Lead the trench-digging weekend with my excavator and 2 helpers.');
  const [expect, setExpect] = useState('20 contribution points + lunch on site + future resident priority.');
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="section" id="agreements">
      <div className="section-split reverse">
        <div className="demo">
          <div className="demo-head">
            <div className="demo-title">
              <span className="mod" style={{background:'var(--m6)'}}>M06</span>
              <strong>Open projects · Propose how you'll help</strong>
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-3)'}}>3 open</span>
          </div>
          <div className="proj-list">
            {PROJECTS.map((p,i) => (
              <div key={i} className={"proj-card"+(i===picked?' selected':'')}
                   onClick={()=>{setPicked(i); setSubmitted(false);}}>
                <div className="ptitle">
                  <h4>{p.name}</h4>
                  {p.open && <span className="open">● Open</span>}
                </div>
                <p className="pdesc">{p.desc}</p>
                <div className="pneeds">
                  {p.needs.map(n => <span className="chip" key={n}>{n}</span>)}
                </div>
                {i===picked && (
                  <div className="agreement">
                    <div className="alabel">Your proposal</div>
                    {submitted ? (
                      <div style={{padding:'12px 0',fontSize:13,color:'var(--m5)',fontWeight:600}}>
                        <Check size={14}/> &nbsp;Submitted for review. The project lead will respond in 48h.
                      </div>
                    ) : (
                      <>
                        <div className="field">
                          <label>What I'll contribute</label>
                          <textarea rows="2" value={what} onChange={e=>setWhat(e.target.value)} />
                        </div>
                        <div className="field">
                          <label>What I expect in return</label>
                          <input type="text" value={expect} onChange={e=>setExpect(e.target.value)} />
                        </div>
                        <button className="submit" onClick={()=>setSubmitted(true)}>
                          Send proposal →
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHead
            mod="06" label="Agreements" color="var(--m6)"
            h="Make visible deals on how you'll support."
            lead="Browse every active project — the ones quietly building, the ones loudly hiring. Propose
                  exactly what you'll contribute, exactly what you expect in return. The team reviews. If accepted,
                  your agreement is live and tracked."
          />
          <div className="why">
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Clear scope, clear exchange.</strong> Time, skill, goods, money — write it down.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Every agreement is public</strong> — no side deals, no resentment.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Auto-feeds Operations and Contributions</strong> — once accepted, the work shows up everywhere it should.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* M07 — Operations / deliverables                          */
/* ───────────────────────────────────────────────────────── */
const DELIVERABLES = [
  { name:'Soil tests at plots B, C, D', who:'@ana',   due:'May 28', done:true },
  { name:'Greywater permit application', who:'@diego', due:'Jun 3',  done:true },
  { name:'Reed-bed trench, Cluster A',   who:'@maya',  due:'Jun 7',  done:false },
  { name:'Founding circle agreement v3', who:'@priya', due:'Jun 12', done:false },
  { name:'Funding circle — round 2 close', who:'@eli', due:'Jun 30', done:false, late:false },
];

function OpsSection() {
  return (
    <section className="section" id="ops">
      <div className="section-split">
        <div>
          <SectionHead
            mod="07" label="Operations" color="var(--m7)"
            h="See every promise. Watch every deliverable."
            lead="A community lives or dies by what gets done. Operations turns every active agreement into
                  visible deliverables — who owns it, when it's due, and whether it's actually happening. No surprises
                  at the next meeting."
          />
          <div className="why">
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Live status of every project</strong> — pulled from agreements, not status meetings.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Timeline updates</strong> from project leads, threaded into the dashboard.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Drift detection</strong> — when something slips, the community sees it before it becomes a crisis.</p>
            </div>
          </div>
        </div>
        <div className="demo">
          <div className="demo-head">
            <div className="demo-title">
              <span className="mod" style={{background:'var(--m7)'}}>M07</span>
              <strong>Greenhollow Commons · This sprint</strong>
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-3)'}}>Sprint 12 · May→Jun</span>
          </div>
          <div className="ops-stat">
            <div className="stat"><div className="sn">5</div><div className="sl">Active projects</div></div>
            <div className="stat"><div className="sn">12</div><div className="sl">Deliverables</div></div>
            <div className="stat"><div className="sn">40%</div><div className="sl">Sprint complete</div></div>
          </div>
          <div style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:600,letterSpacing:'0.08em',
            color:'var(--ink-4)',textTransform:'uppercase',marginBottom:6}}>
            Deliverables — Reed-bed wetland
          </div>
          <div className="deliverables">
            {DELIVERABLES.map((d,i) => (
              <div key={i} className={"deliv"+(d.done?' done':'')}>
                <div className="di-box">{d.done && <Check/>}</div>
                <span className="dname">{d.name}</span>
                <span className="dwho">{d.who}</span>
                <span className={"ddue"+(d.late?' late':'')}>{d.due}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* M08 — Contributions                                      */
/* ───────────────────────────────────────────────────────── */
const LOG = [
  { what:'Reed-bed trench day 1 (6h)',    pts:120, when:'May 18' },
  { what:'Hosted welcome call for 4 explorers', pts:40,  when:'May 14' },
  { what:'Soil-test help, Plot C',         pts:30,  when:'May 11' },
  { what:'Funding-circle pitch deck v2',   pts:60,  when:'May 06' },
  { what:'Welcome dinner — cooked + hosted', pts:25,  when:'May 02' },
];
function ContributionsSection() {
  const [draft, setDraft] = useState({ what:'Reed-bed trench day 2', cat:'Build', hours:'5' });
  const [log, setLog] = useState(LOG);
  const total = useMemo(() => log.reduce((s,r)=>s+r.pts,0), [log]);
  const add = () => {
    const pts = Math.round((parseFloat(draft.hours)||0) * 20);
    if (!draft.what.trim() || pts<=0) return;
    setLog(l => [{ what:draft.what, pts, when:'Today' }, ...l]);
    setDraft({ what:'', cat:'Build', hours:'' });
  };
  return (
    <section className="section" id="contributions">
      <div className="section-split reverse">
        <div className="demo">
          <div className="demo-head">
            <div className="demo-title">
              <span className="mod" style={{background:'var(--m8)'}}>M08</span>
              <strong>Your contribution log</strong>
            </div>
            <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--ink-3)'}}>Top 25% · Sprint 12</span>
          </div>
          <div className="points-hero">
            <div>
              <div className="points-num">{total}</div>
              <div className="points-label">Points this sprint</div>
            </div>
            <div className="points-info">
              <div className="points-rank">3 badges earned · Builder · Welcomer · Funder</div>
              <div className="badge-row">
                <span className="badge-circ">🪨</span>
                <span className="badge-circ">🤝</span>
                <span className="badge-circ">💰</span>
                <span className="badge-circ locked">🌿</span>
                <span className="badge-circ locked">⚖️</span>
                <span className="badge-circ locked">✦</span>
              </div>
            </div>
          </div>
          <div className="log-form">
            <input placeholder="What did you do?" value={draft.what}
              onChange={e=>setDraft(d=>({...d, what:e.target.value}))}/>
            <select value={draft.cat} onChange={e=>setDraft(d=>({...d, cat:e.target.value}))}>
              <option>Build</option><option>Care</option><option>Decide</option>
              <option>Welcome</option><option>Fund</option>
            </select>
            <input type="number" placeholder="Hours" value={draft.hours}
              onChange={e=>setDraft(d=>({...d, hours:e.target.value}))}/>
            <button style={{gridColumn:'1 / -1'}} onClick={add}>
              Log it · earn {Math.round((parseFloat(draft.hours)||0)*20)} pts
            </button>
          </div>
          <div className="log-list">
            {log.slice(0,5).map((r,i) => (
              <div className="log-row" key={i}>
                <span>{r.what}</span>
                <span className="lwhen">{r.when}</span>
                <span className="lpts">+{r.pts}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHead
            mod="08" label="Contribution Tracking" color="var(--m8)"
            h="Log your effort. The community sees it. You're rewarded."
            lead="Volunteer work goes invisible. Not here. Log every hour, every batch of bread, every
                  facilitated meeting. Earn points, unlock badges, build a reputation that means something
                  beyond this project."
          />
          <div className="why">
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Points</strong> for time, energy, and resources brought to community work.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Badges</strong> for milestones — first build day, first funding round, first conflict mediated.</p>
            </div>
            <div className="why-row"><div className="check"><Check/></div>
              <p><strong>Reputation that travels</strong> — across the Hive, to future communities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* M09 — Governance                                         */
/* ───────────────────────────────────────────────────────── */
const LAYERS = [
  { num:'01', name:'Consent (Sociocracy)',
    desc:'Most everyday decisions. Move forward if there are no principled objections — not unanimous applause.',
    mark:'☉' },
  { num:'02', name:'Democracy (Majority)',
    desc:'Big shared choices that affect everyone. Open vote, simple majority, public results.',
    mark:'☑' },
  { num:'03', name:'Meritocracy (Domain expert)',
    desc:'Technical calls go to the person with the skin in the game — soil tests, money, contracts.',
    mark:'△' },
  { num:'04', name:'AI-mediated facilitation',
    desc:'When things stall, the community AI surfaces blockers, suggests reframes, finds the next move.',
    mark:'◇' },
];
const VOTES = { yes: 14, concern: 3, no: 2 };
function GovernanceSection() {
  const [layer, setLayer] = useState(0);
  const [vote, setVote] = useState(null);
  const yesCount = VOTES.yes + (vote==='yes'?1:0);
  const conCount = VOTES.concern + (vote==='concern'?1:0);
  const noCount  = VOTES.no  + (vote==='no'?1:0);
  const total = yesCount+conCount+noCount;
  return (
    <section className="section" id="governance">
      <SectionHead
        mod="09" label="Governance" color="var(--m9)"
        h="Decide together. Four layers, one community."
        lead="Big questions, small calls, technical judgments, and impossible deadlocks — each deserves a
              different decision tool. The Governance module gives you four layered modes and one AI facilitator
              that knows when to use which."
      />
      <div className="gov-layers">
        {LAYERS.map((l, i) => (
          <div key={i} className={"gov-layer"+(i===layer?' active':'')} onClick={()=>setLayer(i)}>
            <span className="layer-mark">{l.mark}</span>
            <div className="layer-num">LAYER {l.num}</div>
            <div className="layer-name">{l.name}</div>
            <div className="layer-desc">{l.desc}</div>
          </div>
        ))}
      </div>
      <div className="proposal">
        <h4>Proposal · "Approve $24k for reed-bed wetland materials"</h4>
        <div className="pmeta">
          Decision mode: <strong>{LAYERS[layer].name}</strong> ·
          {' '}Opened by @priya · 2 days left · {total} of 19 residents have voted
        </div>
        <div className="vote-bar">
          <div className="vote-seg yes"     style={{flex: yesCount}}>{yesCount} consent</div>
          <div className="vote-seg concern" style={{flex: conCount}}>{conCount} concern</div>
          <div className="vote-seg no"      style={{flex: noCount}}>{noCount} object</div>
        </div>
        <div className="vote-buttons">
          <button className={"vote-btn"+(vote==='yes'?' cast':'')} onClick={()=>setVote('yes')}>
            ✓ I consent
          </button>
          <button className={"vote-btn"+(vote==='concern'?' cast':'')} onClick={()=>setVote('concern')}>
            ⚠ I have a concern
          </button>
          <button className={"vote-btn"+(vote==='no'?' cast':'')} onClick={()=>setVote('no')}>
            ✗ I object
          </button>
        </div>
        {vote === 'concern' && (
          <div style={{
            marginTop:12,padding:'10px 12px',background:'color-mix(in srgb, var(--m9) 6%, transparent)',
            borderRadius:8,fontSize:12,color:'var(--ink-2)',
            border:'1px dashed color-mix(in srgb, var(--m9) 30%, var(--rule))'
          }}>
            <strong>Concerns block nothing</strong> — they go on the record and trigger a 24h check-in
            before final tally. The AI facilitator will summarize concerns to the proposer.
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* Closing CTA                                              */
/* ───────────────────────────────────────────────────────── */
function Closing({ name }) {
  return (
    <section className="closing">
      <div className="closing-box">
        <h2>Ready to step into the clubhouse, {name}?</h2>
        <p>
          You don't have to decide today. Read the Blueprint. Meet a resident. Visit. Talk.
          When you're ready, sign the values — and start showing up.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#join">
            Begin joining → <Arrow/>
          </a>
          <a className="btn btn-secondary" href="#meet">
            Just browse first
          </a>
        </div>
        <div className="footnote">
          MyCoNet · MyCommunityNetwork · RNF · v3.0
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── */
/* Tweaks                                                   */
/* ───────────────────────────────────────────────────────── */
// Map hex → accent palette key so we can listen to TweakColor's hex value
const HEX_TO_ACCENT = {
  '#22a447': 'green',
  '#1e8f5a': 'forest',
  '#d2811a': 'amber',
  '#3552c7': 'indigo',
};
const ACCENT_OPTIONS = ['#22a447', '#1e8f5a', '#d2811a', '#3552c7'];

function PortalTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent — accentColor stored as a hex string from TweakColor
  useEffect(() => {
    const key = HEX_TO_ACCENT[t.accentColor] || t.accentColor || 'green';
    const p = ACCENT_PALETTES[key] || ACCENT_PALETTES.green;
    document.documentElement.style.setProperty('--accent', p.accent);
    document.documentElement.style.setProperty('--accent-soft', p.soft);
  }, [t.accentColor]);

  // Apply theme
  useEffect(() => {
    document.body.dataset.theme = t.theme;
  }, [t.theme]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Welcome">
        <TweakText label="Member name" value={t.userName} onChange={v=>setTweak('userName', v)}/>
      </TweakSection>
      <TweakSection label="Theme">
        <TweakRadio
          label="Mode"
          value={t.theme}
          options={['light','dark']}
          onChange={v=>setTweak('theme', v)}
        />
        <TweakColor
          label="Accent"
          value={t.accentColor}
          options={ACCENT_OPTIONS}
          onChange={v=>setTweak('accentColor', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

/* ───────────────────────────────────────────────────────── */
/* App                                                      */
/* ───────────────────────────────────────────────────────── */
function App() {
  // Pull initial name from saved defaults
  const [name, setName] = useState(TWEAK_DEFAULTS.userName);

  // Listen for tweak changes to keep name in sync across the page
  useEffect(() => {
    function onMsg(e) {
      if (e.data?.type === '__edit_mode_set_keys' && e.data.edits?.userName) {
        setName(e.data.edits.userName);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Apply initial theme + accent immediately
  useEffect(() => {
    const p = ACCENT_PALETTES[TWEAK_DEFAULTS.accentColor] || ACCENT_PALETTES.green;
    document.documentElement.style.setProperty('--accent', p.accent);
    document.documentElement.style.setProperty('--accent-soft', p.soft);
    document.body.dataset.theme = TWEAK_DEFAULTS.theme;
  }, []);

  return (
    <>
      <TopBar name={name}/>
      <Hero name={name}/>
      <div style={{padding:'0 28px'}}>
        <ClubhousePreview name={name}/>
      </div>
      <MeetSection/>
      <BlueprintSection/>
      <JoinSection/>
      <AgreementsSection/>
      <OpsSection/>
      <ContributionsSection/>
      <GovernanceSection/>
      <Closing name={name}/>
      <footer className="site">
        MyCoNet · MyCommunityNetwork · Regenerative Neighborhood Framework · Open sourced by The Regen Tribe Collective
      </footer>
      <PortalTweaks/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
