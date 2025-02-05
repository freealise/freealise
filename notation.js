var iv = setInterval(function() {

if (document.getElementById("canvas").getContext("2d")) {
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const newCanvas = document.getElementById("newCanvas");
const newCtx = newCanvas.getContext("2d");
newCtx.rotate(90 * Math.PI / 180);
newCtx.scale(1, -1);

var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
for (var i=0; i<imgData.data.length; i++) {
  imgData.data[i*4] = 255;
  imgData.data[i*4+1] = 255;
  imgData.data[i*4+2] = 255;
  imgData.data[i*4+3] = 255;
}
ctx.putImageData(imgData, 0, 0);
newCtx.drawImage(canvas, 0, 0);

function copy(id) {
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (!erase.checked) {
    imgData.data[id*4] = 0;
    imgData.data[id*4+1] = 0;
    imgData.data[id*4+2] = 0;
    imgData.data[id*4+3] = 255;
  } else {
    imgData.data[id*4] = 255;
    imgData.data[id*4+1] = 255;
    imgData.data[id*4+2] = 255;
    imgData.data[id*4+3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  newCtx.drawImage(canvas, 0, 0);
}

var txt = document.getElementById("txt");
var erase = document.getElementById("erase");
var focus = document.getElementById("focus");

var keys = ' !QAZ1qaz¹٩ᵃᶻ @WSX2wsx²ʷˢˣ #EDC3edc³ᵉᵈᶜ $RFV4rfv⁴ʳᶠᵛ %TGB5tgb⁵ᵗᵍᵇ ^YHN6yhn⁶ʸʰⁿ &UJM7ujm⁷ᵘʲᵐ *IK<8ik,⁸ⁱᵏ⁺ (OL>9ol.⁹ᵒˡ⁻ )P:?0p;/⁰ᵖ⁼~';

/*
 ¹٩ᵃᶻ ²ʷˢˣ ³ᵉᵈᶜ ⁴ʳᶠᵛ ⁵ᵗᵍᵇ ⁶ʸʰⁿ ⁷ᵘʲᵐ ⁸ⁱᵏ⁺ ⁹ᵒˡ⁻ ⁰ᵖ⁼~

ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡ~ʏᴢ
ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖ𐞥ʳˢᵗᵘᵛʷˣʸᶻ
*/

var cs = "&#805;";
var cr = "&#827;";
var o = "&#809;";
var l = "&#851;";
var offset = 0;
var init = "";
var capsKey = false;
var t, c;
var md = false;

for (var i=0; i<10; i++) {
  init += " ";
  for (var j=0; j<12; j++) {
    init += o;
  }
}
txt.innerHTML = init;

txt.onkeyup = function(e) {
  e.preventDefault();
  if (e.key.length == 1 && e.key != " ") {
    txt.innerHTML = t.replace(/_/g, "\n\n ");
  }
  txt.setSelectionRange(offset,offset);
}

txt.onkeydown = function(e) {
  e.preventDefault();
  document.getElementsByTagName("h1")[0].innerText = e.key;

  if (e.key.length == 1 && e.key != " ") {
    t = txt.innerHTML.replace(/\n\n\s/g, "_");
    var indx = keys.indexOf(e.key);

    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
      if (!capsKey && !e.shiftKey) {
        indx += 4;
      } else {
        indx += 8;
      }
    }
    if (t.charAt(offset+indx) == String.fromCharCode(0x0329)) {
      c = l;
    } else {
      c = o;
    }
    t = t.substr(0, offset+indx) + c + t.substr(offset+indx+1, t.length);
    copy(offset+indx);

  } else if (e.key == "ArrowRight" || e.key == " ") {
    offset += 13 * 10;

    if (offset >= txt.innerHTML.length) {
      if (txt.innerHTML.length < 13 * 10 * 12) {
        txt.innerHTML += init;
      } else {
        offset -= 13 * 10;
      }
    }

  } else if (e.key == "ArrowLeft" || e.key == "Backspace") {
    offset -= 13 * 10;

    if (offset < 0) {
      if (txt.innerHTML.length < 13 * 10 * 12) {
        txt.innerHTML = init + txt.innerHTML;
      }
      offset += 13 * 10;
    }

  } else if (e.key == "CapsLock") {
    capsKey = !capsKey;

  } else if (e.key == "Enter") {
    t = txt.innerHTML;
    var indx = keys.indexOf(e.key);

    var pos = t.substr(0, offset+indx+13).lastIndexOf(" ");
    t = t.substr(0, pos) + "\n\n" + t.substr(pos, t.length);
    txt.innerHTML = t;
  }
}


txt.onpointerdown = function(e) {
  e.preventDefault();
  e.target.focus();
  md = true;
}


txt.onpointerup = function(e) {
  e.preventDefault();
  if (!focus.checked) {
    e.target.blur();
  }
  md = false;
  txt.innerHTML = txt.innerHTML.replace(String.fromCharCode(0x033B), String.fromCharCode(0x0353)).replace(String.fromCharCode(0x0325), String.fromCharCode(0x0329));
}

txt.onpointerout = txt.onpointerup;
txt.onpointerleave = txt.onpointerup;
txt.onpointercancel = txt.onpointerup;


txt.onpointermove = function(e) {
  e.preventDefault();
  if (md === true) {
    t = txt.innerHTML.replace(/\n\n\s/g, "_").replace(String.fromCharCode(0x033B), String.fromCharCode(0x0353)).replace(String.fromCharCode(0x0325), String.fromCharCode(0x0329));
    var x = Math.round((e.clientX - e.target.getBoundingClientRect().x) / 6);
    var y = Math.round((e.clientY - e.target.getBoundingClientRect().y - 12) / 6);

    var id = parseInt(13 * x - 12) + parseInt(y);

    if (id < 0 || id >= t.length || t.charAt(id) == " " || t.charAt(id) == "_" || t.charAt(id) == "\n") {
      return;

    } else if (!erase.checked && t.charAt(id) == String.fromCharCode(0x0329)) {
      c = cr;

    } else if (erase.checked && t.charAt(id) == String.fromCharCode(0x0353)) {
      c = cs;

    }
    t = t.substr(0, id) + c + t.substr(id+1, t.length);
    txt.innerHTML = t.replace(/_/g, "\n\n ");
    copy(id);
  }
}

clearInterval(iv);
}
//console.log(String.fromCharCode(0x0329));
//console.log(String.fromCodePoint(0x0329));
}, 40);
