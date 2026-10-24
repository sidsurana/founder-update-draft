const assert=require('node:assert/strict'),D=require('./model.js');
let n=0;function test(name,fn){fn();console.log('PASS',name);n++}
test('nested cohort conversion uses explicit denominators',()=>{const r=D.calculate();assert.equal(r.rate,8/24);assert.equal(r.winRate,2/8);assert.equal(r.gap,2)});
test('zero denominator stays unknown',()=>{const r=D.calculate({meetings:0,evaluations:0,wins:0});assert.equal(r.rate,null);assert.equal(r.winRate,null);assert.equal(r.gap,null);assert.match(D.memo(r),/No denominator/)});
test('invalid nested counts block approval',()=>{const r=D.calculate({meetings:2,evaluations:4});assert.equal(r.errors.length,1);assert.equal(D.canPublish(r,true),false)});
test('pipeline bookings and duplicate opportunity IDs remain separate',()=>{const r=D.calculate({},D.initialDeployments,[...D.opportunities,D.opportunities[0]]);assert.equal(r.pipeline,1080000);assert.equal(r.bookings,120000);assert.equal(r.opps.length,6)});
test('stale and missing baselines are flagged without imputation',()=>{const r=D.calculate();assert.deepEqual(r.stale.map(o=>o.id),['OP-102','OP-104']);assert.equal(r.missing[0].id,'DP-02');assert.equal(r.missing[0].baseline,null)});
test('freshness threshold changes the risk queue',()=>assert.equal(D.calculate({staleDays:30}).stale.length,0));
test('capacity scenarios change recommendations',()=>{assert.match(D.calculate({capacity:10}).plan,/Escalate/);assert.match(D.calculate({capacity:30}).plan,/narrow/);assert.match(D.calculate({capacity:60}).plan,/Run both/)});
test('completed handoffs clear overdue and blocked flags',()=>{const d=D.initialDeployments.map(x=>({...x,status:'Complete'}));const r=D.calculate({},d);assert.equal(r.blocked.length,0);assert.equal(r.overdue.length,0);assert.equal(r.required,0)});
test('every OKR carries owner baseline target date and evidence',()=>{for(const o of D.calculate().okrs){assert.ok(o.owner);assert.ok('baseline'in o);assert.ok('target'in o);assert.match(o.due,/2026-/);assert.ok(o.source)}});
test('headlines trace to source and calculated memo values',()=>{const r=D.calculate({capacity:30});const m=D.memo(r);assert.match(m,/33.3%.*8\/24/);assert.match(m,/\$1,080,000/);assert.match(m,/30 available hours minus 24 recovery hours minus 16 growth hours = -10/);assert.match(m,/Cohort C-01/)});
test('human review required before reviewed pack',()=>{const r=D.calculate();assert.equal(D.canPublish(r,false),false);assert.equal(D.canPublish(r,true),true);assert.match(D.memo(r,false),/DRAFT/);assert.match(D.memo(r,true),/HUMAN-REVIEWED/)});
console.log(n+' model checks passed');
