function centripetalCatmullRomSpline(p0, p1, p2, p3, t) {
  const d0 = distance(p0, p1);
  const d1 = distance(p1, p2);
  const d2 = distance(p2, p3);
  const tParam = (Math.sqrt(d0) + Math.sqrt(d1)) ** 2 / (Math.sqrt(d0) + Math.sqrt(d1) + Math.sqrt(d2)) ** 2;
  return p1 + 0.5 * tParam * (p2 - p0 + tParam * (2 * p0 - 5 * p1 + 4 * p2 - p3 + tParam * (3 * (p1 - p2) + p3 - p0)));
}
function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

// https://paulbourke.net/miscellaneous/interpolation/
function uniform_catmull_rom_spline(p0, p1, p2, p3, t) {return p1 + 0.5*t*(p2-p0 + t*(2*p0-5*p1+4*p2-p3 + t*(3*(p1-p2)+p3-p0)));}
function lerp(y1, y2, mu) { return y1*(1-mu)+y2*mu; }

/*
lerp, smooth by moving average, lerp the difference from original points, add it to result
*/