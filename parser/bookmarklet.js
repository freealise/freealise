
var ps = document.getElementsByTagName('p');
var divs = document.getElementsByTagName('div');

      /*var cl = 0;

      function highlightWords_(q) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '';

        var res = q.replace(/[>\s\"][a-zA-Z]+[\s.,?!:<]/g, function(x){
          var b = '';
          for (var i=0; i<parseInt(Math.random()*16); i++) {
            b += '0 0 0.67px,';
          }
          b = b.slice(0,-1);

          style.innerHTML += ".c"+cl+" { 
//display:inline-block;
//rotate:"+parseInt(Math.random()*22.5-11.25)+"deg;

letter-spacing:"+parseInt(Math.random()*4-2)+"px;

//text-shadow:"+b+";

//color:hsl("+parseInt(Math.random()*360)+",100%,10%);

//font-size:"+parseInt(32-Math.random()*16)+"px;

//opacity:"+(100-Math.random()*80)+"%;

//position:relative;
//top:"+parseInt(Math.random()*8-4)+"px; }";
          cl++;

          return x.slice(0,1)+"<span class='c"+cl+"'>"+x.slice(1,-1)+"</span>"+x.slice(-1);
        });

        return style.outerHTML + res;  
      }*/
      

      function highlight(w) {
        w = w.replace(/[>\s][a-zA-Z\,\:\;\"\']+[\s.?!<]/g, function(x){
          var b = '';
          var d = '';
          for (var i=0; i<parseInt(Math.random()*8)+1; i++) {
            b += '<span>';
            d += '</span>';
          }
          x = x.slice(0,1)+b+x.slice(1,-1)+d+x.slice(-1);
          
          /*var b = '';
          var d = '';
          for (var i=0; i<parseInt(Math.random()*8)+1; i++) {
            b += '<big>';
            d += '</big>';
          }
          x = x.slice(0,1)+b+x.slice(1,-1)+d+x.slice(-1);

          var b = '';
          var d = '';
          for (var i=0; i<parseInt(Math.random()*8)+1; i++) {
            b += '<u>';
            d += '</u>';
          }
          x = x.slice(0,1)+b+x.slice(1,-1)+d+x.slice(-1);

          var b = '';
          var d = '';
          for (var i=0; i<parseInt(Math.random()*8)+1; i++) {
            b += '<s>';
            d += '</s>';
          }
          x = x.slice(0,1)+b+x.slice(1,-1)+d+x.slice(-1);

          var b = '';
          var d = '';
          for (var i=0; i<parseInt(Math.random()*8)+1; i++) {
            b += '<b>';
            d += '</b>';
          }
          x = x.slice(0,1)+b+x.slice(1,-1)+d+x.slice(-1);

          var b = '';
          var d = '';
          for (var i=0; i<parseInt(Math.random()*8)+1; i++) {
            b += '<em>';
            d += '</em>';
          }
          x = x.slice(0,1)+b+x.slice(1,-1)+d+x.slice(-1);

          var b = '';
          var d = '';
          for (var i=0; i<parseInt(Math.random()*8)+1; i++) {
            b += '<strong>';
            d += '</strong>';
          }
          x = x.slice(0,1)+b+x.slice(1,-1)+d+x.slice(-1);
          */
          
          return x;
        });
        return w;
      }
        
var style = `<style id='highlighter_style'>
    span {
      opacity: 80%;
    }
    u {
      text-decoration: none;
      color: #ff0000;
      filter: hue-rotate(45deg);
    }
    s {
      text-decoration: none;
      position: relative;
      top: -0.0625em;
    }
    small {
      font-size: 80%;
    }
    big {
      font-style: normal;
      display: inline-block;
      rotate: 1deg;
    }
    em {
      font-style: normal;
      display: inline-block;
      rotate: -1deg;
    }
    strong {
      font-weight: normal;
      text-shadow: 0 0 0.5px;
    }
</style>`;

for (var i=0; i<ps.length; i++) {
  var txt = highlight(highlight(ps[i].innerHTML));
  ps[i].innerHTML = txt;
}

for (var i=0; i<divs.length; i++) {
  if (!divs[i].getElementsByTagName('div')[0] && !divs[i].getElementsByTagName('style')[0] && !divs[i].getElementsByTagName('script')[0] && !divs[i].getElementsByTagName('img')[0] && !divs[i].getElementsByTagName('p')[0]) {
    var txt = highlight(highlight(divs[i].innerHTML));
    divs[i].innerHTML = txt;
  }
}

document.body.innerHTML = style + document.body.innerHTML;
