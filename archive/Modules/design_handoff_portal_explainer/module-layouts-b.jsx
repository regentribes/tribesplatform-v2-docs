/* MyCoNet — module layouts B: M06 Agreements, M07 Operations, M08 Contributions, M09 Governance */

/* ═══════════════════════════════════════════════════════════════════════
   M06 — Agreements (browse open projects + propose how you'll support)
   ═════════════════════════════════════════════════════════════════════ */
const M06_PROJECTS = [
  { name:'Reed-bed greywater wetlands', lead:'Ana Whitewater', leadBg:'var(--m1)', desc:'Build the wetland that treats greywater for Cluster A homes.',
    needs:['Earthworks','Plumbing','3 weekends'], deadline:'Jun 30', selected:true, status:'OPEN' },
  { name:'Funding circle · round 2', lead:'Diego Solá', leadBg:'var(--m5)', desc:'Close the BUILD-phase capital raise. $120k remaining of $360k goal.',
    needs:['Network access','Pitch help','Legal review'], deadline:'Jul 15', status:'OPEN' },
  { name:'Q3 resident onboarding', lead:'Priya Mahesh', leadBg:'var(--m9)', desc:'Run application review, host welcome calls, pair newcomers with mentors.',
    needs:['Facilitation','Hospitality'], deadline:'Sep 01', status:'OPEN' },
  { name:'Soil remediation, Plot D', lead:'Eli Tanaka', leadBg:'var(--m4)', desc:'Compost-tea + cover-cropping program for the degraded northwest plot.',
    needs:['Heavy labor','Materials budget'], deadline:'Aug 12', status:'OPEN' },
];

