#!/usr/bin/env node
/**
 * Issue #58 World-owned acceptance checker. TESTS A STATIC DESIGN, NEVER GAMEPLAY.
 * Run from repo root: node src/maps/observation/g1b/validate-g1b.mjs
 * No npm packages or edits outside src/maps/ are required.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../..');
const read = path => readFileSync(resolve(here, path), 'utf8');
const closed = JSON.parse(read('./world-closed.v1.json'));
const opened = JSON.parse(read('./world-open.v1.json'));
const manifest = JSON.parse(read('./room.manifest.draft.json'));
const authored = JSON.parse(read('../../../content/levels/obs-w1-e01-inspect-library.json'));
const svg = Object.fromEntries(['background.svg','ground.svg','props-closed.svg','props-open.svg','foreground.svg','review-overlay.svg']
 .map(name => [name, readFileSync(join(repoRoot, 'public/assets/worlds/observation/g1b', name), 'utf8')]));
const problems = [], report = {};
const assert = (condition, message) => { if (!condition) problems.push(message); };
const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);
const isRectHit = (p, r, radius) => Math.hypot(p.x-Math.max(r.x,Math.min(r.x+r.width,p.x)),
 p.y-Math.max(r.y,Math.min(r.y+r.height,p.y))) < radius;
function blocked(world, p, radius = manifest.collisionAgentRadiusTestPx) {
 return p.x<radius || p.y<radius || p.x>world.widthPx-radius || p.y>world.heightPx-radius ||
  world.collisions.some(c => c.kind==='rect' ? isRectHit(p,c.rect,radius) : (()=>{
   // This room only exports rectangle colliders; unsupported extra kinds fail closed in this test.
   throw Error('Unreviewed collision type in G1b fixture: ' + c.kind);
  })());
}
/** Grid-4 BFS in *world pixels* with circle-footprint collision, not an Engine pathfinder. */
function shortestRoute(world,from,to,step=20) {
 const snap = p => ({x:Math.round(p.x/step)*step,y:Math.round(p.y/step)*step});
 const a=snap(from),b=snap(to),key=p=>p.x+','+p.y;
 if (blocked(world,a)||blocked(world,b)) return null;
 const visit=new Set([key(a)]), q=[[a,0]];let head=0;
 while(head<q.length) {
  const [cur,d]=q[head++];
  if(cur.x===b.x && cur.y===b.y)return d*step;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
   const next={x:cur.x+dx*step,y:cur.y+dy*step},k=key(next);
   if(visit.has(k)||blocked(world,next))continue;
   visit.add(k);q.push([next,d+1]);
  }
 }
 return null;
}
function directFootprintFree(world,a,b) {
 const length=dist(a,b),steps=Math.max(1,Math.ceil(length/4));
 for(let i=0;i<=steps;i++){
  const t=i/steps;
  if(blocked(world,{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}))return false;
 }
 return true;
}
function visibleRect(rect,svgText) {
 return svgText.includes('x="'+rect.x+'" y="'+rect.y+'" width="'+rect.width+'" height="'+rect.height+'"');
}
assert(manifest.compatibility.engineCompatibleForRuntime===false,'manifest must NOT claim real Engine integration');
assert(manifest.shortCut.guard.requiresDurableRouteUnlock===true,'guard must require durable save');
assert(manifest.shortCut.guard.requiresDistinctDiscoveredSourceIds===2,'two independent sources needed');
assert(manifest.shortCut.guard.requiresAuthoritativeAssessment.status==='PASSED','no unlock from partial/try_again');
for(const state of [closed,opened]){
 assert(state.schemaVersion===1,'WorldSpec schemaVersion mismatch');
 assert(state.id===authored.worldId,'world ID does not match authored E01 worldId');
 assert(state.widthPx===1280 && state.heightPx===900,'dimension change not reviewed');
 assert(Object.keys(state.layers).sort().join(',')==='background,foreground,ground,props','wrong layer keys');
 assert(state.nodes.length===5,'unexpected node count');
 assert(state.nodes.every(n=>n.radius>=43),'touch cue under ~48 CSS px at 360-wide FIT scaling');
 for(const n of state.nodes){
  assert(n.position.x>n.radius+15&&n.position.x<state.widthPx-n.radius-15 &&
         n.position.y>n.radius+15&&n.position.y<state.heightPx-n.radius-15,'node pad violates bounds '+n.id);
  assert(!blocked(state,n.position),'node inside collision '+n.id);
 }
 assert(!blocked(state,state.spawn),'spawn collides with obstacle');
 for(let i=0;i<state.nodes.length;i++)for(let j=i+1;j<state.nodes.length;j++){
  const a=state.nodes[i],b=state.nodes[j];
  assert(dist(a.position,b.position)>a.radius+b.radius+8,'interaction trigger overlap '+a.id+'/'+b.id);
 }
 for(const layer of Object.values(state.layers)){
  assert(layer.startsWith('assets/worlds/observation/g1b/'),'unapproved layer asset path '+layer);
  const filename=layer.split('/').at(-1);
  assert(svg[filename]?.includes('viewBox="0 0 1280 900"'),'missing or wrong-size SVG layer '+filename);
 }
}
assert(JSON.stringify(closed.nodes)===JSON.stringify(opened.nodes),'node mapping changes across gate state');
assert(JSON.stringify(closed.spawn)===JSON.stringify(opened.spawn),'spawn changes across gate state');
assert(new Set(closed.nodes.map(n=>n.id)).size===closed.nodes.length,'duplicate node IDs');
assert(new Set(closed.collisions.map(c=>c.id)).size===closed.collisions.length,'duplicate collider IDs');
const gateId=manifest.shortCut.beforeCollision;
const gate=closed.collisions.find(c=>c.id===gateId);
assert(!!gate && gate.kind==='rect','missing closed gate rectangle');
assert(!opened.collisions.some(c=>c.id===gateId),'opened gate must not collide');
assert(closed.collisions.length===opened.collisions.length+1,'unexpected collateral collision changes');
for(const c of closed.collisions.filter(c=>c.id!==gateId))
 assert(opened.collisions.some(o=>JSON.stringify(o)===JSON.stringify(c)),'static collider changed '+c.id);
