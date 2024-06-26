var ln = "sv"; //ja, el, it, fa, ar, iw(?), yi, fi(?), sv

addEventListener('load', function(e) {
  document.querySelector('#test').innerHTML = 'English-Georgian';
});

document.getElementById("in").addEventListener('change', function(e) {
  document.querySelector('#test').innerHTML = e.target.value;
  loadTranslation(e.target.value.replace(/\n/g, " "), ln, "en");
});
document.getElementById("sbmt").addEventListener('click', function(e) {
  try{ loadTest(); } catch(e) {alert(e);}
});


function loadTranslation(wrd, tl, sl) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(this.responseText)[0];
      console.log( this.responseText );
      if (tl == ln && sl == "en") {
        sl = ln;
        tl = "ka";
        var txt = "";
        for (var i=0; i<res.length; i++) {
          //console.log( res[i][0] );
          txt += res[i][0];
        }
        loadTranslation(txt, tl, sl);
      } else if (tl == "ka" && sl == ln) {
        sl = "ka";
        tl = ln;
        var txt = "";
        for (var i=0; i<res.length; i++) {
          //console.log( res[i][0] );
          txt += res[i][0];
        }
        document.querySelector('#test').innerHTML += "<p>" + txt + "</p>";
        loadTranslation(txt, tl, sl);
      } else if (tl == ln && sl == "ka") {
        sl = ln;
        tl = "en";
        var txt = "";
        for (var i=0; i<res.length; i++) {
          //console.log( res[i][0] );
          txt += res[i][0];
        }
        loadTranslation(txt, tl, sl);
      } else if (tl == "en" && sl == ln) {
        var txt = "";
        for (var i=0; i<res.length; i++) {
          //console.log( res[i][0] );
          txt += res[i][0];
        }
        document.querySelector('#test').innerHTML += "<p>" + txt + "</p>";
      }
    }
  };
  xhttp.open("GET", "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl="+sl+"&tl="+tl+"&q=" + encodeURIComponent(wrd), true);
  xhttp.send();
}


function loadTest() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = this.responseText;
      document.querySelector('#test').innerHTML = res;
    }
  };
  xhttp.open("GET", "https://www.google.com/search?igu=1&q=weather&authuser=0", true);
  xhttp.send();
}

//english -> * -> georgian
//georgian -> * -> english
//translate back also to check accuracy