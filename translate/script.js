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
    "א": "ʔ",  // Alef
    "ב": "v",  // Bet
    "ג": "g",  // Gimel
    "ד": "d",  // Dalet
    "ה": "h",  // He
    "ו": "v",  // Vav
    "ז": "z",  // Zayin
    "ח": "x",  // Het
    "ט": "t",  // Tet
    "י": "j",  // Yod
    "ך": "x",  // Haf sofit
    "כ": "x",  // Haf
    "ל": "l",  // Lamed
    "ם": "m",  // Mem Sofit
    "מ": "m",  // Mem
    "ן": "n",  // Nun Sofit
    "נ": "n",  // Nun
    "ס": "s",  // Samekh
    "ע": "ʔ",  // Ayin, only voweled
    "פ": "f",  // Fey
    "ף": "f",  // Fey Sofit
    "ץ": "ts",  // Tsadik sofit
    "צ": "ts",  // Tsadik
    "ק": "k",  // Kuf
    "ר": "r",  // Resh
    "ש": "ʃ",  // Shin
    "ת": "t",  // Taf
    // Beged Kefet
    "בּ": "b",
    "כּ": "k",
    "פּ": "p",
    // Shin Sin
    "שׁ": "ʃ",
    "שׂ": "s",
    "'": "",
    
    "\u05b4": "i",  // Hiriq
    "\u05b1": "e",  // Hataf segol
    "\u05b5": "e",  // Tsere
    "\u05b6": "e",  // Segol
    "\u05b2": "a",  // Hataf Patah
    "\u05b7": "a",  // Patah
    "\u05c7": "o",  // Kamatz katan
    "\u05b9": "o",  // Holam
    "\u05ba": "o",  // Holam haser for vav
    "\u05bb": "u",  // Qubuts
    "\u05b3": "o",  // Hataf qamats
    "\u05b8": "a",  // Kamataz
    /*HATAMA_DIACRITIC: STRESS_PHONEME,  // Stress (Hat'ama)
    VOCAL_SHVA_DIACRITIC: "e",  // Vocal Shva*/
}

/*var translit = {
    ' ': ' ',
    
    'ი': 'i', //(ini) - /i/ (like 'ee' in "feet")
    'ე': 'e', //(eni) - /ɛ/ (like 'e' in "let")
    'ა': 'a', //(ani) - /ɑ/ (like 'a' in "father")
    'ო': 'o', //(oni) - /ɔ/ (like 'o' in "story" or "more")
    'უ': 'u', //(uni) - /u/ (like 'oo' in "moon")

    'პ': 'pʼ', //(pari) - /pʼ/ (ejective 'p' - no direct English equivalent. Similar to the 'p' in "spy" but with an ejective release.)
    'ფ': 'pʰ', //(pari) - /pʰ/ (aspirated 'p', like 'p' in "pan")
    'ბ': 'b', //(bani) - /b/ (like 'b' in "bed")
    'ვ': 'v', //(vini) - /v/ (like 'v' in "van")
    'მ': 'm', //(mani) - /m/ (like 'm' in "much")

    'ტ': 'tʼ', //(tari) - /tʼ/ (ejective 't' - no direct English equivalent. Similar to the 't' in "sty" but with an ejective release.)
    'თ': 'tʰ', //(tani) - /tʰ/ (aspirated 't', like 't' in "top")
    'დ': 'd', //(doni) - /d/ (like 'd' in "dog")
    'ნ': 'n', //(nari) - /n/ (like 'n' in "not")
    'ს': 's', //(sani) - /s/ (like 's' in "sue")
    'ზ': 'z', //(zeni) - /z/ (like 'z' in "zoo")
    'წ': 'tsʼ', //(tsili) - /tsʼ/ (ejective 'ts' - no direct English equivalent. Similar to 'ts' but with an ejective release.)
    'ც': 'tsʰ', //(tsani) - /tsʰ/ (aspirated 'ts' sound, like 'ts' in "cats")
    'ძ': 'dz', //(dzili) - /dz/ (like 'dz' in "pads")
    'ჯ': 'dʒ', //(jani) - /dʒ/ (like 'j' in "judge")
    'ჩ': 'tʃʰ', //(chini) - /tʃʰ/ (aspirated 'ch', like 'ch' in "choose")
    'ჭ': 'tʃʼ', //(chari) - /tʃʼ/ (ejective 'ch' - no direct English equivalent. Similar to 'ch' but with an ejective release.)
    'შ': 'ʃ', //(shini) - /ʃ/ (like 'sh' in "shoe")
    'ჟ': 'ʒ', //(zhani) - /ʒ/ (like 's' in "pleasure")
    'რ': 'r', //(rae) - /r/ (often a trilled or tapped 'r', similar to Spanish 'r')
    'ლ': 'l', //(lasi) - /l/ (like 'l' in "leaf")

    'კ': 'kʼ', //(kani) - /kʼ/ (ejective 'k' - no direct English equivalent. It's a 'k' sound made with a glottal stop, releasing air pressure from the throat.)
    'ქ': 'kʰ', //(kani) - /kʰ/ (aspirated 'k', like 'k' in "can")
    'გ': 'g', //(gani) - /ɡ/ (like 'g' in "go")
    'ღ': 'ɣ', //(ghani) - /ɣ/ (voiced velar fricative, like the 'g' in some German words, or a voiced version of the Scottish "loch" sound)
    'ხ': 'x', //(khani) - /x/ (voiceless velar fricative, like 'ch' in Scottish "loch" or German "Bach")

    'ყ': 'q’', //(qari) - /qʼ/ (ejective uvular stop - produced further back in the throat than 'k', with an ejective release. No English equivalent.)
    'ჰ': 'h', //(hae) - /h/ (like 'h' in "head")
  };
*/


