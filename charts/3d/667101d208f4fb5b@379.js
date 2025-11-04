// https://observablehq.com/@nhogs/zdog-3d-force-directed-graph-on-a-sphere@379
function _1(md){return(
md`# Zdog 3D Force-Directed Graph on a sphere

## Using radius force code from https://observablehq.com/@fil/3d-graph-on-sphere

This network of character co-occurence in _Les Misérables_ is positioned by simulated forces using [d3-force-3d](https://github.com/vasturiano/d3-force-3d) and displayed using [Zdog](https://zzz.dog).`
)}

function _chart(data,d3d,forceRadius,DOM,width,height,d3,Zdog,color,invalidation)
{
  const links = data.links.map((d) => Object.create(d));
  const nodes = data.nodes.map((d) => Object.create(d));

  const simulation = d3d
    .forceSimulation(nodes, 3)
    .force("radius", forceRadius(nodes, 100))
    .force(
      "link",
      d3d.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3d.forceManyBody().strength(-100));

  let element = DOM.canvas(width, height);

  const svg = d3.select(element);

  let illo = new Zdog.Illustration({
    element,
    dragRotate: true,
    zoom: 2,
    // Reheat simulation on drag to trigger tick and update Zdog rendering
    onDragStart: () => simulation.alphaTarget(0.1).restart(),
    onDragEnd: () => simulation.alphaTarget(0)
  });

  svg.call(
    d3
      .zoom()
      .scaleExtent([0.1, 10])
      .on("zoom", () => {
        illo.scale.x = d3.event.transform.k;
        illo.scale.y = d3.event.transform.k;
        illo.scale.z = d3.event.transform.k;
        illo.updateRenderGraph();
      })
  );

  let nodeShapes = nodes.reduce((acc, n) => {
    const shape = new Zdog.Shape({
      addTo: illo,
      stroke: 10,
      translate: { x: n.x, y: n.y, z: n.z },
      color: color(n)
    });
    acc[n.id] = shape;
    return acc;
  }, {});

  let linkShapes = links.reduce((acc, l) => {
    const shape = new Zdog.Shape({
      addTo: illo,
      stroke: l.value / 3,
      path: [
        { x: l.source.x, y: l.source.y, z: l.source.z },
        { x: l.target.x, y: l.target.y, z: l.target.z }
      ],
      color: d3.color("rgba(153, 153, 153, 0.6)")
    });
    acc[l.source.id + "->" + l.target.id] = shape;
    return acc;
  }, {});

  simulation.on("tick", () => {
    let nodesCentroid = nodes.reduce(
      (acc, n) => {
        acc.x += n.x / nodes.length;
        acc.y += n.y / nodes.length;
        acc.z += n.z / nodes.length;
        return acc;
      },
      { x: 0, y: 0, z: 0 }
    );

    links.forEach((l) => {
      linkShapes[l.source.id + "->" + l.target.id].path = [
        {
          x: l.source.x - nodesCentroid.x,
          y: l.source.y - nodesCentroid.y,
          z: l.source.z - nodesCentroid.z
        },
        {
          x: l.target.x - nodesCentroid.x,
          y: l.target.y - nodesCentroid.y,
          z: l.target.z - nodesCentroid.z
        }
      ];
      linkShapes[l.source.id + "->" + l.target.id].updatePath();
    });

    nodes.forEach(
      (n) =>
        (nodeShapes[n.id].translate = {
          x: n.x - nodesCentroid.x,
          y: n.y - nodesCentroid.y,
          z: n.z - nodesCentroid.z
        })
    );

    illo.updateRenderGraph();
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}


function _data(d3){return(
d3.json("https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json")
)}

function _height(){return(
600
)}

function _color(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
  return (d) => scale(d.group);
}


function _d3(require){return(
require("d3@7.3.0")
)}

function _Zdog(require){return(
require("zdog@1.1.3")
)}

function _forceRadius(){return(
function forceRadius(nodes, R = 1) {
  return () => {
    for (const n of nodes) {
      const r = Math.hypot(n.x, n.y, n.z);
      const u = Math.pow(r ? Math.sqrt(R / r) : 1, 0.5);
      n.x *= u;
      n.y *= u;
      n.z *= u;
    }
  };
}
)}

function _d3d(require){return(
require("d3-force-3d@3.0.2")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("chart")).define("chart", ["data","d3d","forceRadius","DOM","width","height","d3","Zdog","color","invalidation"], _chart);
  main.variable(observer("data")).define("data", ["d3"], _data);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("Zdog")).define("Zdog", ["require"], _Zdog);
  main.variable(observer("forceRadius")).define("forceRadius", _forceRadius);
  main.variable(observer("d3d")).define("d3d", ["require"], _d3d);
  return main;
}
