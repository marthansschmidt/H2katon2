// Roof positions in the original 1024 × 1536 illustration, not real addresses.
export const MAP_BUILDINGS = [
  [40, 87], [294, 81], [348, 122], [419, 157], [487, 97],
  [634, 16], [783, 92], [819, 134], [926, 30], [954, 220],
  [14, 228], [178, 220], [522, 248], [595, 326], [684, 375], [848, 313],
  [350, 399], [399, 444], [461, 491], [528, 442], [744, 478], [815, 457],
  [17, 433], [78, 463], [65, 581], [183, 638],
  [581, 564], [664, 615], [728, 665], [803, 667],
  [280, 698], [234, 766], [312, 805], [350, 869],
  [477, 685], [461, 743], [493, 779], [665, 882], [761, 940],
  [429, 1004], [518, 985], [574, 1121], [647, 1121],
  [272, 1064], [333, 1115], [124, 1122], [43, 1228],
  [237, 1317], [333, 1393], [432, 1470], [545, 1374], [652, 1400],
] as const;

export interface MapMarkerPosition { x: number; y: number; anchorX: number; anchorY: number; building: number }
interface LayoutOptions { width: number; height: number; top: number; bottom: number; markerWidth: number; markerHeight: number; count: number }
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function layoutMapMarkers({ width, height, top, bottom, markerWidth, markerHeight, count }: LayoutOptions) {
  const scale = Math.max(width / 1024, height / 1536);
  // All three lighting variants share this geometry. Keep the central houses
  // in view when either the width or height is cropped on smaller screens.
  const focusY = .5;
  const focusX = .5;
  const offsetX = (width - 1024 * scale) * focusX;
  const offsetY = (height - 1536 * scale) * focusY;
  const inset = markerWidth / 2 + 8;
  const minY = top + markerHeight / 2 + 8;
  const maxY = bottom - markerHeight / 2 - 16;
  const candidates = MAP_BUILDINGS.map(([x, y], building) => {
    const anchorX = x * scale + offsetX;
    const anchorY = y * scale + offsetY;
    return { building, anchorX, anchorY, x: clamp(anchorX, inset, width - inset), y: clamp(anchorY - markerHeight / 2 - 7, minY, maxY) };
  }).filter(point => point.anchorX >= 8 && point.anchorX <= width - 8 && point.anchorY >= top + 8 && point.anchorY <= bottom - 8);
  const targets = [[.23, .18], [.77, .18], [.78, .61], [.46, .87], [.22, .65]];
  const labelCandidates = candidates.flatMap(point => [-1, -.5, -.125, 0, .125, .5, 1].flatMap(column => [0, -1].map(row => ({
    ...point,
    x: clamp(point.anchorX + column * (markerWidth + 10), inset, width - inset),
    y: clamp(point.anchorY - markerHeight / 2 - 7 + row * (markerHeight + 18), minY, maxY),
  })))).filter(point => point.y + markerHeight / 2 + 7 <= point.anchorY);
  const overlaps = (a: MapMarkerPosition, b: MapMarkerPosition) => Math.abs(a.x - b.x) < markerWidth + 10 && Math.abs(a.y - b.y) < markerHeight + 18;
  const result: MapMarkerPosition[] = [];
  const rankedCandidates = targets.map(([tx, ty]) => {
    const score = (point: MapMarkerPosition) => {
      const distance = Math.hypot(point.x - point.anchorX, point.y + markerHeight / 2 + 7 - point.anchorY);
      return distance * 4 + Math.hypot(point.x - width * tx, point.y - (minY + (maxY - minY) * ty));
    };
    return [...labelCandidates].sort((a, b) => score(a) - score(b));
  });
  let attempts = 0;
  function place(index: number): boolean {
    if (index === count) return true;
    if (++attempts > 2000) return false;
    for (const point of rankedCandidates[index]) {
      if (result.some(other => other.building === point.building || overlaps(point, other))) continue;
      result.push(point);
      if (place(index + 1)) return true;
      result.pop();
    }
    return false;
  }
  if (!place(0)) {
    // Keep every choice reachable if a very small viewport needs labels offset
    // from their roofs. The connecting lines still identify the buildings.
    result.length = 0;
    const columns = width >= markerWidth * count + 24 ? count : 2;
    const rows = Math.ceil(count / columns);
    for (let index = 0; index < count; index++) {
      const x = inset + (width - inset * 2) * (columns === 1 ? .5 : (index % columns) / (columns - 1));
      const y = minY + (maxY - minY) * (rows === 1 ? .5 : Math.floor(index / columns) / (rows - 1));
      const point = [...candidates].filter(candidate => !result.some(other => other.building === candidate.building))
        .sort((a, b) => Math.hypot(a.anchorX - x, a.anchorY - y) - Math.hypot(b.anchorX - x, b.anchorY - y))[0];
      if (point) result.push({ ...point, x, y });
    }
  }
  return { positions: result, focusX, focusY };
}
