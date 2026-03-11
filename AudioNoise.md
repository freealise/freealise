  
// What should we do about silence? (c)
https://github.com/torvalds/AudioNoise/issues?q=is%3Aissue%20state%3Aopen%20author%3Afreealise  
  
make normal sample read function in util.h for the sustainer & convolver  
distortion.h -> 8-bit (remove LSB)  
arp with pitch shifter  
  
```
// convolver
 #include <stdio.h>

/**
 * https://www.falstad.com/dfilter/
 * 
 * Performs direct linear convolution of two signals.
 * @param x Input signal array
 * @param sig_len Length of the input signal
 * @param h Impulse response (kernel) array
 * @param ker_len Length of the impulse response
 * @param y Output signal array (must be size sig_len + ker_len - 1)
 */

void convolve(double *x, int sig_len, double *h, int ker_len, double *y) {
    int n, k;
    int out_len = sig_len + ker_len - 1;

    // Initialize output array to zero
    for (n = 0; n < out_len; n++) {
        y[n] = 0;
    }

    // Direct convolution nested loops
    for (n = 0; n < out_len; n++) {
        for (k = 0; k < ker_len; k++) {
            // Only multiply if the shifted input index is within valid bounds
            if (n - k >= 0 && n - k < sig_len) {
                y[n] += h[k] * x[n - k];
            }
        }
    }
}

int main() {
    double x[] = {1, 2, 3, 4}; // Example input
    double h[] = {1, 1, 1};    // Example 3-point moving average filter
    int sig_len = 4;
    int ker_len = 3;
    int out_len = sig_len + ker_len - 1;
    double y[out_len];

    convolve(x, sig_len, h, ker_len, y);

    printf("Output signal: ");
    for (int i = 0; i < out_len; i++) {
        printf("%.2f ", y[i]);
    }
    return 0;
}
```
  
  
(I'd make a formant filter, even with consonants  
 y: f2, x: f1, z: sibilance or sonority)  
  
https://github.com/AppGeo/web-audio-examples  
& piezoelement for 4th dimension; control sound location for movies  