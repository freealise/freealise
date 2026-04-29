how to (~instructables) in photos and screenshots / screencasts  
  
fisheye lenses on phone cameras for 360 view (https://en.wikipedia.org/wiki/Secondary_lens), to equi with ffmpeg  
  
projector with 3d prism instead of screen as screens are small and not bright enough (https://upload.wikimedia.org/wikipedia/commons/e/e2/Pyramid_holographic_3D_holographic_projection_phone_projector_3D_holographic_projection_3D_mobile_phone_naked_eye_3D_pyramid.jpg, https://commons.wikimedia.org/wiki/File:Anamorphose-miroir_01.JPG)  
or plastic glasses with wireframe (transparent mat, black striped plastic, or prismatic top/bottom or L/R - https://en.wikipedia.org/wiki/KMQ_viewer)  
  
//3d tiles (https://www.google.com/intl/en_uk/earth/studio/)  
//https://www.google.com/streetview/how-it-works/  
//upload video/subs to archive.org for transcoding (https://archive.org/details/download_20240209_0047)  
//subtitles with timestamps: use YouTube's Automatic Captions  
  
//make dummies from wire (or bamboo ?) with crochet / punch needle / tambour hook needle / kanban needle, and foil (smoothed with nail file or sandpaper and painted in CMYK with white base and added soap), photograph and recolor (morph face)  
wet paper or cardboard models from depth map thumbnails with large fov for shadows  
(https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CCBWqYeljZnrtlJzJQaEGw&cb_client=maps_sv.tactile.gps&w=8192&h=4096&yaw=208.25&pitch=0&thumbfov=165)  
pixelize, posterize and dither to display as banner  

modular transparent melting beads pinboard or corkboard+pins for aligning wire to proportions from cross-contour drawings or dimensions.com  
(https://www.google.com/search?q=how+to+weave, https://www.google.com/search?q=melting+bead+board+set+transparent, https://www.google.com/search?q=small+pegboard, https://www.google.com/search?q=pinboard)  
melt beeswax beads or glue paper-mache (or cellulose fiber) in layers as voxels (https://www.google.com/search?q=white+sealing+beeswax+beads, https://www.google.com/search?q=white+candle+beeswax)  
transparent velcro (hook-and-loop fastener, https://www.hookandloop.com/) hooks fabric sheet or silicone scrubber as grid for wire  
kneaded eraser for stretchable face  
// carve beeswax models with heated pointed knife ?  
// 3d pen: thin natural candle as kernel in metal pen with changeable output diameter, wrapped in isolation for holding and heated electrically by small current with variable intensity  
- automatic pencil with wire coil instead of kernel (straightens wire and measures length, can be pulled on)  
// 3d scanner: magenta dot pattern on flashlight, optical flow or size of visible dots for depth  
  
crossfade tracks in audacity among 5.1 channel speakers according to distance of source from them  
tetrahedron in sphere in cube, 4 tracks aligned as cube map with trigonometric crossfades (merge 2 offscreen back channels to 1)  
  
on violin cut the bass for noise reduction  
to separate recording into tracks: mute any part (not just the center) by proportionally adjusting the volume of subtracted channel  
  
buy violin shoulder rest; several harmonics on one string as formants ?  
    formant filtering can be done in DAW with equalizer / filters connected to midi control board  
  
for denoising average several frames, use median filter  
combine animation with audioplays  
  
mat from thick fishing line for stereo screen (https://commons.wikimedia.org/wiki/File:Parallax_barrier_vs_lenticular_screen.svg), or blue and yellow glasses with plastic lenses (https://developers.google.com/cardboard/manufacturers)  
  
the only comics that the majority of adults tolerate are satirical (abstract comics - gets into social issues right away)  
Inoffensive caricature: photorealistic and providing a solution to exposed problem, about ideas and not people, parody as compliment  
  
depth = blur (focus) or color fade to fog - how is done in photography ?  
opposite of tilt shift = forced perspective / focus stacking  
  
sync rhythm track and video in gif with =frame rate (https://stackoverflow.com/questions/11285065/limiting-framerate-in-three-js-to-increase-performance-requestanimationframe) - is variable in anime (min 8fps)  
  
- videos with geometrizer / median blur and self / TA acting (like plays in language classes);  
              drone spirals around prior to filming by same path to estimate depth -> depth of subject  
              semantic segmentation for subject highlighting   (https://github.com/freealise/tfjs-models/tree/master/deeplab); subtitles, export to video; postprocessing (fxaa / dof)  
  
- notes as cartoons from photos of wireframe (crosscontour with skeleton at one side) + filed foil wrapper (paper, plastic wrapper, wire fabric) + fax paper / wire landscape  
              and painted with oil / +soap (skybox color on model); dimensions.com prototypes (svg pictograms)  
              wire skeleton or rotatable outline (+face) / foil origami (+head / hair / face) or wrapper  
              depth map for focus and bokeh: video frames with different focus from almost the same point and interpolate to estimate by motion (opencv dense optical flow)  
              interpolate timepoints and motion blur moving subjects  
              shadows only on lit background (subtract overcast pano)  
  
- antarctic interface as InF with multidimensional navigation (vector outlines with text from dimensions.com with original pano background)  
              semantic segmentation -> image map for clickable areas  
              google ar panorama timepoints (google api) + ai frame-interpolation (https://replicate.com/google-research/frame-interpolation, https://huggingface.co/spaces/freealise/video_frame_interpolation); skybox out of google (overcast pano to remove shadows, select timepoints for time of day / weather), use mono depth map for custom weather skyline (https://spite.github.io/PanomNom.js/examples/basic/sv-depth.html) and opencv depth map for focus; animation from google earth; draw over the panorama then displace vertices by depth map and show parallax  
    model from dimensions.com / google streets (earth) / flickr (map) / 3d warehouse (sketchup) / rental property  
      static image api (https://developers.google.com/maps/documentation/streetview/request-streetview)  