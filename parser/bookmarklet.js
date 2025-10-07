
var html = document.body.innerHTML;

      function highlight(w) {
        w = w.replace(/[>\s\"][a-zA-Z\,\.\:\u00A0]+[\s\"?!<]/g, function(x){
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
    i::before, i::after, b::before, b::after, span::before, span::after {
      content: ' ';
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

if (document.getElementById('highlighter_style')) {
  document.getElementById('highlighter_style').outerHTML = '';
}
document.body.innerHTML = style + highlight(highlight(html));
