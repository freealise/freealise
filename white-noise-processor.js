// white-noise-processor.js
class WhiteNoiseProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors () {
    return [{
      name: 'customGain',
      defaultValue: 1,
      minValue: 0,
      maxValue: 1,
      automationRate: 'a-rate'
    },
    {
      name: 'customFreq',
      defaultValue: 128,
      minValue: 64,
      maxValue: 512,
      automationRate: 'a-rate'
    }];
  }
  
  constructor() {
    super();
    this.indx = 0;
  }

  process (inputs, outputs, parameters) {
    const output = outputs[0];
    output.forEach(channel => {
      for (let i = 0; i < channel.length; i++) {
        //channel[i] = (Math.random() * 2 - 1) *
        //  (parameters['customGain'].length > 1 ? parameters['customGain'][i] : parameters['customGain'][0])
        // note: a parameter contains an array of 128 values (one value for each of 128 samples),
        // however it may contain a single value which is to be used for all 128 samples
        // if no automation is scheduled for the moment.
        channel[i] = 0;
        for (var j=1; j<=48; j++) {
          channel[i] += Math.sin( (this.indx+i) * Math.PI / 48000 * j *
            (parameters['customFreq'].length > 1 ? parameters['customFreq'][i] : parameters['customFreq'][0])
          ) / j / 4;
        }
      }
      this.indx += 128;
    });
    return true;
  }
}

registerProcessor('white-noise-processor', WhiteNoiseProcessor);