for(const c of closed.collisions)
 assert(visibleRect(c.rect,svg['props-closed.svg']),'closed state collider without visual ownership '+c.id);
for(const c of opened.collisions)
 assert(visibleRect(c.rect,svg['props-open.svg']),'open state collider without visual ownership '+c.id);
assert(!visibleRect(gate.rect,svg['props-open.svg']),'open state still draws closed gate rectangle');
for(const source of manifest.physicalEvidence){
 const n=closed.nodes.find(x=>x.id===source.nodeId);
 assert(!!n && n.kind==='clue' && !n.challengeId,'receipt must be prop-only node requiring HQ contract '+source.nodeId);
 assert(authored.evidence.some(x=>x.id===source.evidenceId),'source evidence missing from canonical authored content '+source.evidenceId);
 assert(authored.options.some(x=>x.id===source.optionId),'source option missing from canonical authored content '+source.optionId);
 assert(svg['props-closed.svg'].includes('id="receipt-prop-'+source.recordNumber+'"'),'physical receipt prop not drawn '+source.recordNumber);
}
const expectedPairs=authored.validAnswerSets.map(set=>set.slice().sort().join('|')).sort();
const manifestPairs=manifest.shortCut.guard.validSourcePairs.map(pair=>pair.map(id=>{
 const source=manifest.physicalEvidence.find(x=>x.evidenceId===id);
 return source?.optionId ?? 'UNMAPPED:'+id;
}).sort().join('|')).sort();
assert(JSON.stringify(expectedPairs)===JSON.stringify(manifestPairs),'guard contradicts 3 equivalent authored E01 routes');
const link=closed.nodes.find(n=>n.id===manifest.linkChallengeNodeId);
assert(link?.challengeId===authored.id,'linked ChallengeSpec ID mismatch');
const beforeApproach=manifest.shortCut.southApproach,afterApproach=manifest.shortCut.northApproach;
const beforeLength=shortestRoute(closed,beforeApproach,afterApproach);
const afterLength=shortestRoute(opened,beforeApproach,afterApproach);
report.shortcut={beforeLengthPx:beforeLength,afterLengthPx:afterLength,beforeDirect:directFootprintFree(closed,beforeApproach,afterApproach),afterDirect:directFootprintFree(opened,beforeApproach,afterApproach)};
assert(beforeLength!==null,'gate locks whole map with no recovery detour');
assert(afterLength!==null,'short route remains unreachable after unlock');
assert(beforeLength>afterLength*2,'gate has no meaningful route-length reduction');
assert(report.shortcut.beforeDirect===false,'gate is not physically blocking straight route before');
assert(report.shortcut.afterDirect===true,'gate not physically opened in after state');
report.discovery=[];
for(const src of manifest.physicalEvidence) {
 const position=closed.nodes.find(n=>n.id===src.nodeId).position;
 const travel=shortestRoute(closed,closed.spawn,position);
 report.discovery.push({nodeId:src.nodeId,beforeTravelPx:travel});
 assert(travel!==null,'evidence unreachable before unlock '+src.nodeId);
 assert(directFootprintFree(closed,position,position),'receipt footpoint inside barrier '+src.nodeId);
}
const deskRoute=shortestRoute(closed,closed.spawn,link.position);
assert(deskRoute!==null,'link desk must be accessible before unlock');
const northBefore=shortestRoute(closed,closed.spawn,closed.nodes.find(n=>n.id==='w01-g1b-north-landing').position);
const northAfter=shortestRoute(opened,opened.spawn,opened.nodes.find(n=>n.id==='w01-g1b-north-landing').position);
assert(northBefore!==null && northAfter!==null,'one of two visible detours is not walkable');
assert(northAfter<northBefore,'gate opening does not improve access to north landing');
report.map={widthPx:closed.widthPx,heightPx:closed.heightPx,nodes:closed.nodes.length,discoveryProps:manifest.physicalEvidence.length,beforeColliders:closed.collisions.length,afterColliders:opened.collisions.length,spawnToDeskPx:deskRoute,spawnToNorthBeforePx:northBefore,spawnToNorthAfterPx:northAfter};
report.readability={nodeMinTouchDiameterCssPx:Math.min(...closed.nodes.map(n=>n.radius*2*360/640)),mobileCssWidth:360,worldLogicalWidth:640,desktopCssWidth:1280,
 warning:'Numerical scale hypothesis only; no actual screenshot, Android or screen-reader test.'};
assert(report.readability.nodeMinTouchDiameterCssPx>=48,'node interaction ring under mobile target diameter');
const output={status:problems.length?'FAIL':'PASS',scope:'STATIC GEOMETRY AND CONTENT REFERENTIAL INTEGRITY ONLY',baselineSha:manifest.baselineSha,report,problems};
console.log(JSON.stringify(output,null,2));
if(problems.length)process.exitCode=1;
