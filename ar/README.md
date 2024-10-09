[pose-detection](https://github.com/freealise/tfjs-models/tree/master/pose-detection)  
[face-landmarks-detection](https://github.com/freealise/tfjs-models/tree/master/face-landmarks-detection)  
[hand-pose-detection](https://github.com/freealise/tfjs-models/tree/master/hand-pose-detection)  
[opencv](https://docs.opencv.org/4.x/d1/d0d/tutorial_js_pose_estimation.html)  
mocap: hand detection on video for chord transcription; pose and face detection for music, remote acting or rtc  
(sparse optical flow to track hair and clothes -  
https://docs.opencv.org/4.x/dc/d0d/tutorial_py_features_harris.html,  
https://docs.opencv.org/4.x/d4/d8c/tutorial_py_shi_tomasi.html)  
common midi / web audio controls  
[opencv nodejs/java](https://docs.opencv.org/4.x/dc/de6/tutorial_js_nodejs.html)  
  
([MindAR.js](https://github.com/hiukim/mind-ar-js))  
([AR.js](https://github.com/AR-js-org/AR.js))  
[jsartoolkit5](https://github.com/artoolkitx/jsartoolkit5)   

scene with color and shadows (filmed or drawn cubemap + layers / transparency; 
https://github.com/ssatguru/BabylonJS-MeshEditor, 
https://doc.babylonjs.com/toolsAndResources/assetLibraries/postProcessLibrary/asciiArtPP for depth, 
https://doc.babylonjs.com/features/featuresDeepDive/materials/using/parallaxMapping for display ?) -> 3d video  
opencv stereo depth estimator for realtime ?  
foil -> mocap for auto quality feedback ?

//https://www.google.com/streetview/how-it-works/  
//upload video/subs to archive.org for transcoding (https://archive.org/details/download_20240209_0047)  
  
//remove blur, gizmo, kbrd; audio upload  
//find dense optical flow of video, >0 is foreground (+subtract background from complete scene for stationery objects)  
  load mp4 with black/white as transparent color replaced in video content by 1s/254s so it never occurs there  
//depth anything 2; gr custom component ? instance/panoptic segmentation for inpainting ?  
//color foil by hand and use hs(l) color from combined changed objects for paper in grayscale filmed video and remove background, keeping shadows  
//foil is covered by food-grade wax from cheese  
  
//draw objects on pano and find depth map  
//scanned foil (photogrammetry) / depth estimator  

transparent video: original video -> gif mask with white replaced with transparency and all else with 1 color  
combine with original by ffmpeg (https://stackoverflow.com/questions/36467594/ffmpeg-add-alpha-channel-to-a-video-using-a-png-mask)  
8*3 opacity levels are shades of white  
  
https://cyos.babylonjs.com/  
https://sandbox.babylonjs.com/  
https://playground.babylonjs.com/  
https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene  
