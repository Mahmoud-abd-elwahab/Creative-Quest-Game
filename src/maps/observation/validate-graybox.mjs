#!/usr/bin/env node
/**
 * Design-stage validator for Observation graybox only.
 * NOT a production map contract and NOT a replacement for QA runtime tests.
 * Run from any working directory:
 *   node src/maps/observation/validate-graybox.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const graph = JSON.parse(readFileSync(join(directory, "traversal.draft.json"), "utf8"));
const geometry = JSON.parse(readFileSync(join(directory, "geometry.draft.json"), "utf8"));
const svg = readFileSync(resolve(directory, "../../../public/assets/worlds/observation/graybox-layer-proof.svg"), "utf8");
const failures = [];
function check(value, message) { if (!value) failures.push(message); }
function xy(key) { const point = geometry.nodePoints[key]; return point ? [point.x, point.y] : null; }
function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
function pointSegDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const denominator = dx * dx + dy * dy;
  const t = denominator ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / denominator)) : 0;
  return dist(p, [a[0] + t * dx, a[1] + t * dy]);
}
function cross(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
function properCross(a, b, c, d) {
  const x = cross(a, b, c), y = cross(a, b, d);
  const z = cross(c, d, a), w = cross(c, d, b);
  return (x * y < -1e-6 && z * w < -1e-6);
}
function segmentDist(a, b, c, d) {
  if (properCross(a, b, c, d)) return 0;
  return Math.min(pointSegDist(a, c, d), pointSegDist(b, c, d), pointSegDist(c, a, b), pointSegDist(d, a, b));
}
function insideObstacle(p, o) {
  if (o.type === "circle") return dist(p, [o.cx, o.cy]) < o.radius;
  if (o.type === "ellipse") return Math.pow((p[0] - o.cx) / o.rx, 2) + Math.pow((p[1] - o.cy) / o.ry, 2) < 1;
  throw Error("Unsupported debug collider type: " + o.type);
}
function shapeBoundary(o) {
  if (o.type === "circle") return Array.from({ length: 96 }, (_, i) => {
    const angle = 2 * Math.PI * i / 96;
    return [o.cx + Math.cos(angle) * o.radius, o.cy + Math.sin(angle) * o.radius];
  });
  if (o.type === "ellipse") return Array.from({ length: 128 }, (_, i) => {
    const angle = 2 * Math.PI * i / 128;
    return [o.cx + Math.cos(angle) * o.rx, o.cy + Math.sin(angle) * o.ry];
  });
  throw Error("Unsupported debug collider type: " + o.type);
}
function segmentObstacleDistance(a, b, o) {
  if (insideObstacle(a, o) || insideObstacle(b, o)) return 0;
  const points = shapeBoundary(o);
  return Math.min(...points.map((point, index) => segmentDist(a, b, point, points[(index + 1) % points.length])));
}
function pointObstacleDistance(point, o) {
  if (insideObstacle(point, o)) return 0;
  return Math.min(...shapeBoundary(o).map(vertex => dist(point, vertex)));
}

check(graph.status.includes("NOT ENGINE-LOADABLE"), "graph accidentally represented as production");
check(geometry.runtimeLoadable === false && geometry.coordinateContractApproved === false, "sketch cannot claim approved runtime coordinates");
const nodes = graph.topology.nodes;
const ids = nodes.map(node => node.id);
const edges = graph.topology.edges;
const idSet = new Set(ids);
check(ids.length === idSet.size, "duplicate node IDs");
check(ids.length === 15, "must contain 15 topology nodes");
check(nodes.filter(node => node.role === "encounter-slot").length === 9, "need exactly nine encounter slots");
check(idSet.has("spawn") && idSet.has("boss-entrance") && idSet.has("exit-portal"), "missing essential landmark");
check(ids.every(id => xy(id) !== null), "sketch position missing for node");
check(Object.keys(geometry.nodePoints).length === ids.length, "extra/missing sketch node positions");
const adjacency = new Map(ids.map(id => [id, []]));
const uniqueEdges = new Set();
for (const [a, b] of edges) {
  check(idSet.has(a) && idSet.has(b) && a !== b, "invalid graph edge " + a + "→" + b);
  const pair = [a, b].sort().join(":");
  check(!uniqueEdges.has(pair), "duplicate edge " + pair);
  uniqueEdges.add(pair);
  if (adjacency.has(a) && adjacency.has(b)) {
    adjacency.get(a).push(b);
    adjacency.get(b).push(a);
  }
}
const visited = new Set(["spawn"]), queue = ["spawn"];
while (queue.length) for (const adjacent of adjacency.get(queue.shift()) || []) {
  if (!visited.has(adjacent)) { visited.add(adjacent); queue.push(adjacent); }
}
check(visited.size === ids.length, "unreachable nodes " + ids.filter(id => !visited.has(id)).join(", "));
check(visited.has("boss-entrance") && visited.has("exit-portal"), "boss or portal unreachable");
const w = geometry.mapSketch.width, h = geometry.mapSketch.height;
const safeBorder = geometry.nodeHaloDebugRadius + geometry.mapSketch.edgeBuffer;
for (const id of ids) {
  const p = xy(id);
  if (!p) continue;
  check(p[0] >= safeBorder && p[0] <= w - safeBorder && p[1] >= safeBorder && p[1] <= h - safeBorder, "node near map edge " + id);
}
for (let i = 0; i < edges.length; i++) for (let j = i + 1; j < edges.length; j++) {
  const [a, b] = edges[i], [c, d] = edges[j];
  if ([a, b].some(id => id === c || id === d)) continue;
  check(!properCross(xy(a), xy(b), xy(c), xy(d)), "non-junction route crossing " + [a, b, c, d].join(","));
}
const proposedTrailClearance = geometry.walkableRoadSketch.paintedWidth / 2 + geometry.walkableRoadSketch.clearanceInsetProposal;
const requiredNodePad = geometry.nodeHaloDebugRadius + geometry.walkableRoadSketch.clearanceInsetProposal;
for (const o of geometry.collisionFootprints) {
  check(o.visualRef && o.blocks === true, "collision footprint lacks visible owner " + o.id);
  for (const [a, b] of edges) {
    const d = segmentObstacleDistance(xy(a), xy(b), o);
    check(d >= proposedTrailClearance, "trail overlaps visible blocker " + o.id + " near " + a + "/" + b + "; clearance=" + d.toFixed(1));
  }
  for (const id of ids) {
    const d = pointObstacleDistance(xy(id), o);
    check(d >= requiredNodePad, "interaction node pad too near " + o.id + "/" + id + "; clearance=" + d.toFixed(1));
  }
  if (o.type === "circle") {
    check(svg.includes('cx="' + o.cx + '" cy="' + o.cy + '" r="' + o.radius + '"'), "missing drawn collision circle " + o.id);
    check(svg.includes('cx="' + o.cx + '" cy="' + o.cy + '" rx="15"'), "tree blocker has no visible root " + o.id);
  } else if (o.type === "ellipse") {
    check(svg.includes('cx="' + o.cx + '" cy="' + o.cy + '" rx="' + o.rx + '" ry="' + o.ry + '"'), "missing lake obstruction " + o.id);
  }
}
for (const item of geometry.collisionTestSamples) {
  const blocked = geometry.collisionFootprints.some(o => insideObstacle([item.point.x, item.point.y], o));
  check(blocked === (item.expected === "blocked"), "failed collision fixture " + item.id);
}
for (const [a, b] of edges) {
  const u = xy(a), v = xy(b);
  check(svg.includes('x1="' + u[0] + '" y1="' + u[1] + '" x2="' + v[0] + '" y2="' + v[1] + '"'), "SVG route mismatch " + a + "→" + b);
}
for (const id of ["background", "ground", "props", "foreground", "collision-debug", "interactions-debug", "annotations"]) {
  check(svg.includes('id="' + id + '"'), "missing independent SVG layer " + id);
}
const result = { status: failures.length ? "FAIL" : "PASS", scope: "concept-only", graphNodes: ids.length, encounterSlots: nodes.filter(n => n.role === "encounter-slot").length, edges: edges.length, reachableNodes: visited.size, collisionFootprints: geometry.collisionFootprints.length, collisionSamples: geometry.collisionTestSamples.length, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
