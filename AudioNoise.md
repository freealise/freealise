B"H  
it is part of LF for events  
  
code documentation as ASCII pics (everyman you-character)  
  
"I have an idea, I just don't know what it is!"  
  
/*
In particular, don't feel like it would be impolite to tell me I'm incompetent and doing stupid things. I absolutely know I'm not competent and would love to hear any criticism. Some of the best teaching moments have been when I haven't understood something, and somebody piped up to tell me I should do Xyz.
*/
  
// What should we do about silence? (c)
https://github.com/torvalds/AudioNoise/issues?q=is%3Aissue%20state%3Aopen%20author%3Afreealise  
  
- threshold for sustainer; realtime pot control for vibrato & tremolo  
- distortion.h -> 8-bit (remove LSB, reduce sample rate /1-6)  
- reverb can be algorithmic with set of delays separated by not one sample as in a convolver but several (downsampled impulse response with randomly varying delay times and volumes with gaussian probability to scatter phase and avoid comb filtering)  
  
! whistle through peaking+notch filter controlled by pitch detector (~pll) to lower octave (for bass) or 10 comb filters with touchscreen (more can be set in advance); multiply by filtered noise (for drums and percussion)  
  
frequency, phase and impulse response in visualizer  
http://www.falstad.com/dfilter/  
  
(I'd make a formant filter, even with consonants  
 y: f2, x: f1, z: sibilance or sonority  
 interface is touchscreen not mouse)  
  
https://github.com/AppGeo/web-audio-examples  
& piezoelement for 4th dimension; control sound location for movies  
  
interface for drawing and semi-realtime playback by pointerup  
https://arss.sourceforge.net/code.shtml  