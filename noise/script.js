class WhiteNoise extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach((channel) => {
      var lastOut = 0;
      var white = 0;
      for (let i = 0; i < channel.length; i++) {
        white = Math.random() * 2 - 1;
        channel[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = channel[i];
        channel[i] *= 3.5; // (roughly) compensate for gain
      }
    });
    return true;
  }
}

registerProcessor("white-noise", WhiteNoise);