function M06Agreements() {
  return (
    <div className="app">
      <TopBar/>
      <SideNav active="06"/>
      <main className="main">
        <div className="page">
          <PageHead
            mod="06" label="Agreements" color="var(--m6)"
            title="Make an agreement"
            sub="Browse open projects and propose exactly what you'll contribute, exactly what you expect in return."
            actions={<>
              <button className="btn btn-secondary btn-sm">My agreements (3)</button>
              <button className="btn btn-primary btn-sm" style={{background:'var(--m6)'}}>+ Propose new project</button>
            </>}
          />

          <div style={{display:'grid', gridTemplateColumns:'1fr 1.05fr', gap:18}}>
            {/* Left — open projects */}
            <div>
              <div className="row gap-2 mb-3" style={{flexWrap:'wrap'}}>
                <span className="chip" style={{background:'var(--ink)', color:'var(--bg)', borderColor:'var(--ink)'}}>Open · 5</span>
                <span className="chip">Mine</span>
                <span className="chip">All projects</span>
                <span style={{flex:1}}/>
                <span className="chip" style={{background:'transparent', borderStyle:'dashed'}}>↕ Soonest deadline</span>
              </div>
              <div className="col gap-2">
                {M06_PROJECTS.map((p,i) => (
                  <div key={i} className="card" style={{
                    padding:'14px 16px',
                    borderColor: p.selected ? 'var(--m6)' : 'var(--rule)',
                    boxShadow: p.selected ? '0 0 0 3px color-mix(in srgb, var(--m6) 12%, transparent)' : 'var(--shadow-sm)',
                    cursor:'pointer',
                  }}>
                    <div className="row between mb-2" style={{alignItems:'flex-start'}}>
                      <div className="row gap-3 center">
                        <Avatar name={p.lead} bg={p.leadBg} size={28}/>
                        <div>
                          <div style={{fontSize:13.5,fontWeight:700,lineHeight:1.3}}>{p.name}</div>
                          <div className="small mono" style={{marginTop:1}}>by {p.lead} · deadline {p.deadline}</div>
                        </div>
                      </div>
                      <span className="pill mono" style={{background:'color-mix(in srgb, var(--m5) 12%, transparent)', color:'var(--m5)'}}>● {p.status}</span>
                    </div>
                    <p style={{fontSize:12, color:'var(--ink-2)', margin:'2px 0 8px', lineHeight:1.55}}>{p.desc}</p>
                    <div className="row gap-2" style={{flexWrap:'wrap'}}>
                      <span className="mono" style={{fontSize:9.5,fontWeight:700,color:'var(--ink-4)',letterSpacing:'0.08em',marginRight:4,alignSelf:'center'}}>NEEDS</span>
                      {p.needs.map(n => <Chip key={n} color="var(--m6)" light>{n}</Chip>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — agreement form for selected */}
            <aside>
              <div className="card" style={{padding:0, overflow:'hidden'}}>
                <div style={{
                  padding:'16px 20px', background:'color-mix(in srgb, var(--m6) 8%, var(--surface))',
                  borderBottom:'1px solid var(--rule)',
                }}>
                  <div className="mono" style={{fontSize:10,fontWeight:700,color:'var(--m6)',letterSpacing:'0.08em',marginBottom:4}}>PROPOSE YOUR SUPPORT FOR</div>
                  <h3 style={{margin:0,fontSize:16,fontWeight:700}}>Reed-bed greywater wetlands</h3>
                  <div className="row gap-2 mt-2 small">
                    <span>Project lead · <strong style={{color:'var(--ink-2)'}}>Ana Whitewater</strong></span>
                    <span>· Deadline <strong style={{color:'var(--ink-2)'}}>Jun 30</strong></span>
                  </div>
                </div>
                <div style={{padding:20}}>
                  <div className="field">
                    <label className="field-label">
                      What I'll contribute
                      <span className="field-hint">Be specific — time, skill, materials, money</span>
                    </label>
                    <textarea className="field-textarea" defaultValue={"Lead the trench-digging weekend (Jun 14-15) with my excavator and 2 helpers. Will provide all earthmoving + onsite supervision through the install. Estimated 28 hours of work."}/>
                  </div>
                  <div className="field">
                    <label className="field-label">What I expect in return</label>
                    <textarea className="field-textarea" defaultValue={"• 280 contribution points (Build category)\n• Lunch + camp space provided on site\n• First refusal on the 3-bed unit in Cluster B when residency opens"}/>
                  </div>
                  <div className="field">
                    <label className="field-label">Conditions / fine print</label>
                    <input className="field-input" placeholder="Anything that would change your mind…" defaultValue="Postpone if rain forecast > 60% — reschedule within 2 weeks."/>
                  </div>

                  <div className="row gap-3 mt-3" style={{alignItems:'flex-start', padding:'12px 14px', borderRadius:8, background:'var(--bg-2)'}}>
                    <span style={{fontSize:18, lineHeight:1}}>ℹ</span>
                    <div className="small" style={{lineHeight:1.55}}>
                      The project lead reviews proposals within 48 hours. If accepted, your agreement is logged
                      and feeds <strong style={{color:'var(--ink-2)'}}>Operations</strong> (deliverables) and{' '}
                      <strong style={{color:'var(--ink-2)'}}>Contributions</strong> (points) automatically.
                    </div>
                  </div>

                  <div className="row gap-2 mt-3" style={{justifyContent:'flex-end'}}>
                    <button className="btn btn-secondary btn-sm">Save as draft</button>
                    <button className="btn btn-primary btn-sm" style={{background:'var(--m6)'}}>Send proposal →</button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   M07 — Operations (active projects + deliverables monitor)
   ═════════════════════════════════════════════════════════════════════ */
function M07Operations() {
  return (
    <div className="app">
      <TopBar/>
      <SideNav active="07"/>
      <main className="main">
        <div className="page">
          <PageHead
            mod="07" label="Operations" color="var(--m7)"
            title="Sprint 12 · May → Jun"
            sub="5 active projects · 12 deliverables · 40% complete"
            actions={<>
              <button className="btn btn-secondary btn-sm">Timeline</button>
              <button className="btn btn-secondary btn-sm">Sprint review →</button>
              <button className="btn btn-primary btn-sm" style={{background:'var(--m7)'}}>+ Project</button>
            </>}
          />

          {/* Sprint stats */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:10, marginBottom:18}}>
            <div className="stat-card">
              <div className="label">Active</div><div className="value">5</div>
              <div className="delta">+1 this sprint</div>
            </div>
            <div className="stat-card">
              <div className="label">Deliverables</div><div className="value">12</div>
              <div className="delta">5 done · 7 to go</div>
            </div>
            <div className="stat-card">
              <div className="label">On track</div><div className="value" style={{color:'var(--m5)'}}>4</div>
              <div className="delta">across active projects</div>
            </div>
            <div className="stat-card">
              <div className="label">At risk</div><div className="value" style={{color:'#f59e0b'}}>1</div>
              <div className="delta" style={{color:'#f59e0b'}}>Soil tests slipping</div>
            </div>
            <div className="stat-card">
              <div className="label">Sprint days left</div><div className="value">11</div>
              <div className="delta">ends Jun 1</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <div className="tab active" style={{borderBottomColor:'var(--m7)'}}>Board</div>
            <div className="tab">Timeline</div>
            <div className="tab">Deliverables</div>
            <div className="tab">Updates</div>
          </div>

          {/* Kanban */}
          <div className="kanban">
            {[
              { name:'Backlog', count:3, color:'var(--ink-4)',
                items:[
                  { t:'Workshop space layout', who:'@eli', due:'Jul 8', m:'var(--m4)' },
                  { t:'Composting toilet design v2', who:'@ana', due:'Jul 14', m:'var(--m1)' },
                  { t:'Annual report draft', who:'@priya', due:'Aug 1', m:'var(--m9)' },
                ]},
              { name:'In progress', count:4, color:'var(--m7)',
                items:[
                  { t:'Greywater wetlands install', who:'@ana · 3 others', due:'Jun 30', m:'var(--m1)', prog:0.4 },
                  { t:'Funding circle round 2', who:'@diego', due:'Jul 15', m:'var(--m5)', prog:0.66 },
                  { t:'Founders\' agreement v3', who:'@priya', due:'Jun 12', m:'var(--m9)', prog:0.8 },
                  { t:'Soil remediation, Plot D', who:'@eli', due:'Aug 12', m:'var(--m4)', prog:0.2 },
                ]},
              { name:'Review', count:1, color:'#f59e0b',
                items:[
                  { t:'Soil tests at B, C, D', who:'@ana', due:'May 28', m:'var(--m1)', late:true },
                ]},
              { name:'Done', count:4, color:'var(--m5)',
                items:[
                  { t:'Greywater permit application', who:'@diego', due:'Jun 3', m:'var(--m5)' },
                  { t:'Welcome week dinners', who:'@priya', due:'May 5', m:'var(--m9)' },
                  { t:'Land survey complete', who:'@ana', due:'Apr 28', m:'var(--m1)' },
                  { t:'Funding circle round 1', who:'@diego', due:'May 18', m:'var(--m5)' },
                ]},
            ].map(col => (
              <div className="kanban-col" key={col.name}>
                <div className="kanban-col-head">
                  <div className="row gap-2 center">
                    <span style={{width:6, height:6, borderRadius:'50%', background:col.color}}/>
                    <span className="cn">{col.name}</span>
                  </div>
                  <span className="cc">{col.count}</span>
                </div>
                {col.items.map((it, i) => (
                  <div className="kanban-card" key={i} style={{borderLeft:`3px solid ${it.m}`}}>
                    <div className="kt">{it.t}</div>
                    {it.prog !== undefined && (
                      <div style={{marginBottom:6}}><Pbar value={it.prog*5} color={it.m}/></div>
                    )}
                    <div className="km">
                      <span className="kd">{it.who}</span>
                      <span className="kd" style={{color: it.late ? '#d44' : 'var(--ink-3)'}}>
                        {it.late && '⚠ '}{it.due}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   M08 — Contribution Tracking
   ═════════════════════════════════════════════════════════════════════ */
function M08Contributions() {
  const log = [
    { what:'Reed-bed trench day 1', cat:'Build',    hours:6, pts:120, when:'May 18', verifier:'@ana' },
    { what:'Hosted welcome call (4 explorers)', cat:'Welcome', hours:2, pts:40, when:'May 14', verifier:'@priya' },
    { what:'Soil-test help, Plot C', cat:'Care',     hours:1.5, pts:30, when:'May 11', verifier:'@eli' },
    { what:'Funding-circle pitch deck v2', cat:'Fund', hours:3, pts:60, when:'May 06', verifier:'@diego' },
    { what:'Welcome dinner — cooked + hosted', cat:'Welcome', hours:2.5, pts:50, when:'May 02', verifier:'@priya' },
    { what:'Notes for governance circle', cat:'Decide', hours:1, pts:20, when:'Apr 29', verifier:'@priya' },
    { what:'Soil tests, Plot B', cat:'Care', hours:2.5, pts:50, when:'Apr 25', verifier:'@ana' },
    { what:'Mended fence at NW boundary', cat:'Build', hours:2, pts:40, when:'Apr 20', verifier:'@eli' },
  ];
  const total = log.reduce((s,r)=>s+r.pts, 0);
  return (
    <div className="app">
      <TopBar/>
      <SideNav active="08"/>
      <main className="main">
        <div className="page">
          <PageHead
            mod="08" label="Contribution Tracking" color="var(--m8)"
            title="Your contributions"
            sub="Log your effort. The community sees it. Reputation that travels."
            actions={<>
              <button className="btn btn-secondary btn-sm">Leaderboard</button>
              <button className="btn btn-primary btn-sm" style={{background:'var(--m8)'}}>+ Log effort</button>
            </>}
          />

          {/* Points hero + badges */}
          <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:14, marginBottom:18}}>
            <div style={{
              background:`linear-gradient(135deg, color-mix(in srgb, var(--m8) 92%, #000), var(--m8))`,
              color:'#fff', borderRadius:14, padding:'22px 24px',
              position:'relative', overflow:'hidden',
            }}>
              <div style={{position:'absolute',right:-40,top:-40,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.08)'}}/>
              <div style={{position:'absolute',right:-90,bottom:-90,width:240,height:240,borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>
              <div className="row gap-4" style={{position:'relative'}}>
                <div>
                  <div style={{fontFamily:'var(--mono)', fontSize:48, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1}}>{total}</div>
                  <div className="mono" style={{fontSize:11, opacity:0.8, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600, marginTop:2}}>Points this sprint</div>
                </div>
                <div style={{flex:1, paddingLeft:8}}>
                  <div style={{fontSize:13, opacity:0.95, fontWeight:500, marginBottom:2}}>Rank · Top 25% · Sprint 12</div>
                  <div className="small" style={{color:'rgba(255,255,255,0.85)'}}>Next badge at 500 pts · Builder I</div>
                  <div style={{marginTop:10, height:6, background:'rgba(255,255,255,0.18)', borderRadius:999, overflow:'hidden'}}>
                    <div style={{width:`${(total/500)*100}%`, height:'100%', background:'#fff'}}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-pad">
              <div className="row between mb-3 center">
                <h4 style={{margin:0, fontSize:13, fontWeight:700}}>Badges</h4>
                <span className="mono small">3 of 9 earned</span>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:8}}>
                {[
                  { e:'🪨', name:'Builder', earned:true },
                  { e:'🤝', name:'Welcomer', earned:true },
                  { e:'💰', name:'Funder', earned:true },
                  { e:'🌿', name:'Land tender', earned:false },
                  { e:'⚖️', name:'Mediator', earned:false },
                  { e:'✦', name:'Founder', earned:false },
                ].map(b => (
                  <div key={b.name} className="col center" style={{gap:4}}>
                    <div style={{
                      width:42, height:42, borderRadius:'50%',
                      background: b.earned ? 'color-mix(in srgb, var(--m8) 14%, var(--surface))' : 'var(--bg-2)',
                      border:'1px solid ' + (b.earned ? 'color-mix(in srgb, var(--m8) 40%, var(--rule))' : 'var(--rule)'),
                      display:'grid', placeItems:'center', fontSize:18,
                      opacity: b.earned ? 1 : 0.4,
                    }}>{b.e}</div>
                    <span style={{fontSize:9.5, color: b.earned?'var(--ink-2)':'var(--ink-4)', fontWeight:600, textAlign:'center', lineHeight:1.2}}>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 280px', gap:16}}>
            {/* Log table */}
            <div className="card" style={{padding:0, overflow:'hidden'}}>
              <div className="row between" style={{padding:'14px 18px', borderBottom:'1px solid var(--rule)'}}>
                <h4 style={{margin:0, fontSize:13, fontWeight:700}}>Contribution log</h4>
                <div className="row gap-2">
                  <span className="chip" style={{background:'var(--ink)',color:'var(--bg)',borderColor:'var(--ink)'}}>This sprint</span>
                  <span className="chip">All time</span>
                </div>
              </div>
              <table className="tbl">
                <thead>
                  <tr><th>Effort</th><th>Category</th><th>Hours</th><th>Verifier</th><th>When</th><th style={{textAlign:'right'}}>Points</th></tr>
                </thead>
                <tbody>
                  {log.map((r,i) => (
                    <tr key={i}>
                      <td style={{color:'var(--ink)', fontWeight:500}}>{r.what}</td>
                      <td><Chip color={
                        r.cat==='Build'?'var(--m7)':r.cat==='Welcome'?'var(--m9)':r.cat==='Care'?'var(--m5)':r.cat==='Fund'?'var(--m6)':'var(--m4)'
                      } light>{r.cat}</Chip></td>
                      <td className="mono small" style={{color:'var(--ink-2)'}}>{r.hours}h</td>
                      <td className="mono small">{r.verifier}</td>
                      <td className="mono small">{r.when}</td>
                      <td className="mono" style={{textAlign:'right', fontWeight:700, color:'var(--m8)'}}>+{r.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="col gap-3">
              <div className="card card-pad">
                <div className="mono" style={{fontSize:10,fontWeight:700,color:'var(--ink-3)',letterSpacing:'0.08em',marginBottom:8}}>QUICK LOG</div>
                <div className="field">
                  <input className="field-input" placeholder="What did you do?" defaultValue="Reed-bed trench day 2"/>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                  <select className="field-input" defaultValue="Build">
                    <option>Build</option><option>Care</option><option>Decide</option>
                    <option>Welcome</option><option>Fund</option>
                  </select>
                  <input className="field-input" type="number" placeholder="Hours" defaultValue="5"/>
                </div>
                <button className="btn btn-primary mt-3" style={{background:'var(--m8)', width:'100%'}}>Log · earn 100 pts</button>
              </div>
              <div className="card card-pad" style={{background:'var(--bg-2)'}}>
                <div className="mono" style={{fontSize:10,fontWeight:700,color:'var(--ink-3)',letterSpacing:'0.08em',marginBottom:6}}>HOW POINTS WORK</div>
                <ul className="small" style={{margin:0, paddingLeft:18, lineHeight:1.65, color:'var(--ink-2)'}}>
                  <li>20 pts per hour of logged effort</li>
                  <li>Verified by another resident</li>
                  <li>Tracked per sprint + lifetime</li>
                  <li>Unlocks badges + governance weight</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   M09 — Governance (4 layers + proposal + vote)
   ═════════════════════════════════════════════════════════════════════ */
function M09Governance() {
  const layers = [
    { n:'01', name:'Consent (Sociocracy)', desc:'Everyday calls. Move forward if no principled objections.', mark:'☉', count:8 },
    { n:'02', name:'Democracy (Majority)', desc:'Big shared choices. Open vote, simple majority, public results.', mark:'☑', count:2 },
    { n:'03', name:'Meritocracy (Expert)', desc:'Technical calls go to the expert with skin in the game.', mark:'△', count:1 },
    { n:'04', name:'AI-mediated facilitation', desc:'When stalled, the community AI surfaces blockers + next moves.', mark:'◇', count:1 },
  ];
  return (
    <div className="app">
      <TopBar/>
      <SideNav active="09"/>
      <main className="main">
        <div className="page">
          <PageHead
            mod="09" label="Governance" color="var(--m9)"
            title="Decide together"
            sub="2 proposals open for your vote · Sprint 12 · 14 of 19 residents have weighed in"
            actions={<>
              <button className="btn btn-secondary btn-sm">Past decisions</button>
              <button className="btn btn-primary btn-sm" style={{background:'var(--m9)'}}>+ New proposal</button>
            </>}
          />

          {/* Layer picker */}
          <div className="row gap-2 mb-4" style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)'}}>
            {layers.map((l,i) => (
              <div key={l.n} className="card card-pad" style={{
                padding:'14px 16px',
                cursor:'pointer',
                borderColor: i===0 ? 'var(--m9)' : 'var(--rule)',
                boxShadow: i===0 ? '0 0 0 3px color-mix(in srgb, var(--m9) 12%, transparent)' : 'var(--shadow-sm)',
                position:'relative',
              }}>
                <span style={{position:'absolute',right:14,top:10,fontSize:22,opacity:0.15,fontWeight:700,fontFamily:'var(--mono)'}}>{l.mark}</span>
                <div className="mono" style={{fontSize:10,fontWeight:700,color:'var(--m9)',letterSpacing:'0.08em'}}>LAYER {l.n}</div>
                <div style={{fontSize:13.5, fontWeight:600, margin:'4px 0 4px'}}>{l.name}</div>
                <div className="small" style={{lineHeight:1.5}}>{l.desc}</div>
                <div className="row between center mt-3" style={{paddingTop:8, borderTop:'1px solid var(--rule-soft)'}}>
                  <span className="mono small">{l.count} open</span>
                  <span className="mono small" style={{color: i===0?'var(--m9)':'var(--ink-4)'}}>{i===0 ? 'Selected ●' : 'View'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Proposal list + detail */}
          <div style={{display:'grid', gridTemplateColumns:'320px 1fr', gap:16}}>
            <aside className="col gap-2">
              <div className="mono mb-2" style={{fontSize:10,fontWeight:700,color:'var(--ink-3)',letterSpacing:'0.08em', padding:'0 4px'}}>OPEN PROPOSALS · CONSENT</div>
              {[
                { t:'Approve $24k for wetland materials', meta:'@priya · 2d left · 14/19 voted', selected:true, dot:'var(--m5)' },
                { t:'Add Saturday work day, monthly', meta:'@ana · 5d left · 7/19 voted', dot:'var(--m4)' },
                { t:'Adopt sociocratic election cycle', meta:'@priya · 6d left · 4/19 voted', dot:'var(--m9)' },
                { t:'Change quiet hours to 22:00', meta:'@eli · 1w left · 2/19 voted', dot:'var(--ink-3)' },
              ].map((p,i) => (
                <div key={i} className="card" style={{
                  padding:'12px 14px',
                  borderColor: p.selected?'var(--m9)':'var(--rule)',
                  boxShadow: p.selected ? '0 0 0 3px color-mix(in srgb, var(--m9) 12%, transparent)' : 'var(--shadow-sm)',
                  cursor:'pointer',
                }}>
                  <div className="row gap-2 center mb-2"><StatusDot color={p.dot}/><span className="mono small" style={{color:'var(--ink-4)'}}>CONSENT</span></div>
                  <div style={{fontSize:13, fontWeight:600, lineHeight:1.4, marginBottom:4}}>{p.t}</div>
                  <div className="small mono">{p.meta}</div>
                </div>
              ))}
            </aside>

            <section className="card card-pad" style={{padding:24}}>
              <div className="row between mb-2">
                <div className="mono" style={{fontSize:11, fontWeight:700, color:'var(--m9)', letterSpacing:'0.08em'}}>
                  CONSENT · PROPOSAL #G-0042
                </div>
                <span className="pill mono" style={{background:'color-mix(in srgb, var(--m9) 12%, transparent)', color:'var(--m9)'}}>2 days left</span>
              </div>
              <h2 style={{margin:'0 0 6px', fontSize:22, fontWeight:700, letterSpacing:'-0.01em'}}>
                Approve $24,000 for reed-bed wetland materials
              </h2>
              <div className="small mb-3">
                Proposed by <strong style={{color:'var(--ink-2)'}}>Priya Mahesh</strong> · opened May 19 · 14 of 19 residents have voted
              </div>

              <p style={{fontSize:13.5, color:'var(--ink-2)', lineHeight:1.65, margin:'0 0 18px'}}>
                Buy gravel, geotextile, reeds, plumbing fittings, and rented excavator hours to build the
                Cluster A greywater wetland by Jun 30. Money draws from the funding-circle round-1 escrow.
                Materials suppliers confirmed; install crew confirmed via Module 06 agreements.
              </p>

              <div className="vote-track">
                <div className="vote-yes"      style={{flex: 14}}>14 consent</div>
                <div className="vote-concern"  style={{flex:  3}}>3 concern</div>
                <div className="vote-no"       style={{flex:  2}}>2 object</div>
              </div>
              <div className="row between mt-2 small mono" style={{color:'var(--ink-3)'}}>
                <span>14 / 19 voted</span>
                <span>74%</span>
                <span>Concerns logged · go on record</span>
              </div>

              {/* Your vote */}
              <div className="card card-pad mt-3" style={{background:'var(--bg-2)', borderStyle:'dashed'}}>
                <div className="mono" style={{fontSize:10,fontWeight:700,color:'var(--ink-3)',letterSpacing:'0.08em', marginBottom:8}}>YOUR VOTE</div>
                <div className="row gap-2" style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr'}}>
                  <button className="btn" style={{background:'var(--m9)', color:'#fff', justifyContent:'center'}}>✓ I consent</button>
                  <button className="btn btn-secondary" style={{justifyContent:'center'}}>⚠ I have a concern</button>
                  <button className="btn btn-secondary" style={{justifyContent:'center'}}>✗ I object</button>
                </div>
                <div className="small mt-3" style={{lineHeight:1.55}}>
                  <strong style={{color:'var(--ink-2)'}}>Concerns block nothing.</strong> They go on the record and trigger
                  a 24h check-in before final tally. The AI facilitator will summarize concerns to the proposer.
                </div>
              </div>

              {/* Comments */}
              <div className="mt-4">
                <div className="mono mb-2" style={{fontSize:10,fontWeight:700,color:'var(--ink-3)',letterSpacing:'0.08em'}}>DISCUSSION · 4</div>
                {[
                  { who:'Ana Whitewater', bg:'var(--m1)', when:'1d', txt:'Excavator quote came in $300 under budget. Trimming the contingency line.' },
                  { who:'Eli Tanaka',     bg:'var(--m4)', when:'2d', txt:'I want to consent but flagging: who maintains the wetland in year 1? Should be in the agreement.' },
                  { who:'Priya Mahesh',   bg:'var(--m9)', when:'2d', txt:'Good catch Eli — added a sub-agreement to M06 for maintenance. Pinging Ana to take it.' },
                ].map((c,i) => (
                  <div key={i} className="row gap-3 mt-3" style={{alignItems:'flex-start'}}>
                    <Avatar name={c.who} bg={c.bg} size={28}/>
                    <div className="grow" style={{background:'var(--bg-2)', borderRadius:8, padding:'8px 12px'}}>
                      <div className="row between center mb-2">
                        <span style={{fontSize:12, fontWeight:700}}>{c.who}</span>
                        <span className="mono small">{c.when} ago</span>
                      </div>
                      <p style={{margin:0, fontSize:12.5, color:'var(--ink-2)', lineHeight:1.55}}>{c.txt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { M06Agreements, M07Operations, M08Contributions, M09Governance });
