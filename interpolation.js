// https://paulbourke.net/miscellaneous/interpolation/
function spline(p0, p1, p2, p3, t) {return p1 + 0.5*t*(p2-p0 + t*(2*p0-5*p1+4*p2-p3 + t*(3*(p1-p2)+p3-p0)));}
function lerp(y1, y2, mu) { return y1*(1-mu)+y2*mu; }