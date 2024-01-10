const webIconId = 'web_icon_path'
const webIconSvgString = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="92px" height="92px" viewBox="0 0 92 92" enable-background="new 0 0 92 92" xml:space="preserve">
<path id="web_icon_path" d="M46,0C20.6,0,0,20.6,0,46s20.6,46,46,46s46-20.6,46-46S71.4,0,46,0z M49.7,83.8c-0.2,0-0.4,0-0.7,0.1V62.2
	c5.2-0.1,9.9-0.2,14.2-0.5C59.4,73.4,52.3,81.2,49.7,83.8z M42.3,83.8c-2.7-2.7-9.7-10.5-13.5-22.1c4.2,0.3,9,0.5,14.2,0.5v21.7
	C42.8,83.9,42.6,83.8,42.3,83.8z M8,46c0-2.5,0.3-5,0.7-7.4c2.2-0.4,6.4-1,12.3-1.6c-0.5,2.9-0.8,5.9-0.8,9.1c0,3.2,0.3,6.2,0.7,9
	c-5.8-0.6-10.1-1.2-12.3-1.6C8.3,51,8,48.5,8,46z M26.3,46c0-3.4,0.4-6.6,1-9.6c4.6-0.3,9.8-0.6,15.7-0.6v20.4
	c-5.8-0.1-11.1-0.3-15.8-0.7C26.7,52.6,26.3,49.4,26.3,46z M49.6,8.2c2.7,2.7,9.6,10.7,13.5,22.1c-4.2-0.3-8.9-0.5-14.1-0.5V8.1
	C49.2,8.1,49.4,8.2,49.6,8.2z M43,8.1v21.7c-5.2,0.1-9.9,0.2-14.1,0.5c3.8-11.4,10.8-19.4,13.4-22.1C42.6,8.2,42.8,8.1,43,8.1z
	 M49,56.2V35.8c5.8,0.1,11.1,0.3,15.7,0.6c0.6,3,1,6.2,1,9.6c0,3.4-0.3,6.6-0.9,9.6C60.2,55.9,54.9,56.1,49,56.2z M70.9,37
	c5.9,0.6,10.1,1.2,12.3,1.6C83.7,41,84,43.5,84,46c0,2.5-0.3,5-0.7,7.4c-2.2,0.4-6.4,1-12.3,1.6c0.5-2.9,0.7-5.9,0.7-9.1
	C71.7,42.9,71.4,39.8,70.9,37z M81.4,32.2c-2.8-0.4-6.8-0.9-11.9-1.4c-2.4-8.6-6.6-15.5-10.1-20.4C69.5,14.2,77.5,22.2,81.4,32.2z
	 M32.6,10.4c-3.6,4.8-7.7,11.7-10.1,20.3c-5,0.4-9,1-11.9,1.4C14.5,22.2,22.6,14.2,32.6,10.4z M10.6,59.8c2.8,0.4,6.8,0.9,11.8,1.4
	c2.4,8.6,6.4,15.5,10,20.3C22.4,77.6,14.5,69.7,10.6,59.8z M59.6,81.5c3.6-4.8,7.6-11.6,10-20.2c5-0.4,9-1,11.8-1.4
	C77.5,69.7,69.6,77.6,59.6,81.5z"/>
