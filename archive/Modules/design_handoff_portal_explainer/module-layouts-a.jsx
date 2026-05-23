/* MyCoNet — module layouts A: M00 Dashboard, M01 Network, M04 Blueprint, M05 Join */

/* ═══════════════════════════════════════════════════════════════════════
   M00 — Dashboard
   ═════════════════════════════════════════════════════════════════════ */
function M00Dashboard() {
  return (
    <div className="app">
      <TopBar/>
      <SideNav active="00"/>
      <main className="main">
        <div className="page">
          <PageHead
            mod="00" label="Dashboard" color="var(--ink)"
            title="Good morning, Maya."
            sub="You're an Explorer at Greenhollow Commons · Phase 2 of 4 (PROVE) · 38 members"
            actions={<>
              <button className="btn btn-secondary btn-sm">View blueprint</button>
              <button className="btn btn-primary btn-sm" style={{background:'var(--m5)'}}>Begin joining →</button>
            </>}
          />

          {/* Stats */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:18}}>
            <div className="stat-card">
              <div className="label">Members</div>
              <div className="value">38</div>
              <div className="delta">+4 this week</div>
            </div>
            <div className="stat-card">
              <div className="label">Blueprint readiness</div>
              <div className="value">3.3<span style={{color:'var(--ink-4)', fontSize:16}}>/5</span></div>
              <div className="delta" style={{color:'var(--m4)'}}>PROVE phase</div>
            </div>
            <div className="stat-card">
              <div className="label">Open projects</div>
              <div className="value">5</div>
              <div className="delta">2 need help</div>
            </div>
            <div className="stat-card">
              <div className="label">Open proposals</div>
              <div className="value">2</div>
              <div className="delta" style={{color:'var(--m9)'}}>Awaiting your vote</div>
            </div>
          </div>

          {/* Two columns */}
          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16}}>
            {/* Left — Module cards */}
            <div>
              <h3 style={{fontFamily:'var(--mono)',fontSize:10,fontWeight:700,letterSpacing:'0.1em',color:'var(--ink-3)',textTransform:'uppercase',margin:'0 0 10px'}}>
                Jump into a module
              </h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[
                  { num:'01', name:'Community Network', desc:'Meet 38 residents and explorers · 4 new matches', color:'var(--m1)' },
                  { num:'04', name:'Blueprint',          desc:'Phase 2 · PROVE · Economy pillar needs work', color:'var(--m4)' },
                  { num:'05', name:'Join',               desc:'4 steps · Sign the values to become resident', color:'var(--m5)', cta:'Start' },
                  { num:'06', name:'Agreements',         desc:'5 open projects · 2 hiring this week', color:'var(--m6)', locked:true },
                  { num:'07', name:'Operations',         desc:'12 deliverables · 3 due Friday', color:'var(--m7)', locked:true },
                  { num:'08', name:'Contributions',      desc:'Logged 420 pts · 3 badges · top 25%', color:'var(--m8)', locked:true },
                  { num:'09', name:'Governance',         desc:'2 proposals open · 14 of 19 have voted', color:'var(--m9)', locked:true },
                  { num:'04', name:'Resources & docs',   desc:'Read the soil report, founders\' agreement', color:'var(--m4)' },
                ].map((c,i) => (
                  <div key={i} className="card card-pad" style={{position:'relative', overflow:'hidden', opacity: c.locked ? 0.6 : 1, padding:'14px 16px'}}>
                    <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:c.color}}/>
                    <div className="row between mb-2" style={{marginTop:4}}>
                      <span className="mono" style={{fontSize:10,fontWeight:700,color:c.color,letterSpacing:'0.06em'}}>M{c.num}</span>
                      {c.cta && <span className="pill" style={{background:c.color, color:'#fff'}}>{c.cta}</span>}
                      {c.locked && <span className="mono" style={{fontSize:9, color:'var(--ink-4)'}}>🔒 Resident</span>}
                    </div>
                    <div style={{fontSize:13, fontWeight:600, marginBottom:3}}>{c.name}</div>
                    <div style={{fontSize:11.5, color:'var(--ink-3)', lineHeight:1.5}}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Activity + Welcome */}
            <div className="col gap-3">
              <div className="card card-pad">
                <div className="row between mb-3">
                  <h4 style={{margin:0,fontSize:13,fontWeight:700}}>Activity</h4>
                  <span className="mono small">Last 7 days</span>
                </div>
                <div className="col gap-3">
                  {[
                    { who:'Diego Solá', act:'closed the funding circle round 1', when:'2h', color:'var(--m5)' },
                    { who:'Priya Mahesh', act:'opened a Governance proposal: "Approve $24k wetlands"', when:'1d', color:'var(--m9)' },
                    { who:'Ana Whitewater', act:'updated Blueprint · Ecology pillar (+0.4)', when:'2d', color:'var(--m4)' },
                    { who:'Eli Tanaka', act:'joined the project as Resident', when:'3d', color:'var(--m5)' },
                    { who:'You', act:'created your explorer profile', when:'5d', color:'var(--ink-3)' },
                  ].map((a,i) => (
                    <div key={i} className="row gap-3">
                      <Avatar name={a.who} bg={a.color} size={26}/>
                      <div className="grow">
                        <div style={{fontSize:12.5, lineHeight:1.5}}>
                          <strong>{a.who}</strong>{' '}<span style={{color:'var(--ink-3)'}}>{a.act}</span>
                        </div>
                      </div>
                      <span className="mono small">{a.when}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card card-pad" style={{background:'color-mix(in srgb, var(--m5) 6%, var(--surface))', borderColor:'color-mix(in srgb, var(--m5) 20%, var(--rule))'}}>
                <div className="mono" style={{fontSize:10,fontWeight:700,color:'var(--m5)',letterSpacing:'0.08em',marginBottom:4}}>NEXT STEP</div>
                <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Sign the community values</div>
                <div style={{fontSize:12,color:'var(--ink-3)',lineHeight:1.55,marginBottom:10}}>
                  4 simple steps move you from Explorer to Joining. Unlocks Agreements, Operations,
                  Contributions and Governance.
                </div>
                <button className="btn btn-primary btn-sm" style={{background:'var(--m5)'}}>Start joining →</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   M01 — Community Network (Residents directory)
   ═════════════════════════════════════════════════════════════════════ */
const RESIDENTS = [
  { name:'Ana Whitewater', role:'Resident · Permaculture lead', where:'San Cristóbal, MX',
    bg:'var(--m1)', match:92,
    offers:['Permaculture design', 'Mycology', '20 yrs land mgmt'],
    seeks:['Co-builders for wetlands'],
    bio:'Designing a 12-acre wetland-integrated food forest. Looking for builders and a hydrologist.' },
  { name:'Eli Tanaka', role:'Resident · Natural builder', where:'Visiting Tlaxcala, MAY',
    bg:'var(--m4)', match:81,
    offers:['Natural building', 'Cob', 'Timber framing'],
    seeks:['Long-term land partner'],
    bio:'Just finished a cob/strawbale build in Oregon. Open to relocating for the right project.' },
  { name:'Priya Mahesh', role:'Resident · Facilitator', where:'Berkeley, CA',
    bg:'var(--m9)', match:76,
    offers:['NVC facilitation','Conflict mediation','Sociocracy training'],
    seeks:['Resident circle that values it'],
    bio:'Trained sociocracy facilitator. Holding governance for two communities currently.' },
  { name:'Diego Solá', role:'Resident · Funding lead', where:'Oaxaca, MX',
    bg:'var(--m5)', match:68,
    offers:['Investment capital','Banking relationships','Pitch decks'],
    seeks:['Project leads with traction'],
    bio:'Closing round 2 of the funding circle. $120k still open. Available 4hrs/week.' },
  { name:'Maya Reyes', role:'Explorer · You', where:'Mexico City, MX',
    bg:'var(--m8)', match:null,
    offers:['Software','Comms','Pitch help'],
    seeks:['Community to call home'],
    bio:'Recently moved to MX. Exploring 3 projects. Sign-up was 5 days ago.' },
  { name:'Lía Okafor', role:'Resident · Project lead', where:'Lagos, NG',
    bg:'var(--m6)', match:73,
    offers:['Ops management','Sprint facilitation'],
    seeks:['Tech partner for grant tracker'],
    bio:'Project lead for round 2 funding circle. Looking for an engineer to help track grants.' },
];

function M01Network() {
  return (
    <div className="app">
      <TopBar search="Search residents · skills · seeks…"/>
      <SideNav active="01"/>
      <main className="main">
        <div className="page">
          <PageHead
            mod="01" label="Community Network" color="var(--m1)"
            title="Residents & Explorers"
            sub="38 people gathering around Greenhollow Commons · 6 visiting this month"
            actions={<>
              <button className="btn btn-secondary btn-sm">Edit my profile</button>
              <button className="btn btn-primary btn-sm" style={{background:'var(--m1)'}}>+ Travel plan</button>
            </>}
          />

          {/* Filter bar */}
          <div className="row gap-2 mb-3" style={{flexWrap:'wrap'}}>
            <div className="chip" style={{background:'var(--ink)',color:'var(--bg)',borderColor:'var(--ink)'}}>All · 38</div>
            <div className="chip">Residents · 14</div>
            <div className="chip">Explorers · 18</div>
            <div className="chip">Visiting now · 6</div>
            <div style={{flex:1}}/>
            <div className="chip" style={{background:'transparent',borderStyle:'dashed'}}>↕ Sort: match score</div>
            <div className="chip" style={{background:'transparent',borderStyle:'dashed'}}>🔎 Filter</div>
          </div>

          <div className="net-grid">
            {RESIDENTS.map(r => (
              <div className="net-card" key={r.name}>
                <div className="row gap-3 mb-3">
                  <Avatar name={r.name} bg={r.bg} size={44}/>
                  <div className="grow">
                    <div className="row between center">
                      <div style={{fontSize:13.5,fontWeight:700}}>{r.name}</div>
                      {r.match !== null && (
                        <span className="pill mono" style={{background:'color-mix(in srgb, var(--m1) 12%, transparent)', color:'var(--m1)'}}>
                          {r.match}% match
                        </span>
                      )}
                    </div>
                    <div className="small" style={{marginTop:1}}>{r.role}</div>
                    <div className="small mono" style={{marginTop:2, color:'var(--ink-4)'}}>📍 {r.where}</div>
                  </div>
                </div>
                <p style={{fontSize:12.5, color:'var(--ink-2)', margin:'0 0 12px', lineHeight:1.55}}>
                  {r.bio}
                </p>
                <div style={{display:'flex', flexDirection:'column', gap:6}}>
                  <div>
                    <div className="mono" style={{fontSize:9.5,fontWeight:700,color:'var(--m5)',letterSpacing:'0.08em',marginBottom:4}}>OFFERS</div>
                    <div className="row gap-2" style={{flexWrap:'wrap'}}>
                      {r.offers.map(o => <Chip key={o} color="var(--m5)" light>+ {o}</Chip>)}
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="mono" style={{fontSize:9.5,fontWeight:700,color:'var(--m6)',letterSpacing:'0.08em',marginBottom:4}}>SEEKS</div>
                    <div className="row gap-2" style={{flexWrap:'wrap'}}>
                      {r.seeks.map(s => <Chip key={s} color="var(--m6)" light>? {s}</Chip>)}
                    </div>
                  </div>
                </div>
                <div className="row gap-2 mt-3" style={{paddingTop:12, borderTop:'1px solid var(--rule-soft)'}}>
                  <button className="btn btn-ghost btn-sm">Message</button>
                  <button className="btn btn-secondary btn-sm" style={{marginLeft:'auto'}}>View profile →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   M04 — Blueprint Wizard
   ═════════════════════════════════════════════════════════════════════ */
const BP_PHASES = [
  { ph:'SPARK', col:'var(--m1)', state:'done',
    steps:[{n:'1.1', name:'The vision', s:'done'},{n:'1.2', name:'Core team', s:'done'},{n:'1.3', name:'Why this place', s:'done'},{n:'1.4', name:'Join questions', s:'done'}] },
  { ph:'PROVE', col:'var(--m4)', state:'active',
    steps:[{n:'2.1', name:'Land viability', s:'done'},{n:'2.2', name:'Funding strategy', s:'active'},{n:'2.3', name:'Governance v1', s:'todo'},{n:'2.4', name:'Founders\' agreement', s:'todo'}] },
  { ph:'BUILD', col:'var(--m6)', state:'locked',
    steps:[{n:'3.1', name:'Infrastructure', s:'todo'},{n:'3.2', name:'Onboarding flow', s:'todo'},{n:'3.3', name:'First residents', s:'todo'}] },
  { ph:'LIVE',  col:'var(--m5)', state:'locked',
    steps:[{n:'4.1', name:'Daily rhythm', s:'todo'},{n:'4.2', name:'Conflict practice', s:'todo'},{n:'4.3', name:'5-year horizon', s:'todo'}] },
];

function M04Blueprint() {
  return (
    <div className="app">
      <TopBar/>
      <SideNav active="04"/>
      <main className="main" style={{padding:0}}>
        <div className="wiz" style={{height:'100%'}}>
          {/* Sidebar steps */}
          <aside className="wiz-side">
            <h4>Living document · v3.2</h4>
            <div className="row gap-2 mb-3" style={{margin:'0 8px 14px',padding:'8px 10px',borderRadius:8,background:'var(--surface)',border:'1px solid var(--rule)'}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'var(--m5)',boxShadow:'0 0 0 3px color-mix(in srgb, var(--m5) 25%, transparent)'}}/>
              <span className="small">Auto-saved 12s ago</span>
            </div>
            {BP_PHASES.map(p => (
              <div className="wiz-phase" key={p.ph}>
                <div className="wiz-phase-h">
                  <span className="pb" style={{background:`color-mix(in srgb, ${p.col} 16%, transparent)`, color:p.col}}>{p.ph}</span>
                  <span style={{color: p.state==='locked'?'var(--ink-4)':'var(--ink-2)'}}>
                    {p.state==='done' && '✓ Passed'}
                    {p.state==='active' && 'In progress'}
                    {p.state==='locked' && '🔒 Locked'}
                  </span>
                </div>
                {p.steps.map(s => (
                  <div key={s.n} className={'wiz-step ' + (s.s==='done'?'done':'') + (s.s==='active'?' active':'')}>
                    <span className="dot"/>
                    <span className="mono" style={{fontSize:10.5, color:'var(--ink-3)', minWidth:24}}>{s.n}</span>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </aside>

          {/* Main editor */}
          <section className="wiz-main">
            <div className="row between mb-3">
              <div>
                <div className="mono" style={{fontSize:11,fontWeight:700,color:'var(--m4)',letterSpacing:'0.08em', marginBottom:4}}>
                  PHASE 2 · PROVE · STEP 2.2
                </div>
                <h2 style={{margin:'0 0 6px',fontSize:24,fontWeight:700,letterSpacing:'-0.015em'}}>Funding strategy</h2>
                <p className="small" style={{margin:0}}>
                  How will the project move from concept to land purchase to occupation? Show your numbers — honesty is what makes this readable to others.
                </p>
              </div>
              <div className="row gap-2">
                <button className="btn btn-ghost btn-sm">⤓ Import PDF</button>
                <button className="btn btn-secondary btn-sm">Export →</button>
              </div>
            </div>

            <div className="card card-pad mb-3" style={{padding:20}}>
              <div className="field">
                <label className="field-label">
                  Total capital required (Phase 2 → Build)
                  <span className="field-hint">USD, including 15% contingency</span>
                </label>
                <input className="field-input" type="text" defaultValue="$ 480,000"/>
              </div>
              <div className="field">
                <label className="field-label">Sources & status</label>
                <textarea className="field-textarea" defaultValue={"• Founders' personal capital · $90,000 (committed)\n• Funding circle round 1 · $240,000 (closed May 18)\n• Funding circle round 2 · $120,000 (open · 4 more investor-members needed)\n• Grants · $30,000 (Beneficia Foundation, decision Jun 30)"}/>
              </div>
              <div className="field" style={{marginBottom:0}}>
                <label className="field-label">
                  Risks we've named
                  <span className="field-hint">Better to write the worst-case here than discover it later</span>
                </label>
                <textarea className="field-textarea" defaultValue={"1. Grant could fall through — Diego has a backup plan via Solidaridad Capital.\n2. Land seller may withdraw if escrow > 90 days — we have a soft hold until Jul 15.\n3. Building permit timeline could push BUILD phase to Q1 next year."}/>
              </div>
            </div>

            <div className="row between mt-3">
              <button className="btn btn-ghost btn-sm">← 2.1 Land viability</button>
              <div className="row gap-2">
                <button className="btn btn-secondary btn-sm">Save draft</button>
                <button className="btn btn-primary btn-sm" style={{background:'var(--m4)'}}>Mark 2.2 complete →</button>
              </div>
            </div>
          </section>

          {/* Right rail — pillars + gate */}
          <aside className="wiz-rail">
            <div className="card radar-card mb-3">
              <h5>5-Pillar readiness</h5>
              <div style={{display:'grid', placeItems:'center'}}>
                <PillarRadar values={[4.2, 3.6, 2.3, 2.8, 3.4]} color="var(--m4)" size={210}/>
              </div>
              <div className="mt-3" style={{display:'flex', flexDirection:'column', gap:8}}>
                {[
                  { n:'Ecology',    v:4.2 },{ n:'Social', v:3.6 },{ n:'Economy', v:2.3 },
                  { n:'Hardware',   v:2.8 },{ n:'Governance', v:3.4 },
                ].map(p => (
                  <div key={p.n} className="row gap-2 center">
                    <span className="small" style={{width:78, color:'var(--ink-2)'}}>{p.n}</span>
                    <div className="grow"><Pbar value={p.v} color="var(--m4)"/></div>
                    <span className="mono small" style={{width:32, textAlign:'right'}}>{p.v.toFixed(1)}<span style={{color:'var(--ink-4)'}}>/5</span></span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-pad" style={{background:'color-mix(in srgb, var(--m4) 6%, var(--surface))', borderColor:'color-mix(in srgb, var(--m4) 22%, var(--rule))'}}>
              <div className="mono" style={{fontSize:10,fontWeight:700,color:'var(--m4)',letterSpacing:'0.08em',marginBottom:4}}>NEXT GATE</div>
              <div style={{fontSize:13,fontWeight:600, marginBottom:4}}>Pass PROVE → BUILD</div>
              <div className="small" style={{lineHeight:1.55}}>
                Economy must reach <strong>3.0</strong> (currently 2.3). Close funding circle round 2 to hit it.
              </div>
              <button className="btn btn-secondary btn-sm mt-3" style={{width:'100%'}}>See gate criteria</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   M05 — Join (multi-step onboarding)
   ═════════════════════════════════════════════════════════════════════ */
const JOIN_STEPS = ['Tell us about you', 'Values & best practice', 'Match with a buddy', 'Submit application'];

function M05Join() {
  const VALUES = [
    { t:'Care for the land before yield.', d:'Decisions are tested against ecological impact first, profit second.', checked:true },
    { t:'Consent over consensus.', d:'We seek no objections, not unanimous applause. Move forward if good enough for now.', checked:true },
    { t:'Show up, don\'t just sign up.', d:'Logged contributions matter more than promises. Reputation is earned in the doing.', checked:true },
    { t:'Disagree out loud, decide in writing.', d:'Bring the hard things to the circle. What we decide goes in the Blueprint.', checked:false },
    { t:'Leave it better.', d:'Whatever you touch, leave it more alive than you found it.', checked:false },
  ];
  return (
    <div className="app">
      <TopBar/>
      <SideNav active="05"/>
      <main className="main">
        <div className="page" style={{maxWidth: 880, margin: '0 auto'}}>
          <PageHead
            mod="05" label="Join" color="var(--m5)"
            title="Become a joining member"
            sub="Step 2 of 4 · Read the values and sign each one you can stand behind"
          />

          {/* Stepper */}
          <div className="card card-pad mb-4" style={{padding:'14px 18px'}}>
            <div className="row" style={{justifyContent:'space-between', position:'relative'}}>
              {JOIN_STEPS.map((s, i) => {
                const active = i === 1;
                const done = i < 1;
                return (
                  <React.Fragment key={s}>
                    <div className="col center" style={{gap:8, position:'relative', zIndex:1, background:'var(--surface)', padding:'0 8px'}}>
                      <div style={{
                        width:32, height:32, borderRadius:'50%',
                        background: done ? 'var(--m5)' : active ? 'var(--surface)' : 'var(--bg-2)',
                        border: '2px solid ' + (done || active ? 'var(--m5)' : 'var(--rule)'),
                        color: done ? '#fff' : active ? 'var(--m5)' : 'var(--ink-4)',
                        display:'grid', placeItems:'center', fontWeight:700, fontSize:13,
                        fontFamily:'var(--mono)',
                        boxShadow: active ? '0 0 0 4px color-mix(in srgb, var(--m5) 15%, transparent)' : 'none',
                      }}>
                        {done ? '✓' : i+1}
                      </div>
                      <span className="mono" style={{fontSize:11, color: active ? 'var(--ink)' : 'var(--ink-3)', fontWeight: active?700:500, textAlign:'center'}}>{s}</span>
                    </div>
                  </React.Fragment>
                );
              })}
              <div style={{position:'absolute', top:16, left:48, right:48, height:2, background:'var(--rule)', zIndex:0}}>
                <div style={{width:'33%', height:'100%', background:'var(--m5)'}}/>
              </div>
            </div>
          </div>

          {/* Step body */}
          <div className="card card-pad" style={{padding:24}}>
            <div className="row between mb-3" style={{alignItems:'flex-start'}}>
              <div>
                <h3 style={{margin:'0 0 4px', fontSize:20, fontWeight:700, letterSpacing:'-0.01em'}}>Sign the values</h3>
                <p className="small" style={{margin:0, maxWidth:'52ch', lineHeight:1.55}}>
                  These are the rules of life in Greenhollow Commons. Read each one carefully. Tap to sign — or leave it
                  unsigned and bring your concern to the next residents' circle. Both are valid.
                </p>
              </div>
              <div className="pill mono" style={{background:'color-mix(in srgb, var(--m5) 12%, transparent)', color:'var(--m5)'}}>
                {VALUES.filter(v=>v.checked).length}/5 signed
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:10, marginBottom:18}}>
              {VALUES.map((v, i) => (
                <div key={i} style={{
                  padding:'14px 16px', borderRadius:10,
                  border:'1px solid ' + (v.checked ? 'color-mix(in srgb, var(--m5) 40%, var(--rule))' : 'var(--rule)'),
                  background: v.checked ? 'color-mix(in srgb, var(--m5) 6%, var(--surface))' : 'var(--surface)',
                  display:'grid', gridTemplateColumns:'22px 1fr auto', gap:14, alignItems:'flex-start',
                  cursor:'pointer',
                }}>
                  <div style={{
                    width:20, height:20, borderRadius:6, marginTop:1,
                    border: '1.5px solid ' + (v.checked ? 'var(--m5)' : 'var(--rule)'),
                    background: v.checked ? 'var(--m5)' : 'var(--surface)',
                    display:'grid', placeItems:'center',
                  }}>
                    {v.checked && <span style={{color:'#fff',fontSize:11,fontWeight:700}}>✓</span>}
                  </div>
                  <div>
                    <div style={{fontSize:14, fontWeight:600, marginBottom:2}}>{v.t}</div>
                    <div className="small">{v.d}</div>
                  </div>
                  <span className="mono" style={{fontSize:10, color:v.checked?'var(--m5)':'var(--ink-4)', alignSelf:'center'}}>
                    {v.checked ? 'Signed' : 'Tap to sign'}
                  </span>
                </div>
              ))}
            </div>

            <div className="row gap-2 between" style={{paddingTop:14, borderTop:'1px solid var(--rule)'}}>
              <button className="btn btn-ghost btn-sm">← Back to step 1</button>
              <div className="row gap-2">
                <button className="btn btn-secondary btn-sm">Save & continue later</button>
                <button className="btn btn-primary btn-sm" style={{background:'var(--m5)'}} disabled>
                  Sign 2 more to continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { M00Dashboard, M01Network, M04Blueprint, M05Join });
