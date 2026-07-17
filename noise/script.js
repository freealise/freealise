document.getElementById('test').addEventListener('click', function(e) {

const audioCtx = new AudioContext();
console.log(audioCtx.sampleRate);

const myArrayBuffer = audioCtx.createBuffer(
  2,
  audioCtx.sampleRate * 5,
  audioCtx.sampleRate,
);
var input = 0.0;
var output = 0.0;


// https://www.embeddedrelated.com/showarticle/779.php
// y += alpha * (x-y);

// https://beammyselfintothefuture.wordpress.com/2015/02/16/simple-c-code-for-resonant-lpf-hpf-filters-and-high-low-shelving-eqs/

// https://www.earlevel.com/scripts/widgets/20210825/biquads3.js
// https://www.earlevel.com/main/2012/11/26/biquad-c-source-code/
// out = in * a0 + z1;
// z1 = in * a1 - b1 * out;


var Fc = 1000;
var nowBuffering;
var old = 0.0;
var old_ = 0.0;

// 1z highpass
var withoutTreble = 0.0;
var _a0 = 1 / (0.999 + 1);

// 1z lowpass
var a = 1 / (1 / 0.001 + 1);


// 1p highpass
var b1 = -0.9999;
var a0 = 1.0 + b1;
b1 = -b1;
var a1 = 0;

// 1p lowpass
var b1_ = 0.9999;
var a0_ = 1.0 - b1_;
b1_ = -b1_;
var a1_ = 0;


for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
  nowBuffering = myArrayBuffer.getChannelData(channel);

  for (let i = 0; i < myArrayBuffer.length; i++) {
    
    input = Math.random() * 2.0 - 1;

    // one-zero lowpass
    //var input_ = input * a + old;
    //old = input * a;

    // one-zero highpass
    //var out = input_ * _a0 + old_;
    //old_ = -_a0 * input_;


    // one-pole highpass
    var input_ = input * a0 + old;
    old = input * a1 - b1 * input_;

    // one-pole lowpass
    var out = input * a0_ + old_;
    old_ = input * a1_ - b1_ * out;

    nowBuffering[i] = input_ + out;


    // one-zero highpass
    //withoutTreble += (input_ - withoutTreble) * 0.99; // Number controls freq
    //nowBuffering[i] = input_ - withoutTreble;

  }
}


const source = audioCtx.createBufferSource();
source.buffer = myArrayBuffer;
source.loop = true;


const analyserNode = audioCtx.createAnalyser();
analyserNode.fftSize = 512;
const bufferLength = analyserNode.frequencyBinCount;
const dataArray = new Float32Array(bufferLength);


const gain = audioCtx.createGain();
gain.gain.setValueAtTime(1.0, audioCtx.currentTime);
source.connect(gain);
gain.connect(analyserNode);
gain.connect(audioCtx.destination);


const canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
const canvasCtx = canvas.getContext("2d");
canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

function draw() {
  requestAnimationFrame(draw);

  analyserNode.getFloatFrequencyData(dataArray);

  canvasCtx.fillStyle = "rgb(0 0 0)";
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength);
  let posX = 0;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = Math.log2(dataArray[i] + 128) * 16;
    canvasCtx.fillStyle = `rgb(${Math.floor(barHeight + 100)} 50 50)`;
    canvasCtx.fillRect(
      posX,
      canvas.height - barHeight,
      barWidth,
      barHeight,
    );
    posX += barWidth;
  }
}

source.start();
draw();

});


