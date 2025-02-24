let panorama;
// StreetViewPanoramaData of a panorama just outside the Google Sydney office.
let outsideGoogle;

// StreetViewPanoramaData for a custom panorama: the Google Sydney reception.
function getReceptionPanoramaData(isDmap, pname) {
  return {
    location: {
      pano: pname, // The ID for this custom panorama.
      description: "Google Sydney - Reception",
      latLng: new google.maps.LatLng(-33.86684, 151.19583),
    },
    links: [
      {
        heading: 195,
        description: "Exit",
        pano: outsideGoogle.location.pano,
      },
    ],
    copyright: "Imagery (c) 2010 Google",
    tiles: {
      tileSize: new google.maps.Size(2048, 1024),
      worldSize: new google.maps.Size(2048, 1024),
      centerHeading: 105,
      getTileUrl: function (pano, zoom, tileX, tileY) {
        if (!isDmap) {
        return (
          "https://freeali.se/panoramera/examples/basic/f0.jpg"
        );
        } else {
        return (
          "https://freeali.se/panoramera/examples/basic/f0_dmap.jpg"
        );
        }
      },
    },
  };
}

function initPanorama() {
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    { pano: outsideGoogle.location.pano },
  );
  // Register a provider for the custom panorama.
  panorama.registerPanoProvider((pano) => {
    if (pano === "reception") {
      return getReceptionPanoramaData(false, "reception");

    } else if (pano === "reception_dmap") {
      return getReceptionPanoramaData(true, "reception_dmap");
    }
    // @ts-ignore TODO fix typings
    return null;
  });
  // Add a link to our custom panorama from outside the Google Sydney office.
  panorama.addListener("links_changed", () => {
    if (panorama.getPano() === outsideGoogle.location.pano) {
      panorama.getLinks().push({
        description: "Google Sydney",
        heading: 25,
        pano: "reception",
      });
    }
  });
}

function initMap() {
  // Use the Street View service to find a pano ID on Pirrama Rd, outside the
  // Google office.
  new google.maps.StreetViewService()
    .getPanorama({ location: { lat: -33.867386, lng: 151.195767 } })
    .then(({ data }) => {
      outsideGoogle = data;
      initPanorama();
    });
}

window.initMap = initMap;


document.getElementById("toggle").addEventListener("click", toggleStreetView);


function toggleStreetView() {
  if (panorama.getPano() === outsideGoogle.location.pano) {
    //panorama.setPano("reception_dmap");
    panorama.setPano("reception");

  } else {
    panorama.setPano(outsideGoogle.location.pano);
  }
}


function ctx() {

  /*var imgData = document.getElementsByTagName('canvas')[0].getContext('2d').getImageData(0,0,document.getElementsByTagName('canvas')[0].width,document.getElementsByTagName('canvas')[0].height);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255-imgData.data[i];
    imgData.data[i+1] = 255-imgData.data[i+1];
    imgData.data[i+2] = 255-imgData.data[i+2];
    imgData.data[i+3] = 128;
  }

  document.getElementsByTagName('canvas')[0].getContext('2d').putImageData(imgData,0,0);*/


/*for (var i=1; i<document.getElementsByTagName('canvas').length; i++) {
  var gl = document.getElementsByTagName('canvas')[i].getContext('webgl2');
  
  const pixels = new Uint8Array(
    gl.drawingBufferWidth * gl.drawingBufferHeight * 4,
  );
  gl.readPixels(
  0,
  0,
  gl.drawingBufferWidth,
  gl.drawingBufferHeight,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  pixels,
  );
  console.log(pixels); // Uint8Array

  //alert(JSON.stringify(gl.ARRAY_BUFFER));
  //alert(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
}*/

}
