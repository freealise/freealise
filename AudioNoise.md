  
Would suggest to use a large foot-operated trackball mouse along with the pedal - this would let you control the sound in up to 3 dimensions, almost like a violin bow or voice. (I'd make a formant filter, even with consonants - just to learn C).  
  
https://github.com/AppGeo/web-audio-examples  
& piezoelement for 4th dimension; control sound location for movies  
  
waveshaper transfer function (x|y of trackball)  
convolver impulse response (y)  
upwards compressor-sustainer  
test pitch shifter  
  
It is usually easier to analyze systems using transfer functions as opposed to impulse responses. The transfer function is the Laplace transform of the impulse response. The Laplace transform of a system's output may be determined by the multiplication of the transfer function with the input's Laplace transform in the complex plane, also known as the frequency domain. An inverse Laplace transform of this result will yield the output in the time domain.

To determine an output directly in the time domain requires the convolution of the input with the impulse response. When the transfer function and the Laplace transform of the input are known, this convolution may be more complicated than the alternative of multiplying two functions in the frequency domain.

https://en.wikipedia.org/wiki/Impulse_response#Mathematical_considerations  