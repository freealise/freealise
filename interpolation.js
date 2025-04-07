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

// lerp, smooth by moving average, lerp the difference from original points, add it to result  

           try {
				var w = 3;
				var corner = 0.25;
				var items = paper.project.getItems({ class: 'Group' });
				var paths = items[items.length-1].getItems({ class: 'Path' });
				for (var i=0; i<paths.length; i++) {
					var diffs = [];
					var corners = [];
					for (var j=0; j<paths[i].segments.length; j++) {
						var x = 0;
					 var y = 0;
						for (var k=j-parseInt(w/2); k<=j+parseInt(w/2); k++) {
							if (k>=0 && k<paths[i].segments.length) {
								x += paths[i].segments[k].point.x;
								y += paths[i].segments[k].point.y;
							} else if (k<0) {
								x += paths[i].segments[paths[i].segments.length+k].point.x;
								y += paths[i].segments[paths[i].segments.length+k].point.y;
							} else if (k>=paths[i].segments.length) {
								x += paths[i].segments[k-paths[i].segments.length].point.x;
								y += paths[i].segments[k-paths[i].segments.length].point.y;
							}
						}
						diffs[j] = Math.sqrt( Math.pow((paths[i].segments[j].point.x - x/w), 2) + Math.pow((paths[i].segments[j].point.y - y/w), 2) );;
						if (diffs[j] >= Math.sqrt(2)*corner) {
							corners[j] = true;
						} else if (diffs[j] >= corner) {
							corners[j] = null;
							paths[i].segments[j].point.x = x/w;
						 paths[i].segments[j].point.y = y/w;
						} else {
							corners[j] = false;
							paths[i].segments[j].point.x = x/w;
						 paths[i].segments[j].point.y = y/w;
						}
					}
					var j=0;
					while (paths[i].segments[j]) {
						if (corners[j] === false) {
							paths[i].segments.splice(j,1);
							diffs.splice(j,1);
							corners.splice(j,1);
						} else if (corners[j] === true) {
							paths[i].segments[j].clearHandles();
							j++;
						} else {
							j++;
						}
					}
				}
			} catch(e) {alert(e);}