function getWords(wrd, tl, sl) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      
      try{var wrd = this.responseXML.getElementById("content-summary").getElementsByTagName("strong")[0].innerText;}catch(e){alert(e);}
      //var wrd = this.responseText.split('"content-summary">')[1].split('<strong>')[1].split("</p>")[0].split("</strong>")[0];
      words[j] = wrd.toLowerCase().replace(/, /g, '<br/>');
      
      if (j<words.length-1) {
        j++;
        getWords(words[j], 'en', 'he');
      } else {
        document.querySelector('#test').innerHTML += "<table><tr><td colspan='" + words.length + "'>" + sentences[k] + "</td></tr><tr><td> " + txt.replace(/\s/g, "</td><td>") + " </td></tr><tr><td> " + words.join(' </td><td> ') + " </td></tr><tr><td> " + letters.join('').replace(/\s/g, "</td><td>") + " </td></tr></table>";
        loadTranslation(txt, ln, 'he');
      }
      
    }
  };
  xhttp.open("GET", "https://script.google.com/macros/s/AKfycbz5br4wnfSGtucWKwGQq1Tb07eshJez6uVaFatn4xJAc_rcrcA/exec?a=proxy&q=https://glosbe.com/"+sl+"/"+tl+"/" + encodeURIComponent(wrd), true);
  xhttp.responseType = "document";
  xhttp.overrideMimeType("text/html");
  xhttp.send();
}
//try{getWords("და", "en", "ka");}catch(e){alert(e);}
  
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
        getWord(words[j], 'en', 'iw');
      } else {
        document.querySelector('#test').innerHTML += "<p>" + sentences[k] + "<br/><ruby> " + txt + " <rt> " + words.join(' • ') + " <br/> " + letters.join('') + " </rt></ruby></p>";
        loadTranslation(txt, ln, 'iw');
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
        tl = "iw";
        loadTranslation(txt, tl, sl);
      } else if (tl == "iw" && sl == ln) {
        sl = "iw";
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
        getWords(words[j], 'en', 'iw');
        
      } else if (tl == ln && sl == "iw") {
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