</svg>
`
const points = generatePolygonCoordinates(webIconSvgString, webIconId)
/* look at the dimensions of the svg, we need to subtract 92 * 0.5 (half width and half height) from both the x & z coordinate values to get the resulting polygon points centered on the origin (0,0). */
const svgCx = 92 * 0.5
const svgCz = 92 * 0.5
const linePoints = points.map(([x, z]) => {
     return new BABYLON.Vector3(x - (svgCx), 0, z - (svgCz))
 })
const line = line2D('line', { path: linePoints, width: 7, closed: true }, scene)

function line2D (name, options, scene) {
    //Arrays for vertex positions and indices
    var positions = [];
    var indices = [];
    var normals = [];

    var width = options.width / 2 || 0.5;
    var path = options.path;
    var closed = options.closed || false;
    if(options.standardUV === undefined) {
        standardUV = true;
    }
    else {
        standardUV = options.standardUV;
    }

    var interiorIndex;
    
    //Arrays to hold wall corner data 
    var innerBaseCorners = [];
    var outerBaseCorners = [];
    
    var outerData = [];
    var innerData = [];
    var angle = 0;
    
    var nbPoints = path.length;
    var line = BABYLON.Vector3.Zero();
    var nextLine = BABYLON.Vector3.Zero();
    path[1].subtractToRef(path[0], line);

    if(nbPoints > 2 && closed) {	
        path[2].subtractToRef(path[1], nextLine);    
        for(var p = 0; p < nbPoints; p++) {    
            angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));            
            direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;                
            lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
            line.normalize();
            innerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
            outerData[(p + 1) % nbPoints] = path[(p + 1) % nbPoints].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));        
            line = nextLine.clone();        
            path[(p + 3) % nbPoints].subtractToRef(path[(p + 2) % nbPoints], nextLine);    
        }
    }
    else {
        lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
        line.normalize();		
        innerData[0] = path[0].subtract(lineNormal.scale(width));
        outerData[0] = path[0].add(lineNormal.scale(width));
    
        for(var p = 0; p < nbPoints - 2; p++) {	
            path[p + 2].subtractToRef(path[p + 1], nextLine);
            angle = Math.PI - Math.acos(BABYLON.Vector3.Dot(line, nextLine)/(line.length() * nextLine.length()));			
            direction = BABYLON.Vector3.Cross(line, nextLine).normalize().z;			
            lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
            line.normalize();
            innerData[p + 1] = path[p + 1].subtract(lineNormal.scale(width)).subtract(line.scale(direction * width/Math.tan(angle/2)));
            outerData[p + 1] = path[p + 1].add(lineNormal.scale(width)).add(line.scale(direction * width/Math.tan(angle/2)));		
            line = nextLine.clone();			
        }
        if(nbPoints > 2) {
            path[nbPoints - 1].subtractToRef(path[nbPoints - 2], line);
            lineNormal = new BABYLON.Vector3(line.y, -1 * line.x, 0).normalize();
            line.normalize();		
            innerData[nbPoints - 1] = path[nbPoints - 1].subtract(lineNormal.scale(width));
            outerData[nbPoints - 1] = path[nbPoints - 1].add(lineNormal.scale(width));
        }
        else{
            innerData[1] = path[1].subtract(lineNormal.scale(width));
            outerData[1] = path[1].add(lineNormal.scale(width));
        }
    }
    
    var maxX = Number.MIN_VALUE;
    var minX = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE;
    
    for(var p = 0; p < nbPoints; p++) {
        positions.push(innerData[p].x, innerData[p].y, innerData[p].z);
        maxX = Math.max(innerData[p].x, maxX);
        minX = Math.min(innerData[p].x, minX);
        maxY = Math.max(innerData[p].y, maxY);
        minY = Math.min(innerData[p].y, minY);
    }

    for(var p = 0; p < nbPoints; p++) {
        positions.push(outerData[p].x, outerData[p].y, outerData[p].z);
        maxX = Math.max(innerData[p].x, maxX);
        minX = Math.min(innerData[p].x, minX);
        maxY = Math.max(innerData[p].y, maxY);
        minY = Math.min(innerData[p].y, minY);
    }

    for(var i = 0; i < nbPoints - 1; i++) {
        indices.push(i, i + 1, nbPoints + i + 1);
        indices.push(i, nbPoints + i + 1, nbPoints + i)
    }
    
    if(nbPoints > 2 && closed) {
        indices.push(nbPoints - 1, 0, nbPoints);
        indices.push(nbPoints - 1, nbPoints, 2 * nbPoints - 1)
    }

    var normals = [];
    var uvs =[];

    if(standardUV) {
        for(var p = 0; p < positions.length; p += 3) {
            uvs.push((positions[p] - minX)/(maxX - minX), (positions[p + 1] - minY)/(maxY - minY))
        }
    }
    else {
        var flip = 0;
        var p1 = 0;
        var p2 = 0;
        var p3 = 0;
        var v0 = innerData[0];
        var v1 = innerData[1].subtract(v0);
        var v2 = outerData[0].subtract(v0);
        var v3 = outerData[1].subtract(v0);
        var axis = v1.clone();
        axis.normalize();

        p1 = BABYLON.Vector3.Dot(axis,v1);
        p2 = BABYLON.Vector3.Dot(axis,v2);
        p3 = BABYLON.Vector3.Dot(axis,v3);
        var minX = Math.min(0, p1, p2, p3);
        var maxX = Math.max(0, p1, p2, p3);
        
        uvs[2 * indices[0]] = -minX/(maxX - minX);
        uvs[2 * indices[0] + 1] = 1;
        uvs[2 * indices[5]] = (p2 - minX)/(maxX - minX);
        uvs[2 * indices[5] + 1] = 0;
        
        uvs[2 * indices[1]] = (p1 - minX)/(maxX - minX);
        uvs[2 * indices[1] + 1] = 1;
        uvs[2 * indices[4]] = (p3 - minX)/(maxX - minX);
        uvs[2 * indices[4] + 1] = 0;
    
        for(var i = 6; i < indices.length; i +=6) {
        
            flip = (flip + 1) % 2;
            v0 = innerData[0];
            v1 = innerData[1].subtract(v0);
            v2 = outerData[0].subtract(v0);
            v3 = outerData[1].subtract(v0);
            axis = v1.clone();
            axis.normalize();

            p1 = BABYLON.Vector3.Dot(axis,v1);
            p2 = BABYLON.Vector3.Dot(axis,v2);
            p3 = BABYLON.Vector3.Dot(axis,v3);
            var minX = Math.min(0, p1, p2, p3);
            var maxX = Math.max(0, p1, p2, p3);
        
            uvs[2 * indices[i + 1]] = flip + Math.cos(flip * Math.PI) * (p1 - minX)/(maxX - minX);
            uvs[2 * indices[i + 1] + 1] = 1;
            uvs[2 * indices[i + 4]] = flip + Math.cos(flip * Math.PI) * (p3 - minX)/(maxX - minX);
            uvs[2 * indices[i + 4] + 1] = 0;
        }
    }
    
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
    BABYLON.VertexData._ComputeSides(BABYLON.Mesh.DOUBLESIDE, positions, indices, normals, uvs);  	
    console.log(uvs)		
    //Create a custom mesh  
    var customMesh = new BABYLON.Mesh("custom", scene);

    //Create a vertexData object
    var vertexData = new BABYLON.VertexData();

    //Assign positions and indices to vertexData
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    //Apply vertexData to custom mesh
    vertexData.applyToMesh(customMesh);
    
    return customMesh;
    
}

/* SVG HELPER METHODS */

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
    document.body.appendChild(div)
  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

function readPolygonCoordinates (svgPathId)  {
    const path = document.getElementById(svgPathId)
    
    const len = path.getTotalLength()
    const points = []

    for (var i=0; i < len ; i++) {
        var pt = path.getPointAtLength(i * len / (len-1))
        points.push([pt.x, pt.y]);
    }

	// console.log("points = ", points)
    return points
}

/* Get SVG path coordinates */
function generatePolygonCoordinates (svgString, svgPathId)  {
    const _svg = createElementFromHTML(svgString)
    // console.log(_svg)
    const points = readPolygonCoordinates(svgPathId)
    return points
}