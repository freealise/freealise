[pose-detection](https://github.com/freealise/tfjs-models/tree/master/pose-detection)  
[face-landmarks-detection](https://github.com/freealise/tfjs-models/tree/master/face-landmarks-detection)  
[hand-pose-detection](https://github.com/freealise/tfjs-models/tree/master/hand-pose-detection)  
[opencv](https://docs.opencv.org/4.x/d1/d0d/tutorial_js_pose_estimation.html)  
mocap: hand detection on video for chord transcription; pose and face detection for music, remote acting or rtc  
(sparse optical flow to track hair and clothes -  
https://docs.opencv.org/4.x/dc/d0d/tutorial_py_features_harris.html,  
https://docs.opencv.org/4.x/d4/d8c/tutorial_py_shi_tomasi.html)  
common midi / web audio controls  
track nail polish as guitar feedback ? (https://docs.opencv.org/4.x/df/d9d/tutorial_py_colorspaces.html)  
[opencv nodejs/java](https://docs.opencv.org/4.x/dc/de6/tutorial_js_nodejs.html)  
  
([MindAR.js](https://github.com/hiukim/mind-ar-js))  
([AR.js](https://github.com/AR-js-org/AR.js))  
[jsartoolkit5](https://github.com/artoolkitx/jsartoolkit5)  
  
fisheye lenses on phone cameras for 360 view ?
  
projector with 3d prism instead of screen as screens are small and not bright enough (https://upload.wikimedia.org/wikipedia/commons/e/e2/Pyramid_holographic_3D_holographic_projection_phone_projector_3D_holographic_projection_3D_mobile_phone_naked_eye_3D_pyramid.jpg)  
or plastic glasses with wireframe (transparent mat, black striped plastic, blue/yellow L/R, or prismatic top/bottom (why not L/R ?) https://en.wikipedia.org/wiki/KMQ_viewer)  
or view stereograms on e-ink display, or very slow L/R sinusoidal movement for parallax  
  
scene with color and shadows (filmed or drawn cubemap + layers / transparency; apply displacementmap from ascii or dot symbols x2 (0-65535, 16 colors) to cube
https://github.com/ssatguru/BabylonJS-EditControl, 
https://github.com/ssatguru/BabylonJS-MeshEditor, 
https://doc.babylonjs.com/toolsAndResources/assetLibraries/postProcessLibrary/asciiArtPP for depth, 
https://doc.babylonjs.com/features/featuresDeepDive/materials/using/parallaxMapping for display ?) -> 3d video  
animation by trilinear interpolation, foil -> mocap (+for auto quality feedback ?)  
3d tiles (https://developers.google.com/maps/documentation/tile/create-renderer)  

//https://www.google.com/streetview/how-it-works/  
//upload video/subs to archive.org for transcoding (https://archive.org/details/download_20240209_0047)  
  
gemini: prompt to give example sentences or story with words removed (~mad libs, zero temperature)  
cluster consonants by SSP over vowels 2nd formant and base pitch (stress)  
shuffled flashcards combining into sentences (for formants/phonemes as by keyboard rows and columns, according to frequency to arrange by SSP; for words if facing up are a poetry set - practical, if down are solitaire / poker game - educational)  
word tree / net from dict: first word in description of same pos is parent, synonyms if parents of each other (or similar descriptions)  
  
code is prose (doesn't have to be IF, but readable code formatted into text)  
  
notation: rotate keyboard 90deg; show as is or png for spectrograms / tabs with vowel symbols (https://en.wikipedia.org/wiki/Combining_Diacritical_Marks)  
vectorizer: use paperjs instead of google charts (https://w00dn.github.io/papergrapher/)  

docs: get commentary (preferably written first) out of program  
in order of not succession but execution, to wiki with toc and markdown  
  
//foil is covered by food-grade wax from cheese;  
make wet paper models from depth maps with texture  
drawn from pano thumbnails with large fov stitched together,  
embossed with wire / foil / wax and painted in CMYK  
(https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=CCBWqYeljZnrtlJzJQaEGw&cb_client=maps_sv.tactile.gps&w=8192&h=4096&yaw=208.25&pitch=0&thumbfov=165)  
  
//draw cross-contour for storyboards; draw objects on pano and find depth map  
//scanned foil (photogrammetry) / optical flow or stereo depth estimator (+in realtime)  
  (https://docs.opencv.org/4.x/d9/db7/tutorial_py_table_of_contents_calib3d.html, 
   https://docs.opencv.org/4.x/d4/dee/tutorial_optical_flow.html,
   https://docs.opencv.org/3.4/d5/dc4/tutorial_adding_images.html)  
//detect spectrograms (https://docs.opencv.org/4.x/d2/d64/tutorial_table_of_content_objdetect.html)  
  
3d scanner: optical flow from phone camera (distance from subject with several cams) + gyroscope  
  
https://cyos.babylonjs.com/  
https://sandbox.babylonjs.com/  
https://playground.babylonjs.com/  
https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene  
