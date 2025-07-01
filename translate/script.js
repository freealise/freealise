var ln = "sv"; //ja, el, it, fa, ar, iw(?), yi, fi(?), sv
var j, k;
var sentences, words, letters, txt;

addEventListener('load', function(e) {
  document.querySelector('#test').innerHTML = 'English-Georgian';
});

document.getElementById("in").addEventListener('change', function(e) {
  document.querySelector('#test').innerHTML = e.target.value;
  sentences = e.target.value.replace(/\n\n/g, " •").replace(/\n/g, "; ").replace(/(\. |\! |\? )/g, function(x){
    return x + '•';
  }).split(" •");
  k = 0;
  loadTranslation(sentences[k], ln, "en");
});
document.getElementById("sbmt").addEventListener('click', function(e) {
  try{ loadTest(); } catch(e) {alert(e);}
});

var translit = {
    ' ': ' ',
    
    'ი': 'i',
    'ე': 'e',
    'ა': 'a',
    'ო': 'o',
    'უ': 'u',

    'პ': 'pʼ',
    'ფ': 'pʰ',
    'ბ': 'b',
    'ვ': 'v',
    'მ': 'm',

    'ტ': 'tʼ',
    'თ': 'tʰ',
    'დ': 'd',
    'ნ': 'n',
    'ს': 's',
    'ზ': 'z',
    'წ': 'tsʼ',
    'ც': 'tsʰ',
    'ძ': 'dz',
    'ჯ': 'dʒ',
    'ჩ': 'tʃʰ',
    'ჭ': 'tʃʼ',
    'შ': 'ʃ',
    'ჟ': 'ʒ',
    'რ': 'r',
    'ლ': 'l',

    'კ': 'kʼ',
    'ქ': 'kʰ',
    'გ': 'g',
    'ღ': 'ɣ',
    'ხ': 'x',

    'ყ': 'q’',
    'ჰ': 'h',
  };
  

function getWords(wrd, tl, sl) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      
      alert( this.responseText.split('"content-summary">')[1].split('<strong>')[1].split("</p>")[0].split("</strong>")[0].replace(/,/g, '\n') );
      
    }
  };
  xhttp.open("GET", "https://script.google.com/macros/s/AKfycbz5br4wnfSGtucWKwGQq1Tb07eshJez6uVaFatn4xJAc_rcrcA/exec?a=proxy&q=https://glosbe.com/"+sl+"/"+tl+"/" + encodeURIComponent(wrd), true);
  xhttp.send();
}
try{getWords("და", "en", "ka");}catch(e){alert(e);}
  
function getWord(wrd, tl, sl) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(this.responseText)[0];
      alert( this.responseText );
      
      var wrd = "";
      for (var i=0; i<res.length; i++) {
        //console.log( res[i][0] );
        wrd += res[i][0];
      }
      words[j] = wrd.toLowerCase().replace(/\s/g, '·');
      
      if (j<words.length-1) {
        j++;
        getWord(words[j], 'en', 'ka');
      } else {
        document.querySelector('#test').innerHTML += "<p>" + sentences[k] + "<br/><ruby> " + txt + " <rt> " + words.join(' • ') + " <br/> " + letters.join('') + " </rt></ruby></p>";
        loadTranslation(txt, ln, 'ka');
      }
    }
  };
  xhttp.open("GET", "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl="+sl+"&tl="+tl+"&q=" + encodeURIComponent(wrd), true);
  xhttp.send();
}


function loadTranslation(wrd, tl, sl) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(this.responseText)[0];
      console.log( this.responseText );
      
      txt = "";
      for (var i=0; i<res.length; i++) {
        //console.log( res[i][0] );
        txt += res[i][0];
      }
      
      if (tl == ln && sl == "en") {
        sl = ln;
        tl = "ka";
        loadTranslation(txt, tl, sl);
      } else if (tl == "ka" && sl == ln) {
        sl = "ka";
        tl = ln;
        letters = txt.split('');
        for (var i=0; i<letters.length; i++) {
          if (translit[letters[i]] && translit[letters[i]].length > 0) {
            letters[i] = translit[letters[i]];
          }
        }
        words = txt.replace(/./g, function(x){
          if (translit[x] && translit[x].length > 0) {
            return x;
          } else {
            return '';
          }
        }).trim().split(' ');
        j=0;
        getWord(words[j], 'en', 'ka');
        
      } else if (tl == ln && sl == "ka") {
        sl = ln;
        tl = "en";
        loadTranslation(txt, tl, sl);
      } else if (tl == "en" && sl == ln) {
        document.querySelector('#test').innerHTML += "<p>" + txt + "</p>";
        if (k<sentences.length-1) {
          k++;
          loadTranslation(sentences[k], ln, "en");
        }
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

// https://www.bing.com/translator ?

